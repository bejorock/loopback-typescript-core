import 'reflect-metadata'
import loopback from 'loopback'
import compile from 'loopback-boot/lib/compiler'
import execute from 'loopback-boot/lib/executor'
import { ReactiveApp } from '../reactive.app'
import { Container, injectable, inject } from 'inversify';
import { Registry } from './registry'
import * as _ from 'lodash'
import { BaseDao } from '../models/base.model';
import { Router } from '../router/base.router';
import { Middleware } from '../middleware/base.middleware';

@injectable()
export default class Module
{
	@inject(ReactiveApp)
	protected ctx:ReactiveApp
	
	private container:Container

	configure(parentContainer?:Container) {
		// start up models
		// this.ctx = new ReactiveApp(_ctx)

		// setup container
		this.container = new Container({ autoBindInjectable: true })
		this.container.parent = parentContainer
		//this.container.bind<ReactiveApp>(ReactiveApp).toConstantValue(this.ctx)
		
		// register child containers
		this.loadAll(this)
	}

	loadModel(modelClass) {
		let methods = Registry.getProperty(modelClass.name, 'methods') 
		//console.log(modelClass.name)
		//console.log(methods)
		let definition = Registry.getProperty(modelClass.name, 'definition') //modelClass.getModelDefinition()
		let properties = this.loadProperties(modelClass) //Registry.getProperty(modelClass.name, 'properties') //modelClass.properties
		let hidden = this.loadHidden(modelClass)
		let relations = this.loadRelations(modelClass)
		
		let ds = this.ctx.getDataSource(methods.getDataSourceName())

		let regex = /(\w+)(Model?)/
		let modelName = definition.name
		let daoName = definition.name.replace(regex, '$1Dao')
		
		let modelSeed = ds.createModel(modelName, properties, Object.assign(definition, { hidden, relations }))
		let daoSeed = ds.createModel(daoName, properties, Object.assign(definition, { hidden, relations }))

		// register dao seed
		//this.container.bind(`__Seed__${daoName}`).toConstantValue(daoSeed)

		// apply mixins
		this.applyMixin(modelClass, modelSeed)

		let DaoClass = methods.getDaoClass()
		let dao:BaseDao = this.container.resolve(DaoClass)
		dao.dao = daoSeed
		dao.container = this.container
		dao.onInit()
		// inherit model class
		//util.inherits(dao, modelSeed)

		// load remote methods
		this.loadStaticRemoteMethod(DaoClass, modelSeed)
		this.loadProtoRemoteMethod(modelClass, modelSeed, dao)

		// load remote hooks
		this.loadBeforeRemoteHook(DaoClass, modelSeed)
		this.loadBeforeRemoteHook(modelClass, modelSeed)
		this.loadAfterRemoteHook(DaoClass, modelSeed)
		this.loadAfterRemoteHook(modelClass, modelSeed)

		// load operation hooks
		this.loadObserver(DaoClass, daoSeed)
		this.loadObserver(modelClass, daoSeed)

		// register model
		//this.ctx.registerModel(modelSeed, {public: methods.isPublish(), dataSource: methods.getDataSourceName()})
		this.ctx.registerModel(dao.compile(modelSeed), {public: methods.isPublish(), dataSource: methods.getDataSourceName()})
		//class Buf extends modelSeed {}

		//this.ctx.registerModel(Buf, {public: methods.isPublish(), dataSource: methods.getDataSourceName()})
		
		this.container.bind(DaoClass).toConstantValue(dao)
	}

	loadProperties(modelClass) {
		let properties = Registry.getProperty(modelClass.name, 'properties')

		let baseClass = Object.getPrototypeOf(modelClass)
		if(!_.isEmpty(baseClass.name)) return Object.assign({}, properties, this.loadProperties(baseClass))
		return properties
	}

	loadHidden(modelClass) {
		let hidden = Registry.getProperty(modelClass.name, 'hidden')

		let baseClass = Object.getPrototypeOf(modelClass)
		if(!_.isEmpty(baseClass.name)) return _.uniq(_.concat(hidden, this.loadHidden(baseClass)))
		return _.uniq(hidden)
	}

	loadRelations(modelClass) {
		let relations = Registry.getProperty(modelClass.name, 'relations')

		let baseClass = Object.getPrototypeOf(modelClass)
		if(!_.isEmpty(baseClass.name)) return Object.assign({}, relations, this.loadRelations(baseClass))
		return relations
	}

	loadStaticRemoteMethod(daoClass, modelSeed) {
		let remotes = Registry.getProperty(daoClass.name, 'remotes');  //daoClass.remotes
		
		for(let key in remotes) {
			let options = remotes[key]
			// append method to seed
			//modelSeed[key] = daoClass.prototype[key]
			modelSeed.remoteMethod(key, options)
		}

		// check if has inheritance
		let baseClass = Object.getPrototypeOf(daoClass)
		if(!_.isEmpty(baseClass.name)) this.loadStaticRemoteMethod(baseClass, modelSeed)
	}

	loadProtoRemoteMethod(modelClass, modelSeed, dao:BaseDao) {
		let remotes = Registry.getProperty(modelClass.name, 'remotes')

		for(let key in remotes) {
			let options = remotes[key]
			// append method to seed
			//modelSeed.prototype[key] = modelClass.prototype[key]
			modelSeed.prototype[key] = function(args) {
				//let self = new modelClass(this, daoSeed)
				let self = dao.newInstance(this)
				self.id = this.id
				return modelClass.prototype[key].apply(self, arguments)
			}
			delete options['isStatic']
			modelSeed.remoteMethod(`prototype.${key}`, options)
		}

		let baseClass = Object.getPrototypeOf(modelClass)
		if(!_.isEmpty(baseClass.name)) this.loadProtoRemoteMethod(baseClass, modelSeed, dao)
	}

	loadBeforeRemoteHook(ctxClass, modelSeed) {
		let hooks = Registry.getProperty(ctxClass.name, 'beforeRemoteHooks') //ctxClass.beforeRemoteHooks

		for(let key in hooks) {
			modelSeed.beforeRemote(key, ctxClass.prototype[hooks[key]])
		}
	}

	loadAfterRemoteHook(ctxClass, modelSeed) {
		let hooks = Registry.getProperty(ctxClass.name, 'afterRemoteHooks') //ctxClass.afterRemoteHooks

		for(let key in hooks) {
			modelSeed.afterRemote(key, ctxClass.prototype[hooks[key]])
		}
	}

	loadObserver(ctxClass, modelSeed) {
		let hooks = Registry.getProperty(ctxClass.name, 'observer') //ctxClass.observer

		for(let key in hooks) {
			modelSeed.afterRemote(key, ctxClass.prototype[hooks[key]])
		}
	}

	loadMiddleware(middlewareClass) {
		this.container.bind(middlewareClass).to(middlewareClass).inSingletonScope()
		let middleware:Middleware = this.container.get(middlewareClass)
		
		if(middleware.protocol) {
			this.ctx.registerPath(middleware.protocol, middleware.path, function(args) {
				return middleware.onRequest.apply(middleware, arguments)
			})
		} else {
			this.ctx.registerMiddleware(middleware.phase, function(args) {
				return middleware.onRequest.apply(middleware, arguments)
			})
		}
	}

	loadRouter(routerClass) {
		let meta = Registry.getProperty(routerClass.name, 'meta')
		
		//this.container.bind(routerClass).to(routerClass).inSingletonScope()
		let router:Router = this.container.resolve(routerClass)
		router.base = meta.base
		router.routes = meta.routes

		router.configure()
		//this.container.get(routerClass)

		this.ctx.registerRouter(router.base, router.onRoute)
	}

	loadAll(m:any) {
		let meta = Registry.getProperty(m.constructor.name, 'meta') 

		// bind declaration
		meta.declare.forEach(targetClass => this.container.bind(targetClass).toSelf().inSingletonScope());

		// setup models
		meta.models.forEach(modelClass => this.loadModel(modelClass));

		// setup middleware
		meta.middleware.forEach(middlewareClass => this.loadMiddleware(middlewareClass))

		// setup routers
		meta.routers.forEach(routerClass => this.loadRouter(routerClass))

		// setup child modules
		meta.imports.forEach(i => {
			let tmp:Module = this.container.resolve(i); //new i(this._ctx)
			tmp.configure(this.container)
			//tmp.getContainer().parent = this.container
			this.loadAll(tmp)
		});
	}

	applyMixin(modelClass, seed) {
		let methods = Registry.getProperty(modelClass.name, 'methods') 
		let mixins = methods.getMixins()
		mixins.forEach(mixin => {
			let code
			let options
			if(typeof mixin === 'string')
				code = require(mixin)
			else if(typeof mixin === 'function')
				code = mixin
			else {
				if(typeof mixin.source === 'string')
					code = require(mixin)
				else if(typeof mixin === 'function')
					code = mixin
				else
					throw new Error('unknown mixin format')

				options = mixin.options
			}

			code(seed, options)
		});
	}

	getContainer():Container { return this.container }

	getContext():ReactiveApp { return this.ctx }

	static async boot<T extends Module>(rootModule: new (ctx) => T, config, loopbackApp?:any) {
		let app:any
		if(loopbackApp)
			app = loopbackApp
		else
			app = loopback()

		// boot models
		if(typeof config === 'string')
    	config = {appRootDir: config}

		// backwards compatibility with loopback's app.boot
		config.env = config.env || app.get('env');

		let instructions = compile(config);
		
		await new Promise((resolve, reject) => {
			execute(app, instructions, () => resolve());
		})

		// create root container
		let rootContainer = new Container({ autoBindInjectable: true })
		rootContainer.bind<ReactiveApp>(ReactiveApp).toConstantValue(new ReactiveApp(app))

		let module:Module = rootContainer.resolve(rootModule)
		module.configure(rootContainer)
		//module.getContainer().parent = rootContainer

		return module
	}
}
import 'reflect-metadata'
import loopback from 'loopback'
import express from 'express'
import compile from 'loopback-boot/lib/compiler'
import execute from 'loopback-boot/lib/executor'
import { ReactiveApp } from '../reactive.app'
import { Container, injectable, inject } from 'inversify';
import { Registry } from './registry'
import * as _ from 'lodash'
import { BaseDao } from '../models/base.model';
import { Router, BaseRouter } from '../router/base.router';
import { Middleware } from '../middleware/base.middleware';
import { ErrorMiddleware } from '../middleware/error.middleware';
import * as Bunyan from 'bunyan';
import { Writable } from 'stream';
import dateFormat from 'dateformat';
import colors from 'colors/safe';
import yargs = require('yargs');
import normalizeUrl = require('normalize-path');

const argv = yargs.argv

const consoleOut = new Writable({objectMode: true})
consoleOut._write = (chunk, enc, next) => {
	let obj = JSON.parse(chunk.toString())
	
	if(obj.level == 50 || obj.level == 60)
		console.log(colors.red(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] ERROR: ${obj.name}: ${obj.msg}`))
	else if(obj.level == 20)
		console.log(colors.cyan(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] DEBUG: ${obj.name}: ${obj.msg}`))
	else if(obj.level == 40)
		console.log(colors.yellow(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] WARN: ${obj.name}: ${obj.msg}`))
	else if(obj.level == 10)
		console.log(colors.blue(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] WARN: ${obj.name}: ${obj.msg}`))
	else
		console.log(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] INFO: ${obj.name}: ${obj.msg}`)

	next()
}

@injectable()
export class Module
{
	@inject(ReactiveApp)
	protected ctx:ReactiveApp
	
	private container:Container
	private log

	configure(parentContainer?:Container) {
		this.log = Bunyan.createLogger({
			name: this.constructor.name,
			stream: consoleOut,
			level: (argv.log ? argv.log : 'info')
		})
		
		this.log.debug(`load module ${this.constructor.name}`)
		// start up models
		// this.ctx = new ReactiveApp(_ctx)

		// setup container
		this.container = parentContainer //new Container({ autoBindInjectable: true })
		//this.container.parent = parentContainer
		//this.container.bind<ReactiveApp>(ReactiveApp).toConstantValue(this.ctx)
		
		// register child containers
		this.loadAll(this)
	}

	loadModel(modelClass) {
		this.log.debug(`load model ${modelClass.name}`)

		let methods = Registry.getProperty(modelClass.name, 'methods') 
		//console.log(modelClass.name)
		//console.log(methods)
		let definition = Registry.getProperty(modelClass.name, 'definition') //modelClass.getModelDefinition()
		let properties = this.loadProperties(modelClass) //Registry.getProperty(modelClass.name, 'properties') //modelClass.properties
		let hidden = this.loadHidden(modelClass)
		let relations = this.loadRelations(modelClass)
		
		let ds = this.ctx.getDataSource(methods.getDataSourceName())
		//console.log(relations)
		let regex = /(\w+)(Model?)/
		let modelName = definition.name
		let daoName = definition.name.replace(regex, '$1Dao')
		
		let modelSeed = ds.createModel(modelName, properties, Object.assign(definition, { hidden, relations }))
		//let modelSeed = ds.createModel(modelName, properties, Object.assign(definition, { hidden }))
		let daoSeed = ds.createModel(daoName, properties, Object.assign(definition, { hidden, relations }))
		//let daoSeed = ds.createModel(daoName, properties, Object.assign(definition, { hidden }))

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
		this.loadBeforeRemoteHook(DaoClass, modelSeed, dao)
		this.loadBeforeRemoteHook(modelClass, modelSeed, dao)
		this.loadAfterRemoteHook(DaoClass, modelSeed, dao)
		this.loadAfterRemoteHook(modelClass, modelSeed, dao)

		// load operation hooks
		this.loadObserver(DaoClass, daoSeed, dao)
		this.loadObserver(modelClass, daoSeed, dao)

		// register model
		//this.ctx.registerModel(modelSeed, {public: methods.isPublish(), dataSource: methods.getDataSourceName()})
		this.ctx.registerModel(dao.compile(modelSeed), {public: methods.isPublish(), dataSource: methods.getDataSourceName()})
		//class Buf extends modelSeed {}

		//this.ctx.registerModel(Buf, {public: methods.isPublish(), dataSource: methods.getDataSourceName()})
		
		this.container.bind(DaoClass).toConstantValue(dao)

		//return {modelSeed, daoSeed, relations}
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

	loadBeforeRemoteHook(ctxClass, modelSeed, realDao) {
		let hooks = Registry.getProperty(ctxClass.name, 'beforeRemoteHooks') //ctxClass.beforeRemoteHooks

		for(let key in hooks) {
			modelSeed.beforeRemote(key, (ctx, next) => {
				let prome = ctxClass.prototype[hooks[key]].apply(realDao, ctx, next)
				if(prome instanceof Promise)
					prome.then(_ => next()).catch(err => next(err))
			})
		}
	}

	loadAfterRemoteHook(ctxClass, modelSeed, realDao) {
		let hooks = Registry.getProperty(ctxClass.name, 'afterRemoteHooks') //ctxClass.afterRemoteHooks

		for(let key in hooks) {
			modelSeed.afterRemote(key, (ctx, next) => {
				let prome = ctxClass.prototype[hooks[key]].apply(realDao, ctx, next)
				if(prome instanceof Promise)
					prome.then(_ => next()).catch(err => next(err))
			})
		}
	}

	loadObserver(ctxClass, modelSeed, realDao) {
		let hooks = Registry.getProperty(ctxClass.name, 'observer') //ctxClass.observer

		for(let key in hooks) {
			this.log.debug(`attach ${key} hook to ${ctxClass}`)
			modelSeed.observe(key, (ctx, next) => {
				let prome = ctxClass.prototype[hooks[key]].apply(realDao, ctx, next)
				if(prome instanceof Promise)
					prome.then(_ => next()).catch(err => next(err))
			})
		}
	}

	loadMiddleware(middlewareClass) {
		this.log.debug(`load middleware ${middlewareClass.name}`)

		this.container.bind(middlewareClass).to(middlewareClass).inSingletonScope()
		let middleware:Middleware = this.container.get(middlewareClass)
		
		let handler:Function
		if(middleware instanceof ErrorMiddleware)
			handler = async function(err, req, res, next) {
				try {
					await middleware.onRequest.apply(middleware, arguments)
				} catch(e) {
					next(e)
				}
			}
		else
			handler = async function(req, res, next) {
				try {
					await middleware.onRequest.apply(middleware, arguments)
				} catch(e) {
					next(e)
				}
			}

		if(middleware.path && Array.isArray(middleware.path)) {
			middleware.path.forEach(p => this.ctx.registerMiddleware(middleware.phase, p, handler))
		} else if(middleware.path) {
			this.ctx.registerMiddleware(middleware.phase, middleware.path, handler)
		} else {
			this.ctx.registerMiddleware(middleware.phase, handler)
		}
	}

	loadRouter(routerClass) {
		this.log.debug(`load router ${routerClass.name}`)

		let meta = Registry.getProperty(routerClass.name, 'meta')
		
		//this.container.bind(routerClass).to(routerClass).inSingletonScope()
		let router:BaseRouter = this.container.resolve(routerClass)
		router.base = meta.base
		router.routes = meta.routes
		router.container = this.container

		router.configure()
		//this.container.get(routerClass)

		this.ctx.registerRouter(router.base, router.onRoute)
	}

	loadController(controllerClass) {
		this.log.debug(`load controller ${controllerClass.name}`)

		this.container.bind(controllerClass).to(controllerClass).inSingletonScope()
		let controller = this.container.get(controllerClass)
		let router = express.Router()

		let meta = Registry.getProperty(controllerClass.name, 'meta')

		// load methods
		let remotes = Registry.getProperty(controllerClass.name, 'remotes')
		for(let protocol in remotes) {
			// get, post, put, delete, patch
			let protocolOpts = remotes[protocol]
			let methods = []

			for(let methodName in protocolOpts) {
				let methodOpts = protocolOpts[methodName]
				let path = meta.path + '/' + (methodOpts.path ? methodOpts.path : (methodOpts.path === '' ? '' : methodName))

				path = normalizeUrl(path)

				methods.push({
					path: path,
					methodName: methodName,
					opts: protocolOpts[methodName]
				})
			}

			methods.sort((a, b) => {
				if(a.path.length > b.path.length)
					return -1

				if(a.path.length < b.path.length)
					return 1

				return 0
			})

			//for(let methodName in protocolOpts) {
			for(let j=0; j<methods.length; j++) {
				// find, findOne, findById
				let methodOpts = methods[j].opts //protocolOpts[methodName]
				let path = methods[j].path
				let methodName = methods[j].methodName
				
				//console.log(path)
				// check if there is middleware
				let middlewares = methodOpts.middlewares
				for(let i=0; i<middlewares.length; i++) {
					let middleware:any = this.container.resolve(middlewares[i])

					router[protocol](path, async function(req, res, next) {
						try {
							await middleware.onRequest.apply(middleware, arguments)
						} catch(e) {
							next(e)
						}
					})	
				}

				router[protocol](path, async function(req, res, next) {
					try {
						await controller[methodName].apply(controller, arguments)
					} catch(e) {
						next(e)
					}
				})
			}
		}

		this.ctx.registerMiddleware('routes', router)
	}

	loadAll(m:any) {
		let meta = Registry.getProperty(m.constructor.name, 'meta') 

		// setup child modules
		meta.imports.forEach(i => {
			let tmp:Module = this.container.resolve(i); //new i(this._ctx)
			tmp.configure(this.container)
			//tmp.getContainer().parent = this.container
			//tmp.loadAll(tmp)
		});

		// bind declaration
		meta.declare.forEach(targetClass => this.container.bind(targetClass).toSelf().inSingletonScope());

		// bind factories
		meta.factories.forEach(fn => fn(this.container))

		// setup models
		meta.models.forEach(modelClass => this.loadModel(modelClass));
		//let modelsMeta = meta.models.map(modelClass => this.loadModel(modelClass));

		// setup model relations
		/*modelsMeta.forEach(({modelSeed, daoSeed, relations}) => {
			for(let key in relations) {
				let entry = relations[key]
				let relationType = entry['type']
				let modelName = entry['model']
				let foreignKey = entry['foreignKey']

				let modelInstance = this.ctx.getParentContext().models[modelName]

				modelSeed[relationType](modelInstance, {
					as: key,
					foreignKey: foreignKey
				})

				daoSeed[relationType](modelInstance, {
					as: key,
					foreignKey: foreignKey
				})

				//console.log(entry)
			}
		})*/

		// setup middleware
		meta.middleware.forEach(middlewareClass => this.loadMiddleware(middlewareClass))

		// setup routers
		meta.routers.forEach(routerClass => this.loadRouter(routerClass))

		// setup controllers
		meta.controllers.forEach(controllerClass => this.loadController(controllerClass))
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
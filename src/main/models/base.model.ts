import * as _ from 'lodash'
import { ReactiveApp } from '../reactive.app';
import { injectable, inject, Container } from 'inversify';
import { Registry } from '../boot/registry';

export function hideProperty(target, key) {
	let descriptor = Object.getOwnPropertyDescriptor(target, key) || {};
	if (descriptor.enumerable != false) {
		descriptor.enumerable = false;
		Object.defineProperty(target, key, descriptor)
	}
}

@injectable()
export class BaseModel 
{	
	model
	dao
	isCreated

	/*constructor(model, dao, ignore?) {
		this.model = model
		this.dao = dao
	}*/

	configure(ignore?) {
		hideProperty(this, 'model')
		hideProperty(this, 'dao')

		let relations = Registry.getProperty(this.constructor.name, 'relations')

		for(let key in this.model) {
			if(key !== 'id' && typeof this.model[key] !== 'function') {
				if(ignore) {
					if(key.startsWith('__'))
						(<any>this)[key] = this.model[key]
				}
				else
					(<any>this)[key] = this.model[key]

				if(key.startsWith('__'))
					hideProperty(this, key)
			} else  if(relations[key]) {
				(<any>this)[key] = this.model[key]()
			}
		}
	}

	on(eventName, cb) {
		this.dao.on(eventName, cb)
	}

	emit(eventName, ctx) {
		this.dao.emit(eventName, ctx)
	}

	onInit() {}

	get ds() { return this.dao }
	get ctx() { return this.model }

	get(name) { return this.model[name] }
}

@injectable()
export class BaseDao {
	dao
	ModelClass
	container:Container
	
	@inject(ReactiveApp) ctx:ReactiveApp

	compile(seed) { 
		this.copyFunctions(seed, this.constructor)

		return seed
	}

	on(eventName, cb) {
		this.dao.on(eventName, cb)
	}

	emit(eventName, ctx) {
		this.dao.emit(eventName, ctx)
	}

	onInit() {}

	protected get ds() { return this.dao  }

	protected get context() { return this.ctx }

	newInstance(seed, isCreated?, ignore?):any { 
		let tmp:BaseModel = this.container.resolve(this.ModelClass)
		tmp.model = seed
		tmp.isCreated = isCreated
		tmp.dao = this.ds

		tmp.configure(ignore)
		tmp.onInit()

		// hide enumerable
		let enumerable = Registry.getProperty(this.ModelClass.name, 'enumerable')
		for(let key in enumerable) 
			hideProperty(tmp, key)

		return tmp
	}

	private copyFunctions(target, source) {
		let self = this
		let properties = Object.getOwnPropertyNames(source.prototype)
		properties.forEach(key => {
			if(typeof this[key] === 'function' && key !== 'constructor' && key !== 'compile' && key != 'on' && key !== 'emit') {
				//console.log('copy function ' + key)
				target[key] = function(args) {
					//return source.prototype[key].apply(self, arguments)
					return this[key].apply(self, arguments)
				}
			}
		})

		let baseClass = Object.getPrototypeOf(source)
		if(!_.isEmpty(baseClass.name)) this.copyFunctions(target, baseClass)
	}
}

export interface ModelFactoryDao
{
	ModelClass:any
}
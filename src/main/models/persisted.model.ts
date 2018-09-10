import { ReactiveApp } from '../reactive.app';
import * as _ from 'lodash'
import { BaseModel, BaseDao } from './base.model';
import { injectable } from 'inversify';
import { CommonModel } from './decorators';

export class NotValidArgumentException extends Error {
	constructor() {
		super('arguments not valid or empty')
	}
}

@injectable()
export class PersistedDao extends BaseDao
{	
	ModelClass = PersistedModel

	count(where, options?, cb?):Promise<Number> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		where = (where ? where : {});
		if(cb) {
			this.ds.count(where, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.count(where, (err, count) => {
					if(err) reject(err)
					else resolve(count)
				})
			})
		}
	}

	create<T extends BaseModel>(data, options?, cb?):Promise<Array<T>> {
		if(!data) throw new NotValidArgumentException()

		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(cb) {
			this.ds.create(data, (err, model) => {
				if(err) return cb(err)
				cb(null, this.getInstance(model))
			})
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.create(data, (err, models) => {
					if(err) reject(err)
					else if(!models) resolve(null)
					else if(_.isEmpty(models)) resolve(models)
					else if(Array.isArray(models)) resolve(models.map(m => this.getInstance(m)))
					else resolve([this.getInstance(models)])
				})
			})
		}
	}

	destroyAll(where, options?, cb?):Promise<any> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		where = (where ? where : {})
		if(cb) {
			this.ds.destroyAll(where, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.destroyAll(where, (err, info, count) => {
					if(err) reject(err)
					else resolve({info, count})
				})	
			})
		}
	}

	destroyById(id, options?, cb?):Promise<any> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(cb) {
			this.ds.destroyById(id, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.destroyById(id, (err) => {
					if(err) reject(err)
					else resolve(id)
				})
			})
		}
	}

	exists(id, options?, cb?):Promise<boolean> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(cb) {
			this.ds.exists(id, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.exists(id, (err, exists) => {
					if(err) reject(err)
					else resolve(exists)
				})
			})
		}
	}

	find<T extends BaseModel>(filter, options?, cb?):Promise<Array<T>> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		filter = (filter ? filter : {})
		if(cb) {
			this.ds.find(filter, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.find(filter, (err, instances) => {
					if(err) reject(err)
					else resolve(instances.map(i => this.getInstance(i)))
				})
			})
		}
	}

	findById<T extends BaseModel>(id, filter, options?, cb?):Promise<T> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		filter = (filter ? filter : {})
		if(cb) {
			this.ds.findById(id, filter, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.findById(id, filter, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.getInstance(instance))
				})
			})
		}
	}

	findOne<T extends BaseModel>(filter, options?, cb?):Promise<T> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		filter = (filter ? filter : {})
		if(cb) {
			this.ds.findOne(filter, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.findOne(filter, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.getInstance(instance))
				})
			})
		}
	}

	findOrCreate<T extends BaseModel>(filter, data, options?, cb?):Promise<T> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		filter = (filter ? filter : {})
		if(cb) {
			this.ds.findOrCreate(filter, data, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.findOrCreate(filter, data, (err, instance, created) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.getInstance(instance, created))
				})
			})
		}
	}

	replaceById<T extends BaseModel>(id, data, options?, cb?):Promise<T> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(cb) {
			this.ds.replaceById(id, data, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.replaceById(id, data, options, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.getInstance(instance))
				})
			})
		}
	}

	replaceOrCreate<T extends BaseModel>(data, options?, cb?):Promise<T> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(cb) {
			this.ds.replaceOrCreate(data, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.replaceOrCreate(data, options, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.getInstance(instance))
				})
			})
		}
	}

	updateAll(where, data, options?, cb?):Promise<any> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		where = (where ? where : {})
		if(cb) {
			this.ds.updateAll(where, data, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.updateAll(where, data, (err, info, count) => {
					if(err) reject(err)
					else resolve({info, count})
				})
			})
		}
	}

	upsert<T extends BaseModel>(data, options?, cb?):Promise<T> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(cb) {
			this.ds.upsert(data, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.upsert(data, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.getInstance(instance))
				})
			})
		}
	}

	upsertWithWhere<T extends BaseModel>(where, data, options?, cb?):Promise<T> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		where = (where ? where : {})
		if(cb) {
			this.ds.upsertWithWhere(where, data, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.upsertWithWhere(where, data, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.getInstance(instance))
				})
			})
		}
	}

	getInstance(instance, created?:boolean):any {
		let tmp:PersistedModel = this.newInstance(instance, created)
		tmp.id = instance.id

		return tmp
	}
}

@injectable()
@CommonModel({
	name: "Persisted",
	dao: PersistedDao,
	dataSource: "db"
})
export class PersistedModel extends BaseModel
{
	id

	/*constructor(model:any, dao:any, isCreated?:boolean) {
		super(model, dao)
		this.id = model.id
		this.isCreated = isCreated
	}*/

	destroy(cb?):Promise<void> {
		if(cb) {
			this.ctx.destroy.call(this, cb)
			return Promise.resolve()
		}
		return new Promise((resolve, reject) => {
			this.ctx.destroy.call(this, () => {
				resolve()
			})
		})
	}

	reload(cb?):Promise<this> {
		if(cb) {
			this.ctx.reload.call(this, cb)
			return Promise.resolve(<any>this)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ctx.reload.call(this, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.clone(instance))
				})
			})
		}
	}

	replaceAttributes(data, options, cb?):Promise<this> {
		options = (options ? options : {})
		if(cb) {
			this.ctx.replaceAttributes.call(this, data, options, cb)
			return Promise.resolve(this)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ctx.replaceAttributes.call(this, data, options, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.clone(instance))
				})
			})
		}
	}

	save(options, cb?):Promise<this> {
		options = (options ? options : {})
		if(cb) {
			this.ctx.save.call(this, options, cb)
			return Promise.resolve(this)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ctx.save.call(this, options, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.clone(instance))
				})
			})
		}
	}

	updateAttribute(name, value, cb?):Promise<this> {
		if(cb) {
			this.ctx.updateAttribute.call(this, name, value, cb)
			return Promise.resolve(this)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ctx.updateAttribute.call(this, name, value, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.clone(instance))
				})
			})
		}
	}

	updateAttributes(data, cb?):Promise<this> {
		if(cb) {
			this.ctx.updateAttributes.call(this, data, cb)
			return Promise.resolve(this)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ctx.updateAttributes.call(this, data, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.clone(instance))
				})
			})
		}
	}

	protected clone(instance, isCreated?):any { return (<PersistedDao>this.dao).getInstance(instance, isCreated) }
	//protected clone(instance, isCreated?):any { return new (<any>this.constructor)(instance, this.ds, isCreated) }
}

//export const definition = (<any>PersistedModel).getModelDefinition()
//export const dao = PersistedDao
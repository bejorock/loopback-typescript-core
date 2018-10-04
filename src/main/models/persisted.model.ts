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
			this.ds.count(where, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.count(where, options, (err, count) => {
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
			this.ds.create(data, options, (err, model) => {
				if(err) return cb(err)
				cb(null, this.getInstance(model))
			})
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.create(data, options, (err, models) => {
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
			this.ds.destroyAll(where, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.destroyAll(where, options, (err, info, count) => {
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
			this.ds.destroyById(id, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.destroyById(id, options, (err) => {
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
			this.ds.exists(id, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.exists(id, options, (err, exists) => {
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
			this.ds.find(filter, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.find(filter, options, (err, instances) => {
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
			this.ds.findById(id, filter, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.findById(id, filter, options, (err, instance) => {
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
			this.ds.findOne(filter, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.findOne(filter, options, (err, instance) => {
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
			this.ds.findOrCreate(filter, data, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.findOrCreate(filter, data, options, (err, instance, created) => {
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
			this.ds.updateAll(where, data, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.updateAll(where, data, options, (err, info, count) => {
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
			this.ds.upsert(data, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.upsert(data, options, (err, instance) => {
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
			this.ds.upsertWithWhere(where, data, options, cb)
			//return Promise.resolve(null)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ds.upsertWithWhere(where, data, options, (err, instance) => {
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

	destroy(options?, cb?):Promise<void> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(cb) {
			this.ctx.destroy.call(this, options, cb)
			return Promise.resolve()
		}
		return new Promise((resolve, reject) => {
			this.ctx.destroy.call(this, options, () => {
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

	updateAttribute(name, value, options?, cb?):Promise<this> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(cb) {
			this.ctx.updateAttribute.call(this, name, value, options, cb)
			return Promise.resolve(this)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ctx.updateAttribute.call(this, name, value, options, (err, instance) => {
					if(err) reject(err)
					else if(!instance) resolve(null)
					else resolve(this.clone(instance))
				})
			})
		}
	}

	updateAttributes(data, options?, cb?):Promise<this> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(cb) {
			this.ctx.updateAttributes.call(this, data, options, cb)
			return Promise.resolve(this)
		}
		else {
			return new Promise((resolve, reject) => {
				this.ctx.updateAttributes.call(this, data, options, (err, instance) => {
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
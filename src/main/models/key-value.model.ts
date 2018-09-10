import { Observable } from 'rxjs'
import { BaseModel, BaseDao } from './base.model';
import { injectable } from 'inversify';

@injectable()
export class KeyValueDao extends BaseDao
{
	ModelClass = KeyValueModel

	expire(key, ttl, options?, cb?):Promise<void> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.ds.expire(key, ttl)
		this.ds.expire(key, ttl, cb)
		//return Promise.resolve()
	}

	get<T extends KeyValueModel>(key, options?, cb?):Promise<T> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.ds.get(key, options).then(instance => this.getInstance(key, instance))
		//this.ds.get(key, options, cb).then(instance => this.newInstance(key, instance))
		//return Promise.resolve(null)

		this.ds.get(key, options, (err, model) => {
			cb(err, this.newInstance(key, model))
		})
	}

	iterateKeys(filter, options?):Observable<any> {
		return this.ds.iterateKeys(filter)
	}

	keys(filter, options?, cb?):Promise<any> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.ds.keys(filter)
		this.ds.keys(filter, cb)
		//return Promise.resolve(null)
	}

	set(key, value, options?, cb?):Promise<void> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.ds.set(key, value, options)
		this.ds.set(key, value, options, cb)
		//return Promise.resolve()
	}

	ttl(key, options, cb?):Promise<number> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.ds.ttl(key, options)
		this.ds.ttl(key, options, cb)
		//return Promise.resolve(0)
	}

	getInstance(key, seed) {
		let tmp:KeyValueModel = this.newInstance(seed, false, true)
		tmp.key = key
		tmp.value = seed

		return tmp
	}
}

@injectable()
export class KeyValueModel extends BaseModel
{
	key
	value

	/*constructor(key, model, dao, isCreated?) {
		super(model, dao, true)
		this.key = key
		this.isCreated = isCreated
		this.value = model
	}*/

	get(name) { return this.ctx[name] }

	save(options?, cb?):Promise<void> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.ds.set(this.key, this.ctx)
		this.ds.set(this.key, this.ctx, cb)
		//return Promise.resolve()
	}

	destroy(options?, cb?):Promise<void> {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.ds.getContext().delete(this.key)
		this.ds.getContext().delete(this.key, cb)
		return Promise.resolve()
	}
}
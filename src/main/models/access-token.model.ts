import { PersistedModel, PersistedDao } from './persisted.model';
import { CommonModel, Property } from './decorators';
import { injectable } from 'inversify';

@injectable()
export class AccessTokenDao extends PersistedDao
{
	createAccessTokenId(cb?):Promise<string> {
		if(!cb) return new Promise((resolve, reject) => {
			this.ds.createAccessTokenId((err, token) => {
				if(err) reject(err)
				else resolve(token)
			})
		})

		this.ds.createAccessTokenId(cb)
		return Promise.resolve(null)
	}

	findForRequest<T extends AccessTokenModel>(req, options?, cb?):Promise<T> {
		options = (options ? options : {})
		if(!cb) return new Promise((resolve, reject) => {
			this.ds.findForRequest(req, options, (err, token) => {
				if(err) reject(err)
				else resolve(this.newInstance(token))
			})
		})
	}

	getIdForRequest(req, options?):any {
		return this.ds.getIdForRequest(req, options)
	}

	resolve<T extends AccessTokenModel>(id, cb?):Promise<T> {
		if(!cb) return new Promise((resolve, reject) => {
			this.ds.resolve(id, (err, resolved) => {
				if(err) reject(err)
				else resolve(this.newInstance(resolved))
			})
		})

		this.ds.resolve(id, cb)
		return Promise.resolve(null)
	}
}

@injectable()
@CommonModel({
	name: "DefaultAccessToken",
	base: "PersistedModel",
	dao: AccessTokenDao,
	dataSource: "db",
	publish: false
})
export class AccessTokenModel extends PersistedModel
{
	//ttl:number
	//created:Date
	//settings:any

	validate(cb?):Promise<boolean> {
		if(!cb) return new Promise((resolve, reject) => {
			this.ctx.validate.call(this, (err, isValid) => {
				if(err) reject(err)
				else resolve(isValid)
			})
		})

		this.ctx.validate.call(this, cb)
		return Promise.resolve(false)
	}
}
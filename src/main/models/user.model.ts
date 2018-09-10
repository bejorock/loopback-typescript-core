import { PersistedDao, PersistedModel } from './persisted.model';
import { CommonModel } from './decorators';
import { injectable } from 'inversify';

@injectable()
export class UserDao extends PersistedDao
{
	changePassword(userId, oldPassword, newPassword, options, cb?):Promise<void> {
		options = (options ? options : {})
		if(!cb) return this.ds.changePassword(userId, oldPassword, newPassword, options)
		this.ds.changePassword(userId, oldPassword, newPassword, options, cb)
		return Promise.resolve()
	}

	confirm(userId, token, redirect, cb?):Promise<void> {
		if(!cb) return this.ds.confirm(userId, token, redirect)
		this.ds.confirm(userId, token, redirect, cb)
		return Promise.resolve()
	}

	generateVerificationToken<T extends PersistedModel>(user, options):Promise<T> {
		return new Promise((resolve, reject) => {
			this.ds.generateVerificationToken(user, options, (err, instance) => {
				if(err) {
					if(err instanceof Error) reject(err)
					else resolve(err)
				} 
				else if(instance) resolve(this.newInstance(instance))
				else resolve()
			})
		})
	}

	login(credentials, include):Promise<any> {
		return new Promise((resolve, reject) => {
			this.ds.login(credentials, include, (err, token) => {
				if(err) reject(err)
				else resolve(token)
			})
		})
	}

	logout(accessTokenID):Promise<void> {
		return new Promise((resolve, reject) => {
			this.ds.logout(accessTokenID, (err) => {
				if(err) reject(err)
				else resolve()
			})
		})
	}

	resetPassword(options, cb?):Promise<void> {
		if(!cb) return this.ds.resetPassword(options)
		this.ds.resetPassword(options, cb)
		return Promise.resolve()
	}

	setPassword(userId, newPassword, options, cb?):Promise<void>	{
		if(!cb) return this.ds.setPassword(userId, newPassword, options)
		this.ds.setPassword(userId, newPassword, options, cb)
		return Promise.resolve()
	}
}

@injectable()
@CommonModel({
	name: "DefaultUser",
	dao: UserDao,
	dataSource: "db"
})
export class UserModel extends PersistedModel
{
	changePassword(oldPassword, newPassword, options, cb?):Promise<void> {
		if(!cb) return this.ctx.changePassword.call(this, oldPassword, newPassword, options)
		this.ctx.changePassword.call(this, oldPassword, newPassword, options, cb)
		return Promise.resolve()
	}

	createAccessToken(data, options, cb?):Promise<any> {
		if(!cb) return this.ctx.createAccessToken.call(this, data, options)
		this.ctx.createAccessToken.call(this, data, options, cb)
		return Promise.resolve()
	}

	hasPassword(password, cb?):Promise<boolean> {
		if(!cb) return this.ctx.hasPassword.call(this, password)
		this.ctx.hasPassword.call(this, password, cb)
		return Promise.resolve(false)
	}

	setPassword(newPassword, options, cb?):Promise<void> {
		if(!cb) return this.ctx.setPassword.call(this, newPassword, options)
		this.ctx.setPassword.call(this, newPassword, options, cb)
		return Promise.resolve()
	}

	verify<T extends UserModel>(verifyOptions):Promise<T> {
		return new Promise((resolve, reject) => {
			this.ctx.verify.call(this, verifyOptions, (options, err, instance) => {
				if(err) reject(err)
				else resolve(this.clone(instance))
			})
		})
	}
}
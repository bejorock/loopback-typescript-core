import { PersistedModel, PersistedDao } from './persisted.model';
import { CommonModel } from './decorators';
import { injectable } from 'inversify';

@injectable()
export class RoleDao extends PersistedDao
{
	getRoles(context, cb?):Promise<Array<any>> {
		if(!cb) return this.ds.getRoles(context)
		this.ds.getRoles(context, cb)
		return Promise.resolve(null)
	}

	isAuthenticated(context, cb?):Promise<boolean> {
		if(!cb) return this.ds.isAuthenticated(context)
		this.ds.isAuthenticated(context, cb)
		return Promise.resolve(false)
	}

	isInRole(role, context, cb?):Promise<boolean> {
		if(!cb) return this.ds.isInRole(role, context)
		this.ds.isInRole(role, context, cb)
		return Promise.resolve(false)
	}

	isOwner(modelClass, modelId, userId, principalType, options, cb?):Promise<boolean> {
		if(!cb) return this.ds.isOwner(modelClass, modelId, userId, principalType, options)
		this.ds.isOwner(modelClass, modelId, userId, principalType, options, cb)
		return Promise.resolve(false)
	}

	registerResolver(role, resolver):void {
		this.ds.registerResolver(role, resolver)
	}
}

// alson known as role mapping
@injectable()
@CommonModel({
	name: "DefaultRole",
	dao: RoleDao,
	dataSource: "db"
})
export class RoleModel extends PersistedModel
{
	get principals():PersistedDao { return this.ctx.principals }
}
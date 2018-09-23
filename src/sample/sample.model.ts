import { PersistedModel, PersistedDao } from '../main/models/persisted.model';
import { CommonModel, Property, Hidden, Remote, BeforeRemote, AfterRemote, Hook } from "../main/models/decorators";
import { injectable, inject } from 'inversify';
import { ReactiveApp } from '../main/reactive.app';

@injectable()
export class SampleDao extends PersistedDao
{
	ModelClass = SampleModel

	@Remote({
		accepts: [{arg: 'msg', type: 'string'}],
		returns: [{arg: 'greeting', type: 'string'}]
	})
	async greet(msg) {
		return `greeting... ${msg}`
	}

	@BeforeRemote('greet')
	async logGreet(ctx) {
		console.log('before greet')
		return false
	}

	@AfterRemote('greet')
	async logGreetAgain(ctx) {
		console.log('after greet')
		return false
	}

	@Hook('before save')
	async onAccess(ctx) {
		console.log('on acccess')
		return false
	}
}

@injectable()
@CommonModel({
	dao: SampleDao,
	dataSource: "db",
	acls: [{
		"accessType": "*",
		"principalType": "ROLE",
		"principalId": "$unauthenticated",
		"permission": "DENY"
	}, {
		"accessType": "*",
		"principalType": "ROLE",
		"principalId": "authorizedScopes",
		"permission": "ALLOW",
		"property": "find",
		"accessScopes": ["read:sample", "write:sample"]
	}]
})
export class SampleModel extends PersistedModel
{
	@Property("string")
	name

	@Property("number")
	age

	@Property("string")
	@Hidden
	hiddenProperty

	@Remote({
		accepts: [{arg: 'msg', type: 'string'}],
		returns: [{arg: 'greeting', type: 'string'}]
	})
	greet(msg, cb) {
		cb(null, `greeting... ${this.name} ${msg}`)
	}
}
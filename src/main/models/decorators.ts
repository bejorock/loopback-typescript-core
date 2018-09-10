import * as _ from 'lodash'
import { Registry } from "../boot/registry";

export function CommonModel({
	name = undefined,
	base = "PersistedModel",
	idInjection = true,
	options = {
		validateUpsert: true
	},
	mixins = [],
	acls = [],
	settings = {},
	dao,
	dataSource,
	publish = true
}) {
	return function(constructor:any) {
		let definition = Registry.getProperty(constructor.name, 'definition')
		let methods = Registry.getProperty(constructor.name, 'methods')
		
		Object.assign(
			definition, 
			{ base, idInjection, options, mixins: {}, acls },
			settings
		)
	
		definition.name = name || constructor.name
		methods.getModelDefinition = () => definition
		methods.getDaoClass = () => dao
		methods.getDataSourceName = () => dataSource
		methods.getMixins = () => mixins
		methods.isPublish = () => publish
	}
}

export function CommonModule({ imports = [], models = [], middleware = [], declare = [] }) {
	return function(constructor:any) {
		let meta = Registry.getProperty(constructor.name, 'meta')

		meta.imports = imports
		meta.models = models
		meta.middleware = middleware
		meta.declare = declare
	}
}

export function Property(meta) {
	if(typeof meta === 'string')
		meta = {type: meta}

	return function(target, key) {
		let properties = Registry.getProperty(target.constructor.name, 'properties')
		properties[key] = meta
	}
}

export function Hidden(target, key) {
	let hidden = Registry.getProperty(target.constructor.name, 'hidden', [])
	hidden.push(key)
}

export function Relation(type, model, foreignKey = "", primaryKey = "") {
	return function(target, key) {
		let relations = Registry.getProperty(target.constructor.name, 'relations')
		relations[key] = { type, model, foreignKey }
	}
}

export function Remote({
	accepts = [],
	accessScopes = [],
	description = '',
	http = {},
	documented = true,
	returns = {}
}) {
	return function(target, key) {
		let remotes = Registry.getProperty(target.constructor.name, 'remotes')

		let tmp = { accepts, http, returns, documented }

		if(accessScopes.length > 0) Object.assign(tmp, { accessScopes })
		if(!_.isEmpty(description)) Object.assign(tmp, { description })

		remotes[key] = tmp
	}
}

export function BeforeRemote(name) {
	return function(target, key) {
		let hooks = Registry.getProperty(target.constructor.name, 'beforeRemoteHooks')
		hooks[name] = key
	}
}

export function AfterRemote(name) {
	return function(target, key) {
		let hooks = Registry.getProperty(target.constructor.name, 'afterRemoteHooks')
		hooks[name] = key
	}
}

export function Hook(name) {
	return function(target, key) {
		let hooks = Registry.getProperty(target.constructor.name, 'observer')
		hooks[name] = key
	}
}

// only works for model class
export function NotEnumerable (target: any, propertyKey: string) {
	let enumerable = Registry.getProperty(target.constructor.name, 'enumerable')
	enumerable[propertyKey] = false
}

export function Validation(validation, name, value) {
	return function(target, key) {
		
	}
}

export function Singleton(constructor:any) {
	let info = Registry.getProperty(constructor.name, 'info')
	info.singleton = true
}
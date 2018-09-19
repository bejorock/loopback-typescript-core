import * as _ from 'lodash'
import { Registry } from "../boot/registry";

export interface CommonModelOptions
{
	name?:string
	base?:string
	idInjection?:boolean
	options?:any
	mixins?:any[]
	acls?:any[]
	settings?:any
	dao:any
	dataSource:string
	publish?:boolean
}

export function CommonModel(options:CommonModelOptions) {
	return function(constructor:any) {
		let definition = Registry.getProperty(constructor.name, 'definition')
		let methods = Registry.getProperty(constructor.name, 'methods')
		let defaultOptions = Object.assign({
			base: 'PersistedModel',
			idInjection: true,
			options: {
				validateUpsert: true
			},
			mixins: [],
			acls: [],
			settings: {},
			publish: true
		}, options)

		Object.assign(
			definition, 
			{ base:defaultOptions.base, idInjection:defaultOptions.idInjection, options:defaultOptions.options, mixins: {}, acls:defaultOptions.acls },
			defaultOptions.settings
		)
	
		definition.name = defaultOptions.name || constructor.name
		methods.getModelDefinition = () => definition
		methods.getDaoClass = () => defaultOptions.dao
		methods.getDataSourceName = () => defaultOptions.dataSource
		methods.getMixins = () => defaultOptions.mixins
		methods.isPublish = () => defaultOptions.publish
	}
}

export interface CommonModuleOptions
{
	imports?:any[]
	models?:any[]
	middleware?:any[]
	declare?:any[],
	routers?:any[]
}

export function CommonModule(options:CommonModuleOptions) {
	return function(constructor:any) {
		let meta = Registry.getProperty(constructor.name, 'meta')
		let defaultOptions = Object.assign({ imports: [], models: [], middleware: [], declare: [] }, options)

		meta.imports = defaultOptions.imports
		meta.models = defaultOptions.models
		meta.middleware = defaultOptions.middleware
		meta.declare = defaultOptions.declare
		meta.routers = defaultOptions.routers
	}
}

export interface CommonRoute
{
	path:string
	handler?:any
	protocol?:string
	load?:any
}

export interface CommonRouterOptions
{
	base?:string
	routes?:CommonRoute[]
}

export function CommonRouter(options:CommonRouterOptions) {
	return function(constructor:any) {
		let meta = Registry.getProperty(constructor.name, 'meta')

		meta.base = options.base
		meta.routes = options.routes
	}
}

export function Property(meta, required = false) {
	if(typeof meta === 'string')
		meta = {type: meta, required}

	return function(target, key) {
		let properties = Registry.getProperty(target.constructor.name, 'properties')
		properties[key] = meta
	}
}

export function Hidden(target, key) {
	let hidden = Registry.getProperty(target.constructor.name, 'hidden', [])
	hidden.push(key)
}

export function Relation(type, model, foreignKey = "", primaryKey = "", through?) {
	return function(target, key) {
		let relations = Registry.getProperty(target.constructor.name, 'relations')
		relations[key] = { type, model, foreignKey }
		if(through)
			relations[key].through = through
	}
}

export interface RemoteOptions
{
	accepts?:any[]
	accessScopes?:any[]
	description?:string
	http?:any
	documented?:boolean
	returns?:any
}

export function Remote(options:RemoteOptions) {
	let defaultOptions = Object.assign({
		accepts: [],
		accessScopes: [],
		description: '',
		http: {},
		documented: true,
		returns: {}
	}, options)
	
	return function(target, key) {
		let remotes = Registry.getProperty(target.constructor.name, 'remotes')

		let tmp = { accepts:defaultOptions.accepts, http:defaultOptions.http, returns:defaultOptions.returns, documented:defaultOptions.documented }

		if(defaultOptions.accessScopes.length > 0) Object.assign(tmp, { accessScopes: defaultOptions.accessScopes })
		if(!_.isEmpty(defaultOptions.description)) Object.assign(tmp, { description: defaultOptions.description })

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
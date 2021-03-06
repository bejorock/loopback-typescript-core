import { PersistedDao } from './models/persisted.model';

export class ReactiveApp
{
	constructor(private app:any) {}

	set(key, value):void { this.app.set(key, value) }

	get(key):any { return this.app.get(key) }

	useAt(path, fn):void { this.app.use(path, fn) }

	use(fn):void { this.app.use(fn) }

	getDaos():any { return this.app.models }

	getDao<T>(name):T { return this.app.models[name] }

	getDataSources():any { return this.app.datasources }

	getDataSource(name):any { return this.app.datasources[name] }

	getParentContext():any { return this.app }

	getConfig(name):any { return this.app.get(name) }

	registerModel(model, options?) { this.app.model(model, Object.assign(options)) }

	registerMiddleware(phase, paths, middleware?) { 
		if(typeof paths === 'function') {
			middleware = paths
			paths = undefined
		}

		this.app.middleware(phase, paths, middleware)
	}

	registerPath(protocol:string, path:string, middleware) {
		if(!protocol) this.app.use(path, middleware)
		else this.app[protocol](path, middleware)
	}

	registerRouter(path:string, router) {
		if(path)
			this.app.middleware('routes', path, router)
		else
			this.app.middleware('routes', router)
	}

	emit(name, value) { this.app.emit(name, value) }

	enableAuth(options?) { this.app.enableAuth(options) }
}
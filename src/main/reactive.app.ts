import { PersistedDao } from './models/persisted.model';

export class ReactiveApp
{
	constructor(private app:any) {}

	getDaos():any { return this.app.models }

	getDao<T>(name):T { return this.app.models[name] }

	getDataSources():any { return this.app.datasources }

	getDataSource(name):any { return this.app.datasources[name] }

	getParentContext():any { return this.app }

	getConfig(name):any { return this.app.get(name) }

	registerModel(model, options?) { this.app.model(model, Object.assign(options)) }

	registerMiddleware(phase, middleware) { this.app.middleware(phase, middleware) }

	registerPath(protocol:string, path:string, middleware) {
		if(!protocol) this.app.use(path, middleware)
		else if(protocol.toLowerCase() === 'get') this.app.get(path, middleware)
		else if(protocol.toLowerCase() === 'post') this.app.post(path, middleware)
	}

	emit(name, value) { this.app.emit(name, value) }

	enableAuth(options?) { this.app.enableAuth(options) }
}
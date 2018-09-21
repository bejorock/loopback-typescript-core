"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReactiveApp {
    constructor(app) {
        this.app = app;
    }
    set(key, value) { this.app.set(key, value); }
    get(key) { return this.app.get(key); }
    useAt(path, fn) { this.app.use(path, fn); }
    use(fn) { this.app.use(fn); }
    getDaos() { return this.app.models; }
    getDao(name) { return this.app.models[name]; }
    getDataSources() { return this.app.datasources; }
    getDataSource(name) { return this.app.datasources[name]; }
    getParentContext() { return this.app; }
    getConfig(name) { return this.app.get(name); }
    registerModel(model, options) { this.app.model(model, Object.assign(options)); }
    registerMiddleware(phase, middleware) { this.app.middleware(phase, middleware); }
    registerPath(protocol, path, middleware) {
        if (!protocol)
            this.app.use(path, middleware);
        else if (protocol.toLowerCase() === 'get')
            this.app.get(path, middleware);
        else if (protocol.toLowerCase() === 'post')
            this.app.post(path, middleware);
    }
    registerRouter(path, router) {
        if (path)
            this.app.middleware('routes', path, router);
        else
            this.app.middleware('routes', router);
    }
    emit(name, value) { this.app.emit(name, value); }
    enableAuth(options) { this.app.enableAuth(options); }
}
exports.ReactiveApp = ReactiveApp;
//# sourceMappingURL=reactive.app.js.map
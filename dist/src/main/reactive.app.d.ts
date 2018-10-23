export declare class ReactiveApp {
    private app;
    constructor(app: any);
    set(key: any, value: any): void;
    get(key: any): any;
    useAt(path: any, fn: any): void;
    use(fn: any): void;
    getDaos(): any;
    getDao<T>(name: any): T;
    getDataSources(): any;
    getDataSource(name: any): any;
    getParentContext(): any;
    getConfig(name: any): any;
    registerModel(model: any, options?: any): void;
    registerMiddleware(phase: any, paths: any, middleware?: any): void;
    registerPath(protocol: string, path: string, middleware: any): void;
    registerRouter(path: string, router: any): void;
    emit(name: any, value: any): void;
    enableAuth(options?: any): void;
}

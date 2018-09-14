export declare class ReactiveApp {
    private app;
    constructor(app: any);
    getDaos(): any;
    getDao<T>(name: any): T;
    getDataSources(): any;
    getDataSource(name: any): any;
    getParentContext(): any;
    getConfig(name: any): any;
    registerModel(model: any, options?: any): void;
    registerMiddleware(phase: any, middleware: any): void;
    registerPath(protocol: string, path: string, middleware: any): void;
    emit(name: any, value: any): void;
    enableAuth(options?: any): void;
}

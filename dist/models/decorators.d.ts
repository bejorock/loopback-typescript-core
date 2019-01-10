export interface CommonModelOptions {
    name?: string;
    base?: string;
    idInjection?: boolean;
    options?: any;
    mixins?: any[];
    acls?: any[];
    settings?: any;
    dao: any;
    dataSource: string;
    publish?: boolean;
}
export declare function CommonModel(options: CommonModelOptions): (constructor: any) => void;
export interface CommonModuleOptions {
    imports?: any[];
    models?: any[];
    middleware?: any[];
    declare?: any[];
    routers?: any[];
    factories?: any[];
    controllers?: any[];
}
export declare function CommonModule(options: CommonModuleOptions): (constructor: any) => void;
export interface CommonRoute {
    path: string;
    handlers?: any[];
    protocol?: string;
    load?: any;
}
export interface CommonRouterOptions {
    base?: string;
    routes?: CommonRoute[];
}
export declare function CommonRouter(options: CommonRouterOptions): (constructor: any) => void;
export declare function Property(meta: any, required?: boolean): (target: any, key: any) => void;
export declare function Hidden(target: any, key: any): void;
export declare function Relation(type: any, model: any, foreignKey?: string, primaryKey?: string, through?: any, keyThrough?: any): (target: any, key: any) => void;
export interface RemoteOptions {
    accepts?: any[];
    accessScopes?: any[];
    description?: string;
    http?: any;
    documented?: boolean;
    returns?: any;
}
export declare function Remote(options: RemoteOptions): (target: any, key: any) => void;
export declare function BeforeRemote(name: any): (target: any, key: any) => void;
export declare function AfterRemote(name: any): (target: any, key: any) => void;
export declare function Hook(name: any): (target: any, key: any) => void;
export declare function NotEnumerable(target: any, propertyKey: string): void;
export declare function Validation(validation: any, name: any, value: any): (target: any, key: any) => void;
export declare function Singleton(constructor: any): void;
export interface CommonControllerOptions {
    path: string;
}
export declare function CommonController(options: CommonControllerOptions | string): (constructor: any) => void;
export interface CommonRouteOptions {
    path?: string;
    middlewares?: any[];
}
export declare function Get(options?: CommonRouteOptions | string): (target: any, key: any) => void;
export declare function Post(options?: CommonRouteOptions | string): (target: any, key: any) => void;
export declare function Put(options?: CommonRouteOptions | string): (target: any, key: any) => void;
export declare function Delete(options?: CommonRouteOptions | string): (target: any, key: any) => void;
export declare function Patch(options?: CommonRouteOptions | string): (target: any, key: any) => void;

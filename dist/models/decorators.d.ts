export declare function CommonModel({name, base, idInjection, options, mixins, acls, settings, dao, dataSource, publish}: {
    name?: undefined;
    base?: string;
    idInjection?: boolean;
    options?: {
        validateUpsert: boolean;
    };
    mixins?: undefined[];
    acls?: undefined[];
    settings?: {};
    dao: any;
    dataSource: any;
    publish?: boolean;
}): (constructor: any) => void;
export declare function CommonModule({imports, models, middleware, declare}: {
    imports?: undefined[];
    models?: undefined[];
    middleware?: undefined[];
    declare?: undefined[];
}): (constructor: any) => void;
export declare function Property(meta: any): (target: any, key: any) => void;
export declare function Hidden(target: any, key: any): void;
export declare function Relation(type: any, model: any, foreignKey?: string, primaryKey?: string): (target: any, key: any) => void;
export declare function Remote({accepts, accessScopes, description, http, documented, returns}: {
    accepts?: undefined[];
    accessScopes?: undefined[];
    description?: string;
    http?: {};
    documented?: boolean;
    returns?: {};
}): (target: any, key: any) => void;
export declare function BeforeRemote(name: any): (target: any, key: any) => void;
export declare function AfterRemote(name: any): (target: any, key: any) => void;
export declare function Hook(name: any): (target: any, key: any) => void;
export declare function NotEnumerable(target: any, propertyKey: string): void;
export declare function Validation(validation: any, name: any, value: any): (target: any, key: any) => void;
export declare function Singleton(constructor: any): void;

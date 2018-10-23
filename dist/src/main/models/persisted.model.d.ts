import { BaseModel, BaseDao } from './base.model';
export declare class NotValidArgumentException extends Error {
    constructor();
}
export declare class PersistedDao extends BaseDao {
    ModelClass: typeof PersistedModel;
    count(where: any, options?: any, cb?: any): Promise<Number>;
    create<T extends BaseModel>(data: any, options?: any, cb?: any): Promise<Array<T>>;
    destroyAll(where: any, options?: any, cb?: any): Promise<any>;
    destroyById(id: any, options?: any, cb?: any): Promise<any>;
    exists(id: any, options?: any, cb?: any): Promise<boolean>;
    find<T extends BaseModel>(filter: any, options?: any, cb?: any): Promise<Array<T>>;
    findById<T extends BaseModel>(id: any, filter: any, options?: any, cb?: any): Promise<T>;
    findOne<T extends BaseModel>(filter: any, options?: any, cb?: any): Promise<T>;
    findOrCreate<T extends BaseModel>(filter: any, data: any, options?: any, cb?: any): Promise<T>;
    replaceById<T extends BaseModel>(id: any, data: any, options?: any, cb?: any): Promise<T>;
    replaceOrCreate<T extends BaseModel>(data: any, options?: any, cb?: any): Promise<T>;
    updateAll(where: any, data: any, options?: any, cb?: any): Promise<any>;
    upsert<T extends BaseModel>(data: any, options?: any, cb?: any): Promise<T>;
    upsertWithWhere<T extends BaseModel>(where: any, data: any, options?: any, cb?: any): Promise<T>;
    getInstance(instance: any, created?: boolean): any;
}
export declare class PersistedModel extends BaseModel {
    id: any;
    destroy(options?: any, cb?: any): Promise<void>;
    reload(cb?: any): Promise<this>;
    replaceAttributes(data: any, options: any, cb?: any): Promise<this>;
    save(options: any, cb?: any): Promise<this>;
    updateAttribute(name: any, value: any, options?: any, cb?: any): Promise<this>;
    updateAttributes(data: any, options?: any, cb?: any): Promise<this>;
    protected clone(instance: any, isCreated?: any): any;
}

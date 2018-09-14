import { Observable } from 'rxjs';
import { BaseModel, BaseDao } from './base.model';
export declare class KeyValueDao extends BaseDao {
    ModelClass: typeof KeyValueModel;
    expire(key: any, ttl: any, options?: any, cb?: any): Promise<void>;
    get<T extends KeyValueModel>(key: any, options?: any, cb?: any): Promise<T>;
    iterateKeys(filter: any, options?: any): Observable<any>;
    keys(filter: any, options?: any, cb?: any): Promise<any>;
    set(key: any, value: any, options?: any, cb?: any): Promise<void>;
    ttl(key: any, options: any, cb?: any): Promise<number>;
    getInstance(key: any, seed: any): KeyValueModel;
}
export declare class KeyValueModel extends BaseModel {
    key: any;
    value: any;
    get(name: any): any;
    save(options?: any, cb?: any): Promise<void>;
    destroy(options?: any, cb?: any): Promise<void>;
}

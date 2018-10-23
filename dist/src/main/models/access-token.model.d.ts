import { PersistedModel, PersistedDao } from './persisted.model';
export declare class AccessTokenDao extends PersistedDao {
    createAccessTokenId(cb?: any): Promise<string>;
    findForRequest<T extends AccessTokenModel>(req: any, options?: any, cb?: any): Promise<T>;
    getIdForRequest(req: any, options?: any): any;
    resolve<T extends AccessTokenModel>(id: any, cb?: any): Promise<T>;
}
export declare class AccessTokenModel extends PersistedModel {
    validate(cb?: any): Promise<boolean>;
}

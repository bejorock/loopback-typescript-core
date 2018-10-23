import { PersistedModel, PersistedDao } from './persisted.model';
export declare class RoleDao extends PersistedDao {
    getRoles(context: any, cb?: any): Promise<Array<any>>;
    isAuthenticated(context: any, cb?: any): Promise<boolean>;
    isInRole(role: any, context: any, cb?: any): Promise<boolean>;
    isOwner(modelClass: any, modelId: any, userId: any, principalType: any, options: any, cb?: any): Promise<boolean>;
    registerResolver(role: any, resolver: any): void;
}
export declare class RoleModel extends PersistedModel {
    readonly principals: PersistedDao;
}

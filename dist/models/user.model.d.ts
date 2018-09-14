import { PersistedDao, PersistedModel } from './persisted.model';
export declare class UserDao extends PersistedDao {
    changePassword(userId: any, oldPassword: any, newPassword: any, options: any, cb?: any): Promise<void>;
    confirm(userId: any, token: any, redirect: any, cb?: any): Promise<void>;
    generateVerificationToken<T extends PersistedModel>(user: any, options: any): Promise<T>;
    login(credentials: any, include: any): Promise<any>;
    logout(accessTokenID: any): Promise<void>;
    resetPassword(options: any, cb?: any): Promise<void>;
    setPassword(userId: any, newPassword: any, options: any, cb?: any): Promise<void>;
}
export declare class UserModel extends PersistedModel {
    changePassword(oldPassword: any, newPassword: any, options: any, cb?: any): Promise<void>;
    createAccessToken(data: any, options: any, cb?: any): Promise<any>;
    hasPassword(password: any, cb?: any): Promise<boolean>;
    setPassword(newPassword: any, options: any, cb?: any): Promise<void>;
    verify<T extends UserModel>(verifyOptions: any): Promise<T>;
}

import { ReactiveApp } from '../reactive.app';
import { Container } from 'inversify';
export declare function hideProperty(target: any, key: any): void;
export declare class BaseModel {
    model: any;
    dao: any;
    isCreated: any;
    configure(ignore?: any): void;
    on(eventName: any, cb: any): void;
    emit(eventName: any, ctx: any): void;
    readonly ds: any;
    readonly ctx: any;
    get(name: any): any;
}
export declare class BaseDao {
    dao: any;
    ModelClass: any;
    container: Container;
    ctx: ReactiveApp;
    compile(seed: any): any;
    on(eventName: any, cb: any): void;
    emit(eventName: any, ctx: any): void;
    protected readonly ds: any;
    protected readonly context: ReactiveApp;
    newInstance(seed: any, isCreated?: any, ignore?: any): any;
    private copyFunctions(target, source);
}

import 'reflect-metadata';
import { ReactiveApp } from '../reactive.app';
import { Container } from 'inversify';
import { BaseDao } from '../models/base.model';
export declare class Module {
    protected ctx: ReactiveApp;
    private container;
    private log;
    configure(parentContainer?: Container): void;
    loadModel(modelClass: any): void;
    loadProperties(modelClass: any): any;
    loadHidden(modelClass: any): any;
    loadRelations(modelClass: any): any;
    loadStaticRemoteMethod(daoClass: any, modelSeed: any): void;
    loadProtoRemoteMethod(modelClass: any, modelSeed: any, dao: BaseDao): void;
    loadBeforeRemoteHook(ctxClass: any, modelSeed: any, realDao: any): void;
    loadAfterRemoteHook(ctxClass: any, modelSeed: any, realDao: any): void;
    loadObserver(ctxClass: any, modelSeed: any, realDao: any): void;
    loadMiddleware(middlewareClass: any): void;
    loadRouter(routerClass: any): void;
    loadController(controllerClass: any): void;
    loadAll(m: any): void;
    applyMixin(modelClass: any, seed: any): void;
    getContainer(): Container;
    getContext(): ReactiveApp;
    static boot<T extends Module>(rootModule: new (ctx: any) => T, config: any, loopbackApp?: any): Promise<Module>;
}

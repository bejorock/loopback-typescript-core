"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const registry_1 = require("../boot/registry");
let BaseRouter = class BaseRouter {
    configure() {
        this._router = this.newRouter();
        this.routes.forEach(route => {
            let handlers = [];
            if (route.handlers) {
                route.handlers.forEach(handler => {
                    handlers.push(this.container.resolve(handler));
                });
            }
            let childRouter;
            if (route.load) {
                childRouter = this.container.resolve(route.load);
                childRouter.base = route.path;
                childRouter.container = this.container;
                let meta = registry_1.Registry.getProperty(route.load.name, 'meta');
                childRouter.routes = meta.routes;
                childRouter.configure();
            }
            if (route.protocol && handlers)
                handlers.forEach(handler => this._router[route.protocol](route.path, handler.onRequest));
            else if (handlers)
                handlers.forEach(handler => this._router.use(route.path, handler.onRequest));
            else if (childRouter)
                this._router.use(route.path, childRouter.onRoute);
        });
    }
    get onRoute() { return this._router; }
};
BaseRouter = __decorate([
    inversify_1.injectable()
], BaseRouter);
exports.BaseRouter = BaseRouter;
//# sourceMappingURL=base.router.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const registry_1 = require("../boot/registry");
let BaseRouter = class BaseRouter {
    configure() {
        this._router = this.newRouter();
        this.routes.forEach(route => {
            let handlers = [];
            let args = [];
            if (route.handlers) {
                route.handlers.forEach(handler => {
                    handlers.push(this.container.resolve(handler));
                });
                args.push(route.path);
                handlers.forEach(handler => {
                    args.push(function (vArgs) {
                        return __awaiter(this, arguments, void 0, function* () {
                            yield handler.onRequest.apply(handler, arguments);
                        });
                    });
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
            if (route.protocol && handlers.length > 0)
                this._router[route.protocol].apply(this._router, args);
            else if (handlers.length > 0)
                this._router.use.apply(this._router, args);
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
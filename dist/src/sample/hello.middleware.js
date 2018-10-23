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
const base_middleware_1 = require("../main/middleware/base.middleware");
const inversify_1 = require("inversify");
let HelloMiddleware = class HelloMiddleware extends base_middleware_1.Middleware {
    constructor() {
        super(...arguments);
        this.path = "/hello";
        this.protocol = "get";
    }
    onRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send('hello world');
        });
    }
};
HelloMiddleware = __decorate([
    inversify_1.injectable()
], HelloMiddleware);
exports.HelloMiddleware = HelloMiddleware;
//# sourceMappingURL=hello.middleware.js.map
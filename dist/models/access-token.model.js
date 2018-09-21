"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const persisted_model_1 = require("./persisted.model");
const decorators_1 = require("./decorators");
const inversify_1 = require("inversify");
let AccessTokenDao = class AccessTokenDao extends persisted_model_1.PersistedDao {
    createAccessTokenId(cb) {
        if (!cb)
            return new Promise((resolve, reject) => {
                this.ds.createAccessTokenId((err, token) => {
                    if (err)
                        reject(err);
                    else
                        resolve(token);
                });
            });
        this.ds.createAccessTokenId(cb);
        //return Promise.resolve(null)
    }
    findForRequest(req, options, cb) {
        options = (options ? options : {});
        if (!cb)
            return new Promise((resolve, reject) => {
                this.ds.findForRequest(req, options, (err, token) => {
                    if (err)
                        reject(err);
                    else
                        resolve(this.newInstance(token));
                });
            });
    }
    getIdForRequest(req, options) {
        return this.ds.getIdForRequest(req, options);
    }
    resolve(id, cb) {
        if (!cb)
            return new Promise((resolve, reject) => {
                this.ds.resolve(id, (err, resolved) => {
                    if (err)
                        reject(err);
                    else
                        resolve(this.newInstance(resolved));
                });
            });
        this.ds.resolve(id, cb);
        //return Promise.resolve(null)
    }
};
AccessTokenDao = __decorate([
    inversify_1.injectable()
], AccessTokenDao);
exports.AccessTokenDao = AccessTokenDao;
let AccessTokenModel = class AccessTokenModel extends persisted_model_1.PersistedModel {
    //ttl:number
    //created:Date
    //settings:any
    validate(cb) {
        if (!cb)
            return new Promise((resolve, reject) => {
                this.ctx.validate.call(this, (err, isValid) => {
                    if (err)
                        reject(err);
                    else
                        resolve(isValid);
                });
            });
        this.ctx.validate.call(this, cb);
        //return Promise.resolve(false)
    }
};
AccessTokenModel = __decorate([
    inversify_1.injectable(),
    decorators_1.CommonModel({
        name: "DefaultAccessToken",
        base: "PersistedModel",
        dao: AccessTokenDao,
        dataSource: "db",
        publish: false
    })
], AccessTokenModel);
exports.AccessTokenModel = AccessTokenModel;
//# sourceMappingURL=access-token.model.js.map
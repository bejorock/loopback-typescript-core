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
let RoleDao = class RoleDao extends persisted_model_1.PersistedDao {
    getRoles(context, cb) {
        if (!cb)
            return this.ds.getRoles(context);
        this.ds.getRoles(context, cb);
        return Promise.resolve(null);
    }
    isAuthenticated(context, cb) {
        if (!cb)
            return this.ds.isAuthenticated(context);
        this.ds.isAuthenticated(context, cb);
        return Promise.resolve(false);
    }
    isInRole(role, context, cb) {
        if (!cb)
            return this.ds.isInRole(role, context);
        this.ds.isInRole(role, context, cb);
        return Promise.resolve(false);
    }
    isOwner(modelClass, modelId, userId, principalType, options, cb) {
        if (!cb)
            return this.ds.isOwner(modelClass, modelId, userId, principalType, options);
        this.ds.isOwner(modelClass, modelId, userId, principalType, options, cb);
        return Promise.resolve(false);
    }
    registerResolver(role, resolver) {
        this.ds.registerResolver(role, resolver);
    }
};
RoleDao = __decorate([
    inversify_1.injectable()
], RoleDao);
exports.RoleDao = RoleDao;
// alson known as role mapping
let RoleModel = class RoleModel extends persisted_model_1.PersistedModel {
    get principals() { return this.ctx.principals; }
};
RoleModel = __decorate([
    inversify_1.injectable(),
    decorators_1.CommonModel({
        name: "DefaultRole",
        dao: RoleDao,
        dataSource: "db"
    })
], RoleModel);
exports.RoleModel = RoleModel;
//# sourceMappingURL=role.model.js.map
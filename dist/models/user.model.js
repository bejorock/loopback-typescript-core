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
let UserDao = class UserDao extends persisted_model_1.PersistedDao {
    changePassword(userId, oldPassword, newPassword, options, cb) {
        options = (options ? options : {});
        if (!cb)
            return this.ds.changePassword(userId, oldPassword, newPassword, options);
        this.ds.changePassword(userId, oldPassword, newPassword, options, cb);
        return Promise.resolve();
    }
    confirm(userId, token, redirect, cb) {
        if (!cb)
            return this.ds.confirm(userId, token, redirect);
        this.ds.confirm(userId, token, redirect, cb);
        return Promise.resolve();
    }
    generateVerificationToken(user, options) {
        return new Promise((resolve, reject) => {
            this.ds.generateVerificationToken(user, options, (err, instance) => {
                if (err) {
                    if (err instanceof Error)
                        reject(err);
                    else
                        resolve(err);
                }
                else if (instance)
                    resolve(this.newInstance(instance));
                else
                    resolve();
            });
        });
    }
    login(credentials, include) {
        return new Promise((resolve, reject) => {
            this.ds.login(credentials, include, (err, token) => {
                if (err)
                    reject(err);
                else
                    resolve(token);
            });
        });
    }
    logout(accessTokenID) {
        return new Promise((resolve, reject) => {
            this.ds.logout(accessTokenID, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    resetPassword(options, cb) {
        if (!cb)
            return this.ds.resetPassword(options);
        this.ds.resetPassword(options, cb);
        return Promise.resolve();
    }
    setPassword(userId, newPassword, options, cb) {
        if (!cb)
            return this.ds.setPassword(userId, newPassword, options);
        this.ds.setPassword(userId, newPassword, options, cb);
        return Promise.resolve();
    }
};
UserDao = __decorate([
    inversify_1.injectable()
], UserDao);
exports.UserDao = UserDao;
let UserModel = class UserModel extends persisted_model_1.PersistedModel {
    changePassword(oldPassword, newPassword, options, cb) {
        if (!cb)
            return this.ctx.changePassword.call(this, oldPassword, newPassword, options);
        this.ctx.changePassword.call(this, oldPassword, newPassword, options, cb);
        return Promise.resolve();
    }
    createAccessToken(data, options, cb) {
        if (!cb)
            return this.ctx.createAccessToken.call(this, data, options);
        this.ctx.createAccessToken.call(this, data, options, cb);
        return Promise.resolve();
    }
    hasPassword(password, cb) {
        if (!cb)
            return this.ctx.hasPassword.call(this, password);
        this.ctx.hasPassword.call(this, password, cb);
        return Promise.resolve(false);
    }
    setPassword(newPassword, options, cb) {
        if (!cb)
            return this.ctx.setPassword.call(this, newPassword, options);
        this.ctx.setPassword.call(this, newPassword, options, cb);
        return Promise.resolve();
    }
    verify(verifyOptions) {
        return new Promise((resolve, reject) => {
            this.ctx.verify.call(this, verifyOptions, (options, err, instance) => {
                if (err)
                    reject(err);
                else
                    resolve(this.clone(instance));
            });
        });
    }
};
UserModel = __decorate([
    inversify_1.injectable(),
    decorators_1.CommonModel({
        name: "DefaultUser",
        dao: UserDao,
        dataSource: "db"
    })
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map
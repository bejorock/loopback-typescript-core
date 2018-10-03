"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const base_model_1 = require("./base.model");
const inversify_1 = require("inversify");
const decorators_1 = require("./decorators");
class NotValidArgumentException extends Error {
    constructor() {
        super('arguments not valid or empty');
    }
}
exports.NotValidArgumentException = NotValidArgumentException;
let PersistedDao = class PersistedDao extends base_model_1.BaseDao {
    constructor() {
        super(...arguments);
        this.ModelClass = PersistedModel;
    }
    count(where, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        where = (where ? where : {});
        if (cb) {
            this.ds.count(where, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.count(where, options, (err, count) => {
                    if (err)
                        reject(err);
                    else
                        resolve(count);
                });
            });
        }
    }
    create(data, options, cb) {
        if (!data)
            throw new NotValidArgumentException();
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (cb) {
            this.ds.create(data, options, (err, model) => {
                if (err)
                    return cb(err);
                cb(null, this.getInstance(model));
            });
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.create(data, options, (err, models) => {
                    if (err)
                        reject(err);
                    else if (!models)
                        resolve(null);
                    else if (_.isEmpty(models))
                        resolve(models);
                    else if (Array.isArray(models))
                        resolve(models.map(m => this.getInstance(m)));
                    else
                        resolve([this.getInstance(models)]);
                });
            });
        }
    }
    destroyAll(where, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        where = (where ? where : {});
        if (cb) {
            this.ds.destroyAll(where, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.destroyAll(where, options, (err, info, count) => {
                    if (err)
                        reject(err);
                    else
                        resolve({ info, count });
                });
            });
        }
    }
    destroyById(id, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (cb) {
            this.ds.destroyById(id, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.destroyById(id, options, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve(id);
                });
            });
        }
    }
    exists(id, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (cb) {
            this.ds.exists(id, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.exists(id, options, (err, exists) => {
                    if (err)
                        reject(err);
                    else
                        resolve(exists);
                });
            });
        }
    }
    find(filter, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        filter = (filter ? filter : {});
        if (cb) {
            this.ds.find(filter, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.find(filter, (err, instances) => {
                    if (err)
                        reject(err);
                    else
                        resolve(instances.map(i => this.getInstance(i)));
                });
            });
        }
    }
    findById(id, filter, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        filter = (filter ? filter : {});
        if (cb) {
            this.ds.findById(id, filter, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.findById(id, filter, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.getInstance(instance));
                });
            });
        }
    }
    findOne(filter, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        filter = (filter ? filter : {});
        if (cb) {
            this.ds.findOne(filter, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.findOne(filter, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.getInstance(instance));
                });
            });
        }
    }
    findOrCreate(filter, data, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        filter = (filter ? filter : {});
        if (cb) {
            this.ds.findOrCreate(filter, data, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.findOrCreate(filter, data, options, (err, instance, created) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.getInstance(instance, created));
                });
            });
        }
    }
    replaceById(id, data, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (cb) {
            this.ds.replaceById(id, data, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.replaceById(id, data, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.getInstance(instance));
                });
            });
        }
    }
    replaceOrCreate(data, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (cb) {
            this.ds.replaceOrCreate(data, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.replaceOrCreate(data, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.getInstance(instance));
                });
            });
        }
    }
    updateAll(where, data, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        where = (where ? where : {});
        if (cb) {
            this.ds.updateAll(where, data, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.updateAll(where, data, options, (err, info, count) => {
                    if (err)
                        reject(err);
                    else
                        resolve({ info, count });
                });
            });
        }
    }
    upsert(data, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (cb) {
            this.ds.upsert(data, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.upsert(data, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.getInstance(instance));
                });
            });
        }
    }
    upsertWithWhere(where, data, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        where = (where ? where : {});
        if (cb) {
            this.ds.upsertWithWhere(where, data, options, cb);
            //return Promise.resolve(null)
        }
        else {
            return new Promise((resolve, reject) => {
                this.ds.upsertWithWhere(where, data, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.getInstance(instance));
                });
            });
        }
    }
    getInstance(instance, created) {
        let tmp = this.newInstance(instance, created);
        tmp.id = instance.id;
        return tmp;
    }
};
PersistedDao = __decorate([
    inversify_1.injectable()
], PersistedDao);
exports.PersistedDao = PersistedDao;
let PersistedModel = class PersistedModel extends base_model_1.BaseModel {
    /*constructor(model:any, dao:any, isCreated?:boolean) {
        super(model, dao)
        this.id = model.id
        this.isCreated = isCreated
    }*/
    destroy(options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (cb) {
            this.ctx.destroy.call(this, options, cb);
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            this.ctx.destroy.call(this, options, () => {
                resolve();
            });
        });
    }
    reload(cb) {
        if (cb) {
            this.ctx.reload.call(this, cb);
            return Promise.resolve(this);
        }
        else {
            return new Promise((resolve, reject) => {
                this.ctx.reload.call(this, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.clone(instance));
                });
            });
        }
    }
    replaceAttributes(data, options, cb) {
        options = (options ? options : {});
        if (cb) {
            this.ctx.replaceAttributes.call(this, data, options, cb);
            return Promise.resolve(this);
        }
        else {
            return new Promise((resolve, reject) => {
                this.ctx.replaceAttributes.call(this, data, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.clone(instance));
                });
            });
        }
    }
    save(options, cb) {
        options = (options ? options : {});
        if (cb) {
            this.ctx.save.call(this, options, cb);
            return Promise.resolve(this);
        }
        else {
            return new Promise((resolve, reject) => {
                this.ctx.save.call(this, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.clone(instance));
                });
            });
        }
    }
    updateAttribute(name, value, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (cb) {
            this.ctx.updateAttribute.call(this, name, value, options, cb);
            return Promise.resolve(this);
        }
        else {
            return new Promise((resolve, reject) => {
                this.ctx.updateAttribute.call(this, name, value, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.clone(instance));
                });
            });
        }
    }
    updateAttributes(data, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (cb) {
            this.ctx.updateAttributes.call(this, data, options, cb);
            return Promise.resolve(this);
        }
        else {
            return new Promise((resolve, reject) => {
                this.ctx.updateAttributes.call(this, data, options, (err, instance) => {
                    if (err)
                        reject(err);
                    else if (!instance)
                        resolve(null);
                    else
                        resolve(this.clone(instance));
                });
            });
        }
    }
    clone(instance, isCreated) { return this.dao.getInstance(instance, isCreated); }
};
PersistedModel = __decorate([
    inversify_1.injectable(),
    decorators_1.CommonModel({
        name: "Persisted",
        dao: PersistedDao,
        dataSource: "db"
    })
], PersistedModel);
exports.PersistedModel = PersistedModel;
//export const definition = (<any>PersistedModel).getModelDefinition()
//export const dao = PersistedDao
//# sourceMappingURL=persisted.model.js.map
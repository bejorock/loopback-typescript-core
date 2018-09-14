"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("./base.model");
const inversify_1 = require("inversify");
let KeyValueDao = class KeyValueDao extends base_model_1.BaseDao {
    constructor() {
        super(...arguments);
        this.ModelClass = KeyValueModel;
    }
    expire(key, ttl, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.ds.expire(key, ttl);
        this.ds.expire(key, ttl, cb);
        //return Promise.resolve()
    }
    get(key, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.ds.get(key, options).then(instance => this.getInstance(key, instance));
        //this.ds.get(key, options, cb).then(instance => this.newInstance(key, instance))
        //return Promise.resolve(null)
        this.ds.get(key, options, (err, model) => {
            cb(err, this.newInstance(key, model));
        });
    }
    iterateKeys(filter, options) {
        return this.ds.iterateKeys(filter);
    }
    keys(filter, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.ds.keys(filter);
        this.ds.keys(filter, cb);
        //return Promise.resolve(null)
    }
    set(key, value, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.ds.set(key, value, options);
        this.ds.set(key, value, options, cb);
        //return Promise.resolve()
    }
    ttl(key, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.ds.ttl(key, options);
        this.ds.ttl(key, options, cb);
        //return Promise.resolve(0)
    }
    getInstance(key, seed) {
        let tmp = this.newInstance(seed, false, true);
        tmp.key = key;
        tmp.value = seed;
        return tmp;
    }
};
KeyValueDao = __decorate([
    inversify_1.injectable()
], KeyValueDao);
exports.KeyValueDao = KeyValueDao;
let KeyValueModel = class KeyValueModel extends base_model_1.BaseModel {
    /*constructor(key, model, dao, isCreated?) {
        super(model, dao, true)
        this.key = key
        this.isCreated = isCreated
        this.value = model
    }*/
    get(name) { return this.ctx[name]; }
    save(options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.ds.set(this.key, this.ctx);
        this.ds.set(this.key, this.ctx, cb);
        //return Promise.resolve()
    }
    destroy(options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.ds.getContext().delete(this.key);
        this.ds.getContext().delete(this.key, cb);
        return Promise.resolve();
    }
};
KeyValueModel = __decorate([
    inversify_1.injectable()
], KeyValueModel);
exports.KeyValueModel = KeyValueModel;
//# sourceMappingURL=key-value.model.js.map
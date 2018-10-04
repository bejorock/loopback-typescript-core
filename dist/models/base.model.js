"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const reactive_app_1 = require("../reactive.app");
const inversify_1 = require("inversify");
const registry_1 = require("../boot/registry");
function hideProperty(target, key) {
    let descriptor = Object.getOwnPropertyDescriptor(target, key) || {};
    if (descriptor.enumerable != false) {
        descriptor.enumerable = false;
        Object.defineProperty(target, key, descriptor);
    }
}
exports.hideProperty = hideProperty;
let BaseModel = class BaseModel {
    /*constructor(model, dao, ignore?) {
        this.model = model
        this.dao = dao
    }*/
    configure(ignore) {
        hideProperty(this, 'model');
        hideProperty(this, 'dao');
        let relations = registry_1.Registry.getProperty(this.constructor.name, 'relations');
        for (let key in this.model) {
            if (key !== 'id' && typeof this.model[key] !== 'function') {
                if (ignore) {
                    if (key.startsWith('__'))
                        this[key] = this.model[key];
                }
                else
                    this[key] = this.model[key];
                if (key.startsWith('__'))
                    hideProperty(this, key);
            }
            else if (relations[key]) {
                this[key] = this.model[key]();
            }
        }
    }
    on(eventName, cb) {
        this.dao.on(eventName, cb);
    }
    emit(eventName, ctx) {
        this.dao.emit(eventName, ctx);
    }
    onInit() { }
    get ds() { return this.dao; }
    get ctx() { return this.model; }
    get(name) { return this.model[name]; }
};
BaseModel = __decorate([
    inversify_1.injectable()
], BaseModel);
exports.BaseModel = BaseModel;
let BaseDao = class BaseDao {
    compile(seed) {
        this.copyFunctions(seed, this.constructor);
        return seed;
    }
    on(eventName, cb) {
        this.dao.on(eventName, cb);
    }
    emit(eventName, ctx) {
        this.dao.emit(eventName, ctx);
    }
    onInit() { }
    get ds() { return this.dao; }
    get context() { return this.ctx; }
    newInstance(seed, isCreated, ignore) {
        let tmp = this.container.resolve(this.ModelClass);
        tmp.model = seed;
        tmp.isCreated = isCreated;
        tmp.dao = this.ds;
        tmp.configure(ignore);
        tmp.onInit();
        // hide enumerable
        let enumerable = registry_1.Registry.getProperty(this.ModelClass.name, 'enumerable');
        for (let key in enumerable)
            hideProperty(tmp, key);
        return tmp;
    }
    copyFunctions(target, source) {
        let self = this;
        let properties = Object.getOwnPropertyNames(source.prototype);
        properties.forEach(key => {
            if (typeof source.prototype[key] === 'function' && key !== 'constructor' && key !== 'compile' && key != 'on' && key !== 'emit') {
                //console.log('copy function ' + key)
                target[key] = function (args) {
                    return source.prototype[key].apply(self, arguments);
                };
            }
        });
        let baseClass = Object.getPrototypeOf(source);
        if (!_.isEmpty(baseClass.name))
            this.copyFunctions(target, baseClass);
    }
};
__decorate([
    inversify_1.inject(reactive_app_1.ReactiveApp),
    __metadata("design:type", reactive_app_1.ReactiveApp)
], BaseDao.prototype, "ctx", void 0);
BaseDao = __decorate([
    inversify_1.injectable()
], BaseDao);
exports.BaseDao = BaseDao;
//# sourceMappingURL=base.model.js.map
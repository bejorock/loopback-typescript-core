"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const registry_1 = require("../boot/registry");
function CommonModel(options) {
    return function (constructor) {
        let definition = registry_1.Registry.getProperty(constructor.name, 'definition');
        let methods = registry_1.Registry.getProperty(constructor.name, 'methods');
        let defaultOptions = Object.assign({
            base: 'PersistedModel',
            idInjection: true,
            options: {
                validateUpsert: true
            },
            mixins: [],
            acls: [],
            settings: {},
            publish: true
        }, options);
        Object.assign(definition, { base: defaultOptions.base, idInjection: defaultOptions.idInjection, options: defaultOptions.options, mixins: {}, acls: defaultOptions.acls }, defaultOptions.settings);
        definition.name = defaultOptions.name || constructor.name;
        methods.getModelDefinition = () => definition;
        methods.getDaoClass = () => defaultOptions.dao;
        methods.getDataSourceName = () => defaultOptions.dataSource;
        methods.getMixins = () => defaultOptions.mixins;
        methods.isPublish = () => defaultOptions.publish;
    };
}
exports.CommonModel = CommonModel;
function CommonModule(options) {
    return function (constructor) {
        let meta = registry_1.Registry.getProperty(constructor.name, 'meta');
        let defaultOptions = Object.assign({ imports: [], models: [], middleware: [], declare: [] }, options);
        meta.imports = defaultOptions.imports;
        meta.models = defaultOptions.models;
        meta.middleware = defaultOptions.middleware;
        meta.declare = defaultOptions.declare;
    };
}
exports.CommonModule = CommonModule;
function Property(meta) {
    if (typeof meta === 'string')
        meta = { type: meta };
    return function (target, key) {
        let properties = registry_1.Registry.getProperty(target.constructor.name, 'properties');
        properties[key] = meta;
    };
}
exports.Property = Property;
function Hidden(target, key) {
    let hidden = registry_1.Registry.getProperty(target.constructor.name, 'hidden', []);
    hidden.push(key);
}
exports.Hidden = Hidden;
function Relation(type, model, foreignKey = "", primaryKey = "") {
    return function (target, key) {
        let relations = registry_1.Registry.getProperty(target.constructor.name, 'relations');
        relations[key] = { type, model, foreignKey };
    };
}
exports.Relation = Relation;
function Remote(options) {
    let defaultOptions = Object.assign({
        accepts: [],
        accessScopes: [],
        description: '',
        http: {},
        documented: true,
        returns: {}
    }, options);
    return function (target, key) {
        let remotes = registry_1.Registry.getProperty(target.constructor.name, 'remotes');
        let tmp = { accepts: defaultOptions.accepts, http: defaultOptions.http, returns: defaultOptions.returns, documented: defaultOptions.documented };
        if (defaultOptions.accessScopes.length > 0)
            Object.assign(tmp, { accessScopes: defaultOptions.accessScopes });
        if (!_.isEmpty(defaultOptions.description))
            Object.assign(tmp, { description: defaultOptions.description });
        remotes[key] = tmp;
    };
}
exports.Remote = Remote;
function BeforeRemote(name) {
    return function (target, key) {
        let hooks = registry_1.Registry.getProperty(target.constructor.name, 'beforeRemoteHooks');
        hooks[name] = key;
    };
}
exports.BeforeRemote = BeforeRemote;
function AfterRemote(name) {
    return function (target, key) {
        let hooks = registry_1.Registry.getProperty(target.constructor.name, 'afterRemoteHooks');
        hooks[name] = key;
    };
}
exports.AfterRemote = AfterRemote;
function Hook(name) {
    return function (target, key) {
        let hooks = registry_1.Registry.getProperty(target.constructor.name, 'observer');
        hooks[name] = key;
    };
}
exports.Hook = Hook;
// only works for model class
function NotEnumerable(target, propertyKey) {
    let enumerable = registry_1.Registry.getProperty(target.constructor.name, 'enumerable');
    enumerable[propertyKey] = false;
}
exports.NotEnumerable = NotEnumerable;
function Validation(validation, name, value) {
    return function (target, key) {
    };
}
exports.Validation = Validation;
function Singleton(constructor) {
    let info = registry_1.Registry.getProperty(constructor.name, 'info');
    info.singleton = true;
}
exports.Singleton = Singleton;
//# sourceMappingURL=decorators.js.map
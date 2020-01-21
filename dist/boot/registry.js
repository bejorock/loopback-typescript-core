"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Registry {
    static set(className, property, meta) {
        this.classMeta[className] = this.classMeta[className] || {};
        let classRegistry = this.classMeta[className];
        classRegistry[property] = meta;
    }
    static get(className, property) {
        this.classMeta[className] = this.classMeta[className] || {};
        let classRegistry = this.classMeta[className];
        return classRegistry[property];
    }
    static getRegistry(className) {
        this.classMeta[className] = this.classMeta[className] || {};
        return this.classMeta[className];
    }
    static getProperty(className, property, initialValue = {}) {
        let registry = this.getRegistry(className);
        registry[property] = registry[property] || initialValue;
        return registry[property];
    }
}
exports.Registry = Registry;
Registry.classMeta = {};
//# sourceMappingURL=registry.js.map
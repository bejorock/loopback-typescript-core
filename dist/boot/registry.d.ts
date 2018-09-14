export declare class Registry {
    static classMeta: {};
    static set(className: any, property: any, meta: any): void;
    static get(className: any, property: any): any;
    static getRegistry(className: any): any;
    static getProperty(className: any, property: any, initialValue?: {}): any;
}

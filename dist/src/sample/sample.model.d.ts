import { PersistedModel, PersistedDao } from '../main/models/persisted.model';
export declare class SampleDao extends PersistedDao {
    ModelClass: typeof SampleModel;
    greet(msg: any): Promise<string>;
    logGreet(ctx: any): Promise<boolean>;
    logGreetAgain(ctx: any): Promise<boolean>;
    onAccess(ctx: any): Promise<boolean>;
}
export declare class SampleModel extends PersistedModel {
    name: any;
    age: any;
    hiddenProperty: any;
    greet(msg: any, cb: any): void;
}

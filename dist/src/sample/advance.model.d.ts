import { SampleModel, SampleDao } from './sample.model';
import { Vehicle } from './vehicle';
export declare class AdvanceDao extends SampleDao {
    ModelClass: typeof AdvanceModel;
}
export declare class AdvanceModel extends SampleModel {
    advanceProperty: any;
    car: Vehicle;
    drive(msg: any): string;
}

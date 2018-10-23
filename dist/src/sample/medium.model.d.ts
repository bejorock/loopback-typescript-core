import { AdvanceDao, AdvanceModel } from './advance.model';
export declare class MediumDao extends AdvanceDao {
    ModelClass: typeof MediumModel;
}
export declare class MediumModel extends AdvanceModel {
    mediumProperty: any;
}

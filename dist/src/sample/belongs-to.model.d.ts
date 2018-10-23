import { PersistedModel, PersistedDao } from '../main/models/persisted.model';
export declare class BelongsToDao extends PersistedDao {
    ModelClass: typeof BelongsToModel;
}
export declare class BelongsToModel extends PersistedModel {
    advanceId: any;
    advance: any;
}

import { PersistedModel, PersistedDao } from '../main/models/persisted.model';
import { CommonModel, Property, Relation } from '../main/models/decorators';
import { injectable } from 'inversify';

@injectable()
export class BelongsToDao extends PersistedDao
{
	ModelClass = BelongsToModel
}

@injectable()
@CommonModel({
	base: "PersistedModel",
	dao: BelongsToDao,
	dataSource: "db"
})
export class BelongsToModel extends PersistedModel
{
	@Property("number")
	advanceId

	@Relation("belongsTo", "AdvanceModel", "advanceId")
	advance
}
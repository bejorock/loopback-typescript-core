import { SampleDao } from "../../spec/server/models/SampleModel";
import { SampleModel } from './sample.model';
import { CommonModel, Property } from '../main/models/decorators';
import { AdvanceDao, AdvanceModel } from './advance.model';
import { injectable } from "inversify";

@injectable()
export class MediumDao extends AdvanceDao
{
	ModelClass = MediumModel
}

@injectable()
@CommonModel({
	dao: MediumDao,
	dataSource: "db"
})
export class MediumModel extends AdvanceModel
{
	@Property('string')
	mediumProperty
}
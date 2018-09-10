import { SampleModel, SampleDao } from './sample.model';
import { CommonModel, Property, Relation, Remote, NotEnumerable } from '../main/models/decorators';
import { injectable, inject } from 'inversify';
import { Vehicle } from './vehicle';

@injectable()
export class AdvanceDao extends SampleDao
{
	ModelClass = AdvanceModel
}

@injectable()
@CommonModel({
	base: "PersistedModel",
	dao: AdvanceDao,
	dataSource: "db"
})
export class AdvanceModel extends SampleModel
{
	@Property('string')
	advanceProperty

	@inject(Vehicle) 
	car:Vehicle

	@Remote({
		accepts: [{arg: 'msg', type: 'string'}],
		returns: [{arg: 'greeting', type: 'string'}]
	})
	drive(msg) {
		return `${this.name}:${this.id} drive a ${this.car.name} by ${this.car.manufacturer} and singing ${msg}`
	}
}
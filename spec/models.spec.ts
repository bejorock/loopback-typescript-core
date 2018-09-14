import { CommonModule, CommonModel, Property } from "../src/main/models/decorators";
import Module from '../src/main/boot/module';
import { PersistedModel, PersistedDao } from '../src/main/models/persisted.model';
import { injectable } from "inversify";
import path from 'path';

@injectable()
class TestPersistedDao extends PersistedDao
{
	ModelClass = TestPersistedModel
}

@injectable()
@CommonModel({
	dao: TestPersistedDao,
	dataSource: 'db'
})
class TestPersistedModel extends PersistedModel
{
	@Property('string')
	firstName

	@Property('string')
	lastName
}

@CommonModule({
	models: [TestPersistedModel]
})
class TestModule extends Module
{

}

describe("boot models", async () => {

	let testModule:Module
	let dao:PersistedDao

	Module.boot(TestModule, path.resolve(__dirname, '../src/resources')).then(m => testModule = m)

	beforeEach((done) => {
		testModule.getContainer().snapshot()
		dao = testModule.getContainer().get(TestPersistedDao)

		done()
	})

	afterEach((done) => {
		dao = undefined
		testModule.getContext().getParentContext().dataSources.db.automigrate(function(err) {
			testModule.getContainer().restore()
			done();
		});
	})

	it("test persisted count", (done) => {
		dao.create([
			{firstName:'bejo', lastName: 'rock1'},
			{firstName:'bejo', lastName: 'rock2'},
			{firstName:'bejo', lastName: 'rock3'},
			{firstName:'bejo', lastName: 'rock4'}
		]).then(models => {
			dao.count({}).then(info => {
				expect(info).toBe(models.length)
				dao.count({lastName: 'rock2'}).then(info2 => {
					expect(info2).toBe(1)
					done()
				})
			})
		})
	})

	it("test persisted create", (done) => {
		dao.create({firstName: 'bejo', lastName: 'rock'}).then((models:TestPersistedModel[]) => {
			expect(models.length).toBe(1)
			expect(models[0].firstName).toBe('bejo')
			expect(models[0].lastName).toBe('rock')

			done()
		})
	})

	it("test persisted destroyAll", (done) => {
		dao.create([
			{firstName:'bejo', lastName: 'rock1'},
			{firstName:'bejo', lastName: 'rock2'},
			{firstName:'bejo1', lastName: 'rock3'},
			{firstName:'bejo1', lastName: 'rock4'}
		]).then(models => {
			dao.destroyAll({firstName:'bejo1'}).then(() => {
				dao.count({}).then(info => {
					expect(info).toBe(2)
					dao.destroyAll({}).then(() => {
						dao.count({}).then(info2 => {
							expect(info2).toBe(0)

							done()
						})
					})
				})
			})
		})
	})

	it("test persisted destroyById", (done) => {
		dao.create({firstName: 'bejo', lastName: 'rock'}).then((models:TestPersistedModel[]) => {
			dao.destroyById(models[0].id).then(() => {
				dao.count({}).then(info => {
					expect(info).toBe(0)
					done()
				})
			})
		})
	})

	it("test presisted exists", (done) => {
		dao.create({firstName: 'bejo', lastName: 'rock'}).then((models:TestPersistedModel[]) => {
			dao.exists(models[0].id).then((isExists) => {
				expect(isExists).toBe(true)
				done()
			})
		})
	})

	it("test persisted find", (done) => {
		dao.create([
			{firstName:'bejo', lastName: 'rock1'},
			{firstName:'bejo', lastName: 'rock2'},
			{firstName:'bejo1', lastName: 'rock3'},
			{firstName:'bejo1', lastName: 'rock4'}
		]).then(models => {
			dao.find({}).then(foundModels => {
				expect(foundModels.length).toBe(4)
				dao.find({where: {firstName: 'bejo'}}).then(foundModels2 => {
					expect(foundModels2.length).toBe(2)
					done()
				})
			})
		})
	})

	it("test persisted findById", (done) => {
		dao.create({firstName: 'bejo', lastName: 'rock'}).then((models:TestPersistedModel[]) => {
			dao.findById(models[0].id, {}).then((model:TestPersistedModel) => {
				expect(model.firstName).toBe('bejo')
				done()
			})
		})
	})

	it("test persisted findOne", (done) => {
		dao.create({firstName: 'bejo', lastName: 'rock'}).then((models:TestPersistedModel[]) => {
			dao.findOne({firstName: models[0].firstName}).then((model:TestPersistedModel) => {
				expect(model.lastName).toBe('rock')
				done()
			})
		})
	})

	it("test persisted findOrCreate", (done) => {
		dao.findOrCreate({firstName: 'bejo'}, {firstName: 'bejo', lastName: 'rock'}).then((model:TestPersistedModel) => {
			expect(model.isCreated).toBe(true)
			done()
		})
	})

	it("test persisted replaceById", (done) => {
		dao.create({firstName: 'bejo', lastName: 'rock'}).then((models:TestPersistedModel[]) => {
			dao.replaceById(models[0].id, {firstName: 'bejo2', lastName: 'rock'}).then((model:TestPersistedModel) => {
				expect(model.firstName).toBe('bejo2')
				done()
			})
		})
	})

	it("test persisted replaceOrCreate", (done) => {
		dao.replaceOrCreate({firstName: 'bejo', lastName: 'rock'}).then((model:TestPersistedModel) => {
			expect(model.firstName).toBe('bejo')
			done()
		})
	})

	it("test persisted updateAll", (done) => {
		dao.create({firstName: 'bejo', lastName: 'rock'}).then((models:TestPersistedModel[]) => {
			dao.updateAll({firstName: 'bejo'}, {firstName: 'bejo1', lastName: 'rock'}).then(() => {
				dao.findOne({}).then((model:TestPersistedModel) => {
					expect(model.firstName).toBe('bejo1')
					done()
				})
			})
		})
	})

	it("test persisted upsert", (done) => {
		dao.upsert({firstName: 'bejo', lastName: 'rock'}).then((model:TestPersistedModel) => {
			expect(model.firstName).toBe('bejo')
			done()
		})
	})

	it("test persisted upsertWithWhere", (done) => {
		dao.upsertWithWhere({firstName: 'bejo'}, {firstName: 'bejo', lastName: 'rock'}).then((model:TestPersistedModel) => {
			expect(model.firstName).toBe('bejo')
			done()
		})
	})

})
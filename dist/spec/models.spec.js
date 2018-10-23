"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../src/main/models/decorators");
const module_1 = __importDefault(require("../src/main/boot/module"));
const persisted_model_1 = require("../src/main/models/persisted.model");
const inversify_1 = require("inversify");
const path_1 = __importDefault(require("path"));
let TestPersistedDao = class TestPersistedDao extends persisted_model_1.PersistedDao {
    constructor() {
        super(...arguments);
        this.ModelClass = TestPersistedModel;
    }
};
TestPersistedDao = __decorate([
    inversify_1.injectable()
], TestPersistedDao);
let TestPersistedModel = class TestPersistedModel extends persisted_model_1.PersistedModel {
};
__decorate([
    decorators_1.Property('string'),
    __metadata("design:type", Object)
], TestPersistedModel.prototype, "firstName", void 0);
__decorate([
    decorators_1.Property('string'),
    __metadata("design:type", Object)
], TestPersistedModel.prototype, "lastName", void 0);
TestPersistedModel = __decorate([
    inversify_1.injectable(),
    decorators_1.CommonModel({
        dao: TestPersistedDao,
        dataSource: 'db'
    })
], TestPersistedModel);
let TestModule = class TestModule extends module_1.default {
};
TestModule = __decorate([
    decorators_1.CommonModule({
        models: [TestPersistedModel]
    })
], TestModule);
describe("boot models", () => __awaiter(this, void 0, void 0, function* () {
    let testModule;
    let dao;
    module_1.default.boot(TestModule, path_1.default.resolve(__dirname, '../src/resources')).then(m => testModule = m);
    beforeEach((done) => {
        testModule.getContainer().snapshot();
        dao = testModule.getContainer().get(TestPersistedDao);
        done();
    });
    afterEach((done) => {
        dao = undefined;
        testModule.getContext().getParentContext().dataSources.db.automigrate(function (err) {
            testModule.getContainer().restore();
            done();
        });
    });
    it("test persisted count", (done) => {
        dao.create([
            { firstName: 'bejo', lastName: 'rock1' },
            { firstName: 'bejo', lastName: 'rock2' },
            { firstName: 'bejo', lastName: 'rock3' },
            { firstName: 'bejo', lastName: 'rock4' }
        ]).then(models => {
            dao.count({}).then(info => {
                expect(info).toBe(models.length);
                dao.count({ lastName: 'rock2' }).then(info2 => {
                    expect(info2).toBe(1);
                    done();
                });
            });
        });
    });
    it("test persisted create", (done) => {
        dao.create({ firstName: 'bejo', lastName: 'rock' }).then((models) => {
            expect(models.length).toBe(1);
            expect(models[0].firstName).toBe('bejo');
            expect(models[0].lastName).toBe('rock');
            done();
        });
    });
    it("test persisted destroyAll", (done) => {
        dao.create([
            { firstName: 'bejo', lastName: 'rock1' },
            { firstName: 'bejo', lastName: 'rock2' },
            { firstName: 'bejo1', lastName: 'rock3' },
            { firstName: 'bejo1', lastName: 'rock4' }
        ]).then(models => {
            dao.destroyAll({ firstName: 'bejo1' }).then(() => {
                dao.count({}).then(info => {
                    expect(info).toBe(2);
                    dao.destroyAll({}).then(() => {
                        dao.count({}).then(info2 => {
                            expect(info2).toBe(0);
                            done();
                        });
                    });
                });
            });
        });
    });
    it("test persisted destroyById", (done) => {
        dao.create({ firstName: 'bejo', lastName: 'rock' }).then((models) => {
            dao.destroyById(models[0].id).then(() => {
                dao.count({}).then(info => {
                    expect(info).toBe(0);
                    done();
                });
            });
        });
    });
    it("test presisted exists", (done) => {
        dao.create({ firstName: 'bejo', lastName: 'rock' }).then((models) => {
            dao.exists(models[0].id).then((isExists) => {
                expect(isExists).toBe(true);
                done();
            });
        });
    });
    it("test persisted find", (done) => {
        dao.create([
            { firstName: 'bejo', lastName: 'rock1' },
            { firstName: 'bejo', lastName: 'rock2' },
            { firstName: 'bejo1', lastName: 'rock3' },
            { firstName: 'bejo1', lastName: 'rock4' }
        ]).then(models => {
            dao.find({}).then(foundModels => {
                expect(foundModels.length).toBe(4);
                dao.find({ where: { firstName: 'bejo' } }).then(foundModels2 => {
                    expect(foundModels2.length).toBe(2);
                    done();
                });
            });
        });
    });
    it("test persisted findById", (done) => {
        dao.create({ firstName: 'bejo', lastName: 'rock' }).then((models) => {
            dao.findById(models[0].id, {}).then((model) => {
                expect(model.firstName).toBe('bejo');
                done();
            });
        });
    });
    it("test persisted findOne", (done) => {
        dao.create({ firstName: 'bejo', lastName: 'rock' }).then((models) => {
            dao.findOne({ firstName: models[0].firstName }).then((model) => {
                expect(model.lastName).toBe('rock');
                done();
            });
        });
    });
    it("test persisted findOrCreate", (done) => {
        dao.findOrCreate({ firstName: 'bejo' }, { firstName: 'bejo', lastName: 'rock' }).then((model) => {
            expect(model.isCreated).toBe(true);
            done();
        });
    });
    it("test persisted replaceById", (done) => {
        dao.create({ firstName: 'bejo', lastName: 'rock' }).then((models) => {
            dao.replaceById(models[0].id, { firstName: 'bejo2', lastName: 'rock' }).then((model) => {
                expect(model.firstName).toBe('bejo2');
                done();
            });
        });
    });
    it("test persisted replaceOrCreate", (done) => {
        dao.replaceOrCreate({ firstName: 'bejo', lastName: 'rock' }).then((model) => {
            expect(model.firstName).toBe('bejo');
            done();
        });
    });
    it("test persisted updateAll", (done) => {
        dao.create({ firstName: 'bejo', lastName: 'rock' }).then((models) => {
            dao.updateAll({ firstName: 'bejo' }, { firstName: 'bejo1', lastName: 'rock' }).then(() => {
                dao.findOne({}).then((model) => {
                    expect(model.firstName).toBe('bejo1');
                    done();
                });
            });
        });
    });
    it("test persisted upsert", (done) => {
        dao.upsert({ firstName: 'bejo', lastName: 'rock' }).then((model) => {
            expect(model.firstName).toBe('bejo');
            done();
        });
    });
    it("test persisted upsertWithWhere", (done) => {
        dao.upsertWithWhere({ firstName: 'bejo' }, { firstName: 'bejo', lastName: 'rock' }).then((model) => {
            expect(model.firstName).toBe('bejo');
            done();
        });
    });
}));
//# sourceMappingURL=models.spec.js.map
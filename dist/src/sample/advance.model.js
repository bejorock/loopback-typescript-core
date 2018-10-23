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
Object.defineProperty(exports, "__esModule", { value: true });
const sample_model_1 = require("./sample.model");
const decorators_1 = require("../main/models/decorators");
const inversify_1 = require("inversify");
const vehicle_1 = require("./vehicle");
let AdvanceDao = class AdvanceDao extends sample_model_1.SampleDao {
    constructor() {
        super(...arguments);
        this.ModelClass = AdvanceModel;
    }
};
AdvanceDao = __decorate([
    inversify_1.injectable()
], AdvanceDao);
exports.AdvanceDao = AdvanceDao;
let AdvanceModel = class AdvanceModel extends sample_model_1.SampleModel {
    drive(msg) {
        return `${this.name}:${this.id} drive a ${this.car.name} by ${this.car.manufacturer} and singing ${msg}`;
    }
};
__decorate([
    decorators_1.Property('string'),
    __metadata("design:type", Object)
], AdvanceModel.prototype, "advanceProperty", void 0);
__decorate([
    inversify_1.inject(vehicle_1.Vehicle),
    __metadata("design:type", vehicle_1.Vehicle)
], AdvanceModel.prototype, "car", void 0);
__decorate([
    decorators_1.Remote({
        accepts: [{ arg: 'msg', type: 'string' }],
        returns: [{ arg: 'greeting', type: 'string' }]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdvanceModel.prototype, "drive", null);
AdvanceModel = __decorate([
    inversify_1.injectable(),
    decorators_1.CommonModel({
        base: "PersistedModel",
        dao: AdvanceDao,
        dataSource: "db"
    })
], AdvanceModel);
exports.AdvanceModel = AdvanceModel;
//# sourceMappingURL=advance.model.js.map
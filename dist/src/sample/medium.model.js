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
const decorators_1 = require("../main/models/decorators");
const advance_model_1 = require("./advance.model");
const inversify_1 = require("inversify");
let MediumDao = class MediumDao extends advance_model_1.AdvanceDao {
    constructor() {
        super(...arguments);
        this.ModelClass = MediumModel;
    }
};
MediumDao = __decorate([
    inversify_1.injectable()
], MediumDao);
exports.MediumDao = MediumDao;
let MediumModel = class MediumModel extends advance_model_1.AdvanceModel {
};
__decorate([
    decorators_1.Property('string'),
    __metadata("design:type", Object)
], MediumModel.prototype, "mediumProperty", void 0);
MediumModel = __decorate([
    inversify_1.injectable(),
    decorators_1.CommonModel({
        dao: MediumDao,
        dataSource: "db"
    })
], MediumModel);
exports.MediumModel = MediumModel;
//# sourceMappingURL=medium.model.js.map
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
const persisted_model_1 = require("../main/models/persisted.model");
const decorators_1 = require("../main/models/decorators");
const inversify_1 = require("inversify");
let BelongsToDao = class BelongsToDao extends persisted_model_1.PersistedDao {
    constructor() {
        super(...arguments);
        this.ModelClass = BelongsToModel;
    }
};
BelongsToDao = __decorate([
    inversify_1.injectable()
], BelongsToDao);
exports.BelongsToDao = BelongsToDao;
let BelongsToModel = class BelongsToModel extends persisted_model_1.PersistedModel {
};
__decorate([
    decorators_1.Property("number"),
    __metadata("design:type", Object)
], BelongsToModel.prototype, "advanceId", void 0);
__decorate([
    decorators_1.Relation("belongsTo", "AdvanceModel", "advanceId"),
    __metadata("design:type", Object)
], BelongsToModel.prototype, "advance", void 0);
BelongsToModel = __decorate([
    inversify_1.injectable(),
    decorators_1.CommonModel({
        base: "PersistedModel",
        dao: BelongsToDao,
        dataSource: "db"
    })
], BelongsToModel);
exports.BelongsToModel = BelongsToModel;
//# sourceMappingURL=belongs-to.model.js.map
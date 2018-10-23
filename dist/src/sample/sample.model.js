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
Object.defineProperty(exports, "__esModule", { value: true });
const persisted_model_1 = require("../main/models/persisted.model");
const decorators_1 = require("../main/models/decorators");
const inversify_1 = require("inversify");
let SampleDao = class SampleDao extends persisted_model_1.PersistedDao {
    constructor() {
        super(...arguments);
        this.ModelClass = SampleModel;
    }
    greet(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return `greeting... ${msg}`;
        });
    }
    logGreet(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('before greet');
            return false;
        });
    }
    logGreetAgain(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('after greet');
            return false;
        });
    }
    onAccess(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('on acccess');
            return false;
        });
    }
};
__decorate([
    decorators_1.Remote({
        accepts: [{ arg: 'msg', type: 'string' }],
        returns: [{ arg: 'greeting', type: 'string' }]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SampleDao.prototype, "greet", null);
__decorate([
    decorators_1.BeforeRemote('greet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SampleDao.prototype, "logGreet", null);
__decorate([
    decorators_1.AfterRemote('greet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SampleDao.prototype, "logGreetAgain", null);
__decorate([
    decorators_1.Hook('before save'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SampleDao.prototype, "onAccess", null);
SampleDao = __decorate([
    inversify_1.injectable()
], SampleDao);
exports.SampleDao = SampleDao;
let SampleModel = class SampleModel extends persisted_model_1.PersistedModel {
    greet(msg, cb) {
        cb(null, `greeting... ${this.name} ${msg}`);
    }
};
__decorate([
    decorators_1.Property("string"),
    __metadata("design:type", Object)
], SampleModel.prototype, "name", void 0);
__decorate([
    decorators_1.Property("number"),
    __metadata("design:type", Object)
], SampleModel.prototype, "age", void 0);
__decorate([
    decorators_1.Property("string"),
    decorators_1.Hidden,
    __metadata("design:type", Object)
], SampleModel.prototype, "hiddenProperty", void 0);
__decorate([
    decorators_1.Remote({
        accepts: [{ arg: 'msg', type: 'string' }],
        returns: [{ arg: 'greeting', type: 'string' }]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SampleModel.prototype, "greet", null);
SampleModel = __decorate([
    inversify_1.injectable(),
    decorators_1.CommonModel({
        dao: SampleDao,
        dataSource: "db",
        acls: [{
                "accessType": "*",
                "principalType": "ROLE",
                "principalId": "$unauthenticated",
                "permission": "DENY"
            }, {
                "accessType": "*",
                "principalType": "ROLE",
                "principalId": "authorizedScopes",
                "permission": "ALLOW",
                "property": "find",
                "accessScopes": ["read:sample", "write:sample"]
            }]
    })
], SampleModel);
exports.SampleModel = SampleModel;
//# sourceMappingURL=sample.model.js.map
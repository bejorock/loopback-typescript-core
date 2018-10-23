"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const path_1 = __importDefault(require("path"));
let BootAppModule = class BootAppModule extends module_1.default {
};
BootAppModule = __decorate([
    decorators_1.CommonModule({})
], BootAppModule);
let ChildAppModule = class ChildAppModule extends module_1.default {
};
ChildAppModule = __decorate([
    decorators_1.CommonModule({})
], ChildAppModule);
let Child2AppModule = class Child2AppModule extends module_1.default {
};
Child2AppModule = __decorate([
    decorators_1.CommonModule({})
], Child2AppModule);
let RootAppModule = class RootAppModule extends module_1.default {
};
RootAppModule = __decorate([
    decorators_1.CommonModule({
        imports: [ChildAppModule, Child2AppModule]
    })
], RootAppModule);
describe('boot app', () => {
    it("single module", () => __awaiter(this, void 0, void 0, function* () {
        module_1.default.boot(BootAppModule, path_1.default.resolve(__dirname, '../src/resources')).then(module => {
            expect(module instanceof BootAppModule).toBe(true);
        });
    }));
    it("hierarcy module", () => __awaiter(this, void 0, void 0, function* () {
        module_1.default.boot(RootAppModule, path_1.default.resolve(__dirname, '../src/resources')).then(module => {
            expect(module instanceof RootAppModule).toBe(true);
        });
    }));
});
//# sourceMappingURL=boot.spec.js.map
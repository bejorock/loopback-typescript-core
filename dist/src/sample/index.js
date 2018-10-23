"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = __importDefault(require("../main/boot/module"));
const decorators_1 = require("../main/models/decorators");
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const sample_model_1 = require("./sample.model");
const advance_model_1 = require("./advance.model");
const medium_model_1 = require("./medium.model");
const access_token_model_1 = require("../main/models/access-token.model");
const belongs_to_model_1 = require("./belongs-to.model");
const token_model_1 = require("./token.model");
const vehicle_1 = require("./vehicle");
const hello_middleware_1 = require("./hello.middleware");
let SampleAppModule = class SampleAppModule extends module_1.default {
};
SampleAppModule = __decorate([
    decorators_1.CommonModule({
        declare: [vehicle_1.Vehicle],
        middleware: [hello_middleware_1.HelloMiddleware],
        models: [advance_model_1.AdvanceModel, medium_model_1.MediumModel, access_token_model_1.AccessTokenModel, belongs_to_model_1.BelongsToModel, token_model_1.TokenModel, sample_model_1.SampleModel]
        //models: [SampleModel, AdvanceModel]
    })
], SampleAppModule);
process.on('unhandledRejection', (reason, promise) => {
    //console.log(promise)
    console.log('Unhandled Rejection at:', reason.stack || reason);
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
    process.exit();
});
module_1.default.boot(SampleAppModule, path_1.default.resolve(__dirname, '../resources')).then((module) => {
    module.getContext().enableAuth({ model: "DefaultAccessToken" });
    module.getContext().getParentContext().models.Role.registerResolver('authorizedScopes', function (role, ctx, cb) {
        console.log(role);
        console.log(ctx.model.definition.settings.acls);
        cb(null, true);
    });
    // start the web server
    let server = http_1.default.createServer(module.getContext().getParentContext());
    return server.listen(module.getContext().getConfig('port'), function () {
        var baseUrl = 'http://' + module.getContext().getConfig('host') + ':' + module.getContext().getConfig('port');
        module.getContext().emit('started', baseUrl);
        //var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        console.log('Browse your REST API at %s%s', baseUrl, '/explorer');
    });
}).catch(err => console.log(err.stack));
//# sourceMappingURL=index.js.map
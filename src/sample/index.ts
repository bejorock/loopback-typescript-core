import Module from '../main/boot/module';
import { CommonModule } from '../main/models/decorators';
import path from 'path'
import http from 'http'
import { SampleModel } from './sample.model';
import { AdvanceModel } from './advance.model';
import { MediumModel } from './medium.model';
import { AccessTokenModel } from '../main/models/access-token.model';
import { BelongsToModel } from './belongs-to.model';
import { TokenModel } from './token.model';
import { Vehicle } from './vehicle';
import { HelloMiddleware } from './hello.middleware';

@CommonModule({
  declare: [Vehicle],
  middleware: [HelloMiddleware],
  models: [AdvanceModel, MediumModel, AccessTokenModel, BelongsToModel, TokenModel, SampleModel]
  //models: [SampleModel, AdvanceModel]
})
class SampleAppModule extends Module
{

}

process.on('unhandledRejection', (reason, promise) => {
	//console.log(promise)
	console.log('Unhandled Rejection at:', reason.stack || reason)
	// Recommended: send the information to sentry.io
	// or whatever crash reporting service you use
	process.exit()
})

Module.boot(SampleAppModule, path.resolve(__dirname, '../resources')).then((module:Module) => {
  module.getContext().enableAuth({model: "DefaultAccessToken"})

  
  module.getContext().getParentContext().models.Role.registerResolver('authorizedScopes', function(role, ctx, cb) {
    console.log(role)
    console.log(ctx.model.definition.settings.acls)

    cb(null, true)
  })

  // start the web server
  let server = http.createServer(module.getContext().getParentContext())
  
  return server.listen(module.getContext().getConfig('port'), function() {
    var baseUrl = 'http://' + module.getContext().getConfig('host') + ':' + module.getContext().getConfig('port');
    module.getContext().emit('started', baseUrl);
    //var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    console.log('Browse your REST API at %s%s', baseUrl, '/explorer');
  });
}).catch(err => console.log(err.stack))
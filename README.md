# loopback-promise-extension

Loopback extension to wrap persisted model and user model functions to return promise

# TODO
- [x] Boot Applications
- [x] Load Models
- [x] Load Mixins
- [x] Load Acls
- [x] Load Relations
- [ ] Load Validations
- [x] Load Remote Methods
- [x] Load Remote Hooks
- [x] Load Operation Hooks (Not yet tested properly)
- [x] Load Emit Events
- [x] Load Dependency Injection
- [x] Load Middleware
- [ ] Load Authentication

# Another Project
- [ ] Express Cache
- [ ] Implement Scale Up (Node Cluster)
- [ ] Implement Scale Out (Express Cluster)

# Installation
```sh
npm install git+https://github.com/bejorock/loopback-typescript-core.git --save
```

# Folder Structures
* (Project Name)
	* src
		* main
			* models (folder model)
			* module.ts
			* index.ts
		* test
			* indext.ts
		* resources (folder for config)
	* dist
	* tsconfig.json
	* package.json

# Setting Configs
Silahkan klik link dokumentasi loopback untuk setting file - file config https://loopback.io/doc/en/lb3/Defining-data-sources.html

# Create Model
```js
import { PersistedDao, PersistedModel } from 'loopback-typescript-core/dist/models/persisted.model';
import { injectable } from 'inversify';
import { CommonModel, Property } from 'loopback-typescript-core/dist/models/decorators';

@injectable()
export class SampleDao extends PersistedDao
{
	static tableName = 'sample'
	static modelName = 'Sample'

	ModelClass = SampleModel
}

@injectable()
@CommonModel({
	name: SampleDao.modelName,
	dao: SampleDao,
	dataSource: 'defaultDb',
	settings: {
		plural: 'samples',
		mongodb: {
			collection: SampleDao.tableName
		},

		mixins: {}
	}
})
export class SampleModel extends PersistedModel
{
	@Property('string')
	name:string

	@Property('string')
	address:string

	@Property('date')
	description:Date
}
```

# Setup Module
```js
import { injectable } from "inversify";
import { Module, CommonModule } from 'loopback-typescript-core';
import { SampleModel } from './models/sample.model.ts';


@injectable()
@CommonModule({
	models: [
		SampleModel
	]
})
export class SampleModule extends Module
{
	
}
```

# Setup Boot (index.ts)
```js
import { Writable } from 'stream';
import { Module } from 'loopback-typescript-core';
import { SampleModule } from './sample.module';
import path from 'path';
import loopback from 'loopback';
import http from 'http';
import fs from 'fs';

(function(){

	process.on('unhandledRejection', (reason, promise) => {
		//console.log(promise)
		console.log('Unhandled Rejection at:', reason.stack || reason)
		// Recommended: send the information to sentry.io
		// or whatever crash reporting service you use
		process.exit()
	})

	let app = loopback()
	let configDir = path.resolve(process.cwd(), './src/resources')

	Module.boot(SampleModule, {
		appRootDir: process.cwd(),
		appConfigRootDir: configDir,
		dsRootDir: configDir,
		modelsRootDir: configDir,
		middlewareRootDir: configDir,
		componentRootDir: configDir,
		mixinDirs: [
			path.resolve(__dirname, './mixins')
		]
	}, app).then((module)  => {
		// start the web server
		let port = module.getContext().getConfig('port')
		
		let server = http.createServer(module.getContext().getParentContext())
		
		let handleOnStart = (startedPort) => {
			var baseUrl = 'http://' + module.getContext().getConfig('host') + ':' + startedPort;
			//module.getContext().emit('started', baseUrl);
			//var baseUrl = app.get('url').replace(/\/$/, '');
			log.info('Web server listening at: %s', baseUrl);
			log.info('Browse your REST API at %s%s', baseUrl, '/explorer');
		}

		server.listen(port, () => {handleOnStart(port)})
	});
})()
```

# Run Application 
```sh
ts-node src/main/index.ts --server true --log debug
```
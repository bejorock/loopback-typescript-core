# LOOPBACK TYPESCRIPT CORE

Loopback extension to wrap persisted model and user model functions to return promise

# TODO
- [x] Boot Applications
- [x] Load Models
- [x] Load Mixins
- [x] Load Acls
- [x] Load Relations
- [ ] Load Validations
- [x] Load Remote Methods
- [x] Load Remote Hooks*
- [x] Load Operation Hooks*
- [x] Load Emit Events
- [x] Load Dependency Injection
- [x] Load Middleware
- [x] Load Controller
- [ ] Load Authentication

\* not yet tested properly

# Installation
```sh
npm set registry http://45.76.182.17:4873

npm adduser --registry http://45.76.182.17:4873

npm install git loopback-typescript-core --save
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
	// setup dependency injection
	@inject(SampleDao2)
	sampleDao2:SampleDao2

	static tableName = 'sample'
	static modelName = 'Sample'

	ModelClass = SampleModel

	// setup static remote methods
	@Remote({
		accepts: [{arg: 'msg', type: 'string'}],
		returns: [{arg: 'greeting', type: 'string'}]
	})
	async greet(msg) {
		return `greeting... ${msg}`
	}

	// setup remote hooks
	@BeforeRemote('greet')
	async logGreet(ctx) {
		console.log('before greet')
		return false
	}

	@AfterRemote('greet')
	async logGreetAgain(ctx) {
		console.log('after greet')
		return false
	}

	// setup operation hook
	@Hook('before save')
	async onAccess(ctx) {
		console.log('on acccess')
		return false
	}
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

		// setup mixins
		mixins: {
			ObjectidType: {
				properties: ["accountId"]
			}
		}
	},
	// setup acls
	acls: [
		{
			"accessType": "*",
			"principalType": "ROLE",
			"principalId": "admin",
			"permission": "ALLOW"
		}
	]
})
export class SampleModel extends PersistedModel
{
	@Property('string')
	name:string

	@Property('string')
	address:string

	@Property('date')
	description:Date

	// hide property
	@Property("string")
	@Hidden
	hiddenProperty

	@Property('any')
	accountId:any

	// setup relations
	@Relation('belongsTo', 'Account', 'accountId')
	account

	// setup instance remote methods
	@Remote({
		accepts: [{arg: 'msg', type: 'string'}],
		returns: [{arg: 'greeting', type: 'string'}]
	})
	async greet(msg) {
		return `greeting... ${this.name}: ${msg}`
	}
}
```

# Setup Middleware
Ketentuan penggunaan middleware sesuai dengan framework [expressjs](http://expressjs.com/), silahkan melihat dokumentasi express js untuk informasi lebih lanjut.
```js
import { Middleware } from '../main/middleware/base.middleware';
import { injectable } from 'inversify';

@injectable()
export class HelloMiddleware extends Middleware
{
	// optional tidak harus diisi
	path = "/hello"
	// optional tidak harus diisi
	protocol = "get"


	// sama dengan standard routing expressjs
	async onRequest(req: any, res: any, next: any) {
		res.send('hello world')	
	}
}
```

# Setup Controller
Routing function yang ada di controller class identical dengan spesifikasi [expressjs](http://expressjs.com/), silahkan melihat dokumentasi express js untuk informasi lebih lanjut.
```js
import { injectable } from "inversify";
import { CommonController, Get, Post, Patch } from "loopback-typescript-core";

@injectable()
@CommonController('/repo')
export class RepositoryController
{
	@Get(':repoId')
	async find(req, res, next) {
		res.send('hello')
	}

	@Get(':repoId/findOne')
	async findOne(req, res, next) {
		res.send('hello')
	}

	@Get(':repoId/:id')
	async findById(req, res, next) {
		res.send('hello')
	}

	@Post(':repoId')
	async create(req, res, next) {
		res.send('hello')
	}

	@Patch(':repoId')
	async patch(req, res, next) {
		res.send('hello')
	}

	@Patch(':repoid')
	async delete(req, res, next) {
		res.send('hello')
	}
}
```

# Setup Module
```js
import { injectable } from "inversify";
import { Module, CommonModule } from 'loopback-typescript-core';
import { SampleModel } from './models/sample.model.ts';


@injectable()
@CommonModule({
	// declare model
	models: [
		SampleModel
	],

	// declare middleware
	middleware: [
		HelloMiddleware
	],

	// declare controller
	controller: [
		RepositoryController
	],

	// declare others injectable class similar to angular declare
	declare: [

	],

	// create factory injectable function, this is implementation of factory pattern
	factories: [
		(container:Container) => {
			container.bind<Redis>('ioredis.Redis').toConstantValue(new IORedis({
				host: "127.0.0.1",
				port: 6379,
				lazyConnect: true, 
				keyPrefix: 'iam:pln:'
			}))
		}
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
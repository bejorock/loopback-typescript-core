import express = require('express')
import { injectable, Container } from 'inversify';
import { CommonRoute } from '../models/decorators';
import { Middleware } from '../middleware/base.middleware';
import { Registry } from '../boot/registry';

export type ExpressRouter = express.Router

export interface Router
{
	base:string
	routes:CommonRoute[]

	onRoute:ExpressRouter
	configure():void
}

@injectable()
export abstract class BaseRouter implements Router
{
	private _router:ExpressRouter
	
	container:Container
	base:string
	routes:CommonRoute[]

	configure():void {
		this._router = this.newRouter()

		this.routes.forEach(route => {
			let handler:Middleware
			if(route.handler)
				handler = this.container.resolve(route.handler)

			let childRouter:BaseRouter
			if(route.load) {
				childRouter = this.container.resolve(route.load)
				childRouter.base = route.path
				childRouter.container = this.container

				let meta = Registry.getProperty(route.load.name, 'meta')
				childRouter.routes = meta.routes

				childRouter.configure()
			}

			if(route.protocol && handler)
				this._router[route.protocol](route.path, handler.onRequest)
			else if(handler)
				this._router.use(route.path, handler.onRequest)
			else if(childRouter)
				this._router.use(route.path, childRouter.onRoute)
		})	
	}

	get onRoute():ExpressRouter { return this._router }

	abstract newRouter():ExpressRouter
}
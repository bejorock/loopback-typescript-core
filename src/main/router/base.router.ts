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
			let handlers:Middleware[] = []
			let args:any = []
			if(route.handlers) {
				route.handlers.forEach(handler => {
					handlers.push(this.container.resolve(handler))
				})

				args.push(route.path)
				handlers.forEach(handler => {
					args.push(async function(req, res, next) {
						try {
							return await handler.onRequest.apply(handler, arguments)
						} catch(e) {
							next(e)
						}
					})
				})
			}
		
			let childRouter:BaseRouter
			if(route.load) {
				childRouter = this.container.resolve(route.load)
				childRouter.base = route.path
				childRouter.container = this.container

				let meta = Registry.getProperty(route.load.name, 'meta')
				childRouter.routes = meta.routes

				childRouter.configure()
			}

			if(route.protocol && handlers.length > 0) 
				this._router[route.protocol].apply(this._router, args)
				//handlers.forEach(handler => this._router[route.protocol](route.path, handler.onRequest))	
			else if(handlers.length > 0)
				this._router.use.apply(this._router, args)
				//handlers.forEach(handler => this._router.use(route.path, handler.onRequest))
			else if(childRouter)
				this._router.use(route.path, childRouter.onRoute)
		})	
	}

	get onRoute():ExpressRouter { return this._router }

	abstract newRouter():ExpressRouter
}
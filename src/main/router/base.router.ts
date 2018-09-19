import express = require('express')
import { injectable } from 'inversify';

export type ExpressRouter = express.Router

export interface Router
{
	path:string

	onRoute():ExpressRouter
}

@injectable()
export abstract class BaseRouter implements Router
{
	path:string

	abstract onRoute():ExpressRouter
}
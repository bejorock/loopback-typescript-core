import { injectable } from "inversify";

export interface BaseMiddleware
{
	phase:string
	path:string
	protocol:string

	onRequest(req, res, next):any
}

@injectable()
export abstract class Middleware implements BaseMiddleware
{
	phase

	constructor(phase = 'routes') {
		this.phase = phase
	}

	abstract path
	abstract protocol
	abstract onRequest(req, res, next):any
}
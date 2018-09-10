import { injectable } from "inversify";

export interface BaseErrorMiddleware
{
	phase:string

	onRequest(err, req, res, next):any
}

@injectable()
export abstract class ErrorMiddleware implements BaseErrorMiddleware
{
	phase

	constructor(phase = 'final:before') {
		this.phase = phase
	}

	abstract onRequest(err, req, res, next):any
}
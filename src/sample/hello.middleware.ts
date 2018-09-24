import { Middleware } from '../main/middleware/base.middleware';
import { injectable } from 'inversify';

@injectable()
export class HelloMiddleware extends Middleware
{
	path = "/hello"
	protocol = "get"

	async onRequest(req: any, res: any, next: any) {
		res.send('hello world')	
	}
}
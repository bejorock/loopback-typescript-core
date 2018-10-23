import { Middleware } from '../main/middleware/base.middleware';
export declare class HelloMiddleware extends Middleware {
    path: string;
    protocol: string;
    onRequest(req: any, res: any, next: any): Promise<void>;
}

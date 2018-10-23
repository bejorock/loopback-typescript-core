export interface BaseMiddleware {
    phase: string;
    path: string;
    protocol: string;
    onRequest(req: any, res: any, next: any): Promise<void>;
}
export declare abstract class Middleware implements BaseMiddleware {
    phase: any;
    constructor(phase?: string);
    abstract path: any;
    abstract protocol: any;
    abstract onRequest(req: any, res: any, next: any): Promise<void>;
}

export interface BaseErrorMiddleware {
    phase: string;
    onRequest(err: any, req: any, res: any, next: any): any;
}
export declare abstract class ErrorMiddleware implements BaseErrorMiddleware {
    phase: any;
    constructor(phase?: string);
    abstract onRequest(err: any, req: any, res: any, next: any): any;
}

/// <reference types="express" />
import express = require('express');
export declare type ExpressRouter = express.Router;
export interface Router {
    path: string;
    onRoute(): ExpressRouter;
}
export declare abstract class BaseRouter implements Router {
    path: string;
    abstract onRoute(): ExpressRouter;
}

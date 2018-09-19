/// <reference types="express" />
import express = require('express');
import { Container } from 'inversify';
import { CommonRoute } from '../models/decorators';
export declare type ExpressRouter = express.Router;
export interface Router {
    base: string;
    routes: CommonRoute[];
    onRoute(): ExpressRouter;
    configure(): void;
}
export declare abstract class BaseRouter implements Router {
    private _router;
    container: Container;
    base: string;
    routes: CommonRoute[];
    configure(): void;
    onRoute(): ExpressRouter;
    abstract newRouter(): ExpressRouter;
}

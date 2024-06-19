import { NextMiddleware } from 'next/server';
import { AuthkitMiddlewareOptions } from './interfaces.js';
export declare function authkitMiddleware({ debug, middlewareAuth, }?: AuthkitMiddlewareOptions): NextMiddleware;

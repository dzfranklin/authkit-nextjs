import { NextRequest, NextResponse } from 'next/server';
import { HandleAuthOptions } from './interfaces.js';
export declare function handleAuth(options?: HandleAuthOptions): (request: NextRequest) => Promise<NextResponse<unknown>>;

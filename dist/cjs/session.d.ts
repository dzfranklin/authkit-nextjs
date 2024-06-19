import { NextRequest, NextResponse } from 'next/server';
import { AuthkitMiddlewareAuth, NoUserInfo, Session, UserInfo } from './interfaces.js';
declare function encryptSession(session: Session): Promise<string>;
declare function updateSession(request: NextRequest, debug: boolean, middlewareAuth: AuthkitMiddlewareAuth): Promise<NextResponse<unknown>>;
declare function getUser(options?: {
    ensureSignedIn: false;
}): Promise<UserInfo | NoUserInfo>;
declare function getUser(options: {
    ensureSignedIn: true;
}): Promise<UserInfo>;
declare function terminateSession(): Promise<void>;
export { encryptSession, updateSession, getUser, terminateSession };

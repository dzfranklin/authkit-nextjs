"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminateSession = exports.getUser = exports.updateSession = exports.encryptSession = void 0;
const navigation_1 = require("next/navigation");
const headers_1 = require("next/headers");
const server_1 = require("next/server");
const jose_1 = require("jose");
const iron_session_1 = require("iron-session");
const cookie_js_1 = require("./cookie.js");
const workos_js_1 = require("./workos.js");
const env_variables_js_1 = require("./env-variables.js");
const get_authorization_url_js_1 = require("./get-authorization-url.js");
const path_to_regexp_1 = require("path-to-regexp");
const sessionHeaderName = 'x-workos-session';
const middlewareHeaderName = 'x-workos-middleware';
const JWKS = (0, jose_1.createRemoteJWKSet)(new URL(workos_js_1.workos.userManagement.getJwksUrl(env_variables_js_1.WORKOS_CLIENT_ID)));
async function encryptSession(session) {
    return (0, iron_session_1.sealData)(session, { password: env_variables_js_1.WORKOS_COOKIE_PASSWORD });
}
exports.encryptSession = encryptSession;
async function updateSession(request, debug, middlewareAuth) {
    const session = await getSessionFromCookie();
    const newRequestHeaders = new Headers(request.headers);
    // We store the current request url in a custom header, so we can always have access to it
    // This is because on hard navigations we don't have access to `next-url` but need to get the current
    // `pathname` to be able to return the users where they came from before sign-in
    newRequestHeaders.set('x-url', request.url);
    // Record that the request was routed through the middleware so we can check later for DX purposes
    newRequestHeaders.set(middlewareHeaderName, 'true');
    newRequestHeaders.delete(sessionHeaderName);
    const url = new URL(env_variables_js_1.WORKOS_REDIRECT_URI);
    if (middlewareAuth.enabled &&
        url.pathname === request.nextUrl.pathname &&
        !middlewareAuth.unauthenticatedPaths.includes(url.pathname)) {
        // In the case where:
        // - We're using middleware auth mode
        // - The redirect URI is in the middleware matcher
        // - The redirect URI isn't in the unauthenticatedPaths array
        //
        // then we would get stuck in a login loop due to the redirect happening before the session is set.
        // It's likely that the user accidentally forgot to add the path to unauthenticatedPaths, so we add it here.
        middlewareAuth.unauthenticatedPaths.push(url.pathname);
    }
    const matchedPaths = middlewareAuth.unauthenticatedPaths.filter((pathGlob) => {
        const pathRegex = getMiddlewareAuthPathRegex(pathGlob);
        return pathRegex.exec(request.nextUrl.pathname);
    });
    // If the user is logged out and this path isn't on the allowlist for logged out paths, redirect to AuthKit.
    if (middlewareAuth.enabled && matchedPaths.length === 0 && !session) {
        if (debug)
            console.log('Unauthenticated user on protected route, redirecting to AuthKit');
        return server_1.NextResponse.redirect(await (0, get_authorization_url_js_1.getAuthorizationUrl)({ returnPathname: new URL(request.url).pathname }));
    }
    // If no session, just continue
    if (!session) {
        return server_1.NextResponse.next({
            request: { headers: newRequestHeaders },
        });
    }
    const hasValidSession = await verifyAccessToken(session.accessToken);
    if (hasValidSession) {
        if (debug)
            console.log('Session is valid');
        // set the x-workos-session header according to the current cookie value
        newRequestHeaders.set(sessionHeaderName, (0, headers_1.cookies)().get(cookie_js_1.cookieName).value);
        return server_1.NextResponse.next({
            request: { headers: newRequestHeaders },
        });
    }
    try {
        if (debug)
            console.log('Session invalid. Attempting refresh', session.refreshToken);
        // If the session is invalid (i.e. the access token has expired) attempt to re-authenticate with the refresh token
        const { accessToken, refreshToken } = await workos_js_1.workos.userManagement.authenticateWithRefreshToken({
            clientId: env_variables_js_1.WORKOS_CLIENT_ID,
            refreshToken: session.refreshToken,
        });
        if (debug)
            console.log('Refresh successful:', refreshToken);
        // Encrypt session with new access and refresh tokens
        const encryptedSession = await encryptSession({
            accessToken,
            refreshToken,
            user: session.user,
            impersonator: session.impersonator,
        });
        newRequestHeaders.set(sessionHeaderName, encryptedSession);
        const response = server_1.NextResponse.next({
            request: { headers: newRequestHeaders },
        });
        // update the cookie
        response.cookies.set(cookie_js_1.cookieName, encryptedSession, cookie_js_1.cookieOptions);
        return response;
    }
    catch (e) {
        if (debug)
            console.log('Failed to refresh. Deleting cookie and redirecting.', e);
        const response = server_1.NextResponse.next({
            request: { headers: newRequestHeaders },
        });
        response.cookies.delete(cookie_js_1.cookieName);
        return response;
    }
}
exports.updateSession = updateSession;
function getMiddlewareAuthPathRegex(pathGlob) {
    let regex;
    try {
        // Redirect URI is only used to construct the URL
        const url = new URL(pathGlob, env_variables_js_1.WORKOS_REDIRECT_URI);
        const path = `${url.pathname}${url.hash || ''}`;
        const tokens = (0, path_to_regexp_1.parse)(path);
        regex = (0, path_to_regexp_1.tokensToRegexp)(tokens).source;
        return new RegExp(regex);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`Error parsing routes for middleware auth. Reason: ${message}`);
    }
}
async function getUser({ ensureSignedIn = false } = {}) {
    const session = await getSessionFromHeader('getUser');
    if (!session) {
        if (ensureSignedIn) {
            const url = (0, headers_1.headers)().get('x-url');
            const returnPathname = url ? new URL(url).pathname : undefined;
            (0, navigation_1.redirect)(await (0, get_authorization_url_js_1.getAuthorizationUrl)({ returnPathname }));
        }
        return { user: null };
    }
    const { exp, sid: sessionId, org_id: organizationId, role } = (0, jose_1.decodeJwt)(session.accessToken);
    return {
        sessionId,
        user: session.user,
        organizationId,
        role,
        impersonator: session.impersonator,
        accessToken: session.accessToken,
        accessTokenExpiry: exp,
    };
}
exports.getUser = getUser;
async function terminateSession() {
    const { sessionId } = await getUser();
    if (sessionId) {
        (0, navigation_1.redirect)(workos_js_1.workos.userManagement.getLogoutUrl({ sessionId }));
    }
    (0, navigation_1.redirect)('/');
}
exports.terminateSession = terminateSession;
async function verifyAccessToken(accessToken) {
    try {
        await (0, jose_1.jwtVerify)(accessToken, JWKS);
        return true;
    }
    catch (e) {
        return false;
    }
}
async function getSessionFromCookie() {
    const cookie = (0, headers_1.cookies)().get(cookie_js_1.cookieName);
    if (cookie) {
        return (0, iron_session_1.unsealData)(cookie.value, {
            password: env_variables_js_1.WORKOS_COOKIE_PASSWORD,
        });
    }
}
async function getSessionFromHeader(caller) {
    const hasMiddleware = Boolean((0, headers_1.headers)().get(middlewareHeaderName));
    if (!hasMiddleware) {
        throw new Error(`You are calling \`${caller}\` on a path that isn’t covered by the AuthKit middleware. Make sure it is running on all paths you are calling \`${caller}\` from by updating your middleware config in \`middleware.(js|ts)\`.`);
    }
    const authHeader = (0, headers_1.headers)().get(sessionHeaderName);
    if (!authHeader)
        return;
    return (0, iron_session_1.unsealData)(authHeader, { password: env_variables_js_1.WORKOS_COOKIE_PASSWORD });
}
//# sourceMappingURL=session.js.map
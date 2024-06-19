"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAuth = void 0;
const server_1 = require("next/server");
const headers_1 = require("next/headers");
const workos_js_1 = require("./workos.js");
const env_variables_js_1 = require("./env-variables.js");
const session_js_1 = require("./session.js");
const cookie_js_1 = require("./cookie.js");
function handleAuth(options = {}) {
    const { returnPathname: returnPathnameOption = '/' } = options;
    return async function GET(request) {
        const code = request.nextUrl.searchParams.get('code');
        const state = request.nextUrl.searchParams.get('state');
        const returnPathname = state ? JSON.parse(atob(state)).returnPathname : null;
        if (code) {
            try {
                // Use the code returned to us by AuthKit and authenticate the user with WorkOS
                const { accessToken, refreshToken, user, impersonator } = await workos_js_1.workos.userManagement.authenticateWithCode({
                    clientId: env_variables_js_1.WORKOS_CLIENT_ID,
                    code,
                });
                const url = request.nextUrl.clone();
                // Cleanup params
                url.searchParams.delete('code');
                url.searchParams.delete('state');
                // Redirect to the requested path and store the session
                url.pathname = returnPathname !== null && returnPathname !== void 0 ? returnPathname : returnPathnameOption;
                const response = server_1.NextResponse.redirect(url);
                if (!accessToken || !refreshToken)
                    throw new Error('response is missing tokens');
                // The refreshToken should never be accesible publicly, hence why we encrypt it in the cookie session
                // Alternatively you could persist the refresh token in a backend database
                const session = await (0, session_js_1.encryptSession)({ accessToken, refreshToken, user, impersonator });
                (0, headers_1.cookies)().set(cookie_js_1.cookieName, session, cookie_js_1.cookieOptions);
                return response;
            }
            catch (error) {
                const errorRes = {
                    error: error instanceof Error ? error.message : String(error),
                };
                console.error(errorRes);
                return errorResponse();
            }
        }
        return errorResponse();
    };
    function errorResponse() {
        return server_1.NextResponse.json({
            error: {
                message: 'Something went wrong',
                description: 'Couldn’t sign in. If you are not sure what happened, please contact your organization admin.',
            },
        }, { status: 500 });
    }
}
exports.handleAuth = handleAuth;
//# sourceMappingURL=authkit-callback-route.js.map
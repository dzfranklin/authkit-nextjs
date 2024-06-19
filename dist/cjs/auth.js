"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.getSignUpUrl = exports.getSignInUrl = void 0;
const get_authorization_url_js_1 = require("./get-authorization-url.js");
const headers_1 = require("next/headers");
const cookie_js_1 = require("./cookie.js");
const session_js_1 = require("./session.js");
async function getSignInUrl() {
    return (0, get_authorization_url_js_1.getAuthorizationUrl)({ screenHint: 'sign-in' });
}
exports.getSignInUrl = getSignInUrl;
async function getSignUpUrl() {
    return (0, get_authorization_url_js_1.getAuthorizationUrl)({ screenHint: 'sign-up' });
}
exports.getSignUpUrl = getSignUpUrl;
async function signOut() {
    (0, headers_1.cookies)().delete(cookie_js_1.cookieName);
    await (0, session_js_1.terminateSession)();
}
exports.signOut = signOut;
//# sourceMappingURL=auth.js.map
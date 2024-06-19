"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = exports.cookieName = void 0;
const env_variables_js_1 = require("./env-variables.js");
const redirectUrl = new URL(env_variables_js_1.WORKOS_REDIRECT_URI);
const isSecureProtocol = redirectUrl.protocol === 'https:';
const cookieName = 'wos-session';
exports.cookieName = cookieName;
const cookieOptions = {
    path: '/',
    httpOnly: true,
    secure: isSecureProtocol,
    sameSite: 'lax',
    // Defaults to 400 days, the maximum allowed by Chrome
    // It's fine to have a long cookie expiry date as the access/refresh tokens
    // act as the actual time-limited aspects of the session.
    maxAge: env_variables_js_1.WORKOS_COOKIE_MAX_AGE ? parseInt(env_variables_js_1.WORKOS_COOKIE_MAX_AGE, 10) : 60 * 60 * 24 * 400,
    domain: env_variables_js_1.WORKOS_COOKIE_DOMAIN ? env_variables_js_1.WORKOS_COOKIE_DOMAIN : undefined,
};
exports.cookieOptions = cookieOptions;
//# sourceMappingURL=cookie.js.map
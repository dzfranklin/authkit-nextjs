"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorizationUrl = void 0;
const workos_js_1 = require("./workos.js");
const env_variables_js_1 = require("./env-variables.js");
async function getAuthorizationUrl(options = {}) {
    const { returnPathname, screenHint } = options;
    return workos_js_1.workos.userManagement.getAuthorizationUrl({
        provider: 'authkit',
        clientId: env_variables_js_1.WORKOS_CLIENT_ID,
        redirectUri: env_variables_js_1.WORKOS_REDIRECT_URI,
        state: returnPathname ? btoa(JSON.stringify({ returnPathname })) : undefined,
        screenHint,
    });
}
exports.getAuthorizationUrl = getAuthorizationUrl;
//# sourceMappingURL=get-authorization-url.js.map
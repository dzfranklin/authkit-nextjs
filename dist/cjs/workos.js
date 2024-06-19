"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workos = void 0;
const tslib_1 = require("tslib");
const node_1 = tslib_1.__importDefault(require("@workos-inc/node"));
const env_variables_js_1 = require("./env-variables.js");
const options = {
    apiHostname: env_variables_js_1.WORKOS_API_HOSTNAME,
    https: env_variables_js_1.WORKOS_API_HTTPS ? env_variables_js_1.WORKOS_API_HTTPS === 'true' : true,
    port: env_variables_js_1.WORKOS_API_PORT ? parseInt(env_variables_js_1.WORKOS_API_PORT) : undefined,
};
// Initialize the WorkOS client
const workos = new node_1.default(env_variables_js_1.WORKOS_API_KEY, options);
exports.workos = workos;
//# sourceMappingURL=workos.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKOS_COOKIE_DOMAIN = exports.WORKOS_COOKIE_MAX_AGE = exports.WORKOS_API_PORT = exports.WORKOS_API_HTTPS = exports.WORKOS_API_HOSTNAME = exports.WORKOS_COOKIE_PASSWORD = exports.WORKOS_REDIRECT_URI = exports.WORKOS_API_KEY = exports.WORKOS_CLIENT_ID = void 0;
function getEnvVariable(name) {
    const envVariable = process.env[name];
    if (!envVariable) {
        throw new Error(`${name} environment variable is not set`);
    }
    return envVariable;
}
function getOptionalEnvVariable(name) {
    return process.env[name];
}
const WORKOS_CLIENT_ID = getEnvVariable('WORKOS_CLIENT_ID');
exports.WORKOS_CLIENT_ID = WORKOS_CLIENT_ID;
const WORKOS_API_KEY = getEnvVariable('WORKOS_API_KEY');
exports.WORKOS_API_KEY = WORKOS_API_KEY;
const WORKOS_REDIRECT_URI = getEnvVariable('WORKOS_REDIRECT_URI');
exports.WORKOS_REDIRECT_URI = WORKOS_REDIRECT_URI;
const WORKOS_COOKIE_PASSWORD = getEnvVariable('WORKOS_COOKIE_PASSWORD');
exports.WORKOS_COOKIE_PASSWORD = WORKOS_COOKIE_PASSWORD;
const WORKOS_API_HOSTNAME = getOptionalEnvVariable('WORKOS_API_HOSTNAME');
exports.WORKOS_API_HOSTNAME = WORKOS_API_HOSTNAME;
const WORKOS_API_HTTPS = getOptionalEnvVariable('WORKOS_API_HTTPS');
exports.WORKOS_API_HTTPS = WORKOS_API_HTTPS;
const WORKOS_API_PORT = getOptionalEnvVariable('WORKOS_API_PORT');
exports.WORKOS_API_PORT = WORKOS_API_PORT;
const WORKOS_COOKIE_MAX_AGE = getOptionalEnvVariable('WORKOS_COOKIE_MAX_AGE');
exports.WORKOS_COOKIE_MAX_AGE = WORKOS_COOKIE_MAX_AGE;
const WORKOS_COOKIE_DOMAIN = getOptionalEnvVariable('WORKOS_COOKIE_DOMAIN');
exports.WORKOS_COOKIE_DOMAIN = WORKOS_COOKIE_DOMAIN;
if (WORKOS_COOKIE_PASSWORD.length < 32) {
    throw new Error('WORKOS_COOKIE_PASSWORD must be at least 32 characters long');
}
//# sourceMappingURL=env-variables.js.map
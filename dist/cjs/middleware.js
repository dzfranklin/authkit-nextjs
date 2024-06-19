"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authkitMiddleware = void 0;
const session_js_1 = require("./session.js");
function authkitMiddleware({ debug = false, middlewareAuth = { enabled: false, unauthenticatedPaths: [] }, } = {}) {
    return function (request) {
        return (0, session_js_1.updateSession)(request, debug, middlewareAuth);
    };
}
exports.authkitMiddleware = authkitMiddleware;
//# sourceMappingURL=middleware.js.map
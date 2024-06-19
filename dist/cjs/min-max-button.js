"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinMaxButton = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const button_js_1 = require("./button.js");
function MinMaxButton({ children, minimizedValue }) {
    return (React.createElement(button_js_1.Button, { onClick: () => {
            const root = document.querySelector('[data-workos-impersonation-root]');
            root === null || root === void 0 ? void 0 : root.style.setProperty('--wi-minimized', minimizedValue);
        }, style: { padding: 0, width: '1.714em' } }, children));
}
exports.MinMaxButton = MinMaxButton;
//# sourceMappingURL=min-max-button.js.map
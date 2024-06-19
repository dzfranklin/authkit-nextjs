"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const Button = React.forwardRef((props, forwardedRef) => {
    return (React.createElement("button", { ref: forwardedRef, type: "button", ...props, style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            height: '1.714em',
            padding: '0 0.6em',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            borderRadius: 'min(max(calc(var(--wi-s) * 0.6), 1px), 7px)',
            border: 'none',
            backgroundColor: 'var(--wi-c)',
            color: 'white',
            ...props.style,
        } }));
});
exports.Button = Button;
Button.displayName = 'Button';
//# sourceMappingURL=button.js.map
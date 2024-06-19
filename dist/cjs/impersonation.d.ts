import * as React from 'react';
interface ImpersonationProps extends React.ComponentPropsWithoutRef<'div'> {
    side?: 'top' | 'bottom';
}
export declare function Impersonation({ side, ...props }: ImpersonationProps): Promise<React.JSX.Element | null>;
export {};

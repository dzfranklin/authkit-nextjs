declare const cookieName = "wos-session";
declare const cookieOptions: {
    path: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax";
    maxAge: number;
    domain: string | undefined;
};
export { cookieName, cookieOptions };

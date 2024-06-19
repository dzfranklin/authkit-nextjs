declare function getSignInUrl(): Promise<string>;
declare function getSignUpUrl(): Promise<string>;
declare function signOut(): Promise<void>;
export { getSignInUrl, getSignUpUrl, signOut };

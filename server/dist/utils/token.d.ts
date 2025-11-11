export type TokenPayload = {
    userId: number;
    role: string;
};
export declare const createAccessToken: (payload: TokenPayload) => string;
export declare const createRefreshToken: (payload: TokenPayload) => string;
export declare const verifyAccessToken: (token: string) => TokenPayload;
export declare const verifyRefreshToken: (token: string) => TokenPayload;
//# sourceMappingURL=token.d.ts.map
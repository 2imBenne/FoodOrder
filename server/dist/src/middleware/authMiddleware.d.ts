import { Request, Response, NextFunction } from "express";
export type UserRole = "USER" | "ADMIN";
export declare const authenticate: (allowGuest?: boolean) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const authorize: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=authMiddleware.d.ts.map
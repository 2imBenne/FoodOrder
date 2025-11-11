import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";

export type UserRole = "USER" | "ADMIN";

export const authenticate =
  (allowGuest = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      if (allowGuest) {
        return next();
      }
      return res.status(401).json({ message: "Authentication required" });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ message: "Invalid authorization header" });
    }

    try {
      const payload = verifyAccessToken(token);
      req.user = { id: payload.userId, role: payload.role as UserRole };
      return next();
    } catch (error) {
      if (allowGuest) {
        return next();
      }
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    return next();
  };

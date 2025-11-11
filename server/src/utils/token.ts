import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type TokenPayload = {
  userId: number;
  role: string;
};

export const createAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30m" });
};

export const createRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.REFRESH_SECRET) as TokenPayload;
};

import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/token";

const serializeUser = (user: {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  address: string | null;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  address: user.address,
});

export const register = async (req: Request, res: Response) => {
  const { name, email, password, phone, address } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone,
      address,
      role: "USER",
    },
  });

  const payload = { userId: user.id, role: user.role };

  return res.status(201).json({
    user: serializeUser(user),
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { userId: user.id, role: user.role };

  return res.json({
    user: serializeUser(user),
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Missing refresh token" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    return res.json({
      user: serializeUser(user),
      accessToken: createAccessToken({ userId: user.id, role: user.role }),
      refreshToken: createRefreshToken({ userId: user.id, role: user.role }),
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
};

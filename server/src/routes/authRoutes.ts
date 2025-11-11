import { Router } from "express";
import { z } from "zod";
import {
  getProfile,
  login,
  refresh,
  register,
} from "../controllers/authController";
import { validateBody } from "../middleware/validateRequest";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(9).max(15),
  address: z.string().min(5),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", validateBody(refreshSchema), refresh);
router.get("/me", authenticate(), getProfile);

export default router;

import { Router } from "express";
import { z } from "zod";
import { applyVoucher } from "../controllers/voucherController";
import { authenticate } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateRequest";

const router = Router();

router.post(
  "/apply",
  authenticate(),
  validateBody(
    z.object({
      code: z.string().min(3),
      subtotal: z.number().positive(),
    })
  ),
  applyVoucher
);

export default router;

import { Router } from "express";
import { z } from "zod";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { getReports } from "../controllers/reportController";
import { validateQuery } from "../middleware/validateRequest";

const router = Router();

router.get(
  "/",
  authenticate(),
  authorize("ADMIN"),
  validateQuery(
    z.object({
      range: z.enum(["daily", "weekly", "monthly"]).optional(),
    })
  ),
  getReports
);

export default router;

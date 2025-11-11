import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getMyNotifications, markNotificationAsRead } from "../controllers/notificationController";
import { validateParams } from "../middleware/validateRequest";
import { z } from "zod";

const router = Router();

router.use(authenticate());

router.get("/", getMyNotifications);
router.patch(
  "/:id/read",
  validateParams(
    z.object({
      id: z.string().regex(/^\d+$/),
    })
  ),
  markNotificationAsRead
);

export default router;

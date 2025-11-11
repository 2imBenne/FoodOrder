import { Router } from "express";
import { z } from "zod";
import {
  cancelOrder,
  createOrder,
  generateInvoice,
  getAdminOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import {
  validateBody,
  validateParams,
} from "../middleware/validateRequest";

const router = Router();

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        dishId: z.number().int().positive(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
  address: z.string().min(5),
  phone: z.string().min(9),
  note: z.string().optional(),
  voucherCode: z.string().optional(),
  shippingZoneId: z.number().int().optional(),
});

const orderIdParam = z.object({
  id: z.string().regex(/^\d+$/),
});

const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PREPARING",
    "DELIVERING",
    "COMPLETED",
    "CANCELLED",
  ]),
  note: z.string().optional(),
});

const cancelSchema = z.object({
  reason: z.string().min(5).max(200),
});

router.get(
  "/admin",
  authenticate(),
  authorize("ADMIN"),
  getAdminOrders
);

router.patch(
  "/admin/:id/status",
  authenticate(),
  authorize("ADMIN"),
  validateParams(orderIdParam),
  validateBody(updateStatusSchema),
  updateOrderStatus
);

router.post("/", authenticate(), validateBody(orderSchema), createOrder);
router.get("/", authenticate(), getMyOrders);
router.get(
  "/:id/invoice",
  authenticate(),
  validateParams(orderIdParam),
  generateInvoice
);
router.get(
  "/:id",
  authenticate(),
  validateParams(orderIdParam),
  getOrderById
);
router.patch(
  "/:id/cancel",
  authenticate(),
  validateParams(orderIdParam),
  validateBody(cancelSchema),
  cancelOrder
);

export default router;

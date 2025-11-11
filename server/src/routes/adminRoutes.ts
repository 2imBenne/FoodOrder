import { Router } from "express";
import { z } from "zod";
import {
  createCategory,
  createDish,
  deleteCategory,
  deleteDish,
  deleteShippingZone,
  listCategories,
  listDishes,
  listShippingZones,
  listUsers,
  updateCategory,
  updateDish,
  updateUserRole,
  upsertShippingZone,
} from "../controllers/adminController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import {
  validateBody,
  validateParams,
} from "../middleware/validateRequest";
import {
  createVoucher,
  listVouchers,
  updateVoucher,
} from "../controllers/voucherController";

const router = Router();

router.use(authenticate(), authorize("ADMIN"));

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

const dishSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.number().int(),
  imageUrl: z.string().url().optional(),
  isFeatured: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
});

const shippingSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(2),
  fee: z.number().nonnegative(),
});

const roleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

const voucherSchema = z.object({
  code: z
    .string()
    .min(3)
    .transform((value) => value.toUpperCase()),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive(),
  minOrder: z.number().nonnegative().default(0),
  maxDiscount: z.number().nonnegative().optional(),
  startDate: z.string(),
  endDate: z.string(),
  isActive: z.boolean().optional().default(true),
});

const idParam = z.object({
  id: z.string().regex(/^\d+$/),
});

router.get("/categories", listCategories);
router.post("/categories", validateBody(categorySchema), createCategory);
router.patch(
  "/categories/:id",
  validateParams(idParam),
  validateBody(categorySchema.partial()),
  updateCategory
);
router.delete("/categories/:id", validateParams(idParam), deleteCategory);

router.get("/dishes", listDishes);
router.post("/dishes", validateBody(dishSchema), createDish);
router.patch(
  "/dishes/:id",
  validateParams(idParam),
  validateBody(dishSchema.partial()),
  updateDish
);
router.delete("/dishes/:id", validateParams(idParam), deleteDish);

router.get("/users", listUsers);
router.patch(
  "/users/:id/role",
  validateParams(idParam),
  validateBody(roleSchema),
  updateUserRole
);

router.get("/shipping-zones", listShippingZones);
router.post("/shipping-zones", validateBody(shippingSchema), upsertShippingZone);
router.delete(
  "/shipping-zones/:id",
  validateParams(idParam),
  deleteShippingZone
);

router.get("/vouchers", listVouchers);
router.post("/vouchers", validateBody(voucherSchema), createVoucher);
router.patch(
  "/vouchers/:id",
  validateParams(idParam),
  validateBody(voucherSchema.partial()),
  updateVoucher
);

export default router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const voucherController_1 = require("../controllers/voucherController");
const router = (0, express_1.Router)();
router.use((0, authMiddleware_1.authenticate)(), (0, authMiddleware_1.authorize)("ADMIN"));
const categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional().default(true),
});
const dishSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive(),
    categoryId: zod_1.z.number().int(),
    imageUrl: zod_1.z.string().url().optional(),
    isFeatured: zod_1.z.boolean().optional().default(false),
    isAvailable: zod_1.z.boolean().optional().default(true),
});
const shippingSchema = zod_1.z.object({
    id: zod_1.z.number().int().optional(),
    name: zod_1.z.string().min(2),
    fee: zod_1.z.number().nonnegative(),
});
const roleSchema = zod_1.z.object({
    role: zod_1.z.enum(["USER", "ADMIN"]),
});
const voucherSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(3)
        .transform((value) => value.toUpperCase()),
    description: zod_1.z.string().optional(),
    discountType: zod_1.z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: zod_1.z.number().positive(),
    minOrder: zod_1.z.number().nonnegative().default(0),
    maxDiscount: zod_1.z.number().nonnegative().optional(),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    isActive: zod_1.z.boolean().optional().default(true),
});
const idParam = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/),
});
router.get("/categories", adminController_1.listCategories);
router.post("/categories", (0, validateRequest_1.validateBody)(categorySchema), adminController_1.createCategory);
router.patch("/categories/:id", (0, validateRequest_1.validateParams)(idParam), (0, validateRequest_1.validateBody)(categorySchema.partial()), adminController_1.updateCategory);
router.delete("/categories/:id", (0, validateRequest_1.validateParams)(idParam), adminController_1.deleteCategory);
router.get("/dishes", adminController_1.listDishes);
router.post("/dishes", (0, validateRequest_1.validateBody)(dishSchema), adminController_1.createDish);
router.patch("/dishes/:id", (0, validateRequest_1.validateParams)(idParam), (0, validateRequest_1.validateBody)(dishSchema.partial()), adminController_1.updateDish);
router.delete("/dishes/:id", (0, validateRequest_1.validateParams)(idParam), adminController_1.deleteDish);
router.get("/users", adminController_1.listUsers);
router.patch("/users/:id/role", (0, validateRequest_1.validateParams)(idParam), (0, validateRequest_1.validateBody)(roleSchema), adminController_1.updateUserRole);
router.get("/shipping-zones", adminController_1.listShippingZones);
router.post("/shipping-zones", (0, validateRequest_1.validateBody)(shippingSchema), adminController_1.upsertShippingZone);
router.delete("/shipping-zones/:id", (0, validateRequest_1.validateParams)(idParam), adminController_1.deleteShippingZone);
router.get("/vouchers", voucherController_1.listVouchers);
router.post("/vouchers", (0, validateRequest_1.validateBody)(voucherSchema), voucherController_1.createVoucher);
router.patch("/vouchers/:id", (0, validateRequest_1.validateParams)(idParam), (0, validateRequest_1.validateBody)(voucherSchema.partial()), voucherController_1.updateVoucher);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map
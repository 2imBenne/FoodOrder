"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
const orderSchema = zod_1.z.object({
    items: zod_1.z
        .array(zod_1.z.object({
        dishId: zod_1.z.number().int().positive(),
        quantity: zod_1.z.number().int().min(1),
    }))
        .min(1),
    address: zod_1.z.string().min(5),
    phone: zod_1.z.string().min(9),
    note: zod_1.z.string().optional(),
    voucherCode: zod_1.z.string().optional(),
    shippingZoneId: zod_1.z.number().int().optional(),
});
const orderIdParam = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "PENDING",
        "PREPARING",
        "DELIVERING",
        "COMPLETED",
        "CANCELLED",
    ]),
    note: zod_1.z.string().optional(),
});
router.get("/admin", (0, authMiddleware_1.authenticate)(), (0, authMiddleware_1.authorize)("ADMIN"), orderController_1.getAdminOrders);
router.patch("/admin/:id/status", (0, authMiddleware_1.authenticate)(), (0, authMiddleware_1.authorize)("ADMIN"), (0, validateRequest_1.validateParams)(orderIdParam), (0, validateRequest_1.validateBody)(updateStatusSchema), orderController_1.updateOrderStatus);
router.post("/", (0, authMiddleware_1.authenticate)(), (0, validateRequest_1.validateBody)(orderSchema), orderController_1.createOrder);
router.get("/", (0, authMiddleware_1.authenticate)(), orderController_1.getMyOrders);
router.get("/:id/invoice", (0, authMiddleware_1.authenticate)(), (0, validateRequest_1.validateParams)(orderIdParam), orderController_1.generateInvoice);
router.get("/:id", (0, authMiddleware_1.authenticate)(), (0, validateRequest_1.validateParams)(orderIdParam), orderController_1.getOrderById);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map
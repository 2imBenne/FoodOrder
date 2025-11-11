"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const menuController_1 = require("../controllers/menuController");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
const dishQuerySchema = zod_1.z.object({
    categoryId: zod_1.z.string().optional(),
    minPrice: zod_1.z.string().optional(),
    maxPrice: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    isFeatured: zod_1.z.string().optional(),
});
router.get("/categories", menuController_1.getCategories);
router.get("/dishes", (0, validateRequest_1.validateQuery)(dishQuerySchema), menuController_1.getDishes);
router.get("/dishes/:id", (0, validateRequest_1.validateParams)(zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/),
})), menuController_1.getDishById);
router.get("/shipping-zones", menuController_1.getShippingZones);
exports.default = router;
//# sourceMappingURL=menuRoutes.js.map
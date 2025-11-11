"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const voucherController_1 = require("../controllers/voucherController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
router.post("/apply", (0, authMiddleware_1.authenticate)(), (0, validateRequest_1.validateBody)(zod_1.z.object({
    code: zod_1.z.string().min(3),
    subtotal: zod_1.z.number().positive(),
})), voucherController_1.applyVoucher);
exports.default = router;
//# sourceMappingURL=voucherRoutes.js.map
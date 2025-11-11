"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authController_1 = require("../controllers/authController");
const validateRequest_1 = require("../middleware/validateRequest");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().min(9).max(15),
    address: zod_1.z.string().min(5),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
router.post("/register", (0, validateRequest_1.validateBody)(registerSchema), authController_1.register);
router.post("/login", (0, validateRequest_1.validateBody)(loginSchema), authController_1.login);
router.post("/refresh", (0, validateRequest_1.validateBody)(refreshSchema), authController_1.refresh);
router.get("/me", (0, authMiddleware_1.authenticate)(), authController_1.getProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map
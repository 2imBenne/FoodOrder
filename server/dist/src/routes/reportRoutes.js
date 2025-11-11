"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authMiddleware_1 = require("../middleware/authMiddleware");
const reportController_1 = require("../controllers/reportController");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
router.get("/", (0, authMiddleware_1.authenticate)(), (0, authMiddleware_1.authorize)("ADMIN"), (0, validateRequest_1.validateQuery)(zod_1.z.object({
    range: zod_1.z.enum(["daily", "weekly", "monthly"]).optional(),
})), reportController_1.getReports);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map
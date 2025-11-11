"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const notificationController_1 = require("../controllers/notificationController");
const validateRequest_1 = require("../middleware/validateRequest");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
router.use((0, authMiddleware_1.authenticate)());
router.get("/", notificationController_1.getMyNotifications);
router.patch("/:id/read", (0, validateRequest_1.validateParams)(zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/),
})), notificationController_1.markNotificationAsRead);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map
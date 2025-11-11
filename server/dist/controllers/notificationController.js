"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationAsRead = exports.getMyNotifications = void 0;
const prisma_1 = require("../config/prisma");
const getMyNotifications = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    const notifications = await prisma_1.prisma.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
    });
    res.json({ notifications });
};
exports.getMyNotifications = getMyNotifications;
const markNotificationAsRead = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    const notificationId = Number(req.params.id);
    const notification = await prisma_1.prisma.notification.findFirst({
        where: { id: notificationId, userId: req.user.id },
    });
    if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
    }
    const updated = await prisma_1.prisma.notification.update({
        where: { id: notification.id },
        data: { status: "READ" },
    });
    res.json({ notification: updated });
};
exports.markNotificationAsRead = markNotificationAsRead;
//# sourceMappingURL=notificationController.js.map
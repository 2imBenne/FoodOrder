"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitOrderUpdate = exports.registerNotificationGateway = void 0;
const prisma_1 = require("../config/prisma");
let io = null;
const registerNotificationGateway = (server) => {
    io = server;
    io.on("connection", (socket) => {
        const rawId = socket.handshake.auth.userId ?? socket.handshake.query.userId;
        const userId = typeof rawId === "string" ? Number(rawId) : Number(rawId ?? 0);
        if (Number.isFinite(userId) && userId > 0) {
            socket.join(`user:${userId}`);
        }
    });
};
exports.registerNotificationGateway = registerNotificationGateway;
const emitOrderUpdate = async (userId, payload) => {
    await prisma_1.prisma.notification.create({
        data: {
            userId,
            message: payload.message,
            status: "UNREAD",
            orderId: payload.orderId,
        },
    });
    if (!io) {
        return;
    }
    io.to(`user:${userId}`).emit("order:update", payload);
};
exports.emitOrderUpdate = emitOrderUpdate;
//# sourceMappingURL=notificationService.js.map
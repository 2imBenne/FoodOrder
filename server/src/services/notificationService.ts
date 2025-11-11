import { Server, Socket } from "socket.io";
import { prisma } from "../config/prisma";

type OrderUpdatePayload = {
  orderId: number;
  status: string;
  message: string;
};

let io: Server | null = null;

export const registerNotificationGateway = (server: Server) => {
  io = server;
  io.on("connection", (socket: Socket) => {
    const rawId =
      socket.handshake.auth.userId ?? socket.handshake.query.userId;
    const userId =
      typeof rawId === "string" ? Number(rawId) : Number(rawId ?? 0);

    if (Number.isFinite(userId) && userId > 0) {
      socket.join(`user:${userId}`);
    }
  });
};

export const emitOrderUpdate = async (
  userId: number,
  payload: OrderUpdatePayload
) => {
  await prisma.notification.create({
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

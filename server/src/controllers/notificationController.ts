import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getMyNotifications = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json({ notifications });
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const notificationId = Number(req.params.id);

  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId: req.user.id },
  });

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  const updated = await prisma.notification.update({
    where: { id: notification.id },
    data: { status: "READ" },
  });

  res.json({ notification: updated });
};

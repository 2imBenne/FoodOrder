import { Request, Response } from "express";
import type { Dish, Prisma } from "../../generated/prismaClient/client";
import PDFDocument from "pdfkit";
import { prisma } from "../config/prisma";
import { emitOrderUpdate } from "../services/notificationService";
import { toMoney } from "../utils/money";

const formatCurrency = (value: unknown) => Number(value ?? 0).toFixed(2);

type OrderItemInput = {
  dishId: number;
  quantity: number;
};

export const createOrder = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { items, address, phone, note, voucherCode, shippingZoneId } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items are required" });
  }

  const orderItems = items as OrderItemInput[];
  const dishIds = orderItems.map((item) => item.dishId);

  const dishes: Dish[] = await prisma.dish.findMany({
    where: { id: { in: dishIds }, isAvailable: true },
  });

  if (dishes.length !== dishIds.length) {
    return res.status(400).json({ message: "One or more dishes unavailable" });
  }

  const subtotal = orderItems.reduce((sum: number, item: OrderItemInput) => {
    const dish = dishes.find((d) => d.id === item.dishId);
    if (!dish) return sum;
    return sum + Number(dish.price) * item.quantity;
  }, 0);

  const shippingZone = shippingZoneId
    ? await prisma.shippingZone.findUnique({ where: { id: shippingZoneId } })
    : null;

  if (shippingZoneId && !shippingZone) {
    return res.status(400).json({ message: "Invalid shipping zone" });
  }

  const shippingFee = shippingZone ? Number(shippingZone.fee) : 0;

  let voucher = null;
  let discountValue = 0;

  if (voucherCode) {
    voucher = await prisma.voucher.findUnique({ where: { code: voucherCode } });
    const now = new Date();
    if (
      !voucher ||
      !voucher.isActive ||
      voucher.startDate > now ||
      voucher.endDate < now ||
      subtotal < Number(voucher.minOrder)
    ) {
      return res.status(400).json({ message: "Voucher is not valid" });
    }

    if (voucher.discountType === "PERCENTAGE") {
      discountValue =
        (subtotal * Number(voucher.discountValue)) / 100;
      if (voucher.maxDiscount) {
        discountValue = Math.min(discountValue, Number(voucher.maxDiscount));
      }
    } else {
      discountValue = Number(voucher.discountValue);
    }
  }

  const total = Math.max(0, subtotal + shippingFee - discountValue);

  const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdOrder = await tx.order.create({
      data: {
        userId: req.user!.id,
        total: toMoney(total),
        shippingFee: toMoney(shippingFee),
        discount: toMoney(discountValue),
        note: note ?? null,
        addressSnapshot: address,
        phoneSnapshot: phone,
        status: "PENDING",
        voucherId: voucher?.id ?? null,
        shippingZoneId: shippingZone?.id ?? null,
        items: {
          create: orderItems.map((item) => {
            const dish = dishes.find((d) => d.id === item.dishId)!;
            return {
              dishId: item.dishId,
              quantity: item.quantity,
              unitPrice: toMoney(Number(dish.price)),
            };
          }),
        },
      },
      include: {
        items: { include: { dish: true } },
      },
    });

    return createdOrder;
  });

  await emitOrderUpdate(order.userId, {
    orderId: order.id,
    status: order.status,
    message: "Your order was created and is waiting for confirmation.",
  });

  res.status(201).json({ order });
};

export const getMyOrders = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: {
      items: { include: { dish: true } },
      voucher: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ orders });
};

export const getOrderById = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const orderId = Number(req.params.id);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { dish: true } },
      voucher: true,
      user: true,
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to view order" });
  }

  res.json({ order });
};

export const cancelOrder = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const orderId = Number(req.params.id);
  const { reason } = req.body as { reason: string };

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.userId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to cancel order" });
  }

  if (order.status !== "PENDING") {
    return res
      .status(400)
      .json({ message: "Order cannot be cancelled at this stage" });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
      cancelReason: reason,
      cancelledAt: new Date(),
    },
    include: {
      items: { include: { dish: true } },
      user: true,
    },
  });

  await emitOrderUpdate(updated.userId, {
    orderId: updated.id,
    status: updated.status,
    message: "Order has been cancelled by the customer.",
  });

  return res.json({ order: updated });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const { status, note } = req.body;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      note,
    },
    include: {
      user: true,
      items: { include: { dish: true } },
    },
  });

  await emitOrderUpdate(order.userId, {
    orderId: order.id,
    status: order.status,
    message: note ?? "Order status has been updated.",
  });

  res.json({ order });
};

export const getAdminOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      voucher: true,
      items: { include: { dish: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ orders });
};

export const generateInvoice = async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: { include: { dish: true } },
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (req.user?.role !== "ADMIN" && order.userId !== req.user?.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=order-${order.id}.pdf`
  );

  doc.fontSize(20).text("FoodOrder - Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: #${order.id}`);
  doc.text(`Customer: ${order.user.name}`);
  doc.text(`Delivery address: ${order.addressSnapshot}`);
  doc.text(`Phone: ${order.phoneSnapshot}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();

  const subtotal = order.items.reduce(
    (sum: number, item: (typeof order.items)[number]) =>
      sum + Number(item.unitPrice) * item.quantity,
    0
  );

  doc.fontSize(14).text("Items:");
  order.items.forEach((item: (typeof order.items)[number]) => {
    doc
      .fontSize(12)
      .text(
        `- ${item.dish.name} x${item.quantity} - ${formatCurrency(
          item.unitPrice
        )} VND`
      );
  });

  doc.moveDown();
  doc.text(`Subtotal: ${formatCurrency(subtotal)} VND`);
  doc.text(`Shipping fee: ${formatCurrency(order.shippingFee)} VND`);
  doc.text(`Discount: -${formatCurrency(order.discount)} VND`);
  doc.text(`Grand total: ${formatCurrency(order.total)} VND`, {
    align: "right",
  });

  doc.pipe(res);
  doc.end();

};

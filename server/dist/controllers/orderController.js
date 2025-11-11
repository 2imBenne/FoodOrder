"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoice = exports.getAdminOrders = exports.updateOrderStatus = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const prisma_1 = require("../config/prisma");
const notificationService_1 = require("../services/notificationService");
const money_1 = require("../utils/money");
const formatCurrency = (value) => Number(value ?? 0).toFixed(2);
const createOrder = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    const { items, address, phone, note, voucherCode, shippingZoneId } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order items are required" });
    }
    const orderItems = items;
    const dishIds = orderItems.map((item) => item.dishId);
    const dishes = await prisma_1.prisma.dish.findMany({
        where: { id: { in: dishIds }, isAvailable: true },
    });
    if (dishes.length !== dishIds.length) {
        return res.status(400).json({ message: "One or more dishes unavailable" });
    }
    const subtotal = orderItems.reduce((sum, item) => {
        const dish = dishes.find((d) => d.id === item.dishId);
        if (!dish)
            return sum;
        return sum + Number(dish.price) * item.quantity;
    }, 0);
    const shippingZone = shippingZoneId
        ? await prisma_1.prisma.shippingZone.findUnique({ where: { id: shippingZoneId } })
        : null;
    if (shippingZoneId && !shippingZone) {
        return res.status(400).json({ message: "Invalid shipping zone" });
    }
    const shippingFee = shippingZone ? Number(shippingZone.fee) : 0;
    let voucher = null;
    let discountValue = 0;
    if (voucherCode) {
        voucher = await prisma_1.prisma.voucher.findUnique({ where: { code: voucherCode } });
        const now = new Date();
        if (!voucher ||
            !voucher.isActive ||
            voucher.startDate > now ||
            voucher.endDate < now ||
            subtotal < Number(voucher.minOrder)) {
            return res.status(400).json({ message: "Voucher is not valid" });
        }
        if (voucher.discountType === "PERCENTAGE") {
            discountValue =
                (subtotal * Number(voucher.discountValue)) / 100;
            if (voucher.maxDiscount) {
                discountValue = Math.min(discountValue, Number(voucher.maxDiscount));
            }
        }
        else {
            discountValue = Number(voucher.discountValue);
        }
    }
    const total = Math.max(0, subtotal + shippingFee - discountValue);
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
            data: {
                userId: req.user.id,
                total: (0, money_1.toMoney)(total),
                shippingFee: (0, money_1.toMoney)(shippingFee),
                discount: (0, money_1.toMoney)(discountValue),
                note,
                addressSnapshot: address,
                phoneSnapshot: phone,
                status: "PENDING",
                voucherId: voucher?.id,
                shippingZoneId: shippingZone?.id,
                items: {
                    create: orderItems.map((item) => {
                        const dish = dishes.find((d) => d.id === item.dishId);
                        return {
                            dishId: item.dishId,
                            quantity: item.quantity,
                            unitPrice: (0, money_1.toMoney)(Number(dish.price)),
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
    await (0, notificationService_1.emitOrderUpdate)(order.userId, {
        orderId: order.id,
        status: order.status,
        message: "Your order was created and is waiting for confirmation.",
    });
    res.status(201).json({ order });
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    const orders = await prisma_1.prisma.order.findMany({
        where: { userId: req.user.id },
        include: {
            items: { include: { dish: true } },
            voucher: true,
        },
        orderBy: { createdAt: "desc" },
    });
    res.json({ orders });
};
exports.getMyOrders = getMyOrders;
const getOrderById = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    const orderId = Number(req.params.id);
    const order = await prisma_1.prisma.order.findUnique({
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
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res) => {
    const orderId = Number(req.params.id);
    const { status, note } = req.body;
    const order = await prisma_1.prisma.order.update({
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
    await (0, notificationService_1.emitOrderUpdate)(order.userId, {
        orderId: order.id,
        status: order.status,
        message: note ?? "Order status has been updated.",
    });
    res.json({ order });
};
exports.updateOrderStatus = updateOrderStatus;
const getAdminOrders = async (_req, res) => {
    const orders = await prisma_1.prisma.order.findMany({
        include: {
            user: true,
            voucher: true,
            items: { include: { dish: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    res.json({ orders });
};
exports.getAdminOrders = getAdminOrders;
const generateInvoice = async (req, res) => {
    const orderId = Number(req.params.id);
    const order = await prisma_1.prisma.order.findUnique({
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
    const doc = new pdfkit_1.default();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=order-${order.id}.pdf`);
    doc.fontSize(20).text("FoodOrder - Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: #${order.id}`);
    doc.text(`Customer: ${order.user.name}`);
    doc.text(`Delivery address: ${order.addressSnapshot}`);
    doc.text(`Phone: ${order.phoneSnapshot}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();
    const subtotal = order.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
    doc.fontSize(14).text("Items:");
    order.items.forEach((item) => {
        doc
            .fontSize(12)
            .text(`- ${item.dish.name} x${item.quantity} - ${formatCurrency(item.unitPrice)} VND`);
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
exports.generateInvoice = generateInvoice;
//# sourceMappingURL=orderController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyVoucher = exports.updateVoucher = exports.createVoucher = exports.listVouchers = void 0;
const prisma_1 = require("../config/prisma");
const money_1 = require("../utils/money");
const listVouchers = async (_req, res) => {
    const vouchers = await prisma_1.prisma.voucher.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json({ vouchers });
};
exports.listVouchers = listVouchers;
const createVoucher = async (req, res) => {
    const data = req.body;
    const voucher = await prisma_1.prisma.voucher.create({
        data: {
            code: data.code,
            description: data.description,
            discountType: data.discountType,
            discountValue: (0, money_1.toMoney)(Number(data.discountValue)),
            minOrder: (0, money_1.toMoney)(Number(data.minOrder ?? 0)),
            maxDiscount: data.maxDiscount
                ? (0, money_1.toMoney)(Number(data.maxDiscount))
                : null,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            isActive: data.isActive ?? true,
        },
    });
    res.status(201).json({ voucher });
};
exports.createVoucher = createVoucher;
const updateVoucher = async (req, res) => {
    const id = Number(req.params.id);
    const data = req.body;
    const voucher = await prisma_1.prisma.voucher.update({
        where: { id },
        data: {
            code: data.code,
            description: data.description,
            discountType: data.discountType,
            discountValue: (0, money_1.toMoney)(Number(data.discountValue)),
            minOrder: (0, money_1.toMoney)(Number(data.minOrder ?? 0)),
            maxDiscount: data.maxDiscount
                ? (0, money_1.toMoney)(Number(data.maxDiscount))
                : null,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            isActive: data.isActive,
        },
    });
    res.json({ voucher });
};
exports.updateVoucher = updateVoucher;
const applyVoucher = async (req, res) => {
    const { code, subtotal } = req.body;
    const voucher = await prisma_1.prisma.voucher.findUnique({ where: { code } });
    const now = new Date();
    if (!voucher ||
        !voucher.isActive ||
        voucher.startDate > now ||
        voucher.endDate < now ||
        subtotal < Number(voucher.minOrder)) {
        return res.status(400).json({ message: "Voucher is not valid" });
    }
    let discount = 0;
    if (voucher.discountType === "PERCENTAGE") {
        discount = (subtotal * Number(voucher.discountValue)) / 100;
        if (voucher.maxDiscount) {
            discount = Math.min(discount, Number(voucher.maxDiscount));
        }
    }
    else {
        discount = Number(voucher.discountValue);
    }
    res.json({
        voucher,
        discount: Number(discount.toFixed(2)),
    });
};
exports.applyVoucher = applyVoucher;
//# sourceMappingURL=voucherController.js.map
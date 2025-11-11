import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { toMoney } from "../utils/money";

export const listVouchers = async (_req: Request, res: Response) => {
  const vouchers = await prisma.voucher.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json({ vouchers });
};

export const createVoucher = async (req: Request, res: Response) => {
  const data = req.body;

  const voucher = await prisma.voucher.create({
    data: {
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: toMoney(Number(data.discountValue)),
      minOrder: toMoney(Number(data.minOrder ?? 0)),
      maxDiscount: data.maxDiscount
        ? toMoney(Number(data.maxDiscount))
        : null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive ?? true,
    },
  });

  res.status(201).json({ voucher });
};

export const updateVoucher = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  const voucher = await prisma.voucher.update({
    where: { id },
    data: {
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: toMoney(Number(data.discountValue)),
      minOrder: toMoney(Number(data.minOrder ?? 0)),
      maxDiscount: data.maxDiscount
        ? toMoney(Number(data.maxDiscount))
        : null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive,
    },
  });

  res.json({ voucher });
};

export const applyVoucher = async (req: Request, res: Response) => {
  const { code, subtotal } = req.body;

  const voucher = await prisma.voucher.findUnique({ where: { code } });
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

  let discount = 0;
  if (voucher.discountType === "PERCENTAGE") {
    discount = (subtotal * Number(voucher.discountValue)) / 100;
    if (voucher.maxDiscount) {
      discount = Math.min(discount, Number(voucher.maxDiscount));
    }
  } else {
    discount = Number(voucher.discountValue);
  }

  res.json({
    voucher,
    discount: Number(discount.toFixed(2)),
  });
};

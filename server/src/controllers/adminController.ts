import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { toMoney } from "../utils/money";

export const listCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json({ categories });
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, description, isActive } = req.body;

  const category = await prisma.category.create({
    data: { name, description, isActive },
  });

  res.status(201).json({ category });
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, description, isActive } = req.body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (isActive !== undefined) data.isActive = isActive;

  const category = await prisma.category.update({
    where: { id },
    data,
  });

  res.json({ category });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await prisma.category.delete({ where: { id } });

  res.status(204).send();
};

export const listDishes = async (_req: Request, res: Response) => {
  const dishes = await prisma.dish.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  res.json({ dishes });
};

export const createDish = async (req: Request, res: Response) => {
  const { name, description, price, categoryId, imageUrl, isFeatured, isAvailable } =
    req.body;

  const dish = await prisma.dish.create({
    data: {
      name,
      description,
      price: toMoney(Number(price)),
      categoryId,
      imageUrl,
      isFeatured,
      isAvailable,
    },
  });

  res.status(201).json({ dish });
};

export const updateDish = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, description, price, categoryId, imageUrl, isFeatured, isAvailable } =
    req.body;

  const data: Record<string, unknown> = {};

  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = toMoney(Number(price));
  if (categoryId !== undefined) data.categoryId = categoryId;
  if (imageUrl !== undefined) data.imageUrl = imageUrl;
  if (isFeatured !== undefined) data.isFeatured = isFeatured;
  if (isAvailable !== undefined) data.isAvailable = isAvailable;

  const dish = await prisma.dish.update({
    where: { id },
    data,
  });

  res.json({ dish });
};

export const deleteDish = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.dish.delete({ where: { id } });
  res.status(204).send();
};

export const listUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  res.json({ users });
};

export const updateUserRole = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { role } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
    },
  });

  res.json({ user });
};

export const listShippingZones = async (_req: Request, res: Response) => {
  const zones = await prisma.shippingZone.findMany({
    orderBy: { fee: "asc" },
  });

  res.json({ zones });
};

export const upsertShippingZone = async (req: Request, res: Response) => {
  const { id, name, fee } = req.body;

  const payload = {
    name,
    fee: toMoney(Number(fee)),
  };

  if (id) {
    const zone = await prisma.shippingZone.update({
      where: { id },
      data: payload,
    });
    return res.json({ zone });
  }

  const zone = await prisma.shippingZone.create({ data: payload });
  return res.status(201).json({ zone });
};

export const deleteShippingZone = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.shippingZone.delete({ where: { id } });
  res.status(204).send();
};

import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  res.json({ categories });
};

export const getDishes = async (req: Request, res: Response) => {
  const { categoryId, minPrice, maxPrice, search, isFeatured } = req.query;

  const filters: Record<string, unknown> = {};

  if (categoryId) {
    filters.categoryId = Number(categoryId);
  }
  if (minPrice || maxPrice) {
    filters.price = {
      gte: minPrice ? Number(minPrice) : undefined,
      lte: maxPrice ? Number(maxPrice) : undefined,
    };
  }
  if (typeof isFeatured === "string") {
    filters.isFeatured = isFeatured === "true";
  }
  if (search) {
    filters.OR = [
      { name: { contains: search as string, mode: "insensitive" } },
      { description: { contains: search as string, mode: "insensitive" } },
    ];
  }

  const dishes = await prisma.dish.findMany({
    where: {
      ...filters,
      isAvailable: true,
    },
    include: { category: true },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
      { name: "asc" },
    ],
  });

  res.json({ dishes });
};

export const getDishById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const dish = await prisma.dish.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!dish) {
    return res.status(404).json({ message: "Dish not found" });
  }

  return res.json({ dish });
};

export const getShippingZones = async (_req: Request, res: Response) => {
  const zones = await prisma.shippingZone.findMany({
    orderBy: { fee: "asc" },
  });
  res.json({ zones });
};

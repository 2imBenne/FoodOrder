import { Request, Response } from "express";
import {
  addDays,
  startOfDay,
  subDays,
  startOfWeek,
  startOfMonth,
} from "date-fns";
import { prisma } from "../config/prisma";

const getRangeStart = (range?: string): Date => {
  const today = startOfDay(new Date());
  switch (range) {
    case "weekly":
      return startOfWeek(today, { weekStartsOn: 1 });
    case "monthly":
      return startOfMonth(today);
    default:
      return subDays(today, 6);
  }
};

type StatusGroup = {
  status: string;
  _count: { _all: number };
};

type TopDishGroup = {
  dishId: number;
  _sum: { quantity: number | null };
};

export const getReports = async (req: Request, res: Response) => {
  const range = (req.query.range as string) ?? "daily";
  const from = getRangeStart(range);
  const to = addDays(new Date(), 1);

  const ordersByStatusPromise = prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
    where: { createdAt: { gte: from, lte: to } },
  });

  const topDishesPromise = prisma.orderItem.groupBy({
    by: ["dishId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const [revenue, ordersByStatusRaw, topDishesRaw] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: from, lte: to },
        status: { in: ["COMPLETED", "DELIVERING", "PREPARING", "PENDING"] },
      },
    }),
    ordersByStatusPromise,
    topDishesPromise,
  ]);

  const ordersByStatus = ordersByStatusRaw as StatusGroup[];
  const topDishes = topDishesRaw as TopDishGroup[];

  const dishIds = topDishes.map((item) => item.dishId);
  const dishes = await prisma.dish.findMany({ where: { id: { in: dishIds } } });

  res.json({
    range,
    revenue: revenue._sum.total ?? 0,
    ordersByStatus,
    topDishes: topDishes.map((item) => ({
      dish: dishes.find(
        (d: (typeof dishes)[number]) => d.id === item.dishId
      ),
      quantity: item._sum.quantity ?? 0,
    })),
  });
};

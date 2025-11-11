"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = require("../config/prisma");
const getRangeStart = (range) => {
    const today = (0, date_fns_1.startOfDay)(new Date());
    switch (range) {
        case "weekly":
            return (0, date_fns_1.startOfWeek)(today, { weekStartsOn: 1 });
        case "monthly":
            return (0, date_fns_1.startOfMonth)(today);
        default:
            return (0, date_fns_1.subDays)(today, 6);
    }
};
const getReports = async (req, res) => {
    const range = req.query.range ?? "daily";
    const from = getRangeStart(range);
    const to = (0, date_fns_1.addDays)(new Date(), 1);
    const ordersByStatusPromise = prisma_1.prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
        where: { createdAt: { gte: from, lte: to } },
    });
    const topDishesPromise = prisma_1.prisma.orderItem.groupBy({
        by: ["dishId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
    });
    const [revenue, ordersByStatusRaw, topDishesRaw] = await Promise.all([
        prisma_1.prisma.order.aggregate({
            _sum: { total: true },
            where: {
                createdAt: { gte: from, lte: to },
                status: { in: ["COMPLETED", "DELIVERING", "PREPARING", "PENDING"] },
            },
        }),
        ordersByStatusPromise,
        topDishesPromise,
    ]);
    const ordersByStatus = ordersByStatusRaw;
    const topDishes = topDishesRaw;
    const dishIds = topDishes.map((item) => item.dishId);
    const dishes = await prisma_1.prisma.dish.findMany({ where: { id: { in: dishIds } } });
    res.json({
        range,
        revenue: revenue._sum.total ?? 0,
        ordersByStatus,
        topDishes: topDishes.map((item) => ({
            dish: dishes.find((d) => d.id === item.dishId),
            quantity: item._sum.quantity ?? 0,
        })),
    });
};
exports.getReports = getReports;
//# sourceMappingURL=reportController.js.map
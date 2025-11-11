"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDishById = exports.getDishes = exports.getCategories = void 0;
const prisma_1 = require("../config/prisma");
const getCategories = async (_req, res) => {
    const categories = await prisma_1.prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });
    res.json({ categories });
};
exports.getCategories = getCategories;
const getDishes = async (req, res) => {
    const { categoryId, minPrice, maxPrice, search, isFeatured } = req.query;
    const filters = {};
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
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }
    const dishes = await prisma_1.prisma.dish.findMany({
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
exports.getDishes = getDishes;
const getDishById = async (req, res) => {
    const id = Number(req.params.id);
    const dish = await prisma_1.prisma.dish.findUnique({
        where: { id },
        include: { category: true },
    });
    if (!dish) {
        return res.status(404).json({ message: "Dish not found" });
    }
    return res.json({ dish });
};
exports.getDishById = getDishById;
//# sourceMappingURL=menuController.js.map
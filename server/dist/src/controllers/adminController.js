"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShippingZone = exports.upsertShippingZone = exports.listShippingZones = exports.updateUserRole = exports.listUsers = exports.deleteDish = exports.updateDish = exports.createDish = exports.listDishes = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.listCategories = void 0;
const prisma_1 = require("../config/prisma");
const money_1 = require("../utils/money");
const listCategories = async (_req, res) => {
    const categories = await prisma_1.prisma.category.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json({ categories });
};
exports.listCategories = listCategories;
const createCategory = async (req, res) => {
    const { name, description, isActive } = req.body;
    const category = await prisma_1.prisma.category.create({
        data: { name, description, isActive },
    });
    res.status(201).json({ category });
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    const id = Number(req.params.id);
    const { name, description, isActive } = req.body;
    const data = {};
    if (name !== undefined)
        data.name = name;
    if (description !== undefined)
        data.description = description;
    if (isActive !== undefined)
        data.isActive = isActive;
    const category = await prisma_1.prisma.category.update({
        where: { id },
        data,
    });
    res.json({ category });
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.prisma.category.delete({ where: { id } });
    res.status(204).send();
};
exports.deleteCategory = deleteCategory;
const listDishes = async (_req, res) => {
    const dishes = await prisma_1.prisma.dish.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
    res.json({ dishes });
};
exports.listDishes = listDishes;
const createDish = async (req, res) => {
    const { name, description, price, categoryId, imageUrl, isFeatured, isAvailable } = req.body;
    const dish = await prisma_1.prisma.dish.create({
        data: {
            name,
            description,
            price: (0, money_1.toMoney)(Number(price)),
            categoryId,
            imageUrl,
            isFeatured,
            isAvailable,
        },
    });
    res.status(201).json({ dish });
};
exports.createDish = createDish;
const updateDish = async (req, res) => {
    const id = Number(req.params.id);
    const { name, description, price, categoryId, imageUrl, isFeatured, isAvailable } = req.body;
    const data = {};
    if (name !== undefined)
        data.name = name;
    if (description !== undefined)
        data.description = description;
    if (price !== undefined)
        data.price = (0, money_1.toMoney)(Number(price));
    if (categoryId !== undefined)
        data.categoryId = categoryId;
    if (imageUrl !== undefined)
        data.imageUrl = imageUrl;
    if (isFeatured !== undefined)
        data.isFeatured = isFeatured;
    if (isAvailable !== undefined)
        data.isAvailable = isAvailable;
    const dish = await prisma_1.prisma.dish.update({
        where: { id },
        data,
    });
    res.json({ dish });
};
exports.updateDish = updateDish;
const deleteDish = async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.prisma.dish.delete({ where: { id } });
    res.status(204).send();
};
exports.deleteDish = deleteDish;
const listUsers = async (_req, res) => {
    const users = await prisma_1.prisma.user.findMany({
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
exports.listUsers = listUsers;
const updateUserRole = async (req, res) => {
    const id = Number(req.params.id);
    const { role } = req.body;
    const user = await prisma_1.prisma.user.update({
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
exports.updateUserRole = updateUserRole;
const listShippingZones = async (_req, res) => {
    const zones = await prisma_1.prisma.shippingZone.findMany({
        orderBy: { fee: "asc" },
    });
    res.json({ zones });
};
exports.listShippingZones = listShippingZones;
const upsertShippingZone = async (req, res) => {
    const { id, name, fee } = req.body;
    const payload = {
        name,
        fee: (0, money_1.toMoney)(Number(fee)),
    };
    if (id) {
        const zone = await prisma_1.prisma.shippingZone.update({
            where: { id },
            data: payload,
        });
        return res.json({ zone });
    }
    const zone = await prisma_1.prisma.shippingZone.create({ data: payload });
    return res.status(201).json({ zone });
};
exports.upsertShippingZone = upsertShippingZone;
const deleteShippingZone = async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.prisma.shippingZone.delete({ where: { id } });
    res.status(204).send();
};
exports.deleteShippingZone = deleteShippingZone;
//# sourceMappingURL=adminController.js.map
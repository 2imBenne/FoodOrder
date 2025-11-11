"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
const money_1 = require("../utils/money");
const categories = [
    { name: "Mon Viet", description: "Dam da huong vi truyen thong" },
    { name: "Do an nhanh", description: "Tien loi cho bua an ban ron" },
    { name: "Do uong", description: "Giai khat moi luc" },
];
const dishes = [
    {
        name: "Pho bo dac biet",
        description: "Nuoc dung ham xuong 12 gio, bo tai chin",
        price: 65000,
        category: "Mon Viet",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        isFeatured: true,
    },
    {
        name: "Banh mi kep thit",
        description: "Banh mi truyen thong kem pate va thit nguoi",
        price: 30000,
        category: "Mon Viet",
        imageUrl: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Ga ran gion",
        description: "Ga ran phong cach Han Quoc",
        price: 79000,
        category: "Do an nhanh",
        imageUrl: "https://images.unsplash.com/photo-1544025163-a5f47b7d8c34?auto=format&fit=crop&w=800&q=80",
        isFeatured: true,
    },
    {
        name: "Tra dao cam sa",
        description: "Do uong giai khat, topping dao gion",
        price: 45000,
        category: "Do uong",
        imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
    },
];
const shippingZones = [
    { name: "Noi thanh", fee: 15000 },
    { name: "Ngoai thanh", fee: 30000 },
];
const vouchers = [
    {
        code: "WELCOME10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrder: 100000,
        maxDiscount: 30000,
    },
    {
        code: "FREESHIP",
        discountType: "FIXED",
        discountValue: 15000,
        minOrder: 50000,
    },
];
async function main() {
    await prisma_1.prisma.notification.deleteMany();
    await prisma_1.prisma.orderItem.deleteMany();
    await prisma_1.prisma.order.deleteMany();
    await prisma_1.prisma.dish.deleteMany();
    await prisma_1.prisma.category.deleteMany();
    await prisma_1.prisma.shippingZone.deleteMany();
    await prisma_1.prisma.voucher.deleteMany();
    const categoryRecords = await Promise.all(categories.map((category) => prisma_1.prisma.category.create({ data: category })));
    for (const dish of dishes) {
        const category = categoryRecords.find((c) => c.name === dish.category);
        if (!category)
            continue;
        await prisma_1.prisma.dish.create({
            data: {
                name: dish.name,
                description: dish.description,
                price: (0, money_1.toMoney)(dish.price),
                imageUrl: dish.imageUrl,
                categoryId: category.id,
                isFeatured: dish.isFeatured ?? false,
            },
        });
    }
    await Promise.all(shippingZones.map((zone) => prisma_1.prisma.shippingZone.create({
        data: {
            name: zone.name,
            fee: (0, money_1.toMoney)(zone.fee),
        },
    })));
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);
    await Promise.all(vouchers.map((voucher) => prisma_1.prisma.voucher.create({
        data: {
            code: voucher.code,
            description: "Uu dai dac biet",
            discountType: voucher.discountType,
            discountValue: (0, money_1.toMoney)(voucher.discountValue),
            minOrder: (0, money_1.toMoney)(voucher.minOrder ?? 0),
            maxDiscount: voucher.maxDiscount
                ? (0, money_1.toMoney)(voucher.maxDiscount)
                : null,
            startDate: now,
            endDate: nextMonth,
            isActive: true,
        },
    })));
    const adminPassword = await (0, password_1.hashPassword)("Admin@123");
    await prisma_1.prisma.user.upsert({
        where: { email: "admin@foodorder.dev" },
        update: {},
        create: {
            name: "Super Admin",
            email: "admin@foodorder.dev",
            passwordHash: adminPassword,
            role: "ADMIN",
            phone: "0900000000",
            address: "Ha Noi",
        },
    });
    const userPassword = await (0, password_1.hashPassword)("User@123");
    await prisma_1.prisma.user.upsert({
        where: { email: "user@foodorder.dev" },
        update: {},
        create: {
            name: "Demo User",
            email: "user@foodorder.dev",
            passwordHash: userPassword,
            role: "USER",
            phone: "0911111111",
            address: "TP. Ho Chi Minh",
        },
    });
}
main()
    .then(async () => {
    // eslint-disable-next-line no-console
    console.log("Seed data created");
    await prisma_1.prisma.$disconnect();
})
    .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma_1.prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
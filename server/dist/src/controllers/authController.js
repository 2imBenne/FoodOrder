"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.refresh = exports.login = exports.register = void 0;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
const serializeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
});
const register = async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ message: "Email already registered" });
    }
    const passwordHash = await (0, password_1.hashPassword)(password);
    const user = await prisma_1.prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            phone,
            address,
            role: "USER",
        },
    });
    const payload = { userId: user.id, role: user.role };
    return res.status(201).json({
        user: serializeUser(user),
        accessToken: (0, token_1.createAccessToken)(payload),
        refreshToken: (0, token_1.createRefreshToken)(payload),
    });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const valid = await (0, password_1.comparePassword)(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const payload = { userId: user.id, role: user.role };
    return res.json({
        user: serializeUser(user),
        accessToken: (0, token_1.createAccessToken)(payload),
        refreshToken: (0, token_1.createRefreshToken)(payload),
    });
};
exports.login = login;
const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Missing refresh token" });
    }
    try {
        const payload = (0, token_1.verifyRefreshToken)(refreshToken);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }
        return res.json({
            user: serializeUser(user),
            accessToken: (0, token_1.createAccessToken)({ userId: user.id, role: user.role }),
            refreshToken: (0, token_1.createRefreshToken)({ userId: user.id, role: user.role }),
        });
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};
exports.refresh = refresh;
const getProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
        },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map
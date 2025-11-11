"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
const optional = (key, fallback) => {
    return process.env[key] ?? fallback;
};
const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
};
const clientOrigins = optional("CLIENT_URL", "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
exports.env = {
    NODE_ENV: optional("NODE_ENV", "development"),
    PORT: toNumber(optional("PORT", "5000"), 5000),
    DATABASE_URL: required("DATABASE_URL"),
    JWT_SECRET: required("JWT_SECRET"),
    REFRESH_SECRET: required("REFRESH_SECRET"),
    CLIENT_ORIGINS: clientOrigins,
};
//# sourceMappingURL=env.js.map
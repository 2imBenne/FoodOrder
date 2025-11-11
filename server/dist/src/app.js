"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const menuRoutes_1 = __importDefault(require("./routes/menuRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const voucherRoutes_1 = __importDefault(require("./routes/voucherRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true);
            return;
        }
        if (env_1.env.CLIENT_ORIGINS.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    limit: 100,
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(limiter);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/menu", menuRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/reports", reportRoutes_1.default);
app.use("/api/vouchers", voucherRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const token_1 = require("../utils/token");
const authenticate = (allowGuest = false) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        if (allowGuest) {
            return next();
        }
        return res.status(401).json({ message: "Authentication required" });
    }
    const [, token] = authHeader.split(" ");
    if (!token) {
        return res.status(401).json({ message: "Invalid authorization header" });
    }
    try {
        const payload = (0, token_1.verifyAccessToken)(token);
        req.user = { id: payload.userId, role: payload.role };
        return next();
    }
    catch (error) {
        if (allowGuest) {
            return next();
        }
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
    }
    return next();
};
exports.authorize = authorize;
//# sourceMappingURL=authMiddleware.js.map
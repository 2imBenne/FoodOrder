"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
// Central error handler to keep responses consistent
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    const statusCode = err.statusCode ?? 500;
    const isProduction = process.env.NODE_ENV === "production";
    res.status(statusCode).json({
        message: err.message || "Internal server error",
        stack: isProduction ? undefined : err.stack,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map
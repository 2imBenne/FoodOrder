"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const parse = (schema, location) => (req, res, next) => {
    try {
        const parsed = schema.parse(req[location]);
        Object.assign(req[location], parsed);
        next();
    }
    catch (error) {
        const details = error instanceof Error && "issues" in error
            ? error.issues
            : error;
        return res.status(400).json({
            message: "Validation error",
            details,
        });
    }
};
const validateBody = (schema) => parse(schema, "body");
exports.validateBody = validateBody;
const validateQuery = (schema) => parse(schema, "query");
exports.validateQuery = validateQuery;
const validateParams = (schema) => parse(schema, "params");
exports.validateParams = validateParams;
//# sourceMappingURL=validateRequest.js.map
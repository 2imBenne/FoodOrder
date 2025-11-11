import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

type RequestLocation = "body" | "query" | "params";

const parse =
  (schema: ZodTypeAny, location: RequestLocation) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[location]);
      Object.assign(req[location], parsed);
      next();
    } catch (error) {
      const details =
        error instanceof Error && "issues" in error
          ? (error as { issues?: unknown }).issues
          : error;
      return res.status(400).json({
        message: "Validation error",
        details,
      });
    }
  };

export const validateBody = (schema: ZodTypeAny) => parse(schema, "body");
export const validateQuery = (schema: ZodTypeAny) => parse(schema, "query");
export const validateParams = (schema: ZodTypeAny) => parse(schema, "params");

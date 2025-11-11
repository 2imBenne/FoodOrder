import { NextFunction, Request, Response } from "express";
export declare const notFoundHandler: (req: Request, res: Response) => void;
export declare const errorHandler: (err: Error & {
    statusCode?: number;
}, req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map
import { Request, Response } from "express";
export declare const listVouchers: (_req: Request, res: Response) => Promise<void>;
export declare const createVoucher: (req: Request, res: Response) => Promise<void>;
export declare const updateVoucher: (req: Request, res: Response) => Promise<void>;
export declare const applyVoucher: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=voucherController.d.ts.map
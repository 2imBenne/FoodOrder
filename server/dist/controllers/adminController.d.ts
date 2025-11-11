import { Request, Response } from "express";
export declare const listCategories: (_req: Request, res: Response) => Promise<void>;
export declare const createCategory: (req: Request, res: Response) => Promise<void>;
export declare const updateCategory: (req: Request, res: Response) => Promise<void>;
export declare const deleteCategory: (req: Request, res: Response) => Promise<void>;
export declare const listDishes: (_req: Request, res: Response) => Promise<void>;
export declare const createDish: (req: Request, res: Response) => Promise<void>;
export declare const updateDish: (req: Request, res: Response) => Promise<void>;
export declare const deleteDish: (req: Request, res: Response) => Promise<void>;
export declare const listUsers: (_req: Request, res: Response) => Promise<void>;
export declare const updateUserRole: (req: Request, res: Response) => Promise<void>;
export declare const listShippingZones: (_req: Request, res: Response) => Promise<void>;
export declare const upsertShippingZone: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteShippingZone: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=adminController.d.ts.map
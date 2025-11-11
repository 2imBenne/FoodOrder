import { Router } from "express";
import { z } from "zod";
import {
  getCategories,
  getDishes,
  getDishById,
  getShippingZones,
} from "../controllers/menuController";
import { validateParams, validateQuery } from "../middleware/validateRequest";

const router = Router();

const dishQuerySchema = z.object({
  categoryId: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  search: z.string().optional(),
  isFeatured: z.string().optional(),
});

router.get("/categories", getCategories);
router.get("/dishes", validateQuery(dishQuerySchema), getDishes);
router.get(
  "/dishes/:id",
  validateParams(
    z.object({
      id: z.string().regex(/^\d+$/),
    })
  ),
  getDishById
);
router.get("/shipping-zones", getShippingZones);

export default router;

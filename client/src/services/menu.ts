import { api } from "./api";
import { Category, Dish } from "../types";

export const fetchCategories = async () => {
  const { data } = await api.get<{ categories: Category[] }>("/menu/categories");
  return data.categories;
};

export const fetchDishes = async (params?: {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
}) => {
  const { data } = await api.get<{ dishes: Dish[] }>("/menu/dishes", {
    params,
  });
  return data.dishes;
};

export const fetchDish = async (id: number) => {
  const { data } = await api.get<{ dish: Dish }>(`/menu/dishes/${id}`);
  return data.dish;
};

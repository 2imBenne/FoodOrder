import { api } from "./api";
import { Category, Dish, ShippingZone, User, Voucher } from "../types";

export const upsertCategory = async (
  payload: Partial<Category> & { name?: string }
) => {
  if (payload.id) {
    const { data } = await api.patch<{ category: Category }>(
      `/admin/categories/${payload.id}`,
      payload
    );
    return data.category;
  }
  const { data } = await api.post<{ category: Category }>(
    "/admin/categories",
    payload
  );
  return data.category;
};

export const deleteCategory = async (id: number) => {
  await api.delete(`/admin/categories/${id}`);
};

export const upsertDish = async (payload: Partial<Dish> & { name?: string }) => {
  if (payload.id) {
    const { data } = await api.patch<{ dish: Dish }>(
      `/admin/dishes/${payload.id}`,
      payload
    );
    return data.dish;
  }
  const { data } = await api.post<{ dish: Dish }>("/admin/dishes", payload);
  return data.dish;
};

export const deleteDish = async (id: number) => {
  await api.delete(`/admin/dishes/${id}`);
};

export const fetchAdminCatalog = async () => {
  const [{ data: cat }, { data: dish }] = await Promise.all([
    api.get<{ categories: Category[] }>("/admin/categories"),
    api.get<{ dishes: Dish[] }>("/admin/dishes"),
  ]);
  return { categories: cat.categories, dishes: dish.dishes };
};

export const fetchAdminUsers = async () => {
  const { data } = await api.get<{ users: User[] }>("/admin/users");
  return data.users;
};

export const updateUserRole = async (id: number, role: "USER" | "ADMIN") => {
  const { data } = await api.patch<{ user: User }>(`/admin/users/${id}/role`, {
    role,
  });
  return data.user;
};

export const upsertShippingZone = async (payload: Partial<ShippingZone>) => {
  const { data } = await api.post<{ zone: ShippingZone }>(
    "/admin/shipping-zones",
    payload
  );
  return data.zone;
};

export const deleteShippingZone = async (id: number) => {
  await api.delete(`/admin/shipping-zones/${id}`);
};

export const fetchVouchers = async () => {
  const { data } = await api.get<{ vouchers: Voucher[] }>("/admin/vouchers");
  return data.vouchers;
};

export const upsertVoucher = async (
  payload: Partial<Voucher> & { code?: string }
) => {
  if (payload.id) {
    const { data } = await api.patch<{ voucher: Voucher }>(
      `/admin/vouchers/${payload.id}`,
      payload
    );
    return data.voucher;
  }
  const { data } = await api.post<{ voucher: Voucher }>(
    "/admin/vouchers",
    payload
  );
  return data.voucher;
};

export const fetchReports = async (range: "daily" | "weekly" | "monthly") => {
  const { data } = await api.get<{
    range: string;
    revenue: number;
    ordersByStatus: { status: string; _count: { _all: number } }[];
    topDishes: { dish?: Dish; quantity: number }[];
  }>("/reports", { params: { range } });
  return data;
};

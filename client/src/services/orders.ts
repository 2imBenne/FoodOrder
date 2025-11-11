import { api } from "./api";
import { Order, OrderStatus, ShippingZone, Voucher } from "../types";

export const fetchMyOrders = async () => {
  const { data } = await api.get<{ orders: Order[] }>("/orders");
  return data.orders;
};

export const fetchOrder = async (id: number) => {
  const { data } = await api.get<{ order: Order }>(`/orders/${id}`);
  return data.order;
};

export const createOrder = async (payload: {
  items: { dishId: number; quantity: number }[];
  address: string;
  phone: string;
  note?: string;
  voucherCode?: string;
  shippingZoneId?: number;
}) => {
  const { data } = await api.post<{ order: Order }>("/orders", payload);
  return data.order;
};

export const fetchAdminOrders = async () => {
  const { data } = await api.get<{ orders: Order[] }>("/orders/admin");
  return data.orders;
};

export const updateOrderStatus = async (
  id: number,
  payload: { status: OrderStatus; note?: string }
) => {
  const { data } = await api.patch<{ order: Order }>(
    `/orders/admin/${id}/status`,
    payload
  );
  return data.order;
};

export const cancelMyOrder = async (id: number, reason: string) => {
  const { data } = await api.patch<{ order: Order }>(
    `/orders/${id}/cancel`,
    { reason }
  );
  return data.order;
};

export const applyVoucher = async (payload: {
  code: string;
  subtotal: number;
}) => {
  const { data } = await api.post<{
    voucher: Voucher;
    discount: number;
  }>("/vouchers/apply", payload);
  return data;
};

export const fetchShippingZones = async () => {
  const { data } = await api.get<{ zones: ShippingZone[] }>(
    "/menu/shipping-zones"
  );
  return data.zones;
};

export type Role = "USER" | "ADMIN";

export type Category = {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
};

export type Dish = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  categoryId: number;
  category?: Category;
};

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED";

export type OrderItem = {
  id: number;
  dishId: number;
  quantity: number;
  unitPrice: number;
  dish?: Dish;
};

export type Order = {
  id: number;
  status: OrderStatus;
  total: number;
  shippingFee: number;
  discount: number;
  note?: string | null;
  cancelReason?: string | null;
  cancelledAt?: string | null;
  addressSnapshot: string;
  phoneSnapshot: string;
  createdAt: string;
  items: OrderItem[];
  voucher?: Voucher | null;
};

export type Voucher = {
  id: number;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrder: number;
  maxDiscount?: number | null;
  isActive: boolean;
};

export type ShippingZone = {
  id: number;
  name: string;
  fee: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: Role;
};

export type Notification = {
  id: number;
  message: string;
  orderId?: number | null;
  status: "UNREAD" | "READ";
  createdAt: string;
};

export type CartItem = {
  dish: Dish;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  note: string;
  voucherCode?: string;
  voucherDiscount: number;
  shippingZone?: ShippingZone;
};

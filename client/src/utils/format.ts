import dayjs from "dayjs";
import { OrderStatus } from "../types";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDateTime = (value: string) =>
  dayjs(value).format("DD/MM/YYYY HH:mm");

export const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "PREPARING":
      return "Đang chuẩn bị";
    case "DELIVERING":
      return "Đang giao";
    case "COMPLETED":
      return "Hoàn tất";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

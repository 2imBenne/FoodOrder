import { Badge } from "@chakra-ui/react";
import { OrderStatus } from "../types";
import { getStatusLabel } from "../utils/format";

const statusColor: Record<OrderStatus, string> = {
  PENDING: "gray",
  PREPARING: "orange",
  DELIVERING: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <Badge colorScheme={statusColor[status]}>{getStatusLabel(status)}</Badge>
);

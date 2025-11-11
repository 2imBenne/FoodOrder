import {
  Box,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAdminOrders, updateOrderStatus } from "../services/orders";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { formatCurrency } from "../utils/format";
import { OrderStatus } from "../types";

export const AdminOrdersPage = () => {
  const toast = useToast();
  const { data: orders, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
  });

  const mutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: OrderStatus;
    }) => updateOrderStatus(id, { status }),
    onSuccess: () => {
      toast({ title: "Cập nhật thành công", status: "success" });
      refetch();
    },
  });

  return (
    <Box>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Mã đơn</Th>
            <Th>Khách hàng</Th>
            <Th>Tổng tiền</Th>
            <Th>Trạng thái</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders?.map((order) => (
            <Tr key={order.id}>
              <Td>#{order.id}</Td>
              <Td>{order.addressSnapshot}</Td>
              <Td>{formatCurrency(order.total)}</Td>
              <Td>
                <OrderStatusBadge status={order.status} />
              </Td>
              <Td>
                <Stack direction="row">
                  <Select
                    size="sm"
                    defaultValue={order.status}
                    onChange={(event) =>
                      mutation.mutate({
                        id: order.id,
                        status: event.target.value as OrderStatus,
                      })
                    }
                  >
                    {["PENDING", "PREPARING", "DELIVERING", "COMPLETED", "CANCELLED"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      )
                    )}
                  </Select>
                </Stack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

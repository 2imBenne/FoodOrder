import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { cancelMyOrder, fetchMyOrders } from "../services/orders";
import { formatCurrency, formatDateTime } from "../utils/format";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderTimeline } from "../components/OrderTimeline";

export const OrdersPage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: orders } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const handleClose = () => {
    setCancelOrderId(null);
    setCancelReason("");
    onClose();
  };

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      cancelMyOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast({ title: "Đã hủy đơn hàng", status: "success" });
      handleClose();
    },
    onError: () => toast({ title: "Không thể hủy đơn", status: "error" }),
  });

  const openCancelModal = (id: number) => {
    setCancelOrderId(id);
    setCancelReason("");
    onOpen();
  };

  const confirmCancel = () => {
    if (!cancelOrderId) return;
    cancelMutation.mutate({ id: cancelOrderId, reason: cancelReason });
  };

  if (!orders?.length) {
    return <Text>Chưa có đơn hàng nào.</Text>;
  }

  return (
    <Stack spacing={6}>
      <Heading size="lg">Đơn hàng của tôi</Heading>
      <Stack spacing={4}>
        {orders.map((order) => (
          <Card key={order.id}>
            <CardBody>
              <Stack spacing={3}>
                <SimpleGrid columns={{ base: 1, md: 3 }}>
                  <Text>Mã đơn #{order.id}</Text>
                  <Text>Ngày tạo: {formatDateTime(order.createdAt)}</Text>
                  <OrderStatusBadge status={order.status} />
                </SimpleGrid>
                <OrderTimeline status={order.status} />
                <Divider />
                <Stack spacing={2}>
                  {order.items.map((item) => (
                    <SimpleGrid
                      key={item.id}
                      columns={{ base: 1, md: 3 }}
                      fontSize="sm"
                    >
                      <Text>{item.dish?.name}</Text>
                      <Text>Số lượng: {item.quantity}</Text>
                      <Text textAlign="right">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </Text>
                    </SimpleGrid>
                  ))}
                </Stack>
                <Box textAlign="right">
                  <Text fontWeight="semibold">
                    Tổng tiền: {formatCurrency(order.total)}
                  </Text>
                  {order.status === "PENDING" && (
                    <Button
                      mt={2}
                      size="sm"
                      variant="ghost"
                      onClick={() => openCancelModal(order.id)}
                    >
                      Hủy đơn
                    </Button>
                  )}
                  {order.status === "CANCELLED" && order.cancelReason && (
                    <Text fontSize="sm" color="gray.500">
                      Lý do hủy: {order.cancelReason}
                    </Text>
                  )}
                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hủy đơn hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" mb={2}>
              Vui lòng nhập lý do hủy
            </Text>
            <Textarea
              rows={4}
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Đóng
            </Button>
            <Button
              colorScheme="red"
              onClick={confirmCancel}
              isLoading={cancelMutation.isPending}
              isDisabled={cancelReason.trim().length < 5}
            >
              Xác nhận hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

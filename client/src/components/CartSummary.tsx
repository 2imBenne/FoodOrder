import { Button, Stack, Text } from "@chakra-ui/react";
import { formatCurrency } from "../utils/format";

type Props = {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  onCheckout?: () => void;
};

export const CartSummary = ({
  subtotal,
  shippingFee,
  discount,
  total,
  onCheckout,
}: Props) => (
  <Stack
    spacing={3}
    layerStyle="glass"
    borderRadius="2xl"
    p={6}
    position="sticky"
    top={8}
  >
    <Text fontWeight="bold" fontSize="lg">
      Tổng kết đơn
    </Text>
    <SummaryRow label="Tạm tính" value={formatCurrency(subtotal)} />
    <SummaryRow label="Phí giao hàng" value={formatCurrency(shippingFee)} />
    <SummaryRow label="Giảm giá" value={`- ${formatCurrency(discount)}`} />
    <Stack direction="row" justify="space-between" pt={2}>
      <Text fontWeight="semibold">Cần thanh toán</Text>
      <Text fontSize="xl" fontWeight="bold">
        {formatCurrency(total)}
      </Text>
    </Stack>
    {onCheckout && (
      <Button size="lg" onClick={onCheckout} isDisabled={total <= 0}>
        Đặt hàng
      </Button>
    )}
  </Stack>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <Stack direction="row" justify="space-between" fontSize="sm" color="gray.600">
    <Text>{label}</Text>
    <Text fontWeight="semibold">{value}</Text>
  </Stack>
);

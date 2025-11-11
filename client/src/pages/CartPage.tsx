import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { formatCurrency } from "../utils/format";
import { CartSummary } from "../components/CartSummary";

export const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    shippingFee,
    discount,
    total,
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Stack spacing={4} textAlign="center" align="center">
        <Text fontSize="xl" fontWeight="semibold">
          Giỏ hàng đang trống
        </Text>
        <Button onClick={() => navigate("/menu")}>Tiếp tục chọn món</Button>
      </Stack>
    );
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", lg: "2fr 1fr" }}
      gap={8}
    >
      <Stack spacing={4}>
        {items.map((item) => (
          <Stack
            key={item.dish.id}
            layerStyle="glass"
            borderRadius="2xl"
            p={4}
            spacing={4}
          >
            <HStack align="flex-start" spacing={4}>
              <Image
                src={
                  item.dish.imageUrl ??
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                }
                boxSize="90px"
                borderRadius="lg"
                objectFit="cover"
              />
              <Stack flex="1" spacing={2}>
                <Text fontWeight="semibold">{item.dish.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {formatCurrency(item.dish.price)}
                </Text>
                <HStack>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQuantity(
                        item.dish.id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                  >
                    -
                  </Button>
                  <Text w="40px" textAlign="center">
                    {item.quantity}
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQuantity(item.dish.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </HStack>
              </Stack>
              <Stack align="flex-end" spacing={2}>
                <Text fontWeight="bold">
                  {formatCurrency(item.dish.price * item.quantity)}
                </Text>
                <IconButton
                  aria-label="Remove"
                  variant="ghost"
                  icon={<DeleteIcon />}
                  onClick={() => removeItem(item.dish.id)}
                />
              </Stack>
            </HStack>
          </Stack>
        ))}
      </Stack>

      <CartSummary
        subtotal={subtotal}
        shippingFee={shippingFee}
        discount={discount}
        total={total}
        onCheckout={() => navigate("/checkout")}
      />
    </Box>
  );
};

import {
  Badge,
  Box,
  Button,
  Heading,
  Image,
  Skeleton,
  Stack,
  Text,
  useNumberInput,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
  import { fetchDish } from "../services/menu";
import { formatCurrency } from "../utils/format";
import { useCart } from "../contexts/CartContext";

export const DishDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();
  const { addItem } = useCart();
  const { data: dish, isLoading } = useQuery({
    queryKey: ["dish", id],
    enabled: Boolean(id),
    queryFn: () => fetchDish(Number(id)),
  });

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput({
    defaultValue: 1,
    min: 1,
  });
  const inputProps = getInputProps();
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();

  if (isLoading) {
    return <Skeleton h="400px" borderRadius="xl" />;
  }

  if (!dish) {
    return <Text>Không tìm thấy món ăn</Text>;
  }

  const handleAdd = () => {
    const quantity = Number(inputProps.value) || 1;
    addItem(dish, quantity);
    toast({ title: "Đã thêm vào giỏ", status: "success" });
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
      gap={8}
    >
      <Image
        src={
          dish.imageUrl ??
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
        }
        borderRadius="xl"
        h="400px"
        objectFit="cover"
      />
      <Stack spacing={6}>
        <div>
          <Heading>{dish.name}</Heading>
          <Text color="gray.500">{dish.category?.name}</Text>
        </div>
        <Text>{dish.description}</Text>
        <Text fontSize="2xl" fontWeight="bold">
          {formatCurrency(dish.price)}
        </Text>
        {!dish.isAvailable && <Badge colorScheme="red">Tạm hết</Badge>}
        <Stack direction="row" spacing={4} align="center">
          <Button {...dec}>
            -
          </Button>
          <input
            {...inputProps}
            style={{
              width: "60px",
              textAlign: "center",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              height: "40px",
            }}
          />
          <Button {...inc}>+</Button>
        </Stack>
        <Button
          colorScheme="brand"
          size="lg"
          onClick={handleAdd}
          isDisabled={!dish.isAvailable}
        >
          Thêm vào giỏ
        </Button>
      </Stack>
    </Box>
  );
};

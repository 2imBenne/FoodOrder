import {
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { Dish } from "../types";
import { formatCurrency } from "../utils/format";

type Props = {
  dish: Dish;
  onAdd?: (dish: Dish) => void;
  onView?: (dish: Dish) => void;
};

const fallbackImg =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";

const MotionBox = motion(Box);

export const DishCard = ({ dish, onAdd, onView }: Props) => (
  <MotionBox
    layerStyle="glass"
    borderRadius="2xl"
    overflow="hidden"
    whileHover={{ translateY: -6 }}
    transition={{ duration: 0.2 }}
  >
    <Box position="relative" h="220px">
      <Image
        src={dish.imageUrl ?? fallbackImg}
        alt={dish.name}
        objectFit="cover"
        w="100%"
        h="100%"
      />
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-t, rgba(0,0,0,0.65), rgba(0,0,0,0.05))"
      />
      <Stack
        position="absolute"
        bottom={4}
        left={4}
        right={4}
        color="white"
        spacing={1}
      >
        <Text fontWeight="semibold">{dish.name}</Text>
        <Text fontSize="sm" color="whiteAlpha.800">
          {formatCurrency(dish.price)}
        </Text>
      </Stack>
    </Box>
    <Stack spacing={4} p={4}>
      <Text fontSize="sm" color="gray.600" noOfLines={2}>
        {dish.description}
      </Text>
      {!dish.isAvailable && (
        <Badge colorScheme="red" w="fit-content">
          Hết hàng
        </Badge>
      )}
      <HStack justify="space-between">
        <Button variant="ghost" size="sm" onClick={() => onView?.(dish)}>
          Chi tiết
        </Button>
        <Button
          size="sm"
          onClick={() => onAdd?.(dish)}
          isDisabled={!dish.isAvailable}
        >
          Thêm
        </Button>
      </HStack>
    </Stack>
  </MotionBox>
);

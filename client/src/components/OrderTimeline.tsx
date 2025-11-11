import { HStack, Stack, Text } from "@chakra-ui/react";
import { OrderStatus } from "../types";
import { getStatusLabel } from "../utils/format";

const steps: OrderStatus[] = [
  "PENDING",
  "PREPARING",
  "DELIVERING",
  "COMPLETED",
];

export const OrderTimeline = ({ status }: { status: OrderStatus }) => {
  const currentIndex = steps.indexOf(status);
  return (
    <HStack spacing={6}>
      {steps.map((step, index) => {
        const active = index <= currentIndex;
        return (
          <Stack key={step} align="center" spacing={2}>
            <Text
              w={10}
              h={10}
              borderRadius="full"
              bg={active ? "brand.500" : "gray.200"}
              color={active ? "white" : "gray.600"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
            >
              {index + 1}
            </Text>
            <Text fontSize="sm" color={active ? "brand.600" : "gray.500"}>
              {getStatusLabel(step)}
            </Text>
          </Stack>
        );
      })}
    </HStack>
  );
};

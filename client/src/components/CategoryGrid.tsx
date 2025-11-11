import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { Category } from "../types";

type Props = {
  categories: Category[];
  onSelect?: (category: Category) => void;
  activeId?: number;
};

const MotionBox = motion(Box);

export const CategoryGrid = ({ categories, onSelect, activeId }: Props) => (
  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
    {categories.map((category, index) => (
      <MotionBox
        key={category.id}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        onClick={() => onSelect?.(category)}
      >
        <Stack
          layerStyle="glass"
          borderRadius="2xl"
          spacing={2}
          p={5}
          cursor="pointer"
          borderWidth={category.id === activeId ? 2 : 1}
          borderColor={category.id === activeId ? "brand.400" : "whiteAlpha.500"}
        >
          <Text fontSize="sm" color="gray.500">
            #{String(category.id).padStart(2, "0")}
          </Text>
          <Text fontWeight="semibold">{category.name}</Text>
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {category.description}
          </Text>
        </Stack>
      </MotionBox>
    ))}
  </SimpleGrid>
);

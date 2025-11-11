import {
  Box,
  Flex,
  Heading,
  Input,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchDishes } from "../services/menu";
import { CategoryGrid } from "../components/CategoryGrid";
import { DishCard } from "../components/DishCard";
import { useCart } from "../contexts/CartContext";
import type { Dish } from "../types";
import { AnimatedSection } from "../components/AnimatedSection";

export const MenuPage = () => {
  const toast = useToast();
  const { addItem } = useCart();
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const queryParams = useMemo(
    () => ({
      categoryId,
      search: search || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }),
    [categoryId, search, priceRange]
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const { data: dishes, isLoading } = useQuery({
    queryKey: ["dishes", queryParams],
    queryFn: () => fetchDishes(queryParams),
  });

  const handleAdd = (dish: Dish) => {
    addItem(dish, 1);
    toast({ title: "Da them vao gio", status: "success" });
  };

  return (
    <Stack spacing={10}>
      <AnimatedSection>
        <Stack spacing={4}>
          <Heading size="lg">Menu hôm nay</Heading>
          <Stack
            spacing={6}
            layerStyle="glass"
            borderRadius="3xl"
            p={6}
            bg="whiteAlpha.900"
          >
            <Flex direction={{ base: "column", md: "row" }} gap={6}>
              <Box flex="1">
                <Text fontSize="sm" mb={2}>
                  Tìm món
                </Text>
                <Input
                  placeholder="Nhập tên món..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </Box>
              <Box flex="1">
                <Text fontSize="sm" mb={2}>
                  Khoảng giá ({priceRange[0]} - {priceRange[1]} VND)
                </Text>
                <RangeSlider
                  min={0}
                  max={200000}
                  step={10000}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value as [number, number])}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
              </Box>
            </Flex>
            {categories ? (
              <CategoryGrid
                categories={categories}
                activeId={categoryId}
                onSelect={(category) =>
                  setCategoryId(
                    categoryId === category.id ? undefined : category.id
                  )
                }
              />
            ) : (
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} h="120px" borderRadius="2xl" />
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </Stack>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} h="320px" borderRadius="2xl" />
            ))}
          </SimpleGrid>
        ) : dishes && dishes.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onAdd={handleAdd}
                onView={() => undefined}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box layerStyle="glass" borderRadius="2xl" p={10} textAlign="center">
            <Text>Không tìm thấy món phù hợp. Thử bộ lọc khác nhé!</Text>
          </Box>
        )}
      </AnimatedSection>
    </Stack>
  );
};

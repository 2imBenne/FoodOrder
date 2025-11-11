import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { HeroBanner } from "../components/HeroBanner";
import { fetchCategories, fetchDishes } from "../services/menu";
import { CategoryGrid } from "../components/CategoryGrid";
import { DishCard } from "../components/DishCard";
import { useCart } from "../contexts/CartContext";
import type { Dish } from "../types";
import { AnimatedSection } from "../components/AnimatedSection";

const steps = [
  {
    title: "Chọn món yêu thích",
    desc: "Lọc theo danh mục, giá, tìm kiếm từ khóa hỗ trợ nhanh.",
  },
  {
    title: "Thêm ghi chú",
    desc: "Nhập địa chỉ, số điện thoại, note yêu cầu riêng cho bếp chế biến.",
  },
  {
    title: "Theo dõi đơn hàng",
    desc: "Pending → Preparing → Delivering → Completed, thông báo realtime.",
  },
];

export const HomePage = () => {
  const toast = useToast();
  const { addItem } = useCart();
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const { data: dishes, isLoading: loadingDishes } = useQuery({
    queryKey: ["featured-dishes"],
    queryFn: () => fetchDishes({ isFeatured: true }),
  });

  const handleAddDish = (dish: Dish) => {
    addItem(dish, 1);
    toast({
      title: "Đã thêm vào giỏ",
      status: "success",
    });
  };

  return (
    <Stack spacing={12}>
      <HeroBanner />

      <AnimatedSection>
        <Stack spacing={6}>
          <Stack spacing={2}>
            <Text color="gray.500" fontSize="sm" textTransform="uppercase">
              Danh mục
            </Text>
            <Heading size="lg">Gọi món theo chủ dề</Heading>
          </Stack>
          {loadingCategories ? (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} h="120px" borderRadius="2xl" />
              ))}
            </SimpleGrid>
          ) : (
            <CategoryGrid categories={categories ?? []} />
          )}
        </Stack>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Stack spacing={6}>
          <Stack spacing={2}>
            <Text color="gray.500" fontSize="sm" textTransform="uppercase">
              Bán chạy
            </Text>
            <Heading size="lg">Món được yêu thích nhất</Heading>
          </Stack>
          {loadingDishes ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} h="320px" borderRadius="2xl" />
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {dishes?.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onAdd={handleAddDish}
                  onView={() => undefined}
                />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <Stack spacing={4}>
          <Heading size="lg">Quy trình đặt món</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {steps.map((item, index) => (
              <Box
                key={item.title}
                layerStyle="glass"
                borderRadius="2xl"
                p={6}
                borderTop="4px solid"
                borderTopColor={index === 0 ? "brand.400" : "accent.400"}
              >
                <Text fontSize="sm" color="gray.500">
                  Bước {index + 1}
                </Text>
                <Text fontWeight="semibold" mb={2}>
                  {item.title}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {item.desc}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </AnimatedSection>
    </Stack>
  );
};

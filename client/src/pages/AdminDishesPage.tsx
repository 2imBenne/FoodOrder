import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchAdminCatalog,
  upsertDish,
  deleteDish,
} from "../services/admin";
import { Dish } from "../types";

type DishForm = {
  id?: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
};

export const AdminDishesPage = () => {
  const toast = useToast();
  const { data, refetch } = useQuery({
    queryKey: ["admin-catalog"],
    queryFn: fetchAdminCatalog,
  });

  const { register, reset, handleSubmit } = useForm<DishForm>();

  const saveMutation = useMutation({
    mutationFn: upsertDish,
    onSuccess: () => {
      toast({ title: "Đã lưu món ăn", status: "success" });
      reset();
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      toast({ title: "Đã xóa", status: "info" });
      refetch();
    },
  });

  const onSubmit = handleSubmit((values) => {
    saveMutation.mutate({
      ...values,
      price: Number(values.price),
      categoryId: Number(values.categoryId),
    });
  });

  const handleEdit = (dish: Dish) => {
    reset({
      id: dish.id,
      name: dish.name,
      description: dish.description ?? "",
      price: dish.price,
      categoryId: dish.categoryId,
      imageUrl: dish.imageUrl ?? "",
      isFeatured: dish.isFeatured,
      isAvailable: dish.isAvailable,
    });
  };

  return (
    <Stack spacing={6}>
      <Box as="form" onSubmit={onSubmit} bg="white" p={4} borderRadius="xl">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isRequired>
            <FormLabel>Tên món</FormLabel>
            <Input {...register("name", { required: true })} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Giá</FormLabel>
            <NumberInput min={1000}>
              <NumberInputField {...register("price", { valueAsNumber: true })} />
            </NumberInput>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Danh mục</FormLabel>
            <Select {...register("categoryId", { required: true })}>
              <option value="">Chọn danh mục</option>
              {data?.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Ảnh</FormLabel>
            <Input {...register("imageUrl")} />
          </FormControl>
          <FormControl>
            <FormLabel>Mô tả</FormLabel>
            <Input {...register("description")} />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Nổi bật</FormLabel>
            <Switch {...register("isFeatured")} />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Đang bán</FormLabel>
            <Switch defaultChecked {...register("isAvailable")} />
          </FormControl>
        </SimpleGrid>
        <Button
          mt={4}
          type="submit"
          colorScheme="brand"
          isLoading={saveMutation.isPending}
        >
          Lưu món
        </Button>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tên món</Th>
            <Th>Danh mục</Th>
            <Th isNumeric>Giá</Th>
            <Th>Trạng thái</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {data?.dishes.map((dish) => (
            <Tr key={dish.id}>
              <Td>{dish.name}</Td>
              <Td>{dish.category?.name}</Td>
              <Td isNumeric>{dish.price}</Td>
              <Td>{dish.isAvailable ? "Đang bán" : "Tạm dừng"}</Td>
              <Td>
                <Button size="sm" mr={2} onClick={() => handleEdit(dish)}>
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteMutation.mutate(dish.id)}
                >
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  );
};

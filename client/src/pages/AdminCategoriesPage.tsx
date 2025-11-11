import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
  upsertCategory,
  deleteCategory,
} from "../services/admin";
import { Category } from "../types";

type CategoryForm = {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
};

export const AdminCategoriesPage = () => {
  const toast = useToast();
  const { data, refetch } = useQuery({
    queryKey: ["admin-catalog"],
    queryFn: fetchAdminCatalog,
  });
  const { register, handleSubmit, reset } = useForm<CategoryForm>();

  const saveMutation = useMutation({
    mutationFn: upsertCategory,
    onSuccess: () => {
      toast({ title: "Đã lưu danh mục", status: "success" });
      reset();
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast({ title: "Đã xóa danh mục", status: "info" });
      refetch();
    },
  });

  const onSubmit = handleSubmit((values) => {
    saveMutation.mutate(values);
  });

  const handleEdit = (category: Category) => {
    reset({
      id: category.id,
      name: category.name,
      description: category.description ?? "",
      isActive: category.isActive,
    });
  };

  return (
    <Box>
      <Box as="form" onSubmit={onSubmit} mb={6}>
        <FormControl isRequired>
          <FormLabel>Tên danh mục</FormLabel>
          <Input {...register("name", { required: true })} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Mô tả</FormLabel>
          <Input {...register("description")} />
        </FormControl>
        <FormControl display="flex" alignItems="center" mt={4}>
          <FormLabel mb="0">Hoạt động</FormLabel>
          <Switch defaultChecked {...register("isActive")} />
        </FormControl>
        <Button type="submit" mt={4} colorScheme="brand">
          Lưu danh mục
        </Button>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tên</Th>
            <Th>Mô tả</Th>
            <Th>Trạng thái</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {data?.categories.map((category) => (
            <Tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>{category.description}</Td>
              <Td>{category.isActive ? "Hiển thị" : "Ẩn"}</Td>
              <Td>
                <Button size="sm" onClick={() => handleEdit(category)}>
                  Sửa
                </Button>
                <Button
                  ml={2}
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteMutation.mutate(category.id)}
                >
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

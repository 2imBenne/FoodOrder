import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export const RegisterPage = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const { register: registerUser, loading } = useAuthContext();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerUser(values);
      toast({ title: "Tạo tài khoản thành công", status: "success" });
      navigate("/");
    } catch {
      toast({ title: "Không thể đăng ký", status: "error" });
    }
  };

  return (
    <Box maxW="480px" mx="auto">
      <Heading size="lg" mb={6}>
        Đăng ký tài khoản
      </Heading>
      <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
        <FormControl isRequired>
          <FormLabel>Họ tên</FormLabel>
          <Input {...register("name", { required: true })} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" {...register("email", { required: true })} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Mật khẩu</FormLabel>
          <Input
            type="password"
            {...register("password", { required: true })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Số điện thoại</FormLabel>
          <Input {...register("phone")} />
        </FormControl>
        <FormControl>
          <FormLabel>Địa chỉ</FormLabel>
          <Input {...register("address")} />
        </FormControl>
        <Button type="submit" colorScheme="brand" isLoading={loading}>
          Đăng ký
        </Button>
        <Button as={RouterLink} to="/login" variant="ghost">
          Đã có tài khoản? Đăng nhập
        </Button>
      </Stack>
    </Box>
  );
};

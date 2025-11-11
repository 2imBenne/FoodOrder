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

type LoginForm = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login, loading } = useAuthContext();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values);
      toast({ title: "Đăng nhập thành công", status: "success" });
      navigate("/");
    } catch {
      toast({ title: "Sai thông tin đăng nhập", status: "error" });
    }
  };

  return (
    <Box maxW="400px" mx="auto">
      <Heading size="lg" mb={6}>
        Đăng nhập
      </Heading>
      <Stack
        as="form"
        spacing={4}
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <Button type="submit" colorScheme="brand" isLoading={loading}>
          Đăng nhập
        </Button>
        <Button as={RouterLink} to="/register" variant="ghost">
          Chưa có tài khoản? Đăng ký
        </Button>
      </Stack>
    </Box>
  );
};

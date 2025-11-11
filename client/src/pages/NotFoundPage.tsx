import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Stack spacing={4} textAlign="center" align="center">
      <Heading>404</Heading>
      <Text>Trang bạn tìm không tồn tại.</Text>
      <Button onClick={() => navigate("/")}>Về trang chủ</Button>
    </Stack>
  );
};

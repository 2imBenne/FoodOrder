import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Outlet, NavLink } from "react-router-dom";

const adminLinks = [
  { label: "Tổng quan", to: "/admin" },
  { label: "Món ăn", to: "/admin/dishes" },
  { label: "Danh mục", to: "/admin/categories" },
  { label: "Đơn hàng", to: "/admin/orders" },
  { label: "Người dùng", to: "/admin/users" },
  { label: "Báo cáo", to: "/admin/reports" },
];

export const AdminLayout = () => {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Box
        w={{ base: "0", md: "260px" }}
        display={{ base: "none", md: "block" }}
        p={6}
        borderRightWidth={1}
        borderColor="whiteAlpha.500"
        bg="white"
      >
        <VStack align="stretch" spacing={6}>
          <Heading size="md">Admin</Heading>
          <Stack spacing={2}>
            {adminLinks.map((link) => (
              <Button
                key={link.to}
                as={NavLink}
                to={link.to}
                justifyContent="flex-start"
                variant="ghost"
                _activeLink={{
                  bg: "brand.50",
                  color: "brand.600",
                  fontWeight: "semibold",
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </VStack>
      </Box>
      <Box flex="1" p={{ base: 4, md: 10 }}>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Khu vực quản trị
        </Text>
        <Outlet />
      </Box>
    </Flex>
  );
};

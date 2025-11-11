import { Box, Flex, Link, Stack, Text } from "@chakra-ui/react";

export const Footer = () => (
  <Box mt={16} py={10}>
    <Flex
      maxW="7xl"
      mx="auto"
      px={{ base: 4, md: 6 }}
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align="center"
      gap={4}
      layerStyle="glass"
      borderRadius="2xl"
    >
      <Text fontWeight="semibold">FoodOrder © {new Date().getFullYear()}</Text>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={4}
        fontSize="sm"
      >
        <Link href="mailto:foodorder@example.com">Hỗ trợ</Link>
        <Link href="#">Điều khoản</Link>
        <Link href="#">Bảo mật</Link>
      </Stack>
    </Flex>
  </Box>
);

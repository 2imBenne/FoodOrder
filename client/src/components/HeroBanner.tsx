import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

export const HeroBanner = () => {
  const navigate = useNavigate();
  return (
    <MotionBox
      borderRadius="3xl"
      bgGradient="linear(to-r, brand.500, accent.400)"
      color="white"
      px={{ base: 6, md: 12 }}
      py={{ base: 8, md: 14 }}
      mb={12}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        inset={0}
        bg="url('https://www.transparenttextures.com/patterns/cubes.png')"
        opacity={0.15}
      />
      <Stack spacing={6} maxW="lg" position="relative">
        <Badge
          variant="outline"
          colorScheme="whiteAlpha"
          px={4}
          py={1}
          borderRadius="full"
          textTransform="none"
          fontWeight="600"
        >
          Giao nhanh trong 30'
        </Badge>
        <Heading size="2xl" lineHeight={1.1}>
          Đặt món ngon nhanh hơn, theo dõi đơn hàng thông minh
        </Heading>
        <Text fontSize="lg" color="whiteAlpha.900">
          Khám phá menu được gợi ý theo danh mục, thêm ghi chú và nhận thông báo
          trạng thái theo thời gian thực.
        </Text>
        <HStack spacing={4} flexWrap="wrap">
          <Button
            size="lg"
            colorScheme="blackAlpha"
            onClick={() => navigate("/menu")}
          >
            Xem menu
          </Button>
          <Button
            size="lg"
            variant="outline"
            color="white"
            borderColor="whiteAlpha.600"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => navigate("/orders")}
          >
            Theo dõi đơn
          </Button>
        </HStack>
        <HStack spacing={8} fontSize="sm" color="whiteAlpha.900">
          {["Món mới mỗi ngày", "Voucher tự động", "Thông báo realtime"].map(
            (item) => (
              <Stack key={item} spacing={1}>
                <Text fontWeight="semibold">{item}</Text>
                <Box w="40px" h="2px" bg="whiteAlpha.700" />
              </Stack>
            )
          )}
        </HStack>
      </Stack>
    </MotionBox>
  );
};

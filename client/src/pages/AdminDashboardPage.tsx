import {
  Box,
  Heading,
  Select,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { fetchReports } from "../services/admin";
import { formatCurrency } from "../utils/format";

export const AdminDashboardPage = () => {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const { data } = useQuery({
    queryKey: ["reports", range],
    queryFn: () => fetchReports(range),
  });

  const totalOrders =
    data?.ordersByStatus.reduce(
      (sum, item) => sum + (item._count?._all ?? 0),
      0
    ) ?? 0;

  return (
    <Stack spacing={8}>
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        gap={4}
      >
        <Heading size="lg">Báo cáo tổng quan</Heading>
        <Select
          maxW="220px"
          value={range}
          onChange={(event) =>
            setRange(event.target.value as "daily" | "weekly" | "monthly")
          }
        >
          <option value="daily">7 ngày qua</option>
          <option value="weekly">Tuần này</option>
          <option value="monthly">Tháng này</option>
        </Select>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
        <Stat layerStyle="glass" borderRadius="2xl" p={5}>
          <StatLabel>Doanh thu</StatLabel>
          <StatNumber>{formatCurrency(data?.revenue ?? 0)}</StatNumber>
        </Stat>
        <Stat layerStyle="glass" borderRadius="2xl" p={5}>
          <StatLabel>Tổng đơn</StatLabel>
          <StatNumber>{totalOrders}</StatNumber>
        </Stat>
        <Stat layerStyle="glass" borderRadius="2xl" p={5}>
          <StatLabel>Món bán chạy</StatLabel>
          <StatNumber>{data?.topDishes[0]?.dish?.name ?? "-"}</StatNumber>
        </Stat>
      </SimpleGrid>

      <Box layerStyle="glass" borderRadius="3xl" p={6}>
        <Heading size="md" mb={4}>
          Trạng thái đơn hàng
        </Heading>
        <Box h="300px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.ordersByStatus ?? []}>
              <XAxis dataKey="status" />
              <YAxis />
              <Bar dataKey="_count._all" fill="#28c663" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box layerStyle="glass" borderRadius="3xl" p={6}>
        <Heading size="md" mb={4}>
          Top món bán chạy
        </Heading>
        <Stack spacing={3}>
          {data?.topDishes.map((item, index) => (
            <Stack
              key={`${item.dish?.id}-${index}`}
              direction="row"
              justify="space-between"
              fontSize="sm"
            >
              <Text>{item.dish?.name}</Text>
              <Text fontWeight="bold">{item.quantity} phần</Text>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

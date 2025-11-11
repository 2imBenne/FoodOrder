import {
  Box,
  Heading,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReports } from "../services/admin";

export const AdminReportsPage = () => {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("monthly");
  const { data } = useQuery({
    queryKey: ["reports", range],
    queryFn: () => fetchReports(range),
  });

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Trạng thái đơn hàng
      </Heading>
      <Select
        maxW="200px"
        mb={4}
        value={range}
        onChange={(event) =>
          setRange(event.target.value as "daily" | "weekly" | "monthly")
        }
      >
        <option value="daily">7 ngày qua</option>
        <option value="weekly">Tuần này</option>
        <option value="monthly">Tháng này</option>
      </Select>
      <Table>
        <Thead>
          <Tr>
            <Th>Trạng thái</Th>
            <Th isNumeric>Số đơn</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.ordersByStatus.map((item) => (
            <Tr key={item.status}>
              <Td>{item.status}</Td>
              <Td isNumeric>{item._count._all}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

import {
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAdminUsers, updateUserRole } from "../services/admin";

export const AdminUsersPage = () => {
  const toast = useToast();
  const { data: users, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
  });

  const mutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: "USER" | "ADMIN" }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      toast({ title: "Đã cập nhật quyền", status: "success" });
      refetch();
    },
  });

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Tên</Th>
          <Th>Email</Th>
          <Th>Vai trò</Th>
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {users?.map((user) => (
          <Tr key={user.id}>
            <Td>{user.name}</Td>
            <Td>{user.email}</Td>
            <Td>{user.role}</Td>
            <Td>
              <Select
                size="sm"
                value={user.role}
                onChange={(event) =>
                  mutation.mutate({
                    id: user.id,
                    role: event.target.value as "USER" | "ADMIN",
                  })
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </Select>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

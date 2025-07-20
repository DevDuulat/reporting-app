"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/user";
import { getUsers, deleteUser } from "@/api/usersApi";
import { UsersTable } from "@/components/users/data-table";
import { columns } from "@/components/users/columns";
import { UserDialog } from "@/components/users/user-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    toast.success("Пользователь удалён");
    fetchUsers();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Пользователи</h1>

      <Button
        className="mb-4"
        onClick={() => {
          setEditingUser(undefined);
          setDialogOpen(true);
        }}
      >
        Создать пользователя
      </Button>

      <UsersTable
        columns={columns}
        data={users}
        onEditUser={(u) => {
          setEditingUser(u);
          setDialogOpen(true);
        }}
        onDeleteUser={handleDelete}
      />

      <UserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editingUser}
        onSuccess={() => {
          fetchUsers();
          setDialogOpen(false);
        }}
      />
    </div>
  );
}

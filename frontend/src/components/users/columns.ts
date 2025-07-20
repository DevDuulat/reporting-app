import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types/user";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "title",
    header: "Имя",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Роль",
  },
];

import type { ColumnDef, Row, Table } from '@tanstack/react-table'
import type { User } from '@/types/user'

export const columns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Имя' },
  { accessorKey: 'email', header: 'Email' },

  {
    id: 'actions',
    header: 'Действия',
    cell: ({ row, table }: { row: Row<User>; table: Table<User> }) => {
      const user = row.original
      const meta = table.options.meta as {
        onEditUser?: (user: User) => void
        onDeleteUser?: (id: number) => void
      }
    }
  }
]

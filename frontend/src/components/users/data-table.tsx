'use client'

import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnDef,
  type Row,
  type Table
} from '@tanstack/react-table'

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'

import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'
import { UserActions } from '@/components/users/user-actions'
import { UserDialog } from '@/components/users/user-dialog'
import type { User } from '@/types/user'

type UsersTableProps = {
  data: User[]
  columns: ColumnDef<User>[]
  onEditUser?: (user: User) => void
  onDeleteUser?: (id: number) => Promise<void>
  onDataChange?: () => void
}

export function UsersTable({
  data,
  columns,
  onEditUser,
  onDeleteUser,
  onDataChange
}: UsersTableProps) {
  const [editUser, setEditUser] = React.useState<User | null>(null)
  const [isEditOpen, setIsEditOpen] = React.useState(false)

  const [deleteConfirmId, setDeleteConfirmId] = React.useState<number | null>(
    null
  )

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const handleEdit = (user: User) => {
    setEditUser(user)
    setIsEditOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (onDeleteUser) {
      await onDeleteUser(id)
      onDataChange?.()
    }
    setDeleteConfirmId(null)
  }

  const extendedColumns: ColumnDef<User>[] = React.useMemo(() => {
    return columns.map((col) => {
      if (col.id === 'actions') {
        return {
          ...col,
          cell: ({ row }: { row: Row<User>; table: Table<User> }) => {
            const user = row.original
            return (
              <div className="relative inline-block">
                <UserActions
                  user={user}
                  onEdit={handleEdit}
                  onDelete={() => setDeleteConfirmId(user.id)}
                />

                {/* Поповер подтверждения удаления */}
                {deleteConfirmId === user.id && (
                  <Popover
                    open
                    onOpenChange={(open) => !open && setDeleteConfirmId(null)}
                  >
                    <PopoverTrigger asChild>
                      {/* Нужно пустое обертка для триггера (можно скрытый элемент) */}
                      <span />
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-4 bg-card text-card-foreground rounded-md shadow-lg border border-border z-50">
                      <div className="mb-2 text-sm">
                        Удалить этого пользователя?
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Нет
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Да
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )
          }
        }
      }
      return col
    })
  }, [columns, deleteConfirmId])

  const table = useReactTable<User>({
    data,
    columns: extendedColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      onEditUser,
      onDeleteUser
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Поиск по имени..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('title')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Колонки <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.column.columnDef.cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  Нет данных
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>

      <UserDialog
        key={editUser?.id || 'new'}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={editUser ?? undefined}
        onSuccess={() => {
          onDataChange?.()
          setIsEditOpen(false)
        }}
      />
    </div>
  )
}

'use client'

import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnDef
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ReportDialog } from '@/components/reports/report-dialog'
import { ReportView } from '@/components/reports/report-view'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'

import { ChevronDown } from 'lucide-react'
import type { Report } from '@/types/report'

type ReportsTableProps = {
  data: Report[]
  columns: ColumnDef<Report>[]
  onDataChange?: () => void
  onEditReport?: (report: Report) => Promise<void>
  onDeleteReport?: (id: number) => Promise<void>
}
type ReportsTableMeta = {
  onEdit: (report: Report) => void
  onView: (report: Report) => void
  onDeleted: () => void
}

export function ReportsTable({ data, columns }: ReportsTableProps) {
  const [editReport, setEditReport] = React.useState<Report | null>(null)
  const [viewReport, setViewReport] = React.useState<Report | null>(null)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isViewOpen, setIsViewOpen] = React.useState(false)
  const [localData, setLocalData] = React.useState(data)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleDelete = (deletedId: number) => {
    setLocalData((prev) => prev.filter((r) => r.id !== deletedId))
  }

  // функции для передачи в ReportActions
  const handleEdit = (report: Report) => {
    setEditReport(report)
    setIsEditOpen(true)
  }

  const handleView = (report: Report) => {
    setViewReport(report)
    setIsViewOpen(true)
  }

  // обновляем данные после редактирования/создания
  const onSuccess = () => {
    // для простоты, обновим локальные данные, в реальном приложении нужно заново запросить данные с сервера
    if (editReport) {
      setLocalData((prev) =>
        prev.map((r) => (r.id === editReport.id ? editReport : r))
      )
    }
    setEditReport(null)
    setIsEditOpen(false)
  }

  const extendedColumns = React.useMemo(() => {
    return columns.map((col) => {
      if (col.id === 'actions') {
        return {
          ...col,
          meta: {
            onEdit: handleEdit,
            onView: handleView,
            onDeleted: () => {
              if (editReport) {
                handleDelete(editReport.id)
              }
            }
          }
        }
      }
      return col
    })
  }, [columns, editReport])

  const table = useReactTable<Report>({
    data: localData,
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
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      onEdit: handleEdit,
      onView: handleView,
      onDeleted: () => {
        if (editReport) {
          handleDelete(editReport.id)
        }
      }
    } as ReportsTableMeta
  })

  return (
    <div className="w-full">
      {/* Фильтр по названию */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Фильтр по названию..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('title')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <ReportDialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={editReport ?? undefined}
          onSuccess={() => {
            onSuccess()
            setIsEditOpen(false)
          }}
        />
        <ReportView
          open={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          report={viewReport ?? undefined}
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

      {/* Таблица */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === 'function'
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
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
                  className="h-24 text-center"
                >
                  Нет данных
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-between py-4">
        <div className="text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} из{' '}
          {table.getFilteredRowModel().rows.length} выбрано
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Назад
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Вперед
          </Button>
        </div>
      </div>
    </div>
  )
}

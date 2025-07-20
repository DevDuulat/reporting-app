"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnDef,
  type Row,
  type Table,
} from "@tanstack/react-table";

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { ReportDialog } from "@/components/reports/report-dialog";
import { ReportView } from "@/components/reports/report-view";
import type { Report } from "@/types/report";
import { ReportActions } from "@/components/reports/report-actions";

type ReportsTableProps = {
  data: Report[];
  columns: ColumnDef<Report>[];
  onEditReport?: (report: Report) => Promise<void>;
  onDeleteReport?: (id: number) => Promise<void>;
  onDataChange?: () => void;
};

export function ReportsTable({
  data,
  columns,
  onEditReport,
  onDeleteReport,
  onDataChange,
}: ReportsTableProps) {
  const [editReport, setEditReport] = React.useState<Report | null>(null);
  const [viewReport, setViewReport] = React.useState<Report | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [localData, setLocalData] = React.useState<Report[]>(data);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleEdit = (report: Report) => {
    setEditReport(report);
    setIsEditOpen(true);
  };

  const handleView = (report: Report) => {
    setViewReport(report);
    setIsViewOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (onDeleteReport) {
      await onDeleteReport(id);
    }
  };

  const extendedColumns: ColumnDef<Report>[] = React.useMemo(() => {
    return columns.map((col) => {
      if (col.id === "actions") {
        return {
          ...col,
          cell: ({ row }: { row: Row<Report>; table: Table<Report> }) => {
            const report = row.original;
            return (
              <ReportActions
                report={report}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            );
          },
        };
      }
      return col;
    });
  }, [columns]);

  const table = useReactTable<Report>({
    data: localData,
    columns: extendedColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Фильтр по названию..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
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
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === "function"
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
                      {typeof cell.column.columnDef.cell === "function"
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

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} из{" "}
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
            Вперёд
          </Button>
        </div>
      </div>

      {/* Модалки */}
      <ReportDialog
        key={editReport?.id || "new"}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={editReport ?? undefined}
        onSuccess={() => {
          onDataChange?.();
          setIsEditOpen(false);
        }}
      />

      <ReportView
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        report={viewReport ?? undefined}
      />
    </div>
  );
}

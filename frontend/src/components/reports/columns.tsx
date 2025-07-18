import type { ColumnDef, Row, Table } from '@tanstack/react-table'
import type { Report } from '@/types/report'
import { AssignUsersPopover } from '@/components/reports/AssignUsersPopover'
import { ReportActions } from '@/components/reports/report-actions'

type ReportsTableMeta = {
  onEdit: (report: Report) => void | Promise<void>
  onView: (report: Report) => void | Promise<void>
  onDeleteReport: (id: number) => Promise<void>
  onDeleted?: () => void
}

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'title',
    header: 'Название'
  },
  {
    accessorKey: 'folder',
    header: 'Папка'
  },
  {
    accessorKey: 'description',
    header: 'Описание'
  },
  {
    accessorKey: 'notif_rules',
    header: 'Правила уведомлений'
  },
  {
    id: 'assign',
    header: 'Назначить',
    cell: ({ row }) => {
      const report = row.original
      return <AssignUsersPopover reportId={report.id} />
    }
  },
  {
    id: 'actions',
    header: 'Действия',
    cell: ({ row, table }: { row: Row<Report>; table: Table<Report> }) => {
      const report = row.original
      const meta = table.options.meta as ReportsTableMeta | undefined

      return (
        <ReportActions
          report={report}
          onEdit={meta?.onEdit ?? (() => {})}
          onView={meta?.onView ?? (() => {})}
          onDelete={(id) => {
            meta?.onDeleteReport?.(id)
          }}
        />
      )
    }
  }
]

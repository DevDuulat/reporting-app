'use client'

import { useEffect, useState } from 'react'
import type { Report } from '@/types/report'
import { getReportsPaginated, deleteReport } from '@/api/reportsApi'
import { ReportsTable } from '@/components/reports/data-table'
import { columns } from '@/components/reports/columns'
import { ReportDialog } from '@/components/reports/report-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function ReportsPage() {
  const [page, setPage] = useState(1)
  const [reports, setReports] = useState<Report[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | undefined>()

  const fetchReports = async (pageNumber: number) => {
    try {
      const response = await getReportsPaginated(pageNumber, 10)
      setReports(response.data)
      setTotalPages(response.totalPages)
      setPage(response.page)
    } catch {
      toast.error('Ошибка загрузки отчётов')
    }
  }

  useEffect(() => {
    fetchReports(page)
  }, [page])

  const handleDelete = async (id: number) => {
    try {
      await deleteReport(id)
      toast.success('Отчёт удалён')
      fetchReports(page)
    } catch {
      toast.error('Ошибка при удалении отчёта')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Отчёты</h1>

      <Button
        className="mb-4"
        onClick={() => {
          setEditingReport(undefined)
          setDialogOpen(true)
        }}
      >
        Создать отчёт
      </Button>

      <ReportsTable
        columns={columns}
        data={reports}
        onDeleteReport={handleDelete}
      />

      {/* Навигация по страницам */}
      <div className="flex justify-between mt-4">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Назад
        </Button>
        <span>
          Страница {page} из {totalPages}
        </span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Вперёд
        </Button>
      </div>

      <ReportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editingReport}
        onSuccess={() => {
          fetchReports(page)
          setDialogOpen(false)
        }}
      />
    </div>
  )
}

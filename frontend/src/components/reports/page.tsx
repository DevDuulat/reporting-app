'use client'

import { useEffect, useState } from 'react'
import type { Report } from '@/types/report'
import { getReports, deleteReport } from '@/api/reportsApi'
import { ReportsTable } from '@/components/reports/data-table'
import { columns } from '@/components/reports/columns'
import { ReportDialog } from '@/components/reports/report-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | undefined>()

  const fetchReports = async () => {
    try {
      const data = await getReports()
      setReports(data)
    } catch {
      toast.error('Ошибка загрузки отчётов')
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteReport(id)
      toast.success('Отчёт удалён')
      fetchReports()
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

      <ReportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editingReport}
        onSuccess={() => {
          fetchReports()
          setDialogOpen(false)
        }}
      />
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import type { Report } from '@/types/report'
import { ReportsTable } from '@/components/reports/data-table'
import { columns } from '@/components/reports/columns'
import { getReports, deleteReport } from '@/api/reportsApi'
import { toast } from 'sonner'
import { ReportDialog } from '@/components/reports/report-dialog'

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | undefined>(
    undefined
  )

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await getReports()
      setReports(res.data)
      setError(null)
    } catch {
      setError('Ошибка загрузки отчетов')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteReport(id)
      console.log(`Отчёт с id=${id} успешно удалён`)
      toast.success('Отчёт удалён')
      fetchReports()
    } catch (error) {
      console.error('Ошибка при удалении отчёта:', error)
      toast.error('Ошибка при удалении отчёта')
    }
  }

  const openCreateDialog = () => {
    setEditingReport(undefined)
    setDialogOpen(true)
  }

  const openEditDialog = async (report: Report): Promise<void> => {
    setEditingReport(report)
    setDialogOpen(true)
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Отчёты</h1>

      <button
        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        onClick={openCreateDialog}
      >
        Создать отчёт
      </button>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ReportsTable
        columns={columns}
        data={reports}
        onDataChange={fetchReports}
        onDeleteReport={handleDelete}
        onEditReport={openEditDialog}
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

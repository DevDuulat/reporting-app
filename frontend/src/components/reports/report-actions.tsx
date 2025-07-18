'use client'

import { Pencil, Eye, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Report } from '@/types/report'

interface ReportActionsProps {
  report: Report
  onEdit: (report: Report) => void
  onView: (report: Report) => void
  onDelete: (id: number) => void
}
export function ReportActions({
  report,
  onEdit,
  onView,
  onDelete
}: ReportActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => onView(report)}>
        <Eye className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => onEdit(report)}>
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(report.id)}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  )
}

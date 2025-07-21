'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Report } from '@/types/report'
import { createReport, updateReport } from '@/api/reportsApi'
import { toast } from 'sonner'

interface ReportDialogProps {
  open: boolean
  onClose: () => void
  initialData?: Report
  onSuccess: () => void
}

export function ReportDialog({
  open,
  onClose,
  initialData,
  onSuccess
}: ReportDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [folder, setFolder] = useState('')
  const [notifRules, setNotifRules] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? '')
      setDescription(initialData.description ?? '')
      setFolder(initialData.folder ?? '')
      setNotifRules(initialData.notif_rules ?? '')
    } else {
      setTitle('')
      setDescription('')
      setFolder('')
      setNotifRules('')
    }
  }, [initialData])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (initialData?.id) {
        await updateReport(initialData.id, {
          title,
          description,
          folder,
          notif_rules: notifRules
        })
        toast.success('Отчёт обновлён')
      } else {
        await createReport({
          title,
          description,
          folder,
          notif_rules: notifRules
        })
        toast.success('Отчёт создан')
      }

      onSuccess()
    } catch (error) {
      console.error('Ошибка при сохранении отчёта:', error)
      toast.error('Ошибка при сохранении отчёта')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Редактировать отчёт' : 'Создать отчёт'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground">
              Название
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background text-foreground border border-input"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Папка</label>
            <Input
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="bg-background text-foreground border border-input"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">
              Описание
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background text-foreground border border-input"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">
              Правила уведомлений
            </label>
            <Input
              value={notifRules}
              onChange={(e) => setNotifRules(e.target.value)}
              className="bg-background text-foreground border border-input"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

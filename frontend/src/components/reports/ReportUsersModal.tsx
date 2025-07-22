'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getReportUsers } from '@/api/reportsApi'
import type { User } from '@/types/user'

interface ReportUsersModalProps {
  reportId: number | null
  open: boolean
  onClose: () => void
}

export function ReportUsersModal({
  reportId,
  open,
  onClose
}: ReportUsersModalProps) {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (open && reportId !== null) {
      setLoading(true)
      getReportUsers(reportId)
        .then((data) => {
          console.log('Загруженные пользователи:', data)
          setUsers(data)
        })
        .catch((err) => {
          console.error('Ошибка загрузки пользователей отчета:', err)
        })
        .finally(() => setLoading(false))
    } else {
      setUsers([])
    }
  }, [open, reportId])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Пользователи отчёта</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {loading ? (
            <p className="text-muted-foreground">Загрузка...</p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground">Пользователи не назначены</p>
          ) : (
            <ul className="space-y-3 max-h-[300px] overflow-y-auto">
              {users.map((user, index) => (
                <li key={`${user.id}-${index}`} className="border-b pb-2">
                  <div className="text-sm font-medium">
                    {user.title || 'Без имени'} ({user.role || 'Без роли'})
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.email || 'Нет email'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

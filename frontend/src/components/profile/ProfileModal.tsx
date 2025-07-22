'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { getToken } from '@/utils/keycloak.util'

interface View {
  id: number
  report_id: number
  type: string
  timestamp: string
  report: {
    id: number
    title: string
  }
}

export function ProfileModal({
  userId,
  email,
  open,
  onClose
}: {
  userId: number
  email: string
  open: boolean
  onClose: () => void
}) {
  const [views, setViews] = useState<View[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    async function fetchViews() {
      try {
        setLoading(true)
        const token = await getToken()

        const res = await fetch(
          `http://localhost:3000/views/by-user/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(errText)
        }

        const data = await res.json()
        setViews(data)
      } catch (e) {
        console.error('Ошибка при загрузке просмотров', e)
      } finally {
        setLoading(false)
      }
    }

    fetchViews()
  }, [open, userId])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground max-w-lg">
        <DialogHeader>
          <DialogTitle>Мой профиль ({email})</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-muted-foreground text-sm">Загрузка...</p>
        ) : views.length === 0 ? (
          <p className="text-muted-foreground text-sm">Нет просмотров</p>
        ) : (
          <ul className="space-y-2 max-h-[300px] overflow-y-auto">
            {views.map((view) => (
              <li key={view.id} className="border-b pb-2">
                <div className="text-sm font-medium">
                  Отчет: {view.report?.title ?? `ID ${view.report_id}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  Тип: {view.type} — {new Date(view.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type { User } from '@/types/user'
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

export default function UserDetailModal({
  user,
  onClose
}: {
  user: User
  onClose: () => void
}) {
  const [views, setViews] = useState<View[]>([])

  useEffect(() => {
    async function fetchViews() {
      try {
        const token = await getToken()

        const res = await fetch(
          `http://localhost:3000/views/by-user/${user.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!res.ok) {
          const errorBody = await res.text()
          throw new Error(`Ошибка: ${res.status} - ${errorBody}`)
        }

        const data = await res.json()
        setViews(data)
      } catch (e) {
        console.error('Ошибка при загрузке просмотров', e)
      }
    }

    fetchViews()
  }, [user.id])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Просмотры пользователя: {user.email}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {views.length === 0 ? (
            <p className="text-muted-foreground">Нет просмотров</p>
          ) : (
            <ul className="space-y-3 max-h-[300px] overflow-y-auto">
              {views.map((view) => (
                <li key={view.id} className="border-b pb-2">
                  <div className="text-sm font-medium">
                    Отчет:{' '}
                    <span className="text-foreground">
                      {view.report?.title ?? `ID ${view.report_id}`}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Тип: {view.type} —{' '}
                    {new Date(view.timestamp).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

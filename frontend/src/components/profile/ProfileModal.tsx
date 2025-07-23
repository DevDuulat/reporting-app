'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { getToken } from '@/utils/keycloak.util'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { PaginationControl } from '@/components/shared/PaginationControl'

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
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const limit = 10

  useEffect(() => {
    if (!open) return

    async function fetchViews() {
      try {
        setLoading(true)
        const token = await getToken()

        const res = await fetch(
          `http://localhost:3000/views/by-user/${userId}?page=${page}&limit=${limit}`,
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

        setViews(Array.isArray(data) ? data : data.data || [])
        setTotal(data.total || 0)
      } catch (e) {
        console.error('Ошибка при загрузке просмотров', e)
      } finally {
        setLoading(false)
      }
    }

    fetchViews()
  }, [open, userId, page])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>Мой просмотры ({email})</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-muted-foreground text-sm">Загрузка...</p>
        ) : views.length === 0 ? (
          <p className="text-muted-foreground text-sm">Нет просмотров</p>
        ) : (
          <>
            <ScrollArea className="max-h-[400px] p-4">
              <ul className="list-none">
                {views.map((view) => (
                  <li key={view.id} className="border-b pb-2 last:border-b-0">
                    <div className="text-sm font-medium">
                      Отчет: {view.report?.title ?? `ID ${view.report_id}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Тип: {view.type} —{' '}
                      {new Date(view.timestamp).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <PaginationControl
              page={page}
              total={total}
              limit={limit}
              onPageChange={setPage}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

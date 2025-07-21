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
import { createUser, updateUser } from '@/api/usersApi'
import type { User } from '@/types/user'
import { toast } from 'sonner'

interface UserDialogProps {
  open: boolean
  onClose: () => void
  initialData?: User
  onSuccess: () => void
}

export function UserDialog({
  open,
  onClose,
  initialData,
  onSuccess
}: UserDialogProps) {
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? '')
      setEmail(initialData.email ?? '')
      setRole(initialData.role ?? '')
    } else {
      setTitle('')
      setEmail('')
      setRole('')
    }
  }, [initialData])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = { title, email, role }

      if (initialData?.id) {
        await updateUser(initialData.id, payload)
        toast.success('Пользователь обновлён')
      } else {
        await createUser(payload)
        toast.success('Пользователь создан')
      }

      onSuccess()
    } catch (error) {
      toast.error('Ошибка при сохранении пользователя')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? 'Редактировать пользователя'
              : 'Создать пользователя'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground">
              Название
            </label>{' '}
            {}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background text-foreground border border-input"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background text-foreground border border-input"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground">Роль</label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-background text-foreground border border-input"
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !email.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading
              ? 'Сохранение...'
              : initialData
              ? 'Сохранить изменения'
              : 'Создать'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

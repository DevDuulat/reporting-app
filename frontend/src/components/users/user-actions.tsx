'use client'

import { Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/user'

interface UserActionsProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}

export function UserActions({ user, onEdit, onDelete }: UserActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
        <Pencil className="w-4 h-4" />
      </Button>
      <Button variant="destructive" size="sm" onClick={() => onDelete(user.id)}>
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  )
}

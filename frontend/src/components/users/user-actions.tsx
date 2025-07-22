'use client'

import { Pencil, Trash, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/user'
import { useState } from 'react'
import UserDetailModal from './UserDetailModal'

interface UserActionsProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}

export function UserActions({ user, onEdit, onDelete }: UserActionsProps) {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(user.id)}
        >
          <Trash className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setOpenModal(true)}>
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {openModal && (
        <UserDetailModal user={user} onClose={() => setOpenModal(false)} />
      )}
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/types/user'
import { getUsersPaginated, deleteUser } from '@/api/usersApi'
import { UsersTable } from '@/components/users/data-table'
import { columns } from '@/components/users/columns'
import { UserDialog } from '@/components/users/user-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function UsersPage() {
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState<User[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()

  const fetchUsers = async (pageNumber: number) => {
    try {
      const response = await getUsersPaginated(pageNumber, 10)
      setUsers(response.data)
      setTotalPages(response.totalPages)
      setPage(response.page)
    } catch (error) {
      console.error('Ошибка загрузки пользователей', error)
      toast.error('Ошибка загрузки пользователей')
    }
  }

  useEffect(() => {
    fetchUsers(page)
  }, [page])

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id)
      toast.success('Пользователь удалён')
      fetchUsers(page)
    } catch {
      toast.error('Ошибка при удалении пользователя')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Пользователи</h1>

      <Button
        className="mb-4"
        onClick={() => {
          setEditingUser(undefined)
          setDialogOpen(true)
        }}
      >
        Создать пользователя
      </Button>

      <UsersTable columns={columns} data={users} onDeleteUser={handleDelete} />

      {/* Навигация по страницам */}
      <div className="flex justify-between mt-4">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Назад
        </Button>
        <span>
          Страница {page} из {totalPages}
        </span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Вперёд
        </Button>
      </div>

      <UserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editingUser}
        onSuccess={() => {
          fetchUsers(page)
          setDialogOpen(false)
        }}
      />
    </div>
  )
}

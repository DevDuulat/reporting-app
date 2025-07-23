// components/shared/PaginationControl.tsx

'use client'

import { Button } from '@/components/ui/button'

interface PaginationControlProps {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function PaginationControl({
  page,
  total,
  limit,
  onPageChange
}: PaginationControlProps) {
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
      >
        ← Назад
      </Button>

      <span className="text-sm text-muted-foreground">
        Страница {page} из {totalPages}
      </span>

      <Button
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
      >
        Вперёд →
      </Button>
    </div>
  )
}

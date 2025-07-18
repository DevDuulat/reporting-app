// src/components/AssignUsersPopover.tsx
import { useEffect, useState } from 'react'
import { Check, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type User = {
  id: number
  title: string
}

type Props = {
  reportId: number
}

export function AssignUsersPopover({ reportId }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setUsers([]))

    fetch(`http://localhost:3000/reports/${reportId}/users`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: User[]) => {
        const ids = data
          .map((u: User) => u?.id)
          .filter(
            (id: number | undefined): id is number => typeof id === 'number'
          )
        setSelected(ids)
      })
      .catch(() => setSelected([]))
  }, [reportId])

  const handleSave = async () => {
    const validIds = selected.filter(
      (id): id is number => typeof id === 'number' && !isNaN(id)
    )
    await fetch(`http://localhost:3000/reports/${reportId}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: validIds })
    })
  }

  const toggleUser = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-xs">
          Назначить
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Поиск пользователя..." className="h-9" />
          <CommandList>
            <CommandEmpty>Не найдено</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem key={user.id} onSelect={() => toggleUser(user.id)}>
                  {user.title}
                  <Check
                    className={cn(
                      'ml-auto',
                      selected.includes(user.id) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-2 border-t flex justify-end">
          <Button size="sm" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

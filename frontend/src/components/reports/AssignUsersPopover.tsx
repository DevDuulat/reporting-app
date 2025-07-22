import { useEffect, useState } from 'react'
import axios from 'axios'
import { Check } from 'lucide-react'
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
import { getToken } from '@/utils/keycloak.util'

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
    async function fetchData() {
      try {
        const token = await getToken()

        const [usersResponse, selectedUsersResponse] = await Promise.all([
          axios.get<User[]>('http://localhost:3000/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get<User[]>(`http://localhost:3000/reports/${reportId}/users`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        setUsers(usersResponse.data)

        const ids = selectedUsersResponse.data
          .map((u) => u?.id)
          .filter((id): id is number => typeof id === 'number')

        setSelected(ids)
      } catch (error) {
        setUsers([])
        setSelected([])
        console.error('Ошибка загрузки пользователей', error)
      }
    }
    fetchData()
  }, [reportId])

  const handleSave = async () => {
    try {
      const token = await getToken()
      const validIds = selected.filter(
        (id): id is number => typeof id === 'number' && !isNaN(id)
      )
      await axios.post(
        `http://localhost:3000/reports/${reportId}/users`,
        { userIds: validIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      setOpen(false) // можно закрыть поповер после сохранения
    } catch (error) {
      console.error('Ошибка при сохранении пользователей', error)
    }
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

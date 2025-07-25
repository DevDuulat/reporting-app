'use client'

import { ChevronDown, Users as UsersIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  useReportInstances,
  useGroupedReportInstances
} from '@/hooks/useReports'
import { useState } from 'react'
import { ProfileModal } from '@/components/profile/ProfileModal'
import { mockUser } from '@/mockUser'
import { ModeToggle } from './mode-toggle'

const items = [
  {
    title: 'Пользователи',
    icon: UsersIcon,
    onClick: (props: AppSidebarProps) => props.onOpenUsers()
  },
  {
    title: 'Отчеты',
    icon: UsersIcon,
    onClick: (props: AppSidebarProps) => props.onOpenReports()
  }
]

type AppSidebarProps = {
  onSelectReport: (report: { id: number; minio_id: string }) => void
  onOpenReports: () => void
  onOpenUsers: () => void
}
function formatDateToYMD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // месяцы с 0
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
export function AppSidebar({
  onSelectReport,
  onOpenReports,
  onOpenUsers
}: AppSidebarProps) {
  const { instances: reportInstances, loadMore, hasMore } = useReportInstances()

  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  const selectedDateStr = selectedDate ? formatDateToYMD(selectedDate) : null

  console.log(selectedDate)
  const filteredInstances = selectedDateStr
    ? reportInstances.filter((r) => r.day === selectedDateStr)
    : reportInstances

  const { byDay, byFolder } = useGroupedReportInstances(filteredInstances)
  console.log(filteredInstances)
  return (
    <Sidebar className="border-none">
      <div className="flex flex-col h-full text-foreground">
        <SidebarContent className="p-0 flex flex-col flex-1 min-h-0 overflow-hidden">
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col flex-1 min-h-0 overflow-auto px-2 pt-2 pb-0 gap-2">
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() =>
                        item.onClick?.({
                          onSelectReport,
                          onOpenReports,
                          onOpenUsers
                        })
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              {/* Календарь */}
              <div className="px-1">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal text-left mt-2"
                    >
                      {selectedDate
                        ? selectedDate.toLocaleDateString('ru-RU')
                        : 'Фильтр по дате'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setSelectedDate(date)
                        setCalendarOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate(null)
                      loadMore()
                    }}
                    className="text-xs text-muted-foreground hover:underline mt-1"
                  >
                    Сбросить фильтр
                  </button>
                )}
              </div>

              <Tabs defaultValue="day" className="w-full mt-4">
                <TabsList className="grid grid-cols-2 gap-1 bg-muted rounded-md p-[3px]">
                  <TabsTrigger value="day" className="text-sm">
                    День
                  </TabsTrigger>
                  <TabsTrigger value="folder" className="text-sm">
                    Папка
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="day" className="p-0">
                  <ScrollArea className="h-[300px] pr-2">
                    <div className="space-y-2 px-1">
                      {Object.entries(byDay).map(([day, reports]) => (
                        <details key={day} className="group">
                          <summary
                            className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-primary/10 rounded"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span>{day}</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          </summary>
                          <ul className="mt-1 pl-4 space-y-1">
                            {reports.map((r) => (
                              <SidebarMenuItem
                                key={r.id}
                                onClick={() =>
                                  onSelectReport({
                                    id: r.report.id,
                                    minio_id: r.minio_id
                                  })
                                }
                                className="cursor-pointer select-none"
                              >
                                <SidebarMenuButton>
                                  <span className="block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                                  {r.title}
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </ul>
                        </details>
                      ))}
                      {hasMore && (
                        <div className="text-center pt-2">
                          <button
                            onClick={loadMore}
                            className="text-sm text-primary hover:underline"
                          >
                            +10 ещё
                          </button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="folder" className="p-0">
                  <ScrollArea className="h-[300px] pr-2">
                    <div className="space-y-2 px-1">
                      {Object.entries(byFolder).map(([folder, reports]) => (
                        <details key={folder} className="group">
                          <summary
                            className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-primary/10 rounded break-words"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="break-words max-w-[calc(100%-1.5rem)]">
                              {folder}
                            </span>
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          </summary>
                          <ul className="mt-1 pl-4 space-y-1 max-w-full">
                            {reports.map((r) => (
                              <SidebarMenuItem
                                key={r.id}
                                onClick={() =>
                                  onSelectReport({
                                    id: r.report.id,
                                    minio_id: r.minio_id
                                  })
                                }
                                className="cursor-pointer select-none"
                              >
                                <SidebarMenuButton className="break-words w-full">
                                  <span className="block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></span>
                                  <span className="break-words">
                                    {r.day}: {r.title}
                                  </span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </ul>
                        </details>
                      ))}
                      {hasMore && (
                        <div className="text-center pt-2">
                          <button
                            onClick={loadMore}
                            className="text-sm text-primary hover:underline"
                          >
                            +10 ещё
                          </button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Нижняя панель */}
        <div className="mt-auto px-2 pb-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setProfileOpen(true)}>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://placehold.co/800x800" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <span>Мой профиль</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="p-2 border-t border-transparent">
            <ModeToggle />
          </div>
        </div>

        <ProfileModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          userId={mockUser.id}
          email={mockUser.email}
        />
      </div>
    </Sidebar>
  )
}

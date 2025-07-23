import { ChevronDown, Users as UsersIcon } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
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
import {
  useReportInstances,
  useGroupedReportInstances
} from '@/hooks/useReports'
import { useState } from 'react'
import { ProfileModal } from '@/components/profile/ProfileModal'
import { mockUser } from '@/mockUser'

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

export function AppSidebar({
  onSelectReport,
  onOpenReports,
  onOpenUsers
}: AppSidebarProps) {
  const reportInstances = useReportInstances()
  const { byDay, byFolder } = useGroupedReportInstances(reportInstances)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <Sidebar>
      <div className="flex flex-col h-full bg-background text-foreground">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button
                        type="button"
                        onClick={() =>
                          item.onClick?.({
                            onSelectReport,
                            onOpenReports,
                            onOpenUsers
                          })
                        }
                        className="w-full flex items-center space-x-2"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              <div className="mt-4 select-none">
                <Tabs defaultValue="day" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="day">День</TabsTrigger>
                    <TabsTrigger value="folder">Папка</TabsTrigger>
                  </TabsList>

                  <TabsContent value="day" className="p-1 ">
                    {Object.entries(byDay).map(([day, reports]) => (
                      <details className="group" key={day}>
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-primary rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>{day}</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1 ">
                          {reports.map((r) => (
                            <li
                              key={r.id}
                              className="flex justify-between items-center px-2 py-1 dark:hover:bg-primary rounded"
                            >
                              <div
                                className="cursor-pointer flex"
                                onClick={() =>
                                  onSelectReport({
                                    id: r.report.id,
                                    minio_id: r.minio_id
                                  })
                                }
                              >
                                <span className="block h-1.5 w-1.5 rounded-full bg-dark-500 mt-1.5 mr-2"></span>
                                {r.title}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ))}
                  </TabsContent>

                  <TabsContent value="folder" className="p-1">
                    {Object.entries(byFolder).map(([folder, reports]) => (
                      <details className="group" key={folder}>
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-primary rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>{folder}</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          {reports.map((r) => (
                            <li
                              key={r.id}
                              className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-primary rounded select-none cursor-pointer"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() =>
                                onSelectReport({
                                  id: r.report.id,
                                  minio_id: r.minio_id
                                })
                              }
                            >
                              <span className="block h-1.5 w-1.5 rounded-full bg-dark-500 mt-1.5 mr-2"></span>
                              {r.day}: {r.title}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Нижняя панель */}
        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => setProfileOpen(true)}
                      className="flex items-center space-x-2 w-full"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://placehold.co/800x800" />
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <span>Мой профиль</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="p-2 border-t">
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

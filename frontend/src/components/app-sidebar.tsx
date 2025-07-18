import { Home, ChevronDown, Users as UsersIcon } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

import {
  useReportInstances,
  useGroupedReportInstances
} from '@/hooks/useReports'

const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home
  }
]

type AppSidebarProps = {
  onSelectReport: (minioId: string) => void
}

export function AppSidebar({ onSelectReport }: AppSidebarProps) {
  const reportInstances = useReportInstances()
  const { byDay, byFolder } = useGroupedReportInstances(reportInstances)

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              <div className="mt-4 select-none">
                <Tabs defaultValue="day" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="folder">Folder</TabsTrigger>
                  </TabsList>

                  <TabsContent value="day" className="p-1">
                    {Object.entries(byDay).map(([day, reports]) => (
                      <details className="group" key={day}>
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>{day}</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          {reports.map((r) => (
                            <li
                              key={r.id}
                              className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none cursor-pointer"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => onSelectReport?.(r.minio_id)}
                            >
                              <span className="block h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2"></span>
                              {r.title}
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
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>{folder}</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          {reports.map((r) => (
                            <li
                              key={r.id}
                              className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none cursor-pointer"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => onSelectReport?.(r.minio_id)}
                            >
                              <span className="block h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2"></span>
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
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#users">
                      <UsersIcon />
                      <span>Users</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="p-2 border-t">
            <ModeToggle />
          </div>
        </div>
      </div>
    </Sidebar>
  )
}

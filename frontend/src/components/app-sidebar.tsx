import { Home } from 'lucide-react'
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

const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home
  }
]

export function AppSidebar() {
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

              {/* Добавляем вкладки */}
              <div className="mt-4">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList>
                    <TabsTrigger value="account">Day</TabsTrigger>
                    <TabsTrigger value="password">Folder</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="p-2">
                    Day
                  </TabsContent>
                  <TabsContent value="password" className="p-2">
                    Folder
                  </TabsContent>
                </Tabs>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Нижняя панель с переключением темы */}
        <div className="mt-auto p-2 border-t">
          <ModeToggle />
        </div>
      </div>
    </Sidebar>
  )
}

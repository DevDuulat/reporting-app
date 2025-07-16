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
              <div className="mt-4 select-none">
                <Tabs defaultValue="day" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="folder">Folder</TabsTrigger>
                  </TabsList>

                  {/* Вкладка по дням */}
                  <TabsContent value="day" className="p-1">
                    <div className="space-y-1">
                      {/* Группа 2025-07-17 */}
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>2025-07-17</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2"></span>
                            Анализ конкурентов
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-pink-500 mt-1.5 mr-2"></span>
                            Планирование Q3
                          </li>
                        </ul>
                      </details>

                      {/* Группа 2025-07-16 */}
                      <details className="group" open>
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>2025-07-16</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                            Финансовый отчет Q2
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                            Маркетинговый анализ июля
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                            Встреча с клиентом X
                          </li>
                        </ul>
                      </details>

                      {/* Группа 2025-07-15 */}
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>2025-07-15</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                            Отчет по продажам
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2"></span>
                            KPI отдела логистики
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                            Обзор новых продуктов
                          </li>
                        </ul>
                      </details>

                      {/* Группа 2025-07-14 */}
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>2025-07-14</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                            SEO-отчет
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 mr-2"></span>
                            Анализ соцсетей
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                            Обновление базы данных
                          </li>
                        </ul>
                      </details>

                      {/* Группа 2025-07-13 */}
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>2025-07-13</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                            Кампания "Лето 2025"
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-gray-500 mt-1.5 mr-2"></span>
                            Техническое обслуживание
                          </li>
                        </ul>
                      </details>
                    </div>
                  </TabsContent>

                  {/* Вкладка по папкам */}
                  <TabsContent value="folder" className="p-1">
                    <div className="space-y-1">
                      {/* Папка Финансы */}
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>Финансы</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                            2025-07-16: Финансовый отчет Q2
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                            2025-07-14: Анализ бюджета
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                            2025-07-10: Оптимизация расходов
                          </li>
                        </ul>
                      </details>

                      {/* Папка Маркетинг */}
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>Маркетинг</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                            2025-07-16: Маркетинговый анализ июля
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                            2025-07-13: Кампания "Лето 2025"
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                            2025-07-08: Анализ конкурентов
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                            2025-07-05: SMM стратегия
                          </li>
                        </ul>
                      </details>

                      {/* Папка Продажи */}
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>Продажи</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2"></span>
                            2025-07-15: Отчет по продажам
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2"></span>
                            2025-07-10: Ретроспектива сделок
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2"></span>
                            2025-07-07: Обучение менеджеров
                          </li>
                        </ul>
                      </details>

                      {/* Папка Разработка */}
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>Разработка</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                            2025-07-14: Обновление базы данных
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                            2025-07-11: Фикс багов
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                            2025-07-06: Новая функциональность
                          </li>
                        </ul>
                      </details>

                      {/* Папка Администрирование */}
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer list-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span>Администрирование</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 pl-4 space-y-1">
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-gray-500 mt-1.5 mr-2"></span>
                            2025-07-13: Техническое обслуживание
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-gray-500 mt-1.5 mr-2"></span>
                            2025-07-09: Обновление ПО
                          </li>
                          <li
                            className="flex items-start px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded select-none"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full bg-gray-500 mt-1.5 mr-2"></span>
                            2025-07-04: Резервное копирование
                          </li>
                        </ul>
                      </details>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Нижняя панель с переключением темы */}
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

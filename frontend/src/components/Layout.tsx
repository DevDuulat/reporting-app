import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import React, { useState } from 'react'
import { Header } from '@/components/Header'

export default function Layout({
  children,
  onSelectReport,
  onOpenReports,
  onOpenUsers
}: {
  children: React.ReactNode
  onSelectReport: (report: { id: number; minio_id: string }) => void
  onOpenReports: () => void
  onOpenUsers: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar отдельно, фиксируется слева */}
        <AppSidebar
          onSelectReport={onSelectReport}
          onOpenReports={onOpenReports}
          onOpenUsers={onOpenUsers}
        />

        {/* Контейнер для хедера и основного контента */}
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-y-auto bg-muted text-foreground">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

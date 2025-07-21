import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

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
  return (
    <SidebarProvider>
      <AppSidebar
        onSelectReport={onSelectReport}
        onOpenReports={onOpenReports}
        onOpenUsers={onOpenUsers}
      />
      <main className="w-full bg-muted text-foreground">{children}</main>
    </SidebarProvider>
  )
}

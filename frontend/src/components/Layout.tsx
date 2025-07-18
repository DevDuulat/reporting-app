import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function Layout({
  children,
  onSelectReport,
  onOpenReports
}: {
  children: React.ReactNode
  onSelectReport: (report: { id: number; minio_id: string }) => void
  onOpenReports: () => void
}) {
  return (
    <SidebarProvider>
      <AppSidebar
        onSelectReport={onSelectReport}
        onOpenReports={onOpenReports}
      />
      <main className="w-full bg-white text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
        {children}
      </main>
    </SidebarProvider>
  )
}

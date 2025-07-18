import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function Layout({
  children,
  onSelectReport
}: {
  children: React.ReactNode
  onSelectReport: (minioId: string) => void
}) {
  return (
    <SidebarProvider>
      <AppSidebar onSelectReport={onSelectReport} />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  )
}

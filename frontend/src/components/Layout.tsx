import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=" w-full ml-4 p-4">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  )
}

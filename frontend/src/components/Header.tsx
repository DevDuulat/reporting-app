import { SidebarTrigger } from '@/components/ui/sidebar'

export function Header({
  showSidebarTrigger = true
}: {
  showSidebarTrigger?: boolean
}) {
  return (
    <header className="h-14 px-4 border-b bg-sidebar border-none flex items-center justify-between text-foreground">
      {showSidebarTrigger && <SidebarTrigger />}
    </header>
  )
}

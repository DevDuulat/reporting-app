// src/components/Header.tsx
import { SidebarTrigger } from '@/components/ui/sidebar'
// import { ModeToggle } from '@/components/mode-toggle'

export function Header() {
  return (
    <div className="flex items-center justify-between mb-4">
      <SidebarTrigger />
      {/* <ModeToggle /> */}
    </div>
  )
}

// src/App.tsx
import Layout from '@/components/Layout'
// import { ModeToggle } from '@/components/mode-toggle'
import { ThemeProvider } from '@/components/theme-provider'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <div className="text-xl font-bold">Добро пожаловать в приложение</div>
        {/* <ModeToggle /> */}
      </Layout>
    </ThemeProvider>
  )
}

import { useState } from 'react'
import Layout from '@/components/Layout'
import { ThemeProvider } from '@/components/theme-provider'
import PdfViewer from '@/components/PdfViewer'
import { ReportsPage } from '@/pages/ReportsPage'

type Page = 'reports' | 'viewer' | 'none'

export default function App() {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [activePage, setActivePage] = useState<Page>('reports')

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout
        onSelectReport={(report) => {
          setFileUrl(`http://localhost:3000/files/${report.minio_id}`)
          setActivePage('viewer')
        }}
        onOpenReports={() => {
          setFileUrl(null)
          setActivePage('reports')
        }}
      >
        {activePage === 'reports' ? (
          <ReportsPage />
        ) : activePage === 'viewer' && fileUrl ? (
          <PdfViewer fileUrl={fileUrl} />
        ) : (
          <p>Выберите отчёт для просмотра</p>
        )}
      </Layout>
    </ThemeProvider>
  )
}

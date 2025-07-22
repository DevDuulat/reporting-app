import { useState } from 'react'
import Layout from '@/components/Layout'
import PdfViewer from '@/components/PdfViewer'
import UsersPage from '@/components/users/page'
import ReportsPage from '@/components/reports/page'
import { useAuthState } from './hooks/useKeycloak'

type Page = 'reports' | 'viewer' | 'users' | 'none'

export default function App() {
  const [fileId, setFileId] = useState<string | null>(null)
  const [activePage, setActivePage] = useState<Page>('reports')
  const { authenticated } = useAuthState()

  return (
    authenticated && (
      <Layout
        onSelectReport={(report) => {
          setFileId(report.minio_id)
          setActivePage('viewer')
        }}
        onOpenReports={() => {
          setFileId(null)
          setActivePage('reports')
        }}
        onOpenUsers={() => {
          setFileId(null)
          setActivePage('users')
        }}
      >
        {activePage === 'reports' ? (
          <ReportsPage />
        ) : activePage === 'viewer' && fileId ? (
          <PdfViewer fileId={fileId} />
        ) : activePage === 'users' ? (
          <UsersPage />
        ) : (
          <p>Выберите отчёт для просмотра</p>
        )}
      </Layout>
    )
  )
}

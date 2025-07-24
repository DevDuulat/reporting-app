import {
  Routes,
  Route,
  useParams,
  useNavigate,
  useLocation
} from 'react-router-dom'
import Layout from '@/components/Layout'
import PdfViewer from '@/components/PdfViewer'
import UsersPage from '@/components/users/page'
import ReportsPage from '@/components/reports/page'
import { useAuthState } from './hooks/useKeycloak'
import { saveView } from './api/viewsApi'
import { mockUser } from './mockUser'
import { GrantReportPage } from '@/pages/GrantReportView'
import React, { useState, useEffect } from 'react'

function MainApp() {
  const { authenticated, authType } = useAuthState()
  const navigate = useNavigate()
  const location = useLocation()
  const [fileId, setFileId] = useState<string | null>(null)

  useEffect(() => {
    const match = location.pathname.match(/^\/viewer\/(.+)/)
    if (match) setFileId(match[1])
    else setFileId(null)
  }, [location.pathname])

  if (!authenticated) return null

  const validTypes = ['auth', 'open', undefined]
  const safeAuthType = validTypes.includes(authType) ? authType : undefined

  return (
    <Layout
      onSelectReport={(report) => {
        saveView({
          user_id: mockUser.id,
          report_id: report.id,
          type: safeAuthType
        })
        navigate(`/viewer/${report.minio_id}`)
      }}
      onOpenReports={() => navigate('/reports')}
      onOpenUsers={() => navigate('/users')}
    >
      {location.pathname === '/reports' ? (
        <ReportsPage />
      ) : location.pathname.startsWith('/viewer/') && fileId ? (
        <PdfViewer fileId={fileId} />
      ) : location.pathname === '/users' ? (
        <UsersPage />
      ) : (
        <p>Выберите отчёт для просмотра</p>
      )}
    </Layout>
  )
}

function GrantReportPageWrapper() {
  const { accessToken } = useParams<{ accessToken: string }>()

  if (!accessToken) {
    return <div>Недопустимый токен</div>
  }

  // Публичный режим без Layout, только отчёт
  return <GrantReportPage accessToken={accessToken} />
}

export default function App() {
  return (
    <Routes>
      {/* Публичный доступ — без Layout */}
      <Route path="/grants/:accessToken" element={<GrantReportPageWrapper />} />

      {/* Всё остальное — с Layout, авторизация */}
      <Route path="/*" element={<MainApp />} />
    </Routes>
  )
}

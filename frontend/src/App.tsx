import { useState, useEffect } from 'react'
import {
  BrowserRouter,
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

function MainApp() {
  const { authenticated } = useAuthState()
  const navigate = useNavigate()
  const location = useLocation()
  const [fileId, setFileId] = useState<string | null>(null)

  useEffect(() => {
    const match = location.pathname.match(/^\/viewer\/(.+)/)
    if (match) {
      setFileId(match[1])
    } else {
      setFileId(null)
    }
  }, [location.pathname])

  if (!authenticated) return null

  return (
    <Layout
      onSelectReport={(report) => {
        saveView({
          user_id: mockUser.id,
          report_id: report.id,
          type: 'open'
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
  const { loading, authenticated } = useAuthState()
  const { accessToken } = useParams<{ accessToken: string }>()
  const navigate = useNavigate()

  if (loading) {
    return <div>Идёт инициализация...</div>
  }

  if (!authenticated) {
    return <div>Пожалуйста, войдите в систему</div>
  }

  if (!accessToken) {
    return <div>Недопустимый токен</div>
  }

  return (
    <Layout
      onSelectReport={(report) => {
        saveView({
          user_id: mockUser.id,
          report_id: report.id,
          type: 'open'
        })
        navigate(`/viewer/${report.minio_id}`)
      }}
      onOpenReports={() => navigate('/reports')}
      onOpenUsers={() => navigate('/users')}
    >
      <GrantReportPage accessToken={accessToken} />
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/grants/:accessToken"
          element={<GrantReportPageWrapper />}
        />
        <Route path="/reports" element={<MainApp />} />
        <Route path="/users" element={<MainApp />} />
        <Route path="/viewer/:fileId" element={<MainApp />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  )
}

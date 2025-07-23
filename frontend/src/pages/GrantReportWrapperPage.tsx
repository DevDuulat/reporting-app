import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { GrantReportPage } from '@/pages/GrantReportView'
import PdfViewer from '@/components/PdfViewer'
import Layout from '@/components/Layout'
import { saveView } from '@/api/viewsApi'
import { mockUser } from '@/mockUser'

export function GrantReportWrapperPage() {
  const [fileId, setFileId] = useState<string | null>(null)
  const { accessToken } = useParams<{ accessToken: string }>()

  const hasGrantToken = Boolean(accessToken)

  return (
    <Layout
      onSelectReport={(report) => {
        saveView({
          user_id: mockUser.id,
          report_id: report.id,
          type: 'open'
        })

        setFileId(report.minio_id)
      }}
      onOpenReports={() => {}}
      onOpenUsers={() => {}}
    >
      {hasGrantToken ? (
        <GrantReportPage accessToken={accessToken!} />
      ) : fileId ? (
        <PdfViewer fileId={fileId} />
      ) : (
        <div className="p-4 text-gray-600">Выберите отчёт из списка слева</div>
      )}
    </Layout>
  )
}

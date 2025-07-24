import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { GrantReportPage } from '@/pages/GrantReportView'
import PdfViewer from '@/components/PdfViewer'
import { saveView } from '@/api/viewsApi'
import { mockUser } from '@/mockUser'

export function GrantReportWrapperPage() {
  const [fileId, setFileId] = useState<string | null>(null)
  const { accessToken } = useParams<{ accessToken: string }>()

  const hasGrantToken = Boolean(accessToken)

  function handleSelectReport(report: any) {
    saveView({
      user_id: mockUser.id,
      report_id: report.id,
      type: 'open'
    })
    setFileId(report.minio_id)
  }

  if (hasGrantToken) {
    return <GrantReportPage accessToken={accessToken!} />
  }

  if (fileId) {
    return <PdfViewer fileId={fileId} />
  }

  return <div className="p-4 text-gray-600">Выберите отчёт для просмотра</div>
}

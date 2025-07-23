import React, { useEffect, useState, useRef } from 'react'
import { useReportInstanceByGrant } from '@/hooks/useReportInstanceByGrant'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import '@react-pdf-viewer/full-screen/lib/styles/index.css'
import { getToken } from '@/utils/keycloak.util'
import { useTheme } from '@/components/theme-provider'

interface GrantReportPageProps {
  accessToken: string
}

export function GrantReportPage({ accessToken }: GrantReportPageProps) {
  const { reportInstance, loading, error } =
    useReportInstanceByGrant(accessToken)
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const fullScreen = fullScreenPlugin({
    getFullScreenTarget: () => containerRef.current!
  })

  const defaultLayout = defaultLayoutPlugin({
    sidebarTabs: () => []
  })

  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchPdf(minioId: string) {
      try {
        setPdfLoading(true)
        const token = await getToken()
        const response = await fetch(`http://localhost:3000/files/${minioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
          throw new Error(`Ошибка загрузки файла: ${response.status}`)
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        if (isMounted) {
          setBlobUrl(url)
          setPdfError(null)
        }
      } catch (err) {
        if (isMounted) {
          setPdfError((err as Error).message)
          setBlobUrl(null)
        }
      } finally {
        if (isMounted) {
          setPdfLoading(false)
        }
      }
    }

    if (reportInstance?.minio_id) {
      fetchPdf(reportInstance.minio_id)
    }

    return () => {
      isMounted = false
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [reportInstance?.minio_id])

  if (loading) return <div>Загрузка отчёта...</div>
  if (error) return <div>Ошибка: {error}</div>
  if (!reportInstance) return <div>Отчёт не найден</div>

  return (
    <div>
      <div ref={containerRef} className="h-screen w-full mt-4">
        {pdfLoading && <p>Загрузка PDF...</p>}
        {pdfError && <p className="text-red-600">Ошибка: {pdfError}</p>}
        {!pdfLoading && !pdfError && blobUrl && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl={blobUrl}
              plugins={[defaultLayout, fullScreen]}
              theme={theme === 'dark' ? 'dark' : 'light'}
            />
          </Worker>
        )}
      </div>
    </div>
  )
}

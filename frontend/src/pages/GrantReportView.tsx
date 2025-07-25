import { useEffect, useState, useRef } from 'react'
import { useReportInstanceByGrant } from '@/hooks/useReportInstanceByGrant'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import '@react-pdf-viewer/full-screen/lib/styles/index.css'
import { useTheme } from '@/components/theme-provider'

import { Button } from '@/components/ui/button'

interface GrantReportPageProps {
  accessToken: string
}

export function GrantReportPage({ accessToken }: GrantReportPageProps) {
  const { reportInstance, loading, error } = useReportInstanceByGrant(
    accessToken,
    false
  )
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

        const response = await fetch(
          `http://localhost:3000/files/${minioId}`,
          {}
        )

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

  // Кнопка авторизации — всегда видна в шапке
  // Если отчёт недоступен — показываем сообщение под кнопкой

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Шапка с кнопкой авторизации */}
      <header className="bg-sidebar text-foreground border-b border-border px-4 py-3 shadow-sm">
        <Button onClick={() => (window.location.href = '/login')}>
          Авторизоваться
        </Button>
      </header>

      {/* Основное содержимое */}
      <main ref={containerRef} className="flex-1 relative">
        {loading && (
          <div className="flex items-center justify-center h-full">
            Загрузка отчёта...
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full text-red-600 px-4">
            <p>Ошибка: {error}</p>
          </div>
        )}

        {!loading && !error && !reportInstance && (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-700">
            <p>Вы не авторизованы для просмотра отчётов.</p>
            <p className="mt-2">
              Пожалуйста, войдите в систему для доступа к отчётам.
            </p>
          </div>
        )}

        {!loading && !error && reportInstance && (
          <>
            {pdfLoading && (
              <div className="flex items-center justify-center h-full">
                Загрузка PDF...
              </div>
            )}

            {pdfError && (
              <div className="flex items-center justify-center h-full text-red-600 px-4">
                Ошибка: {pdfError}
              </div>
            )}

            {!pdfLoading && !pdfError && blobUrl && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={blobUrl}
                  plugins={[defaultLayout, fullScreen]}
                  theme={theme === 'dark' ? 'dark' : 'light'}
                  className="h-full"
                />
              </Worker>
            )}
          </>
        )}
      </main>
    </div>
  )
}

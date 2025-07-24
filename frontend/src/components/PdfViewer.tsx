'use client'

import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import '@react-pdf-viewer/full-screen/lib/styles/index.css'

import { useTheme } from '@/components/theme-provider'
import { useRef, useEffect, useState } from 'react'
import { getToken } from '@/utils/keycloak.util'

interface PdfViewerProps {
  fileId: string
  requireAuth?: boolean
}

const PdfViewer = ({ fileId, requireAuth = true }: PdfViewerProps) => {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const fullScreen = fullScreenPlugin({
    getFullScreenTarget: () => containerRef.current!
  })

  const defaultLayout = defaultLayoutPlugin({
    sidebarTabs: () => []
  })

  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchPdf() {
      try {
        setLoading(true)
        let headers: HeadersInit = {}

        if (requireAuth) {
          const token = await getToken()
          if (!token) throw new Error('Токен не получен')
          headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch(`http://localhost:3000/files/${fileId}`, {
          headers
        })

        if (!response.ok) {
          throw new Error(`Ошибка загрузки файла: ${response.status}`)
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        if (isMounted) {
          setBlobUrl(url)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message)
          setBlobUrl(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPdf()

    return () => {
      isMounted = false
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [fileId, requireAuth])

  if (loading) return <p>Загрузка файла...</p>
  if (error) return <p className="text-red-600">Ошибка: {error}</p>
  if (!blobUrl) return <p>Файл не доступен</p>

  return (
    <div ref={containerRef} className="h-screen w-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={blobUrl}
          plugins={[defaultLayout, fullScreen]}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </Worker>
    </div>
  )
}

export default PdfViewer

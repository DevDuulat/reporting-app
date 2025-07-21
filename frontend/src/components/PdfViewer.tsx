'use client'

import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import '@react-pdf-viewer/full-screen/lib/styles/index.css'

import { useTheme } from '@/components/theme-provider'
import { useRef } from 'react'

const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const fullScreen = fullScreenPlugin({
    getFullScreenTarget: () => containerRef.current!
  })

  const defaultLayout = defaultLayoutPlugin({
    sidebarTabs: () => []
  })

  return (
    <div ref={containerRef} className="h-screen w-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayout, fullScreen]}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </Worker>
    </div>
  )
}

export default PdfViewer

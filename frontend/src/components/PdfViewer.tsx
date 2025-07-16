// components/PdfViewer.tsx
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div className="h-[90vh] border rounded shadow p-2 bg-white dark:bg-black">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  )
}

export default PdfViewer

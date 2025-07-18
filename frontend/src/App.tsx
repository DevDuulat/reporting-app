import { useState } from 'react'
import Layout from '@/components/Layout'
import { ThemeProvider } from '@/components/theme-provider'
import PdfViewer from '@/components/PdfViewer'

export default function App() {
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout
        onSelectReport={(minioId) =>
          setFileUrl(`http://localhost:3000/files/${minioId}`)
        }
      >
        {fileUrl && <PdfViewer fileUrl={fileUrl} />}
      </Layout>
    </ThemeProvider>
  )
}

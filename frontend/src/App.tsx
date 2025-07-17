import Layout from '@/components/Layout'
import { ThemeProvider } from '@/components/theme-provider'
import PdfViewer from '@/components/PdfViewer'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <PdfViewer fileUrl="http://localhost:3000/files/1752763518798_test.pdf" />
      </Layout>
    </ThemeProvider>
  )
}

import Layout from '@/components/Layout'
import { ThemeProvider } from '@/components/theme-provider'
import PdfViewer from '@/components/PdfViewer'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <PdfViewer fileUrl="./public/Nest-js-A-Progressive-Node-js-Framework-pdf.pdf" />
      </Layout>
    </ThemeProvider>
  )
}

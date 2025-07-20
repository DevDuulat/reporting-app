import { useState } from "react";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import PdfViewer from "@/components/PdfViewer";
import UsersPage from "@/components/users/page";
import ReportsPage from "@/components/reports/page";

type Page = "reports" | "viewer" | "users" | "none";

export default function App() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<Page>("reports");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout
        onSelectReport={(report) => {
          setFileUrl(`http://localhost:3000/files/${report.minio_id}`);
          setActivePage("viewer");
        }}
        onOpenReports={() => {
          setFileUrl(null);
          setActivePage("reports");
        }}
        onOpenUsers={() => {
          setFileUrl(null);
          setActivePage("users");
        }}
      >
        {activePage === "reports" ? (
          <ReportsPage />
        ) : activePage === "viewer" && fileUrl ? (
          <PdfViewer fileUrl={fileUrl} />
        ) : activePage === "users" ? (
          <UsersPage />
        ) : (
          <p>Выберите отчёт для просмотра</p>
        )}
      </Layout>
    </ThemeProvider>
  );
}

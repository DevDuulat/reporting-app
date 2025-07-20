"use client";

import { useEffect, useState } from "react";
import type { Report } from "@/types/report";
import { ReportsTable } from "@/components/reports/data-table";
import { columns } from "@/components/reports/columns";
import { getReports, deleteReport } from "@/api/reportsApi";
import { toast } from "sonner";
import { ReportDialog } from "@/components/reports/report-dialog";

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report>();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReports();
      setReports(res.data);
      setError(null);
    } catch {
      setError("Ошибка загрузки отчётов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteReport(id);
      toast.success("Отчёт удалён");
      fetchReports();
    } catch {
      toast.error("Ошибка при удалении отчёта");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Отчёты</h1>

      <button
        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        onClick={() => {
          setEditingReport(undefined);
          setDialogOpen(true);
        }}
      >
        Создать отчёт
      </button>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ReportsTable
        columns={columns}
        data={reports}
        onDeleteReport={handleDelete}
      />

      <ReportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editingReport}
        onSuccess={() => {
          fetchReports();
          setDialogOpen(false);
        }}
      />
    </div>
  );
}

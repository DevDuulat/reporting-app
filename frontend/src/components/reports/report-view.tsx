"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Report } from "@/types/report";

interface ReportViewProps {
  open: boolean;
  onClose: () => void;
  report?: Report;
}

export function ReportView({ open, onClose, report }: ReportViewProps) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ fontWeight: 600, fontSize: "1.125rem" }}>
            Детали отчёта
          </DialogTitle>
        </DialogHeader>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <strong style={{ fontWeight: 600 }}>Папка:</strong>{" "}
            <span>{report.folder}</span>
          </div>
          <div>
            <strong style={{ fontWeight: 600 }}>Название:</strong>{" "}
            <span>{report.title}</span>
          </div>
          <div>
            <strong style={{ fontWeight: 600 }}>Описание:</strong>{" "}
            <span>{report.description}</span>
          </div>
          <div>
            <strong style={{ fontWeight: 600 }}>Правила уведомлений:</strong>{" "}
            <span>{report.notif_rules}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

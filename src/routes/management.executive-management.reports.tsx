import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ExecutiveManagementTabBar } from "@/components/erp/ExecutiveManagementTabBar";
import {
  FileText,
  Download,
  Share2,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useModuleDataset } from "@/services/moduleDatasetService";
export const Route = createFileRoute("/management/executive-management/reports")({
  head: () => ({
    meta: [
      { title: "Strategy Reports · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated executive reports, board packs, financial variance analyses, risk registers, and management intelligence briefings.",
      },
    ],
  }),
  component: ExecutiveReportsPage,
});

const REPORT_TEMPLATES = [
  { id: 1, title: "Executive Business Review Pack (Q3)", type: "Board & CXO", period: "Q3 FY 2026-27", format: "PDF / PPT", status: "Ready" },
  { id: 2, title: "Consolidated P&L & Cash Flow Forecast", type: "Financial", period: "FY 2026-27", format: "Excel / PDF", status: "Ready" },
  { id: 3, title: "Strategic Objective & OKR Scorecard", type: "Strategy", period: "Annual", format: "PDF", status: "Ready" },
  { id: 4, title: "Enterprise Risk & Compliance Escalation Report", type: "Risk & Governance", period: "Monthly", format: "PDF", status: "Ready" },
  { id: 5, title: "Operations, OEE & Plant Utilization Summary", type: "Operations", period: "Weekly / Monthly", format: "Excel", status: "Ready" },
  { id: 6, title: "AI Executive Briefing & Variance Narrative", type: "Decision Intelligence", period: "Real-Time", format: "PDF", status: "Ready" },
];

const PAGE_DATASET = { REPORT_TEMPLATES };

function ExecutiveReportsPage() {
  const { REPORT_TEMPLATES } = useModuleDataset("executive-management.reports", "Strategy Reports", PAGE_DATASET);
  const [selectedFormat, setSelectedFormat] = useState("All Formats");

  const handleDownload = (title: string) => {
    toast.success(`Generating report: ${title}`, {
      description: "Document rendered and download initiated.",
    });
  };

  return (
    <AppShell
      title="Strategy Reports"
      breadcrumb="Management > Strategy > Reports"
      description="Consolidated Board Packs, Strategic Briefings & Financial Decision Intelligence."
      tabs={<ExecutiveManagementTabBar />}
    >
      <div className="space-y-5 pb-16">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl bg-card p-4 border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Strategy Reports</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  {REPORT_TEMPLATES.length} Reports
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Download Board Packs, Financial Summaries, and Executive Briefings</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.success("Generating complete Executive Review Pack")}
              className="h-9 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export Full Review Pack</span>
            </button>
          </div>
        </div>

        {/* Reports Register */}
        <div className="bg-card border rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h3 className="font-bold text-sm text-foreground">Standard Executive Reports</h3>
            <span className="text-xs text-muted-foreground">Certified Governance Data</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {REPORT_TEMPLATES.map((rep) => (
              <div key={rep.id} className="p-3.5 rounded-xl border bg-muted/20 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{rep.type}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                      {rep.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{rep.title}</h4>
                  <div className="text-[11px] text-muted-foreground">Period: {rep.period} • Format: {rep.format}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-[11px] text-muted-foreground">Auto-generated</span>
                  <button
                    type="button"
                    onClick={() => handleDownload(rep.title)}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

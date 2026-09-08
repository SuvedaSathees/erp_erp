import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import { toast } from "sonner";

interface QualityAnalyticsHeaderProps {
  dateRange: string;
  selectedPlant: string;
  onPlantChange: (plant: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  onCreateAnalysis?: () => void;
  onOpenReports?: () => void;
  isRefreshing?: boolean;
}

export function QualityAnalyticsHeader({
  dateRange,
  selectedPlant,
  onPlantChange,
  onRefresh,
  onExport,
  onCreateAnalysis,
  onOpenReports,
  isRefreshing = false,
}: QualityAnalyticsHeaderProps) {
  const downloadCsv = () => {
    const csvData =
      "Metric,Value,Target,Trend,Status\n" +
      "Overall Quality Score,94.2%,≥ 95%,+2.1%,Near Target\n" +
      "First Pass Yield (FPY),92.3%,≥ 95%,+1.8%,Improving\n" +
      "Defect Rate,2.8%,≤ 2.0%,-0.6%,Warning\n" +
      "Scrap Rate,1.2%,≤ 1.0%,-0.2%,Warning\n" +
      "Rework Rate,2.1%,≤ 2.0%,-0.4%,Stable\n" +
      "Open NCRs,47,≤ 40,+20%,Critical\n" +
      "CAPA Closure Rate,91.9%,≥ 95%,+3.2%,Improving\n" +
      "Rolled Throughput Yield,89.6%,≥ 90%,+1.4%,Good\n" +
      "Defects per Million (DPMO),2800,< 3000,-150,In-Spec\n" +
      "Cost of Poor Quality (COPQ),₹15.10 Lakhs,≤ 1.0% Rev,1.4% Rev,Controlled\n";

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Quality_Analytics_Executive_Summary_2026.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded Quality Analytics Summary (.csv)");
  };

  return (
    <QualityModuleHeaderCard
      title="Quality Analytics Form"
      description="Executive quality intelligence, defect trends, Pareto distributions, and real-time MES telemetry"
      dateRange={dateRange || "01 Aug 2026 – 06 Sep 2026"}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      onExportCsv={downloadCsv}
      onExportExcel={() => {
        downloadCsv();
        toast.success("Generated Excel-compatible Quality Analytics Sheet (.csv)");
      }}
      onExportPdf={() => {
        window.print();
      }}
      reports={[
        {
          label: "Executive KPI Summary Dossier",
          onClick: () => {
            if (onOpenReports) onOpenReports();
            else toast.info("Opening Executive Quality Summary Dossier...");
          },
        },
        {
          label: "Defect Pareto & Root-Cause Distribution",
          onClick: () => {
            if (onOpenReports) onOpenReports();
            else toast.info("Opening Defect Pareto Distribution Report...");
          },
        },
        {
          label: "Statistical Process Control (Cp / Cpk) Report",
          onClick: () => {
            if (onOpenReports) onOpenReports();
            else toast.info("Opening SPC Statistical Capability Report...");
          },
        },
        {
          label: "Cost of Poor Quality (COPQ) Breakdown",
          onClick: () => {
            if (onOpenReports) onOpenReports();
            else toast.info("Opening COPQ Financial Impact Analysis...");
          },
        },
      ]}
      primaryAction={{
        label: "Create Analysis",
        onClick: () => {
          if (onCreateAnalysis) onCreateAnalysis();
          else toast.info("Opening Quality Analysis Creator...");
        },
      }}
      moreActions={[
        {
          label: `Active Plant: ${selectedPlant}`,
          onClick: () => onPlantChange("All Plants"),
        },
        {
          label: "Switch to Plant 1 (SMT)",
          onClick: () => onPlantChange("Plant 1 (SMT)"),
        },
        {
          label: "Switch to Plant 2 (Assembly)",
          onClick: () => onPlantChange("Plant 2 (Assembly)"),
        },
        {
          label: "Switch to Plant 3 (Final Testing)",
          onClick: () => onPlantChange("Plant 3 (Final Testing)"),
        },
        {
          label: "Export Raw Telemetry Logs",
          onClick: () => downloadCsv(),
        },
      ]}
    />
  );
}

export default QualityAnalyticsHeader;

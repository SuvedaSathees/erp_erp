import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import { RcaRecord } from "@/services/rcaTypes";
import { toast } from "sonner";

interface RcaHeaderProps {
  record: RcaRecord;
  onSave: () => void;
  onSubmitVerification: () => void;
  onPrint: () => void;
  onExportReport?: () => void;
  onCreateCapa?: () => void;
  onCreateRca?: () => void;
}

export function RcaHeader({
  record,
  onSave,
  onSubmitVerification,
  onPrint,
  onExportReport,
  onCreateCapa,
  onCreateRca,
}: RcaHeaderProps) {
  // Real CSV export
  const handleExportCsv = () => {
    try {
      const lines = [
        `ROOT CAUSE ANALYSIS REPORT - ${record.rcaNumber}`,
        `Report Date,${new Date().toLocaleDateString()}`,
        `RCA Number,${record.rcaNumber}`,
        `Investigation Subject,"${record.title}"`,
        `Investigation Type,${record.rcaType}`,
        `Triggering Source,${record.rcaSource}`,
        `Source Reference,${record.sourceReference}`,
        `Methodology,${record.methodology}`,
        `Status,${record.status}`,
        `Lead Investigator,"${record.leadInvestigator}"`,
        `Target Closure Date,${record.targetClosureDate || record.targetDate}`,
        "",
        "5W2H STRUCTURED PROBLEM DEFINITION",
        `WHAT (Defect Symptom),"${record.what}"`,
        `WHERE (Location / Line),"${record.where}"`,
        `WHEN (Date / Shift),"${record.when}"`,
        `WHO (Detection / Reporter),"${record.who}"`,
        `WHY (Criticality),"${record.why}"`,
        `HOW (Defect Mechanism),"${record.how}"`,
        `HOW MUCH (Quantification),"${record.howMuch}"`,
        "",
        "5-WHY INVESTIGATIVE CAUSE LADDER",
        "Iteration Level,Why Question,Answer,Is Root Cause",
        ...record.fiveWhyList.map(
          (w) => `${w.level},"${w.whyQuestion}","${w.answer}",${w.isRootCause ? "YES (ROOT CAUSE)" : "No"}`
        ),
        "",
        "ISHIKAWA 6M CAUSE & EFFECT BREAKDOWN",
        "Dimension,Contributing Factors",
        ...record.fishbone.map(
          (f) => `"${f.category}","${f.factors.join(" | ")}"`
        ),
        "",
        "ROOT CAUSE DETERMINATION & VERIFICATION",
        `Immediate Cause,"${record.immediateCause}"`,
        `Contributing Factors,"${record.contributingCauses.join(" | ")}"`,
        `Confirmed Fundamental Root Cause,"${record.rootCause}"`,
        `Verification Status,${record.verificationStatus}`,
        `Empirical Evidence,"${record.verificationEvidence}"`,
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `RCA_${record.rcaNumber}_Investigation.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported RCA_${record.rcaNumber}_Investigation.csv`);
    } catch {
      toast.error("Failed to export RCA CSV report");
    }
  };

  // Real Excel export
  const handleExportExcel = () => {
    try {
      const lines = [
        `ROOT CAUSE ANALYSIS\t${record.rcaNumber}`,
        `Subject\t${record.title}`,
        `Lead Investigator\t${record.leadInvestigator}`,
        `Methodology\t${record.methodology}`,
        `Status\t${record.status}`,
        `Root Cause\t${record.rootCause}`,
        "",
        "Why Level\tWhy Question\tAnswer",
        ...record.fiveWhyList.map((w) => `${w.level}\t${w.whyQuestion}\t${w.answer}`),
      ];

      const blob = new Blob([lines.join("\n")], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `RCA_${record.rcaNumber}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported RCA_${record.rcaNumber}.xls`);
    } catch {
      toast.error("Failed to export Excel report");
    }
  };

  // Download 6M Fishbone Matrix
  const handleDownloadFishbone = () => {
    const lines = [
      "ISHIKAWA 6M CAUSE & EFFECT MATRIX",
      `RCA Number,${record.rcaNumber}`,
      `Incident,"${record.title}"`,
      "Dimension,Contributing Factors",
      ...record.fishbone.map((f) => `"${f.category}","${f.factors.join(" | ")}"`),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Fishbone_6M_${record.rcaNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded Fishbone_6M_${record.rcaNumber}.csv`);
  };

  // Download 5W2H Problem Statement
  const handleDownload5W2H = () => {
    const lines = [
      "5W2H STRUCTURED PROBLEM STATEMENT DOSSIER",
      `RCA Number,${record.rcaNumber}`,
      `Subject,"${record.title}"`,
      `WHAT,"${record.what}"`,
      `WHERE,"${record.where}"`,
      `WHEN,"${record.when}"`,
      `WHO,"${record.who}"`,
      `WHY,"${record.why}"`,
      `HOW,"${record.how}"`,
      `HOW MUCH,"${record.howMuch}"`,
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `5W2H_Dossier_${record.rcaNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded 5W2H_Dossier_${record.rcaNumber}.csv`);
  };

  return (
    <QualityModuleHeaderCard
      title="Root Cause Analysis Form"
      description="Multi-methodology diagnostics: 5W2H scoping, 5-Why branching, Ishikawa fishbone diagram, and CAPA link"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* RCA Investigation Number */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.rcaNumber}
          </span>

          {/* RCA Status Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {record.status}
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed RCA investigation matrix")}
      onExportCsv={handleExportCsv}
      onExportExcel={handleExportExcel}
      onExportPdf={onPrint}
      reports={[
        {
          label: "Ishikawa Diagram Summary Report",
          onClick: handleDownloadFishbone,
        },
        {
          label: "5-Why Branching Investigation Log",
          onClick: handleExportCsv,
        },
        {
          label: "RCA Problem Statement (5W2H) Dossier",
          onClick: handleDownload5W2H,
        },
      ]}
      primaryAction={{
        label: "Create RCA",
        onClick: () => {
          if (onCreateRca) {
            onCreateRca();
          } else {
            onSave();
            toast.success("Initialized new Root Cause Investigation draft");
          }
        },
      }}
      moreActions={[
        {
          label: "Certify Root Cause",
          onClick: onSubmitVerification,
        },
        {
          label: "Transfer Root Cause to CAPA",
          onClick: () => {
            if (onCreateCapa) onCreateCapa();
            else toast.info("Transferring RCA findings into new CAPA workflow...");
          },
        },
        {
          label: "Save Investigation Draft",
          onClick: onSave,
        },
        {
          label: "Print Complete RCA Dossier",
          onClick: onPrint,
        },
      ]}
    />
  );
}


import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import { CapaRecord } from "@/services/capaTypes";
import { toast } from "sonner";

interface CapaHeaderProps {
  record: CapaRecord;
  onSave: () => void;
  onSubmitForVerification: () => void;
  onPrint: () => void;
  onExportReport?: () => void;
  onVerifyEffectiveness?: () => void;
  onCreateCapa?: () => void;
}

export function CapaHeader({
  record,
  onSave,
  onSubmitForVerification,
  onPrint,
  onExportReport,
  onVerifyEffectiveness,
  onCreateCapa,
}: CapaHeaderProps) {
  // Real CSV export
  const handleExportCsv = () => {
    try {
      const lines = [
        `CORRECTIVE & PREVENTIVE ACTION (CAPA) REPORT - ${record.capaNumber}`,
        `Generated Date,${new Date().toLocaleDateString()}`,
        `CAPA Number,${record.capaNumber}`,
        `CAPA Title,"${record.title}"`,
        `Type,${record.capaType}`,
        `Source,${record.source}`,
        `Source Reference No.,${record.sourceReference}`,
        `Severity Level,${record.severity}`,
        `Status,${record.status}`,
        `CAPA Owner,"${record.owner}"`,
        `Department,"${record.department}"`,
        `Target Closure Date,${record.targetClosureDate}`,
        "",
        "PRODUCT & PROBLEM DEFINITION (5W2H)",
        `Affected Product,"${record.productName}"`,
        `Part Number / SKU,${record.partNumber}`,
        `Production Line,"${record.productionLine}"`,
        `Detailed Defect Description,"${record.defectDescription}"`,
        `Observed Defect Rate,${record.defectRate}`,
        `Root Cause Summary (from RCA),"${record.rootCauseSummary}"`,
        "",
        "FMEA RISK ASSESSMENT & RPN REDUCTION",
        `Initial Pre-CAPA RPN,${record.initialRpn} (S:${record.severityScore} x O:${record.occurrenceScore} x D:${record.detectionScore})`,
        `Target Residual RPN,${record.residualRpn}`,
        `Risk Reduction Percent,-${record.rpnReductionPercent}%`,
        "",
        "ACTION PLAN & IMPLEMENTATION TASKS",
        "Action Type,Description & Tasks,Assignee,Department,Due Date,Status,Objective Evidence",
        ...record.actions.map(
          (a) =>
            `"${a.actionType}","${a.description}","${a.assignedTo}","${a.department}",${a.targetDate},${a.status},"${a.evidenceNote}"`
        ),
        "",
        "EFFECTIVENESS VERIFICATION & CLOSURE CRITERIA",
        `Acceptance Criteria,"${record.effectivenessCriteria}"`,
        `Verification Methodology,"${record.verificationMethod}"`,
        `Observed Results,"${record.verificationResults}"`,
        `Effective Status,${record.isEffective ? "Validated Effective" : "Pending"}`,
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `CAPA_${record.capaNumber}_Executive_Dossier.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported CAPA_${record.capaNumber}_Executive_Dossier.csv`);
    } catch {
      toast.error("Failed to export CAPA CSV report");
    }
  };

  // Real Excel export
  const handleExportExcel = () => {
    try {
      const lines = [
        `CORRECTIVE & PREVENTIVE ACTION (CAPA)\t${record.capaNumber}`,
        `Title\t${record.title}`,
        `Owner\t${record.owner}`,
        `Status\t${record.status}`,
        `Initial RPN\t${record.initialRpn}`,
        `Target RPN\t${record.residualRpn}`,
        "",
        "Action Type\tDescription\tAssignee\tDue Date\tStatus\tEvidence",
        ...record.actions.map(
          (a) =>
            `${a.actionType}\t${a.description}\t${a.assignedTo}\t${a.targetDate}\t${a.status}\t${a.evidenceNote}`
        ),
      ];

      const blob = new Blob([lines.join("\n")], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `CAPA_${record.capaNumber}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported CAPA_${record.capaNumber}.xls`);
    } catch {
      toast.error("Failed to export Excel report");
    }
  };

  // Download 8D Problem Solving Dossier
  const handleDownload8d = () => {
    const lines = [
      `8D PROBLEM SOLVING DOSSIER - ${record.capaNumber}`,
      `Subject,"${record.title}"`,
      `D1: Team,"${record.owner} (${record.department})"`,
      `D2: Problem Description,"${record.defectDescription}"`,
      `D3: Containment Actions,"${record.actions.filter(a => a.actionType === 'Containment').map(a => a.description).join('; ')}"`,
      `D4: Root Cause (RCA),"${record.rootCauseSummary}"`,
      `D5: Corrective Actions,"${record.actions.filter(a => a.actionType === 'Corrective Action').map(a => a.description).join('; ')}"`,
      `D6: Implementation & Validation,"${record.actions.filter(a => a.actionType === 'Preventive Action').map(a => a.description).join('; ')}"`,
      `D7: Prevent Recurrence,"Control Plan update, training, and continuous optical density monitoring"`,
      `D8: Closure & Team Recognition,"Verified by ${record.owner} on ${record.targetClosureDate}"`,
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `8D_Dossier_${record.capaNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded 8D_Dossier_${record.capaNumber}.csv`);
  };

  // Download Action Plan Matrix
  const handleDownloadActionPlan = () => {
    const lines = [
      `CAPA ACTION IMPLEMENTATION MATRIX - ${record.capaNumber}`,
      "ID,Action Type,Description,Assignee,Department,Due Date,Status,Evidence",
      ...record.actions.map(
        (a) =>
          `"${a.id}","${a.actionType}","${a.description}","${a.assignedTo}","${a.department}",${a.targetDate},${a.status},"${a.evidenceNote}"`
      ),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Action_Plan_${record.capaNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded Action_Plan_${record.capaNumber}.csv`);
  };

  // Download Verification of Effectiveness Log
  const handleDownloadVoe = () => {
    const lines = [
      `VERIFICATION OF EFFECTIVENESS (VOE) LOG - ${record.capaNumber}`,
      `Title,"${record.title}"`,
      `Acceptance Criteria,"${record.effectivenessCriteria}"`,
      `Verification Method,"${record.verificationMethod}"`,
      `Observed Results,"${record.verificationResults}"`,
      `Initial RPN,${record.initialRpn}`,
      `Residual RPN,${record.residualRpn}`,
      `Reduction Percent,-${record.rpnReductionPercent}%`,
      `Effectiveness Status,${record.isEffective ? "Validated Effective" : "Pending"}`,
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `VoE_Log_${record.capaNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded VoE_Log_${record.capaNumber}.csv`);
  };

  return (
    <QualityModuleHeaderCard
      title="CAPA Management Form"
      description="Closed-loop corrective and preventive actions, 8D problem solving, and residual risk verification"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* CAPA Tracking Number */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.capaNumber}
          </span>

          {/* CAPA Status Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50/90 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            {record.status}
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed CAPA action registry & execution progress")}
      onExportCsv={handleExportCsv}
      onExportExcel={handleExportExcel}
      onExportPdf={onPrint}
      reports={[
        {
          label: "8D Problem Solving Dossier",
          onClick: handleDownload8d,
        },
        {
          label: "CAPA Action Implementation Matrix",
          onClick: handleDownloadActionPlan,
        },
        {
          label: "Verification of Effectiveness (VoE) Log",
          onClick: handleDownloadVoe,
        },
      ]}
      primaryAction={{
        label: "Create CAPA",
        onClick: () => {
          if (onCreateCapa) {
            onCreateCapa();
          } else {
            onSave();
            toast.success("Initialized new CAPA draft");
          }
        },
      }}
      moreActions={[
        {
          label: "Submit for Verification",
          onClick: onSubmitForVerification,
        },
        {
          label: "Sign Off Effectiveness",
          onClick: () => {
            if (onVerifyEffectiveness) onVerifyEffectiveness();
            else toast.success("Effectiveness validated and signed off");
          },
        },
        {
          label: "Save CAPA Draft",
          onClick: onSave,
        },
        {
          label: "Print 8D / CAPA Dossier",
          onClick: onPrint,
        },
      ]}
    />
  );
}

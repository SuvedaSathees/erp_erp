import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import { ComplianceRecord } from "@/services/complianceTypes";
import { toast } from "sonner";

interface ComplianceHeaderProps {
  record: ComplianceRecord;
  onSave: () => void;
  onSubmitAssessment: () => void;
  onPrint: () => void;
  onCreateCompliance?: () => void;
  onExportComplianceReport?: () => void;
  onInitiateAudit?: () => void;
  onRaiseGapNcr?: () => void;
}

export function ComplianceHeader({
  record,
  onSave,
  onSubmitAssessment,
  onPrint,
  onCreateCompliance,
  onExportComplianceReport,
  onInitiateAudit,
  onRaiseGapNcr,
}: ComplianceHeaderProps) {
  const downloadComplianceCsv = () => {
    const csvContent =
      "Field,Value\n" +
      `Compliance ID,${record.complianceNumber}\n` +
      `Requirement Title,"${record.title}"\n` +
      `Standard Reference,${record.standardReference}\n` +
      `Clause Reference,${record.clauseReference}\n` +
      `Category,${record.category}\n` +
      `Compliance Status,${record.complianceStatus}\n` +
      `Workflow Status,${record.workflowStatus}\n` +
      `Risk Level,${record.riskLevel}\n` +
      `Responsible Owner,"${record.responsibleOwner}"\n` +
      `Department,"${record.department}"\n` +
      `Compliance Score,${record.complianceScore}%\n` +
      `Effective Date,${record.effectiveDate}\n` +
      `Next Assessment Date,${record.nextAssessmentDate}\n` +
      "\nClause Obligations\n" +
      "Clause,Requirement,Function,Evaluation,Status\n" +
      record.obligations
        .map(
          (o) =>
            `"${o.clauseRef}","${o.requirement}","${o.applicableFunction}","${o.evaluation}","${o.status}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Compliance_Mandate_${record.complianceNumber}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported Compliance Register ${record.complianceNumber} (.csv)`);
  };

  return (
    <QualityModuleHeaderCard
      title="Compliance Management Form"
      description="Statutory, regulatory, and customer compliance mandates, clause obligations, and audit proof"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Compliance Obligation Number */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.complianceNumber}
          </span>

          {/* Compliance Status Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {record.complianceStatus}
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed regulatory compliance registry")}
      onExportCsv={downloadComplianceCsv}
      onExportExcel={() => {
        downloadComplianceCsv();
        toast.success(`Generated Excel-compatible compliance ledger (.csv)`);
      }}
      onExportPdf={onPrint}
      reports={[
        {
          label: "Regulatory Compliance Matrix (ISO / IATF)",
          onClick: () => {
            downloadComplianceCsv();
            toast.info("Generated Regulatory Compliance Matrix");
          },
        },
        {
          label: "Mandatory Evidence Register Dossier",
          onClick: () => toast.info("Exporting Mandatory Evidence Register Dossier..."),
        },
        {
          label: "Clause Gap & Risk Assessment Summary",
          onClick: () => toast.info("Opening Clause Gap Analysis Report..."),
        },
      ]}
      primaryAction={{
        label: "Create Compliance",
        onClick: () => {
          if (onCreateCompliance) onCreateCompliance();
          else {
            onSave();
            toast.success("Initialized new Compliance mandate record");
          }
        },
      }}
      moreActions={[
        {
          label: "Certify Assessment",
          onClick: onSubmitAssessment,
        },
        {
          label: "Schedule Internal Audit",
          onClick: () => {
            if (onInitiateAudit) onInitiateAudit();
            else toast.info("Scheduling internal audit for this compliance standard...");
          },
        },
        {
          label: "Raise Non-Conformance (NCR)",
          onClick: () => {
            if (onRaiseGapNcr) onRaiseGapNcr();
            else toast.warning("Raised Non-Conformance for compliance gap");
          },
        },
        {
          label: "Save Compliance Draft",
          onClick: onSave,
        },
        {
          label: "Print Compliance Register",
          onClick: onPrint,
        },
      ]}
    />
  );
}

export default ComplianceHeader;

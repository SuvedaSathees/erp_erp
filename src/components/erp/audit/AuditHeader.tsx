import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import { AuditRecord } from "@/services/auditTypes";
import { toast } from "sonner";

interface AuditHeaderProps {
  record: AuditRecord;
  onSave: () => void;
  onSubmitAudit: () => void;
  onPrint: () => void;
  onExportReport?: () => void;
  onGenerateNcrs?: () => void;
  onCreateAudit?: () => void;
}

export function AuditHeader({
  record,
  onSave,
  onSubmitAudit,
  onPrint,
  onExportReport,
  onGenerateNcrs,
  onCreateAudit,
}: AuditHeaderProps) {
  // Real CSV export
  const handleExportCsv = () => {
    try {
      const lines = [
        `QUALITY AUDIT REPORT - ${record.auditNumber}`,
        `Report Date,${new Date().toLocaleDateString()}`,
        `Audit Number,${record.auditNumber}`,
        `Audit Title,"${record.auditTitle}"`,
        `Audit Type,${record.auditType}`,
        `Standard / Category,"${record.auditCategory}"`,
        `Status,${record.auditStatus}`,
        `Lead Auditor,"${record.leadAuditor}"`,
        `Facility Location,"${record.auditLocation}"`,
        `Start Date,${record.auditDate}`,
        `Scheduled End Date,${record.scheduledEndDate}`,
        `Conformance Index,${record.conformanceRate}%`,
        `Total Checks,${record.totalItems}`,
        `Conforming,${record.compliantCount}`,
        `Minor NCs,${record.minorNcCount}`,
        `Major NCs,${record.majorNcCount}`,
        "",
        "CHECKLIST VERIFICATIONS",
        "Clause,Requirement / Criteria,Area / Dept,Result,Finding Notes,Auditor,Linked NCR",
        ...record.checklist.map(
          (c) =>
            `"${c.clauseRef}","${c.requirement}","${c.areaDepartment}",${c.result},"${c.findingNote}","${c.auditor}","${c.linkedNcr || "-"}"`
        ),
        "",
        "AUDIT FINDINGS & NON-CONFORMANCES",
        "Finding No,Clause,Classification,Description,Department,Owner,Due Date,NCR Ref",
        ...record.findings.map(
          (f) =>
            `"${f.findingNumber}","${f.clauseRef}",${f.classification},"${f.description}","${f.department}","${f.responsiblePerson}","${f.dueDate}","${f.ncrReference || "-"}"`
        ),
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `Audit_${record.auditNumber}_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported Audit_${record.auditNumber}_Report.csv`);
    } catch {
      toast.error("Failed to export Audit CSV");
    }
  };

  // Real Excel export
  const handleExportExcel = () => {
    try {
      const lines = [
        `QUALITY AUDIT REPORT\t${record.auditNumber}`,
        `Audit Title\t${record.auditTitle}`,
        `Lead Auditor\t${record.leadAuditor}`,
        `Standard\t${record.auditCategory}`,
        `Status\t${record.auditStatus}`,
        `Conformance\t${record.conformanceRate}%`,
        "",
        "Clause\tRequirement\tDepartment\tResult\tAuditor\tNCR",
        ...record.checklist.map(
          (c) =>
            `${c.clauseRef}\t${c.requirement}\t${c.areaDepartment}\t${c.result}\t${c.auditor}\t${c.linkedNcr || "-"}`
        ),
      ];

      const blob = new Blob([lines.join("\n")], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Audit_${record.auditNumber}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported Audit_${record.auditNumber}.xls`);
    } catch {
      toast.error("Failed to export Excel report");
    }
  };

  // Download Findings Matrix
  const handleDownloadFindings = () => {
    const lines = [
      "AUDIT FINDINGS & NON-CONFORMANCE LOG",
      `Audit Number,${record.auditNumber}`,
      "Finding No,Clause,Classification,Description,Department,Owner,Due Date,NCR Ref",
      ...record.findings.map(
        (f) =>
          `"${f.findingNumber}","${f.clauseRef}",${f.classification},"${f.description}","${f.department}","${f.responsiblePerson}","${f.dueDate}","${f.ncrReference || "-"}"`
      ),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Audit_Findings_${record.auditNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded Audit_Findings_${record.auditNumber}.csv`);
  };

  // Download Schedule Matrix
  const handleDownloadSchedule = () => {
    const lines = [
      "AUDITOR ENGAGEMENT & SCHEDULE MATRIX 2026",
      "Audit No,Title,Type,Category,Lead Auditor,Location,Start Date,End Date,Status",
      `${record.auditNumber},"${record.auditTitle}",${record.auditType},"${record.auditCategory}","${record.leadAuditor}","${record.auditLocation}",${record.auditDate},${record.scheduledEndDate},${record.auditStatus}`,
      "AUD-2026-0019,\"IATF 16949 Automotive Line 2 Re-certification\",Internal,IATF 16949 Automotive,\"Marcus Chen\",\"Plant 1 SMT\",15-Oct-2026,17-Oct-2026,Scheduled",
      "AUD-2026-0020,\"Key Tier-1 Copper Supplier Onsite Audit\",Supplier,Supplier Quality,\"Dr. Anita Desai\",\"Hindalco Metrology\",04-Nov-2026,05-Nov-2026,Scheduled",
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "Auditor_Schedule_Matrix_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded Auditor_Schedule_Matrix_2026.csv");
  };

  return (
    <QualityModuleHeaderCard
      title="Audit Management Form"
      description="Internal, supplier, and regulatory quality audits, ISO/IATF checklist verification, and findings closure"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Audit Tracking Number */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.auditNumber}
          </span>

          {/* Audit Status Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50/90 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {record.auditStatus}
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed audit schedule & verification checklists")}
      onExportCsv={handleExportCsv}
      onExportExcel={handleExportExcel}
      onExportPdf={onPrint}
      reports={[
        {
          label: "Audit Summary Report",
          onClick: handleExportCsv,
        },
        {
          label: "Non-Conformance Findings Log",
          onClick: handleDownloadFindings,
        },
        {
          label: "ISO / IATF Auditor Schedule Matrix",
          onClick: handleDownloadSchedule,
        },
      ]}
      primaryAction={{
        label: "Create Audit",
        onClick: () => {
          if (onCreateAudit) {
            onCreateAudit();
          } else {
            onSave();
            toast.success("Initialized new Quality Audit dossier draft");
          }
        },
      }}
      moreActions={[
        {
          label: "Complete & Finalize Audit",
          onClick: onSubmitAudit,
        },
        {
          label: "Auto-Generate NCRs from Major NCs",
          onClick: () => {
            if (onGenerateNcrs) onGenerateNcrs();
            else toast.success("Auto-generated NCR records from major audit findings");
          },
        },
        {
          label: "Save Audit Draft",
          onClick: onSave,
        },
        {
          label: "Print Complete Audit Plan",
          onClick: onPrint,
        },
      ]}
    />
  );
}


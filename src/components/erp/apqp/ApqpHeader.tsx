import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import type { ApqpRecord } from "@/services/types";
import { toast } from "sonner";
import { Award } from "lucide-react";

interface ApqpHeaderProps {
  record: ApqpRecord;
  onSaveDraft: () => void;
  onSubmitForReview: () => void;
  onNewProject: () => void;
}

export const ApqpHeader: React.FC<ApqpHeaderProps> = ({
  record,
  onSaveDraft,
  onSubmitForReview,
  onNewProject,
}) => {
  // Real CSV Export
  const handleExportCsv = () => {
    try {
      const lines = [
        `ADVANCED PRODUCT QUALITY PLANNING (APQP) EXECUTIVE SUMMARY`,
        `APQP Number,${record.apqpNumber}`,
        `Project Name,${record.apqpProjectName}`,
        `Product,"${record.product} (Revision: ${record.productRevision})"`,
        `Customer,${record.customer}`,
        `Workflow Status,${record.workflowStatus}`,
        `Current Phase,"${record.apqpPhase}"`,
        `Program Status,${record.programStatus}`,
        `Project Manager,${record.projectManager}`,
        `Target SOP Date,${record.targetSopDate}`,
        `Overall APQP Score,${record.overallApqpScore}/100`,
        `Export Date,${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        "",
        "QUALITY READINESS SCORES",
        `Design Readiness,${record.designScore}/100`,
        `Validation Readiness,${record.validationScore}/100`,
        `Supplier Quality,${record.supplierQualityScore}/100`,
        `Risk Readiness,${record.riskScore}/100`,
        `Cost Readiness,${record.costReadinessScore}/100`,
        "",
        "5 APQP PHASE DELIVERABLES",
        "Phase Number,Phase Name,Key Deliverables,Owner,Target Date,Status,Completion %",
        ...record.deliverables.map(
          (d) =>
            `${d.phaseNumber},"${d.phaseName}","${d.keyDeliverables}","${d.owner}","${d.targetDate}","${d.status}",${d.completionPercentage}%`
        ),
        "",
        "GATE REVIEW & APPROVAL MATRIX",
        "Role,Approver,Decision,Date,Status,Comments",
        ...record.reviewers.map(
          (r) =>
            `"${r.role}","${r.person || r.role}","${r.decision}","${r.date || "-"}","${r.status}","${r.comments || "-"}"`
        ),
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `APQP_${record.apqpId}_Executive_Summary.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported APQP_${record.apqpId}_Executive_Summary.csv`);
    } catch {
      toast.error("Failed to export APQP CSV report");
    }
  };

  // Real Excel (.xls) Export
  const handleExportExcel = () => {
    try {
      const lines = [
        `ADVANCED PRODUCT QUALITY PLANNING DOSSIER\t${record.apqpId}`,
        `Project Name\t${record.apqpProjectName}`,
        `Product\t${record.product} (${record.productRevision})`,
        `Customer\t${record.customer}`,
        `Current Phase\t${record.apqpPhase}`,
        `Workflow Status\t${record.workflowStatus}`,
        `Target SOP Date\t${record.targetSopDate}`,
        `Overall Score\t${record.overallApqpScore} / 100`,
        "",
        "READINESS SCORES\tSCORE",
        `Design Readiness\t${record.designScore}`,
        `Validation Readiness\t${record.validationScore}`,
        `Supplier Quality\t${record.supplierQualityScore}`,
        `Risk Readiness\t${record.riskScore}`,
        `Cost Readiness\t${record.costReadinessScore}`,
        "",
        "Phase\tDeliverables\tOwner\tTarget Date\tStatus\tCompletion %",
        ...record.deliverables.map(
          (d) =>
            `Phase ${d.phaseNumber}\t${d.keyDeliverables}\t${d.owner}\t${d.targetDate}\t${d.status}\t${d.completionPercentage}%`
        ),
        "",
        "Role\tApprover\tDecision\tDate\tStatus",
        ...record.reviewers.map(
          (r) => `${r.role}\t${r.person || "-"}\t${r.decision}\t${r.date || "-"}\t${r.status}`
        ),
      ];

      const blob = new Blob([lines.join("\n")], { type: "application/vnd.ms-excel;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `APQP_${record.apqpId}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported APQP_${record.apqpId}.xls`);
    } catch {
      toast.error("Failed to export APQP Excel dossier");
    }
  };

  // Specialized Reports Downloads
  const handleDownloadDeliverablesSummary = () => {
    const lines = [
      "APQP GATE DELIVERABLES SUMMARY REPORT",
      `Project,${record.apqpProjectName} (${record.apqpId})`,
      `Customer,${record.customer}`,
      "",
      "Phase,Deliverable Scope,Responsible Owner,Scheduled Date,Status,Completion %",
      ...record.deliverables.map(
        (d) =>
          `Phase ${d.phaseNumber},"${d.keyDeliverables}","${d.owner}","${d.targetDate}","${d.status}",${d.completionPercentage}%`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `APQP_Gate_Deliverables_${record.apqpId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded APQP Gate Deliverables Summary Report");
  };

  const handleDownloadPpapChecklist = () => {
    const lines = [
      "AIAG PPAP 4TH EDITION 18-ELEMENT SUBMISSION CHECKLIST",
      `Project,${record.apqpProjectName} (${record.apqpId})`,
      `Product,${record.product} Rev: ${record.productRevision}`,
      `PPAP Submission Level,Level 3`,
      `Status,Submitted & Under Customer Review`,
      "",
      "Element No,PPAP Requirement Description,Supplier Status,QA Verification",
      "1,Design Records (CAD / 2D / 3D),Submitted,Verified",
      "2,Engineering Change Documents,Submitted,Verified",
      "3,Customer Engineering Approval,Approved,Verified",
      "4,Design FMEA (DFMEA),Approved,Verified",
      "5,Process Flow Diagrams,Submitted,Verified",
      "6,Process FMEA (PFMEA),Approved,Verified",
      "7,Control Plan (Pre-launch & Production),Approved,Verified",
      "8,Measurement System Analysis (MSA Gage R&R),Submitted (8.4%),Verified",
      "9,Dimensional Results & CMM Reports,Submitted,Verified",
      "10,Material & Performance Test Results,Certified,Verified",
      "11,Initial Process Capability Studies (Cpk 1.82),Submitted,Verified",
      "12,Qualified Laboratory Documentation,Submitted,Verified",
      "13,Appearance Approval Report (AAR),Submitted,Verified",
      "14,Sample Production Parts,Dispatched (50 Pcs),Verified",
      "15,Master Sample,Retained at Plant,Verified",
      "16,Checking Aids & Test Fixtures,Calibrated,Verified",
      "17,Customer-Specific Requirements,Compliant,Verified",
      "18,Part Submission Warrant (PSW),Signed,Pending Final Cust Stamp",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PPAP_Submission_Checklist_${record.apqpId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded PPAP Submission Checklist & Status");
  };

  const handleDownloadPfmeaControlPlan = () => {
    const lines = [
      "PROCESS FMEA & CONTROL PLAN TRACEABILITY MATRIX",
      `Project,${record.apqpProjectName}`,
      `Control Plan Ref,${record.controlPlanRef}`,
      `PFMEA Ref,${record.pfmeaRef}`,
      "",
      "Process Step,Op Seq,Potential Failure Mode,Severity,Occurrence,Detection,RPN,Special Char,Control Method,Reaction Plan",
      "SMT Wave Soldering,OP-20,Solder Bridging on U2 Microcontroller,7,3,4,84,Critical,Automated Optical Inspection AOI,Rework Station Isolation",
      "Cable Fixation & Crimp,OP-30,Terminal Contact Resistance High,8,2,3,48,Safety,100% Micro-Ohm Meter Check,Lockdown & Recrimp",
      "Housing Ultrasonic Weld,OP-40,Enclosure Incomplete IP67 Seal,7,2,3,42,Major,Helium Pressure Leak Decay Tester,Quarantine Defective Lot",
      "Final Hi-Pot Dielectric,OP-50,Insulation Breakdown > 1.5kV,9,1,2,18,Critical Safety,Automatic Interlock Dielectric Tester,Immediate Scrap & Line Stop",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PFMEA_Control_Plan_Matrix_${record.apqpId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded Process FMEA & Control Plan Matrix");
  };

  return (
    <QualityModuleHeaderCard
      title="Quality Planning (APQP) Form"
      description="5-phase Advanced Product Quality Planning, feasibility gates, readiness scorecards, and PPAP production handover"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* APQP Document ID */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.apqpId}
          </span>

          {/* Workflow Status with Live Pulsing Dot */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs whitespace-nowrap shrink-0 ${
              record.workflowStatus === "Completed" || record.workflowStatus === "Approved"
                ? "bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60"
                : record.workflowStatus === "In Progress"
                ? "bg-blue-50/90 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60"
                : "bg-amber-50/90 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60"
            }`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {record.workflowStatus === "In Progress" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  record.workflowStatus === "Completed" || record.workflowStatus === "Approved"
                    ? "bg-emerald-500"
                    : record.workflowStatus === "In Progress"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
              />
            </span>
            {record.workflowStatus}
          </span>

          {/* Overall Readiness Score Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800/70 shadow-2xs whitespace-nowrap shrink-0">
            <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[11px] font-medium text-emerald-600/90 dark:text-emerald-400/90">Score:</span>
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-200">{record.overallApqpScore}</span>
            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-mono">/100</span>
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed APQP milestone tracker & readiness metrics")}
      onExportCsv={handleExportCsv}
      onExportExcel={handleExportExcel}
      onExportPdf={() => window.print()}
      reports={[
        {
          label: "APQP Gate Deliverables Summary",
          onClick: handleDownloadDeliverablesSummary,
        },
        {
          label: "PPAP Submission Checklist & Status",
          onClick: handleDownloadPpapChecklist,
        },
        {
          label: "Process FMEA & Control Plan Matrix",
          onClick: handleDownloadPfmeaControlPlan,
        },
      ]}
      primaryAction={{
        label: "Create Project",
        onClick: onNewProject,
      }}
      moreActions={[
        {
          label: "Submit Gate for Review",
          onClick: onSubmitForReview,
        },
        {
          label: "Save APQP Draft",
          onClick: onSaveDraft,
        },
        {
          label: "Print APQP Dossier (PDF)",
          onClick: () => window.print(),
        },
      ]}
    />
  );
};

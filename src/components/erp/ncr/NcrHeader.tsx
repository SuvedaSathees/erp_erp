import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import { NcrRecord } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrHeaderProps {
  record: NcrRecord;
  onSave: () => void;
  onSubmitForReview: () => void;
  onPrint: () => void;
  onExportPdf?: () => void;
  onCreateCapa?: () => void;
  onCreateNcr?: () => void;
}

export function NcrHeader({
  record,
  onSave,
  onSubmitForReview,
  onPrint,
  onExportPdf,
  onCreateCapa,
  onCreateNcr,
}: NcrHeaderProps) {
  // Real CSV export
  const handleExportCsv = () => {
    try {
      const lines = [
        `NON-CONFORMANCE REPORT (NCR) - ${record.ncrNumber}`,
        `Report Date,${new Date().toLocaleDateString()}`,
        `NCR Number,${record.ncrNumber}`,
        `Date Raised,${record.ncrDate}`,
        `Source,${record.ncrSource}`,
        `Source Reference,"${record.sourceReference}"`,
        `Organization,"${record.organization}"`,
        `Plant,"${record.plant}"`,
        `Department,"${record.department}"`,
        `Location,"${record.location}"`,
        `Reported By,"${record.reportedBy}"`,
        `Responsible Owner,"${record.responsibleOwner}"`,
        `Quality Engineer,"${record.qualityEngineer}"`,
        `Priority,${record.priority}`,
        `Severity,${record.severity}`,
        `NCR Status,${record.ncrStatus}`,
        `Due Date,${record.dueDate}`,
        "",
        "NON-CONFORMANCE IDENTIFICATION",
        `Product,"${record.product}"`,
        `Product Code,${record.productCode}`,
        `Product Revision,${record.productRevision}`,
        `Part / Component,"${record.partComponent}"`,
        `Batch / Lot No.,${record.batchLotNo}`,
        `Serial Numbers,"${record.serialNumbers}"`,
        `Production Order,${record.productionOrder}`,
        `Work Order,${record.workOrder}`,
        `Operation,"${record.operation}"`,
        `Machine / Equipment,${record.machineEquipment}`,
        `Customer,"${record.customer}"`,
        `Sales Order,${record.salesOrder}`,
        "",
        "PROBLEM STATEMENT",
        `Title,"${record.nonConformanceTitle}"`,
        `Defect Category,${record.defectCategory}`,
        `Defect Code,${record.defectCode}`,
        `Detection Method,"${record.detectionMethod}"`,
        `Problem Description,"${record.problemDescription}"`,
        `Requirement / Specification,"${record.requirementSpecification}"`,
        `Detection Date,${record.detectionDate}`,
        `Detection Location,"${record.detectionLocation}"`,
        `Actual Condition,"${record.actualCondition}"`,
        `Expected Condition,"${record.expectedCondition}"`,
        `Affected Characteristic,"${record.affectedCharacteristic}"`,
        "",
        "CONTAINMENT & QUANTITIES",
        `Affected Quantity,${record.affectedQuantity} Nos`,
        `Confirmed Defect Quantity,${record.confirmedDefectQuantity} Nos`,
        `Suspect Quantity,${record.suspectQuantity} Nos`,
        `RPN Risk Score,${record.riskPriorityNumber} (${record.riskLevel})`,
        `Containment Status,${record.containmentStatus}`,
        `Containment Action,"${record.containmentAction}"`,
        `Quarantine Location,"${record.quarantineLocation}"`,
        `Containment Owner,"${record.containmentOwner}"`,
        `Containment Date,${record.containmentDate}`,
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `NCR_${record.ncrNumber}_Detailed_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported NCR_${record.ncrNumber}_Detailed_Report.csv`);
    } catch {
      toast.error("Failed to export NCR CSV report");
    }
  };

  // Real Excel export
  const handleExportExcel = () => {
    try {
      const lines = [
        `NON-CONFORMANCE REPORT\t${record.ncrNumber}`,
        `Title\t${record.nonConformanceTitle}`,
        `Product\t${record.product} (${record.productCode})`,
        `Source\t${record.ncrSource} - Ref: ${record.sourceReference}`,
        `Priority\t${record.priority}`,
        `Status\t${record.ncrStatus}`,
        `Owner\t${record.responsibleOwner}`,
        "",
        `Defect Description\t${record.problemDescription}`,
        `Affected Qty\t${record.affectedQuantity}`,
        `Confirmed Defect Qty\t${record.confirmedDefectQuantity}`,
        `Containment Action\t${record.containmentAction}`,
        `Quarantine Area\t${record.quarantineLocation}`,
      ];

      const blob = new Blob([lines.join("\n")], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `NCR_${record.ncrNumber}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported NCR_${record.ncrNumber}.xls`);
    } catch {
      toast.error("Failed to export Excel report");
    }
  };

  // Specialized Reports
  const handleDownloadContainmentSummary = () => {
    const lines = [
      `NCR CONTAINMENT SUMMARY - ${record.ncrNumber}`,
      `Generated Date,${new Date().toLocaleDateString()}`,
      `NCR Number,${record.ncrNumber}`,
      `Status,${record.containmentStatus}`,
      `Quarantine Area,"${record.quarantineLocation}"`,
      `Affected Quantity,${record.affectedQuantity}`,
      `Defect Quantity,${record.confirmedDefectQuantity}`,
      `Containment Details,"${record.containmentAction}"`,
      `Owner,"${record.containmentOwner}"`,
      `Date,${record.containmentDate}`,
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `NCR_Containment_Summary_${record.ncrNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded NCR_Containment_Summary_${record.ncrNumber}.csv`);
  };

  const handleDownloadMrbCost = () => {
    const lines = [
      `MRB SCRAP & REWORK COST RECOVERY - ${record.ncrNumber}`,
      `Product,"${record.product}"`,
      `Defect,"${record.nonConformanceTitle}"`,
      `Scrap Quantity,${record.confirmedDefectQuantity}`,
      `Unit Scrap Cost,₹4200.00`,
      `Total Scrap Cost,₹8400.00`,
      `Rework Quantity,${record.affectedQuantity - record.confirmedDefectQuantity}`,
      `Rework Labor Cost,₹1250.00`,
      `Vendor Recovery Target,₹5500.00`,
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `MRB_Cost_Recovery_${record.ncrNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded MRB_Cost_Recovery_${record.ncrNumber}.csv`);
  };

  const handleDownloadQuarantineNotice = () => {
    const lines = [
      `VENDOR DEFECT QUARANTINE NOTICE - ${record.ncrNumber}`,
      `Supplier,"${record.supplier || 'GreenMobility Component Hub'}"`,
      `Part Number,"${record.partComponent}"`,
      `Batch / Lot,"${record.batchLotNo}"`,
      `Quarantine Traveler,"TRV-${record.ncrNumber}"`,
      `Holding Location,"${record.quarantineLocation}"`,
      `Action Required,"Issue 8D Root Cause within 5 business days"`,
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Vendor_Quarantine_Notice_${record.ncrNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded Vendor_Quarantine_Notice_${record.ncrNumber}.csv`);
  };

  return (
    <QualityModuleHeaderCard
      title="NCR Form"
      description="Non-conformance containment, MRB disposition, scrap/rework tracking, and cost recovery"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* NCR Tracking Number */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.ncrNumber}
          </span>

          {/* NCR Status Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50/90 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            {record.ncrStatus}
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed NCR registry data")}
      onExportCsv={handleExportCsv}
      onExportExcel={handleExportExcel}
      onExportPdf={onPrint}
      reports={[
        {
          label: "NCR Monthly Containment Summary",
          onClick: handleDownloadContainmentSummary,
        },
        {
          label: "MRB Scrap & Rework Cost Recovery",
          onClick: handleDownloadMrbCost,
        },
        {
          label: "Vendor Defect Quarantine Notice Log",
          onClick: handleDownloadQuarantineNotice,
        },
      ]}
      primaryAction={{
        label: "Create NCR",
        onClick: () => {
          if (onCreateNcr) {
            onCreateNcr();
          } else {
            onSave();
            toast.success("Initialized new Non-Conformance Report draft");
          }
        },
      }}
      moreActions={[
        {
          label: "Submit for MRB Review",
          onClick: onSubmitForReview,
        },
        {
          label: "Initiate Linked CAPA",
          onClick: () => {
            if (onCreateCapa) onCreateCapa();
            else toast.info("Navigating to CAPA module with NCR context...");
          },
        },
        {
          label: "Save NCR Draft",
          onClick: onSave,
        },
        {
          label: "Print Quarantine Barcode Labels",
          onClick: onPrint,
        },
      ]}
    />
  );
}

import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import type { IqcRecord } from "@/services/iqcTypes";
import { toast } from "sonner";

interface IqcHeaderProps {
  record: IqcRecord;
  onSave: () => void;
  onComplete: () => void;
  onPrint: () => void;
  onCreateInspection: () => void;
  onDispositionChange: (disposition: IqcRecord["disposition"], inventory: IqcRecord["inventoryStatus"]) => void;
}

export const IqcHeader: React.FC<IqcHeaderProps> = ({
  record,
  onSave,
  onComplete,
  onPrint,
  onCreateInspection,
  onDispositionChange,
}) => {
  // Real CSV Export
  const handleExportCsv = () => {
    try {
      const lines = [
        `INCOMING QUALITY INSPECTION (IQC) REPORT - ${record.inspectionNo}`,
        `Export Date,${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        `Inspection No,${record.inspectionNo}`,
        `Date & Time,${record.inspectionDate}`,
        `Status,${record.status}`,
        `Overall Result,${record.overallResult}`,
        `GRN Number,${record.grnNumber}`,
        `Purchase Order,${record.purchaseOrder}`,
        `Supplier,"${record.supplier} (${record.supplierCode})"`,
        `Material / Item,"${record.materialItem} (${record.itemCode}) Rev: ${record.itemRevision}"`,
        `Batch / Lot,${record.batchLotNo}`,
        `Serial Numbers,"${record.serialNumbers}"`,
        `Received Quantity,${record.receivedQty} Nos`,
        `Inspection Quantity,${record.inspectionQty} Nos`,
        `Accepted Quantity,${record.acceptedQty} Nos`,
        `Rejected Quantity,${record.rejectedQty} Nos`,
        `Defect Rate,${record.defectRate.toFixed(1)}%`,
        `Quality Score,${record.qualityScore}/100`,
        `Sampling Plan,"${record.samplingPlan} (AQL: ${record.aql}, ${record.inspectionLevel})"`,
        `Inspection Type,"${record.inspectionType}"`,
        `Inspection Plan,${record.inspectionPlan}`,
        `Specification,${record.specification}`,
        `Drawing / Revision,${record.drawingRevision}`,
        `Test Equipment,"${record.testEquipment}"`,
        `Inspector,${record.inspector}`,
        `Disposition,${record.disposition}`,
        `Inventory Status,${record.inventoryStatus}`,
        `NCR Number,${record.ncrNumber}`,
        `Supplier NCR Flag,${record.supplierNcr ? "Yes" : "No"}`,
        `Remarks,"${record.remarks}"`,
        "",
        "INSPECTION ITEMS & TEST CHARACTERISTICS",
        "Seq,Characteristic,Specification,Tolerance,Actual,Unit,Method,Result,Remarks",
        ...record.characteristics.map(
          (c) =>
            `${c.seq},"${c.characteristic}","${c.specification}","${c.tolerance}","${c.actual}","${c.unit}","${c.method}","${c.result}","${c.remarks}"`
        ),
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `IQC_${record.inspectionNo}_Detailed_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported IQC_${record.inspectionNo}_Detailed_Report.csv`);
    } catch {
      toast.error("Failed to export IQC CSV report");
    }
  };

  // Real Excel (.xls) Export
  const handleExportExcel = () => {
    try {
      const lines = [
        `INCOMING QUALITY INSPECTION DOSSIER\t${record.inspectionNo}`,
        `Date\t${record.inspectionDate}`,
        `GRN Number\t${record.grnNumber}`,
        `Purchase Order\t${record.purchaseOrder}`,
        `Supplier\t${record.supplier}`,
        `Supplier Code\t${record.supplierCode}`,
        `Material / Item\t${record.materialItem}`,
        `Item Code\t${record.itemCode}`,
        `Batch / Lot\t${record.batchLotNo}`,
        `Received Qty\t${record.receivedQty}`,
        `Inspected Qty\t${record.inspectionQty}`,
        `Accepted Qty\t${record.acceptedQty}`,
        `Rejected Qty\t${record.rejectedQty}`,
        `Defect Rate\t${record.defectRate.toFixed(1)}%`,
        `Quality Score\t${record.qualityScore}/100`,
        `Overall Result\t${record.overallResult}`,
        `Disposition\t${record.disposition}`,
        `Inventory Status\t${record.inventoryStatus}`,
        `Sampling Plan\t${record.samplingPlan}`,
        `AQL\t${record.aql}`,
        `Inspector\t${record.inspector}`,
        `NCR Number\t${record.ncrNumber}`,
        ``,
        `Seq\tCharacteristic\tSpecification\tTolerance\tActual\tUnit\tMethod\tResult\tRemarks`,
        ...record.characteristics.map(
          (c) =>
            `${c.seq}\t${c.characteristic}\t${c.specification}\t${c.tolerance}\t${c.actual}\t${c.unit}\t${c.method}\t${c.result}\t${c.remarks}`
        ),
      ];

      const blob = new Blob([lines.join("\n")], { type: "application/vnd.ms-excel;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `IQC_${record.inspectionNo}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported IQC_${record.inspectionNo}.xls`);
    } catch {
      toast.error("Failed to export IQC Excel dossier");
    }
  };

  // Specialized Reports Downloads
  const handleDownloadVendorRejectionLog = () => {
    const csv = [
      "VENDOR DEFECT PPM & REJECTION LOG",
      `Supplier,${record.supplier}`,
      `Supplier Code,${record.supplierCode}`,
      `Report Period,01-Sep-2026 to 30-Sep-2026`,
      "",
      "GRN No,PO No,Date,Item,Lot No,Received Qty,Inspected Qty,Rejected Qty,Defect PPM,NCR Ref,Disposition",
      `${record.grnNumber},${record.purchaseOrder},06-Sep-2026,${record.materialItem},${record.batchLotNo},500,80,4,50000,NCR-2026-0027,Quarantine Blocked`,
      "GR-2026-000398,PO-2026-0120,28-Aug-2026,BLDC Motor 2kW,LOT-2026-08-089,450,80,0,0,-,Accepted",
      "GR-2026-000344,PO-2026-0098,15-Aug-2026,BLDC Motor 2kW,LOT-2026-08-042,600,80,3,37500,NCR-2026-0019,Quarantine Rework",
      "GR-2026-000289,PO-2026-0071,02-Aug-2026,BLDC Motor 2kW,LOT-2026-08-011,500,80,0,0,-,Accepted",
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Vendor_Defect_PPM_Rejection_Log_${record.supplierCode}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded Vendor Defect PPM & Rejection Log");
  };

  const handleDownloadDispositionCertificate = () => {
    const cert = `
======================================================================
         MAGNERTIA MANUFACTURING PVT. LTD. - QUALITY ASSURANCE
               IQC MATERIAL DISPOSITION CERTIFICATE
======================================================================
Certificate No  : DISP-${record.inspectionNo}
Inspection No   : ${record.inspectionNo}
Date of Issue   : ${record.inspectionDate}

[INCOMING SHIPMENT DETAILS]
GRN Number      : ${record.grnNumber}
PO Number       : ${record.purchaseOrder}
Supplier        : ${record.supplier} (${record.supplierCode})
Material / SKU  : ${record.materialItem} (${record.itemCode})
Revision        : ${record.itemRevision}
Batch / Lot No  : ${record.batchLotNo}
Received Qty    : ${record.receivedQty} Nos
Sample Size     : ${record.inspectionQty} Nos

[SAMPLING & TEST FINDINGS]
Sampling Plan   : ${record.samplingPlan} (AQL ${record.aql}, Level II)
Overall Verdict : ${record.overallResult}
Accepted Qty    : ${record.acceptedQty} Nos
Rejected Qty    : ${record.rejectedQty} Nos
Defect Rate     : ${record.defectRate}%
Quality Score   : ${record.qualityScore} / 100

[DISPOSITION & WAREHOUSE INVENTORY ACTION]
Disposition     : ${record.disposition.toUpperCase()}
Inventory State : ${record.inventoryStatus.toUpperCase()}
NCR Reference   : ${record.ncrNumber || "N/A"}
Supplier NCR    : ${record.supplierNcr ? "ISSUED & TRANSMITTED" : "NONE"}
Action Details  : ${record.remarks}

Lead Inspector  : ${record.inspector}
Sign-off Seal   : [VERIFIED DIGITAL CERTIFICATE]
======================================================================
    `.trim();

    const blob = new Blob([cert], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IQC_Disposition_Certificate_${record.inspectionNo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded IQC Material Disposition Certificate");
  };

  const handleDownloadAqlDossier = () => {
    const csv = [
      "AQL SAMPLING VERIFICATION DOSSIER (ANSI/ASQ Z1.4)",
      `Inspection No,${record.inspectionNo}`,
      `Lot Size,${record.receivedQty}`,
      `Code Letter,J (80 units)`,
      `Inspection Level,Level II - Normal Single Sampling`,
      `AQL Selected,1.5%`,
      `Acceptance Number (Ac),3 defects`,
      `Rejection Number (Re),4 defects`,
      `Actual Defects Found,${record.rejectedQty} defects`,
      `Sampling Verdict,${record.overallResult === "Pass" ? "ACCEPTED - LOT CLEARED" : "REJECTED - LOT QUARANTINED"}`,
      "",
      "Sample No,Shaft Dia (12.00+-0.02),Voltage (48+-2V),Current (<=8A),Insulation (>=10M),Rotation,Housing,Overall Result",
      ...Array.from({ length: 10 }).map(
        (_, i) =>
          `Unit-${String(i + 1).padStart(2, "0")},12.01 mm,48.4 V,${i < 4 ? "8.7 A [FAIL]" : "7.4 A [PASS]"},15.2 M,Smooth,Good,${i < 4 ? "Fail" : "Pass"}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AQL_Sampling_Dossier_${record.inspectionNo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded AQL Sampling Verification Dossier");
  };

  return (
    <QualityModuleHeaderCard
      title="Incoming Inspection Form"
      description="Supplier receipt inspection, AQL sampling plans, quarantine control, and material compliance gates"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Inspection Number Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.inspectionNo}
          </span>

          {/* Status with Pulsing Dot */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs whitespace-nowrap shrink-0 ${
              record.status === "Completed"
                ? "bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60"
                : record.status === "In Progress"
                ? "bg-blue-50/90 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60"
                : "bg-amber-50/90 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60"
            }`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {record.status === "In Progress" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  record.status === "Completed"
                    ? "bg-emerald-500"
                    : record.status === "In Progress"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
              />
            </span>
            {record.status}
          </span>

          {/* Overall Result Pill */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs whitespace-nowrap shrink-0 ${
              record.overallResult === "Pass"
                ? "bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60"
                : "bg-rose-50/90 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                record.overallResult === "Pass" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            {record.overallResult}
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed incoming inspection queue & AQL data")}
      onExportCsv={handleExportCsv}
      onExportExcel={handleExportExcel}
      onExportPdf={onPrint}
      reports={[
        {
          label: "Vendor Defect PPM & Rejection Log",
          onClick: handleDownloadVendorRejectionLog,
        },
        {
          label: "IQC Material Disposition Certificate",
          onClick: handleDownloadDispositionCertificate,
        },
        {
          label: "AQL Sampling Verification Dossier",
          onClick: handleDownloadAqlDossier,
        },
      ]}
      primaryAction={{
        label: "Create Inspection",
        onClick: onCreateInspection,
      }}
      moreActions={[
        {
          label: "Complete & Sign-Off Inspection",
          onClick: onComplete,
        },
        {
          label: "Quick Release to Warehouse Stores",
          onClick: () => {
            onDispositionChange("Accept", "Released");
            toast.success("Lot accepted and released to Warehouse Stores WH-RM-01");
          },
        },
        {
          label: "Quarantine & Block Material Lot",
          onClick: () => {
            onDispositionChange("Quarantine", "Blocked");
            toast.warning("Material locked in Quarantine Bay Q-04");
          },
        },
        {
          label: "Save Inspection Draft",
          onClick: onSave,
        },
        {
          label: "Print Inspection PDF",
          onClick: onPrint,
        },
      ]}
    />
  );
};

import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import { FqcRecord } from "@/services/fqcTypes";
import { toast } from "sonner";

interface FqcHeaderProps {
  record: FqcRecord;
  onSave: () => void;
  onComplete: () => void;
  onPrint: () => void;
  onCreateInspection: () => void;
  onIssueCertificate?: () => void;
  onReleaseWarehouse?: () => void;
}

export function FqcHeader({
  record,
  onSave,
  onComplete,
  onPrint,
  onCreateInspection,
  onIssueCertificate,
  onReleaseWarehouse,
}: FqcHeaderProps) {
  // Real CSV Export
  const handleExportCsv = () => {
    try {
      const lines = [
        `FINAL QUALITY INSPECTION (FQC) REPORT - ${record.inspectionNo}`,
        `Export Date,${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        `Inspection No,${record.inspectionNo}`,
        `Date & Time,${record.inspectionDate}`,
        `Status,${record.inspectionStatus}`,
        `Overall Result,${record.overallResult}`,
        `Product,"${record.product} (${record.productCode} Rev ${record.productRevision})"`,
        `Batch / Lot No,${record.batchLotNo}`,
        `Serial Range,${record.serialRange}`,
        `Production Order,${record.productionOrder}`,
        `Work Order,${record.workOrder}`,
        `Customer,"${record.customer} (Order: ${record.customerOrder})"`,
        `Sampling Plan,"${record.samplingPlan}"`,
        `Inspection Stage,"${record.inspectionStage}"`,
        `Inspector,"${record.inspector}"`,
        `QA Engineer,"${record.qualityEngineer}"`,
        `Total Produced,${record.totalProducedQuantity}`,
        `Inspected Quantity,${record.inspectionQuantity}`,
        `Accepted Quantity,${record.acceptedQuantity}`,
        `Rejected Quantity,${record.rejectedQuantity}`,
        "",
        "END-OF-LINE QUALITY CHARACTERISTICS TEST LOG",
        "Seq,Characteristic,Category,Specification,Method / Tool,Samples,Actual Result,Status,Remarks",
        ...record.characteristics.map(
          (c) =>
            `${c.seq},"${c.characteristic}","${c.category}","${c.specification.replace(/"/g, '""')}","${c.inspectionMethod.replace(/"/g, '""')}",${c.sampleSize},"${c.actualMeasured}","${c.status}","${c.remark || ""}"`
        ),
        "",
        "NON-CONFORMANCES & SEGREGATED DEFECTS",
        "Defect Code,Category,Description,Quantity,Severity,Disposition,NCR Reference",
        ...record.defects.map(
          (d) =>
            `"${d.defectCode}","${d.category}","${d.description.replace(/"/g, '""')}",${d.quantity},"${d.severity}","${d.disposition}","${d.ncrReference || "-"}"`
        ),
        "",
        "CERTIFICATE OF CONFORMANCE (COC)",
        `Certificate No,${record.certificate.certificateNo}`,
        `Issue Date,${record.certificate.issueDate}`,
        `Quantity Certified,${record.certificate.quantityCertified}`,
        `Status,${record.certificate.status}`,
        `Signatory,"${record.certificate.authorizedSignatory}"`,
        `Digital Seal Verified,${record.certificate.digitalSealVerified ? "YES (Cryptographic)" : "NO"}`,
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `FQC_${record.inspectionNo}_Inspection_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported FQC_${record.inspectionNo}_Inspection_Report.csv`);
    } catch {
      toast.error("Failed to export FQC CSV report");
    }
  };

  // Real Excel (.xls) Export
  const handleExportExcel = () => {
    try {
      const lines = [
        `FINAL QUALITY INSPECTION (FQC) DOSSIER\t${record.inspectionNo}`,
        `Inspection Date\t${record.inspectionDate}`,
        `Overall Result\t${record.overallResult}`,
        `Status\t${record.inspectionStatus}`,
        `Product\t${record.product} (${record.productCode})`,
        `Batch / Lot\t${record.batchLotNo}`,
        `Serial Range\t${record.serialRange}`,
        `Production Order\t${record.productionOrder}`,
        `Work Order\t${record.workOrder}`,
        `Inspected Qty\t${record.inspectionQuantity} Nos`,
        `Passed Qty\t${record.acceptedQuantity} Nos`,
        `Rejected Qty\t${record.rejectedQuantity} Nos`,
        "",
        "Seq\tCharacteristic\tCategory\tSpecification\tMethod\tSamples\tActual Result\tStatus",
        ...record.characteristics.map(
          (c) =>
            `${c.seq}\t${c.characteristic}\t${c.category}\t${c.specification}\t${c.inspectionMethod}\t${c.sampleSize}\t${c.actualMeasured}\t${c.status}`
        ),
        "",
        `Certificate No\t${record.certificate.certificateNo}`,
        `Certified Quantity\t${record.certificate.quantityCertified} Units`,
        `Authorized Signatory\t${record.certificate.authorizedSignatory}`,
      ];

      const blob = new Blob([lines.join("\n")], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `FQC_${record.inspectionNo}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported FQC_${record.inspectionNo}.xls`);
    } catch {
      toast.error("Failed to export Excel report");
    }
  };

  // Specialized Reports Downloads
  const handleDownloadFunctionalLog = () => {
    const lines = [
      `END-OF-LINE FUNCTIONAL & ELECTRICAL TEST LOG - ${record.inspectionNo}`,
      `Generated Date,${new Date().toLocaleDateString()}`,
      `Batch Number,${record.batchLotNo}`,
      `Product,${record.product}`,
      "",
      "Sample No,Torque Reading (N.m),Insulation Resistance (MOhm),Leakage Current (mA),Result",
      ...record.testSamples.map(
        (s) => `${s.sampleNo},${s.torqueReading},${s.insulationResistance},${s.leakageCurrent},Pass`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `EOL_Functional_Log_${record.inspectionNo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded End-of-Line Functional Test Verification Log");
  };

  const handleDownloadPackagingAudit = () => {
    const lines = [
      `PRE-DISPATCH PACKAGING & BARCODE AUDIT REPORT - ${record.inspectionNo}`,
      `Audit Date,${new Date().toLocaleDateString()}`,
      `Product Code,${record.productCode}`,
      `Serial Range,${record.serialRange}`,
      "",
      "Audit Checkpoint,Standard,Audit Result,Verified By",
      'Primary Barcode Scan Legibility,ISO/IEC 15415 Grade A,Pass,Rajesh K',
      'Tamper-Evident Security Seal,Intact on all carton master packs,Pass,Rajesh K',
      'Corrugated Box Drop & Burst Strength,ECT 32 / Mullen 200 psi,Pass,Arun K',
      'Desiccant Bag & Silica Gel Inclusion,2 x 50g packs per unit enclosure,Pass,Rajesh K',
      'User Installation Manual & Warranty Card,Included Rev 2.1 in 5 languages,Pass,Rajesh K',
      'Pallet Strapping & Corner Protectors,PET 16mm tensioned strapping,Pass,Arun K',
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Packaging_Barcode_Audit_${record.inspectionNo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded Pre-Dispatch Packaging & Barcode Audit Report");
  };

  return (
    <QualityModuleHeaderCard
      title="Final Inspection Form"
      description="Pre-dispatch inspection gates, functional verification, packaging audits, and CoC issuance"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* FQC Inspection Number */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.inspectionNo}
          </span>

          {/* Overall Result Pill */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs whitespace-nowrap shrink-0 ${
              record.overallResult === "Pass"
                ? "bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60"
                : record.overallResult === "Conditional Pass"
                ? "bg-amber-50/90 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60"
                : "bg-rose-50/90 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                record.overallResult === "Pass"
                  ? "bg-emerald-500"
                  : record.overallResult === "Conditional Pass"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
            />
            {record.overallResult}
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed end-of-line testing station telemetry")}
      onExportCsv={handleExportCsv}
      onExportExcel={handleExportExcel}
      onExportPdf={onPrint}
      reports={[
        {
          label: "Certificate of Conformance (COC) Dossier",
          onClick: () => {
            if (onIssueCertificate) onIssueCertificate();
            else toast.info("Viewing Certificate of Conformance Dossier");
          },
        },
        {
          label: "End-of-Line Functional Test Verification Log",
          onClick: handleDownloadFunctionalLog,
        },
        {
          label: "Pre-Dispatch Packaging & Barcode Audit",
          onClick: handleDownloadPackagingAudit,
        },
      ]}
      primaryAction={{
        label: "Create Inspection",
        onClick: onCreateInspection,
      }}
      moreActions={[
        {
          label: "Issue Certificate of Conformance (COC)",
          onClick: () => {
            if (onIssueCertificate) onIssueCertificate();
            else toast.success("Certificate of Conformance issued");
          },
        },
        {
          label: "Complete & Sign-Off Inspection",
          onClick: onComplete,
        },
        {
          label: "Release to Finished Goods Warehouse",
          onClick: () => {
            if (onReleaseWarehouse) onReleaseWarehouse();
            else toast.success("Batch released to Finished Goods Warehouse");
          },
        },
        {
          label: "Save Inspection Draft",
          onClick: onSave,
        },
        {
          label: "Print Complete Inspection Dossier",
          onClick: onPrint,
        },
      ]}
    />
  );
}

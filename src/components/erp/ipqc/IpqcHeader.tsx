import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import type { IpqcRecord } from "@/services/ipqcTypes";
import { toast } from "sonner";

interface IpqcHeaderProps {
  record: IpqcRecord;
  onSave: () => void;
  onComplete: () => void;
  onPrint: () => void;
  onCreateInspection: () => void;
}

export const IpqcHeader: React.FC<IpqcHeaderProps> = ({
  record,
  onSave,
  onComplete,
  onPrint,
  onCreateInspection,
}) => {
  // Real CSV Export
  const handleExportCsv = () => {
    try {
      const lines = [
        `IN-PROCESS QUALITY INSPECTION (IPQC) REPORT - ${record.inspectionNo}`,
        `Export Date,${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        `Inspection No,${record.inspectionNo}`,
        `Date & Time,${record.inspectionDate}`,
        `Status,${record.inspectionStatus}`,
        `Overall Result,${record.overallResult}`,
        `Product,"${record.product} (${record.productCode})"`,
        `Operation,"${record.operationNo} - ${record.operationName}"`,
        `Work Center,"${record.workCenter}"`,
        `Machine,"${record.machineEquipment}"`,
        `Shift,"${record.shift}"`,
        `Operator,"${record.operator}"`,
        `Inspector,"${record.inspector}"`,
        `Production Order,${record.productionOrder}`,
        `Work Order,${record.workOrder}`,
        `Batch / Lot,${record.batchLotNo}`,
        `Job Card,${record.jobCard}`,
        `Inspected Quantity,${record.inspectionQuantity}`,
        `Accepted Quantity,${record.acceptedQuantity}`,
        `Rejected Quantity,${record.rejectedQuantity}`,
        `Defect Rate,${record.defectRate.toFixed(1)}%`,
        `Process Capability Cpk,${record.processCapabilityCpk.toFixed(2)}`,
        `First Pass Yield,${record.firstPassYield.toFixed(1)}%`,
        "",
        "IN-PROCESS QUALITY CHARACTERISTICS RESULTS",
        "Seq,Characteristic,Specification,Tolerance,Actual,Unit,Method,Result,Remarks",
        ...record.characteristics.map(
          (c) =>
            `${c.seq},"${c.characteristic}","${c.specification}","${c.tolerance}","${c.actual}","${c.unit}","${c.method}","${c.result}","${c.remarks}"`
        ),
        "",
        "PROCESS PARAMETERS MONITORING",
        "Parameter,Specification,LSL,Target,USL,Actual,Unit,Result",
        ...record.parameters.map(
          (p) =>
            `"${p.parameter}","${p.specification}",${p.lowerLimit},${p.target},${p.upperLimit},${p.actual},"${p.unit}","${p.result}"`
        ),
        "",
        "DEFECT REGISTER & NON-CONFORMANCES",
        "Code,Description,Severity,Quantity,Category,Suspected Cause,Action Taken",
        ...record.defects.map(
          (d) =>
            `"${d.defectCode}","${d.description}","${d.severity}",${d.quantity},"${d.category}","${d.suspectedCause}","${d.actionTaken}"`
        ),
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `IPQC_${record.inspectionNo}_Detailed_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported IPQC_${record.inspectionNo}_Detailed_Report.csv`);
    } catch {
      toast.error("Failed to export IPQC CSV report");
    }
  };

  // Real Excel (.xls) Export
  const handleExportExcel = () => {
    try {
      const lines = [
        `IN-PROCESS QUALITY INSPECTION DOSSIER\t${record.inspectionNo}`,
        `Inspection Date\t${record.inspectionDate}`,
        `Operation\t${record.operationNo} - ${record.operationName}`,
        `Work Center\t${record.workCenter}`,
        `Product\t${record.product} (${record.productCode})`,
        `Batch / Lot\t${record.batchLotNo}`,
        `Work Order\t${record.workOrder}`,
        `Status\t${record.inspectionStatus}`,
        `Overall Result\t${record.overallResult}`,
        `Cpk\t${record.processCapabilityCpk.toFixed(2)}`,
        `Inspected Qty\t${record.inspectionQuantity}`,
        `Passed Qty\t${record.acceptedQuantity}`,
        `Rejected Qty\t${record.rejectedQuantity}`,
        "",
        "Seq\tCharacteristic\tSpecification\tTolerance\tActual\tUnit\tMethod\tResult\tRemarks",
        ...record.characteristics.map(
          (c) =>
            `${c.seq}\t${c.characteristic}\t${c.specification}\t${c.tolerance}\t${c.actual}\t${c.unit}\t${c.method}\t${c.result}\t${c.remarks}`
        ),
      ];

      const blob = new Blob([lines.join("\n")], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `IPQC_${record.inspectionNo}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported IPQC_${record.inspectionNo}.xls`);
    } catch {
      toast.error("Failed to export Excel report");
    }
  };

  // Specialized Reports Downloads
  const handleDownloadFirstPieceReport = () => {
    const lines = [
      `FIRST-PIECE SETUP VERIFICATION SHEET - ${record.inspectionNo}`,
      `Generated Date,${new Date().toLocaleDateString()}`,
      `Operation,${record.operationNo} - ${record.operationName}`,
      `Work Center,${record.workCenter}`,
      `Machine,${record.machineEquipment}`,
      `Job Card,${record.jobCard}`,
      "",
      "Setup Checkpoint,Status,Verified By",
      `Tooling & Fixture Clamping,${record.firstPiece.toolVerified ? "Approved" : "Pending"},${record.inspector}`,
      `CNC Program & Recipe Calibration,${record.firstPiece.programRecipeVerified ? "Approved" : "Pending"},${record.inspector}`,
      `Critical First Article Dimensions,${record.firstPiece.criticalDimensionsVerified ? "Approved" : "Pending"},${record.inspector}`,
      `Functional & Electrical Safety Test,${record.firstPiece.functionalTestVerified ? "Approved" : "Pending"},${record.inspector}`,
      `Overall Setup Result,${record.firstPiece.firstPieceResult},${record.inspector}`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `First_Piece_Setup_${record.inspectionNo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded First-Piece Setup Verification Sheet");
  };

  const handleDownloadSpcReport = () => {
    const lines = [
      `SPC PROCESS CAPABILITY RUN REPORT - ${record.inspectionNo}`,
      `Control Characteristic,"${record.spc.controlCharacteristic}"`,
      `Upper Control Limit (UCL),${record.spc.ucl}`,
      `Center Line (CL),${record.spc.cl}`,
      `Lower Control Limit (LCL),${record.spc.lcl}`,
      `Cp,${record.spc.cp}`,
      `Cpk,${record.spc.cpk}`,
      `Process Status,"${record.spc.status}"`,
      "",
      "Sample,Reading (Nm),Timestamp,Control Status",
      ...record.spc.datapoints.map(
        (dp) =>
          `${dp.sample},${dp.value},${dp.time},${
            dp.value > record.spc.ucl || dp.value < record.spc.lcl
              ? "Out of Control"
              : "In Control"
          }`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SPC_Capability_Run_${record.inspectionNo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded SPC Process Capability Run Dossier");
  };

  const handleDownloadDefectTally = () => {
    const lines = [
      `HOURLY STAGE-GATE DEFECT TALLY SHEET - ${record.inspectionNo}`,
      `Operation,${record.operationNo}`,
      `Shift,${record.shift}`,
      `Batch,${record.batchLotNo}`,
      "",
      "Defect Code,Description,Severity,Category,Quantity Segregated,Action Taken",
      ...record.defects.map(
        (d) =>
          `"${d.defectCode}","${d.description}","${d.severity}","${d.category}",${d.quantity},"${d.actionTaken}"`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Hourly_Defect_Tally_${record.inspectionNo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded Hourly Stage-Gate Defect Tally Sheet");
  };

  const handleDownloadJobCardSheet = () => {
    const lines = [
      `SHOP FLOOR ROUTING JOB CARD - ${record.jobCard}`,
      `Production Order,${record.productionOrder}`,
      `Work Order,${record.workOrder}`,
      `Product,${record.product}`,
      `Batch / Lot,${record.batchLotNo}`,
      `Current Operation,${record.operationNo} - ${record.operationName}`,
      `Work Center,${record.workCenter}`,
      `Assigned Operator,${record.operator}`,
      `Standard Cycle Time,${record.stdCycleTime}`,
      `Assigned QA Inspector,${record.inspector}`,
      `Inspection Checkpoint Status,${record.inspectionStatus}`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Job_Card_${record.jobCard}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Generated Shop Floor Job Card Routing Sheet");
  };

  return (
    <QualityModuleHeaderCard
      title="In-Process Inspection Form"
      description="Shop floor stage-gate inspection, first-piece setup verification, and statistical process control"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* IPQC Inspection Number */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.inspectionNo}
          </span>

          {/* Inspection Status with Live Pulsing Dot */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs whitespace-nowrap shrink-0 ${
              record.inspectionStatus === "Completed"
                ? "bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60"
                : record.inspectionStatus === "In Progress"
                ? "bg-blue-50/90 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60"
                : "bg-amber-50/90 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60"
            }`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {record.inspectionStatus === "In Progress" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  record.inspectionStatus === "Completed"
                    ? "bg-emerald-500"
                    : record.inspectionStatus === "In Progress"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
              />
            </span>
            {record.inspectionStatus}
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed in-line inspection telemetry")}
      onExportCsv={handleExportCsv}
      onExportExcel={handleExportExcel}
      onExportPdf={onPrint}
      reports={[
        {
          label: "First-Piece Setup Verification Sheet",
          onClick: handleDownloadFirstPieceReport,
        },
        {
          label: "In-Line SPC Process Capability Run (Cp / Cpk)",
          onClick: handleDownloadSpcReport,
        },
        {
          label: "Hourly Stage-Gate Defect Tally Sheet",
          onClick: handleDownloadDefectTally,
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
          label: "Generate Job Card Sheet",
          onClick: handleDownloadJobCardSheet,
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

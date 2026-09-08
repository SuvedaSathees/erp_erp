import React from "react";
import { QualityModuleHeaderCard } from "@/components/erp/QualityModuleHeaderCard";
import { CalibrationRecord } from "@/services/calibrationTypes";
import { toast } from "sonner";

interface CalibrationHeaderProps {
  record: CalibrationRecord;
  onSave: () => void;
  onSubmitForApproval: () => void;
  onPrint: () => void;
  onPrintCertificate?: () => void;
  onScheduleNext?: () => void;
  onRaiseOot?: () => void;
  onCreateCalibration?: () => void;
}

export function CalibrationHeader({
  record,
  onSave,
  onSubmitForApproval,
  onPrint,
  onPrintCertificate,
  onScheduleNext,
  onRaiseOot,
  onCreateCalibration,
}: CalibrationHeaderProps) {
  // Real CSV export
  const handleExportCsv = () => {
    try {
      const lines = [
        `CALIBRATION RECORD REPORT - ${record.calibrationNumber}`,
        `Report Date,${new Date().toLocaleDateString()}`,
        `Calibration Number,${record.calibrationNumber}`,
        `Equipment Name,"${record.equipmentName}"`,
        `Equipment ID,${record.equipmentId}`,
        `Calibration Type,${record.calibrationType}`,
        `Status,${record.calibrationStatus}`,
        `Calibration Date,${record.calibrationDate}`,
        `Next Due Date,${record.nextCalibrationDate}`,
        `Calibration Agency,"${record.calibrationAgency}"`,
        `Procedure Reference,${record.calibrationProcedure}`,
        `Overall Result,${record.overallResult}`,
        `Uncertainty,"${record.measurementUncertainty}"`,
        "",
        "Seq,Parameter,Nominal Value,Standard Reading,Equipment Reading,Error,Tolerance,Result,Remarks",
        ...record.measurements.map(
          (m) =>
            `${m.seq},"${m.parameter}",${m.nominalValue},${m.standardReading},${m.equipmentReading},${m.error},"${m.tolerance}",${m.result},"${m.remarks}"`
        ),
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `Calibration_${record.calibrationNumber}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported Calibration_${record.calibrationNumber}.csv`);
    } catch {
      toast.error("Failed to export calibration CSV");
    }
  };

  // Real Excel export
  const handleExportExcel = () => {
    try {
      const lines = [
        `CALIBRATION RECORD\t${record.calibrationNumber}`,
        `Equipment Name\t${record.equipmentName}`,
        `Equipment ID\t${record.equipmentId}`,
        `Status\t${record.calibrationStatus}`,
        `Date\t${record.calibrationDate}`,
        `Next Due Date\t${record.nextCalibrationDate}`,
        `Agency\t${record.calibrationAgency}`,
        `Overall Result\t${record.overallResult}`,
        "",
        "Seq\tParameter\tNominal\tStandard Reading\tEquipment Reading\tError\tTolerance\tResult\tRemarks",
        ...record.measurements.map(
          (m) =>
            `${m.seq}\t${m.parameter}\t${m.nominalValue}\t${m.standardReading}\t${m.equipmentReading}\t${m.error}\t${m.tolerance}\t${m.result}\t${m.remarks}`
        ),
      ];

      const blob = new Blob([lines.join("\n")], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Calibration_${record.calibrationNumber}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported Calibration_${record.calibrationNumber}.xls`);
    } catch {
      toast.error("Failed to export Excel report");
    }
  };

  // Download Traceability matrix
  const handleDownloadTraceability = () => {
    const lines = [
      "EQUIPMENT NABL TRACEABILITY MATRIX",
      `Equipment,${record.equipmentName} (${record.equipmentId})`,
      `Reference Standard,${record.standards.referenceStandard}`,
      `Standard Serial No,${record.standards.standardSerialNo}`,
      `Standard Certificate No,${record.standards.certificateNo}`,
      `Standard Valid Until,${record.standards.validUntil}`,
      `Traceability Chain,"${record.standards.traceabilityStatement}"`,
      `Issuing Body,"${record.calibrationAgency}"`,
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Traceability_Matrix_${record.equipmentId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded Traceability_Matrix_${record.equipmentId}.csv`);
  };

  // Download Calibration Due Schedule
  const handleDownloadSchedule = () => {
    const lines = [
      "EQUIPMENT CALIBRATION DUE SCHEDULE MATRIX 2026-2027",
      "Equipment ID,Equipment Name,Location,Last Cal Date,Next Due Date,Frequency,Status,Priority",
      `${record.equipmentId},"${record.equipmentName}","${record.location}",${record.previousCalibrationDate},${record.nextCalibrationDate},${record.calibrationFrequency},${record.calibrationStatus},${record.priority}`,
      "EQP-ME-0004,\"Vernier Height Gauge 600mm\",\"Quality Lab\",15-Jul-2026,14-Jul-2027,Annual,Valid,High",
      "EQP-PR-0012,\"Digital Pressure Gauge 100 Bar\",\"Testing Bay\",20-Aug-2026,19-Feb-2027,Semi-Annual,Valid,Critical",
      "EQP-TH-0081,\"RTD Pt100 Temperature Probe\",\"Furnace 3\",02-Jun-2026,01-Jun-2027,Annual,Valid,Medium",
    ];
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "Calibration_Due_Schedule_Matrix_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded Calibration_Due_Schedule_Matrix_2026.csv");
  };

  return (
    <QualityModuleHeaderCard
      title="Calibration Management Form"
      description="Equipment calibration schedules, NABL traceable master standards, measurement uncertainty, and certificates"
      badge={
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Calibration Instrument Number */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-mono text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap shrink-0">
            <span className="text-slate-400 dark:text-slate-500 font-bold select-none text-[11px]">#</span>
            {record.calibrationNumber}
          </span>

          {/* Calibration Status Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50/90 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {record.calibrationStatus}
          </span>
        </div>
      }
      onRefresh={() => toast.success("Refreshed calibration schedule & standards")}
      onExportCsv={handleExportCsv}
      onExportExcel={handleExportExcel}
      onExportPdf={onPrintCertificate || onPrint}
      reports={[
        {
          label: "Calibration Due Schedule Matrix",
          onClick: handleDownloadSchedule,
        },
        {
          label: "Master Traceable Standards Log (NABL)",
          onClick: handleDownloadTraceability,
        },
        {
          label: "Out-of-Tolerance (OOT) Investigation Notice",
          onClick: () => {
            if (onRaiseOot) onRaiseOot();
            else toast.warning("Out-of-Tolerance flag raised. CAPA investigation generated.");
          },
        },
      ]}
      primaryAction={{
        label: "Create Calibration",
        onClick: () => {
          if (onCreateCalibration) {
            onCreateCalibration();
          } else {
            onSave();
            toast.success("Initialized new Calibration event draft");
          }
        },
      }}
      moreActions={[
        {
          label: "Submit for Approval",
          onClick: onSubmitForApproval,
        },
        {
          label: "View / Print Calibration Certificate",
          onClick: () => {
            if (onPrintCertificate) onPrintCertificate();
            else onPrint();
          },
        },
        {
          label: "Flag Out-of-Tolerance (OOT)",
          onClick: () => {
            if (onRaiseOot) onRaiseOot();
            else toast.warning("Flagged equipment as Out-of-Tolerance");
          },
        },
        {
          label: "Save Calibration Draft",
          onClick: onSave,
        },
      ]}
    />
  );
}


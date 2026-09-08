import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle, ShieldCheck, Download } from "lucide-react";
import { CalibrationRecord } from "@/services/calibrationTypes";

interface CalibrationCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: CalibrationRecord;
}

export function CalibrationCertificateModal({
  open,
  onOpenChange,
  record,
}: CalibrationCertificateModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Calibration Certificate Preview
          </DialogTitle>
          <div className="flex items-center gap-2 pr-6">
            <Button size="sm" variant="outline" onClick={handlePrint} className="h-8 text-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print
            </Button>
          </div>
        </DialogHeader>

        {/* Certificate Paper */}
        <div className="p-8 bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-serif border-4 border-double border-slate-300 dark:border-slate-800 m-4 rounded-md shadow-sm text-xs">
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-300 dark:border-slate-800">
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800 dark:text-slate-100">
              {record.calibrationAgency}
            </h2>
            <p className="text-[11px] font-sans text-muted-foreground mt-0.5">
              Accredited by National Accreditation Board for Testing and Calibration Laboratories (NABL)
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">
              ISO/IEC 17025:2017 Accredited Laboratory | Certificate No: CC-2849
            </p>
            <div className="mt-3 inline-block bg-slate-100 dark:bg-slate-900 px-4 py-1 rounded border border-slate-300 dark:border-slate-700">
              <span className="text-sm font-sans font-bold tracking-wide">
                CERTIFICATE OF CALIBRATION
              </span>
            </div>
          </div>

          {/* Certificate Meta */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 dark:border-slate-800 font-sans text-xs">
            <div>
              <p><strong className="text-muted-foreground">Certificate No:</strong> <span className="font-mono font-bold">{record.certificateNumber}</span></p>
              <p className="mt-1"><strong className="text-muted-foreground">Date of Calibration:</strong> {record.calibrationDate}</p>
              <p className="mt-1"><strong className="text-muted-foreground">Suggested Due Date:</strong> <span className="text-emerald-600 font-semibold">{record.certificateValidUntil}</span></p>
            </div>
            <div>
              <p><strong className="text-muted-foreground">Instrument:</strong> {record.equipmentName}</p>
              <p className="mt-1"><strong className="text-muted-foreground">Manufacturer & Model:</strong> {record.equipmentInfo.manufacturer} {record.equipmentInfo.model}</p>
              <p className="mt-1"><strong className="text-muted-foreground">Serial / Asset ID:</strong> <span className="font-mono">{record.equipmentInfo.serialNumber} / {record.equipmentInfo.assetNumber}</span></p>
            </div>
          </div>

          {/* Traceability */}
          <div className="py-3 border-b border-slate-200 dark:border-slate-800 font-sans text-[11px] text-muted-foreground">
            <p><strong>Standards Used:</strong> {record.standards.referenceStandard} (S/N: {record.standards.standardSerialNo}, Cert: {record.standards.certificateNo}, Valid to: {record.standards.validUntil})</p>
            <p className="mt-0.5"><strong>Environmental:</strong> Temp: {record.environment.temperature}°C, RH: {record.environment.humidity}%, Pressure: {record.environment.pressure} hPa</p>
            <p className="mt-0.5"><strong>Traceability:</strong> {record.standards.traceabilityStatement}</p>
          </div>

          {/* Table */}
          <div className="py-4">
            <table className="w-full text-[11px] font-sans border border-slate-300 dark:border-slate-800">
              <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="p-1.5 text-center">#</th>
                  <th className="p-1.5 text-left">Parameter</th>
                  <th className="p-1.5 text-right">Nominal</th>
                  <th className="p-1.5 text-right">Standard</th>
                  <th className="p-1.5 text-right">Reading</th>
                  <th className="p-1.5 text-right">Error</th>
                  <th className="p-1.5 text-center">Tolerance</th>
                  <th className="p-1.5 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[10px]">
                {record.measurements.map((m) => (
                  <tr key={m.id}>
                    <td className="p-1 text-center font-sans">{m.seq}</td>
                    <td className="p-1 text-left font-sans font-medium">{m.parameter}</td>
                    <td className="p-1 text-right">{m.nominalValue}</td>
                    <td className="p-1 text-right">{m.standardReading}</td>
                    <td className="p-1 text-right font-semibold">{m.equipmentReading}</td>
                    <td className="p-1 text-right">{m.error > 0 ? `+${m.error}` : m.error}</td>
                    <td className="p-1 text-center font-sans">{m.tolerance}</td>
                    <td className="p-1 text-center font-sans font-bold text-emerald-600">PASS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statement */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded font-sans text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-emerald-900 dark:text-emerald-300">
              Result: {record.overallResultDescription} Expanded Uncertainty: {record.measurementUncertainty}
            </span>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between items-end font-sans text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <p className="font-semibold">Calibrated By</p>
              <p className="text-[10px] text-muted-foreground">TUV Senior Metrologist</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <p className="font-semibold">Dr. R. K. Sharma</p>
              <p className="text-[10px] text-muted-foreground">Authorized Signatory (Tech Mgr)</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

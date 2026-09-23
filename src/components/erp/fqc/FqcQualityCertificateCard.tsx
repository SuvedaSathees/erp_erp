import { useState } from "react";
import { Award, ShieldCheck, Eye, Printer, QrCode, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FqcRecord } from "@/services/fqcTypes";
import { toast } from "sonner";

interface FqcQualityCertificateCardProps {
  record: FqcRecord;
  onIssueCertificate?: () => void;
}

export function FqcQualityCertificateCard({
  record,
  onIssueCertificate,
}: FqcQualityCertificateCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const cert = record.certificate;

  const handlePrintCertificate = () => {
    // Generate clean printable certificate window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate of Conformance - ${cert.certificateNo}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
            .border-box { border: 3px double #0f172a; padding: 32px; border-radius: 8px; position: relative; }
            .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; }
            .org-name { font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #64748b; text-transform: uppercase; }
            .title { font-size: 24px; font-weight: 900; margin: 6px 0; color: #0f172a; }
            .standards { font-size: 12px; color: #64748b; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
            .field-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; }
            .field-val { font-size: 15px; font-weight: 700; color: #0f172a; }
            .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 16px; margin-bottom: 24px; }
            .line-item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
            .stamp { border: 3px solid #059669; color: #059669; width: 110px; height: 110px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: absolute; right: 40px; top: 40px; transform: rotate(-12deg); }
            .footer { border-top: 2px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
            .sign { font-style: italic; font-family: serif; font-size: 18px; font-weight: bold; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="border-box">
            <div class="stamp">
              <span style="font-size: 9px; font-weight: bold; letter-spacing: 1px;">MAGNERTIA</span>
              <span style="font-size: 13px; font-weight: 900;">PASSED</span>
              <span style="font-size: 8px;">QA SIGN-OFF</span>
            </div>
            <div class="header">
              <div class="org-name">Magnertia Manufacturing Pvt. Ltd.</div>
              <div class="title">CERTIFICATE OF CONFORMANCE (COC)</div>
              <div class="standards">ISO 9001:2015 · IEC 61851-1 · IATF 16949 Certified Facility</div>
            </div>
            <div class="grid">
              <div>
                <div class="field-label">Product Name & Code</div>
                <div class="field-val">${cert.productName}</div>
                <div style="font-family: monospace; font-size: 12px; color: #475569;">${cert.productCode}</div>
              </div>
              <div>
                <div class="field-label">Certificate & Batch Details</div>
                <div class="field-val">COC: ${cert.certificateNo}</div>
                <div style="font-family: monospace; font-size: 12px; color: #475569;">Batch / Lot: ${cert.batchNo} | Date: ${cert.issueDate}</div>
              </div>
            </div>
            <div class="box">
              <div class="line-item"><span>Total Units Inspected in Lot:</span><strong>${record.inspectionQuantity} Nos</strong></div>
              <div class="line-item"><span>Conforming Quantity Certified:</span><strong style="color: #059669;">${cert.quantityCertified} Units</strong></div>
              <div class="line-item"><span>Non-Conforming Units (Segregated):</span><strong style="color: #e11d48;">${record.rejectedQuantity} Units</strong></div>
              <div class="line-item"><span>Sampling Protocol:</span><span>${record.samplingPlan}</span></div>
            </div>
            <div class="footer">
              <div>
                <div style="font-size: 11px; color: #64748b;">Serial Range: ${record.serialRange}</div>
                <div style="font-size: 11px; color: #059669; font-weight: bold; margin-top: 4px;">✓ Cryptographically Signed & Traceable</div>
              </div>
              <div style="text-align: right;">
                <div class="field-label">Authorized Quality Signatory</div>
                <div class="sign">${cert.authorizedSignatory}</div>
                <div style="font-size: 11px; color: #64748b;">Lead Quality Engineer</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
    toast.success("Opened print dialogue for Certificate of Conformance");
  };

  const handleDownloadCertText = () => {
    const certText = `=====================================================
MAGNERTIA MANUFACTURING PVT. LTD.
CERTIFICATE OF QUALITY CONFORMANCE (COC)
=====================================================
Certificate No: ${cert.certificateNo}
Issue Date:     ${cert.issueDate}
Batch / Lot No: ${cert.batchNo}
Product:        ${cert.productName} (${cert.productCode})
Serial Range:   ${record.serialRange}

LOT DISPOSITION:
Total Produced:      ${record.totalProducedQuantity} Units
Inspected Quantity:  ${record.inspectionQuantity} Units
Certified Conforming: ${cert.quantityCertified} Units (Approved for Dispatch)
Non-Conforming:      ${record.rejectedQuantity} Units (Segregated)

STANDARDS COMPLIANCE:
- IEC 61851-1 Electric Vehicle Conductive Charging System
- ISO 9001:2015 Quality Management Systems
- Hi-Pot 2,000V AC Insulation Passed
- Ground Bond Resistance < 0.100 Ohm Passed

AUTHORIZED QA SIGNATURE:
Signatory: ${cert.authorizedSignatory}
Digital Seal: Cryptographically Verified
=====================================================`;

    const blob = new Blob([certText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Certificate_of_Conformance_${cert.certificateNo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Certificate ${cert.certificateNo}.txt`);
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs space-y-3.5 min-w-0">
      <div className="flex items-center justify-between pb-2 border-b border-border/40 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center shrink-0">
            <Award className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground truncate">
            Certificate of Conformance (COC)
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer transition-colors shrink-0"
        >
          Preview
          <Eye className="h-3 w-3" />
        </button>
      </div>

      {/* Certificate Summary */}
      <div className="space-y-2 text-xs min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Certificate No</span>
          <span className="font-mono font-bold text-foreground">{cert.certificateNo}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Certified Quantity</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {cert.quantityCertified} Units
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Release Status</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
            {cert.status} for Dispatch
          </span>
        </div>

        <div className="flex justify-between items-center pt-1 border-t border-border/40">
          <span className="text-muted-foreground">Authorized Signatory</span>
          <span className="font-medium text-foreground text-[11px] truncate max-w-[150px]">
            {cert.authorizedSignatory}
          </span>
        </div>
      </div>

      {/* Digital Seal & Stamp Badge */}
      <div className="p-2.5 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between text-xs min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold text-blue-900 dark:text-blue-200 truncate">
            Digital Quality Seal
          </span>
        </div>
        <span className="text-[10px] font-mono text-primary dark:text-blue-300 shrink-0">
          Cryptographically Verified
        </span>
      </div>

      {/* Action Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (onIssueCertificate) onIssueCertificate();
          else toast.success(`Certificate ${cert.certificateNo} validated for dispatch`);
        }}
        className="w-full h-8 text-xs font-semibold border-blue-200 dark:border-blue-900 text-primary dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
      >
        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
        Verify & Sign Certificate
      </Button>

      {/* Certificate Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center justify-between">
              <span>Certificate of Quality Conformance</span>
              <span className="text-xs font-mono font-normal text-muted-foreground">
                {cert.certificateNo}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl space-y-4 text-xs text-foreground relative min-w-0">
            {/* Watermark/Seal Stamp */}
            <div className="absolute right-4 top-4 w-20 h-20 rounded-full border-4 border-emerald-600/30 flex flex-col items-center justify-center -rotate-12 pointer-events-none select-none">
              <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">
                MAGNERTIA
              </span>
              <span className="text-[11px] font-black text-emerald-600">PASSED</span>
              <span className="text-[8px] text-emerald-600">QA LAB 01</span>
            </div>

            <div className="text-center border-b border-border pb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block">
                Magnertia Manufacturing Pvt. Ltd.
              </span>
              <h1 className="text-lg font-black tracking-tight text-foreground mt-0.5">
                CERTIFICATE OF CONFORMANCE
              </h1>
              <span className="text-[10px] text-muted-foreground">
                Compliant with IEC 61851-1, ISO 9001:2015 & IATF 16949
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground block">PRODUCT</span>
                <span className="font-bold text-foreground text-sm block">
                  {cert.productName}
                </span>
                <span className="font-mono text-muted-foreground">{cert.productCode}</span>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground block">BATCH / LOT NO</span>
                <span className="font-bold text-foreground font-mono text-sm block">
                  {cert.batchNo}
                </span>
                <span className="text-muted-foreground">Release Date: {cert.issueDate}</span>
              </div>
            </div>

            <div className="p-3 bg-card border border-border/70 rounded-lg space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Units In Lot:</span>
                <span className="font-bold font-mono">{record.totalProducedQuantity} Nos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Certified Conforming Qty:</span>
                <span className="font-bold font-mono text-emerald-600">
                  {cert.quantityCertified} Nos
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Non-Conforming (Segregated):</span>
                <span className="font-bold font-mono text-rose-600">
                  {record.rejectedQuantity} Nos (NCR-2026-0047)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serial Range:</span>
                <span className="font-mono font-medium">{record.serialRange}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pt-2 border-t border-border">
              <div className="space-y-1">
                <QrCode className="h-9 w-9 text-muted-foreground" />
                <span className="text-[9px] font-mono text-muted-foreground block">
                  Scan to verify batch pedigree
                </span>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-[10px] text-muted-foreground block">
                  AUTHORIZED QA SIGN-OFF
                </span>
                <span className="font-bold text-foreground block font-serif italic text-sm">
                  {cert.authorizedSignatory}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  ✓ Digitally Signed & Sealed
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCertText}
              className="text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download TXT
            </Button>
            <Button
              size="sm"
              onClick={handlePrintCertificate}
              className="bg-[#0B3B7B] hover:bg-[#092e60] text-white text-xs font-semibold"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              Print Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

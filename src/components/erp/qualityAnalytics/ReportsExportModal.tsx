import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download, Printer, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface ReportsExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportsExportModal({
  open,
  onOpenChange,
}: ReportsExportModalProps) {
  const handleExport = (format: string, reportName: string) => {
    toast.success(`Exporting ${reportName} in ${format} format...`);
    setTimeout(() => {
      onOpenChange(false);
    }, 800);
  };

  const reportsList = [
    {
      title: "Executive Quality Performance Summary (Monthly)",
      desc: "Includes Executive KPIs, Defect Rate trends, First Pass Yield, and COPQ totals.",
      code: "REP-QA-EXEC-2026",
    },
    {
      title: "Defect Pareto & Root Cause Analysis Dossier",
      desc: "Detailed Pareto breakdown with 8D findings, 5-Why linkages, and action tracker status.",
      code: "REP-QA-PAR-2026",
    },
    {
      title: "Statistical Process Control (SPC) Capability Indices",
      desc: "Cp, Cpk, Pp, Ppk parameters across critical production operations and drift alerts.",
      code: "REP-QA-SPC-2026",
    },
    {
      title: "Comprehensive Supplier Quality Rating (VQR)",
      desc: "Incoming lot rejection rates, defect PPM, response times, and vendor risk matrix.",
      code: "REP-QA-SUP-2026",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-muted/30">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Quality Intelligence Reports
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Select an enterprise quality report template below to export verified ERP snapshots with management audit signatures.
          </p>

          <div className="space-y-3">
            {reportsList.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{item.title}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ({item.code})
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("PDF", item.title)}
                    className="h-8 text-xs font-medium border-border hover:bg-muted text-foreground flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                    PDF
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("Excel", item.title)}
                    className="h-8 text-xs font-medium border-border hover:bg-muted text-foreground flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    Excel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  ShieldAlert,
  Upload,
  Download,
  Trash2,
  FileCheck,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  PackageCheck,
  RefreshCw,
} from "lucide-react";
import type { IqcRecord, IqcDocument } from "@/services/iqcTypes";
import { toast } from "sonner";

interface IqcDispositionCardProps {
  record: IqcRecord;
  onChange: (updated: Partial<IqcRecord>) => void;
  onAddDocument: (doc: IqcDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onCompleteInspection: () => void;
}

export const IqcDispositionCard: React.FC<IqcDispositionCardProps> = ({
  record,
  onChange,
  onAddDocument,
  onDeleteDocument,
  onCompleteInspection,
}) => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("PDF");

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) {
      toast.error("Please enter a document filename");
      return;
    }

    const newDoc: IqcDocument = {
      id: `doc-${Date.now()}`,
      name: docName.endsWith(`.${docType.toLowerCase()}`) ? docName : `${docName}.${docType.toLowerCase()}`,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      dateAdded: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      type: docType,
    };

    onAddDocument(newDoc);
    toast.success(`Uploaded document: ${newDoc.name}`);
    setDocName("");
    setUploadOpen(false);
  };

  const handleDownloadDoc = (doc: IqcDocument) => {
    const content = `
MAGNERTIA ERP - QUALITY ASSURANCE ATTACHMENT
Document Name: ${doc.name}
Attached Date: ${doc.dateAdded}
Inspection Ref: ${record.inspectionNo}
GRN Reference : ${record.grnNumber}
Supplier      : ${record.supplier}
Verified Status: Digitally Archived in Secure Repository
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${doc.name}`);
  };

  return (
    <div className="space-y-5 w-full max-w-full min-w-0">
      {/* 1. Disposition & Warehouse Clearance Gate */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Stores Release & Material Disposition Clearance
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Final lot disposition authority, quarantine lockdown, and raw material stores hand-off.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onCompleteInspection}
              className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete & Sign Off</span>
            </Button>
          </div>
        </div>

        {/* Dynamic Status Gate Banner */}
        {record.disposition === "Accept" && record.inventoryStatus === "Released" ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0 flex-1 text-xs">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
                CLEARED FOR WAREHOUSE STORES RELEASE (WH-RM-01)
              </h4>
              <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                Quality gates passed. Stock is unblocked and permitted for release to assembly lines.
              </p>
            </div>
          </div>
        ) : record.disposition === "Return to Supplier" ? (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl p-3.5 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <div className="min-w-0 flex-1 text-xs">
              <h4 className="font-bold text-rose-900 dark:text-rose-200">
                RETURN TO VENDOR (RTV) AUTHORIZATION ISSUED
              </h4>
              <p className="text-rose-700 dark:text-rose-400 text-[11px]">
                Full lot rejection under NCR. Outbound logistics gate pass generated for TechDrive Components.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="min-w-0 flex-1 text-xs">
              <h4 className="font-bold text-amber-900 dark:text-amber-200">
                MATERIAL QUARANTINED & BLOCKED (Bay Q-04)
              </h4>
              <p className="text-amber-700 dark:text-amber-400 text-[11px]">
                4 units failed current rating test. Physical and digital lockdown active until MRB sign-off.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs w-full min-w-0">
          {/* Disposition */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
              <span>Material Disposition</span>
              <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.disposition}
              onValueChange={(val: IqcRecord["disposition"]) => {
                onChange({
                  disposition: val,
                  inventoryStatus: val === "Accept" ? "Released" : "Blocked",
                });
                toast.success(`Disposition changed to ${val}`);
              }}
            >
              <SelectTrigger className="h-8 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Quarantine">Quarantine (Under Investigation)</SelectItem>
                <SelectItem value="Accept">Accept (Clear to Stores)</SelectItem>
                <SelectItem value="Reject">Reject (Total Rejection)</SelectItem>
                <SelectItem value="Rework">Rework (Internal Rectification)</SelectItem>
                <SelectItem value="Return to Supplier">Return to Supplier (RTV)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Status */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground">ERP Inventory State</Label>
            <Select
              value={record.inventoryStatus}
              onValueChange={(val: IqcRecord["inventoryStatus"]) => {
                onChange({ inventoryStatus: val });
                toast.info(`Inventory state updated to ${val}`);
              }}
            >
              <SelectTrigger className="h-8 text-xs font-mono font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Blocked">Blocked (Movement Restricted)</SelectItem>
                <SelectItem value="Quarantine">Quarantine (Inspection Bay)</SelectItem>
                <SelectItem value="Released">Released (Available to Issue)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Release Action */}
          <div className="space-y-1.5 min-w-0 flex flex-col justify-end">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange({ disposition: "Accept", inventoryStatus: "Released" });
                  toast.success("Lot accepted and released to Warehouse Stores");
                }}
                className="h-8 text-xs flex-1 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                Release to Stores
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange({ disposition: "Quarantine", inventoryStatus: "Blocked" });
                  toast.warning("Material locked in Quarantine Bay");
                }}
                className="h-8 text-xs flex-1 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              >
                Quarantine
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Linked Documents & AI Quality Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-full min-w-0">
        {/* Linked Documents Card */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-3 text-xs min-w-0">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-foreground">Linked Documents</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                {record.documents.length}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUploadOpen(true)}
              className="h-7 text-xs text-blue-600 font-medium flex items-center gap-1 border-border cursor-pointer hover:border-blue-500"
            >
              <span>Upload</span>
              <Upload className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="space-y-1.5">
            {record.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium text-foreground truncate">{doc.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-muted-foreground font-mono">{doc.size}</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadDoc(doc)}
                    className="text-muted-foreground hover:text-blue-600 p-1 cursor-pointer"
                    title="Download Document"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteDocument(doc.id);
                      toast.info(`Removed ${doc.name}`);
                    }}
                    className="text-muted-foreground hover:text-rose-600 p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Quality Insights */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-3 text-xs min-w-0">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">AI Quality Insights</h3>
            </div>
            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="text-xs text-blue-600 font-medium flex items-center gap-0.5 cursor-pointer hover:underline"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {record.insights.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                {item.type === "alert" && (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                {item.type === "info" && (
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                {item.type === "recommendation" && (
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                )}
                {item.type === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <span className="text-muted-foreground leading-snug">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md w-full p-5 bg-card border border-border shadow-xl rounded-xl">
          <DialogHeader className="pb-2 border-b border-border">
            <DialogTitle className="text-sm font-bold text-foreground">
              Upload Inspection Document
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Attach manufacturer Certificate of Analysis, inspection reports, or material test results.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Document Name *</Label>
              <Input
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. Rotor_Balancing_Certificate"
                required
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">File Format</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="PDF">PDF (.pdf)</SelectItem>
                  <SelectItem value="DOCX">Word Document (.docx)</SelectItem>
                  <SelectItem value="XLSX">Spreadsheet (.xlsx)</SelectItem>
                  <SelectItem value="PNG">Image (.png)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUploadOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AI Full Diagnostics Modal */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="max-w-xl w-full p-5 bg-card border border-border shadow-xl rounded-xl">
          <DialogHeader className="pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <DialogTitle className="text-sm font-bold text-foreground">
                  AI Quality Intelligence & Vendor Risk Telemetry
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Predictive supplier defect modeling for {record.supplier}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 pt-2 text-xs">
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-muted/30 p-2 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground block">Supplier Risk Index</span>
                <span className="text-base font-bold text-amber-600 font-mono">Medium (34%)</span>
              </div>
              <div className="bg-muted/30 p-2 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground block">Historical Defect Rate</span>
                <span className="text-base font-bold text-foreground font-mono">2.1%</span>
              </div>
              <div className="bg-muted/30 p-2 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground block">Recommended Sampling</span>
                <span className="text-base font-bold text-primary font-mono">Tightened (L-III)</span>
              </div>
            </div>

            <div className="space-y-2 border border-border rounded-lg p-3 bg-muted/20">
              <h4 className="font-bold text-foreground text-xs">AI Diagnostic Observations:</h4>
              <ul className="space-y-1.5 text-muted-foreground text-[11px] list-disc pl-4">
                <li>
                  Current lot defect rate of <strong>5.0%</strong> significantly exceeds the running 12-month baseline of 2.1%.
                </li>
                <li>
                  Failure mode is concentrated in electrical current overload (8.7A vs ≤ 8.0A), pointing to stator winding resistance variation.
                </li>
                <li>
                  Similar winding resistance variance was flagged in receipt batch <strong>LOT-2026-08-042</strong> on 15-Aug-2026.
                </li>
                <li>
                  Recommendation: Escalate supplier process audit and mandate 100% end-of-line testing certificate on next 3 lots.
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border">
            <Button
              type="button"
              size="sm"
              onClick={() => setAiModalOpen(false)}
              className="h-8 text-xs bg-[#0B3B7B] text-white"
            >
              Close Diagnostics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

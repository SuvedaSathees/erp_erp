import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUp, Upload, CheckCircle2, FileText } from "lucide-react";
import { ComplianceEvidenceItem } from "@/services/complianceTypes";
import { toast } from "sonner";

interface UploadEvidenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEvidenceUploaded?: (item: ComplianceEvidenceItem) => void;
}

export function UploadEvidenceModal({
  open,
  onOpenChange,
  onEvidenceUploaded,
}: UploadEvidenceModalProps) {
  const [documentTitle, setDocumentTitle] = useState("HVAC Cleanroom Humidity & Pressure Differential Log Q3");
  const [documentRef, setDocumentRef] = useState("DOC-ENV-LOG-2026-Q3");
  const [category, setCategory] = useState("Environmental Logs");
  const [verifiedBy, setVerifiedBy] = useState("Marcus Chen");
  const [fileSize, setFileSize] = useState("3.2 MB");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);

      const newItem: ComplianceEvidenceItem = {
        id: `ev-${Date.now()}`,
        documentTitle,
        documentRef,
        category,
        uploadDate: "08-Sep-2026",
        verifiedBy,
        fileSize,
      };

      onEvidenceUploaded?.(newItem);
      toast.success("Compliance Evidence Uploaded", {
        description: `Attached and verified "${documentTitle}" (${documentRef}).`,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-slate-50 dark:bg-slate-900/60">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <FileUp className="h-5 w-5 text-[#0B3B7B]" />
            Upload Verified Compliance Evidence
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Document Title *
            </Label>
            <Input
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="e.g. QMS Manual Section 8.5 Controlled Production"
              className="h-9 text-xs font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Document Reference / ID *</Label>
              <Input
                value={documentRef}
                onChange={(e) => setDocumentRef(e.target.value)}
                placeholder="e.g. DOC-QMS-851-V4"
                className="h-9 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Evidence Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Procedure / SOP">Procedure / SOP</SelectItem>
                  <SelectItem value="Calibration Records">Calibration Records</SelectItem>
                  <SelectItem value="Audit Evidence">Audit Evidence</SelectItem>
                  <SelectItem value="Environmental Logs">Environmental Logs</SelectItem>
                  <SelectItem value="Training / Certifications">Training / Certifications</SelectItem>
                  <SelectItem value="Lab Test Report">Lab Test Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Verified By (Auditor / QA)</Label>
              <Input
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Estimated File Size</Label>
              <Input
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>

          {/* Upload Dropzone Simulator */}
          <div className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-muted/20">
            <FileText className="w-8 h-8 mx-auto text-muted-foreground/60 mb-2" />
            <div className="text-xs font-semibold text-foreground">
              Drop verified PDF, XLSX, or audit document here
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              PDF, DOCX, XLSX up to 25MB (Digital Signature verified)
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="bg-[#0B3B7B] hover:bg-[#092e60] text-white text-xs flex items-center gap-1.5"
            >
              {isLoading ? (
                <>Uploading & Attaching...</>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  Attach Evidence
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadEvidenceModal;

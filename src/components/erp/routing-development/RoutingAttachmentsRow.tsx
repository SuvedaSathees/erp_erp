import React, { useState } from "react";
import { Paperclip, FileText, Download, FileSpreadsheet, Image as ImageIcon, Archive, ArrowRight, Eye, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { RoutingAttachment, RoutingRecord } from "@/services/types";

interface RoutingAttachmentsRowProps {
  record: RoutingRecord;
  onNavigateTab?: (tab: string) => void;
  onUploadAttachment?: (file: { name: string; type: string; size: number; documentType: string }) => void;
  onDeleteAttachment?: (id: string) => void;
}

export const RoutingAttachmentsRow: React.FC<RoutingAttachmentsRowProps> = ({
  record,
  onNavigateTab,
  onUploadAttachment,
  onDeleteAttachment,
}) => {
  const [previewAttachment, setPreviewAttachment] = useState<RoutingAttachment | null>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("Image") || fileType.includes("png")) return <ImageIcon className="w-4 h-4 text-blue-500" />;
    if (fileType.includes("Spreadsheet") || fileType.includes("xlsx")) return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
    if (fileType.includes("Archive") || fileType.includes("ZIP") || fileType.includes("zip")) return <Archive className="w-4 h-4 text-amber-500" />;
    return <FileText className="w-4 h-4 text-rose-500" />;
  };

  const handleSimulatedUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file && onUploadAttachment) {
        onUploadAttachment({
          name: file.name,
          type: file.type || "Document",
          size: file.size,
          documentType: "Supporting Documents",
        });
      } else if (file) {
        toast.success(`Uploaded ${file.name} to Routing Attachments`);
      }
    };
    input.click();
  };

  const handleDownload = (att: RoutingAttachment) => {
    const content = `ROUTING SPECIFICATION ATTACHMENT: ${att.fileName}\nDocument Type: ${att.documentType}\nVersion: ${att.version}\nUploaded By: ${att.uploadedBy}\nDate: ${att.uploadedDate}\nStatus: Verified\n\nRouting Ref: ${record.routingNumber} (${record.routingName})\nProduct: ${record.product} (${record.productRevision})`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = att.fileName.replace(/\.[^/.]+$/, "") + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${att.fileName}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs p-4 text-xs">
      <div className="flex justify-between items-center pb-2.5 border-b border-border mb-3">
        <div className="flex items-center gap-1.5">
          <Paperclip className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-foreground text-xs">Attachments</h2>
          <span className="text-[10px] text-muted-foreground font-normal">
            ({record.attachments.length} Documents)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSimulatedUpload}
            className="h-7 px-2.5 text-xs gap-1 cursor-pointer font-semibold"
          >
            <Upload className="w-3 h-3" /> Upload File
          </Button>
          <button
            onClick={() => onNavigateTab?.("attachments")}
            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All Attachments <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {record.attachments.map((att) => (
          <div
            key={att.id}
            className="p-2.5 rounded-lg border border-border/70 bg-muted/20 hover:bg-accent hover:border-accent-foreground/30 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-1.5">
              {getFileIcon(att.fileType)}
              <div className="min-w-0 flex-1">
                <span
                  onClick={() => setPreviewAttachment(att)}
                  className="font-semibold text-foreground text-[11px] block truncate hover:underline cursor-pointer"
                  title={att.documentType}
                >
                  {att.documentType}
                </span>
                <span className="text-[9px] text-muted-foreground block truncate font-mono" title={att.fileName}>
                  {att.fileName}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[9px] text-muted-foreground">
              <span>{att.fileSize}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewAttachment(att)}
                  className="p-0.5 hover:text-primary transition-colors cursor-pointer"
                  title={`Preview ${att.fileName}`}
                >
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDownload(att)}
                  className="p-0.5 hover:text-emerald-600 transition-colors cursor-pointer"
                  title={`Download ${att.fileName}`}
                >
                  <Download className="w-3 h-3" />
                </button>
                {onDeleteAttachment && (
                  <button
                    onClick={() => onDeleteAttachment(att.id)}
                    className="p-0.5 hover:text-destructive transition-colors cursor-pointer"
                    title={`Delete ${att.fileName}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attachment Preview Modal */}
      <Dialog open={!!previewAttachment} onOpenChange={(open) => !open && setPreviewAttachment(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <FileText className="h-5 w-5 text-primary" />
              {previewAttachment?.fileName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {previewAttachment?.documentType} • Version {previewAttachment?.version} • {previewAttachment?.fileSize}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
            <p className="text-emerald-400 font-bold">=== ROUTING ATTACHMENT DETAILS ===</p>
            <p>Title: {previewAttachment?.documentType}</p>
            <p>File: {previewAttachment?.fileName}</p>
            <p>Uploaded By: {previewAttachment?.uploadedBy} ({previewAttachment?.uploadedDate})</p>
            <p>Routing Ref: {record.routingNumber} ({record.routingName})</p>
            <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs">
              This controlled routing specification document establishes the verified sequence of manufacturing operations and work center assignments for {record.product}.
            </div>
          </div>
          <DialogFooter className="gap-2">
            {previewAttachment && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(previewAttachment)}
                className="h-8 text-xs gap-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download Document
              </Button>
            )}
            <Button size="sm" onClick={() => setPreviewAttachment(null)} className="h-8 text-xs bg-primary text-primary-foreground cursor-pointer">
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

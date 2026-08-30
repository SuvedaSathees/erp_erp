import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Upload, FileText, Download, Eye, CheckCircle2 } from "lucide-react";
import type { SmartFactoryAttachment, SmartFactoryDevelopmentRecord } from "@/services/types";
import { toast } from "sonner";

interface SmartFactoryAttachmentsCardProps {
  record: SmartFactoryDevelopmentRecord;
  onUploadAttachment: (file: { name: string; type: string; size: number; documentType: string }) => void;
}

const REQUIRED_ATTACHMENT_SLOTS = [
  "Smart Factory Architecture",
  "Digital Twin Model",
  "Network Diagram",
  "PLC & SCADA Configuration",
  "AI Models",
  "Cybersecurity Assessment",
  "FAT/SAT Reports",
  "SOP Documents",
  "Supporting Documents",
];

export const SmartFactoryAttachmentsCard: React.FC<SmartFactoryAttachmentsCardProps> = ({
  record,
  onUploadAttachment,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(REQUIRED_ATTACHMENT_SLOTS[0]);

  const handleSimulatedUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        onUploadAttachment({
          name: file.name,
          type: file.type || "Document",
          size: file.size,
          documentType: selectedSlot,
        });
      }
    };
    input.click();
  };

  const handlePreview = (attachment: SmartFactoryAttachment) => {
    toast.info(`Previewing ${attachment.fileName}`, {
      description: `Viewing ${attachment.documentType} (${attachment.fileSize}).`,
    });
  };

  const handleDownload = (attachment: SmartFactoryAttachment) => {
    const blob = new Blob(
      [
        `Magnertia ERP Smart Factory Blueprint Document\n\nTitle: ${attachment.documentType}\nFile: ${attachment.fileName}\nVersion: ${attachment.version}\nUploaded By: ${attachment.uploadedBy}\nDate: ${attachment.uploadDate || "17 Jun 2024"}\nSize: ${attachment.fileSize}\nStatus: Verified Control Baseline`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.fileName.replace(/\.[^/.]+$/, "") + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloading ${attachment.fileName}`);
  };

  return (
    <Card className="border-border rounded-xl shadow-xs">
      <CardHeader className="border-b border-border/60 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">
              Attachments & Architecture Blueprints
            </CardTitle>
          </div>
          <Button
            size="sm"
            onClick={handleSimulatedUpload}
            className="gap-1.5 text-xs font-semibold cursor-pointer bg-primary hover:bg-primary/90"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload File
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 text-xs">
        {/* Document Slots Selector Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {REQUIRED_ATTACHMENT_SLOTS.map((slot) => {
            const uploaded = (record?.attachments || []).find((a) => a.documentType === slot);
            const isSelected = selectedSlot === slot;
            return (
              <div
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-all ${
                  isSelected ? "ring-2 ring-primary border-primary" : "border-border/60 hover:bg-muted/30"
                } ${
                  uploaded
                    ? "bg-emerald-500/5 dark:bg-emerald-950/20"
                    : "bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${uploaded ? "text-emerald-600" : "text-muted-foreground/40"}`} />
                  <span className="font-semibold text-foreground truncate">{slot}</span>
                </div>
                <Badge variant={uploaded ? "outline" : "secondary"} className="text-[10px] shrink-0 font-mono px-1.5 py-0">
                  {uploaded ? uploaded.version : "Pending"}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Uploaded Documents List */}
        <div className="rounded-lg border border-border/80 overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap">Document Type</th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap">File Name</th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap">Uploaded By</th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap">Date</th>
                  <th className="py-2.5 px-3 font-semibold whitespace-nowrap">Size</th>
                  <th className="py-2.5 px-3 text-right font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(record?.attachments || []).map((att) => (
                  <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-foreground whitespace-nowrap">
                      {att.documentType}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-mono text-primary font-medium hover:underline cursor-pointer">
                          {att.fileName}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono">
                          {att.version}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                      {att.uploadedBy || "Vikram Singh"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap font-mono text-[11px]">
                      {att.uploadDate || "17 Jun 2024"}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">
                      {att.fileSize}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] gap-1 hover:text-primary cursor-pointer"
                          onClick={() => handlePreview(att)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] gap-1 hover:text-emerald-600 cursor-pointer"
                          onClick={() => handleDownload(att)}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

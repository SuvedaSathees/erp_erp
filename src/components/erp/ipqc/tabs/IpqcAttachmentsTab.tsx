import React, { useState } from "react";
import { Paperclip, Upload, Download, FileText, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachmentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export const IpqcAttachmentsTab: React.FC = () => {
  const [attachments, setAttachments] = useState<AttachmentItem[]>([
    {
      id: "att-01",
      name: "DRW-EVSE-003_Cable_Assembly.pdf",
      type: "PDF Document",
      size: "2.4 MB",
      uploadedBy: "Engineering Team",
      date: "01-Sep-2026",
    },
    {
      id: "att-02",
      name: "WI-ASM-030_Work_Instruction.pdf",
      type: "PDF Document",
      size: "1.8 MB",
      uploadedBy: "Manufacturing Eng",
      date: "02-Sep-2026",
    },
    {
      id: "att-03",
      name: "VTT-02_Calibration_Certificate.pdf",
      type: "PDF Document",
      size: "0.9 MB",
      uploadedBy: "Calibration Lab",
      date: "15-Aug-2026",
    },
    {
      id: "att-04",
      name: "First_Piece_Setup_Photo.jpg",
      type: "Image JPEG",
      size: "3.2 MB",
      uploadedBy: "Priya S",
      date: "06-Sep-2026",
    },
  ]);

  const handleDelete = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-blue-600" />
            <span>Controlled In-Process Quality Documents & Photo Evidence</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Engineering drawings, work instructions, calibration certificates, and visual defect evidence.
          </p>
        </div>

        <Button
          size="sm"
          className="h-8 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] font-semibold text-muted-foreground uppercase border-b border-border/60">
            <tr>
              <th className="pb-2 font-medium">Document Name</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Size</th>
              <th className="pb-2 font-medium">Uploaded By</th>
              <th className="pb-2 font-medium">Upload Date</th>
              <th className="pb-2 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {attachments.map((att) => (
              <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate max-w-xs">{att.name}</span>
                </td>
                <td className="py-2.5 text-muted-foreground">{att.type}</td>
                <td className="py-2.5 font-mono text-muted-foreground">{att.size}</td>
                <td className="py-2.5 text-muted-foreground">{att.uploadedBy}</td>
                <td className="py-2.5 font-mono text-muted-foreground">{att.date}</td>
                <td className="py-2.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(att.id)}
                      className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

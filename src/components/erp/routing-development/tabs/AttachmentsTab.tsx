import React from "react";
import { Paperclip, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import type { RoutingRecord } from "@/services/types";

interface AttachmentsTabProps {
  record: RoutingRecord;
}

export const AttachmentsTab: React.FC<AttachmentsTabProps> = ({ record }) => {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-card p-4 rounded-lg border border-border flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Routing Attachments & Controlled Documents Repository
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Central repository for routing sheets, process flow diagrams, time study reports, and inspection plans.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <th className="py-2.5 px-3">Document Type</th>
              <th className="py-2.5 px-3">File Name</th>
              <th className="py-2.5 px-3">Version</th>
              <th className="py-2.5 px-3">Uploaded By</th>
              <th className="py-2.5 px-3">Uploaded Date</th>
              <th className="py-2.5 px-3">File Size</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {record.attachments.map((att) => (
              <tr key={att.id} className="hover:bg-muted/30">
                <td className="py-2.5 px-3 font-bold text-foreground">{att.documentType}</td>
                <td className="py-2.5 px-3 font-mono text-primary">{att.fileName}</td>
                <td className="py-2.5 px-3 font-mono font-bold">v{att.version}</td>
                <td className="py-2.5 px-3 text-foreground">{att.uploadedBy}</td>
                <td className="py-2.5 px-3 text-muted-foreground font-mono">{att.uploadedDate}</td>
                <td className="py-2.5 px-3 text-muted-foreground font-mono">{att.fileSize}</td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={() => {
                      const content = `ROUTING ATTACHMENT: ${att.fileName}\nDocument Type: ${att.documentType}\nVersion: ${att.version}\nUploaded By: ${att.uploadedBy}\nDate: ${att.uploadedDate}\nStatus: Verified`;
                      const blob = new Blob([content], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = att.fileName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success(`Downloaded ${att.fileName}`);
                    }}
                    className="p-1 hover:bg-muted rounded text-primary transition-colors cursor-pointer"
                    title={`Download ${att.fileName}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { FileText, Download, Eye, UploadCloud, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NcrRecord } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrAttachmentsTabProps {
  record: NcrRecord;
}

export function NcrAttachmentsTab({ record }: NcrAttachmentsTabProps) {
  const documents = [
    {
      id: "doc-1",
      name: "DRW-EVSE-003_Rev2.1_Housing.pdf",
      type: "CAD Drawing",
      size: "4.2 MB",
      date: "06-Sep-2026 14:40",
      user: "System",
    },
    {
      id: "doc-2",
      name: "IPQC_Inspection_Sheet_00358.pdf",
      type: "Quality Inspection Log",
      size: "820 KB",
      date: "06-Sep-2026 14:35",
      user: "Rajesh K",
    },
    {
      id: "doc-3",
      name: "8D_Problem_Solving_Report_Draft.docx",
      type: "Investigation 8D",
      size: "1.4 MB",
      date: "07-Sep-2026 09:15",
      user: "Arun K",
    },
    {
      id: "doc-4",
      name: "CMM_Surface_Roughness_Scan.pdf",
      type: "Metrology Report",
      size: "2.1 MB",
      date: "07-Sep-2026 14:00",
      user: "Kavitha R",
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Controlled Quality Documents & Attachments
          </h3>
          <p className="text-xs text-muted-foreground">
            Audit-ready evidence repository linked to {record.ncrNumber}.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => toast.info("Select files to upload to NCR repository")}
          className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          <UploadCloud className="h-3.5 w-3.5 mr-1" />
          Upload Document
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
              <th className="py-2 px-3">Document Name</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Size</th>
              <th className="py-2 px-3">Uploaded</th>
              <th className="py-2 px-3">By</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                <td className="py-2.5 px-3 flex items-center gap-2 font-medium text-foreground">
                  <FileText className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="truncate max-w-[220px]">{doc.name}</span>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">{doc.type}</td>
                <td className="py-2.5 px-3 font-mono text-muted-foreground">{doc.size}</td>
                <td className="py-2.5 px-3 font-mono text-muted-foreground">{doc.date}</td>
                <td className="py-2.5 px-3 text-foreground font-medium">{doc.user}</td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => toast.info(`Viewing ${doc.name}`)}
                      className="p-1 hover:bg-muted rounded text-blue-600"
                      title="Preview"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success(`Downloading ${doc.name}`)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                      title="Download"
                    >
                      <Download className="h-3.5 w-3.5" />
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
}

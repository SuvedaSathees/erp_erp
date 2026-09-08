import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Calendar } from "lucide-react";
import { ComplianceEvidenceItem } from "@/services/complianceTypes";
import { toast } from "sonner";

interface ComplianceEvidenceCardProps {
  evidence: ComplianceEvidenceItem[];
  onUpload?: () => void;
}

export function ComplianceEvidenceCard({
  evidence,
  onUpload,
}: ComplianceEvidenceCardProps) {
  const handleDownload = (doc: ComplianceEvidenceItem) => {
    const content = `COMPLIANCE EVIDENCE RECORD
===================================================
Document Reference: ${doc.documentRef}
Document Title: ${doc.documentTitle}
Category: ${doc.category}
File Size: ${doc.fileSize}
Upload Date: ${doc.uploadDate}
Verified By: ${doc.verifiedBy}
Verification Status: Active & Valid (Audit Verified)
===================================================
This digital compliance dossier is registered in Magnertia ERP
for regulatory inspection and ISO/IATF third-party audits.
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.documentRef}_Evidence_Record.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded evidence artifact: ${doc.documentRef}`);
  };

  return (
    <Card className="shadow-xs border-border/80 overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-bold text-foreground">
            Compliance Evidence & Document Register
          </CardTitle>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={onUpload || (() => toast.info("Opening upload dialog..."))}
          className="h-8 text-xs px-3 font-semibold bg-[#0B3B7B] hover:bg-[#092e60] text-white flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Evidence</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60 text-xs">
          {evidence.map((doc) => (
            <div
              key={doc.id}
              className="p-3.5 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate" title={doc.documentTitle}>
                    {doc.documentTitle}
                  </span>
                  <div className="flex items-center flex-wrap gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="font-mono font-medium text-foreground">{doc.documentRef}</span>
                    <span>•</span>
                    <span>{doc.category}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-muted-foreground block">
                    Verified by {doc.verifiedBy}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 sm:justify-end">
                    <Calendar className="w-3 h-3" />
                    {doc.uploadDate}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleDownload(doc)}
                  className="h-8 w-8 hover:bg-muted border-border/70 cursor-pointer"
                  title="Download verified document record"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ComplianceEvidenceCard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, FileText, Calendar, ShieldCheck, Printer } from "lucide-react";
import { CalibrationRecord } from "@/services/calibrationTypes";

interface CertificateInformationCardProps {
  record: CalibrationRecord;
  onOpenCertificateModal?: () => void;
}

export function CertificateInformationCard({
  record,
  onOpenCertificateModal,
}: CertificateInformationCardProps) {
  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          Certificate Information
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCertificateModal}
          className="h-7 text-xs px-2.5 font-medium border-primary/40 text-primary hover:bg-primary/10"
        >
          <Printer className="w-3 h-3 mr-1" />
          View Certificate
        </Button>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Certificate Number</span>
            <span className="font-mono font-bold text-foreground flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-primary" />
              {record.certificateNumber}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Issue Date</span>
            <span className="font-medium text-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              {record.certificateIssueDate}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Valid Until</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {record.certificateValidUntil}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div>
            <span className="text-muted-foreground block text-[11px]">Issuing Body:</span>
            <span className="font-medium text-foreground">{record.calibrationAgency} (NABL Accredited)</span>
          </div>
          <div className="sm:text-right">
            <span className="text-muted-foreground block text-[11px]">Authorized Signatory:</span>
            <span className="font-medium text-foreground">Dr. R. K. Sharma (Tech Manager)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, GitCommit, FileText, Calendar, Hash } from "lucide-react";
import { CalibrationRecord } from "@/services/calibrationTypes";

interface CalibrationStandardsCardProps {
  record: CalibrationRecord;
}

export function CalibrationStandardsCard({
  record,
}: CalibrationStandardsCardProps) {
  const { standards } = record;

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Standards & Traceability
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Reference Standard</span>
            <span className="font-semibold text-foreground">{standards.referenceStandard}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Standard S/N</span>
            <span className="font-mono font-medium text-foreground flex items-center gap-1">
              <Hash className="w-3 h-3 text-muted-foreground" />
              {standards.standardSerialNo}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Certificate Number</span>
            <span className="font-mono font-semibold text-primary flex items-center gap-1">
              <FileText className="w-3 h-3 text-primary" />
              {standards.certificateNo}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Standard Valid Until</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {standards.validUntil}
            </span>
          </div>
        </div>

        {/* Traceability chain statement banner */}
        <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/60 flex items-center gap-2.5 text-xs">
          <GitCommit className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-blue-950 dark:text-blue-200 font-medium">
            {standards.traceabilityStatement}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

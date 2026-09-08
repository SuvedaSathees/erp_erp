import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, AlertOctagon, MapPin } from "lucide-react";
import { ComplianceRecord } from "@/services/complianceTypes";

interface ComplianceRequirementDetailsCardProps {
  record: ComplianceRecord;
  onChange: (field: keyof ComplianceRecord, value: any) => void;
}

export function ComplianceRequirementDetailsCard({
  record,
  onChange,
}: ComplianceRequirementDetailsCardProps) {
  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Requirement Scope & Risk Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Full Requirement Text */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Standard Requirement Statement / Statutory Definition
          </Label>
          <Textarea
            value={record.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={3}
            className="text-xs leading-relaxed resize-none"
          />
        </div>

        {/* Applicability Scope */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            Applicable Scope & Facility Footprint
          </Label>
          <Textarea
            value={record.applicabilityNote}
            onChange={(e) => onChange("applicabilityNote", e.target.value)}
            rows={2}
            className="text-xs leading-relaxed resize-none"
          />
        </div>

        {/* Consequences of Non-Compliance */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5" />
            Potential Impact & Non-Compliance Penalties
          </Label>
          <Textarea
            value={record.consequencesOfNonCompliance}
            onChange={(e) => onChange("consequencesOfNonCompliance", e.target.value)}
            rows={2}
            className="text-xs leading-relaxed resize-none border-rose-200 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/10"
          />
        </div>
      </CardContent>
    </Card>
  );
}

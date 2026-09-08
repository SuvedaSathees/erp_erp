import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target, Layers, Compass } from "lucide-react";
import { AuditRecord } from "@/services/auditTypes";

interface AuditObjectiveScopeCardProps {
  record: AuditRecord;
  onChange: (field: keyof AuditRecord, value: any) => void;
}

export function AuditObjectiveScopeCard({
  record,
  onChange,
}: AuditObjectiveScopeCardProps) {
  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Audit Objectives, Scope & Sampling Methodology
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 min-w-0">
        {/* Objective */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-primary" />
            Audit Objectives & Criteria
          </Label>
          <Textarea
            value={record.objective}
            onChange={(e) => onChange("objective", e.target.value)}
            rows={2}
            className="text-xs leading-relaxed resize-none"
          />
        </div>

        {/* Scope */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
            Audited Scope & Facility Boundaries
          </Label>
          <Textarea
            value={record.scopeSummary}
            onChange={(e) => onChange("scopeSummary", e.target.value)}
            rows={2}
            className="text-xs leading-relaxed resize-none"
          />
        </div>

        {/* Methodology */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-muted-foreground" />
            Audit Methodology & Sampling Protocol
          </Label>
          <Textarea
            value={record.methodology}
            onChange={(e) => onChange("methodology", e.target.value)}
            rows={2}
            className="text-xs leading-relaxed resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Box, Layers, AlertCircle, TrendingDown } from "lucide-react";
import { CapaRecord } from "@/services/capaTypes";

interface CapaProblemScopeCardProps {
  record: CapaRecord;
  onChange: (field: keyof CapaRecord, value: any) => void;
}

export function CapaProblemScopeCard({
  record,
  onChange,
}: CapaProblemScopeCardProps) {
  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Box className="h-4 w-4 text-primary" />
          Product & Problem Definition (5W2H)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Affected Product Name
            </Label>
            <Input
              value={record.productName}
              onChange={(e) => onChange("productName", e.target.value)}
              className="h-9 text-xs font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Part Number / SKU
            </Label>
            <Input
              value={record.partNumber}
              onChange={(e) => onChange("partNumber", e.target.value)}
              className="h-9 text-xs font-mono font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Production Line / Workstation
            </Label>
            <Input
              value={record.productionLine}
              onChange={(e) => onChange("productionLine", e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Problem Description */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Detailed Defect Description & Non-Conformance Evidence
          </Label>
          <Textarea
            value={record.defectDescription}
            onChange={(e) => onChange("defectDescription", e.target.value)}
            rows={2}
            className="text-xs leading-relaxed resize-none font-medium"
          />
        </div>

        {/* Defect Rate & Root Cause Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              Observed Defect Rate
            </Label>
            <Input
              value={record.defectRate}
              onChange={(e) => onChange("defectRate", e.target.value)}
              className="h-9 text-xs font-semibold text-rose-600 dark:text-rose-400 font-mono"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Underlying Root Cause Summary (from RCA)
            </Label>
            <Input
              value={record.rootCauseSummary}
              onChange={(e) => onChange("rootCauseSummary", e.target.value)}
              className="h-9 text-xs font-medium text-foreground bg-muted/30"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

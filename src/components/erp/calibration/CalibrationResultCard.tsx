import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldAlert, Sparkles, Check } from "lucide-react";
import { CalibrationRecord } from "@/services/calibrationTypes";

interface CalibrationResultCardProps {
  record: CalibrationRecord;
}

export function CalibrationResultCard({ record }: CalibrationResultCardProps) {
  const isPass = record.overallResult === "PASS";

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Overall Calibration Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Pass/Fail Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            isPass
              ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                isPass
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 text-white"
              }`}
            >
              {isPass ? <Check className="w-6 h-6 stroke-[3]" /> : "!"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">CALIBRATION RESULT:</span>
                <Badge
                  className={`text-xs px-2.5 py-0.5 font-bold ${
                    isPass
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }`}
                >
                  {record.overallResult}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {record.overallResultDescription}
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-[11px] text-muted-foreground block">Calibration Status</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Fit for Operational Use
            </span>
          </div>
        </div>

        {/* 3 Parameter Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Adjustment Performed</span>
            <span className="font-semibold text-foreground">{record.adjustmentPerformed}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Compliance to Procedure</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {record.complianceToProcedure}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-muted-foreground block text-[11px]">Expanded Uncertainty</span>
            <span className="font-mono font-semibold text-primary">
              {record.measurementUncertainty} (k=2, 95%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

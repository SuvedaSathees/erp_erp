import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardCheck, CheckCheck, RotateCcw } from "lucide-react";
import { CalibrationVerificationItem } from "@/services/calibrationTypes";

interface PreCalibrationVerificationCardProps {
  items: CalibrationVerificationItem[];
  onToggleItem?: (id: string) => void;
  onMarkAllPass?: () => void;
  onResetAll?: () => void;
}

export function PreCalibrationVerificationCard({
  items,
  onToggleItem,
  onMarkAllPass,
  onResetAll,
}: PreCalibrationVerificationCardProps) {
  const passCount = items.filter((i) => i.result === "Pass").length;

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-base font-semibold text-foreground">
            Pre-Calibration Verification
          </CardTitle>
          <span className="text-xs text-muted-foreground font-medium">
            ({passCount} of {items.length} Checked)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {onMarkAllPass && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllPass}
              className="h-7 text-[11px] px-2 font-medium text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 border-emerald-300"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark All Pass
            </Button>
          )}
          {onResetAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetAll}
              className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItem?.(item.id)}
              className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-card hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <span className="text-xs font-medium text-foreground">{item.check}</span>
              <Badge
                className={
                  item.result === "Pass"
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px]"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px]"
                }
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {item.result}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

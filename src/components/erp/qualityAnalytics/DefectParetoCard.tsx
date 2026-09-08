import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DefectParetoItem } from "@/services/qualityAnalyticsTypes";

interface DefectParetoCardProps {
  data: DefectParetoItem[];
}

export function DefectParetoCard({ data }: DefectParetoCardProps) {
  const displayData = data.slice(0, 6);
  const maxCount = 45;

  return (
    <Card className="shadow-xs border-border/80 bg-card flex flex-col justify-between overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
          Defect Pareto Analysis (80/20)
        </CardTitle>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block"></span>
            <span>Count</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-amber-500 inline-block relative">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-[2px] left-1/2 -translate-x-1/2"></span>
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Cum. %</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 pt-3 flex-1 flex flex-col justify-center">
        <div className="space-y-2.5 w-full">
          {displayData.map((item, idx) => {
            const widthPercent = Math.min((item.count / maxCount) * 100, 100);
            return (
              <div key={idx} className="flex items-center gap-2 text-xs">
                {/* Defect Name */}
                <div
                  className="w-24 sm:w-28 shrink-0 text-right text-[10px] font-semibold text-foreground truncate select-none"
                  title={item.defect}
                >
                  {item.defect}
                </div>

                {/* Bar Track & Fill */}
                <div className="flex-1 bg-muted/40 h-4 rounded-xs overflow-hidden relative">
                  <div
                    className="h-full bg-blue-500 hover:bg-blue-600 rounded-xs transition-all shadow-xs"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>

                {/* Count and Cumulative % */}
                <div className="w-20 shrink-0 flex items-center justify-between font-mono text-[10px] pl-1">
                  <span className="font-bold text-foreground">{item.count}</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {item.cumulativePercentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom scale labels */}
        <div className="flex items-center justify-between text-[9px] text-muted-foreground font-mono mt-3 pt-2 border-t border-border/40 px-1">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40+ pcs</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default DefectParetoCard;

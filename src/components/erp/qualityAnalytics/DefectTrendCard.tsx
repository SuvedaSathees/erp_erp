import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DefectTrendMonth } from "@/services/qualityAnalyticsTypes";

interface DefectTrendCardProps {
  data: DefectTrendMonth[];
}

export function DefectTrendCard({ data }: DefectTrendCardProps) {
  const chartHeight = 150;
  const maxVal = 6.0;

  // Calculate coordinates
  const getY = (val: number) => {
    return chartHeight - (val / maxVal) * chartHeight;
  };

  const targetY = getY(2.0);

  return (
    <Card className="shadow-xs border-border/80 bg-card flex flex-col justify-between overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
          Defect Trend (Last 6 Months)
        </CardTitle>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block"></span>
            <span>Defect %</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-rose-500 inline-block relative">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute -top-[2px] left-1/2 -translate-x-1/2"></span>
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">Target (2%)</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 pt-3 flex-1 flex flex-col justify-end">
        <div className="relative w-full h-[180px] flex items-end">
          {/* Y Axis Labels */}
          <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[10px] text-muted-foreground font-mono text-right pr-1 select-none">
            <span>6</span>
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
            <span>0</span>
          </div>

          {/* Chart Drawing Area */}
          <div className="ml-7 w-full h-[155px] relative mb-6">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5, 6].map((level) => {
              const y = getY(level);
              return (
                <div
                  key={level}
                  className={`absolute left-0 right-0 border-b ${
                    level === 2
                      ? "border-transparent" // replaced by target line
                      : "border-border/40"
                  }`}
                  style={{ top: `${y}px` }}
                />
              );
            })}

            {/* Target Red Line (2.0%) */}
            <div
              className="absolute left-0 right-0 border-b-2 border-rose-500 z-10 flex items-center justify-between"
              style={{ top: `${targetY}px` }}
            >
              {data.map((_, idx) => (
                <div
                  key={idx}
                  className="w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-card -translate-y-[1px]"
                />
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-around px-1 z-0">
              {data.map((item, idx) => {
                const barHeight = (item.defectRate / maxVal) * chartHeight;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center group relative h-full justify-end flex-1 max-w-[36px]"
                  >
                    {/* Value Badge */}
                    <span
                      className={`text-[10px] font-bold font-mono mb-1 transition-all ${
                        item.defectRate > 2.0
                          ? "text-rose-600 dark:text-rose-400 font-extrabold"
                          : "text-foreground"
                      }`}
                    >
                      {item.defectRate.toFixed(1)}
                    </span>

                    {/* Bar */}
                    <div
                      className="w-5 rounded-t-xs bg-blue-500/90 hover:bg-blue-600 transition-all shadow-xs"
                      style={{ height: `${barHeight}px` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X Axis Month Labels */}
          <div className="absolute left-7 right-0 bottom-0 h-6 flex justify-around items-center px-1 text-[10px] font-bold text-muted-foreground select-none">
            {data.map((item, idx) => (
              <span key={idx} className="flex-1 text-center truncate">
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DefectTrendCard;

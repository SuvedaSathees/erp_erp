import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessPerformanceItem } from "@/services/qualityAnalyticsTypes";

interface ProcessPerformanceCardProps {
  data: ProcessPerformanceItem[];
}

export function ProcessPerformanceCard({ data }: ProcessPerformanceCardProps) {
  const chartHeight = 150;
  const maxVal = 100;

  return (
    <Card className="shadow-xs border-border/80 bg-card flex flex-col justify-between overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
          Quality Performance by Process
        </CardTitle>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block"></span>
            <span>FPY %</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block"></span>
            <span>Defect %</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block"></span>
            <span>Rework %</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 pt-3 flex-1 flex flex-col justify-end">
        <div className="relative w-full h-[180px] flex items-end">
          {/* Y Axis: 0 to 100 */}
          <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[10px] text-muted-foreground font-mono text-right pr-1 select-none">
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>

          {/* Chart Area */}
          <div className="ml-7 w-full h-[155px] relative mb-6">
            {/* Gridlines */}
            {[0, 20, 40, 60, 80, 100].map((level) => {
              const y = chartHeight - (level / maxVal) * chartHeight;
              return (
                <div
                  key={level}
                  className="absolute left-0 right-0 border-b border-border/40"
                  style={{ top: `${y}px` }}
                />
              );
            })}

            {/* Clustered Bars Container */}
            <div className="absolute inset-0 flex items-end justify-around px-1">
              {data.map((item, idx) => {
                const fpyHeight = (item.fpy / maxVal) * chartHeight;
                const defectHeight = Math.max((item.defectRate / maxVal) * chartHeight * 3.5, 8);
                const reworkHeight = Math.max((item.rework / maxVal) * chartHeight * 3.5, 6);

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center h-full justify-end flex-1 max-w-[50px] group"
                  >
                    <div className="flex items-end gap-0.5 justify-center w-full">
                      {/* FPY Bar */}
                      <div
                        className="w-3 sm:w-3.5 bg-emerald-600 rounded-t-xs hover:bg-emerald-700 transition-all shadow-xs"
                        style={{ height: `${fpyHeight}px` }}
                        title={`FPY: ${item.fpy}%`}
                      />

                      {/* Defect Bar */}
                      <div
                        className="w-2.5 sm:w-3 bg-blue-600 rounded-t-xs hover:bg-blue-700 transition-all shadow-xs"
                        style={{ height: `${defectHeight}px` }}
                        title={`Defect Rate: ${item.defectRate}%`}
                      />

                      {/* Rework Bar */}
                      <div
                        className="w-2 sm:w-2.5 bg-amber-500 rounded-t-xs hover:bg-amber-600 transition-all shadow-xs"
                        style={{ height: `${reworkHeight}px` }}
                        title={`Rework Rate: ${item.rework}%`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="absolute left-7 right-0 bottom-0 h-6 flex justify-around items-center px-1 text-[10px] font-bold text-muted-foreground select-none">
            {data.map((item, idx) => (
              <span key={idx} className="flex-1 text-center truncate" title={item.process}>
                {item.process}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProcessPerformanceCard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DefectParetoItem } from "@/services/qualityAnalyticsTypes";

interface TopDefectsTableCardProps {
  defects: DefectParetoItem[];
  onViewAll?: () => void;
}

export function TopDefectsTableCard({
  defects,
  onViewAll,
}: TopDefectsTableCardProps) {
  return (
    <Card className="shadow-xs border-border/80 bg-card overflow-hidden min-w-0 flex flex-col justify-between">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
          Top Defects by Occurrence
        </CardTitle>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col justify-between">
        <div className="w-full">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">Defect</th>
                <th className="py-2.5 px-2 text-right">Count</th>
                <th className="py-2.5 px-2 text-right">%</th>
                <th className="py-2.5 px-3 text-right">Cum. %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-mono text-[11px]">
              {defects.slice(0, 7).map((d) => (
                <tr key={d.rank} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2 px-3 text-center text-muted-foreground font-sans font-medium">
                    {d.rank}
                  </td>
                  <td className="py-2 px-3 font-sans font-semibold text-foreground truncate max-w-[130px]" title={d.defect}>
                    {d.defect}
                  </td>
                  <td className="py-2 px-2 text-right text-foreground font-medium">
                    {d.count}
                  </td>
                  <td className="py-2 px-2 text-right text-muted-foreground">
                    {d.percentage}%
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-amber-600 dark:text-amber-400">
                    {d.cumulativePercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-2.5 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between px-4 bg-muted/10">
          <span>Total Recorded Defect Pcs:</span>
          <span className="font-bold font-mono text-foreground">125 Units</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TopDefectsTableCard;

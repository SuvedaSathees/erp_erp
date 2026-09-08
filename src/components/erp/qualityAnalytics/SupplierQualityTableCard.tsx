import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { SupplierQualityItem } from "@/services/qualityAnalyticsTypes";

interface SupplierQualityTableCardProps {
  suppliers: SupplierQualityItem[];
  onViewAll?: () => void;
}

export function SupplierQualityTableCard({
  suppliers,
  onViewAll,
}: SupplierQualityTableCardProps) {
  return (
    <Card className="shadow-xs border-border/80 bg-card overflow-hidden min-w-0 flex flex-col justify-between">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
          Supplier Quality Performance
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
                <th className="py-2.5 px-3">Supplier</th>
                <th className="py-2.5 px-2 text-right">Lots</th>
                <th className="py-2.5 px-2 text-right">Defects</th>
                <th className="py-2.5 px-2 text-right">PPM</th>
                <th className="py-2.5 px-3 text-center">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-mono text-[11px]">
              {suppliers.slice(0, 5).map((s, idx) => {
                const isHigh = s.qualityScore >= 95.0;
                const isMed = s.qualityScore >= 93.0 && s.qualityScore < 95.0;
                return (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-3 font-sans font-semibold text-foreground truncate max-w-[120px]" title={s.supplier}>
                      {s.supplier}
                    </td>
                    <td className="py-2 px-2 text-right text-foreground">
                      {s.lots}
                    </td>
                    <td className="py-2 px-2 text-right text-rose-600 dark:text-rose-400 font-semibold">
                      {s.defects}
                    </td>
                    <td className="py-2 px-2 text-right text-foreground">
                      {s.ppm.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`font-bold ${
                          isHigh
                            ? "text-emerald-600 dark:text-emerald-400"
                            : isMed
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {s.qualityScore.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-2.5 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between px-4 bg-muted/10">
          <span>Supplier Average Quality Score:</span>
          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">94.4%</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default SupplierQualityTableCard;

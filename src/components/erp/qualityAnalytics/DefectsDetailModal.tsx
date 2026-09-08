import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, ShieldAlert, Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { DefectParetoItem } from "@/services/qualityAnalyticsTypes";
import { toast } from "sonner";

interface DefectsDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defects: DefectParetoItem[];
}

export function DefectsDetailModal({
  open,
  onOpenChange,
  defects,
}: DefectsDetailModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = defects.filter((d) =>
    d.defect.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportList = () => {
    const csvContent =
      "Rank,Defect Description,Count,Percentage,Cumulative Percentage,Severity,Root Cause Category\n" +
      defects
        .map(
          (d) =>
            `${d.rank},"${d.defect}",${d.count},${d.percentage}%,${d.cumulativePercentage}%,${
              d.rank <= 3 ? "Critical" : d.rank <= 6 ? "Major" : "Minor"
            },Man/Method`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `All_Quality_Defects_Catalog_2026.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded Defect Pareto Master Catalog (.csv)");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-slate-50 dark:bg-slate-900/60 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            Complete Quality Defect Pareto Registry
          </DialogTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportList}
            className="h-8 text-xs font-semibold mr-6 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </DialogHeader>

        <div className="p-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search defect category, symptom or keyword..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="rounded-xl border border-border/80 overflow-hidden max-h-[60vh] overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold sticky top-0 bg-background/95 backdrop-blur z-10">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">Rank</th>
                  <th className="py-2.5 px-3">Defect Name & Description</th>
                  <th className="py-2.5 px-3 text-right">Occurrence</th>
                  <th className="py-2.5 px-3 text-right">Share %</th>
                  <th className="py-2.5 px-3 text-right">Cum. %</th>
                  <th className="py-2.5 px-3 text-center">Severity</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono text-xs">
                {filtered.map((d) => {
                  const severity =
                    d.rank <= 2 ? "Critical" : d.rank <= 5 ? "Major" : "Minor";
                  return (
                    <tr key={d.rank} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3 text-center text-muted-foreground font-sans font-bold">
                        #{d.rank}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-foreground">
                        {d.defect}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-foreground">
                        {d.count} pcs
                      </td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground">
                        {d.percentage}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                        {d.cumulativePercentage}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge
                          className={
                            severity === "Critical"
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200"
                              : severity === "Major"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200"
                          }
                        >
                          {severity}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        <button
                          onClick={() => {
                            onOpenChange(false);
                            toast.info(`Initiated CAPA investigation for "${d.defect}"`);
                          }}
                          className="text-[11px] font-semibold text-primary hover:underline"
                        >
                          Create CAPA
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DefectsDetailModal;

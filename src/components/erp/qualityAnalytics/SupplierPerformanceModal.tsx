import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Search, Download, Award, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { SupplierQualityItem } from "@/services/qualityAnalyticsTypes";
import { toast } from "sonner";

interface SupplierPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: SupplierQualityItem[];
}

export function SupplierPerformanceModal({
  open,
  onOpenChange,
  suppliers,
}: SupplierPerformanceModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = suppliers.filter((s) =>
    s.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportSuppliers = () => {
    const csvContent =
      "Supplier Name,Lots Received,Defect Count,PPM,Rejection Percentage,Quality Score %,Audit Rating\n" +
      suppliers
        .map(
          (s) =>
            `"${s.supplier}",${s.lots},${s.defects},${s.ppm},${s.rejectionPercent}%,${s.qualityScore}%,Grade ${
              s.qualityScore >= 95 ? "A" : s.qualityScore >= 92 ? "B" : "C"
            }`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Supplier_Quality_Performance_Full_2026.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded Supplier Quality Performance Scorecard (.csv)");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-slate-50 dark:bg-slate-900/60 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5 text-blue-600" />
            Supplier Quality Rating & PPM Performance Register
          </DialogTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportSuppliers}
            className="h-8 text-xs font-semibold mr-6 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </DialogHeader>

        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by vendor name, lot number or category..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="rounded-xl border border-border/80 overflow-hidden max-h-[60vh] overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold sticky top-0 bg-background/95 backdrop-blur z-10">
                <tr>
                  <th className="py-2.5 px-3">Supplier Name</th>
                  <th className="py-2.5 px-3 text-right">Lots Recv</th>
                  <th className="py-2.5 px-3 text-right">Defective Pcs</th>
                  <th className="py-2.5 px-3 text-right">PPM</th>
                  <th className="py-2.5 px-3 text-right">Rejection %</th>
                  <th className="py-2.5 px-3 text-center">Quality Score</th>
                  <th className="py-2.5 px-3 text-center">Rating Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono text-xs">
                {filtered.map((s, idx) => {
                  const isGradeA = s.qualityScore >= 95.0;
                  const isGradeB = s.qualityScore >= 93.0 && s.qualityScore < 95.0;
                  return (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-semibold text-foreground">
                        {s.supplier}
                      </td>
                      <td className="py-2.5 px-3 text-right text-foreground">
                        {s.lots}
                      </td>
                      <td className="py-2.5 px-3 text-right text-rose-600 dark:text-rose-400 font-bold">
                        {s.defects}
                      </td>
                      <td className="py-2.5 px-3 text-right text-foreground font-medium">
                        {s.ppm.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground">
                        {s.rejectionPercent.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-bold ${
                            isGradeA
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isGradeB
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {s.qualityScore.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge
                          className={
                            isGradeA
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200"
                              : isGradeB
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200"
                          }
                        >
                          {isGradeA ? "Tier 1 (Preferred)" : isGradeB ? "Tier 2 (Standard)" : "Tier 3 (Under Review)"}
                        </Badge>
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

export default SupplierPerformanceModal;

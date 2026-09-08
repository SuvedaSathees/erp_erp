import React, { useState } from "react";
import { ArrowUpRight, History, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { IpqcRecentInspection } from "@/services/ipqcTypes";
import { toast } from "sonner";

interface IpqcRecentInspectionsCardProps {
  inspections: IpqcRecentInspection[];
  onViewAll?: () => void;
}

export const IpqcRecentInspectionsCard: React.FC<IpqcRecentInspectionsCardProps> = ({
  inspections,
  onViewAll,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = inspections.filter(
    (item) =>
      item.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm)
  );

  const handleExportHistory = () => {
    try {
      const lines = [
        "RECENT IN-PROCESS INSPECTIONS LOG",
        `Date,${new Date().toLocaleDateString()}`,
        "",
        "Date,Operation,Qty Inspected,Result,Inspector",
        ...inspections.map(
          (item) => `"${item.date}","${item.operation}",${item.qty},"${item.result}","${item.inspector}"`
        ),
      ];

      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Recent_Inspections_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Downloaded Recent Inspections Log CSV");
    } catch {
      toast.error("Failed to export inspections log");
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 min-w-0">
      <div className="flex items-center justify-between pb-2 border-b border-border/40 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          Recent Inspections
        </h3>
        <button
          type="button"
          onClick={() => {
            if (onViewAll) onViewAll();
            setIsModalOpen(true);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5 cursor-pointer transition-colors shrink-0"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-w-0">
        <table className="w-full text-[11px] text-left">
          <thead className="text-muted-foreground uppercase text-[10px] font-semibold border-b border-border/60">
            <tr>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Operation</th>
              <th className="pb-2 font-medium text-center">Qty</th>
              <th className="pb-2 font-medium text-center">Result</th>
              <th className="pb-2 font-medium">Inspector</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {inspections.slice(0, 5).map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2 font-mono text-muted-foreground whitespace-nowrap">
                  {item.date}
                </td>
                <td className="py-2 font-semibold text-foreground">
                  {item.operation}
                </td>
                <td className="py-2 text-center font-mono font-bold text-foreground">
                  {item.qty}
                </td>
                <td className="py-2 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.result === "Pass"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                        : item.result === "Fail"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200"
                    }`}
                  >
                    {item.result}
                  </span>
                </td>
                <td className="py-2 text-muted-foreground whitespace-nowrap">
                  {item.inspector}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0B3B7B] text-white flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    All In-Process Inspection Records
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground">
                    Shop floor stage-gate execution log across current batch.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportHistory}
                className="h-7 text-xs gap-1 border-border"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by operation or inspector..."
                className="h-8 text-xs pl-8"
              />
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="rounded-lg border border-border/80 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border/60">
                  <tr>
                    <th className="py-2 px-3">Date & Time</th>
                    <th className="py-2 px-3">Operation</th>
                    <th className="py-2 px-3 text-center">Sample Qty</th>
                    <th className="py-2 px-3 text-center">Result</th>
                    <th className="py-2 px-3">Inspector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20">
                      <td className="py-2 px-3 font-mono text-muted-foreground">{item.date}</td>
                      <td className="py-2 px-3 font-semibold text-foreground">{item.operation}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold">{item.qty} Nos</td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.result === "Pass"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {item.result}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">{item.inspector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

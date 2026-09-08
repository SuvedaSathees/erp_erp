import { useState } from "react";
import { Plus, Download, CheckCircle2, XCircle, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FqcCharacteristic } from "@/services/fqcTypes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FqcCharacteristicsTableProps {
  characteristics: FqcCharacteristic[];
  onAddCharacteristic: (char: Omit<FqcCharacteristic, "id" | "seq">) => void;
  onUpdateStatus: (id: string, status: "Pass" | "Fail") => void;
  onExportReport?: () => void;
}

export function FqcCharacteristicsTable({
  characteristics,
  onAddCharacteristic,
  onUpdateStatus,
  onExportReport,
}: FqcCharacteristicsTableProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newChar, setNewChar] = useState<Partial<FqcCharacteristic>>({
    category: "Functional",
    status: "Pass",
    sampleSize: 50,
  });

  const categories = ["All", "Visual", "Dimensional", "Functional", "Electrical", "Safety"];

  const filtered = characteristics.filter((c) => {
    const matchesCat = activeCategory === "All" || c.category === activeCategory;
    const matchesSearch =
      searchTerm.trim() === "" ||
      c.characteristic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.inspectionMethod.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExportTestSheet = () => {
    if (onExportReport) {
      onExportReport();
      return;
    }

    try {
      const lines = [
        "END-OF-LINE QUALITY CHARACTERISTICS TEST SHEET",
        `Export Date,${new Date().toLocaleDateString()}`,
        "",
        "Seq,Characteristic,Category,Specification,Inspection Method,Samples,Actual Result,Status,Remarks",
        ...characteristics.map(
          (c) =>
            `${c.seq},"${c.characteristic}","${c.category}","${c.specification.replace(/"/g, '""')}","${c.inspectionMethod.replace(/"/g, '""')}",${c.sampleSize},"${c.actualMeasured}","${c.status}","${c.remark || ""}"`
        ),
      ];

      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `FQC_Test_Sheet_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Downloaded End-of-Line Quality Characteristics Test Sheet");
    } catch {
      toast.error("Failed to export test sheet");
    }
  };

  const handleSaveChar = () => {
    if (!newChar.characteristic?.trim() || !newChar.specification?.trim()) {
      toast.error("Please fill characteristic name and specification");
      return;
    }

    onAddCharacteristic({
      characteristic: newChar.characteristic.trim(),
      category: (newChar.category as any) || "Functional",
      specification: newChar.specification.trim(),
      nominal: newChar.nominal || "-",
      minTol: newChar.minTol || "-",
      maxTol: newChar.maxTol || "-",
      unit: newChar.unit || "Pass/Fail",
      inspectionMethod: newChar.inspectionMethod?.trim() || "Visual / Digital Calibrated Bench",
      sampleSize: newChar.sampleSize || 50,
      actualMeasured: newChar.actualMeasured?.trim() || "Pass",
      status: (newChar.status as any) || "Pass",
      remark: newChar.remark?.trim(),
    });

    setIsAddOpen(false);
    setNewChar({ category: "Functional", status: "Pass", sampleSize: 50 });
  };

  const handleAutofillSafetySample = () => {
    setNewChar({
      characteristic: "Residual Current Device (RCD) 30mA Trip Time",
      category: "Safety",
      specification: "< 40 ms disconnection at 5x IΔn (150mA)",
      inspectionMethod: "Automated RCD Simulator Bench TST-09",
      sampleSize: 50,
      nominal: "30ms",
      actualMeasured: "28.4 ms (Pass)",
      status: "Pass",
      remark: "Verified compliant with IEC 61008-1",
    });
    toast.info("Sample safety characteristic populated");
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
      {/* Table Header & Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/40 min-w-0">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground">
            End-of-Line Quality Characteristics
          </h2>
          <p className="text-xs text-muted-foreground">
            Mandatory pass-fail criteria for electrical, safety, dimensional, and functional compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportTestSheet}
            className="h-8 text-xs font-medium border-border shadow-xs hover:bg-muted/50"
          >
            <Download className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Export Test Sheet
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-8 text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Check
          </Button>
        </div>
      </div>

      {/* Filter Pills & Search Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0">
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5 min-w-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all shrink-0",
                activeCategory === cat
                  ? "bg-foreground text-background font-semibold"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56 min-w-0">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search checks or specs..."
            className="h-8 text-xs pl-8 min-w-0"
          />
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Table with balanced alignments and smooth scrolling */}
      <div className="w-full overflow-x-auto min-w-0 rounded-xl border border-border/80 shadow-2xs bg-card">
        <table className="w-full text-xs text-left min-w-[840px] border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-slate-50/80 dark:bg-slate-800/60 text-muted-foreground font-bold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-2.5 w-12 text-center font-mono">#</th>
              <th className="py-3 px-3.5 text-left min-w-[170px]">Characteristic</th>
              <th className="py-3 px-3 text-center min-w-[100px]">Category</th>
              <th className="py-3 px-3.5 text-left min-w-[180px]">Specification</th>
              <th className="py-3 px-3 text-left min-w-[140px]">Method / Instrument</th>
              <th className="py-3 px-3 text-center w-20 font-mono">Samples</th>
              <th className="py-3 px-3 text-center min-w-[110px] font-mono">Actual Result</th>
              <th className="py-3 px-3 text-center w-24">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                  No quality characteristics matching the filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors align-middle">
                  <td className="py-3 px-2.5 font-mono text-muted-foreground font-semibold text-center">
                    {item.seq}
                  </td>
                  <td className="py-3 px-3.5 font-semibold text-foreground whitespace-nowrap text-left">
                    <div>{item.characteristic}</div>
                    {item.remark && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal block">
                        {item.remark}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block shadow-2xs",
                        item.category === "Electrical"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200"
                          : item.category === "Safety"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200"
                          : item.category === "Functional"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200"
                          : "bg-muted text-foreground/80 border border-border"
                      )}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-muted-foreground text-left">
                    {item.specification}
                  </td>
                  <td className="py-3 px-3 text-foreground/90 font-mono text-[11px] text-left whitespace-nowrap">
                    {item.inspectionMethod}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-foreground text-center whitespace-nowrap">
                    {item.sampleSize}
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-[11px] text-center whitespace-nowrap">
                    <span
                      className={
                        item.status === "Fail"
                          ? "text-rose-600 dark:text-rose-400 font-bold"
                          : "text-foreground font-bold"
                      }
                    >
                      {item.actualMeasured}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateStatus(item.id, item.status === "Pass" ? "Fail" : "Pass")
                      }
                      className={cn(
                        "inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xs",
                        item.status === "Pass"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse"
                      )}
                      title="Click to toggle Pass/Fail status"
                    >
                      {item.status === "Pass" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                      )}
                      <span>{item.status}</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-sm font-semibold">
                Add Final Quality Characteristic
              </DialogTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutofillSafetySample}
                className="h-6 text-[10px] gap-1 text-primary border-dashed"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                Fill Safety Sample
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Characteristic Name *</Label>
              <Input
                value={newChar.characteristic || ""}
                onChange={(e) => setNewChar({ ...newChar, characteristic: e.target.value })}
                placeholder="e.g. Ground Fault Circuit Interrupter (GFCI)"
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select
                  value={newChar.category || "Functional"}
                  onValueChange={(val: any) => setNewChar({ ...newChar, category: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visual">Visual</SelectItem>
                    <SelectItem value="Dimensional">Dimensional</SelectItem>
                    <SelectItem value="Functional">Functional</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Sample Size</Label>
                <Input
                  type="number"
                  value={newChar.sampleSize || 50}
                  onChange={(e) => setNewChar({ ...newChar, sampleSize: Number(e.target.value) })}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Specification & Tolerance *</Label>
              <Input
                value={newChar.specification || ""}
                onChange={(e) => setNewChar({ ...newChar, specification: e.target.value })}
                placeholder="e.g. Trip current < 20mA within 25ms"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Inspection Tool / Bench</Label>
              <Input
                value={newChar.inspectionMethod || ""}
                onChange={(e) => setNewChar({ ...newChar, inspectionMethod: e.target.value })}
                placeholder="e.g. Automated Hi-Pot Tester TST-005"
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Actual Result</Label>
                <Input
                  value={newChar.actualMeasured || ""}
                  onChange={(e) => setNewChar({ ...newChar, actualMeasured: e.target.value })}
                  placeholder="e.g. 1.42 mA"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Initial Status</Label>
                <Select
                  value={newChar.status || "Pass"}
                  onValueChange={(val: any) => setNewChar({ ...newChar, status: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveChar}
              className="bg-[#0B3B7B] hover:bg-[#092e60] text-white text-xs font-semibold"
            >
              Add Characteristic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  FlaskConical,
  ArrowRight,
} from "lucide-react";
import type { IqcCharacteristic } from "@/services/iqcTypes";
import { toast } from "sonner";

interface IqcCharacteristicsTableProps {
  inspectionNo: string;
  characteristics: IqcCharacteristic[];
  onToggleResult: (seq: number) => void;
  onAddCharacteristic: (newChar: IqcCharacteristic) => void;
  onUpdateCharacteristic: (updated: IqcCharacteristic) => void;
  onDeleteCharacteristic: (seq: number) => void;
  onNextPhase?: () => void;
}

export const IqcCharacteristicsTable: React.FC<IqcCharacteristicsTableProps> = ({
  inspectionNo,
  characteristics,
  onToggleResult,
  onAddCharacteristic,
  onUpdateCharacteristic,
  onDeleteCharacteristic,
  onNextPhase,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<IqcCharacteristic | null>(null);

  // New Characteristic State
  const [newChar, setNewChar] = useState<Omit<IqcCharacteristic, "seq">>({
    characteristic: "",
    specification: "",
    tolerance: "—",
    actual: "",
    unit: "mm",
    method: "Digital Caliper",
    result: "Pass",
    remarks: "Conforming to drawing",
  });

  const handleOpenAdd = () => {
    setNewChar({
      characteristic: "",
      specification: "",
      tolerance: "—",
      actual: "",
      unit: "mm",
      method: "Micrometer",
      result: "Pass",
      remarks: "Within tolerance",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChar.characteristic || !newChar.specification || !newChar.actual) {
      toast.error("Please fill characteristic, specification, and actual measured value");
      return;
    }

    const nextSeq =
      characteristics.length > 0
        ? Math.max(...characteristics.map((c) => c.seq)) + 1
        : 1;

    onAddCharacteristic({
      seq: nextSeq,
      ...newChar,
    });

    toast.success(`Added characteristic "${newChar.characteristic}"`);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChar) return;
    onUpdateCharacteristic(editingChar);
    toast.success(`Updated characteristic "${editingChar.characteristic}"`);
    setEditingChar(null);
  };

  // Real CSV Export of test sheet
  const handleDownloadSheet = () => {
    try {
      const rows = [
        `INCOMING QUALITY INSPECTION TEST SHEET - ${inspectionNo}`,
        `Export Date,${new Date().toLocaleDateString()}`,
        "",
        "Seq,Characteristic,Specification,Tolerance,Actual,Unit,Method,Result,Remarks",
        ...characteristics.map(
          (c) =>
            `${c.seq},"${c.characteristic}","${c.specification}","${c.tolerance}","${c.actual}","${c.unit}","${c.method}","${c.result}","${c.remarks}"`
        ),
      ];

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `IQC_Characteristics_Test_Sheet_${inspectionNo}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported IQC_Characteristics_Test_Sheet_${inspectionNo}.csv`);
    } catch {
      toast.error("Failed to export test sheet");
    }
  };

  const passCount = characteristics.filter((c) => c.result === "Pass").length;
  const failCount = characteristics.filter((c) => c.result === "Fail").length;

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 w-full max-w-full min-w-0">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20 shadow-2xs font-bold text-xs">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <h3 className="text-[15px] font-bold tracking-tight text-foreground whitespace-nowrap">
                Inspection Items
              </h3>
              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                {characteristics.length} Parameters
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {passCount} Pass
              </span>
              {failCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  {failCount} Fail
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any Result badge to toggle Pass/Fail in real time. Calculations update automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-nowrap shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenAdd}
            className="h-8 px-3 text-xs font-semibold gap-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs cursor-pointer rounded-lg active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Add Characteristic</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadSheet}
            className="h-8 px-3 text-xs font-semibold gap-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs cursor-pointer rounded-lg active:scale-[0.98] transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Download</span>
          </Button>
          {onNextPhase && (
            <Button
              size="sm"
              onClick={onNextPhase}
              className="h-8 px-3.5 text-xs font-bold gap-1.5 bg-[#0B3B7B] hover:bg-[#082B5B] text-white shadow-xs rounded-lg active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Next: Defect & NCR</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Button>
          )}
        </div>
      </div>

      {/* Characteristics Table Container with guaranteed visibility */}
      <div className="overflow-x-auto w-full min-w-0 rounded-xl border border-border/80 shadow-2xs bg-card">
        <table className="w-full text-xs text-left min-w-[940px] border-collapse">
          <thead className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-border/80 bg-slate-50/80 dark:bg-slate-800/60">
            <tr>
              <th className="py-3 px-2 w-12 text-center font-mono">#</th>
              <th className="py-3 px-3.5 min-w-[180px] text-left">Characteristic</th>
              <th className="py-3 px-3 min-w-[110px] text-center font-mono">Specification</th>
              <th className="py-3 px-3 min-w-[95px] text-center font-mono">Tolerance</th>
              <th className="py-3 px-3 min-w-[95px] text-center font-mono">Actual</th>
              <th className="py-3 px-2 w-16 text-center">Unit</th>
              <th className="py-3 px-3 min-w-[120px] text-left">Method</th>
              <th className="py-3 px-3 min-w-[110px] text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span>Result</span>
                  <ArrowUpDown className="w-3 h-3 text-blue-600 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-3.5 min-w-[190px] text-left">Remarks</th>
              <th className="py-3 px-3 w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {characteristics.map((char) => (
              <tr
                key={char.seq}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group align-middle"
              >
                <td className="py-3 px-2 text-center font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {char.seq}
                </td>
                <td className="py-3 px-3.5 font-semibold text-foreground whitespace-nowrap text-left">
                  {char.characteristic}
                </td>
                <td className="py-3 px-3 text-center font-mono text-xs text-foreground whitespace-nowrap">
                  {char.specification}
                </td>
                <td className="py-3 px-3 text-center font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {char.tolerance}
                </td>
                <td
                  className={`py-3 px-3 text-center font-mono text-xs whitespace-nowrap ${
                    char.result === "Pass"
                      ? "font-bold text-foreground"
                      : "font-extrabold text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {char.actual}
                </td>
                <td className="py-3 px-2 text-center whitespace-nowrap">
                  {char.unit && char.unit !== "—" && char.unit !== "-" ? (
                    <span className="inline-block font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                      {char.unit}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60 font-mono">&mdash;</span>
                  )}
                </td>
                <td className="py-3 px-3 text-left text-muted-foreground font-medium whitespace-nowrap">
                  {char.method}
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onToggleResult(char.seq)}
                    title="Click to toggle Pass / Fail"
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xs ${
                      char.result === "Pass"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-800 animate-pulse"
                    }`}
                  >
                    {char.result === "Pass" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    )}
                    <span>{char.result}</span>
                  </button>
                </td>
                <td className="py-3 px-3.5 text-left text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">
                  {char.remarks}
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingChar(char)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                      title="Edit Characteristic"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCharacteristic(char.seq)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete Characteristic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Characteristic Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg w-full p-5 bg-card border border-border shadow-xl rounded-xl">
          <DialogHeader className="pb-2 border-b border-border">
            <DialogTitle className="text-sm font-bold text-foreground">
              Add Inspection Characteristic
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define target parameter specification, nominal tolerance, and inspection methodology.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNew} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Characteristic Name *</Label>
              <Input
                value={newChar.characteristic}
                onChange={(e) => setNewChar({ ...newChar, characteristic: e.target.value })}
                placeholder="e.g. Rotor Core Length"
                required
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Specification *</Label>
                <Input
                  value={newChar.specification}
                  onChange={(e) => setNewChar({ ...newChar, specification: e.target.value })}
                  placeholder="e.g. 50.00"
                  required
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Tolerance</Label>
                <Input
                  value={newChar.tolerance}
                  onChange={(e) => setNewChar({ ...newChar, tolerance: e.target.value })}
                  placeholder="e.g. ±0.05"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Actual Reading *</Label>
                <Input
                  value={newChar.actual}
                  onChange={(e) => setNewChar({ ...newChar, actual: e.target.value })}
                  placeholder="e.g. 50.02"
                  required
                  className="h-8 text-xs font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Unit</Label>
                <Input
                  value={newChar.unit}
                  onChange={(e) => setNewChar({ ...newChar, unit: e.target.value })}
                  placeholder="mm, V, A, MΩ"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Method / Tool</Label>
                <Input
                  value={newChar.method}
                  onChange={(e) => setNewChar({ ...newChar, method: e.target.value })}
                  placeholder="e.g. Vernier Caliper"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Result</Label>
                <Select
                  value={newChar.result}
                  onValueChange={(val: "Pass" | "Fail") => setNewChar({ ...newChar, result: val })}
                >
                  <SelectTrigger className="h-8 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Remarks / Observations</Label>
              <Input
                value={newChar.remarks}
                onChange={(e) => setNewChar({ ...newChar, remarks: e.target.value })}
                placeholder="Within tolerance"
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white"
              >
                Add Parameter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Characteristic Modal */}
      {editingChar && (
        <Dialog open={!!editingChar} onOpenChange={(open) => !open && setEditingChar(null)}>
          <DialogContent className="max-w-lg w-full p-5 bg-card border border-border shadow-xl rounded-xl">
            <DialogHeader className="pb-2 border-b border-border">
              <DialogTitle className="text-sm font-bold text-foreground">
                Edit Characteristic #{editingChar.seq} - {editingChar.characteristic}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Modify measured value, inspection method, result verdict, or remarks.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Characteristic Name</Label>
                <Input
                  value={editingChar.characteristic}
                  onChange={(e) => setEditingChar({ ...editingChar, characteristic: e.target.value })}
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground">Specification</Label>
                  <Input
                    value={editingChar.specification}
                    onChange={(e) => setEditingChar({ ...editingChar, specification: e.target.value })}
                    required
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground">Tolerance</Label>
                  <Input
                    value={editingChar.tolerance}
                    onChange={(e) => setEditingChar({ ...editingChar, tolerance: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground">Actual Value</Label>
                  <Input
                    value={editingChar.actual}
                    onChange={(e) => setEditingChar({ ...editingChar, actual: e.target.value })}
                    required
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground">Result</Label>
                  <Select
                    value={editingChar.result}
                    onValueChange={(val: "Pass" | "Fail") =>
                      setEditingChar({ ...editingChar, result: val })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Pass">Pass</SelectItem>
                      <SelectItem value="Fail">Fail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Remarks</Label>
                <Input
                  value={editingChar.remarks}
                  onChange={(e) => setEditingChar({ ...editingChar, remarks: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingChar(null)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

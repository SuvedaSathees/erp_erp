import React, { useState } from "react";
import { Plus, Download, Upload, Edit2, Trash2, Check, X, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IpqcCharacteristic } from "@/services/ipqcTypes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface IpqcCharacteristicsTableProps {
  characteristics: IpqcCharacteristic[];
  onAddCharacteristic: (char: Omit<IpqcCharacteristic, "id" | "seq">) => void;
  onUpdateCharacteristic: (id: string, updates: Partial<IpqcCharacteristic>) => void;
  onDeleteCharacteristic: (id: string) => void;
  onExport?: () => void;
  onImport?: () => void;
}

export const IpqcCharacteristicsTable: React.FC<IpqcCharacteristicsTableProps> = ({
  characteristics,
  onAddCharacteristic,
  onUpdateCharacteristic,
  onDeleteCharacteristic,
  onExport,
  onImport,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editActual, setEditActual] = useState("");
  const [editResult, setEditResult] = useState<"Pass" | "Fail" | "Conditional">("Pass");
  const [editRemarks, setEditRemarks] = useState("");

  // New Characteristic Form State
  const [newChar, setNewChar] = useState({
    characteristic: "",
    specification: "",
    tolerance: "—",
    actual: "",
    unit: "—",
    method: "Visual",
    result: "Pass" as "Pass" | "Fail" | "Conditional",
    remarks: "OK",
  });

  const handleStartEdit = (char: IpqcCharacteristic) => {
    setEditingId(char.id);
    setEditActual(char.actual);
    setEditResult(char.result);
    setEditRemarks(char.remarks);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateCharacteristic(id, {
      actual: editActual,
      result: editResult,
      remarks: editRemarks,
    });
    setEditingId(null);
  };

  const handleCreateNew = () => {
    if (!newChar.characteristic.trim()) {
      toast.error("Characteristic Name is required");
      return;
    }
    onAddCharacteristic(newChar);
    setNewChar({
      characteristic: "",
      specification: "",
      tolerance: "—",
      actual: "",
      unit: "—",
      method: "Visual",
      result: "Pass",
      remarks: "OK",
    });
    setIsModalOpen(false);
  };

  const handleExportCsv = () => {
    if (onExport) {
      onExport();
      return;
    }

    try {
      const lines = [
        "IN-PROCESS QUALITY INSPECTION RESULTS",
        `Date,${new Date().toLocaleDateString()}`,
        "",
        "Seq,Characteristic,Specification,Tolerance,Actual,Unit,Method,Result,Remarks",
        ...characteristics.map(
          (c) =>
            `${c.seq},"${c.characteristic}","${c.specification}","${c.tolerance}","${c.actual}","${c.unit}","${c.method}","${c.result}","${c.remarks}"`
        ),
      ];

      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `IPQC_Characteristics_Test_Sheet_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Downloaded In-Process Inspection Results Test Sheet");
    } catch {
      toast.error("Failed to export test sheet");
    }
  };

  const handleImportTemplate = () => {
    if (onImport) {
      onImport();
      return;
    }
    toast.success("Standard Cable Termination inspection template imported");
  };

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40 min-w-0">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            In-Process Inspection Results
          </h3>
          <p className="text-xs text-muted-foreground">
            Operation characteristics, tolerance bands, and actual measured results.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 text-xs font-semibold gap-1.5 bg-[#0B3B7B] hover:bg-[#092e60] text-white cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Characteristic</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleImportTemplate}
            className="h-8 text-xs font-semibold gap-1.5 border-border hover:bg-muted cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Import</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="h-8 text-xs font-semibold gap-1.5 border-border hover:bg-muted cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Table with balanced alignments and smooth scrolling */}
      <div className="w-full overflow-x-auto min-w-0 rounded-xl border border-border/80 shadow-2xs bg-card">
        <table className="w-full text-xs text-left min-w-[860px] border-collapse">
          <thead className="text-[11px] font-bold text-muted-foreground uppercase bg-slate-50/80 dark:bg-slate-800/60 border-b border-border/80">
            <tr>
              <th className="py-3 px-2.5 w-12 text-center font-mono">#</th>
              <th className="py-3 px-3.5 min-w-[170px] text-left">Characteristic</th>
              <th className="py-3 px-3 min-w-[110px] text-center font-mono">Specification</th>
              <th className="py-3 px-3 min-w-[95px] text-center font-mono">Tolerance</th>
              <th className="py-3 px-3 min-w-[95px] text-center font-mono">Actual</th>
              <th className="py-3 px-2.5 w-16 text-center">Unit</th>
              <th className="py-3 px-3 min-w-[110px] text-left">Method</th>
              <th className="py-3 px-3 min-w-[110px] text-center">Result</th>
              <th className="py-3 px-3.5 min-w-[160px] text-left">Remarks</th>
              <th className="py-3 px-3 text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {characteristics.map((char) => {
              const isEditing = editingId === char.id;

              return (
                <tr key={char.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors align-middle">
                  <td className="py-3 px-2.5 text-center font-mono text-muted-foreground font-semibold">
                    {char.seq}
                  </td>
                  <td className="py-3 px-3.5 font-semibold text-foreground whitespace-nowrap text-left">
                    {char.characteristic}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-foreground whitespace-nowrap">
                    {char.specification}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-muted-foreground whitespace-nowrap">
                    {char.tolerance}
                  </td>

                  {/* Actual Column */}
                  <td className="py-3 px-3 text-center font-mono font-bold text-foreground whitespace-nowrap">
                    {isEditing ? (
                      <Input
                        value={editActual}
                        onChange={(e) => setEditActual(e.target.value)}
                        className="h-7 text-xs w-24 font-mono mx-auto"
                      />
                    ) : (
                      char.actual
                    )}
                  </td>

                  <td className="py-3 px-2.5 text-center whitespace-nowrap">
                    {char.unit && char.unit !== "—" && char.unit !== "-" ? (
                      <span className="inline-block font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                        {char.unit}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60 font-mono">&mdash;</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-left text-muted-foreground whitespace-nowrap">
                    {char.method}
                  </td>

                  {/* Result Column with click toggle */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {isEditing ? (
                      <Select
                        value={editResult}
                        onValueChange={(val: any) => setEditResult(val)}
                      >
                        <SelectTrigger className="h-7 text-xs w-24 mx-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="text-xs">
                          <SelectItem value="Pass">Pass</SelectItem>
                          <SelectItem value="Fail">Fail</SelectItem>
                          <SelectItem value="Conditional">Conditional</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const nextResult = char.result === "Pass" ? "Fail" : "Pass";
                          onUpdateCharacteristic(char.id, { result: nextResult });
                        }}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xs",
                          char.result === "Pass"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : char.result === "Fail"
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                        )}
                        title="Click to toggle Pass / Fail"
                      >
                        {char.result === "Pass" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : char.result === "Fail" ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        ) : null}
                        <span>{char.result}</span>
                      </button>
                    )}
                  </td>

                  {/* Remarks */}
                  <td className="py-3 px-3.5 text-left text-muted-foreground whitespace-nowrap">
                    {isEditing ? (
                      <Input
                        value={editRemarks}
                        onChange={(e) => setEditRemarks(e.target.value)}
                        className="h-7 text-xs w-36"
                      />
                    ) : (
                      char.remarks
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleSaveEdit(char.id)}
                          className="text-emerald-600 hover:text-emerald-700 p-1 cursor-pointer"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStartEdit(char)}
                          className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCharacteristic(char.id)}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">
              Add Inspection Characteristic
            </DialogTitle>
            <DialogDescription className="text-xs">
              Define parameter tolerances and verification method for current operation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 text-xs py-2">
            <div className="col-span-2 space-y-1">
              <Label className="text-[11px]">Characteristic Name *</Label>
              <Input
                value={newChar.characteristic}
                onChange={(e) => setNewChar({ ...newChar, characteristic: e.target.value })}
                placeholder="e.g. Crimp Pull Force"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Specification *</Label>
              <Input
                value={newChar.specification}
                onChange={(e) => setNewChar({ ...newChar, specification: e.target.value })}
                placeholder="e.g. ≥ 150 N"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Tolerance</Label>
              <Input
                value={newChar.tolerance}
                onChange={(e) => setNewChar({ ...newChar, tolerance: e.target.value })}
                placeholder="e.g. ±5 N"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Actual Value</Label>
              <Input
                value={newChar.actual}
                onChange={(e) => setNewChar({ ...newChar, actual: e.target.value })}
                placeholder="e.g. 162"
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Unit</Label>
              <Input
                value={newChar.unit}
                onChange={(e) => setNewChar({ ...newChar, unit: e.target.value })}
                placeholder="e.g. N, mm, V"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Method</Label>
              <Input
                value={newChar.method}
                onChange={(e) => setNewChar({ ...newChar, method: e.target.value })}
                placeholder="e.g. Pull Tester"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Result</Label>
              <Select
                value={newChar.result}
                onValueChange={(val: any) => setNewChar({ ...newChar, result: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                  <SelectItem value="Conditional">Conditional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1">
              <Label className="text-[11px]">Remarks</Label>
              <Input
                value={newChar.remarks}
                onChange={(e) => setNewChar({ ...newChar, remarks: e.target.value })}
                placeholder="e.g. Within specification"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateNew}
              className="h-8 text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white font-semibold cursor-pointer"
            >
              Add Characteristic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

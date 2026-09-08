import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Download,
  Edit2,
  ListTodo,
} from "lucide-react";
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
import type { ApqpDeliverable } from "@/services/types";
import { toast } from "sonner";

interface ApqpDeliverablesTableProps {
  deliverables: ApqpDeliverable[];
  onUpdateDeliverables?: (updated: ApqpDeliverable[]) => void;
  onViewAll?: () => void;
}

export const ApqpDeliverablesTable: React.FC<ApqpDeliverablesTableProps> = ({
  deliverables,
  onUpdateDeliverables,
  onViewAll,
}) => {
  const [editingItem, setEditingItem] = useState<ApqpDeliverable | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState<Partial<ApqpDeliverable>>({
    phaseNumber: 3,
    phaseName: "Phase 3: Process Design & Development",
    keyDeliverables: "",
    owner: "Vikram Singh",
    targetDate: "30 Jun 2024",
    status: "In Progress",
    completionPercentage: 50,
  });

  const handleExportCsv = () => {
    const lines = [
      "APQP PHASE DELIVERABLES & EXECUTION REGISTER",
      `Export Date,${new Date().toLocaleDateString()}`,
      "",
      "Phase,Phase Name,Key Deliverables,Owner,Target Date,Status,Completion %",
      ...deliverables.map(
        (d) =>
          `Phase ${d.phaseNumber},"${d.phaseName}","${d.keyDeliverables}","${d.owner}","${d.targetDate}","${d.status}",${d.completionPercentage}%`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `APQP_Deliverables_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported APQP Deliverables CSV");
  };

  const handleToggleStatus = (phaseNumber: number) => {
    const updated = deliverables.map((d) => {
      if (d.phaseNumber === phaseNumber) {
        const nextStatus: ApqpDeliverable["status"] =
          d.status === "Completed"
            ? "In Progress"
            : d.status === "In Progress"
            ? "Pending"
            : "Completed";
        const nextPct = nextStatus === "Completed" ? 100 : nextStatus === "In Progress" ? 65 : 0;
        return {
          ...d,
          status: nextStatus,
          completionPercentage: nextPct,
        };
      }
      return d;
    });

    onUpdateDeliverables?.(updated);
    toast.success(`Updated Phase ${phaseNumber} deliverable status`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = deliverables.map((d) =>
      d.phaseNumber === editingItem.phaseNumber ? editingItem : d
    );
    onUpdateDeliverables?.(updated);
    toast.success(`Updated Phase ${editingItem.phaseNumber} deliverables`);
    setEditingItem(null);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeliverable.keyDeliverables) {
      toast.error("Please enter key deliverables text");
      return;
    }

    const newItem: ApqpDeliverable = {
      phaseNumber: newDeliverable.phaseNumber || (deliverables.length + 1),
      phaseName: `Phase ${newDeliverable.phaseNumber || deliverables.length + 1}`,
      keyDeliverables: newDeliverable.keyDeliverables || "",
      owner: newDeliverable.owner || "Quality Engineer",
      targetDate: newDeliverable.targetDate || "30 Jun 2024",
      status: (newDeliverable.status as any) || "In Progress",
      completionPercentage: newDeliverable.completionPercentage || 50,
    };

    onUpdateDeliverables?.([...deliverables, newItem]);
    toast.success("Added new APQP deliverable");
    setIsAddOpen(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden text-xs w-full min-w-0">
      <div className="p-3.5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            <ListTodo className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">Phase Key Deliverables</h2>
              <span className="text-xs text-muted-foreground font-normal">
                ({deliverables.length} APQP Phases)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Click status badges to toggle completion state, or click Edit to modify parameters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsAddOpen(true)}
            className="h-8 text-xs font-semibold gap-1.5 border-border"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Add Deliverable</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="h-8 text-xs font-semibold gap-1.5 border-border"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full min-w-0">
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 w-24">Phase</th>
              <th className="py-2.5 px-3 min-w-[200px]">Key Deliverables</th>
              <th className="py-2.5 px-3 w-40">Owner</th>
              <th className="py-2.5 px-3 w-28">Target Date</th>
              <th className="py-2.5 px-3 text-center w-28">Status ⇅</th>
              <th className="py-2.5 px-3 w-36">Completion %</th>
              <th className="py-2.5 px-3 text-center w-14">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {deliverables.map((d) => (
              <tr key={d.phaseNumber} className="hover:bg-muted/30 transition-colors group">
                <td className="py-2.5 px-3 font-bold text-foreground">
                  Phase {d.phaseNumber}
                </td>
                <td className="py-2.5 px-3 font-semibold text-foreground">
                  {d.keyDeliverables}
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#0B3B7B]/15 text-[#0B3B7B] dark:text-blue-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {d.owner
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="truncate font-medium text-foreground">{d.owner}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px]">
                  {d.targetDate}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(d.phaseNumber)}
                    title="Click to cycle status: Completed -> In Progress -> Pending"
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xs ${
                      d.status === "Completed"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        : d.status === "In Progress"
                        ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {d.status === "Completed" && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                    {d.status === "In Progress" && <Clock className="w-3 h-3 shrink-0" />}
                    {d.status === "Pending" && <AlertCircle className="w-3 h-3 shrink-0" />}
                    <span>{d.status}</span>
                  </button>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          d.completionPercentage === 100
                            ? "bg-emerald-500"
                            : d.completionPercentage > 0
                            ? "bg-blue-500"
                            : "bg-muted-foreground/30"
                        }`}
                        style={{ width: `${d.completionPercentage}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-foreground text-[10px] w-8 text-right">
                      {d.completionPercentage}%
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => setEditingItem(d)}
                    className="p-1 text-blue-600 hover:text-blue-700 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                    title="Edit Deliverable"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="max-w-md w-full p-5 bg-card border border-border shadow-xl rounded-xl">
            <DialogHeader className="pb-2 border-b border-border">
              <DialogTitle className="text-sm font-bold text-foreground">
                Edit Phase {editingItem.phaseNumber} Deliverables
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Adjust key deliverables, responsible owner, target milestone date, and progress.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Key Deliverables *</Label>
                <Input
                  value={editingItem.keyDeliverables}
                  onChange={(e) => setEditingItem({ ...editingItem, keyDeliverables: e.target.value })}
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground">Owner</Label>
                  <Input
                    value={editingItem.owner}
                    onChange={(e) => setEditingItem({ ...editingItem, owner: e.target.value })}
                    required
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground">Target Date</Label>
                  <Input
                    value={editingItem.targetDate}
                    onChange={(e) => setEditingItem({ ...editingItem, targetDate: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground">Status</Label>
                  <Select
                    value={editingItem.status}
                    onValueChange={(val: any) => setEditingItem({ ...editingItem, status: val })}
                  >
                    <SelectTrigger className="h-8 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground">Completion %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editingItem.completionPercentage}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        completionPercentage: parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white"
                >
                  Save Deliverable
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md w-full p-5 bg-card border border-border shadow-xl rounded-xl">
          <DialogHeader className="pb-2 border-b border-border">
            <DialogTitle className="text-sm font-bold text-foreground">
              Add APQP Deliverable
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define required deliverable milestone for program tracking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNew} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Deliverables Summary *</Label>
              <Input
                value={newDeliverable.keyDeliverables}
                onChange={(e) => setNewDeliverable({ ...newDeliverable, keyDeliverables: e.target.value })}
                placeholder="e.g. Line 2 Heat Run Thermal Profiling"
                required
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Owner</Label>
                <Input
                  value={newDeliverable.owner}
                  onChange={(e) => setNewDeliverable({ ...newDeliverable, owner: e.target.value })}
                  placeholder="e.g. S. Swaminathan"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Target Date</Label>
                <Input
                  value={newDeliverable.targetDate}
                  onChange={(e) => setNewDeliverable({ ...newDeliverable, targetDate: e.target.value })}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Phase Target</Label>
                <Select
                  value={String(newDeliverable.phaseNumber || 3)}
                  onValueChange={(val) =>
                    setNewDeliverable({ ...newDeliverable, phaseNumber: parseInt(val) })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="1">Phase 1: Program Definition</SelectItem>
                    <SelectItem value="2">Phase 2: Product Design</SelectItem>
                    <SelectItem value="3">Phase 3: Process Design</SelectItem>
                    <SelectItem value="4">Phase 4: Validation & PPAP</SelectItem>
                    <SelectItem value="5">Phase 5: Launch & SOP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground">Completion %</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={newDeliverable.completionPercentage}
                  onChange={(e) =>
                    setNewDeliverable({
                      ...newDeliverable,
                      completionPercentage: parseInt(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white"
              >
                Add Deliverable
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

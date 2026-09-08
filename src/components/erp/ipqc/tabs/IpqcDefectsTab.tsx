import React, { useState } from "react";
import { AlertCircle, Plus, ShieldAlert, CheckSquare } from "lucide-react";
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
import type { IpqcDefect } from "@/services/ipqcTypes";

interface IpqcDefectsTabProps {
  defects: IpqcDefect[];
  onAddDefect: (defect: Omit<IpqcDefect, "id">) => void;
}

export const IpqcDefectsTab: React.FC<IpqcDefectsTabProps> = ({ defects, onAddDefect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDefect, setNewDefect] = useState({
    defectCode: "D-003",
    description: "",
    operation: "OP-30",
    characteristic: "Torque",
    quantity: 1,
    severity: "Major" as "Critical" | "Major" | "Minor",
    category: "Process" as "Dimensional" | "Visual" | "Functional" | "Process",
    suspectedCause: "",
    detectionMethod: "Gauge",
    ncrRequired: true,
    reworkRequired: false,
    actionTaken: "Quarantined and reported to supervisor",
  });

  const handleCreate = () => {
    if (!newDefect.description) return;
    onAddDefect(newDefect);
    setNewDefect({
      defectCode: `D-00${defects.length + 2}`,
      description: "",
      operation: "OP-30",
      characteristic: "Torque",
      quantity: 1,
      severity: "Major",
      category: "Process",
      suspectedCause: "",
      detectionMethod: "Gauge",
      ncrRequired: true,
      reworkRequired: false,
      actionTaken: "Quarantined",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>In-Process Defect Register & Quarantine Actions</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Non-conforming items logged during operation checks with root-cause categorization and containment.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="h-8 text-xs font-semibold gap-1.5 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Defect</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] font-semibold text-muted-foreground uppercase border-b border-border/60">
            <tr>
              <th className="pb-2.5 px-3">Code</th>
              <th className="pb-2.5 px-3">Description</th>
              <th className="pb-2.5 px-3">Operation</th>
              <th className="pb-2.5 px-3">Category</th>
              <th className="pb-2.5 px-3 text-center">Qty</th>
              <th className="pb-2.5 px-3 text-center">Severity</th>
              <th className="pb-2.5 px-3">Suspected Cause</th>
              <th className="pb-2.5 px-3">Action Taken</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {defects.map((def) => (
              <tr key={def.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-rose-600">
                  {def.defectCode}
                </td>
                <td className="py-3 px-3 font-semibold text-foreground">
                  {def.description}
                </td>
                <td className="py-3 px-3 font-mono text-muted-foreground">
                  {def.operation}
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  {def.category}
                </td>
                <td className="py-3 px-3 text-center font-bold text-foreground font-mono">
                  {def.quantity}
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      def.severity === "Critical"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        : def.severity === "Major"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    }`}
                  >
                    {def.severity}
                  </span>
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  {def.suspectedCause}
                </td>
                <td className="py-3 px-3 text-muted-foreground font-medium">
                  {def.actionTaken}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Defect Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Log Manufacturing Defect</DialogTitle>
            <DialogDescription className="text-xs">
              Record non-conforming part observation and route for containment.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 text-xs py-2">
            <div className="space-y-1">
              <Label className="text-[11px]">Defect Code</Label>
              <Input
                value={newDefect.defectCode}
                disabled
                className="h-8 text-xs font-mono bg-muted/40"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Severity</Label>
              <Select
                value={newDefect.severity}
                onValueChange={(val: any) => setNewDefect({ ...newDefect, severity: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1">
              <Label className="text-[11px]">Defect Description *</Label>
              <Input
                value={newDefect.description}
                onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                placeholder="e.g. Loose connector pin detected on terminal"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Category</Label>
              <Select
                value={newDefect.category}
                onValueChange={(val: any) => setNewDefect({ ...newDefect, category: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Dimensional">Dimensional</SelectItem>
                  <SelectItem value="Visual">Visual</SelectItem>
                  <SelectItem value="Functional">Functional</SelectItem>
                  <SelectItem value="Process">Process</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Defect Quantity</Label>
              <Input
                type="number"
                value={newDefect.quantity}
                onChange={(e) => setNewDefect({ ...newDefect, quantity: parseInt(e.target.value) || 1 })}
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <Label className="text-[11px]">Suspected Root Cause</Label>
              <Input
                value={newDefect.suspectedCause}
                onChange={(e) => setNewDefect({ ...newDefect, suspectedCause: e.target.value })}
                placeholder="e.g. Tooling alignment offset"
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
              onClick={handleCreate}
              className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
            >
              Log Defect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

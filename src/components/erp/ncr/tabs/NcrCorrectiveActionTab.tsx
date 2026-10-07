import { useState } from "react";
import { Wrench, Plus, Sparkles, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { NcrRecord, NcrCorrectiveActionItem } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrCorrectiveActionTabProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
  onCreateCapa?: () => void;
}

export function NcrCorrectiveActionTab({
  record,
  onChange,
  onCreateCapa,
}: NcrCorrectiveActionTabProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAction, setNewAction] = useState<Partial<NcrCorrectiveActionItem>>({
    actionType: "Process",
    priority: "Medium",
    status: "Open",
  });

  const handleAddAction = () => {
    if (!newAction.actionRequired) {
      toast.error("Please enter corrective action description");
      return;
    }

    const item: NcrCorrectiveActionItem = {
      id: `ca-${Date.now()}`,
      actionId: `CA-2026-00${Math.floor(97 + Math.random() * 20)}`,
      rootCause: newAction.rootCause || "General process issue",
      actionRequired: newAction.actionRequired || "",
      actionType: newAction.actionType || "Process",
      owner: newAction.owner || "Quality Team",
      targetDate: newAction.targetDate || "15-Sep-2026",
      priority: newAction.priority || "Medium",
      requiredResources: newAction.requiredResources || "Standard",
      estimatedCost: newAction.estimatedCost || "₹1,000",
      status: "Open",
    };

    onChange({ correctiveActions: [...record.correctiveActions, item] });
    setIsAddOpen(false);
    setNewAction({ actionType: "Process", priority: "Medium", status: "Open" });
    toast.success(`Corrective Action ${item.actionId} logged`);
  };

  const handleToggleStatus = (id: string) => {
    const updated = record.correctiveActions.map((ca) => {
      if (ca.id === id) {
        const nextStatus =
          ca.status === "Open"
            ? "In Progress"
            : ca.status === "In Progress"
            ? "Completed"
            : "Open";
        return { ...ca, status: nextStatus as any };
      }
      return ca;
    });
    onChange({ correctiveActions: updated });
  };

  return (
    <div className="space-y-5">
      {/* Action Register Card */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Section 9: Corrective Action Register
              </h3>
              <p className="text-xs text-muted-foreground">
                Assigned corrective actions to eliminate identified root causes and prevent recurrence.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Corrective Action
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                <th className="py-2 px-3">Action ID</th>
                <th className="py-2 px-3">Root Cause</th>
                <th className="py-2 px-3">Corrective Action Required</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Owner</th>
                <th className="py-2 px-3">Due Date</th>
                <th className="py-2 px-3">Cost</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {record.correctiveActions.map((ca) => (
                <tr key={ca.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                    {ca.actionId}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground max-w-[160px] truncate">
                    {ca.rootCause}
                  </td>
                  <td className="py-2.5 px-3 text-foreground font-medium max-w-[280px]">
                    {ca.actionRequired}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground/80">
                      {ca.actionType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    {ca.owner}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-muted-foreground">
                    {ca.targetDate}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-foreground">
                    {ca.estimatedCost}
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(ca.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        ca.status === "Completed"
                          ? "bg-emerald-600 text-white"
                          : ca.status === "In Progress"
                          ? "bg-blue-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                      title="Click to cycle status"
                    >
                      {ca.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 10: Preventive Action / CAPA Escalation Card */}
      <div className="bg-gradient-to-r from-blue-500/10 via-card to-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-900/50 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary text-white flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Section 10: Systemic Root Cause & CAPA Linkage
              </h3>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl">
              When non-conformances stem from systemic, design, or repeated operational vulnerabilities, Magnertia ERP mandates formal CAPA elevation.
            </p>
          </div>

          <Button
            size="sm"
            onClick={onCreateCapa}
            className="bg-primary hover:bg-primary text-white font-semibold text-xs shadow-xs shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {record.capaStatus === "Not Created" ? "Generate CAPA Record" : `View CAPA (${record.relatedCapaId || "CAPA-2026-0024"})`}
          </Button>
        </div>
      </div>

      {/* Modal: Add Corrective Action */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              Add Corrective Action
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Corrective Action Description</Label>
              <Textarea
                rows={2}
                value={newAction.actionRequired || ""}
                onChange={(e) => setNewAction({ ...newAction, actionRequired: e.target.value })}
                placeholder="Specific countermeasure to be implemented..."
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Linked Root Cause</Label>
                <Input
                  value={newAction.rootCause || ""}
                  onChange={(e) => setNewAction({ ...newAction, rootCause: e.target.value })}
                  placeholder="e.g. Locator pin burrs"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Action Type</Label>
                <Select
                  value={newAction.actionType || "Process"}
                  onValueChange={(val: any) => setNewAction({ ...newAction, actionType: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Process">Process</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Action Owner</Label>
                <Input
                  value={newAction.owner || ""}
                  onChange={(e) => setNewAction({ ...newAction, owner: e.target.value })}
                  placeholder="e.g. Suresh M"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Target Date</Label>
                <Input
                  value={newAction.targetDate || ""}
                  onChange={(e) => setNewAction({ ...newAction, targetDate: e.target.value })}
                  placeholder="DD-MMM-YYYY"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Estimated Cost</Label>
                <Input
                  value={newAction.estimatedCost || ""}
                  onChange={(e) => setNewAction({ ...newAction, estimatedCost: e.target.value })}
                  placeholder="₹ Cost"
                  className="h-8 text-xs"
                />
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
              onClick={handleAddAction}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Add Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

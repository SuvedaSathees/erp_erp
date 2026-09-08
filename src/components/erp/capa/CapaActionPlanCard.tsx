import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  ListOrdered,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import { CapaActionItem } from "@/services/capaTypes";
import { toast } from "sonner";

interface CapaActionPlanCardProps {
  actions: CapaActionItem[];
  onToggleStatus?: (id: string) => void;
  onAddAction?: (newAction: CapaActionItem) => void;
  onDeleteAction?: (id: string) => void;
}

export function CapaActionPlanCard({
  actions,
  onToggleStatus,
  onAddAction,
  onDeleteAction,
}: CapaActionPlanCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<CapaActionItem["actionType"]>("Corrective Action");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("Rajesh Kumar");
  const [department, setDepartment] = useState("Maintenance Engineering");
  const [dueDate, setDueDate] = useState("20-Sep-2026");
  const [evidenceNote, setEvidenceNote] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please enter a task description");
      return;
    }

    const newAction: CapaActionItem = {
      id: `act-${Date.now()}`,
      actionType,
      description: description.trim(),
      assignedTo: assignedTo.trim() || "Unassigned",
      department: department.trim() || "Operations",
      targetDate: dueDate || "30-Sep-2026",
      status: "Open",
      evidenceNote: evidenceNote.trim() || "Action initiated; awaiting task evidence submission.",
    };

    if (onAddAction) {
      onAddAction(newAction);
    }
    toast.success(`Added ${actionType} item to plan`);
    setModalOpen(false);
    setDescription("");
    setEvidenceNote("");
  };

  const handleDelete = (id: string, desc: string) => {
    if (actions.length <= 1) {
      toast.error("At least one action item must remain in the plan");
      return;
    }
    if (onDeleteAction) {
      onDeleteAction(id);
    }
    toast.success(`Removed task: ${desc.slice(0, 25)}...`);
  };

  const getBadge = (status: CapaActionItem["status"]) => {
    switch (status) {
      case "Verified":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] py-0 px-2 font-medium cursor-pointer">
            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
            Verified
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] py-0 px-2 font-medium cursor-pointer">
            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] py-0 px-2 font-medium cursor-pointer">
            <PlayCircle className="w-2.5 h-2.5 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] py-0 px-2 font-medium text-muted-foreground cursor-pointer hover:bg-muted">
            <Clock className="w-2.5 h-2.5 mr-1" />
            Open
          </Badge>
        );
    }
  };

  const completedCount = actions.filter(
    (a) => a.status === "Verified" || a.status === "Completed"
  ).length;

  return (
    <>
      <Card className="shadow-xs border-border/80 min-w-0">
        <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-4 w-4 text-primary shrink-0" />
            <CardTitle className="text-base font-semibold text-foreground">
              Action Plan & Implementation Tasks
            </CardTitle>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              ({completedCount} of {actions.length} Executed)
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setModalOpen(true)}
            className="h-7 text-xs px-2.5 font-medium border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Action Task
          </Button>
        </CardHeader>

        <CardContent className="pt-2 p-0 min-w-0">
          <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-w-0">
            <table className="w-full text-xs text-left min-w-[700px]">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-32">Action Type</th>
                  <th className="py-2.5 px-3">Description & Tasks</th>
                  <th className="py-2.5 px-3 w-40">Assignee / Dept</th>
                  <th className="py-2.5 px-3 w-24">Due Date</th>
                  <th className="py-2.5 px-3 text-center w-28">Status</th>
                  <th className="py-2.5 px-3">Objective Evidence</th>
                  <th className="py-2.5 px-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {actions.map((act) => (
                  <tr key={act.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                          act.actionType === "Containment"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            : act.actionType === "Corrective Action"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            : act.actionType === "Preventive Action"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        }`}
                      >
                        {act.actionType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-foreground font-medium break-words max-w-xs">
                      {act.description}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      <span className="font-semibold text-foreground block truncate">{act.assignedTo}</span>
                      <span className="text-[10px] truncate block">{act.department}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-foreground whitespace-nowrap">
                      {act.targetDate}
                    </td>
                    <td
                      className="py-2.5 px-3 text-center select-none"
                      onClick={() => onToggleStatus?.(act.id)}
                      title="Click to advance status"
                    >
                      {getBadge(act.status)}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground text-[11px] break-words max-w-xs">
                      {act.evidenceNote}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      {onDeleteAction && (
                        <button
                          type="button"
                          onClick={() => handleDelete(act.id, act.description)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-600 p-1"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Action Task Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader className="pb-3 border-b border-border/60">
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Add CAPA Action Task
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Define an immediate containment, root-cause correction, or recurrence prevention item.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Action Classification <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={actionType}
                  onValueChange={(val: CapaActionItem["actionType"]) => setActionType(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Containment">Containment (Immediate)</SelectItem>
                    <SelectItem value="Corrective Action">Corrective Action (Root Cause Removal)</SelectItem>
                    <SelectItem value="Preventive Action">Preventive Action (Systemic Recurrence Prevention)</SelectItem>
                    <SelectItem value="Effectiveness Verification">Effectiveness Verification (VoE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Task Description <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Conduct ultrasonic bath cleaning on wave nozzle and recalibrate fluxer"
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Assignee
                  </Label>
                  <Input
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="h-8 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Department
                  </Label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Target Due Date
                </Label>
                <Input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-8 text-xs font-semibold text-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Objective Evidence Note
                </Label>
                <Input
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  placeholder="e.g. Maintenance log MWO-2026-0815 signed off"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border/60 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs font-medium bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add to Action Plan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

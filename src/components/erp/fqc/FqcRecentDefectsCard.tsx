import { useState } from "react";
import { AlertTriangle, ArrowRight, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
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
import { FqcDefect } from "@/services/fqcTypes";
import { toast } from "sonner";

interface FqcRecentDefectsCardProps {
  defects: FqcDefect[];
  onAddDefect?: (defect: FqcDefect) => void;
}

export function FqcRecentDefectsCard({
  defects,
  onAddDefect,
}: FqcRecentDefectsCardProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDefect, setNewDefect] = useState<Partial<FqcDefect>>({
    defectCode: `DC-00${defects.length + 2}`,
    category: "Visual",
    quantity: 1,
    severity: "Minor",
    disposition: "Rework",
  });

  const handleSaveDefect = () => {
    if (!newDefect.description?.trim()) {
      toast.error("Please enter a defect description");
      return;
    }

    const defect: FqcDefect = {
      id: `def-${Date.now()}`,
      defectCode: newDefect.defectCode || `DC-00${defects.length + 2}`,
      category: newDefect.category || "Visual",
      description: newDefect.description.trim(),
      quantity: Number(newDefect.quantity) || 1,
      severity: (newDefect.severity as any) || "Minor",
      disposition: (newDefect.disposition as any) || "Rework",
      ncrReference: `NCR-2026-00${Math.floor(48 + Math.random() * 20)}`,
    };

    if (onAddDefect) {
      onAddDefect(defect);
    }
    toast.success(`Defect ${defect.defectCode} logged & segregated`);
    setIsAddOpen(false);
    setNewDefect({
      defectCode: `DC-00${defects.length + 3}`,
      category: "Visual",
      quantity: 1,
      severity: "Minor",
      disposition: "Rework",
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs space-y-3 min-w-0">
      <div className="flex items-center justify-between pb-2 border-b border-border/40 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-semibold text-foreground">
            Non-Conformances & Defects
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200">
            {defects.length} Active
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="h-7 text-xs px-2 border-border text-foreground hover:bg-muted"
        >
          <Plus className="h-3 w-3 mr-1" />
          Log Defect
        </Button>
      </div>

      <div className="space-y-2.5 min-w-0">
        {defects.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/70">
            No active non-conformances logged for this inspection lot.
          </div>
        ) : (
          defects.map((d) => (
            <div
              key={d.id}
              className="p-2.5 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-lg text-xs space-y-1.5 min-w-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span className="font-bold text-foreground font-mono truncate">{d.defectCode}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">({d.category})</span>
                </div>
                <span className="font-bold text-rose-600 font-mono shrink-0">
                  {d.quantity} Units Defective
                </span>
              </div>

              <p className="text-muted-foreground text-[11px] leading-relaxed">{d.description}</p>

              <div className="flex items-center justify-between pt-1 border-t border-rose-200/60 dark:border-rose-900/40 min-w-0">
                <span className="text-[10px] text-muted-foreground truncate">
                  Disposition: <strong className="text-foreground">{d.disposition}</strong>
                </span>

                {d.ncrReference && (
                  <Link
                    to="/management/quality-management/ncr-management"
                    className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] flex items-center gap-0.5 shrink-0 ml-2"
                  >
                    <span>Open {d.ncrReference}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Defect Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              Log Lot Defect & Quarantine Units
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Defect Code</Label>
                <Input
                  value={newDefect.defectCode || ""}
                  onChange={(e) => setNewDefect({ ...newDefect, defectCode: e.target.value })}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select
                  value={newDefect.category || "Visual"}
                  onValueChange={(val: any) => setNewDefect({ ...newDefect, category: val })}
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
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Defect Description *</Label>
              <Input
                value={newDefect.description || ""}
                onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                placeholder="e.g. Cosmetic paint run on top bezel cover"
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Defective Quantity</Label>
                <Input
                  type="number"
                  value={newDefect.quantity || 1}
                  onChange={(e) => setNewDefect({ ...newDefect, quantity: Number(e.target.value) })}
                  className="h-8 text-xs font-mono"
                  min={1}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Disposition</Label>
                <Select
                  value={newDefect.disposition || "Rework"}
                  onValueChange={(val: any) => setNewDefect({ ...newDefect, disposition: val })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rework">Rework</SelectItem>
                    <SelectItem value="Scrap">Scrap</SelectItem>
                    <SelectItem value="Return">Return to Vendor</SelectItem>
                    <SelectItem value="Hold">Quarantine Hold</SelectItem>
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
              onClick={handleSaveDefect}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              Log & Segregate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

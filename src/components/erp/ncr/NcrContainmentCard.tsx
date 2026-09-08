import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NcrRecord } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrContainmentCardProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

export function NcrContainmentCard({ record, onChange }: NcrContainmentCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tempAction, setTempAction] = useState(record.containmentAction);
  const [tempLocation, setTempLocation] = useState(record.quarantineLocation);
  const [tempOwner, setTempOwner] = useState(record.containmentOwner);

  const handleSaveModal = () => {
    onChange({
      containmentAction: tempAction,
      quarantineLocation: tempLocation,
      containmentOwner: tempOwner,
    });
    setIsEditOpen(false);
    toast.success("Containment details updated successfully");
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-semibold text-foreground">
            Containment Status
          </h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {record.containmentStatus}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setTempAction(record.containmentAction);
            setTempLocation(record.quarantineLocation);
            setTempOwner(record.containmentOwner);
            setIsEditOpen(true);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
        >
          Edit
        </button>
      </div>

      {/* 4 Checkboxes Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={record.materialHold}
            onCheckedChange={(checked) => onChange({ materialHold: !!checked })}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className="text-foreground/90 font-medium">Material Hold</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={record.wipHold}
            onCheckedChange={(checked) => onChange({ wipHold: !!checked })}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className="text-foreground/90 font-medium">WIP Hold</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={record.finishedGoodsHold}
            onCheckedChange={(checked) => onChange({ finishedGoodsHold: !!checked })}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className="text-foreground/90 font-medium">Finished Goods Hold</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={record.shipmentHold}
            onCheckedChange={(checked) => onChange({ shipmentHold: !!checked })}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className="text-foreground/90 font-medium">Shipment Hold</span>
        </label>
      </div>

      {/* Containment Action Container */}
      <div className="bg-muted/40 rounded-lg p-2.5 border border-border/60 text-xs">
        <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Containment Action
        </span>
        <p className="text-foreground leading-relaxed">
          {record.containmentAction}
        </p>
      </div>

      {/* 3 Stats Column */}
      <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-border/40">
        <div>
          <span className="text-[11px] text-muted-foreground block">
            Quarantine Location
          </span>
          <span className="font-semibold text-foreground font-mono">
            {record.quarantineLocation}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-muted-foreground block">
            Containment Owner
          </span>
          <span className="font-semibold text-foreground">
            {record.containmentOwner}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-muted-foreground block">
            Containment Date
          </span>
          <span className="font-semibold text-foreground text-[11px]">
            {record.containmentDate}
          </span>
        </div>
      </div>

      {/* Edit Containment Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              Edit Immediate Containment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Containment Action</Label>
              <Textarea
                rows={3}
                value={tempAction}
                onChange={(e) => setTempAction(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Quarantine Location</Label>
              <Input
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Containment Owner</Label>
              <Input
                value={tempOwner}
                onChange={(e) => setTempOwner(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveModal}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

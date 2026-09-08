import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalibrationRecord, CalibrationType, PriorityLevel } from "@/services/calibrationTypes";
import { Sparkles, Gauge, Calendar, ShieldCheck, Hash, Building2 } from "lucide-react";
import { toast } from "sonner";

interface CreateCalibrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (newRecord: Partial<CalibrationRecord>) => void;
}

export function CreateCalibrationModal({
  open,
  onOpenChange,
  onCreated,
}: CreateCalibrationModalProps) {
  const [calNumber, setCalNumber] = useState(`CAL-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [equipmentName, setEquipmentName] = useState("Digital Micrometer (Mitutoyo 293)");
  const [equipmentId, setEquipmentId] = useState("EQP-QC-0042");
  const [calType, setCalType] = useState<CalibrationType>("External");
  const [agency, setAgency] = useState("TUV India Pvt. Ltd.");
  const [procedure, setProcedure] = useState("CAL-PROC-QC-004");
  const [frequency, setFrequency] = useState("Annual");
  const [priority, setPriority] = useState<PriorityLevel>("High");
  const [calDate, setCalDate] = useState("08-Sep-2026");
  const [nextDueDate, setNextDueDate] = useState("07-Sep-2027");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!equipmentName.trim() || !equipmentId.trim()) {
      toast.error("Please fill in all mandatory equipment details");
      return;
    }

    const partialRecord: Partial<CalibrationRecord> = {
      calibrationNumber: calNumber,
      calibrationDate: calDate,
      calibrationType: calType,
      calibrationStatus: "Scheduled",
      equipmentName,
      equipmentId,
      calibrationAgency: agency,
      calibrationProcedure: procedure,
      calibrationFrequency: frequency,
      priority,
      nextCalibrationDate: nextDueDate,
      equipmentInfo: {
        name: equipmentName,
        status: "Active",
        manufacturer: equipmentName.includes("Mitutoyo") ? "Mitutoyo" : "Fluke",
        model: equipmentName.includes("Mitutoyo") ? "Series 293" : "87V",
        serialNumber: `SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        assetNumber: `AST-${equipmentId}`,
        range: "0 - 25 mm",
        accuracy: "±0.001 mm",
        location: "Inspection Lab - Line 1",
      },
    };

    onCreated(partialRecord);
    toast.success(`Calibration ${calNumber} registered successfully!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-3 border-b border-border/60">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              Schedule New Calibration
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register a new equipment calibration event, establish NABL traceability and assign external agency or in-house lab.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 text-xs">
            {/* Row 1: Cal No and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  Calibration No. <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={calNumber}
                  onChange={(e) => setCalNumber(e.target.value)}
                  className="h-8 text-xs font-mono font-semibold bg-muted/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  Calibration Date <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={calDate}
                  onChange={(e) => setCalDate(e.target.value)}
                  className="h-8 text-xs font-medium"
                  required
                />
              </div>
            </div>

            {/* Row 2: Equipment Name and Equipment ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Equipment / Instrument Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  placeholder="e.g. Digital Micrometer"
                  className="h-8 text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Equipment ID / Asset Tag <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={equipmentId}
                  onChange={(e) => setEquipmentId(e.target.value)}
                  placeholder="e.g. EQP-QC-0042"
                  className="h-8 text-xs font-mono font-medium"
                  required
                />
              </div>
            </div>

            {/* Row 3: Calibration Type & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Calibration Type <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={calType}
                  onValueChange={(val: CalibrationType) => setCalType(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="External">External (Accredited NABL Lab)</SelectItem>
                    <SelectItem value="Internal">Internal (In-House Lab)</SelectItem>
                    <SelectItem value="Verification">Routine Verification Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Priority Level
                </Label>
                <Select
                  value={priority}
                  onValueChange={(val: PriorityLevel) => setPriority(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4: Agency & Procedure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  Calibration Agency / Lab
                </Label>
                <Input
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Procedure Reference
                </Label>
                <Input
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Row 5: Frequency and Next Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Interval / Frequency
                </Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quarterly">Quarterly (90 Days)</SelectItem>
                    <SelectItem value="Semi-Annual">Semi-Annual (180 Days)</SelectItem>
                    <SelectItem value="Annual">Annual (365 Days)</SelectItem>
                    <SelectItem value="Biennial">Biennial (2 Years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Next Due Date
                </Label>
                <Input
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="h-8 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border/60 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs font-medium bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Register Calibration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

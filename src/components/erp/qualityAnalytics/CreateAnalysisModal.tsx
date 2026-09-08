import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { PlayCircle, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface CreateAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisCreated?: (analysis: {
    title: string;
    process: string;
    plant: string;
    sampleSize: number;
    defectRate: number;
    fpy: number;
  }) => void;
}

export function CreateAnalysisModal({
  open,
  onOpenChange,
  onAnalysisCreated,
}: CreateAnalysisModalProps) {
  const [title, setTitle] = useState("SMT Assembly Automated Optical Inspection (AOI)");
  const [process, setProcess] = useState("Assembly");
  const [plant, setPlant] = useState("Plant 1 (SMT Focus)");
  const [sampleSize, setSampleSize] = useState("120");
  const [shift, setShift] = useState("Shift A (Morning)");
  const [standard, setStandard] = useState("ISO 2859-1 (AQL 0.65)");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);

      const fpy = +(93 + Math.random() * 4).toFixed(1);
      const defectRate = +(1.8 + Math.random() * 1.2).toFixed(1);

      onAnalysisCreated?.({
        title,
        process,
        plant,
        sampleSize: parseInt(sampleSize, 10) || 100,
        defectRate,
        fpy,
      });

      toast.success("Quality Analysis Run Completed", {
        description: `Generated telemetry for "${title}" (${sampleSize} units). FPY: ${fpy}%, Defect Rate: ${defectRate}%.`,
      });
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-slate-50 dark:bg-slate-900/60">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-5 w-5 text-[#0B3B7B]" />
            Initiate Quality Analytics Run
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Analysis Title / Audit Description
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SMT Line 2 Automated Optical Inspection"
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Production Plant</Label>
              <Select value={plant} onValueChange={setPlant}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Plant 1 (SMT Focus)">Plant 1 (SMT Focus)</SelectItem>
                  <SelectItem value="Plant 2 (Final Assembly)">Plant 2 (Final Assembly)</SelectItem>
                  <SelectItem value="Plant 3 (High Voltage)">Plant 3 (High Voltage)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Target Process</Label>
              <Select value={process} onValueChange={setProcess}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Assembly">Assembly</SelectItem>
                  <SelectItem value="Electrical Test">Electrical Test</SelectItem>
                  <SelectItem value="Functional Test">Functional Test</SelectItem>
                  <SelectItem value="Packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Sample Size (Units)</Label>
              <Input
                type="number"
                min={10}
                max={5000}
                value={sampleSize}
                onChange={(e) => setSampleSize(e.target.value)}
                className="h-9 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Operating Shift</Label>
              <Select value={shift} onValueChange={setShift}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Shift A (Morning)">Shift A (Morning)</SelectItem>
                  <SelectItem value="Shift B (Evening)">Shift B (Evening)</SelectItem>
                  <SelectItem value="Shift C (Night)">Shift C (Night)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Sampling Standard</Label>
            <Select value={standard} onValueChange={setStandard}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="ISO 2859-1 (AQL 0.65)">ISO 2859-1 (AQL 0.65 Level II)</SelectItem>
                <SelectItem value="MIL-STD-105E (Normal)">MIL-STD-105E (Normal Single)</SelectItem>
                <SelectItem value="ANSI/ASQ Z1.4">ANSI/ASQ Z1.4 Sampling Plan</SelectItem>
                <SelectItem value="100% Comprehensive Gate">100% Comprehensive Inspection Gate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-blue-50/80 dark:bg-blue-950/30 p-3 border border-blue-200 dark:border-blue-900/50 flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-[11px]">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Real-time statistical engine will calculate <strong>First Pass Yield (FPY)</strong>,{" "}
              <strong>Defect PPM</strong>, and <strong>Cpk process capability</strong> automatically upon completion.
            </span>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="bg-[#0B3B7B] hover:bg-[#092e60] text-white text-xs flex items-center gap-1.5"
            >
              {isLoading ? (
                <>Calculating Telemetry...</>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  Run Analysis & Update
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateAnalysisModal;

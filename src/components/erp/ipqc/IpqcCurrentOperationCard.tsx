import React, { useState } from "react";
import { BookOpen, ShieldAlert, CheckCircle2, Wrench, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { IpqcRecord } from "@/services/ipqcTypes";

interface IpqcCurrentOperationCardProps {
  record: IpqcRecord;
  onViewWorkInstruction?: () => void;
}

export const IpqcCurrentOperationCard: React.FC<IpqcCurrentOperationCardProps> = ({
  record,
  onViewWorkInstruction,
}) => {
  const [isWiOpen, setIsWiOpen] = useState(false);

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between min-w-0">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 min-w-0">
        {/* Left info */}
        <div className="space-y-3 min-w-0 flex-1">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Current Operation
            </span>
            <div className="text-xl font-extrabold text-foreground tracking-tight mt-0.5">
              {record.operationNo}
            </div>
            <div className="text-xs font-semibold text-muted-foreground truncate">
              {record.operationName}
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-muted-foreground min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Work Center:</span>
              <span className="font-mono">{record.workCenter}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Std. Cycle Time:</span>
              <span className="font-mono">{record.stdCycleTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Operator:</span>
              <span className="font-medium text-foreground">{record.operator}</span>
            </div>
          </div>

          <div className="pt-1">
            <Button
              size="sm"
              onClick={() => {
                if (onViewWorkInstruction) onViewWorkInstruction();
                setIsWiOpen(true);
              }}
              className="h-8 text-xs font-semibold bg-[#0B3B7B] hover:bg-[#092e60] text-white gap-2 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Work Instruction</span>
            </Button>
          </div>
        </div>

        {/* Right Preview Image / Illustration */}
        <div className="relative w-36 sm:w-44 h-28 sm:h-32 rounded-xl overflow-hidden border border-border bg-slate-900 shrink-0 shadow-xs flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950/40" />

          {/* Conveyor track lines */}
          <div className="absolute bottom-0 inset-x-0 h-8 bg-slate-800/80 border-t border-slate-700 flex items-center justify-around px-2">
            <div className="w-1.5 h-5 bg-slate-600 rounded-xs" />
            <div className="w-1.5 h-5 bg-slate-600 rounded-xs" />
            <div className="w-1.5 h-5 bg-slate-600 rounded-xs" />
            <div className="w-1.5 h-5 bg-slate-600 rounded-xs" />
            <div className="w-1.5 h-5 bg-slate-600 rounded-xs" />
            <div className="w-1.5 h-5 bg-slate-600 rounded-xs" />
          </div>

          {/* EV Charger enclosure graphic */}
          <div className="relative z-10 w-20 h-24 rounded-lg bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-800 shadow-md border border-slate-400/40 flex flex-col items-center justify-between p-1.5">
            <div className="w-full flex justify-between items-center px-1 pt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[7px] font-mono text-slate-500 font-bold">7kW</span>
            </div>
            {/* Center screen */}
            <div className="w-14 h-10 rounded bg-slate-900 border border-slate-600/60 flex flex-col items-center justify-center p-1">
              <div className="w-3 h-3 rounded-full border border-blue-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <span className="text-[6px] text-blue-400 font-mono mt-0.5">CHARGING</span>
            </div>
            {/* Cable outlet */}
            <div className="w-4 h-2 rounded-t-xs bg-slate-950" />
          </div>

          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-blue-600/80 backdrop-blur-xs text-[9px] font-bold text-white z-10">
            ASM LINE
          </div>
        </div>
      </div>

      {/* Work Instruction Modal */}
      <Dialog open={isWiOpen} onOpenChange={setIsWiOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B3B7B] text-white flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Work Instruction: WI-ASM-030
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Standard Assembly & Cable Fixing Protocol for EV Charger 7kW.
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Safety Alert */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-amber-900 dark:text-amber-200">
                <span className="font-semibold block">Mandatory PPE & Safety Cautions:</span>
                <p className="text-[11px] leading-relaxed">
                  Operators must wear ESD wrist straps and safety glasses. Ensure line main power supply is isolated before terminal lug torquing.
                </p>
              </div>
            </div>

            {/* Sequence Steps */}
            <div className="space-y-2">
              <span className="font-semibold text-foreground text-xs block">
                Operation Assembly Sequence:
              </span>

              <div className="p-2.5 rounded-lg border border-border/80 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Step 1: Cable Stripping & Ferruling</span>
                  <span className="text-[10px] text-muted-foreground font-mono">15 sec</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Strip 32A charging cable sheath to 45mm. Crimp bootlace ferrules on L1, N, and PE using pneumatic crimper TOOL-04.
                </p>
              </div>

              <div className="p-2.5 rounded-lg border border-border/80 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Step 2: Terminal Lug Fastening & Torquing</span>
                  <span className="text-[10px] text-muted-foreground font-mono">20 sec</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Insert ferrules into contactor terminals. Torque screws to exactly <strong className="text-foreground">8.2 N·m (±1.0 N·m)</strong> using calibrated digital torque tool VTT-02.
                </p>
              </div>

              <div className="p-2.5 rounded-lg border border-border/80 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Step 3: Gland Nut Sealing & Pull Test</span>
                  <span className="text-[10px] text-muted-foreground font-mono">10 sec</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Tighten M25 IP67 cable gland nut until rubber gasket engages fully. Perform 50N axial pull verification.
                </p>
              </div>
            </div>

            {/* Equipment Calibration Note */}
            <div className="p-3 bg-muted/40 rounded-lg border border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold block">Required Tooling:</span>
                  <span className="text-muted-foreground text-[11px]">Digital Torque Driver VTT-02 (Cal Due: 12-Oct-2026)</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => setIsWiOpen(false)}
              className="text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white font-semibold"
            >
              Close Work Instruction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

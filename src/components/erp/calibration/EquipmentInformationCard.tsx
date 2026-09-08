import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, CheckCircle2, MapPin, Hash, Cpu, Sliders } from "lucide-react";
import { CalibrationRecord } from "@/services/calibrationTypes";

interface EquipmentInformationCardProps {
  record: CalibrationRecord;
}

export function EquipmentInformationCard({
  record,
}: EquipmentInformationCardProps) {
  const { equipmentInfo } = record;

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          Equipment Information
        </CardTitle>
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {equipmentInfo.status}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4 min-w-0">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center min-w-0">
          {/* Equipment Illustration Badge */}
          <div className="w-36 h-36 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 p-2.5 flex flex-col items-center justify-between shadow-md text-slate-900 border-2 border-amber-300 relative overflow-hidden">
            <div className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-amber-950 px-1">
              <span>{equipmentInfo.manufacturer}</span>
              <span>{equipmentInfo.model}</span>
            </div>

            {/* LCD Screen Display Mockup */}
            <div className="w-full bg-emerald-950/80 rounded border border-emerald-600/50 px-2 py-1.5 flex flex-col items-end">
              <span className="text-[9px] text-emerald-400/80 font-mono">DC VOLTS</span>
              <span className="text-base font-bold font-mono tracking-widest text-emerald-300">
                10.001
              </span>
            </div>

            {/* Dial Knob & Terminals */}
            <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-inner">
              <div className="w-1 h-3 bg-amber-400 rounded-full mb-1"></div>
            </div>

            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-black/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-black/40"></div>
            </div>
          </div>

          {/* Details Table */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-xs w-full">
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-muted-foreground block text-[11px]">Equipment Name</span>
              <span className="font-semibold text-foreground">{equipmentInfo.name}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-muted-foreground block text-[11px]">Manufacturer & Model</span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Cpu className="w-3 h-3 text-muted-foreground" />
                {equipmentInfo.manufacturer} {equipmentInfo.model}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-muted-foreground block text-[11px]">Serial Number</span>
              <span className="font-mono font-semibold text-foreground flex items-center gap-1">
                <Hash className="w-3 h-3 text-muted-foreground" />
                {equipmentInfo.serialNumber}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-muted-foreground block text-[11px]">Asset Tag / Barcode</span>
              <span className="font-mono font-medium text-foreground">{equipmentInfo.assetNumber}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-muted-foreground block text-[11px]">Operating Range</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Sliders className="w-3 h-3 text-muted-foreground" />
                {equipmentInfo.range}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-muted-foreground block text-[11px]">Specified Accuracy</span>
              <span className="font-semibold text-primary">{equipmentInfo.accuracy}</span>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground text-[11px]">Assigned Location:</span>
              <span className="font-medium text-foreground">{equipmentInfo.location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Layers, ShieldCheck, QrCode } from "lucide-react";
import type { WorkInstructionFormInput } from "@/services/types";

export function ToolsMaterialsSection({
  form,
}: {
  form: UseFormReturn<WorkInstructionFormInput>;
}) {
  const { watch } = form;

  const tools = watch("requiredTools") || ["Torque Screwdriver (0.5-2 Nm)", "Phillips Screwdriver", "Wire Cutter", "Multimeter"];
  const materials = watch("materials") || ["PCB Assembly", "M3 Screws", "Power Cable Set", "First-Off Inspection Sticker"];
  const ppe = watch("ppeRequirements") || ["ESD Anti-static Wristband", "Safety Glasses", "Insulated Gloves"];

  return (
    <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">Tools, Materials & PPE Requirements</CardTitle>
        <CardDescription className="text-xs">
          Calibrated tooling, fixtures, raw materials, consumable parts, barcode verification & PPE safety gear.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tools */}
          <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                <Wrench className="h-4 w-4 text-blue-600 shrink-0" /> Required Tools & Fixtures
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono font-bold shrink-0">
                {tools.length} Items
              </Badge>
            </div>
            <div className="space-y-2">
              {tools.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border border-border/60">
                  <span className="font-semibold text-foreground truncate">{t}</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shrink-0 whitespace-nowrap font-semibold">
                    Calibrated ✓
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                <Layers className="h-4 w-4 text-emerald-600 shrink-0" /> Materials & Components
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono font-bold shrink-0">
                {materials.length} Items
              </Badge>
            </div>
            <div className="space-y-2">
              {materials.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border border-border/60">
                  <span className="font-semibold text-foreground truncate">{m}</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 font-mono font-bold shrink-0 whitespace-nowrap">
                    In Stock
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* PPE */}
          <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" /> Required PPE & Safety Gear
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono font-bold shrink-0">
                {ppe.length} Items
              </Badge>
            </div>
            <div className="space-y-2">
              {ppe.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border border-border/60">
                  <span className="font-semibold text-foreground truncate">{p}</span>
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px] font-semibold shrink-0 whitespace-nowrap">
                    Mandatory
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Barcode Bar */}
        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <QrCode className="h-6 w-6 text-primary shrink-0" />
            <div>
              <span className="font-bold text-foreground block text-xs">Barcode / QR Code Tool Verification</span>
              <span className="text-[11px] text-muted-foreground">
                Operators must scan tool serial barcode before beginning Assembly Operation OP-20.
              </span>
            </div>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 text-xs font-mono shrink-0 px-3 py-1 font-bold">
            Scan System Ready
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

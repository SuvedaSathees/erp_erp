import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText, ShieldCheck } from "lucide-react";
import type { FactoryLayoutFormInput } from "@/services/types";
import { toast } from "sonner";

export function UtilitySafetySection({
  form,
}: {
  form: UseFormReturn<FactoryLayoutFormInput>;
}) {
  const { watch, setValue } = form;

  const utilitySafetyScore = watch("utilitySafetyScore") ?? 88;

  const utilityDocs = [
    { label: "Electrical Distribution Layout", filename: "electrical_layout_v1.2.dwg", size: "5.2 MB" },
    { label: "Compressed Air Layout", filename: "cir_layout_v1.2.dwg", size: "3.8 MB" },
    { label: "Water Distribution Layout", filename: "water_layout_v1.2.dwg", size: "2.9 MB" },
    { label: "Fire Safety Layout", filename: "fire_safety_layout_v1.2.pdf", size: "3.1 MB" },
    { label: "Emergency Exit Plan", filename: "emergency_exit_v1.2.pdf", size: "2.4 MB" },
  ];

  return (
    <Card className="border-border rounded-xl shadow-xs bg-card flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/60">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Utilities & Safety Compliance
            </CardTitle>
            <CardDescription className="text-xs">
              Electrical distribution, piping, fire suppression & evacuation.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl px-3 py-1.5 shrink-0">
            <div>
              <span className="text-[10px] font-semibold uppercase text-teal-600 dark:text-teal-400 block tracking-wider">
                Utility Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                  {utilitySafetyScore}
                </span>
                <span className="text-[10px] text-teal-500 font-semibold">/100</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 text-xs">
          {/* Schematic Documents List */}
          <div className="rounded-lg border border-border/80 divide-y divide-border/60 overflow-hidden bg-background">
            {utilityDocs.map((doc, idx) => (
              <div
                key={doc.label}
                className="p-2.5 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                {/* Drawing Label & File */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground font-mono text-[10px] shrink-0">{idx + 1}.</span>
                    <span className="font-semibold text-foreground truncate">{doc.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 pl-3.5">
                    <FileText className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span className="font-mono text-[11px] text-primary truncate cursor-pointer hover:underline font-medium">
                      {doc.filename}
                    </span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono shrink-0">
                      {doc.size}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[11px] gap-1 hover:text-primary cursor-pointer border-border"
                    onClick={() => toast.info(`Previewing ${doc.filename}`)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[11px] hover:text-teal-600 cursor-pointer border-border"
                    onClick={() => toast.success(`Downloading ${doc.filename}`)}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* EHS Compliance Banner Checkbox */}
          <div className="p-3 border border-emerald-200 dark:border-emerald-800 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Checkbox
                id="ehsCompliance"
                checked={watch("ehsCompliance") ?? true}
                onCheckedChange={(val) => setValue("ehsCompliance", Boolean(val))}
              />
              <label htmlFor="ehsCompliance" className="font-semibold text-emerald-900 dark:text-emerald-300 cursor-pointer whitespace-nowrap">
                Environment, Health & Safety (EHS) Compliance Verified ✓
              </label>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold whitespace-nowrap">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Certified Safe
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

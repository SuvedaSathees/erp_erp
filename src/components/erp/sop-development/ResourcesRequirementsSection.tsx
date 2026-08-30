import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, CheckCircle2, Monitor, FileText } from "lucide-react";
import type { SopFormInput } from "@/services/types";

export function ResourcesRequirementsSection({
  form,
}: {
  form: UseFormReturn<SopFormInput>;
}) {
  const { watch } = form;

  const resources = watch("resources") || [];

  const equipmentAndTools = resources.filter(
    (r) =>
      r.category === "Required Equipment" ||
      r.category === "Required Tools" ||
      r.type === "Equipment" ||
      r.type === "Tool"
  );
  const softwareAndForms = resources.filter(
    (r) =>
      r.category === "Software Systems" ||
      r.category === "Forms & Templates" ||
      r.type === "Software" ||
      r.type === "Form"
  );
  const inputAndOutputDocs = resources.filter(
    (r) =>
      r.category === "Input Documents" ||
      r.category === "Output Documents" ||
      r.type === "Document"
  );

  return (
    <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">Resources & System Requirements</CardTitle>
        <CardDescription className="text-xs">
          Required machinery, tools, MES/ERP software systems, forms, input/output documents & availability verification.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Equipment & Tools */}
          <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-2.5">
                <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                  <Wrench className="h-4 w-4 text-blue-600 shrink-0" /> Required Equipment & Tools
                </span>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold shrink-0">
                  {equipmentAndTools.length} Items
                </Badge>
              </div>

              <div className="space-y-2">
                {equipmentAndTools.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-background border border-border/60"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-xs leading-tight">
                        {r.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        Qty: {r.itemCount || r.quantity || 1} • {r.code || "TOOL-EQ"}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shrink-0 whitespace-nowrap"
                    >
                      Verified ✓
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Software Systems & Forms */}
          <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-2.5">
                <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                  <Monitor className="h-4 w-4 text-indigo-600 shrink-0" /> Software Systems & Forms
                </span>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold shrink-0">
                  {softwareAndForms.length} Items
                </Badge>
              </div>

              <div className="space-y-2">
                {softwareAndForms.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-background border border-border/60"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-xs leading-tight">
                        {r.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {r.code || "SYS-FORM"}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shrink-0 whitespace-nowrap"
                    >
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Input & Output Documents */}
          <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-2.5">
                <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                  <FileText className="h-4 w-4 text-emerald-600 shrink-0" /> Input & Output Documents
                </span>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold shrink-0">
                  {inputAndOutputDocs.length} Items
                </Badge>
              </div>

              <div className="space-y-2">
                {inputAndOutputDocs.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-background border border-border/60"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-xs leading-tight">
                        {r.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {r.code || "DOC-SPEC"}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shrink-0 whitespace-nowrap"
                    >
                      Verified ✓
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Verification Banner */}
        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-foreground block text-xs">Complete Resource Verification</span>
              <span className="text-[11px] text-muted-foreground">
                All resource categories verified and ready for Manufacturing SOP release.
              </span>
            </div>
          </div>
          <Badge className="bg-emerald-600 text-white text-xs font-mono shrink-0 px-3 py-1">
            100% Verified
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

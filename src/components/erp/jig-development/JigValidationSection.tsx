import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { JigFormInput } from "@/services/types";

export function JigValidationSection({
  form,
}: {
  form: UseFormReturn<JigFormInput>;
}) {
  const { register, watch, setValue } = form;

  const validationScore = watch("validationScore") ?? 87;

  return (
    <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900 flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Jig Validation & Quality Trial</CardTitle>
            <CardDescription className="text-xs">
              Trial verification, dimensional accuracy & capability (Cp/Cpk).
            </CardDescription>
          </div>

          {/* Score Card Badge */}
          <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-xl px-3.5 py-1.5 shrink-0">
            <div>
              <span className="text-[10px] font-semibold uppercase text-purple-600 dark:text-purple-400 block tracking-wider">
                Validation Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-purple-700 dark:text-purple-300 font-mono">
                  {validationScore}
                </span>
                <span className="text-xs text-purple-500 font-semibold">/100</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Verification Checkboxes Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <Checkbox
                id="trialJigCompleted"
                checked={watch("trialJigCompleted") ?? true}
                onCheckedChange={(v) => setValue("trialJigCompleted", Boolean(v))}
              />
              <label htmlFor="trialJigCompleted" className="font-semibold cursor-pointer whitespace-nowrap">
                Trial Jig Completed ✓
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="dimensionalInspection"
                checked={watch("dimensionalInspection") ?? true}
                onCheckedChange={(v) => setValue("dimensionalInspection", Boolean(v))}
              />
              <label htmlFor="dimensionalInspection" className="font-semibold cursor-pointer whitespace-nowrap">
                Dimensional Passed ✓
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="safetyValidation"
                checked={watch("safetyValidation") ?? true}
                onCheckedChange={(v) => setValue("safetyValidation", Boolean(v))}
              />
              <label htmlFor="safetyValidation" className="font-semibold cursor-pointer whitespace-nowrap">
                Safety Approved ✓
              </label>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Tool Guidance Accuracy */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block truncate">Guidance Accuracy (mm)</label>
              <Input
                type="number"
                step="0.001"
                {...register("toolGuidanceAccuracy", { valueAsNumber: true })}
                className="h-9 text-xs font-mono"
              />
            </div>

            {/* Repeatability Test */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block truncate">Repeatability Test (mm)</label>
              <Input
                type="number"
                step="0.001"
                {...register("repeatabilityTest", { valueAsNumber: true })}
                className="h-9 text-xs font-mono"
              />
            </div>

            {/* Process Capability Cp */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block truncate">Capability (Cp)</label>
              <Input
                type="number"
                step="0.01"
                {...register("processCapabilityCp", { valueAsNumber: true })}
                className="h-9 text-xs font-mono"
              />
            </div>

            {/* Process Capability Cpk */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block truncate">Capability (Cpk)</label>
              <Input
                type="number"
                step="0.01"
                {...register("processCapabilityCpk", { valueAsNumber: true })}
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-foreground text-xs block">Validation Remarks</label>
            <Textarea
              rows={2}
              {...register("validationRemarks")}
              placeholder="Enter jig validation notes, Cpk measurement observations..."
              className="text-xs resize-none"
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

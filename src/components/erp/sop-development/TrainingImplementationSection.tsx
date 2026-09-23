import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, FileText, CheckCircle2 } from "lucide-react";
import type { SopFormInput } from "@/services/types";

export function TrainingImplementationSection({
  form,
}: {
  form: UseFormReturn<SopFormInput>;
}) {
  const { watch } = form;

  const trainingScore = watch("trainingScore") ?? 88;

  return (
    <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Training & Organization-Wide Implementation
          </CardTitle>
          <CardDescription className="text-xs">
            Operator competency requirements, training presentation materials, implementation schedule & verification.
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2">
          <div>
            <span className="text-[10px] font-semibold uppercase text-primary dark:text-blue-400 block tracking-wider">
              Training Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-primary dark:text-blue-300 font-mono">
                {trainingScore}
              </span>
              <span className="text-xs text-blue-600 font-semibold">/100</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
            <span className="font-bold text-foreground block">Training Required</span>
            <span className="text-sm font-bold text-emerald-600">Yes ✓</span>
            <span className="text-[10px] text-muted-foreground block">Mandatory Qualification</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
            <span className="font-bold text-foreground block">Training Deck</span>
            <span className="text-xs font-mono font-bold text-primary truncate block">
              {watch("trainingMaterial") || "SOP_Training_Presentation.pdf"}
            </span>
            <span className="text-[10px] text-muted-foreground block font-mono">Prepared by HR / Training</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
            <span className="font-bold text-foreground block">Target Audience</span>
            <span className="text-xs font-semibold text-foreground truncate block">
              {watch("targetAudience") || "Operators, Technicians, Engineers"}
            </span>
            <span className="text-[10px] text-muted-foreground block">All Shift Personnel</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
            <span className="font-bold text-foreground block">Competency Requirement</span>
            <span className="text-xs font-bold text-primary">
              {watch("competencyRequirement") || "Level 2 Certified Operator"}
            </span>
            <span className="text-[10px] text-muted-foreground block">Practical Assessment Passed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap } from "lucide-react";
import type { ManufacturingExcellenceRecord } from "@/services/types";

interface ExcellenceProgramsCardProps {
  record: ManufacturingExcellenceRecord;
  onChange: (field: keyof ManufacturingExcellenceRecord, value: any) => void;
}

export const ExcellenceProgramsCard: React.FC<ExcellenceProgramsCardProps> = ({
  record,
  onChange,
}) => {
  const programs = [
    { key: "leanManufacturing", label: "Lean Manufacturing" },
    { key: "sixSigmaProject", label: "Six Sigma Project" },
    { key: "kaizenInitiative", label: "Kaizen Initiative" },
    { key: "tpmProgram", label: "TPM Program" },
    { key: "fiveSImplementation", label: "5S Implementation" },
    { key: "valueStreamMapping", label: "Value Stream Mapping" },
    { key: "standardWork", label: "Standard Work" },
  ] as const;

  return (
    <Card className="border-border rounded-xl shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base font-bold text-foreground">
                Continuous Improvement Programs
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase">Programs</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-300 text-xs">
                {record.improvementScore} / 100
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {programs.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 p-2.5 transition-colors"
              >
                <span className="font-semibold text-foreground">
                  {item.label}
                </span>
                <Checkbox
                  checked={record[item.key as keyof ManufacturingExcellenceRecord] as boolean}
                  onCheckedChange={(checked) => onChange(item.key as keyof ManufacturingExcellenceRecord, !!checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

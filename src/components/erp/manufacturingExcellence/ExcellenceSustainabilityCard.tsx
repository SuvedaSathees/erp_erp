import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf } from "lucide-react";
import type { ManufacturingExcellenceRecord } from "@/services/types";

interface ExcellenceSustainabilityCardProps {
  record: ManufacturingExcellenceRecord;
  onChange: (field: keyof ManufacturingExcellenceRecord, value: any) => void;
  isEditing?: boolean;
}

export const ExcellenceSustainabilityCard: React.FC<ExcellenceSustainabilityCardProps> = ({
  record,
  onChange,
  isEditing = true,
}) => {
  return (
    <Card className="border-border rounded-xl shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-base font-bold text-foreground">
                Sustainability & ESG
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase">Sustainability</span>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-300 text-xs">
                {record.sustainabilityAssessmentScore} / 100
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
          {/* Energy Consumption */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">Energy Consumption</label>
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  step="0.01"
                  value={record.energyConsumptionPerUnit}
                  onChange={(e) => onChange("energyConsumptionPerUnit", parseFloat(e.target.value) || 0)}
                  className="h-8 text-xs font-bold font-mono"
                />
                <span className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap">MWh/Unit</span>
              </div>
            ) : (
              <span className="font-bold text-foreground font-mono">{record.energyConsumptionPerUnit} MWh/Unit</span>
            )}
          </div>

          {/* Carbon Emissions */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">Carbon Emissions</label>
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  step="0.01"
                  value={record.carbonEmissionsPerUnit}
                  onChange={(e) => onChange("carbonEmissionsPerUnit", parseFloat(e.target.value) || 0)}
                  className="h-8 text-xs font-bold font-mono"
                />
                <span className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap">tCO2e/Unit</span>
              </div>
            ) : (
              <span className="font-bold text-foreground font-mono">{record.carbonEmissionsPerUnit} tCO2e/Unit</span>
            )}
          </div>

          {/* Water Consumption */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">Water Consumption</label>
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  step="0.01"
                  value={record.waterConsumptionPerUnit}
                  onChange={(e) => onChange("waterConsumptionPerUnit", parseFloat(e.target.value) || 0)}
                  className="h-8 text-xs font-bold font-mono"
                />
                <span className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap">kL/Unit</span>
              </div>
            ) : (
              <span className="font-bold text-foreground font-mono">{record.waterConsumptionPerUnit} kL/Unit</span>
            )}
          </div>

          {/* Waste Reduction */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">Waste Reduction (%)</label>
            {isEditing ? (
              <Input
                type="number"
                step="0.1"
                value={record.wasteReductionRate}
                onChange={(e) => onChange("wasteReductionRate", parseFloat(e.target.value) || 0)}
                className="h-8 text-xs font-bold font-mono"
              />
            ) : (
              <span className="font-bold text-foreground font-mono">{record.wasteReductionRate}%</span>
            )}
          </div>

          {/* Recycling Rate */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">Recycling Rate (%)</label>
            {isEditing ? (
              <Input
                type="number"
                step="0.1"
                value={record.recyclingRate}
                onChange={(e) => onChange("recyclingRate", parseFloat(e.target.value) || 0)}
                className="h-8 text-xs font-bold font-mono"
              />
            ) : (
              <span className="font-bold text-foreground font-mono">{record.recyclingRate}%</span>
            )}
          </div>

          {/* ESG Compliance Checkbox */}
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label htmlFor="esgCompliance" className="font-semibold text-foreground cursor-pointer">
              ESG Compliance Verified
            </label>
            <Checkbox
              id="esgCompliance"
              checked={record.esgComplianceVerified}
              onCheckedChange={(checked) => onChange("esgComplianceVerified", !!checked)}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

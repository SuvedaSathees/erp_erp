import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  InitiativeCategory,
  InitiativeStatus,
  ManufacturingExcellenceRecord,
} from "@/services/types";

interface ExcellenceOverviewCardProps {
  record: ManufacturingExcellenceRecord;
  onChange: (field: keyof ManufacturingExcellenceRecord, value: any) => void;
  isEditing?: boolean;
}

const INITIATIVE_CATEGORIES: InitiativeCategory[] = [
  "Operational Excellence",
  "Lean Transformation",
  "Six Sigma",
  "Kaizen",
  "TPM",
  "Smart Manufacturing",
  "Industry 4.0",
  "Energy Excellence",
  "Sustainability",
  "Digital Transformation",
];

const INITIATIVE_STATUSES: InitiativeStatus[] = [
  "Proposed",
  "Assessment",
  "Planning",
  "Implementation",
  "Monitoring",
  "Validation",
  "Completed",
  "Closed",
];

export const ExcellenceOverviewCard: React.FC<ExcellenceOverviewCardProps> = ({
  record,
  onChange,
  isEditing = true,
}) => {
  return (
    <Card className="border-border rounded-xl shadow-xs">
      <CardHeader className="border-b border-border/60 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-foreground">
            Excellence Initiative Overview
          </CardTitle>
          <span className="text-xs font-semibold text-muted-foreground">
            Continuous Improvement Profile
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 text-xs">
        {/* Initiative Category */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-foreground">Initiative Category</label>
          {isEditing ? (
            <Select
              value={record.initiativeCategory}
              onValueChange={(val) => onChange("initiativeCategory", val as InitiativeCategory)}
            >
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {INITIATIVE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="font-medium text-foreground">{record.initiativeCategory}</span>
          )}
        </div>

        {/* Business Objective */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-foreground">Business Objective</label>
          {isEditing ? (
            <Textarea
              rows={2}
              value={record.businessObjective}
              onChange={(e) => onChange("businessObjective", e.target.value)}
              placeholder="State clear business objective and operational problem..."
              className="text-xs resize-none"
            />
          ) : (
            <p className="text-muted-foreground">{record.businessObjective}</p>
          )}
        </div>

        {/* Current Performance */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">Current Performance (Baseline)</label>
          {isEditing ? (
            <Textarea
              rows={2}
              value={record.currentPerformance}
              onChange={(e) => onChange("currentPerformance", e.target.value)}
              placeholder="e.g. OEE 72.65%, defect rate 1.80%, downtime 8.5%"
              className="text-xs resize-none font-mono"
            />
          ) : (
            <p className="text-muted-foreground">{record.currentPerformance}</p>
          )}
        </div>

        {/* Target Performance */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">Target Performance (Goal)</label>
          {isEditing ? (
            <Textarea
              rows={2}
              value={record.targetPerformance}
              onChange={(e) => onChange("targetPerformance", e.target.value)}
              placeholder="e.g. OEE 85.00%, defect rate < 0.50%, downtime < 4%"
              className="text-xs resize-none font-mono"
            />
          ) : (
            <p className="text-muted-foreground">{record.targetPerformance}</p>
          )}
        </div>

        {/* Improvement Strategy */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-foreground">Improvement Strategy</label>
          {isEditing ? (
            <Textarea
              rows={2}
              value={record.improvementStrategy}
              onChange={(e) => onChange("improvementStrategy", e.target.value)}
              placeholder="e.g. Lean Value Stream Mapping, TPM, Six Sigma DMAIC, automated Vision Inspection"
              className="text-xs resize-none"
            />
          ) : (
            <p className="text-muted-foreground">{record.improvementStrategy}</p>
          )}
        </div>

        {/* Expected Benefits */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-foreground">Expected Business Benefits</label>
          {isEditing ? (
            <Textarea
              rows={2}
              value={record.expectedBusinessBenefits}
              onChange={(e) => onChange("expectedBusinessBenefits", e.target.value)}
              placeholder="e.g. Annualized cost savings of ₹ 18.75 Lakhs, 12.35% OEE uplift"
              className="text-xs resize-none"
            />
          ) : (
            <p className="text-muted-foreground">{record.expectedBusinessBenefits}</p>
          )}
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">Priority</label>
          {isEditing ? (
            <Select
              value={record.priority}
              onValueChange={(val) => onChange("priority", val as "Low" | "Medium" | "High" | "Critical")}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low" className="text-xs">Low</SelectItem>
                <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                <SelectItem value="High" className="text-xs font-semibold text-amber-600">High</SelectItem>
                <SelectItem value="Critical" className="text-xs font-semibold text-destructive">Critical</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className="font-medium text-foreground">{record.priority}</span>
          )}
        </div>

        {/* Initiative Status */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">Initiative Status</label>
          {isEditing ? (
            <Select
              value={record.initiativeStatus}
              onValueChange={(val) => onChange("initiativeStatus", val as InitiativeStatus)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {INITIATIVE_STATUSES.map((st) => (
                  <SelectItem key={st} value={st} className="text-xs">
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="font-medium text-foreground">{record.initiativeStatus}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SmartFactoryLevel,
  Industry40Maturity,
  SmartFactoryProjectStatus,
  SmartFactoryDevelopmentRecord,
} from "@/services/types";

interface SmartFactoryOverviewCardProps {
  record: SmartFactoryDevelopmentRecord;
  onChange: (field: keyof SmartFactoryDevelopmentRecord, value: any) => void;
  isEditing?: boolean;
}

const SMART_FACTORY_LEVELS: SmartFactoryLevel[] = [
  "Digital Factory",
  "Connected Factory",
  "Intelligent Factory",
  "Autonomous Factory",
  "Lights-Out Factory",
];

const MATURITY_LEVELS: Industry40Maturity[] = [
  "Initial",
  "Managed",
  "Connected",
  "Intelligent",
  "Autonomous",
];

const PROJECT_STATUSES: SmartFactoryProjectStatus[] = [
  "Concept",
  "Assessment",
  "Design",
  "Development",
  "Integration",
  "Pilot",
  "Validation",
  "Commissioning",
  "Operational",
  "Closed",
];

export const SmartFactoryOverviewCard: React.FC<SmartFactoryOverviewCardProps> = ({
  record,
  onChange,
  isEditing = true,
}) => {
  return (
    <Card className="border-border rounded-xl shadow-xs">
      <CardHeader className="border-b border-border/60 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-foreground">
            Smart Factory Overview
          </CardTitle>
          <span className="text-xs font-semibold text-muted-foreground">
            Industry 4.0 Transformation Profile
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 text-xs">
        {/* Factory Vision */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-foreground">Factory Vision</label>
          {isEditing ? (
            <Textarea
              rows={2}
              value={record.factoryVision}
              onChange={(e) => onChange("factoryVision", e.target.value)}
              placeholder="Define high-level factory vision..."
              className="text-xs resize-none"
            />
          ) : (
            <p className="text-muted-foreground">{record.factoryVision}</p>
          )}
        </div>

        {/* Business Objectives */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-foreground">Business Objectives</label>
          {isEditing ? (
            <Textarea
              rows={2}
              value={record.businessObjectives}
              onChange={(e) => onChange("businessObjectives", e.target.value)}
              placeholder="List specific ROI and business targets..."
              className="text-xs resize-none"
            />
          ) : (
            <p className="text-muted-foreground">{record.businessObjectives}</p>
          )}
        </div>

        {/* Smart Factory Level */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">Smart Factory Level</label>
          {isEditing ? (
            <Select
              value={record.smartFactoryLevel}
              onValueChange={(val: SmartFactoryLevel) => onChange("smartFactoryLevel", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                {SMART_FACTORY_LEVELS.map((lvl) => (
                  <SelectItem key={lvl} value={lvl} className="text-xs">
                    {lvl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="font-medium text-foreground">{record.smartFactoryLevel}</span>
          )}
        </div>

        {/* Industry 4.0 Maturity */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">Industry 4.0 Maturity</label>
          {isEditing ? (
            <Select
              value={record.industry40Maturity}
              onValueChange={(val: Industry40Maturity) => onChange("industry40Maturity", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Maturity" />
              </SelectTrigger>
              <SelectContent>
                {MATURITY_LEVELS.map((mat) => (
                  <SelectItem key={mat} value={mat} className="text-xs">
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="font-medium text-foreground">{record.industry40Maturity}</span>
          )}
        </div>

        {/* Project Scope */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-foreground">Project Scope</label>
          {isEditing ? (
            <Input
              value={record.projectScope}
              onChange={(e) => onChange("projectScope", e.target.value)}
              placeholder="e.g. EVSE assembly, SMT, testing, and warehousing"
              className="h-9 text-xs"
            />
          ) : (
            <span className="font-medium text-foreground">{record.projectScope}</span>
          )}
        </div>

        {/* Expected Benefits */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-foreground">Expected Business Benefits</label>
          {isEditing ? (
            <Input
              value={record.expectedBenefits}
              onChange={(e) => onChange("expectedBenefits", e.target.value)}
              placeholder="e.g. Higher OEE, predictive maintenance, energy optimization"
              className="h-9 text-xs"
            />
          ) : (
            <span className="font-medium text-foreground">{record.expectedBenefits}</span>
          )}
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">Priority</label>
          {isEditing ? (
            <Select
              value={record.priority}
              onValueChange={(val: "Low" | "Medium" | "High" | "Critical") => onChange("priority", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low" className="text-xs">Low</SelectItem>
                <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                <SelectItem value="High" className="text-xs">High</SelectItem>
                <SelectItem value="Critical" className="text-xs">Critical</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className="font-medium text-foreground">{record.priority}</span>
          )}
        </div>

        {/* Project Status */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">Project Status</label>
          {isEditing ? (
            <Select
              value={record.projectStatus}
              onValueChange={(val: SmartFactoryProjectStatus) => onChange("projectStatus", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((st) => (
                  <SelectItem key={st} value={st} className="text-xs">
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="font-medium text-foreground">{record.projectStatus}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldCheck } from "lucide-react";
import type { ManufacturingExcellenceRecord } from "@/services/types";

interface ExcellenceQualityCardProps {
  record: ManufacturingExcellenceRecord;
  onChange: (field: keyof ManufacturingExcellenceRecord, value: any) => void;
  isEditing?: boolean;
}

export const ExcellenceQualityCard: React.FC<ExcellenceQualityCardProps> = ({
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
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Quality & Compliance
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Quality</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                {record.qualityExcellenceScore} / 100
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
          {/* Customer PPM */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">Customer PPM</label>
            {isEditing ? (
              <Input
                type="number"
                value={record.customerPpm}
                onChange={(e) => onChange("customerPpm", parseFloat(e.target.value) || 0)}
                className="h-8 text-xs font-bold font-mono"
              />
            ) : (
              <span className="font-bold text-foreground font-mono">{record.customerPpm} PPM</span>
            )}
          </div>

          {/* FPY */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">First Pass Yield (FPY %)</label>
            {isEditing ? (
              <Input
                type="number"
                step="0.1"
                value={record.firstPassYield}
                onChange={(e) => onChange("firstPassYield", parseFloat(e.target.value) || 0)}
                className="h-8 text-xs font-bold font-mono"
              />
            ) : (
              <span className="font-bold text-foreground font-mono">{record.firstPassYield}%</span>
            )}
          </div>

          {/* Capability */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">Process Capability (Cp/Cpk)</label>
            {isEditing ? (
              <Input
                value={record.processCapabilityCpCpk}
                onChange={(e) => onChange("processCapabilityCpCpk", e.target.value)}
                placeholder="e.g. 1.67 / 1.58"
                className="h-8 text-xs font-bold font-mono"
              />
            ) : (
              <span className="font-bold text-foreground font-mono">{record.processCapabilityCpCpk}</span>
            )}
          </div>

          {/* CAPA Status */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">CAPA Status</label>
            {isEditing ? (
              <Select
                value={record.capaStatus}
                onValueChange={(val) => onChange("capaStatus", val)}
              >
                <SelectTrigger className="h-8 text-xs font-semibold">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Closed" className="text-xs text-emerald-600">Closed</SelectItem>
                  <SelectItem value="In Progress" className="text-xs text-blue-600">In Progress</SelectItem>
                  <SelectItem value="Under Review" className="text-xs text-amber-600">Under Review</SelectItem>
                  <SelectItem value="Pending Action" className="text-xs text-rose-600">Pending Action</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="font-bold text-foreground">{record.capaStatus}</span>
            )}
          </div>

          {/* Audit Compliance */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label className="font-semibold text-foreground">Audit Compliance (%)</label>
            {isEditing ? (
              <Input
                type="number"
                step="0.1"
                value={record.auditComplianceScore}
                onChange={(e) => onChange("auditComplianceScore", parseFloat(e.target.value) || 0)}
                className="h-8 text-xs font-bold font-mono"
              />
            ) : (
              <span className="font-bold text-foreground font-mono">{record.auditComplianceScore}%</span>
            )}
          </div>

          {/* Regulatory Compliance Checkbox */}
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <label htmlFor="regCompliance" className="font-semibold text-foreground cursor-pointer">
              Regulatory Compliance Verified
            </label>
            <Checkbox
              id="regCompliance"
              checked={record.regulatoryComplianceVerified}
              onCheckedChange={(checked) => onChange("regulatoryComplianceVerified", !!checked)}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

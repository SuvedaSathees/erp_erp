import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CapaRecord, CapaType, CapaSource, CapaSeverity, CapaStatus } from "@/services/capaTypes";

interface CapaHeaderCardProps {
  record: CapaRecord;
  onChange: (field: keyof CapaRecord, value: any) => void;
}

export function CapaHeaderCard({ record, onChange }: CapaHeaderCardProps) {
  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
          <span>CAPA Header Information</span>
          <span className="text-xs font-normal text-muted-foreground">
            CAPA ID: {record.capaNumber}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 min-w-0">
        {/* Title */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            CAPA Title / Problem Summary <span className="text-rose-500">*</span>
          </Label>
          <Input
            value={record.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="h-9 text-xs font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-w-0">
          {/* CAPA Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              CAPA No. <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.capaNumber}
              onChange={(e) => onChange("capaNumber", e.target.value)}
              className="h-9 text-xs bg-muted/40 font-mono font-medium"
            />
          </div>

          {/* CAPA Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              CAPA Type <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.capaType}
              onValueChange={(val: CapaType) => onChange("capaType", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Corrective">Corrective Action</SelectItem>
                <SelectItem value="Preventive">Preventive Action</SelectItem>
                <SelectItem value="Corrective + Preventive">Corrective + Preventive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              CAPA Source <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.source}
              onValueChange={(val: CapaSource) => onChange("source", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Non-Conformance Report (NCR)">Non-Conformance (NCR)</SelectItem>
                <SelectItem value="Internal Quality Audit">Internal Quality Audit</SelectItem>
                <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
                <SelectItem value="Supplier Quality Issue">Supplier Quality Issue</SelectItem>
                <SelectItem value="Quality Trend Analysis">Quality Trend Analysis</SelectItem>
                <SelectItem value="Process Failure (FMEA)">Process Failure (PFMEA)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source Reference */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Source Reference No.
            </Label>
            <Input
              value={record.sourceReference}
              onChange={(e) => onChange("sourceReference", e.target.value)}
              className="h-9 text-xs font-mono font-semibold text-primary"
            />
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Severity Level <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.severity}
              onValueChange={(val: CapaSeverity) => onChange("severity", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Major">Major</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Minor">Minor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Status <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.status}
              onValueChange={(val: CapaStatus) => onChange("status", val)}
            >
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                <SelectItem value="Action Implementation">Action Implementation</SelectItem>
                <SelectItem value="Effectiveness Verification">Effectiveness Verification</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Owner */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              CAPA Owner <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.owner}
              onChange={(e) => onChange("owner", e.target.value)}
              className="h-9 text-xs font-medium"
            />
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Department
            </Label>
            <Input
              value={record.department}
              onChange={(e) => onChange("department", e.target.value)}
              className="h-9 text-xs font-medium"
            />
          </div>

          {/* Target Closure Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Target Closure Date
            </Label>
            <Input
              value={record.targetClosureDate}
              onChange={(e) => onChange("targetClosureDate", e.target.value)}
              className="h-9 text-xs font-semibold text-rose-600 dark:text-rose-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

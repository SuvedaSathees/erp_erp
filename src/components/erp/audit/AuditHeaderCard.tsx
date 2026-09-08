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
import { AuditRecord, AuditType, AuditCategory, AuditStatus } from "@/services/auditTypes";

interface AuditHeaderCardProps {
  record: AuditRecord;
  onChange: (field: keyof AuditRecord, value: any) => void;
}

export function AuditHeaderCard({ record, onChange }: AuditHeaderCardProps) {
  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
          <span>Audit Header Information</span>
          <span className="text-xs font-normal text-muted-foreground">
            Audit ID: {record.auditNumber}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 min-w-0">
        {/* Title */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Audit Engagement Title <span className="text-rose-500">*</span>
          </Label>
          <Input
            value={record.auditTitle}
            onChange={(e) => onChange("auditTitle", e.target.value)}
            className="h-9 text-xs font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-w-0">
          {/* Audit Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Audit No. <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.auditNumber}
              onChange={(e) => onChange("auditNumber", e.target.value)}
              className="h-9 text-xs bg-muted/40 font-mono font-medium"
            />
          </div>

          {/* Audit Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Audit Type <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.auditType}
              onValueChange={(val: AuditType) => onChange("auditType", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Internal">Internal Audit</SelectItem>
                <SelectItem value="Supplier">Supplier / Vendor Audit</SelectItem>
                <SelectItem value="Process">Process Verification Audit</SelectItem>
                <SelectItem value="Product">Product Quality Audit</SelectItem>
                <SelectItem value="System">Management System Audit</SelectItem>
                <SelectItem value="Compliance">Regulatory Compliance Audit</SelectItem>
                <SelectItem value="Customer">Customer Audit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Standard / Category
            </Label>
            <Select
              value={record.auditCategory}
              onValueChange={(val: AuditCategory) => onChange("auditCategory", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quality Management System (ISO 9001)">
                  ISO 9001 QMS
                </SelectItem>
                <SelectItem value="Automotive QMS (IATF 16949)">
                  IATF 16949 Automotive
                </SelectItem>
                <SelectItem value="Environmental (ISO 14001)">
                  ISO 14001 EHS
                </SelectItem>
                <SelectItem value="Occupational Health & Safety (ISO 45001)">
                  ISO 45001 Safety
                </SelectItem>
                <SelectItem value="Process & Workstation Audit">
                  Process & Workstation
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Audit Status <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.auditStatus}
              onValueChange={(val: AuditStatus) => onChange("auditStatus", val)}
            >
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Start Date
            </Label>
            <Input
              value={record.auditDate}
              onChange={(e) => onChange("auditDate", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Scheduled End Date
            </Label>
            <Input
              value={record.scheduledEndDate}
              onChange={(e) => onChange("scheduledEndDate", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Lead Auditor */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Lead Auditor <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.leadAuditor}
              onChange={(e) => onChange("leadAuditor", e.target.value)}
              className="h-9 text-xs font-medium"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Audit Location / Facility
            </Label>
            <Input
              value={record.auditLocation}
              onChange={(e) => onChange("auditLocation", e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

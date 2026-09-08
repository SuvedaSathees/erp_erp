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
import { RcaRecord, RcaType, RcaSource, RcaMethodology, RcaStatus } from "@/services/rcaTypes";

interface RcaHeaderCardProps {
  record: RcaRecord;
  onChange: (field: keyof RcaRecord, value: any) => void;
}

export function RcaHeaderCard({ record, onChange }: RcaHeaderCardProps) {
  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
          <span>Root Cause Analysis Header</span>
          <span className="text-xs font-normal text-muted-foreground">
            Investigation ID: {record.rcaNumber}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 min-w-0">
        {/* Title */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Investigation Subject / Incident Description <span className="text-rose-500">*</span>
          </Label>
          <Input
            value={record.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="h-9 text-xs font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-w-0">
          {/* RCA Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              RCA No. <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.rcaNumber}
              onChange={(e) => onChange("rcaNumber", e.target.value)}
              className="h-9 text-xs bg-muted/40 font-mono font-medium"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Investigation Type <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.rcaType}
              onValueChange={(val: RcaType) => onChange("rcaType", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Process Failure">Process Failure</SelectItem>
                <SelectItem value="Product Defect">Product Defect</SelectItem>
                <SelectItem value="Supplier Quality">Supplier Quality</SelectItem>
                <SelectItem value="Systemic / QMS">Systemic / QMS</SelectItem>
                <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Triggering Source
            </Label>
            <Select
              value={record.rcaSource}
              onValueChange={(val: RcaSource) => onChange("rcaSource", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Non-Conformance Report (NCR)">NCR</SelectItem>
                <SelectItem value="CAPA Investigation">CAPA Investigation</SelectItem>
                <SelectItem value="Internal Audit Finding">Internal Audit Finding</SelectItem>
                <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
                <SelectItem value="Process Capability Excursion">SPC Excursion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source Reference */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Trigger Reference
            </Label>
            <Input
              value={record.sourceReference}
              onChange={(e) => onChange("sourceReference", e.target.value)}
              className="h-9 text-xs font-mono font-semibold text-primary"
            />
          </div>

          {/* Methodology */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Methodology <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.methodology}
              onValueChange={(val: RcaMethodology) => onChange("methodology", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5-Why + Fishbone (Ishikawa)">5-Why + Fishbone</SelectItem>
                <SelectItem value="8D Problem Solving">8D Problem Solving</SelectItem>
                <SelectItem value="Fault Tree Analysis (FTA)">Fault Tree Analysis</SelectItem>
                <SelectItem value="Failure Mode & Effects Analysis (FMEA)">FMEA</SelectItem>
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
              onValueChange={(val: RcaStatus) => onChange("status", val)}
            >
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Open / Active">Open / Active</SelectItem>
                <SelectItem value="Cause Identified">Cause Identified</SelectItem>
                <SelectItem value="Root Cause Verified">Root Cause Verified</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lead Investigator */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Lead Investigator <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.leadInvestigator}
              onChange={(e) => onChange("leadInvestigator", e.target.value)}
              className="h-9 text-xs font-medium"
            />
          </div>

          {/* Target Completion Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Target Closure Date
            </Label>
            <Input
              value={record.targetDate}
              onChange={(e) => onChange("targetDate", e.target.value)}
              className="h-9 text-xs font-medium"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

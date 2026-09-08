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
import { ComplianceRecord, ComplianceCategory, ComplianceType, RiskLevel } from "@/services/complianceTypes";

interface ComplianceHeaderCardProps {
  record: ComplianceRecord;
  onChange: (field: keyof ComplianceRecord, value: any) => void;
}

export function ComplianceHeaderCard({
  record,
  onChange,
}: ComplianceHeaderCardProps) {
  return (
    <Card className="shadow-xs border-border/80 overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60">
        <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
          <span>Compliance Requirement Header</span>
          <span className="text-xs font-mono font-normal text-muted-foreground">
            Register ID: {record.complianceNumber}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Requirement Title */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Requirement Title / Standard Clause <span className="text-rose-500">*</span>
          </Label>
          <Input
            value={record.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="h-9 text-xs font-semibold"
          />
        </div>

        {/* 3-Column Balanced Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Compliance Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Compliance No. <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.complianceNumber}
              onChange={(e) => onChange("complianceNumber", e.target.value)}
              className="h-9 text-xs bg-muted/30 font-mono font-medium"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Category <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.category}
              onValueChange={(val: ComplianceCategory) => onChange("category", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="ISO Standard">ISO Standard</SelectItem>
                <SelectItem value="Regulatory">Regulatory</SelectItem>
                <SelectItem value="Internal Policy">Internal Policy</SelectItem>
                <SelectItem value="License & Permits">License & Permits</SelectItem>
                <SelectItem value="Certification">Certification</SelectItem>
                <SelectItem value="Legal Register">Legal Register</SelectItem>
                <SelectItem value="Customer Requirement">Customer Requirement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sub-Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Sub-Category
            </Label>
            <Input
              value={record.subCategory}
              onChange={(e) => onChange("subCategory", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Standard Reference */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Standard / Law Ref <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.standardReference}
              onChange={(e) => onChange("standardReference", e.target.value)}
              className="h-9 text-xs font-mono"
            />
          </div>

          {/* Clause Reference */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Clause / Section Ref
            </Label>
            <Input
              value={record.clauseReference}
              onChange={(e) => onChange("clauseReference", e.target.value)}
              className="h-9 text-xs font-mono"
            />
          </div>

          {/* Compliance Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Compliance Type
            </Label>
            <Select
              value={record.complianceType}
              onValueChange={(val: ComplianceType) => onChange("complianceType", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Mandatory">Mandatory</SelectItem>
                <SelectItem value="Statutory">Statutory</SelectItem>
                <SelectItem value="Voluntary">Voluntary</SelectItem>
                <SelectItem value="Contractual">Contractual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Level */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Risk Level
            </Label>
            <Select
              value={record.riskLevel}
              onValueChange={(val: RiskLevel) => onChange("riskLevel", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Responsible Owner */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Responsible Owner
            </Label>
            <Input
              value={record.responsibleOwner}
              onChange={(e) => onChange("responsibleOwner", e.target.value)}
              className="h-9 text-xs font-medium"
            />
          </div>

          {/* Department / Function */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Department / Function
            </Label>
            <Input
              value={record.department}
              onChange={(e) => onChange("department", e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ComplianceHeaderCard;

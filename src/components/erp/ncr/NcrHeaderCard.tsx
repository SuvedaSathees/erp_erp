import { Calendar, Link2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NcrRecord, NcrPriority, NcrSource, NcrStatus } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrHeaderCardProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

export function NcrHeaderCard({ record, onChange }: NcrHeaderCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs min-w-0">
      <h2 className="text-sm sm:text-base font-semibold text-foreground mb-4">
        NCR Header
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-w-0">
        {/* NCR Number */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            NCR Number
          </Label>
          <Input
            value={record.ncrNumber}
            readOnly
            className="h-9 text-xs bg-muted/40 font-mono font-medium border-border/70"
          />
        </div>

        {/* NCR Date */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            NCR Date
          </Label>
          <div className="relative">
            <Input
              value={record.ncrDate}
              onChange={(e) => onChange({ ncrDate: e.target.value })}
              className="h-9 text-xs pr-8 border-border/70"
            />
            <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* NCR Source */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            NCR Source <span className="text-destructive">*</span>
          </Label>
          <Select
            value={record.ncrSource}
            onValueChange={(val: NcrSource) => onChange({ ncrSource: val })}
          >
            <SelectTrigger className="h-9 text-xs border-border/70 truncate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Incoming">Incoming Inspection</SelectItem>
              <SelectItem value="In-Process Inspection">In-Process Inspection</SelectItem>
              <SelectItem value="Final">Final Inspection</SelectItem>
              <SelectItem value="Supplier">Supplier Quality</SelectItem>
              <SelectItem value="Customer">Customer Complaint</SelectItem>
              <SelectItem value="Audit">Quality Audit</SelectItem>
              <SelectItem value="Production">Production</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Source Reference */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Source Reference <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              value={record.sourceReference}
              onChange={(e) => onChange({ sourceReference: e.target.value })}
              className="h-9 text-xs pr-8 font-mono border-border/70"
            />
            <button
              type="button"
              onClick={() =>
                toast.info(`Opening linked record ${record.sourceReference}`, {
                  description: "Redirecting to In-Process Inspection details.",
                })
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800 transition-colors"
              title="Open linked inspection"
            >
              <Link2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Organization */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Organization <span className="text-destructive">*</span>
          </Label>
          <Input
            value={record.organization}
            onChange={(e) => onChange({ organization: e.target.value })}
            className="h-9 text-xs border-border/70"
          />
        </div>

        {/* Plant */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Plant <span className="text-destructive">*</span>
          </Label>
          <Select
            value={record.plant}
            onValueChange={(val) => onChange({ plant: val })}
          >
            <SelectTrigger className="h-9 text-xs border-border/70 truncate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chennai Plant">Chennai Plant</SelectItem>
              <SelectItem value="Coimbatore Unit 2">Coimbatore Unit 2</SelectItem>
              <SelectItem value="Pune Assembly Hub">Pune Assembly Hub</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Department <span className="text-destructive">*</span>
          </Label>
          <Select
            value={record.department}
            onValueChange={(val) => onChange({ department: val })}
          >
            <SelectTrigger className="h-9 text-xs border-border/70 truncate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
              <SelectItem value="Warehouse / Stores">Warehouse / Stores</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Location
          </Label>
          <Input
            value={record.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="h-9 text-xs border-border/70"
          />
        </div>

        {/* Reported By */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Reported By <span className="text-destructive">*</span>
          </Label>
          <Input
            value={record.reportedBy}
            onChange={(e) => onChange({ reportedBy: e.target.value })}
            className="h-9 text-xs border-border/70"
          />
        </div>

        {/* Responsible Owner */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Responsible Owner <span className="text-destructive">*</span>
          </Label>
          <Input
            value={record.responsibleOwner}
            onChange={(e) => onChange({ responsibleOwner: e.target.value })}
            className="h-9 text-xs border-border/70"
          />
        </div>

        {/* Quality Engineer */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Quality Engineer <span className="text-destructive">*</span>
          </Label>
          <Input
            value={record.qualityEngineer}
            onChange={(e) => onChange({ qualityEngineer: e.target.value })}
            className="h-9 text-xs border-border/70"
          />
        </div>

        {/* Priority */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Priority <span className="text-destructive">*</span>
          </Label>
          <Select
            value={record.priority}
            onValueChange={(val: NcrPriority) => onChange({ priority: val })}
          >
            <SelectTrigger className="h-9 text-xs border-border/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* NCR Status */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            NCR Status
          </Label>
          <Select
            value={record.ncrStatus}
            onValueChange={(val: NcrStatus) => onChange({ ncrStatus: val })}
          >
            <SelectTrigger className="h-9 text-xs border-border/70 font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Investigation">Investigation</SelectItem>
              <SelectItem value="CAPA">CAPA</SelectItem>
              <SelectItem value="Verification">Verification</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Due Date */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Due Date
          </Label>
          <Input
            value={record.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value })}
            className="h-9 text-xs font-semibold text-rose-600 dark:text-rose-400 border-border/70"
          />
        </div>
      </div>
    </div>
  );
}

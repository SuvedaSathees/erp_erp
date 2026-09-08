import { Search, Calendar, User, FileText, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { NcrRecord } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrInvestigationTabProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

export function NcrInvestigationTab({ record, onChange }: NcrInvestigationTabProps) {
  const handleMarkComplete = () => {
    onChange({ investigationStatus: "Complete" });
    toast.success("Investigation marked as Complete", {
      description: "Findings recorded and ready for Root Cause Analysis approval.",
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <Search className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Section 7: Quality Non-Conformance Investigation
            </h3>
            <p className="text-xs text-muted-foreground">
              Methodological examination of physical evidence, process records, and operational conditions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
              record.investigationStatus === "Complete"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200"
            }`}
          >
            {record.investigationStatus}
          </span>
          {record.investigationStatus !== "Complete" && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkComplete}
              className="h-8 text-xs font-medium"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Investigation ID</Label>
          <Input
            value={record.investigationId}
            readOnly
            className="h-9 text-xs font-mono bg-muted/40"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Investigation Lead</Label>
          <div className="relative">
            <Input
              value={record.investigationLead}
              onChange={(e) => onChange({ investigationLead: e.target.value })}
              className="h-9 text-xs pr-8"
            />
            <User className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Investigation Method</Label>
          <Select
            value={record.investigationMethod}
            onValueChange={(val: any) => onChange({ investigationMethod: val })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5 Why">5 Why Analysis</SelectItem>
              <SelectItem value="Fishbone">Fishbone (Ishikawa)</SelectItem>
              <SelectItem value="8D">8D Problem Solving</SelectItem>
              <SelectItem value="Fault Tree">Fault Tree Analysis (FTA)</SelectItem>
              <SelectItem value="Other">Other Diagnostic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Start Time</Label>
          <div className="relative">
            <Input
              value={record.investigationStart}
              onChange={(e) => onChange({ investigationStart: e.target.value })}
              className="h-9 text-xs pr-8 font-mono"
            />
            <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Evidence & Records Review */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-medium">
            Evidence Reviewed
          </Label>
          <Textarea
            rows={3}
            value={record.evidenceReviewed}
            onChange={(e) => onChange({ evidenceReviewed: e.target.value })}
            className="text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-medium">
            Process Reviewed
          </Label>
          <Textarea
            rows={3}
            value={record.processReviewed}
            onChange={(e) => onChange({ processReviewed: e.target.value })}
            className="text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-medium">
            Records Reviewed
          </Label>
          <Textarea
            rows={3}
            value={record.recordsReviewed}
            onChange={(e) => onChange({ recordsReviewed: e.target.value })}
            className="text-xs"
          />
        </div>
      </div>

      {/* Findings & Suspected Cause */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-semibold">
            Detailed Investigation Findings
          </Label>
          <Textarea
            rows={3}
            value={record.investigationFindings}
            onChange={(e) => onChange({ investigationFindings: e.target.value })}
            className="text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-semibold">
            Primary Suspected Root Cause
          </Label>
          <Textarea
            rows={3}
            value={record.suspectedCause}
            onChange={(e) => onChange({ suspectedCause: e.target.value })}
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}

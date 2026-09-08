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
import { CalibrationRecord, CalibrationType, PriorityLevel } from "@/services/calibrationTypes";

interface CalibrationHeaderCardProps {
  record: CalibrationRecord;
  onChange: (field: keyof CalibrationRecord, value: any) => void;
}

export function CalibrationHeaderCard({
  record,
  onChange,
}: CalibrationHeaderCardProps) {
  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
          <span>Calibration Header</span>
          <span className="text-xs font-normal text-muted-foreground">
            Transaction Code: {record.calibrationNumber}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-w-0">
          {/* Calibration Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Calibration No. <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.calibrationNumber}
              onChange={(e) => onChange("calibrationNumber", e.target.value)}
              className="h-9 text-xs bg-muted/40 font-mono font-medium"
            />
          </div>

          {/* Calibration Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Calibration Date <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.calibrationDate}
              onChange={(e) => onChange("calibrationDate", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Calibration Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Calibration Type <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.calibrationType}
              onValueChange={(val: CalibrationType) => onChange("calibrationType", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="External">External (Accredited Lab)</SelectItem>
                <SelectItem value="Internal">Internal (In-House)</SelectItem>
                <SelectItem value="Verification">Routine Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calibration Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Status <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.calibrationStatus}
              onValueChange={(val: any) => onChange("calibrationStatus", val)}
            >
              <SelectTrigger className="h-9 text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Equipment Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.equipmentName}
              onChange={(e) => onChange("equipmentName", e.target.value)}
              className="h-9 text-xs font-medium"
            />
          </div>

          {/* Equipment ID */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Equipment ID <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={record.equipmentId}
              onChange={(e) => onChange("equipmentId", e.target.value)}
              className="h-9 text-xs font-mono"
            />
          </div>

          {/* Agency */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Calibration Agency
            </Label>
            <Input
              value={record.calibrationAgency}
              onChange={(e) => onChange("calibrationAgency", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Procedure */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Procedure Reference
            </Label>
            <Input
              value={record.calibrationProcedure}
              onChange={(e) => onChange("calibrationProcedure", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Frequency */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Frequency
            </Label>
            <Input
              value={record.calibrationFrequency}
              onChange={(e) => onChange("calibrationFrequency", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Previous Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Previous Cal. Date
            </Label>
            <Input
              value={record.previousCalibrationDate}
              onChange={(e) => onChange("previousCalibrationDate", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Next Due Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Next Due Date
            </Label>
            <Input
              value={record.nextCalibrationDate}
              onChange={(e) => onChange("nextCalibrationDate", e.target.value)}
              className="h-9 text-xs font-semibold text-blue-600 dark:text-blue-400"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Priority
            </Label>
            <Select
              value={record.priority}
              onValueChange={(val: PriorityLevel) => onChange("priority", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { CalibrationRecord } from "@/services/calibrationTypes";

interface CalibrationScheduleCardProps {
  record: CalibrationRecord;
}

export function CalibrationScheduleCard({
  record,
}: CalibrationScheduleCardProps) {
  const { schedule } = record;

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Calibration Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Timeline */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {/* Scheduled */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center border-2 border-blue-600">
              <CheckCircle className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground">Scheduled</span>
              <p className="text-[11px] text-muted-foreground">{schedule.scheduledDate}</p>
            </div>
          </div>

          {/* In Progress */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center border-2 border-amber-600">
              <Clock className="w-3 h-3 text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground">In Progress</span>
              <p className="text-[11px] text-muted-foreground">{schedule.inProgressDate}</p>
            </div>
          </div>

          {/* Next Due */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center border-2 border-emerald-600">
              <AlertCircle className="w-3 h-3 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Next Calibration Due
              </span>
              <p className="text-[11px] text-muted-foreground font-semibold">
                {schedule.nextDueDate}
              </p>
            </div>
          </div>
        </div>

        {/* Interval Summary */}
        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Cycle Interval:</span>
          <span className="font-semibold text-foreground">Annual (365 Days)</span>
        </div>
      </CardContent>
    </Card>
  );
}

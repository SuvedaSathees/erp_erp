import { ArrowRight } from "lucide-react";
import { NcrActivityLog } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrRecentActivitiesCardProps {
  activities: NcrActivityLog[];
}

export function NcrRecentActivitiesCard({ activities }: NcrRecentActivitiesCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/40">
        <h2 className="text-sm sm:text-base font-semibold text-foreground">
          Recent Activities
        </h2>
        <button
          type="button"
          onClick={() =>
            toast.info("Audit Trail Activity Log", {
              description: "Full timestamped record of user edits, approvals, and workflow transitions.",
            })
          }
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3 relative before:absolute before:inset-0 before:left-[4px] before:w-[2px] before:bg-muted-foreground/15">
        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start gap-3 pl-4">
            {/* Timeline Blue Dot */}
            <div className="absolute -left-[1px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-background shrink-0" />

            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{act.action}</span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {act.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                By: <span className="text-foreground/80 font-medium">{act.user}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

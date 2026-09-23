import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface DefectSlice {
  label: string;
  percentage: number;
  color: string;
  count: number;
}

const DEFECT_SLICES: DefectSlice[] = [
  { label: "Visual", percentage: 45, color: "#10b981", count: 1 },
  { label: "Dimensional", percentage: 20, color: "#06b6d4", count: 0 },
  { label: "Functional", percentage: 15, color: "#f97316", count: 0 },
  { label: "Material", percentage: 10, color: "#ef4444", count: 1 },
  { label: "Others", percentage: 10, color: "#0A3C75", count: 0 },
];

export function NcrDefectCategoryDonutCard() {
  const totalDefects = 2;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray and strokeDashoffset for each slice
  let accumulatedPercent = 0;
  const renderedSlices = DEFECT_SLICES.map((slice) => {
    const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += slice.percentage;
    return {
      ...slice,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/40">
        <h2 className="text-sm sm:text-base font-semibold text-foreground">
          Defect Category
        </h2>
        <button
          type="button"
          onClick={() =>
            toast.info("Defect Category Pareto Breakdown", {
              description: "Showing historical defect category distribution across all active lots.",
            })
          }
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          View Details
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Donut Chart */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-muted/30 stroke-current"
              strokeWidth="11"
              fill="transparent"
            />

            {/* Slices */}
            {renderedSlices.map((slice, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                stroke={slice.color}
                strokeWidth="11"
                fill="transparent"
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                className="transition-all duration-500 ease-out hover:opacity-80 cursor-pointer"
              />
            ))}
          </svg>

          {/* Center Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold font-mono text-foreground leading-none">
              {totalDefects}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
              Defects
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5 text-xs">
          {DEFECT_SLICES.map((slice, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-foreground/90 font-medium">{slice.label}</span>
              </div>
              <span className="text-muted-foreground font-mono font-medium">
                {slice.percentage > 0 && slice.label !== "Others" ? `${slice.percentage}%` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

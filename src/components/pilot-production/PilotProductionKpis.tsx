import React from "react";
import { Package, Box } from "lucide-react";
import { getDefectRateSemantic } from "@/lib/pilot-production/scoring";
import { cn } from "@/lib/utils";

interface PilotProductionKpisProps {
  plannedQuantity: number;
  actualQuantity: number;
  oee: number;
  fpy: number;
  defectRate: number;
  overallReadiness: number;
  aiHealthScore: number;
}

export const PilotProductionKpis: React.FC<PilotProductionKpisProps> = ({
  plannedQuantity,
  actualQuantity,
  oee,
  fpy,
  defectRate,
  overallReadiness,
  aiHealthScore,
}) => {
  const defectSemantic = getDefectRateSemantic(defectRate);

  const circleSize = 64;
  const radius = 26;
  const stroke = 5;
  const circumference = 2 * Math.PI * radius;

  const renderGauge = (value: number, colorClass: string, label: string, sub: string) => {
    const pct = Math.min(100, Math.max(0, value));
    const offset = circumference - (circumference * pct) / 100;

    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 shadow-xs text-center transition-all hover:shadow-md hover:border-primary/30 min-w-0">
        <div className="relative grid place-items-center" style={{ width: circleSize, height: circleSize }}>
          <svg className="-rotate-90 transform" width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={stroke}
              className="text-muted/20"
              fill="transparent"
            />
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={stroke}
              className={cn("transition-all duration-1000 ease-out", colorClass)}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-display font-bold text-foreground text-sm sm:text-base">{value}</span>
          </div>
        </div>
        <span className="font-bold text-foreground truncate max-w-full mt-2 text-xs sm:text-[13px]">
          {label}
        </span>
        <span className="text-[11px] text-muted-foreground font-medium mt-0.5">{sub}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 w-full">
      {/* 1. Planned Quantity */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 shadow-xs text-center transition-all hover:shadow-md hover:border-primary/30 min-w-0">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
          <Box className="w-7 h-7" />
        </div>
        <span className="font-bold text-foreground truncate max-w-full mt-2 text-xs sm:text-[13px]">Planned Qty</span>
        <span className="text-[11px] font-bold text-foreground mt-0.5">{plannedQuantity.toLocaleString()} Units</span>
      </div>

      {/* 2. Actual Quantity */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 shadow-xs text-center transition-all hover:shadow-md hover:border-primary/30 min-w-0">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
          <Package className="w-7 h-7" />
        </div>
        <span className="font-bold text-foreground truncate max-w-full mt-2 text-xs sm:text-[13px]">Actual Qty</span>
        <span className="text-[11px] font-bold text-foreground mt-0.5">{actualQuantity.toLocaleString()} Units</span>
      </div>

      {/* 3. OEE */}
      {renderGauge(oee, "text-blue-600", "OEE Score", "Very Good")}

      {/* 4. FPY */}
      {renderGauge(fpy, "text-emerald-500", "FPY Score", "Very Good")}

      {/* 5. Defect Rate */}
      {renderGauge(defectRate, "text-rose-500", "Defect Rate", defectSemantic.label)}

      {/* 6. Overall Pilot Readiness */}
      {renderGauge(overallReadiness, "text-blue-600", "Overall Score", "Very Good")}

      {/* 7. AI Production Health */}
      {renderGauge(aiHealthScore, "text-emerald-500", "AI Health", "Excellent")}
    </div>
  );
};

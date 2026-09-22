import React from "react";
import { cn } from "@/lib/utils";

interface RoboticsKpisProps {
  overallRoboticsReadiness: number;
  cellReadinessScore: number;
  integrationScore: number;
  programmingScore: number;
  validationScore: number;
  commissioningScore: number;
  aiRoboticsHealthScore: number;
}

export const RoboticsKpis: React.FC<RoboticsKpisProps> = ({
  overallRoboticsReadiness,
  cellReadinessScore,
  integrationScore,
  programmingScore,
  validationScore,
  commissioningScore,
  aiRoboticsHealthScore,
}) => {
  const getStandardBand = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    return "Fair";
  };

  const cards = [
    { label: "Overall Score", score: overallRoboticsReadiness },
    { label: "Cell Readiness", score: cellReadinessScore },
    { label: "Integration Score", score: integrationScore },
    { label: "Programming Score", score: programmingScore },
    { label: "Validation Score", score: validationScore },
    { label: "Commissioning Score", score: commissioningScore },
    { label: "AI Robotics Health", score: aiRoboticsHealthScore },
  ];

  const circleSize = 64;
  const radius = 26;
  const stroke = 5;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 w-full">
      {cards.map((c, idx) => {
        const pct = Math.min(100, Math.max(0, c.score));
        const offset = circumference - (circumference * pct) / 100;
        const colorClass =
          c.score >= 90
            ? "text-emerald-500"
            : c.score >= 80
            ? "text-blue-600"
            : c.score >= 70
            ? "text-blue-600"
            : "text-rose-500";

        return (
          <div
            key={idx}
            className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 shadow-xs text-center transition-all hover:shadow-md hover:border-primary/30 min-w-0"
          >
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
                <span className="font-display font-bold text-foreground text-sm sm:text-base">{c.score}</span>
              </div>
            </div>
            <span className="font-bold text-foreground truncate max-w-full mt-2 text-xs sm:text-[13px]">
              {c.label}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium mt-0.5">{getStandardBand(c.score)}</span>
          </div>
        );
      })}
    </div>
  );
};

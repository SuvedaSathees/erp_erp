import React from "react";
import type { RoutingRecord } from "@/services/types";

interface RoutingScoresHeaderProps {
  record: RoutingRecord;
}

export const RoutingScoresHeader: React.FC<RoutingScoresHeaderProps> = ({ record }) => {
  const scores = [
    {
      label: "Routing Readiness",
      score: record.routingReadinessScore,
      status: record.routingReadinessScore >= 90 ? "Excellent" : "Good",
      color: "#059669",
    },
    {
      label: "Resource Readiness",
      score: record.resourceReadinessScore,
      status: record.resourceReadinessScore >= 90 ? "Excellent" : "Good",
      color: "#2563eb",
    },
    {
      label: "Manufacturing Readiness",
      score: record.manufacturingReadinessScore,
      status: record.manufacturingReadinessScore >= 90 ? "Excellent" : "Good",
      color: "#ea580c",
    },
    {
      label: "Quality Score",
      score: record.qualityScore,
      status: record.qualityScore >= 90 ? "Excellent" : "Good",
      color: "#0A3C75",
    },
    {
      label: "Cost Score",
      score: record.costScore,
      status: record.costScore >= 90 ? "Excellent" : "Good",
      color: "#0d9488",
    },
    {
      label: "Overall Readiness",
      score: record.overallReadinessScore,
      status: record.overallReadinessScore >= 90 ? "Excellent" : "Good",
      color: "#16a34a",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 px-5 py-4 bg-muted/20 border-b border-border">
      {scores.map((item, idx) => {
        const radius = 21;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (item.score / 100) * circumference;

        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-card shadow-xs hover:shadow-sm hover:border-primary/40 transition-all duration-200"
          >
            {/* SVG Circular Readiness Gauge */}
            <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-muted/25"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke={item.color}
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-xs font-black text-foreground font-mono">
                {item.score}
              </span>
            </div>

            {/* Metric Info */}
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-foreground leading-snug tracking-tight">
                {item.label}
              </span>
              <div className="mt-1 flex items-center">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-md font-extrabold tracking-wide uppercase"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

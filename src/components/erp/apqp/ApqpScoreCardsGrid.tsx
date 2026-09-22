import React, { useState } from "react";
import type { ApqpRecord } from "@/services/types";
import { ReadinessDetailsModal } from "./ReadinessDetailsModal";
import { cn } from "@/lib/utils";

interface ApqpScoreCardsGridProps {
  record: ApqpRecord;
  onNavigateTab?: (tab: any) => void;
}

function ScoreGaugeCard({
  label,
  score,
  max = 100,
  sub,
  onClick,
}: {
  label: string;
  score: number;
  max?: number;
  sub?: string;
  onClick?: () => void;
}) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const colorClass =
    score >= 90
      ? "text-emerald-500"
      : score >= 80
      ? "text-blue-600"
      : score >= 70
      ? "text-blue-600"
      : "text-rose-500";

  const circleSize = 64;
  const radius = 26;
  const stroke = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * pct) / 100;

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 shadow-xs text-center transition-all hover:shadow-md hover:border-primary/30 min-w-0",
        onClick && "cursor-pointer group"
      )}
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
          <span className="font-display font-bold text-foreground text-sm sm:text-base">{score}</span>
        </div>
      </div>
      <span className="font-bold text-foreground truncate max-w-full mt-2 text-xs sm:text-[13px] group-hover:text-primary transition-colors">
        {label}
      </span>
      {sub && <span className="text-[11px] text-muted-foreground font-medium mt-0.5">{sub}</span>}
    </div>
  );
}

export const ApqpScoreCardsGrid: React.FC<ApqpScoreCardsGridProps> = ({
  record,
  onNavigateTab,
}) => {
  const [activeModalDomain, setActiveModalDomain] = useState<
    "design" | "validation" | "supplier" | "risk" | "cost" | null
  >(null);

  const getSubText = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Very Good";
    if (score >= 60) return "Good";
    return "Fair";
  };

  const cards = [
    {
      label: "Overall Score",
      score: record.overallApqpScore ?? record.apqpHealthScore ?? 86,
      sub: getSubText(record.overallApqpScore ?? record.apqpHealthScore ?? 86),
      domain: null,
    },
    {
      label: "Design Readiness",
      score: record.designScore ?? 85,
      sub: getSubText(record.designScore ?? 85),
      domain: "design" as const,
    },
    {
      label: "Validation Readiness",
      score: record.validationScore ?? 82,
      sub: getSubText(record.validationScore ?? 82),
      domain: "validation" as const,
    },
    {
      label: "Supplier Quality",
      score: record.supplierQualityScore ?? 80,
      sub: getSubText(record.supplierQualityScore ?? 80),
      domain: "supplier" as const,
    },
    {
      label: "Risk Readiness",
      score: record.riskScore ?? 78,
      sub: getSubText(record.riskScore ?? 78),
      domain: "risk" as const,
    },
    {
      label: "Cost Readiness",
      score: record.costReadinessScore ?? 83,
      sub: getSubText(record.costReadinessScore ?? 83),
      domain: "cost" as const,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 w-full max-w-full min-w-0">
        {cards.map((c, idx) => (
          <ScoreGaugeCard
            key={idx}
            label={c.label}
            score={c.score}
            sub={c.sub}
            onClick={() => {
              if (c.domain) {
                setActiveModalDomain(c.domain);
                onNavigateTab?.(c.domain);
              }
            }}
          />
        ))}
      </div>

      {/* Interactive Detail Modal */}
      <ReadinessDetailsModal
        open={activeModalDomain !== null}
        onOpenChange={(open) => !open && setActiveModalDomain(null)}
        domain={activeModalDomain}
        record={record}
      />
    </>
  );
};

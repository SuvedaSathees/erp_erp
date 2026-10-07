import React from "react";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";

export interface StrategyScoreBannerProps {
  moduleName?: string;
  slaLabel?: string;
  overallScore?: number;
  processQuality?: number;
  complianceIndex?: number;
  throughputRate?: number;
  aiAutomation?: number;
  lifecycleStage?: string;
  className?: string;
}

/**
 * StrategyScoreBanner
 * Standard 7-metric score card banner matching the ERP design standard:
 * 1. Overall Score (90 - Excellent)
 * 2. Strategic SLA (92 - Excellent)
 * 3. Process Quality (91 - Excellent)
 * 4. Compliance Index (88 - Very Good [Blue ring])
 * 5. Throughput Rate (93 - Excellent)
 * 6. AI Automation (92 - Excellent)
 * 7. Lifecycle Stage (Operational)
 */
export function StrategyScoreBanner({
  moduleName = "Strategic",
  slaLabel,
  overallScore = 90,
  processQuality = 91,
  complianceIndex = 88,
  throughputRate = 93,
  aiAutomation = 92,
  lifecycleStage = "Operational",
  className,
}: StrategyScoreBannerProps) {
  const displaySla = slaLabel || (moduleName ? `${moduleName} SLA` : "Strategic SLA");

  return (
    <ProductScoreBanner
      overallScore={overallScore}
      overallSub={overallScore >= 90 ? "Excellent" : "Very Good"}
      scores={[
        { label: displaySla, score: 92, sub: "Excellent" },
        { label: "Process Quality", score: processQuality, sub: "Excellent" },
        { label: "Compliance Index", score: complianceIndex, sub: "Very Good" },
        { label: "Throughput Rate", score: throughputRate, sub: "Excellent" },
        { label: "AI Automation", score: aiAutomation, sub: "Excellent" },
      ]}
      lifecycleStage={lifecycleStage}
      className={className}
    />
  );
}

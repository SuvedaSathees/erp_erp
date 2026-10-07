import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { PilotProductionRecord } from "@/services/types";

interface PilotProductionAiCardProps {
  record: PilotProductionRecord;
  onViewAnalysis?: () => void;
}

export const PilotProductionAiCard: React.FC<PilotProductionAiCardProps> = ({
  record,
  onViewAnalysis,
}) => {
  const { aiAssessment } = record;

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-3.5 text-xs flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center pb-2 border-b border-border mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary dark:text-blue-400" />
            <h2 className="font-bold text-foreground text-xs">
              7. AI Production Assessment
            </h2>
          </div>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div>
            <span className="text-muted-foreground block text-[10px] font-semibold">AI Productivity Analysis</span>
            <span className="font-medium text-foreground text-[10px] block">{aiAssessment.productivityAnalysis}</span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] font-semibold">AI Quality Prediction</span>
            <span className="font-medium text-foreground text-[10px] block">{aiAssessment.qualityPrediction}</span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] font-semibold">AI Bottleneck Detection</span>
            <span className="font-medium text-foreground text-[10px] block">{aiAssessment.bottleneckDetection}</span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] font-semibold">AI Downtime Analysis</span>
            <span className="font-medium text-foreground text-[10px] block">{aiAssessment.downtimeAnalysis}</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-border/40">
            <span className="text-muted-foreground font-medium">AI Production Health Score</span>
            <span className="font-extrabold text-primary dark:text-blue-400">
              {aiAssessment.healthScore} / 100
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onViewAnalysis}
        className="mt-3 w-full py-1 text-[11px] font-bold text-primary dark:text-blue-400 hover:text-primary flex items-center justify-center gap-1 transition-colors border border-blue-200 dark:border-blue-800 rounded bg-blue-50/40 dark:bg-blue-950/30"
      >
        View AI Analysis <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

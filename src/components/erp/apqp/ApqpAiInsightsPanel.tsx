import React, { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { ApqpAiAssessment } from "@/services/types";
import { ApqpAiDiagnosticsModal } from "./ApqpAiDiagnosticsModal";

interface ApqpAiInsightsPanelProps {
  aiAssessment: ApqpAiAssessment;
  projectName?: string;
  onViewAnalysis?: () => void;
}

export const ApqpAiInsightsPanel: React.FC<ApqpAiInsightsPanelProps> = ({
  aiAssessment,
  projectName = "Autonomous W-EVSE Quality Program",
  onViewAnalysis,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
    if (onViewAnalysis) onViewAnalysis();
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl shadow-xs p-3.5 text-xs flex flex-col justify-between w-full min-w-0">
        <div>
          <div className="flex justify-between items-center pb-2.5 border-b border-border mb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary dark:text-blue-400" />
              <h2 className="font-bold text-foreground text-xs">AI Quality Insights</h2>
            </div>
            <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              <span className="text-[9px] text-muted-foreground font-semibold">
                AI Health
              </span>
              <span className="text-xs font-black text-primary dark:text-blue-400">
                {aiAssessment.healthScore} / 100
              </span>
            </div>
          </div>

          <div className="space-y-2 text-[11px]">
            {/* AI Risk Prediction */}
            <div className="flex items-start gap-2 p-1.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-foreground">AI Risk Prediction</div>
                <p className="text-muted-foreground text-[10px] leading-tight mt-0.5">
                  {aiAssessment.riskPrediction}
                </p>
              </div>
            </div>

            {/* AI Quality Trend Analysis */}
            <div className="flex items-start gap-2 p-1.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40">
              <TrendingDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-foreground">AI Quality Trend Analysis</div>
                <p className="text-muted-foreground text-[10px] leading-tight mt-0.5">
                  {aiAssessment.qualityTrendAnalysis}
                </p>
              </div>
            </div>

            {/* AI Defect Prediction */}
            <div className="flex items-start gap-2 p-1.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-foreground">AI Defect Prediction</div>
                <p className="text-muted-foreground text-[10px] leading-tight mt-0.5">
                  {aiAssessment.defectPrediction}
                </p>
              </div>
            </div>

            {/* AI Process Optimization */}
            <div className="flex items-start gap-2 p-1.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40">
              <Zap className="w-3.5 h-3.5 text-primary dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-foreground">AI Process Optimization</div>
                <p className="text-muted-foreground text-[10px] leading-tight mt-0.5">
                  {aiAssessment.processOptimization}
                </p>
              </div>
            </div>

            {/* AI Supplier Risk Analysis */}
            <div className="flex items-start gap-2 p-1.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-foreground">AI Supplier Risk Analysis</div>
                <p className="text-muted-foreground text-[10px] leading-tight mt-0.5">
                  {aiAssessment.supplierRiskAnalysis}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="mt-3 w-full py-1.5 text-[11px] font-bold text-primary dark:text-blue-400 hover:text-primary flex items-center justify-center gap-1 transition-colors border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/40 dark:bg-blue-950/30 cursor-pointer"
        >
          <span>View Full AI Analysis</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Diagnostics Dialog */}
      <ApqpAiDiagnosticsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        aiAssessment={aiAssessment}
        projectName={projectName}
      />
    </>
  );
};

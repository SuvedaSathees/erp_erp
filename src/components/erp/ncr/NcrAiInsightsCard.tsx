import {
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  Activity,
  ArrowRight,
} from "lucide-react";
import { NcrAiInsight } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrAiInsightsCardProps {
  insights: NcrAiInsight[];
}

export function NcrAiInsightsCard({ insights }: NcrAiInsightsCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
            <Sparkles className="h-3 w-3" />
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground">
            AI Quality Insights
          </h2>
        </div>

        <button
          type="button"
          onClick={() =>
            toast.info("AI Root Cause & Recurrence Engine", {
              description: "Pattern detection model trained on 14,000+ historical quality events.",
            })
          }
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2.5">
        {insights.map((insight, index) => {
          return (
            <div
              key={insight.id}
              className="flex items-start gap-2.5 text-xs text-foreground/90 leading-snug"
            >
              {index === 0 && (
                <div className="mt-0.5 text-rose-600 shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              )}
              {index === 1 && (
                <div className="mt-0.5 text-amber-500 shrink-0">
                  <Info className="h-4 w-4" />
                </div>
              )}
              {index === 2 && (
                <div className="mt-0.5 text-blue-600 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
              {index === 3 && (
                <div className="mt-0.5 text-emerald-600 shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
              )}
              {index > 3 && (
                <div className="mt-0.5 text-primary shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}

              <p className="flex-1 font-medium">{insight.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

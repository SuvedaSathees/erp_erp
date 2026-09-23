import { useState } from "react";
import { Sparkles, AlertTriangle, Info, CheckCircle2, ArrowRight, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface FqcAiInsightsCardProps {
  insights: { id: string; text: string; type: "alert" | "info" | "success" }[];
}

export function FqcAiInsightsCard({ insights }: FqcAiInsightsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs space-y-3 min-w-0">
      <div className="flex items-center justify-between pb-2 border-b border-border/40 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
            <Sparkles className="h-3 w-3" />
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground truncate">
            AI Quality Insights
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer transition-colors shrink-0"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2.5 text-xs min-w-0">
        {insights.map((item) => (
          <div key={item.id} className="flex items-start gap-2 text-foreground/90 min-w-0">
            {item.type === "alert" && (
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            {item.type === "info" && (
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            )}
            {item.type === "success" && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <p className="flex-1 leading-snug">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Full AI Insights Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  AI End-of-Line Quality Diagnostics
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Predictive degradation analytics & warranty risk mitigation model.
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-muted/40 rounded-lg border border-border/70 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Predicted Field Reliability (12 Months)</span>
                <span className="text-emerald-600 font-mono">99.2%</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Calculated using parametric test distributions of insulation resistance and pilot duty cycle.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-foreground text-xs block">
                Active Telemetry Observations:
              </span>
              {insights.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg border border-border/70 bg-card flex items-start gap-2.5 text-xs"
                >
                  {item.type === "alert" && (
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  {item.type === "info" && (
                    <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  )}
                  {item.type === "success" && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <p className="text-foreground leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                toast.success("AI quality parameters exported to station log");
              }}
              className="text-xs bg-primary hover:bg-primary text-white font-semibold"
            >
              Export AI Diagnostics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

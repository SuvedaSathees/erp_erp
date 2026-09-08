import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, Info, Sparkles, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface IpqcAiInsightsCardProps {
  insights: string[];
  onViewAll?: () => void;
}

export const IpqcAiInsightsCard: React.FC<IpqcAiInsightsCardProps> = ({
  insights,
  onViewAll,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 1:
        return <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />;
      case 2:
      case 3:
        return <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 min-w-0">
      <div className="flex items-center justify-between pb-2 border-b border-border/40 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
            <Sparkles className="w-3 h-3" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
            AI Quality Insights
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onViewAll) onViewAll();
            setIsModalOpen(true);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5 cursor-pointer transition-colors shrink-0"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5 text-xs min-w-0">
        {insights.map((text, i) => (
          <div key={i} className="flex items-start gap-2.5 min-w-0">
            {getIcon(i)}
            <span className="text-muted-foreground leading-relaxed flex-1">
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* AI Diagnostics Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  In-Process AI Quality Diagnostics
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Real-time SPC anomaly detection & machine drift prediction.
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-muted/40 rounded-lg border border-border/70 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Process Stability Index</span>
                <span className="text-emerald-600 font-mono">98.2%</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Derived from last 50 machine cycles across SMT, wire stripping, and screw torquing stations.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-foreground text-xs block">
                Active Telemetry Recommendations:
              </span>
              {insights.map((text, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-border/70 bg-card flex items-start gap-2 text-xs"
                >
                  {getIcon(i)}
                  <p className="text-foreground leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                toast.success("Exported AI telemetry parameters to station log");
              }}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              Export AI Telemetry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

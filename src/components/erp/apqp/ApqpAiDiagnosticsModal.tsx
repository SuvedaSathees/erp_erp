import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingDown,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import type { ApqpAiAssessment } from "@/services/types";

interface ApqpAiDiagnosticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aiAssessment: ApqpAiAssessment;
  projectName: string;
}

export const ApqpAiDiagnosticsModal: React.FC<ApqpAiDiagnosticsModalProps> = ({
  open,
  onOpenChange,
  aiAssessment,
  projectName,
}) => {
  const handleExportTelemetry = () => {
    const lines = [
      `AI QUALITY INTELLIGENCE & TELEMETRY REPORT - ${projectName.toUpperCase()}`,
      `Health Score,${aiAssessment.healthScore}/100`,
      `Generated Date,${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      "",
      "Domain,AI Predictive Findings & Prescriptive Actions",
      `"Risk Prediction","${aiAssessment.riskPrediction}"`,
      `"Quality Trend","${aiAssessment.qualityTrendAnalysis}"`,
      `"Defect Prediction","${aiAssessment.defectPrediction}"`,
      `"Process Optimization","${aiAssessment.processOptimization}"`,
      `"Supplier Risk","${aiAssessment.supplierRiskAnalysis}"`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AI_APQP_Telemetry_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded complete AI APQP Telemetry report");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-full p-5 bg-card border border-border shadow-2xl rounded-xl">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  AI Quality Intelligence & Diagnostic Modeling
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Program: {projectName}
                </DialogDescription>
              </div>
            </div>
            <Badge className="bg-purple-600 text-white font-bold text-xs px-2.5 py-0.5">
              Health Score: {aiAssessment.healthScore}/100
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-3 pt-2 text-xs">
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AI Risk Prediction</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 pl-5">
                {aiAssessment.riskPrediction}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300">
                <TrendingDown className="w-4 h-4 text-blue-600" />
                <span>Quality Trend Analysis</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 pl-5">
                {aiAssessment.qualityTrendAnalysis}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Defect Prediction & Early Warning</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 pl-5">
                {aiAssessment.defectPrediction}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-1.5 font-bold text-purple-800 dark:text-purple-300">
                <Zap className="w-4 h-4 text-purple-600" />
                <span>Process Optimization Opportunity</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 pl-5">
                {aiAssessment.processOptimization}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Supplier Risk & Capacity Health</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 pl-5">
                {aiAssessment.supplierRiskAnalysis}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportTelemetry}
            className="h-8 text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export AI Telemetry</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs bg-[#0B3B7B] text-white"
          >
            Close Diagnostics
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

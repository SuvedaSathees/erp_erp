import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Info, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { ComplianceRecord } from "@/services/complianceTypes";

interface ComplianceAiInsightsCardProps {
  insights: ComplianceRecord["aiInsights"];
}

export function ComplianceAiInsightsCard({
  insights,
}: ComplianceAiInsightsCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />;
      case "success":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case "alert":
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40 text-amber-950 dark:text-amber-200";
      case "success":
        return "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200";
      case "alert":
        return "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-800/40 text-rose-950 dark:text-rose-200";
      default:
        return "bg-blue-50/60 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-800/40 text-blue-950 dark:text-blue-200";
    }
  };

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          AI Compliance Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-2.5">
        {insights.map((item) => (
          <div
            key={item.id}
            className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-all leading-relaxed ${getStyle(
              item.type
            )}`}
          >
            <div className="mt-0.5">{getIcon(item.type)}</div>
            <span>{item.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  Settings2,
  Lightbulb,
} from "lucide-react";
import { AiQualityInsightItem } from "@/services/qualityAnalyticsTypes";

interface AiQualityInsightsCardProps {
  insights: AiQualityInsightItem[];
}

export function AiQualityInsightsCard({ insights }: AiQualityInsightsCardProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
      case "warning":
        return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case "root-cause":
        return <Settings2 className="w-4 h-4 text-primary dark:text-blue-400 shrink-0" />;
      case "recommendation":
        return <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary shrink-0" />;
    }
  };

  return (
    <Card className="shadow-xs border-border/80 bg-card">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-foreground">
          Quality Analytics Insights (AI)
        </CardTitle>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-primary dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3 h-3" />
          AI Powered
        </span>
      </CardHeader>

      <CardContent className="p-3.5 space-y-2.5">
        {insights.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/40 transition-colors text-xs text-foreground leading-relaxed"
          >
            <div className="mt-0.5">{getIcon(item.category)}</div>
            <span className="font-medium">{item.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

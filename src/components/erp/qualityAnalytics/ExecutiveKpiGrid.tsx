import {
  Award,
  BarChart2,
  AlertTriangle,
  Trash2,
  RefreshCw,
  FileText,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { ExecutiveKpiItem } from "@/services/qualityAnalyticsTypes";

interface ExecutiveKpiGridProps {
  kpis: ExecutiveKpiItem[];
}

export function ExecutiveKpiGrid({ kpis }: ExecutiveKpiGridProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Medal":
        return <Award className="w-4 h-4 text-blue-600" />;
      case "BarChart3":
      case "BarChart2":
        return <BarChart2 className="w-4 h-4 text-blue-600" />;
      case "AlertTriangle":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "Trash2":
        return <Trash2 className="w-4 h-4 text-rose-600" />;
      case "RefreshCw":
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case "FileText":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "CheckCircle2":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Award className="w-4 h-4 text-blue-600" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case "AlertTriangle":
      case "Trash2":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-600";
      case "CheckCircle2":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600";
      default:
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-600";
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3 min-w-0">
      {kpis.map((kpi) => {
        const isUp = kpi.trendDirection === "up";
        const isGreen = kpi.trendColor === "green";

        return (
          <div
            key={kpi.id}
            className="bg-card border border-border/80 rounded-xl p-3 shadow-xs hover:shadow-sm transition-all flex items-start gap-2.5 overflow-hidden min-w-0 group"
          >
            {/* Left Icon */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${getIconBg(
                kpi.iconName
              )}`}
            >
              {getIcon(kpi.iconName)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-medium text-muted-foreground block truncate">
                {kpi.label}
              </span>

              {/* Value */}
              <div className="text-lg sm:text-xl font-bold font-mono tracking-tight text-foreground mt-0.5 truncate">
                {kpi.value}
              </div>

              {/* Trend & Target */}
              <div className="flex flex-col mt-0.5 min-w-0">
                <div
                  className={`text-[10px] font-bold flex items-center gap-0.5 truncate ${
                    isGreen ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isUp ? (
                    <ArrowUp className="w-3 h-3 stroke-[2.5] shrink-0" />
                  ) : (
                    <ArrowDown className="w-3 h-3 stroke-[2.5] shrink-0" />
                  )}
                  <span className="truncate">{kpi.trend.replace(/^[↑↓]\s*/, "")}</span>
                </div>

                <span className="text-[10px] text-muted-foreground font-medium truncate">
                  {kpi.target}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExecutiveKpiGrid;

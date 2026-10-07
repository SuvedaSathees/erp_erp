// KPI Widgets for Strategy Management Overview & Reports
import { memo } from "react";
import {
  Compass,
  Layers,
  Target,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Award,
  Wallet,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import type { WidgetContentProps, WidgetDefinition } from "@/widgets/types";

// 1. Vision & Mission Version Widget
export const VisionMissionVersionWidget = memo(function VisionMissionVersionWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Vision & Mission"
      value="v1.0 Active"
      neutralText="100% Defined & Approved"
      captionTone="positive"
      icon={<Compass className="h-5 w-5" />}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
});

// 2. Strategic Themes Widget
export const StrategicThemesWidget = memo(function StrategicThemesWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Strategic Themes"
      value="8 Themes"
      neutralText="100% Linked to Objectives"
      captionTone="positive"
      icon={<Layers className="h-5 w-5" />}
      iconBg="bg-indigo-50 dark:bg-indigo-950/40"
      iconColor="text-indigo-600 dark:text-indigo-400"
    />
  );
});

// 3. Strategic Objectives Widget
export const StrategicObjectivesWidget = memo(function StrategicObjectivesWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Strategic Objectives"
      value="12 Objectives"
      neutralText="83% Aligned Across BUs"
      captionTone="positive"
      icon={<Target className="h-5 w-5" />}
      iconBg="bg-amber-50 dark:bg-amber-950/40"
      iconColor="text-amber-600 dark:text-amber-400"
    />
  );
});

// 4. Active OKRs Widget
export const ActiveOKRsWidget = memo(function ActiveOKRsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Active OKRs"
      value="28 OKRs"
      delta={{ label: "+14% vs Q2", direction: "up", tone: "positive" }}
      captionTone="positive"
      icon={<CheckCircle2 className="h-5 w-5" />}
      iconBg="bg-emerald-50 dark:bg-emerald-950/40"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
});

// 5. Monitored KPIs Widget
export const MonitoredKPIsWidget = memo(function MonitoredKPIsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Enterprise KPIs"
      value="186 KPIs"
      neutralText="142 On Target (76%)"
      captionTone="positive"
      icon={<BarChart3 className="h-5 w-5" />}
      iconBg="bg-cyan-50 dark:bg-cyan-950/40"
      iconColor="text-cyan-600 dark:text-cyan-400"
    />
  );
});

// 6. Balanced Scorecard Score Widget
export const BalancedScorecardScoreWidget = memo(function BalancedScorecardScoreWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Balanced Scorecard"
      value="82.4% Score"
      delta={{ label: "+4.1% MoM Improvement", direction: "up", tone: "positive" }}
      captionTone="positive"
      icon={<Award className="h-5 w-5" />}
      iconBg="bg-purple-50 dark:bg-purple-950/40"
      iconColor="text-purple-600 dark:text-purple-400"
    />
  );
});

// 7. Strategic Initiatives Widget
export const StrategicInitiativesWidget = memo(function StrategicInitiativesWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Strategic Initiatives"
      value="26 Active"
      neutralText="16 In Progress, 4 Done"
      captionTone="positive"
      icon={<Zap className="h-5 w-5" />}
      iconBg="bg-rose-50 dark:bg-rose-950/40"
      iconColor="text-rose-600 dark:text-rose-400"
    />
  );
});

// 8. Total Investment Widget
export const TotalInvestmentWidget = memo(function TotalInvestmentWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Total Investment"
      value="₹48.5 Cr"
      delta={{ label: "+12% Budgeted", direction: "up", tone: "positive" }}
      captionTone="positive"
      icon={<Wallet className="h-5 w-5" />}
      iconBg="bg-emerald-50 dark:bg-emerald-950/40"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
});

// 9. Expected Benefits Widget
export const ExpectedBenefitsWidget = memo(function ExpectedBenefitsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Expected Benefits"
      value="₹72.3 Cr"
      delta={{ label: "+25% Realization", direction: "up", tone: "positive" }}
      captionTone="positive"
      icon={<TrendingUp className="h-5 w-5" />}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
});

// 10. Overall Strategic Alignment Widget
export const StrategicAlignmentScoreWidget = memo(function StrategicAlignmentScoreWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Overall Alignment"
      value="72% Score"
      neutralText="High Cross-Functional Sync"
      captionTone="positive"
      icon={<ShieldCheck className="h-5 w-5" />}
      iconBg="bg-teal-50 dark:bg-teal-950/40"
      iconColor="text-teal-600 dark:text-teal-400"
    />
  );
});

export const STRATEGY_KPI_WIDGETS: WidgetDefinition[] = [
  {
    id: "strategy.kpi.vision-mission-version",
    title: "Vision & Mission Version",
    description: "Current approved vision, mission, and strategic charter version.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: VisionMissionVersionWidget,
  },
  {
    id: "strategy.kpi.strategic-themes",
    title: "Strategic Themes Count",
    description: "Number of active corporate strategic themes.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: StrategicThemesWidget,
  },
  {
    id: "strategy.kpi.strategic-objectives",
    title: "Strategic Objectives",
    description: "Enterprise objectives mapped across business units.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: StrategicObjectivesWidget,
  },
  {
    id: "strategy.kpi.active-okrs",
    title: "Active OKRs",
    description: "Total active quarterly and annual OKRs.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: ActiveOKRsWidget,
  },
  {
    id: "strategy.kpi.monitored-kpis",
    title: "Enterprise KPIs",
    description: "Count of strategic and operational KPIs monitored.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: MonitoredKPIsWidget,
  },
  {
    id: "strategy.kpi.bsc-score",
    title: "Balanced Scorecard Score",
    description: "Weighted performance score across all scorecard perspectives.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: BalancedScorecardScoreWidget,
  },
  {
    id: "strategy.kpi.strategic-initiatives",
    title: "Strategic Initiatives Count",
    description: "Active high-impact strategic initiatives underway.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: StrategicInitiativesWidget,
  },
  {
    id: "strategy.kpi.total-investment",
    title: "Strategic Investment",
    description: "Total capital allocated to strategic programs.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: TotalInvestmentWidget,
  },
  {
    id: "strategy.kpi.expected-benefits",
    title: "Expected Strategic Benefits",
    description: "Quantified commercial and operational benefits pipeline.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: ExpectedBenefitsWidget,
  },
  {
    id: "strategy.kpi.overall-alignment",
    title: "Overall Strategic Alignment",
    description: "Composite index of strategy, OKR, and execution alignment.",
    category: "kpi",
    defaultSize: "sm",
    allowedSizes: ["sm"],
    component: StrategicAlignmentScoreWidget,
  },
];

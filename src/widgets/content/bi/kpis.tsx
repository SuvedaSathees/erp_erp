// KPI Widgets for Business Intelligence Management Overview & Reports
import { memo } from "react";
import {
  DollarSign,
  Wallet,
  TrendingUp,
  Percent,
  Users,
  Cpu,
  ShieldAlert,
  AlertTriangle,
  FileText,
  FileCheck,
  Calendar,
  Clock,
  AlertCircle,
  Clock3,
  Database,
  Share2,
  Award,
  Zap,
  BarChart3,
} from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import type { WidgetContentProps, WidgetDefinition } from "@/widgets/types";
import { BI_OVERVIEW_DATA } from "@/widgets/data/biQueries";

const data = BI_OVERVIEW_DATA.kpis;

// 1. Total Revenue Widget
export const TotalRevenueWidget = memo(function TotalRevenueWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Total Revenue"
      value={data.totalRevenue.value}
      neutralText={data.totalRevenue.delta}
      captionTone="positive"
      icon={<DollarSign className="h-5 w-5" />}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
});

// 2. Cash Balance Widget
export const CashBalanceWidget = memo(function CashBalanceWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Cash Balance"
      value={data.cashBalance.value}
      neutralText={data.cashBalance.delta}
      captionTone="positive"
      icon={<Wallet className="h-5 w-5" />}
      iconBg="bg-emerald-50 dark:bg-emerald-950/40"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
});

// 3. Gross Margin Widget
export const GrossMarginWidget = memo(function GrossMarginWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Gross Margin"
      value={data.grossMargin.value}
      neutralText={data.grossMargin.delta}
      captionTone="positive"
      icon={<Percent className="h-5 w-5" />}
      iconBg="bg-amber-50 dark:bg-amber-950/40"
      iconColor="text-amber-600 dark:text-amber-400"
    />
  );
});

// 4. Sales Pipeline Widget
export const SalesPipelineWidget = memo(function SalesPipelineWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Sales Pipeline"
      value={data.salesPipeline.value}
      neutralText={data.salesPipeline.delta}
      captionTone="positive"
      icon={<TrendingUp className="h-5 w-5" />}
      iconBg="bg-purple-50 dark:bg-purple-950/40"
      iconColor="text-purple-600 dark:text-purple-400"
    />
  );
});

// 5. Active Customers Widget
export const ActiveCustomersWidget = memo(function ActiveCustomersWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Active Customers"
      value={data.activeCustomers.value}
      neutralText={data.activeCustomers.delta}
      captionTone="positive"
      icon={<Users className="h-5 w-5" />}
      iconBg="bg-rose-50 dark:bg-rose-950/40"
      iconColor="text-rose-600 dark:text-rose-400"
    />
  );
});

// 6. Production OEE Widget
export const ProductionOeeWidget = memo(function ProductionOeeWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Production OEE"
      value={data.productionOee.value}
      neutralText={data.productionOee.delta}
      captionTone="positive"
      icon={<Cpu className="h-5 w-5" />}
      iconBg="bg-teal-50 dark:bg-teal-950/40"
      iconColor="text-teal-600 dark:text-teal-400"
    />
  );
});

// 7. Open Security Incidents Widget
export const OpenIncidentsWidget = memo(function OpenIncidentsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Security Incidents"
      value={data.openIncidents.value}
      neutralText={data.openIncidents.delta}
      captionTone="positive"
      icon={<ShieldAlert className="h-5 w-5" />}
      iconBg="bg-sky-50 dark:bg-sky-950/40"
      iconColor="text-sky-600 dark:text-sky-400"
    />
  );
});

// 8. Open Critical Risks Widget
export const CriticalRisksWidget = memo(function CriticalRisksWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Open Critical Risks"
      value={data.criticalRisks.value}
      neutralText={data.criticalRisks.delta}
      captionTone="positive"
      icon={<AlertTriangle className="h-5 w-5" />}
      iconBg="bg-red-50 dark:bg-red-950/40"
      iconColor="text-red-600 dark:text-red-400"
    />
  );
});

// 8b. EBITDA Margin Widget
export const EbitdaMarginWidget = memo(function EbitdaMarginWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="EBITDA Margin"
      value="24.2%"
      neutralText="+1.8% vs plan"
      captionTone="positive"
      icon={<BarChart3 className="h-5 w-5" />}
      iconBg="bg-indigo-50 dark:bg-indigo-950/40"
      iconColor="text-indigo-600 dark:text-indigo-400"
    />
  );
});

// 8c. Data Pipeline Health Widget
export const DataPipelineHealthWidget = memo(function DataPipelineHealthWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Data Pipeline SLA"
      value="99.8%"
      neutralText="18/18 DAGs Healthy"
      captionTone="positive"
      icon={<Zap className="h-5 w-5" />}
      iconBg="bg-emerald-50 dark:bg-emerald-950/40"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
});

// 9. Total Reports Widget (Reports view)
export const TotalReportsWidget = memo(function TotalReportsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Total Reports"
      value={data.totalReports.value}
      neutralText={data.totalReports.delta}
      captionTone="positive"
      icon={<FileText className="h-5 w-5" />}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
});

// 10. Active Reports Widget
export const ActiveReportsWidget = memo(function ActiveReportsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Active Reports"
      value={data.activeReports.value}
      neutralText={data.activeReports.delta}
      captionTone="positive"
      icon={<FileCheck className="h-5 w-5" />}
      iconBg="bg-emerald-50 dark:bg-emerald-950/40"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
});

// 11. Scheduled Reports Widget
export const ScheduledReportsWidget = memo(function ScheduledReportsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Scheduled Reports"
      value={data.scheduledReports.value}
      neutralText={data.scheduledReports.delta}
      captionTone="positive"
      icon={<Calendar className="h-5 w-5" />}
      iconBg="bg-purple-50 dark:bg-purple-950/40"
      iconColor="text-purple-600 dark:text-purple-400"
    />
  );
});

// 12. Generated Today Widget
export const GeneratedTodayWidget = memo(function GeneratedTodayWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Generated Today"
      value={data.generatedToday.value}
      neutralText={data.generatedToday.delta}
      captionTone="positive"
      icon={<Clock className="h-5 w-5" />}
      iconBg="bg-amber-50 dark:bg-amber-950/40"
      iconColor="text-amber-600 dark:text-amber-400"
    />
  );
});

// 13. Report Exceptions Widget
export const ReportExceptionsWidget = memo(function ReportExceptionsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Report Exceptions"
      value={data.reportExceptions.value}
      neutralText={data.reportExceptions.delta}
      captionTone="positive"
      icon={<AlertCircle className="h-5 w-5" />}
      iconBg="bg-red-50 dark:bg-red-950/40"
      iconColor="text-red-600 dark:text-red-400"
    />
  );
});

// 14. Pending Approvals Widget
export const PendingApprovalsWidget = memo(function PendingApprovalsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Pending Approvals"
      value={data.pendingApprovals.value}
      neutralText={data.pendingApprovals.delta}
      captionTone="positive"
      icon={<Clock3 className="h-5 w-5" />}
      iconBg="bg-pink-50 dark:bg-pink-950/40"
      iconColor="text-pink-600 dark:text-pink-400"
    />
  );
});

// 15. Data Quality Issues Widget
export const DataQualityIssuesWidget = memo(function DataQualityIssuesWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Data Quality Issues"
      value={data.dataQualityIssues.value}
      neutralText={data.dataQualityIssues.delta}
      captionTone="positive"
      icon={<Database className="h-5 w-5" />}
      iconBg="bg-cyan-50 dark:bg-cyan-950/40"
      iconColor="text-cyan-600 dark:text-cyan-400"
    />
  );
});

// 16. Shared Reports Widget
export const SharedReportsWidget = memo(function SharedReportsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Shared Reports"
      value={data.sharedReports.value}
      neutralText={data.sharedReports.delta}
      captionTone="positive"
      icon={<Share2 className="h-5 w-5" />}
      iconBg="bg-indigo-50 dark:bg-indigo-950/40"
      iconColor="text-indigo-600 dark:text-indigo-400"
    />
  );
});

// 17. Overall KPI Achievement Widget
export const OverallKpiAchievementWidget = memo(function OverallKpiAchievementWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Overall KPI Target"
      value={data.kpiAchievement.value}
      neutralText={data.kpiAchievement.delta}
      captionTone="positive"
      icon={<Award className="h-5 w-5" />}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
});

export const BI_KPI_WIDGETS: WidgetDefinition[] = [
  {
    id: "bi.kpi.total-revenue",
    title: "Total Revenue",
    description: "Enterprise consolidated revenue with quarterly growth.",
    category: "bi",
    icon: DollarSign,
    keywords: ["revenue", "turnover", "finance"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: TotalRevenueWidget,
  },
  {
    id: "bi.kpi.cash-balance",
    title: "Cash Balance",
    description: "Available liquid bank reserves and monthly burn runway.",
    category: "bi",
    icon: Wallet,
    keywords: ["cash", "liquidity", "bank"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: CashBalanceWidget,
  },
  {
    id: "bi.kpi.gross-margin",
    title: "Gross Margin",
    description: "Consolidated enterprise gross margin percentage.",
    category: "bi",
    icon: Percent,
    keywords: ["margin", "profitability", "gross"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: GrossMarginWidget,
  },
  {
    id: "bi.kpi.sales-pipeline",
    title: "Sales Pipeline",
    description: "Active deal pipeline value across all stages.",
    category: "bi",
    icon: TrendingUp,
    keywords: ["pipeline", "deals", "sales"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: SalesPipelineWidget,
  },
  {
    id: "bi.kpi.active-customers",
    title: "Active Customers",
    description: "Total transacting and retained enterprise clients.",
    category: "bi",
    icon: Users,
    keywords: ["customers", "clients", "accounts"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: ActiveCustomersWidget,
  },
  {
    id: "bi.kpi.production-oee",
    title: "Production OEE",
    description: "Overall Equipment Effectiveness across manufacturing lines.",
    category: "bi",
    icon: Cpu,
    keywords: ["oee", "manufacturing", "production"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: ProductionOeeWidget,
  },
  {
    id: "bi.kpi.open-incidents",
    title: "Security Incidents",
    description: "Open security incidents requiring executive monitoring.",
    category: "bi",
    icon: ShieldAlert,
    keywords: ["incidents", "security", "threats"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: OpenIncidentsWidget,
  },
  {
    id: "bi.kpi.critical-risks",
    title: "Open Critical Risks",
    description: "Active high/critical enterprise risks under mitigation.",
    category: "bi",
    icon: AlertTriangle,
    keywords: ["risks", "critical", "governance"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: CriticalRisksWidget,
  },
  {
    id: "bi.kpi.ebitda-margin",
    title: "EBITDA Margin",
    description: "Operating profitability and cash EBITDA generation rate.",
    category: "bi",
    icon: BarChart3,
    keywords: ["ebitda", "margin", "profitability"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: EbitdaMarginWidget,
  },
  {
    id: "bi.kpi.data-pipeline-health",
    title: "Data Pipeline SLA",
    description: "Real-time ETL data pipeline availability and DAG health score.",
    category: "bi",
    icon: Zap,
    keywords: ["etl", "pipeline", "sla", "data", "warehouse"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: DataPipelineHealthWidget,
  },
  {
    id: "bi.kpi.total-reports",
    title: "Total Reports",
    description: "Total enterprise report catalog count.",
    category: "bi",
    icon: FileText,
    keywords: ["reports", "catalog", "documents"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: TotalReportsWidget,
  },
  {
    id: "bi.kpi.active-reports",
    title: "Active Reports",
    description: "Active published and distributed reporting instruments.",
    category: "bi",
    icon: FileCheck,
    keywords: ["active", "reports", "published"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: ActiveReportsWidget,
  },
  {
    id: "bi.kpi.scheduled-reports",
    title: "Scheduled Reports",
    description: "Automated recurring scheduled jobs.",
    category: "bi",
    icon: Calendar,
    keywords: ["scheduled", "recurring", "cron"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: ScheduledReportsWidget,
  },
  {
    id: "bi.kpi.generated-today",
    title: "Generated Today",
    description: "Reports produced and delivered in the current cycle.",
    category: "bi",
    icon: Clock,
    keywords: ["generated", "today", "daily"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: GeneratedTodayWidget,
  },
  {
    id: "bi.kpi.report-exceptions",
    title: "Report Exceptions",
    description: "Execution anomalies or SLA delivery breaches.",
    category: "bi",
    icon: AlertCircle,
    keywords: ["exceptions", "failures", "errors"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: ReportExceptionsWidget,
  },
  {
    id: "bi.kpi.pending-approvals",
    title: "Pending Approvals",
    description: "Reports awaiting executive sign-off and sign-offs.",
    category: "bi",
    icon: Clock3,
    keywords: ["approvals", "pending", "signoff"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: PendingApprovalsWidget,
  },
  {
    id: "bi.kpi.data-quality-issues",
    title: "Data Quality Issues",
    description: "Data validation alerts and anomalies in source streams.",
    category: "bi",
    icon: Database,
    keywords: ["quality", "data", "issues"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: DataQualityIssuesWidget,
  },
  {
    id: "bi.kpi.shared-reports",
    title: "Shared Reports",
    description: "Collaborative briefs and dossiers distributed to stakeholders.",
    category: "bi",
    icon: Share2,
    keywords: ["shared", "distribution", "stakeholders"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: SharedReportsWidget,
  },
  {
    id: "bi.kpi.achievement-rate",
    title: "KPI Achievement Rate",
    description: "Enterprise strategic goals on-target percentage.",
    category: "bi",
    icon: Award,
    keywords: ["achievement", "kpi", "targets"],
    roles: "all",
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    component: OverallKpiAchievementWidget,
  },
];

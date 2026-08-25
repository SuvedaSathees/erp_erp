/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  PieChart as PieIcon,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { hrmOverviewOptions, type HrmOverviewData } from "../../data/hrmQueries";
import type { WidgetContentProps, WidgetDefinition } from "../../types";

/* ===========================================================================
   1. Recruitment Pipeline Funnel Panel
   =========================================================================== */
export const RecruitmentFunnelWidget = memo(function RecruitmentFunnelWidget() {
  const { data, isLoading } = useQuery(hrmOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  const maxCount = Math.max(...data.recruitmentFunnel.map((s) => s.count), 1);
  const colors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#10b981", "#059669", "#047857"];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Talent Acquisition & Recruitment Pipeline</h3>
              <p className="text-xs text-muted-foreground">Active applicant volume and conversion velocity across stages</p>
            </div>
          </div>
          <Link
            to="/management/hrm-management/recruitment-management"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Recruitment Master</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-4 space-y-2.5">
          {data.recruitmentFunnel.map((stage, idx) => {
            const widthPct = Math.max(12, Math.round((stage.count / maxCount) * 100));
            return (
              <div key={stage.stage} className="flex items-center gap-3 text-xs">
                <div className="w-36 shrink-0 truncate font-semibold text-slate-700 dark:text-slate-300">
                  {stage.stage}
                </div>
                <div className="h-6 flex-1 overflow-hidden rounded-md bg-muted/40 p-0.5">
                  <div
                    className="flex h-full items-center justify-between rounded px-2 text-[11px] font-bold text-white transition-all"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: colors[idx % colors.length],
                    }}
                  >
                    <span>{stage.count}</span>
                    <span className="text-[10px] opacity-90">{stage.conversionRate}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>Average time-to-hire: <strong>21 days</strong></span>
        <span>Offer Acceptance Rate: <strong>88.2%</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Department Headcount Distribution
   =========================================================================== */
export const DepartmentHeadcountWidget = memo(function DepartmentHeadcountWidget() {
  const { data, isLoading } = useQuery(hrmOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Department Headcount</h3>
              <p className="text-xs text-muted-foreground">Staff distribution across business units</p>
            </div>
          </div>
          <Link
            to="/management/hrm-management/workforce-planning"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Workforce</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-2 grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={data.departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {data.departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} employees (${item.payload.percentage}%)`,
                    item.payload.department,
                  ]}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {data.departmentDistribution.map((d) => (
              <div key={d.department} className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{d.department}</span>
                </div>
                <span className="font-bold text-foreground ml-2">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>Total Headcount: <strong>{data.kpis.totalEmployees}</strong></span>
        <span>Largest: <strong>Engineering (36%)</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Monthly Payroll & Compensation Trend
   =========================================================================== */
export const PayrollTrendWidget = memo(function PayrollTrendWidget() {
  const { data, isLoading } = useQuery(hrmOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  const chartData = data.payrollTrend.map((d) => ({
    ...d,
    baseLakhs: Number((d.baseSalaries / 100000).toFixed(1)),
    incentivesLakhs: Number((d.incentives / 100000).toFixed(1)),
    overtimeLakhs: Number((d.overtime / 100000).toFixed(1)),
  }));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Monthly Payroll & Compensation Outlay</h3>
              <p className="text-xs text-muted-foreground">Salary disbursement, incentives & overtime (in ₹ Lakhs)</p>
            </div>
          </div>
          <Link
            to="/management/hrm-management/payroll-management"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Payroll Master</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-4 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="month" fontSize={11} tickLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip formatter={(val: any) => [`₹${val} L`, ""]} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="baseLakhs" name="Base Salary" fill="#2563eb" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="incentivesLakhs" name="Incentives & Bonus" fill="#16a34a" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="overtimeLakhs" name="Overtime / Shift" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>Current Month Total: <strong>₹1.84 Cr</strong></span>
        <span>Variance: <strong>-0.5% vs budget</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Upcoming Reviews, Appraisals & Exit Clearances
   =========================================================================== */
export const UpcomingReviewsWidget = memo(function UpcomingReviewsWidget() {
  const { data, isLoading } = useQuery(hrmOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Upcoming HR Lifecycle Actions</h3>
              <p className="text-xs text-muted-foreground">Probation assessments, appraisal cycles & exit clearances</p>
            </div>
          </div>
          <Link
            to="/management/hrm-management/performance-management"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Performance</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-3 divide-y divide-border/60 overflow-hidden">
          {data.upcomingReviewsAndExits.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2.5 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                  {item.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{item.employeeName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.role} · {item.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-right">
                <div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold",
                      item.type === "Probation Review" && "border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40",
                      item.type === "Appraisal Due" && "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40",
                      item.type === "Exit Clearance" && "border-rose-300 text-rose-700 bg-rose-50 dark:bg-rose-950/40",
                      item.type === "Contract Renewal" && "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40",
                    )}
                  >
                    {item.type}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.dueDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>5 actions scheduled next 14 days</span>
        <Link to="/management/hrm-management/exit-management" className="text-primary font-semibold hover:underline">
          View Exit Clearances →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. AI Workforce Intelligence & Retention Risk Alert
   =========================================================================== */
export const HrmAiIntelligenceWidget = memo(function HrmAiIntelligenceWidget() {
  return (
    <div className="card-soft border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">HRM & Workforce AI Intelligence</h3>
            <p className="text-xs text-muted-foreground">Predictive retention modeling & workforce productivity insights</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          98.4% Model Confidence
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>High Retention Benchmark</span>
          </div>
          <p className="text-muted-foreground">
            Current annualized turnover is 5.2%, outperforming manufacturing-tech industry baseline by 3.1%.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-1">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Skill Gap & Training Surge</span>
          </div>
          <p className="text-muted-foreground">
            Embedded Systems & SMT automation teams completed 100% of safety certifications ahead of plant audit.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold mb-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Staffing Headroom</span>
          </div>
          <p className="text-muted-foreground">
            Recruitment turnaround time reduced from 28 days to 21 days for critical R&D positions.
          </p>
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   Widget Definition Exports
   =========================================================================== */
export const HRM_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.hrm.recruitment-funnel",
    title: "Recruitment Pipeline Funnel",
    description: "Applicant conversion velocity from resume screening to offer onboarding.",
    category: "chart",
    tags: ["chart", "hrm"],
    icon: UserPlus,
    keywords: ["recruitment", "funnel", "hiring", "talent", "onboarding"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/management/hrm-management/recruitment-management",
    component: RecruitmentFunnelWidget,
  },
  {
    id: "chart.hrm.department-distribution",
    title: "Department Headcount Breakdown",
    description: "Organization headcount allocation across technical and operational divisions.",
    category: "chart",
    tags: ["chart", "hrm"],
    icon: Building2,
    keywords: ["headcount", "department", "workforce", "allocation"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/hrm-management/workforce-planning",
    component: DepartmentHeadcountWidget,
  },
  {
    id: "chart.hrm.payroll-trend",
    title: "Monthly Payroll & Compensation Outlay",
    description: "Multi-month salary disbursement breakdown including incentives and overtime.",
    category: "chart",
    tags: ["chart", "hrm"],
    icon: Wallet,
    keywords: ["payroll", "salary", "compensation", "wages", "bonus"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/management/hrm-management/payroll-management",
    component: PayrollTrendWidget,
  },
  {
    id: "table.hrm.upcoming-reviews",
    title: "Upcoming Reviews & Exits",
    description: "Timeline of scheduled probation reviews, appraisals and clearance handoffs.",
    category: "table",
    tags: ["table", "hrm"],
    icon: Calendar,
    keywords: ["probation", "appraisal", "exit", "reviews", "performance"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/hrm-management/performance-management",
    component: UpcomingReviewsWidget,
  },
  {
    id: "ai.hrm.workforce-intelligence",
    title: "HRM AI Workforce Intelligence",
    description: "Predictive turnover analytics and talent productivity insights.",
    category: "ai",
    tags: ["ai", "hrm"],
    icon: Sparkles,
    keywords: ["ai", "retention", "turnover", "workforce", "intelligence"],
    defaultSize: "full",
    allowedSizes: ["full"],
    roles: "all",
    sourceRoute: "/management/hrm-management/overview",
    component: HrmAiIntelligenceWidget,
  },
];

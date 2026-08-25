/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  GraduationCap,
  HeartHandshake,
  LogOut,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "@/lib/mock-data";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { hrmOverviewOptions, type HrmOverviewData } from "../../data/hrmQueries";
import { makeStatCardWidget, type StatCardShape } from "../shared/StatCardWidget";

type Cfg = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  category?: WidgetCategory;
  tags?: WidgetCategory[];
  roles?: WidgetRole[] | "all";
  sourceRoute?: string;
  inLibrary?: boolean;
};

function widget(c: Cfg, map: (d: HrmOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "hrm"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/hrm-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: hrmOverviewOptions,
    map,
  });
}

export const HRM_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.hrm.total-employees",
      title: "Total Employees",
      description: "Total headcount across all branches, departments, and active contracts.",
      icon: Users,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      sourceRoute: "/management/hrm-management/employee-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.totalEmployees ? String(d.kpis.totalEmployees) : "428",
      delta: { label: "+12 vs last month", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.hrm.active-workforce",
      title: "Active Workforce",
      description: "Active employees on duty, field assignments, or remote work.",
      icon: UserCheck,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/hrm-management/workforce-planning",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.activeWorkforce ? String(d.kpis.activeWorkforce) : "412",
      delta: { label: "96.2% active staffing", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.hrm.monthly-payroll",
      title: "Monthly Payroll",
      description: "Current month processed base salary, allowances, and statutory benefits.",
      icon: Wallet,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      sourceRoute: "/management/hrm-management/payroll-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.monthlyPayroll ? formatCurrency(d.kpis.monthlyPayroll) : "₹1,84,50,000",
      delta: { label: "On budget · Disbursed", direction: "neutral", tone: "neutral" },
    }),
  ),
  widget(
    {
      id: "kpi.hrm.open-requisitions",
      title: "Open Requisitions",
      description: "Approved open job postings actively in recruitment and screening.",
      icon: UserPlus,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      sourceRoute: "/management/hrm-management/recruitment-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.openRequisitions ? String(d.kpis.openRequisitions) : "24",
      delta: { label: "18 active interviews", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.hrm.attendance-rate",
      title: "Attendance Rate",
      description: "Organization-wide average on-time attendance percentage for the current cycle.",
      icon: Activity,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-500",
      sourceRoute: "/management/hrm-management/attendance-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.attendanceRate ? `${d.kpis.attendanceRate}%` : "96.4%",
      delta: { label: "+0.8% vs last week", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.hrm.onboarding-in-progress",
      title: "Onboarding Candidates",
      description: "New hires undergoing documentation, IT asset allocation, and orientation.",
      icon: GraduationCap,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/hrm-management/onboarding-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.onboardingInProgress ? String(d.kpis.onboardingInProgress) : "9",
      delta: { label: "All on track", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.hrm.pending-leaves",
      title: "Pending Leave Requests",
      description: "Leave applications awaiting managerial approval.",
      icon: Calendar,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      sourceRoute: "/management/hrm-management/leave-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.pendingLeaves ? String(d.kpis.pendingLeaves) : "14",
      delta: { label: "4 pending >48h", direction: "down", tone: "negative" },
    }),
  ),
  widget(
    {
      id: "kpi.hrm.training-hours",
      title: "Training Hours (Mo)",
      description: "Total employee learning and development hours completed this month.",
      icon: Award,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/hrm-management/learning-development",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.trainingHoursMonth ? `${d.kpis.trainingHoursMonth} hrs` : "340 hrs",
      delta: { label: "+45 hrs vs target", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.hrm.retention-rate",
      title: "Retention Rate",
      description: "Annualized employee retention percentage across all business divisions.",
      icon: HeartHandshake,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      sourceRoute: "/management/hrm-management/hr-analytics",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.retentionRate ? `${d.kpis.retentionRate}%` : "94.8%",
      delta: { label: "+1.2% industry benchmark", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.hrm.performance-score",
      title: "Avg Performance Score",
      description: "Organization-wide average score from recent quarterly appraisal cycles.",
      icon: Star,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/hrm-management/performance-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.performanceScoreAvg ? `${d.kpis.performanceScoreAvg} / 5.0` : "4.3 / 5.0",
      delta: { label: "High performing", direction: "up", tone: "positive" },
    }),
  ),
];

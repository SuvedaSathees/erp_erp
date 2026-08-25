import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { HrmManagementTabBar } from "@/components/erp/HrmManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Users,
  Target,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Save,
  Send,
  Download,
  Share2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  MessageSquare,
  Paperclip,
  Activity,
  Layers,
  ChevronRight,
  UserCheck,
  Award,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck,
  RefreshCw,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Globe,
  MapPin,
  Briefcase,
  Star,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Printer,
  Sliders,
  UserPlus,
  GraduationCap,
  Scale,
  BrainCircuit,
  Workflow,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  Zap,
  Lock,
  FileCheck,
  Mail,
  Phone,
  Video,
  UserCheck2,
  ShieldAlert,
  HelpCircle,
  Eye,
  CheckCircle,
  Laptop,
  Key,
  Shield,
  MessageCircle,
  Flag,
  User,
  Sparkle,
  FolderOpen,
  ClipboardList,
  Upload,
  CalendarDays,
  Timer,
  LogIn,
  LogOut,
  Coffee,
  CheckCheck,
  FileDown,
  Heart,
  Landmark,
  CreditCard,
  ArrowDownCircle,
  Banknote,
  Coins,
  Settings,
  Rocket,
  ThumbsUp,
  ThumbsDown,
  Plane,
  Car,
  Hotel,
  Receipt,
  Navigation,
  FileCode,
  StickyNote,
  HeartHandshake,
  Flame,
  Hospital,
  Stethoscope,
  Smile,
  LogOut as ExitIcon,
  UserMinus,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/hr-analytics")({
  head: () => ({
    meta: [
      { title: "HR Analytics · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The HR Analytics Form is the central analytical workspace for converting HR data into workforce insights, KPI monitoring, trend analysis, predictive indicators, and management decisions.",
      },
    ],
  }),
  component: HrAnalyticsPage,
});

// --- Data Models ---

const HEADCOUNT_TREND_DATA = [
  { month: "May '23", count: 182 },
  { month: "Jun '23", count: 189 },
  { month: "Jul '23", count: 195 },
  { month: "Aug '23", count: 203 },
  { month: "Sep '23", count: 208 },
  { month: "Oct '23", count: 215 },
  { month: "Nov '23", count: 222 },
  { month: "Dec '23", count: 226 },
  { month: "Jan '24", count: 232 },
  { month: "Feb '24", count: 238 },
  { month: "Mar '24", count: 242 },
  { month: "Apr '24", count: 248 },
];

const DEPT_HEADCOUNT_PIE = [
  { name: "Engineering", value: 86, percentage: "34.7%", color: "#2563EB" },
  { name: "Operations", value: 51, percentage: "20.6%", color: "#10B981" },
  { name: "Sales", value: 42, percentage: "16.9%", color: "#F59E0B" },
  { name: "Finance", value: 22, percentage: "8.9%", color: "#06B6D4" },
  { name: "HR", value: 12, percentage: "4.8%", color: "#EC4899" },
  { name: "Others", value: 35, percentage: "14.1%", color: "#8B5CF6" },
];

const ATTRITION_TREND_DATA = [
  { month: "Nov '23", rate: 6.1 },
  { month: "Dec '23", rate: 6.8 },
  { month: "Jan '24", rate: 7.2 },
  { month: "Feb '24", rate: 8.6 },
  { month: "Mar '24", rate: 9.0 },
  { month: "Apr '24", rate: 8.4 },
];

const DEMOGRAPHICS_PIE = [
  { name: "Male", value: 152, percentage: "61.3%", color: "#2563EB" },
  { name: "Female", value: 93, percentage: "37.5%", color: "#EC4899" },
  { name: "Other", value: 3, percentage: "1.2%", color: "#06B6D4" },
  { name: "Prefer not to say", value: 0, percentage: "0.0%", color: "#94A3B8" },
];

const KPI_ROWS = [
  { kpi: "Attrition Rate", actual: "8.4%", target: "< 7%", variance: "+1.4%", status: "red" },
  { kpi: "Attendance Rate", actual: "94.6%", target: "> 95%", variance: "-0.4%", status: "orange" },
  { kpi: "Time to Hire", actual: "24 Days", target: "< 30 Days", variance: "-6 Days", status: "green" },
  { kpi: "Offer Acceptance Rate", actual: "76%", target: "> 70%", variance: "+6%", status: "green" },
  { kpi: "Engagement Score", actual: "82%", target: "> 80%", variance: "+2%", status: "green" },
];

export default function HrAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <AppShell
      title="HR Analytics"
      breadcrumb="Management > HRM Management > HR Analytics > HR Analytics Form"
      description="The HR Analytics Form is the central analytical workspace for converting HR data into workforce insights, KPI monitoring, trend analysis, predictive indicators, and management decisions."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Info Icon */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                HR Analytics
                <Info className="h-4 w-4 text-slate-400 cursor-pointer" />
              </h2>
            </div>

            {/* Top Action Controls */}
            <div className="flex items-center flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>01 Apr 2024 - 30 Apr 2024</span>
              </div>

              <button
                type="button"
                onClick={() => toast.success("HR data refreshed across all modules.")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-600" />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => toast.info("Exporting HR Analytics packet...")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-slate-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => toast.info("Filters opened")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Filter className="h-3.5 w-3.5 text-slate-600" />
                Filters
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => toast.info("Customizing analytical dashboard widgets")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Customize
              </button>
            </div>
          </div>
        </div>

        {/* 6 Top Key Performance Cards (Exact match to reference screenshot) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 1. Total Headcount */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">Total Headcount</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">248</div>
            <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
              <span>↑ 8 (3.33%) vs Mar 2024</span>
            </div>
          </div>

          {/* 2. Active Employees */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">Active Employees</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">240</div>
            <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
              <span>↑ 6 (2.56%) vs Mar 2024</span>
            </div>
          </div>

          {/* 3. New Hires */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">New Hires</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <UserPlus className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">18</div>
            <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
              <span>↑ 3 (20.00%) vs Mar 2024</span>
            </div>
          </div>

          {/* 4. Attrition Rate */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">Attrition Rate</span>
              <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                <UserMinus className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">8.4%</div>
            <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
              <span>↓ 0.6% vs Mar 2024</span>
            </div>
          </div>

          {/* 5. Attendance Rate */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">Attendance Rate</span>
              <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">94.6%</div>
            <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
              <span>↑ 1.2% vs Mar 2024</span>
            </div>
          </div>

          {/* 6. Engagement Score */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">Engagement Score</span>
              <div className="p-1.5 rounded-lg bg-pink-50 text-pink-600">
                <Heart className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">82%</div>
            <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
              <span>↑ 3% vs Mar 2024</span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "workforce", label: "Workforce", icon: Users },
              { id: "recruitment", label: "Recruitment", icon: UserPlus },
              { id: "attendance", label: "Attendance", icon: Calendar },
              { id: "leave", label: "Leave", icon: Clock },
              { id: "performance", label: "Performance", icon: Award },
              { id: "training", label: "Training", icon: GraduationCap },
              { id: "compensation", label: "Compensation", icon: DollarSign },
              { id: "attrition", label: "Attrition", icon: UserMinus },
              { id: "welfare", label: "Welfare", icon: HeartHandshake },
              { id: "predictive", label: "Predictive", icon: BrainCircuit },
              { id: "reports", label: "Reports", icon: FileSpreadsheet },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer",
                    active
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD (Exact match to reference screenshot) */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Row 1: Headcount Trend, Headcount by Department, Attrition Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Headcount Trend (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Headcount Trend</h4>
                  <div className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 cursor-pointer">
                    <span>Last 12 Months</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                </div>

                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={HEADCOUNT_TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 8 }} />
                      <YAxis domain={[150, 270]} tick={{ fontSize: 8 }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} dot={{ r: 2.5, fill: "#2563EB" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Headcount by Department (3.5 Cols) */}
              <div className="lg:col-span-3.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Headcount by Department</h4>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="h-28 w-28 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={DEPT_HEADCOUNT_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={44}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {DEPT_HEADCOUNT_PIE.map((entry, index) => (
                            <Cell key={`deptpie-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">248</span>
                      <span className="text-[7px] text-muted-foreground">Total</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 text-[8.5px] flex-1">
                    {DEPT_HEADCOUNT_PIE.map((d) => (
                      <div key={d.name} className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-600 truncate">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                          {d.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{d.value} ({d.percentage})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => toast.info("Department headcount report")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Department Report →
                </button>
              </div>

              {/* 3. Attrition Trend (3.5 Cols) */}
              <div className="lg:col-span-3.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Attrition Trend</h4>
                  <div className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 cursor-pointer">
                    <span>Last 6 Months</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                </div>

                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ATTRITION_TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 8 }} />
                      <YAxis domain={[0, 12]} tick={{ fontSize: 8 }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} dot={{ r: 2.5, fill: "#EF4444" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <button onClick={() => toast.info("Attrition analysis breakdown")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Attrition Report →
                </button>
              </div>
            </div>

            {/* Row 2: Recruitment Funnel, Employee Demographics, Leave Utilization, Workforce Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Recruitment Funnel */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recruitment Funnel</h4>
                  <div className="inline-flex items-center gap-1 text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                    <span>This Period</span>
                    <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5 text-[9px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Applications</span>
                    <span className="font-mono font-bold text-slate-900">1,248</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Shortlisted</span>
                    <span className="font-mono font-bold text-slate-900">284 (22.8%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Interviews</span>
                    <span className="font-mono font-bold text-slate-900">142 (11.4%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Offers</span>
                    <span className="font-mono font-bold text-slate-900">68 (5.4%)</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-emerald-700">
                    <span>Joined</span>
                    <span className="font-mono">18 (1.4%)</span>
                  </div>
                </div>

                <button onClick={() => toast.info("Full recruitment funnel metrics")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Recruitment Report →
                </button>
              </div>

              {/* 2. Employee Demographics */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Employee Demographics</h4>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="h-24 w-24 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={DEMOGRAPHICS_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={24}
                          outerRadius={38}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {DEMOGRAPHICS_PIE.map((entry, index) => (
                            <Cell key={`demopie-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <Users className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1 text-[9px] flex-1">
                    {DEMOGRAPHICS_PIE.map((dm) => (
                      <div key={dm.name} className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-600 truncate">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dm.color }} />
                          {dm.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{dm.value} ({dm.percentage})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => toast.info("Demographics report breakdown")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Demographics Report →
                </button>
              </div>

              {/* 3. Leave Utilization */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    Leave Utilization <ArrowRight className="h-3 w-3 text-slate-400" />
                  </h4>
                  <div className="inline-flex items-center gap-1 text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                    <span>This Period</span>
                    <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1 text-[9px] flex-1">
                    <div>
                      <span className="text-slate-400">Total Entitlement</span>
                      <div className="font-mono font-bold text-slate-900">6,240 Days</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Total Avail. Balance</span>
                      <div className="font-mono font-bold text-slate-900">2,156 Days</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Total Taken</span>
                      <div className="font-mono font-bold text-slate-900">4,084 Days</div>
                    </div>
                  </div>

                  <div className="h-16 w-16 relative shrink-0 flex items-center justify-center">
                    <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-emerald-600" strokeDasharray="65.4, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-mono text-[9px] font-bold text-slate-900">65.4%</span>
                      <span className="text-[6px] text-muted-foreground">Utilized</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => toast.info("Leave analytics report")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Leave Report →
                </button>
              </div>

              {/* 4. Workforce Cost Summary */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Workforce Cost Summary</h4>
                  <div className="inline-flex items-center gap-1 text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                    <span>This Period</span>
                    <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payroll Cost</span>
                    <span className="font-mono font-bold text-slate-900">₹ 2.10 Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Benefits Cost</span>
                    <span className="font-mono font-bold text-slate-900">₹ 31.50 L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Overtime Cost</span>
                    <span className="font-mono font-bold text-slate-900">₹ 12.30 L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recruitment Cost</span>
                    <span className="font-mono font-bold text-slate-900">₹ 8.10 L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Training Cost</span>
                    <span className="font-mono font-bold text-slate-900">₹ 12.20 L</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-blue-700 pt-1 border-t border-slate-100 text-[10px]">
                    <span>Total HR Cost</span>
                    <span className="font-mono">₹ 2.84 Cr</span>
                  </div>
                </div>

                <button onClick={() => toast.info("Cost analytics statement")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Cost Report →
                </button>
              </div>
            </div>

            {/* Row 3: Top 5 Attrition Reasons, KPI Performance, Training Overview, Alerts & Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Top 5 Attrition Reasons (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Top 5 Attrition Reasons</h4>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  {[
                    { reason: "Better Opportunity", count: "24 (32.0%)", color: "bg-rose-500", w: "80%" },
                    { reason: "Compensation", count: "16 (21.3%)", color: "bg-orange-500", w: "60%" },
                    { reason: "Career Growth", count: "11 (14.7%)", color: "bg-amber-500", w: "45%" },
                    { reason: "Work Environment", count: "9 (12.0%)", color: "bg-emerald-500", w: "35%" },
                    { reason: "Personal Reasons", count: "6 (8.0%)", color: "bg-blue-500", w: "25%" },
                  ].map((r) => (
                    <div key={r.reason} className="space-y-0.5">
                      <div className="flex justify-between text-slate-700">
                        <span>{r.reason}</span>
                        <span className="font-mono font-bold text-slate-900">{r.count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", r.color)} style={{ width: r.w }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => toast.info("Complete attrition survey analysis")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 border-t border-slate-100">
                  View Full Report →
                </button>
              </div>

              {/* 2. KPI Performance (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">KPI Performance</h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[9px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">KPI</th>
                        <th className="pb-1">Actual</th>
                        <th className="pb-1">Target</th>
                        <th className="pb-1">Variance</th>
                        <th className="pb-1 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {KPI_ROWS.map((k) => (
                        <tr key={k.kpi} className="hover:bg-slate-50/60">
                          <td className="py-1 font-medium text-slate-900">{k.kpi}</td>
                          <td className="py-1 font-mono font-bold">{k.actual}</td>
                          <td className="py-1 font-mono text-slate-500">{k.target}</td>
                          <td className="py-1 font-mono font-bold">
                            <span className={cn(k.status === "red" ? "text-rose-600" : k.status === "orange" ? "text-amber-600" : "text-emerald-700")}>
                              {k.variance}
                            </span>
                          </td>
                          <td className="py-1 text-center">
                            <span
                              className={cn(
                                "inline-block h-2 w-2 rounded-full",
                                k.status === "red" ? "bg-rose-500" : k.status === "orange" ? "bg-amber-500" : "bg-emerald-500",
                              )}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button onClick={() => toast.info("Detailed KPI performance scorecard")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 border-t border-slate-100">
                  View All KPIs →
                </button>
              </div>

              {/* 3. Training Overview (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Training Overview</h4>
                  <div className="inline-flex items-center gap-1 text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                    <span>This Period</span>
                    <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Employees Trained</span>
                    <span className="font-mono font-bold text-slate-900">142</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Training Hours</span>
                    <span className="font-mono font-bold text-slate-900">3,842</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Completion Rate</span>
                    <span className="font-mono font-bold text-emerald-700">91%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg Assessment Score</span>
                    <span className="font-mono font-bold text-slate-900">84%</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-slate-100 text-slate-900">
                    <span>Cost per Employee</span>
                    <span className="font-mono">₹ 1,210</span>
                  </div>
                </div>

                <button onClick={() => toast.info("L&D training effectiveness metrics")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 border-t border-slate-100">
                  View Training Report →
                </button>
              </div>

              {/* 4. Alerts & Insights (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Alerts & Insights</h4>
                  <button onClick={() => toast.info("All HR alerts and recommendations")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="space-y-1.5 text-[9px]">
                  <div className="flex items-start gap-1.5 p-1.5 rounded-md bg-rose-50/50 border border-rose-100">
                    <span className="h-2 w-2 rounded-full bg-rose-600 mt-1 shrink-0" />
                    <div>
                      <div className="text-slate-800 font-medium leading-tight">Attrition rate is 1.4% above target in Engineering Department.</div>
                      <div className="text-[8px] text-slate-400 font-mono">2h ago</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 p-1.5 rounded-md bg-amber-50/50 border border-amber-100">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                    <div>
                      <div className="text-slate-800 font-medium leading-tight">Production department has a headcount gap of 8 positions.</div>
                      <div className="text-[8px] text-slate-400 font-mono">5h ago</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 p-1.5 rounded-md bg-amber-50/50 border border-amber-100">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                    <div>
                      <div className="text-slate-800 font-medium leading-tight">Training completion rate is below target in Sales Department.</div>
                      <div className="text-[8px] text-slate-400 font-mono">1d ago</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 p-1.5 rounded-md bg-blue-50/50 border border-blue-100">
                    <span className="h-2 w-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                    <div>
                      <div className="text-slate-800 font-medium leading-tight">Engagement score improved by 3% compared to last month.</div>
                      <div className="text-[8px] text-slate-400 font-mono">2d ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Meta Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-200">
          <div>Created by HR Analytics Engine on 30 Apr 2024 10:15 AM</div>
          <div className="flex items-center gap-1">
            Last Updated on 30 Apr 2024 10:30 AM
            <RefreshCw className="h-3 w-3 text-slate-400" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

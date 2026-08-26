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
  BarChart,
  Bar,
  AreaChart,
  Area,
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

const RECRUITMENT_SOURCES_PIE = [
  { name: "Campus Drives", value: 35, color: "#2563EB" },
  { name: "Employee Referrals", value: 30, color: "#10B981" },
  { name: "Direct Job Portals", value: 25, color: "#F59E0B" },
  { name: "Staffing Agencies", value: 10, color: "#8B5CF6" },
];

const LEAVE_MONTHLY_TREND = [
  { month: "Nov", casual: 140, sick: 95, earned: 210 },
  { month: "Dec", casual: 210, sick: 110, earned: 380 },
  { month: "Jan", casual: 160, sick: 130, earned: 190 },
  { month: "Feb", casual: 130, sick: 85, earned: 160 },
  { month: "Mar", casual: 175, sick: 105, earned: 240 },
  { month: "Apr", casual: 190, sick: 115, earned: 290 },
];

const KPI_ROWS = [
  { kpi: "Attrition Rate", actual: "8.4%", target: "< 7%", variance: "+1.4%", status: "red" },
  { kpi: "Attendance Rate", actual: "94.6%", target: "> 95%", variance: "-0.4%", status: "orange" },
  { kpi: "Time to Hire", actual: "24 Days", target: "< 30 Days", variance: "-6 Days", status: "green" },
  { kpi: "Offer Acceptance Rate", actual: "76%", target: "> 70%", variance: "+6%", status: "green" },
  { kpi: "Engagement Score", actual: "82%", target: "> 80%", variance: "+2%", status: "green" },
];

export function HrAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<string>("workforce");

  return (
    <AppShell
      title="HR Analytics"
      breadcrumb="Management > HRM Management > HR Analytics"
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

        {/* Sub-Tabs Bar (4 Core Workable Tabs) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "workforce", label: "Workforce & Headcount", icon: Users },
              { id: "recruitment", label: "Recruitment & Hiring", icon: UserPlus },
              { id: "attendance", label: "Attendance & Leave Trends", icon: Calendar },
              { id: "performance", label: "Performance & Retention", icon: Award },
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

        {/* TAB 1: WORKFORCE & HEADCOUNT */}
        {activeTab === "workforce" && (
          <div className="space-y-6">
            {/* Row 1: Headcount Trend & Dept Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Headcount Trend */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Headcount Growth Trend (12 Months)</h4>
                    <span className="text-[10px] text-muted-foreground">From 182 in May '23 to 248 in Apr '24 (+36.2% Growth)</span>
                  </div>
                  <span className="text-xs font-extrabold text-blue-700 font-mono">248 Employees</span>
                </div>

                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={HEADCOUNT_TREND_DATA} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis domain={[170, 260]} tick={{ fontSize: 9 }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, fill: "#2563EB" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Headcount by Department */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Department Distribution</h4>
                  <span className="text-xs font-mono font-bold text-slate-900">Total: 248</span>
                </div>

                <div className="flex items-center justify-between gap-4 h-48">
                  <div className="h-36 w-36 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={DEPT_HEADCOUNT_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={32}
                          outerRadius={52}
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
                      <span className="text-sm font-extrabold text-slate-900 font-mono">248</span>
                      <span className="text-[7px] text-muted-foreground uppercase">Staff</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[9.5px] flex-1">
                    {DEPT_HEADCOUNT_PIE.map((d) => (
                      <div key={d.name} className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="flex items-center gap-1.5 text-slate-600 truncate">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                          {d.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{d.value} ({d.percentage})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Demographics & Workforce Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Demographics */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Gender & Diversity Demographics</h4>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="h-32 w-32 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={DEMOGRAPHICS_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={46}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {DEMOGRAPHICS_PIE.map((entry, index) => (
                            <Cell key={`demopie2-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <Users className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs flex-1">
                    {DEMOGRAPHICS_PIE.filter((dm) => dm.value > 0).map((dm) => (
                      <div key={dm.name} className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: dm.color }} />
                          {dm.name}
                        </span>
                        <span className="font-mono font-bold text-slate-900">{dm.value} ({dm.percentage})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Workforce Cost Summary */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Monthly Workforce Cost Breakdown</h4>
                  <span className="text-xs font-extrabold text-blue-700 font-mono">Total: ₹ 2.84 Cr / mo</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px]">Base Payroll</span>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">₹ 2.10 Cr</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px]">Employee Benefits</span>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">₹ 31.50 L</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px]">Overtime & Allowances</span>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">₹ 12.30 L</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px]">Training & Development</span>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">₹ 12.20 L</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RECRUITMENT & HIRING */}
        {activeTab === "recruitment" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Recruitment Funnel */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-900">Recruitment Funnel Throughput (Current Cycle)</h4>
                  <span className="text-xs font-mono font-bold text-emerald-700">18 Joined</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    { stage: "Applications Received", count: "1,248", pct: "100%", w: "100%", color: "bg-blue-600" },
                    { stage: "Shortlisted Profiles", count: "284", pct: "22.8%", w: "65%", color: "bg-blue-500" },
                    { stage: "Interviews Completed", count: "142", pct: "11.4%", w: "45%", color: "bg-amber-500" },
                    { stage: "Offers Released", count: "68", pct: "5.4%", w: "30%", color: "bg-purple-500" },
                    { stage: "Candidates Joined", count: "18", pct: "1.4%", w: "18%", color: "bg-emerald-600" },
                  ].map((s) => (
                    <div key={s.stage} className="space-y-1">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>{s.stage}</span>
                        <span className="font-mono font-bold text-slate-900">{s.count} ({s.pct})</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", s.color)} style={{ width: s.w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source of Hire & Metrics */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Sourcing Channels & Velocity Metrics</h4>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="h-32 w-32 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={RECRUITMENT_SOURCES_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={26}
                          outerRadius={44}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {RECRUITMENT_SOURCES_PIE.map((entry, index) => (
                            <Cell key={`srcpie-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-1 text-xs flex-1">
                    {RECRUITMENT_SOURCES_PIE.map((sc) => (
                      <div key={sc.name} className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="flex items-center gap-1 text-slate-600">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: sc.color }} />
                          {sc.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{sc.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                  <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <span className="text-emerald-800 text-[10px]">Avg Time-to-Fill</span>
                    <div className="font-mono font-bold text-emerald-950 text-sm mt-0.5">24 Days</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                    <span className="text-blue-800 text-[10px]">Offer Acceptance</span>
                    <div className="font-mono font-bold text-blue-950 text-sm mt-0.5">76%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE & LEAVE TRENDS */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Monthly Leave Trends Bar Chart */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Monthly Leave Utilization by Category</h4>
                    <span className="text-[10px] text-muted-foreground">Casual Leave (CL), Sick Leave (SL), Earned Leave (EL)</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-mono">65.4% Utilized</span>
                </div>

                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={LEAVE_MONTHLY_TREND} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <RechartsTooltip />
                      <Bar dataKey="casual" fill="#2563EB" name="Casual Leave" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sick" fill="#F59E0B" name="Sick Leave" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="earned" fill="#10B981" name="Earned Leave" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Leave Balances Gauge & Attendance Summary */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Attendance & Leave Balances</h4>
                </div>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="h-24 w-24 relative shrink-0 flex items-center justify-center">
                    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-emerald-600" strokeDasharray="65.4, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-mono text-sm font-bold text-slate-900">65.4%</span>
                      <span className="text-[7px] text-muted-foreground">Leave Used</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs flex-1">
                    <div>
                      <span className="text-slate-400 text-[10px]">Total Entitlement</span>
                      <div className="font-mono font-bold text-slate-900">6,240 Days</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Available Balance</span>
                      <div className="font-mono font-bold text-emerald-700">2,156 Days</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>On-Time Attendance</span>
                    <span className="font-mono text-emerald-700 font-bold">94.6%</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Unplanned Absenteeism</span>
                    <span className="font-mono text-rose-600 font-bold">1.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PERFORMANCE & RETENTION */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            {/* Row 1: Attrition Trend & Reasons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Attrition Trend Line Chart */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Monthly Attrition Rate (%)</h4>
                  <span className="text-xs font-bold text-rose-600 font-mono">Current: 8.4%</span>
                </div>

                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ATTRITION_TREND_DATA} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis domain={[0, 12]} tick={{ fontSize: 9 }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3, fill: "#EF4444" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top 5 Attrition Reasons */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Exit Interview Reasons Breakdown</h4>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { reason: "Higher Compensation / Market Pay", count: "24 (32.0%)", color: "bg-rose-500", w: "80%" },
                    { reason: "Career Growth / Progression", count: "16 (21.3%)", color: "bg-orange-500", w: "60%" },
                    { reason: "Relocation / Family", count: "11 (14.7%)", color: "bg-amber-500", w: "45%" },
                    { reason: "Work Environment / Culture", count: "9 (12.0%)", color: "bg-emerald-500", w: "35%" },
                    { reason: "Higher Studies / Skill Shift", count: "6 (8.0%)", color: "bg-blue-500", w: "25%" },
                  ].map((r) => (
                    <div key={r.reason} className="space-y-1">
                      <div className="flex justify-between text-slate-700 font-medium">
                        <span>{r.reason}</span>
                        <span className="font-mono font-bold text-slate-900">{r.count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", r.color)} style={{ width: r.w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: KPI Scorecard & L&D Training Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* KPI Scorecard */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Executive HR KPI Performance Scorecard</h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                        <th className="pb-2">HR Metric / KPI</th>
                        <th className="pb-2">Actual</th>
                        <th className="pb-2">Target</th>
                        <th className="pb-2">Variance</th>
                        <th className="pb-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {KPI_ROWS.map((k) => (
                        <tr key={k.kpi} className="hover:bg-slate-50/60">
                          <td className="py-2 font-semibold text-slate-900">{k.kpi}</td>
                          <td className="py-2 font-mono font-bold text-slate-800">{k.actual}</td>
                          <td className="py-2 font-mono text-slate-500">{k.target}</td>
                          <td className="py-2 font-mono font-bold">
                            <span className={cn(k.status === "red" ? "text-rose-600" : k.status === "orange" ? "text-amber-600" : "text-emerald-700")}>
                              {k.variance}
                            </span>
                          </td>
                          <td className="py-2 text-center">
                            <span
                              className={cn(
                                "inline-block h-2.5 w-2.5 rounded-full",
                                k.status === "red" ? "bg-rose-500" : k.status === "orange" ? "bg-amber-500" : "bg-emerald-500",
                              )}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* L&D Training Overview */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Training & Skill Development Overview</h4>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px]">Employees Trained</span>
                    <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">142</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px]">Training Hours</span>
                    <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">3,842 hrs</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <span className="text-emerald-800 text-[10px]">Completion Rate</span>
                    <div className="font-mono font-bold text-emerald-950 text-sm mt-0.5">91%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                    <span className="text-blue-800 text-[10px]">Avg Assessment Score</span>
                    <div className="font-mono font-bold text-blue-950 text-sm mt-0.5">84%</div>
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

export default HrAnalyticsPage;


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
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/employee-welfare")({
  head: () => ({
    meta: [
      { title: "Employee Welfare Form · Employee Administration · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Employee Welfare Form manages employee welfare from welfare need identification → eligibility → benefit/program allocation → request → approval → support delivery → utilization → feedback → impact evaluation → closure → analytics.",
      },
    ],
  }),
  component: EmployeeWelfarePage,
});

// --- Data Models ---

const FINANCIAL_BREAKDOWN_PIE = [
  { name: "Medical Expenses", value: 32000, percentage: "80%", color: "#2563EB" },
  { name: "Diagnostics", value: 5000, percentage: "12.5%", color: "#10B981" },
  { name: "Medicines", value: 2500, percentage: "6.25%", color: "#F59E0B" },
  { name: "Other", value: 500, percentage: "1.25%", color: "#EC4899" },
];

const CATEGORY_DISTRIBUTION_PIE = [
  { name: "Health & Medical", value: 45, color: "#2563EB" },
  { name: "Financial Assistance", value: 25, color: "#10B981" },
  { name: "Insurance", value: 15, color: "#06B6D4" },
  { name: "Education", value: 10, color: "#8B5CF6" },
  { name: "Other", value: 5, color: "#F59E0B" },
];

const UTILIZATION_TREND = [
  { month: "Apr", amount: 2.5 },
  { month: "May", amount: 3.8 },
  { month: "Jun", amount: 4.5 },
  { month: "Jul", amount: 6.2 },
  { month: "Aug", amount: 10.2 },
  { month: "Sep", amount: 8.4 },
  { month: "Oct", amount: 7.1 },
  { month: "Nov", amount: 8.9 },
  { month: "Dec", amount: 9.5 },
  { month: "Jan", amount: 11.2 },
  { month: "Feb", amount: 12.4 },
  { month: "Mar", amount: 14.8 },
];

export default function EmployeeWelfarePage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Modals
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const handleSubmitForApproval = () => {
    toast.success("Welfare Request WEL-2024-00521 submitted for review", {
      description: "Forwarded to Welfare Committee & Finance for final sign-off.",
    });
  };

  return (
    <AppShell
      title="Employee Welfare Form"
      breadcrumb="Management > HRM Management > Employee Administration > Employee Welfare > WEL-2024-00521"
      description="The Employee Welfare Form manages employee welfare from welfare need identification → eligibility → benefit/program allocation → request → approval → support delivery → utilization → feedback → impact evaluation → closure → analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Welfare Icon */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Employee Welfare Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsNewRequestModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Welfare Request
              </button>
              <button
                type="button"
                onClick={() => toast.info("Importing welfare records...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                Import Data
              </button>
              <button
                type="button"
                onClick={() => toast.success("Welfare report exported")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More welfare tools opened")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                More
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={handleSubmitForApproval}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Submit for Approval
              </button>
            </div>
          </div>
        </div>

        {/* 1. Employee Header & Welfare Master Metadata (Exact match to reference screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Row: Employee Profile + Top Meta Strip */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Photo & Identity */}
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80"
                  alt="employee"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100 shadow-2xs"
                />
                <span className="absolute -bottom-1 -right-1 flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-600 text-white shadow-xs">
                  Approved
                </span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-slate-900">Sankaranarayanan R</h3>
                <div className="font-mono text-xs font-semibold text-slate-700">EMP-000125</div>
                <div className="text-xs text-muted-foreground font-medium">
                  Senior Mechanical Engineer • Engineering Department
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-slate-400" /> sankar.r@magnertia.com</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-slate-400" /> +91 98765 43210</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" /> Coimbatore, Tamil Nadu, India</span>
                </div>
              </div>
            </div>

            {/* Top Row Meta Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs divide-x divide-slate-100">
              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Welfare Number</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">WEL-2024-00521</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Welfare Program</span>
                <div className="font-bold text-slate-900 mt-0.5">Medical Assistance</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Category</span>
                <div className="font-bold text-slate-900 mt-0.5">Health & Medical</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Request Date</span>
                <div className="font-bold text-slate-900 mt-0.5">20 May 2024</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Priority</span>
                <div className="mt-0.5">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                    <Flame className="h-3 w-3 fill-rose-600 text-rose-600" /> High
                  </span>
                </div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Confidential</span>
                <div className="mt-0.5">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Yes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row Metric Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <div className="text-[10px] text-muted-foreground">Requested Amount</div>
              <div className="text-base font-extrabold text-slate-900 font-mono">₹ 45,000</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Eligible Amount</div>
              <div className="text-base font-extrabold text-slate-900 font-mono">₹ 40,000</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Approved Amount</div>
              <div className="text-base font-extrabold text-emerald-700 font-mono">₹ 40,000</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Support Type</div>
              <div className="text-sm font-bold text-slate-800">Financial Support</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Eligibility Status</div>
              <div className="mt-0.5 flex items-center gap-1 text-emerald-700 font-bold text-xs">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Eligible
              </div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Welfare Status</div>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Support Delivered
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "details", label: "Request Details", icon: FileText },
              { id: "eligibility", label: "Eligibility & Assessment", icon: Scale },
              { id: "approvals", label: "Approvals (2/3)", icon: CheckCheck },
              { id: "support", label: "Support / Benefit", icon: HeartHandshake },
              { id: "utilization", label: "Utilization & Follow-Up", icon: Activity },
              { id: "documents", label: "Documents (3)", icon: Paperclip },
              { id: "impact", label: "Impact & Feedback", icon: Smile },
              { id: "history", label: "History", icon: Clock },
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
            {/* Row 1: Welfare Progress, Welfare Financial Summary, Quick Info, Key Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Welfare Progress (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Welfare Progress</h4>
                  <span className="text-xs font-extrabold text-emerald-700 font-mono">83% Completed</span>
                </div>

                {/* 6-Stage Progress Tracker */}
                <div className="py-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                    <div className="absolute top-1/2 left-3 w-4/5 -translate-y-1/2 h-0.5 bg-emerald-600 z-0" />

                    {[
                      { step: "1", title: "Submitted", date: "20 May 2024", done: true },
                      { step: "2", title: "Eligibility Check", date: "20 May 2024", done: true },
                      { step: "3", title: "Assessment", date: "21 May 2024", done: true },
                      { step: "4", title: "Approved", date: "22 May 2024", done: true },
                      { step: "5", title: "Support Delivered", date: "24 May 2024", active: true },
                      { step: "6", title: "Impact Review", date: "Pending", future: true },
                    ].map((s) => (
                      <div key={s.step} className="flex flex-col items-center relative z-10">
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs",
                            s.done
                              ? "bg-emerald-600 text-white"
                              : s.active
                                ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                : "bg-white border-2 border-slate-300 text-slate-400",
                          )}
                        >
                          {s.done ? "✓" : s.active ? <Heart className="h-3 w-3 fill-white" /> : s.step}
                        </div>
                        <div className="text-[8px] font-bold text-slate-900 mt-1 text-center truncate max-w-[50px]">
                          {s.title}
                        </div>
                        <div className="text-[7px] text-muted-foreground text-center font-mono">{s.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full w-[83%]" />
                </div>
              </div>

              {/* 2. Welfare Financial Summary (3.5 Cols) */}
              <div className="lg:col-span-3.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Welfare Financial Summary</h4>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="h-28 w-28 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={FINANCIAL_BREAKDOWN_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={44}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {FINANCIAL_BREAKDOWN_PIE.map((entry, index) => (
                            <Cell key={`welfin-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">₹ 40,000</span>
                      <span className="text-[7px] text-muted-foreground">Approved Amount</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[9px] flex-1">
                    {FINANCIAL_BREAKDOWN_PIE.map((f) => (
                      <div key={f.name} className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-600 truncate">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: f.color }} />
                          {f.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">₹ {f.value.toLocaleString("en-IN")} ({f.percentage})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => setActiveTab("support")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Financial Details →
                </button>
              </div>

              {/* 3. Quick Info (2.25 Cols) */}
              <div className="lg:col-span-2.25 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Info</h4>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Program Limit</span>
                    <span className="font-mono font-bold text-slate-900">₹ 50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Used This Year</span>
                    <span className="font-mono font-bold text-slate-900">₹ 32,000</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Available Balance</span>
                    <span className="font-mono">₹ 18,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Benefit Date</span>
                    <span className="font-mono text-slate-700">12 Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Benefit Frequency</span>
                    <span className="font-semibold text-slate-800">Yearly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Next Eligible Date</span>
                    <span className="font-mono text-slate-700">01 Jan 2025</span>
                  </div>
                </div>

                <button onClick={() => toast.info("Viewing Program Policy details")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Program Policy →
                </button>
              </div>

              {/* 4. Key Dates (2.25 Cols) */}
              <div className="lg:col-span-2.25 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Key Dates</h4>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500"><Calendar className="h-3 w-3 text-slate-400" /> Request Date</span>
                    <span className="font-mono font-bold text-slate-900">20 May 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500"><Calendar className="h-3 w-3 text-slate-400" /> Approval Date</span>
                    <span className="font-mono font-bold text-slate-900">22 May 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500"><Calendar className="h-3 w-3 text-slate-400" /> Support Delivered</span>
                    <span className="font-mono font-bold text-slate-900">24 May 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500"><Calendar className="h-3 w-3 text-slate-400" /> Follow-Up Date</span>
                    <span className="font-mono font-bold text-slate-900">07 Jun 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500"><Calendar className="h-3 w-3 text-slate-400" /> Impact Review Date</span>
                    <span className="font-mono font-bold text-slate-900">21 Jun 2024</span>
                  </div>
                </div>

                <button onClick={() => setActiveTab("history")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Full Timeline →
                </button>
              </div>
            </div>

            {/* Row 2: Request & Support Details, Documents, Recent Welfare History, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Request & Support Details (3.5 Cols) */}
              <div className="lg:col-span-3.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Request & Support Details</h4>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div>
                    <span className="text-slate-400">Reason</span>
                    <div className="font-semibold text-slate-900">Hospitalization and treatment</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Need Description</span>
                    <div className="text-slate-700">Employee's mother hospitalized for surgery and treatment.</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Support Type</span>
                    <div className="font-semibold text-slate-900">Financial Assistance</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Provider / Hospital</span>
                    <div className="font-semibold text-slate-900">KMCH Hospital, Coimbatore</div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-slate-400">Benefit Nature</span>
                      <div className="font-semibold text-slate-900">Reimbursement</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Supporting Documents</span>
                      <div className="font-semibold text-slate-900">3 Document(s) Uploaded</div>
                    </div>
                  </div>
                </div>

                <button onClick={() => setActiveTab("details")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Request Details →
                </button>
              </div>

              {/* 2. Documents (2.5 Cols) */}
              <div className="lg:col-span-2.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Documents</h4>
                  <button onClick={() => setActiveTab("documents")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Documents →
                  </button>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  {[
                    { name: "Hospital Invoice", file: "INV-4587.pdf", size: "280 KB", date: "20 May 2024" },
                    { name: "Medical Report", file: "MR-2145.pdf", size: "312 KB", date: "20 May 2024" },
                    { name: "Discharge Summary", file: "DS-7781.pdf", size: "245 KB", date: "20 May 2024" },
                  ].map((d) => (
                    <div key={d.file} className="flex justify-between items-center p-1.5 rounded-md bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900 truncate max-w-[120px]">{d.name}</div>
                        <div className="text-[8px] text-muted-foreground font-mono">{d.file} • {d.size}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success(`Downloading ${d.file}`)}
                        className="text-primary hover:text-blue-700 p-0.5 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Recent Welfare History (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent Welfare History</h4>
                  <button onClick={() => setActiveTab("history")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Full History →
                  </button>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Support Delivered</div>
                      <div className="text-slate-600 text-[9px]">Financial support of ₹40,000 disbursed to employee.</div>
                      <div className="text-[8px] text-slate-400 font-mono">24 May 2024, 10:30 AM • HR Welfare Officer</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Approved</div>
                      <div className="text-slate-600 text-[9px]">Welfare request approved for Financial support.</div>
                      <div className="text-[8px] text-slate-400 font-mono">22 May 2024, 04:15 PM • HR Manager</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Assessment Completed</div>
                      <div className="text-slate-600 text-[9px]">Assessment done and recommended for approval.</div>
                      <div className="text-[8px] text-slate-400 font-mono">21 May 2024, 11:20 AM • Welfare Officer</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Quick Actions (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Actions</h4>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsFollowUpModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Plus className="h-3 w-3 text-primary" />
                    Add Follow-Up
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Request additional documents from employee")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <FileText className="h-3 w-3 text-blue-600" />
                    Request Doc
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Welfare disbursement logged")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <HeartHandshake className="h-3 w-3 text-emerald-600" />
                    Provide Support
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Viewing Welfare Policy criteria")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-purple-600 hover:bg-purple-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <ShieldCheck className="h-3 w-3 text-purple-600" />
                    View Policy
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <StickyNote className="h-3 w-3 text-amber-600" />
                    Add Note
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Exception workflow initiated")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-orange-600 hover:bg-orange-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <AlertTriangle className="h-3 w-3 text-orange-600" />
                    Raise Exception
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Send communication to employee")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-cyan-600 hover:bg-cyan-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Mail className="h-3 w-3 text-cyan-600" />
                    Send Message
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Welfare statement statement downloaded")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Download className="h-3 w-3 text-indigo-600" />
                    Statement
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: 4 Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Welfare Utilization (FY 2024-25) Area Chart (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Welfare Utilization (FY 2024-25)</h4>
                  <span className="text-[10px] font-bold text-blue-700 font-mono">Aug 2024: ₹ 10.2 L</span>
                </div>

                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={UTILIZATION_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="welfColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 8 }} />
                      <YAxis tick={{ fontSize: 8 }} />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#welfColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <button onClick={() => toast.info("Detailed utilization report")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Utilization Report →
                </button>
              </div>

              {/* 2. Welfare Category Distribution (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Welfare Category Distribution</h4>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="h-24 w-24 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={CATEGORY_DISTRIBUTION_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={24}
                          outerRadius={38}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {CATEGORY_DISTRIBUTION_PIE.map((entry, index) => (
                            <Cell key={`catpie-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">₹ 18.7 L</span>
                      <span className="text-[6px] text-muted-foreground">Total</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 text-[8.5px] flex-1">
                    {CATEGORY_DISTRIBUTION_PIE.map((c) => (
                      <div key={c.name} className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-600 truncate">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => toast.info("Category distribution breakdown")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Category Report →
                </button>
              </div>

              {/* 3. Employee Impact Score (2.5 Cols) */}
              <div className="lg:col-span-2.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Employee Impact Score</h4>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">4.6 / 5</div>
                  <div className="text-amber-400 text-sm">★★★★★</div>
                  <div className="text-xs font-bold text-emerald-700">High Impact</div>
                  <div className="text-[9px] text-muted-foreground">Based on recent welfare feedback</div>
                </div>

                <button onClick={() => toast.info("Impact survey details")} className="w-full text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 border-t border-slate-100">
                  View Impact Report →
                </button>
              </div>

              {/* 4. Satisfaction Overview (2.5 Cols) */}
              <div className="lg:col-span-2.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Satisfaction Overview</h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="font-extrabold text-emerald-700 font-mono text-base">98</div>
                    <div className="text-[8px] text-muted-foreground">Employees Benefited</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="font-extrabold text-blue-700 font-mono text-base">92%</div>
                    <div className="text-[8px] text-muted-foreground">Satisfied Employees</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="font-extrabold text-slate-900 font-mono text-base">12</div>
                    <div className="text-[8px] text-muted-foreground">Programs Active</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="font-extrabold text-amber-600 font-mono text-base">4.7 / 5</div>
                    <div className="text-[8px] text-muted-foreground">Average Rating</div>
                  </div>
                </div>

                <button onClick={() => toast.info("Satisfaction report breakdown")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Satisfaction Report →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Welfare Request */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                New Employee Welfare Request
              </h3>
              <button
                type="button"
                onClick={() => setIsNewRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewRequestModalOpen(false);
                toast.success("Welfare request submitted for eligibility check.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Welfare Program *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Medical Assistance Program</option>
                  <option>Emergency Financial Assistance</option>
                  <option>Child Education Support</option>
                  <option>Family Welfare Assistance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requested Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    defaultValue={45000}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Need Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe employee medical/welfare need..."
                  defaultValue="Employee's mother hospitalized for emergency surgery."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Follow-Up */}
      {isFollowUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Schedule Welfare Follow-Up
              </h3>
              <button
                type="button"
                onClick={() => setIsFollowUpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsFollowUpModalOpen(false);
                toast.success("Follow-up session scheduled.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-Up Date *</label>
                <input
                  type="date"
                  required
                  defaultValue="2024-06-07"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Objective</label>
                <input
                  type="text"
                  defaultValue="Post-hospitalization recovery status and medicine subsidy utilization check."
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFollowUpModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold cursor-pointer"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Note */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-amber-600" />
                Add Welfare Case Note
              </h3>
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNoteModalOpen(false);
                toast.success("Confidential welfare note saved.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confidential Note *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record welfare officer notes, employee family discussion points..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 font-semibold cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

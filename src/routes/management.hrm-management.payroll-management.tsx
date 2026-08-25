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
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/payroll-management")({
  head: () => ({
    meta: [
      { title: "Payroll Management · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Payroll Form manages the complete employee payroll lifecycle from employee eligibility → payroll structure → attendance & leave inputs → earnings → deductions → statutory contributions → payroll calculation → validation → approval → payslip → payment → accounting → statutory reporting.",
      },
    ],
  }),
  component: PayrollManagementPage,
});

// --- Types & Data Models ---

export interface PayrollPeriodRecord {
  month: string;
  payDate: string;
  employees: number;
  netPayroll: string;
  status: "In Review" | "Approved" | "Paid" | "Draft";
}

const RECENT_PERIODS: PayrollPeriodRecord[] = [
  { month: "Apr 2024", payDate: "31 May 2024", employees: 125, netPayroll: "₹ 34,15,000", status: "In Review" },
  { month: "Mar 2024", payDate: "30 Apr 2024", employees: 125, netPayroll: "₹ 33,28,000", status: "Approved" },
  { month: "Feb 2024", payDate: "31 Mar 2024", employees: 122, netPayroll: "₹ 32,74,500", status: "Approved" },
  { month: "Jan 2024", payDate: "29 Feb 2024", employees: 120, netPayroll: "₹ 31,89,000", status: "Approved" },
];

const PAYROLL_SUMMARY_PIE = [
  { name: "Basic Salary", value: 55, color: "#10B981" },
  { name: "Allowances", value: 25, color: "#2563EB" },
  { name: "Variable Pay", value: 10, color: "#F59E0B" },
  { name: "Other Earnings", value: 10, color: "#EF4444" },
];

const EARNINGS_VS_DEDUCTIONS_BAR = [
  { name: "Gross", amount: 42.8, fill: "#10B981" },
  { name: "Deductions", amount: 8.65, fill: "#EF4444" },
  { name: "Net", amount: 34.15, fill: "#2563EB" },
];

const DEPARTMENT_HEADCOUNT_PIE = [
  { name: "Engineering", value: 48, percentage: "38.4%", color: "#2563EB" },
  { name: "Manufacturing", value: 28, percentage: "22.4%", color: "#06B6D4" },
  { name: "Sales", value: 20, percentage: "16.0%", color: "#F59E0B" },
  { name: "Administration", value: 18, percentage: "14.4%", color: "#8B5CF6" },
  { name: "Finance", value: 11, percentage: "8.8%", color: "#EC4899" },
];

export default function PayrollManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);

  const handleApprovePayroll = () => {
    toast.success("April 2024 Payroll approved successfully", {
      description: "Payroll locked for 125 employees. Bank payment file and payslips generated.",
    });
  };

  return (
    <AppShell
      title="Payroll Management"
      breadcrumb="Management > HRM Management > Payroll Management"
      description="The Payroll Form manages the complete employee payroll lifecycle from employee eligibility → payroll structure → attendance & leave inputs → earnings → deductions → statutory contributions → payroll calculation → validation → approval → payslip → payment → accounting → statutory reporting."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Payroll Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsProcessModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Payroll
              </button>
              <button
                type="button"
                onClick={() => toast.info("Import attendance & leave data dialog opened")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                Import Data
              </button>
              <button
                type="button"
                onClick={() => toast.success("Payroll Register downloaded as XLSX")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More payroll tools opened")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                More
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={handleApprovePayroll}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Approve Payroll
              </button>
            </div>
          </div>
        </div>

        {/* 1. Payroll Period Banner & Top 5 Metric Cards (Exact match to reference screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-6">
          {/* Top Row: Period Identity + 5 Big Metric Cards */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Period Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-slate-900">Apr 2024 Payroll</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  In Review
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                Payroll Number: <strong className="text-slate-800">PAY-2024-04-0001</strong>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Payroll Period: 01 Apr 2024 - 30 Apr 2024
              </div>
            </div>

            {/* 5 Top Summary Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 flex-1 max-w-4xl">
              {/* 1. Employee Count */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3 shadow-2xs">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-semibold">Employee Count</div>
                  <div className="text-base font-extrabold text-slate-900 font-mono">125</div>
                  <div className="text-[9px] text-muted-foreground">Employees</div>
                </div>
              </div>

              {/* 2. Gross Payroll */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3 shadow-2xs">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-semibold">Gross Payroll</div>
                  <div className="text-sm font-extrabold text-slate-900 font-mono">₹ 42,80,000</div>
                </div>
              </div>

              {/* 3. Total Deductions */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3 shadow-2xs">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <ArrowDownCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-semibold">Total Deductions</div>
                  <div className="text-sm font-extrabold text-rose-700 font-mono">₹ 8,65,000</div>
                </div>
              </div>

              {/* 4. Net Payroll */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3 shadow-2xs">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-semibold">Net Payroll</div>
                  <div className="text-sm font-extrabold text-emerald-700 font-mono">₹ 34,15,000</div>
                </div>
              </div>

              {/* 5. Employer Cost */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3 shadow-2xs">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-semibold">Employer Cost</div>
                  <div className="text-sm font-extrabold text-purple-700 font-mono">₹ 47,20,000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Meta Indicator Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Payroll Group</div>
                <div className="font-semibold text-slate-900">Monthly Salaried</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-indigo-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Processing Date</div>
                <div className="font-semibold text-slate-900">14 May 2024 05:30 PM</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Pay Date</div>
                <div className="font-semibold text-slate-900">31 May 2024</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-purple-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Prepared By</div>
                <div className="font-semibold text-slate-900">Priya Nair</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Approved By</div>
                <div className="font-semibold text-slate-400">-</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-blue-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Payroll Status</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                  In Review
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "earnings", label: "Earnings", icon: Banknote },
              { id: "deductions", label: "Deductions", icon: ArrowDownCircle },
              { id: "statutory", label: "Statutory", icon: ShieldCheck },
              { id: "attendance", label: "Attendance & Leave", icon: Calendar },
              { id: "validation", label: "Validation", icon: CheckSquare },
              { id: "approvals", label: "Approvals", icon: CheckCheck },
              { id: "payslips", label: "Payslips", icon: FileText },
              { id: "payments", label: "Payments", icon: CreditCard },
              { id: "accounting", label: "Accounting", icon: Landmark },
              { id: "history", label: "History", icon: Activity },
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
            {/* Row 1: Payroll Summary, Earnings vs Deductions, Statutory Contributions, Status Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Payroll Summary (Donut Chart) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Payroll Summary</h4>
                </div>

                <div className="h-32 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={PAYROLL_SUMMARY_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={52}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {PAYROLL_SUMMARY_PIE.map((entry, index) => (
                          <Cell key={`donut-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-base font-extrabold text-slate-900 font-mono">₹42.80L</span>
                    <span className="text-[8px] text-muted-foreground">Gross Payroll</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  {PAYROLL_SUMMARY_PIE.map((p) => (
                    <div key={p.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-slate-600 truncate">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </span>
                      <span className="font-mono font-bold">{p.value}%</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("earnings")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Detailed Breakup →
                </button>
              </div>

              {/* 2. Earnings vs Deductions (Bar Chart) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Earnings vs Deductions</h4>
                </div>

                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={EARNINGS_VS_DEDUCTIONS_BAR} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis tickLine={false} tick={{ fontSize: 10 }} unit="L" />
                      <RechartsTooltip />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {EARNINGS_VS_DEDUCTIONS_BAR.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-between text-[10px] pt-1 border-t border-slate-100 font-mono">
                  <span className="text-emerald-700">Gross: ₹42.80L</span>
                  <span className="text-rose-600">Ded: ₹8.65L</span>
                  <span className="text-blue-700">Net: ₹34.15L</span>
                </div>
              </div>

              {/* 3. Statutory Contributions */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Statutory Contributions</h4>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Provident Fund (PF)
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹ 3,20,000</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-cyan-500" /> ESI Contribution
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹ 85,000</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Professional Tax
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹ 37,500</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500" /> TDS Deducted
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹ 5,50,000</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-purple-500" /> Gratuity
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹ 1,15,000</span>
                  </div>
                </div>

                <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px] font-bold">
                  <span className="text-slate-800">Total Statutory</span>
                  <span className="font-mono text-primary">₹ 10,07,500</span>
                </div>
              </div>

              {/* 4. Payroll Status Tracker */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Payroll Status Tracker</h4>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Input Collection
                    </span>
                    <span className="font-mono text-slate-400">14 May 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Calculation
                    </span>
                    <span className="font-mono text-slate-400">14 May 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Validation
                    </span>
                    <span className="font-mono text-slate-400">14 May 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-blue-700">
                      <span className="h-3.5 w-3.5 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">4</span>
                      Review
                    </span>
                    <span className="font-bold text-blue-600">In Progress</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 rounded-full bg-slate-100 text-slate-500 text-[9px] flex items-center justify-center font-bold">5</span>
                      Approval
                    </span>
                    <span>Pending</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 rounded-full bg-slate-100 text-slate-500 text-[9px] flex items-center justify-center font-bold">6</span>
                      Payroll Locked
                    </span>
                    <span>Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Recent Payroll Periods, Top Deductions, Employee Count by Department */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 1. Recent Payroll Periods (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent Payroll Periods</h4>
                  <button onClick={() => setActiveTab("history")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Month</th>
                        <th className="pb-1">Pay Date</th>
                        <th className="pb-1 text-center">Employees</th>
                        <th className="pb-1">Net Payroll</th>
                        <th className="pb-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {RECENT_PERIODS.map((p) => (
                        <tr key={p.month} className="hover:bg-slate-50/60">
                          <td className="py-2 font-bold text-slate-900">{p.month}</td>
                          <td className="py-2 text-slate-600">{p.payDate}</td>
                          <td className="py-2 text-center font-mono">{p.employees}</td>
                          <td className="py-2 font-mono font-bold text-slate-900">{p.netPayroll}</td>
                          <td className="py-2 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded-md font-bold",
                                p.status === "Approved"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200",
                              )}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Top Deductions (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Top Deductions</h4>
                  <button onClick={() => setActiveTab("deductions")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <div className="flex justify-between text-slate-700 mb-0.5">
                      <span>TDS Deducted</span>
                      <span className="font-mono font-bold text-slate-900">₹ 5,50,000 <span className="text-slate-400 font-normal text-[10px]">(63.6%)</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full w-[63.6%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-0.5">
                      <span>Provident Fund</span>
                      <span className="font-mono font-bold text-slate-900">₹ 3,20,000 <span className="text-slate-400 font-normal text-[10px]">(37.0%)</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[37.0%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-0.5">
                      <span>ESI Contribution</span>
                      <span className="font-mono font-bold text-slate-900">₹ 85,000 <span className="text-slate-400 font-normal text-[10px]">(9.8%)</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full w-[9.8%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-0.5">
                      <span>Professional Tax</span>
                      <span className="font-mono font-bold text-slate-900">₹ 37,500 <span className="text-slate-400 font-normal text-[10px]">(4.3%)</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-[4.3%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-0.5">
                      <span>Other Deductions</span>
                      <span className="font-mono font-bold text-slate-900">₹ 72,500 <span className="text-slate-400 font-normal text-[10px]">(8.4%)</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full w-[8.4%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Employee Count by Department (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Employee Count by Department</h4>
                </div>

                <div className="h-32 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={DEPARTMENT_HEADCOUNT_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={52}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {DEPARTMENT_HEADCOUNT_PIE.map((entry, index) => (
                          <Cell key={`dept-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-extrabold text-slate-900 font-mono">125</span>
                    <span className="text-[8px] text-muted-foreground">Employees</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {DEPARTMENT_HEADCOUNT_PIE.map((d) => (
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
            </div>

            {/* Row 3: Pending Approvals, Quick Actions, Important Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Pending Approvals (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Pending Approvals</h4>
                  <button onClick={() => setActiveTab("approvals")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Level</th>
                        <th className="pb-1">Approver</th>
                        <th className="pb-1">Status</th>
                        <th className="pb-1 text-center">Action</th>
                        <th className="pb-1 text-right">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { level: "HR Review", approver: "Priya Nair", status: "Pending", due: "15 May 2024" },
                        { level: "Finance Approval", approver: "Vikram Singh", status: "Pending", due: "15 May 2024" },
                        { level: "Final Approval", approver: "Rahul Sharma", status: "Pending", due: "16 May 2024" },
                      ].map((app) => (
                        <tr key={app.level} className="hover:bg-slate-50/60">
                          <td className="py-2 font-bold text-slate-900">{app.level}</td>
                          <td className="py-2 text-slate-600">{app.approver}</td>
                          <td className="py-2">
                            <span className="px-1.5 py-0.2 rounded-md font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {app.status}
                            </span>
                          </td>
                          <td className="py-2 text-center">
                            <button
                              type="button"
                              onClick={() => toast.info(`Viewing ${app.level} details`)}
                              className="text-slate-400 hover:text-primary p-0.5 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </td>
                          <td className="py-2 text-right font-mono text-slate-500">{app.due}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Quick Actions (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Actions</h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsProcessModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Plus className="h-3.5 w-3.5 text-primary" />
                    Create Payroll
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Importing attendance records...")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Upload className="h-3.5 w-3.5 text-blue-600" />
                    Import Attendance
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Calculating payroll engine...")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Settings className="h-3.5 w-3.5 text-indigo-600" />
                    Process Payroll
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Generating bulk payslips...")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <FileText className="h-3.5 w-3.5 text-emerald-600" />
                    Generate Payslips
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Upload expense claims")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-purple-600 hover:bg-purple-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-purple-600" />
                    Upload Claims
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAdvanceModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <DollarSign className="h-3.5 w-3.5 text-amber-600" />
                    Salary Advance
                  </button>
                </div>
              </div>

              {/* 3. Important Dates (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Important Dates</h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      Payroll Cut-Off Date
                    </span>
                    <span className="font-mono text-slate-600">14 May 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Lock className="h-3.5 w-3.5 text-amber-600" />
                      Input Lock Date
                    </span>
                    <span className="font-mono text-slate-600">15 May 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                      Payroll Lock Date
                    </span>
                    <span className="font-mono text-slate-600">16 May 2024</span>
                  </div>

                  <div className="flex items-center justify-between font-bold text-slate-900 border-t border-slate-100 pt-1">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                      Pay Date
                    </span>
                    <span className="font-mono text-emerald-700">31 May 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Process / Create Payroll */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create New Payroll Run
              </h3>
              <button
                type="button"
                onClick={() => setIsProcessModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsProcessModalOpen(false);
                toast.success("May 2024 Payroll initialized with 125 employees.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payroll Period *</label>
                <select className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>May 2024 (01 May 2024 - 31 May 2024)</option>
                  <option>Jun 2024 (01 Jun 2024 - 30 Jun 2024)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payroll Group *</label>
                <select className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Monthly Salaried (125 Employees)</option>
                  <option>Contract Staff (24 Employees)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProcessModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Initialize Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Salary Advance Request */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-600" />
                Salary Advance Application
              </h3>
              <button
                type="button"
                onClick={() => setIsAdvanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAdvanceModalOpen(false);
                toast.success("Salary advance request submitted to HR & Finance for approval.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee *</label>
                <select className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>EMP-000125 - Sankaranarayanan R</option>
                  <option>EMP-2024-0128 - Priya Nair</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Advance Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdvanceModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 font-semibold cursor-pointer"
                >
                  Submit Advance Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

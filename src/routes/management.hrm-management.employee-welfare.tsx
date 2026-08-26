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
      { title: "Employee Welfare · HRM Management · Magnertia ERP" },
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

export function EmployeeWelfarePage() {
  const [activeTab, setActiveTab] = useState<string>("details");

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
      title="Employee Welfare"
      breadcrumb="Management > HRM Management > Employee Welfare"
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

        {/* 1. Employee Welfare Master Header (Clean enterprise layout, no profile photos, no stars) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Row Meta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Welfare Number</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">WEL-2024-00521</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Program</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Medical Assistance</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Category</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Health & Medical Aid</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Request Date</span>
              <div className="font-mono font-semibold text-slate-900 text-sm truncate">20 May 2024</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Priority</span>
              <div className="font-bold text-rose-600 text-sm truncate">High (Confidential)</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-0.5">
              <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Support Type</span>
              <div className="font-semibold text-emerald-800 text-sm truncate">Financial Aid</div>
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
              { id: "details", label: "Request Details", icon: FileText },
              { id: "eligibility", label: "Eligibility & Assessment", icon: Scale },
              { id: "support", label: "Support & Benefit Delivery", icon: HeartHandshake },
              { id: "utilization", label: "Utilization & Feedback", icon: Activity },
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

        {/* TAB 1: REQUEST DETAILS */}
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Top Row: Request Details & Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Request & Need Details (8 Cols) */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Welfare Request & Need Profile
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Request submission, hospital details, and case background.
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Medical Assistance
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Welfare Program</span>
                    <div className="font-bold text-slate-900">Medical Assistance Program (MAP-2024)</div>
                    <div className="text-[11px] text-slate-500">Tier 1 Healthcare & Critical Care Support</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Beneficiary / Patient</span>
                    <div className="font-bold text-slate-900">Meenakshi R (Mother of Employee)</div>
                    <div className="text-[11px] text-slate-500">Dependent Registered in ERP Family Records</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Hospital / Provider</span>
                    <div className="font-bold text-slate-900">KMCH Hospital, Coimbatore</div>
                    <div className="text-[11px] text-slate-500">Department of Orthopedic Surgery & Trauma</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Support Type & Nature</span>
                    <div className="font-bold text-emerald-700">Financial Assistance (Direct Hospital Settlement)</div>
                    <div className="text-[11px] text-slate-500">Non-Taxable Welfare Grant</div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-slate-500 font-semibold text-[11px]">Need Description & Case Summary</span>
                  <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    Employee's dependent mother was hospitalized for emergency knee joint surgery and intensive physiotherapy at KMCH Hospital. The requested welfare grant covers hospitalization, surgery copay, and initial rehabilitation medication.
                  </div>
                </div>

                {/* Supporting Documents */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800">Attached Medical Documents (3)</h5>
                    <button
                      type="button"
                      onClick={() => toast.info("Request additional documents")}
                      className="text-[11px] text-primary font-semibold hover:underline cursor-pointer"
                    >
                      + Request More Docs
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { name: "Hospital Invoice", file: "INV-4587.pdf", size: "280 KB", date: "20 May 2024" },
                      { name: "Medical Report", file: "MR-2145.pdf", size: "312 KB", date: "20 May 2024" },
                      { name: "Discharge Summary", file: "DS-7781.pdf", size: "245 KB", date: "20 May 2024" },
                    ].map((d) => (
                      <div key={d.file} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div>
                          <div className="font-bold text-slate-900 truncate max-w-[120px]">{d.name}</div>
                          <div className="text-[9px] text-muted-foreground font-mono">{d.file} • {d.size}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toast.success(`Downloading ${d.file}`)}
                          className="text-primary hover:text-blue-700 p-1 cursor-pointer"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Welfare Financial Breakdown & Program Limits (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Financial Breakdown Pie */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-800">Financial Grant Breakdown</h4>
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
                        <span className="text-[7px] text-muted-foreground">Approved</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[10px] flex-1">
                      {FINANCIAL_BREAKDOWN_PIE.map((f) => (
                        <div key={f.name} className="flex justify-between items-center">
                          <span className="flex items-center gap-1 text-slate-600 truncate">
                            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                            {f.name}
                          </span>
                          <span className="font-mono font-bold text-slate-800">₹ {f.value.toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Requested Amount</span>
                      <span className="font-mono font-bold text-slate-900">₹ 45,000.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700">
                      <span>Company Approved Grant</span>
                      <span className="font-mono">₹ 40,000.00</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Employee Out-of-Pocket</span>
                      <span className="font-mono">₹ 5,000.00</span>
                    </div>
                  </div>
                </div>

                {/* Program Limit & Available Balances */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-800">Annual Program Limit</h4>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Annual Limit</span>
                      <span className="font-mono font-bold text-slate-900">₹ 50,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Used This FY</span>
                      <span className="font-mono font-bold text-slate-900">₹ 32,000.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-slate-100">
                      <span>Available Balance</span>
                      <span className="font-mono">₹ 18,000.00</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("eligibility")}
                    className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center w-full border-t border-slate-100 block"
                  >
                    View Policy Eligibility Matrix →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ELIGIBILITY & ASSESSMENT */}
        {activeTab === "eligibility" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Eligibility Criteria Checklist (6 Cols) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    Welfare Policy Eligibility Verification
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Automated validation against ERP HR policy standards.</p>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { title: "Service Tenure Requirement", desc: "Minimum 12 months continuous service required (Current: 38 months)", status: "Passed", compliant: true },
                    { title: "Employment Grade & Status", desc: "Full-Time Permanent (Senior Mechanical Engineer, Grade E3)", status: "Passed", compliant: true },
                    { title: "Annual Welfare Ceiling", desc: "Requested grant does not exceed remaining FY allocation", status: "Passed", compliant: true },
                    { title: "Dependent Verification", desc: "Patient Meenakshi R verified under company group medical records", status: "Passed", compliant: true },
                    { title: "Medical Proof Authenticity", desc: "KMCH Hospital invoices and doctor signature verified by HR", status: "Passed", compliant: true },
                  ].map((c) => (
                    <div key={c.title} className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/30 flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          {c.title}
                        </div>
                        <div className="text-[11px] text-slate-600">{c.desc}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs shrink-0">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Committee Assessment & Recommendation (6 Cols) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <HeartHandshake className="h-4 w-4 text-emerald-600" />
                    Welfare Committee Assessment & Sign-Off
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Evaluated and approved by HR Welfare Committee.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase text-slate-500">Lead Assessor</span>
                      <span className="font-mono text-[10px] text-slate-400">21 May 2024, 11:20 AM</span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">Deepa Nair • Welfare Officer</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      "Medical documents verified with KMCH Hospital administration. Given employee's exemplary tenure and genuine medical emergency, financial grant of ₹ 40,000 is strongly recommended for direct disbursal."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <span className="text-slate-400 text-[10px]">Risk Assessment</span>
                      <div className="font-bold text-emerald-700 mt-0.5">Low / Standard</div>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <span className="text-slate-400 text-[10px]">Recommended Amount</span>
                      <div className="font-bold text-slate-900 font-mono mt-0.5">₹ 40,000.00</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-950">Final Committee Decision</div>
                      <div className="text-[11px] text-emerald-800">Approved by HR Director (Arun Kumar) on 22 May 2024</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                      Approved
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab("support")}
                    className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 text-xs font-semibold transition cursor-pointer text-center block"
                  >
                    View Benefit Delivery & Disbursal →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUPPORT & BENEFIT DELIVERY */}
        {activeTab === "support" && (
          <div className="space-y-6">
            {/* 1. 6-Stage Progress Stepper */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Welfare Delivery Lifecycle Tracker</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Status of disbursal, hospital direct payment, and employee acknowledgement.</p>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 font-mono">83% Completed</span>
              </div>

              <div className="py-3">
                <div className="flex items-start justify-between relative">
                  {/* Connecting Line */}
                  <div className="absolute top-3 left-6 right-6 h-0.5 bg-slate-200 z-0" />
                  <div className="absolute top-3 left-6 w-[80%] h-0.5 bg-emerald-600 z-0" />

                  {[
                    { step: "1", title: "Submitted", date: "20 May 2024", by: "by Employee", done: true },
                    { step: "2", title: "Eligibility Check", date: "20 May 2024", by: "by System", done: true },
                    { step: "3", title: "Assessment", date: "21 May 2024", by: "by Deepa Nair", done: true },
                    { step: "4", title: "Approved", date: "22 May 2024", by: "by HR Director", done: true },
                    { step: "5", title: "Support Delivered", date: "24 May 2024", by: "by Finance", active: true },
                    { step: "6", title: "Impact Review", date: "21 Jun 2024", by: "Pending", future: true },
                  ].map((s) => (
                    <div key={s.step} className="flex flex-col items-center relative z-10 max-w-[85px] text-center">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0",
                          s.done
                            ? "bg-emerald-600 text-white ring-4 ring-white"
                            : s.active
                              ? "bg-blue-600 text-white ring-4 ring-blue-100 ring-offset-2 ring-offset-white"
                              : "bg-white border-2 border-slate-300 text-slate-400 ring-4 ring-white",
                        )}
                      >
                        {s.done ? "✓" : s.active ? <Heart className="h-3 w-3 fill-white" /> : s.step}
                      </div>
                      <div className="text-[10px] font-bold text-slate-900 mt-2.5 text-center leading-tight">
                        {s.title}
                      </div>
                      <div className="text-[8px] text-muted-foreground text-center font-mono mt-0.5">{s.date}</div>
                      {s.by && <div className="text-[8px] text-slate-500 text-center leading-tight mt-0.5">{s.by}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Disbursal Details & Delivery Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Disbursal & Payment Execution Details</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Disbursed Amount</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">₹ 40,000.00</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Payment Method</span>
                    <span className="font-bold text-slate-900">NEFT Direct Vendor Settlement</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Beneficiary Account</span>
                    <span className="font-mono font-semibold text-slate-800">KMCH Hospital (HDFC A/C: 50200049281)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Transaction Reference</span>
                    <span className="font-mono font-bold text-blue-700">NEFT-WELF-2024-88412</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Disbursed On</span>
                    <span className="font-mono text-slate-900">24 May 2024, 10:30 AM</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Delivery Acknowledgement & Next Follow-Up</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40 space-y-1">
                    <div className="font-bold text-emerald-950">Employee Acknowledgement Received</div>
                    <p className="text-[11px] text-emerald-800">
                      Sankaranarayanan R acknowledged receipt of hospital payment voucher on 24 May 2024.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/40 space-y-1">
                    <div className="font-bold text-blue-950">Upcoming Medical Follow-Up</div>
                    <p className="text-[11px] text-blue-800">
                      Scheduled post-op health status check on <strong>07 Jun 2024</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFollowUpModalOpen(true)}
                    className="w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 font-semibold text-xs transition cursor-pointer"
                  >
                    + Log New Follow-Up Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: UTILIZATION & FEEDBACK */}
        {activeTab === "utilization" && (
          <div className="space-y-6">
            {/* 4 Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Welfare Utilization Trend */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Company Welfare Utilization (FY 2024-25)</h4>
                  <span className="text-[10px] font-bold text-blue-700 font-mono">Current: ₹ 10.2 L</span>
                </div>

                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={UTILIZATION_TREND} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="welfColorTab" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#welfColorTab)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Category Distribution */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Welfare Category Distribution</h4>
                  <span className="text-[10px] font-bold text-slate-700 font-mono">Total: ₹ 18.7 L</span>
                </div>

                <div className="flex items-center justify-between gap-4 h-40">
                  <div className="h-32 w-32 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={CATEGORY_DISTRIBUTION_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={48}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {CATEGORY_DISTRIBUTION_PIE.map((entry, index) => (
                            <Cell key={`catpie2-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-1 text-[10px] flex-1">
                    {CATEGORY_DISTRIBUTION_PIE.map((c) => (
                      <div key={c.name} className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="flex items-center gap-1 text-slate-600 truncate">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Impact & Feedback Synthesis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Satisfaction Metrics</h4>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="font-extrabold text-emerald-700 font-mono text-xl">98</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Employees Benefited</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="font-extrabold text-blue-700 font-mono text-xl">92%</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Satisfaction Rating</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Employee Feedback & Impact Review</h4>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-emerald-950">
                    <span>Overall Impact: 4.6 / 5.0 (High Impact)</span>
                    <span className="text-[10px] font-mono text-emerald-700">24 May 2024</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    "Extremely grateful for the swift assistance provided by the HR and Welfare Committee during my mother's surgery. Direct hospital settlement significantly relieved family financial burden."
                  </p>
                </div>
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

export default EmployeeWelfarePage;


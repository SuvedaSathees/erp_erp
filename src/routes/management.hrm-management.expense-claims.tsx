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
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/expense-claims")({
  head: () => ({
    meta: [
      { title: "Expense Claims Form · Employee Administration · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Expense Claims Form manages employee expense reimbursement from expense capture → claim preparation → receipt verification → policy validation → approval → finance review → settlement → reimbursement/recovery → closure → analytics.",
      },
    ],
  }),
  component: ExpenseClaimsPage,
});

// --- Data Models ---

interface ExpenseItem {
  id: number;
  date: string;
  category: string;
  description: string;
  merchant: string;
  amount: number;
  eligible: number;
  disallowed: number;
  receiptStatus: "Verified" | "Partial" | "Missing";
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: 1, date: "20 May 2024", category: "Airfare", description: "CJB → BLR (Return)", merchant: "IndiGo Airlines", amount: 9200.0, eligible: 9200.0, disallowed: 0.0, receiptStatus: "Verified" },
  { id: 2, date: "20 May 2024", category: "Hotel", description: "2 Nights Stay", merchant: "Lemon Tree, Bengaluru", amount: 5000.0, eligible: 5000.0, disallowed: 0.0, receiptStatus: "Verified" },
  { id: 3, date: "21 May 2024", category: "Local Transport", description: "Airport Transfer", merchant: "Ola Cab", amount: 2300.0, eligible: 2300.0, disallowed: 0.0, receiptStatus: "Verified" },
  { id: 4, date: "21 May 2024", category: "Meals", description: "Business Dinner", merchant: "Paradise Restaurant", amount: 1500.0, eligible: 1000.0, disallowed: 500.0, receiptStatus: "Partial" },
  { id: 5, date: "22 May 2024", category: "Fuel", description: "Local Travel", merchant: "Bharat Petroleum", amount: 2850.0, eligible: 2850.0, disallowed: 0.0, receiptStatus: "Verified" },
  { id: 6, date: "23 May 2024", category: "Parking", description: "Hotel Parking", merchant: "Lemon Tree Parking", amount: 800.0, eligible: 500.0, disallowed: 300.0, receiptStatus: "Partial" },
];

export default function ExpenseClaimsPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);

  // Modals
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isUploadReceiptModalOpen, setIsUploadReceiptModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  const handleSubmitClaim = () => {
    toast.success("Expense Claim EXP-2024-00482 submitted successfully", {
      description: "Claim submitted for final Finance review & settlement approval.",
    });
  };

  const totalClaimed = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalEligible = expenses.reduce((acc, curr) => acc + curr.eligible, 0);
  const totalDisallowed = expenses.reduce((acc, curr) => acc + curr.disallowed, 0);
  const advanceAdjusted = 15000;
  const netPayable = totalEligible - advanceAdjusted;

  return (
    <AppShell
      title="Expense Claims Form"
      breadcrumb="Management > HRM Management > Employee Administration > Expense Claims > EXP-2024-00482"
      description="The Expense Claims Form manages employee expense reimbursement from expense capture → claim preparation → receipt verification → policy validation → approval → finance review → settlement → reimbursement/recovery → closure → analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Document Icon */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Expense Claims Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Claim
              </button>
              <button
                type="button"
                onClick={() => toast.info("Importing expenses from corporate card...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                Import Expenses
              </button>
              <button
                type="button"
                onClick={() => toast.success("Expense statement exported")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More expense options opened")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                More
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={handleSubmitClaim}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Submit Claim
              </button>
            </div>
          </div>
        </div>

        {/* 1. Employee Header & Claim Master Metadata (Exact match to reference screenshot) */}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs divide-x divide-slate-100">
              <div className="px-3">
                <span className="text-[10px] text-muted-foreground">Claim Number</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">EXP-2024-00482</div>
              </div>

              <div className="px-3">
                <span className="text-[10px] text-muted-foreground">Claim Type</span>
                <div className="font-bold text-slate-900 mt-0.5">Travel Expense</div>
              </div>

              <div className="px-3">
                <span className="text-[10px] text-muted-foreground">Expense Period</span>
                <div className="font-bold text-slate-900 mt-0.5">20 May 2024 - 27 May 2024</div>
              </div>

              <div className="px-3">
                <span className="text-[10px] text-muted-foreground">Claim Date</span>
                <div className="font-bold text-slate-900 mt-0.5">28 May 2024</div>
              </div>
            </div>
          </div>

          {/* Bottom Row Metric Counters Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <div className="text-[10px] text-muted-foreground">Total Claimed</div>
              <div className="text-base font-extrabold text-slate-900 font-mono">₹ {totalClaimed.toLocaleString("en-IN")}</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Eligible Amount</div>
              <div className="text-base font-extrabold text-slate-900 font-mono">₹ {totalEligible.toLocaleString("en-IN")}</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Non-Eligible Amount</div>
              <div className="text-base font-extrabold text-rose-600 font-mono">₹ {totalDisallowed.toLocaleString("en-IN")}</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Advance Adjusted</div>
              <div className="text-base font-extrabold text-slate-900 font-mono">₹ {advanceAdjusted.toLocaleString("en-IN")}</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Net Payable</div>
              <div className="text-base font-extrabold text-emerald-700 font-mono">₹ {netPayable.toLocaleString("en-IN")}</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Status</div>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Finance Review
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "expenses", label: "Expenses (6)", icon: Receipt },
              { id: "receipts", label: "Receipts (6)", icon: FileCheck },
              { id: "policy", label: "Policy Validation", icon: ShieldCheck },
              { id: "approvals", label: "Approvals (2/4)", icon: CheckCheck },
              { id: "advance", label: "Advance", icon: DollarSign },
              { id: "settlement", label: "Settlement", icon: Scale },
              { id: "documents", label: "Documents (4)", icon: Paperclip },
              { id: "history", label: "History", icon: Activity },
              { id: "notes", label: "Notes", icon: StickyNote },
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
            {/* Row 1: Expense Details Table (Left) & Claim Summary + Approval Status (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Expense Details (8 Cols) */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Expense Details</h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1 text-center w-6">#</th>
                        <th className="pb-1">Date</th>
                        <th className="pb-1">Category</th>
                        <th className="pb-1">Description</th>
                        <th className="pb-1">Merchant / Location</th>
                        <th className="pb-1 text-right">Amount (₹)</th>
                        <th className="pb-1 text-right">Eligible (₹)</th>
                        <th className="pb-1 text-right">Disallowed (₹)</th>
                        <th className="pb-1 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenses.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/60">
                          <td className="py-2 text-center text-slate-400 font-mono">{row.id}</td>
                          <td className="py-2 text-slate-600 font-mono text-[9px]">{row.date}</td>
                          <td className="py-2 font-semibold text-slate-900">{row.category}</td>
                          <td className="py-2 text-slate-600 truncate max-w-[120px]">{row.description}</td>
                          <td className="py-2 text-slate-500 truncate max-w-[130px]">{row.merchant}</td>
                          <td className="py-2 text-right font-mono font-bold text-slate-900">
                            {row.amount.toFixed(2)}
                          </td>
                          <td className="py-2 text-right font-mono font-bold text-slate-900">
                            {row.eligible.toFixed(2)}
                          </td>
                          <td className="py-2 text-right font-mono font-bold">
                            <span className={cn(row.disallowed > 0 ? "text-rose-600" : "text-slate-400")}>
                              {row.disallowed.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-2 text-center">
                            <span className="inline-flex items-center gap-1">
                              <FileText className="h-3 w-3 text-blue-600" />
                              <span
                                className={cn(
                                  "px-1 py-0.2 rounded-sm text-[8px] font-bold",
                                  row.receiptStatus === "Verified"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700",
                                )}
                              >
                                {row.receiptStatus}
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-200 font-bold text-slate-900 bg-slate-50/50">
                        <td colSpan={5} className="py-2 text-right pr-2">Total</td>
                        <td className="py-2 text-right font-mono">₹ {totalClaimed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 text-right font-mono">₹ {totalEligible.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 text-right font-mono text-rose-600">₹ {totalDisallowed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-primary" />
                    Add Expense
                  </button>
                </div>
              </div>

              {/* Right: Claim Summary & Approval Status (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* 1. Claim Summary */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      Claim Summary
                    </h4>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Claimed</span>
                      <span className="font-mono font-bold text-slate-900">₹ {totalClaimed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Eligible Amount</span>
                      <span className="font-mono font-bold text-slate-900">₹ {totalEligible.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Non-Eligible Amount</span>
                      <span className="font-mono font-bold text-rose-600">₹ {totalDisallowed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Advance Adjusted</span>
                      <span className="font-mono font-bold text-slate-900">₹ {advanceAdjusted.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-emerald-700">
                      <span>Net Payable (Reimbursement)</span>
                      <span className="font-mono">₹ {netPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>Net Recoverable</span>
                      <span className="font-mono font-bold">₹ 0.00</span>
                    </div>
                  </div>
                </div>

                {/* 2. Approval Status */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-800">Approval Status</h4>
                  </div>

                  <div className="space-y-2 text-[10px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900">Submitted by Employee</div>
                          <div className="text-[8px] text-slate-400 font-mono">28 May 2024, 10:15 AM</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900">Manager Review</div>
                          <div className="text-[8px] text-slate-400 font-mono">29 May 2024, 11:30 AM</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-700">Approved</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900">Policy Validation</div>
                          <div className="text-[8px] text-slate-400 font-mono">29 May 2024, 12:45 PM</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-700">Approved</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold shrink-0">●</div>
                        <div>
                          <div className="font-bold text-blue-700">Finance Verification</div>
                          <div className="text-[8px] text-slate-400 font-mono">30 May 2024</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-blue-700">In Progress</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[8px] shrink-0">○</div>
                        <span>Final Approval</span>
                      </div>
                      <span className="text-[9px]">Pending</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[8px] shrink-0">○</div>
                        <span>Payment Processing</span>
                      </div>
                      <span className="text-[9px]">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Policy Validation, Advance Details, Documents, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Policy Validation (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Policy Validation
                  </h4>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div>
                    <span className="text-slate-400">Applicable Policy</span>
                    <div className="font-bold text-slate-900">Standard Travel Policy - Level 3</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Policy Compliance</span>
                    <span className="px-1.5 py-0.2 rounded-md font-bold bg-emerald-50 text-emerald-700 text-[9px]">
                      Compliant
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Receipt Compliance</span>
                    <span className="px-1.5 py-0.2 rounded-md font-bold bg-emerald-50 text-emerald-700 text-[9px]">
                      Compliant
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Over Limit Items</span>
                    <span className="h-4 w-4 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-[9px]">2</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Exceptions Raised</span>
                    <span className="h-4 w-4 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-[9px]">1</span>
                  </div>
                </div>

                <button onClick={() => setActiveTab("policy")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Policy Details →
                </button>
              </div>

              {/* 2. Advance Details (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    Advance Details
                  </h4>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Advance Requested</span>
                    <span className="font-mono font-bold text-slate-900">₹ 15,000.00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Advance Approved</span>
                    <span className="font-mono font-bold text-slate-900">₹ 15,000.00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Advance Paid</span>
                    <span className="font-mono font-bold text-emerald-700">₹ 15,000.00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Advance Adjusted</span>
                    <span className="font-mono font-bold text-slate-900">₹ 15,000.00</span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-slate-900">
                    <span>Balance Advance</span>
                    <span className="font-mono text-emerald-700">₹ 0.00</span>
                  </div>
                </div>

                <button onClick={() => setActiveTab("advance")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Advance Details →
                </button>
              </div>

              {/* 3. Documents (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Documents</h4>
                  <button onClick={() => setActiveTab("documents")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Documents →
                  </button>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  {[
                    { name: "Air Ticket - 6E4521.pdf", date: "20 May 2024" },
                    { name: "Hotel Invoice - LT9876.pdf", date: "22 May 2024" },
                    { name: "Taxi Receipt - OLA78945.jpg", date: "21 May 2024" },
                    { name: "Fuel Bill - BP12345.pdf", date: "22 May 2024" },
                  ].map((doc) => (
                    <div key={doc.name} className="flex justify-between items-center p-1.5 rounded-md bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900 truncate max-w-[150px]">{doc.name}</div>
                        <div className="text-[8px] text-muted-foreground font-mono">{doc.date}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success(`Downloading ${doc.name}`)}
                        className="text-primary hover:text-blue-700 p-0.5 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
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
                    onClick={() => setIsAddExpenseModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Plus className="h-3 w-3 text-primary" />
                    Add Expense
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsUploadReceiptModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Receipt className="h-3 w-3 text-blue-600" />
                    Upload Receipt
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Request additional advance dialog")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-purple-600 hover:bg-purple-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <DollarSign className="h-3 w-3 text-purple-600" />
                    Request Advance
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Viewing Travel Policy limits")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    View Policy
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddNoteModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <StickyNote className="h-3 w-3 text-amber-600" />
                    Add Note
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.error("Expense claim cancelled")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-rose-600 hover:bg-rose-50/40 text-rose-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <XCircle className="h-3 w-3 text-rose-600" />
                    Cancel Claim
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Claim History Full Visual Flow Strip */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800">Claim History</h4>
              </div>

              <div className="py-2">
                <div className="flex items-center justify-between relative">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                  <div className="absolute top-1/2 left-3 w-1/2 -translate-y-1/2 h-0.5 bg-emerald-600 z-0" />

                  {[
                    { step: "1", title: "Claim Created", date: "28 May 2024", time: "09:45 AM", by: "by Employee", done: true },
                    { step: "2", title: "Submitted", date: "28 May 2024", time: "10:15 AM", by: "by Employee", done: true },
                    { step: "3", title: "Manager Approved", date: "29 May 2024", time: "11:30 AM", by: "by Arjun Kumar", done: true },
                    { step: "4", title: "Policy Validated", date: "29 May 2024", time: "12:45 PM", by: "by HR Department", done: true },
                    { step: "5", title: "Finance Verification", date: "30 May 2024", time: "09:20 AM", by: "by Finance Team", active: true },
                    { step: "6", title: "Final Approval", date: "Pending", time: "", by: "", future: true },
                    { step: "7", title: "Payment Processing", date: "Pending", time: "", by: "", future: true },
                    { step: "8", title: "Payment Completed", date: "Pending", time: "", by: "", future: true },
                    { step: "9", title: "Claim Closed", date: "Pending", time: "", by: "", future: true },
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
                        {s.done ? "✓" : s.active ? "●" : "○"}
                      </div>
                      <div className="text-[9px] font-bold text-slate-900 mt-1 text-center truncate max-w-[65px]">
                        {s.title}
                      </div>
                      <div className="text-[7px] text-muted-foreground text-center font-mono">{s.date}</div>
                      {s.time && <div className="text-[7px] text-slate-400 text-center font-mono">{s.time}</div>}
                      {s.by && <div className="text-[7px] text-slate-500 text-center">{s.by}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Expense */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Add Expense Line Item
              </h3>
              <button
                type="button"
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddExpenseModalOpen(false);
                toast.success("Expense item added to claim.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Category *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Airfare</option>
                  <option>Hotel / Lodging</option>
                  <option>Local Transport / Taxi</option>
                  <option>Meals / Per Diem</option>
                  <option>Fuel / Mileage</option>
                  <option>Parking & Toll</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Merchant / Vendor *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lemon Tree Hotel"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expense Date</label>
                  <input
                    type="date"
                    required
                    defaultValue="2024-05-24"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Receipt */}
      {isUploadReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-600" />
                Upload Receipt / Invoice
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadReceiptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsUploadReceiptModalOpen(false);
                toast.success("Receipt uploaded and OCR validated.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt File (PDF, JPG, PNG) *</label>
                <input
                  type="file"
                  required
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Match Expense Item</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Airfare - IndiGo (₹9,200)</option>
                  <option>Hotel - Lemon Tree (₹5,000)</option>
                  <option>Local Transport - Ola (₹2,300)</option>
                  <option>Meals - Paradise (₹1,500)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadReceiptModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold cursor-pointer"
                >
                  Upload & Scan OCR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Note */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-amber-600" />
                Add Claim Note
              </h3>
              <button
                type="button"
                onClick={() => setIsAddNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddNoteModalOpen(false);
                toast.success("Note added to claim.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Meals exceeded limit due to client dinner hosted with prior approval."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddNoteModalOpen(false)}
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

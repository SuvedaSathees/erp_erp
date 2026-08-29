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
      { title: "Expense Claims · HRM Management · Magnertia ERP" },
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

export function ExpenseClaimsPage() {
  const [activeTab, setActiveTab] = useState<string>("expenses");
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
      title="Expense Claims"
      breadcrumb="Management > HRM Management > Expense Claims"
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

        {/* 1. Expense Claim Master Header (Clean enterprise layout, no profile photos, no stars) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Row Meta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Claim Number</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">EXP-2024-00482</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Claim Type</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Travel & Out-of-Pocket</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Expense Period</span>
              <div className="font-semibold text-slate-900 text-sm truncate">20 May 2024 - 27 May 2024</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-0.5">
              <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Claim Date</span>
              <div className="font-mono font-bold text-emerald-700 text-sm truncate">28 May 2024</div>
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

        {/* Sub-Tabs Bar (3 Core Workable Tabs) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "expenses", label: "Expense Details (6)", icon: Receipt },
              { id: "receipts", label: "Receipts (6)", icon: FileCheck },
              { id: "approvals", label: "Policy & Approvals (2/4)", icon: CheckCheck },
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

        {/* TAB 1: EXPENSE DETAILS */}
        {activeTab === "expenses" && (
          <div className="space-y-6">
            {/* Row 1: Expense Details Table (Left) & Claim Summary + Quick Info (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Expense Details (8 Cols) */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Expense Details (6 Line Items)</h4>
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Expense
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1 text-center w-6">#</th>
                        <th className="pb-1 whitespace-nowrap">Date</th>
                        <th className="pb-1">Category</th>
                        <th className="pb-1">Description</th>
                        <th className="pb-1">Merchant / Location</th>
                        <th className="pb-1 text-right whitespace-nowrap">Amount (₹)</th>
                        <th className="pb-1 text-right whitespace-nowrap">Eligible (₹)</th>
                        <th className="pb-1 text-right whitespace-nowrap">Disallowed (₹)</th>
                        <th className="pb-1 text-center whitespace-nowrap">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenses.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/60">
                          <td className="py-2 text-center text-slate-400 font-mono">{row.id}</td>
                          <td className="py-2 text-slate-600 font-mono text-[9px] whitespace-nowrap">{row.date}</td>
                          <td className="py-2 font-semibold text-slate-900">{row.category}</td>
                          <td className="py-2 text-slate-600 truncate max-w-[120px]">{row.description}</td>
                          <td className="py-2 text-slate-500 truncate max-w-[130px]">{row.merchant}</td>
                          <td className="py-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            ₹ {row.amount.toFixed(2)}
                          </td>
                          <td className="py-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            ₹ {row.eligible.toFixed(2)}
                          </td>
                          <td className="py-2 text-right font-mono font-bold whitespace-nowrap">
                            <span className={cn(row.disallowed > 0 ? "text-rose-600 font-bold" : "text-slate-400")}>
                              ₹ {row.disallowed.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-2 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap",
                                row.receiptStatus === "Verified"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200",
                              )}
                            >
                              <FileText className="h-3 w-3 text-blue-600" />
                              {row.receiptStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-200 font-bold text-slate-900 bg-slate-50/50">
                        <td colSpan={5} className="py-2 text-right pr-2">Total</td>
                        <td className="py-2 text-right font-mono whitespace-nowrap">₹ {totalClaimed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 text-right font-mono whitespace-nowrap text-slate-900">₹ {totalEligible.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 text-right font-mono text-rose-600 whitespace-nowrap">₹ {totalDisallowed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-slate-500 text-[11px]">All claims are verified under Corporate Travel Policy (Tier 2).</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("receipts")}
                    className="text-primary hover:underline font-semibold text-[11px] cursor-pointer"
                  >
                    View Attached Invoices (6) →
                  </button>
                </div>
              </div>

              {/* Right: Claim Summary & Quick Policy Details (4 Cols) */}
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
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Total Claimed</span>
                      <span className="font-mono font-bold text-slate-900">₹ {totalClaimed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Eligible Amount</span>
                      <span className="font-mono font-bold text-slate-900">₹ {totalEligible.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Non-Eligible / Capped</span>
                      <span className="font-mono font-bold text-rose-600">₹ {totalDisallowed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Advance Adjusted</span>
                      <span className="font-mono font-bold text-slate-900">₹ {advanceAdjusted.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-100 font-bold text-emerald-700 bg-emerald-50/40 p-1.5 rounded-lg">
                      <span>Net Payable Reimbursement</span>
                      <span className="font-mono text-sm font-extrabold">₹ {netPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Quick Policy Check Card */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Policy & Compliance Status
                    </h4>
                  </div>

                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Policy Tier</span>
                      <span className="font-semibold text-slate-800">Tier 2 - Domestic</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Receipt Verification</span>
                      <span className="font-bold text-emerald-700">100% Attached</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Current Stage</span>
                      <span className="font-bold text-blue-700">Finance Review</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("approvals")}
                    className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center w-full border-t border-slate-100 block"
                  >
                    View Multi-Level Approvals (2/4) →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RECEIPTS */}
        {activeTab === "receipts" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    Attached Invoices & Tax Receipts (6)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Original tax receipts, boarding passes, and GST invoices mapped to claim items.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadReceiptModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Receipt
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Receipt Document</th>
                      <th className="py-2.5 px-3">Expense Category</th>
                      <th className="py-2.5 px-3">Merchant / Vendor</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Invoice Date</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Claimed Amount</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">OCR Match</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Verification Status</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "IndiGo Flight Ticket 6E-4521.pdf", cat: "Airfare", merchant: "IndiGo Airlines", date: "20 May 2024", amount: "₹ 9,200.00", ocr: "100%", status: "Verified" },
                      { name: "Lemon Tree Hotel Tax Invoice LT9876.pdf", cat: "Hotel", merchant: "Lemon Tree, Bengaluru", date: "20 May 2024", amount: "₹ 5,000.00", ocr: "100%", status: "Verified" },
                      { name: "Ola Cab Ride Receipt OLA78945.pdf", cat: "Local Transport", merchant: "Ola Cabs India", date: "21 May 2024", amount: "₹ 2,300.00", ocr: "98%", status: "Verified" },
                      { name: "Paradise Dining Food Bill.pdf", cat: "Meals", merchant: "Paradise Restaurant", date: "21 May 2024", amount: "₹ 1,500.00", ocr: "95%", status: "Partial" },
                      { name: "BPCL Fuel Cash Memo.pdf", cat: "Fuel", merchant: "Bharat Petroleum", date: "22 May 2024", amount: "₹ 2,850.00", ocr: "100%", status: "Verified" },
                      { name: "Hotel Parking Fee Receipt.pdf", cat: "Parking", merchant: "Lemon Tree Parking", date: "23 May 2024", amount: "₹ 800.00", ocr: "90%", status: "Partial" },
                    ].map((rc) => (
                      <tr key={rc.name} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                          <span className="truncate max-w-[200px]">{rc.name}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{rc.cat}</td>
                        <td className="py-3 px-3 text-slate-600">{rc.merchant}</td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{rc.date}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">{rc.amount}</td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {rc.ocr}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap",
                              rc.status === "Verified"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200",
                            )}
                          >
                            {rc.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => toast.success(`Downloading ${rc.name}`)}
                            className="p-1 rounded-md text-primary hover:bg-primary/10 transition cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POLICY & APPROVALS */}
        {activeTab === "approvals" && (
          <div className="space-y-6">
            {/* 1. Full 9-Step Visual Flow */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Claim Approval Workflow Lifecycle</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Real-time status tracking across organizational sign-off gates.</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Stage 5: Finance Verification
                </span>
              </div>

              <div className="py-3">
                <div className="flex items-start justify-between relative">
                  {/* Connecting line centered vertically at circle center (top-3 = 12px) */}
                  <div className="absolute top-3 left-6 right-6 h-0.5 bg-slate-200 z-0" />
                  <div className="absolute top-3 left-6 w-[50%] h-0.5 bg-emerald-600 z-0" />

                  {[
                    { step: "1", title: "Claim Created", date: "28 May 2024", by: "by Employee", done: true },
                    { step: "2", title: "Submitted", date: "28 May 2024", by: "by Employee", done: true },
                    { step: "3", title: "Manager Approved", date: "29 May 2024", by: "by Arun Kumar", done: true },
                    { step: "4", title: "Policy Validated", date: "29 May 2024", by: "by HR Dept", done: true },
                    { step: "5", title: "Finance Review", date: "30 May 2024", by: "by Finance Team", active: true },
                    { step: "6", title: "Final Signoff", date: "Pending", by: "", future: true },
                    { step: "7", title: "Payment Processing", date: "Pending", by: "", future: true },
                    { step: "8", title: "Disbursed", date: "Pending", by: "", future: true },
                    { step: "9", title: "Settled & Closed", date: "Pending", by: "", future: true },
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
                        {s.done ? "✓" : s.active ? "●" : s.step}
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

            {/* 2. Multi-Level Sign-off Matrix & Policy Compliance Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Approval Matrix Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Multi-Level Approval Matrix (2 of 4 Cleared)</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-950">Level 1: Reporting Manager</div>
                      <div className="text-[11px] text-emerald-800">Arun Kumar • Engineering Manager</div>
                      <div className="text-[10px] text-emerald-700 font-mono mt-0.5">Approved on 29 May 2024, 11:30 AM</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      Approved
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-950">Level 2: HR Policy Compliance</div>
                      <div className="text-[11px] text-emerald-800">Deepa Nair • HR Administration</div>
                      <div className="text-[10px] text-emerald-700 font-mono mt-0.5">Validated on 29 May 2024, 12:45 PM</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      Approved
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-blue-950">Level 3: Finance Verification</div>
                      <div className="text-[11px] text-blue-800">Finance & Accounts Team</div>
                      <div className="text-[10px] text-blue-700 font-mono mt-0.5">Assigned on 30 May 2024 • Reviewing Bills</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                      In Progress
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-slate-400">
                    <div>
                      <div className="font-bold text-slate-700">Level 4: Corporate Treasury Disbursal</div>
                      <div className="text-[11px] text-slate-500">Accounts Payable Direct Deposit</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                      Pending
                    </span>
                  </div>
                </div>
              </div>

              {/* Policy Thresholds & Exception Log */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Policy Rules & Disallowance Breakdown</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/80 space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>Airfare (IndiGo Economy Class)</span>
                      <span className="text-emerald-700 font-bold">100% Eligible</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Within Tier 2 domestic airfare ceiling (Max ₹ 12,000).</p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/80 space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>Hotel Accommodation (Lemon Tree)</span>
                      <span className="text-emerald-700 font-bold">100% Eligible</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Rate of ₹ 2,500/night complies with Tier 2 city hotel allowance.</p>
                  </div>

                  <div className="p-3 rounded-lg border border-rose-100 bg-rose-50/50 space-y-1">
                    <div className="flex justify-between font-semibold text-rose-900">
                      <span>Business Meals & Per Diem</span>
                      <span className="text-rose-700 font-bold">₹ 500 Capped</span>
                    </div>
                    <p className="text-[11px] text-rose-800">
                      Claim of ₹ 1,500 exceeded daily meal allowance of ₹ 1,000/day. ₹ 500 disallowed as per policy.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-rose-100 bg-rose-50/50 space-y-1">
                    <div className="flex justify-between font-semibold text-rose-900">
                      <span>Hotel Parking Charges</span>
                      <span className="text-rose-700 font-bold">₹ 300 Capped</span>
                    </div>
                    <p className="text-[11px] text-rose-800">
                      Parking ceiling capped at ₹ 500. Excess ₹ 300 excluded.
                    </p>
                  </div>
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


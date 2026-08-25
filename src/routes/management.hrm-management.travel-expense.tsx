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
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/travel-expense")({
  head: () => ({
    meta: [
      { title: "Travel Form · Employee Administration · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Travel Form manages the complete employee/business travel lifecycle from travel request → purpose → itinerary → approval → booking → advance → travel execution → expenses → settlement → reimbursement → compliance → analytics.",
      },
    ],
  }),
  component: TravelManagementPage,
});

// --- Data Models ---

const TRAVEL_COST_PIE = [
  { name: "Airfare", value: 9200, percentage: "49.7%", color: "#2563EB" },
  { name: "Hotel", value: 5000, percentage: "27.0%", color: "#10B981" },
  { name: "Local Transport", value: 2300, percentage: "12.4%", color: "#F59E0B" },
  { name: "Meals", value: 1500, percentage: "8.1%", color: "#EC4899" },
  { name: "Other", value: 500, percentage: "2.8%", color: "#8B5CF6" },
];

const ITINERARY_LIST = [
  { date: "25 May 2024", from: "Coimbatore (CJB)", to: "Bengaluru (BLR)", mode: "Flight", dep: "08:30 AM", arr: "10:20 AM", ref: "6E-4521", status: "Confirmed" },
  { date: "25 May 2024", from: "Airport", to: "Hotel (HSR Layout)", mode: "Cab", dep: "10:45 AM", arr: "11:30 AM", ref: "CAB-78945", status: "Confirmed" },
  { date: "26 May 2024", from: "Bengaluru", to: "Client Office", mode: "Cab", dep: "09:30 AM", arr: "09:45 AM", ref: "CAB-78946", status: "Scheduled" },
  { date: "27 May 2024", from: "Bengaluru (BLR)", to: "Coimbatore (CJB)", mode: "Flight", dep: "06:40 PM", arr: "08:15 PM", ref: "6E-4526", status: "Confirmed" },
];

const TOP_EXPENSES = [
  { category: "Airfare", date: "20 May 2024", amount: "9,200", status: "Booked" },
  { category: "Hotel", date: "20 May 2024", amount: "5,000", status: "Booked" },
  { category: "Local Transport", date: "-", amount: "2,300", status: "Estimated" },
  { category: "Meals", date: "-", amount: "1,500", status: "Estimated" },
  { category: "Other", date: "-", amount: "500", status: "Estimated" },
];

export default function TravelManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);

  const handleSubmitForReview = () => {
    toast.success("Travel Request TRV-2024-00128 submitted for review", {
      description: "Itinerary and advance request forwarded to Reporting Manager & Finance.",
    });
  };

  return (
    <AppShell
      title="Travel Form"
      breadcrumb="Management > HRM Management > Employee Administration > Travel Form"
      description="The Travel Form manages the complete employee/business travel lifecycle from travel request → purpose → itinerary → approval → booking → advance → travel execution → expenses → settlement → reimbursement → compliance → analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Airplane Icon */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Travel Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Travel Request
              </button>
              <button
                type="button"
                onClick={() => toast.info("Importing travel itinerary...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                Import Data
              </button>
              <button
                type="button"
                onClick={() => toast.success("Travel manifest exported")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More travel options opened")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                More
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={handleSubmitForReview}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Submit for Review
              </button>
            </div>
          </div>
        </div>

        {/* 1. Employee Header & Travel Master Metadata (Exact match to reference screenshot) */}
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
                <span className="text-[10px] text-muted-foreground">Travel Number</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">TRV-2024-00128</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Travel Type</span>
                <div className="font-bold text-slate-900 mt-0.5">Business Travel</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Travel Category</span>
                <div className="font-bold text-slate-900 mt-0.5">Domestic</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Purpose</span>
                <div className="font-bold text-slate-900 mt-0.5">Client Meeting</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Cost Center</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">CC-ENG-001</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Project</span>
                <div className="font-bold text-primary font-mono mt-0.5">PMP-00045</div>
              </div>
            </div>
          </div>

          {/* Bottom Row Meta Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            <div>
              <div className="text-[10px] text-muted-foreground">From</div>
              <div className="font-semibold text-slate-900">Coimbatore (CJB)</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">To</div>
              <div className="font-semibold text-slate-900">Bengaluru (BLR)</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Departure</div>
              <div className="font-semibold text-slate-900 font-mono text-[11px]">25 May 2024, 08:30 AM</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Return</div>
              <div className="font-semibold text-slate-900 font-mono text-[11px]">27 May 2024, 08:15 PM</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Duration</div>
              <div className="font-bold text-slate-900 font-mono">2D 2H</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Estimated Cost</div>
              <div className="font-bold text-slate-900 font-mono">₹ 18,500</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Advance</div>
              <div className="font-bold text-emerald-700 font-mono">₹ 10,000</div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">Status</div>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                In Progress
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "itinerary", label: "Itinerary", icon: Navigation },
              { id: "bookings", label: "Bookings", icon: Hotel },
              { id: "approvals", label: "Approvals", icon: CheckCheck },
              { id: "advance", label: "Advance", icon: DollarSign },
              { id: "expenses", label: "Expenses", icon: Receipt },
              { id: "claims", label: "Claims", icon: FileText },
              { id: "documents", label: "Documents", icon: Paperclip },
              { id: "outcomes", label: "Outcomes", icon: Target },
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
            {/* Row 1: Travel Progress, Cost Summary, Advance & Settlement, Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Travel Progress */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Travel Progress</h4>
                </div>

                {/* Progress Steps */}
                <div className="py-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                    <div className="absolute top-1/2 left-3 w-3/4 -translate-y-1/2 h-0.5 bg-emerald-600 z-0" />

                    {[
                      { step: "1", label: "Submitted", date: "20 May 2024", done: true },
                      { step: "2", label: "Manager Approval", date: "20 May 2024", done: true },
                      { step: "3", label: "Finance Approval", date: "21 May 2024", done: true },
                      { step: "4", label: "In Progress", date: "25 May 2024", active: true },
                      { step: "5", label: "Expense Claim", date: "", future: true },
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
                          {s.done ? "✓" : s.active ? <Plane className="h-3 w-3 text-white" /> : "6"}
                        </div>
                        <div className="text-[8px] font-bold text-slate-900 mt-1 text-center truncate max-w-[55px]">
                          {s.label}
                        </div>
                        {s.date && <div className="text-[7px] text-muted-foreground text-center">{s.date}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[10px]">
                  <div>
                    <span className="text-slate-400 text-[9px]">Current Step</span>
                    <div className="font-bold text-blue-700">Travel In Progress</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px]">Next Step</span>
                    <div className="font-bold text-slate-800">Expense Claim</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px]">Expected Completion</span>
                    <div className="font-bold text-slate-800">03 Jun 2024</div>
                  </div>
                </div>
              </div>

              {/* 2. Cost Summary (Donut Chart) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Cost Summary</h4>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="h-28 w-28 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={TRAVEL_COST_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={44}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {TRAVEL_COST_PIE.map((entry, index) => (
                            <Cell key={`costpie-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">₹ 18,500</span>
                      <span className="text-[7px] text-muted-foreground">Total Cost</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[9px] flex-1">
                    {TRAVEL_COST_PIE.map((c) => (
                      <div key={c.name} className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-600 truncate">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">₹ {c.value.toLocaleString("en-IN")} ({c.percentage})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => setActiveTab("expenses")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Cost Breakdown →
                </button>
              </div>

              {/* 3. Advance & Settlement */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Advance & Settlement</h4>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Advance Approved</span>
                    <span className="font-mono font-bold text-slate-800">₹ 10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Advance Paid</span>
                    <span className="font-mono font-bold text-emerald-700">₹ 10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Expenses</span>
                    <span className="font-mono font-bold text-slate-800">₹ 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Approved Expenses</span>
                    <span className="font-mono font-bold text-slate-800">₹ 0</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100 font-bold">
                    <span className="text-slate-800">Balance to Settle</span>
                    <span className="font-mono text-emerald-700">₹ 0</span>
                  </div>
                </div>

                <button onClick={() => setActiveTab("advance")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Settlement Details →
                </button>
              </div>

              {/* 4. Quick Info */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Info</h4>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Travel Policy</span>
                    <span className="font-semibold text-slate-800">Standard Policy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Approval Matrix</span>
                    <span className="font-semibold text-slate-800">Level 3 Approval</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booking Status</span>
                    <span className="font-bold text-emerald-700">Confirmed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hotel Check-In</span>
                    <span className="font-mono text-slate-700">25 May 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hotel Check-Out</span>
                    <span className="font-mono text-slate-700">27 May 2024</span>
                  </div>
                </div>

                <button onClick={() => toast.info("Travel policy details")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Policy Details →
                </button>
              </div>
            </div>

            {/* Row 2: Itinerary Summary & Upcoming Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 1. Itinerary Summary (8 Cols) */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Itinerary Summary</h4>
                  <button onClick={() => setActiveTab("itinerary")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Full Itinerary →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Date</th>
                        <th className="pb-1">From</th>
                        <th className="pb-1">To</th>
                        <th className="pb-1">Mode</th>
                        <th className="pb-1">Departure</th>
                        <th className="pb-1">Arrival</th>
                        <th className="pb-1">Booking Ref.</th>
                        <th className="pb-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ITINERARY_LIST.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2 font-mono text-slate-800">{it.date}</td>
                          <td className="py-2 font-semibold text-slate-900">{it.from}</td>
                          <td className="py-2 font-semibold text-slate-900">{it.to}</td>
                          <td className="py-2 text-slate-600">
                            <span className="flex items-center gap-1">
                              {it.mode === "Flight" ? <Plane className="h-3 w-3 text-blue-600" /> : <Car className="h-3 w-3 text-amber-600" />}
                              {it.mode}
                            </span>
                          </td>
                          <td className="py-2 font-mono text-slate-600">{it.dep}</td>
                          <td className="py-2 font-mono text-slate-600">{it.arr}</td>
                          <td className="py-2 font-mono font-bold text-primary">{it.ref}</td>
                          <td className="py-2 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded-md font-bold text-[9px]",
                                it.status === "Confirmed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200",
                              )}
                            >
                              {it.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Upcoming Activities (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Upcoming Activities</h4>
                  <button onClick={() => toast.info("Activity calendar")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Full Schedule →
                  </button>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Plane className="h-3.5 w-3.5 text-blue-600" />
                      <div>
                        <div className="font-bold text-slate-900">Departure</div>
                        <div className="text-[9px] text-muted-foreground font-mono">25 May 2024, 08:30 AM</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-md font-bold bg-blue-50 text-blue-700 text-[9px]">Today</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">Client Meeting</div>
                        <div className="text-[9px] text-muted-foreground font-mono">25 May 2024, 11:00 AM</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-md font-bold bg-emerald-50 text-emerald-700 text-[9px]">Today</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-purple-600" />
                      <div>
                        <div className="font-bold text-slate-900">Project Discussion</div>
                        <div className="text-[9px] text-muted-foreground font-mono">26 May 2024, 10:00 AM</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-md font-bold bg-purple-50 text-purple-700 text-[9px]">Tomorrow</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Plane className="h-3.5 w-3.5 text-indigo-600" />
                      <div>
                        <div className="font-bold text-slate-900">Return</div>
                        <div className="text-[9px] text-muted-foreground font-mono">27 May 2024, 06:40 PM</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-md font-bold bg-slate-100 text-slate-600 text-[9px]">Day After</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Top Expenses, Documents, Recent History, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Top Expenses (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Top Expenses</h4>
                  <button onClick={() => setActiveTab("expenses")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Expenses →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Category</th>
                        <th className="pb-1">Amount (₹)</th>
                        <th className="pb-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {TOP_EXPENSES.map((ex) => (
                        <tr key={ex.category} className="hover:bg-slate-50/60">
                          <td className="py-1.5 font-medium text-slate-900">{ex.category}</td>
                          <td className="py-1.5 font-mono font-bold text-slate-800">{ex.amount}</td>
                          <td className="py-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded-md font-bold text-[8px]",
                                ex.status === "Booked"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500",
                              )}
                            >
                              {ex.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Documents (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Documents</h4>
                  <button onClick={() => setActiveTab("documents")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Documents →
                  </button>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  {[
                    { name: "Travel Approval Letter.pdf", date: "20 May 2024" },
                    { name: "Flight Ticket (6E-4521).pdf", date: "20 May 2024" },
                    { name: "Hotel Booking Voucher.pdf", date: "20 May 2024" },
                    { name: "Travel Policy Acknowledgement.pdf", date: "20 May 2024" },
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

              {/* 3. Recent History (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent History</h4>
                  <button onClick={() => setActiveTab("history")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Full History →
                  </button>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Finance Approval</div>
                      <div className="text-[8px] text-slate-400 font-mono">21 May 2024, 10:15 AM</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Manager Approval</div>
                      <div className="text-[8px] text-slate-400 font-mono">20 May 2024, 05:20 PM</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Submitted</div>
                      <div className="text-[8px] text-slate-400 font-mono">20 May 2024, 04:30 PM</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-slate-600">Draft Created</div>
                      <div className="text-[8px] text-slate-400 font-mono">20 May 2024, 03:45 PM</div>
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
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Plus className="h-3 w-3 text-primary" />
                    Add Expense
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Submit expense claim")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <FileText className="h-3 w-3 text-blue-600" />
                    Submit Claim
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Upload travel receipt")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-purple-600 hover:bg-purple-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Paperclip className="h-3 w-3 text-purple-600" />
                    Upload Document
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.error("Travel request cancellation initiated")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-rose-600 hover:bg-rose-50/40 text-rose-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <XCircle className="h-3 w-3 text-rose-600" />
                    Cancel Travel
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAdvanceModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <DollarSign className="h-3 w-3 text-emerald-600" />
                    Request Advance
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Travel policy reference opened")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <ShieldCheck className="h-3 w-3 text-amber-600" />
                    Travel Policy
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Itinerary manifest PDF downloaded")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-cyan-600 hover:bg-cyan-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Download className="h-3 w-3 text-cyan-600" />
                    Download Itinerary
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Travel analytics preview")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-indigo-600" />
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Travel Request */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plane className="h-4 w-4 text-primary" />
                New Travel Request
              </h3>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsRequestModalOpen(false);
                toast.success("Travel request submitted successfully.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai (BOM) / New Delhi (DEL)"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    required
                    defaultValue="2024-06-10"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Return Date</label>
                  <input
                    type="date"
                    required
                    defaultValue="2024-06-12"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose Category *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Client Meeting</option>
                  <option>Site Inspection</option>
                  <option>Technical Conference</option>
                  <option>Supplier Audit</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Submit Travel Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Expense */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Add Travel Expense
              </h3>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsExpenseModalOpen(false);
                toast.success("Expense item logged successfully.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Category *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Airfare</option>
                  <option>Hotel & Lodging</option>
                  <option>Taxi / Local Transport</option>
                  <option>Meals & Per Diem</option>
                  <option>Client Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2500"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Request Advance */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Request Travel Advance
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
                toast.success("Travel advance request submitted to Finance.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Advance Amount (₹) *</label>
                <input
                  type="number"
                  required
                  defaultValue={10000}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Justification</label>
                <textarea
                  rows={2}
                  defaultValue="Advance for hotel stay, meals and local transportation in Bengaluru."
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden resize-none"
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
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold cursor-pointer"
                >
                  Request Advance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

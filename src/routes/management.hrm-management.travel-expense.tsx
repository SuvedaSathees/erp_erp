import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
      { title: "Travel & Expense · HRM Management · Magnertia ERP" },
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

export function TravelManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("itinerary");

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
      title="Travel & Expense Management"
      breadcrumb="Management > HRM Management > Travel & Expense"
      description="Corporate business travel itineraries, flight & hotel reservations, travel per-diems, cash advances, and trip settlement."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Airplane Icon */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Business Travel Logistics & Advance Desk
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

        {/* Boundary Notice Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-xl text-xs text-sky-950">
          <div className="flex items-center gap-2.5">
            <Plane className="h-4 w-4 text-sky-600 shrink-0" />
            <div>
              <span className="font-bold">Business Travel Scope:</span> This module manages flights, trains, hotel bookings, itineraries, and trip advances.
            </div>
          </div>
          <Link
            to="/management/hrm-management/expense-claims"
            className="shrink-0 font-semibold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 text-[11px]"
          >
            Claiming home internet, mobile bills, office supplies or training? Go to Expense Claims &rarr;
          </Link>
        </div>

        {/* 1. Travel Requisition Header (Clean enterprise layout, no profile photos, no stars) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Row Meta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Travel Requisition</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">TRV-2024-00128</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Travel Type</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Business Travel</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Category</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Domestic</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Purpose</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Client Architecture Review</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Cost Center</span>
              <div className="font-mono font-semibold text-slate-900 text-sm truncate">CC-ENG-001</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-0.5">
              <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Charge Project</span>
              <div className="font-mono font-bold text-emerald-700 text-sm truncate">PMP-00045</div>
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

        {/* Sub-Tabs Bar (3 Core Workable Tabs) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "itinerary", label: "Itinerary & Travel Plan", icon: Navigation },
              { id: "bookings", label: "Flight & Hotel Bookings", icon: Hotel },
              { id: "advance", label: "Travel Advance & Settlement", icon: DollarSign },
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

        {/* TAB 1: ITINERARY & TRAVEL PLAN */}
        {activeTab === "itinerary" && (
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
                  <div className="flex items-start justify-between relative">
                    <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 z-0" />
                    <div className="absolute top-3 left-4 w-3/4 h-0.5 bg-emerald-600 z-0" />

                    {[
                      { step: "1", label: "Submitted", date: "20 May 2024", done: true },
                      { step: "2", label: "Manager Approval", date: "20 May 2024", done: true },
                      { step: "3", label: "Finance Approval", date: "21 May 2024", done: true },
                      { step: "4", label: "In Progress", date: "25 May 2024", active: true },
                      { step: "5", label: "Expense Claim", date: "", future: true },
                    ].map((s) => (
                      <div key={s.step} className="flex flex-col items-center relative z-10 max-w-[65px] text-center">
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
                          {s.done ? "✓" : s.active ? <Plane className="h-3 w-3 text-white" /> : s.step}
                        </div>
                        <div className="text-[8px] font-bold text-slate-900 mt-2 text-center truncate max-w-[55px]">
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
                    <span className="text-slate-400 text-[9px]">Expected Return</span>
                    <div className="font-bold text-slate-800">27 May 2024</div>
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
                        <span className="font-mono font-bold text-slate-800">₹ {c.value.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => setActiveTab("advance")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Cost & Advance Breakdown →
                </button>
              </div>

              {/* 3. Advance & Settlement Summary */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Advance & Settlement</h4>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Advance Disbursed</span>
                    <span className="font-mono font-bold text-slate-900">₹ 10,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Estimated Total Cost</span>
                    <span className="font-mono font-bold text-slate-900">₹ 18,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Advance Mode</span>
                    <span className="font-medium text-slate-700">Bank Transfer</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Disbursed Date</span>
                    <span className="font-mono text-slate-600">22 May 2024</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="font-bold text-slate-700">Net Payable Balance</span>
                    <span className="font-mono font-extrabold text-emerald-700">₹ 8,500</span>
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

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Travel Policy Tier</span>
                    <span className="font-semibold text-slate-800">Tier 2 - Domestic</span>
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
                  <button onClick={() => setActiveTab("bookings")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Bookings →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1 whitespace-nowrap">Date</th>
                        <th className="pb-1">From</th>
                        <th className="pb-1">To</th>
                        <th className="pb-1">Mode</th>
                        <th className="pb-1 whitespace-nowrap">Departure</th>
                        <th className="pb-1 whitespace-nowrap">Arrival</th>
                        <th className="pb-1 whitespace-nowrap">Booking Ref.</th>
                        <th className="pb-1 text-right whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ITINERARY_LIST.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2 font-mono text-slate-800 whitespace-nowrap">{it.date}</td>
                          <td className="py-2 font-semibold text-slate-900">{it.from}</td>
                          <td className="py-2 font-semibold text-slate-900">{it.to}</td>
                          <td className="py-2 text-slate-600 whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              {it.mode === "Flight" ? <Plane className="h-3 w-3 text-blue-600" /> : <Car className="h-3 w-3 text-amber-600" />}
                              {it.mode}
                            </span>
                          </td>
                          <td className="py-2 font-mono text-slate-600 whitespace-nowrap">{it.dep}</td>
                          <td className="py-2 font-mono text-slate-600 whitespace-nowrap">{it.arr}</td>
                          <td className="py-2 font-mono font-bold text-primary whitespace-nowrap">{it.ref}</td>
                          <td className="py-2 text-right whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] whitespace-nowrap",
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
                    Full Schedule →
                  </button>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Plane className="h-3.5 w-3.5 text-blue-600" />
                      <div>
                        <div className="font-bold text-slate-900">Departure Flight 6E-4521</div>
                        <div className="text-[9px] text-muted-foreground font-mono">25 May 2024, 08:30 AM</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-md font-bold bg-blue-50 text-blue-700 text-[9px]">Today</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">Client Strategy Meeting</div>
                        <div className="text-[9px] text-muted-foreground font-mono">25 May 2024, 11:00 AM</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-md font-bold bg-emerald-50 text-emerald-700 text-[9px]">Today</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-purple-600" />
                      <div>
                        <div className="font-bold text-slate-900">Project Review & Demo</div>
                        <div className="text-[9px] text-muted-foreground font-mono">26 May 2024, 10:00 AM</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-md font-bold bg-purple-50 text-purple-700 text-[9px]">Tomorrow</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Plane className="h-3.5 w-3.5 text-indigo-600" />
                      <div>
                        <div className="font-bold text-slate-900">Return Flight 6E-4528</div>
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
                  <button onClick={() => setActiveTab("advance")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All →
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
                          <td className="py-1.5 font-mono font-bold text-slate-800">₹ {ex.amount}</td>
                          <td className="py-1.5 text-right whitespace-nowrap">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded-md font-bold text-[8px]",
                                ex.status === "Booked"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
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
                  <button onClick={() => toast.info("Viewing all documents")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All →
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
                    onClick={() => setActiveTab("advance")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <FileText className="h-3 w-3 text-blue-600" />
                    Settlement
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("bookings")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-purple-600 hover:bg-purple-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Hotel className="h-3 w-3 text-purple-600" />
                    Bookings
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAdvanceModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <DollarSign className="h-3 w-3 text-emerald-600" />
                    Advance
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Travel policy reference opened")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <ShieldCheck className="h-3 w-3 text-amber-600" />
                    Policy
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Itinerary manifest PDF downloaded")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-cyan-600 hover:bg-cyan-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Download className="h-3 w-3 text-cyan-600" />
                    Manifest
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Travel analytics preview")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-indigo-600" />
                    Reports
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.error("Travel request cancellation dialog")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-rose-600 hover:bg-rose-50/40 text-rose-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <XCircle className="h-3 w-3 text-rose-600" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLIGHT & HOTEL BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* 1. Flight Bookings Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">Flight & Air Travel Bookings</h4>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Add new flight booking")}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Flight
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Flight / Airline</th>
                      <th className="py-2.5 px-3">Route / Sector</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Departure</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Arrival</th>
                      <th className="py-2.5 px-3">Class & Seat</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">PNR Reference</th>
                      <th className="py-2.5 px-3">Fare Amount</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { flight: "6E-4521 (Indigo)", from: "Coimbatore (CJB)", to: "Bengaluru (BLR)", dep: "25 May 2024, 08:30 AM", arr: "25 May 2024, 09:25 AM", seat: "Economy • 14B", pnr: "PNR-984210", amount: "₹ 4,500", status: "Confirmed" },
                      { flight: "6E-4528 (Indigo)", from: "Bengaluru (BLR)", to: "Coimbatore (CJB)", dep: "27 May 2024, 06:40 PM", arr: "27 May 2024, 07:35 PM", seat: "Economy • 12A", pnr: "PNR-984255", amount: "₹ 4,500", status: "Confirmed" },
                    ].map((f) => (
                      <tr key={f.pnr} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{f.flight}</td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{f.from} → {f.to}</td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{f.dep}</td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{f.arr}</td>
                        <td className="py-3 px-3 text-slate-600">{f.seat}</td>
                        <td className="py-3 px-3 font-mono font-bold text-primary whitespace-nowrap">{f.pnr}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{f.amount}</td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Hotel Accommodations Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">Hotel & Accommodation Vouchers</h4>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Add new hotel accommodation")}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Hotel
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Hotel Property</th>
                      <th className="py-2.5 px-3">Location / City</th>
                      <th className="py-2.5 px-3">Room Type</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Check-In</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Check-Out</th>
                      <th className="py-2.5 px-3 text-center">Nights</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Booking Voucher</th>
                      <th className="py-2.5 px-3">Tariff Total</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { hotel: "Taj West End / Marriott Whitefield", city: "Bengaluru Central", room: "Deluxe Executive (Complimentary Breakfast)", in: "25 May 2024 (12:00 PM)", out: "27 May 2024 (11:00 AM)", nights: 2, voucher: "HTL-BLR-84920", total: "₹ 6,500", status: "Confirmed" },
                    ].map((h) => (
                      <tr key={h.voucher} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{h.hotel}</td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{h.city}</td>
                        <td className="py-3 px-3 text-slate-700">{h.room}</td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{h.in}</td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{h.out}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{h.nights}</td>
                        <td className="py-3 px-3 font-mono font-bold text-primary whitespace-nowrap">{h.voucher}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{h.total}</td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {h.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Local Ground Transportation */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-900">Local Ground Transportation & Transfers</h4>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Add new cab transfer")}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Cab Transfer
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Transfer Route</th>
                      <th className="py-2.5 px-3">Vehicle Type</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Pickup Time</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Booking Ref</th>
                      <th className="py-2.5 px-3">Estimated Fare</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { route: "BLR Airport → Client Office (Whitefield)", vehicle: "Sedan EV Prime", time: "25 May 2024, 09:45 AM", ref: "CAB-9281", fare: "₹ 1,500", status: "Confirmed" },
                      { route: "Client Office → BLR Airport", vehicle: "Sedan EV Prime", time: "27 May 2024, 04:30 PM", ref: "CAB-9294", fare: "₹ 1,500", status: "Confirmed" },
                    ].map((c) => (
                      <tr key={c.ref} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{c.route}</td>
                        <td className="py-3 px-3 text-slate-700">{c.vehicle}</td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{c.time}</td>
                        <td className="py-3 px-3 font-mono font-bold text-primary whitespace-nowrap">{c.ref}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{c.fare}</td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRAVEL ADVANCE & SETTLEMENT */}
        {activeTab === "advance" && (
          <div className="space-y-6">
            {/* Top Cards: Advance Disbursal & Net Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
                <div className="text-xs text-muted-foreground font-semibold">Advance Disbursed (Pre-Travel)</div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">₹ 10,000</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle className="h-3 w-3 text-emerald-600" />
                  Credited via NEFT on 22 May 2024
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
                <div className="text-xs text-muted-foreground font-semibold">Total Incurred / Estimated Cost</div>
                <div className="text-2xl font-extrabold text-blue-700 font-mono">₹ 18,500</div>
                <div className="text-[11px] text-slate-500">
                  Approved policy budget under Tier 2 Domestic
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2 bg-emerald-50/20">
                <div className="text-xs text-emerald-800 font-semibold">Net Balance to Employee</div>
                <div className="text-2xl font-extrabold text-emerald-700 font-mono">₹ 8,500</div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Payable upon post-travel settlement submission
                </div>
              </div>
            </div>

            {/* Settlement Itemized Table */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Expense Category Breakdown & Advance Offset</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Itemized claims against corporate travel advance.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdvanceModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    + Request Additional Advance
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success("Settlement statement exported")}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export Settlement
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Expense Category</th>
                      <th className="py-2.5 px-3">Budgeted / Estimated</th>
                      <th className="py-2.5 px-3">Actual Incurred</th>
                      <th className="py-2.5 px-3 text-center">Receipts Attached</th>
                      <th className="py-2.5 px-3">Payment Method</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Settlement Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { cat: "Flight & Airfare", budget: "₹ 9,000", actual: "₹ 9,000", receipts: "2 Tax Invoices", mode: "Company Card", status: "Verified & Pre-paid" },
                      { cat: "Hotel & Accommodation", budget: "₹ 6,500", actual: "₹ 6,500", receipts: "1 Hotel Folio", mode: "Direct Corporate", status: "Verified & Pre-paid" },
                      { cat: "Meals & Per Diem", budget: "₹ 1,500", actual: "₹ 1,500", receipts: "3 Meal Bills", mode: "Travel Advance", status: "Adjusted from Advance" },
                      { cat: "Local Cabs & Transit", budget: "₹ 1,000", actual: "₹ 1,000", receipts: "2 Cab E-Receipts", mode: "Travel Advance", status: "Adjusted from Advance" },
                      { cat: "Client Entertainment / Other", budget: "₹ 500", actual: "₹ 500", receipts: "1 Bill", mode: "Employee Cash", status: "Reimbursable" },
                    ].map((s) => (
                      <tr key={s.cat} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{s.cat}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{s.budget}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{s.actual}</td>
                        <td className="py-3 px-3 text-center font-medium text-blue-700">{s.receipts}</td>
                        <td className="py-3 px-3 text-slate-600">{s.mode}</td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default TravelManagementPage;


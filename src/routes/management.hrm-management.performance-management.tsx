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
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/performance-management")({
  head: () => ({
    meta: [
      { title: "Performance Management · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Performance Form manages the complete employee performance lifecycle from performance planning → goals → KPIs → competencies → KRAs → reviews → feedback → ratings → development actions → appraisal → rewards → performance improvement → analytics.",
      },
    ],
  }),
  component: PerformanceManagementPage,
});

// --- Data Models ---

const RATING_DISTRIBUTION_PIE = [
  { name: "Exceptional (5)", value: 18, color: "#10B981" },
  { name: "Exceeds Expectations (4)", value: 32, color: "#2563EB" },
  { name: "Meets Expectations (3)", value: 38, color: "#F59E0B" },
  { name: "Needs Improvement (2)", value: 10, color: "#FB923C" },
  { name: "Unsatisfactory (1)", value: 2, color: "#EF4444" },
];

const GOALS_LIST = [
  { title: "Product Development", achievement: 95, color: "bg-emerald-600" },
  { title: "Project Delivery", achievement: 90, color: "bg-emerald-600" },
  { title: "Quality Improvement", achievement: 88, color: "bg-emerald-600" },
  { title: "Innovation", achievement: 80, color: "bg-amber-500" },
  { title: "Cost Optimization", achievement: 70, color: "bg-orange-500" },
];

const KPIS_LIST = [
  { name: "On-time Project Delivery", target: "95%", actual: "92%", achievement: 96.8 },
  { name: "Defect Reduction", target: "90%", actual: "85%", achievement: 94.4 },
  { name: "Customer Satisfaction", target: "95%", actual: "90%", achievement: 94.7 },
  { name: "Cost Savings", target: "₹ 20L", actual: "₹ 18.2L", achievement: 91.0 },
  { name: "Process Compliance", target: "100%", actual: "95%", achievement: 95.0 },
];

const COMPETENCIES_LIST = [
  { name: "Technical Expertise", expected: 4, actual: 4, score: 4.2 },
  { name: "Problem Solving", expected: 4, actual: 4, score: 4.0 },
  { name: "Communication", expected: 3, actual: 4, score: 4.1 },
  { name: "Team Collaboration", expected: 4, actual: 4, score: 4.3 },
  { name: "Leadership", expected: 3, actual: 3, score: 3.0 },
];

const PERFORMANCE_HISTORY = [
  { cycle: "FY 2022-23", type: "Annual", score: 4.1, rating: 4, comments: "Very Good Performance" },
  { cycle: "FY 2021-22", type: "Annual", score: 3.9, rating: 4, comments: "Good Performance" },
  { cycle: "FY 2020-21", type: "Annual", score: 3.6, rating: 3, comments: "Satisfactory Performance" },
];

const ACTION_ITEMS = [
  { action: "Improve strategic thinking", owner: "Sankar", dueDate: "30 Apr 2024", status: "In Progress" },
  { action: "Leadership training program", owner: "HR", dueDate: "15 Jun 2024", status: "Pending" },
  { action: "Time management workshop", owner: "Sankar", dueDate: "30 May 2024", status: "Not Started" },
  { action: "Mentoring sessions", owner: "Arun Kumar", dueDate: "30 Jul 2024", status: "Not Started" },
];

export default function PerformanceManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleSubmitForReview = () => {
    toast.success("Performance Review submitted successfully", {
      description: "Appraisal moved to 360° Feedback & Calibration queue.",
    });
  };

  return (
    <AppShell
      title="Performance Management"
      breadcrumb="Management > HRM Management > Performance Management"
      description="The Performance Form manages the complete employee performance lifecycle from performance planning → goals → KPIs → competencies → KRAs → reviews → feedback → ratings → development actions → appraisal → rewards → performance improvement → analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Performance Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Create New
              </button>
              <button
                type="button"
                onClick={() => toast.info("Importing appraisal data...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                Import Data
              </button>
              <button
                type="button"
                onClick={() => toast.success("Performance scorecard exported")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More performance tools opened")}
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

        {/* 1. Employee Header & 6 Key Performance Badges (Exact match to reference screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-6">
          {/* Top Row: Employee Profile + Cycle Info */}
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
                  Active
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

            {/* Quick Cycle Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs divide-x divide-slate-100">
              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Performance Cycle</span>
                <div className="font-bold text-slate-900 mt-0.5">FY 2023-24 Annual</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Review Type</span>
                <div className="font-bold text-slate-900 mt-0.5">Annual</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Review Period</span>
                <div className="font-bold text-slate-900 mt-0.5">01 Apr 2023 - 31 Mar 2024</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Reporting Manager</span>
                <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80" alt="manager" className="h-4 w-4 rounded-full" />
                  <div>
                    <div>Arun Kumar</div>
                    <div className="text-[9px] text-muted-foreground font-normal">Engineering Manager</div>
                  </div>
                </div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Due Date</span>
                <div className="font-bold text-rose-600 mt-0.5">30 Apr 2024</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Status</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  In Progress
                </span>
              </div>
            </div>
          </div>

          {/* 6 Key Performance Metric Badges Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* 1. Overall Rating */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-amber-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Overall Rating</div>
                <div className="text-sm font-extrabold text-slate-900 font-mono">4.2 / 5</div>
                <div className="text-[9px] text-amber-700 font-semibold">Very Good</div>
              </div>
            </div>

            {/* 2. Goal Achievement */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-emerald-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Goal Achievement</div>
                <div className="text-sm font-extrabold text-emerald-700 font-mono">91%</div>
                <div className="text-[9px] text-emerald-700 font-semibold">Excellent</div>
              </div>
            </div>

            {/* 3. KPI Achievement */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-blue-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">KPI Achievement</div>
                <div className="text-sm font-extrabold text-blue-700 font-mono">88%</div>
                <div className="text-[9px] text-blue-700 font-semibold">Very Good</div>
              </div>
            </div>

            {/* 4. Competency Score */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-purple-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Competency Score</div>
                <div className="text-sm font-extrabold text-purple-700 font-mono">4.1 / 5</div>
                <div className="text-[9px] text-purple-700 font-semibold">Good</div>
              </div>
            </div>

            {/* 5. 360° Feedback */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-cyan-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-cyan-100 text-cyan-600">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">360° Feedback</div>
                <div className="text-sm font-extrabold text-cyan-700 font-mono">4.0 / 5</div>
                <div className="text-[9px] text-cyan-700 font-semibold">Good</div>
              </div>
            </div>

            {/* 6. Potential Rating */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-indigo-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <Rocket className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Potential Rating</div>
                <div className="text-sm font-extrabold text-indigo-700">High</div>
                <div className="text-[9px] text-indigo-700 font-semibold">Leadership Path</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "goals", label: "Goals & KPIs", icon: Target },
              { id: "competencies", label: "Competencies", icon: Award },
              { id: "360", label: "360° Feedback", icon: Users },
              { id: "reviews", label: "Reviews", icon: FileText },
              { id: "ratings", label: "Ratings", icon: Star },
              { id: "calibration", label: "Calibration", icon: Scale },
              { id: "development", label: "Development Plan", icon: BrainCircuit },
              { id: "rewards", label: "Rewards", icon: DollarSign },
              { id: "documents", label: "Documents", icon: Paperclip },
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
            {/* Row 1: Performance Summary, Goal Achievement, KPI Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Performance Summary (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Performance Summary</h4>
                </div>

                <div className="h-32 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={RATING_DISTRIBUTION_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={52}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {RATING_DISTRIBUTION_PIE.map((entry, index) => (
                          <Cell key={`rat-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-extrabold text-slate-900 font-mono">4.2</span>
                    <span className="text-[8px] text-muted-foreground">Overall Rating</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {RATING_DISTRIBUTION_PIE.map((r) => (
                    <div key={r.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-slate-600 truncate">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: r.color }} />
                        {r.name}
                      </span>
                      <span className="font-mono font-bold text-slate-800">{r.value}%</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("ratings")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Rating Scale →
                </button>
              </div>

              {/* 2. Goal Achievement (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Goal Achievement</h4>
                  <span className="text-xs font-extrabold text-emerald-700 font-mono">91% Excellent</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  {GOALS_LIST.map((goal) => (
                    <div key={goal.title}>
                      <div className="flex justify-between text-slate-700 mb-0.5">
                        <span className="font-medium">{goal.title}</span>
                        <span className="font-mono font-bold text-slate-900">{goal.achievement}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", goal.color)} style={{ width: `${goal.achievement}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("goals")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View All Goals →
                </button>
              </div>

              {/* 3. KPI Performance (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">KPI Performance</h4>
                  <button onClick={() => setActiveTab("goals")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All KPIs
                  </button>
                </div>

                <div className="space-y-2 text-[10px]">
                  {KPIS_LIST.map((kpi) => (
                    <div key={kpi.name} className="p-1.5 rounded-md bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{kpi.name}</span>
                        <span className="font-mono font-bold text-emerald-700">{kpi.achievement}%</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[9px]">
                        <span>Target: <strong className="text-slate-800">{kpi.target}</strong></span>
                        <span>Actual: <strong className="text-slate-800">{kpi.actual}</strong></span>
                      </div>
                      <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${kpi.achievement}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Competency Assessment, Review Progress, Strengths & Improvement Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Competency Assessment (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Competency Assessment</h4>
                  <button onClick={() => setActiveTab("competencies")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Competency</th>
                        <th className="pb-1 text-center">Exp</th>
                        <th className="pb-1 text-center">Act</th>
                        <th className="pb-1 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {COMPETENCIES_LIST.map((c) => (
                        <tr key={c.name} className="hover:bg-slate-50/60">
                          <td className="py-1.5 font-medium text-slate-900">{c.name}</td>
                          <td className="py-1.5 text-center font-mono text-slate-500">{c.expected}</td>
                          <td className="py-1.5 text-center font-mono font-bold text-slate-800">{c.actual}</td>
                          <td className="py-1.5 text-right font-mono font-bold text-amber-600">{c.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Review Progress (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Review Progress</h4>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Goal Setting
                    </span>
                    <span className="font-mono text-slate-400">Completed on 10 Apr 2023</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Self Review
                    </span>
                    <span className="font-mono text-slate-400">Completed on 15 Mar 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Manager Review
                    </span>
                    <span className="font-mono text-slate-400">Completed on 20 Mar 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-blue-700">
                      <span className="h-3.5 w-3.5 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">4</span>
                      360° Feedback
                    </span>
                    <span className="font-bold text-blue-600">In Progress (Due 25 Mar)</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 rounded-full bg-slate-100 text-slate-500 text-[9px] flex items-center justify-center font-bold">5</span>
                      Calibration
                    </span>
                    <span>Pending (Due 05 Apr)</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 rounded-full bg-slate-100 text-slate-500 text-[9px] flex items-center justify-center font-bold">6</span>
                      Final Rating
                    </span>
                    <span>Pending (Due 10 Apr)</span>
                  </div>
                </div>
              </div>

              {/* 3. Strengths & Improvement Areas (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Strengths & Improvement Areas</h4>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 font-bold text-emerald-800">
                      <ThumbsUp className="h-3 w-3 text-emerald-600" /> Top Strengths
                    </div>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside text-[9px]">
                      <li>Strong technical skills</li>
                      <li>Ownership & accountability</li>
                      <li>Problem solving ability</li>
                      <li>Process improvement mindset</li>
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 font-bold text-amber-800">
                      <ThumbsDown className="h-3 w-3 text-amber-600" /> Areas to Improve
                    </div>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside text-[9px]">
                      <li>Strategic thinking</li>
                      <li>Leadership development</li>
                      <li>Time management</li>
                      <li>Delegation</li>
                    </ul>
                  </div>
                </div>

                <button onClick={() => setActiveTab("development")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Development Plan →
                </button>
              </div>
            </div>

            {/* Row 3: Recent Performance History, Action Items, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Recent Performance History (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent Performance History</h4>
                  <button onClick={() => setActiveTab("history")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Cycle</th>
                        <th className="pb-1">Review Type</th>
                        <th className="pb-1 text-center">Score</th>
                        <th className="pb-1 text-right">Comments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {PERFORMANCE_HISTORY.map((h) => (
                        <tr key={h.cycle} className="hover:bg-slate-50/60">
                          <td className="py-2 font-bold text-slate-900">{h.cycle}</td>
                          <td className="py-2 text-slate-600">{h.type}</td>
                          <td className="py-2 text-center font-mono font-bold text-amber-600">{h.score}</td>
                          <td className="py-2 text-right text-slate-700 truncate max-w-[110px]">{h.comments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Action Items (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Action Items</h4>
                  <button onClick={() => toast.info("Action item management opened")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  {ACTION_ITEMS.map((item) => (
                    <div key={item.action} className="flex items-center justify-between p-1.5 rounded-md bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-900">{item.action}</div>
                        <div className="text-[9px] text-muted-foreground">{item.owner} • Due: {item.dueDate}</div>
                      </div>
                      <span
                        className={cn(
                          "px-1.5 py-0.2 rounded-md font-bold text-[9px]",
                          item.status === "In Progress"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : item.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Quick Actions (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Actions</h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsGoalModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Target className="h-3.5 w-3.5 text-primary" />
                    Update Goals
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsKpiModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
                    Add KPI
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-purple-600 hover:bg-purple-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Users className="h-3.5 w-3.5 text-purple-600" />
                    Request Feedback
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("development")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <BrainCircuit className="h-3.5 w-3.5 text-emerald-600" />
                    Development Plan
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Upload appraisal document dialog")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-amber-600" />
                    Upload Document
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Performance reports preview")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-600" />
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Update Goals */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Add / Update Performance Goal
              </h3>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsGoalModalOpen(false);
                toast.success("Performance goal updated successfully.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen EV Battery Thermal Analysis"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weightage (%)</label>
                  <input
                    type="number"
                    defaultValue={25}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Achievement (%)</label>
                  <input
                    type="number"
                    defaultValue={95}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Request 360 Feedback */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Request 360° Peer Feedback
              </h3>
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsFeedbackModalOpen(false);
                toast.success("360° feedback requests sent to selected peers and managers.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Reviewers *</label>
                <select multiple className="w-full h-24 p-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Arun Kumar (Engineering Manager)</option>
                  <option>Priya Nair (Senior Software Engineer)</option>
                  <option>Karthik Subramanian (Lead Architect)</option>
                  <option>Dr. Arvind Rao (CTO)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold cursor-pointer"
                >
                  Send Requests
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

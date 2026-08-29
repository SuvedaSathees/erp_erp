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

export function PerformanceManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("goals");

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

        {/* 1. Performance Cycle Header & Key Metrics (Clean enterprise layout, no profile photos, no stars) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Cycle Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Performance Cycle</span>
              <div className="font-bold text-slate-900 text-sm truncate">FY 2023-24 Annual</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Review Type</span>
              <div className="font-bold text-slate-900 text-sm truncate">Annual Appraisal</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Review Period</span>
              <div className="font-semibold text-slate-900 text-sm truncate">01 Apr 2023 - 31 Mar 2024</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Lead Evaluator</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Arun Kumar (Lead)</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Due Date</span>
              <div className="font-bold text-rose-600 text-sm truncate">30 Apr 2024</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-0.5">
              <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider">Cycle Status</span>
              <div className="font-bold text-amber-700 text-sm truncate">In Progress</div>
            </div>
          </div>

          {/* 6 Key Performance Metric Badges Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* 1. Overall Rating */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-amber-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Award className="h-4 w-4 text-amber-600" />
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
              { id: "goals", label: "Goals & KPIs", icon: Target },
              { id: "competencies", label: "Competencies", icon: Award },
              { id: "360", label: "360° Feedback", icon: Users },
              { id: "reviews", label: "Reviews & Appraisal", icon: FileText },
              { id: "development", label: "Development Plan", icon: BrainCircuit },
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

        {/* Functional Tab Section */}
        {/* Tab 1: Goals & KPIs */}
        {activeTab === "goals" && (
          <div className="space-y-6">
            {/* Row 1: Performance Summary, Goal Achievement, KPI Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Performance Summary (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Performance Rating Distribution</h4>
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
                    <span className="text-lg font-extrabold text-slate-900 font-mono">4.2 / 5</span>
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
              </div>

              {/* 2. Goal Achievement (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Goal Achievement</h4>
                  <span className="text-xs font-extrabold text-emerald-700 font-mono">91% Overall</span>
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

                <button onClick={() => setIsGoalModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  + Add New Goal
                </button>
              </div>

              {/* 3. KPI Performance (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Key Performance Indicators</h4>
                  <button onClick={() => setIsKpiModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    + Add KPI
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
          </div>
        )}

        {/* Tab 2: Competencies */}
        {activeTab === "competencies" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Role–Competency Proficiency Matrix</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Core calculation: Required Level − Current Level = Competency Gap</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("Competency assessment updated")}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
                >
                  Save Competency Scores
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Competency</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-center">Required Level</th>
                      <th className="py-2.5 px-3 text-center">Current Level</th>
                      <th className="py-2.5 px-3 text-center">Gap</th>
                      <th className="py-2.5 px-3 text-center">Weightage</th>
                      <th className="py-2.5 px-3 text-right">Rating Score</th>
                      <th className="py-2.5 px-3 text-right">Proficiency Band</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "Technical Expertise & Architecture", cat: "Technical", req: 4, cur: 5, gap: 0, weight: "25%", score: "4.8 / 5", band: "Expert", bandColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                      { name: "Problem Solving & Analysis", cat: "Core", req: 4, cur: 4, gap: 0, weight: "20%", score: "4.2 / 5", band: "Advanced", bandColor: "bg-blue-50 text-blue-700 border-blue-200" },
                      { name: "Team Collaboration & Cross-Functional", cat: "Behavioural", req: 4, cur: 4, gap: 0, weight: "15%", score: "4.3 / 5", band: "Advanced", bandColor: "bg-blue-50 text-blue-700 border-blue-200" },
                      { name: "Leadership & Team Mentoring", cat: "Leadership", req: 4, cur: 3, gap: 1, weight: "20%", score: "3.2 / 5", band: "Developing", bandColor: "bg-amber-50 text-amber-700 border-amber-200" },
                      { name: "Strategic Thinking & Planning", cat: "Strategic", req: 4, cur: 3, gap: 1, weight: "20%", score: "3.4 / 5", band: "Developing", bandColor: "bg-amber-50 text-amber-700 border-amber-200" },
                    ].map((c) => (
                      <tr key={c.name} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{c.cat}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{c.req}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">{c.cur}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          <span className={cn(c.gap > 0 ? "text-rose-600 font-extrabold" : "text-emerald-600")}>
                            {c.gap}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-500">{c.weight}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">{c.score}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", c.bandColor)}>
                            {c.band}
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

        {/* Tab 3: 360° Feedback */}
        {activeTab === "360" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Multi-Rater Breakdown */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    360° Multi-Rater Score Breakdown
                  </h4>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Weighted Average: 4.2 / 5
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { role: "Self Assessment", score: "4.3 / 5", weight: "10%", desc: "Accurate self-awareness of technical depth." },
                    { role: "Manager (Arun Kumar)", score: "4.1 / 5", weight: "40%", desc: "Strong technical delivery, high ownership." },
                    { role: "Peers (4 Reviewers)", score: "4.4 / 5", weight: "25%", desc: "Extremely collaborative and helpful." },
                    { role: "Direct Reports (3 Reviewers)", score: "4.2 / 5", weight: "15%", desc: "Approachable, clear architectural guidance." },
                    { role: "Customer / Stakeholder", score: "4.0 / 5", weight: "10%", desc: "Prompt issue resolution and support." },
                  ].map((r) => (
                    <div key={r.role} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{r.role} <span className="text-[10px] text-muted-foreground font-normal">({r.weight})</span></div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{r.desc}</div>
                      </div>
                      <div className="font-mono font-extrabold text-sm text-slate-900">{r.score}</div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="w-full py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-semibold text-xs transition cursor-pointer"
                >
                  + Request More 360° Peer Feedback
                </button>
              </div>

              {/* Qualitative Feedback */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">Key Peer Comments & Feedback</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                      Strengths & Commendations
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      "Sankar is the go-to engineer for complex mechanical FEA simulations. Highly disciplined, meets project milestones ahead of schedule, and fosters great team morale."
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <ThumbsDown className="h-3.5 w-3.5 text-amber-600" />
                      Growth & Improvement Areas
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      "Can delegate routine module designs more aggressively to junior engineers to free up capacity for strategic cross-functional product roadmapping."
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Feedback Status: <strong>Calibrated & Verified</strong></span>
                  <span>Cycle: <strong>FY 2023-24</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews & Appraisal */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Appraisal Workflow Timeline */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">Appraisal Review Lifecycle</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Calibration In Progress
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { step: "1", title: "Goal Setting & KRA Alignment", status: "Completed on 10 Apr 2023", done: true },
                    { step: "2", title: "Self Appraisal & Evidence Submission", status: "Completed on 15 Mar 2024", done: true },
                    { step: "3", title: "Manager Assessment & Evaluation", status: "Completed on 20 Mar 2024", done: true },
                    { step: "4", title: "360° Peer Feedback Synthesis", status: "Completed on 25 Mar 2024", done: true },
                    { step: "5", title: "HR Calibration & Normalization", status: "In Progress (Due 05 Apr 2024)", active: true },
                    { step: "6", title: "Final Scorecard & Sign-off", status: "Pending (Due 10 Apr 2024)", pending: true },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                          s.done ? "bg-emerald-600 text-white" : s.active ? "bg-blue-600 text-white ring-2 ring-blue-100" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {s.done ? "✓" : s.step}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">{s.title}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{s.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Scorecard Synthesis */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">Scorecard Weightage & Synthesis</h4>
                  <span className="font-mono text-sm font-extrabold text-slate-900">Total: 4.2 / 5</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Goals & KPIs (60% Weightage)</span>
                      <span className="font-mono font-bold text-emerald-700">91% (4.5 / 5)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: "91%" }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Competencies & Skills (30% Weightage)</span>
                      <span className="font-mono font-bold text-blue-700">82% (4.1 / 5)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Core Values & Adherence (10% Weightage)</span>
                      <span className="font-mono font-bold text-purple-700">88% (4.4 / 5)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleSubmitForReview}
                    className="w-full py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold text-xs transition cursor-pointer"
                  >
                    Submit for Final Sign-off
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Development Plan */}
        {activeTab === "development" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Individual Development Plan (IDP)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Targeted development programs based on identified competency gaps</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("New development action added to IDP")}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
                >
                  + Add Development Action
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Target Competency</th>
                      <th className="py-2.5 px-3">Development Action Plan</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Assigned Mentor / Coach</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Target Date</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">Progress</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { competency: "Leadership & Team Management", plan: "Advanced Engineering Leadership Executive Program", method: "Training & Workshop", mentor: "Dr. Arvind Rao", target: "30 Sep 2024", progress: 78, status: "In Progress" },
                      { competency: "Strategic Thinking", plan: "Cross-functional Product Roadmap Architecture Workshop", method: "Mentoring", mentor: "Arun Kumar", target: "31 Aug 2024", progress: 60, status: "In Progress" },
                      { competency: "Executive Communication", plan: "Stakeholder Presentation & Negotiation Masterclass", method: "Coaching", mentor: "Priya Nair", target: "30 Jun 2024", progress: 85, status: "In Progress" },
                      { competency: "Engineering Delegation", plan: "Task Delegation & Junior Mentorship Project", method: "On-the-Job", mentor: "Arun Kumar", target: "31 Jul 2024", progress: 40, status: "In Progress" },
                    ].map((d) => (
                      <tr key={d.competency} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{d.competency}</td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{d.plan}</td>
                        <td className="py-3 px-3 text-slate-600">{d.method}</td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{d.mentor}</td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{d.target}</td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center gap-1.5 justify-center">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${d.progress}%` }} />
                            </div>
                            <span className="font-mono font-bold text-blue-700 text-[11px]">{d.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs whitespace-nowrap">
                            {d.status}
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

export default PerformanceManagementPage;

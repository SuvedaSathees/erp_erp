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
  BookOpen,
  ScreenShare,
  Flame,
  ArrowUp,
  Milestone,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/career-development")({
  head: () => ({
    meta: [
      { title: "Career Development · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Career Development Form manages the employee's long-term career progression from current role → career aspiration → target role → competency gap → skill gap → development plan → learning → experience → readiness → succession → promotion → career review → career history.",
      },
    ],
  }),
  component: CareerDevelopmentPage,
});

// --- Data Models ---

const READINESS_BREAKDOWN_PIE = [
  { name: "Performance", value: 90, color: "#10B981" },
  { name: "Competencies", value: 72, color: "#2563EB" },
  { name: "Skills", value: 75, color: "#06B6D4" },
  { name: "Experience", value: 80, color: "#8B5CF6" },
  { name: "Leadership", value: 65, color: "#F59E0B" },
  { name: "Certifications", value: 70, color: "#EC4899" },
];

const SUCCESSOR_PIPELINE_PIE = [
  { name: "Ready Now", value: 1, percentage: "17%", color: "#10B981" },
  { name: "Ready in 1 Year", value: 2, percentage: "33%", color: "#2563EB" },
  { name: "Ready in 2-3 Years", value: 2, percentage: "33%", color: "#F59E0B" },
  { name: "Developing", value: 1, percentage: "17%", color: "#8B5CF6" },
];

const COMPETENCY_GAPS = [
  { name: "Leadership", req: 4, cur: 3, gap: 1, priority: "High" },
  { name: "Strategic Thinking", req: 4, cur: 3, gap: 1, priority: "High" },
  { name: "Communication", req: 4, cur: 3, gap: 1, priority: "Medium" },
  { name: "People Management", req: 4, cur: 3, gap: 1, priority: "Medium" },
  { name: "Financial Acumen", req: 3, cur: 2, gap: 1, priority: "Medium" },
];

const DEVELOPMENT_PLANS = [
  { area: "Leadership", plan: "Leadership Program", target: "30 Sep 2024", progress: 70, status: "In Progress" },
  { area: "Strategic Thinking", plan: "Strategy Workshop", target: "31 Aug 2024", progress: 60, status: "In Progress" },
  { area: "Communication", plan: "Communication Training", target: "30 Jun 2024", progress: 80, status: "In Progress" },
  { area: "Project Management", plan: "PMP Certification", target: "15 Nov 2024", progress: 40, status: "In Progress" },
  { area: "Mentoring", plan: "Monthly Mentoring", target: "Ongoing", progress: 75, status: "In Progress" },
];

const MILESTONES = [
  { title: "Complete Leadership Program", target: "30 Sep 2024", progress: 70, status: "On Track" },
  { title: "Improve Communication Skills", target: "30 Jun 2024", progress: 80, status: "On Track" },
  { title: "Lead Cross-functional Project", target: "31 Jul 2024", progress: 40, status: "On Track" },
  { title: "PMP Certification", target: "15 Nov 2024", progress: 20, status: "On Track" },
  { title: "Ready for Lead Engineer Role", target: "30 Sep 2026", progress: 0, status: "Upcoming" },
];

const CAREER_REVIEWS = [
  { date: "15 Mar 2024", reviewer: "Arun Kumar", readiness: "70%", recommendation: "Continue development plan" },
  { date: "15 Sep 2023", reviewer: "Arun Kumar", readiness: "60%", recommendation: "Focus on leadership skills" },
  { date: "15 Mar 2023", reviewer: "Arun Kumar", readiness: "50%", recommendation: "Build technical depth" },
];

export function CareerDevelopmentPage() {
  const [activeTab, setActiveTab] = useState<string>("path");

  // Modals
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isAspirationModalOpen, setIsAspirationModalOpen] = useState(false);

  const handleSubmitForReview = () => {
    toast.success("Career Development Plan submitted for review", {
      description: "CDP-2024-00025 forwarded to Reporting Manager & HR Leadership.",
    });
  };

  return (
    <AppShell
      title="Career Development"
      breadcrumb="Management > HRM Management > Career Development"
      description="The Career Development Form manages the employee's long-term career progression from current role → career aspiration → target role → competency gap → skill gap → development plan → learning → experience → readiness → succession → promotion → career review → career history."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Career Development Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Career Plan
              </button>
              <button
                type="button"
                onClick={() => toast.info("Importing career plan history...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                Import Data
              </button>
              <button
                type="button"
                onClick={() => toast.success("Career roadmap exported")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More career options opened")}
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

        {/* 1. Career Development Plan Header (Clean enterprise layout, no profile photos, no stars) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Quick Career Plan Meta Fields Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Plan Number</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">CDP-2024-00025</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Career Path</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Engineering Leadership</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Current Role</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Sr. Mechanical Engineer</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Target Role</span>
              <div className="font-bold text-primary text-sm truncate">Lead Engineer</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Target Date</span>
              <div className="font-mono font-semibold text-slate-900 text-sm truncate">30 Sep 2026</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-0.5">
              <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Plan Mentor</span>
              <div className="font-semibold text-emerald-800 text-sm truncate">Arun Kumar (Manager)</div>
            </div>
          </div>

          {/* 6 Key Career Metric Badges Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* 1. Overall Readiness */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-emerald-50/40 flex items-center gap-3 shadow-2xs">
              <div className="h-10 w-10 relative shrink-0 flex items-center justify-center">
                <svg className="h-10 w-10" viewBox="0 0 36 36">
                  <path className="text-slate-200" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-600" strokeDasharray="78, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute font-mono text-[10px] font-extrabold text-slate-900 tracking-tight">78%</span>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Overall Readiness</div>
                <div className="text-xs font-extrabold text-emerald-700">Developing</div>
              </div>
            </div>

            {/* 2. Career Progress */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-amber-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Career Progress</div>
                <div className="text-sm font-extrabold text-slate-900 font-mono">72%</div>
                <div className="text-[9px] text-amber-700 font-semibold">On Track</div>
              </div>
            </div>

            {/* 3. Development Progress */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-blue-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Development Progress</div>
                <div className="text-sm font-extrabold text-blue-700 font-mono">81%</div>
                <div className="text-[9px] text-blue-700 font-semibold">Good</div>
              </div>
            </div>

            {/* 4. Critical Gaps */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-rose-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Critical Gaps</div>
                <div className="text-sm font-extrabold text-rose-700 font-mono">2</div>
                <div className="text-[9px] text-rose-700 font-semibold">Action Required</div>
              </div>
            </div>

            {/* 5. Next Review Date */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-purple-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Next Review Date</div>
                <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">30 Jun 2024</div>
              </div>
            </div>

            {/* 6. Status */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-slate-200 text-slate-700">
                <CheckCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Plan Status</div>
                <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (3 Core Tabs) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "path", label: "Career Path & Ladders", icon: GitCommitIcon },
              { id: "gap", label: "Competency Gap & Skills", icon: Compass },
              { id: "development", label: "Development Action Plan", icon: BrainCircuit },
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

        {/* TAB 1: CAREER PATH & LADDERS (Full Overview Dashboard) */}
        {activeTab === "path" && (
          <div className="space-y-6">
            {/* Row 1: Career Path Progress, Readiness Breakdown, Top Strengths, Top Development Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Career Path Progress (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Career Path Progress</h4>
                  <span className="text-xs font-extrabold text-emerald-700 font-mono">72% On Track</span>
                </div>

                {/* 5-Step Career Path Diagram */}
                <div className="py-2 px-1">
                  <div className="relative flex items-start justify-between">
                    {/* Progress Connecting Line centered at 12px circle center */}
                    <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 z-0" />
                    <div className="absolute top-3 left-4 w-1/2 h-0.5 bg-emerald-600 z-0" />

                    {[
                      { step: "1", title: "Engineer", date: "Jun 2020", done: true },
                      { step: "2", title: "Sr. Eng.", date: "Jun 2022", done: true },
                      { step: "3", title: "Lead Eng.", date: "Sep 2026", active: true },
                      { step: "4", title: "Manager", date: "Future", future: true },
                      { step: "5", title: "Head", date: "Future", future: true },
                    ].map((s) => (
                      <div key={s.step} className="flex flex-col items-center relative z-10 w-11 text-center">
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all",
                            s.done
                              ? "bg-emerald-600 text-white"
                              : s.active
                                ? "bg-blue-600 text-white ring-3 ring-blue-100"
                                : "bg-white border border-slate-300 text-slate-400",
                          )}
                        >
                          {s.done ? "✓" : s.step}
                        </div>
                        <div className="text-[9px] font-bold text-slate-800 mt-1 leading-tight truncate w-full" title={s.title}>
                          {s.title}
                        </div>
                        {s.date && <div className="text-[8px] text-slate-400 font-mono mt-0.5 leading-none">{s.date}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-600 rounded-full w-[72%]" />
                </div>
              </div>

              {/* 2. Readiness Breakdown (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Readiness Breakdown</h4>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="h-24 w-24 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={READINESS_BREAKDOWN_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={24}
                          outerRadius={38}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {READINESS_BREAKDOWN_PIE.map((entry, index) => (
                            <Cell key={`read-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">78%</span>
                      <span className="text-[6px] text-muted-foreground">Overall</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[9px] flex-1">
                    {READINESS_BREAKDOWN_PIE.map((r) => (
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
              </div>

              {/* 3. Top Strengths (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Top Strengths
                  </h4>
                </div>

                <div className="space-y-1 text-[10px]">
                  {[
                    { name: "Technical Expertise", score: "4.5 / 5" },
                    { name: "Problem Solving", score: "4.2 / 5" },
                    { name: "Project Execution", score: "4.1 / 5" },
                    { name: "Quality Orientation", score: "4.0 / 5" },
                    { name: "Ownership", score: "4.0 / 5" },
                  ].map((s) => (
                    <div key={s.name} className="flex justify-between items-center text-slate-700">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[90px]">{s.name}</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-700">{s.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Top Development Areas (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1">
                    <ArrowUp className="h-3.5 w-3.5 text-rose-600" /> Top Dev Areas
                  </h4>
                </div>

                <div className="space-y-1 text-[10px]">
                  {[
                    { name: "Leadership", score: "3.0 / 5" },
                    { name: "Strategic Thinking", score: "3.1 / 5" },
                    { name: "Communication", score: "3.2 / 5" },
                  ].map((s) => (
                    <div key={s.name} className="flex justify-between items-center text-slate-700">
                      <span className="flex items-center gap-1">
                        <span className="h-3 w-3 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[8px] font-bold">↑</span>
                        <span className="truncate max-w-[90px]">{s.name}</span>
                      </span>
                      <span className="font-mono font-bold text-rose-700">{s.score}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("gap")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 border-t border-slate-100">
                  View All Gaps →
                </button>
              </div>
            </div>

            {/* Row 2: Competency Gap Summary, Development Plan Overview, Milestone Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 1. Competency Gap Summary (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Competency Gap Summary</h4>
                  <button onClick={() => setActiveTab("gap")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Details →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Competency</th>
                        <th className="pb-1 text-center">Req</th>
                        <th className="pb-1 text-center">Cur</th>
                        <th className="pb-1 text-center">Gap</th>
                        <th className="pb-1 text-right">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {COMPETENCY_GAPS.map((g) => (
                        <tr key={g.name} className="hover:bg-slate-50/60">
                          <td className="py-2 font-medium text-slate-900">{g.name}</td>
                          <td className="py-2 text-center font-mono text-slate-500">{g.req}</td>
                          <td className="py-2 text-center font-mono font-bold text-slate-800">{g.cur}</td>
                          <td className="py-2 text-center font-mono font-bold text-rose-600">{g.gap}</td>
                          <td className="py-2 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded-md font-bold text-[9px]",
                                g.priority === "High"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200",
                              )}
                            >
                              {g.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Development Plan Overview (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Development Plan Overview</h4>
                  <button onClick={() => setActiveTab("development")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Plan →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Area</th>
                        <th className="pb-1">Action Plan</th>
                        <th className="pb-1">Target</th>
                        <th className="pb-1 text-center">Progress</th>
                        <th className="pb-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {DEVELOPMENT_PLANS.map((d) => (
                        <tr key={d.plan} className="hover:bg-slate-50/60">
                          <td className="py-1.5 font-bold text-slate-900">{d.area}</td>
                          <td className="py-1.5 text-slate-600">{d.plan}</td>
                          <td className="py-1.5 text-slate-500 font-mono text-[9px]">{d.target}</td>
                          <td className="py-1.5 text-center font-mono font-bold text-blue-700">{d.progress}%</td>
                          <td className="py-1.5 text-right">
                            <span className="px-1.5 py-0.2 rounded-md font-bold text-[8px] bg-blue-50 text-blue-700 border border-blue-200">
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Milestone Tracker (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Milestone Tracker</h4>
                  <button onClick={() => setIsMilestoneModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    + Add Milestone
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Milestone</th>
                        <th className="pb-1">Target</th>
                        <th className="pb-1 text-center">Progress</th>
                        <th className="pb-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MILESTONES.map((m) => (
                        <tr key={m.title} className="hover:bg-slate-50/60">
                          <td className="py-1.5 font-medium text-slate-900">{m.title}</td>
                          <td className="py-1.5 text-slate-500 font-mono text-[9px]">{m.target}</td>
                          <td className="py-1.5 text-center font-mono font-bold text-emerald-700">
                            {m.progress > 0 ? `${m.progress}%` : "-"}
                          </td>
                          <td className="py-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded-md font-bold text-[8px]",
                                m.status === "On Track"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600",
                              )}
                            >
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Row 3: Career Aspirations, Recent Career Reviews, Successor Pipeline, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Career Aspirations (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Career Aspirations</h4>
                  <button onClick={() => setIsAspirationModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    Edit
                  </button>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div>
                    <div className="text-muted-foreground font-semibold">Short-Term (1-2 Yrs)</div>
                    <div className="font-bold text-slate-900 mt-0.5">Lead Engineer (Mechanical Systems)</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-semibold">Medium-Term (3-5 Yrs)</div>
                    <div className="font-semibold text-slate-800 mt-0.5">Engineering Manager - R&D</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-semibold">Long-Term (5+ Yrs)</div>
                    <div className="font-semibold text-slate-800 mt-0.5">VP - Engineering / Chief Engineer</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-500">
                  Preferred Track: <span className="font-semibold text-slate-700">Technical Leadership</span>
                </div>
              </div>

              {/* 2. Recent Career Reviews (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent Career Reviews</h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  {CAREER_REVIEWS.map((r) => (
                    <div key={r.date} className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-900">{r.date}</span>
                        <span className="font-mono text-emerald-700">{r.readiness}</span>
                      </div>
                      <div className="text-slate-600 text-[9px]">{r.recommendation}</div>
                      <div className="text-[8px] text-slate-400">By: {r.reviewer}</div>
                    </div>
                  ))}
                </div>

                <button onClick={() => toast.info("Full review history")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer text-center pt-1 border-t border-slate-100">
                  View Review History →
                </button>
              </div>

              {/* 3. Successor Pipeline (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Successor Pipeline</h4>
                  <span className="font-mono text-xs font-bold text-emerald-700">6 Successors</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="h-20 w-20 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={SUCCESSOR_PIPELINE_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={30}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {SUCCESSOR_PIPELINE_PIE.map((entry, index) => (
                            <Cell key={`succ-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-extrabold text-slate-900 font-mono">6</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[9px] flex-1">
                    {SUCCESSOR_PIPELINE_PIE.map((s) => (
                      <div key={s.name} className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-600 truncate">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                          {s.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => toast.info("Succession planning dashboard")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Succession Planning →
                </button>
              </div>

              {/* 4. Quick Actions (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Actions</h4>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsAspirationModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Target className="h-3 w-3 text-primary" />
                    Update Aspiration
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPlanModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <BrainCircuit className="h-3 w-3 text-blue-600" />
                    Add Plan
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("gap")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-purple-600 hover:bg-purple-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Compass className="h-3 w-3 text-purple-600" />
                    Gap Analysis
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("development")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Award className="h-3 w-3 text-emerald-600" />
                    Action Plan
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Mentoring session requested")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Users className="h-3 w-3 text-amber-600" />
                    Request Mentoring
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMilestoneModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Milestone className="h-3 w-3 text-indigo-600" />
                    Add Milestone
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Upload career documents dialog")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-cyan-600 hover:bg-cyan-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Paperclip className="h-3 w-3 text-cyan-600" />
                    Upload Document
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Career progression report generated")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-rose-600 hover:bg-rose-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-rose-600" />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPETENCY GAP & SKILLS */}
        {activeTab === "gap" && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Target Role Competency Gap & Skills Matrix</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Current Role: Senior Mechanical Engineer → Target Role: Lead Mechanical Engineer
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
              >
                + Bridge Gap Action
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                    <th className="py-2.5 px-3">Competency & Skill Area</th>
                    <th className="py-2.5 px-3 text-center">Required Level (1-5)</th>
                    <th className="py-2.5 px-3 text-center">Current Level (1-5)</th>
                    <th className="py-2.5 px-3 text-center">Gap Score</th>
                    <th className="py-2.5 px-3 text-center">Priority</th>
                    <th className="py-2.5 px-3 text-right">Recommended Development Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COMPETENCY_GAPS.map((g) => (
                    <tr key={g.name} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-bold text-slate-900">{g.name}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600">{g.req} / 5</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">{g.cur} / 5</td>
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        <span className={cn(g.gap > 0 ? "text-rose-600" : "text-emerald-600")}>
                          {g.gap > 0 ? `-${g.gap}` : "0 (Proficient)"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            g.priority === "High"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200",
                          )}
                        >
                          {g.priority} Priority
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-700 font-medium">
                        {g.priority === "High" ? "Executive Mentoring & Workshop" : "Cross-Functional Project"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DEVELOPMENT ACTION PLAN */}
        {activeTab === "development" && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Individual Career Development Plan (IDP)</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Target milestones, executive coaching, and stretch assignments for Lead Engineer transition.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Development Action
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                    <th className="py-2.5 px-3">Development Area</th>
                    <th className="py-2.5 px-3">Intervention & Action Plan</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Target Date</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Progress %</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DEVELOPMENT_PLANS.map((d) => (
                    <tr key={d.plan} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-bold text-slate-900">{d.area}</td>
                      <td className="py-3 px-3 text-slate-700">{d.plan}</td>
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{d.target}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-blue-700 whitespace-nowrap">{d.progress}%</td>
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
        )}
      </div>

      {/* Modal: New Career Plan */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create New Career Development Plan
              </h3>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsPlanModalOpen(false);
                toast.success("Career Development Plan created successfully.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Career Path *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Engineering Leadership Path</option>
                  <option>Technical Specialist / Architect Path</option>
                  <option>Product Management Path</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Role</label>
                  <input
                    type="text"
                    disabled
                    value="Senior Mechanical Engineer"
                    className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Role</label>
                  <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                    <option>Lead Mechanical Engineer</option>
                    <option>Engineering Manager</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Milestone */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Milestone className="h-4 w-4 text-indigo-600" />
                Add Career Milestone
              </h3>
              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsMilestoneModalOpen(false);
                toast.success("Career milestone added.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Cross-Functional Electric Vehicle Battery Pack"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Date *</label>
                <input
                  type="date"
                  required
                  defaultValue="2024-11-30"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Aspiration */}
      {isAspirationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                Update Career Aspirations
              </h3>
              <button
                type="button"
                onClick={() => setIsAspirationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAspirationModalOpen(false);
                toast.success("Career aspirations updated.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Term Goal (1-2 Years)</label>
                <input
                  type="text"
                  defaultValue="Lead a critical project and develop leadership skills"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medium Term Goal (2-4 Years)</label>
                <input
                  type="text"
                  defaultValue="Become a Technical Lead and manage small teams"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Long Term Goal (5+ Years)</label>
                <input
                  type="text"
                  defaultValue="Grow into Engineering Manager role"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAspirationModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold cursor-pointer"
                >
                  Update Aspirations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function GitCommitIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <line x1="3" x2="9" y1="12" y2="12" />
      <line x1="15" x2="21" y1="12" y2="12" />
    </svg>
  );
}

export default CareerDevelopmentPage;

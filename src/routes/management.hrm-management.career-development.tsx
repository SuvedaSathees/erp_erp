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

export default function CareerDevelopmentPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

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

        {/* 1. Employee Header & 6 Key Career Metrics (Exact match to reference screenshot) */}
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

            {/* Quick Career Plan Meta Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs divide-x divide-slate-100">
              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Career Plan Number</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">CDP-2024-00025</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Career Path</span>
                <div className="font-bold text-slate-900 mt-0.5">Engineering Leadership</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Current Role</span>
                <div className="font-bold text-slate-900 mt-0.5">Senior Mechanical Engineer</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Target Role</span>
                <div className="font-bold text-primary mt-0.5">Lead Mechanical Engineer</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Target Date</span>
                <div className="font-bold text-slate-900 mt-0.5">30 Sep 2026</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Plan Owner</span>
                <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80" alt="manager" className="h-4 w-4 rounded-full" />
                  <div>
                    <div>Arun Kumar</div>
                    <div className="text-[9px] text-muted-foreground font-normal">Engineering Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Key Career Metric Badges Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* 1. Overall Readiness */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-emerald-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="h-9 w-9 relative shrink-0 flex items-center justify-center">
                <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-600" strokeDasharray="78, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute font-mono text-[9px] font-bold text-slate-800">78%</span>
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

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "path", label: "Career Path", icon: GitCommitIcon },
              { id: "gap", label: "Competency Gap", icon: Compass },
              { id: "development", label: "Development Plan", icon: BrainCircuit },
              { id: "milestones", label: "Milestones", icon: Milestone },
              { id: "readiness", label: "Readiness", icon: Award },
              { id: "reviews", label: "Reviews", icon: FileText },
              { id: "mentoring", label: "Mentoring", icon: Users },
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
            {/* Row 1: Career Path Progress, Readiness Breakdown, Top Strengths, Top Development Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Career Path Progress (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Career Path Progress</h4>
                  <span className="text-xs font-extrabold text-emerald-700 font-mono">72% On Track</span>
                </div>

                {/* 5-Step Career Path Diagram */}
                <div className="py-2">
                  <div className="flex items-center justify-between relative">
                    {/* Progress Connecting Line */}
                    <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                    <div className="absolute top-1/2 left-4 w-1/2 -translate-y-1/2 h-0.5 bg-emerald-600 z-0" />

                    {[
                      { step: "1", title: "Engineer", date: "Jun 2020", done: true },
                      { step: "2", title: "Senior Engineer", date: "Jun 2022", done: true },
                      { step: "3", title: "Lead Engineer", date: "Target: Sep 2026", active: true },
                      { step: "4", title: "Engineering Manager", date: "", future: true },
                      { step: "5", title: "Head of Engineering", date: "", future: true },
                    ].map((s) => (
                      <div key={s.step} className="flex flex-col items-center relative z-10">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs",
                            s.done
                              ? "bg-emerald-600 text-white"
                              : s.active
                                ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                : "bg-white border-2 border-slate-300 text-slate-400",
                          )}
                        >
                          {s.done ? "✓" : s.step}
                        </div>
                        <div className="text-[9px] font-bold text-slate-900 mt-1 text-center truncate max-w-[65px]">
                          {s.title}
                        </div>
                        {s.date && <div className="text-[8px] text-muted-foreground text-center">{s.date}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full w-[72%]" />
                </div>
              </div>

              {/* 2. Readiness Breakdown (3.5 Cols) */}
              <div className="lg:col-span-3.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Readiness Breakdown</h4>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="h-28 w-28 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={READINESS_BREAKDOWN_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={44}
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
                      <span className="text-sm font-extrabold text-slate-900 font-mono">78%</span>
                      <span className="text-[7px] text-muted-foreground">Overall</span>
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

              {/* 3. Top Strengths (2.25 Cols) */}
              <div className="lg:col-span-2.25 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Top Strengths
                  </h4>
                </div>

                <div className="space-y-1.5 text-[10px]">
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

              {/* 4. Top Development Areas (2.25 Cols) */}
              <div className="lg:col-span-2.25 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1">
                    <ArrowUp className="h-3.5 w-3.5 text-rose-600" /> Top Dev Areas
                  </h4>
                </div>

                <div className="space-y-1.5 text-[10px]">
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
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Competency Gap Summary</h4>
                  <button onClick={() => setActiveTab("gap")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Competency Gaps →
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
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Development Plan Overview</h4>
                  <button onClick={() => setActiveTab("development")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Full Development Plan →
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
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Milestone Tracker</h4>
                  <button onClick={() => setActiveTab("milestones")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Milestones →
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
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Career Aspirations</h4>
                  <button onClick={() => setIsAspirationModalOpen(true)} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    Edit
                  </button>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div>
                    <div className="font-bold text-blue-700">Short Term (1-2 Years)</div>
                    <div className="text-slate-600">Lead a critical project and develop leadership skills</div>
                  </div>

                  <div>
                    <div className="font-bold text-indigo-700">Medium Term (2-4 Years)</div>
                    <div className="text-slate-600">Become a Technical Lead and manage small teams</div>
                  </div>

                  <div>
                    <div className="font-bold text-purple-700">Long Term (5+ Years)</div>
                    <div className="text-slate-600">Grow into Engineering Manager role</div>
                  </div>
                </div>
              </div>

              {/* 2. Recent Career Reviews (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent Career Reviews</h4>
                  <button onClick={() => setActiveTab("reviews")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Reviews →
                  </button>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  {CAREER_REVIEWS.map((rev) => (
                    <div key={rev.date} className="p-1.5 rounded-md bg-slate-50 border border-slate-100">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{rev.date}</span>
                        <span className="font-mono text-emerald-700">Readiness: {rev.readiness}</span>
                      </div>
                      <div className="text-slate-500 text-[9px]">Reviewer: {rev.reviewer}</div>
                      <div className="text-slate-600 italic text-[9px] mt-0.5">"{rev.recommendation}"</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Successor Pipeline (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Successor Pipeline (for Target Role)</h4>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="h-24 w-24 relative shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={SUCCESSOR_PIPELINE_PIE}
                          cx="50%"
                          cy="50%"
                          innerRadius={24}
                          outerRadius={38}
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
                      <span className="text-xs font-extrabold text-slate-900 font-mono">6</span>
                      <span className="text-[6px] text-muted-foreground">Successors</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[9px] flex-1">
                    {SUCCESSOR_PIPELINE_PIE.map((s) => (
                      <div key={s.name} className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-600 truncate">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                          {s.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{s.value} ({s.percentage})</span>
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
                    onClick={() => setActiveTab("readiness")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Award className="h-3 w-3 text-emerald-600" />
                    Readiness
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

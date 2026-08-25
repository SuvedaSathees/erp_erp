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
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/performance-management/competency-form")({
  head: () => ({
    meta: [
      { title: "Competency Form · Performance Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Competency Form manages the employee competency lifecycle from competency definition → role mapping → expected proficiency → assessment → competency gap → development action → reassessment → competency analytics.",
      },
    ],
  }),
  component: CompetencyFormPage,
});

// --- Data Models ---

const COMPETENCY_SUMMARY_PIE = [
  { name: "Expert (5)", value: 15, color: "#10B981" },
  { name: "Advanced (4)", value: 35, color: "#2563EB" },
  { name: "Proficient (3)", value: 33, color: "#F59E0B" },
  { name: "Developing (2)", value: 12, color: "#FB923C" },
  { name: "Beginner (1)", value: 5, color: "#EF4444" },
];

const CATEGORY_SCORES = [
  { name: "Technical", score: 4.3, color: "bg-blue-600" },
  { name: "Problem Solving", score: 4.2, color: "bg-blue-600" },
  { name: "Functional", score: 4.0, color: "bg-emerald-600" },
  { name: "Communication", score: 3.6, color: "bg-amber-500" },
  { name: "Leadership", score: 3.2, color: "bg-orange-500" },
  { name: "Innovation", score: 4.1, color: "bg-blue-600" },
];

const ASSESSMENT_DETAILS = [
  { name: "Technical Expertise", req: 4, cur: 5, gap: 0, score: "92%", weight: "15%", rating: 5 },
  { name: "Problem Solving", req: 4, cur: 4, gap: 0, score: "88%", weight: "15%", rating: 4 },
  { name: "Functional Knowledge", req: 4, cur: 4, gap: 0, score: "85%", weight: "15%", rating: 4 },
  { name: "Communication", req: 4, cur: 3, gap: 1, score: "72%", weight: "10%", rating: 3 },
  { name: "Leadership", req: 4, cur: 3, gap: 1, score: "65%", weight: "15%", rating: 3 },
  { name: "Innovation", req: 4, cur: 4, gap: 0, score: "84%", weight: "10%", rating: 4 },
  { name: "Collaboration", req: 4, cur: 4, gap: 0, score: "85%", weight: "10%", rating: 4 },
  { name: "Strategic Thinking", req: 4, cur: 3, gap: 1, score: "66%", weight: "10%", rating: 3 },
];

const GAP_ANALYSIS = [
  { competency: "Leadership", gap: 1.0, priority: "High" },
  { competency: "Strategic Thinking", gap: 1.0, priority: "High" },
  { competency: "Communication", gap: 1.0, priority: "Medium" },
  { competency: "Delegation", gap: 0.5, priority: "Medium" },
  { competency: "Innovation", gap: 0.5, priority: "Medium" },
];

const DEVELOPMENT_PLANS = [
  { competency: "Leadership", plan: "Leadership Program", target: "30 Sep 2024", progress: 78, status: "In Progress" },
  { competency: "Strategic Thinking", plan: "Strategy Workshop", target: "31 Aug 2024", progress: 60, status: "In Progress" },
  { competency: "Communication", plan: "Communication Training", target: "30 Jun 2024", progress: 80, status: "In Progress" },
  { competency: "Delegation", plan: "Coaching Sessions", target: "31 Jul 2024", progress: 40, status: "In Progress" },
  { competency: "Innovation", plan: "Innovation Bootcamp", target: "31 Aug 2024", progress: 75, status: "In Progress" },
];

const COMPETENCY_HISTORY = [
  { date: "14 May 2024", type: "Annual Assessment", rating: "4.1 / 5", score: "82%", assessor: "Arun Kumar", comments: "Good improvement in technical skills and problem solving." },
  { date: "20 Dec 2023", type: "Quarterly Assessment", rating: "3.9 / 5", score: "78%", assessor: "Arun Kumar", comments: "Steady performance, focus on leadership enhancement." },
  { date: "15 Sep 2023", type: "Mid-Year Review", rating: "3.6 / 5", score: "72%", assessor: "Arun Kumar", comments: "Improvement needed in communication and leadership." },
  { date: "15 Jun 2023", type: "Initial Assessment", rating: "3.2 / 5", score: "64%", assessor: "Arun Kumar", comments: "Solid technical knowledge, leadership development required." },
];

export default function CompetencyFormPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Modals
  const [isNewAssessmentModalOpen, setIsNewAssessmentModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isDevPlanModalOpen, setIsDevPlanModalOpen] = useState(false);

  const handleSubmitForReview = () => {
    toast.success("Competency Assessment submitted for review", {
      description: "CA-2024-00025 forwarded to Reporting Manager and HR Calibration.",
    });
  };

  return (
    <AppShell
      title="Competency Form"
      breadcrumb="Management > HRM Management > Performance Management > Competency Form"
      description="The Competency Form manages the employee competency lifecycle from competency definition → role mapping → expected proficiency → assessment → competency gap → development action → reassessment → competency analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Competency Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsNewAssessmentModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Assessment
              </button>
              <button
                type="button"
                onClick={() => toast.info("Importing competency records...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                Import Data
              </button>
              <button
                type="button"
                onClick={() => toast.success("Competency scorecard exported")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More competency tools opened")}
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

        {/* 1. Employee Header & 6 Key Competency Metric Badges (Exact match to reference screenshot) */}
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

            {/* Quick Assessment Meta Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs divide-x divide-slate-100">
              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Assessment Number</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">CA-2024-00025</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Performance Cycle</span>
                <div className="font-bold text-slate-900 mt-0.5">FY 2023-24 Annual</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Assessment Type</span>
                <div className="font-bold text-slate-900 mt-0.5">Annual Assessment</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Assessment Period</span>
                <div className="font-bold text-slate-900 mt-0.5">01 Apr 2023 - 31 Mar 2024</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Assessed By</span>
                <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80" alt="manager" className="h-4 w-4 rounded-full" />
                  <div>
                    <div>Arun Kumar</div>
                    <div className="text-[9px] text-muted-foreground font-normal">Engineering Manager</div>
                  </div>
                </div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground">Assessment Date</span>
                <div className="font-bold text-slate-900 mt-0.5">14 May 2024</div>
              </div>
            </div>
          </div>

          {/* 6 Key Competency Metric Badges Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* 1. Overall Competency Rating */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-amber-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Overall Competency Rating</div>
                <div className="text-sm font-extrabold text-slate-900 font-mono">4.1 / 5</div>
                <div className="text-[9px] text-amber-700 font-semibold">Very Good</div>
              </div>
            </div>

            {/* 2. Overall Score */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-emerald-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Overall Score</div>
                <div className="text-sm font-extrabold text-emerald-700 font-mono">82%</div>
              </div>
            </div>

            {/* 3. Competency Gap */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-purple-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Competency Gap</div>
                <div className="text-sm font-extrabold text-purple-700 font-mono">0.9</div>
                <div className="text-[9px] text-purple-700 font-semibold">Moderate</div>
              </div>
            </div>

            {/* 4. Development Required */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-emerald-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Development Required</div>
                <div className="text-sm font-extrabold text-emerald-700">Yes</div>
              </div>
            </div>

            {/* 5. Critical Gaps */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-rose-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Critical Gaps</div>
                <div className="text-sm font-extrabold text-rose-700 font-mono">2</div>
              </div>
            </div>

            {/* 6. Total Competencies */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-blue-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Competencies</div>
                <div className="text-sm font-extrabold text-slate-900 font-mono">12</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar (Matching screenshot) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "assessment", label: "Competency Assessment", icon: Award },
              { id: "evidence", label: "Evidence", icon: Paperclip },
              { id: "gap", label: "Competency Gap", icon: Compass },
              { id: "development", label: "Development Plan", icon: BrainCircuit },
              { id: "feedback", label: "Feedback", icon: MessageSquare },
              { id: "history", label: "History", icon: Activity },
              { id: "documents", label: "Documents", icon: FileText },
              { id: "calibration", label: "Calibration", icon: Scale },
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
            {/* Row 1: Competency Summary, Competency Category Scores, Top Strengths, Top Improvement Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Competency Summary (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Competency Summary</h4>
                </div>

                <div className="h-32 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={COMPETENCY_SUMMARY_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={52}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {COMPETENCY_SUMMARY_PIE.map((entry, index) => (
                          <Cell key={`comppie-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-base font-extrabold text-slate-900 font-mono">4.1 / 5</span>
                    <span className="text-[8px] text-muted-foreground">Overall Rating</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {COMPETENCY_SUMMARY_PIE.map((r) => (
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

              {/* 2. Competency Category Scores (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Competency Category Scores</h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  {CATEGORY_SCORES.map((cat) => (
                    <div key={cat.name} className="space-y-0.5">
                      <div className="flex justify-between text-slate-700">
                        <span className="font-medium">{cat.name}</span>
                        <span className="font-mono font-bold text-slate-900">{cat.score}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${(cat.score / 5) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-100 font-mono">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                </div>
              </div>

              {/* 3. Top Strengths (2.5 Cols) */}
              <div className="lg:col-span-2.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Top Strengths
                  </h4>
                </div>

                <div className="space-y-2 text-[11px]">
                  {[
                    "Technical Expertise",
                    "Problem Solving",
                    "Quality Orientation",
                    "Ownership",
                    "Process Improvement",
                  ].map((s) => (
                    <div key={s} className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("assessment")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 border-t border-slate-100">
                  View All Strengths →
                </button>
              </div>

              {/* 4. Top Improvement Areas (2.5 Cols) */}
              <div className="lg:col-span-2.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1">
                    <ArrowUp className="h-3.5 w-3.5 text-rose-600" /> Top Improvement Areas
                  </h4>
                </div>

                <div className="space-y-2 text-[11px]">
                  {[
                    "Leadership",
                    "Strategic Thinking",
                    "Communication",
                    "Delegation",
                    "Innovation",
                  ].map((s) => (
                    <div key={s} className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <span className="h-3.5 w-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[9px] font-bold shrink-0">↑</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("gap")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 border-t border-slate-100">
                  View All Improvement Areas →
                </button>
              </div>
            </div>

            {/* Row 2: Competency Assessment Details, Competency Gap Analysis, Development Plan Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 1. Competency Assessment Details (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Competency Assessment Details</h4>
                  <button onClick={() => setActiveTab("assessment")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Full Assessment →
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
                        <th className="pb-1 text-center">Score</th>
                        <th className="pb-1 text-center">Weight</th>
                        <th className="pb-1 text-right">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ASSESSMENT_DETAILS.map((row) => (
                        <tr key={row.name} className="hover:bg-slate-50/60">
                          <td className="py-1.5 font-medium text-slate-900">{row.name}</td>
                          <td className="py-1.5 text-center font-mono text-slate-500">{row.req}</td>
                          <td className="py-1.5 text-center font-mono font-bold text-slate-800">{row.cur}</td>
                          <td className="py-1.5 text-center font-mono font-bold">
                            <span className={cn(row.gap > 0 ? "text-rose-600 font-bold" : "text-emerald-600")}>
                              {row.gap}
                            </span>
                          </td>
                          <td className="py-1.5 text-center font-mono">{row.score}</td>
                          <td className="py-1.5 text-center font-mono text-slate-400">{row.weight}</td>
                          <td className="py-1.5 text-right font-mono font-bold text-amber-500">
                            {"★".repeat(row.rating)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Competency Gap Analysis (3.5 Cols) */}
              <div className="lg:col-span-3.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Competency Gap Analysis</h4>
                  <button onClick={() => setActiveTab("gap")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Gaps →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Competency</th>
                        <th className="pb-1 text-center">Gap Level</th>
                        <th className="pb-1 text-center">Priority</th>
                        <th className="pb-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {GAP_ANALYSIS.map((g) => (
                        <tr key={g.competency} className="hover:bg-slate-50/60">
                          <td className="py-2 font-bold text-slate-900">{g.competency}</td>
                          <td className="py-2 text-center font-mono font-bold text-rose-600">{g.gap}</td>
                          <td className="py-2 text-center">
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
                          <td className="py-2 text-right">
                            <button
                              onClick={() => setActiveTab("development")}
                              className="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                            >
                              View Plan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Development Plan Overview (3.5 Cols) */}
              <div className="lg:col-span-3.5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Development Plan Overview</h4>
                  <button onClick={() => setActiveTab("development")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Development Plan →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Competency</th>
                        <th className="pb-1">Action Plan</th>
                        <th className="pb-1">Target Date</th>
                        <th className="pb-1 text-center">Progress</th>
                        <th className="pb-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {DEVELOPMENT_PLANS.map((d) => (
                        <tr key={d.competency} className="hover:bg-slate-50/60">
                          <td className="py-1.5 font-bold text-slate-900">{d.competency}</td>
                          <td className="py-1.5 text-slate-600">{d.plan}</td>
                          <td className="py-1.5 text-slate-500 font-mono">{d.target}</td>
                          <td className="py-1.5 text-center font-mono font-bold text-blue-700">{d.progress}%</td>
                          <td className="py-1.5 text-right">
                            <span className="px-1.5 py-0.2 rounded-md font-bold text-[9px] bg-blue-50 text-blue-700 border border-blue-200">
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

            {/* Row 3: Competency History & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 1. Competency History (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Competency History</h4>
                  <button onClick={() => setActiveTab("history")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View Full History →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Assessment Date</th>
                        <th className="pb-1">Assessment Type</th>
                        <th className="pb-1 text-center">Overall Rating</th>
                        <th className="pb-1 text-center">Overall Score</th>
                        <th className="pb-1">Assessed By</th>
                        <th className="pb-1">Key Comments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {COMPETENCY_HISTORY.map((h) => (
                        <tr key={h.date} className="hover:bg-slate-50/60">
                          <td className="py-2 font-bold text-slate-900">{h.date}</td>
                          <td className="py-2 text-slate-600">{h.type}</td>
                          <td className="py-2 text-center font-mono font-bold text-amber-500">{h.rating}</td>
                          <td className="py-2 text-center font-mono font-bold text-emerald-700">{h.score}</td>
                          <td className="py-2 text-slate-600">{h.assessor}</td>
                          <td className="py-2 text-slate-500 truncate max-w-[180px]">{h.comments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Quick Actions (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Actions</h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsNewAssessmentModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Award className="h-3.5 w-3.5 text-primary" />
                    Add Assessment
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("gap")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
                    Skill Gap Analysis
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDevPlanModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-purple-600 hover:bg-purple-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <BrainCircuit className="h-3.5 w-3.5 text-purple-600" />
                    Create Development Plan
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEvidenceModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-emerald-600" />
                    Add Evidence
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("360° Competency Feedback requested")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Users className="h-3.5 w-3.5 text-amber-600" />
                    360° Feedback
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Reassessment initiated")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
                    Reassessment
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Competency report generated")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-cyan-600 hover:bg-cyan-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <FileText className="h-3.5 w-3.5 text-cyan-600" />
                    Generate Report
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Exporting competency data")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-rose-600 hover:bg-rose-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-rose-600" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Assessment */}
      {isNewAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Add Competency Assessment
              </h3>
              <button
                type="button"
                onClick={() => setIsNewAssessmentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewAssessmentModalOpen(false);
                toast.success("Competency assessment saved successfully.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Competency Name *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Leadership (Level 4)</option>
                  <option>Strategic Thinking (Level 4)</option>
                  <option>Delegation (Level 3)</option>
                  <option>Cross-Functional Collaboration (Level 4)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    defaultValue={4}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Evidence Type</label>
                  <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                    <option>Project Sample</option>
                    <option>Customer Feedback</option>
                    <option>Certification</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewAssessmentModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Evidence */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-emerald-600" />
                Upload Competency Evidence
              </h3>
              <button
                type="button"
                onClick={() => setIsEvidenceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEvidenceModalOpen(false);
                toast.success("Competency evidence uploaded and tagged.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidence Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EV Powertrain Thermal Optimization Project"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Competency *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Technical Expertise</option>
                  <option>Problem Solving</option>
                  <option>Innovation</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold cursor-pointer"
                >
                  Upload Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Development Plan */}
      {isDevPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-purple-600" />
                Create Development Action Plan
              </h3>
              <button
                type="button"
                onClick={() => setIsDevPlanModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsDevPlanModalOpen(false);
                toast.success("Development action plan created and assigned.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Competency *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Leadership & Team Development</option>
                  <option>Strategic Thinking</option>
                  <option>Communication & Public Speaking</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Development Method *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>Executive Mentoring</option>
                  <option>Leadership Training Workshop</option>
                  <option>Stretch Project Assignment</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDevPlanModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold cursor-pointer"
                >
                  Assign Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

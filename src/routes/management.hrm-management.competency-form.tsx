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
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/competency-form")({
  head: () => ({
    meta: [
      { title: "Competency Form · HRM Management · Magnertia ERP" },
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

export function CompetencyFormPage() {
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
      breadcrumb="Management > HRM Management > Competency Form"
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

        {/* 1. Employee Header & 6 Key Competency Metric Badges */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Row: Employee Profile + Top Meta Strip */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            {/* Left Identity */}
            <div className="shrink-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Sankaranarayanan R</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white shadow-xs">
                  Active
                </span>
              </div>
              <div className="font-mono text-xs font-semibold text-slate-700">EMP-000125</div>
              <div className="text-xs text-muted-foreground font-medium">
                Senior Mechanical Engineer • Engineering Department
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-0.5 whitespace-nowrap">
                <span className="flex items-center gap-1 shrink-0 whitespace-nowrap"><Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" /> sankar.r@magnertia.com</span>
                <span className="flex items-center gap-1 shrink-0 whitespace-nowrap font-mono"><Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" /> +91 98765 43210</span>
                <span className="flex items-center gap-1 shrink-0 whitespace-nowrap"><MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" /> Coimbatore, Tamil Nadu, India</span>
              </div>
            </div>

            {/* Quick Assessment Meta Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs divide-x divide-slate-100 shrink-0">
              <div className="px-2.5 whitespace-nowrap">
                <span className="text-[10px] text-muted-foreground">Assessment Number</span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">CA-2024-00025</div>
              </div>

              <div className="px-2.5 whitespace-nowrap">
                <span className="text-[10px] text-muted-foreground">Performance Cycle</span>
                <div className="font-bold text-slate-900 mt-0.5">FY 2023-24 Annual</div>
              </div>

              <div className="px-2.5 whitespace-nowrap">
                <span className="text-[10px] text-muted-foreground">Assessment Type</span>
                <div className="font-bold text-slate-900 mt-0.5">Annual Assessment</div>
              </div>

              <div className="px-2.5 whitespace-nowrap">
                <span className="text-[10px] text-muted-foreground">Assessment Period</span>
                <div className="font-bold text-slate-900 mt-0.5">01 Apr 2023 - 31 Mar 2024</div>
              </div>

              <div className="px-2.5 whitespace-nowrap">
                <span className="text-[10px] text-muted-foreground">Assessed By</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  <div>Arun Kumar</div>
                  <div className="text-[9px] text-muted-foreground font-normal">Engineering Manager</div>
                </div>
              </div>

              <div className="px-2.5 whitespace-nowrap">
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
                <Award className="h-4 w-4 text-amber-600" />
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
            <div className="p-2.5 rounded-xl border border-slate-200 bg-blue-50/30 flex items-center gap-2.5 shadow-2xs">
              <div className="p-2 rounded-lg bg-blue-100 text-primary">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">Competency Gap</div>
                <div className="text-sm font-extrabold text-primary font-mono">0.9</div>
                <div className="text-[9px] text-primary font-semibold">Moderate</div>
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

        {/* Sub-Tabs Bar (3 Essential Workable Tabs) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview & Summary", icon: BarChart3 },
              { id: "assessment", label: "Competency Assessment & Evidence", icon: Award },
              { id: "development", label: "Competency Gap & Development Plan", icon: BrainCircuit },
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

        {/* TAB 1: OVERVIEW & SUMMARY */}
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

                <div className="space-y-1 text-[9px]">
                  {COMPETENCY_SUMMARY_PIE.map((c) => (
                    <div key={c.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-slate-600 truncate">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                      <span className="font-mono font-bold text-slate-800">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Competency Category Scores (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Category Scores</h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  {CATEGORY_SCORES.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-700 truncate">{cat.name}</span>
                        <span className="font-mono font-bold text-slate-900">{cat.score} / 5</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", cat.color)}
                          style={{ width: `${(cat.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>Scale: 1 (Beginner)</span>
                  <span>5 (Expert)</span>
                </div>
              </div>

              {/* 3. Top Strengths (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Top Strengths
                  </h4>
                </div>

                <div className="space-y-2 text-[11px]">
                  {[
                    "Technical Expertise & FEA Simulation",
                    "Problem Solving & Root Cause Analysis",
                    "Quality Orientation & GD&T Standards",
                    "Ownership & Sprint Milestones",
                    "Process Improvement & Automation",
                  ].map((s) => (
                    <div key={s} className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{s}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("assessment")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 border-t border-slate-100">
                  View Full Assessment Matrix →
                </button>
              </div>

              {/* 4. Top Improvement Areas (3 Cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1">
                    <ArrowUp className="h-3.5 w-3.5 text-rose-600" /> Improvement Areas
                  </h4>
                </div>

                <div className="space-y-2 text-[11px]">
                  {[
                    "Leadership & Team Mentoring",
                    "Strategic Product Roadmapping",
                    "Executive Communication & Pitching",
                    "Cross-functional Delegation",
                    "Commercial Cost & ROI Modeling",
                  ].map((s) => (
                    <div key={s} className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <span className="h-3.5 w-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[9px] font-bold shrink-0">↑</span>
                      <span className="truncate">{s}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("development")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 border-t border-slate-100">
                  View Development Plan (IDP) →
                </button>
              </div>
            </div>

            {/* Row 2: Assessment Highlights, Quick Gap Overview, 360 Feedback Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 1. Competency Assessment Details (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Assessment Highlights</h4>
                  <button onClick={() => setActiveTab("assessment")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    Full Matrix →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Competency</th>
                        <th className="pb-1 text-center whitespace-nowrap">Req</th>
                        <th className="pb-1 text-center whitespace-nowrap">Cur</th>
                        <th className="pb-1 text-center whitespace-nowrap">Gap</th>
                        <th className="pb-1 text-right whitespace-nowrap">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ASSESSMENT_DETAILS.slice(0, 4).map((row) => (
                        <tr key={row.name} className="hover:bg-slate-50/60">
                          <td className="py-1.5 font-medium text-slate-900 truncate max-w-[120px]">{row.name}</td>
                          <td className="py-1.5 text-center font-mono text-slate-500">{row.req}</td>
                          <td className="py-1.5 text-center font-mono font-bold text-slate-800">{row.cur}</td>
                          <td className="py-1.5 text-center font-mono font-bold">
                            <span className={cn(row.gap > 0 ? "text-rose-600 font-bold" : "text-emerald-600")}>
                              {row.gap > 0 ? `-${row.gap}` : "0"}
                            </span>
                          </td>
                          <td className="py-1.5 text-right font-mono font-bold text-slate-700 whitespace-nowrap">
                            {row.rating} / 5
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Competency Gap Analysis (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Critical Gap Prioritization</h4>
                  <button onClick={() => setActiveTab("development")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View IDP →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Competency</th>
                        <th className="pb-1 text-center whitespace-nowrap">Gap</th>
                        <th className="pb-1 text-center whitespace-nowrap">Priority</th>
                        <th className="pb-1 text-right whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {GAP_ANALYSIS.map((g) => (
                        <tr key={g.competency} className="hover:bg-slate-50/60">
                          <td className="py-2 font-bold text-slate-900 truncate max-w-[120px]">{g.competency}</td>
                          <td className="py-2 text-center font-mono font-bold text-rose-600">-{g.gap}</td>
                          <td className="py-2 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded-full font-bold text-[9px]",
                                g.priority === "High"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200",
                              )}
                            >
                              {g.priority}
                            </span>
                          </td>
                          <td className="py-2 text-right whitespace-nowrap">
                            <button
                              onClick={() => setActiveTab("development")}
                              className="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                            >
                              Bridge Gap
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. 360 Feedback Snapshot (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">360° Multi-Rater Snapshot</h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-900">Manager Evaluation</div>
                      <div className="text-[8px] text-muted-foreground">Arun Kumar (Engineering Manager)</div>
                    </div>
                    <span className="font-mono font-extrabold text-sm text-slate-900">4.3 / 5</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-900">Peer Average Rating</div>
                      <div className="text-[8px] text-muted-foreground">3 Peer Reviewers Synthesized</div>
                    </div>
                    <span className="font-mono font-extrabold text-sm text-blue-700">4.4 / 5</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-900">Self Assessment Score</div>
                      <div className="text-[8px] text-muted-foreground">Sankar R</div>
                    </div>
                    <span className="font-mono font-extrabold text-sm text-emerald-700">4.1 / 5</span>
                  </div>
                </div>

                <button onClick={() => setActiveTab("development")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Full IDP & Action Plans →
                </button>
              </div>
            </div>

            {/* Row 3: Documents, History, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Documents (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Assessment Documents</h4>
                  <button onClick={() => toast.info("Viewing all documents")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All →
                  </button>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  {[
                    { name: "Annual Competency Scorecard FY24.pdf", date: "14 May 2024" },
                    { name: "Manager Assessment Signoff.pdf", date: "14 May 2024" },
                    { name: "360 Peer Evaluation Synthesis.pdf", date: "10 May 2024" },
                    { name: "Individual Development Plan 2024-25.pdf", date: "15 May 2024" },
                  ].map((doc) => (
                    <div key={doc.name} className="flex justify-between items-center p-1.5 rounded-md bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900 truncate max-w-[170px]">{doc.name}</div>
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

              {/* 2. History Log (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Assessment History</h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">FY 2023-24 Annual Assessment (4.1 / 5)</div>
                      <div className="text-[8px] text-slate-400 font-mono">14 May 2024 • Assessed by Arun Kumar</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Mid-Year Review FY24 (3.9 / 5)</div>
                      <div className="text-[8px] text-slate-400 font-mono">15 Nov 2023 • Assessed by Arun Kumar</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">FY 2022-23 Annual Assessment (3.7 / 5)</div>
                      <div className="text-[8px] text-slate-400 font-mono">10 May 2023 • Assessed by Arun Kumar</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Quick Actions (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Quick Actions</h4>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsNewAssessmentModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Plus className="h-3 w-3 text-primary" />
                    Add Competency
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDevPlanModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <BrainCircuit className="h-3 w-3 text-blue-600" />
                    Add IDP Goal
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEvidenceModalOpen(true)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-primary hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <Paperclip className="h-3 w-3 text-primary" />
                    Add Evidence
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Competency scorecard PDF generated")}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[10px]"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-emerald-600" />
                    Export Scorecard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPETENCY ASSESSMENT & EVIDENCE */}
        {activeTab === "assessment" && (
          <div className="space-y-6">
            {/* 1. Assessment Matrix */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Competency Assessment Matrix</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Role: Senior Mechanical Engineer • Cycle: FY 2023-24 Annual</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewAssessmentModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Competency
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Competency Name</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">Required Level (1-5)</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">Current Level (1-5)</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">Competency Gap</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">Score %</th>
                      <th className="py-2.5 px-3 text-center whitespace-nowrap">Weightage</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Proficiency Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ASSESSMENT_DETAILS.map((r) => (
                      <tr key={r.name} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{r.name}</td>
                        <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 whitespace-nowrap">{r.req} / 5</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 whitespace-nowrap">{r.cur} / 5</td>
                        <td className="py-3 px-3 text-center font-mono font-bold whitespace-nowrap">
                          <span className={cn(r.gap > 0 ? "text-rose-600 font-extrabold" : "text-emerald-600")}>
                            {r.gap > 0 ? `-${r.gap}` : "0 (Met)"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-blue-700 whitespace-nowrap">{r.score}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-500 whitespace-nowrap">{r.weight}</td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {r.rating} / 5
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Evidence Repository */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Competency Evidence Repository</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Work artifacts, project deliverables, and certifications supporting assessment.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  Add Evidence
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Evidence Title</th>
                      <th className="py-2.5 px-3">Linked Competency</th>
                      <th className="py-2.5 px-3">Evidence Type</th>
                      <th className="py-2.5 px-3">Verified By</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { title: "Gen-4 EV Charger CAD Enclosure Release", comp: "Technical Expertise", type: "CAD Assembly File", by: "Arun Kumar", date: "15 Apr 2024", status: "Verified" },
                      { title: "Thermal Optimization FEA Report", comp: "Problem Solving", type: "Simulation Report", by: "Arun Kumar", date: "22 Apr 2024", status: "Verified" },
                      { title: "Vendor Root Cause Analysis Presentation", comp: "Functional Knowledge", type: "Audit Document", by: "HR Auditor", date: "02 May 2024", status: "Verified" },
                    ].map((e) => (
                      <tr key={e.title} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{e.title}</td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{e.comp}</td>
                        <td className="py-3 px-3 text-slate-600">{e.type}</td>
                        <td className="py-3 px-3 text-slate-700">{e.by}</td>
                        <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">{e.date}</td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {e.status}
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

        {/* TAB 3: COMPETENCY GAP & DEVELOPMENT PLAN */}
        {activeTab === "development" && (
          <div className="space-y-6">
            {/* Competency Gap Matrix */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Identified Competency Gaps</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Target proficiencies vs assessed performance levels.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Competency Area</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-center">Required Level</th>
                      <th className="py-2.5 px-3 text-center">Assessed Level</th>
                      <th className="py-2.5 px-3 text-center">Gap Delta</th>
                      <th className="py-2.5 px-3 text-right">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { area: "High Voltage EV Architecture", cat: "Core Technical", req: "L4 (Advanced)", curr: "L3 (Proficient)", gap: "-1 Level", priority: "High" },
                      { area: "Cross-Functional Project Leadership", cat: "Behavioral", req: "L4 (Advanced)", curr: "L3.5 (Competent)", gap: "-0.5 Level", priority: "Medium" },
                      { area: "Thermal Simulation & FEA", cat: "Functional", req: "L4 (Advanced)", curr: "L4 (Advanced)", gap: "0 (Target Met)", priority: "Low" },
                    ].map((g) => (
                      <tr key={g.area} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{g.area}</td>
                        <td className="py-3 px-3 text-slate-600">{g.cat}</td>
                        <td className="py-3 px-3 text-center font-mono font-semibold">{g.req}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">{g.curr}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          <span className={cn(g.gap.includes("-") ? "text-amber-600" : "text-emerald-700")}>
                            {g.gap}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={cn(
                              "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                              g.priority === "High"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : g.priority === "Medium"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200",
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

            {/* Individual Development Plan (IDP) */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Individual Development Action Plan (IDP)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Targeted learning interventions, mentors, and timelines.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("New development goal added.")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Goal
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Development Goal</th>
                      <th className="py-2.5 px-3">Intervention Type</th>
                      <th className="py-2.5 px-3">Mentor / Coach</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Target Date</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { goal: "Complete Advanced EV Powertrain Masterclass", type: "External Certification", mentor: "Dr. K. Raman", date: "30 Jun 2024", status: "In Progress" },
                      { goal: "Lead Sprint Planning for Battery Enclosure Gen-5", type: "On-the-Job Project", mentor: "Arun Kumar", date: "15 Jul 2024", status: "Scheduled" },
                      { goal: "Conduct Internal Workshop on ANSYS Thermal FEA", type: "Knowledge Transfer", mentor: "Priya Sundaram", date: "30 Aug 2024", status: "Planned" },
                    ].map((d) => (
                      <tr key={d.goal} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{d.goal}</td>
                        <td className="py-3 px-3 text-slate-600">{d.type}</td>
                        <td className="py-3 px-3 text-slate-700">{d.mentor}</td>
                        <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">{d.date}</td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
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
                <BrainCircuit className="h-4 w-4 text-primary" />
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
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary font-semibold cursor-pointer"
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

export default CompetencyFormPage;

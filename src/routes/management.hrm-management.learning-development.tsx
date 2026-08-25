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
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/learning-development")({
  head: () => ({
    meta: [
      { title: "Training & Development · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Training Form manages the complete employee learning lifecycle from training need identification → training plan → nomination → approval → trainer/course assignment → scheduling → attendance → assessment → certification → feedback → effectiveness evaluation → skill update → ROI → analytics.",
      },
    ],
  }),
  component: TrainingManagementPage,
});

// --- Data Models ---

const TRAINING_COST_PIE = [
  { name: "Trainer Fee", value: 10000, percentage: "66.7%", color: "#2563EB" },
  { name: "Materials", value: 2000, percentage: "13.3%", color: "#10B981" },
  { name: "Venue", value: 1500, percentage: "10.0%", color: "#F59E0B" },
  { name: "Others", value: 1500, percentage: "10.0%", color: "#EF4444" },
];

const SKILLS_IMPROVEMENT = [
  { skill: "CAD Modeling", before: 45, after: 85 },
  { skill: "Assembly Design", before: 50, after: 88 },
  { skill: "Sheet Metal", before: 40, after: 80 },
  { skill: "Simulation", before: 30, after: 70 },
  { skill: "Drafting Standards", before: 55, after: 90 },
];

export default function TrainingManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Modals
  const [isNominationModalOpen, setIsNominationModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  const handleSubmitForApproval = () => {
    toast.success("Training Program TRN-2024-00087 submitted for approval", {
      description: "Nomination list and budget forwarded to HR & Department Head.",
    });
  };

  return (
    <AppShell
      title="Training & Development"
      breadcrumb="Management > HRM Management > Training & Development"
      description="The Training Form manages the complete employee learning lifecycle from training need identification → training plan → nomination → approval → trainer/course assignment → scheduling → attendance → assessment → certification → feedback → effectiveness evaluation → skill update → ROI → analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Training Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsNominationModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Training
              </button>
              <button
                type="button"
                onClick={() => toast.info("Importing participant data...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                Import Data
              </button>
              <button
                type="button"
                onClick={() => toast.success("Training report exported")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Export
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("More training tools opened")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                More
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={handleSubmitForApproval}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Submit for Approval
              </button>
            </div>
          </div>
        </div>

        {/* 1. Employee Header & Training Meta Details (Exact match to reference screenshot) */}
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

            {/* Top Row Meta Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs divide-x divide-slate-100">
              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Training Number
                </span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">TRN-2024-00087</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> Training Program
                </span>
                <div className="font-bold text-slate-900 mt-0.5">Advanced CAD Design</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" /> Training Type
                </span>
                <div className="font-bold text-slate-900 mt-0.5">Technical</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Laptop className="h-3 w-3" /> Training Mode
                </span>
                <div className="font-bold text-slate-900 mt-0.5">Classroom</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Duration
                </span>
                <div className="font-bold text-slate-900 font-mono mt-0.5">16 Hours</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> Cost
                </span>
                <div className="font-bold text-primary font-mono mt-0.5">₹ 15,000</div>
              </div>
            </div>
          </div>

          {/* Bottom Row Meta Strip */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-blue-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Training Need</div>
                <div className="font-semibold text-slate-900">Skill Gap Identified</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-3.5 w-3.5 text-indigo-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Skill</div>
                <div className="font-semibold text-slate-900">CAD Design</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Training Provider</div>
                <div className="font-semibold text-slate-900">Magnertia Innovation Lab</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-purple-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Trainer</div>
                <div className="font-semibold text-slate-900">Arun Kumar</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Start Date</div>
                <div className="font-semibold text-slate-900">20 May 2024</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">End Date</div>
                <div className="font-semibold text-slate-900">21 May 2024</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-blue-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Status</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
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
              { id: "schedule", label: "Schedule", icon: CalendarDays },
              { id: "attendance", label: "Attendance", icon: UserCheck },
              { id: "assessments", label: "Assessments", icon: CheckSquare },
              { id: "feedback", label: "Feedback", icon: MessageSquare },
              { id: "certification", label: "Certification", icon: Award },
              { id: "effectiveness", label: "Effectiveness", icon: TrendingUp },
              { id: "documents", label: "Documents", icon: Paperclip },
              { id: "roi", label: "Cost & ROI", icon: DollarSign },
              { id: "approvals", label: "Approvals", icon: CheckCheck },
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
            {/* Row 1: Training Progress, Training Details, Training Cost Summary, Participant Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Training Progress (Donut / Semi-Circle Progress) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Training Progress</h4>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="h-28 w-28 relative shrink-0 flex items-center justify-center">
                    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-primary"
                        strokeDasharray="75, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-base font-extrabold text-slate-900 font-mono">75%</span>
                      <span className="text-[8px] text-muted-foreground">Completed</span>
                    </div>
                  </div>

                  {/* 7-Step Tracker */}
                  <div className="space-y-1 text-[9px] flex-1">
                    <div className="flex justify-between items-center text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Goal Setting</span>
                      <span>Completed</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Approval</span>
                      <span>Completed</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Scheduled</span>
                      <span>Completed</span>
                    </div>
                    <div className="flex justify-between items-center text-blue-700 font-bold">
                      <span className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[7px]">4</span>
                        In Progress
                      </span>
                      <span>Active</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>5. Assessment</span>
                      <span>Pending</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>6. Certification</span>
                      <span>Pending</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>7. Effectiveness</span>
                      <span>Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Training Details */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Training Details</h4>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category</span>
                    <span className="font-semibold text-slate-800">Technical</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Mode</span>
                    <span className="font-semibold text-slate-800">Classroom</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-mono font-bold text-slate-800">16 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Sessions</span>
                    <span className="font-mono font-bold text-slate-800">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch Size</span>
                    <span className="font-mono font-bold text-slate-800">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registered</span>
                    <span className="font-mono font-bold text-slate-800">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Completed</span>
                    <span className="font-mono font-bold text-emerald-700">9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Certification</span>
                    <span className="font-bold text-emerald-700">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Validity</span>
                    <span className="font-semibold text-slate-800">1 Year</span>
                  </div>
                </div>
              </div>

              {/* 3. Training Cost Summary (Donut Chart) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Training Cost Summary</h4>
                </div>

                <div className="h-28 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={TRAINING_COST_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {TRAINING_COST_PIE.map((entry, index) => (
                          <Cell key={`cost-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-sm font-extrabold text-slate-900 font-mono">₹ 15,000</span>
                    <span className="text-[7px] text-muted-foreground">Total Cost</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  {TRAINING_COST_PIE.map((c) => (
                    <div key={c.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-slate-600 truncate">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                      <span className="font-mono font-bold">₹ {c.value.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("roi")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Cost Details →
                </button>
              </div>

              {/* 4. Participant Summary */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Participant Summary</h4>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Nominated</span>
                    <span className="font-mono font-bold text-slate-800">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attended</span>
                    <span className="font-mono font-bold text-slate-800">9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Completed</span>
                    <span className="font-mono font-bold text-slate-800">9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assessment Passed</span>
                    <span className="font-mono font-bold text-emerald-700">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Certification Issued</span>
                    <span className="font-mono font-bold text-emerald-700">8</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100 font-bold">
                    <span className="text-slate-700">Completion Rate</span>
                    <span className="font-mono text-blue-700">75%</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">Pass Rate</span>
                    <span className="font-mono text-emerald-700">89%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Upcoming / Ongoing Sessions, Recent Assessments, Skills Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 1. Upcoming / Ongoing Sessions (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Upcoming / Ongoing Sessions</h4>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="p-2 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>Session 1: Fundamentals</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px]">
                        Completed
                      </span>
                    </div>
                    <div className="text-slate-500 text-[9px]">20 May 2024 • 09:30 AM - 05:30 PM (8 Hours)</div>
                    <div className="text-slate-600 font-medium">Trainer: Arun Kumar • Training Hall A</div>
                  </div>

                  <div className="p-2 rounded-lg border border-blue-200 bg-blue-50/40 space-y-1">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>Session 2: Advanced Design</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[9px]">
                        In Progress
                      </span>
                    </div>
                    <div className="text-slate-500 text-[9px]">21 May 2024 • 09:30 AM - 05:30 PM (8 Hours)</div>
                    <div className="text-slate-600 font-medium">Trainer: Arun Kumar • Training Hall A</div>
                  </div>
                </div>

                <button onClick={() => setActiveTab("schedule")} className="w-full py-1.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-center">
                  View Full Schedule
                </button>
              </div>

              {/* 2. Recent Assessments (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent Assessments</h4>
                  <button onClick={() => setActiveTab("assessments")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Assessments →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Assessment</th>
                        <th className="pb-1">Type</th>
                        <th className="pb-1">Date</th>
                        <th className="pb-1 text-center">Score</th>
                        <th className="pb-1 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-2 font-bold text-slate-900">Pre-Test</td>
                        <td className="py-2 text-slate-600">Online Test</td>
                        <td className="py-2 text-slate-600">20 May 2024</td>
                        <td className="py-2 text-center font-mono font-bold">60%</td>
                        <td className="py-2 text-right text-slate-400">N/A</td>
                      </tr>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-2 font-bold text-slate-900">Post-Test</td>
                        <td className="py-2 text-slate-600">Online Test</td>
                        <td className="py-2 text-slate-600">21 May 2024</td>
                        <td className="py-2 text-center font-mono font-bold text-emerald-700">88%</td>
                        <td className="py-2 text-right font-bold text-emerald-700">Passed</td>
                      </tr>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-2 font-bold text-slate-900">Practical</td>
                        <td className="py-2 text-slate-600">Practical</td>
                        <td className="py-2 text-slate-600">21 May 2024</td>
                        <td className="py-2 text-center font-mono font-bold text-emerald-700">90%</td>
                        <td className="py-2 text-right font-bold text-emerald-700">Passed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button onClick={() => setIsAssessmentModalOpen(true)} className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">
                    + Record New Assessment Score
                  </button>
                </div>
              </div>

              {/* 3. Skills Improvement (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Skills Improvement</h4>
                  <div className="flex items-center gap-2 text-[9px] text-slate-500">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-300" /> Before</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> After</span>
                  </div>
                </div>

                <div className="space-y-2 text-[10px]">
                  {SKILLS_IMPROVEMENT.map((s) => (
                    <div key={s.skill} className="space-y-0.5">
                      <div className="flex justify-between text-slate-700">
                        <span className="font-medium">{s.skill}</span>
                        <span className="font-mono text-[9px]">
                          <span className="text-slate-400">{s.before}%</span> → <strong className="text-blue-700">{s.after}%</strong>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.after}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("effectiveness")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Skill Gap Analysis →
                </button>
              </div>
            </div>

            {/* Row 3: Documents, Feedback Summary, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. Documents (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Documents</h4>
                  <button onClick={() => setActiveTab("documents")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Documents →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-1">Document Name</th>
                        <th className="pb-1">Type</th>
                        <th className="pb-1">Uploaded By</th>
                        <th className="pb-1">Date</th>
                        <th className="pb-1 text-right">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: "Training Brochure.pdf", type: "Brochure", by: "Priya Nair", date: "10 May 2024" },
                        { name: "Course Material.zip", type: "Material", by: "Arun Kumar", date: "18 May 2024" },
                        { name: "Attendance Sheet.xlsx", type: "Attendance", by: "Priya Nair", date: "21 May 2024" },
                        { name: "Presentation Slides.pptx", type: "Slides", by: "Arun Kumar", date: "21 May 2024" },
                      ].map((doc) => (
                        <tr key={doc.name} className="hover:bg-slate-50/60">
                          <td className="py-1.5 font-bold text-slate-900">{doc.name}</td>
                          <td className="py-1.5 text-slate-600">{doc.type}</td>
                          <td className="py-1.5 text-slate-600">{doc.by}</td>
                          <td className="py-1.5 text-slate-500 font-mono">{doc.date}</td>
                          <td className="py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => toast.success(`Downloading ${doc.name}`)}
                              className="text-primary hover:text-blue-700 p-0.5 cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Feedback Summary (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Feedback Summary</h4>
                  <button onClick={() => setActiveTab("feedback")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All Feedback →
                  </button>
                </div>

                {/* Star Ratings Grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100">
                    <div className="text-slate-500 text-[9px]">Trainer Rating</div>
                    <div className="font-bold text-slate-900 flex items-center gap-1 font-mono">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 4.6 / 5
                    </div>
                    <div className="text-emerald-700 text-[8px] font-semibold">Excellent</div>
                  </div>

                  <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100">
                    <div className="text-slate-500 text-[9px]">Content Rating</div>
                    <div className="font-bold text-slate-900 flex items-center gap-1 font-mono">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 4.4 / 5
                    </div>
                    <div className="text-blue-700 text-[8px] font-semibold">Very Good</div>
                  </div>

                  <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100">
                    <div className="text-slate-500 text-[9px]">Delivery Rating</div>
                    <div className="font-bold text-slate-900 flex items-center gap-1 font-mono">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 4.5 / 5
                    </div>
                    <div className="text-emerald-700 text-[8px] font-semibold">Excellent</div>
                  </div>

                  <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100">
                    <div className="text-slate-500 text-[9px]">Overall Rating</div>
                    <div className="font-bold text-slate-900 flex items-center gap-1 font-mono">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 4.5 / 5
                    </div>
                    <div className="text-emerald-700 text-[8px] font-semibold">Excellent</div>
                  </div>
                </div>

                {/* Qualitative Feedback */}
                <div className="space-y-1 text-[9px]">
                  <div className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle className="h-2.5 w-2.5 text-emerald-600" /> What Participants Liked:
                  </div>
                  <div className="text-slate-600 pl-3">"Practical sessions were very helpful • Trainer explains concepts clearly"</div>

                  <div className="text-amber-800 font-bold flex items-center gap-1 pt-1">
                    <HelpCircle className="h-2.5 w-2.5 text-amber-600" /> Suggestions:
                  </div>
                  <div className="text-slate-600 pl-3">"More real-time case studies • Advanced simulation topics"</div>
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
                    onClick={() => toast.info("Progress tracker updated")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50/70 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Target className="h-3.5 w-3.5 text-primary" />
                    Update Progress
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAttendanceModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-blue-600 hover:bg-blue-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                    Mark Attendance
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAssessmentModalOpen(true)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-purple-600 hover:bg-purple-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <CheckSquare className="h-3.5 w-3.5 text-purple-600" />
                    Record Assessment
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success("Certificates generated for 8 passing candidates")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                    Generate Certificate
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Notification sent to participants")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-amber-600 hover:bg-amber-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Send className="h-3.5 w-3.5 text-amber-600" />
                    Send Notification
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Upload training document dialog")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-indigo-600" />
                    Upload Document
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("effectiveness")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-cyan-600 hover:bg-cyan-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-cyan-600" />
                    Evaluate Effectiveness
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.info("Training reports preview")}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-rose-600 hover:bg-rose-50/40 text-slate-700 font-semibold transition cursor-pointer text-[11px]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-rose-600" />
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Training Nomination */}
      {isNominationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Create New Training Program
              </h3>
              <button
                type="button"
                onClick={() => setIsNominationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNominationModalOpen(false);
                toast.success("Training program created and scheduled.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Finite Element Analysis (FEA) Masterclass"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                    <option>Technical</option>
                    <option>Leadership</option>
                    <option>Quality</option>
                    <option>Safety</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trainer</label>
                  <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                    <option>Arun Kumar</option>
                    <option>Dr. Arvind Rao</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNominationModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold cursor-pointer"
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Mark Attendance */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-600" />
                Session Attendance Roster
              </h3>
              <button
                type="button"
                onClick={() => setIsAttendanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Session 2: Advanced Design</span>
                  <span>21 May 2024</span>
                </div>
                <div className="text-slate-500 text-[10px]">12 Registered • 9 Checked-In</div>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {[
                  { name: "Sankaranarayanan R", id: "EMP-000125", status: "Present" },
                  { name: "Priya Nair", id: "EMP-000128", status: "Present" },
                  { name: "Karthik S", id: "EMP-000130", status: "Present" },
                  { name: "Vikram R", id: "EMP-000132", status: "Absent" },
                ].map((emp) => (
                  <div key={emp.id} className="flex justify-between items-center p-2 rounded-lg border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-900">{emp.name}</div>
                      <div className="text-[9px] text-muted-foreground">{emp.id}</div>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full font-bold text-[9px]",
                        emp.status === "Present" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
                      )}
                    >
                      {emp.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAttendanceModalOpen(false);
                    toast.success("Attendance roster synchronized.");
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold cursor-pointer"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record Assessment */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-purple-600" />
                Record Assessment Score
              </h3>
              <button
                type="button"
                onClick={() => setIsAssessmentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAssessmentModalOpen(false);
                toast.success("Assessment score recorded.");
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Participant *</label>
                <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                  <option>EMP-000125 - Sankaranarayanan R</option>
                  <option>EMP-000128 - Priya Nair</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assessment Type</label>
                  <select className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden bg-white">
                    <option>Practical Exam</option>
                    <option>Post-Test Online</option>
                    <option>Project Submission</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Score Obtained (%)</label>
                  <input
                    type="number"
                    defaultValue={92}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssessmentModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold cursor-pointer"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

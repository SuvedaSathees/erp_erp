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
  component: LearningDevelopmentPage,
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

export function LearningDevelopmentPage() {
  const [activeTab, setActiveTab] = useState<string>("schedule");

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

        {/* 1. Training Program Header (Clean enterprise layout, no profile photos, no stars) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          {/* Top Row Meta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Training No.</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">TRN-2024-00087</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Program</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Advanced CAD Design</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Training Type</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Technical Workshop</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Delivery Mode</span>
              <div className="font-semibold text-slate-900 text-sm truncate">Classroom (Lab 3)</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Duration</span>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">16 Hours (2 Days)</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-0.5">
              <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Program Budget</span>
              <div className="font-mono font-bold text-emerald-700 text-sm truncate">₹ 15,000</div>
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
              <Award className="h-3.5 w-3.5 text-primary" />
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
              <User className="h-3.5 w-3.5 text-primary" />
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
              { id: "schedule", label: "Schedule & Curriculum", icon: CalendarDays },
              { id: "attendance", label: "Trainee Attendance", icon: UserCheck },
              { id: "assessments", label: "Assessments & Scores", icon: CheckSquare },
              { id: "feedback", label: "Feedback & Effectiveness", icon: MessageSquare },
              { id: "certification", label: "Certification & ROI", icon: Award },
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
        {/* Tab 1: Schedule & Curriculum */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            {/* Row 1: Progress, Details, Cost, Participant Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Training Progress */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Training Progress</h4>
                  <span className="font-mono text-xs font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    75% Completed
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="h-24 w-24 relative shrink-0 flex items-center justify-center">
                    <svg className="h-24 w-24" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
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
                      <span className="text-sm font-extrabold text-slate-900 font-mono">75%</span>
                      <span className="text-[7px] text-muted-foreground font-medium">Overall</span>
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
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Training Details</h4>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category</span>
                    <span className="font-semibold text-slate-800">Technical</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Mode</span>
                    <span className="font-semibold text-slate-800">Classroom (Lab 3)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-mono font-bold text-slate-800">16 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Sessions</span>
                    <span className="font-mono font-bold text-slate-800">2 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch Size</span>
                    <span className="font-mono font-bold text-slate-800">15 Candidates</span>
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
                    <span className="font-bold text-emerald-700">Yes (Digital)</span>
                  </div>
                </div>
              </div>

              {/* 3. Training Cost Summary (Donut Chart) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Training Cost Summary</h4>
                  <span className="font-mono text-xs font-bold text-slate-900">₹ 15,000</span>
                </div>

                <div className="h-24 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={TRAINING_COST_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={42}
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
                    <span className="text-xs font-extrabold text-slate-900 font-mono">₹ 15K</span>
                    <span className="text-[7px] text-muted-foreground">Budget</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                  {TRAINING_COST_PIE.map((c) => (
                    <div key={c.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-slate-600 truncate text-[9px]">
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                      <span className="font-mono font-bold text-slate-800 text-[9px]">₹ {c.value.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setActiveTab("certification")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer pt-1 text-center border-t border-slate-100">
                  View Cost & ROI →
                </button>
              </div>

              {/* 4. Participant Summary */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Participant Summary</h4>
                </div>

                <div className="space-y-1 text-[10px]">
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

            {/* Row 2: Curriculum & Session Modules */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Training Schedule & Curriculum Outline</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Program: Advanced CAD Design (16 Total Hours • Lab 3)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNominationModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
                >
                  + Add New Session
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Session & Module</th>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Trainer</th>
                      <th className="py-2.5 px-3">Venue / Lab</th>
                      <th className="py-2.5 px-3">Key Topics Covered</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { session: "Session 1: Fundamentals & Parametric Modeling", date: "20 May 2024 (09:30 AM - 05:30 PM)", duration: "8 Hours", trainer: "Arun Kumar", lab: "Classroom Lab 3", topics: "3D Sketching, Feature Tree, Constraints", status: "Completed", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                      { session: "Session 2: Advanced Surface Design & FEA Simulation", date: "21 May 2024 (09:30 AM - 05:30 PM)", duration: "8 Hours", trainer: "Arun Kumar", lab: "Classroom Lab 3", topics: "NURBS Surfacing, Thermal Stress Simulation, Export", status: "In Progress", statusColor: "bg-blue-50 text-blue-700 border-blue-200" },
                    ].map((s) => (
                      <tr key={s.session} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{s.session}</td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{s.date}</td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">{s.duration}</td>
                        <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">{s.trainer}</td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{s.lab}</td>
                        <td className="py-3 px-3 text-slate-500 truncate max-w-[220px]">{s.topics}</td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap shadow-2xs", s.statusColor)}>
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

        {/* Tab 2: Trainee Attendance */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Trainee Roster & Daily Attendance (12 Nominated)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Overall Attendance Rate: 75% • Passed Minimum Requirement: 9 Candidates</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Mark Attendance
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Emp ID</th>
                      <th className="py-2.5 px-3">Trainee Name</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Day 1 (20 May)</th>
                      <th className="py-2.5 px-3">Day 2 (21 May)</th>
                      <th className="py-2.5 px-3 text-center">Attendance %</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: "EMP-000125", name: "Sankaranarayanan R", dept: "Mechanical Engineering", d1: "Present (8h)", d2: "Present (8h)", pct: 100, status: "Eligible for Exam", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                      { id: "EMP-000128", name: "Priya Nair", dept: "Software R&D", d1: "Present (8h)", d2: "Present (8h)", pct: 100, status: "Eligible for Exam", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                      { id: "EMP-000132", name: "Karthik Subramanian", dept: "Electrical Design", d1: "Present (8h)", d2: "Present (8h)", pct: 100, status: "Eligible for Exam", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                      { id: "EMP-000140", name: "Ananya Iyer", dept: "Quality Assurance", d1: "Present (8h)", d2: "Late (6h)", pct: 88, status: "Eligible for Exam", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                      { id: "EMP-000145", name: "Deepak Sharma", dept: "Manufacturing Operations", d1: "Absent", d2: "Present (8h)", pct: 50, status: "Attendance Shortage", statusColor: "bg-rose-50 text-rose-700 border-rose-200" },
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700">{row.id}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{row.name}</td>
                        <td className="py-3 px-3 text-slate-600">{row.dept}</td>
                        <td className="py-3 px-3 font-mono text-emerald-700 font-medium">{row.d1}</td>
                        <td className="py-3 px-3 font-mono text-emerald-700 font-medium">{row.d2}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">{row.pct}%</td>
                        <td className="py-3 px-3 text-right">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", row.statusColor)}>
                            {row.status}
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

        {/* Tab 3: Assessments & Scores */}
        {activeTab === "assessments" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pre-Test vs Post-Test Assessment Scores</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Passing Criteria: ≥ 75% • Batch Pass Rate: 89%</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssessmentModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  Record Assessment Score
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Trainee</th>
                      <th className="py-2.5 px-3 text-center">Pre-Test Score</th>
                      <th className="py-2.5 px-3 text-center">Post-Test Score</th>
                      <th className="py-2.5 px-3 text-center">Practical Project</th>
                      <th className="py-2.5 px-3 text-center">Net Score</th>
                      <th className="py-2.5 px-3 text-center">Improvement</th>
                      <th className="py-2.5 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "Sankaranarayanan R", pre: "60%", post: "92%", proj: "90%", net: "91%", imp: "+31%", result: "Passed (Distinction)", pass: true },
                      { name: "Priya Nair", pre: "65%", post: "88%", proj: "85%", net: "87%", imp: "+22%", result: "Passed", pass: true },
                      { name: "Karthik Subramanian", pre: "55%", post: "84%", proj: "80%", net: "82%", imp: "+27%", result: "Passed", pass: true },
                      { name: "Ananya Iyer", pre: "50%", post: "76%", proj: "78%", net: "77%", imp: "+27%", result: "Passed", pass: true },
                      { name: "Deepak Sharma", pre: "40%", post: "58%", proj: "60%", net: "59%", imp: "+19%", result: "Needs Re-Assessment", pass: false },
                    ].map((row) => (
                      <tr key={row.name} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{row.name}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-500">{row.pre}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{row.post}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{row.proj}</td>
                        <td className="py-3 px-3 text-center font-mono font-extrabold text-blue-700">{row.net}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">{row.imp}</td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                              row.pass ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                            )}
                          >
                            {row.result}
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

        {/* Tab 4: Feedback & Effectiveness */}
        {activeTab === "feedback" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Feedback Summary Breakdown */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">Participant Feedback Ratings</h4>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Overall: 4.5 / 5.0
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { label: "Trainer Knowledge & Clarity", rating: "4.8 / 5", pct: 96, color: "bg-emerald-600" },
                    { label: "Course Content & Lab Materials", rating: "4.6 / 5", pct: 92, color: "bg-blue-600" },
                    { label: "Practical Relevance to Projects", rating: "4.4 / 5", pct: 88, color: "bg-primary" },
                    { label: "Classroom Lab Infrastructure", rating: "4.3 / 5", pct: 86, color: "bg-amber-600" },
                  ].map((f) => (
                    <div key={f.label} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 space-y-1.5">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{f.label}</span>
                        <span className="font-mono font-bold text-slate-900">{f.rating}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", f.color)} style={{ width: `${f.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kirkpatrick Effectiveness Evaluation */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">Kirkpatrick Effectiveness Model</h4>
                  <span className="text-xs text-muted-foreground">Evaluation Matrix</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Level 1: Reaction</div>
                      <div className="text-[10px] text-slate-500">Learner engagement & satisfaction survey</div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">92% Positive</span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Level 2: Learning</div>
                      <div className="text-[10px] text-slate-500">Post-test score improvement analysis</div>
                    </div>
                    <span className="font-mono font-bold text-blue-700">+28% Gain</span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Level 3: Behavior</div>
                      <div className="text-[10px] text-slate-500">On-the-job application in CAD assemblies</div>
                    </div>
                    <span className="font-mono font-bold text-primary">In Progress</span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Level 4: Results & ROI</div>
                      <div className="text-[10px] text-slate-500">Defect reduction & FEA turn-around speed</div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">3.8x ROI Target</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast.success("Effectiveness report synthesized and saved")}
                  className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold text-xs transition cursor-pointer"
                >
                  Save Effectiveness Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Certification & ROI */}
        {activeTab === "certification" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Issued Course Certificates & Training Cost ROI</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">8 Certificates Generated • Budget: ₹ 15,000 • Est. Product Yield Savings: ₹ 58,000</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("Batch certificates generated and dispatched")}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="h-3.5 w-3.5" />
                  Generate All Certificates
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                      <th className="py-2.5 px-3">Certificate ID</th>
                      <th className="py-2.5 px-3">Candidate</th>
                      <th className="py-2.5 px-3">Certification Title</th>
                      <th className="py-2.5 px-3">Issue Date</th>
                      <th className="py-2.5 px-3">Validity</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: "CERT-CAD-001", name: "Sankaranarayanan R", title: "Advanced Parametric CAD & FEA Specialist", date: "21 May 2024", validity: "2 Years" },
                      { id: "CERT-CAD-002", name: "Priya Nair", title: "Advanced Parametric CAD & FEA Specialist", date: "21 May 2024", validity: "2 Years" },
                      { id: "CERT-CAD-003", name: "Karthik Subramanian", title: "Advanced Parametric CAD & FEA Specialist", date: "21 May 2024", validity: "2 Years" },
                      { id: "CERT-CAD-004", name: "Ananya Iyer", title: "Advanced Parametric CAD & FEA Specialist", date: "21 May 2024", validity: "2 Years" },
                    ].map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-mono font-bold text-primary">{cert.id}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{cert.name}</td>
                        <td className="py-3 px-3 text-slate-700">{cert.title}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{cert.date}</td>
                        <td className="py-3 px-3 text-slate-600">{cert.validity}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => toast.success(`Downloading certificate ${cert.id}`)}
                            className="inline-flex items-center gap-1 text-primary hover:text-blue-700 font-semibold cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
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
                <CheckSquare className="h-4 w-4 text-primary" />
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
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary font-semibold cursor-pointer"
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

export default LearningDevelopmentPage;

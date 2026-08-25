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
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/management/hrm-management/onboarding-management")({
  head: () => ({
    meta: [
      { title: "Onboarding Management · HRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "The Onboarding Form manages the complete employee transition from offer acceptance → pre-joining → joining → documentation → induction → access provisioning → training → department handover → probation tracking → onboarding completion → employee integration → analytics.",
      },
    ],
  }),
  component: OnboardingManagementPage,
});

// --- Types & Models ---

export type OnboardingStatusType =
  | "Pre-Joining"
  | "Joining Scheduled"
  | "Joined"
  | "Documentation"
  | "Employee Created"
  | "Induction"
  | "Access Provisioning"
  | "Training"
  | "Department Handover"
  | "Probation Monitoring"
  | "Feedback"
  | "Completed";

export interface OnboardingMaster {
  onboardingId: string;
  onboardingNumber: string;
  candidateName: string;
  candidateAvatar: string;
  position: string;
  status: "In Progress" | "Completed" | "Pending" | "At Risk";
  currentStage: OnboardingStatusType;
  joiningDate: string;
  department: string;
  reportingManager: { name: string; avatar: string; email: string; phone: string };
  location: string;
  onboardingType: "New Employee" | "Internal Transfer" | "Promotion" | "Rehire" | "Contract Employee" | "Apprentice" | "Intern";
  targetCompletionDate: string;
  employeeId: string;
  email: string;
  phone: string;
  employmentType: string;
  workMode: "Hybrid" | "Work From Office" | "Remote";
  probationPeriod: string;
  buddy: { name: string; role: string; email: string; phone: string; avatar: string };
  hrOwner: { name: string; role: string; email: string; phone: string; avatar: string };
  notes: string;
}

export interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  category: "HR" | "IT" | "Training" | "Department" | "Compliance";
  status: "Completed" | "In Progress" | "Pending";
}

export interface ChecklistCategoryProgress {
  name: string;
  completed: number;
  total: number;
  percentage: number;
  status: "Completed" | "In Progress" | "Not Started";
  color: string;
  iconBg: string;
  iconColor: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  timestamp: string;
  type: "access" | "induction" | "docs" | "erp" | "joined";
}

// Initial Data
const INITIAL_MASTER: OnboardingMaster = {
  onboardingId: "ONB-2024-8819",
  onboardingNumber: "ONB-2024-00125",
  candidateName: "Priya Nair",
  candidateAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
  position: "Senior Software Engineer",
  status: "In Progress",
  currentStage: "Access Provisioning",
  joiningDate: "20 May 2024",
  department: "Engineering",
  reportingManager: {
    name: "Arun Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    email: "arun.kumar@magnertia.com",
    phone: "+91 98765 11223",
  },
  location: "Coimbatore",
  onboardingType: "New Employee",
  targetCompletionDate: "19 Aug 2024 (90 Days)",
  employeeId: "EMP-2024-0128",
  email: "priya.nair@magnertia.com",
  phone: "+91 98765 43210",
  employmentType: "Full Time",
  workMode: "Hybrid",
  probationPeriod: "6 Months",
  buddy: {
    name: "Karthik Subramanian",
    role: "Senior Developer",
    email: "karthik.sub@magnertia.com",
    phone: "+91 98876 54321",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
  },
  hrOwner: {
    name: "Neha Kapoor",
    role: "HR Executive",
    email: "neha.kapoor@magnertia.com",
    phone: "+91 97865 12345",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
  notes: "Priya has completed induction successfully. Awaiting system access provisioning and product training.",
};

const STAGES_PIPELINE = [
  { id: "pre-joining", name: "Pre-Joining", status: "Completed", date: "03 May 2024", icon: CheckCircle2, state: "done" },
  { id: "joining", name: "Joining", status: "Completed", date: "20 May 2024", icon: CheckCircle2, state: "done" },
  { id: "docs", name: "Documentation", status: "Completed", date: "22 May 2024", icon: CheckCircle2, state: "done" },
  { id: "emp-created", name: "Employee Created", status: "Completed", date: "22 May 2024", icon: CheckCircle2, state: "done" },
  { id: "induction", name: "Induction", status: "Completed", date: "24 May 2024", icon: CheckCircle2, state: "done" },
  { id: "access", name: "Access Provisioning", status: "In Progress", date: "2/3 Completed", icon: Laptop, state: "active" },
  { id: "training", name: "Training", status: "Pending", date: "0/3 Completed", icon: GraduationCap, state: "pending" },
  { id: "handover", name: "Dept. Handover", status: "Pending", date: "0/2 Completed", icon: Users, state: "pending" },
  { id: "probation", name: "Probation", status: "Pending", date: "Starts 20 May 2024", icon: Shield, state: "pending" },
  { id: "feedback", name: "Feedback", status: "Pending", date: "-", icon: MessageCircle, state: "pending" },
  { id: "completed", name: "Completed", status: "Pending", date: "-", icon: Flag, state: "pending" },
];

const ONBOARDING_PROGRESS_PIE = [
  { name: "Completed", value: 6, color: "#10B981" },
  { name: "In Progress", value: 1, color: "#2563EB" },
  { name: "Pending", value: 4, color: "#F59E0B" },
  { name: "Not Started", value: 1, color: "#94A3B8" },
];

const CHECKLIST_METRICS: ChecklistCategoryProgress[] = [
  {
    name: "Pre-Joining Checklist",
    completed: 10,
    total: 10,
    percentage: 100,
    status: "Completed",
    color: "text-emerald-600",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    name: "Documentation",
    completed: 12,
    total: 14,
    percentage: 86,
    status: "In Progress",
    color: "text-purple-600",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    name: "Induction",
    completed: 5,
    total: 5,
    percentage: 100,
    status: "Completed",
    color: "text-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    name: "Access & Assets",
    completed: 2,
    total: 3,
    percentage: 67,
    status: "In Progress",
    color: "text-amber-600",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    name: "Training",
    completed: 1,
    total: 3,
    percentage: 33,
    status: "In Progress",
    color: "text-teal-600",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    name: "Department Handover",
    completed: 0,
    total: 2,
    percentage: 0,
    status: "Not Started",
    color: "text-rose-600",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

const RECENT_ACTIVITIES: RecentActivity[] = [
  { id: "1", title: "IT Access requested for Email & ERP", timestamp: "24 May 2024, 09:45 AM", type: "access" },
  { id: "2", title: "Induction completed - Company Overview", timestamp: "24 May 2024, 11:30 AM", type: "induction" },
  { id: "3", title: "Documents verified - PAN Card", timestamp: "22 May 2024, 03:10 PM", type: "docs" },
  { id: "4", title: "Employee record created in ERP", timestamp: "22 May 2024, 04:45 PM", type: "erp" },
  { id: "5", title: "Joined the organization", timestamp: "20 May 2024, 09:15 AM", type: "joined" },
];

export default function OnboardingManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [master, setMaster] = useState<OnboardingMaster>(INITIAL_MASTER);

  const handleSave = () => {
    toast.success(`Onboarding Record ${master.onboardingNumber} saved successfully`, {
      description: "Milestones, IT provisioning, and task updates saved to central database.",
    });
  };

  const handleExportData = (type: "excel" | "pdf") => {
    toast.success(`Onboarding record exported as ${type.toUpperCase()}`, {
      description: `Downloaded ONB-2024-00125_${new Date().toISOString().slice(0, 10)}.${type === "excel" ? "xlsx" : "pdf"}`,
    });
  };

  return (
    <AppShell
      title="Onboarding Management"
      breadcrumb="Management > HRM Management > Onboarding Management"
      description="The Onboarding Form manages the complete employee transition from offer acceptance → pre-joining → joining → documentation → induction → access provisioning → training → department handover → probation tracking → onboarding completion → employee integration → analytics."
      tabs={<HrmManagementTabBar />}
    >
      <div className="flex flex-col w-full text-slate-800 space-y-6 pt-2 pb-16">
        {/* Action Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Onboarding Form
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
              <button
                type="button"
                onClick={() => handleExportData("pdf")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Send Email
              </button>
              <button
                type="button"
                onClick={() => handleExportData("excel")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                More
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* 1. Onboarding Master Profile & Header Card (Exact visual match to reference image) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-6">
          {/* Candidate Profile Details Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Candidate Identity */}
            <div className="flex items-center gap-4">
              <img
                src={master.candidateAvatar}
                alt={master.candidateName}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-slate-100 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-900 text-base">{master.onboardingNumber}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {master.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{master.candidateName}</h3>
                <div className="text-xs text-muted-foreground font-medium">{master.position}</div>
              </div>
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs divide-x divide-slate-100">
              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Joining Date
                </span>
                <div className="font-bold text-slate-900 mt-0.5">{master.joiningDate}</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Department
                </span>
                <div className="font-bold text-slate-900 mt-0.5">{master.department}</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Reporting Manager
                </span>
                <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <img src={master.reportingManager.avatar} alt="manager" className="h-4 w-4 rounded-full" />
                  <span className="truncate">{master.reportingManager.name}</span>
                </div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Location
                </span>
                <div className="font-bold text-slate-900 mt-0.5">{master.location}</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> Onboarding Type
                </span>
                <div className="font-bold text-slate-900 mt-0.5">{master.onboardingType}</div>
              </div>

              <div className="px-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3" /> Target Completion
                </span>
                <div className="font-bold text-slate-900 mt-0.5">{master.targetCompletionDate}</div>
              </div>
            </div>
          </div>

          {/* 11-Step Visual Milestone Pipeline (Full Horizontal Tracker) */}
          <div className="pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar">
            <div className="flex items-center min-w-[980px] justify-between relative py-2">
              {STAGES_PIPELINE.map((stage, idx) => {
                const isDone = stage.state === "done";
                const isActive = stage.state === "active";
                const isPending = stage.state === "pending";

                return (
                  <div key={stage.id} className="flex flex-col items-center text-center relative z-10 group min-w-[80px]">
                    {/* Node Icon */}
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition shadow-2xs mb-1.5",
                        isDone
                          ? "bg-emerald-600 text-white"
                          : isActive
                            ? "bg-blue-600 text-white ring-4 ring-blue-100"
                            : "bg-slate-100 text-slate-400 border border-slate-200",
                      )}
                    >
                      {isDone ? <Check className="h-4 w-4 stroke-[3]" /> : <stage.icon className="h-4 w-4" />}
                    </div>

                    {/* Step Title */}
                    <span
                      className={cn(
                        "text-[11px] font-bold truncate max-w-[85px]",
                        isDone
                          ? "text-slate-800"
                          : isActive
                            ? "text-blue-600 font-extrabold"
                            : "text-slate-500 font-medium",
                      )}
                    >
                      {stage.name}
                    </span>

                    {/* Status Subtitle */}
                    <span
                      className={cn(
                        "text-[9px] font-semibold",
                        isDone
                          ? "text-emerald-700"
                          : isActive
                            ? "text-blue-600 font-bold"
                            : "text-slate-400",
                      )}
                    >
                      {stage.status}
                    </span>

                    {/* Date or details */}
                    <span className="text-[8px] text-muted-foreground truncate max-w-[80px]">
                      {stage.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "pre-joining", label: "Pre-Joining", icon: Calendar },
              { id: "documentation", label: "Documentation", icon: FileCheck },
              { id: "induction", label: "Induction", icon: GraduationCap },
              { id: "access", label: "Access & Assets", icon: Laptop },
              { id: "training", label: "Training", icon: BrainCircuit },
              { id: "handover", label: "Handover", icon: Users },
              { id: "probation", label: "Probation", icon: Shield },
              { id: "feedback", label: "Feedback", icon: MessageCircle },
              { id: "tasks", label: "Tasks", icon: CheckSquare },
              { id: "communication", label: "Communication", icon: Mail },
              { id: "files", label: "Files", icon: Paperclip },
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

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Row 1: Onboarding Progress, Key Information, Tasks Summary, Important Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Onboarding Progress (Donut Chart) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Onboarding Progress</h4>
                </div>

                <div className="h-36 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={ONBOARDING_PROGRESS_PIE}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={58}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {ONBOARDING_PROGRESS_PIE.map((entry, index) => (
                          <Cell key={`prog-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-extrabold text-slate-900 font-mono">55%</span>
                    <span className="text-[9px] text-muted-foreground">Overall Progress</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  {ONBOARDING_PROGRESS_PIE.map((p) => (
                    <div key={p.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-slate-600 truncate">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </span>
                      <span className="font-mono font-bold">{p.value}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[9px] text-muted-foreground text-center pt-1 border-t border-slate-100">
                  Last Updated: 24 May 2024, 10:30 AM ↻
                </div>
              </div>

              {/* 2. Key Information */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Key Information</h4>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CreditCardIcon className="h-3.5 w-3.5 text-slate-400" /> Employee ID
                    </span>
                    <span className="font-mono font-bold text-slate-900">{master.employeeId}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
                    </span>
                    <span className="text-slate-800 font-medium truncate max-w-[150px]">{master.email}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone
                    </span>
                    <span className="font-mono text-slate-800">{master.phone}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> Work Location
                    </span>
                    <span className="text-slate-800 font-medium">{master.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Employment Type
                    </span>
                    <span className="text-slate-800 font-medium">{master.employmentType}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Laptop className="h-3.5 w-3.5 text-slate-400" /> Work Mode
                    </span>
                    <span className="text-slate-800 font-medium">{master.workMode}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-slate-400" /> Probation Period
                    </span>
                    <span className="text-slate-800 font-medium">{master.probationPeriod}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" /> Reporting Manager
                    </span>
                    <span className="text-slate-800 font-medium">{master.reportingManager.name}</span>
                  </div>
                </div>
              </div>

              {/* 3. Tasks Summary & Upcoming Tasks */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Tasks Summary</h4>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[9px] text-muted-foreground font-semibold">Total Tasks</div>
                    <div className="text-lg font-bold text-slate-900 font-mono">14</div>
                  </div>
                  <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-100">
                    <div className="text-[9px] text-emerald-700 font-semibold">Completed</div>
                    <div className="text-lg font-bold text-emerald-800 font-mono">7</div>
                  </div>
                  <div className="p-2 bg-blue-50/60 rounded-lg border border-blue-100">
                    <div className="text-[9px] text-blue-700 font-semibold">In Progress</div>
                    <div className="text-lg font-bold text-blue-800 font-mono">3</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-slate-800">Upcoming Tasks</span>
                    <button onClick={() => setActiveTab("tasks")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                      View All
                    </button>
                  </div>

                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex items-center justify-between p-1.5 rounded-md bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-900">Complete IT Access Setup</div>
                        <div className="text-[9px] text-muted-foreground">IT Team</div>
                      </div>
                      <span className="font-mono text-rose-600 font-semibold">25 May 2024</span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-md bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-900">Product Training - Basics</div>
                        <div className="text-[9px] text-muted-foreground">Training Team</div>
                      </div>
                      <span className="font-mono text-slate-600">27 May 2024</span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-md bg-slate-50 border border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-900">Department Orientation</div>
                        <div className="text-[9px] text-muted-foreground">Eng. Manager</div>
                      </div>
                      <span className="font-mono text-slate-600">28 May 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Important Dates */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Important Dates</h4>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Offer Accepted</span>
                    <span className="font-mono font-semibold text-slate-800">02 May 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Joining Date</span>
                    <span className="font-mono font-bold text-slate-900">20 May 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Probation Start</span>
                    <span className="font-mono font-semibold text-slate-800">20 May 2024</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Probation End</span>
                    <span className="font-mono font-semibold text-slate-800">19 Nov 2024</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="font-semibold text-slate-800">Target Completion</span>
                    <span className="font-mono font-bold text-primary">19 Aug 2024</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-[10px] text-blue-800 leading-snug">
                  <strong>30-Day Check-in</strong> scheduled on <strong>20 Jun 2024</strong> with Arun Kumar.
                </div>
              </div>
            </div>

            {/* Row 2: Checklist Overview (6 Circular Cards) + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 8-Cols: Checklist Overview */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Checklist Overview</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {CHECKLIST_METRICS.map((item) => (
                    <div
                      key={item.name}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 flex flex-col items-center text-center justify-between space-y-2"
                    >
                      <div className="text-[10px] font-bold text-slate-700 h-7 flex items-center justify-center">
                        {item.name}
                      </div>

                      {/* Circular counter */}
                      <div className="h-14 w-14 rounded-full border-4 border-slate-100 flex flex-col items-center justify-center bg-white shadow-2xs">
                        <span className="text-xs font-extrabold text-slate-900 font-mono">
                          {item.completed}/{item.total}
                        </span>
                        <span className="text-[8px] text-muted-foreground">{item.percentage}%</span>
                      </div>

                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold",
                          item.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "In Progress"
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

              {/* Right 4-Cols: Recent Activity */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent Activity</h4>
                  <button onClick={() => setActiveTab("tasks")} className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="space-y-2 text-[10px]">
                  {RECENT_ACTIVITIES.map((act) => (
                    <div key={act.id} className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">{act.title}</div>
                        <div className="text-[9px] text-muted-foreground">{act.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Notes, Mentor/Buddy, Onboarding Owner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Notes */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Notes</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  {master.notes}
                </p>
              </div>

              {/* Mentor / Buddy */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Mentor / Buddy</h4>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <img src={master.buddy.avatar} alt="buddy" className="h-10 w-10 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900">{master.buddy.name}</div>
                    <div className="text-[10px] text-muted-foreground">{master.buddy.role}</div>
                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">{master.buddy.phone}</div>
                  </div>
                </div>
              </div>

              {/* Onboarding Owner */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Onboarding Owner</h4>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <img src={master.hrOwner.avatar} alt="hr" className="h-10 w-10 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900">{master.hrOwner.name}</div>
                    <div className="text-[10px] text-muted-foreground">{master.hrOwner.role}</div>
                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">{master.hrOwner.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRE-JOINING */}
        {activeTab === "pre-joining" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Pre-Joining Checklist & Readiness
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { title: "Joining Confirmation Received", status: "Completed", date: "02 May 2024" },
                { title: "Pre-Joining Documents Requested", status: "Completed", date: "03 May 2024" },
                { title: "Background Verification Initiated", status: "Completed", date: "05 May 2024" },
                { title: "Medical Check & Fitness Report", status: "Completed", date: "10 May 2024" },
                { title: "IT Hardware (Laptop & Accessories) Prepared", status: "Completed", date: "16 May 2024" },
                { title: "Workstation Allocation & Ergonomic Setup", status: "Completed", date: "17 May 2024" },
                { title: "System Access Requests Raised", status: "Completed", date: "18 May 2024" },
                { title: "Welcome Kit & ID Badge Prepared", status: "Completed", date: "19 May 2024" },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="font-semibold text-slate-800">{item.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500">{item.date}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTATION */}
        {activeTab === "documentation" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-purple-600" />
                Employee Documentation & Compliance Verification
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { name: "PAN Card", number: "ABCDE1234F", status: "Verified", date: "22 May 2024" },
                { name: "Aadhaar Card", number: "XXXX-XXXX-9876", status: "Verified", date: "22 May 2024" },
                { name: "Educational Certificates (B.Tech, M.S.)", number: "CERT-99012", status: "Verified", date: "22 May 2024" },
                { name: "Relieving Letter & Experience Proof", number: "EXP-INFY-2024", status: "Verified", date: "22 May 2024" },
                { name: "Bank Passbook & Cancelled Cheque", number: "HDFC-001928", status: "Verified", date: "23 May 2024" },
                { name: "Signed Employment Agreement & NDA", number: "AGR-2024-0012", status: "Pending Verification", date: "Awaiting Signature" },
              ].map((doc) => (
                <div key={doc.name} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{doc.name}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        doc.status === "Verified"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200",
                      )}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">Number: <span className="font-mono text-slate-800">{doc.number}</span></div>
                  <div className="text-[10px] text-slate-400">Verification Date: {doc.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

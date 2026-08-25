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
  { id: "docs", name: "Documentation", status: "Completed", date: "22 May 2024", icon: CheckCircle2, state: "done" },
  { id: "access", name: "Access & Assets", status: "In Progress", date: "2/3 Completed", icon: Laptop, state: "active" },
  { id: "induction", name: "Induction & Training", status: "In Progress", date: "Day 3 of 5", icon: GraduationCap, state: "active" },
  { id: "handover", name: "Dept. Handover", status: "Pending", date: "Starts 27 May", icon: Users, state: "pending" },
  { id: "probation", name: "Probation & Review", status: "Pending", date: "90-Day Target", icon: Shield, state: "pending" },
];

export default function OnboardingManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("pre-joining");
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
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            {/* Candidate Identity */}
            <div className="shrink-0 min-w-[220px]">
              <div className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="font-mono font-bold text-slate-900 text-base tracking-tight">{master.onboardingNumber}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {master.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{master.candidateName}</h3>
              <div className="text-xs text-muted-foreground font-medium">{master.position}</div>
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 text-xs divide-x divide-slate-100 flex-1">
              <div className="px-3">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" /> Joining Date
                </span>
                <div className="font-bold text-slate-900 mt-0.5 whitespace-nowrap">{master.joiningDate}</div>
              </div>

              <div className="px-3">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-slate-400" /> Department
                </span>
                <div className="font-bold text-slate-900 mt-0.5 whitespace-nowrap">{master.department}</div>
              </div>

              <div className="px-3">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" /> Reporting Manager
                </span>
                <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span className="truncate whitespace-nowrap">{master.reportingManager.name}</span>
                </div>
              </div>

              <div className="px-3">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" /> Location
                </span>
                <div className="font-bold text-slate-900 mt-0.5 whitespace-nowrap">{master.location}</div>
              </div>

              <div className="px-3">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-slate-400" /> Onboarding Type
                </span>
                <div className="font-bold text-slate-900 mt-0.5 whitespace-nowrap">{master.onboardingType}</div>
              </div>

              <div className="px-3">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3 text-slate-400" /> Target Completion
                </span>
                <div className="font-bold text-slate-900 mt-0.5 whitespace-nowrap">{master.targetCompletionDate}</div>
              </div>
            </div>
          </div>

          {/* 6-Stage Visual Milestone Pipeline with Connecting Track */}
          <div className="pt-4 border-t border-slate-100">
            <div className="relative py-2">
              {/* Horizontal Connecting Progress Line */}
              <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-200 z-0 hidden sm:block" />
              <div className="absolute top-5 left-10 w-1/2 h-0.5 bg-emerald-500 z-0 hidden sm:block" />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
                {STAGES_PIPELINE.map((stage) => {
                  const isDone = stage.state === "done";
                  const isActive = stage.state === "active";

                  return (
                    <div key={stage.id} className="flex flex-col items-center text-center p-2 rounded-xl hover:bg-slate-50/70 transition">
                      {/* Node Icon */}
                      <div
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center transition shadow-2xs mb-2 bg-white",
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
                          "text-xs font-bold whitespace-nowrap",
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
                          "text-[10px] font-semibold mt-0.5",
                          isDone
                            ? "text-emerald-700 font-bold"
                            : isActive
                              ? "text-blue-600 font-bold"
                              : "text-slate-400",
                        )}
                      >
                        {stage.status}
                      </span>

                      {/* Date */}
                      <span className="text-[9px] text-muted-foreground mt-0.5">
                        {stage.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1.5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {[
              { id: "pre-joining", label: "Pre-Joining", icon: Calendar },
              { id: "documentation", label: "Documentation", icon: FileCheck },
              { id: "access", label: "Access & Assets", icon: Laptop },
              { id: "induction", label: "Induction & Training", icon: GraduationCap },
              { id: "handover", label: "Department Handover", icon: Users },
              { id: "probation", label: "Probation & Feedback", icon: Shield },
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

        {/* TAB 2: DOCUMENTATION */}
        {activeTab === "documentation" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-purple-600" />
                  Employee Documentation & Compliance Verification
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  KYC, identity proofs, educational transcripts, previous employment relieving letters, and signed NDAs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Document upload dialog launched")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Upload Document
              </button>
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

        {/* TAB 3: ACCESS & ASSETS */}
        {activeTab === "access" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-primary" />
                  Hardware Assets & System Access Provisioning
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Allocated company assets, IT hardware, email accounts, and repository permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Asset allocation request submitted to IT")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Request New Asset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-blue-600" />
                  Allocated Hardware Assets
                </h4>
                <div className="space-y-2">
                  {[
                    { item: "MacBook Pro 16\" M3 Max", tag: "AST-2024-0089", status: "Handed Over", date: "20 May 2024" },
                    { item: "Dell 27\" 4K USB-C Monitor", tag: "AST-2024-0142", status: "Handed Over", date: "20 May 2024" },
                    { item: "Smart NFC Access Card & ID Badge", tag: "ID-2024-1102", status: "Active", date: "20 May 2024" },
                  ].map((ast) => (
                    <div key={ast.tag} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                      <div>
                        <div className="font-bold text-slate-900">{ast.item}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{ast.tag} • Assigned {ast.date}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ast.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Software, Cloud & Repository Access
                </h4>
                <div className="space-y-2">
                  {[
                    { system: "Corporate Google Workspace Email", role: "priya.nair@magnertia.com", status: "Provisioned" },
                    { system: "Magnertia ERP & HRM Admin Portal", role: "Engineering Team Member", status: "Provisioned" },
                    { system: "GitHub Firmware & BMS Repositories", role: "Developer (Write Access)", status: "Pending IT" },
                    { system: "Jira & Confluence Workspaces", role: "Engineering Contributor", status: "Provisioned" },
                  ].map((sys) => (
                    <div key={sys.system} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                      <div>
                        <div className="font-bold text-slate-900">{sys.system}</div>
                        <div className="text-[10px] text-muted-foreground">{sys.role}</div>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                          sys.status === "Provisioned"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200",
                        )}
                      >
                        {sys.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INDUCTION & TRAINING */}
        {activeTab === "induction" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Company Induction & Technical Training Roadmap
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Orientation schedule, company culture briefing, safety certifications, and functional onboarding training.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: "Day 1: Corporate Induction & Leadership Overview", time: "10:00 AM - 01:00 PM", trainer: "HR & Leadership Team", status: "Completed" },
                { title: "Day 2: IT Security, GDPR & Intellectual Property Policies", time: "11:00 AM - 01:00 PM", trainer: "IT Security Officer", status: "Completed" },
                { title: "Day 3: EV Architecture & BMS System Deep Dive", time: "02:00 PM - 05:00 PM", trainer: "Arun Kumar (Engineering Lead)", status: "In Progress" },
                { title: "Day 4: Factory Floor Safety & ESD Protocols Certification", time: "10:30 AM - 12:30 PM", trainer: "EHS Manager", status: "Scheduled" },
                { title: "Day 5: Agile Sprint Rhythms & Code Review Standards", time: "03:00 PM - 04:30 PM", trainer: "Karthik Subramanian (Buddy)", status: "Scheduled" },
              ].map((sess) => (
                <div key={sess.title} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/40">
                  <div>
                    <div className="font-bold text-slate-900">{sess.title}</div>
                    <div className="text-[10px] text-muted-foreground">{sess.time} • Instructor: {sess.trainer}</div>
                  </div>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                      sess.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : sess.status === "In Progress"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-700",
                    )}
                  >
                    {sess.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DEPARTMENT HANDOVER */}
        {activeTab === "handover" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Department Handover & Mentorship Program
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Assigned team buddy, initial 30-day deliverables, team syncs, and project repository access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="font-bold text-slate-900">Assigned Mentor / Buddy</h4>
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm">{master.buddy.name}</div>
                  <div className="text-muted-foreground">{master.buddy.role} • Engineering Department</div>
                  <div className="text-[11px] text-slate-600">{master.buddy.email} • {master.buddy.phone}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("1-on-1 check-in meeting scheduled with Buddy")}
                  className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition shadow-xs cursor-pointer text-center"
                >
                  Schedule 1-on-1 Sync
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="font-bold text-slate-900">First 30 Days Key Goals</h4>
                <div className="space-y-2">
                  {[
                    { goal: "Complete BMS Firmware codebase setup and local build", status: "Done" },
                    { goal: "Submit first PR for CAN telemetry driver unit tests", status: "In Progress" },
                    { goal: "Review ISO 26262 functional safety architecture documentation", status: "Pending" },
                  ].map((g) => (
                    <div key={g.goal} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                      <span className="font-medium text-slate-800 text-[11px]">{g.goal}</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ml-2",
                          g.status === "Done"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : g.status === "In Progress"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-700",
                        )}
                      >
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PROBATION & FEEDBACK */}
        {activeTab === "probation" && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Probation Tracking & Onboarding Feedback Reviews
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Probation Duration: {master.probationPeriod} • Target Confirmation Date: {master.targetCompletionDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Probation review form initiated")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Submit Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-emerald-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">30-Day Check-in</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Completed
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">Score: <strong className="font-mono text-emerald-700">4.5 / 5.0</strong></div>
                <p className="text-slate-500 text-[10px]">Candidate has integrated smoothly into the core firmware team and completed all mandatory safety courses.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-blue-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">60-Day Mid Review</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Scheduled
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">Due Date: <strong className="font-mono text-slate-800">20 Jul 2024</strong></div>
                <p className="text-slate-500 text-[10px]">Mid-probation milestone assessment covering code quality, project throughput, and peer collaboration.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">90-Day Final Confirmation</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                    Upcoming
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">Due Date: <strong className="font-mono text-slate-800">19 Aug 2024</strong></div>
                <p className="text-slate-500 text-[10px]">Manager and HR final appraisal for employment confirmation and regularization sign-off.</p>
              </div>
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

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Save,
  Send,
  Plus,
  Sliders,
  Clock,
  UserCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Upload,
  Download,
  Share2,
  Lock,
  Archive,
  Edit,
  Building,
  Briefcase,
  FolderTree,
  User,
  Shield,
  Activity,
  History,
  File,
  Check,
  ChevronRight,
  Users,
  GraduationCap,
  Megaphone,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/policy-management")({
  head: () => ({
    meta: [
      { title: "Policy Management · Magnertia ERP" },
      {
        name: "description",
        content: "Manage complete policy governance lifecycle from drafting, classification, framework, review, approval, publication, communication, acknowledgement, to implementation and monitoring.",
      },
    ],
  }),
  component: PolicyManagementPage,
});

// --- Data & Mock Definitions ---

const POLICY_TYPES = [
  "Corporate Policy",
  "Management Policy",
  "Operational Policy",
  "Financial Policy",
  "HR Policy",
  "IT Policy",
  "Information Security Policy",
  "Procurement Policy",
  "Quality Policy",
  "Compliance Policy",
  "Legal Policy",
  "Risk Policy",
  "Environmental Policy",
  "Sustainability Policy",
  "Data Policy",
  "Technology Policy",
  "Customer Policy",
  "Supplier Policy",
  "Franchise Policy",
  "Project Policy",
];

const POLICY_REVIEW_APPROVAL_STEPS = [
  { level: 1, type: "Functional Review", person: "Rahul Sharma", status: "Approved", date: "08 Apr 2024", comments: "Looks good" },
  { level: 2, type: "Compliance Review", person: "Pooja Mehta", status: "Approved", date: "09 Apr 2024", comments: "Compliant" },
  { level: 3, type: "Risk Assessment", person: "Anita Deshmukh", status: "Approved", date: "10 Apr 2024", comments: "Risk acceptable" },
  { level: 4, type: "Management Review", person: "Neha Kapoor", status: "Approved", date: "11 Apr 2024", comments: "Approved" },
  { level: 5, type: "Final Approval", person: "Sanjay Gupta", status: "Approved", date: "12 Apr 2024", comments: "Approved" },
  { level: 6, type: "Publication", person: "Amit Verma", status: "Published", date: "15 Apr 2024", comments: "Published" },
];

const RECENT_POLICY_VERSIONS = [
  { id: "VER-103", version: "v1.2", effectiveDate: "01 Apr 2024", publishedOn: "15 Apr 2024", changeType: "Minor Revision", changedBy: "Amit Verma", status: "Active", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "VER-102", version: "v1.1", effectiveDate: "01 Jan 2024", publishedOn: "05 Jan 2024", changeType: "Minor Revision", changedBy: "Amit Verma", status: "Superseded", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "VER-101", version: "v1.0", effectiveDate: "01 Apr 2023", publishedOn: "01 Apr 2023", changeType: "Initial Version", changedBy: "Amit Verma", status: "Superseded", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
];

export function PolicyManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "summary"
    | "classification"
    | "purpose"
    | "ownership"
    | "framework"
    | "draft"
    | "review"
    | "versions"
    | "communication"
    | "acknowledgement"
    | "implementation"
    | "attachments"
    | "audit"
    | "history"
  >("summary");

  // Master Form State
  const [policyMaster, setPolicyMaster] = useState({
    policyId: "POL-2024-00057",
    policyNumber: "FIN-POL-005",
    policyTitle: "Travel & Expense Policy",
    policyType: "Operational Policy",
    policyCategory: "Human Resources",
    module: "Human Capital Management",
    process: "Employee Management",
    department: "Human Resources",
    policyOwner: "Neha Kapoor",
    policyAdmin: "Amit Verma",
    policyStatus: "Published",
    effectiveDate: "2024-04-01",
    reviewDate: "2025-04-01",
    expiryDate: "2026-03-31",
    currentVersion: "v1.2",
    description: "This policy defines the guidelines and rules for official travel, allowable expenses, reimbursements and related approvals.",
    objective: "Ensure standardization, cost control and compliance in all employee travel and expense claims.",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Policy Management"
      breadcrumb="Management > Administration Management > Policy Management"
      description="Manage the complete governance lifecycle of organizational policies—from drafting, framework, review, approval, publication, communication, acknowledgement, to implementation and audit."
      tabs={<AdminManagementTabBar />}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#0a192f] border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Header Actions & Workflow Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">Policy Management Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {policyMaster.policyStatus}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  {policyMaster.currentVersion}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Organizational Policy Governance & Compliance Architecture
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Policy document preview viewer opened.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview Policy
            </button>

            <button
              onClick={() => showNotification("New policy version v1.3 draft initiated.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600" />
              Create Version
            </button>

            <button
              onClick={() => showNotification("Policy Master record saved successfully.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Submitted for Compliance & Executive Board Approval.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Policy Master Form & Snapshot Side Card (Matching Attached Reference Screenshot) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Policy Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Policy Master
              </h3>
              <span className="text-[11px] text-muted-foreground font-medium">
                MAICW Fields: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
                <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
                <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
                <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
                <span className="text-rose-500 font-bold">W</span> (Workflow)
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Auto Fields */}
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={policyMaster.policyId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy Number *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  value={policyMaster.policyNumber}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, policyNumber: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy Title *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={policyMaster.policyTitle}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, policyTitle: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={policyMaster.policyType}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, policyType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {POLICY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy Category *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={policyMaster.policyCategory}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, policyCategory: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="IT & Security">IT & Security</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Module *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={policyMaster.module}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, module: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Human Capital Management">Human Capital Management</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Process</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={policyMaster.process}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, process: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Employee Management">Employee Management</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={policyMaster.department}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, department: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy Owner *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={policyMaster.policyOwner}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, policyOwner: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Neha Kapoor">Neha Kapoor (HR Director)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy Administrator *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={policyMaster.policyAdmin}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, policyAdmin: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Amit Verma">Amit Verma (HR Manager)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={policyMaster.policyStatus}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, policyStatus: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Superseded">Superseded</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective Date *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={policyMaster.effectiveDate}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, effectiveDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Review Date *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={policyMaster.reviewDate}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, reviewDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Expiry Date</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={policyMaster.expiryDate}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, expiryDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Current Version</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={policyMaster.currentVersion}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy Description *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <textarea
                  rows={2}
                  value={policyMaster.description}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Policy Objective *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <textarea
                  rows={2}
                  value={policyMaster.objective}
                  onChange={(e) => setPolicyMaster({ ...policyMaster, objective: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right 3 columns: Policy Snapshot Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Policy Snapshot</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {policyMaster.policyStatus}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Version</span>
                  <span className="font-bold text-foreground font-mono">v1.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Published On</span>
                  <span className="font-mono text-muted-foreground text-[10px]">15 Apr 2024 10:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Next Review Date</span>
                  <span className="font-mono text-foreground text-[10px]">01 Apr 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Versions</span>
                  <span className="font-bold text-foreground font-mono">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Acknowledgement</span>
                  <span className="font-bold text-primary font-mono">82 / 102 (80.39%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 border border-amber-500/20">
                    Medium
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Compliance Score</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Excellent</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full border-4 border-emerald-500 text-xs font-bold font-mono text-emerald-600">
                94%
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "summary", label: "Summary", icon: Layers },
              { key: "classification", label: "Classification", icon: Shield },
              { key: "purpose", label: "Purpose & Scope", icon: FileText },
              { key: "ownership", label: "Ownership", icon: UserCheck },
              { key: "framework", label: "Framework", icon: FolderTree },
              { key: "draft", label: "Draft", icon: File },
              { key: "review", label: "Review & Approval", icon: CheckCircle2 },
              { key: "versions", label: "Versions", icon: History },
              { key: "communication", label: "Communication", icon: Megaphone },
              { key: "acknowledgement", label: "Acknowledgement", icon: Users },
              { key: "implementation", label: "Implementation", icon: Sliders },
              { key: "attachments", label: "Attachments", icon: File },
              { key: "audit", label: "Audit Trail", icon: Activity },
              { key: "history", label: "History", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* SUMMARY / OVERVIEW TAB CONTENT (Matching attached screenshot layout) */}
          {activeTab === "summary" && (
            <div className="space-y-6">
              {/* Row 1: 2. Classification | 3. Ownership | 4. Review & Approval Status */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 2. Classification */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Classification
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Classification Level</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Level 2 - Department</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Confidentiality</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Internal</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Business Criticality</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>High</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Regulatory Category</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Internal Policy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Compliance Category</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>HR Compliance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Risk Category</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Operational Risk</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Security Classification</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Internal</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Applicability</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>All Employees</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Classification Owner</label>
                      <input
                        type="text"
                        readOnly
                        value="Pooja Mehta"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-border/50">
                      <span className="text-muted-foreground text-[11px]">Classification Status</span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Ownership */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Ownership
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Policy Owner</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center font-mono">
                          NK
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Neha Kapoor</span>
                          <span className="text-[10px] text-muted-foreground">HR Director</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Department Owner</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center font-mono">
                          NK
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Neha Kapoor</span>
                          <span className="text-[10px] text-muted-foreground">HR Director</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Process Owner</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-500/10 text-blue-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          VS
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Vikram Singh</span>
                          <span className="text-[10px] text-muted-foreground">HR Operations Head</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Reviewer</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          RS
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Rahul Sharma</span>
                          <span className="text-[10px] text-muted-foreground">Senior HR Analyst</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Author</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          AV
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Amit Verma</span>
                          <span className="text-[10px] text-muted-foreground">HR Manager</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Approver</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-rose-500/10 text-rose-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          SG
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Sanjay Gupta</span>
                          <span className="text-[10px] text-muted-foreground">Chief HR Officer</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Compliance Owner</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-purple-500/10 text-purple-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          PM
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Pooja Mehta</span>
                          <span className="text-[10px] text-muted-foreground">Compliance Manager</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Risk Owner</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-indigo-500/10 text-indigo-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          AD
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Anita Deshmukh</span>
                          <span className="text-[10px] text-muted-foreground">Risk Manager</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground">Ownership Status</span>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      Active
                    </span>
                  </div>
                </div>

                {/* 4. Review & Approval Status */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      4. Review & Approval Status
                    </h4>

                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                            <th className="py-1 px-1">Lvl</th>
                            <th className="py-1 px-1">Review / Approval</th>
                            <th className="py-1 px-1">Person</th>
                            <th className="py-1 px-1">Status</th>
                            <th className="py-1 px-1">Date</th>
                            <th className="py-1 px-1">Comments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-[10px]">
                          {POLICY_REVIEW_APPROVAL_STEPS.map((s) => (
                            <tr key={s.level} className="hover:bg-muted/30 transition-colors">
                              <td className="py-1 px-1 font-mono font-bold text-primary">{s.level}</td>
                              <td className="py-1 px-1 font-medium text-foreground">{s.type}</td>
                              <td className="py-1 px-1 text-muted-foreground">{s.person}</td>
                              <td className="py-1 px-1">
                                <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[9px] font-bold text-emerald-600">
                                  {s.status}
                                </span>
                              </td>
                              <td className="py-1 px-1 font-mono text-[9px] text-muted-foreground">{s.date}</td>
                              <td className="py-1 px-1 text-muted-foreground truncate max-w-[80px]">{s.comments}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Full policy approval workflow diagram opened.")}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer pt-1"
                  >
                    View Full Workflow
                  </button>
                </div>
              </div>

              {/* Row 2: 5. Policy Framework Overview | 6. Communications & Acknowledgement | 7. Quick Actions */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 5. Policy Framework Overview */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      5. Policy Framework Overview
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      {[
                        "Policy Statement",
                        "Authority",
                        "Principles",
                        "Controls",
                        "Rules",
                        "Exceptions",
                        "Requirements",
                        "Enforcement",
                        "Responsibilities",
                        "Monitoring",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between bg-muted/20 p-2 rounded-lg text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Total Sections</span>
                        <span className="font-bold text-foreground font-mono text-sm">10</span>
                      </div>
                      <div className="text-right text-[10px] text-muted-foreground">
                        Last Updated: <span className="font-mono text-foreground font-medium">10 Apr 2024</span>
                        <span className="block">by Amit Verma</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Policy Framework details opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View Framework
                  </button>
                </div>

                {/* 6. Communications & Acknowledgement */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      6. Communications & Acknowledgement
                    </h4>

                    {/* Donut Chart Graphic */}
                    <div className="flex items-center justify-center gap-6 py-3">
                      <div className="relative h-24 w-24 rounded-full border-8 border-emerald-500 border-t-amber-500 border-r-rose-500 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold font-mono text-foreground">102</span>
                        <span className="text-[9px] text-muted-foreground">Total Users</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-muted-foreground text-[11px]">Acknowledged (82)</span>
                          <span className="font-mono font-bold text-foreground ml-auto">80.39%</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-muted-foreground text-[11px]">Pending (16)</span>
                          <span className="font-mono font-bold text-foreground ml-auto">15.69%</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="text-muted-foreground text-[11px]">Overdue (4)</span>
                          <span className="font-mono font-bold text-foreground ml-auto">3.92%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Acknowledgement details opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

                {/* 7. Quick Actions & Recent Versions */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-xs">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      7. Quick Actions
                    </h4>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
                      <button
                        onClick={() => showNotification("Review request sent.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span>Request Review</span>
                      </button>

                      <button
                        onClick={() => showNotification("Approval request sent.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Request Approval</span>
                      </button>

                      <button
                        onClick={() => showNotification("Policy publication triggered.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Megaphone className="h-4 w-4 text-purple-600" />
                        <span>Publish Policy</span>
                      </button>

                      <button
                        onClick={() => showNotification("Policy broadcast notice sent.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Send className="h-4 w-4 text-blue-600" />
                        <span>Communicate Policy</span>
                      </button>

                      <button
                        onClick={() => showNotification("Training program setup opened.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <GraduationCap className="h-4 w-4 text-amber-600" />
                        <span>Manage Training</span>
                      </button>

                      <button
                        onClick={() => showNotification("Policy change request form opened.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4 text-indigo-600" />
                        <span>Change Request</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-3">
                    <h4 className="text-xs font-bold text-foreground mb-2">Recent Versions</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                            <th className="py-1 px-1">Version</th>
                            <th className="py-1 px-1">Effective Date</th>
                            <th className="py-1 px-1">Published On</th>
                            <th className="py-1 px-1">Change Type</th>
                            <th className="py-1 px-1">Changed By</th>
                            <th className="py-1 px-1">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-[10px]">
                          {RECENT_POLICY_VERSIONS.map((v) => (
                            <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-1 px-1 font-mono font-bold text-foreground">{v.version}</td>
                              <td className="py-1 px-1 font-mono text-muted-foreground">{v.effectiveDate}</td>
                              <td className="py-1 px-1 font-mono text-muted-foreground">{v.publishedOn}</td>
                              <td className="py-1 px-1 font-medium">{v.changeType}</td>
                              <td className="py-1 px-1 text-muted-foreground">{v.changedBy}</td>
                              <td className="py-1 px-1">
                                <span className={cn("rounded px-1 py-0.2 text-[9px] font-bold border", v.badge)}>
                                  {v.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS PLACEHOLDER */}
          {activeTab !== "summary" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="text-sm font-bold text-foreground capitalize">{activeTab} Workspace</h4>
                <span className="text-xs text-muted-foreground">Policy ID: POL-2024-00057</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed settings for <span className="font-semibold text-foreground capitalize">{activeTab}</span> adhering to MAICW specification.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Active Policy Version</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">v1.2 Published</span>
                  <p className="text-[11px] text-muted-foreground">Effective across all corporate entities.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Compliance Score</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">94.0%</span>
                  <p className="text-[11px] text-muted-foreground">Verified against HR regulatory standards.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Acknowledgement Rate</span>
                  <span className="text-xl font-bold font-mono text-primary">80.39%</span>
                  <p className="text-[11px] text-muted-foreground">82 of 102 target employees confirmed.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Classification & Modification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
            <span className="text-rose-500 font-bold">W</span> (Workflow)
          </div>
          <div>
            Last Modified: <span className="font-sans font-semibold text-foreground">15 Apr 2024 10:30 AM</span> by <span className="font-sans font-semibold text-foreground">Amit Verma</span> | Created By: <span className="font-sans font-semibold text-foreground">Amit Verma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

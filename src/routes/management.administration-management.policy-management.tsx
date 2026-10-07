import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPolicies } from "@/services";
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
  { level: 1, type: "HR Operations Review", person: "Deepa Nair", status: "Approved", date: "08 Apr 2024", comments: "Operational alignment verified." },
  { level: 2, type: "Legal & Statutory Review", person: "Pooja Hegde", status: "Approved", date: "09 Apr 2024", comments: "Statutory compliance confirmed." },
  { level: 3, type: "Risk Assessment", person: "Anita Deshmukh", status: "Approved", date: "10 Apr 2024", comments: "Enterprise risk acceptable." },
  { level: 4, type: "HR Leadership Review", person: "Meera Nair", status: "Approved", date: "11 Apr 2024", comments: "Policy terms approved." },
  { level: 5, type: "Executive Committee Approval", person: "Rajeev Malhotra", status: "Approved", date: "12 Apr 2024", comments: "Approved for enterprise release." },
  { level: 6, type: "Policy Secretariat", person: "Rohan Kapoor", status: "Published", date: "15 Apr 2024", comments: "Published to staff handbook." },
];

const RECENT_POLICY_VERSIONS = [
  { id: "VER-103", version: "v1.2", effectiveDate: "01 Apr 2024", publishedOn: "15 Apr 2024", changeType: "Minor Revision", changedBy: "Meera Nair", status: "Active", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "VER-102", version: "v1.1", effectiveDate: "01 Jan 2024", publishedOn: "05 Jan 2024", changeType: "Minor Revision", changedBy: "Meera Nair", status: "Superseded", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "VER-101", version: "v1.0", effectiveDate: "01 Apr 2023", publishedOn: "01 Apr 2023", changeType: "Initial Version", changedBy: "Pooja Hegde", status: "Superseded", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
];

function PolicyManagementPage() {
  const policiesQuery = useQuery({
    queryKey: ["admin", "policies"],
    queryFn: () => fetchPolicies(),
  });
  const [activeTab, setActiveTab] = useState<"summary" | "directory" | "governance" | "audit">("summary");

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
    policyOwner: "Meera Nair",
    policyAdmin: "Pooja Hegde",
    policyStatus: "Published",
    effectiveDate: "2024-04-01",
    reviewDate: "2025-04-01",
    expiryDate: "2026-03-31",
    currentVersion: "v1.2",
    description: "This policy defines the guidelines and rules for official travel, allowable expenses, reimbursements and related approvals.",
    objective: "Ensure standardization, cost control and compliance in all employee travel and expense claims.",
  });

  const FALLBACK_POLICIES = [
    { id: "POL-001", num: "FIN-POL-005", title: "Travel & Expense Policy", type: "Operational Policy", dept: "Human Resources", ver: "v1.2", status: "Published", owner: "Meera Nair", date: "15 Apr 2024" },
    { id: "POL-002", num: "SEC-POL-001", title: "Information Security Policy", type: "IT Policy", dept: "Cybersecurity", ver: "v2.0", status: "Published", owner: "Anita Deshmukh", date: "10 Apr 2024" },
    { id: "POL-003", num: "HR-POL-012", title: "Remote Working & Hybrid Policy", type: "HR Policy", dept: "Human Resources", ver: "v1.1", status: "Under Review", owner: "Deepa Nair", date: "08 Apr 2024" },
    { id: "POL-004", num: "GOV-POL-003", title: "Anti-Bribery & Whistleblower Policy", type: "Compliance Policy", dept: "Legal & Compliance", ver: "v3.0", status: "Published", owner: "Pooja Hegde", date: "01 Apr 2024" },
    { id: "POL-005", num: "OPS-POL-007", title: "Procurement Delegation Policy", type: "Financial Policy", dept: "Procurement", ver: "v1.0", status: "Draft", owner: "Tanvi Saxena", date: "28 Mar 2024" },
  ];
  const dbPolicies = (policiesQuery.data ?? []).map((p: any) => ({
    id: p.id,
    num: p.policyNumber,
    title: p.title,
    type: p.type ?? "Corporate Policy",
    dept: p.department ?? "",
    ver: p.version ?? "v1.0",
    status: p.status,
    owner: p.owner ?? "",
    date: new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  }));
  const [fallbackPolicies, setFallbackPolicies] = useState(FALLBACK_POLICIES);
  const mergedPolicies = dbPolicies.length > 0 ? dbPolicies : fallbackPolicies;

  const [reviewSteps, setReviewSteps] = useState([
    { level: 1, type: "HR Operations Review", person: "Deepa Nair", status: "Approved", date: "08 Apr 2024", comments: "Operational alignment verified." },
    { level: 2, type: "Legal & Statutory Review", person: "Pooja Hegde", status: "Approved", date: "09 Apr 2024", comments: "Statutory compliance confirmed." },
    { level: 3, type: "Risk Assessment", person: "Anita Deshmukh", status: "Approved", date: "10 Apr 2024", comments: "Enterprise risk acceptable." },
    { level: 4, type: "HR Leadership Review", person: "Meera Nair", status: "Approved", date: "11 Apr 2024", comments: "Policy terms approved." },
    { level: 5, type: "Executive Committee Approval", person: "Rajeev Malhotra", status: "Approved", date: "12 Apr 2024", comments: "Approved for enterprise release." },
    { level: 6, type: "Policy Secretariat", person: "Rohan Kapoor", status: "Published", date: "15 Apr 2024", comments: "Published to staff handbook." },
  ]);

  const [showCreatePolicyModal, setShowCreatePolicyModal] = useState(false);
  const [newPolicyForm, setNewPolicyForm] = useState({
    num: "",
    title: "",
    type: "Operational Policy",
    dept: "Human Resources",
    ver: "v1.0",
    owner: "Meera Nair",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Policy Management"
      breadcrumb="Management > Organization > Policy Management"
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
                  <option value="Meera Nair">Meera Nair (VP - Human Resources)</option>
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
                  <option value="Pooja Hegde">Pooja Hegde (Chief Legal Counsel)</option>
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
              <div className="relative inline-flex items-center justify-center">
                <svg width="48" height="48" className="transform -rotate-90">
                  <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="3.5" className="text-muted/30" fill="transparent" />
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 19}
                    strokeDashoffset={2 * Math.PI * 19 * (1 - 0.94)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">94%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs (Centered & Streamlined) */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "summary", label: "Policy Overview & Framework", icon: Layers },
              { key: "directory", label: "Enterprise Policy Directory", icon: FolderTree },
              { key: "governance", label: "Governance & Review Workflow", icon: CheckCircle2 },
              { key: "audit", label: "Acknowledgement & Audit Logs", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
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

          {/* SUMMARY TAB CONTENT */}
          {activeTab === "summary" && (
            <div className="space-y-6">
              {/* Row 1: Policy Governance Framework | Purpose & Scope */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* 2. Policy Governance Framework */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Policy Governance Framework & Scope
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Policy Code:</span>
                      <span className="font-mono font-bold text-primary">{policyMaster.policyNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Policy Classification:</span>
                      <span className="font-semibold text-foreground">{policyMaster.policyType}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Governing Standard:</span>
                      <span className="font-semibold text-foreground">ISO 27001 / SOX Compliance</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Enforcement Level:</span>
                      <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                        Mandatory Enterprise Compliance
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Objective & Ownership */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Policy Objective & Custodianship
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Policy Owner:</span>
                      <span className="font-semibold text-foreground">{policyMaster.policyOwner}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Custodian Department:</span>
                      <span className="font-semibold text-foreground">{policyMaster.department}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Effective Validity:</span>
                      <span className="font-mono text-muted-foreground">{policyMaster.effectiveDate} to {policyMaster.expiryDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Mandatory Review Cycle:</span>
                      <span className="font-semibold text-foreground">Annual (Next: {policyMaster.reviewDate})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ENTERPRISE POLICY DIRECTORY WORKSPACE */}
          {activeTab === "directory" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Total Policies</span>
                  <div className="text-xl font-bold font-mono text-foreground">{mergedPolicies.length} Policies</div>
                  <p className="text-[10px] text-emerald-600 font-medium">100% Governance Active</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Published Policies</span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {mergedPolicies.filter((p) => p.status === "Published").length} Active
                  </div>
                  <p className="text-[10px] text-blue-600 font-medium">Enterprise binding</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Under Review</span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {mergedPolicies.filter((p) => p.status !== "Published").length} Pending
                  </div>
                  <p className="text-[10px] text-amber-600 font-medium">Committee stage</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Acknowledgement Rate</span>
                  <div className="text-xl font-bold font-mono text-foreground">94.2%</div>
                  <p className="text-[10px] text-primary font-medium">All active staff</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">Enterprise Policy Register ({mergedPolicies.length} Policies)</h4>
                  <button
                    onClick={() => setShowCreatePolicyModal(true)}
                    className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                  >
                    + Create Policy
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                        <th className="py-2.5 px-3">Policy #</th>
                        <th className="py-2.5 px-3">Policy Title</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Department</th>
                        <th className="py-2.5 px-3">Owner</th>
                        <th className="py-2.5 px-3">Version</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-[11px]">
                      {mergedPolicies.map((pol) => (
                        <tr key={pol.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2 px-3 font-mono font-bold text-primary">{pol.num}</td>
                          <td className="py-2 px-3 font-semibold text-foreground">{pol.title}</td>
                          <td className="py-2 px-3 text-muted-foreground">{pol.type}</td>
                          <td className="py-2 px-3 text-muted-foreground">{pol.dept}</td>
                          <td className="py-2 px-3 text-foreground">{pol.owner}</td>
                          <td className="py-2 px-3 font-mono">{pol.ver}</td>
                          <td className="py-2 px-3">
                            <span
                              className={cn(
                                "rounded px-2 py-0.5 text-[10px] font-bold",
                                pol.status === "Published" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              )}
                            >
                              {pol.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setFallbackPolicies((prev) => prev.filter((p) => p.id !== pol.id));
                                showNotification(`Policy ${pol.num} removed.`);
                              }}
                              className="text-rose-500 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                            >
                              Remove
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

          {/* GOVERNANCE & REVIEW WORKFLOW WORKSPACE */}
          {activeTab === "governance" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Policy Review, Statutory Validation & Approval Stages
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">Governance Stage-Gate</span>
              </div>

              <div className="space-y-3">
                {reviewSteps.map((step) => (
                  <div key={step.level} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/15 text-xs">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-600 shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">{step.type}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{step.date}</span>
                      </div>
                      <p className="text-muted-foreground">Sign-off by <span className="font-semibold text-foreground">{step.person}</span>: "{step.comments}"</p>
                    </div>
                    <span className="rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold shrink-0">
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACKNOWLEDGEMENT & AUDIT LOGS WORKSPACE */}
          {activeTab === "audit" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Employee Acknowledgement Tracking & Version Audit Log
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">Compliance Verification</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Timestamp</th>
                      <th className="py-2 px-2">Auditor / Author</th>
                      <th className="py-2 px-2">Governance Event</th>
                      <th className="py-2 px-2">Policy Version</th>
                      <th className="py-2 px-2">Compliance Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {[
                      { time: "15 Apr 2024, 10:30 AM", user: "Amit Verma (Policy Admin)", act: "Published revised version v1.2 enterprise-wide", ver: "v1.2", status: "100% Compliant" },
                      { time: "12 Apr 2024, 04:00 PM", user: "Sanjay Gupta (Director)", act: "Approved executive review and sign-off", ver: "v1.2", status: "100% Compliant" },
                      { time: "10 Apr 2024, 02:00 PM", user: "Anita Deshmukh (Risk Lead)", act: "Conducted enterprise risk evaluation", ver: "v1.2", status: "100% Compliant" },
                      { time: "01 Apr 2023, 09:00 AM", user: "Amit Verma (Admin)", act: "Baseline version v1.0 promulgated", ver: "v1.0", status: "100% Compliant" },
                    ].map((log, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 font-mono text-muted-foreground">{log.time}</td>
                        <td className="py-2 px-2 font-semibold text-foreground">{log.user}</td>
                        <td className="py-2 px-2 text-foreground">{log.act}</td>
                        <td className="py-2 px-2 font-mono font-bold text-primary">{log.ver}</td>
                        <td className="py-2 px-2">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                            {log.status}
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

        {/* --- CREATE POLICY MODAL --- */}
        {showCreatePolicyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Create Policy Master</h3>
                </div>
                <button onClick={() => setShowCreatePolicyModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Policy Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. FIN-POL-008"
                    value={newPolicyForm.num}
                    onChange={(e) => setNewPolicyForm({ ...newPolicyForm, num: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Policy Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Fixed Asset Depreciation & Governance Policy"
                    value={newPolicyForm.title}
                    onChange={(e) => setNewPolicyForm({ ...newPolicyForm, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Policy Type</label>
                    <select
                      value={newPolicyForm.type}
                      onChange={(e) => setNewPolicyForm({ ...newPolicyForm, type: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    >
                      <option value="Operational Policy">Operational Policy</option>
                      <option value="HR Policy">HR Policy</option>
                      <option value="Financial Policy">Financial Policy</option>
                      <option value="Compliance Policy">Compliance Policy</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Department</label>
                    <input
                      type="text"
                      value={newPolicyForm.dept}
                      onChange={(e) => setNewPolicyForm({ ...newPolicyForm, dept: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCreatePolicyModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newPolicyForm.num || !newPolicyForm.title) {
                      alert("Please provide policy number and title.");
                      return;
                    }
                    setFallbackPolicies((prev) => [
                      ...prev,
                      {
                        id: `POL-${prev.length + 1}`,
                        num: newPolicyForm.num.toUpperCase(),
                        title: newPolicyForm.title,
                        type: newPolicyForm.type,
                        dept: newPolicyForm.dept,
                        ver: newPolicyForm.ver,
                        status: "Published",
                        owner: newPolicyForm.owner,
                        date: "Today",
                      },
                    ]);
                    setShowCreatePolicyModal(false);
                    showNotification(`Policy ${newPolicyForm.num.toUpperCase()} successfully created.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Save Policy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Classification & Modification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-blue-600 font-bold">C</span> (Calculated) |{" "}
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

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
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/document-control-management")({
  head: () => ({
    meta: [
      { title: "Document Control Management · Magnertia ERP" },
      {
        name: "description",
        content: "Manage complete document lifecycle from classification, creation, review, approval, version control, publication, distribution, access control, to retention and disposal.",
      },
    ],
  }),
  component: DocumentControlManagementPage,
});

// --- Data & Mock Definitions ---

const DOCUMENT_TYPES = [
  "Policy",
  "Procedure",
  "SOP",
  "Work Instruction",
  "Manual",
  "Guideline",
  "Form",
  "Template",
  "Standard",
  "Specification",
  "Drawing",
  "Report",
  "Contract",
  "Certificate",
  "Record",
  "Regulation",
  "Agreement",
  "Technical Document",
  "Quality Document",
  "Legal Document",
  "Financial Document",
];

const REVIEW_APPROVAL_STEPS = [
  { level: 1, type: "Technical Review", person: "Pooja Mehta", status: "Approved", date: "10 Apr 2024", comments: "Looks good" },
  { level: 2, type: "Functional Review", person: "Neha Kapoor", status: "Approved", date: "11 Apr 2024", comments: "Approved" },
  { level: 3, type: "Compliance Review", person: "Anita Deshmukh", status: "Approved", date: "12 Apr 2024", comments: "Compliant" },
  { level: 4, type: "Management Approval", person: "Rahul Sharma", status: "Approved", date: "15 Apr 2024", comments: "Approved" },
  { level: 5, type: "Publication", person: "Amit Verma", status: "Published", date: "15 Apr 2024", comments: "Published" },
];

const RECENT_DOCUMENTS_DATA = [
  { id: "DOC-001", name: "Financial Approval Policy", version: "v1.2", status: "Published", updatedOn: "15 Apr 2024", updatedBy: "Amit Verma", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "DOC-002", name: "Procurement Policy", version: "v2.0", status: "Published", updatedOn: "12 Apr 2024", updatedBy: "Neha Kapoor", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "DOC-003", name: "Expense Claim SOP", version: "v1.3", status: "Under Review", updatedOn: "10 Apr 2024", updatedBy: "Pooja Mehta", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "DOC-004", name: "Vendor Onboarding Procedure", version: "v1.1", status: "Draft", updatedOn: "08 Apr 2024", updatedBy: "Karan Malhotra", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { id: "DOC-005", name: "Investment Approval Policy", version: "v1.0", status: "Published", updatedOn: "05 Apr 2024", updatedBy: "Rahul Sharma", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
];

function DocumentControlManagementPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "repository" | "lifecycle" | "audit">("summary");

  // Master Form State
  const [docMaster, setDocMaster] = useState({
    docId: "DOC-2024-000256",
    docNumber: "FIN-POL-001",
    docTitle: "Financial Approval Policy",
    docType: "Policy",
    docCategory: "Financial",
    module: "Finance",
    submodule: "Financial Control",
    process: "Financial Approvals",
    processOwner: "Vikram Singh",
    department: "Finance & Accounts",
    branch: "Corporate - Noida",
    docStatus: "Published",
    effectiveDate: "2024-04-01",
    expiryDate: "2026-03-31",
    currentVersion: "v1.2",
    description: "Defines the policy for financial approvals including limits, authority levels, escalation path and compliance requirements for all financial transactions.",
  });

  // Dynamic Document Repository
  const [documentsList, setDocumentsList] = useState([
    { id: "DOC-001", num: "FIN-POL-001", name: "Financial Approval Policy", type: "Policy", dept: "Finance & Accounts", ver: "v1.2", status: "Published", date: "15 Apr 2024", owner: "Vikram Singh" },
    { id: "DOC-002", num: "PRC-POL-002", name: "Procurement & Vendor Policy", type: "Policy", dept: "Procurement", ver: "v2.0", status: "Published", date: "12 Apr 2024", owner: "Neha Kapoor" },
    { id: "DOC-003", num: "FIN-SOP-003", name: "Expense Claim SOP & Guidelines", type: "SOP", dept: "Finance", ver: "v1.3", status: "Under Review", date: "10 Apr 2024", owner: "Pooja Mehta" },
    { id: "DOC-004", num: "OPS-PRC-004", name: "Vendor Onboarding Procedure", type: "Procedure", dept: "Operations", ver: "v1.1", status: "Draft", date: "08 Apr 2024", owner: "Karan Malhotra" },
    { id: "DOC-005", num: "SEC-POL-005", name: "Information Security Policy", type: "Policy", dept: "Cybersecurity", ver: "v3.0", status: "Published", date: "01 Apr 2024", owner: "Anita Deshmukh" },
  ]);

  const [reviewSteps, setReviewSteps] = useState([
    { level: 1, type: "Technical Review", person: "Pooja Mehta", status: "Approved", date: "10 Apr 2024", comments: "Verified standard compliance." },
    { level: 2, type: "Functional Review", person: "Neha Kapoor", status: "Approved", date: "11 Apr 2024", comments: "Aligned with procurement matrix." },
    { level: 3, type: "Compliance Review", person: "Anita Deshmukh", status: "Approved", date: "12 Apr 2024", comments: "Statutory requirements verified." },
    { level: 4, type: "Management Approval", person: "Rahul Sharma", status: "Approved", date: "15 Apr 2024", comments: "Approved for enterprise rollout." },
    { level: 5, type: "Publication", person: "Amit Verma", status: "Published", date: "15 Apr 2024", comments: "Published to employee portal." },
  ]);

  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [newDocForm, setNewDocForm] = useState({
    num: "",
    name: "",
    type: "Policy",
    dept: "Finance & Accounts",
    ver: "v1.0",
    owner: "Vikram Singh",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Document Control Management"
      breadcrumb="Management > Administration Management > Document Control Management"
      description="Manage the complete lifecycle of organizational documents—from creation, classification, drafting, reviews, approval, version control, publication, distribution, to retention and audit."
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
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">Document Control Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {docMaster.docStatus}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  {docMaster.currentVersion}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Controlled Document Architecture & Compliance Lifecycle
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Document preview viewer opened.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview Document
            </button>

            <button
              onClick={() => showNotification("New version draft v1.3 created.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600" />
              Create Version
            </button>

            <button
              onClick={() => showNotification("Document Master record saved successfully.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Submitted for Compliance & Management Approval.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Document Master Form & Snapshot Side Card (Matching Attached Reference Screenshot) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Document Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Document Master
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Auto Fields */}
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Document ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={docMaster.docId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Document Number *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  value={docMaster.docNumber}
                  onChange={(e) => setDocMaster({ ...docMaster, docNumber: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Document Title *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={docMaster.docTitle}
                  onChange={(e) => setDocMaster({ ...docMaster, docTitle: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Document Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={docMaster.docType}
                  onChange={(e) => setDocMaster({ ...docMaster, docType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Document Category *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={docMaster.docCategory}
                  onChange={(e) => setDocMaster({ ...docMaster, docCategory: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Financial">Financial</option>
                  <option value="Operational">Operational</option>
                  <option value="Technical">Technical</option>
                  <option value="Quality">Quality</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Module *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={docMaster.module}
                  onChange={(e) => setDocMaster({ ...docMaster, module: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Finance">Finance</option>
                  <option value="Procurement">Procurement</option>
                  <option value="HRMS">HRMS</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Submodule</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={docMaster.submodule}
                  onChange={(e) => setDocMaster({ ...docMaster, submodule: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Financial Control">Financial Control</option>
                  <option value="Accounts Payable">Accounts Payable</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Process</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={docMaster.process}
                  onChange={(e) => setDocMaster({ ...docMaster, process: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Financial Approvals">Financial Approvals</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Process Owner *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={docMaster.processOwner}
                  onChange={(e) => setDocMaster({ ...docMaster, processOwner: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Vikram Singh">Vikram Singh</option>
                  <option value="Neha Kapoor">Neha Kapoor</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={docMaster.department}
                  onChange={(e) => setDocMaster({ ...docMaster, department: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Finance & Accounts">Finance & Accounts</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Branch</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={docMaster.branch}
                  onChange={(e) => setDocMaster({ ...docMaster, branch: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Corporate - Noida">Corporate - Noida</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Document Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={docMaster.docStatus}
                  onChange={(e) => setDocMaster({ ...docMaster, docStatus: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Obsolete">Obsolete</option>
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
                  value={docMaster.effectiveDate}
                  onChange={(e) => setDocMaster({ ...docMaster, effectiveDate: e.target.value })}
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
                  value={docMaster.expiryDate}
                  onChange={(e) => setDocMaster({ ...docMaster, expiryDate: e.target.value })}
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
                  value={docMaster.currentVersion}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Document Description *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <textarea
                rows={2}
                value={docMaster.description}
                onChange={(e) => setDocMaster({ ...docMaster, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Right 3 columns: Document Snapshot Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Document Snapshot</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {docMaster.docStatus}
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
                  <span className="font-mono text-foreground text-[10px]">01 Jan 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Versions</span>
                  <span className="font-bold text-foreground font-mono">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Downloads</span>
                  <span className="font-bold text-primary font-mono">124</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Acknowledged Users</span>
                  <span className="font-bold text-foreground font-mono">86 / 102</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Classification</span>
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 border border-amber-500/20">
                    Confidential
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">SLA Compliance</span>
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
                    strokeDashoffset={2 * Math.PI * 19 * (1 - 0.96)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">96%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs (Centered & Streamlined) */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "summary", label: "Document Profile & Summary", icon: Layers },
              { key: "repository", label: "Enterprise Repository", icon: FolderTree },
              { key: "lifecycle", label: "Lifecycle & Review Stages", icon: CheckCircle2 },
              { key: "audit", label: "Audit Trail & History", icon: Clock },
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
          </div>          {/* SUMMARY TAB CONTENT */}
          {activeTab === "summary" && (
            <div className="space-y-6">
              {/* Row 1: Document Classification | Ownership & Scope */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* 2. Document Classification */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Document Classification & Security
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Document Number:</span>
                      <span className="font-mono font-bold text-primary">{docMaster.docNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Document Type:</span>
                      <span className="font-semibold text-foreground">{docMaster.docType}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Security Classification:</span>
                      <span className="rounded bg-amber-500/10 text-amber-600 px-2 py-0.5 text-[10px] font-bold border border-amber-500/20">
                        Confidential
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Access Scope:</span>
                      <span className="font-semibold text-foreground">Organization-wide (Role Bound)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Ownership & Governance */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Document Governance & Ownership
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Author / Process Owner:</span>
                      <span className="font-semibold text-foreground">{docMaster.processOwner}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-semibold text-foreground">{docMaster.department}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Effective Validity:</span>
                      <span className="font-mono text-muted-foreground">{docMaster.effectiveDate} to {docMaster.expiryDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Retention Policy:</span>
                      <span className="font-semibold text-foreground">7 Years (Statutory Archive)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ENTERPRISE REPOSITORY WORKSPACE */}
          {activeTab === "repository" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Controlled Documents</span>
                  <div className="text-xl font-bold font-mono text-foreground">{documentsList.length} Docs</div>
                  <p className="text-[10px] text-emerald-600 font-medium">100% Version Controlled</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Published Policies</span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {documentsList.filter((d) => d.status === "Published").length} Published
                  </div>
                  <p className="text-[10px] text-blue-600 font-medium">Available across hubs</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Under Review</span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {documentsList.filter((d) => d.status !== "Published").length} In Progress
                  </div>
                  <p className="text-[10px] text-amber-600 font-medium">Pending workflow sign-off</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Compliance Rating</span>
                  <div className="text-xl font-bold font-mono text-foreground">98.4%</div>
                  <p className="text-[10px] text-purple-600 font-medium">ISO 9001 / 27001</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">Controlled Document Register ({documentsList.length} Documents)</h4>
                  <button
                    onClick={() => setShowUploadDocModal(true)}
                    className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                  >
                    + Upload Document
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                        <th className="py-2.5 px-3">Doc #</th>
                        <th className="py-2.5 px-3">Document Title</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Department</th>
                        <th className="py-2.5 px-3">Owner</th>
                        <th className="py-2.5 px-3">Version</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-[11px]">
                      {documentsList.map((doc) => (
                        <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2 px-3 font-mono font-bold text-primary">{doc.num}</td>
                          <td className="py-2 px-3 font-semibold text-foreground">{doc.name}</td>
                          <td className="py-2 px-3 text-muted-foreground">{doc.type}</td>
                          <td className="py-2 px-3 text-muted-foreground">{doc.dept}</td>
                          <td className="py-2 px-3 text-foreground">{doc.owner}</td>
                          <td className="py-2 px-3 font-mono">{doc.ver}</td>
                          <td className="py-2 px-3">
                            <span
                              className={cn(
                                "rounded px-2 py-0.5 text-[10px] font-bold",
                                doc.status === "Published" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              )}
                            >
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setDocumentsList((prev) => prev.filter((d) => d.id !== doc.id));
                                showNotification(`Document ${doc.num} removed.`);
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

          {/* LIFECYCLE & REVIEW STAGES WORKSPACE */}
          {activeTab === "lifecycle" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Document Review & Approval Sign-off Stages
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">Multi-Stage Quality Gate</span>
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

          {/* AUDIT TRAIL WORKSPACE */}
          {activeTab === "audit" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Document Revision History & Download Logs
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">Immutable Audit Register</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Timestamp</th>
                      <th className="py-2 px-2">User Identity</th>
                      <th className="py-2 px-2">Action / Event</th>
                      <th className="py-2 px-2">Version</th>
                      <th className="py-2 px-2">Integrity Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {[
                      { time: "15 Apr 2024, 10:30 AM", user: "Amit Verma (Publish Lead)", act: "Published revision v1.2 to production portal", ver: "v1.2", status: "Verified SHA-256" },
                      { time: "12 Apr 2024, 04:15 PM", user: "Anita Deshmukh (Compliance)", act: "Approved legal compliance review stage", ver: "v1.2", status: "Verified SHA-256" },
                      { time: "10 Apr 2024, 02:00 PM", user: "Vikram Singh (Author)", act: "Drafted minor updates to financial approval limits", ver: "v1.2", status: "Verified SHA-256" },
                      { time: "01 Jan 2024, 09:00 AM", user: "Rahul Sharma (Admin)", act: "Published baseline version v1.0", ver: "v1.0", status: "Verified SHA-256" },
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

        {/* --- UPLOAD DOCUMENT MODAL --- */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Upload Controlled Document</h3>
                </div>
                <button onClick={() => setShowUploadDocModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Document Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. FIN-POL-006"
                    value={newDocForm.num}
                    onChange={(e) => setNewDocForm({ ...newDocForm, num: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Document Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Capital Expenditure Governance Policy"
                    value={newDocForm.name}
                    onChange={(e) => setNewDocForm({ ...newDocForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Document Type</label>
                    <select
                      value={newDocForm.type}
                      onChange={(e) => setNewDocForm({ ...newDocForm, type: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    >
                      <option value="Policy">Policy</option>
                      <option value="SOP">SOP</option>
                      <option value="Procedure">Procedure</option>
                      <option value="Guideline">Guideline</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Department</label>
                    <input
                      type="text"
                      value={newDocForm.dept}
                      onChange={(e) => setNewDocForm({ ...newDocForm, dept: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newDocForm.num || !newDocForm.name) {
                      alert("Please provide document number and title.");
                      return;
                    }
                    setDocumentsList((prev) => [
                      ...prev,
                      {
                        id: `DOC-${prev.length + 1}`,
                        num: newDocForm.num.toUpperCase(),
                        name: newDocForm.name,
                        type: newDocForm.type,
                        dept: newDocForm.dept,
                        ver: newDocForm.ver,
                        status: "Published",
                        date: "Today",
                        owner: newDocForm.owner,
                      },
                    ]);
                    setShowUploadDocModal(false);
                    showNotification(`Document ${newDocForm.num.toUpperCase()} successfully uploaded.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Upload Document
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

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

export function DocumentControlManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "summary"
    | "classification"
    | "ownership"
    | "creation"
    | "review"
    | "versions"
    | "distribution"
    | "access"
    | "acknowledgement"
    | "retention"
    | "attachments"
    | "audit"
    | "history"
  >("summary");

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
              <div className="grid h-12 w-12 place-items-center rounded-full border-4 border-emerald-500 text-xs font-bold font-mono text-emerald-600">
                96%
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
              { key: "ownership", label: "Ownership", icon: UserCheck },
              { key: "creation", label: "Creation", icon: FileText },
              { key: "review", label: "Review & Approval", icon: CheckCircle2 },
              { key: "versions", label: "Versions", icon: History },
              { key: "distribution", label: "Distribution", icon: Share2 },
              { key: "access", label: "Access Control", icon: Lock },
              { key: "acknowledgement", label: "Acknowledgement", icon: Users },
              { key: "retention", label: "Retention", icon: Archive },
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
                        <option>Confidential</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Business Criticality</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>High</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Information Category</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Management Information</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Regulatory Category</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Internal Policy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Security Classification</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Medium Term</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Classification Owner</label>
                      <input
                        type="text"
                        readOnly
                        value="Anita Deshmukh"
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
                      <span className="text-[11px] text-muted-foreground block">Document Owner</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center font-mono">
                          VS
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Vikram Singh</span>
                          <span className="text-[10px] text-muted-foreground">Finance Manager</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Author</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-500/10 text-blue-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          KM
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Karan Malhotra</span>
                          <span className="text-[10px] text-muted-foreground">Senior Analyst</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Process Owner</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-purple-500/10 text-purple-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          NK
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Neha Kapoor</span>
                          <span className="text-[10px] text-muted-foreground">Finance Controller</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Reviewer</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          PM
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Pooja Mehta</span>
                          <span className="text-[10px] text-muted-foreground">Senior Manager</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Custodian</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          AV
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Amit Verma</span>
                          <span className="text-[10px] text-muted-foreground">Document Controller</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Approver</span>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-rose-500/10 text-rose-600 font-bold text-[10px] flex items-center justify-center font-mono">
                          RS
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">Rahul Sharma</span>
                          <span className="text-[10px] text-muted-foreground">CFO</span>
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
                          {REVIEW_APPROVAL_STEPS.map((s) => (
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
                    onClick={() => showNotification("Full approval audit workflow graph loaded.")}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer pt-1"
                  >
                    View Full Workflow
                  </button>
                </div>
              </div>

              {/* Row 2: 5. Latest Version Details | 6. Distribution & Acknowledgement | 7. Quick Actions */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 5. Latest Version Details */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    5. Latest Version Details
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Version</span>
                      <span className="font-bold text-foreground font-mono">v1.2</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Published On</span>
                      <span className="font-mono text-muted-foreground text-[10px]">15 Apr 2024 10:30 AM</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Published By</span>
                      <span className="font-semibold text-foreground">Amit Verma</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Effective From</span>
                      <span className="font-mono text-muted-foreground text-[10px]">15 Apr 2024</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Effective To</span>
                      <span className="font-mono text-muted-foreground text-[10px]">31 Mar 2026</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Change Type</span>
                      <span className="font-medium text-foreground">Minor Revision</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[11px]">Change Description</span>
                      <p className="text-[11px] text-foreground mt-0.5 bg-muted/20 p-1.5 rounded border border-border/50">
                        Updated approval limits and escalation matrix.
                      </p>
                    </div>

                    {/* File Attachment Download Box */}
                    <div className="flex items-center justify-between bg-primary/5 p-2 rounded-lg border border-primary/20 pt-2">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-mono text-xs font-bold text-foreground truncate">
                          FIN-POL-001_v1.2.pdf
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">(238 KB)</span>
                      </div>
                      <button
                        onClick={() => showNotification("File download initiated.")}
                        className="p-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-[10px] text-muted-foreground font-mono pt-1">
                      File Location: <span className="text-foreground">/Finance/Policies/FIN-POL-001/v1.2/</span>
                    </div>
                  </div>
                </div>

                {/* 6. Distribution & Acknowledgement */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      6. Distribution & Acknowledgement
                    </h4>

                    {/* Ring Chart Metric Graphic */}
                    <div className="flex items-center justify-center gap-6 py-3">
                      <div className="relative h-24 w-24 rounded-full border-8 border-emerald-500 border-t-amber-500 border-r-rose-500 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold font-mono text-foreground">102</span>
                        <span className="text-[9px] text-muted-foreground">Total Recipients</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-muted-foreground text-[11px]">Acknowledged (86)</span>
                          <span className="font-mono font-bold text-foreground ml-auto">84.3%</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-muted-foreground text-[11px]">Pending (14)</span>
                          <span className="font-mono font-bold text-foreground ml-auto">13.7%</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="text-muted-foreground text-[11px]">Overdue (2)</span>
                          <span className="font-mono font-bold text-foreground ml-auto">2.0%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Acknowledgement breakdown report loaded.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

                {/* 7. Quick Actions & Recent Documents */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-xs">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      7. Quick Actions
                    </h4>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
                      <button
                        onClick={() => showNotification("Upload new version modal opened.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Upload className="h-4 w-4 text-primary" />
                        <span>Upload Version</span>
                      </button>

                      <button
                        onClick={() => showNotification("Review request sent.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="h-4 w-4 text-purple-600" />
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
                        onClick={() => showNotification("Distribution modal opened.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Share2 className="h-4 w-4 text-blue-600" />
                        <span>Distribute</span>
                      </button>

                      <button
                        onClick={() => showNotification("Access permissions updated.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Lock className="h-4 w-4 text-amber-600" />
                        <span>Edit Access</span>
                      </button>

                      <button
                        onClick={() => showNotification("Archive confirmation requested.")}
                        className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer text-rose-600"
                      >
                        <Archive className="h-4 w-4" />
                        <span>Archive</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-3">
                    <h4 className="text-xs font-bold text-foreground mb-2">Recent Documents</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                            <th className="py-1 px-1">Document</th>
                            <th className="py-1 px-1">Ver</th>
                            <th className="py-1 px-1">Status</th>
                            <th className="py-1 px-1">Updated</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-[10px]">
                          {RECENT_DOCUMENTS_DATA.slice(0, 4).map((d) => (
                            <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-1 px-1 font-medium text-foreground truncate max-w-[100px]">{d.name}</td>
                              <td className="py-1 px-1 font-mono text-muted-foreground">{d.version}</td>
                              <td className="py-1 px-1">
                                <span className={cn("rounded px-1 py-0.2 text-[9px] font-bold border", d.badge)}>
                                  {d.status}
                                </span>
                              </td>
                              <td className="py-1 px-1 font-mono text-[9px] text-muted-foreground">{d.updatedOn}</td>
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
                <span className="text-xs text-muted-foreground">Document ID: DOC-2024-000256</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed settings for <span className="font-semibold text-foreground capitalize">{activeTab}</span> adhering to MAICW specification.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Active Version</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">v1.2 Published</span>
                  <p className="text-[11px] text-muted-foreground">Controlled distribution active.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Security Rating</span>
                  <span className="text-xl font-bold font-mono text-amber-600">Confidential</span>
                  <p className="text-[11px] text-muted-foreground">Restricted to Finance & Accounts department.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Compliance Verification</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">Passed</span>
                  <p className="text-[11px] text-muted-foreground">Audit retention schedule set to 7 Years.</p>
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

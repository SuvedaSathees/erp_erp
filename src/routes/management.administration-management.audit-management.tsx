import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Activity,
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
  History,
  File,
  Check,
  ChevronRight,
  Users,
  Printer,
  FileSpreadsheet,
  ExternalLink,
  Search,
  MessageSquare,
  ChevronLeft,
  Key,
  Globe,
  Monitor,
  FileText,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/audit-management")({
  head: () => ({
    meta: [
      { title: "Audit Management · Magnertia ERP" },
      {
        name: "description",
        content: "Audit Trail Form records complete history of actions, data changes, approvals, transactions, system events, and security activities.",
      },
    ],
  }),
  component: AuditManagementPage,
});

// --- Data & Mock Definitions ---

const CHANGE_DETAILS_DATA = [
  { id: "CHG-1", field: "Amount", label: "Invoice Amount", type: "Currency", prev: "₹95,000.00", next: "₹97,500.00", changeType: "Modification", by: "Amit Verma", time: "15 Apr 2024 10:15:32 AM" },
  { id: "CHG-2", field: "Last Updated On", label: "Last Updated On", type: "DateTime", prev: "15 Apr 2024 09:30:10 AM", next: "15 Apr 2024 10:15:32 AM", changeType: "Modification", by: "Amit Verma", time: "15 Apr 2024 10:15:32 AM" },
];

const AUDIT_TIMELINE_DATA = [
  { id: "TL-1", time: "15 Apr 2024 08:55:12 AM", type: "Create", action: "Create", by: "Amit Verma", module: "Finance", record: "INV-000458", status: "Success", desc: "Supplier Invoice created", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "TL-2", time: "15 Apr 2024 09:46:21 AM", type: "Approval", action: "Submit", by: "Amit Verma", module: "Finance", record: "INV-000458", status: "Success", desc: "Invoice submitted for approval", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "TL-3", time: "15 Apr 2024 09:52:14 AM", type: "Approval", action: "Approve", by: "Neha Kapoor", module: "Finance", record: "INV-000458", status: "Success", desc: "Invoice approved", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "TL-4", time: "15 Apr 2024 10:15:32 AM", type: "Data Change", action: "Update", by: "Amit Verma", module: "Finance", record: "INV-000458", status: "Success", desc: "Invoice amount updated (₹95,000.00 → ₹97,500.00)", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "TL-5", time: "15 Apr 2024 10:16:05 AM", type: "System", action: "Log", by: "System", module: "Finance", record: "INV-000458", status: "Success", desc: "System updated invoice totals", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
];

export function AuditManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "changes"
    | "user"
    | "action-details"
    | "record-context"
    | "system-context"
    | "security"
    | "evidence"
    | "workflow"
    | "approvals"
    | "review"
    | "timeline"
  >("overview");

  // Master Form State
  const [auditMaster, setAuditMaster] = useState({
    auditId: "AUD-2024-000458",
    auditNumber: "AUD-2024-04-000458",
    eventId: "EVT-2024-04-15-001258",
    eventType: "Data Change",
    eventCategory: "Business",
    module: "Finance",
    submodule: "Accounts Payable",
    businessFunction: "Finance Operations",
    transactionType: "Supplier Invoice",
    recordType: "Supplier Invoice",
    recordId: "INV-000458",
    action: "Update",
    status: "Success",
    severity: "Medium",
    timestamp: "15 Apr 2024 10:15:32 AM",
    source: "ERP Application",
    ipAddress: "192.168.10.245",
    requestId: "REQ-8F7A9D2C1B4E",
    sessionId: "SID-7D9E1C2A3B4F",
    correlationId: "CORR-93A1B2C3D4E5",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Audit Trail Form"
      breadcrumb="Management > Administration Management > Audit Management > Audit Trail Form"
      description="Records the complete immutable history of actions, changes, approvals, transactions, system events, and security activities across Magnertia ERP."
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
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">Audit Trail Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {auditMaster.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Cross-ERP Immutable Accountability & Forensic Audit Engine
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Audit log export started (CSV / PDF format).")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-primary" />
              Export
            </button>

            <button
              onClick={() => showNotification("Print layout generated.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-foreground" />
              Print
            </button>

            <button
              onClick={() => showNotification("Audit record saved to immutable repository.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
          </div>
        </div>

        {/* 1. Audit Master Form & Snapshot Side Card (Matching Attached Reference Screenshot) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Audit Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Audit Trail Master
              </h3>
              <span className="text-[11px] text-muted-foreground font-medium">
                MAICW Fields: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
                <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
                <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
                <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
                <span className="text-rose-500 font-bold">W</span> (Workflow)
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* Auto Fields */}
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Audit ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={auditMaster.auditId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Audit Number</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={auditMaster.auditNumber}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Event ID *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={auditMaster.eventId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Event Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={auditMaster.eventType}
                  onChange={(e) => setAuditMaster({ ...auditMaster, eventType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Data Change">Data Change</option>
                  <option value="Authentication">Authentication</option>
                  <option value="Security Event">Security Event</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Event Category *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={auditMaster.eventCategory}
                  onChange={(e) => setAuditMaster({ ...auditMaster, eventCategory: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Business">Business</option>
                  <option value="Security">Security</option>
                  <option value="System">System</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Module *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={auditMaster.module}
                  onChange={(e) => setAuditMaster({ ...auditMaster, module: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Submodule</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={auditMaster.submodule}
                  onChange={(e) => setAuditMaster({ ...auditMaster, submodule: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Accounts Payable">Accounts Payable</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Business Function</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={auditMaster.businessFunction}
                  onChange={(e) => setAuditMaster({ ...auditMaster, businessFunction: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Finance Operations">Finance Operations</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Transaction Type</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={auditMaster.transactionType}
                  onChange={(e) => setAuditMaster({ ...auditMaster, transactionType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Supplier Invoice">Supplier Invoice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Record Type</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={auditMaster.recordType}
                  onChange={(e) => setAuditMaster({ ...auditMaster, recordType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Supplier Invoice">Supplier Invoice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Record ID</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={auditMaster.recordId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Action *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={auditMaster.action}
                  onChange={(e) => setAuditMaster({ ...auditMaster, action: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Update">Update</option>
                  <option value="Create">Create</option>
                  <option value="Delete">Delete</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={auditMaster.status}
                  onChange={(e) => setAuditMaster({ ...auditMaster, status: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-emerald-600 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Severity *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={auditMaster.severity}
                  onChange={(e) => setAuditMaster({ ...auditMaster, severity: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-amber-600 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Timestamp</span>
                  <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-1 rounded">C</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={auditMaster.timestamp}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Source</span>
                  <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-1 rounded">C</span>
                </label>
                <select
                  value={auditMaster.source}
                  onChange={(e) => setAuditMaster({ ...auditMaster, source: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ERP Application">ERP Application</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>IP Address</span>
                  <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-1 rounded">C</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={auditMaster.ipAddress}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Request ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={auditMaster.requestId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Session ID</span>
                  <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-1 rounded">C</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={auditMaster.sessionId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Correlation ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={auditMaster.correlationId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right 3 columns: Audit Snapshot Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Audit Snapshot</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {auditMaster.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Logged By</span>
                  <div className="flex items-center gap-1.5 text-right">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary font-bold text-[9px] flex items-center justify-center font-mono">
                      AV
                    </div>
                    <div>
                      <span className="font-bold text-foreground block text-[11px]">Amit Verma</span>
                      <span className="text-[9px] text-muted-foreground block">Finance Executive</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium text-foreground">Finance</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Branch</span>
                  <span className="font-medium text-foreground">Mumbai Branch</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-mono text-muted-foreground text-[10px]">Windows 11 / Chrome</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Event Time (Local)</span>
                  <span className="font-mono text-muted-foreground text-[10px]">15 Apr 2024 03:45:32 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">User Type</span>
                  <span className="font-medium text-foreground">Employee</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Risk Score</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Low Risk</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full border-4 border-emerald-500 text-xs font-bold font-mono text-emerald-600">
                35%
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "overview", label: "Overview", icon: Layers },
              { key: "changes", label: "Changes (2)", icon: RefreshCw },
              { key: "user", label: "User & Actor", icon: User },
              { key: "action-details", label: "Action Details", icon: FileText },
              { key: "record-context", label: "Record Context", icon: FolderTree },
              { key: "system-context", label: "System Context", icon: Monitor },
              { key: "security", label: "Security", icon: ShieldCheck },
              { key: "evidence", label: "Evidence", icon: FileCheck },
              { key: "workflow", label: "Workflow", icon: ArrowRight },
              { key: "approvals", label: "Approvals", icon: CheckCircle2 },
              { key: "review", label: "Review & Findings", icon: Eye },
              { key: "timeline", label: "Timeline", icon: History },
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

          {/* OVERVIEW TAB CONTENT (Matching attached screenshot layout) */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: 2. Action Summary | 3. Change Details | 4. Record Context */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 2. Action Summary */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Action Summary
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Action</span>
                      <span className="font-bold text-foreground">Update</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px]">Action Description</span>
                      <p className="text-[11px] font-semibold text-foreground mt-0.5">Supplier Invoice amount updated</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Action Result</span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Success
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px]">Reason</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5 bg-muted/20 p-1.5 rounded border border-border/50">
                        Amount corrected as per supplier credit note
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-border/50">
                      <span className="text-muted-foreground">Related Document</span>
                      <span className="font-mono text-primary font-bold">CN-000125</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Workflow Reference</span>
                      <span className="font-mono text-muted-foreground text-[10px]">WF-INV-APPR-2024-0152</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Approval Reference</span>
                      <span className="font-mono text-muted-foreground text-[10px]">APR-2024-000256</span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-muted-foreground">Performed By</span>
                      <div className="flex items-center gap-1">
                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary font-bold text-[9px] flex items-center justify-center font-mono">
                          AV
                        </div>
                        <span className="font-bold text-foreground text-[11px]">Amit Verma</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Change Details */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      3. Change Details
                    </h4>

                    <div className="overflow-x-auto mt-1">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                            <th className="py-1 px-1">#</th>
                            <th className="py-1 px-1">Field Name</th>
                            <th className="py-1 px-1">Previous Value</th>
                            <th className="py-1 px-1">New Value</th>
                            <th className="py-1 px-1">Change Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-[10px]">
                          {CHANGE_DETAILS_DATA.map((c) => (
                            <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-1 px-1 font-mono text-muted-foreground">{c.id.replace("CHG-", "")}</td>
                              <td className="py-1 px-1 font-bold text-foreground">{c.field}</td>
                              <td className="py-1 px-1 font-mono text-rose-600 line-through">{c.prev}</td>
                              <td className="py-1 px-1 font-mono font-bold text-emerald-600">{c.next}</td>
                              <td className="py-1 px-1">
                                <span className="rounded bg-blue-500/10 px-1 py-0.2 text-[9px] font-bold text-blue-600">
                                  {c.changeType}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Full change diff viewer loaded.")}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer pt-1"
                  >
                    View All Changes
                  </button>
                </div>

                {/* 4. Record Context */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    4. Record Context
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Entity Type</span>
                      <span className="font-semibold text-foreground">Supplier Invoice</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Entity Name</span>
                      <span className="font-semibold text-foreground">Supplier Invoice</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Record ID</span>
                      <span className="font-mono font-bold text-primary">INV-000458</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Record Number</span>
                      <span className="font-mono text-foreground">INV-000458</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Parent Record</span>
                      <span className="font-mono text-muted-foreground">PO-000789</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Related Record</span>
                      <span className="font-mono text-muted-foreground">SPL-000125</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Module</span>
                      <span className="font-semibold text-foreground">Finance</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Submodule</span>
                      <span className="font-medium text-foreground">Accounts Payable</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Business Process</span>
                      <span className="font-medium text-foreground">Procure to Pay</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Business Function</span>
                      <span className="font-medium text-foreground">Finance Operations</span>
                    </div>

                    <div className="pt-1 border-t border-border/50">
                      <button
                        onClick={() => showNotification("Navigating to Supplier Invoice INV-000458...")}
                        className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Record
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: 5. System & Technical Context | 6. Authentication Summary | 7. Security Summary */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 5. System & Technical Context */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    5. System & Technical Context
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Source System</span>
                      <span className="font-semibold text-foreground text-[11px]">ERP Application</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block">Operating System</span>
                      <span className="font-mono text-foreground text-[11px]">Windows 11</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block">Application</span>
                      <span className="font-semibold text-foreground text-[11px]">Magnertia ERP</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block">Device Type</span>
                      <span className="font-medium text-foreground text-[11px]">Desktop</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block">IP Address</span>
                      <span className="font-mono text-foreground text-[11px]">192.168.10.245</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block">Session ID</span>
                      <span className="font-mono text-muted-foreground text-[10px] truncate block">SID-7D9E1C2A3B4F</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block">Device ID</span>
                      <span className="font-mono text-muted-foreground text-[10px] truncate block">DEV-7F9A2C5D1E4B</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block">Request ID</span>
                      <span className="font-mono text-muted-foreground text-[10px] truncate block">REQ-8F7A9D2C1B4E</span>
                    </div>

                    <div className="col-span-2 pt-1 border-t border-border/50">
                      <span className="text-[10px] text-muted-foreground block">Browser</span>
                      <span className="font-mono text-foreground text-[11px]">Chrome 123.0.6312.86</span>
                    </div>
                  </div>
                </div>

                {/* 6. Authentication Summary */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      6. Authentication Summary
                    </h4>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Login Time</span>
                        <span className="font-mono text-foreground text-[10px]">15 Apr 2024 08:55:12 AM</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Logout Time</span>
                        <span className="font-mono text-muted-foreground">-</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Authentication Method</span>
                        <span className="font-medium text-foreground">Password + MFA</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">MFA Status</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                          Success
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Login Result</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                          Successful
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-border/50">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium text-foreground">Mumbai, India</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Authentication logs loaded.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View Authentication Audit
                  </button>
                </div>

                {/* 7. Security Summary */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      7. Security Summary
                    </h4>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Security Event</span>
                        <span className="font-bold text-foreground">Data Update</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Access Type</span>
                        <span className="font-medium text-foreground">Update</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Access Result</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                          Allowed
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Threat Level</span>
                        <span className="font-medium text-blue-600">Informational</span>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-border/50">
                        <span className="text-muted-foreground">Security Rule</span>
                        <span className="font-mono font-bold text-foreground">DATA-UPDATE-001</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Security event audit trail opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View Security Audit
                  </button>
                </div>
              </div>

              {/* Row 3: 8. Quick Actions | 9. Audit Timeline */}
              <div className="grid gap-4 lg:grid-cols-12">
                {/* 8. Quick Actions */}
                <div className="lg:col-span-4 rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    8. Quick Actions
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <button
                      onClick={() => showNotification("Record preview opened.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-4 w-4 text-primary" />
                      <span>View Record</span>
                    </button>

                    <button
                      onClick={() => showNotification("Changes diff loaded.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                      <span>View Changes</span>
                    </button>

                    <button
                      onClick={() => showNotification("Workflow diagram opened.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                      <span>View Workflow</span>
                    </button>

                    <button
                      onClick={() => showNotification("Approval sign-off history loaded.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>View Approvals</span>
                    </button>

                    <button
                      onClick={() => showNotification("Audit evidence files retrieved.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <FileCheck className="h-4 w-4 text-amber-600" />
                      <span>View Evidence</span>
                    </button>

                    <button
                      onClick={() => showNotification("Audit report exported.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-emerald-600" />
                      <span>Export Audit</span>
                    </button>

                    <button
                      onClick={() => showNotification("Audit finding form opened.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer text-amber-600"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>Create Finding</span>
                    </button>

                    <button
                      onClick={() => showNotification("Add comment modal opened.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span>Add Comment</span>
                    </button>

                    <button
                      onClick={() => showNotification("Audit record link copied to clipboard.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Share2 className="h-4 w-4 text-indigo-600" />
                      <span>Share Audit</span>
                    </button>
                  </div>
                </div>

                {/* 9. Audit Timeline */}
                <div className="lg:col-span-8 rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">9. Audit Timeline</h4>
                    <span className="text-[10px] text-muted-foreground">Record: INV-000458</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                          <th className="py-1.5 px-1">#</th>
                          <th className="py-1.5 px-1">Timestamp</th>
                          <th className="py-1.5 px-1">Event Type</th>
                          <th className="py-1.5 px-1">Action</th>
                          <th className="py-1.5 px-1">Performed By</th>
                          <th className="py-1.5 px-1">Module</th>
                          <th className="py-1.5 px-1">Record</th>
                          <th className="py-1.5 px-1">Status</th>
                          <th className="py-1.5 px-1">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-[10px]">
                        {AUDIT_TIMELINE_DATA.map((tl) => (
                          <tr key={tl.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-1.5 px-1 font-mono text-muted-foreground">{tl.id.replace("TL-", "")}</td>
                            <td className="py-1.5 px-1 font-mono text-[9px] text-muted-foreground">{tl.time}</td>
                            <td className="py-1.5 px-1 font-medium">{tl.type}</td>
                            <td className="py-1.5 px-1 text-primary font-bold">{tl.action}</td>
                            <td className="py-1.5 px-1 text-foreground font-medium">{tl.by}</td>
                            <td className="py-1.5 px-1 text-muted-foreground">{tl.module}</td>
                            <td className="py-1.5 px-1 font-mono">{tl.record}</td>
                            <td className="py-1.5 px-1">
                              <span className={cn("rounded px-1 py-0.2 text-[9px] font-bold border", tl.badge)}>
                                {tl.status}
                              </span>
                            </td>
                            <td className="py-1.5 px-1 text-muted-foreground truncate max-w-[120px]">{tl.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
                    <button
                      onClick={() => showNotification("Full timeline loaded.")}
                      className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      View Full Audit Trail
                    </button>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="px-1 font-bold text-foreground">1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>... 20</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS PLACEHOLDER */}
          {activeTab !== "overview" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="text-sm font-bold text-foreground capitalize">{activeTab} Workspace</h4>
                <span className="text-xs text-muted-foreground">Audit ID: AUD-2024-000458</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed telemetry and forensic logs for <span className="font-semibold text-foreground capitalize">{activeTab}</span> adhering to MAICW specification.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Event Integrity</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">SHA-256 Hash Verified</span>
                  <p className="text-[11px] text-muted-foreground">Immutable audit trail chain intact.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Audit Review Status</span>
                  <span className="text-xl font-bold font-mono text-blue-600">0 Open Findings</span>
                  <p className="text-[11px] text-muted-foreground">Compliant with internal controls.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Retention Schedule</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">7 Years Active</span>
                  <p className="text-[11px] text-muted-foreground">Legal hold status: Clear.</p>
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
            Last Modified: <span className="font-sans font-semibold text-foreground">15 Apr 2024 10:15:32 AM</span> by <span className="font-sans font-semibold text-foreground">Amit Verma</span> | Created By: <span className="font-sans font-semibold text-foreground">Amit Verma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  Save,
  Clock,
  Layers,
  Download,
  Printer,
  History,
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

function AuditManagementPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "changes" | "security" | "timeline">("overview");

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

  const [filterModule, setFilterModule] = useState("ALL");
  const [showExportModal, setShowExportModal] = useState(false);
  const [timelineLogs] = useState(AUDIT_TIMELINE_DATA);

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
              onClick={() => setShowExportModal(true)}
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

        {/* 1. Audit Master Form & Snapshot Side Card */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Audit Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Audit Trail Master
              </h3>
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
                    strokeDashoffset={2 * Math.PI * 19 * (1 - 0.35)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">35%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs (Centered & Streamlined) */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "overview", label: "Audit Log & Event Overview", icon: Layers },
              { key: "changes", label: "Field Diffs & Data Mutations", icon: RefreshCw },
              { key: "security", label: "Security Context & Forensic Signatures", icon: ShieldCheck },
              { key: "timeline", label: "Immutable Timeline & Audit Trail", icon: History },
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

          {/* OVERVIEW TAB CONTENT */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: Action Summary & Scope | Record Context & Attribution */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* 2. Action Summary */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Event Summary & Execution Metadata
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Action Performed:</span>
                      <span className="font-bold text-foreground">{auditMaster.action} ({auditMaster.eventType})</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Execution Outcome:</span>
                      <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                        {auditMaster.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Source Module:</span>
                      <span className="font-semibold text-foreground">{auditMaster.module} &gt; {auditMaster.submodule}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Target Record:</span>
                      <span className="font-mono font-bold text-primary">{auditMaster.recordType} ({auditMaster.recordId})</span>
                    </div>
                  </div>
                </div>

                {/* 3. Record Context & Origin */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Network Origin & System Session
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Origin IP Address:</span>
                      <span className="font-mono text-foreground font-semibold">{auditMaster.ipAddress}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Request Correlation ID:</span>
                      <span className="font-mono text-primary text-[11px] font-bold">{auditMaster.correlationId}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Audit Timestamp:</span>
                      <span className="font-mono text-muted-foreground">{auditMaster.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Severity Rating:</span>
                      <span className="rounded bg-blue-500/10 text-blue-600 px-2 py-0.5 text-[10px] font-bold">
                        {auditMaster.severity} Severity Event
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHANGES WORKSPACE */}
          {activeTab === "changes" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-bold text-foreground">Field-Level Mutation Breakdown ({CHANGE_DETAILS_DATA.length} Attributes Changed)</h4>
                </div>
                <span className="text-xs font-mono text-muted-foreground">Record: {auditMaster.recordId}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3">Field / Attribute</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3 text-rose-500">Previous Value (Before)</th>
                      <th className="py-2.5 px-3 text-emerald-600">New Value (After)</th>
                      <th className="py-2.5 px-3">Changed By</th>
                      <th className="py-2.5 px-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-[11px]">
                    {CHANGE_DETAILS_DATA.map((chg) => (
                      <tr key={chg.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-foreground">{chg.label}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{chg.type}</td>
                        <td className="py-2.5 px-3 font-mono text-rose-600 bg-rose-500/5">{chg.prev}</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-600 bg-emerald-500/5 font-bold">{chg.next}</td>
                        <td className="py-2.5 px-3 text-foreground">{chg.by}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">{chg.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECURITY & FORENSICS WORKSPACE */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Cryptographic Signature</span>
                  <div className="text-base font-bold font-mono text-emerald-600 truncate">SHA-256 Verified</div>
                  <p className="text-[10px] text-muted-foreground">HMAC integrity validated against root key</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Risk Assessment</span>
                  <div className="text-base font-bold font-mono text-emerald-600">Low Risk (35/100)</div>
                  <p className="text-[10px] text-muted-foreground">Authorized corporate subnet activity</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Statutory Retention</span>
                  <div className="text-base font-bold font-mono text-blue-600">7 Years Immutability</div>
                  <p className="text-[10px] text-muted-foreground">SOX / SOC-2 Compliance Certified</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                  Security Forensics & Session Fingerprint
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Session Fingerprint Hash:</span>
                    <span className="font-mono text-foreground">d89e2b1a9f04c782390aef92138a0bc1</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">TLS Cipher Suite:</span>
                    <span className="font-mono text-foreground">TLS_AES_256_GCM_SHA384 (TLS 1.3)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Multi-Factor Authentication (MFA):</span>
                    <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                      FIDO2 Hardware Key Authenticated
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-muted-foreground">Tamper-Proof Block Hash:</span>
                    <span className="font-mono text-primary font-bold text-[11px]">#00458-7A8B9C-BLOCK-VALID</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TIMELINE WORKSPACE */}
          {activeTab === "timeline" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-bold text-foreground">Immutable Audit Timeline ({timelineLogs.length} Events)</h4>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={filterModule}
                    onChange={(e) => setFilterModule(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                  >
                    <option value="ALL">All Modules</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="CRM">CRM</option>
                  </select>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                  >
                    Export Log
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">#</th>
                      <th className="py-2 px-2">Timestamp</th>
                      <th className="py-2 px-2">Event Type</th>
                      <th className="py-2 px-2">Action</th>
                      <th className="py-2 px-2">Actor / User</th>
                      <th className="py-2 px-2">Module</th>
                      <th className="py-2 px-2">Target Record</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {timelineLogs
                      .filter((t) => filterModule === "ALL" || t.module === filterModule)
                      .map((tl) => (
                        <tr key={tl.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2 px-2 font-mono text-muted-foreground">{tl.id.replace("TL-", "")}</td>
                          <td className="py-2 px-2 font-mono text-muted-foreground">{tl.time}</td>
                          <td className="py-2 px-2 font-medium">{tl.type}</td>
                          <td className="py-2 px-2 font-bold text-primary">{tl.action}</td>
                          <td className="py-2 px-2 text-foreground font-medium">{tl.by}</td>
                          <td className="py-2 px-2 text-muted-foreground">{tl.module}</td>
                          <td className="py-2 px-2 font-mono">{tl.record}</td>
                          <td className="py-2 px-2">
                            <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold border", tl.badge)}>
                              {tl.status}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-muted-foreground">{tl.desc}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- EXPORT MODAL --- */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Export Compliance Audit Logs</h3>
                </div>
                <button onClick={() => setShowExportModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Export Format</label>
                  <select className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground">
                    <option value="CSV">Comma Separated Values (.CSV)</option>
                    <option value="JSON">Encrypted JSON (.JSON)</option>
                    <option value="PDF">Signed PDF Audit Certificate (.PDF)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Date Range</label>
                  <input
                    type="text"
                    readOnly
                    value="Past 30 Days (01 Apr 2024 - 30 Apr 2024)"
                    className="mt-1 w-full rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportModal(false);
                    showNotification("Audit trail exported successfully.");
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Download Log Archive
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
            Last Modified: <span className="font-sans font-semibold text-foreground">15 Apr 2024 10:15:32 AM</span> by <span className="font-sans font-semibold text-foreground">Amit Verma</span> | Created By: <span className="font-sans font-semibold text-foreground">Amit Verma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

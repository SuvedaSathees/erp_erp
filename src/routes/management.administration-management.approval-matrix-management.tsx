import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
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
  FileText,
  FileCheck,
  Check,
  ChevronRight,
  Building,
  DollarSign,
  Briefcase,
  Maximize2,
  Lock,
  User,
  Shield,
  Activity,
  History,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/approval-matrix-management")({
  head: () => ({
    meta: [
      { title: "Approval Matrix Management · Magnertia ERP" },
      {
        name: "description",
        content: "Define approval levels, authority limits, conditional routing, escalation paths, delegation rules, and SoD controls.",
      },
    ],
  }),
  component: ApprovalMatrixManagementPage,
});

// --- Data & Mock Definitions ---

const MATRIX_TYPES = [
  "Financial Approval",
  "Purchase Approval",
  "Sales Approval",
  "Expense Approval",
  "HR Approval",
  "Recruitment Approval",
  "Leave Approval",
  "Asset Approval",
  "Project Approval",
  "Contract Approval",
  "Technical Approval",
  "Compliance Approval",
  "Change Approval",
  "Investment Approval",
  "Legal Approval",
];

const APPROVAL_LEVELS_DATA = [
  { id: "LVL-1", level: 1, name: "Department Approval", type: "Role", approver: "Purchase Manager", limit: "Up to 1,00,000", mandatory: true, time: 1 },
  { id: "LVL-2", level: 2, name: "Finance Approval", type: "Role", approver: "Finance Manager", limit: "1,00,001 - 10,00,000", mandatory: true, time: 2 },
  { id: "LVL-3", level: 3, name: "BU Head Approval", type: "Role", approver: "Head - Procurement", limit: "10,00,001 - 50,00,000", mandatory: true, time: 3 },
  { id: "LVL-4", level: 4, name: "CFO Approval", type: "User", approver: "Chief Financial Officer", limit: "Above 50,00,000", mandatory: true, time: 4 },
];

const MATRIX_CONDITIONS_DATA = [
  { id: "CND-1", name: "Amount Condition", field: "PO Amount", operator: "Greater Than", value: "1,00,000", logic: "AND" },
  { id: "CND-2", name: "Item Category", field: "Item Category", operator: "Not In", value: "Services, Maintenance", logic: "AND" },
  { id: "CND-3", name: "Critical Purchase", field: "Criticality", operator: "Equals", value: "High", logic: "OR" },
];

const ESCALATION_RULES_DATA = [
  { id: "ESC-1", level: 1, trigger: "SLA Breach", time: "24 Hours", escalateTo: "Next Level Approver" },
  { id: "ESC-2", level: 2, trigger: "Approver Unavailable", time: "4 Hours", escalateTo: "Reporting Manager" },
  { id: "ESC-3", level: 3, trigger: "Amount Increase", time: "-", escalateTo: "BU Head" },
];

const RECENT_APPROVAL_REQUESTS = [
  { id: "APR-2024-01576", tx: "Purchase Order", amount: "75,00,000", initiator: "Amit Verma", level: "Level 3", approver: "Head - Procurement", status: "Pending", due: "15 May 2024 05:00 PM", age: "5h 20m", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "APR-2024-01575", tx: "Purchase Order", amount: "8,50,000", initiator: "Neha Kapoor", level: "Level 2", approver: "Finance Manager", status: "Pending", due: "15 May 2024 02:00 PM", age: "2h 10m", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "APR-2024-01574", tx: "Purchase Order", amount: "45,00,000", initiator: "Vikram Singh", level: "Level 3", approver: "Head - Procurement", status: "Approved", due: "14 May 2024 06:00 PM", age: "-", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "APR-2024-01573", tx: "Purchase Order", amount: "90,000", initiator: "Pooja Mehta", level: "Level 1", approver: "Purchase Manager", status: "Approved", due: "14 May 2024 11:00 AM", age: "-", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "APR-2024-01572", tx: "Purchase Order", amount: "5,75,000", initiator: "Karan Malhotra", level: "Level 2", approver: "Finance Manager", status: "Rejected", due: "14 May 2024 01:00 PM", age: "-", badge: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
];

export function ApprovalMatrixManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "approval-levels"
    | "conditions"
    | "routing"
    | "escalation"
    | "delegation"
    | "sla"
    | "sod"
    | "history"
    | "documents"
  >("overview");

  // Master Form State
  const [matrixMaster, setMatrixMaster] = useState({
    matrixId: "MAT-2024-00078",
    matrixCode: "FIN-PO-APP-01",
    matrixName: "Purchase Order Approval Matrix",
    matrixType: "Purchase Approval",
    matrixStatus: "Active",
    module: "Procurement",
    submodule: "Purchase Management",
    transactionType: "Purchase Order",
    orgScope: "Business Unit",
    priority: 1,
    description: "Defines approval levels, authority limits and escalation path for Purchase Orders based on amount and organization.",
    effectiveFrom: "2024-04-01",
    effectiveTo: "2025-03-31",
    version: "1.0",
    createdBy: "Rahul Sharma",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Approval Matrix Management"
      breadcrumb="Management > Administration Management > Approval Matrix Management"
      description="Define approval levels, authority limits, conditional routing, escalation paths, delegation rules, and SoD controls."
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
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">Approval Matrix Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {matrixMaster.matrixStatus}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  v{matrixMaster.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Central Approval Workflow Governance Engine
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Approval Matrix preview generated.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview Matrix
            </button>

            <button
              onClick={() => showNotification("Matrix validation complete: 0 routing circularity or SoD conflicts detected.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Validate Matrix
            </button>

            <button
              onClick={() => showNotification("Approval Matrix record saved successfully.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Submitted for Management Review & Executive Activation.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Approval Matrix Master Form & Snapshot Side Card (Matching Attached Reference Screenshot) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Matrix Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Approval Matrix Master
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
                  <span>Matrix ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={matrixMaster.matrixId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Matrix Code *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  value={matrixMaster.matrixCode}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, matrixCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Matrix Name *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={matrixMaster.matrixName}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, matrixName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Matrix Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={matrixMaster.matrixType}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, matrixType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {MATRIX_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Matrix Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={matrixMaster.matrixStatus}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, matrixStatus: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Module *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={matrixMaster.module}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, module: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Procurement">Procurement</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                  <option value="HRMS">HRMS</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Submodule *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={matrixMaster.submodule}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, submodule: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Purchase Management">Purchase Management</option>
                  <option value="Accounts Payable">Accounts Payable</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Transaction Type *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={matrixMaster.transactionType}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, transactionType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Purchase Order">Purchase Order</option>
                  <option value="Purchase Requisition">Purchase Requisition</option>
                  <option value="Vendor Payment">Vendor Payment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Organization Scope *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={matrixMaster.orgScope}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, orgScope: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Business Unit">Business Unit</option>
                  <option value="Global">Global</option>
                  <option value="Legal Entity">Legal Entity</option>
                  <option value="Department">Department</option>
                  <option value="Branch">Branch</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Priority</span>
                  <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-1 rounded">C</span>
                </label>
                <input
                  type="number"
                  value={matrixMaster.priority}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, priority: parseInt(e.target.value) || 1 })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective From *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={matrixMaster.effectiveFrom}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, effectiveFrom: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective To</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={matrixMaster.effectiveTo}
                  onChange={(e) => setMatrixMaster({ ...matrixMaster, effectiveTo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Version</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={matrixMaster.version}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Created By</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={matrixMaster.createdBy}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Description *</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
              </label>
              <textarea
                rows={2}
                value={matrixMaster.description}
                onChange={(e) => setMatrixMaster({ ...matrixMaster, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Right 3 columns: Matrix Summary Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Matrix Summary</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {matrixMaster.matrixStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">Total Levels</span>
                  <span className="font-bold text-sm text-foreground font-mono">4</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">Total Conditions</span>
                  <span className="font-bold text-sm text-foreground font-mono">3</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">Escalation Rules</span>
                  <span className="font-bold text-sm text-foreground font-mono">2</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">Active Delegations</span>
                  <span className="font-bold text-sm text-foreground font-mono">1</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">SLA Compliance</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Excellent</span>
                <span className="text-[9px] text-muted-foreground block mt-1">Avg: 12h 45m</span>
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
              { key: "overview", label: "Overview", icon: Layers },
              { key: "approval-levels", label: "Approval Levels", icon: UserCheck },
              { key: "conditions", label: "Conditions", icon: Sliders },
              { key: "routing", label: "Routing & Sequence", icon: ArrowRight },
              { key: "escalation", label: "Escalation", icon: AlertTriangle },
              { key: "delegation", label: "Delegation", icon: UserCheck },
              { key: "sla", label: "SLA & Reminders", icon: Clock },
              { key: "sod", label: "SoD & Controls", icon: ShieldCheck },
              { key: "history", label: "History & Versions", icon: History },
              { key: "documents", label: "Documents", icon: FileText },
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
              {/* Row 1: 2. Approval Levels | 3. Conditions | 4. Transaction Definition */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 2. Approval Levels */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">2. Approval Levels</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                          <th className="py-1.5 px-1">Level</th>
                          <th className="py-1.5 px-1">Level Name</th>
                          <th className="py-1.5 px-1">Approver / Role</th>
                          <th className="py-1.5 px-1 text-right">Approval Limit (INR)</th>
                          <th className="py-1.5 px-1 text-center">Mandatory</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-[11px]">
                        {APPROVAL_LEVELS_DATA.map((lvl) => (
                          <tr key={lvl.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-1.5 px-1 font-mono font-bold text-primary">{lvl.level}</td>
                            <td className="py-1.5 px-1 font-medium text-foreground">{lvl.name}</td>
                            <td className="py-1.5 px-1 text-muted-foreground">{lvl.approver}</td>
                            <td className="py-1.5 px-1 text-right font-mono font-bold text-foreground">{lvl.limit}</td>
                            <td className="py-1.5 px-1 text-center">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => showNotification("Add Level modal opened.")}
                    className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer pt-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Level
                  </button>
                </div>

                {/* 3. Conditions */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">3. Conditions</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                          <th className="py-1.5 px-1">#</th>
                          <th className="py-1.5 px-1">Condition</th>
                          <th className="py-1.5 px-1">Field</th>
                          <th className="py-1.5 px-1">Operator</th>
                          <th className="py-1.5 px-1">Value</th>
                          <th className="py-1.5 px-1">Logic</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-[11px]">
                        {MATRIX_CONDITIONS_DATA.map((c) => (
                          <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-1.5 px-1 font-mono text-muted-foreground">{c.id.replace("CND-", "")}</td>
                            <td className="py-1.5 px-1 font-medium text-foreground">{c.name}</td>
                            <td className="py-1.5 px-1 text-muted-foreground font-mono text-[10px]">{c.field}</td>
                            <td className="py-1.5 px-1 text-muted-foreground">{c.operator}</td>
                            <td className="py-1.5 px-1 font-mono font-bold text-foreground">{c.value}</td>
                            <td className="py-1.5 px-1 font-bold text-primary">{c.logic}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => showNotification("Add Condition modal opened.")}
                    className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer pt-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Condition
                  </button>
                </div>

                {/* 4. Transaction Definition */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    4. Transaction Definition
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Transaction Code</span>
                      <span className="font-bold text-foreground font-mono">PO</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Transaction Description</span>
                      <span className="font-semibold text-foreground">Purchase Order</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Initiator Role</span>
                      <span className="font-medium text-foreground">Purchase Executive</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Currency</span>
                      <span className="font-mono text-foreground font-bold">INR</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Criticality</span>
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                        Medium
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Approval Required</span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Yes
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-border/50">
                      <span className="text-muted-foreground">Status</span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: 5. Routing & Sequence | 6. Escalation Matrix | 7. Delegation | 8. SLA & Reminders */}
              <div className="grid gap-4 lg:grid-cols-4">
                {/* 5. Routing & Sequence */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    5. Routing & Sequence
                  </h4>

                  {/* Flow Steps Diagram */}
                  <div className="flex items-center justify-between gap-1 bg-muted/20 p-2 rounded-lg text-center text-[9px]">
                    <div className="rounded border border-border bg-card p-1.5">
                      <span className="font-bold text-foreground block">1. Dept Appr</span>
                      <span className="text-muted-foreground">Sequential</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div className="rounded border border-border bg-card p-1.5">
                      <span className="font-bold text-foreground block">2. Finance</span>
                      <span className="text-muted-foreground">Sequential</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div className="rounded border border-border bg-card p-1.5">
                      <span className="font-bold text-foreground block">3. BU Head</span>
                      <span className="text-muted-foreground">Sequential</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div className="rounded border border-primary/40 bg-primary/10 p-1.5 text-primary">
                      <span className="font-bold block">4. CFO</span>
                      <span>Final</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs pt-1 border-t border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Sequence Type</span>
                      <span className="font-bold text-foreground">Sequential</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Parallel Levels</span>
                      <span className="text-muted-foreground">-</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Auto Skip</span>
                      <span className="text-muted-foreground">Disabled</span>
                    </div>
                  </div>
                </div>

                {/* 6. Escalation Matrix */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">6. Escalation Matrix</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                          <th className="py-1 px-1">Lvl</th>
                          <th className="py-1 px-1">Trigger</th>
                          <th className="py-1 px-1">After</th>
                          <th className="py-1 px-1">Escalate To</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-[10px]">
                        {ESCALATION_RULES_DATA.map((e) => (
                          <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-1 px-1 font-mono font-bold text-primary">{e.level}</td>
                            <td className="py-1 px-1 font-medium text-foreground">{e.trigger}</td>
                            <td className="py-1 px-1 font-mono text-muted-foreground">{e.time}</td>
                            <td className="py-1 px-1 text-foreground">{e.escalateTo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => showNotification("Add Escalation Rule modal opened.")}
                    className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer pt-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Escalation Rule
                  </button>
                </div>

                {/* 7. Delegation */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      7. Delegation
                    </h4>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Delegation Allowed</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                          Yes
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Active Delegations</span>
                        <span className="font-bold text-foreground font-mono">1</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Delegation Scope</span>
                        <span className="font-medium text-foreground">Full Authority</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Valid From</span>
                        <span className="font-mono text-muted-foreground text-[10px]">01 May 2024</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Valid To</span>
                        <span className="font-mono text-muted-foreground text-[10px]">31 May 2024</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Delegations directory opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View Delegations
                  </button>
                </div>

                {/* 8. SLA & Reminders */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      8. SLA & Reminders
                    </h4>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">SLA for Each Level</span>
                        <span className="font-mono font-bold text-foreground">24 Hours</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Reminder After</span>
                        <span className="font-mono text-muted-foreground">12 Hours</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Escalation After</span>
                        <span className="font-mono text-muted-foreground">24 Hours</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Auto Escalation</span>
                        <span className="font-semibold text-emerald-600">Enabled</span>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-border/50">
                        <span className="text-muted-foreground">SLA Status</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                          Compliant
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("SLA analytics report opened.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View SLA Details
                  </button>
                </div>
              </div>

              {/* Row 3: 9. Recent Approval Requests | 10. Approval Matrix Workflow */}
              <div className="grid gap-4 lg:grid-cols-12">
                {/* 9. Recent Approval Requests */}
                <div className="lg:col-span-8 rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">9. Recent Approval Requests (This Matrix)</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                          <th className="py-1.5 px-1">Request ID</th>
                          <th className="py-1.5 px-1">Transaction</th>
                          <th className="py-1.5 px-1 text-right">Amount (INR)</th>
                          <th className="py-1.5 px-1">Initiator</th>
                          <th className="py-1.5 px-1">Current Level</th>
                          <th className="py-1.5 px-1">Current Approver</th>
                          <th className="py-1.5 px-1">Status</th>
                          <th className="py-1.5 px-1">SLA Due</th>
                          <th className="py-1.5 px-1">Age</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-[11px]">
                        {RECENT_APPROVAL_REQUESTS.map((req) => (
                          <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-1.5 px-1 font-mono font-medium text-primary">{req.id}</td>
                            <td className="py-1.5 px-1 font-medium text-foreground">{req.tx}</td>
                            <td className="py-1.5 px-1 text-right font-mono font-bold text-foreground">{req.amount}</td>
                            <td className="py-1.5 px-1 text-muted-foreground">{req.initiator}</td>
                            <td className="py-1.5 px-1 font-medium">{req.level}</td>
                            <td className="py-1.5 px-1 font-medium text-foreground">{req.approver}</td>
                            <td className="py-1.5 px-1">
                              <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold border", req.badge)}>
                                {req.status}
                              </span>
                            </td>
                            <td className="py-1.5 px-1 font-mono text-[10px] text-muted-foreground">{req.due}</td>
                            <td className="py-1.5 px-1 font-mono text-[10px]">{req.age}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => showNotification("All requests view loaded.")}
                    className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer pt-1"
                  >
                    View All Requests
                  </button>
                </div>

                {/* 10. Approval Matrix Workflow */}
                <div className="lg:col-span-4 rounded-xl border border-border bg-card p-4 space-y-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      10. Approval Matrix Workflow
                    </h4>

                    {/* Step Sequence Icons */}
                    <div className="flex items-center justify-between gap-1 py-3 text-center text-[9px] border-b border-border/50">
                      <div>
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center mx-auto mb-1 text-muted-foreground font-bold">1</div>
                        <span>Draft</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center mx-auto mb-1 text-muted-foreground font-bold">2</div>
                        <span>Define Rules</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center mx-auto mb-1 text-muted-foreground font-bold">3</div>
                        <span>Approvers</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-1 font-bold border border-emerald-500/40">✓</div>
                        <span className="font-bold text-emerald-600">Active</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Next Review Date</span>
                        <span className="font-mono text-foreground">01 Jan 2025</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Approved By</span>
                        <span className="font-semibold text-foreground">Rahul Sharma</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Approved On</span>
                        <span className="font-mono text-muted-foreground text-[10px]">15 May 2024</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Last Reviewed</span>
                        <span className="font-semibold text-foreground">Rahul Sharma</span>
                      </div>
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
                <span className="text-xs text-muted-foreground">Matrix ID: MAT-2024-00078</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed rule settings for <span className="font-semibold text-foreground capitalize">{activeTab}</span> adhering to MAICW specification.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Active Matrix Rules</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">4 Level Rules</span>
                  <p className="text-[11px] text-muted-foreground">100% SLA compliance rate.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">SoD Conflict Check</span>
                  <span className="text-xl font-bold font-mono text-blue-600">0 Conflicts</span>
                  <p className="text-[11px] text-muted-foreground">Compliant with internal financial controls.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Audit Readiness</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">Verified</span>
                  <p className="text-[11px] text-muted-foreground">Complete digital signatures logged.</p>
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
            Last Modified: <span className="font-sans font-semibold text-foreground">15 May 2024 10:30 AM</span> by <span className="font-sans font-semibold text-foreground">Rahul Sharma</span> | Created By: <span className="font-sans font-semibold text-foreground">Rahul Sharma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

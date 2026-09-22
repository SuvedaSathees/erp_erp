import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchApprovalMatrices } from "@/services";
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
  { id: "APR-2024-01576", tx: "Capex Machinery Acquisition", amount: "75,00,000", initiator: "Dinesh Patil", level: "Level 4", approver: "CFO & Capex Board", status: "Pending", due: "15 May 2024 05:00 PM", age: "5h 20m", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "APR-2024-01575", tx: "Vendor Service Agreement", amount: "18,50,000", initiator: "Tanvi Saxena", level: "Level 2", approver: "Legal & CFO", status: "Pending", due: "15 May 2024 02:00 PM", age: "2h 10m", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "APR-2024-01574", tx: "Cloud Infrastructure Expansion", amount: "14,20,000", initiator: "Priya Menon", level: "Level 3", approver: "CTO (Vikram Singh)", status: "Approved", due: "14 May 2024 06:00 PM", age: "-", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "APR-2024-01573", tx: "Executive Talent Onboarding", amount: "3,40,000", initiator: "Karan Johar", level: "Level 1", approver: "VP - HR (Meera Nair)", status: "Approved", due: "14 May 2024 11:00 AM", age: "-", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "APR-2024-01572", tx: "International Freight Clearance", amount: "5,75,000", initiator: "Rajesh Pillai", level: "Level 2", approver: "Head - Supply Chain", status: "Rejected", due: "14 May 2024 01:00 PM", age: "-", badge: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
];

function ApprovalMatrixManagementPage() {
  const matrixQuery = useQuery({
    queryKey: ["admin", "approval-matrices"],
    queryFn: () => fetchApprovalMatrices(),
  });

  const dbLevels = (matrixQuery.data ?? []).map((m: any, i: number) => ({
    id: m.id ?? `LVL-${i + 1}`,
    level: m.level ?? i + 1,
    name: m.approverRole ?? `Level ${m.level}`,
    type: "Role",
    approver: m.approverRole ?? "",
    limit: m.amountLimit ? `Up to ₹ ${Number(m.amountLimit).toLocaleString("en-IN")}` : "-",
    mandatory: m.isActive ?? true,
    time: m.level ?? 1,
  }));

  const [activeTab, setActiveTab] = useState<"overview" | "levels" | "routing" | "requests">("overview");

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

  // Dynamic Approval Levels State
  const [fallbackLevels, setFallbackLevels] = useState([
    { id: "LVL-1", level: 1, name: "Department Approval", type: "Role", approver: "Purchase Manager", limit: "Up to ₹ 1,00,000", mandatory: true, time: 1 },
    { id: "LVL-2", level: 2, name: "Finance Approval", type: "Role", approver: "Finance Manager", limit: "₹ 1,00,001 - ₹ 10,00,000", mandatory: true, time: 2 },
    { id: "LVL-3", level: 3, name: "BU Head Approval", type: "Role", approver: "Head - Procurement", limit: "₹ 10,00,001 - ₹ 50,00,000", mandatory: true, time: 3 },
    { id: "LVL-4", level: 4, name: "CFO Approval", type: "User", approver: "Chief Financial Officer", limit: "Above ₹ 50,00,000", mandatory: true, time: 4 },
  ]);
  const levelsList = dbLevels.length > 0 ? dbLevels : fallbackLevels;

  // Dynamic Live Requests
  const [requestsList, setRequestsList] = useState([
    { id: "APR-2024-01576", tx: "Capex Machinery Acquisition", amount: "₹ 75,00,000", initiator: "Dinesh Patil", level: "Level 4", approver: "CFO & Capex Board", status: "Pending", due: "15 May 2024 05:00 PM" },
    { id: "APR-2024-01575", tx: "Vendor Service Agreement", amount: "₹ 18,50,000", initiator: "Tanvi Saxena", level: "Level 2", approver: "Legal & CFO", status: "Pending", due: "15 May 2024 02:00 PM" },
    { id: "APR-2024-01574", tx: "Cloud Infrastructure Expansion", amount: "₹ 14,20,000", initiator: "Priya Menon", level: "Level 3", approver: "CTO (Vikram Singh)", status: "Approved", due: "14 May 2024 06:00 PM" },
    { id: "APR-2024-01573", tx: "Executive Talent Onboarding", amount: "₹ 3,40,000", initiator: "Karan Johar", level: "Level 1", approver: "VP - HR (Meera Nair)", status: "Approved", due: "14 May 2024 11:00 AM" },
  ]);

  const [conditionsList, setConditionsList] = useState([
    { id: "CND-1", name: "Amount Threshold Rule", field: "PO Amount", operator: "Greater Than", value: "₹ 1,00,000", logic: "AND", active: true },
    { id: "CND-2", name: "Capex Category Check", field: "Item Category", operator: "In", value: "Machinery, IT Infrastructure", logic: "AND", active: true },
    { id: "CND-3", name: "Urgent Expedited Flag", field: "Criticality", operator: "Equals", value: "High", logic: "OR", active: false },
  ]);

  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [newLevelForm, setNewLevelForm] = useState({
    name: "",
    type: "Role",
    approver: "Purchase Manager",
    limit: "Up to ₹ 5,00,000",
    time: "2",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Approval Matrix Management"
      breadcrumb="Management > Organization > Approval Matrix Management"
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
              { key: "overview", label: "Matrix Overview & Parameters", icon: Layers },
              { key: "levels", label: "Approval Levels & Authority", icon: UserCheck },
              { key: "routing", label: "Conditional Routing", icon: Sliders },
              { key: "requests", label: "Live Requests & Audit Logs", icon: Clock },
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
              {/* Row 1: Approval Matrix Setup | Routing Sequence Preview */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 2. Matrix Parameters */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Approval Matrix Parameters
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Governing Module:</span>
                      <span className="font-semibold text-foreground">{matrixMaster.module}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Transaction Type:</span>
                      <span className="font-semibold text-foreground">{matrixMaster.transactionType}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Organizational Scope:</span>
                      <span className="font-semibold text-foreground">{matrixMaster.orgScope}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">SoD Policy Enforcement:</span>
                      <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                        Zero Conflict Enforced
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Visual Workflow Routing */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">3. Visual Workflow Routing Path</h4>
                    <span className="text-[10px] text-muted-foreground font-mono">Sequential Chain</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                    {levelsList.map((lvl, idx) => (
                      <div key={lvl.id} className="relative flex flex-col items-center p-3 rounded-xl border border-border bg-muted/20">
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-mono font-bold text-primary mb-2">
                          L{lvl.level}
                        </div>
                        <span className="font-bold text-foreground block text-[11px] truncate w-full">{lvl.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate w-full mt-0.5">{lvl.approver}</span>
                        <span className="text-[9px] font-mono text-emerald-600 font-bold mt-1">{lvl.limit}</span>
                        {idx < levelsList.length - 1 && (
                          <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground font-bold">
                            →
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APPROVAL LEVELS WORKSPACE */}
          {activeTab === "levels" && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Configured Approval Tier Architecture ({levelsList.length} Levels)</h4>
                <button
                  onClick={() => setShowAddLevelModal(true)}
                  className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  + Add Approval Tier
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3">Level #</th>
                      <th className="py-2.5 px-3">Level Name</th>
                      <th className="py-2.5 px-3">Approver Role / Identity</th>
                      <th className="py-2.5 px-3">Threshold Limit</th>
                      <th className="py-2.5 px-3 text-center">Mandatory</th>
                      <th className="py-2.5 px-3">SLA Turnaround</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground text-[11px]">
                    {levelsList.map((lvl) => (
                      <tr key={lvl.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-primary">Level {lvl.level}</td>
                        <td className="py-2 px-3 font-semibold">{lvl.name}</td>
                        <td className="py-2 px-3 text-muted-foreground">{lvl.approver} ({lvl.type})</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-600">{lvl.limit}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                            {lvl.mandatory ? "Required" : "Optional"}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono">{lvl.time} Days</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setFallbackLevels((prev) => prev.filter((item) => item.id !== lvl.id));
                              showNotification(`Approval Level ${lvl.level} removed.`);
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
          )}

          {/* CONDITIONAL ROUTING WORKSPACE */}
          {activeTab === "routing" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">Dynamic Business Logic Conditions & Triggers</h4>
                  <span className="text-[10px] text-muted-foreground font-mono">Evaluated Pre-Routing</span>
                </div>

                <div className="space-y-3">
                  {conditionsList.map((cnd, idx) => (
                    <div key={cnd.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/15 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{cnd.name}</span>
                          <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[9px] font-mono font-bold">
                            {cnd.logic}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] font-mono">
                          IF <span className="text-foreground font-semibold">{cnd.field}</span> {cnd.operator} <span className="text-primary font-semibold font-mono">"{cnd.value}"</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setConditionsList((prev) => prev.map((c, i) => i === idx ? { ...c, active: !c.active } : c));
                        }}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border",
                          cnd.active ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {cnd.active ? "Active Rule" : "Disabled"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LIVE REQUESTS WORKSPACE */}
          {activeTab === "requests" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Live Purchase Approval Queue & Execution Log
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">Real-time Transaction Gateway</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Request ID</th>
                      <th className="py-2 px-2">Transaction</th>
                      <th className="py-2 px-2">Total Amount</th>
                      <th className="py-2 px-2">Initiator</th>
                      <th className="py-2 px-2">Current Tier</th>
                      <th className="py-2 px-2">Approver</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {requestsList.map((req) => (
                      <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 font-mono font-bold text-primary">{req.id}</td>
                        <td className="py-2 px-2 font-medium">{req.tx}</td>
                        <td className="py-2 px-2 font-mono font-bold text-foreground">{req.amount}</td>
                        <td className="py-2 px-2 text-muted-foreground">{req.initiator}</td>
                        <td className="py-2 px-2 font-mono">{req.level}</td>
                        <td className="py-2 px-2 text-foreground font-medium">{req.approver}</td>
                        <td className="py-2 px-2">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold",
                              req.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            )}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right">
                          {req.status === "Pending" ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setRequestsList((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "Approved" } : r));
                                  showNotification(`Request ${req.id} approved.`);
                                }}
                                className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px] hover:bg-emerald-600 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRequestsList((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "Rejected" } : r));
                                  showNotification(`Request ${req.id} rejected.`);
                                }}
                                className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px] hover:bg-rose-600 cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground font-mono text-[10px]">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- ADD APPROVAL LEVEL MODAL --- */}
        {showAddLevelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Add Approval Level</h3>
                </div>
                <button onClick={() => setShowAddLevelModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Level Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Managing Director Sign-off"
                    value={newLevelForm.name}
                    onChange={(e) => setNewLevelForm({ ...newLevelForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Approver Role</label>
                    <input
                      type="text"
                      value={newLevelForm.approver}
                      onChange={(e) => setNewLevelForm({ ...newLevelForm, approver: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Threshold Limit</label>
                    <input
                      type="text"
                      value={newLevelForm.limit}
                      onChange={(e) => setNewLevelForm({ ...newLevelForm, limit: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddLevelModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newLevelForm.name) {
                      alert("Please provide level name.");
                      return;
                    }
                    setFallbackLevels((prev) => [
                      ...prev,
                      {
                        id: `LVL-${prev.length + 1}`,
                        level: prev.length + 1,
                        name: newLevelForm.name,
                        type: newLevelForm.type,
                        approver: newLevelForm.approver,
                        limit: newLevelForm.limit,
                        mandatory: true,
                        time: Number(newLevelForm.time) || 2,
                      },
                    ]);
                    setShowAddLevelModal(false);
                    showNotification(`Approval Tier Level ${levelsList.length + 1} added.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Save Tier
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
            Last Modified: <span className="font-sans font-semibold text-foreground">15 May 2024 10:30 AM</span> by <span className="font-sans font-semibold text-foreground">Rahul Sharma</span> | Created By: <span className="font-sans font-semibold text-foreground">Rahul Sharma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

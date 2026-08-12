import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Building2,
  MapPin,
  FileCheck,
  Users,
  Building,
  Landmark,
  Sliders,
  TrendingUp,
  AlertTriangle,
  FileText,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Save,
  Send,
  ShieldCheck,
  DollarSign,
  Briefcase,
  Layers,
  Map,
  ShieldAlert,
  HelpCircle,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/branch-management")({
  head: () => ({
    meta: [
      { title: "Branch Management · Magnertia ERP" },
      {
        name: "description",
        content: "Manage complete branch lifecycle from strategy, location, legal registration, infrastructure, organization, finance, operations, compliance, performance to closure.",
      },
    ],
  }),
  component: BranchManagementPage,
});

// --- Data Models ---

const BRANCH_TYPES = [
  "Corporate Branch",
  "Regional Branch",
  "State Branch",
  "District Branch",
  "Sales Branch",
  "Service Branch",
  "Development Branch",
  "Manufacturing Branch",
  "Warehouse Branch",
  "Distribution Branch",
  "Franchise Branch",
  "Project Branch",
  "Representative Office",
  "International Branch",
];

const BRANCH_KPIS_DATA = [
  { id: "KPI-001", name: "Revenue", target: "₹ 15,00,00,000", actual: "₹ 4,25,00,000", achievement: "28.33%", status: "On Track", statusColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "KPI-002", name: "Gross Margin %", target: "40.00%", actual: "45.62%", achievement: "114.05%", status: "Achieved", statusColor: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { id: "KPI-003", name: "Customer Satisfaction", target: "85.00%", actual: "82.00%", achievement: "96.47%", status: "Near Target", statusColor: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "KPI-004", name: "On-time Delivery", target: "95.00%", actual: "93.00%", achievement: "97.89%", status: "Near Target", statusColor: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "KPI-005", name: "Employee Productivity", target: "90.00%", actual: "88.00%", achievement: "97.78%", status: "Near Target", statusColor: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "KPI-006", name: "Compliance Score", target: "100.00%", actual: "92.00%", achievement: "92.00%", status: "At Risk", statusColor: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
];

export function BranchManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "location"
    | "registration"
    | "organization"
    | "people"
    | "infrastructure"
    | "finance"
    | "operations"
    | "compliance"
    | "performance"
    | "risk"
    | "documents"
    | "history"
  >("overview");

  // Master Form State
  const [branchMaster, setBranchMaster] = useState({
    branchId: "BR-2024-0008",
    branchCode: "BR-DEL-001",
    branchName: "Delhi Corporate Branch",
    legalEntity: "Magnertia Global Pvt. Ltd.",
    parentOrg: "Magnertia Global Technologies",
    parentBranch: "None (Regional Hub)",
    branchType: "Corporate Branch",
    branchCategory: "Corporate",
    branchHead: "Rajeev Malhotra",
    branchStatus: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "",
    version: "1.0",
    priority: "High",
    currency: "INR - Indian Rupee",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Branch Management"
      breadcrumb="Management > Administration Management > Branch Management"
      description="Manage the complete lifecycle of Magnertia's branches—from branch strategy, location, legal registration, infrastructure, organization, people, finance, operations, compliance to performance."
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
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">Branch Management Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {branchMaster.branchStatus}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  v{branchMaster.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Branch Network Architecture & Governance
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Branch preview modal generated.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview Branch
            </button>

            <button
              onClick={() => showNotification("Branch compliance check: 100% legal & statutory criteria validated.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Validate Branch
            </button>

            <button
              onClick={() => showNotification("Branch Master record saved successfully.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Submitted for Regional & Corporate Executive Approval.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Branch Master Form & Snapshot Card (Matching Attached Screenshot) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Branch Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Branch Master
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
                  <span>Branch ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={branchMaster.branchId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Branch Code *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  value={branchMaster.branchCode}
                  onChange={(e) => setBranchMaster({ ...branchMaster, branchCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Branch Name *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={branchMaster.branchName}
                  onChange={(e) => setBranchMaster({ ...branchMaster, branchName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Legal Entity *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={branchMaster.legalEntity}
                  onChange={(e) => setBranchMaster({ ...branchMaster, legalEntity: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Magnertia Global Pvt. Ltd.">Magnertia Global Pvt. Ltd.</option>
                  <option value="Magnertia Tech Inc.">Magnertia Tech Inc. (USA)</option>
                  <option value="Magnertia Europe GmbH">Magnertia Europe GmbH</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Parent Organization *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={branchMaster.parentOrg}
                  onChange={(e) => setBranchMaster({ ...branchMaster, parentOrg: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Magnertia Global Technologies">Magnertia Global Technologies</option>
                  <option value="Magnertia Services Pvt. Ltd.">Magnertia Services Pvt. Ltd.</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Parent Branch</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={branchMaster.parentBranch}
                  onChange={(e) => setBranchMaster({ ...branchMaster, parentBranch: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="None (Regional Hub)">Select parent branch</option>
                  <option value="Bengaluru HQ">Bengaluru Headquarters (BR-BLR-001)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Branch Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={branchMaster.branchType}
                  onChange={(e) => setBranchMaster({ ...branchMaster, branchType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {BRANCH_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Branch Category *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={branchMaster.branchCategory}
                  onChange={(e) => setBranchMaster({ ...branchMaster, branchCategory: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Corporate">Corporate</option>
                  <option value="Tier-1 Metro">Tier-1 Metro</option>
                  <option value="Tier-2 Regional">Tier-2 Regional</option>
                  <option value="International Hub">International Hub</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Branch Head *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={branchMaster.branchHead}
                  onChange={(e) => setBranchMaster({ ...branchMaster, branchHead: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Rajeev Malhotra">Rajeev Malhotra</option>
                  <option value="Amit Desai">Amit Desai</option>
                  <option value="Vikram Singh">Vikram Singh</option>
                  <option value="Sandeep Iyer">Sandeep Iyer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Branch Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={branchMaster.branchStatus}
                  onChange={(e) => setBranchMaster({ ...branchMaster, branchStatus: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Planned">Planned</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective From *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={branchMaster.effectiveFrom}
                  onChange={(e) => setBranchMaster({ ...branchMaster, effectiveFrom: e.target.value })}
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
                  value={branchMaster.effectiveTo}
                  onChange={(e) => setBranchMaster({ ...branchMaster, effectiveTo: e.target.value })}
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
                  value={branchMaster.version}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Priority</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={branchMaster.priority}
                  onChange={(e) => setBranchMaster({ ...branchMaster, priority: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Currency</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={branchMaster.currency}
                  onChange={(e) => setBranchMaster({ ...branchMaster, currency: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                  <option value="USD - US Dollar">USD - US Dollar</option>
                  <option value="EUR - Euro">EUR - Euro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right 3 columns: Branch Snapshot Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Branch Snapshot</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {branchMaster.branchStatus}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Employees</span>
                  <span className="font-bold text-foreground font-mono">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Departments</span>
                  <span className="font-bold text-foreground font-mono">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Open Positions</span>
                  <span className="font-bold text-amber-600 font-mono">14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cost Centre</span>
                  <span className="font-mono text-muted-foreground text-[11px]">CC-BR-DEL-001</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Profit Centre</span>
                  <span className="font-mono text-muted-foreground text-[11px]">PC-BR-DEL-001</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Go-Live Date</span>
                  <span className="font-mono text-foreground text-[11px]">01 Apr 2024</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">Overall Health</span>
                <span className="text-base font-bold text-emerald-600 font-mono">85%</span>
              </div>
              <p className="text-[10px] text-emerald-600 text-right font-medium">Good Operational Health</p>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "overview", label: "Overview", icon: Layers },
              { key: "location", label: "Location", icon: MapPin },
              { key: "registration", label: "Registration & Legal", icon: FileCheck },
              { key: "organization", label: "Organization", icon: Building },
              { key: "people", label: "People", icon: Users },
              { key: "infrastructure", label: "Infrastructure", icon: Building2 },
              { key: "finance", label: "Finance", icon: Landmark },
              { key: "operations", label: "Operations", icon: Sliders },
              { key: "compliance", label: "Compliance", icon: ShieldCheck },
              { key: "performance", label: "Performance", icon: TrendingUp },
              { key: "risk", label: "Risk", icon: AlertTriangle },
              { key: "documents", label: "Documents", icon: FileText },
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

          {/* OVERVIEW TAB CONTENT (Matching attached screenshot layout) */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: Purpose & Strategy | Branch Location | Registration & Legal */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 2. Branch Purpose & Strategy */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Branch Purpose & Strategy
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Branch Vision *</label>
                      <textarea
                        rows={2}
                        readOnly
                        value="To be the most trusted partner in delivering innovative solutions and superior customer experiences."
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 p-2 text-xs text-foreground resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Branch Mission *</label>
                      <textarea
                        rows={2}
                        readOnly
                        value="Deliver quality products and services with efficiency, accountability and continuous improvement."
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 p-2 text-xs text-foreground resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Strategic Objective *</label>
                      <textarea
                        rows={2}
                        readOnly
                        value="• Expand market presence in North India&#10;• Increase customer satisfaction and retention&#10;• Achieve profitable and sustainable growth"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 p-2 text-xs text-foreground resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Target Market *</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>North India Region</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Products / Services *</label>
                        <div className="mt-0.5 flex flex-wrap gap-1 p-1 border border-border rounded-md bg-muted/20">
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary font-medium">IT Services x</span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary font-medium">Software x</span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary font-medium">Consulting x</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Territory *</label>
                      <input
                        type="text"
                        readOnly
                        value="Delhi NCR, Haryana, Uttar Pradesh"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Expected Business Outcome *</label>
                      <textarea
                        rows={2}
                        readOnly
                        value="Achieve 20% revenue growth and 15% profit improvement within 2 years."
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 p-2 text-xs text-foreground resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Branch Location */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">3. Branch Location</h4>
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Branch Address *</label>
                      <textarea
                        rows={2}
                        readOnly
                        value="A-45, Sector-62, Noida, Gautam Buddha Nagar, Uttar Pradesh 201309, India"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 p-2 text-xs font-medium text-foreground resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Country *</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>India</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">State *</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>Uttar Pradesh</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">District *</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>Gautam Buddha Nagar</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">City *</label>
                        <input
                          type="text"
                          readOnly
                          value="Noida"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">PIN / Postal Code *</label>
                        <input
                          type="text"
                          readOnly
                          value="201309"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Latitude</label>
                        <input
                          type="text"
                          readOnly
                          value="28.5355"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Longitude</label>
                        <input
                          type="text"
                          readOnly
                          value="77.3910"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Region *</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>North</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Territory *</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>Delhi NCR</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Location Type *</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>Leased</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Ownership Type *</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>Leased</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Branch Registration & Legal */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">4. Branch Registration & Legal</h4>
                    <FileCheck className="h-4 w-4 text-emerald-500" />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Registration Type *</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>GST Registration</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Reg Number *</label>
                        <input
                          type="text"
                          readOnly
                          value="07AABCM1234F1Z5"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Reg Authority *</label>
                        <input
                          type="text"
                          readOnly
                          value="GST Department"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Reg Date</label>
                        <input
                          type="text"
                          readOnly
                          value="15 Mar 2024"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Valid From</label>
                        <input
                          type="text"
                          readOnly
                          value="15 Mar 2024"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Valid To</label>
                        <input
                          type="text"
                          readOnly
                          value="31 Mar 2029"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">GST Registration *</label>
                        <input
                          type="text"
                          readOnly
                          value="07AABCM1234F1Z5"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Local Registration *</label>
                        <input
                          type="text"
                          readOnly
                          value="LC/NOIDA/2024/1258"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Trade Licence *</label>
                        <input
                          type="text"
                          readOnly
                          value="TL/2024/NOI/5587"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Shops & Establishment *</label>
                        <input
                          type="text"
                          readOnly
                          value="SE/UP/2024/NOI/8897"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Other Licences</label>
                        <input
                          type="text"
                          readOnly
                          value="Fire NOC, IEC Code, MSME"
                          className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Compliance Status</label>
                        <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                          Compliant
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Document Reference</label>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground font-mono">GST Certificate.pdf x</span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground font-mono">Trade Licence.pdf x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Branch Organization | Financial Summary | Branch KPIs */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 5. Branch Organization */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    5. Branch Organization
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Business Unit *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Technology Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Function *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Sales & Marketing</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Department *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Sales</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Division</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>North Region</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Team</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Delhi NCR Sales Team</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Branch Head *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Rajeev Malhotra</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Functional Head</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Vikram Singh</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Administrative Head</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Neha Kapoor</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Reporting Branch</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Corporate Head Office</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Organization Level *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Level 2 - Branch</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Organization Status</label>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Financial Summary (Current FY) */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">6. Financial Summary (Current FY)</h4>
                    <span className="text-[11px] font-mono text-muted-foreground">INR ₹</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Budget (Total)</span>
                      <span className="font-bold text-foreground font-mono">₹ 12,00,00,000</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Revenue Target</span>
                      <span className="font-bold text-foreground font-mono">₹ 15,00,00,000</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">OPEX Budget</span>
                      <span className="font-bold text-foreground font-mono">₹ 6,00,00,000</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Actual Revenue</span>
                      <span className="font-bold text-emerald-600 font-mono">₹ 4,25,00,000</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Actual Cost</span>
                      <span className="font-bold text-foreground font-mono">₹ 1,95,00,000</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Actual Profit</span>
                      <span className="font-bold text-primary font-mono">₹ 2,30,00,000</span>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Budget Utilization</span>
                        <span className="font-bold font-mono">35.42%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[35%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Revenue Achievement</span>
                        <span className="font-bold font-mono">28.33%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[28%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Profit Margin</span>
                        <span className="font-bold font-mono">54.12%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[54%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Branch KPIs */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">7. Branch KPIs</h4>
                    <span className="text-[10px] text-muted-foreground">Apr 2024 - Mar 2025</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                          <th className="py-2 px-1">KPI</th>
                          <th className="py-2 px-1 text-right">Target</th>
                          <th className="py-2 px-1 text-right">Actual</th>
                          <th className="py-2 px-1 text-right">Achv %</th>
                          <th className="py-2 px-1">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-[11px]">
                        {BRANCH_KPIS_DATA.map((kpi) => (
                          <tr key={kpi.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-1.5 px-1 font-medium text-foreground">{kpi.name}</td>
                            <td className="py-1.5 px-1 text-right font-mono text-muted-foreground">{kpi.target}</td>
                            <td className="py-1.5 px-1 text-right font-mono font-bold text-foreground">{kpi.actual}</td>
                            <td className="py-1.5 px-1 text-right font-mono">{kpi.achievement}</td>
                            <td className="py-1.5 px-1">
                              <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold border", kpi.statusColor)}>
                                {kpi.status}
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
          )}

          {/* OTHER TABS PLACEHOLDER / DETAILED SURFACES */}
          {activeTab !== "overview" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="text-sm font-bold text-foreground capitalize">{activeTab} Workspace</h4>
                <span className="text-xs text-muted-foreground">Branch ID: BR-2024-0008</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed data view for <span className="font-semibold text-foreground capitalize">{activeTab}</span> parameters adhering to MAICW specification.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Branch Compliance Score</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">92.0%</span>
                  <p className="text-[11px] text-muted-foreground">All statutory & tax filings updated.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Infrastructure Capacity</span>
                  <span className="text-xl font-bold font-mono text-blue-600">156 / 200</span>
                  <p className="text-[11px] text-muted-foreground">78% office workstation utilization.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Risk Assessment Index</span>
                  <span className="text-xl font-bold font-mono text-amber-600">Low Risk (8.2/100)</span>
                  <p className="text-[11px] text-muted-foreground">No major operational bottlenecks.</p>
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
            Last Modified: <span className="font-sans font-semibold text-foreground">15 May 2024 11:30 AM</span> by <span className="font-sans font-semibold text-foreground">Rahul Sharma</span> | Created By: <span className="font-sans font-semibold text-foreground">Rahul Sharma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

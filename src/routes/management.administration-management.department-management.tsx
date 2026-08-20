import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Users,
  Layers,
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
  Building,
  Landmark,
  Star,
  Activity,
  CheckSquare,
  FileCheck,
  FolderTree,
  UserCheck,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/department-management")({
  head: () => ({
    meta: [
      { title: "Department Management · Magnertia ERP" },
      {
        name: "description",
        content: "Manage complete department lifecycle from strategy, organizational mapping, workforce positions, processes, resources, budget, KPIs, compliance, risk to performance.",
      },
    ],
  }),
  component: DepartmentManagementPage,
});

// --- Data & Mock Definitions ---

const DEPARTMENT_TYPES = [
  "Corporate Department",
  "Functional Department",
  "Operational Department",
  "Technical Department",
  "Commercial Department",
  "Support Department",
  "Shared Services Department",
  "Regional Department",
  "Project Department",
  "R&D Department",
  "Manufacturing Department",
  "Service Department",
  "International Department",
];

const TOP_KPIS_DATA = [
  { id: "KPI-001", name: "Budget Utilization", target: "100%", actual: "34%", achievement: "34%", status: "On Track", statusColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "KPI-002", name: "Monthly Closing Timeliness", target: "100%", actual: "95%", achievement: "95%", status: "On Track", statusColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "KPI-003", name: "Financial Reporting Accuracy", target: "100%", actual: "98%", achievement: "98%", status: "On Track", statusColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "KPI-004", name: "Cost Variance", target: "< 5%", actual: "3.2%", achievement: "64%", status: "On Track", statusColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "KPI-005", name: "Compliance Score", target: "100%", actual: "90%", achievement: "90%", status: "At Risk", statusColor: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "KPI-006", name: "Audit Findings Closed", target: "100%", actual: "80%", achievement: "80%", status: "At Risk", statusColor: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
];

const RECENT_ACTIVITIES = [
  { id: "ACT-001", title: "Budget FY 2024-25 approved", by: "Neha Kapoor (CFO)", date: "14 May 2024", icon: DollarSign, color: "text-emerald-500" },
  { id: "ACT-002", title: "New Position 'Financial Analyst' created", by: "Vikram Singh", date: "13 May 2024", icon: UserCheck, color: "text-blue-500" },
  { id: "ACT-003", title: "Monthly Financial Closing completed", by: "Priya Malhotra", date: "10 May 2024", icon: CheckCircle2, color: "text-emerald-500" },
  { id: "ACT-004", title: "Internal Audit - Q4 completed", by: "Audit Team", date: "08 May 2024", icon: ShieldCheck, color: "text-amber-500" },
  { id: "ACT-005", title: "Tax Compliance return filed", by: "Rohit Verma", date: "05 May 2024", icon: FileCheck, color: "text-purple-500" },
];

export function DepartmentManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "organization"
    | "structure"
    | "people"
    | "positions"
    | "processes"
    | "resources"
    | "budget"
    | "kpis"
    | "compliance"
    | "risk"
    | "projects"
    | "documents"
    | "history"
  >("overview");

  // Master Form State
  const [deptMaster, setDeptMaster] = useState({
    deptId: "DEP-2024-0007",
    deptCode: "FIN-ACC",
    deptName: "Finance & Accounts",
    legalEntity: "Magnertia Global Pvt. Ltd.",
    businessUnit: "Corporate Services",
    functionName: "Finance",
    division: "Select division",
    parentDept: "Select parent department",
    deptType: "Functional Department",
    deptHead: "Vikram Singh",
    location: "Noida Head Office",
    costCentre: "CC-FIN-001",
    deptStatus: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "",
    version: "1.0",
    orgLevel: "Level 3 - Department",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      title="Department Management"
      breadcrumb="Management > Administration Management > Department Management"
      description="Manage the complete lifecycle of a department—from strategy, organizational mapping, workforce positions, processes, resources, budget, KPIs, compliance to performance."
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
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">Department Management Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {deptMaster.deptStatus}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  v{deptMaster.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Departmental Architecture & Operational Control
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Department preview modal generated.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview Department
            </button>

            <button
              onClick={() => showNotification("Department validation complete: 0 process or budget gaps detected.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Validate Department
            </button>

            <button
              onClick={() => showNotification("Department Master record saved successfully.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Submitted for Function Head & Executive Review.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Department Master Form & Snapshot Card (Matching Attached Screenshot) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Department Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Department Master
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
                  <span>Department ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={deptMaster.deptId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Code *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  value={deptMaster.deptCode}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Name *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={deptMaster.deptName}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Legal Entity *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.legalEntity}
                  onChange={(e) => setDeptMaster({ ...deptMaster, legalEntity: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Magnertia Global Pvt. Ltd.">Magnertia Global Pvt. Ltd.</option>
                  <option value="Magnertia Tech Inc.">Magnertia Tech Inc.</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Business Unit *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.businessUnit}
                  onChange={(e) => setDeptMaster({ ...deptMaster, businessUnit: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Corporate Services">Corporate Services</option>
                  <option value="Product Business">Product Business</option>
                  <option value="Technology Business">Technology Business</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Function *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.functionName}
                  onChange={(e) => setDeptMaster({ ...deptMaster, functionName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Division</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.division}
                  onChange={(e) => setDeptMaster({ ...deptMaster, division: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Select division">Select division</option>
                  <option value="Finance Operations">Finance Operations</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Parent Department</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.parentDept}
                  onChange={(e) => setDeptMaster({ ...deptMaster, parentDept: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Select parent department">Select parent department</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={deptMaster.deptType}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {DEPARTMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Head *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.deptHead}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptHead: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Vikram Singh">Vikram Singh</option>
                  <option value="Anita Verma">Anita Verma</option>
                  <option value="Rajeev Malhotra">Rajeev Malhotra</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Location *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={deptMaster.location}
                  onChange={(e) => setDeptMaster({ ...deptMaster, location: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Noida Head Office">Noida Head Office</option>
                  <option value="Bengaluru Campus">Bengaluru Campus</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Cost Centre *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <input
                  type="text"
                  value={deptMaster.costCentre}
                  onChange={(e) => setDeptMaster({ ...deptMaster, costCentre: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Department Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={deptMaster.deptStatus}
                  onChange={(e) => setDeptMaster({ ...deptMaster, deptStatus: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Planned">Planned</option>
                  <option value="Restructuring">Restructuring</option>
                  <option value="Merged">Merged</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective From *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={deptMaster.effectiveFrom}
                  onChange={(e) => setDeptMaster({ ...deptMaster, effectiveFrom: e.target.value })}
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
                  value={deptMaster.effectiveTo}
                  onChange={(e) => setDeptMaster({ ...deptMaster, effectiveTo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Organization Level *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={deptMaster.orgLevel}
                  onChange={(e) => setDeptMaster({ ...deptMaster, orgLevel: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Level 3 - Department">Level 3 - Department</option>
                  <option value="Level 4 - Sub-Department">Level 4 - Sub-Department</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right 3 columns: Department Snapshot Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Department Snapshot</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {deptMaster.deptStatus}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Employees</span>
                  <span className="font-bold text-foreground font-mono">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Positions</span>
                  <span className="font-bold text-foreground font-mono">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Open Positions</span>
                  <span className="font-bold text-amber-600 font-mono">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cost Centre</span>
                  <span className="font-mono text-muted-foreground text-[11px]">{deptMaster.costCentre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget (FY 2024-25)</span>
                  <span className="font-bold text-foreground font-mono">₹ 12,50,00,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Spent (YTD)</span>
                  <span className="font-bold text-emerald-600 font-mono">₹ 4,25,00,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget Utilization</span>
                  <span className="font-mono text-foreground font-bold">34.00%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Performance Score</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Good</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full border-4 border-emerald-500 text-xs font-bold font-mono text-emerald-600">
                82%
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "overview", label: "Overview", icon: Layers },
              { key: "organization", label: "Organization", icon: Building },
              { key: "structure", label: "Structure", icon: FolderTree },
              { key: "people", label: "People", icon: Users },
              { key: "positions", label: "Positions", icon: UserCheck },
              { key: "processes", label: "Processes", icon: Sliders },
              { key: "resources", label: "Resources", icon: Building2 },
              { key: "budget", label: "Budget", icon: Landmark },
              { key: "kpis", label: "KPIs", icon: TrendingUp },
              { key: "compliance", label: "Compliance", icon: ShieldCheck },
              { key: "risk", label: "Risk", icon: AlertTriangle },
              { key: "projects", label: "Projects", icon: Briefcase },
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
              {/* Row 1: Purpose & Strategy | Organizational Mapping | Key Metrics (YTD) */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 2. Department Purpose & Strategy */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Department Purpose & Strategy
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Department Vision *</label>
                      <textarea
                        rows={2}
                        readOnly
                        value="To be a trusted financial partner driving sustainable value creation through financial excellence."
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 p-2 text-xs text-foreground resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Department Mission *</label>
                      <textarea
                        rows={2}
                        readOnly
                        value="To deliver accurate financial information, ensure compliance and support strategic decision making."
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 p-2 text-xs text-foreground resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Department Purpose *</label>
                      <textarea
                        rows={2}
                        readOnly
                        value="To manage financial resources, ensure regulatory compliance, enable control and support business growth."
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 p-2 text-xs text-foreground resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Strategic Objectives *</label>
                      <textarea
                        rows={2}
                        readOnly
                        value="• Strengthen financial governance and compliance&#10;• Improve cost efficiency and reduce variances&#10;• Enhance financial analytics and reporting&#10;• Automate financial processes and systems"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 p-2 text-xs text-foreground resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[11px] text-muted-foreground block">Priority</label>
                        <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                          <option>High</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-muted-foreground block">Strategic Importance</label>
                        <div className="mt-1 flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                          ))}
                          <Star className="h-3.5 w-3.5 text-muted-foreground/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Organizational Mapping */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Organizational Mapping
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Business Unit *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Corporate Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Function *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Finance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Division</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Finance Operations</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Branch</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Noida Head Office</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Region</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>North Region</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Country</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>India</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Department Head *</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Vikram Singh</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Functional Head</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Neha Kapoor</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Administrative Head</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Arjun Mehta</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Reporting Dept</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Corporate Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Org Level</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Level 3 - Department</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Org Status</label>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Visual Reporting Structure Tree Mini Diagram */}
                  <div className="pt-2 border-t border-border/50">
                    <span className="text-[11px] font-bold text-foreground block mb-2">Reporting Structure</span>
                    <div className="flex flex-col items-center space-y-1 bg-muted/20 p-2 rounded-lg text-[10px]">
                      <div className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-1 font-bold text-purple-700">
                        Neha Kapoor (Chief Financial Officer)
                      </div>
                      <div className="h-2 w-0.5 bg-border" />
                      <div className="rounded border border-primary/40 bg-card px-2 py-1 font-bold text-primary">
                        Vikram Singh (Head - Finance & Accounts)
                      </div>
                      <div className="h-2 w-0.5 bg-border" />
                      <div className="flex gap-1 overflow-x-auto w-full justify-center">
                        {["Amit Desai", "Priya Malhotra", "Rohit Verma", "Sunil Yadav", "Kavita Sharma"].map((m) => (
                          <div key={m} className="rounded border border-border bg-background px-1.5 py-0.5 text-[9px] truncate">
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Key Metrics (YTD) */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    4. Key Metrics (YTD)
                  </h4>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-lg border border-border bg-muted/20 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Budget (Total)</span>
                      <span className="font-bold text-xs text-foreground font-mono">₹ 12,50,00,000</span>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Spent (YTD)</span>
                      <span className="font-bold text-xs text-emerald-600 font-mono">₹ 4,25,00,000</span>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Budget Utilization</span>
                      <span className="font-bold text-xs text-foreground font-mono">34.00%</span>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Total Employees</span>
                      <span className="font-bold text-xs text-foreground font-mono">156</span>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Open Positions</span>
                      <span className="font-bold text-xs text-amber-600 font-mono">6</span>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Headcount Utilization</span>
                      <span className="font-bold text-xs text-foreground font-mono">93%</span>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">KPI Achievement</span>
                      <span className="font-bold text-xs text-primary font-mono">82%</span>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Process Compliance</span>
                      <span className="font-bold text-xs text-emerald-600 font-mono">90%</span>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2 space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Risk Score</span>
                      <span className="font-bold text-xs text-amber-600 font-mono">3.2 / 5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Top KPIs | Financial Summary | Department Health & Recent Activities */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 5. Top KPIs */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    5. Top KPIs
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                          <th className="py-2 px-1">KPI</th>
                          <th className="py-2 px-1 text-right">Target</th>
                          <th className="py-2 px-1 text-right">Actual</th>
                          <th className="py-2 px-1 text-right">Achv</th>
                          <th className="py-2 px-1">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-[11px]">
                        {TOP_KPIS_DATA.map((kpi) => (
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

                {/* 6. Financial Summary (FY 2024-25) */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    6. Financial Summary (FY 2024-25)
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Budget (Total)</span>
                      <span className="font-bold text-foreground font-mono">₹ 12,50,00,000</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Personnel Budget</span>
                      <span className="font-bold text-foreground font-mono">₹ 4,20,00,000</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Operating Budget</span>
                      <span className="font-bold text-foreground font-mono">₹ 6,30,00,000</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">CAPEX Budget</span>
                      <span className="font-bold text-foreground font-mono">₹ 1,00,00,000</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Actual Spend (YTD)</span>
                      <span className="font-bold text-emerald-600 font-mono">₹ 4,25,00,000</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Variance</span>
                      <span className="font-bold text-foreground font-mono">₹ 8,25,00,000</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Forecast Spend</span>
                      <span className="font-bold text-primary font-mono">₹ 10,20,00,000</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Forecast Variance</span>
                      <span className="font-bold text-foreground font-mono">₹ 2,30,00,000</span>
                    </div>
                  </div>
                </div>

                {/* 7. Department Health Score & 8. Recent Activities */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-xs">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      7. Department Health Score
                    </h4>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-emerald-500 text-sm font-bold font-mono text-emerald-600 shrink-0">
                        82%
                      </div>

                      <div className="flex-1 space-y-1 text-[10px]">
                        {[
                          { name: "Finance", val: "85%", w: "w-[85%]", c: "bg-emerald-500" },
                          { name: "Processes", val: "80%", w: "w-[80%]", c: "bg-blue-500" },
                          { name: "People", val: "78%", w: "w-[78%]", c: "bg-primary" },
                          { name: "Compliance", val: "90%", w: "w-[90%]", c: "bg-emerald-500" },
                        ].map((b) => (
                          <div key={b.name} className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground w-16">{b.name}</span>
                            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                              <div className={cn("h-full rounded-full", b.w, b.c)} />
                            </div>
                            <span className="font-mono font-bold w-6 text-right">{b.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-3">
                    <h4 className="text-xs font-bold text-foreground mb-2">8. Recent Activities</h4>
                    <div className="space-y-2 text-[11px]">
                      {RECENT_ACTIVITIES.slice(0, 3).map((act) => {
                        const Icon = act.icon;
                        return (
                          <div key={act.id} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <Icon className={cn("h-3.5 w-3.5 shrink-0", act.color)} />
                              <span className="truncate text-foreground font-medium">{act.title}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0">{act.date}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS / DETAILED SURFACES */}
          {activeTab !== "overview" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h4 className="text-base font-bold text-foreground capitalize flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    {activeTab.replace("-", " ")} Management Workspace
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Department: <span className="font-semibold text-foreground font-mono">DEP-DEL-001</span> (Finance & Accounts) · MAICW Level 3 Specification
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                    Active
                  </span>
                  <button
                    onClick={() => showNotification(`Added new entry to ${activeTab} workspace`)}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add {activeTab.slice(0, -1)} Record
                  </button>
                </div>
              </div>

              {activeTab === "positions" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                          <th className="py-2.5 px-3">Position Code</th>
                          <th className="py-2.5 px-3">Position Title</th>
                          <th className="py-2.5 px-3">Grade Level</th>
                          <th className="py-2.5 px-3 text-right">Sanctioned</th>
                          <th className="py-2.5 px-3 text-right">Filled</th>
                          <th className="py-2.5 px-3 text-right">Vacant</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-foreground font-mono">
                        {[
                          { code: "POS-FIN-001", title: "Chief Financial Officer", grade: "CXO", sanc: 1, filled: 1, vac: 0, status: "Occupied" },
                          { code: "POS-FIN-002", title: "General Manager - Accounts", grade: "M1", sanc: 2, filled: 2, vac: 0, status: "Occupied" },
                          { code: "POS-FIN-003", title: "Senior Finance Controller", grade: "M2", sanc: 4, filled: 3, vac: 1, status: "Hiring Open" },
                          { code: "POS-FIN-004", title: "Tax & Compliance Lead", grade: "M3", sanc: 3, filled: 3, vac: 0, status: "Occupied" },
                          { code: "POS-FIN-005", title: "Accounts Executive", grade: "E1", sanc: 12, filled: 10, vac: 2, status: "Hiring Open" },
                        ].map((p, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2 px-3 font-semibold text-primary">{p.code}</td>
                            <td className="py-2 px-3 font-sans font-medium text-foreground">{p.title}</td>
                            <td className="py-2 px-3">{p.grade}</td>
                            <td className="py-2 px-3 text-right">{p.sanc}</td>
                            <td className="py-2 px-3 text-right text-emerald-600 font-bold">{p.filled}</td>
                            <td className="py-2 px-3 text-right text-amber-600">{p.vac}</td>
                            <td className="py-2 px-3">
                              <span className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-bold border font-sans",
                                p.vac > 0 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              )}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "processes" && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { title: "Accounts Payable (AP)", code: "PRC-FIN-01", owner: "Rohan Verma", sla: "48 Hours", status: "Automated" },
                    { title: "Accounts Receivable (AR)", code: "PRC-FIN-02", owner: "Sneha Reddy", sla: "24 Hours", status: "Active" },
                    { title: "Financial Month-End Close", code: "PRC-FIN-03", owner: "Vikram Singh", sla: "5 Days", status: "Critical" },
                    { title: "Tax Filing & E-Way Bill", code: "PRC-FIN-04", owner: "Ananya Roy", sla: "Monthly", status: "Compliant" },
                    { title: "Payroll Reconciliation", code: "PRC-FIN-05", owner: "Karan Mehta", sla: "28th Monthly", status: "Scheduled" },
                    { title: "Capital Expenditure Approval", code: "PRC-FIN-06", owner: "Rajeev Malhotra", sla: "72 Hours", status: "Active" },
                  ].map((prc, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{prc.title}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{prc.code}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Owner: <span className="font-semibold text-foreground">{prc.owner}</span></p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/50">
                        <span className="text-muted-foreground font-mono">SLA: {prc.sla}</span>
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                          {prc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab !== "positions" && activeTab !== "processes" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                      <span className="text-xs font-bold text-foreground block">Headcount Utilization</span>
                      <span className="text-xl font-bold font-mono text-emerald-600">93.0%</span>
                      <p className="text-[11px] text-muted-foreground">156 filled out of 162 positions.</p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                      <span className="text-xs font-bold text-foreground block">Budget Variance</span>
                      <span className="text-xl font-bold font-mono text-blue-600">₹ 8,25,00,000</span>
                      <p className="text-[11px] text-muted-foreground">Remaining allocated budget for FY 24-25.</p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                      <span className="text-xs font-bold text-foreground block">Risk Index</span>
                      <span className="text-xl font-bold font-mono text-amber-600">3.2 / 5</span>
                      <p className="text-[11px] text-muted-foreground">Moderate process compliance risk.</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <h5 className="text-xs font-bold text-foreground mb-3 capitalize">{activeTab} Parameters & Audit Trail</h5>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span>Last System Audit:</span>
                        <span className="font-mono text-foreground">15 May 2024, 09:30 AM</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span>Assigned Head:</span>
                        <span className="font-semibold text-foreground">Vikram Singh (VP Finance)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>ERP Synchronization Status:</span>
                        <span className="text-emerald-600 font-bold">100% Synced</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

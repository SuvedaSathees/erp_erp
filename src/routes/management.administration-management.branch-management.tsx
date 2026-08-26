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
  Calendar,
  Save,
  Send,
  ShieldCheck,
  Layers,
  MoreHorizontal,
  X,
  Map,
  CheckCircle2,
  Eye,
  Download,
  Plus,
  Zap,
  Activity,
  CheckSquare,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/branch-management")({
  head: () => ({
    meta: [
      { title: "Branch Management · Magnertia ERP" },
      {
        name: "description",
        content: "Manage complete branch lifecycle from strategy, location, legal registration, infrastructure, organization, finance, operations, compliance to performance.",
      },
    ],
  }),
  component: BranchManagementPage,
});

const BRANCH_KPIS_DATA = [
  { id: "KPI-001", name: "Revenue", target: "15,00,00,000", actual: "4,25,00,000", achievement: "28.33%", status: "On Track", statusClass: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" },
  { id: "KPI-002", name: "Gross Margin %", target: "40%", actual: "45.62%", achievement: "114.05%", status: "Achieved", statusClass: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" },
  { id: "KPI-003", name: "Customer Satisfaction", target: "85%", actual: "82%", achievement: "96.47%", status: "Near Target", statusClass: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
  { id: "KPI-004", name: "On-time Delivery", target: "95%", actual: "93%", achievement: "97.89%", status: "Near Target", statusClass: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
  { id: "KPI-005", name: "Employee Productivity", target: "90%", actual: "88%", achievement: "97.78%", status: "Near Target", statusClass: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
  { id: "KPI-006", name: "Compliance Score", target: "100%", actual: "92%", achievement: "92.00%", status: "At Risk", statusClass: "bg-rose-500/10 text-rose-600 border border-rose-500/20" },
];

function BranchManagementPage() {
  const [activeTab, setActiveTab] = useState<"directory" | "facilities" | "operations" | "financials" | "compliance">("directory");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Branch Master Form Data matching exact screenshot
  const [branchMaster, setBranchMaster] = useState({
    branchId: "BR-2024-0008",
    branchCode: "BR-DEL-001",
    branchName: "Delhi Corporate Branch",
    legalEntity: "Magnertia Global Pvt. Ltd.",
    parentOrg: "Magnertia Global Technologies",
    parentBranch: "Select parent branch",
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

  // Dynamic Branches Directory State
  const [branchesList, setBranchesList] = useState([
    { code: "BR-DEL-001", name: "Delhi Corporate Branch", city: "Noida, UP", head: "Rajeev Malhotra", count: 156, cc: "CC-BR-DEL-001", pc: "PC-BR-DEL-001", status: "Active" },
    { code: "BR-BLR-002", name: "Bengaluru Innovation Hub", city: "Bengaluru, KA", head: "Vikram Singh", count: 1256, cc: "CC-BR-BLR-002", pc: "PC-BR-BLR-002", status: "Active" },
    { code: "BR-HYD-003", name: "Hyderabad Engineering Center", city: "Hyderabad, TS", head: "Sandeep Iyer", count: 856, cc: "CC-BR-HYD-003", pc: "PC-BR-HYD-003", status: "Active" },
    { code: "BR-PNE-004", name: "Pune Production Complex", city: "Pune, MH", head: "Ramesh Sharma", count: 872, cc: "CC-BR-PNE-004", pc: "PC-BR-PNE-004", status: "Active" },
  ]);

  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranchForm, setNewBranchForm] = useState({
    code: "",
    name: "",
    city: "Mumbai, MH",
    head: "Rajeev Malhotra",
    count: "50",
    cc: "CC-NEW",
    pc: "PC-NEW",
  });

  return (
    <AppShell
      title="Branch Management"
      breadcrumb="Management > Administration Management > Branch Management"
      description="Manage the complete lifecycle of a branch—from strategy, location, legal registration, infrastructure, organization, finance, operations, compliance to performance."
      tabs={<AdminManagementTabBar />}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
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
                <h2 className="text-base font-bold tracking-tight text-foreground">{branchMaster.branchName}</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {branchMaster.branchStatus}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  v{branchMaster.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Code: <span className="font-mono font-bold text-foreground">{branchMaster.branchCode}</span> | Currency: <span className="font-mono text-foreground">{branchMaster.currency}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Branch preview generated.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Preview Branch
            </button>

            <button
              onClick={() => showNotification("Branch compliance audit passed with 0 findings.")}
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
              onClick={() => showNotification("Branch authorization submitted for executive sign-off.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Branch Master Parameters & Snapshot Card */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Branch Master Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Branch Master Parameters
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <option value="Magnertia Tech Inc.">Magnertia Tech Inc.</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Parent Org *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <input
                  type="text"
                  value={branchMaster.parentOrg}
                  onChange={(e) => setBranchMaster({ ...branchMaster, parentOrg: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
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
                  <option value="Corporate Branch">Corporate Branch</option>
                  <option value="Regional Office">Regional Office</option>
                  <option value="Manufacturing Hub">Manufacturing Hub</option>
                  <option value="R&D Center">R&D Center</option>
                  <option value="Warehouse / Logistics">Warehouse / Logistics</option>
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
                  <option value="Vikram Singh">Vikram Singh</option>
                  <option value="Sandeep Iyer">Sandeep Iyer</option>
                  <option value="Ramesh Sharma">Ramesh Sharma</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={branchMaster.branchStatus}
                  onChange={(e) => setBranchMaster({ ...branchMaster, branchStatus: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Planned">Planned</option>
                  <option value="Under Renovation">Under Renovation</option>
                  <option value="Archived">Archived</option>
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
                  <span className="text-muted-foreground">Operating Facilities</span>
                  <span className="font-bold text-foreground font-mono">{branchesList.length} Hubs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Staffing</span>
                  <span className="font-bold text-foreground font-mono">
                    {branchesList.reduce((acc, b) => acc + Number(b.count), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Annual Target</span>
                  <span className="font-bold text-foreground font-mono">₹ 65.0 Cr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">YTD Realized</span>
                  <span className="font-bold text-emerald-600 font-mono">₹ 18.2 Cr</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Facility Health</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Optimal</span>
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
                    strokeDashoffset={2 * Math.PI * 19 * (1 - 0.88)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">88%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs (No Overview) */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "directory", label: "Branch Directory", icon: Building2 },
              { key: "facilities", label: "Facilities & Locations", icon: MapPin },
              { key: "operations", label: "Operations & Capacity", icon: Sliders },
              { key: "financials", label: "Financial Performance", icon: Landmark },
              { key: "compliance", label: "Compliance & Legal", icon: ShieldCheck },
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

          {/* TAB 1: BRANCH DIRECTORY */}
          {activeTab === "directory" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Total Branches</span>
                  <div className="text-xl font-bold font-mono text-foreground">{branchesList.length} Facilities</div>
                  <p className="text-[10px] text-emerald-600 font-medium">100% Operational</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Total Staffing</span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {branchesList.reduce((acc, b) => acc + Number(b.count), 0).toLocaleString()} Headcount
                  </div>
                  <p className="text-[10px] text-blue-600 font-medium">Across all locations</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Compliance Score</span>
                  <div className="text-xl font-bold font-mono text-foreground">96.8%</div>
                  <p className="text-[10px] text-purple-600 font-medium">Statutory audited</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Annual Revenue Target</span>
                  <div className="text-xl font-bold font-mono text-foreground">₹ 65.0 Cr</div>
                  <p className="text-[10px] text-amber-600 font-medium">FY 2024-25 Budget</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground">Registered Branch Directory ({branchesList.length} Operating Facilities)</h4>
                  <button
                    onClick={() => setShowAddBranchModal(true)}
                    className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                  >
                    + Add Branch
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="py-2 px-2">Branch Code</th>
                        <th className="py-2 px-2">Branch Name</th>
                        <th className="py-2 px-2">City & State</th>
                        <th className="py-2 px-2">Branch Head</th>
                        <th className="py-2 px-2 text-right">Headcount</th>
                        <th className="py-2 px-2">Cost Centre</th>
                        <th className="py-2 px-2">Profit Centre</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-[11px]">
                      {branchesList.map((branch) => (
                        <tr key={branch.code} className="hover:bg-muted/30">
                          <td className="py-2 px-2 font-mono font-bold text-primary">{branch.code}</td>
                          <td className="py-2 px-2 font-semibold text-foreground">{branch.name}</td>
                          <td className="py-2 px-2 text-muted-foreground">{branch.city}</td>
                          <td className="py-2 px-2 text-foreground">{branch.head}</td>
                          <td className="py-2 px-2 text-right font-mono font-bold">{Number(branch.count).toLocaleString()}</td>
                          <td className="py-2 px-2 font-mono text-muted-foreground">{branch.cc}</td>
                          <td className="py-2 px-2 font-mono text-muted-foreground">{branch.pc}</td>
                          <td className="py-2 px-2">
                            <span className="rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                              {branch.status}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setBranchesList((prev) => prev.filter((b) => b.code !== branch.code));
                                showNotification(`Branch ${branch.code} removed.`);
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

          {/* TAB 2: FACILITIES & LOCATIONS */}
          {activeTab === "facilities" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs text-xs">
                <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Primary Facility Address & Infrastructure
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-muted/20 rounded-lg border border-border">
                    <span className="font-semibold text-foreground block">A-45, Sector-62, Noida</span>
                    <span className="text-muted-foreground text-[11px]">Gautam Buddha Nagar, Uttar Pradesh 201309, India</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg border border-border bg-muted/10">
                      <span className="text-[10px] text-muted-foreground block">Facility Area</span>
                      <span className="font-bold text-foreground">35,000 sq ft</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border bg-muted/10">
                      <span className="text-[10px] text-muted-foreground block">Ownership Type</span>
                      <span className="font-bold text-foreground">Corporate Lease (5 Yrs)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs text-xs">
                <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Safety & Environmental Certifications
                </h4>
                <div className="space-y-2">
                  {[
                    { cert: "Fire Safety NOC - Noida Fire Dept", exp: "Valid till Mar 2026", status: "Active" },
                    { cert: "ISO 14001 Environmental Standard", exp: "Valid till Nov 2025", status: "Active" },
                    { cert: "Pollution Control Board Clearance", exp: "Valid till Jan 2027", status: "Active" },
                  ].map((c, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 bg-muted/20 rounded-lg border border-border text-[11px]">
                      <div>
                        <div className="font-semibold text-foreground">{c.cert}</div>
                        <div className="text-[10px] text-muted-foreground">{c.exp}</div>
                      </div>
                      <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OPERATIONS & CAPACITY */}
          {activeTab === "operations" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  Facility Operational Throughput & Shift Logistics
                </h4>
                <span className="text-xs text-emerald-600 font-semibold">24/7 Operations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg border border-border bg-muted/15 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Daily Production / Service Units</span>
                  <div className="text-lg font-bold font-mono text-foreground">1,450 Units/Day</div>
                  <span className="text-[10px] text-emerald-600">+12% vs last quarter</span>
                </div>
                <div className="p-3.5 rounded-lg border border-border bg-muted/15 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Active Workforce Shifts</span>
                  <div className="text-lg font-bold font-mono text-foreground">3 Operating Shifts</div>
                  <span className="text-[10px] text-blue-600">Morning, Evening & Night</span>
                </div>
                <div className="p-3.5 rounded-lg border border-border bg-muted/15 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">On-Time Order Dispatch SLA</span>
                  <div className="text-lg font-bold font-mono text-foreground">98.4%</div>
                  <span className="text-[10px] text-purple-600">Exceeds 95% SLA benchmark</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL PERFORMANCE */}
          {activeTab === "financials" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  Branch P&L and Financial Target Achievement
                </h4>
                <span className="text-xs font-mono font-bold text-emerald-600">FY 2024-25 Budget: ₹ 15,00,00,000</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-2">Metric ID</th>
                      <th className="py-2 px-2">Performance KPI</th>
                      <th className="py-2 px-2 text-right">Budget Target</th>
                      <th className="py-2 px-2 text-right">Actual YTD</th>
                      <th className="py-2 px-2 text-right">Achievement %</th>
                      <th className="py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {BRANCH_KPIS_DATA.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/30">
                        <td className="py-2 px-2 font-mono font-bold text-primary">{row.id}</td>
                        <td className="py-2 px-2 font-semibold text-foreground">{row.name}</td>
                        <td className="py-2 px-2 text-right font-mono text-muted-foreground">{row.target}</td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-foreground">{row.actual}</td>
                        <td className="py-2 px-2 text-right font-mono">{row.achievement}</td>
                        <td className="py-2 px-2">
                          <span className={cn("rounded px-2 py-0.5 text-[9px] font-bold", row.statusClass)}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COMPLIANCE & LEGAL */}
          {activeTab === "compliance" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-500" />
                  Statutory Registrations & Trade Licenses
                </h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                  100% Compliant
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-border bg-muted/10">
                  <div className="font-bold text-foreground">State GSTIN Registration</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">07AABCM1234F1Z5 (Active)</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/10">
                  <div className="font-bold text-foreground">Municipal Trade Licence</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">TL/2024/NOI/5587 (Renewed)</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/10">
                  <div className="font-bold text-foreground">Shops & Commercial Est.</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">SE/UP/2024/NOI/8897 (Valid)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- ADD BRANCH MODAL --- */}
        {showAddBranchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Add New Branch</h3>
                </div>
                <button onClick={() => setShowAddBranchModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Branch Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. BR-MUM-005"
                    value={newBranchForm.code}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Branch Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai Regional Hub"
                    value={newBranchForm.name}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">City & State</label>
                    <input
                      type="text"
                      value={newBranchForm.city}
                      onChange={(e) => setNewBranchForm({ ...newBranchForm, city: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Branch Head</label>
                    <input
                      type="text"
                      value={newBranchForm.head}
                      onChange={(e) => setNewBranchForm({ ...newBranchForm, head: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Headcount</label>
                    <input
                      type="number"
                      value={newBranchForm.count}
                      onChange={(e) => setNewBranchForm({ ...newBranchForm, count: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block">Cost Centre</label>
                    <input
                      type="text"
                      value={newBranchForm.cc}
                      onChange={(e) => setNewBranchForm({ ...newBranchForm, cc: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newBranchForm.code || !newBranchForm.name) {
                      alert("Please provide branch code and name.");
                      return;
                    }
                    setBranchesList((prev) => [
                      ...prev,
                      {
                        code: newBranchForm.code.toUpperCase(),
                        name: newBranchForm.name,
                        city: newBranchForm.city,
                        head: newBranchForm.head,
                        count: Number(newBranchForm.count) || 50,
                        cc: newBranchForm.cc,
                        pc: newBranchForm.pc,
                        status: "Active",
                      },
                    ]);
                    setShowAddBranchModal(false);
                    showNotification(`Branch ${newBranchForm.code.toUpperCase()} successfully added.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Add Branch
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
            Last Modified: <span className="font-sans font-semibold text-foreground">15 May 2024 11:30 AM</span> by <span className="font-sans font-semibold text-foreground">Rahul Sharma</span> | Created By: <span className="font-sans font-semibold text-foreground">Rahul Sharma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

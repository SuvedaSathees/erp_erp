import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { procurementManagementService } from "@/services";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import { CardHeader } from "@/components/erp/CardHeader";
import { StatCard } from "@/components/erp/StatCard";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { WidgetBand } from "@/widgets/components/WidgetBand";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ShoppingCart,
  FileText,
  FileCheck,
  Building2,
  Scale,
  FileBadge,
  PackageCheck,
  Receipt,
  CreditCard,
  FileSpreadsheet,
  Award,
  Globe,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  Users,
  Coins,
  Percent,
  Sliders,
  TrendingDown,
  Layers,
  ArrowUpRight,
  BrainCircuit,
  Zap,
} from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/management/procurement-management/overview")({
  head: () => ({
    meta: [
      { title: "Procurement Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive Procurement Dashboard — end-to-end requisition lifecycle, budget validation, RFQs, vendor bidding, Purchase Orders, 3-way match AP, and contract intelligence.",
      },
    ],
  }),
  component: ProcurementOverviewPage,
});

/* Mock data for Spend & Budget Trend Composed Chart */
const monthlySpendTrend = [
  { month: "Nov '25", budget: 1.8, committed: 1.62, actual: 1.48 },
  { month: "Dec '25", budget: 2.1, committed: 2.05, actual: 1.92 },
  { month: "Jan '26", budget: 2.4, committed: 2.18, actual: 2.04 },
  { month: "Feb '26", budget: 2.2, committed: 2.10, actual: 1.88 },
  { month: "Mar '26", budget: 2.8, committed: 2.72, actual: 2.55 },
  { month: "Apr '26", budget: 3.2, committed: 2.94, actual: 2.68 },
];

/* Requisition Lifecycle Pipeline Stages */
const pipelineStages = [
  { stage: "Draft", count: 18, label: "Draft", desc: "Awaiting submission", color: "bg-slate-500", text: "text-slate-600 dark:text-slate-400", path: "/management/procurement-management/purchase-requisition" },
  { stage: "Submitted", count: 24, label: "In Queue", desc: "Routing for validation", color: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", path: "/management/procurement-management/purchase-requisition" },
  { stage: "Budget Check", count: 11, label: "Validating", desc: "Cost center cap check", color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", path: "/management/procurement-management/purchase-requisition" },
  { stage: "Approval", count: 16, label: "Under Review", desc: "HOD & Finance sign-off", color: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400", path: "/management/procurement-management/purchase-requisition" },
  { stage: "Sourcing / RFQ", count: 21, label: "Sourcing", desc: "RFQ / Quotation issued", color: "bg-purple-500", text: "text-purple-600 dark:text-purple-400", path: "/management/procurement-management/rfq-quotation" },
  { stage: "Approved", count: 42, label: "Ready", desc: "PO Release pending", color: "bg-teal-500", text: "text-teal-600 dark:text-teal-400", path: "/management/procurement-management/purchase-requisition" },
  { stage: "PO Created", count: 58, label: "Ordered", desc: "Vendor fulfillment in progress", color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", path: "/management/procurement-management/purchase-order" },
];

/* 12 Submodules Hub definition */
const procurementSubmodules = [
  { title: "Purchase Requisition", count: "84 PRs", value: "₹ 3.84 Cr", path: "/management/procurement-management/purchase-requisition", icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", tag: "24 Pending" },
  { title: "RFQ / Quotation", count: "32 RFQs", value: "₹ 2.15 Cr", path: "/management/procurement-management/rfq-quotation", icon: FileCheck, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10", tag: "14 Bidding" },
  { title: "Tender Management", count: "8 Tenders", value: "₹ 5.60 Cr", path: "/management/procurement-management/tender-management", icon: Building2, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", tag: "3 Open" },
  { title: "Vendor Quotation", count: "96 Bids", value: "₹ 4.12 Cr", path: "/management/procurement-management/vendor-quotation", icon: ShoppingCart, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10", tag: "18 Under Eval" },
  { title: "Vendor Comparison", count: "14 Matrix", value: "₹ 1.88 Cr", path: "/management/procurement-management/vendor-comparison", icon: Scale, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500/10", tag: "L1 Analyzed" },
  { title: "Purchase Order", count: "152 POs", value: "₹ 9.45 Cr", path: "/management/procurement-management/purchase-order", icon: FileBadge, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", tag: "28 Dispatched" },
  { title: "Goods Receipt (GRN)", count: "138 GRNs", value: "₹ 7.20 Cr", path: "/management/procurement-management/goods-receipt", icon: PackageCheck, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", tag: "98.4% QC Pass" },
  { title: "Invoice Verification", count: "114 Invoices", value: "₹ 5.80 Cr", path: "/management/procurement-management/invoice-verification", icon: Receipt, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", tag: "46 3-Way Match" },
  { title: "Vendor Payment", count: "98 Vouchers", value: "₹ 4.95 Cr", path: "/management/procurement-management/vendor-payment", icon: CreditCard, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10", tag: "₹ 1.85 Cr Due" },
  { title: "Contract Management", count: "48 Contracts", value: "₹ 12.2 Cr", path: "/management/procurement-management/contract-management", icon: FileSpreadsheet, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10", tag: "6 Expiring Soon" },
  { title: "Vendor Evaluation", count: "340 Rated", value: "94.2% SLA", path: "/management/procurement-management/vendor-evaluation", icon: Award, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", tag: "Grade A: 82%" },
  { title: "Supplier Portal", count: "215 Logins", value: "Live Sync", path: "/management/procurement-management/supplier-portal", icon: Globe, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10", tag: "12 Self-Service" },
];

/* Recent Requisitions Ledger Data */
const recentRequisitions = [
  { id: "PR-2026-000145", title: "Electrical Contactors & Relays for EV Chargers", requester: "Rahul Sharma", dept: "Engineering", priority: "Critical", estValue: "₹ 4,85,000", budgetCheck: "Approved", status: "Approved", date: "Today, 10:30 AM" },
  { id: "PR-2026-000144", title: "Precision CNC Aluminum Enclosures (Batch 4)", requester: "Sneha Iyer", dept: "Manufacturing", priority: "High", estValue: "₹ 12,40,000", budgetCheck: "Approved", status: "In Approval", date: "Yesterday, 04:15 PM" },
  { id: "PR-2026-000143", title: "Server Rack Battery Backup Units (10kVA)", requester: "Amit Patel", dept: "IT Infrastructure", priority: "Medium", estValue: "₹ 8,90,000", budgetCheck: "Warning (92%)", status: "Budget Check", date: "26 Apr 2026" },
  { id: "PR-2026-000142", title: "Automated SMT Stencil Cleaning Solvent", requester: "Priya Nair", dept: "Quality Assurance", priority: "Low", estValue: "₹ 1,75,000", budgetCheck: "Approved", status: "Draft", date: "25 Apr 2026" },
  { id: "PR-2026-000141", title: "Annual Factory HVAC Maintenance Contract", requester: "Vikas Reddy", dept: "Facilities", priority: "Medium", estValue: "₹ 6,50,000", budgetCheck: "Approved", status: "PO Created", date: "24 Apr 2026" },
];

function ProcurementOverviewPage() {
  const kpiQuery = useQuery({
    queryKey: ["procurement", "kpis"],
    queryFn: () => procurementManagementService.fetchProcurementKpis(),
  });
  const kpis = kpiQuery.data as any;

  const [selectedTimeframe, setSelectedTimeframe] = useState("FY 2026-27");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");
  const [showNewPRModal, setShowNewPRModal] = useState(false);

  const [newPR, setNewPR] = useState({
    title: "",
    requester: "Rahul Sharma",
    dept: "Engineering",
    priority: "High",
    estValue: "",
    category: "Direct Material",
  });

  const filteredPRs = useMemo(() => {
    return recentRequisitions.filter((r) => {
      const matchSearch =
        !searchFilter.trim() ||
        r.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.requester.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.dept.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.status.toLowerCase().includes(searchFilter.toLowerCase());

      const matchDept = selectedDeptFilter === "All" || r.dept === selectedDeptFilter;
      return matchSearch && matchDept;
    });
  }, [searchFilter, selectedDeptFilter]);

  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPR.title || !newPR.estValue) {
      toast.error("Please fill in the title and estimated value.");
      return;
    }
    toast.success(`Purchase Requisition created successfully! PR-2026-000146 routed for Budget Check.`);
    setShowNewPRModal(false);
    setNewPR({
      title: "",
      requester: "Rahul Sharma",
      dept: "Engineering",
      priority: "High",
      estValue: "",
      category: "Direct Material",
    });
  };

  return (
    <AppShell
      title="Procurement Overview"
      breadcrumb="Management"
      description="Executive procurement governance, purchase requisition pipeline, budget validation, sourcing matrix, and order conversion tracking."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* EXECUTIVE BANNER - Single-Line Layout */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-primary/10 p-3.5 px-5 shadow-xs">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground whitespace-nowrap">
                    Procurement Executive Dashboard
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Sync
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate hidden lg:block">
                  End-to-End Requisition Lifecycle: Requisition → Budget Check → Approval → Sourcing → RFQ → PO → Receipt → Payment
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-2.5 py-1.5 text-xs text-muted-foreground shadow-2xs">
                <Filter className="h-3.5 w-3.5 text-primary" />
                <select
                  value={selectedTimeframe}
                  onChange={(e) => {
                    setSelectedTimeframe(e.target.value);
                    toast.info(`Filtered view for: ${e.target.value}`);
                  }}
                  aria-label="Select Fiscal Period"
                  className="bg-transparent font-semibold text-foreground outline-none cursor-pointer text-xs"
                >
                  <option value="FY 2026-27">FY 2026-27 (Current)</option>
                  <option value="Q1 2026">Q1 2026</option>
                  <option value="This Month">This Month (Apr 2026)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowNewPRModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                New Purchase Requisition
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: 5-CARD CORE EXECUTIVE FINANCIAL KPI ROW */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Spend (FY 2026-27)"
            value={kpis ? `₹ ${(kpis.totalSpend / 10000000).toFixed(2)} Cr` : "₹ 14.85 Cr"}
            delta={{ label: "+11.4% vs FY25", direction: "up", tone: "positive" }}
            iconBg="bg-primary/10"
            iconColor="text-primary"
            icon={<DollarSign className="h-5 w-5" />}
          />

          <StatCard
            label="Active Purchase Orders"
            value={kpis ? String(kpis.activePurchaseOrders) : "152"}
            delta={{ label: `${kpis ? kpis.totalPurchaseOrders : 190} Total POs`, direction: "up", tone: "positive" }}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-500"
            icon={<FileBadge className="h-5 w-5" />}
          />

          <StatCard
            label="Cost Savings Realized"
            value="₹ 1.42 Cr"
            delta={{ label: "14.6% Avg vs Budget", direction: "up", tone: "positive" }}
            iconBg="bg-teal-500/10"
            iconColor="text-teal-500"
            icon={<TrendingUp className="h-5 w-5" />}
          />

          <StatCard
            label="Supplier Delivery OTIF"
            value="94.2%"
            neutralText="Target SLA: 90.0%"
            iconBg="bg-violet-500/10"
            iconColor="text-violet-500"
            icon={<Users className="h-5 w-5" />}
          />

          <StatCard
            label="Contract Compliance Rate"
            value="88.5%"
            neutralText="₹ 12.2 Cr Blanket Agreements"
            iconBg="bg-cyan-500/10"
            iconColor="text-cyan-500"
            icon={<FileSpreadsheet className="h-5 w-5" />}
          />
        </div>

        {/* Customizable Widget Band for Procurement Overview */}
        <WidgetBand pageId="procurement-overview" />

        {/* SECTION 2: SPEND TREND CHART + GOVERNANCE ALERTS (2/3 + 1/3 layout) */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Col 1 & 2: Spend & Budget Variance Trend Composed Chart */}
          <div className="card-soft p-5 lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <CardHeader title="Procurement Spend & Budget Variance Trend" />
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monthly Comparison: Sanctioned Budget vs PO Commitments vs Actual Cash Outflows (in ₹ Crores)
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-xs bg-primary/30"></span> Budget Allocation
                </span>
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="h-2.5 w-2.5 rounded-xs bg-primary"></span> PO Committed
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="h-1 w-3 rounded-full bg-emerald-500"></span> Actual Outflow
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlySpendTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}Cr`} />
                  <Tooltip
                    formatter={(value: any, name: any) => [`₹${value} Cr`, name]}
                    contentStyle={{ backgroundColor: "var(--color-card, #fff)", borderRadius: "12px", border: "1px solid var(--color-border, #e2e8f0)", fontSize: "12px" }}
                  />
                  <Bar dataKey="budget" name="Budget Allocation" fill="var(--color-primary, #3b82f6)" fillOpacity={0.25} radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="committed" name="PO Committed" fill="var(--color-primary, #3b82f6)" radius={[4, 4, 0, 0]} barSize={24} />
                  <Line type="monotone" dataKey="actual" name="Actual Outflow" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Col 3: Critical Governance & Budget Alerts */}
          <div className="card-soft p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <CardHeader title="Governance & Risk Alerts" />
                <p className="text-xs text-muted-foreground mt-0.5">High-Priority Exceptions</p>
              </div>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                4 Triggers
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600" /> 8 Overdue PR Approvals
                  </span>
                  <span className="text-[10px] font-bold text-rose-600">&gt; 48 hrs SLA</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  HOD sign-offs for CapEx manufacturing equipment pending in Level 2 queue.
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => toast.success("Notification pings sent to HODs.")}
                    className="text-[11px] font-bold text-rose-700 dark:text-rose-300 hover:underline cursor-pointer"
                  >
                    Dispatch Reminders →
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-amber-600" /> IT Budget Cap Warning (92%)
                  </span>
                  <span className="text-[10px] font-bold text-amber-600">Near Limit</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  IT Infrastructure quarterly pool has ₹ 72,000 remaining buffer before freeze.
                </p>
              </div>

              <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-blue-600" /> 6 Rate Contracts Expiring
                  </span>
                  <span className="text-[10px] font-bold text-blue-600">In 30 Days</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Master supplier contracts for electrical raw materials require annual renegotiation.
                </p>
                <div className="pt-1 flex justify-end">
                  <Link
                    to="/management/procurement-management/contract-management"
                    className="text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:underline inline-flex items-center gap-1"
                  >
                    Open Contracts →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: REQUISITION LEDGER + AI SOURCING COPILOT (2/3 + 1/3 Layout) */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Col 1 & 2: Recent Purchase Requisitions Ledger */}
          <div className="card-soft p-5 lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <CardHeader title="Recent Purchase Requisitions Ledger" />
                <p className="text-xs text-muted-foreground mt-0.5">
                  Live Requisition Intake, Budget Allocation Status and Approval Routing
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search PR, Dept, Requester..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="h-8 rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary w-48"
                  />
                </div>

                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-foreground outline-none cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="IT Infrastructure">IT Infrastructure</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Facilities">Facilities</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar rounded-xl border border-border/80 bg-card">
              <table className="w-full min-w-[860px] text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border font-semibold">
                  <tr>
                    <th className="py-3 px-3.5 whitespace-nowrap">PR Number</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Requirement Title</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Department</th>
                    <th className="py-3 px-3.5 text-center whitespace-nowrap">Priority</th>
                    <th className="py-3 px-3.5 text-right whitespace-nowrap">Estimated Value</th>
                    <th className="py-3 px-3.5 text-center whitespace-nowrap">Budget Check</th>
                    <th className="py-3 px-3.5 text-center whitespace-nowrap">Status</th>
                    <th className="py-3 px-3.5 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                  {filteredPRs.map((pr) => (
                    <tr key={pr.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-3 px-3.5 font-mono font-bold text-primary whitespace-nowrap">
                        <Link to="/management/procurement-management/purchase-requisition" className="hover:underline flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 opacity-70" />
                          {pr.id}
                        </Link>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-foreground max-w-[240px] truncate" title={pr.title}>
                          {pr.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
                          {pr.requester} · <span className="opacity-80">{pr.date}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-muted-foreground whitespace-nowrap font-medium">
                        {pr.dept}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs",
                            pr.priority === "Critical"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                              : pr.priority === "High"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : pr.priority === "Medium"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                  : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                          )}
                        >
                          {pr.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-black font-mono text-foreground whitespace-nowrap">
                        {pr.estValue}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                            pr.budgetCheck.includes("Warning")
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                          )}
                        >
                          {pr.budgetCheck.includes("Warning") ? "⚠ Warning (92%)" : "✓ Approved"}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border shadow-2xs",
                            pr.status === "Approved" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
                            pr.status === "PO Created" && "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25",
                            pr.status === "In Approval" && "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25",
                            pr.status === "Budget Check" && "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
                            pr.status === "Draft" && "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25"
                          )}
                        >
                          {pr.status === "In Approval" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          )}
                          {pr.status === "Approved" && "✓ "}
                          {pr.status === "PO Created" && "📦 "}
                          {pr.status === "Budget Check" && "⏳ "}
                          {pr.status === "Draft" && "✎ "}
                          {pr.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <Link
                          to="/management/procurement-management/purchase-requisition"
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-primary shadow-2xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                        >
                          Open <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Col 3: AI Sourcing & Optimization Copilot */}
          <div className="card-soft p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">AI Sourcing Copilot</h3>
                    <p className="text-[10px] text-muted-foreground">Autonomous spend telemetry</p>
                  </div>
                </div>

                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold text-primary border border-primary/20">
                  Live
                </span>
              </div>

              <div className="space-y-2.5 text-xs mt-3">
                <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-[11px]">
                    <Coins className="h-3 w-3 text-emerald-500" />
                    Volume Consolidation Rebate
                  </div>
                  <p className="text-muted-foreground text-[10px] leading-relaxed">
                    Combining 3 PRs across Engineering & Manufacturing for contactors unlocks an additional <strong>8.5% supplier rebate (₹ 1.25L savings)</strong>.
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-[11px]">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    Lead Time Delivery Risk
                  </div>
                  <p className="text-muted-foreground text-[10px] leading-relaxed">
                    PowerGrid Components has +6 days delay risk due to port congestion. Secondary allocation recommended.
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="h-3 w-3 text-blue-500" />
                    3-Way Auto-Match
                  </div>
                  <p className="text-muted-foreground text-[10px] leading-relaxed">
                    38 recurring utility invoices matched PO & GRN with 0% price deviation. Ready for 1-click batch processing.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toast.success("AI Procurement optimization recommendations executed.")}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer mt-2"
            >
              <Zap className="h-3.5 w-3.5" /> Execute AI Savings (₹ 18.4L)
            </button>
          </div>
        </div>

        {/* SECTION 4: 12 PROCUREMENT WORKFLOW MODULES DIRECTORY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Procurement Management Workflow Directory
              </h2>
              <p className="text-xs text-muted-foreground">
                Direct access to all 12 enterprise procurement submodules
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {procurementSubmodules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.title}
                  to={mod.path}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs hover:border-primary/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className={cn("grid h-9 w-9 place-items-center rounded-xl", mod.bg, mod.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      {mod.tag}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {mod.title}
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-[11px] font-semibold text-muted-foreground">{mod.count}</span>
                      <span className="text-xs font-black text-foreground">{mod.value}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* MODAL: NEW PURCHASE REQUISITION CREATION WIZARD */}
        {showNewPRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Initiate Purchase Requisition</h3>
                    <p className="text-xs text-muted-foreground">Draft requirement for department budget check</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPRModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePR} className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Requisition Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electrical Contactors for EV Chargers"
                    value={newPR.title}
                    onChange={(e) => setNewPR({ ...newPR, title: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Department</label>
                    <select
                      value={newPR.dept}
                      onChange={(e) => setNewPR({ ...newPR, dept: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Engineering</option>
                      <option>Manufacturing</option>
                      <option>IT Infrastructure</option>
                      <option>Quality Assurance</option>
                      <option>Facilities</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Priority</label>
                    <select
                      value={newPR.priority}
                      onChange={(e) => setNewPR({ ...newPR, priority: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Estimated Value (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 485000"
                      value={newPR.estValue}
                      onChange={(e) => setNewPR({ ...newPR, estValue: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Category</label>
                    <select
                      value={newPR.category}
                      onChange={(e) => setNewPR({ ...newPR, category: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Direct Material</option>
                      <option>Capital Equipment (CapEx)</option>
                      <option>MRO & Consumables</option>
                      <option>Services & Consulting</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowNewPRModal(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    Submit for Budget Check
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

// Magnertia ERP - Executive Dashboard
// Management → Business Intelligence Management → Executive Dashboard
// Executive Dashboard Form — MAICW Classification & Command Center

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  DollarSign,
  Wallet,
  TrendingUp,
  Percent,
  Users,
  Cpu,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  Building,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Download,
  Share2,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Activity,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessIntelligenceTabBar } from "@/components/erp/BusinessIntelligenceTabBar";
import { BiSubmoduleHeader } from "@/components/erp/BiSubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import { BI_OVERVIEW_DATA } from "@/widgets/data/biQueries";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useModuleDataset, usePersistentState } from "@/services/moduleDatasetService";
import { exportRecords, recordToRows } from "@/lib/recordExport";
export const Route = createFileRoute(
  "/management/business-intelligence/executive-dashboard"
)({
  head: () => ({
    meta: [
      { title: "Executive Dashboard · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated enterprise decision-support interface integrating strategy, finance, operations, commercial, supply chain, risk, quality, and AI intelligence.",
      },
    ],
  }),
  component: ExecutiveDashboardPage,
});


const PAGE_DATASET = { BI_OVERVIEW_DATA };

function ExecutiveDashboardPage() {
  const { BI_OVERVIEW_DATA } = useModuleDataset("business-intelligence.executive-dashboard", "Executive Dashboard", PAGE_DATASET);
  const [selectedFacility, setSelectedFacility] = useState("All Facilities");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [aiTab, setAiTab] = useState<"insights" | "recommendations" | "forecast">("insights");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showNewDirectiveModal, setShowNewDirectiveModal] = useState(false);
  const [newDirectiveTitle, setNewDirectiveTitle] = useState("");
  const [newDirectiveOwner, setNewDirectiveOwner] = useState("Executive Committee");
  const [newDirectivePriority, setNewDirectivePriority] = useState<"High" | "Medium" | "Critical">("High");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirectiveTitle.trim()) return;
    setActionsList((prev) => [
      {
        id: Date.now(),
        action: newDirectiveTitle.trim(),
        owner: newDirectiveOwner,
        dueDate: "30 Oct 2026",
        priority: newDirectivePriority,
        status: "In Progress",
      },
      ...prev,
    ]);
    setNewDirectiveTitle("");
    setShowNewDirectiveModal(false);
    showToast("New strategic directive logged and assigned.");
  };

  const kpis = BI_OVERVIEW_DATA.kpis;
  const trend = BI_OVERVIEW_DATA.revenueAndProfitTrend;
  const products = BI_OVERVIEW_DATA.revenueByProduct;
  const pipeline = BI_OVERVIEW_DATA.salesPipeline;
  const mfg = BI_OVERVIEW_DATA.manufacturingMetrics;
  const scm = BI_OVERVIEW_DATA.supplyChainMetrics;
  const project = BI_OVERVIEW_DATA.projectPortfolio;
  const sc = BI_OVERVIEW_DATA.securityCompliance;
  const riskRows = BI_OVERVIEW_DATA.riskHeatmap;
  const [actionsList, setActionsList] = usePersistentState("business-intelligence.executive-dashboard", "Executive Dashboard", "actionsList", BI_OVERVIEW_DATA.managementActions);
  const health = BI_OVERVIEW_DATA.enterpriseHealth;
  const meetings = BI_OVERVIEW_DATA.upcomingMeetings;

  const handleToggleAction = (id: number) => {
    setActionsList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status:
                a.status === "Completed"
                  ? "In Progress"
                  : a.status === "In Progress"
                  ? "Completed"
                  : "Completed",
            }
          : a
      )
    );
    showToast(`Action #${id} status updated.`);
  };

  const projectPieData = [
    { name: "On Track", value: project.onTrack, color: "#10B981" },
    { name: "At Risk", value: project.atRisk, color: "#F59E0B" },
    { name: "Delayed", value: project.delayed, color: "#EF4444" },
    { name: "Completed", value: project.completed, color: "#3B82F6" },
  ];

  return (
    <AppShell
      title="Executive Dashboard"
      breadcrumb="Management > Business Intelligence Management > Executive Dashboard"
      description="Enterprise Performance. Smarter Decisions. A Stronger Tomorrow."
      tabs={<BusinessIntelligenceTabBar />}
    >
      <div className="space-y-5 p-1 pb-12">
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs text-white shadow-xl flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Submodule Standard Header Card matching Image 1 */}
        <BiSubmoduleHeader
          icon={Activity}
          title="Executive Dashboard"
          code="BI-EXD-2026-001"
          badge="Live Monitoring"
          subtitle="Consolidated enterprise command center integrating strategy, finance, operations, commercial, supply chain, risk, quality, and cognitive intelligence."
          primaryActionLabel="+ New Strategic Directive"
          onPrimaryAction={() => setShowNewDirectiveModal(true)}
          dateRange={dateRange}
          onDateRangeChange={(r) => {
            setDateRange(r);
            showToast(`Executive date range updated: ${r}`);
          }}
          onExportCsv={() => exportRecords("Executive Dashboard KPIs", recordToRows(kpis), "csv")}
          onExportExcel={() => exportRecords("Executive Dashboard KPIs", recordToRows(kpis), "xlsx")}
          onExportPdf={() => exportRecords("Executive Dashboard KPIs", recordToRows(kpis), "pdf")}
        />

        {/* 7-Gauge Circular Score Banner matching Image 3 */}
        <ProductScoreBanner submoduleKey="executive-dashboard" />


        {/* 8 Strategic Executive KPI Cards (Row 1) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {/* 1. Total Revenue */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Total Revenue</span>
              <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{kpis.totalRevenue.value}</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>{kpis.totalRevenue.delta}</span>
            </div>
          </div>

          {/* 2. Cash Balance */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Cash Balance</span>
              <div className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{kpis.cashBalance.value}</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>{kpis.cashBalance.delta}</span>
            </div>
          </div>

          {/* 3. Gross Margin */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Gross Margin</span>
              <div className="rounded-md bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{kpis.grossMargin.value}</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>{kpis.grossMargin.delta}</span>
            </div>
          </div>

          {/* 4. Sales Pipeline */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Sales Pipeline</span>
              <div className="rounded-md bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{kpis.salesPipeline.value}</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>{kpis.salesPipeline.delta}</span>
            </div>
          </div>

          {/* 5. Active Customers */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Active Customers</span>
              <div className="rounded-md bg-rose-50 p-1.5 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{kpis.activeCustomers.value}</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>{kpis.activeCustomers.delta}</span>
            </div>
          </div>

          {/* 6. Production OEE */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Production OEE</span>
              <div className="rounded-md bg-teal-50 p-1.5 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <Cpu className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{kpis.productionOee.value}</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>{kpis.productionOee.delta}</span>
            </div>
          </div>

          {/* 7. Open Security Incidents */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Open Incidents</span>
              <div className="rounded-md bg-sky-50 p-1.5 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{kpis.openIncidents.value}</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              <span>{kpis.openIncidents.delta}</span>
            </div>
          </div>

          {/* 8. Open Critical Risks */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Critical Risks</span>
              <div className="rounded-md bg-red-50 p-1.5 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{kpis.criticalRisks.value}</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              <span>{kpis.criticalRisks.delta}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Revenue & Profit Trend (2 cols), Revenue by Product (1 col), Sales Pipeline (1 col) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          {/* Revenue & Profit Trend */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Revenue & Profit Trend (₹ Cr)</h3>
                <p className="text-xs text-muted-foreground">Monthly revenue, gross margin, and EBITDA comparison</p>
              </div>
              <button
                onClick={() => showToast("Opening monthly revenue and EBITDA breakdown ledger.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View Details &rarr;
              </button>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-xs text-muted-foreground" tickLine={false} />
                  <YAxis className="text-xs text-muted-foreground" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="grossProfit" fill="#10B981" radius={[4, 4, 0, 0]} name="Gross Profit" />
                  <Bar dataKey="ebitda" fill="#F59E0B" radius={[4, 4, 0, 0]} name="EBITDA" />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Product */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Revenue by Product</h3>
                <p className="text-xs text-muted-foreground">₹12.8 Cr Total Revenue</p>
              </div>
              <button
                onClick={() => showToast("Opening product-line SKU margin analysis.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                Details &rarr;
              </button>
            </div>
            <div className="relative mx-auto h-[160px] w-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={products}
                    dataKey="share"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                  >
                    {products.map((item, i) => (
                      <Cell key={i} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] text-muted-foreground">Total</span>
                <span className="text-xs font-bold text-foreground">₹12.8 Cr</span>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {products.slice(0, 4).map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="truncate text-foreground font-medium">{p.name}</span>
                  </div>
                  <span className="font-semibold text-muted-foreground">{p.share}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Pipeline Funnel */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Sales Pipeline</h3>
                <p className="text-xs text-muted-foreground">Deal conversion velocity</p>
              </div>
              <button
                onClick={() => showToast("Opening conversion velocity & pipeline stage breakdown.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                Funnel &rarr;
              </button>
            </div>
            <div className="space-y-2 py-1">
              {pipeline.map((stage, idx) => {
                const widthPercent = Math.max(35, 100 - idx * 16);
                return (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-muted-foreground">{stage.stage}</span>
                      <span className="font-bold text-foreground">₹{stage.valueCr} Cr</span>
                    </div>
                    <div
                      className="h-3.5 rounded-sm shadow-xs transition-all"
                      style={{
                        backgroundColor: stage.color,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 3: Manufacturing Performance, Supply Chain Status, Project Portfolio */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Manufacturing Performance */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground">Manufacturing Performance</h3>
            <p className="text-xs text-muted-foreground mb-3">Plant throughput, utilization, and quality metrics</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Production Output</span>
                <div className="text-base font-bold text-foreground mt-0.5">{mfg.output.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ {mfg.output.delta}</span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Capacity Utilization</span>
                <div className="text-base font-bold text-foreground mt-0.5">{mfg.capacity.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ {mfg.capacity.delta}</span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">On-Time Delivery</span>
                <div className="text-base font-bold text-foreground mt-0.5">{mfg.onTimeDelivery.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ {mfg.onTimeDelivery.delta}</span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Rejection Rate</span>
                <div className="text-base font-bold text-foreground mt-0.5">{mfg.rejectionRate.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↓ {mfg.rejectionRate.delta}</span>
              </div>
            </div>
          </div>

          {/* Supply Chain Status */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground">Supply Chain Status</h3>
            <p className="text-xs text-muted-foreground mb-3">Procurement flow, inventory valuation, and shortages</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Purchase Orders</span>
                <div className="text-base font-bold text-foreground mt-0.5">{scm.purchaseOrders.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ {scm.purchaseOrders.delta}</span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Inventory Value</span>
                <div className="text-base font-bold text-foreground mt-0.5">{scm.inventoryValue.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ {scm.inventoryValue.delta}</span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Supplier OTIF</span>
                <div className="text-base font-bold text-foreground mt-0.5">{scm.supplierOtif.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ {scm.supplierOtif.delta}</span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Material Shortage</span>
                <div className="text-base font-bold text-foreground mt-0.5">{scm.materialShortage.value}</div>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">↓ {scm.materialShortage.delta}</span>
              </div>
            </div>
          </div>

          {/* Project Portfolio */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Project Portfolio</h3>
                <p className="text-xs text-muted-foreground">28 Active Strategic & Client Initiatives</p>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                View Details &rarr;
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative h-[130px] w-[130px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={2}
                    >
                      {projectPieData.map((e, idx) => (
                        <Cell key={idx} fill={e.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[9px] text-muted-foreground">Active</span>
                  <span className="text-sm font-bold text-foreground">{project.active}</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 text-xs">
                {projectPieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-foreground text-[11px]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Security & Compliance, Risk Heatmap, Top Management Actions */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Security & Compliance */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground">Security & Compliance</h3>
            <p className="text-xs text-muted-foreground mb-3">Facility security, surveillance, and regulatory audit</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Security Incidents</span>
                <div className="text-base font-bold text-foreground mt-0.5">{sc.incidents.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↓ {sc.incidents.delta}</span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">CCTV Online</span>
                <div className="text-base font-bold text-foreground mt-0.5">{sc.cctvOnline.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{sc.cctvOnline.percentage}</span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Access Violations</span>
                <div className="text-base font-bold text-foreground mt-0.5">{sc.accessViolations.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↓ {sc.accessViolations.delta}</span>
              </div>
              <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                <span className="text-[11px] text-muted-foreground">Audit Compliance</span>
                <div className="text-base font-bold text-foreground mt-0.5">{sc.auditCompliance.value}</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ {sc.auditCompliance.delta}</span>
              </div>
            </div>
          </div>

          {/* Risk Heatmap */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Risk Heatmap</h3>
                <p className="text-xs text-muted-foreground">Enterprise exposure by Likelihood & Impact</p>
              </div>
              <button
                onClick={() => showToast("Opening enterprise 5x5 risk assessment matrix.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                Matrix &rarr;
              </button>
            </div>
            <div className="space-y-1.5 py-1">
              <div className="grid grid-cols-5 text-center text-[10px] font-semibold text-muted-foreground">
                <span className="text-left">Likelihood \</span>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Critical</span>
              </div>
              {riskRows.map((r, idx) => (
                <div key={idx} className="grid grid-cols-5 items-center gap-1.5 text-center text-xs">
                  <span className="text-left font-medium text-foreground text-[10px]">{r.impact}</span>
                  <div className="rounded bg-emerald-100 py-1.5 font-semibold text-slate-800 dark:bg-emerald-950/60 dark:text-emerald-300">{r.low}</div>
                  <div className="rounded bg-amber-100 py-1.5 font-semibold text-slate-800 dark:bg-amber-950/60 dark:text-amber-300">{r.medium}</div>
                  <div className="rounded bg-orange-200 py-1.5 font-bold text-slate-900 dark:bg-orange-950/70 dark:text-orange-200">{r.high}</div>
                  <div className="rounded bg-rose-500 py-1.5 font-bold text-white dark:bg-rose-600">{r.critical}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Management Actions */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Top Management Actions</h3>
                <p className="text-xs text-muted-foreground">Accountable operational task tracker (Click to toggle)</p>
              </div>
              <button
                onClick={() => showToast("Navigating to executive action ledger.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All &rarr;
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-[11px]">
                    <th className="pb-1.5 font-medium">#</th>
                    <th className="pb-1.5 font-medium">Action</th>
                    <th className="pb-1.5 font-medium">Owner</th>
                    <th className="pb-1.5 font-medium">Due Date</th>
                    <th className="pb-1.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {actionsList.slice(0, 4).map((act) => (
                    <tr
                      key={act.id}
                      onClick={() => handleToggleAction(act.id)}
                      className="hover:bg-muted/40 cursor-pointer transition-all"
                    >
                      <td className="py-2 text-[11px] font-medium text-muted-foreground">{act.id}</td>
                      <td className="py-2 text-[11px] font-medium text-foreground truncate max-w-[120px]">{act.action}</td>
                      <td className="py-2 text-[11px] text-muted-foreground truncate">{act.owner}</td>
                      <td className="py-2 text-[10px] text-muted-foreground">{act.dueDate}</td>
                      <td className="py-2">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-medium",
                            act.status === "In Progress" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
                            act.status === "Overdue" && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
                            act.status === "Completed" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                            act.status === "On Track" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          )}
                        >
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 5: AI Executive Intelligence, Enterprise Performance Score, Upcoming Meetings */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* AI Executive Intelligence */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-purple-600 p-1.5 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">AI Executive Intelligence</h3>
                  <p className="text-xs text-muted-foreground">Neural correlation & predictive diagnostics</p>
                </div>
              </div>
              <div className="flex rounded-md border border-border bg-muted/30 p-0.5 text-[10px]">
                <button
                  onClick={() => setAiTab("insights")}
                  className={cn("rounded px-2 py-0.5 font-medium transition-all cursor-pointer", aiTab === "insights" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground")}
                >
                  Insights
                </button>
                <button
                  onClick={() => setAiTab("recommendations")}
                  className={cn("rounded px-2 py-0.5 font-medium transition-all cursor-pointer", aiTab === "recommendations" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground")}
                >
                  Recs
                </button>
                <button
                  onClick={() => setAiTab("forecast")}
                  className={cn("rounded px-2 py-0.5 font-medium transition-all cursor-pointer", aiTab === "forecast" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground")}
                >
                  Forecast
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {BI_OVERVIEW_DATA.aiInsights.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => showToast(`AI Signal: ${item.text}`)}
                  className="flex items-start gap-2 rounded-lg border border-border/70 bg-muted/20 p-2.5 text-xs hover:bg-muted/40 cursor-pointer transition-all"
                >
                  <span
                    className={cn(
                      "mt-1 h-2 w-2 rounded-full shrink-0",
                      item.type === "positive" && "bg-emerald-500",
                      item.type === "danger" && "bg-rose-500",
                      item.type === "warning" && "bg-amber-500",
                      item.type === "info" && "bg-blue-500"
                    )}
                  />
                  <p className="text-[11px] leading-relaxed text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Performance Score */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground">Enterprise Performance Score</h3>
            <p className="text-xs text-muted-foreground mb-3">Multi-dimensional operational health rating</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex flex-col items-center justify-center p-2">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-emerald-500/20 border-t-emerald-500">
                  <div className="text-center">
                    <span className="text-2xl font-extrabold text-foreground">{health.score}</span>
                    <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{health.status}</span>
                  </div>
                </div>
                <span className="mt-1 text-[10px] text-muted-foreground">Index (0-100)</span>
              </div>
              <div className="flex-1 w-full space-y-1.5">
                {health.breakdown.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-muted-foreground">{item.name}</span>
                      <span className="font-bold text-foreground">{item.score}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Upcoming Meetings</h3>
                <p className="text-xs text-muted-foreground">Executive councils & management sessions</p>
              </div>
              <button
                onClick={() => showToast("Viewing full executive calendar and meeting minutes.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All &rarr;
              </button>
            </div>
            <div className="space-y-2">
              {meetings.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/20 p-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 flex-col items-center justify-center rounded bg-blue-50 font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <span className="text-xs leading-none">{m.date}</span>
                      <span className="text-[8px] uppercase leading-none">{m.month}</span>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-foreground truncate max-w-[150px]">{m.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{m.time} · {m.location}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      m.type === "Executive" && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                      m.type === "Project" && "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
                      m.type === "Security" && "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
                      m.type === "Management" && "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                    )}
                  >
                    {m.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Strategic Directive Modal */}
      <Dialog open={showNewDirectiveModal} onOpenChange={setShowNewDirectiveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log New Strategic Directive</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDirective} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Directive Title / Action Description</Label>
              <Input
                placeholder="e.g. Expand automated quality gates to Plant 2"
                value={newDirectiveTitle}
                onChange={(e) => setNewDirectiveTitle(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Accountable Owner</Label>
                <Input
                  value={newDirectiveOwner}
                  onChange={(e) => setNewDirectiveOwner(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Priority</Label>
                <select
                  value={newDirectivePriority}
                  onChange={(e) => setNewDirectivePriority(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowNewDirectiveModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                Log Directive
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

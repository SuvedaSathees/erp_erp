// Magnertia ERP - KPI Monitoring
// Management → Business Intelligence Management → KPI Monitoring
// KPI Monitoring Form — MAICW Classification & Active Workspace

import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Target,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Database,
  FileCheck2,
  Award,
  Plus,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  ExternalLink,
  Edit,
  Download,
  History,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sliders,
  Layers,
  FileText,
  ShieldCheck,
  Zap,
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
import {
  BI_KPI_MONITORING_RECORDS,
  BiKpiMonitoringRecord,
} from "@/services/businessIntelligenceService";
import { cn } from "@/lib/utils";

import { useModuleDataset } from "@/services/moduleDatasetService";
export const Route = createFileRoute(
  "/management/business-intelligence/kpi-monitoring"
)({
  head: () => ({
    meta: [
      { title: "KPI Monitoring · Magnertia ERP" },
      {
        name: "description",
        content:
          "Define, baseline, target, measure, validate, compare, analyze, and review Key Performance Indicators across strategic, financial, operational, and digital domains.",
      },
    ],
  }),
  component: KpiMonitoringPage,
});


const WORKSPACE_TABS = [
  "Basic Details",
  "Targets & Thresholds",
  "Actuals & Trend",
  "Data Source & Formula",
  "Related Objectives",
  "Exceptions & Alerts",
  "Corrective Actions",
  "Comments & Notes",
  "Attachments",
  "History & Audit Trail",
] as const;

const statusDistribution = [
  { name: "On Target", value: 142, color: "#10B981" },
  { name: "Warning", value: 24, color: "#F59E0B" },
  { name: "Critical", value: 8, color: "#EF4444" },
  { name: "Not Started", value: 6, color: "#64748B" },
  { name: "Under Review", value: 4, color: "#3B82F6" },
  { name: "Closed", value: 2, color: "#94A3B8" },
];

const categoryData = [
  { name: "Financial", count: 28, color: "#3B82F6" },
  { name: "Commercial", count: 26, color: "#06B6D4" },
  { name: "Operational", count: 32, color: "#10B981" },
  { name: "Quality", count: 18, color: "#F59E0B" },
  { name: "People", count: 18, color: "#EC4899" },
  { name: "Compliance", count: 14, color: "#8B5CF6" },
  { name: "Sustainability", count: 8, color: "#14B8A6" },
  { name: "Innovation", count: 16, color: "#6366F1" },
];

const trendData = [
  { month: "Oct", actual: 8.8, target: 8.5, forecast: 8.7 },
  { month: "Nov", actual: 9.2, target: 9.0, forecast: 9.1 },
  { month: "Dec", actual: 9.6, target: 9.5, forecast: 9.6 },
  { month: "Jan", actual: 10.1, target: 10.0, forecast: 10.0 },
  { month: "Feb", actual: 10.4, target: 10.2, forecast: 10.3 },
  { month: "Mar", actual: 10.8, target: 10.5, forecast: 10.7 },
  { month: "Apr", actual: 11.2, target: 11.0, forecast: 11.1 },
  { month: "May", actual: 11.6, target: 11.2, forecast: 11.4 },
  { month: "Jun", actual: 12.0, target: 11.5, forecast: 11.8 },
  { month: "Jul", actual: 12.2, target: 11.8, forecast: 12.0 },
  { month: "Aug", actual: 12.5, target: 12.0, forecast: 12.3 },
  { month: "Sep", actual: 12.8, target: 12.0, forecast: 12.6 },
];

const topPerforming = [
  { id: 1, name: "Revenue (₹ Cr)", category: "Financial", actual: 12.8, target: 12.0, ach: "107%", trend: "up" },
  { id: 2, name: "Gross Margin (%)", category: "Financial", actual: 32.6, target: 30.0, ach: "109%", trend: "up" },
  { id: 3, name: "Customer Acquisition", category: "Commercial", actual: 146, target: 120, ach: "122%", trend: "up" },
  { id: 4, name: "Production OEE (%)", category: "Operational", actual: 82.7, target: 80.0, ach: "103%", trend: "up" },
  { id: 5, name: "On-Time Delivery (%)", category: "Operational", actual: 94.2, target: 90.0, ach: "105%", trend: "up" },
];

const kpisAtRisk = [
  { id: 1, name: "Cash Balance (₹ Cr)", category: "Financial", actual: 4.2, target: 6.0, status: "Critical" },
  { id: 2, name: "Material Shortage (Days)", category: "Supply Chain", actual: 7, target: 3, status: "Critical" },
  { id: 3, name: "Security Incidents", category: "Security", actual: 4, target: 1, status: "Critical" },
  { id: 4, name: "Projects Delayed", category: "Project", actual: 6, target: 2, status: "Warning" },
  { id: 5, name: "Quality NCR (Nos)", category: "Quality", actual: 12, target: 8, status: "Warning" },
];

const recentAlerts = [
  { time: "10:15 AM", kpi: "Cash Balance", msg: "Below critical threshold", sev: "Critical" },
  { time: "09:42 AM", kpi: "Material Shortage", msg: "Exceeded threshold", sev: "Critical" },
  { time: "08:30 AM", kpi: "OEE", msg: "Dropped by 5%", sev: "Warning" },
  { time: "07:15 AM", kpi: "Delivery Delay", msg: "Below target", sev: "Warning" },
  { time: "06:50 AM", kpi: "Revenue", msg: "12% above target", sev: "Info" },
];

const PAGE_DATASET = { BI_KPI_MONITORING_RECORDS, statusDistribution, categoryData, trendData, topPerforming, kpisAtRisk, recentAlerts };

function KpiMonitoringPage() {
  const { BI_KPI_MONITORING_RECORDS, statusDistribution, categoryData, trendData, topPerforming, kpisAtRisk, recentAlerts } = useModuleDataset("business-intelligence.kpi-monitoring", "KPI Monitoring", PAGE_DATASET);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<string>("Basic Details");
  const [selectedBu, setSelectedBu] = useState("All Business Units");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [selectedKpi, setSelectedKpi] = useState<BiKpiMonitoringRecord>(
    BI_KPI_MONITORING_RECORDS[0]
  );
  const [kpiList, setKpiList] = useState<BiKpiMonitoringRecord[]>(BI_KPI_MONITORING_RECORDS);
  useEffect(() => { setKpiList(BI_KPI_MONITORING_RECORDS); }, [BI_KPI_MONITORING_RECORDS]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New KPI modal state
  const [newKpiName, setNewKpiName] = useState("");
  const [newCategory, setNewCategory] = useState("Operational");
  const [newUnit, setNewUnit] = useState("%");
  const [newTarget, setNewTarget] = useState(90);
  const [newActual, setNewActual] = useState(88);
  const [newWarning, setNewWarning] = useState(80);
  const [newCritical, setNewCritical] = useState(70);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiName.trim()) return;
    const item: BiKpiMonitoringRecord = {
      id: `KPI-${String(kpiList.length + 1).padStart(3, "0")}`,
      name: newKpiName,
      category: newCategory,
      unit: newUnit,
      frequency: "Monthly",
      target: Number(newTarget),
      actual: Number(newActual),
      achievement: Math.round((Number(newActual) / Number(newTarget)) * 100),
      trend: "up",
      status: Number(newActual) >= Number(newTarget) ? "On Target" : "Warning",
      owner: "Executive Lead",
      dataSource: "Magnertia Core ERP",
      calculationMethod: "Sum(Period Actual) / Sum(Period Benchmark)",
      baseline: Number(newTarget) * 0.8,
      stretchTarget: Number(newTarget) * 1.15,
      warningThreshold: Number(newWarning),
      criticalThreshold: Number(newCritical),
      description: `Target and variance monitoring metric for ${newKpiName}.`,
    };
    setKpiList([item, ...kpiList]);
    setSelectedKpi(item);
    setShowAddModal(false);
    setNewKpiName("");
    showToast(`KPI "${item.name}" registered and loaded into workspace.`);
  };

  // Status Distribution Data

  // Category Breakdown Data

  // 12-Month Performance Trend for active KPI

  // Top Performing KPIs

  // KPIs at Risk (Warning + Critical)

  // Recent KPI Alerts

  return (
    <AppShell
      title="KPI Monitoring"
      breadcrumb="Management > Business Intelligence Management > KPI Monitoring"
      description="Track Performance. Drive Accountability. Achieve Goals."
      tabs={<BusinessIntelligenceTabBar />}
    >
      <div className="space-y-5 p-1 pb-16">
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs text-white shadow-xl flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Submodule Standard Header Card matching Image 1 */}
        <BiSubmoduleHeader
          icon={Target}
          title="KPI Monitoring"
          code="BI-KPI-2026-001"
          badge="Real-time Telemetry"
          subtitle="Track enterprise performance indicators, monitor deviation thresholds, and drive continuous accountability across all operations."
          primaryActionLabel="+ Add New KPI"
          onPrimaryAction={() => setShowAddModal(true)}
          dateRange={dateRange}
          onDateRangeChange={(r) => {
            setDateRange(r);
            showToast(`KPI date window updated: ${r}`);
          }}
          onRefresh={() => showToast("KPI telemetry and threshold feeds refreshed.")}
          onExportCsv={() => showToast("KPIs exported to CSV (.csv)")}
          onExportExcel={() => showToast("KPI register exported to Excel (.xlsx)")}
          onExportPdf={() => showToast("Generated official KPI performance dossier (.pdf)")}
        />

        {/* 7-Gauge Circular Score Banner matching Image 3 */}
        <ProductScoreBanner submoduleKey="kpi-monitoring" />


        {/* 8 KPI Cards Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {/* 1. Total KPIs */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Total KPIs</span>
              <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">186</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 12% vs last quarter</span>
          </div>

          {/* 2. On Target */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">On Target</span>
              <div className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">142</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">76.3% achievement</span>
          </div>

          {/* 3. Warning */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Warning</span>
              <div className="rounded-md bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">24</div>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">12.9% needs attention</span>
          </div>

          {/* 4. Critical */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Critical</span>
              <div className="rounded-md bg-rose-50 p-1.5 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <AlertOctagon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">8</div>
            <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">4.3% immediate action</span>
          </div>

          {/* 5. Measurements Due */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Measurements Due</span>
              <div className="rounded-md bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">17</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↓ 6 this week</span>
          </div>

          {/* 6. Data Quality Issues */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Data Quality Issues</span>
              <div className="rounded-md bg-cyan-50 p-1.5 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">5</div>
            <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400">2 require correction</span>
          </div>

          {/* 7. Open Actions */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Open Actions</span>
              <div className="rounded-md bg-pink-50 p-1.5 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">11</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↓ 27% vs last month</span>
          </div>

          {/* 8. Overall Achievement */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Overall Target</span>
              <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">94.2%</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 6.8% vs last quarter</span>
          </div>
        </div>

        {/* Row 2: KPI Performance Trend (combo), Status Distribution (donut), Category Breakdown (bars) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          {/* Trend Chart (2 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">KPI Performance Trend (Last 12 Months)</h3>
                <p className="text-xs text-muted-foreground">Historical progression and target variance</p>
              </div>
              <select className="rounded border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
                <option>Revenue (₹ Cr)</option>
                <option>Production OEE (%)</option>
                <option>Customer Acquisition</option>
              </select>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-xs text-muted-foreground" tickLine={false} />
                  <YAxis className="text-xs text-muted-foreground" tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="actual" fill="#10B981" radius={[4, 4, 0, 0]} name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="#3B82F6" strokeWidth={2} name="Target" />
                  <Line type="monotone" dataKey="forecast" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth={2} name="Forecast" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution (1 col) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground">KPI Status Distribution</h3>
            <p className="text-xs text-muted-foreground mb-2">186 Total Monitored Metrics</p>
            <div className="relative mx-auto h-[160px] w-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={2}
                  >
                    {statusDistribution.map((e, idx) => (
                      <Cell key={idx} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] text-muted-foreground">Total</span>
                <span className="text-sm font-bold text-foreground">186</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1 text-[11px]">
              {statusDistribution.slice(0, 4).map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name}:</span>
                  <span className="font-semibold text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown (1 col) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-semibold text-foreground">KPI by Category</h3>
              <button
                onClick={() => showToast("Viewing full categorical breakdown across all domains.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-1.5 py-1">
              {categoryData.slice(0, 6).map((cat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-muted-foreground">{cat.name}</span>
                    <span className="font-bold text-foreground">{cat.count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: cat.color,
                        width: `${(cat.count / 35) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Top Performing KPIs, KPIs at Risk, Recent KPI Alerts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Top Performing KPIs */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Top Performing KPIs</h3>
                <p className="text-xs text-muted-foreground">Exceeding strategic targets (Click to inspect)</p>
              </div>
              <button
                onClick={() => showToast("Showing full high-performance benchmark register.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[11px]">
                  <th className="pb-1.5 font-medium">#</th>
                  <th className="pb-1.5 font-medium">KPI Name</th>
                  <th className="pb-1.5 font-medium">Actual</th>
                  <th className="pb-1.5 font-medium">Target</th>
                  <th className="pb-1.5 font-medium">Ach.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {topPerforming.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      const match = kpiList.find((k) => k.name.includes(item.name.split(" ")[0])) || kpiList[0];
                      setSelectedKpi(match);
                      showToast(`Loaded ${item.name} into Workspace Inspector.`);
                    }}
                    className="hover:bg-muted/40 cursor-pointer transition-all"
                  >
                    <td className="py-2 text-[11px] font-medium text-muted-foreground">{item.id}</td>
                    <td className="py-2 text-[11px] font-medium text-foreground truncate max-w-[120px]">{item.name}</td>
                    <td className="py-2 text-[11px] font-bold text-foreground">{item.actual}</td>
                    <td className="py-2 text-[11px] text-muted-foreground">{item.target}</td>
                    <td className="py-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{item.ach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* KPIs at Risk */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">KPI at Risk (Warning + Critical)</h3>
                <p className="text-xs text-muted-foreground">Adverse deviation & threshold breach (Click to inspect)</p>
              </div>
              <button
                onClick={() => showToast("Displaying all 32 warning & critical KPI exceptions.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[11px]">
                  <th className="pb-1.5 font-medium">#</th>
                  <th className="pb-1.5 font-medium">KPI Name</th>
                  <th className="pb-1.5 font-medium">Actual</th>
                  <th className="pb-1.5 font-medium">Target</th>
                  <th className="pb-1.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {kpisAtRisk.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      const match = kpiList.find((k) => k.name.includes(item.name.split(" ")[0])) || kpiList[0];
                      setSelectedKpi(match);
                      showToast(`Loaded ${item.name} into Workspace Inspector.`);
                    }}
                    className="hover:bg-muted/40 cursor-pointer transition-all"
                  >
                    <td className="py-2 text-[11px] font-medium text-muted-foreground">{item.id}</td>
                    <td className="py-2 text-[11px] font-medium text-foreground truncate max-w-[120px]">{item.name}</td>
                    <td className="py-2 text-[11px] font-bold text-rose-600 dark:text-rose-400">{item.actual}</td>
                    <td className="py-2 text-[11px] text-muted-foreground">{item.target}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-medium",
                          item.status === "Critical" ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Alerts */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Recent KPI Alerts</h3>
                <p className="text-xs text-muted-foreground">Automated trigger dispatch</p>
              </div>
              <button
                onClick={() => showToast("Opening centralized threshold alert dispatch stream.")}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {recentAlerts.map((a, idx) => (
                <div
                  key={idx}
                  onClick={() => showToast(`Alert detail: ${a.kpi} - ${a.msg}`)}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/20 p-2 text-xs hover:bg-muted/40 cursor-pointer transition-all"
                >
                  <div>
                    <span className="text-[10px] text-muted-foreground">{a.time} · </span>
                    <span className="font-semibold text-foreground text-[11px]">{a.kpi}</span>
                    <p className="text-[10px] text-muted-foreground">{a.msg}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      a.sev === "Critical" && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
                      a.sev === "Warning" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
                      a.sev === "Info" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                    )}
                  >
                    {a.sev}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM INSPECTOR: KPI Monitoring Workspace */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-md">
          {/* Workspace Title Bar */}
          <div className="flex flex-col gap-3 pb-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">KPI Monitoring Workspace</h2>
                <p className="text-xs text-muted-foreground">Detailed inspection, formula tracking, and thresholds</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedKpi(kpiList[0]);
                  showToast("Returned to default primary metric view.");
                }}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                Back to KPI List
              </button>
              <button
                onClick={() => showToast(`Editing metadata & formula for ${selectedKpi.name}...`)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                Edit KPI
              </button>
              <button
                onClick={() => showToast(`Exported ${selectedKpi.name} specification dossier (PDF).`)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                Export
              </button>
              <button
                onClick={() => {
                  setActiveWorkspaceTab("History & Audit Trail");
                  showToast(`Viewing complete audit history for ${selectedKpi.id}.`);
                }}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                View Audit Trail
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Left Vertical Sub-tabs */}
            <div className="space-y-1 rounded-lg border border-border bg-muted/20 p-2 text-xs font-medium">
              {WORKSPACE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveWorkspaceTab(tab)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left transition-all cursor-pointer",
                    activeWorkspaceTab === tab
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right Active Inspection Canvas */}
            <div className="space-y-4 lg:col-span-3">
              {/* Active KPI Title Banner */}
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{selectedKpi.name}</h3>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      Active
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                      {selectedKpi.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{selectedKpi.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground">Owner</span>
                  <div className="text-xs font-bold text-foreground">{selectedKpi.owner}</div>
                </div>
              </div>

              {/* KPI Meta Details Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border/80 bg-card p-4 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-muted-foreground">KPI ID</span>
                  <div className="font-semibold text-foreground mt-0.5">{selectedKpi.id}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Unit of Measure</span>
                  <div className="font-semibold text-foreground mt-0.5">{selectedKpi.unit}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency</span>
                  <div className="font-semibold text-foreground mt-0.5">{selectedKpi.frequency}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Direction</span>
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">Higher is Better</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Data Source</span>
                  <div className="font-semibold text-foreground mt-0.5">{selectedKpi.dataSource}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Calculation Method</span>
                  <div className="font-semibold text-foreground mt-0.5">{selectedKpi.calculationMethod}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Baseline Period</span>
                  <div className="font-semibold text-foreground mt-0.5">FY 2025-26 Q1</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Audited</span>
                  <div className="font-semibold text-foreground mt-0.5">15 Sep 2026</div>
                </div>
              </div>

              {/* Current Performance & Threshold Spectrum */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Current Performance Card */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <span className="text-xs font-semibold text-muted-foreground">Current Performance (Sep 2026)</span>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-md border border-border bg-muted/20 p-2">
                      <span className="text-[10px] text-muted-foreground">Actual</span>
                      <div className="text-lg font-extrabold text-foreground">{selectedKpi.actual}</div>
                    </div>
                    <div className="rounded-md border border-border bg-muted/20 p-2">
                      <span className="text-[10px] text-muted-foreground">Target</span>
                      <div className="text-lg font-extrabold text-muted-foreground">{selectedKpi.target}</div>
                    </div>
                    <div className="rounded-md border border-border bg-muted/20 p-2">
                      <span className="text-[10px] text-muted-foreground">Variance</span>
                      <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                        +{(selectedKpi.actual - selectedKpi.target).toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Achievement Rate</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedKpi.achievement}% (On Track)</span>
                  </div>
                </div>

                {/* Target & Thresholds Spectrum */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <span className="text-xs font-semibold text-muted-foreground">Target & Threshold Levels</span>
                  <div className="mt-3 grid grid-cols-5 gap-1.5 text-center text-xs">
                    <div className="rounded bg-muted/30 p-2">
                      <span className="text-[10px] text-muted-foreground">Baseline</span>
                      <div className="font-bold text-foreground mt-0.5">{selectedKpi.baseline}</div>
                    </div>
                    <div className="rounded bg-blue-50 dark:bg-blue-950/40 p-2">
                      <span className="text-[10px] text-blue-600 dark:text-blue-400">Target</span>
                      <div className="font-bold text-blue-700 dark:text-blue-300 mt-0.5">{selectedKpi.target}</div>
                    </div>
                    <div className="rounded bg-emerald-50 dark:bg-emerald-950/40 p-2">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Stretch</span>
                      <div className="font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{selectedKpi.stretchTarget}</div>
                    </div>
                    <div className="rounded bg-amber-50 dark:bg-amber-950/40 p-2">
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">Warning</span>
                      <div className="font-bold text-amber-700 dark:text-amber-300 mt-0.5">{selectedKpi.warningThreshold}</div>
                    </div>
                    <div className="rounded bg-rose-50 dark:bg-rose-950/40 p-2">
                      <span className="text-[10px] text-rose-600 dark:text-rose-400">Critical</span>
                      <div className="font-bold text-rose-700 dark:text-rose-300 mt-0.5">{selectedKpi.criticalThreshold}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    Threshold breaches automatically trigger exception queues and high-priority Slack/Email alerts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add New KPI */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">Add New Enterprise KPI</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateKpi} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground">KPI Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Charging Network Fleet Uptime (%)"
                    value={newKpiName}
                    onChange={(e) => setNewKpiName(e.target.value)}
                    className="mt-1 w-full rounded border border-border bg-background p-2 text-foreground focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="mt-1 w-full rounded border border-border bg-background p-2 text-foreground focus:outline-hidden"
                    >
                      <option>Operational</option>
                      <option>Financial</option>
                      <option>Commercial</option>
                      <option>Quality</option>
                      <option>Supply Chain</option>
                      <option>Compliance</option>
                      <option>Sustainability</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Unit</label>
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="mt-1 w-full rounded border border-border bg-background p-2 text-foreground focus:outline-hidden"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-foreground">Target</label>
                    <input
                      type="number"
                      value={newTarget}
                      onChange={(e) => setNewTarget(Number(e.target.value))}
                      className="mt-1 w-full rounded border border-border bg-background p-2 text-foreground focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Actual</label>
                    <input
                      type="number"
                      value={newActual}
                      onChange={(e) => setNewActual(Number(e.target.value))}
                      className="mt-1 w-full rounded border border-border bg-background p-2 text-foreground focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Warning</label>
                    <input
                      type="number"
                      value={newWarning}
                      onChange={(e) => setNewWarning(Number(e.target.value))}
                      className="mt-1 w-full rounded border border-border bg-background p-2 text-foreground focus:outline-hidden"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded border border-border px-3 py-1.5 font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-primary px-4 py-1.5 font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    Register KPI
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

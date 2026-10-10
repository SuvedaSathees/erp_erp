// Magnertia ERP - Data Visualization
// Management → Business Intelligence → Data Visualization
// Data Visualization Form — MAICW Classification & Visualization Studio

import React, { useState, useEffect } from "react";

import {
  BarChart2,
  Layout,
  Database,
  Share2,
  Clock,
  Eye,
  Calendar,
  Plus,
  Edit,
  Download,
  Filter,
  Layers,
  Settings,
  Sparkles,
  Zap,
  MapPin,
  TrendingUp,
  Sliders,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Table,
  PieChart as PieIcon,
  Activity,
  X,
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
  AreaChart,
  Area,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessIntelligenceTabBar } from "@/components/erp/BusinessIntelligenceTabBar";
import { BiSubmoduleHeader } from "@/components/erp/BiSubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import {
  DV_KPIS,
  DV_CATALOG_ITEMS,
  VisualizationCatalogItem,
} from "@/services/dataVisualizationService";
import { cn } from "@/lib/utils";

import { useModuleDataset, usePersistentState } from "@/services/moduleDatasetService";
import { exportRecords } from "@/lib/recordExport";
const DV_TABS = [
  "Dashboard",
  "Visualization Library",
  "Datasets",
  "Chart Builder",
  "Dashboards",
  "Reports",
  "Templates",
  "Filters",
  "Sharing & Access",
  "Export",
  "Settings",
] as const;

const CHART_TYPES = [
  { name: "Bar", id: "bar" },
  { name: "Line", id: "line" },
  { name: "Area", id: "area" },
  { name: "Pie", id: "pie" },
  { name: "Donut", id: "donut" },
  { name: "Column", id: "column" },
  { name: "Stacked", id: "stacked" },
  { name: "100% Stacked", id: "stacked100" },
  { name: "Scatter", id: "scatter" },
  { name: "Bubble", id: "bubble" },
  { name: "Map", id: "map" },
  { name: "Heatmap", id: "heatmap" },
  { name: "Treemap", id: "treemap" },
  { name: "Gauge", id: "gauge" },
  { name: "Funnel", id: "funnel" },
  { name: "Waterfall", id: "waterfall" },
  { name: "Combo", id: "combo" },
  { name: "Table", id: "table" },
  { name: "Pivot Table", id: "pivot" },
  { name: "KPI Card", id: "kpi" },
];

const trendData = [
  { month: "Jan", ac: 1600, dcFast: 800, wireless: 200 },
  { month: "Feb", ac: 1800, dcFast: 950, wireless: 250 },
  { month: "Mar", ac: 1750, dcFast: 1100, wireless: 300 },
  { month: "Apr", ac: 1900, dcFast: 1250, wireless: 320 },
  { month: "May", ac: 2050, dcFast: 1400, wireless: 380 },
  { month: "Jun", ac: 2200, dcFast: 1550, wireless: 420 },
  { month: "Jul", ac: 2100, dcFast: 1680, wireless: 490 },
  { month: "Aug", ac: 2350, dcFast: 1800, wireless: 540 },
  { month: "Sep", ac: 2500, dcFast: 1950, wireless: 600 },
];

const revenueModelData = [
  { name: "Charging-as-a-Service", value: 42, color: "#3B82F6" },
  { name: "Hardware Sales", value: 24, color: "#10B981" },
  { name: "Franchise Royalty", value: 16, color: "#F59E0B" },
  { name: "AMC", value: 10, color: "#EC4899" },
  { name: "Advertising", value: 6, color: "#8B5CF6" },
  { name: "Others", value: 2, color: "#64748B" },
];

const dailyDistributionData = [
  { day: "Mon", ac: 1200, dcFast: 900, wireless: 250 },
  { day: "Tue", ac: 1350, dcFast: 1050, wireless: 280 },
  { day: "Wed", ac: 1500, dcFast: 1150, wireless: 310 },
  { day: "Thu", ac: 1600, dcFast: 1250, wireless: 350 },
  { day: "Fri", ac: 1900, dcFast: 1500, wireless: 420 },
  { day: "Sat", ac: 2200, dcFast: 1800, wireless: 550 },
  { day: "Sun", ac: 2400, dcFast: 2000, wireless: 600 },
];

const PAGE_DATASET = { DV_KPIS, DV_CATALOG_ITEMS, CHART_TYPES, trendData, revenueModelData, dailyDistributionData };

export function DataVisualizationPage({
  breadcrumb = "Management > Business Intelligence Management > Data Visualization",
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const { DV_KPIS, DV_CATALOG_ITEMS, CHART_TYPES, trendData, revenueModelData, dailyDistributionData } = useModuleDataset("digital-development.data-visualization", "Data Visualization", PAGE_DATASET);
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [selectedBu, setSelectedBu] = useState("All Business Units");
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [configTab, setConfigTab] = useState<"chart" | "data" | "filters" | "format" | "advanced">("chart");
  const [chartTitle, setChartTitle] = useState("Charging Sessions Trend");
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [showGridLines, setShowGridLines] = useState(true);
  const [enableDrillDown, setEnableDrillDown] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [catalog, setCatalog] = usePersistentState<VisualizationCatalogItem[]>("digital-development.data-visualization", "Data Visualization", "DV_CATALOG_ITEMS", DV_CATALOG_ITEMS);

  // Checkbox dimension states
  const [selectedDims, setSelectedDims] = useState<Record<string, boolean>>({
    Date: true,
    "Charging Station": true,
    Location: false,
    "Charger Type": true,
    Customer: false,
    "Vehicle Type": false,
    "Payment Method": false,
  });

  const [selectedMeasures, setSelectedMeasures] = useState<Record<string, boolean>>({
    "Charging Sessions": true,
    "Energy Delivered (kWh)": true,
    "Revenue (₹)": false,
    "Average Session Time": false,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApplyConfig = () => {
    showToast(`Chart settings applied: ${chartTitle} (${selectedChartType.toUpperCase()})`);
  };

  // Sessions Trend multi-line data

  // Revenue by Business Model (Donut)

  // Daily Distribution Stacked Bar Data

  return (
    <AppShell
      title="Data Visualization"
      breadcrumb={breadcrumb}
      description="Create, Explore and Share Interactive Visualizations"
      tabs={tabs ?? <BusinessIntelligenceTabBar />}
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
          icon={BarChart2}
          title="Data Visualization"
          code="DV-STU-2026-001"
          badge="Enterprise Design"
          subtitle="Create, explore, customize, and share interactive visualizations, KPI scorecards, telemetry heatmaps, and executive dashboards."
          primaryActionLabel="+ New Visualization"
          onPrimaryAction={() => {
            const item: VisualizationCatalogItem = {
              id: catalog.length + 1,
              name: `New Visualization #${catalog.length + 1}`,
              type: "Line Chart",
              dataset: "EV Charging",
              lastModified: "Today",
              status: "Published",
              views: 1,
            };
            setCatalog([item, ...catalog]);
            showToast(`New visualization "${item.name}" registered.`);
          }}
          onExportCsv={() => exportRecords("Visualization Catalog", catalog, "csv")}
          onExportExcel={() => exportRecords("Visualization Catalog", catalog, "xlsx")}
          onExportPdf={() => exportRecords("Visualization Catalog", catalog, "pdf")}
        />

        {/* 7-Gauge Circular Score Banner matching Image 3 */}
        <ProductScoreBanner submoduleKey="data-visualization" />

        {/* 6 KPI Cards Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {DV_KPIS.map((kpi) => (
            <div key={kpi.id} className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground truncate">{kpi.label}</span>
                <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <BarChart2 className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2 text-xl font-bold text-foreground">{kpi.value}</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{kpi.change}</span>
            </div>
          ))}
        </div>

        {/* Main 2-Column Split: Active Dashboard Canvas (9 cols) + Visualization Configuration (3 cols) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* LEFT: EV Charging Network Overview Dashboard Preview (9 cols) */}
          <div className="space-y-4 lg:col-span-9">
            {/* Canvas Header */}
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground">EV Charging Network Overview</h2>
                <p className="text-xs text-muted-foreground">Interactive analytical dashboard canvas</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="rounded border border-border bg-background px-2.5 py-1 text-xs">
                  <option>All Regions</option>
                  <option>Tamil Nadu</option>
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                </select>
                <select className="rounded border border-border bg-background px-2.5 py-1 text-xs">
                  <option>Last 6 Months</option>
                  <option>Last 30 Days</option>
                </select>
                <button
                  onClick={() => showToast("Edit mode activated for EV Charging Overview canvas.")}
                  className="rounded border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-muted cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* 4 Summary Telemetry Badges */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-3 shadow-xs">
                <span className="text-[11px] text-muted-foreground">Total Charging Sessions</span>
                <div className="text-lg font-bold text-foreground mt-0.5">24,583</div>
                <span className="text-[10px] font-semibold text-emerald-600">↑ 28% vs. last period</span>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 shadow-xs">
                <span className="text-[11px] text-muted-foreground">Total Energy Delivered</span>
                <div className="text-lg font-bold text-foreground mt-0.5">485 MWh</div>
                <span className="text-[10px] font-semibold text-emerald-600">↑ 32% vs. last period</span>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 shadow-xs">
                <span className="text-[11px] text-muted-foreground">Total Revenue</span>
                <div className="text-lg font-bold text-foreground mt-0.5">₹36.8 Lakh</div>
                <span className="text-[10px] font-semibold text-emerald-600">↑ 24% vs. last period</span>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 shadow-xs">
                <span className="text-[11px] text-muted-foreground">Active Stations</span>
                <div className="text-lg font-bold text-foreground mt-0.5">128</div>
                <span className="text-[10px] font-semibold text-emerald-600">↑ 12% vs. last period</span>
              </div>
            </div>

            {/* Row 1 inside canvas: Sessions Trend (Line) + Energy Consumption by Region (Bars) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
              {/* Sessions Trend */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs sm:col-span-8">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-xs font-bold text-foreground">{chartTitle}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500" /> AC Charging
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> DC Fast
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-purple-500" /> Wireless
                    </span>
                  </div>
                </div>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      {showGridLines && <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />}
                      <XAxis dataKey="month" className="text-[9px]" tickLine={false} />
                      <YAxis className="text-[9px]" tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="ac" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="dcFast" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="wireless" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Energy by Region list */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs sm:col-span-4">
                <h3 className="text-xs font-bold text-foreground pb-2">Energy by Region</h3>
                <div className="space-y-1.5 text-[11px]">
                  {[
                    { region: "Tamil Nadu", share: "28%" },
                    { region: "Karnataka", share: "18%" },
                    { region: "Maharashtra", share: "15%" },
                    { region: "Delhi", share: "10%" },
                    { region: "Telangana", share: "9%" },
                    { region: "Gujarat", share: "8%" },
                    { region: "Others", share: "12%" },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-muted-foreground">{r.region}</span>
                      <span className="font-bold text-foreground">{r.share}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2 inside canvas: Revenue by Model (Donut), Heatmap matrix, Daily Distribution (Stacked Bars) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Revenue by Business Model */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                <h3 className="text-xs font-bold text-foreground pb-2">Revenue by Business Model</h3>
                <div className="relative mx-auto h-[120px] w-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={revenueModelData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={50}>
                        {revenueModelData.map((e, idx) => (
                          <Cell key={idx} fill={e.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-foreground">₹36.8 L</span>
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-[10px]">
                  {revenueModelData.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="text-muted-foreground truncate">{r.name}</span>
                      </div>
                      <span className="font-bold">{r.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charger Utilization Heatmap */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-xs font-bold text-foreground">Charger Utilization Heatmap</h3>
                  <span className="text-[9px] text-muted-foreground">High / Low</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  {["Chennai", "Coimbatore", "Bengaluru", "Hyderabad", "Mumbai"].map((city, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-16 truncate text-muted-foreground">{city}</span>
                      <div className="grid grid-cols-7 gap-1 flex-1">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                          const level = ((idx * 2 + day) % 3) + 1;
                          return (
                            <div
                              key={day}
                              className={cn(
                                "h-4 rounded-xs",
                                level === 1 && "bg-blue-100 dark:bg-blue-950/40",
                                level === 2 && "bg-blue-400 dark:bg-blue-700",
                                level === 3 && "bg-blue-700 dark:bg-blue-500"
                              )}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[8px] text-muted-foreground pt-2 pl-18">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Session Distribution */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                <h3 className="text-xs font-bold text-foreground pb-2">Session Distribution</h3>
                <div className="h-[140px] w-full mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyDistributionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                      <XAxis dataKey="day" className="text-[9px]" tickLine={false} />
                      <YAxis className="text-[9px]" tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="ac" stackId="a" fill="#3B82F6" />
                      <Bar dataKey="dcFast" stackId="a" fill="#10B981" />
                      <Bar dataKey="wireless" stackId="a" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visualization Configuration Studio Panel (3 cols) */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Visualization Configuration</h3>
              <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center justify-between border-b border-border pb-1 text-[11px] font-medium text-muted-foreground">
              {(["chart", "data", "filters", "format", "advanced"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setConfigTab(t)}
                  className={cn(
                    "capitalize transition-all pb-1 cursor-pointer",
                    configTab === t && "text-primary font-bold border-b-2 border-primary"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Chart Type Icons Grid */}
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Chart Type</span>
              <div className="grid grid-cols-5 gap-1.5 mt-1.5">
                {CHART_TYPES.slice(0, 15).map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => {
                      setSelectedChartType(ct.id);
                      showToast(`Switched chart format to ${ct.name}`);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center rounded p-1.5 text-[9px] border transition-all cursor-pointer",
                      selectedChartType === ct.id
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <BarChart2 className="h-3.5 w-3.5 mb-0.5" />
                    <span className="truncate w-full text-center">{ct.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Settings Form */}
            <div className="space-y-2.5 text-xs pt-1 border-t border-border">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground">Title</label>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-muted-foreground">Subtitle</label>
                <input
                  type="text"
                  defaultValue="Monthly charging sessions by charger"
                  className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground">X-Axis</label>
                  <select className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs">
                    <option>Month</option>
                    <option>Day</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground">Y-Axis</label>
                  <select className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs">
                    <option>Number of Sessions</option>
                    <option>Energy (MWh)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center justify-between text-[11px] cursor-pointer">
                  <span className="text-muted-foreground">Show Data Labels</span>
                  <input
                    type="checkbox"
                    checked={showDataLabels}
                    onChange={(e) => setShowDataLabels(e.target.checked)}
                    className="rounded border-border text-primary"
                  />
                </label>
                <label className="flex items-center justify-between text-[11px] cursor-pointer">
                  <span className="text-muted-foreground">Show Grid Lines</span>
                  <input
                    type="checkbox"
                    checked={showGridLines}
                    onChange={(e) => setShowGridLines(e.target.checked)}
                    className="rounded border-border text-primary"
                  />
                </label>
                <label className="flex items-center justify-between text-[11px] cursor-pointer">
                  <span className="text-muted-foreground">Enable Drill-down</span>
                  <input
                    type="checkbox"
                    checked={enableDrillDown}
                    onChange={(e) => setEnableDrillDown(e.target.checked)}
                    className="rounded border-border text-primary"
                  />
                </label>
              </div>

              {/* Preview & Apply Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => showToast("Preview rendering updated in canvas.")}
                  className="flex-1 rounded border border-border bg-background py-1.5 text-xs font-semibold hover:bg-muted cursor-pointer"
                >
                  Preview
                </button>
                <button
                  onClick={handleApplyConfig}
                  className="flex-1 rounded bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Split: Data Sources & Dataset Fields (Left) + Visualizations Catalog Table (Right) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Data Sources & Dataset Fields (6 cols) */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs lg:col-span-6 space-y-4">
            {/* Data Sources */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-xs font-bold text-foreground">Data Sources</h3>
                <button
                  onClick={() => showToast("Connecting to new data source...")}
                  className="text-[10px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                >
                  + Add Source
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                {[
                  { name: "ERP (Odoo)", status: "Connected" },
                  { name: "CRM", status: "Connected" },
                  { name: "EVSE IoT", status: "Connected" },
                  { name: "Financial Data", status: "Connected" },
                  { name: "Data Warehouse", status: "Connected" },
                  { name: "External APIs", status: "Connected" },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded border border-border/70 bg-muted/20 p-2">
                    <span className="font-medium text-foreground text-[11px]">{s.name}</span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dataset Fields */}
            <div>
              <h3 className="text-xs font-bold text-foreground pb-2 border-b border-border">
                Dataset Fields (EV Charging Data)
              </h3>
              <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                {/* Dimensions */}
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Dimensions</span>
                  <div className="mt-1 space-y-1">
                    {Object.keys(selectedDims).map((dim) => (
                      <label key={dim} className="flex items-center gap-2 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={selectedDims[dim]}
                          onChange={(e) => setSelectedDims({ ...selectedDims, [dim]: e.target.checked })}
                          className="rounded border-border text-primary"
                        />
                        <span className="text-foreground">{dim}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Measures */}
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Measures</span>
                  <div className="mt-1 space-y-1">
                    {Object.keys(selectedMeasures).map((m) => (
                      <label key={m} className="flex items-center gap-2 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={selectedMeasures[m]}
                          onChange={(e) => setSelectedMeasures({ ...selectedMeasures, [m]: e.target.checked })}
                          className="rounded border-border text-primary"
                        />
                        <span className="text-foreground">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualizations & Dashboards Catalog Directory (6 cols) */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs lg:col-span-6">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Visualizations & Dashboards</h3>
              <button
                onClick={() => showToast("Viewing entire visualization registry.")}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Name</th>
                  <th className="pb-1">Type</th>
                  <th className="pb-1">Dataset</th>
                  <th className="pb-1">Modified</th>
                  <th className="pb-1">Status</th>
                  <th className="pb-1 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {catalog.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30">
                    <td className="py-2 text-[11px] font-semibold text-foreground truncate max-w-[120px]">{item.name}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{item.type}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{item.dataset}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{item.lastModified}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          item.status === "Published" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                          item.status === "Draft" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                        <button
                          onClick={() => {
                            setChartTitle(item.name);
                            showToast(`Loaded ${item.name} into Studio canvas.`);
                          }}
                          className="hover:text-foreground cursor-pointer"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => showToast(`Exported ${item.name} as PDF.`)}
                          className="hover:text-foreground cursor-pointer"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

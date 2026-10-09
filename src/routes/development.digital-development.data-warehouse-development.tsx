// Magnertia ERP - Data Warehouse Development
// Development → Digital Development → Data Platform Development → Data Warehouse Development
// Data Warehouse Development Form — MAICW Classification & Platform Studio

import React, { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Database,
  GitMerge,
  HardDrive,
  ShieldCheck,
  Zap,
  Users,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Server,
  Cloud,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  Plus,
  RefreshCw,
  Sliders,
  ChevronRight,
  ExternalLink,
  Workflow,
  Cpu,
  X,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { DigitalDevelopmentTabBar } from "@/components/erp/DigitalDevelopmentTabBar";
import { BusinessIntelligenceTabBar } from "@/components/erp/BusinessIntelligenceTabBar";
import { BiSubmoduleHeader } from "@/components/erp/BiSubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import {
  DW_KPIS,
  DW_MILESTONES,
  DW_RECENT_PIPELINES,
  DW_TOP_SOURCES,
} from "@/services/dataWarehouseService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/digital-development/data-warehouse-development"
)({
  beforeLoad: () => {
    throw redirect({
      to: "/development/business-development/overview",
      replace: true,
    });
  },
});

const DW_TABS = [
  "Overview",
  "Project Details",
  "Data Sources",
  "Data Models",
  "ETL / ELT",
  "Data Quality",
  "Security & Governance",
  "Data Marts",
  "BI & Reports",
  "Testing & Deployment",
  "Monitoring",
  "Analytics",
] as const;

export function DataWarehouseDevelopmentPage({
  breadcrumb = "Management > Business Intelligence Management > Data Warehouse Development",
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [selectedEnv, setSelectedEnv] = useState("All Environments");
  const [aiTab, setAiTab] = useState<"insights" | "recs">("insights");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [showPipelinesModal, setShowPipelinesModal] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);

  const [pipelines, setPipelines] = useState(DW_RECENT_PIPELINES);
  const [newProject, setNewProject] = useState({
    name: "",
    source: "ERP (PostgreSQL)",
    target: "Enterprise DW (Snowflake)",
    schedule: "Daily 02:00 UTC",
    env: "Production",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    const newId = `DW-${Date.now().toString().slice(-4)}`;
    const created = {
      id: newId,
      name: newProject.name,
      source: `${newProject.source} -> ${newProject.target}`,
      schedule: newProject.schedule,
      status: "Running" as const,
    };

    setPipelines([created, ...pipelines]);
    setShowNewProjectModal(false);
    setNewProject({
      name: "",
      source: "ERP (PostgreSQL)",
      target: "Enterprise DW (Snowflake)",
      schedule: "Daily 02:00 UTC",
      env: "Production",
    });
    showToast(`Warehouse pipeline '${created.name}' initialized successfully!`);
  };

  // Volume trend data (Jan-Sep)
  const volumeData = [
    { month: "Jan", volume: 3.2 },
    { month: "Feb", volume: 4.5 },
    { month: "Mar", volume: 5.8 },
    { month: "Apr", volume: 7.1 },
    { month: "May", volume: 8.6 },
    { month: "Jun", volume: 9.9 },
    { month: "Jul", volume: 10.8 },
    { month: "Aug", volume: 11.5 },
    { month: "Sep", volume: 12.6 },
  ];

  // Pipeline Execution Pie Data
  const pipelinePieData = [
    { name: "Successful", value: 24, percent: "85.7%", color: "#10B981" },
    { name: "Failed", value: 2, percent: "7.1%", color: "#EF4444" },
    { name: "Running", value: 2, percent: "7.1%", color: "#3B82F6" },
  ];

  // Data Quality Metrics
  const qualityMetrics = [
    { name: "Completeness", score: "98.1%" },
    { name: "Accuracy", score: "95.4%" },
    { name: "Consistency", score: "96.8%" },
    { name: "Validity", score: "94.7%" },
    { name: "Uniqueness", score: "98.9%" },
    { name: "Timeliness", score: "93.4%" },
  ];

  return (
    <AppShell
      title="Data Warehouse Development"
      breadcrumb={breadcrumb}
      description="Build a Scalable, Governed and High Performance Analytical Data Warehouse"
      tabs={tabs ?? <BusinessIntelligenceTabBar />}
    >
      <div className="space-y-5 p-1 pb-16">
        {/* Submodule Standard Header Card matching Image 1 */}
        <BiSubmoduleHeader
          icon={Database}
          title="Data Warehouse Development"
          code="DW-DEV-2026-001"
          badge="Production Lakehouse"
          subtitle="Enterprise lakehouse architecture, multi-source ingestion, dimensional star schemas, ETL/ELT pipelines, and data governance."
          primaryActionLabel="+ New Warehouse Project"
          onPrimaryAction={() => setShowNewProjectModal(true)}
          onRefresh={() => showToast("Warehouse pipeline health and schema telemetry refreshed.")}
          onExportCsv={() => showToast("Exported pipeline registry to CSV (.csv)")}
          onExportExcel={() => showToast("Exported schema dictionary to Excel (.xlsx)")}
          onExportPdf={() => showToast("Generated Lakehouse Architecture Blueprint (.pdf)")}
        />

        {/* 7-Gauge Circular Score Banner matching Image 3 */}
        <ProductScoreBanner submoduleKey="data-warehouse-development" />


        {/* 7 KPI Cards Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          {/* 1. Source Systems */}
          <div
            onClick={() => {
              setActiveTab("Data Sources");
              showToast("Switched to Data Sources management.");
            }}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Source Systems</span>
              <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">14</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 17% vs last quarter</span>
          </div>

          {/* 2. Data Pipelines */}
          <div
            onClick={() => {
              setActiveTab("ETL / ELT");
              showToast("Switched to ETL / ELT pipeline manager.");
            }}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Data Pipelines</span>
              <div className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <GitMerge className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">{pipelines.length}</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 21% vs last quarter</span>
          </div>

          {/* 3. Total Data Volume */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Total Data Volume</span>
              <div className="rounded-md bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <HardDrive className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">12.6 TB</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 32% vs last month</span>
          </div>

          {/* 4. Data Quality Score */}
          <div
            onClick={() => {
              setActiveTab("Data Quality");
              showToast("Opening Data Quality governance scorecards.");
            }}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Data Quality Score</span>
              <div className="rounded-md bg-teal-50 p-1.5 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">96.2%</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 4.8% vs last month</span>
          </div>

          {/* 5. Avg Query Performance */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Query Latency</span>
              <div className="rounded-md bg-rose-50 p-1.5 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">1.8 sec</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↓ 18% vs last month</span>
          </div>

          {/* 6. BI Users */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">BI Users</span>
              <div className="rounded-md bg-sky-50 p-1.5 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">156</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 12% vs last month</span>
          </div>

          {/* 7. Reports / Dashboards */}
          <div
            onClick={() => {
              setActiveTab("BI & Reports");
              showToast("Switched to BI & Reports layer.");
            }}
            className="rounded-xl border border-border bg-card p-4 shadow-xs cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Reports/Dashboards</span>
              <div className="rounded-md bg-indigo-50 p-1.5 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <BarChart3 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">24</div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↑ 26% vs last month</span>
          </div>
        </div>

        {/* Row 1: Data Warehouse Architecture Flow (Left) + Warehouse Progress & Milestones (Right) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* ARCHITECTURE FLOW DIAGRAM (7 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-7">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Data Warehouse Architecture</h3>
                <p className="text-xs text-muted-foreground">End-to-end analytical ingestion, modeling, and BI serving flow</p>
              </div>
              <button
                onClick={() => showToast("Warehouse schema flow visualizer opened.")}
                className="rounded border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-muted cursor-pointer"
              >
                Edit Flow
              </button>
            </div>

            {/* Architecture Multi-stage Diagram */}
            <div className="grid grid-cols-6 gap-2 pt-2 text-center text-xs">
              {/* Layer 1: Source Systems */}
              <div className="space-y-1.5 rounded-lg border border-border/70 bg-muted/20 p-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Source Systems</span>
                <div className="space-y-1">
                  {["ERP", "CRM", "PLM", "SCM", "Finance", "HRMS", "IoT / EVSE", "External Data"].map((s, i) => (
                    <div key={i} className="rounded bg-card py-1 px-1.5 text-[10px] font-medium text-foreground shadow-2xs border border-border/50">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 2: Ingestion */}
              <div className="space-y-1.5 rounded-lg border border-border/70 bg-muted/20 p-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Ingestion</span>
                <div className="space-y-1">
                  {["Batch", "CDC", "Streaming", "API", "File Upload"].map((s, i) => (
                    <div key={i} className="rounded bg-card py-1.5 px-1.5 text-[10px] font-medium text-foreground shadow-2xs border border-border/50">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 3: ETL / ELT */}
              <div className="space-y-1.5 rounded-lg border border-border/70 bg-muted/20 p-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">ETL / ELT</span>
                <div className="space-y-1">
                  {["Extract", "Transform", "Validate", "Enrich", "Load"].map((s, i) => (
                    <div key={i} className="rounded bg-card py-1.5 px-1.5 text-[10px] font-medium text-foreground shadow-2xs border border-border/50">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 4: Data Warehouse */}
              <div className="space-y-1.5 rounded-lg border border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/20 p-2">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Data Warehouse</span>
                <div className="flex flex-col items-center justify-center p-1 my-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                    <Database className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-foreground mt-1">Enterprise DW</span>
                </div>
                <div className="space-y-1">
                  <div className="rounded bg-card py-1 px-1.5 text-[10px] font-medium shadow-2xs border border-border/50">
                    Fact Tables
                  </div>
                  <div className="rounded bg-card py-1 px-1.5 text-[10px] font-medium shadow-2xs border border-border/50">
                    Dimensions
                  </div>
                </div>
              </div>

              {/* Layer 5: Data Marts */}
              <div className="space-y-1.5 rounded-lg border border-border/70 bg-muted/20 p-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Data Marts</span>
                <div className="space-y-1">
                  {["Finance", "Sales", "Manufacturing", "Supply Chain", "Quality", "HR", "Security", "Project"].map((s, i) => (
                    <div key={i} className="rounded bg-card py-1 px-1.5 text-[10px] font-medium text-foreground shadow-2xs border border-border/50">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 6: BI & Analytics */}
              <div className="space-y-1.5 rounded-lg border border-border/70 bg-muted/20 p-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">BI & Analytics</span>
                <div className="space-y-1">
                  {["Dashboards", "Reports", "Self Service BI", "AI / ML", "Data Catalog", "APIs", "Data Sharing"].map((s, i) => (
                    <div key={i} className="rounded bg-card py-1 px-1.5 text-[10px] font-medium text-foreground shadow-2xs border border-border/50">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PROJECT PROGRESS & MILESTONES (5 cols) */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-5 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Warehouse Project Progress</h3>
                <button
                  onClick={() => {
                    setActiveTab("Project Details");
                    showToast("Loaded Warehouse Architecture Plan.");
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                >
                  View Plan &rarr;
                </button>
              </div>

              {/* 5-Step Pipeline Progress Indicator */}
              <div className="mt-3 flex items-center justify-between text-center">
                <div className="space-y-1">
                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                    ✓
                  </div>
                  <span className="block text-[10px] font-medium text-foreground">Requirements</span>
                </div>
                <div className="h-0.5 flex-1 bg-emerald-500 mx-1" />
                <div className="space-y-1">
                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                    ✓
                  </div>
                  <span className="block text-[10px] font-medium text-foreground">Design</span>
                </div>
                <div className="h-0.5 flex-1 bg-blue-500 mx-1" />
                <div className="space-y-1">
                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                    3
                  </div>
                  <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400">Development</span>
                </div>
                <div className="h-0.5 flex-1 bg-muted mx-1" />
                <div className="space-y-1">
                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                    4
                  </div>
                  <span className="block text-[10px] text-muted-foreground">Testing</span>
                </div>
                <div className="h-0.5 flex-1 bg-muted mx-1" />
                <div className="space-y-1">
                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                    5
                  </div>
                  <span className="block text-[10px] text-muted-foreground">Deployment</span>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Overall Completion</span>
                <span className="font-bold text-foreground">60%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden mt-1">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "60%" }} />
              </div>
            </div>

            {/* Key Milestones Table */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h4 className="text-xs font-bold text-foreground">Key Milestones</h4>
                <button
                  onClick={() => setShowMilestonesModal(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                >
                  View All
                </button>
              </div>
              <table className="w-full text-left text-xs mt-2">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-[10px]">
                    <th className="pb-1">#</th>
                    <th className="pb-1">Milestone</th>
                    <th className="pb-1">Start Date</th>
                    <th className="pb-1">End Date</th>
                    <th className="pb-1">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {DW_MILESTONES.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => showToast(`Milestone ${m.name} is ${m.status}`)}
                      className="hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="py-1.5 text-[10px] text-muted-foreground">{m.id}</td>
                      <td className="py-1.5 font-medium text-foreground text-[11px] truncate max-w-[130px]">{m.name}</td>
                      <td className="py-1.5 text-[10px] text-muted-foreground">{m.startDate}</td>
                      <td className="py-1.5 text-[10px] text-muted-foreground">{m.endDate}</td>
                      <td className="py-1.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                            m.status === "Completed" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                            m.status === "In Progress" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
                            m.status === "Pending" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          )}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 2: Data Volume Trend, Data Quality Score, Pipeline Execution, Warehouse Performance */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Data Volume Trend */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xs font-bold text-foreground">Data Volume Trend</h3>
              <select className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px]">
                <option>Total Volume (TB)</option>
              </select>
            </div>
            <div className="h-[150px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-[9px]" tickLine={false} />
                  <YAxis className="text-[9px]" tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Quality Score */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xs font-bold text-foreground">Data Quality Score</h3>
              <button
                onClick={() => {
                  setActiveTab("Data Quality");
                  showToast("Opened detailed Data Quality scorecard.");
                }}
                className="text-[10px] text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View Details
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex flex-col items-center justify-center p-2">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-500/20 border-t-emerald-500">
                  <span className="text-sm font-bold text-foreground">96.2%</span>
                </div>
                <span className="text-[9px] text-muted-foreground mt-1">Overall Score</span>
              </div>
              <div className="flex-1 space-y-1 text-[10px]">
                {qualityMetrics.slice(0, 4).map((q, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-muted-foreground">{q.name}</span>
                    <span className="font-semibold text-foreground">{q.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pipeline Execution */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xs font-bold text-foreground">Pipeline Execution</h3>
              <span className="text-[10px] text-muted-foreground">Last 30 Days</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="relative h-[90px] w-[90px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pipelinePieData} dataKey="value" cx="50%" cy="50%" innerRadius={24} outerRadius={38}>
                      {pipelinePieData.map((e, idx) => (
                        <Cell key={idx} fill={e.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-bold text-foreground">{pipelines.length}</span>
                  <span className="text-[8px] text-muted-foreground">Pipelines</span>
                </div>
              </div>
              <div className="flex-1 space-y-1 text-[10px]">
                {pipelinePieData.map((p, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-muted-foreground">{p.name}</span>
                    </div>
                    <span className="font-semibold">{p.value} ({p.percent})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Warehouse Performance */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xs font-bold text-foreground">Warehouse Performance</h3>
              <span className="text-[10px] text-muted-foreground">Last 7 Days</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1 text-center">
              <div className="rounded border border-border bg-muted/20 p-1.5">
                <span className="text-[9px] text-muted-foreground">Query Response</span>
                <div className="text-sm font-bold text-foreground">1.8 sec</div>
                <span className="text-[9px] text-emerald-600 font-semibold">↓ 18%</span>
              </div>
              <div className="rounded border border-border bg-muted/20 p-1.5">
                <span className="text-[9px] text-muted-foreground">Concurrency</span>
                <div className="text-sm font-bold text-foreground">48</div>
                <span className="text-[9px] text-emerald-600 font-semibold">↑ 20%</span>
              </div>
              <div className="rounded border border-border bg-muted/20 p-1.5">
                <span className="text-[9px] text-muted-foreground">CPU Utilization</span>
                <div className="text-sm font-bold text-foreground">62%</div>
                <span className="text-[9px] text-emerald-600 font-semibold">↓ 12%</span>
              </div>
              <div className="rounded border border-border bg-muted/20 p-1.5">
                <span className="text-[9px] text-muted-foreground">Storage Util</span>
                <div className="text-sm font-bold text-foreground">68%</div>
                <span className="text-[9px] text-amber-600 font-semibold">↑ 6%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Recent Pipelines Table, Top Data Sources by Volume, AI Warehouse Intelligence */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Recent Pipelines Table */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Recent Pipelines</h3>
              <button
                onClick={() => setShowPipelinesModal(true)}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># Pipeline</th>
                  <th className="pb-1">Source &rarr; Target</th>
                  <th className="pb-1">Schedule</th>
                  <th className="pb-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pipelines.slice(0, 4).map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => {
                      const nextStatus = p.status === "Success" ? "Running" : "Success";
                      setPipelines(pipelines.map((item) => (item.id === p.id ? { ...item, status: nextStatus } : item)));
                      showToast(`Pipeline ${p.name} triggered manually. Status: ${nextStatus}`);
                    }}
                    className="hover:bg-muted/30 cursor-pointer"
                  >
                    <td className="py-2 text-[11px] font-semibold text-foreground truncate max-w-[100px]">{p.name}</td>
                    <td className="py-2 text-[10px] text-muted-foreground truncate max-w-[90px]">{p.source}</td>
                    <td className="py-2 text-[10px] text-muted-foreground">{p.schedule}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          p.status === "Success" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                          p.status === "Running" && "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
                          p.status === "Failed" && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Data Sources by Volume */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Top Data Sources by Volume</h3>
              <button
                onClick={() => setShowSourcesModal(true)}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View All
              </button>
            </div>
            <table className="w-full text-left text-xs mt-2">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px]">
                  <th className="pb-1"># System</th>
                  <th className="pb-1">Data Volume</th>
                  <th className="pb-1">Growth</th>
                  <th className="pb-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {DW_TOP_SOURCES.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => showToast(`Selected source ${s.sourceSystem} (${s.volume})`)}
                    className="hover:bg-muted/30 cursor-pointer"
                  >
                    <td className="py-2 text-[11px] font-semibold text-foreground">{s.sourceSystem}</td>
                    <td className="py-2 text-[10px] font-bold text-foreground">{s.volume}</td>
                    <td className="py-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">↑ {s.growth}</td>
                    <td className="py-2">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Warehouse Intelligence */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <h3 className="text-xs font-bold text-foreground">AI Warehouse Intelligence</h3>
              </div>
              <div className="flex rounded border border-border bg-muted/40 p-0.5 text-[9px]">
                <button
                  onClick={() => setAiTab("insights")}
                  className={cn("rounded px-1.5 py-0.5 cursor-pointer", aiTab === "insights" && "bg-background font-bold shadow-xs")}
                >
                  Insights
                </button>
                <button
                  onClick={() => setAiTab("recs")}
                  className={cn("rounded px-1.5 py-0.5 cursor-pointer", aiTab === "recs" && "bg-background font-bold shadow-xs")}
                >
                  Recs
                </button>
              </div>
            </div>
            <div className="mt-2.5 space-y-2 text-[11px]">
              {aiTab === "insights" ? (
                <>
                  <div className="flex items-start gap-2 rounded bg-muted/20 p-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                    <span>Data volume is growing at 32% MoM. Consider auto-scaling storage tiers.</span>
                  </div>
                  <div className="flex items-start gap-2 rounded bg-muted/20 p-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                    <span>CRM customer data quality has 4.6% invalid schema records.</span>
                  </div>
                  <div className="flex items-start gap-2 rounded bg-muted/20 p-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <span>Query latency improved by 18% following composite index creation.</span>
                  </div>
                  <div className="flex items-start gap-2 rounded bg-muted/20 p-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                    <span>Two pipelines experienced timeouts due to source schema changes.</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2 rounded bg-muted/20 p-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <span>Enable partitioning by date on EVSE transaction fact table to lower query costs by 45%.</span>
                  </div>
                  <div className="flex items-start gap-2 rounded bg-muted/20 p-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                    <span>Schedule ERP sync at 01:00 UTC instead of 02:00 UTC to minimize resource contention.</span>
                  </div>
                  <div className="flex items-start gap-2 rounded bg-muted/20 p-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1 shrink-0" />
                    <span>Pre-aggregate monthly revenue rollups in Data Mart for instantaneous executive reporting.</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal: New Warehouse Project */}
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">New Warehouse Project / Pipeline</h3>
                </div>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Pipeline Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EVSE Charging Sessions Ingestion"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Source System</label>
                    <select
                      value={newProject.source}
                      onChange={(e) => setNewProject({ ...newProject, source: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    >
                      <option>ERP (PostgreSQL)</option>
                      <option>CRM (Salesforce API)</option>
                      <option>EVSE Telemetry (Kafka)</option>
                      <option>Supply Chain (SAP)</option>
                      <option>HRMS (Workday API)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Target Data Mart</label>
                    <select
                      value={newProject.target}
                      onChange={(e) => setNewProject({ ...newProject, target: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    >
                      <option>Enterprise DW (Snowflake)</option>
                      <option>Finance Data Mart</option>
                      <option>Operations Data Mart</option>
                      <option>Executive Analytics Store</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Schedule</label>
                    <select
                      value={newProject.schedule}
                      onChange={(e) => setNewProject({ ...newProject, schedule: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    >
                      <option>Daily 02:00 UTC</option>
                      <option>Hourly</option>
                      <option>Real-Time Streaming</option>
                      <option>Weekly (Sundays)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Environment</label>
                    <select
                      value={newProject.env}
                      onChange={(e) => setNewProject({ ...newProject, env: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden"
                    >
                      <option>Production</option>
                      <option>Staging</option>
                      <option>Development</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                    className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer"
                  >
                    Initialize Pipeline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: All Milestones */}
        {showMilestonesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Warehouse Project Milestones Register</h3>
                <button
                  onClick={() => setShowMilestonesModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="p-2">#</th>
                      <th className="p-2">Milestone Name</th>
                      <th className="p-2">Start Date</th>
                      <th className="p-2">End Date</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {DW_MILESTONES.map((m) => (
                      <tr key={m.id} className="hover:bg-muted/40">
                        <td className="p-2 font-mono">{m.id}</td>
                        <td className="p-2 font-semibold text-foreground">{m.name}</td>
                        <td className="p-2 text-muted-foreground">{m.startDate}</td>
                        <td className="p-2 text-muted-foreground">{m.endDate}</td>
                        <td className="p-2">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: All Pipelines */}
        {showPipelinesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground">All Ingestion & ETL Pipelines</h3>
                <button
                  onClick={() => setShowPipelinesModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="p-2">ID</th>
                      <th className="p-2">Pipeline Name</th>
                      <th className="p-2">Source → Target</th>
                      <th className="p-2">Schedule</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pipelines.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/40">
                        <td className="p-2 font-mono">{p.id}</td>
                        <td className="p-2 font-semibold text-foreground">{p.name}</td>
                        <td className="p-2 text-muted-foreground">{p.source}</td>
                        <td className="p-2 text-muted-foreground">{p.schedule}</td>
                        <td className="p-2">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: All Sources */}
        {showSourcesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Enterprise Data Sources Directory</h3>
                <button
                  onClick={() => setShowSourcesModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="p-2">#</th>
                      <th className="p-2">Source System</th>
                      <th className="p-2">Volume</th>
                      <th className="p-2">MoM Growth</th>
                      <th className="p-2">Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {DW_TOP_SOURCES.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/40">
                        <td className="p-2 font-mono">{s.id}</td>
                        <td className="p-2 font-semibold text-foreground">{s.sourceSystem}</td>
                        <td className="p-2 text-foreground font-bold">{s.volume}</td>
                        <td className="p-2 text-emerald-600 font-medium">↑ {s.growth}</td>
                        <td className="p-2">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </AppShell>
  );
}


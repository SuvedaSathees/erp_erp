// Magnertia ERP - Business Intelligence Management
// Submodule 8: ETL & Data Pipelines
// Management → Business Intelligence Management → ETL & Data Pipelines

import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Workflow,
  Database,
  ArrowRight,
  Plus,
  Play,
  Pause,
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  FileText,
  Server,
  Zap,
  ShieldCheck,
  Terminal,
  Settings,
  ExternalLink,
  ChevronRight,
  X,
  Code2,
  HardDrive,
  Radio,
  FileCode,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessIntelligenceTabBar } from "@/components/erp/BusinessIntelligenceTabBar";
import { BiSubmoduleHeader } from "@/components/erp/BiSubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useModuleDataset } from "@/services/moduleDatasetService";
export const Route = createFileRoute(
  "/management/business-intelligence/etl-pipelines"
)({
  head: () => ({
    meta: [
      { title: "ETL & Data Pipelines · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise extract, transform, and load engine orchestrating multi-source ingestion, real-time CDC, automated dbt transformations, and DAG pipeline monitoring across all ERP data sources.",
      },
    ],
  }),
  component: EtlPipelinesPage,
});

interface PipelineRecord {
  id: string;
  name: string;
  source: string;
  sourceType: string;
  target: string;
  mode: "CDC Streaming" | "Micro-Batch" | "Hourly Batch" | "Nightly ELT";
  cadence: string;
  status: "Running" | "Idle" | "Scheduled" | "Paused" | "Warning";
  lastRun: string;
  duration: string;
  rowsProcessed: string;
  throughput: string;
  latency: string;
  errorCount: number;
}

const INITIAL_PIPELINES: PipelineRecord[] = [
  {
    id: "PIP-FIN-001",
    name: "General Ledger CDC Stream",
    source: "SAP Financials DB",
    sourceType: "PostgreSQL CDC",
    target: "dw_finance.fct_gl_postings",
    mode: "CDC Streaming",
    cadence: "Continuous (Real-time)",
    status: "Running",
    lastRun: "Just now",
    duration: "Continuous",
    rowsProcessed: "18.4M",
    throughput: "4,200 rows/s",
    latency: "620 ms",
    errorCount: 0,
  },
  {
    id: "PIP-SCM-002",
    name: "Inventory & Stock Buffer Sync",
    source: "WMS Warehouse Kafka Feed",
    sourceType: "Kafka Topic",
    target: "dw_scm.fct_inventory_balance",
    mode: "CDC Streaming",
    cadence: "Continuous (Real-time)",
    status: "Running",
    lastRun: "Just now",
    duration: "Continuous",
    rowsProcessed: "34.2M",
    throughput: "8,900 rows/s",
    latency: "480 ms",
    errorCount: 0,
  },
  {
    id: "PIP-CRM-003",
    name: "Salesforce CRM Lead & Deals Ingestion",
    source: "Salesforce REST API",
    sourceType: "REST Webhook",
    target: "dw_sales.fct_opportunities",
    mode: "Micro-Batch",
    cadence: "Every 5 mins",
    status: "Scheduled",
    lastRun: "2 mins ago",
    duration: "18s",
    rowsProcessed: "2.1M",
    throughput: "1,450 rows/s",
    latency: "2.1 s",
    errorCount: 0,
  },
  {
    id: "PIP-PRC-004",
    name: "PO Requisitions & Invoices ETL",
    source: "Procurement Oracle Instance",
    sourceType: "Oracle DB Link",
    target: "dw_procurement.fct_po_invoices",
    mode: "Hourly Batch",
    cadence: "Hourly (:00)",
    status: "Idle",
    lastRun: "38 mins ago",
    duration: "2m 14s",
    rowsProcessed: "9.8M",
    throughput: "2,200 rows/s",
    latency: "1.4 s",
    errorCount: 0,
  },
  {
    id: "PIP-HRM-005",
    name: "Biometric Attendance & Timesheet Sync",
    source: "ZKTeco IoT Gateways",
    sourceType: "MQTT Broker",
    target: "dw_hr.fct_daily_attendance",
    mode: "Micro-Batch",
    cadence: "Every 15 mins",
    status: "Running",
    lastRun: "4 mins ago",
    duration: "45s",
    rowsProcessed: "640k",
    throughput: "850 rows/s",
    latency: "920 ms",
    errorCount: 0,
  },
  {
    id: "PIP-MFG-006",
    name: "Shopfloor SCADA Sensor Telemetry",
    source: "Siemens S7 PLC Clusters",
    sourceType: "OPC UA Gateway",
    target: "dw_manufacturing.fct_machine_telemetry",
    mode: "CDC Streaming",
    cadence: "Continuous (Real-time)",
    status: "Running",
    lastRun: "Just now",
    duration: "Continuous",
    rowsProcessed: "78.6M",
    throughput: "18,400 rows/s",
    latency: "310 ms",
    errorCount: 0,
  },
  {
    id: "PIP-QMS-007",
    name: "QMS Audit Inspections & NCR Pipeline",
    source: "QMS Enterprise Portal",
    sourceType: "MySQL Replica",
    target: "dw_quality.fct_inspections",
    mode: "Hourly Batch",
    cadence: "Hourly (:30)",
    status: "Idle",
    lastRun: "12 mins ago",
    duration: "1m 02s",
    rowsProcessed: "1.2M",
    throughput: "1,100 rows/s",
    latency: "1.8 s",
    errorCount: 0,
  },
  {
    id: "PIP-ESM-008",
    name: "ESG Energy & Emission Sensor Gateway",
    source: "Schneider Electric Power Meters",
    sourceType: "Modbus TCP",
    target: "dw_sustainability.fct_energy_consumption",
    mode: "Micro-Batch",
    cadence: "Every 10 mins",
    status: "Scheduled",
    lastRun: "6 mins ago",
    duration: "24s",
    rowsProcessed: "3.4M",
    throughput: "1,800 rows/s",
    latency: "750 ms",
    errorCount: 0,
  },
  {
    id: "PIP-DBT-009",
    name: "dbt Dimensional Marts Aggregation",
    source: "Internal DW Raw Staging",
    sourceType: "dbt Core Engine",
    target: "dw_marts.dm_executive_kpis",
    mode: "Nightly ELT",
    cadence: "Daily (02:00 AM)",
    status: "Idle",
    lastRun: "Today 02:00 AM",
    duration: "14m 22s",
    rowsProcessed: "142M",
    throughput: "16,200 rows/s",
    latency: "N/A",
    errorCount: 0,
  },
];

const HOURLY_THROUGHPUT_DATA = [
  { time: "06:00", ingestionRate: 85, cdcLag: 420 },
  { time: "08:00", ingestionRate: 140, cdcLag: 580 },
  { time: "10:00", ingestionRate: 210, cdcLag: 890 },
  { time: "12:00", ingestionRate: 195, cdcLag: 740 },
  { time: "14:00", ingestionRate: 230, cdcLag: 920 },
  { time: "16:00", ingestionRate: 245, cdcLag: 850 },
  { time: "18:00", ingestionRate: 180, cdcLag: 610 },
  { time: "20:00", ingestionRate: 125, cdcLag: 490 },
  { time: "22:00", ingestionRate: 90, cdcLag: 380 },
];

const CONNECTORS_LIST = [
  { name: "PostgreSQL Debezium CDC", type: "RDBMS Streaming", status: "Healthy", lag: "420ms", nodes: 4 },
  { name: "Apache Kafka Enterprise", type: "Message Bus", status: "Healthy", lag: "120ms", nodes: 6 },
  { name: "Oracle GoldenGate", type: "Database Replica", status: "Healthy", lag: "890ms", nodes: 2 },
  { name: "Snowflake Snowpipe", type: "Cloud DW Sink", status: "Healthy", lag: "1.2s", nodes: 3 },
  { name: "AWS S3 Parquet Lakehouse", type: "Object Storage", status: "Healthy", lag: "N/A", nodes: 8 },
  { name: "dbt Transformation Core", type: "Transform Engine", status: "Healthy", lag: "0 errors", nodes: 4 },
];

const PAGE_DATASET = { INITIAL_PIPELINES, HOURLY_THROUGHPUT_DATA, CONNECTORS_LIST };

function EtlPipelinesPage() {
  const { INITIAL_PIPELINES, HOURLY_THROUGHPUT_DATA, CONNECTORS_LIST } = useModuleDataset("business-intelligence.etl-pipelines", "ETL & Data Pipelines", PAGE_DATASET);
  const [activeTab, setActiveTab] = useState<"orchestration" | "pipelines" | "connectors" | "dbt" | "quarantine">("orchestration");
  const [pipelines, setPipelines] = useState<PipelineRecord[]>(INITIAL_PIPELINES);
  useEffect(() => { setPipelines(INITIAL_PIPELINES); }, [INITIAL_PIPELINES]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [showNewModal, setShowNewModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedPipelineForLogs, setSelectedPipelineForLogs] = useState<PipelineRecord | null>(null);

  // Form State
  const [newPipelineName, setNewPipelineName] = useState("");
  const [newPipelineSource, setNewPipelineSource] = useState("PostgreSQL CDC");
  const [newPipelineTarget, setNewPipelineTarget] = useState("dw_analytics.fct_new_events");
  const [newPipelineMode, setNewPipelineMode] = useState<PipelineRecord["mode"]>("CDC Streaming");
  const [newPipelineCadence, setNewPipelineCadence] = useState("Continuous (Real-time)");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreatePipeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPipelineName.trim()) return;

    const newRecord: PipelineRecord = {
      id: `PIP-NEW-${Math.floor(100 + Math.random() * 900)}`,
      name: newPipelineName.trim(),
      source: newPipelineSource,
      sourceType: newPipelineSource,
      target: newPipelineTarget.trim(),
      mode: newPipelineMode,
      cadence: newPipelineCadence,
      status: "Running",
      lastRun: "Just created",
      duration: "0s",
      rowsProcessed: "0",
      throughput: "Starting...",
      latency: "Under 1s",
      errorCount: 0,
    };

    setPipelines([newRecord, ...pipelines]);
    setShowNewModal(false);
    setNewPipelineName("");
    showToast(`Pipeline "${newRecord.name}" successfully deployed and started.`);
  };

  const togglePipelineStatus = (id: string) => {
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === "Running" ? "Paused" : "Running";
          showToast(`Pipeline ${p.name} status updated to ${newStatus}.`);
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  const triggerManualRun = (pipeline: PipelineRecord) => {
    showToast(`Triggered manual execution for ${pipeline.name}. Backfill queued.`);
  };

  const openLogs = (pipeline: PipelineRecord) => {
    setSelectedPipelineForLogs(pipeline);
    setShowLogsModal(true);
  };

  const filteredPipelines = pipelines.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Statuses" || p.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  return (
    <AppShell
      title="ETL & Data Pipelines"
      breadcrumb="Management > Business Intelligence Management > ETL & Data Pipelines"
      description="Enterprise extract, transform, and load engine orchestrating multi-source ingestion, real-time CDC, and automated dbt transformations."
      tabs={<BusinessIntelligenceTabBar />}
    >
      <div className="space-y-5 p-1 pb-16">
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs text-white shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Submodule Standard Header Card */}
        <BiSubmoduleHeader
          icon={Workflow}
          title="ETL & Data Pipelines"
          code="BI-ETL-2026-001"
          badge="Continuous Streaming"
          badgeVariant="success"
          subtitle="Enterprise-grade extract, transform, and load engine orchestrating multi-source ingestion, real-time CDC, automated dbt transformations, and schema lineage across all ERP nodes."
          primaryActionLabel="+ New Ingestion Pipeline"
          onPrimaryAction={() => setShowNewModal(true)}
          dateRange={dateRange}
          onDateRangeChange={(r) => {
            setDateRange(r);
            showToast(`ETL telemetry date range updated to: ${r}`);
          }}
          onRefresh={() => showToast("Refreshed all 42 live pipeline heartbeats and CDC latencies.")}
          onExportCsv={() => showToast("Exported pipeline performance metrics to CSV.")}
          onExportExcel={() => showToast("Exported complete pipeline registry to Excel (.xlsx).")}
          onExportPdf={() => showToast("Generated Executive Data Infrastructure Report (.pdf).")}
        />

        {/* 7-Gauge Circular Score Banner matching BI Standard */}
        <ProductScoreBanner submoduleKey="etl-pipelines" />

        {/* 8 Enterprise Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Active Pipelines</span>
              <div className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Workflow className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">42 / 44</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>95.5% Live</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Throughput</span>
              <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">1.85 GB/s</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>+14.2% peak</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">CDC Sync Latency</span>
              <div className="rounded-md bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">620 ms</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              <span>Sub-second SLA</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Daily Ingested</span>
              <div className="rounded-md bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">142.8M</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>Rows / 24h</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Failed Runs</span>
              <div className="rounded-md bg-rose-50 p-1.5 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">0 Critical</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Auto-healed (2)</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Uptime SLA</span>
              <div className="rounded-md bg-teal-50 p-1.5 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">99.98%</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span>HA Multi-AZ</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Compute Cost</span>
              <div className="rounded-md bg-sky-50 p-1.5 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                <Cpu className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">₹0.38</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              <span>Per 10k rows</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">dbt Models Pass</span>
              <div className="rounded-md bg-indigo-50 p-1.5 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Code2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">384 / 385</div>
            <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span>99.7% integrity</span>
            </div>
          </div>
        </div>

        {/* View Mode Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-semibold">
          {[
            { id: "orchestration", label: "Live DAG & Telemetry", icon: Activity },
            { id: "pipelines", label: `Pipeline Registry (${pipelines.length})`, icon: Workflow },
            { id: "connectors", label: "Connectors & Sources (6)", icon: Server },
            { id: "dbt", label: "dbt SQL Models (385)", icon: FileCode },
            { id: "quarantine", label: "Dead-Letter & DLQ (0)", icon: ShieldCheck },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Live DAG & Telemetry */}
        {activeTab === "orchestration" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* Telemetry Chart */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Hourly Ingestion Rate & CDC Sync Lag</h3>
                    <p className="text-xs text-muted-foreground">Real-time throughput in MB/s vs. Debezium Kafka latency in milliseconds</p>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                    Live Stream Active
                  </Badge>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HOURLY_THROUGHPUT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ingestGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                      <XAxis dataKey="time" className="text-xs text-muted-foreground" tickLine={false} />
                      <YAxis className="text-xs text-muted-foreground" tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="ingestionRate"
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#ingestGrad)"
                        name="Throughput (MB/s)"
                      />
                      <Area
                        type="monotone"
                        dataKey="cdcLag"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={0}
                        name="CDC Lag (ms)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Topology Summary */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Cluster Orchestration Engine</h3>
                  <p className="text-xs text-muted-foreground">Apache Airflow 2.8 + Debezium CDC + dbt Core</p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Ingestion Worker Nodes</span>
                        <span className="text-emerald-600 dark:text-emerald-400">8 / 8 Active</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-emerald-500 w-[100%]" />
                      </div>
                    </div>

                    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Kafka Partition Health</span>
                        <span className="text-emerald-600 dark:text-emerald-400">32 / 32 In-Sync</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-emerald-500 w-[100%]" />
                      </div>
                    </div>

                    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Memory Utilization (Buffer)</span>
                        <span className="text-blue-600 dark:text-blue-400">64.2% (38.5 GB / 60 GB)</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-blue-500 w-[64%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast("Triggering full cluster diagnostics check...")}
                  className="w-full mt-4 text-xs font-semibold"
                >
                  <RotateCw className="h-3.5 w-3.5 mr-1.5" />
                  Run Diagnostics & Health Check
                </Button>
              </div>
            </div>

            {/* Live Pipeline Flow Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Priority Real-Time CDC Pipelines (Core ERP Domains)
                </h4>
                <span className="text-xs text-muted-foreground">Showing 6 high-throughput streaming DAGs</span>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {pipelines.slice(0, 6).map((pipe) => (
                  <div
                    key={pipe.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-xs hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2.5 w-2.5 rounded-full animate-pulse",
                            pipe.status === "Running" ? "bg-emerald-500" : "bg-amber-500"
                          )}
                        />
                        <span className="text-xs font-bold text-foreground">{pipe.name}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] py-0">
                        {pipe.mode}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/40 p-2 rounded-lg">
                      <div className="truncate max-w-[130px]">
                        <span className="font-semibold text-foreground">Src: </span>
                        {pipe.source}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 mx-1 text-muted-foreground/60" />
                      <div className="truncate max-w-[130px]">
                        <span className="font-semibold text-foreground">Dst: </span>
                        {pipe.target}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-md border border-border/50 p-1.5">
                        <span className="text-[10px] text-muted-foreground">Throughput</span>
                        <div className="font-bold text-foreground">{pipe.throughput}</div>
                      </div>
                      <div className="rounded-md border border-border/50 p-1.5">
                        <span className="text-[10px] text-muted-foreground">Latency</span>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">{pipe.latency}</div>
                      </div>
                      <div className="rounded-md border border-border/50 p-1.5">
                        <span className="text-[10px] text-muted-foreground">Rows 24h</span>
                        <div className="font-bold text-foreground">{pipe.rowsProcessed}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
                      <button
                        onClick={() => openLogs(pipe)}
                        className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Terminal className="h-3 w-3" />
                        View Telemetry Logs
                      </button>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePipelineStatus(pipe.id)}
                          className="h-7 w-7 p-0"
                          title={pipe.status === "Running" ? "Pause Pipeline" : "Resume Pipeline"}
                        >
                          {pipe.status === "Running" ? (
                            <Pause className="h-3.5 w-3.5 text-amber-600" />
                          ) : (
                            <Play className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => triggerManualRun(pipe)}
                          className="h-7 w-7 p-0"
                          title="Trigger Immediate Sync"
                        >
                          <RotateCw className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: All Pipelines Table */}
        {activeTab === "pipelines" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by pipeline name, table, or source..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none"
                >
                  <option value="All Statuses">All Statuses ({pipelines.length})</option>
                  <option value="Running">Running</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Idle">Idle</option>
                  <option value="Paused">Paused</option>
                </select>

                <Button
                  size="sm"
                  onClick={() => setShowNewModal(true)}
                  className="h-9 text-xs font-semibold bg-primary text-primary-foreground shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  New Pipeline
                </Button>
              </div>
            </div>

            {/* Pipelines Data Table */}
            <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <tr>
                      <th className="p-3 pl-4">Pipeline Name & ID</th>
                      <th className="p-3">Source & Type</th>
                      <th className="p-3">Target Warehouse Schema</th>
                      <th className="p-3">Mode & Cadence</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Throughput</th>
                      <th className="p-3">Latency</th>
                      <th className="p-3">Rows (24h)</th>
                      <th className="p-3 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {filteredPipelines.map((pipe) => (
                      <tr key={pipe.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 pl-4">
                          <div className="font-bold text-foreground">{pipe.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{pipe.id}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-foreground">{pipe.source}</div>
                          <div className="text-[10px] text-muted-foreground">{pipe.sourceType}</div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                          {pipe.target}
                        </td>
                        <td className="p-3">
                          <div className="text-foreground">{pipe.mode}</div>
                          <div className="text-[10px] text-muted-foreground">{pipe.cadence}</div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5",
                              pipe.status === "Running"
                                ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                : pipe.status === "Scheduled"
                                ? "border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10"
                                : pipe.status === "Paused"
                                ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                : "border-slate-500/40 text-slate-600 dark:text-slate-400 bg-slate-500/10"
                            )}
                          >
                            {pipe.status}
                          </Badge>
                        </td>
                        <td className="p-3 font-semibold text-foreground">{pipe.throughput}</td>
                        <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{pipe.latency}</td>
                        <td className="p-3 font-semibold text-foreground">{pipe.rowsProcessed}</td>
                        <td className="p-3 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => triggerManualRun(pipe)}
                              className="h-7 w-7 p-0"
                              title="Trigger Run Now"
                            >
                              <Play className="h-3.5 w-3.5 text-emerald-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePipelineStatus(pipe.id)}
                              className="h-7 w-7 p-0"
                              title={pipe.status === "Running" ? "Pause" : "Resume"}
                            >
                              {pipe.status === "Running" ? (
                                <Pause className="h-3.5 w-3.5 text-amber-600" />
                              ) : (
                                <RotateCw className="h-3.5 w-3.5 text-blue-600" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openLogs(pipe)}
                              className="h-7 w-7 p-0"
                              title="View Terminal Logs"
                            >
                              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Connectors & Sources */}
        {activeTab === "connectors" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {CONNECTORS_LIST.map((conn) => (
                <div key={conn.name} className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Server className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{conn.name}</h4>
                        <span className="text-xs text-muted-foreground">{conn.type}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                      {conn.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
                    <div className="rounded-md bg-muted/40 p-2">
                      <span className="text-[10px] text-muted-foreground">Cluster Lag</span>
                      <div className="font-bold text-foreground">{conn.lag}</div>
                    </div>
                    <div className="rounded-md bg-muted/40 p-2">
                      <span className="text-[10px] text-muted-foreground">Active Nodes</span>
                      <div className="font-bold text-foreground">{conn.nodes} instances</div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast(`Connection tested successfully for ${conn.name}. Latency: 12ms.`)}
                      className="text-xs"
                    >
                      <RotateCw className="h-3 w-3 mr-1" />
                      Test Link
                    </Button>
                    <button
                      onClick={() => showToast(`Opening connection manager for ${conn.name}...`)}
                      className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Configure →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: dbt Transformations */}
        {activeTab === "dbt" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">dbt Transformation Engine & Model Lineage</h3>
                  <p className="text-xs text-muted-foreground">Version: dbt-core v1.8.2 · Target Warehouse: Snowflake Enterprise Lakehouse</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => showToast("Triggered dbt run --select tag:daily_marts. 385 models compiling...")}
                  className="text-xs font-semibold bg-primary text-primary-foreground"
                >
                  <Play className="h-3.5 w-3.5 mr-1" />
                  Execute dbt Build
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border p-3 bg-muted/20">
                  <span className="text-xs text-muted-foreground font-semibold">Staging Models (Raw to Clean)</span>
                  <div className="mt-1 text-lg font-bold text-foreground">124 Models</div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% Passing Tests</span>
                </div>
                <div className="rounded-lg border border-border p-3 bg-muted/20">
                  <span className="text-xs text-muted-foreground font-semibold">Intermediate Dim/Fct Models</span>
                  <div className="mt-1 text-lg font-bold text-foreground">182 Models</div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% Passing Tests</span>
                </div>
                <div className="rounded-lg border border-border p-3 bg-muted/20">
                  <span className="text-xs text-muted-foreground font-semibold">Serving Data Marts (BI Tables)</span>
                  <div className="mt-1 text-lg font-bold text-foreground">79 Models</div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">78 Passing, 1 Warning</span>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 bg-muted/10 font-mono text-xs space-y-1.5 text-muted-foreground">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">14:52:18 [INFO] Finished running 124 staging models in 2m 18s.</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">14:54:36 [INFO] Finished running 182 intermediate models in 3m 42s.</div>
                <div className="text-foreground">14:58:18 [INFO] Completed 384 of 385 tests successfully (1 warning on dm_scrap_prediction null check).</div>
                <div className="text-blue-600 dark:text-blue-400 font-bold">14:58:20 [SUCCESS] dbt compilation completed. All analytical marts updated.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Dead-Letter Queue & Quarantine */}
        {activeTab === "quarantine" && (
          <div className="rounded-xl border border-border bg-card p-8 shadow-xs text-center space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Dead-Letter Queue Clean (0 Exceptions)</h3>
            <p className="max-w-md mx-auto text-xs text-muted-foreground">
              All incoming ERP streams from PostgreSQL, Kafka, SAP, and Salesforce have passed schema validation and data type integrity checks with zero dropped records.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Validated DLQ topic emptiness across all 32 partitions.")}
              className="text-xs font-semibold"
            >
              Verify DLQ Partition Empty State
            </Button>
          </div>
        )}

        {/* MODAL 1: Create New Pipeline Modal */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Deploy New ETL / Ingestion Pipeline</h3>
                </div>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePipeline} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Pipeline Name *</label>
                  <Input
                    required
                    placeholder="e.g. Supplier Quality Metric Stream"
                    value={newPipelineName}
                    onChange={(e) => setNewPipelineName(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Source Connector</label>
                    <select
                      value={newPipelineSource}
                      onChange={(e) => setNewPipelineSource(e.target.value)}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus:outline-none"
                    >
                      <option value="PostgreSQL CDC">PostgreSQL CDC (Debezium)</option>
                      <option value="Kafka Stream">Apache Kafka Cluster</option>
                      <option value="SAP Financials">SAP Financials ECC</option>
                      <option value="Salesforce API">Salesforce REST API</option>
                      <option value="Oracle DB Link">Oracle ERP Database</option>
                      <option value="IoT MQTT Broker">IoT Sensor Gateway</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Ingestion Mode</label>
                    <select
                      value={newPipelineMode}
                      onChange={(e) => setNewPipelineMode(e.target.value as any)}
                      className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus:outline-none"
                    >
                      <option value="CDC Streaming">CDC Streaming (Real-time)</option>
                      <option value="Micro-Batch">Micro-Batch (Every 5 mins)</option>
                      <option value="Hourly Batch">Hourly Scheduled Batch</option>
                      <option value="Nightly ELT">Nightly ELT (Full Load)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Target Warehouse Table *</label>
                  <Input
                    required
                    placeholder="e.g. dw_supplier.fct_quality_scores"
                    value={newPipelineTarget}
                    onChange={(e) => setNewPipelineTarget(e.target.value)}
                    className="mt-1 text-xs font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-xs font-semibold bg-primary text-primary-foreground"
                  >
                    Deploy & Start Pipeline
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Pipeline Logs Modal */}
        {showLogsModal && selectedPipelineForLogs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{selectedPipelineForLogs.name}</h3>
                    <p className="text-[11px] text-muted-foreground font-mono">{selectedPipelineForLogs.id} · {selectedPipelineForLogs.target}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLogsModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-200 space-y-1.5 h-64 overflow-y-auto">
                <div className="text-slate-400">[2026-10-07 14:50:02 UTC] [debezium-engine] Initializing connector for {selectedPipelineForLogs.source}...</div>
                <div className="text-emerald-400">[2026-10-07 14:50:04 UTC] [cdc-reader] Replication slot 'erp_sync_slot' acquired. LSN 0/16B2D40.</div>
                <div className="text-slate-300">[2026-10-07 14:50:10 UTC] [batch-sink] Streaming batch #4182 to target: {selectedPipelineForLogs.target}</div>
                <div className="text-slate-300">[2026-10-07 14:50:11 UTC] [batch-sink] Committed 4,200 rows in 420ms. Latency: {selectedPipelineForLogs.latency}.</div>
                <div className="text-emerald-400">[2026-10-07 14:50:18 UTC] [health-check] Heartbeat OK. Memory 142MB. 0 dropped packets.</div>
                <div className="text-slate-400">[2026-10-07 14:50:25 UTC] [cdc-reader] Waiting for next transaction log write...</div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Live WebSocket Telemetry Stream</span>
                <Button
                  size="sm"
                  onClick={() => setShowLogsModal(false)}
                  className="text-xs font-semibold"
                >
                  Close Logs
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

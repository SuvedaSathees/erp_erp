import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Factory,
  CheckCircle2,
  TrendingUp,
  Activity,
  Gauge,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { ErpButton } from "@/components/erp/Button";
import { ManufacturingDevelopmentTabBar } from "@/components/erp/ManufacturingDevelopmentTabBar";
import { pilotProductionService } from "@/services/pilotProductionService";
import type { PilotProductionRecord, PilotWorkflowStatus } from "@/lib/pilot-production/types";
import { calculateOverallPilotReadiness, calculateReadinessScore } from "@/lib/pilot-production/scoring";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manufacturing-development/pilot-production/")({
  head: () => ({
    meta: [{ title: "Pilot Production · Magnertia ERP" }],
  }),
  component: PilotProductionListPage,
});

const STATUS_FILTERS: { key: PilotWorkflowStatus | "All"; label: string }[] = [
  { key: "All", label: "All Records" },
  { key: "Draft", label: "Draft" },
  { key: "In Progress", label: "In Progress" },
  { key: "Under Review", label: "Under Review" },
  { key: "Ready for Mass Production", label: "Ready for Mass Prod" },
  { key: "Minor Improvements Required", label: "Improvements Req" },
  { key: "Archived", label: "Archived" },
];

function getStatusBadge(status: PilotWorkflowStatus) {
  switch (status) {
    case "Ready for Mass Production":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400";
    case "In Progress":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-950/40 dark:text-blue-400";
    case "Under Review":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-950/40 dark:text-purple-400";
    case "Minor Improvements Required":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400";
    case "Superseded — Repeat Scheduled":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400";
    case "Archived":
      return "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-900 dark:text-slate-400";
    case "Draft":
    default:
      return "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-900 dark:text-slate-400";
  }
}

export function PilotProductionListPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PilotWorkflowStatus | "All">("All");
  const [search, setSearch] = useState("");

  const { data: records = [], isLoading } = useQuery<PilotProductionRecord[]>({
    queryKey: ["pilotProductionRecords"],
    queryFn: pilotProductionService.listRecords,
  });

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchFilter = filter === "All" || r.workflowStatus === filter;
      const matchSearch =
        search === "" ||
        r.pilotBatchNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.pilotBatchTitle.toLowerCase().includes(search.toLowerCase()) ||
        r.product.toLowerCase().includes(search.toLowerCase()) ||
        r.productionLine.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [records, filter, search]);

  const kpis = useMemo(() => {
    if (records.length === 0) {
      return { total: 0, avgOee: 0, avgFpy: 0, readyCount: 0 };
    }
    const sumOee = records.reduce((acc, r) => acc + (r.oee || 0), 0);
    const sumFpy = records.reduce((acc, r) => acc + (r.fpy || 0), 0);
    const ready = records.filter((r) => r.workflowStatus === "Ready for Mass Production").length;
    return {
      total: records.length,
      avgOee: Math.round((sumOee / records.length) * 10) / 10,
      avgFpy: Math.round((sumFpy / records.length) * 10) / 10,
      readyCount: ready,
    };
  }, [records]);

  const newButton = (
    <Link to="/manufacturing-development/pilot-production/new">
      <ErpButton className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="h-4 w-4 mr-1" /> New Pilot Batch
      </ErpButton>
    </Link>
  );

  return (
    <AppShell
      title="Pilot Production"
      breadcrumb={breadcrumb ?? "Development > Manufacturing Development > Pilot Production"}
      description="Plan, execute, and validate pilot production runs, line trials, and mass-production readiness."
      tabs={tabs ?? <ManufacturingDevelopmentTabBar />}
      topbarActions={newButton}
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Total Pilot Batches</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground font-mono">{kpis.total}</span>
                <span className="text-xs text-muted-foreground font-medium">Batches</span>
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block">
                Active Industrialization Trials
              </span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Factory className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Average OEE</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                  {kpis.avgOee}%
                </span>
                <span className="text-xs text-muted-foreground font-medium">Target: 80%</span>
              </div>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold block">
                Line Utilization & Speed
              </span>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Gauge className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">First Pass Yield (FPY)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {kpis.avgFpy}%
                </span>
                <span className="text-xs text-muted-foreground font-medium">Target: 95%</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                High Quality Conformance
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Mass Production Released</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground font-mono">{kpis.readyCount}</span>
                <span className="text-xs text-muted-foreground font-medium">Approved</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                Qualified for Full Ramp
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search batch, product, line..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_FILTERS.map((f) => {
              const count =
                f.key === "All"
                  ? records.length
                  : records.filter((r) => r.workflowStatus === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
                    filter === f.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {f.label} <span className="tabular opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content List / Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-muted/60 animate-pulse border border-border" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Factory className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No pilot production batches found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {records.length === 0
                  ? "Start by creating a new pilot production batch to track shop floor trials and mass production readiness."
                  : "No records match the current filter or search criteria."}
              </p>
            </div>
            {records.length === 0 && newButton}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((record) => {
              const readiness = calculateReadinessScore({
                equipmentReadiness: record.equipmentReadiness,
                toolingReadiness: record.toolingReadiness,
                operatorReadiness: record.operatorReadiness,
                materialReadiness: record.materialReadiness,
                safetyReadiness: record.safetyReadiness,
                documentationComplete: record.documentationComplete,
              });
              const overall = calculateOverallPilotReadiness({
                productionScore: record.productionScore,
                qualityScore: record.qualityScore,
                performanceScore: record.performanceScore,
                readinessScore: readiness,
                aiHealthScore: record.aiProductionHealthScore,
              });

              return (
                <div
                  key={record.id}
                  onClick={() =>
                    navigate({
                      to: "/manufacturing-development/pilot-production/$id",
                      params: { id: record.id },
                    })
                  }
                  className="group bg-card border border-border hover:border-primary/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Identifiers & Product info */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-muted text-foreground border border-border">
                        {record.pilotBatchNumber}
                      </span>
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                          getStatusBadge(record.workflowStatus)
                        )}
                      >
                        {record.workflowStatus}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        ID: {record.id}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        {record.pilotBatchTitle}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {record.pilotObjective}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                      <span className="font-medium">
                        Product: <strong className="text-foreground">{record.product}</strong> ({record.productRevision})
                      </span>
                      <span>•</span>
                      <span className="font-medium">
                        Line: <strong className="text-foreground">{record.productionLine}</strong> ({record.productionLocation})
                      </span>
                      <span>•</span>
                      <span className="font-medium">
                        Owner: <strong className="text-foreground">{record.processOwner}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Production Quantities & KPIs */}
                  <div className="flex items-center gap-6 border-y md:border-y-0 md:border-l border-border py-3 md:py-0 md:pl-6">
                    <div className="space-y-1 text-center min-w-[70px]">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                        Volume
                      </span>
                      <div className="font-bold text-foreground text-sm">
                        {record.actualQuantity} / {record.plannedQuantity}
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (record.actualQuantity / record.plannedQuantity) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-center min-w-[60px]">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                        OEE
                      </span>
                      <span className="font-extrabold text-purple-600 dark:text-purple-400 text-sm">
                        {record.oee}%
                      </span>
                    </div>

                    <div className="space-y-1 text-center min-w-[60px]">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                        FPY
                      </span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        {record.fpy}%
                      </span>
                    </div>

                    <div className="space-y-1 text-center min-w-[70px]">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                        Readiness
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                        {overall}/100
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

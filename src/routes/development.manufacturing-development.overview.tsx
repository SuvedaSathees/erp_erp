import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ManufacturingDevelopmentTabBar } from "@/components/erp/ManufacturingDevelopmentTabBar";
import { ManufacturingSubmodulesGrid } from "@/components/erp/manufacturingDevelopment/ManufacturingSubmodulesGrid";
import { WidgetPage } from "@/widgets/components/WidgetPage";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Layers,
  Activity,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Factory,
} from "lucide-react";

export const Route = createFileRoute("/development/manufacturing-development/overview")({
  head: () => ({
    meta: [
      { title: "Manufacturing Development Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated manufacturing intelligence — APQP timing, process engineering, pilot builds, PPAP readiness, and mass production ramp.",
      },
    ],
  }),
  component: ManufacturingDevelopmentOverview,
});

/**
 * Manufacturing Development Overview displays:
 * 1. Industrialization KPI summary
 * 2. 18 Submodule Command Grid (APQP, Process, Control Plan, PFMEA, PPAP, Six Sigma, Assembly Line, Fixture, Tooling, Jig, Factory Layout, Smart Factory, Excellence, Capacity, Work Instruction, SOP, BOM, Routing)
 * 3. Full customizable drag-and-drop widget analytics surface
 */
function ManufacturingDevelopmentOverview() {
  return (
    <AppShell
      title="Manufacturing Development"
      breadcrumb="Development > Manufacturing Development"
      description="Govern end-to-end industrialization: APQP quality gates, tooling, fixtures, shop-floor SOPs, PFMEA, PPAP validation, and Industry 4.0 smart factory readiness."
      tabs={<ManufacturingDevelopmentTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* Executive Industrialization Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Active Submodules</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground font-mono">18</span>
                <span className="text-xs text-muted-foreground font-medium">Submodules</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                100% Operational
              </span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">APQP & PPAP Readiness</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">88.4%</span>
                <span className="text-xs text-muted-foreground font-medium">Index</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium block">
                Phase 3 (Process Validation)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Active Workflows</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">124</span>
                <span className="text-xs text-muted-foreground font-medium">Live Records</span>
              </div>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold block">
                Across 18 Engineering Streams
              </span>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Target Plant OEE</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">85.0%</span>
                <span className="text-xs text-muted-foreground font-medium">Target</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                Current Baseline: 72.65%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 18 Submodules Command Hub */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Manufacturing Engineering Submodules</h2>
              <p className="text-xs text-muted-foreground">
                Direct access and governance over all 18 industrialization, quality, tooling, and shop floor modules.
              </p>
            </div>
          </div>

          <ManufacturingSubmodulesGrid />
        </div>

        {/* Industrialization Performance Analytics Surface */}
        <div className="pt-4 border-t border-border/60">
          <div className="mb-4">
            <h2 className="text-base font-bold text-foreground">Industrialization Analytics & Funnel</h2>
            <p className="text-xs text-muted-foreground">
              Real-time APQP timing funnel, first pass yield trends, top projects, and AI manufacturing intelligence.
            </p>
          </div>

          <WidgetPage pageId="md-overview" skeleton={<OverviewSkeleton />} />
        </div>
      </div>
    </AppShell>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <div className="grid gap-6">
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
      <div className="grid gap-6">
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    </div>
  );
}

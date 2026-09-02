import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ResearchInnovationTabBar } from "@/components/erp/ResearchInnovationTabBar";
import { ResearchInnovationSubmodulesGrid } from "@/components/erp/researchInnovation/ResearchInnovationSubmodulesGrid";
import { WidgetPage } from "@/widgets/components/WidgetPage";
import { RiAiIntelligenceWidget } from "@/widgets/content/ri/panels";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/development/research-innovation/overview")({
  head: () => ({
    meta: [
      { title: "Research & Innovation Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated engineering, industrialization, quality, and digital innovation intelligence across all 27 submodules.",
      },
    ],
  }),
  component: ResearchInnovationOverview,
});

function ResearchInnovationOverview() {
  return (
    <AppShell
      title="Research & Innovation"
      breadcrumb="Development > Research & Innovation"
      description="Consolidated innovation governance — 27 active engineering, industrialization, quality, and digital pipelines."
      tabs={<ResearchInnovationTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-8">
        {/* 1. Customizable Research & Innovation Widget Surface (At Top) */}
        <div>
          <WidgetPage pageId="ri-overview" skeleton={<OverviewSkeleton />} />
        </div>

        {/* 2. 27 Submodules Command Hub (Middle) */}
        <div className="pt-6 border-t border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Research & Innovation Engineering Submodules</h2>
              <p className="text-xs text-muted-foreground">
                Consolidated governance, metrics, and direct execution across all 27 active engineering, industrialization, quality, and digital modules.
              </p>
            </div>
          </div>

          <ResearchInnovationSubmodulesGrid />
        </div>

        {/* 3. R&I Engineering AI Intelligence (Alone at the Very End) */}
        <div className="pt-6 border-t border-border/60">
          <RiAiIntelligenceWidget />
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

export default ResearchInnovationOverview;

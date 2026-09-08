import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { QualityAnalyticsHeader } from "@/components/erp/qualityAnalytics/QualityAnalyticsHeader";
import { QualityAnalyticsFilterCard } from "@/components/erp/qualityAnalytics/QualityAnalyticsFilterCard";
import { ExecutiveKpiGrid } from "@/components/erp/qualityAnalytics/ExecutiveKpiGrid";
import { DefectTrendCard } from "@/components/erp/qualityAnalytics/DefectTrendCard";
import { DefectParetoCard } from "@/components/erp/qualityAnalytics/DefectParetoCard";
import { ProcessPerformanceCard } from "@/components/erp/qualityAnalytics/ProcessPerformanceCard";
import { TopDefectsTableCard } from "@/components/erp/qualityAnalytics/TopDefectsTableCard";
import { SupplierQualityTableCard } from "@/components/erp/qualityAnalytics/SupplierQualityTableCard";
import { AiQualityInsightsCard } from "@/components/erp/qualityAnalytics/AiQualityInsightsCard";
import { KpiDashboardView } from "@/components/erp/qualityAnalytics/KpiDashboardView";
import { SpcAnalysisView } from "@/components/erp/qualityAnalytics/SpcAnalysisView";
import { ReportsExportModal } from "@/components/erp/qualityAnalytics/ReportsExportModal";
import { CreateAnalysisModal } from "@/components/erp/qualityAnalytics/CreateAnalysisModal";
import { DefectsDetailModal } from "@/components/erp/qualityAnalytics/DefectsDetailModal";
import { SupplierPerformanceModal } from "@/components/erp/qualityAnalytics/SupplierPerformanceModal";

import { INITIAL_ANALYTICS_DATASET } from "@/services/qualityAnalyticsService";
import { QualityAnalyticsDataset, QualityAnalyticsFilters } from "@/services/qualityAnalyticsTypes";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/management/quality-management/quality-analytics",
)({
  head: () => ({
    meta: [
      { title: "Quality Analytics · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive KPI dashboards, defect trend analysis, Pareto distributions, and AI quality intelligence.",
      },
    ],
  }),
  component: QualityAnalyticsPage,
});

export function QualityAnalyticsPage() {
  const [dataset, setDataset] = useState<QualityAnalyticsDataset>(INITIAL_ANALYTICS_DATASET);
  const [selectedPlant, setSelectedPlant] = useState<string>("All Plants");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Modals state
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [defectsModalOpen, setDefectsModalOpen] = useState<boolean>(false);
  const [suppliersModalOpen, setSuppliersModalOpen] = useState<boolean>(false);

  const handleFilterChange = (key: keyof QualityAnalyticsFilters, value: string) => {
    setDataset((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const handleApplyFilters = () => {
    toast.success("Quality analytics filters applied successfully", {
      description: `Filtering by Plant: "${dataset.filters.plant}", Process: "${dataset.filters.process}".`,
    });
  };

  const handleResetFilters = () => {
    setDataset((prev) => ({
      ...prev,
      filters: INITIAL_ANALYTICS_DATASET.filters,
    }));
    toast.info("Analytics filters reset to default");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Connecting to MES stations & ingesting live telemetry...");
    setTimeout(() => {
      setIsRefreshing(false);
      // Simulate live jitter
      setDataset((prev) => ({
        ...prev,
        executiveKpis: prev.executiveKpis.map((kpi) => {
          if (kpi.id === "kpi-overall") {
            return { ...kpi, value: `${(94.2 + (Math.random() * 0.4 - 0.2)).toFixed(1)}%` };
          }
          if (kpi.id === "kpi-fpy") {
            return { ...kpi, value: `${(92.3 + (Math.random() * 0.4 - 0.2)).toFixed(1)}%` };
          }
          return kpi;
        }),
      }));
      toast.success("Quality telemetry synchronized with plant floor (Shift A)");
    }, 850);
  };

  const handleAnalysisCreated = (analysis: {
    title: string;
    process: string;
    plant: string;
    sampleSize: number;
    defectRate: number;
    fpy: number;
  }) => {
    setDataset((prev) => ({
      ...prev,
      executiveKpis: prev.executiveKpis.map((kpi) => {
        if (kpi.id === "kpi-fpy") {
          return { ...kpi, value: `${analysis.fpy}%` };
        }
        if (kpi.id === "kpi-defect-rate") {
          return { ...kpi, value: `${analysis.defectRate}%` };
        }
        return kpi;
      }),
    }));
  };

  return (
    <AppShell
      title="Quality Analytics"
      breadcrumb="Management › Quality Management › Quality Analytics"
      description="Executive KPI dashboards, defect trend analysis, Pareto distributions, and AI quality intelligence."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-4 max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Standardized Quality Action Header Card */}
        <QualityAnalyticsHeader
          dateRange={`${dataset.filters.dateFrom}  –  ${dataset.filters.dateTo}`}
          selectedPlant={selectedPlant}
          onPlantChange={(p) => {
            setSelectedPlant(p);
            handleFilterChange("plant", p);
            toast.info(`Switched focus to ${p}`);
          }}
          onRefresh={handleRefresh}
          onExport={() => setExportModalOpen(true)}
          onCreateAnalysis={() => setCreateModalOpen(true)}
          onOpenReports={() => setExportModalOpen(true)}
          isRefreshing={isRefreshing}
        />

        {/* Streamlined Executive Filters Bar */}
        <QualityAnalyticsFilterCard
          filters={dataset.filters}
          onFilterChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* 7 Executive KPI Cards Grid */}
        <ExecutiveKpiGrid kpis={dataset.executiveKpis} />

        {/* Analytics Charts Row: Defect Trend, Pareto, Process Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-w-0">
          <DefectTrendCard data={dataset.defectTrend6Months} />
          <DefectParetoCard data={dataset.defectPareto} />
          <ProcessPerformanceCard data={dataset.processPerformance} />
        </div>

        {/* Operational Diagnostics Row: Top 10 Defects, Supplier Quality, AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-w-0">
          <TopDefectsTableCard
            defects={dataset.defectPareto}
            onViewAll={() => setDefectsModalOpen(true)}
          />
          <SupplierQualityTableCard
            suppliers={dataset.supplierQuality}
            onViewAll={() => setSuppliersModalOpen(true)}
          />
          <AiQualityInsightsCard insights={dataset.aiInsights} />
        </div>

        {/* Statistical Process Control (Cp / Cpk) Full Width */}
        <SpcAnalysisView parameters={dataset.spcParameters} />

        {/* Cost of Poor Quality (COPQ) & Secondary Yield Metrics */}
        <KpiDashboardView copq={dataset.copqComponents} />
      </div>

      {/* Reports Export Modal */}
      <ReportsExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
      />

      {/* Interactive Create Analysis Modal */}
      <CreateAnalysisModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onAnalysisCreated={handleAnalysisCreated}
      />

      {/* Full Defect Pareto Catalog Modal */}
      <DefectsDetailModal
        open={defectsModalOpen}
        onOpenChange={setDefectsModalOpen}
        defects={dataset.defectPareto}
      />

      {/* Full Supplier Performance Register Modal */}
      <SupplierPerformanceModal
        open={suppliersModalOpen}
        onOpenChange={setSuppliersModalOpen}
        suppliers={dataset.supplierQuality}
      />
    </AppShell>
  );
}

export default QualityAnalyticsPage;

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/development/product-development/reports")({
  head: () => ({
    meta: [
      { title: "Product Development Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, engineering velocity, and technical submodule milestones for Product Development.",
      },
    ],
  }),
  component: ProductDevelopmentReportPage,
});

function ProductDevelopmentReportPage() {
  return (
    <AppShell
      title="Product Development Report"
      breadcrumb="Development > Product Development > Report"
      description="Consolidated executive report, engineering velocity, testing pass rates, and hardware/software readiness."
      tabs={<ProductDevelopmentTabBar />}
    >
      <ModuleSummaryReport moduleId="product-development" />
    </AppShell>
  );
}

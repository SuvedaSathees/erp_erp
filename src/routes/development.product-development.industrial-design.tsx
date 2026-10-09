import { createFileRoute } from "@tanstack/react-router";
import { IndustrialDesignFormPage } from "@/pages/development.research-innovation.industrial-design.new";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";

export const Route = createFileRoute(
  "/development/product-development/industrial-design",
)({
  component: () => (
    <IndustrialDesignFormPage
      breadcrumb="Development > Product Development"
      tabs={<ProductDevelopmentTabBar />}
    />
  ),
});

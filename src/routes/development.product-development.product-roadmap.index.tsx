import { createFileRoute } from "@tanstack/react-router";
import { ProductRoadmapFormPage } from "@/routes/development.research-innovation.product-roadmap.new";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";

export const Route = createFileRoute("/development/product-development/product-roadmap/")({
  component: () => (
    <ProductRoadmapFormPage
      breadcrumb="Development > Product Development"
      tabs={<ProductDevelopmentTabBar />}
    />
  ),
});

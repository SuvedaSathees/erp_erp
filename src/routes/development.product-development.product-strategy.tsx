import { createFileRoute } from "@tanstack/react-router";
import { ProductStrategyFormPage } from "@/routes/development.research-innovation.product-strategy.new";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";

export const Route = createFileRoute(
  "/development/product-development/product-strategy",
)({
  component: () => (
    <ProductStrategyFormPage
      breadcrumb="Development > Product Development"
      tabs={<ProductDevelopmentTabBar />}
    />
  ),
});

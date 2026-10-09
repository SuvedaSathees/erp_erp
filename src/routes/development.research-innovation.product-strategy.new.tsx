import { createFileRoute } from "@tanstack/react-router";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";
import { ProductStrategyFormPage } from "@/pages/development.research-innovation.product-strategy.new";

export const Route = createFileRoute(
  "/development/research-innovation/product-strategy/new",
)({
  head: () => ({ meta: [{ title: "Product Strategy Form · Magnertia ERP" }] }),
  component: () => (
    <ProductStrategyFormPage
      breadcrumb="Development > Product Strategy"
      tabs={<ProductDevelopmentTabBar />}
    />
  ),
});

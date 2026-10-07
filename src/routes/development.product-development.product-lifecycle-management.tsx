import { createFileRoute } from "@tanstack/react-router";
import { PlmPage } from "@/pages/development.research-innovation.product-lifecycle-management.new";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";

export const Route = createFileRoute(
  "/development/product-development/product-lifecycle-management",
)({
  component: () => (
    <PlmPage
      breadcrumb="Development > Product Development"
      tabs={<ProductDevelopmentTabBar />}
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { UiUxDevelopmentNewPage } from "@/routes/development.research-innovation.ui-ux-development.new";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";

export const Route = createFileRoute(
  "/development/product-development/ui-ux-development",
)({
  component: () => (
    <UiUxDevelopmentNewPage
      breadcrumb="Development > Product Development"
      tabs={<ProductDevelopmentTabBar />}
    />
  ),
});

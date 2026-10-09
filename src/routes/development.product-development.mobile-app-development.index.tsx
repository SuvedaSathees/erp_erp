import { createFileRoute } from "@tanstack/react-router";
import { MobileDevelopmentFormPage } from "@/pages/development.research-innovation.mobile-app-development.new";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";

export const Route = createFileRoute("/development/product-development/mobile-app-development/")({
  component: () => (
    <MobileDevelopmentFormPage
      breadcrumb="Development > Product Development"
      tabs={<ProductDevelopmentTabBar />}
    />
  ),
});

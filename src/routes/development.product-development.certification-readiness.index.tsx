import { createFileRoute } from "@tanstack/react-router";
import { CertificationReadinessNewPage } from "@/pages/development.research-innovation.certification-readiness.new";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";

export const Route = createFileRoute("/development/product-development/certification-readiness/")({
  component: () => (
    <CertificationReadinessNewPage
      breadcrumb="Development > Product Development"
      tabs={<ProductDevelopmentTabBar />}
    />
  ),
});


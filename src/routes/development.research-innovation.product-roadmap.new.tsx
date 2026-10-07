import { createFileRoute } from "@tanstack/react-router";
import { ProductRoadmapFormPage } from "@/pages/development.research-innovation.product-roadmap.new";

export const Route = createFileRoute(
  "/development/research-innovation/product-roadmap/new",
)({
  head: () => ({ meta: [{ title: "Product Roadmap Form · Magnertia ERP" }] }),
  component: ProductRoadmapFormPage,
});

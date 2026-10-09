import { createFileRoute } from "@tanstack/react-router";
import { ProductArchitectureNewPage } from "@/pages/development.research-innovation.product-architecture.new";

export const Route = createFileRoute(
  "/development/research-innovation/product-architecture/new",
)({
  head: () => ({
    meta: [{ title: "Product Architecture · Magnertia ERP" }],
  }),
  component: ProductArchitectureNewPage,
});

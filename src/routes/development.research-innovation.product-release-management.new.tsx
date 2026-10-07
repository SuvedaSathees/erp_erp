import { createFileRoute } from "@tanstack/react-router";
import { ProductReleasePage } from "@/pages/development.research-innovation.product-release-management.new";

export const Route = createFileRoute(
  "/development/research-innovation/product-release-management/new"
)({
  component: ProductReleasePage,
});

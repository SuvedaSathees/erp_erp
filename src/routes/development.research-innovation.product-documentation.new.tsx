import { createFileRoute } from "@tanstack/react-router";
import { ProductDocumentationPage } from "@/pages/development.research-innovation.product-documentation.new";

export const Route = createFileRoute(
  "/development/research-innovation/product-documentation/new"
)({
  component: ProductDocumentationPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { TestingValidationNewPage } from "@/pages/development.research-innovation.testing-validation.new";

export const Route = createFileRoute(
  "/development/research-innovation/testing-validation/new"
)({
  head: () => ({
    meta: [{ title: "Testing & Validation · Magnertia ERP" }],
  }),
  component: TestingValidationNewPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { PrdFormPage } from "@/pages/development.research-innovation.prd.new";

export const Route = createFileRoute(
  "/development/research-innovation/prd/new",
)({
  head: () => ({ meta: [{ title: "Product Requirements Document (PRD) Form · Magnertia ERP" }] }),
  component: PrdFormPage,
});

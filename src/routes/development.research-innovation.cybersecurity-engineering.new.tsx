import { createFileRoute } from "@tanstack/react-router";
import { CybersecurityEngineeringNewPage } from "@/pages/development.research-innovation.cybersecurity-engineering.new";

export const Route = createFileRoute(
  "/development/research-innovation/cybersecurity-engineering/new",
)({
  head: () => ({
    meta: [{ title: "Cybersecurity Engineering · Magnertia ERP" }],
  }),
  component: CybersecurityEngineeringNewPage,
});

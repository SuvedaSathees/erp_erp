import { createFileRoute } from "@tanstack/react-router";
import { SmartFactoryDevelopmentPage } from "@/pages/development.research-innovation.smart-factory-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/smart-factory-development/new",
)({
  head: () => ({
    meta: [{ title: "Smart Factory Development Form · Magnertia ERP" }],
  }),
  component: SmartFactoryDevelopmentPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { ApiDevelopmentNewPage } from "@/pages/development.research-innovation.api-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/api-development/new"
)({
  head: () => ({ meta: [{ title: "EV Charging APIs · Magnertia ERP" }] }),
  component: ApiDevelopmentNewPage,
});

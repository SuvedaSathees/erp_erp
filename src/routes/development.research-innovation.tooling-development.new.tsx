import { createFileRoute } from "@tanstack/react-router";
import { ToolingDevelopmentNewPage } from "@/pages/development.research-innovation.tooling-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/tooling-development/new",
)({
  head: () => ({
    meta: [{ title: "Tooling Development · Magnertia ERP" }],
  }),
  component: ToolingDevelopmentNewPage,
});

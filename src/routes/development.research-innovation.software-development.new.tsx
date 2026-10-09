import { createFileRoute } from "@tanstack/react-router";
import { SoftwareDevelopmentNewPage } from "@/pages/development.research-innovation.software-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/software-development/new",
)({
  head: () => ({
    meta: [{ title: "Software Development · Magnertia ERP" }],
  }),
  component: SoftwareDevelopmentNewPage,
});

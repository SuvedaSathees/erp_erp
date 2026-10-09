import { createFileRoute } from "@tanstack/react-router";
import { AssemblyLineDevelopmentNewPage } from "@/pages/development.research-innovation.assembly-line-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/assembly-line-development/new",
)({
  head: () => ({
    meta: [{ title: "Assembly Line Development · Magnertia ERP" }],
  }),
  component: AssemblyLineDevelopmentNewPage,
});

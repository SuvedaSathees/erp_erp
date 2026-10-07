import { createFileRoute } from "@tanstack/react-router";
import { SopDevelopmentNewPage } from "@/pages/development.research-innovation.sop-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/sop-development/new",
)({
  component: SopDevelopmentNewPage,
});

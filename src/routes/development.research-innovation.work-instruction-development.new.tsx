import { createFileRoute } from "@tanstack/react-router";
import { WorkInstructionDevelopmentNewPage } from "@/pages/development.research-innovation.work-instruction-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/work-instruction-development/new",
)({
  component: WorkInstructionDevelopmentNewPage,
});

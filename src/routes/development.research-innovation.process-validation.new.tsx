import { createFileRoute } from "@tanstack/react-router";
import { ProcessValidationPage } from "@/pages/development.research-innovation.process-validation.new";

export const Route = createFileRoute(
  "/development/research-innovation/process-validation/new",
)({
  component: ProcessValidationPage,
});

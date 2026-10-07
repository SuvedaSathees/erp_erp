import { createFileRoute } from "@tanstack/react-router";
import { CertificationReadinessNewPage } from "@/pages/development.research-innovation.certification-readiness.new";

export const Route = createFileRoute(
  "/development/research-innovation/certification-readiness/new"
)({
  component: CertificationReadinessNewPage,
});

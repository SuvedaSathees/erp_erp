import { createFileRoute } from "@tanstack/react-router";
import { ValuePropositionDevelopmentPage } from "./development.business-development.value-proposition-development.index";

export { ValuePropositionDevelopmentPage } from "./development.business-development.value-proposition-development.index";

export const Route = createFileRoute(
  "/development/business-development/value-proposition-development"
)({
  component: ValuePropositionDevelopmentPage,
});



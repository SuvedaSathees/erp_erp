import { createFileRoute } from "@tanstack/react-router";
import { BusinessModelDevelopmentPage } from "./development.business-development.business-model-development.index";

export { BusinessModelDevelopmentPage } from "./development.business-development.business-model-development.index";

export const Route = createFileRoute(
  "/development/business-development/business-model-development"
)({
  component: BusinessModelDevelopmentPage,
});



import { createFileRoute } from "@tanstack/react-router";
import { Route as IndexRoute } from "./development.business-development.business-model-development.index";

export const Route = createFileRoute(
  "/development/business-development/business-model-development"
)({
  component: IndexRoute.options.component,
});

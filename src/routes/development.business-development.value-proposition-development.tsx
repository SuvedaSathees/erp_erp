import { createFileRoute } from "@tanstack/react-router";
import { Route as IndexRoute } from "./development.business-development.value-proposition-development.index";

export const Route = createFileRoute(
  "/development/business-development/value-proposition-development"
)({
  component: IndexRoute.options.component,
});

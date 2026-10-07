import { createFileRoute } from "@tanstack/react-router";
import { FixtureDevelopmentNewPage } from "@/pages/development.research-innovation.fixture-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/fixture-development/new",
)({
  head: () => ({
    meta: [{ title: "Fixture Development · Magnertia ERP" }],
  }),
  component: FixtureDevelopmentNewPage,
});

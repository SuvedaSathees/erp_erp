import { createFileRoute } from "@tanstack/react-router";
import { EmbeddedDevelopmentNewPage } from "@/pages/development.research-innovation.embedded-systems-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/embedded-systems-development/new",
)({
  head: () => ({
    meta: [{ title: "Embedded Systems Development · Magnertia ERP" }],
  }),
  component: EmbeddedDevelopmentNewPage,
});

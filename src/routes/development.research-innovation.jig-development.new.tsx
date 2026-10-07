import { createFileRoute } from "@tanstack/react-router";
import { JigDevelopmentNewPage } from "@/pages/development.research-innovation.jig-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/jig-development/new",
)({
  component: JigDevelopmentNewPage,
});

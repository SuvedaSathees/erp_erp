import { createFileRoute } from "@tanstack/react-router";
import { FactoryLayoutDesignNewPage } from "@/pages/development.research-innovation.factory-layout-design.new";

export const Route = createFileRoute(
  "/development/research-innovation/factory-layout-design/new",
)({
  component: FactoryLayoutDesignNewPage,
});

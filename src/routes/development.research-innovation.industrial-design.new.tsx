import { createFileRoute } from "@tanstack/react-router";
import { IndustrialDesignNewPage } from "@/pages/development.research-innovation.industrial-design.new";

export const Route = createFileRoute(
  "/development/research-innovation/industrial-design/new",
)({
  head: () => ({
    meta: [{ title: "Industrial Design · Magnertia ERP" }],
  }),
  component: IndustrialDesignNewPage,
});

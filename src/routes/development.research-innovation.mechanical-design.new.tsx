import { createFileRoute } from "@tanstack/react-router";
import { MechanicalDesignNewPage } from "@/pages/development.research-innovation.mechanical-design.new";

export const Route = createFileRoute(
  "/development/research-innovation/mechanical-design/new",
)({
  head: () => ({
    meta: [{ title: "Mechanical Design · Magnertia ERP" }],
  }),
  component: MechanicalDesignNewPage,
});

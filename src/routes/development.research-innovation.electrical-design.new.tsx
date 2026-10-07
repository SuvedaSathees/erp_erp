import { createFileRoute } from "@tanstack/react-router";
import { ElectricalDesignNewPage } from "@/pages/development.research-innovation.electrical-design.new";

export const Route = createFileRoute(
  "/development/research-innovation/electrical-design/new",
)({
  head: () => ({
    meta: [{ title: "Electrical Design · Magnertia ERP" }],
  }),
  component: ElectricalDesignNewPage,
});

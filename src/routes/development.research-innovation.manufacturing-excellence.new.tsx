import { createFileRoute } from "@tanstack/react-router";
import { ManufacturingExcellencePage } from "@/pages/development.research-innovation.manufacturing-excellence.new";

export const Route = createFileRoute(
  "/development/research-innovation/manufacturing-excellence/new",
)({
  head: () => ({
    meta: [{ title: "Manufacturing Excellence Form · Magnertia ERP" }],
  }),
  component: ManufacturingExcellencePage,
});

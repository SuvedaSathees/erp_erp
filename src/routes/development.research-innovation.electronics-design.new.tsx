import { createFileRoute } from "@tanstack/react-router";
import { ElectronicsDesignNewPage } from "@/pages/development.research-innovation.electronics-design.new";

export const Route = createFileRoute(
  "/development/research-innovation/electronics-design/new",
)({
  head: () => ({
    meta: [{ title: "Electronics Design · Magnertia ERP" }],
  }),
  component: ElectronicsDesignNewPage,
});

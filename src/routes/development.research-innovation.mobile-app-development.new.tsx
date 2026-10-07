import { createFileRoute } from "@tanstack/react-router";
import { MobileDevelopmentNewPage } from "@/pages/development.research-innovation.mobile-app-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/mobile-app-development/new",
)({
  head: () => ({
    meta: [{ title: "Mobile App Development · Magnertia ERP" }],
  }),
  component: MobileDevelopmentNewPage,
});

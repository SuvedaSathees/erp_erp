import { createFileRoute } from "@tanstack/react-router";
import { UiUxDevelopmentNewPage } from "@/pages/development.research-innovation.ui-ux-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/ui-ux-development/new",
)({
  head: () => ({
    meta: [
      { title: "Smart EV Charger UI/UX · Magnertia ERP" },
      { name: "description", content: "Executive UI/UX Engineering, Design Tokens & Prototype Workspace" },
    ],
  }),
  component: UiUxDevelopmentNewPage,
});

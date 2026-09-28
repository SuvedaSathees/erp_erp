import { createFileRoute } from "@tanstack/react-router";
import { BrandingManagementPage } from "./management.marketing-management.brand-management";

export const Route = createFileRoute(
  "/management/marketing-management/branding"
)({
  head: () => ({
    meta: [
      { title: "Branding · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Branding Form (MAICW Classification) for brand architecture, visual identity, tone of voice, guidelines, assets, trademarks, and brand compliance governance.",
      },
    ],
  }),
  component: BrandingManagementPage,
});

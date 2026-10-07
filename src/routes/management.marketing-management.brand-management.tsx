import { createFileRoute } from "@tanstack/react-router";
import { BrandingManagementPage } from "@/pages/management.marketing-management.brand-management";

export const Route = createFileRoute(
  "/management/marketing-management/brand-management"
)({
  head: () => ({
    meta: [
      { title: "Branding · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Brand Management Workspace for visual identity, color systems, digital asset library, brand guidelines, and trademark IP protection.",
      },
    ],
  }),
  component: BrandingManagementPage,
});

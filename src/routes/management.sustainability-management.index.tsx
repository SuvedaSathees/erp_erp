// Magnertia ERP - Sustainability Management Root Index
// Management -> Sustainability Management

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/sustainability-management/")({
  beforeLoad: () => {
    throw redirect({ to: "/management/sustainability-management/overview" });
  },
});

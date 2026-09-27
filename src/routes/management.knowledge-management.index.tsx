// Magnertia ERP - Knowledge Management Root Index
// Management -> Knowledge Management

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/knowledge-management/")({
  beforeLoad: () => {
    throw redirect({ to: "/management/knowledge-management/overview" });
  },
});

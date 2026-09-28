// Magnertia ERP - Communication Management Root Index
// Management -> Communication Management

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/communication-management/")({
  beforeLoad: () => {
    throw redirect({ to: "/management/communication-management/overview" });
  },
});

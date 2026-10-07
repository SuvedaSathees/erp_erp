// Magnertia ERP - Security Management Root Index
// Management -> Security Management

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/security-management/")({
  beforeLoad: () => {
    throw redirect({ to: "/management/security-management/overview" });
  },
});

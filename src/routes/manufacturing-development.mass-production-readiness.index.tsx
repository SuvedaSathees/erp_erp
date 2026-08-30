import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/manufacturing-development/mass-production-readiness/")({
  component: () => <Navigate to="/development/manufacturing-development/overview" replace />,
});

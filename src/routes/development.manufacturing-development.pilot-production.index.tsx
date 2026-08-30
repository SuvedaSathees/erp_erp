import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/development/manufacturing-development/pilot-production/")({
  component: () => <Navigate to="/development/manufacturing-development/overview" replace />,
});

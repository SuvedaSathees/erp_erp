import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/manufacturing-development/automation-development/")({
  component: () => <Navigate to="/development/manufacturing-development/overview" replace />,
});

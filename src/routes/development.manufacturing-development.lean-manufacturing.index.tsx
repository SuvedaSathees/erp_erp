import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/development/manufacturing-development/lean-manufacturing/")({
  component: () => <Navigate to="/development/manufacturing-development/overview" replace />,
});

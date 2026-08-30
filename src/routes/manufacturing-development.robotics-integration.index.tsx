import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/manufacturing-development/robotics-integration/")({
  component: () => <Navigate to="/development/manufacturing-development/overview" replace />,
});

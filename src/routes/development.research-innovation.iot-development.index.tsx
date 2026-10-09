import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/development/research-innovation/iot-development/"
)({
  component: () => <Navigate to="/development/research-innovation/overview" replace />,
});

function IotIndexPage() {
  return <Navigate to="/development/research-innovation/overview" replace />;
}


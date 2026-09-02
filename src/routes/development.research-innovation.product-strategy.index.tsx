import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/development/research-innovation/product-strategy/",
)({
  component: () => <Navigate to="/development/research-innovation/overview" replace />,
});

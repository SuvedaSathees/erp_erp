import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/development/research-innovation/product-lifecycle-management/new"
)({
  component: () => <Navigate to="/development/research-innovation/overview" replace />,
});

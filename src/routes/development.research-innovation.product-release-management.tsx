import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/development/research-innovation/product-release-management",
)({
  component: () => <Outlet />,
});

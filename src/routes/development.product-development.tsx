import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/development/product-development")({
  component: () => <Outlet />,
});

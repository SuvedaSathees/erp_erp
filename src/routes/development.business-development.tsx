import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/development/business-development")({
  component: BusinessDevelopmentLayout,
});

function BusinessDevelopmentLayout() {
  return <Outlet />;
}

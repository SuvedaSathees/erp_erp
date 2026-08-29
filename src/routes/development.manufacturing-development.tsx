import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/development/manufacturing-development")({
  component: () => <Outlet />,
});

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/development/research-innovation")({
  component: () => <Outlet />,
});

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/development/ip-development/patent-management/new")({
  beforeLoad: () => {
    throw redirect({ to: "/development/research-innovation/overview" });
  },
});

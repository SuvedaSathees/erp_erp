import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/home/overview")({
  beforeLoad: () => {
    throw redirect({ to: "/management/administration-management/overview" });
  },
});

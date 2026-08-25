import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/home/branches")({
  beforeLoad: () => {
    throw redirect({ to: "/management/administration-management/branch-management" });
  },
});

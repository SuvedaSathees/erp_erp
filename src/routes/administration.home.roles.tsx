import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/home/roles")({
  beforeLoad: () => {
    throw redirect({ to: "/management/administration-management/user-role-management" });
  },
});

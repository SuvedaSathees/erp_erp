import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/home/users")({
  beforeLoad: () => {
    throw redirect({ to: "/management/administration-management/user-role-management" });
  },
});

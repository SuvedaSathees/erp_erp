import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/home/departments")({
  beforeLoad: () => {
    throw redirect({ to: "/management/administration-management/department-management" });
  },
});

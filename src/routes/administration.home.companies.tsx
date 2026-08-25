import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/home/companies")({
  beforeLoad: () => {
    throw redirect({ to: "/management/administration-management/organization-structure" });
  },
});

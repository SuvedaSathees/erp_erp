import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/crm-management/accounts")({
  beforeLoad: () => {
    throw redirect({ to: "/management/crm-management/account-management" });
  },
});

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/crm-management/customer-support/complaint-management")({
  beforeLoad: () => {
    throw redirect({ to: "/management/crm-management/complaint-management" });
  },
});

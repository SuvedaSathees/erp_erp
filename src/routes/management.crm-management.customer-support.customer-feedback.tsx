import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/crm-management/customer-support/customer-feedback")({
  beforeLoad: () => {
    throw redirect({ to: "/management/crm-management/customer-feedback" });
  },
});

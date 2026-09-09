import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/sales-management/customer-orders-management")({
  beforeLoad: () => {
    throw redirect({ to: "/management/sales-management/sales-orders" });
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { CustomerOrdersManagementPage } from "./management.sales-management.customer-orders-management";

export const Route = createFileRoute("/management/crm-management/customer-orders-management")({
  head: () => ({
    meta: [
      { title: "Customer Orders Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Customer Orders Form - Complete sales order lifecycle management, customer PO validation, line items, fulfilment, delivery, 3-level approvals, invoicing, payment tracking, and order closure.",
      },
    ],
  }),
  component: CustomerOrdersManagementPage,
});

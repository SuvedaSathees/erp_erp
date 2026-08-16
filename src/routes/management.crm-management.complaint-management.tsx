import { createFileRoute } from "@tanstack/react-router";
import { ComplaintManagementPage } from "@/routes/management.crm-management.customer-support.complaint-management";

export const Route = createFileRoute("/management/crm-management/complaint-management")({
  head: () => ({
    meta: [
      { title: "Complaint Management Form · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Complaint Management Form - Structured quality & service complaint process, classification, investigation, 5-Why RCA, CAPA 75% completion donut meter, SLA countdown, CSAT feedback, and complaint summary analytics.",
      },
    ],
  }),
  component: ComplaintManagementPage,
});

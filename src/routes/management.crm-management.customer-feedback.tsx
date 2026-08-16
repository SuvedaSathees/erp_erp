import { createFileRoute } from "@tanstack/react-router";
import { CustomerFeedbackPage } from "@/routes/management.crm-management.customer-support.customer-feedback";

export const Route = createFileRoute("/management/crm-management/customer-feedback")({
  head: () => ({
    meta: [
      { title: "Customer Feedback Form ⭐ · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Customer Feedback Form - Structured post-sale feedback, CSAT (4.2/5), Net Promoter Score (+60 Promoter), Customer Effort Score (CES 4/5 Easy), sentiment analysis (0.86 Positive), and monthly feedback analytics.",
      },
    ],
  }),
  component: CustomerFeedbackPage,
});

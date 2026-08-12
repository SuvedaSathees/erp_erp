import { createFileRoute } from "@tanstack/react-router";
import { BusinessModelDevelopmentPage } from "@/routes/development.business-development.business-model-development";

export const Route = createFileRoute("/development/business-development/")({
  head: () => ({ meta: [{ title: "Business Development · Magnertia ERP" }] }),
  component: BusinessModelDevelopmentPage,
});

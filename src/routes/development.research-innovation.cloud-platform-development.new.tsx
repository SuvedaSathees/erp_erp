import { createFileRoute } from "@tanstack/react-router";
import { CloudPlatformDevelopmentNewPage } from "@/pages/development.research-innovation.cloud-platform-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/cloud-platform-development/new",
)({
  head: () => ({
    meta: [{ title: "Cloud Platform Development Form · Magnertia ERP" }],
  }),
  component: CloudPlatformDevelopmentNewPage,
});

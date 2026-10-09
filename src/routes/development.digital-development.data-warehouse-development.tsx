import { createFileRoute, redirect } from "@tanstack/react-router";
export { DataWarehouseDevelopmentPage } from "@/pages/development.digital-development.data-warehouse-development";

export const Route = createFileRoute(
  "/development/digital-development/data-warehouse-development"
)({
  beforeLoad: () => {
    throw redirect({
      to: "/development/business-development/overview",
      replace: true,
    });
  },
});

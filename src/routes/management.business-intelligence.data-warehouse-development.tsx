import { createFileRoute } from "@tanstack/react-router";
import { DataWarehouseDevelopmentPage } from "@/pages/development.digital-development.data-warehouse-development";

export const Route = createFileRoute(
  "/management/business-intelligence/data-warehouse-development"
)({
  head: () => ({
    meta: [
      { title: "Data Warehouse Development · Magnertia ERP" },
      {
        name: "description",
        content:
          "Manage analytical data warehouse from requirements, sources, dimensional models, ETL/ELT pipelines, data governance, to high-performance BI serving.",
      },
    ],
  }),
  component: DataWarehouseDevelopmentPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { AssemblyLineDevelopmentNewPage } from "@/pages/development.research-innovation.assembly-line-development.new";
import { ManufacturingDevelopmentTabBar } from "@/components/erp/ManufacturingDevelopmentTabBar";

export const Route = createFileRoute("/development/manufacturing-development/assembly-line-development/")({
  component: () => (
    <AssemblyLineDevelopmentNewPage
      breadcrumb="Development > Manufacturing Development"
      tabs={<ManufacturingDevelopmentTabBar />}
    />
  ),
});


// Firmware Development Form - Magnertia ERP
import { createFileRoute } from "@tanstack/react-router";
import { FirmwareDevelopmentNewPage } from "@/components/development/FirmwareDevelopmentView";

export const Route = createFileRoute(
  "/development/research-innovation/firmware-development/new",
)({
  head: () => ({
    meta: [{ title: "Firmware Development · Magnertia ERP" }],
  }),
  component: FirmwareDevelopmentNewPage,
});

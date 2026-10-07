// Security Management Widgets Barrel Export
import type { WidgetDefinition } from "@/widgets/types";
import { SECURITY_KPI_WIDGETS } from "./kpis";
import { SECURITY_PANEL_WIDGETS } from "./panels";

export const SECURITY_WIDGETS: WidgetDefinition[] = [
  ...SECURITY_KPI_WIDGETS,
  ...SECURITY_PANEL_WIDGETS,
];

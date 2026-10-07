// Business Intelligence Management Widgets Barrel Export
import type { WidgetDefinition } from "@/widgets/types";
import { BI_KPI_WIDGETS } from "./kpis";
import { BI_PANEL_WIDGETS } from "./panels";

export const BI_WIDGETS: WidgetDefinition[] = [
  ...BI_KPI_WIDGETS,
  ...BI_PANEL_WIDGETS,
];

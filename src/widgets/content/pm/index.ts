import type { WidgetDefinition } from "../../types";
import { PM_KPI_WIDGETS } from "./kpis";
import { PM_PANEL_WIDGETS } from "./panels";

export const PM_WIDGETS: WidgetDefinition[] = [
  ...PM_KPI_WIDGETS,
  ...PM_PANEL_WIDGETS,
];

import type { WidgetDefinition } from "../../types";
import { MARKETING_KPI_WIDGETS } from "./kpis";
import { MARKETING_PANEL_WIDGETS } from "./panels";

export const MARKETING_WIDGETS: WidgetDefinition[] = [
  ...MARKETING_KPI_WIDGETS,
  ...MARKETING_PANEL_WIDGETS,
];

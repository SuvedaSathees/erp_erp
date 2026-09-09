import type { WidgetDefinition } from "../../types";
import { SALES_KPI_WIDGETS } from "./kpis";
import { SALES_PANEL_WIDGETS } from "./panels";

export const SALES_WIDGETS: WidgetDefinition[] = [
  ...SALES_KPI_WIDGETS,
  ...SALES_PANEL_WIDGETS,
];

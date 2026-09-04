import type { WidgetDefinition } from "../../types";
import { BD_KPI_WIDGETS } from "./kpis";
import { BD_PANEL_WIDGETS } from "./panels";

export const BD_WIDGETS: WidgetDefinition[] = [
  ...BD_KPI_WIDGETS,
  ...BD_PANEL_WIDGETS,
];

export { BD_PAGE_KPIS } from "./bdKpiMap";
export { BD_PANEL_WIDGETS } from "./panels";

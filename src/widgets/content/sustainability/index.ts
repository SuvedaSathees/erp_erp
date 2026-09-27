import type { WidgetDefinition } from "../../types";
import { SUSTAINABILITY_KPI_WIDGETS } from "./kpis";
import { SUSTAINABILITY_PANEL_WIDGETS } from "./panels";

export const SUSTAINABILITY_WIDGETS: WidgetDefinition[] = [
  ...SUSTAINABILITY_KPI_WIDGETS,
  ...SUSTAINABILITY_PANEL_WIDGETS,
];

export { SUSTAINABILITY_KPI_WIDGETS } from "./kpis";
export { SUSTAINABILITY_PANEL_WIDGETS } from "./panels";
export { SUSTAINABILITY_PAGE_KPIS } from "./sustainabilityKpiMap";

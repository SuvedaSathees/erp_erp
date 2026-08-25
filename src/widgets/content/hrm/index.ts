import type { WidgetDefinition } from "../../types";
import { HRM_KPI_WIDGETS } from "./kpis";
import { HRM_PANEL_WIDGETS } from "./panels";

export const HRM_WIDGETS: WidgetDefinition[] = [
  ...HRM_KPI_WIDGETS,
  ...HRM_PANEL_WIDGETS,
];

export { HRM_PAGE_KPIS } from "./hrmKpiMap";

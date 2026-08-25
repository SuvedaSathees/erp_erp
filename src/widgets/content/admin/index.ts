import type { WidgetDefinition } from "../../types";
import { ADMIN_KPI_WIDGETS } from "./kpis";
import { ADMIN_PANEL_WIDGETS } from "./panels";

export const ADMIN_WIDGETS: WidgetDefinition[] = [
  ...ADMIN_KPI_WIDGETS,
  ...ADMIN_PANEL_WIDGETS,
];

export { ADMIN_PAGE_KPIS } from "./adminKpiMap";

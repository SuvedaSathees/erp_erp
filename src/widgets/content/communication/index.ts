import type { WidgetDefinition } from "../../types";
import { COMMUNICATION_KPI_WIDGETS } from "./kpis";
import { COMMUNICATION_PANEL_WIDGETS } from "./panels";

export const COMMUNICATION_WIDGETS: WidgetDefinition[] = [
  ...COMMUNICATION_KPI_WIDGETS,
  ...COMMUNICATION_PANEL_WIDGETS,
];

export { COMMUNICATION_PAGE_KPIS } from "./communicationKpiMap";
export { COMMUNICATION_KPI_WIDGETS } from "./kpis";
export { COMMUNICATION_PANEL_WIDGETS } from "./panels";

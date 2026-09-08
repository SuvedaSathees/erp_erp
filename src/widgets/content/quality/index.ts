import type { WidgetDefinition } from "../../types";
import { QUALITY_KPI_WIDGETS } from "./kpis";
import { QUALITY_PANEL_WIDGETS } from "./panels";

export const QUALITY_WIDGETS: WidgetDefinition[] = [
  ...QUALITY_KPI_WIDGETS,
  ...QUALITY_PANEL_WIDGETS,
];

export { QUALITY_PAGE_KPIS } from "./qualityKpiMap";

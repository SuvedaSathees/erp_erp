import type { WidgetDefinition } from "../../types";
import { BD_KPI_WIDGETS } from "./kpis";

export const BD_WIDGETS: WidgetDefinition[] = [
  ...BD_KPI_WIDGETS,
];

export { BD_PAGE_KPIS } from "./bdKpiMap";

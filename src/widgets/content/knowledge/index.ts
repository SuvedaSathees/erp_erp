import type { WidgetDefinition } from "../../types";
import { KNOWLEDGE_KPI_WIDGETS } from "./kpis";
import { KNOWLEDGE_PANEL_WIDGETS } from "./panels";

export const KNOWLEDGE_WIDGETS: WidgetDefinition[] = [
  ...KNOWLEDGE_KPI_WIDGETS,
  ...KNOWLEDGE_PANEL_WIDGETS,
];

export { KNOWLEDGE_PAGE_KPIS } from "./knowledgeKpiMap";
export { KNOWLEDGE_KPI_WIDGETS } from "./kpis";
export { KNOWLEDGE_PANEL_WIDGETS } from "./panels";

import type { WidgetDefinition } from "../../types";
import { RISK_KPI_WIDGETS } from "./kpis";
import { RISK_PANEL_WIDGETS } from "./panels";

export const RISK_WIDGETS: WidgetDefinition[] = [
  ...RISK_KPI_WIDGETS,
  ...RISK_PANEL_WIDGETS,
];

import type { WidgetDefinition } from "../../types";
import { COMPLIANCE_KPI_WIDGETS } from "./kpis";
import { COMPLIANCE_PANEL_WIDGETS } from "./panels";

export const COMPLIANCE_WIDGETS: WidgetDefinition[] = [
  ...COMPLIANCE_KPI_WIDGETS,
  ...COMPLIANCE_PANEL_WIDGETS,
];

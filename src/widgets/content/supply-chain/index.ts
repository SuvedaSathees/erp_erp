import type { WidgetDefinition } from "../../types";
import { SUPPLY_CHAIN_KPI_WIDGETS } from "./kpis";
import { SUPPLY_CHAIN_PANEL_WIDGETS } from "./panels";

export const SUPPLY_CHAIN_WIDGETS: WidgetDefinition[] = [
  ...SUPPLY_CHAIN_KPI_WIDGETS,
  ...SUPPLY_CHAIN_PANEL_WIDGETS,
];

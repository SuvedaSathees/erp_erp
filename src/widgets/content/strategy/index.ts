// Strategy Management Widgets Barrel Export
import type { WidgetDefinition } from "@/widgets/types";
import { STRATEGY_KPI_WIDGETS } from "./kpis";
import { STRATEGY_PANEL_WIDGETS } from "./panels";

export const STRATEGY_WIDGETS: WidgetDefinition[] = [
  ...STRATEGY_KPI_WIDGETS,
  ...STRATEGY_PANEL_WIDGETS,
];

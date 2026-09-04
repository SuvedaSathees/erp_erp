import type { WidgetDefinition } from "../../types";
import { ASSET_KPI_WIDGETS } from "./kpis";
import { ASSET_PANEL_WIDGETS } from "./panels";

export const ASSET_WIDGETS: WidgetDefinition[] = [
  ...ASSET_KPI_WIDGETS,
  ...ASSET_PANEL_WIDGETS,
];

import type { WidgetPageId } from "../../types";

export const QUALITY_PAGE_KPIS: Partial<Record<WidgetPageId, Record<string, string>>> = {
  "quality-overview": {
    "First Pass Yield (FPY)": "kpi.quality.fpy",
    "Overall Defect PPM": "kpi.quality.defect-ppm",
    "Supplier IQC Clearance": "kpi.quality.iqc-clearance",
    "Active Open NCRs": "kpi.quality.open-ncrs",
    "CAPA Resolution Rate": "kpi.quality.capa-rate",
    "Audit Compliance Index": "kpi.quality.audit-index",
  },
};

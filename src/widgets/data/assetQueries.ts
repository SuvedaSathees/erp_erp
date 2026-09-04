import { queryOptions } from "@tanstack/react-query";

export interface AssetOverviewData {
  kpis: {
    totalAssets: number;
    grossValue: string;
    activeAssets: number;
    operationalRate: string;
    netBookValue: string;
    carryingValueRate: string;
    monthlyDepreciation: string;
    ytdDepreciation: string;
    equipmentCount: number;
    equipmentOee: string;
    toolsCount: number;
    toolsInCribRate: string;
    gaugesCount: number;
    calibrationCompliance: string;
    openMaintenanceWos: number;
    mtbfHours: number;
    pmPlansCount: number;
    pmComplianceRate: string;
    aiModelsCount: number;
    trackedAssetsCount: number;
  };
  portfolioTrend: Array<{
    month: string;
    grossValue: number;
    netBookValue: number;
    accumDep: number;
  }>;
  submodules: Array<{
    id: string;
    name: string;
    route: string;
    badge: string;
    badgeColor: string;
    metric: string;
    metricLabel: string;
    status: string;
    health: string;
  }>;
  depreciationSchedule: Array<{
    month: string;
    straightLine: number;
    wdv: number;
    total: number;
  }>;
  alerts: Array<{
    id: string;
    title: string;
    subtitle: string;
    severity: "critical" | "warning" | "info" | "success";
    route: string;
    time: string;
  }>;
  aiInsights: Array<{
    id: string;
    title: string;
    detail: string;
    impact: string;
    type: "positive" | "warning" | "opportunity";
    route: string;
  }>;
}

export const mockAssetOverviewData: AssetOverviewData = {
  kpis: {
    totalAssets: 428,
    grossValue: "₹ 18.60 Cr",
    activeAssets: 401,
    operationalRate: "93.69%",
    netBookValue: "₹ 13.20 Cr",
    carryingValueRate: "70.97%",
    monthlyDepreciation: "₹ 23.45 L",
    ytdDepreciation: "₹ 1.98 Cr",
    equipmentCount: 86,
    equipmentOee: "88.4%",
    toolsCount: 1450,
    toolsInCribRate: "94.2%",
    gaugesCount: 38,
    calibrationCompliance: "100%",
    openMaintenanceWos: 12,
    mtbfHours: 620,
    pmPlansCount: 48,
    pmComplianceRate: "98.0%",
    aiModelsCount: 64,
    trackedAssetsCount: 428,
  },
  portfolioTrend: [
    { month: "Apr 26", grossValue: 16.8, netBookValue: 13.6, accumDep: 3.2 },
    { month: "May 26", grossValue: 17.2, netBookValue: 13.6, accumDep: 3.6 },
    { month: "Jun 26", grossValue: 17.6, netBookValue: 13.6, accumDep: 4.0 },
    { month: "Jul 26", grossValue: 18.0, netBookValue: 13.6, accumDep: 4.4 },
    { month: "Aug 26", grossValue: 18.3, netBookValue: 13.3, accumDep: 5.0 },
    { month: "Sep 26", grossValue: 18.6, netBookValue: 13.2, accumDep: 5.4 },
  ],
  submodules: [
    {
      id: "fixed-assets",
      name: "Fixed Assets Master",
      route: "/management/asset-management/fixed-assets",
      badge: "Master Register",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      metric: "428 Assets",
      metricLabel: "₹ 18.60 Cr Gross",
      status: "Synchronized",
      health: "98%",
    },
    {
      id: "equipment",
      name: "Equipment Fleet",
      route: "/management/asset-management/equipment",
      badge: "Heavy Machinery",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      metric: "86 Units",
      metricLabel: "88.4% Fleet OEE",
      status: "In Operation",
      health: "92%",
    },
    {
      id: "tool-management",
      name: "Tool Management",
      route: "/management/asset-management/tool-management",
      badge: "Tool Cribs",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      metric: "1,450 Tools",
      metricLabel: "94.2% In-Crib",
      status: "Active Tracking",
      health: "96%",
    },
    {
      id: "calibration",
      name: "Calibration & Metrology",
      route: "/management/asset-management/calibration",
      badge: "ISO 17025",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      metric: "38 Gauges",
      metricLabel: "100% Audit Compliance",
      status: "Certified",
      health: "100%",
    },
    {
      id: "maintenance",
      name: "Plant Maintenance",
      route: "/management/asset-management/maintenance",
      badge: "Break-Fix WOs",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      metric: "12 Open WOs",
      metricLabel: "620h MTBF",
      status: "In Progress",
      health: "89%",
    },
    {
      id: "preventive-maintenance",
      name: "Preventive Maintenance",
      route: "/management/asset-management/preventive-maintenance",
      badge: "PM Checklists",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      metric: "48 Plans",
      metricLabel: "98% Compliance",
      status: "On Schedule",
      health: "98%",
    },
    {
      id: "predictive-maintenance",
      name: "Predictive Maintenance",
      route: "/management/asset-management/predictive-maintenance",
      badge: "AI Telemetry",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      metric: "64 Sensors",
      metricLabel: "92.4% RUL Accuracy",
      status: "Streaming",
      health: "95%",
    },
    {
      id: "asset-lifecycle",
      name: "Asset Lifecycle",
      route: "/management/asset-management/asset-lifecycle",
      badge: "End-to-End",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      metric: "12 Stages",
      metricLabel: "85/100 Condition",
      status: "Active Life",
      health: "85%",
    },
    {
      id: "asset-depreciation",
      name: "Asset Depreciation",
      route: "/management/asset-management/asset-depreciation",
      badge: "GL Schedules",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      metric: "396 Assets",
      metricLabel: "₹ 23.45 L / mo",
      status: "Current",
      health: "100%",
    },
    {
      id: "asset-tracking",
      name: "Asset Tracking",
      route: "/management/asset-management/asset-tracking",
      badge: "GIS & RFID",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      metric: "428 Tagged",
      metricLabel: "96% Site Match",
      status: "Active GPS",
      health: "97%",
    },
  ],
  depreciationSchedule: [
    { month: "Apr 26", straightLine: 18.2, wdv: 4.8, total: 23.0 },
    { month: "May 26", straightLine: 18.3, wdv: 4.9, total: 23.2 },
    { month: "Jun 26", straightLine: 18.4, wdv: 4.9, total: 23.3 },
    { month: "Jul 26", straightLine: 18.5, wdv: 5.0, total: 23.5 },
    { month: "Aug 26", straightLine: 18.5, wdv: 4.9, total: 23.4 },
    { month: "Sep 26", straightLine: 18.5, wdv: 4.95, total: 23.45 },
  ],
  alerts: [
    {
      id: "alt-1",
      title: "Calibration Due in 30 Days",
      subtitle: "Digital Micrometer (EQ-MIC-00041) & Torque Gauge require ISO recalibration.",
      severity: "warning",
      route: "/management/asset-management/calibration",
      time: "2 hours ago",
    },
    {
      id: "alt-2",
      title: "Predictive Bearing Degradation",
      subtitle: "Air Compressor 75kW (EQ-CMP-00073) RUL forecast down to 94 hours (68% risk).",
      severity: "critical",
      route: "/management/asset-management/predictive-maintenance",
      time: "Today, 08:30",
    },
    {
      id: "alt-3",
      title: "Physical Verification Pending",
      subtitle: "18 assets in Logistics Bay awaiting Q3 RFID / Barcode audit.",
      severity: "info",
      route: "/management/asset-management/asset-tracking",
      time: "Yesterday",
    },
    {
      id: "alt-4",
      title: "Month-End Depreciation Post",
      subtitle: "Depreciation run for September 2026 scheduled for automatic general ledger post.",
      severity: "success",
      route: "/management/asset-management/asset-depreciation",
      time: "Scheduled 30 Sep",
    },
  ],
  aiInsights: [
    {
      id: "ai-1",
      title: "Capital Expenditure Advisory: 7 Assets Nearing End-of-Life",
      detail:
        "Lifecycle analysis indicates 7 primary manufacturing machines have reached 88%+ useful life depletion with rising maintenance frequency. Planning FY27 CapEx replacement now will avoid ₹ 34 L in projected downtime.",
      impact: "High ROI / CapEx Planning",
      type: "warning",
      route: "/management/asset-management/asset-lifecycle",
    },
    {
      id: "ai-2",
      title: "Predictive Maintenance Optimization: 28% Downtime Reduction",
      detail:
        "Telemetric vibration sensors on CNC machining center and EV chargers detected early harmonic anomalies 2 weeks before mechanical failure, allowing scheduled off-hours repair.",
      impact: "₹ 18.4 L Saved in Prevented Stoppages",
      type: "positive",
      route: "/management/asset-management/predictive-maintenance",
    },
    {
      id: "ai-3",
      title: "Depreciation Variance & Tax Shield Opportunity",
      detail:
        "Accelerated depreciation under WDV on 38 recently added equipment units generates ₹ 28.5 L in tax shield savings for the current fiscal quarter.",
      impact: "Tax Shield +₹ 28.5 L",
      type: "opportunity",
      route: "/management/asset-management/asset-depreciation",
    },
  ],
};

export const assetOverviewOptions = queryOptions({
  queryKey: ["asset-overview"],
  queryFn: async (): Promise<AssetOverviewData> => {
    return mockAssetOverviewData;
  },
  staleTime: 60_000,
});

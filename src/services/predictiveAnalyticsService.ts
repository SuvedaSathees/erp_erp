// Magnertia ERP - Predictive Analytics Domain Service
// Machine Learning Models, Forecast Horizons, Feature Importance, Drift Monitoring & Telemetry

export interface PredictiveKpi {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
}

export interface PredictiveUseCase {
  id: number;
  name: string;
  domain: string;
  modelType: string;
  status: "Active" | "Deployed" | "Testing" | "Development";
  accuracy: string;
}

export interface RecentPrediction {
  id: string;
  useCase: string;
  period: string;
  predictedValue: string;
  confidence: string;
  status: "Generated" | "Validated" | "Flagged";
}

export interface ModelAlert {
  id: number;
  alert: string;
  severity: "High" | "Medium" | "Low";
  date: string;
  status: "Open" | "In Progress" | "Closed";
}

export interface FeatureImportanceItem {
  feature: string;
  weight: number;
  color: string;
}

export const PREDICTIVE_KPIS: PredictiveKpi[] = [
  {
    id: "pred-use",
    label: "Active Use Cases",
    value: "10",
    change: "↑ 25%",
    isPositive: true,
    subtext: "vs. last quarter",
    iconName: "Target",
  },
  {
    id: "pred-dep",
    label: "Models Deployed",
    value: "6",
    change: "↑ 50%",
    isPositive: true,
    subtext: "vs. last quarter",
    iconName: "Cpu",
  },
  {
    id: "pred-acc",
    label: "Avg Model Accuracy",
    value: "92.3%",
    change: "↑ 4.8%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "CheckCircle",
  },
  {
    id: "pred-gen",
    label: "Predictions Generated",
    value: "1.8M",
    change: "↑ 32%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "Database",
  },
  {
    id: "pred-alert",
    label: "Active Alerts",
    value: "8",
    change: "↓ 20%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "Bell",
  },
  {
    id: "pred-drift",
    label: "Model Drift Detected",
    value: "2",
    change: "↓ 50%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "Activity",
  },
  {
    id: "pred-val",
    label: "Estimated Value",
    value: "₹3.6 Cr",
    change: "↑ 28%",
    isPositive: true,
    subtext: "vs. last quarter",
    iconName: "TrendingUp",
  },
];

export const PREDICTIVE_FEATURE_IMPORTANCE: FeatureImportanceItem[] = [
  { feature: "Time of Day", weight: 28, color: "#3B82F6" },
  { feature: "Day of Week", weight: 18, color: "#06B6D4" },
  { feature: "Location Type", weight: 14, color: "#10B981" },
  { feature: "Weather", weight: 12, color: "#F59E0B" },
  { feature: "EV Fleet Activity", weight: 10, color: "#EC4899" },
  { feature: "Holiday Indicator", weight: 8, color: "#8B5CF6" },
  { feature: "Historical Demand", weight: 7, color: "#6366F1" },
  { feature: "Fuel Price", weight: 3, color: "#14B8A6" },
];

export const PREDICTIVE_USE_CASES: PredictiveUseCase[] = [
  { id: 1, name: "EV Charging Demand Forecast", domain: "Operations", modelType: "Time-Series", status: "Active", accuracy: "94.2%" },
  { id: 2, name: "Customer Churn Prediction", domain: "Customer", modelType: "Classification", status: "Deployed", accuracy: "91.5%" },
  { id: 3, name: "Sales Forecasting", domain: "Sales", modelType: "Time-Series", status: "Active", accuracy: "93.1%" },
  { id: 4, name: "Inventory Demand Forecast", domain: "Supply Chain", modelType: "Regression", status: "Testing", accuracy: "89.4%" },
  { id: 5, name: "Equipment Failure Prediction", domain: "Manufacturing", modelType: "Classification", status: "Active", accuracy: "95.6%" },
  { id: 6, name: "Revenue Forecasting", domain: "Finance", modelType: "Time-Series", status: "Development", accuracy: "88.0%" },
];

export const PREDICTIVE_RECENT_PREDICTIONS: RecentPrediction[] = [
  { id: "PRD-0001", useCase: "EV Charging Demand", period: "01 Oct 2026", predictedValue: "7,420 kWh", confidence: "95%", status: "Generated" },
  { id: "PRD-0002", useCase: "EV Charging Demand", period: "02 Oct 2026", predictedValue: "6,980 kWh", confidence: "94%", status: "Generated" },
  { id: "PRD-0003", useCase: "Sales Forecast", period: "01 Oct 2026", predictedValue: "₹48.2 L", confidence: "92%", status: "Generated" },
  { id: "PRD-0004", useCase: "Inventory Demand", period: "01 Oct 2026", predictedValue: "1,250 units", confidence: "90%", status: "Generated" },
  { id: "PRD-0005", useCase: "Churn Probability", period: "01 Oct 2026", predictedValue: "6.8%", confidence: "88%", status: "Generated" },
];

export const PREDICTIVE_ALERTS: ModelAlert[] = [
  { id: 1, alert: "Prediction drift detected in EV Demand Model", severity: "High", date: "28 Sep 2026", status: "Open" },
  { id: 2, alert: "Data quality issue (missing temperature telemetry)", severity: "Medium", date: "27 Sep 2026", status: "Open" },
  { id: 3, alert: "Model accuracy drop below 90% threshold in Sales Model", severity: "High", date: "25 Sep 2026", status: "In Progress" },
  { id: 4, alert: "Demand spike alert triggered for Coimbatore NH44 Hub", severity: "Medium", date: "24 Sep 2026", status: "Closed" },
  { id: 5, alert: "Feature drift detected in Weather forecast input", severity: "Low", date: "22 Sep 2026", status: "Closed" },
];

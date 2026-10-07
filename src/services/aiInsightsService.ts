// Magnertia ERP - AI Insights Domain Service
// Enterprise Natural Language Analytics, Anomaly Intelligence, Model Performance & Workflow

export interface AiInsightKpi {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
}

export interface AiTopInsight {
  id: number;
  title: string;
  domain: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  confidence: number;
  status: "New" | "Reviewed" | "Action" | "Resolved";
  recommendation: string;
}

export interface AiAnomalyItem {
  id: number;
  metric: string;
  currentValue: string;
  expectedValue: string;
  deviation: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  rootCause: string;
}

export interface AiModelMonitoringItem {
  id: number;
  model: string;
  type: string;
  accuracy: string;
  drift: "Low" | "Medium" | "High";
  status: "Active" | "Retrain" | "Review";
}

export interface AiInsightRequest {
  id: number;
  question: string;
  domain: string;
  status: "Completed" | "In Progress" | "Pending";
}

export const AI_INSIGHT_KPIS: AiInsightKpi[] = [
  {
    id: "ai-total",
    label: "Total Insights",
    value: "568",
    change: "↑ 28%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "Lightbulb",
  },
  {
    id: "ai-impact",
    label: "High Impact",
    value: "42",
    change: "↑ 35%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "Target",
  },
  {
    id: "ai-alerts",
    label: "Critical Alerts",
    value: "6",
    change: "↓ 40%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "AlertTriangle",
  },
  {
    id: "ai-conf",
    label: "Avg. Confidence",
    value: "91.4%",
    change: "↑ 6%",
    isPositive: true,
    subtext: "across 12 models",
    iconName: "ShieldCheck",
  },
  {
    id: "ai-recs",
    label: "Recommendations",
    value: "124",
    change: "↑ 22%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "Sparkles",
  },
  {
    id: "ai-act-cr",
    label: "Actions Created",
    value: "86",
    change: "↑ 18%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "Sliders",
  },
  {
    id: "ai-act-comp",
    label: "Actions Completed",
    value: "64",
    change: "↑ 33%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "CheckCircle",
  },
  {
    id: "ai-value",
    label: "Business Impact",
    value: "₹2.84 Cr",
    change: "↑ 46%",
    isPositive: true,
    subtext: "realized ROI",
    iconName: "TrendingUp",
  },
];

export const AI_TOP_INSIGHTS: AiTopInsight[] = [
  {
    id: 1,
    title: "EV Charging demand to increase 28%",
    domain: "Operations",
    impact: "High",
    confidence: 95,
    status: "New",
    recommendation: "Pre-allocate dynamic power routing to highway charging corridors NH-44 and NH-48.",
  },
  {
    id: 2,
    title: "Material cost expected to rise 12%",
    domain: "Supply Chain",
    impact: "High",
    confidence: 92,
    status: "Reviewed",
    recommendation: "Lock in copper and power electronics substrate supplier contracts for Q4.",
  },
  {
    id: 3,
    title: "Churn risk identified for 5 key clients",
    domain: "Customer",
    impact: "High",
    confidence: 89,
    status: "Action",
    recommendation: "Initiate senior account manager outreach with SLA incentive credits.",
  },
  {
    id: 4,
    title: "Production OEE can improve by 8%",
    domain: "Manufacturing",
    impact: "Medium",
    confidence: 86,
    status: "New",
    recommendation: "Synchronize preventive maintenance windows on Assembly Line 2 robotic arms.",
  },
  {
    id: 5,
    title: "Cash flow shortfall risk in Q4",
    domain: "Finance",
    impact: "High",
    confidence: 91,
    status: "Action",
    recommendation: "Accelerate overdue receivables collections across Tier-1 fleet operators.",
  },
];

export const AI_ANOMALIES: AiAnomalyItem[] = [
  {
    id: 1,
    metric: "Energy Consumption",
    currentValue: "2,840 kWh",
    expectedValue: "1,920 kWh",
    deviation: "+48%",
    severity: "Critical",
    rootCause: "Unbalanced phase power draw on Substation Bay 3 during fast charge peak.",
  },
  {
    id: 2,
    metric: "Charging Session Drop",
    currentValue: "42",
    expectedValue: "110",
    deviation: "-62%",
    severity: "High",
    rootCause: "Network payment gateway timeout on CCS2 dispenser firmware v3.1.",
  },
  {
    id: 3,
    metric: "Battery Temperature",
    currentValue: "48°C",
    expectedValue: "35°C",
    deviation: "+37%",
    severity: "High",
    rootCause: "Ambient heat wave coupled with coolant valve partial blockage.",
  },
  {
    id: 4,
    metric: "Supply Delay (Days)",
    currentValue: "7",
    expectedValue: "2",
    deviation: "+250%",
    severity: "Critical",
    rootCause: "Port customs clearance backlog on imported silicon carbide semiconductors.",
  },
  {
    id: 5,
    metric: "Customer Complaints",
    currentValue: "14",
    expectedValue: "5",
    deviation: "+180%",
    severity: "Medium",
    rootCause: "Mobile app RFID card tap syncing delay following iOS app update.",
  },
];

export const AI_MODELS_MONITORING: AiModelMonitoringItem[] = [
  {
    id: 1,
    model: "EV Demand Forecast",
    type: "Time-Series",
    accuracy: "92.3%",
    drift: "Low",
    status: "Active",
  },
  {
    id: 2,
    model: "Churn Prediction",
    type: "Classification",
    accuracy: "89.1%",
    drift: "Medium",
    status: "Active",
  },
  {
    id: 3,
    model: "Equipment Failure",
    type: "Classification",
    accuracy: "91.6%",
    drift: "Low",
    status: "Active",
  },
  {
    id: 4,
    model: "Sales Forecast",
    type: "Time-Series",
    accuracy: "87.4%",
    drift: "Medium",
    status: "Retrain",
  },
  {
    id: 5,
    model: "Inventory Forecast",
    type: "Regression",
    accuracy: "86.8%",
    drift: "High",
    status: "Review",
  },
];

export const AI_RECENT_REQUESTS: AiInsightRequest[] = [
  {
    id: 1,
    question: "Why did revenue decline this month?",
    domain: "Finance",
    status: "Completed",
  },
  {
    id: 2,
    question: "Predict EV charging demand for Oct",
    domain: "Operations",
    status: "In Progress",
  },
  {
    id: 3,
    question: "Identify churn risk customers",
    domain: "Customer",
    status: "In Progress",
  },
  {
    id: 4,
    question: "Forecast material requirement",
    domain: "Supply Chain",
    status: "Pending",
  },
  {
    id: 5,
    question: "Analyze quality defect trend",
    domain: "Quality",
    status: "Completed",
  },
];

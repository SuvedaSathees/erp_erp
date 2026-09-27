/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryOptions } from "@tanstack/react-query";

export interface SupplyChainOverviewData {
  kpis: {
    totalForecastDemand: { value: string; num: number; change: string; isPositive: boolean; subtext: string };
    forecastAccuracy: { value: string; num: number; change: string; isPositive: boolean; subtext: string };
    totalForecastValue: { value: string; num: number; change: string; isPositive: boolean; subtext: string };
    demandSignalsCount: { value: string; num: number; change: string; isPositive: boolean; subtext: string };
    pendingAdjustments: { value: string; num: number; change: string; isPositive: boolean; subtext: string };
    openSalesOrders: { value: string; num: number; change: string; isPositive: boolean; subtext: string };
    projectedStockouts: { value: string; num: number; change: string; isPositive: boolean; subtext: string };
    serviceLevel: { value: string; num: number; change: string; isPositive: boolean; subtext: string };
    inventoryImpact: { value: string; num: number; change: string; isPositive: boolean; subtext: string };
  };
  monthlyDemandTrend: Array<{
    month: string;
    actualDemand: number;
    finalForecast: number;
    baseForecast: number;
  }>;
  accuracyDistribution: Array<{
    name: string;
    value: number;
    count: number;
    color: string;
    rating: string;
  }>;
  topDemandDrivers: Array<{
    name: string;
    impact: "High" | "Medium" | "Low";
    source: string;
    weight: number;
  }>;
  recentAdjustments: Array<{
    id: string;
    product: string;
    period: string;
    originalForecast: number;
    adjustment: number;
    revisedForecast: number;
    reason: string;
    status: "Pending" | "Approved" | "Rejected";
  }>;
  upcomingActions: Array<{
    id: string;
    title: string;
    subtitle: string;
    badgeCount?: number;
    dueDate: string;
    priority: "high" | "medium" | "low";
  }>;
  sopConsensusPipeline: Array<{
    stage: string;
    department: string;
    status: "Completed" | "In Review" | "Pending" | "Approved";
    variance: string;
    reviewer: string;
  }>;
}

export const mockSupplyChainOverviewData: SupplyChainOverviewData = {
  kpis: {
    totalForecastDemand: {
      value: "1,28,700",
      num: 128700,
      change: "+8.6%",
      isPositive: true,
      subtext: "Units (FY 2026-27)",
    },
    forecastAccuracy: {
      value: "92.4%",
      num: 92.4,
      change: "+1.8%",
      isPositive: true,
      subtext: "MAPE: 7.6%",
    },
    totalForecastValue: {
      value: "₹ 246.85 Cr",
      num: 246.85,
      change: "+12.4%",
      isPositive: true,
      subtext: "Active Pipeline Value",
    },
    demandSignalsCount: {
      value: "10",
      num: 10,
      change: "+3 new",
      isPositive: true,
      subtext: "Active Real-Time Feeds",
    },
    pendingAdjustments: {
      value: "12",
      num: 12,
      change: "4 Urgent",
      isPositive: false,
      subtext: "Pending Planner Review",
    },
    openSalesOrders: {
      value: "342",
      num: 342,
      change: "₹ 98.32 Cr",
      isPositive: true,
      subtext: "Confirmed Demand",
    },
    projectedStockouts: {
      value: "8",
      num: 8,
      change: "-3 SKUs",
      isPositive: true,
      subtext: "Buffer safety alert",
    },
    serviceLevel: {
      value: "98.2%",
      num: 98.2,
      change: "+0.6%",
      isPositive: true,
      subtext: "On-time order fulfillment",
    },
    inventoryImpact: {
      value: "86,400",
      num: 86400,
      change: "+5,200",
      isPositive: true,
      subtext: "Procurement units req",
    },
  },
  monthlyDemandTrend: [
    { month: "Apr '26", actualDemand: 9850, finalForecast: 10200, baseForecast: 9500 },
    { month: "May '26", actualDemand: 11100, finalForecast: 11400, baseForecast: 10800 },
    { month: "Jun '26", actualDemand: 12100, finalForecast: 12600, baseForecast: 11900 },
    { month: "Jul '26", actualDemand: 10400, finalForecast: 10800, baseForecast: 10200 },
    { month: "Aug '26", actualDemand: 12800, finalForecast: 13200, baseForecast: 12400 },
    { month: "Sep '26", actualDemand: 14500, finalForecast: 14900, baseForecast: 14000 },
    { month: "Oct '26", actualDemand: 13900, finalForecast: 14400, baseForecast: 13500 },
    { month: "Nov '26", actualDemand: 17200, finalForecast: 17800, baseForecast: 16800 },
    { month: "Dec '26", actualDemand: 15400, finalForecast: 15900, baseForecast: 15000 },
    { month: "Jan '27", actualDemand: 13800, finalForecast: 14200, baseForecast: 13400 },
    { month: "Feb '27", actualDemand: 14200, finalForecast: 14700, baseForecast: 13900 },
    { month: "Mar '27", actualDemand: 16100, finalForecast: 16800, baseForecast: 15800 },
  ],
  accuracyDistribution: [
    { name: "90% - 100%", value: 60, count: 15, color: "#10b981", rating: "Excellent" },
    { name: "80% - 89%", value: 28, count: 7, color: "#3b82f6", rating: "Good" },
    { name: "70% - 79%", value: 8, count: 2, color: "#f59e0b", rating: "Acceptable" },
    { name: "< 70%", value: 4, count: 1, color: "#ef4444", rating: "Needs Improvement" },
  ],
  topDemandDrivers: [
    { name: "Customer Orders", impact: "High", source: "CRM / ERP", weight: 95 },
    { name: "Project Pipeline", impact: "High", source: "Project Management", weight: 88 },
    { name: "Seasonal Demand", impact: "Medium", source: "AI Analytics", weight: 74 },
    { name: "Market Growth", impact: "Medium", source: "Market Intelligence", weight: 68 },
    { name: "Promotions", impact: "Medium", source: "Sales Team", weight: 62 },
    { name: "Economic Indicators", impact: "Low", source: "External Data", weight: 45 },
  ],
  recentAdjustments: [
    {
      id: "ADJ-2026-0012",
      product: "DC Fast 60kW",
      period: "May 2026",
      originalForecast: 10200,
      adjustment: 800,
      revisedForecast: 11000,
      reason: "New Project",
      status: "Pending",
    },
    {
      id: "ADJ-2026-0011",
      product: "DC Fast 120kW",
      period: "Jun 2026",
      originalForecast: 8500,
      adjustment: -500,
      revisedForecast: 8000,
      reason: "Market Decline",
      status: "Approved",
    },
    {
      id: "ADJ-2026-0010",
      product: "AC Charger 22kW",
      period: "Apr 2026",
      originalForecast: 6400,
      adjustment: 300,
      revisedForecast: 6700,
      reason: "Promotion",
      status: "Approved",
    },
    {
      id: "ADJ-2026-0009",
      product: "DC Fast 60kW",
      period: "Jul 2026",
      originalForecast: 11800,
      adjustment: 1000,
      revisedForecast: 12800,
      reason: "Customer Order",
      status: "Pending",
    },
  ],
  upcomingActions: [
    {
      id: "ACT-01",
      title: "Review 3 demand adjustments",
      subtitle: "Adjustments pending your review",
      badgeCount: 3,
      dueDate: "Due Today",
      priority: "high",
    },
    {
      id: "ACT-02",
      title: "Consensus Planning Meeting",
      subtitle: "EV Charging Stations Forecast Review",
      dueDate: "Due in 2 days",
      priority: "medium",
    },
    {
      id: "ACT-03",
      title: "Approval Pending",
      subtitle: "Demand Plan DP-2026-000182 awaiting approval",
      dueDate: "Due in 5 days",
      priority: "medium",
    },
    {
      id: "ACT-04",
      title: "Reforecast Recommended",
      subtitle: "Projected accuracy below threshold for 5 SKUs",
      dueDate: "Due in 7 days",
      priority: "low",
    },
  ],
  sopConsensusPipeline: [
    { stage: "Sales Review", department: "Enterprise Sales", status: "Completed", variance: "+3.2%", reviewer: "Priya Sharma" },
    { stage: "Supply Review", department: "Supply Planning", status: "Completed", variance: "-1.1%", reviewer: "Rajesh Rao" },
    { stage: "Operations Review", department: "Manufacturing Ops", status: "In Review", variance: "0.0%", reviewer: "Anil Kulkarni" },
    { stage: "Finance Signoff", department: "Corporate Finance", status: "Pending", variance: "+2.4%", reviewer: "Sunita Verma" },
    { stage: "Executive Consensus", department: "Management Board", status: "Pending", variance: "--", reviewer: "Executive Committee" },
  ],
};

export const supplyChainOverviewOptions = queryOptions({
  queryKey: ["supply-chain", "overview"],
  queryFn: async (): Promise<SupplyChainOverviewData> => {
    return Promise.resolve(mockSupplyChainOverviewData);
  },
  staleTime: 60_000,
});

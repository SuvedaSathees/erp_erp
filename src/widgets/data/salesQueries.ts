import { queryOptions } from "@tanstack/react-query";

export interface SalesOverviewData {
  kpis: {
    totalRevenue: string;
    targetRevenue: string;
    revenueGrowth: string;
    pipelineValue: string;
    pipelineCoverage: string;
    confirmedOrders: number;
    billedOrderValue: string;
    grossMargin: string;
    marginTarget: string;
    forecastAccuracy: string;
    newCustomers: number;
    newCustomerGrowth: string;
    channelPartners: number;
    territoriesGoverned: number;
    avgDealSize: string;
    winRate: string;
  };
  revenueTrend: Array<{
    month: string;
    actual: number;
    target: number;
    forecast: number;
  }>;
  pipelineFunnel: Array<{
    stage: string;
    count: number;
    value: string;
    conversion: string;
  }>;
  productDistribution: Array<{
    name: string;
    value: number;
    share: string;
    color: string;
  }>;
  territoryPerformance: Array<{
    territory: string;
    region: string;
    revenue: string;
    target: string;
    ach: string;
    growth: string;
  }>;
  channelPerformance: Array<{
    channel: string;
    orders: number;
    revenue: string;
    share: string;
    margin: string;
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
  }>;
  recentOrders: Array<{
    soNumber: string;
    customer: string;
    date: string;
    amount: string;
    items: string;
    status: string;
    route: string;
  }>;
  scorecard: {
    overallScore: number;
    grade: string;
    quotaAchieved: string;
    pipelineCoverage: string;
    marginIndex: string;
    velocity: string;
    retention: string;
  };
  aiInsights: Array<{
    id: string;
    title: string;
    detail: string;
    impact: string;
    type: "positive" | "warning" | "opportunity";
    route: string;
  }>;
}

export const mockSalesOverviewData: SalesOverviewData = {
  kpis: {
    totalRevenue: "₹ 3.80 Cr",
    targetRevenue: "₹ 4.50 Cr",
    revenueGrowth: "+14.2%",
    pipelineValue: "₹ 13.20 Cr",
    pipelineCoverage: "2.93x Coverage",
    confirmedOrders: 184,
    billedOrderValue: "₹ 5.42 Cr",
    grossMargin: "28.5%",
    marginTarget: "30.0%",
    forecastAccuracy: "92.0%",
    newCustomers: 72,
    newCustomerGrowth: "+20.0%",
    channelPartners: 48,
    territoriesGoverned: 12,
    avgDealSize: "₹ 5.28 L",
    winRate: "31.0%",
  },
  revenueTrend: [
    { month: "Apr", actual: 28, target: 35, forecast: 30 },
    { month: "May", actual: 32, target: 35, forecast: 33 },
    { month: "Jun", actual: 36, target: 38, forecast: 35 },
    { month: "Jul", actual: 34, target: 38, forecast: 36 },
    { month: "Aug", actual: 40, target: 40, forecast: 39 },
    { month: "Sep", actual: 42, target: 42, forecast: 41 },
    { month: "Oct", actual: 0, target: 42, forecast: 44 },
    { month: "Nov", actual: 0, target: 45, forecast: 46 },
    { month: "Dec", actual: 0, target: 45, forecast: 48 },
    { month: "Jan", actual: 0, target: 45, forecast: 47 },
    { month: "Feb", actual: 0, target: 42, forecast: 45 },
    { month: "Mar", actual: 0, target: 43, forecast: 48 },
  ],
  pipelineFunnel: [
    { stage: "Leads Generated", count: 250, value: "₹ 28.4 Cr", conversion: "44% to Next" },
    { stage: "Qualified Opportunities", count: 140, value: "₹ 19.2 Cr", conversion: "64% to Demo" },
    { stage: "Proposal & Technical Demo", count: 90, value: "₹ 13.2 Cr", conversion: "61% to Neg." },
    { stage: "Commercial Negotiation", count: 55, value: "₹ 7.8 Cr", conversion: "51% to Won" },
    { stage: "Closed Won", count: 28, value: "₹ 3.8 Cr", conversion: "Final Billed" },
  ],
  productDistribution: [
    { name: "Autonomous W-EVSE 7kW AC", value: 171, share: "45%", color: "#0A3C75" },
    { name: "Autonomous W-EVSE 11kW AC", value: 114, share: "30%", color: "#22C55E" },
    { name: "30kW Commercial DC Fast Charger", value: 57, share: "15%", color: "#0284C7" },
    { name: "Installation, AMC & Spares", value: 38, share: "10%", color: "#F59E0B" },
  ],
  territoryPerformance: [
    { territory: "Tamil Nadu", region: "South", revenue: "₹ 1.82 Cr", target: "₹ 2.00 Cr", ach: "91.0%", growth: "+14.2%" },
    { territory: "Karnataka", region: "South", revenue: "₹ 0.95 Cr", target: "₹ 1.10 Cr", ach: "86.4%", growth: "+8.5%" },
    { territory: "Maharashtra", region: "West", revenue: "₹ 0.65 Cr", target: "₹ 0.85 Cr", ach: "76.5%", growth: "+12.1%" },
    { territory: "Telangana & AP", region: "South", revenue: "₹ 0.38 Cr", target: "₹ 0.55 Cr", ach: "69.1%", growth: "+5.4%" },
  ],
  channelPerformance: [
    { channel: "Dealer Network", orders: 112, revenue: "₹ 1.52 Cr", share: "40.0%", margin: "26.5%" },
    { channel: "Direct Enterprise", orders: 48, revenue: "₹ 1.14 Cr", share: "30.0%", margin: "31.2%" },
    { channel: "Master Distributors", orders: 64, revenue: "₹ 0.76 Cr", share: "20.0%", margin: "24.8%" },
    { channel: "Govt / GeM Portal", orders: 16, revenue: "₹ 0.38 Cr", share: "10.0%", margin: "34.0%" },
  ],
  submodules: [
    {
      id: "sales-planning",
      name: "Sales Planning",
      route: "/management/sales-management/sales-planning",
      badge: "SP-2026-001",
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
      metric: "₹ 50.0 Cr",
      metricLabel: "Annual Target Plan",
      status: "Approved",
    },
    {
      id: "sales-forecasting",
      name: "Sales Forecasting",
      route: "/management/sales-management/sales-forecasting",
      badge: "SF-2026-09",
      badgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
      metric: "92.0%",
      metricLabel: "Forecast Accuracy",
      status: "Monthly Active",
    },
    {
      id: "sales-analytics",
      name: "Sales Analytics",
      route: "/management/sales-management/sales-analytics",
      badge: "BI Engine",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      metric: "₹ 13.2 Cr",
      metricLabel: "Pipeline Tracked",
      status: "Real-time",
    },
    {
      id: "sales-orders",
      name: "Sales Orders",
      route: "/management/sales-management/sales-orders",
      badge: "184 Orders",
      badgeColor: "text-teal-700 bg-teal-50 border-teal-200",
      metric: "₹ 20.03 L",
      metricLabel: "Latest SO-00123",
      status: "Fulfillment",
    },
    {
      id: "pricing",
      name: "Pricing Management",
      route: "/management/sales-management/pricing",
      badge: "PL-2026-001",
      badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
      metric: "30.0%",
      metricLabel: "Target Gross Margin",
      status: "Active MSRP",
    },
    {
      id: "discounts",
      name: "Discount Management",
      route: "/management/sales-management/discounts",
      badge: "DISC-2026-001",
      badgeColor: "text-purple-700 bg-purple-50 border-purple-200",
      metric: "20.0%",
      metricLabel: "Protected Floor Margin",
      status: "Under Review",
    },
    {
      id: "contracts",
      name: "Contract Management",
      route: "/management/sales-management/contracts",
      badge: "CON-2026-001",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      metric: "₹ 3.23 Cr",
      metricLabel: "Committed 3-Yr MSA",
      status: "Active MSA",
    },
    {
      id: "channel-partners",
      name: "Channel Partners",
      route: "/management/sales-management/channel-partners",
      badge: "48 Partners",
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
      metric: "₹ 3.80 Cr",
      metricLabel: "VoltPlus Gold VAD",
      status: "Tier 1 Active",
    },
    {
      id: "territory-management",
      name: "Territory Management",
      route: "/management/sales-management/territory-management",
      badge: "TERR-2026-001",
      badgeColor: "text-sky-700 bg-sky-50 border-sky-200",
      metric: "₹ 7.50 Cr",
      metricLabel: "Tamil Nadu Quota",
      status: "Tier A State",
    },
    {
      id: "sales-commission",
      name: "Sales Commission",
      route: "/management/sales-management/sales-commission",
      badge: "SCM-2026-09",
      badgeColor: "text-rose-700 bg-rose-50 border-rose-200",
      metric: "₹ 70,627",
      metricLabel: "Net Payable P. Sharma",
      status: "Calculated",
    },
  ],
  recentOrders: [
    {
      soNumber: "SO-2026-00123",
      customer: "Green Future Energy Ltd.",
      date: "06-Sep-2026",
      amount: "₹ 20,03,640",
      items: "10x 7kW AC Smart Chargers + Install",
      status: "Confirmed",
      route: "/management/sales-management/sales-orders",
    },
    {
      soNumber: "SO-2026-00122",
      customer: "SunPower Infra Mobility",
      date: "03-Sep-2026",
      amount: "₹ 14,85,000",
      items: "6x 11kW Dual Chargers + Bollards",
      status: "Dispatched",
      route: "/management/sales-management/sales-orders",
    },
    {
      soNumber: "SO-2026-00121",
      customer: "Apex EV Charging Hubs",
      date: "29-Aug-2026",
      amount: "₹ 9,20,000",
      items: "5x 7kW Chargers + RFID Access Cards",
      status: "Invoiced",
      route: "/management/sales-management/sales-orders",
    },
    {
      soNumber: "SO-2026-00120",
      customer: "Metro City Transit Corp",
      date: "24-Aug-2026",
      amount: "₹ 32,50,000",
      items: "2x 30kW DC Fast Chargers + Civil Work",
      status: "Commissioning",
      route: "/management/sales-management/sales-orders",
    },
  ],
  scorecard: {
    overallScore: 81,
    grade: "Grade A (Strong)",
    quotaAchieved: "84.4%",
    pipelineCoverage: "2.93x",
    marginIndex: "95%",
    velocity: "88%",
    retention: "99.1%",
  },
  aiInsights: [
    {
      id: "ai-sales-1",
      title: "Upsell Fast Chargers to Green Future Energy",
      detail:
        "Customer fleet utilization increased 38% in Chennai depot. Recommending proposal for 10x 30kW DC Fast Chargers (+₹ 32 L potential).",
      impact: "+₹ 32 L Potential Deal",
      type: "opportunity",
      route: "/management/sales-management/sales-analytics",
    },
    {
      id: "ai-sales-2",
      title: "Dealer Buffer & Lead Time Alert in Western Region",
      detail:
        "Maharashtra dealer orders dipped 22% due to extended transit times. Prioritize buffer inventory in Pune warehouse to capture Q3 demand.",
      impact: "High Priority Alert",
      type: "warning",
      route: "/management/sales-management/channel-partners",
    },
    {
      id: "ai-sales-3",
      title: "Component Deflation & Margin Expansion",
      detail:
        "Power relay component price dropped 4.2%, creating a 1.1% gross margin expansion buffer on 7kW chargers. Tactical volume rebate recommended.",
      impact: "Margin Buffer +1.1%",
      type: "positive",
      route: "/management/sales-management/pricing",
    },
  ],
};

export const salesOverviewOptions = queryOptions({
  queryKey: ["sales-overview"],
  queryFn: async (): Promise<SalesOverviewData> => {
    return mockSalesOverviewData;
  },
  staleTime: 60_000,
});

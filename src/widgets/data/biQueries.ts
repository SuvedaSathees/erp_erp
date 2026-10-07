// Query & Data Definitions for Business Intelligence Widgets
// Magnertia ERP - Business Intelligence Management

export type BiOverviewData = {
  kpis: {
    totalRevenue: { value: string; delta: string; neutral: string };
    cashBalance: { value: string; delta: string; neutral: string };
    grossMargin: { value: string; delta: string; neutral: string };
    salesPipeline: { value: string; delta: string; neutral: string };
    activeCustomers: { value: string; delta: string; neutral: string };
    productionOee: { value: string; delta: string; neutral: string };
    openIncidents: { value: string; delta: string; neutral: string };
    criticalRisks: { value: string; delta: string; neutral: string };
    // Reports KPIs
    totalReports: { value: string; delta: string; neutral: string };
    activeReports: { value: string; delta: string; neutral: string };
    scheduledReports: { value: string; delta: string; neutral: string };
    generatedToday: { value: string; delta: string; neutral: string };
    reportExceptions: { value: string; delta: string; neutral: string };
    pendingApprovals: { value: string; delta: string; neutral: string };
    dataQualityIssues: { value: string; delta: string; neutral: string };
    sharedReports: { value: string; delta: string; neutral: string };
    kpiAchievement: { value: string; delta: string; neutral: string };
  };
  revenueAndProfitTrend: Array<{
    month: string;
    revenue: number;
    grossProfit: number;
    ebitda: number;
  }>;
  revenueByProduct: Array<{
    name: string;
    share: number;
    amount: string;
    color: string;
  }>;
  salesPipeline: Array<{
    stage: string;
    valueCr: number;
    count: number;
    color: string;
  }>;
  manufacturingMetrics: {
    output: { value: string; delta: string };
    capacity: { value: string; delta: string };
    onTimeDelivery: { value: string; delta: string };
    rejectionRate: { value: string; delta: string };
  };
  supplyChainMetrics: {
    purchaseOrders: { value: string; delta: string };
    inventoryValue: { value: string; delta: string };
    supplierOtif: { value: string; delta: string };
    materialShortage: { value: string; delta: string };
  };
  projectPortfolio: {
    active: number;
    onTrack: number;
    atRisk: number;
    delayed: number;
    completed: number;
  };
  securityCompliance: {
    incidents: { value: string; delta: string };
    cctvOnline: { value: string; percentage: string };
    accessViolations: { value: string; delta: string };
    auditCompliance: { value: string; delta: string };
  };
  riskHeatmap: Array<{
    impact: "High" | "Medium" | "Low";
    low: number;
    medium: number;
    high: number;
    critical: number;
  }>;
  managementActions: Array<{
    id: number;
    action: string;
    owner: string;
    dueDate: string;
    status: "In Progress" | "Overdue" | "Not Started" | "On Track";
  }>;
  upcomingMeetings: Array<{
    id: string;
    date: string;
    month: string;
    title: string;
    time: string;
    location: string;
    type: "Executive" | "Project" | "Security" | "Management";
  }>;
  aiInsights: Array<{
    id: string;
    type: "positive" | "warning" | "danger" | "info";
    text: string;
  }>;
  enterpriseHealth: {
    score: number;
    status: string;
    breakdown: Array<{ name: string; score: number }>;
  };
};

export const BI_OVERVIEW_DATA: BiOverviewData = {
  kpis: {
    totalRevenue: { value: "₹12.8 Cr", delta: "+18.4% vs last quarter", neutral: "₹12.8 Cr" },
    cashBalance: { value: "₹4.2 Cr", delta: "+22.1% vs last month", neutral: "₹4.2 Cr" },
    grossMargin: { value: "32.6%", delta: "+3.2% vs last quarter", neutral: "32.6%" },
    salesPipeline: { value: "₹18.6 Cr", delta: "+14.7% vs last month", neutral: "₹18.6 Cr" },
    activeCustomers: { value: "146", delta: "+8.2% vs last quarter", neutral: "146 Clients" },
    productionOee: { value: "82.7%", delta: "+5.6% vs last quarter", neutral: "82.7% OEE" },
    openIncidents: { value: "4", delta: "-33% vs last month", neutral: "4 Open" },
    criticalRisks: { value: "7", delta: "-40% vs last month", neutral: "7 Risks" },
    // Reports KPI widgets
    totalReports: { value: "248", delta: "+12% vs last quarter", neutral: "248 Total" },
    activeReports: { value: "216", delta: "+8%", neutral: "216 Active" },
    scheduledReports: { value: "94", delta: "+26%", neutral: "94 Scheduled" },
    generatedToday: { value: "37", delta: "+18%", neutral: "37 Today" },
    reportExceptions: { value: "5", delta: "-44%", neutral: "5 Exceptions" },
    pendingApprovals: { value: "8", delta: "-20%", neutral: "8 Pending" },
    dataQualityIssues: { value: "6", delta: "-40%", neutral: "6 Issues" },
    sharedReports: { value: "41", delta: "+32%", neutral: "41 Shared" },
    kpiAchievement: { value: "94.2%", delta: "+6.8% vs last quarter", neutral: "94.2% Achieved" },
  },
  revenueAndProfitTrend: [
    { month: "Jan", revenue: 12.1, grossProfit: 3.8, ebitda: 1.5 },
    { month: "Feb", revenue: 14.5, grossProfit: 4.6, ebitda: 1.8 },
    { month: "Mar", revenue: 13.8, grossProfit: 4.2, ebitda: 1.7 },
    { month: "Apr", revenue: 15.2, grossProfit: 4.9, ebitda: 2.0 },
    { month: "May", revenue: 16.8, grossProfit: 5.4, ebitda: 2.2 },
    { month: "Jun", revenue: 18.1, grossProfit: 5.8, ebitda: 2.4 },
    { month: "Jul", revenue: 19.4, grossProfit: 6.2, ebitda: 2.6 },
    { month: "Aug", revenue: 20.2, grossProfit: 6.5, ebitda: 2.8 },
    { month: "Sep", revenue: 21.0, grossProfit: 6.9, ebitda: 3.1 },
  ],
  revenueByProduct: [
    { name: "Autonomous W-EVSE", share: 38, amount: "₹4.86 Cr", color: "#3B82F6" },
    { name: "DC Fast Chargers", share: 22, amount: "₹2.82 Cr", color: "#EC4899" },
    { name: "AC Wall Chargers", share: 15, amount: "₹1.92 Cr", color: "#10B981" },
    { name: "CaaS Services", share: 12, amount: "₹1.54 Cr", color: "#F59E0B" },
    { name: "AMC", share: 8, amount: "₹1.02 Cr", color: "#8B5CF6" },
    { name: "Royalty", share: 4, amount: "₹0.51 Cr", color: "#06B6D4" },
    { name: "Advertising", share: 1, amount: "₹0.13 Cr", color: "#64748B" },
  ],
  salesPipeline: [
    { stage: "Leads", valueCr: 42.0, count: 420, color: "#3B82F6" },
    { stage: "Qualified", valueCr: 31.0, count: 310, color: "#10B981" },
    { stage: "Proposal", valueCr: 18.0, count: 180, color: "#F59E0B" },
    { stage: "Negotiation", valueCr: 9.2, count: 92, color: "#F97316" },
    { stage: "Won", valueCr: 6.4, count: 64, color: "#EF4444" },
  ],
  manufacturingMetrics: {
    output: { value: "1,240 units", delta: "+12%" },
    capacity: { value: "78%", delta: "+6%" },
    onTimeDelivery: { value: "94.2%", delta: "+3%" },
    rejectionRate: { value: "2.1%", delta: "-0.5%" },
  },
  supplyChainMetrics: {
    purchaseOrders: { value: "56", delta: "+4%" },
    inventoryValue: { value: "₹3.6 Cr", delta: "+8%" },
    supplierOtif: { value: "92.4%", delta: "+6%" },
    materialShortage: { value: "3", delta: "-40%" },
  },
  projectPortfolio: {
    active: 28,
    onTrack: 18,
    atRisk: 6,
    delayed: 3,
    completed: 12,
  },
  securityCompliance: {
    incidents: { value: "4", delta: "-33%" },
    cctvOnline: { value: "94/96", percentage: "97.9%" },
    accessViolations: { value: "2", delta: "-50%" },
    auditCompliance: { value: "96.1%", delta: "+4%" },
  },
  riskHeatmap: [
    { impact: "High", low: 0, medium: 2, high: 3, critical: 2 },
    { impact: "Medium", low: 1, medium: 4, high: 6, critical: 3 },
    { impact: "Low", low: 5, medium: 8, high: 4, critical: 1 },
  ],
  managementActions: [
    {
      id: 1,
      action: "Close critical security audit findings",
      owner: "Security Head",
      dueDate: "30 Sep 2026",
      status: "In Progress",
    },
    {
      id: 2,
      action: "Resolve Tier-1 microchip material shortage",
      owner: "SCM Head",
      dueDate: "28 Sep 2026",
      status: "Overdue",
    },
    {
      id: 3,
      action: "Complete automotive CE product certification",
      owner: "Product Head",
      dueDate: "15 Oct 2026",
      status: "Not Started",
    },
    {
      id: 4,
      action: "Reduce production line-3 downtime to <2%",
      owner: "Plant Head",
      dueDate: "10 Oct 2026",
      status: "In Progress",
    },
    {
      id: 5,
      action: "Finalize Series-B investor financial review deck",
      owner: "CEO",
      dueDate: "05 Oct 2026",
      status: "On Track",
    },
  ],
  upcomingMeetings: [
    {
      id: "meet-1",
      date: "28",
      month: "SEP",
      title: "Executive Board Management Review",
      time: "10:00 AM - 12:00 PM",
      location: "Board Room",
      type: "Executive",
    },
    {
      id: "meet-2",
      date: "30",
      month: "SEP",
      title: "Project Portfolio & Sprint Review",
      time: "02:00 PM - 03:30 PM",
      location: "Online (Teams)",
      type: "Project",
    },
    {
      id: "meet-3",
      date: "03",
      month: "OCT",
      title: "Security & Risk Governance Council",
      time: "11:00 AM - 12:30 PM",
      location: "HQ - Namakkal",
      type: "Security",
    },
    {
      id: "meet-4",
      date: "05",
      month: "OCT",
      title: "Monthly Business Review (MBR) Q3",
      time: "10:00 AM - 01:00 PM",
      location: "Board Room",
      type: "Management",
    },
  ],
  aiInsights: [
    {
      id: "ai-1",
      type: "positive",
      text: "Revenue growth is 18.4% higher than last quarter, primarily driven by CaaS subscriptions.",
    },
    {
      id: "ai-2",
      type: "danger",
      text: "Material shortage risk detected for power electronics semiconductor components (2 weeks buffer).",
    },
    {
      id: "ai-3",
      type: "positive",
      text: "Production OEE improvement trend is projected to reach 85% next quarter across Line A.",
    },
    {
      id: "ai-4",
      type: "warning",
      text: "3 high-priority projects are at risk due to component supplier delays. Alternative suppliers recommended.",
    },
    {
      id: "ai-5",
      type: "info",
      text: "Security incidents decreased by 33%. Zero critical penetration test vulnerabilities unaddressed.",
    },
  ],
  enterpriseHealth: {
    score: 78,
    status: "Good",
    breakdown: [
      { name: "Financial", score: 82 },
      { name: "Customer", score: 76 },
      { name: "Operations", score: 78 },
      { name: "People", score: 72 },
      { name: "Security", score: 70 },
      { name: "Compliance", score: 88 },
      { name: "Sustainability", score: 76 },
    ],
  },
};

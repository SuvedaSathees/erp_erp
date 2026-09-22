import { queryOptions } from "@tanstack/react-query";

export interface MarketingOverviewData {
  kpis: {
    activeCampaigns: number;
    campaignReach: string;
    reachGrowth: string;
    websiteVisits: string;
    visitsGrowth: string;
    leadsGenerated: number;
    leadsGrowth: string;
    mql: number;
    mqlGrowth: string;
    sql: number;
    sqlGrowth: string;
    opportunities: number;
    opportunitiesGrowth: string;
    campaignRevenue: string;
    revenueGrowth: string;
    marketingRoi: string;
    roiGrowth: string;
    costPerLead: string;
    costPerMql: string;
    costPerSql: string;
    cac: string;
    roas: string;
    approvedBudget: string;
    actualSpend: string;
    budgetUtilization: string;
    availableBudget: string;
    campaignProgressDays: string;
    campaignProgressPercent: number;
  };
  funnel: Array<{
    stage: string;
    count: number;
    percentage: string;
    color: string;
  }>;
  channels: Array<{
    channel: string;
    iconKey: "linkedin" | "google" | "email" | "event" | "partner";
    impressions: number;
    clicks: number;
    leads: number;
    cost: number;
    cpl: number;
    status: "Active" | "Paused" | "Completed";
  }>;
  leadsBySource: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  locations: Array<{
    location: string;
    percentage: number;
    color: string;
  }>;
  submodules: Array<{
    id: string;
    name: string;
    route: string;
    badge: string;
    badgeColor: string;
    description: string;
    metric: string;
  }>;
  recentActivities: Array<{
    id: string;
    date: string;
    activity: string;
    user: string;
    status: "Completed" | "In Progress" | "Pending";
  }>;
  aiInsights: Array<{
    id: string;
    title: string;
    detail: string;
    type: "positive" | "info" | "warning" | "action";
  }>;
  activeCampaigns: Array<{
    id: string;
    code: string;
    name: string;
    type: string;
    manager: string;
    dates: string;
    budget: string;
    spend: string;
    leads: number;
    revenue: string;
    roi: string;
    status: "Active" | "Scheduled" | "Review";
  }>;
}

export const mockMarketingOverviewData: MarketingOverviewData = {
  kpis: {
    activeCampaigns: 12,
    campaignReach: "500,000",
    reachGrowth: "+12%",
    websiteVisits: "25,000",
    visitsGrowth: "+18%",
    leadsGenerated: 500,
    leadsGrowth: "+25%",
    mql: 185,
    mqlGrowth: "+32%",
    sql: 82,
    sqlGrowth: "+28%",
    opportunities: 44,
    opportunitiesGrowth: "+22%",
    campaignRevenue: "₹85.0 L",
    revenueGrowth: "+35%",
    marketingRoi: "4.5x",
    roiGrowth: "+1.2x",
    costPerLead: "₹1,333",
    costPerMql: "₹3,351",
    costPerSql: "₹7,561",
    cac: "₹36,470",
    roas: "13.7x",
    approvedBudget: "₹8,00,000",
    actualSpend: "₹6,20,000",
    budgetUtilization: "77.5%",
    availableBudget: "₹1,00,000",
    campaignProgressDays: "Day 41 of 60",
    campaignProgressPercent: 68,
  },
  funnel: [
    { stage: "Reach", count: 500000, percentage: "100%", color: "#2563eb" },
    { stage: "Engagement", count: 25000, percentage: "5.0%", color: "#10b981" },
    { stage: "Leads", count: 500, percentage: "0.1%", color: "#f59e0b" },
    { stage: "MQL", count: 185, percentage: "37.0%", color: "#f97316" },
    { stage: "SQL", count: 82, percentage: "44.3%", color: "#ec4899" },
    { stage: "Opportunities", count: 44, percentage: "53.7%", color: "#06b6d4" },
    { stage: "Customers", count: 17, percentage: "38.6%", color: "#1e3a8a" },
  ],
  channels: [
    { channel: "LinkedIn", iconKey: "linkedin", impressions: 120000, clicks: 4800, leads: 150, cost: 200000, cpl: 1333, status: "Active" },
    { channel: "Google Ads", iconKey: "google", impressions: 150000, clicks: 5200, leads: 180, cost: 150000, cpl: 833, status: "Active" },
    { channel: "Email Marketing", iconKey: "email", impressions: 25000, clicks: 2100, leads: 100, cost: 50000, cpl: 500, status: "Active" },
    { channel: "Industry Event", iconKey: "event", impressions: 5000, clicks: 800, leads: 120, cost: 300000, cpl: 2500, status: "Active" },
    { channel: "Partner Network", iconKey: "partner", impressions: 20000, clicks: 1200, leads: 80, cost: 100000, cpl: 1250, status: "Active" },
  ],
  leadsBySource: [
    { name: "Google Ads", value: 175, percentage: "35%", color: "#3b82f6" },
    { name: "LinkedIn", value: 150, percentage: "30%", color: "#0284c7" },
    { name: "Email", value: 100, percentage: "20%", color: "#10b981" },
    { name: "Events", value: 50, percentage: "10%", color: "#f59e0b" },
    { name: "Partner Network", value: 25, percentage: "5%", color: "#8b5cf6" },
  ],
  locations: [
    { location: "Tamil Nadu", percentage: 35, color: "#2563eb" },
    { location: "Karnataka", percentage: 25, color: "#3b82f6" },
    { location: "Maharashtra", percentage: 15, color: "#60a5fa" },
    { location: "Delhi NCR", percentage: 10, color: "#93c5fd" },
    { location: "Others", percentage: 15, color: "#cbd5e1" },
  ],
  submodules: [
    {
      id: "mkt-mod-1",
      name: "Campaigns",
      route: "/management/marketing-management/campaigns",
      badge: "Master / MAICW",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      description: "Plan, budget, approve, execute, monitor, and close campaigns.",
      metric: "12 Active Campaigns",
    },
    {
      id: "mkt-mod-2",
      name: "Marketing Plans",
      route: "/management/marketing-management/marketing-plans",
      badge: "Strategic Plan",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description: "Annual & quarterly marketing programs, budget allocations & calendars.",
      metric: "4 Active Programs",
    },
    {
      id: "mkt-mod-3",
      name: "Content Management",
      route: "/management/marketing-management/content-management",
      badge: "Creatives & Assets",
      badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      description: "Banners, whitepapers, videos, datasheets, copy & brand compliance.",
      metric: "68 Assets Live",
    },
    {
      id: "mkt-mod-4",
      name: "Digital Marketing",
      route: "/management/marketing-management/digital-marketing",
      badge: "Paid & Organic",
      badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      description: "PPC, SEO, Google Search, LinkedIn Ads, social display & web traffic.",
      metric: "4.8% Avg CTR",
    },
    {
      id: "mkt-mod-5",
      name: "Events",
      route: "/management/marketing-management/events",
      badge: "Trade Shows & Expos",
      badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      description: "Trade shows, webinars, conferences, EV summits & dealer meets.",
      metric: "3 Upcoming Events",
    },
    {
      id: "mkt-mod-6",
      name: "Brand Management",
      route: "/management/marketing-management/brand-management",
      badge: "Brand Identity",
      badgeColor: "bg-pink-500/10 text-pink-600 border-pink-500/20",
      description: "Brand guidelines, PR releases, tone of voice, logos & media kits.",
      metric: "98% Brand Score",
    },
    {
      id: "mkt-mod-7",
      name: "Market Research",
      route: "/management/marketing-management/market-research",
      badge: "Intelligence",
      badgeColor: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      description: "Market studies, customer behavior, competitive benchmarking & TAM.",
      metric: "14 Reports",
    },
    {
      id: "mkt-mod-8",
      name: "Leads Management",
      route: "/management/marketing-management/leads-management",
      badge: "MQL / SQL Pipeline",
      badgeColor: "bg-teal-500/10 text-teal-600 border-teal-500/20",
      description: "Capture, scoring, qualification, SLA tracking & CRM handover.",
      metric: "500 Total Leads",
    },
    {
      id: "mkt-mod-9",
      name: "Partner Marketing",
      route: "/management/marketing-management/partner-marketing",
      badge: "Channel Co-Op",
      badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      description: "Co-op funds, distributor enablement collateral & partner portal.",
      metric: "32 Partners Active",
    },
    {
      id: "mkt-mod-10",
      name: "Reports",
      route: "/management/marketing-management/reports",
      badge: "Executive Summary",
      badgeColor: "bg-violet-500/10 text-violet-600 border-violet-500/20",
      description: "Consolidated performance, ROAS, CAC, funnel conversion & audit trails.",
      metric: "Quarterly Audit",
    },
  ],
  recentActivities: [
    { id: "act-1", date: "18-Sep-2026", activity: "New creative approved", user: "Priya S", status: "Completed" },
    { id: "act-2", date: "15-Sep-2026", activity: "Campaign launched", user: "Arun Kumar", status: "Completed" },
    { id: "act-3", date: "10-Sep-2026", activity: "Landing page published", user: "Digital Team", status: "Completed" },
    { id: "act-4", date: "06-Sep-2026", activity: "Email template approved", user: "Priya S", status: "Completed" },
    { id: "act-5", date: "01-Sep-2026", activity: "Campaign created", user: "Arun Kumar", status: "Completed" },
  ],
  aiInsights: [
    {
      id: "ai-1",
      title: "Conversion Surge",
      detail: "Lead conversion rate is 18% higher than similar campaigns in the wireless charging segment.",
      type: "positive",
    },
    {
      id: "ai-2",
      title: "Geographic Propensity",
      detail: "Fleet operators from Tamil Nadu show highest engagement and fastest MQL qualification.",
      type: "info",
    },
    {
      id: "ai-3",
      title: "Budget Optimization",
      detail: "Recommend increasing Google Ads budget by 20% to capture surging search demand for fleet chargers.",
      type: "action",
    },
    {
      id: "ai-4",
      title: "Content Champion",
      detail: "Best performing content: 'Autonomous Charging for Fleets' whitepaper and video showcase.",
      type: "positive",
    },
    {
      id: "ai-5",
      title: "Revenue Forecast",
      detail: "Predicted revenue: ₹1.2 Cr (95% confidence interval) based on current opportunity velocity.",
      type: "info",
    },
  ],
  activeCampaigns: [
    {
      id: "cmp-1",
      code: "CMP-2026-001",
      name: "Future Ready EV Fleets",
      type: "Lead Generation",
      manager: "Arun Kumar",
      dates: "01-Sep-2026 - 31-Oct-2026",
      budget: "₹ 8,00,000",
      spend: "₹ 6,20,000",
      leads: 500,
      revenue: "₹ 85.0 L",
      roi: "4.5x",
      status: "Active",
    },
    {
      id: "cmp-2",
      code: "CMP-2026-002",
      name: "Commercial Depot Power 2026",
      type: "Demand Generation",
      manager: "Neha Reddy",
      dates: "15-Aug-2026 - 15-Nov-2026",
      budget: "₹ 12,00,000",
      spend: "₹ 7,80,000",
      leads: 340,
      revenue: "₹ 64.0 L",
      roi: "3.8x",
      status: "Active",
    },
    {
      id: "cmp-3",
      code: "CMP-2026-003",
      name: "National EV Expo 2026",
      type: "Event",
      manager: "Vikram Singh",
      dates: "01-Oct-2026 - 15-Oct-2026",
      budget: "₹ 5,50,000",
      spend: "₹ 1,50,000",
      leads: 120,
      revenue: "₹ 28.0 L",
      roi: "4.1x",
      status: "Scheduled",
    },
  ],
};

export const marketingOverviewOptions = queryOptions({
  queryKey: ["marketing-overview"],
  queryFn: async (): Promise<MarketingOverviewData> => {
    return mockMarketingOverviewData;
  },
  staleTime: 60_000,
});

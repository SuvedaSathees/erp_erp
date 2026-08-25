import { queryOptions } from "@tanstack/react-query";

export interface CrmOverviewData {
  kpis: {
    totalLeads: number;
    hotLeads: number;
    convertedLeadsMonth: number;
    leadConversionRate: number;
    totalContacts: number;
    activeAccounts: number;
    averageHealthScore: number;
    pipelineValue: number;
    weightedPipeline: number;
    totalOpportunities: number;
    winRate: number;
    activeQuotes: number;
    activeQuotesValue: number;
    openTickets: number;
    slaCompliance: number;
    csatScore: number;
    npsScore: number;
    activeLoyaltyMembers: number;
    pointsRedeemedMonth: number;
  };
  funnel: Array<{
    stage: string;
    count: number;
    value: number;
    conversionRate: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    leads: number;
    dealsWon: number;
    revenueForecast: number;
    actualRevenue: number;
  }>;
  leadSources: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topOpportunities: Array<{
    id: string;
    title: string;
    account: string;
    value: number;
    stage: string;
    probability: number;
    owner: string;
    expectedClose: string;
  }>;
  criticalAccounts: Array<{
    id: string;
    accountName: string;
    tier: string;
    healthScore: number;
    healthStatus: "Healthy" | "Monitor" | "At Risk" | "Critical";
    openTickets: number;
    mrr: number;
    csm: string;
  }>;
}

const MOCK_CRM_DATA: CrmOverviewData = {
  kpis: {
    totalLeads: 184,
    hotLeads: 48,
    convertedLeadsMonth: 23,
    leadConversionRate: 26.4,
    totalContacts: 642,
    activeAccounts: 128,
    averageHealthScore: 84,
    pipelineValue: 34200000,
    weightedPipeline: 19800000,
    totalOpportunities: 42,
    winRate: 68.5,
    activeQuotes: 19,
    activeQuotesValue: 14500000,
    openTickets: 11,
    slaCompliance: 97.2,
    csatScore: 4.85,
    npsScore: 68,
    activeLoyaltyMembers: 320,
    pointsRedeemedMonth: 45200,
  },
  funnel: [
    { stage: "Lead Capture", count: 184, value: 85000000, conversionRate: 100 },
    { stage: "Contacted & Qualified", count: 112, value: 58000000, conversionRate: 60.8 },
    { stage: "Opportunity Created", count: 76, value: 42000000, conversionRate: 67.8 },
    { stage: "Proposal & Quotation", count: 42, value: 34200000, conversionRate: 55.2 },
    { stage: "Negotiation / Review", count: 28, value: 24500000, conversionRate: 66.7 },
    { stage: "Closed Won", count: 23, value: 18900000, conversionRate: 82.1 },
  ],
  monthlyTrend: [
    { month: "Mar", leads: 120, dealsWon: 14, revenueForecast: 12000000, actualRevenue: 11500000 },
    { month: "Apr", leads: 135, dealsWon: 16, revenueForecast: 14000000, actualRevenue: 13800000 },
    { month: "May", leads: 148, dealsWon: 18, revenueForecast: 15500000, actualRevenue: 16200000 },
    { month: "Jun", leads: 160, dealsWon: 19, revenueForecast: 17000000, actualRevenue: 16900000 },
    { month: "Jul", leads: 172, dealsWon: 21, revenueForecast: 18200000, actualRevenue: 18500000 },
    { month: "Aug", leads: 184, dealsWon: 23, revenueForecast: 19800000, actualRevenue: 18900000 },
  ],
  leadSources: [
    { name: "Direct Inbound", value: 38, color: "#3B82F6" },
    { name: "Partner Referrals", value: 24, color: "#10B981" },
    { name: "Events & Webinars", value: 18, color: "#8B5CF6" },
    { name: "Outbound SDR", value: 12, color: "#F59E0B" },
    { name: "Organic Search", value: 8, color: "#EC4899" },
  ],
  topOpportunities: [
    {
      id: "OPP-2024-0091",
      title: "Enterprise IoT Automation Suite",
      account: "Acme Industrial Technologies",
      value: 6500000,
      stage: "Proposal / Quote",
      probability: 75,
      owner: "Vikram Malhotra",
      expectedClose: "2024-09-15",
    },
    {
      id: "OPP-2024-0087",
      title: "Smart Grid Sensor Expansion",
      account: "Tata Power Grid Corp",
      value: 4800000,
      stage: "Negotiation",
      probability: 85,
      owner: "Ananya Deshmukh",
      expectedClose: "2024-09-08",
    },
    {
      id: "OPP-2024-0094",
      title: "Battery Telematics & Firmware",
      account: "Omega EV Motors",
      value: 3900000,
      stage: "Qualified",
      probability: 60,
      owner: "Rahul Verma",
      expectedClose: "2024-09-28",
    },
    {
      id: "OPP-2024-0079",
      title: "Fleet Battery Telemetry Contract",
      account: "Zeta Mobility Fleet",
      value: 3200000,
      stage: "Closed Won",
      probability: 100,
      owner: "Sneha Nair",
      expectedClose: "2024-08-20",
    },
  ],
  criticalAccounts: [
    {
      id: "ACC-001",
      accountName: "Acme Automation Pvt. Ltd.",
      tier: "Tier 1 Enterprise",
      healthScore: 82,
      healthStatus: "Healthy",
      openTickets: 1,
      mrr: 450000,
      csm: "Pooja Rao",
    },
    {
      id: "ACC-004",
      accountName: "Nexus Robotics India",
      tier: "Tier 2 Growth",
      healthScore: 61,
      healthStatus: "Monitor",
      openTickets: 3,
      mrr: 280000,
      csm: "Pooja Rao",
    },
    {
      id: "ACC-007",
      accountName: "Apex Automotive Components",
      tier: "Tier 1 Enterprise",
      healthScore: 48,
      healthStatus: "At Risk",
      openTickets: 4,
      mrr: 520000,
      csm: "Rahul Verma",
    },
  ],
};

export function crmOverviewOptions() {
  return queryOptions({
    queryKey: ["crm", "overview"] as const,
    queryFn: async (): Promise<CrmOverviewData> => {
      // Return instant resolved data matching active records
      return MOCK_CRM_DATA;
    },
  });
}

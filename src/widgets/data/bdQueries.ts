import { queryOptions } from "@tanstack/react-query";

export interface CommercialDealItem {
  id: string;
  name: string;
  stage: string;
  value: string;
  numericValue: number;
  partner: string;
  probability: string;
  status: string;
  targetQuarter: string;
}

export interface StrategicAllianceItem {
  id: string;
  name: string;
  type: string;
  partner: string;
  scope: string;
  status: string;
  value: string;
}

export interface DistributionAgreementItem {
  id: string;
  distributor: string;
  territory: string;
  tier: string;
  annualQuota: string;
  fulfillmentRate: string;
  status: string;
}

export interface RfpProposalItem {
  id: string;
  title: string;
  issuer: string;
  value: string;
  submissionDeadline: string;
  winProbability: string;
  status: string;
}

export interface ExpansionTerritoryItem {
  region: string;
  targetLaunch: string;
  distributorCount: number;
  regulatoryScore: number;
  status: string;
  estimatedTAM: string;
}

export interface BdOverviewData {
  kpis: {
    pipelineValue: string;
    activeDeals: number;
    closedYtd: string;
    winRate: string;
    partnerEcosystem: number;
    highPriorityDeals: number;
    avgDealSize: string;
    expansionMarkets: number;
    openRfps: number;
    dealVelocity: string;
  };
  pipelineTrend: Array<{
    month: string;
    pipeline: number;
    closed: number;
    target: number;
    winRate: number;
  }>;
  funnel: Array<{
    label: string;
    count: number;
    val: string;
    percentage: number;
  }>;
  partnerDistribution: Array<{
    channel: string;
    count: number;
    sharePct: number;
    color: string;
  }>;
  revenueGrowthCurve: Array<{
    month: string;
    enterprise: number;
    channelSales: number;
    licensing: number;
    target: number;
  }>;
  deals: CommercialDealItem[];
  strategicAlliances: StrategicAllianceItem[];
  distributionAgreements: DistributionAgreementItem[];
  rfpProposals: RfpProposalItem[];
  expansionMarketsList: ExpansionTerritoryItem[];
  alerts: Array<{
    type: "warning" | "info" | "success";
    title: string;
    desc: string;
  }>;
  forecast: Array<{
    period: string;
    amount: number;
    flow: "positive" | "negative";
  }>;
  aiIntelligence: {
    dealVelocityScore: number;
    pipelineHealthScore: number;
    winPredictabilityScore: number;
    ecosystemRiskScore: number;
    expansionReadinessScore: number;
    recommendations: string[];
  };
}

const MOCK_BD_DATA: BdOverviewData = {
  kpis: {
    pipelineValue: "₹ 48.5 Cr",
    activeDeals: 42,
    closedYtd: "₹ 18.2 Cr",
    winRate: "64.8%",
    partnerEcosystem: 128,
    highPriorityDeals: 14,
    avgDealSize: "₹ 1.15 Cr",
    expansionMarkets: 6,
    openRfps: 16,
    dealVelocity: "34 Days",
  },
  pipelineTrend: [
    { month: "Apr 26", pipeline: 32.5, closed: 8.2, target: 12.0, winRate: 58 },
    { month: "May 26", pipeline: 36.8, closed: 11.4, target: 13.5, winRate: 61 },
    { month: "Jun 26", pipeline: 41.2, closed: 14.8, target: 15.0, winRate: 63 },
    { month: "Jul 26", pipeline: 44.0, closed: 16.5, target: 16.5, winRate: 62 },
    { month: "Aug 26", pipeline: 48.5, closed: 18.2, target: 18.0, winRate: 65 },
    { month: "Sep 26 (P)", pipeline: 54.0, closed: 22.5, target: 20.0, winRate: 67 },
  ],
  funnel: [
    { label: "Lead Generation & Scouting", count: 85, val: "₹ 120 Cr", percentage: 100 },
    { label: "Qualification & Pitching", count: 54, val: "₹ 85 Cr", percentage: 63 },
    { label: "Proposal & RFP Submission", count: 32, val: "₹ 58 Cr", percentage: 38 },
    { label: "Commercial Negotiation", count: 18, val: "₹ 34 Cr", percentage: 21 },
    { label: "Contracting & Closing", count: 12, val: "₹ 22 Cr", percentage: 14 },
    { label: "Active Partnership & Account", count: 8, val: "₹ 18 Cr", percentage: 9 },
  ],
  partnerDistribution: [
    { channel: "OEM Alliances", count: 28, sharePct: 34, color: "#3B82F6" },
    { channel: "Master Distributors", count: 36, sharePct: 26, color: "#10B981" },
    { channel: "Authorized Dealers", count: 42, sharePct: 22, color: "#F59E0B" },
    { channel: "Technology Integrators", count: 14, sharePct: 12, color: "#8B5CF6" },
    { channel: "Franchise Operators", count: 8, sharePct: 6, color: "#EC4899" },
  ],
  revenueGrowthCurve: [
    { month: "Apr 26", enterprise: 4.8, channelSales: 2.2, licensing: 1.2, target: 7.5 },
    { month: "May 26", enterprise: 5.6, channelSales: 3.5, licensing: 2.3, target: 10.0 },
    { month: "Jun 26", enterprise: 6.8, channelSales: 5.1, licensing: 2.9, target: 13.5 },
    { month: "Jul 26", enterprise: 7.5, channelSales: 5.8, licensing: 3.2, target: 15.0 },
    { month: "Aug 26", enterprise: 8.9, channelSales: 6.1, licensing: 3.2, target: 17.5 },
    { month: "Sep 26", enterprise: 10.4, channelSales: 8.2, licensing: 3.9, target: 21.0 },
  ],
  deals: [
    { id: "BD-2026-089", name: "Global Automotive OEM Joint Venture", stage: "Commercial Negotiation", value: "₹ 14.5 Cr", numericValue: 145000000, partner: "Apex Dynamics Corp", probability: "85%", status: "High Priority", targetQuarter: "Q3 2026" },
    { id: "BD-2026-074", name: "Next-Gen Energy Grid Licensing Deal", stage: "Contracting & Closing", value: "₹ 8.2 Cr", numericValue: 82000000, partner: "Voltaic Power Solutions", probability: "90%", status: "Closing", targetQuarter: "Q2 2026" },
    { id: "BD-2026-061", name: "Smart Mobility Strategic Alliance", stage: "Proposal & RFP Submission", value: "₹ 6.8 Cr", numericValue: 68000000, partner: "Urban Tech Innovations", probability: "70%", status: "In Review", targetQuarter: "Q3 2026" },
    { id: "BD-2026-052", name: "APAC Channel Partner Network Expansion", stage: "Qualification & Pitching", value: "₹ 4.5 Cr", numericValue: 45000000, partner: "PacRim Holdings Ltd", probability: "60%", status: "Scouting", targetQuarter: "Q4 2026" },
    { id: "BD-2026-048", name: "IIoT Sensor Suite Technology Transfer", stage: "Active Partnership", value: "₹ 5.2 Cr", numericValue: 52000000, partner: "CyberFab Robotics", probability: "95%", status: "Active", targetQuarter: "Q2 2026" },
    { id: "BD-2026-039", name: "Commercial Fleet Inverter OEM Contract", stage: "Commercial Negotiation", value: "₹ 9.3 Cr", numericValue: 93000000, partner: "Titan Logistics Fleet", probability: "80%", status: "High Priority", targetQuarter: "Q3 2026" },
  ],
  strategicAlliances: [
    { id: "ALL-01", name: "Apex Power Tech Co-Development", type: "Joint Venture", partner: "Apex Dynamics Corp", scope: "Ultra-fast charging power electronics IP", status: "Active JV", value: "₹ 45 Cr" },
    { id: "ALL-02", name: "GreenGrid V2G Framework Alliance", type: "Technology Alliances", partner: "National Power Grid Co", scope: "Grid balancing protocol and telemetry standards", status: "In Contracting", value: "₹ 28 Cr" },
    { id: "ALL-03", name: "UrbanMobility Smart Fleet Integration", type: "OEM Integration", partner: "Urban Tech Innovations", scope: "Embedded controller API and telematics module", status: "Piloting", value: "₹ 15 Cr" },
    { id: "ALL-04", name: "CyberFab Robotics Sensor Licensing", type: "Licensing Agreement", partner: "CyberFab Robotics", scope: "Proprietary high-precision thermal sensor suite", status: "Commercialized", value: "₹ 12 Cr" },
  ],
  distributionAgreements: [
    { id: "DIS-01", distributor: "North India Logistics Master Distributor", territory: "Delhi NCR, Punjab, Haryana", tier: "Tier-1 Master", annualQuota: "₹ 18 Cr", fulfillmentRate: "96.4%", status: "Authorized" },
    { id: "DIS-02", distributor: "Western Corridor Infrastructure Supply", territory: "Maharashtra & Gujarat", tier: "Tier-1 Master", annualQuota: "₹ 24 Cr", fulfillmentRate: "94.8%", status: "Authorized" },
    { id: "DIS-03", distributor: "Southern Tech Supply Network", territory: "Karnataka & Tamil Nadu", tier: "Tier-2 Distributor", annualQuota: "₹ 12 Cr", fulfillmentRate: "91.2%", status: "Active" },
    { id: "DIS-04", distributor: "Eastern Industrial Spares & Energy", territory: "West Bengal & Odisha", tier: "Tier-2 Distributor", annualQuota: "₹ 8 Cr", fulfillmentRate: "88.5%", status: "Review" },
  ],
  rfpProposals: [
    { id: "RFP-2026-018", title: "State Highway Rapid Charging Corridor Tender", issuer: "National Highways Authority", value: "₹ 26.5 Cr", submissionDeadline: "2026-09-25", winProbability: "78%", status: "Submitted" },
    { id: "RFP-2026-015", title: "Smart City Fleet Microgrid Telemetry System", issuer: "Smart Cities Mission", value: "₹ 14.8 Cr", submissionDeadline: "2026-10-10", winProbability: "65%", status: "In Preparation" },
    { id: "RFP-2026-011", title: "Airport GSE Charging Infrastructure Bid", issuer: "Metro Airports Authority", value: "₹ 9.2 Cr", submissionDeadline: "2026-09-18", winProbability: "82%", status: "Final Stage" },
  ],
  expansionMarketsList: [
    { region: "Southeast Asia (Singapore, Malaysia, Vietnam)", targetLaunch: "Q3 2026", distributorCount: 6, regulatoryScore: 92, status: "Regulatory Cleared", estimatedTAM: "₹ 350 Cr" },
    { region: "Middle East (UAE, Saudi Arabia)", targetLaunch: "Q4 2026", distributorCount: 4, regulatoryScore: 86, status: "Distributor Scouting", estimatedTAM: "₹ 480 Cr" },
    { region: "European Union (Germany, Netherlands)", targetLaunch: "Q2 2027", distributorCount: 2, regulatoryScore: 78, status: "CE Certification", estimatedTAM: "₹ 850 Cr" },
    { region: "East Africa (Kenya, Rwanda)", targetLaunch: "Q1 2027", distributorCount: 3, regulatoryScore: 84, status: "Feasibility Study", estimatedTAM: "₹ 180 Cr" },
  ],
  alerts: [
    {
      type: "success",
      title: "Voltaic Power Grid Licensing In Final Closing",
      desc: "Contract review concluded. Projected recurring revenue upside of ₹ 2.4 Cr/yr starting Q3.",
    },
    {
      type: "info",
      title: "APAC Channel Partner Network Expanding",
      desc: "3 distributor agreements in Singapore and Malaysia pending final signing for regional distribution.",
    },
    {
      type: "warning",
      title: "Highway Tender Submission Deadline Approaching",
      desc: "NHAI RFP-2026-018 submission deadline is in 12 days. Final financial guarantee bonds required.",
    },
  ],
  forecast: [
    { period: "Q3 2026", amount: 245000000, flow: "positive" },
    { period: "Q4 2026", amount: 310000000, flow: "positive" },
    { period: "Q1 2027", amount: 420000000, flow: "positive" },
  ],
  aiIntelligence: {
    dealVelocityScore: 88,
    pipelineHealthScore: 92,
    winPredictabilityScore: 76,
    ecosystemRiskScore: 16,
    expansionReadinessScore: 86,
    recommendations: [
      "Prioritize Voltaic Power Grid closing to secure upfront licensing capital of ₹8.2 Cr.",
      "Accelerate Master Distributor tiering in Western India where demand velocity is 28% higher than projected.",
      "Bundle AI load balancing telemetry with hardware bids to increase average RFP contract values by 18%.",
      "Expedite CE certification testing for German market entry ahead of Q2 2027 industrial exhibition.",
    ],
  },
};

export function bdOverviewOptions() {
  return queryOptions({
    queryKey: ["business-development", "overview"] as const,
    queryFn: async (): Promise<BdOverviewData> => {
      return MOCK_BD_DATA;
    },
    staleTime: 1000 * 60 * 5,
  });
}

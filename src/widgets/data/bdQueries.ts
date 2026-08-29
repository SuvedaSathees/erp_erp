import { queryOptions } from "@tanstack/react-query";

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
  };
  deals: Array<{
    id: string;
    name: string;
    stage: string;
    value: string;
    partner: string;
    probability: string;
    status: string;
  }>;
  funnel: Array<{
    label: string;
    count: number;
    val: string;
  }>;
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
  },
  deals: [
    { id: "BD-2026-089", name: "Global Automotive OEM Joint Venture", stage: "Commercial Negotiation", value: "₹ 14.5 Cr", partner: "Apex Dynamics Corp", probability: "85%", status: "High Priority" },
    { id: "BD-2026-074", name: "Next-Gen Energy Grid Licensing Deal", stage: "Contracting & Closing", value: "₹ 8.2 Cr", partner: "Voltaic Power Solutions", probability: "90%", status: "Closing" },
    { id: "BD-2026-061", name: "Smart Mobility Strategic Alliance", stage: "Proposal & RFP Submission", value: "₹ 6.8 Cr", partner: "Urban Tech Innovations", probability: "70%", status: "In Review" },
    { id: "BD-2026-052", name: "APAC Channel Partner Network Expansion", stage: "Qualification & Pitching", value: "₹ 4.5 Cr", partner: "PacRim Holdings Ltd", probability: "60%", status: "Scouting" },
    { id: "BD-2026-048", name: "IIoT Sensor Suite Technology Transfer", stage: "Active Partnership", value: "₹ 5.2 Cr", partner: "CyberFab Robotics", probability: "95%", status: "Active" },
  ],
  funnel: [
    { label: "Lead Generation & Scouting", count: 85, val: "₹ 120 Cr" },
    { label: "Qualification & Pitching", count: 54, val: "₹ 85 Cr" },
    { label: "Proposal & RFP Submission", count: 32, val: "₹ 58 Cr" },
    { label: "Commercial Negotiation", count: 18, val: "₹ 34 Cr" },
    { label: "Contracting & Closing", count: 12, val: "₹ 22 Cr" },
    { label: "Active Partnership & Account", count: 8, val: "₹ 18 Cr" },
  ],
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

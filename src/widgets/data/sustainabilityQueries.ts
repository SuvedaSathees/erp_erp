import { queryOptions } from "@tanstack/react-query";

export type SustainabilityOverviewData = {
  kpis: {
    ghgEmissions: { value: string; delta: string; isPositive: boolean; subtext: string };
    esgScorecard: { value: string; delta: string; isPositive: boolean; subtext: string };
    energyConsumption: { value: string; delta: string; isPositive: boolean; subtext: string };
    waterConsumption: { value: string; delta: string; isPositive: boolean; subtext: string };
    wasteGenerated: { value: string; caption: string; subtext: string };
    recyclingRecovery: { value: string; caption: string; subtext: string };
    carbonIntensity: { value: string; caption: string; subtext: string };
    environmentalCompliance: { value: string; caption: string; subtext: string };
    openEsgInitiatives: { value: string; caption: string; subtext: string };
    statutoryReporting: { value: string; caption: string; subtext: string };
  };
  trendData: Array<{
    month: string;
    scope12: number;
    gridEnergy: number;
    renewablePct: number;
  }>;
  healthSummary: Array<{
    label: string;
    value: string;
    target: string;
    status: "Good" | "On Track" | "Needs Attention";
  }>;
  facilityEmissions: Array<{
    facility: string;
    ghg: string;
    energy: string;
    renewable: string;
    water: string;
    compliance: string;
  }>;
  permitsStatus: Array<{
    id: string;
    permitName: string;
    agency: string;
    facility: string;
    expiryDate: string;
    status: "Valid" | "Renewal In Progress" | "Audit Due";
  }>;
  aiAdvisor: {
    status: "ACTIVE";
    subtitle: "Real-time GHG abatement & tariff optimization";
    insights: Array<{
      id: string;
      title: string;
      detail: string;
      savingEstimate: string;
      priority: "high" | "medium" | "low";
    }>;
  };
  initiativesLedger: Array<{
    id: string;
    code: string;
    title: string;
    pillar: "Environmental" | "Social" | "Governance";
    owner: string;
    targetCompletion: string;
    progress: number;
    status: "In Progress" | "Under Audit" | "Completed";
  }>;
};

export const SUSTAINABILITY_OVERVIEW_DATA: SustainabilityOverviewData = {
  kpis: {
    ghgEmissions: {
      value: "1,248 t",
      delta: "12.0% reduction vs. PY",
      isPositive: true,
      subtext: "Scopes 1, 2 & 3 total",
    },
    esgScorecard: {
      value: "92%",
      delta: "4.2% vs. Baseline",
      isPositive: true,
      subtext: "E: 87% | S: 94% | G: 98%",
    },
    energyConsumption: {
      value: "1.82 GWh",
      delta: "12.4% vs. PY",
      isPositive: true,
      subtext: "42% Renewable Power mix",
    },
    waterConsumption: {
      value: "2.16 ML",
      delta: "10.0% reduction vs. PY",
      isPositive: true,
      subtext: "38% Recycled water reused",
    },
    wasteGenerated: {
      value: "184.6 t",
      caption: "68.3% Recycled on-site",
      subtext: "12.8 t residual to landfill",
    },
    recyclingRecovery: {
      value: "83.1%",
      caption: "Landfill Diversion Rate",
      subtext: "79.4 t material recovery",
    },
    carbonIntensity: {
      value: "14.2",
      caption: "kgCO2e per EV unit",
      subtext: "Ahead of 15.0 FY26 target",
    },
    environmentalCompliance: {
      value: "95.8%",
      caption: "18 / 18 Active Permits",
      subtext: "182 / 186 conditions fully met",
    },
    openEsgInitiatives: {
      value: "14",
      caption: "Across 6 plant areas",
      subtext: "11 on track, 2 under assurance",
    },
    statutoryReporting: {
      value: "8 Reports",
      caption: "BRSR Core, GRI, TCFD",
      subtext: "92% assurance coverage",
    },
  },
  trendData: [
    { month: "Apr", scope12: 68, gridEnergy: 165, renewablePct: 36 },
    { month: "May", scope12: 65, gridEnergy: 160, renewablePct: 38 },
    { month: "Jun", scope12: 62, gridEnergy: 155, renewablePct: 39 },
    { month: "Jul", scope12: 64, gridEnergy: 158, renewablePct: 38 },
    { month: "Aug", scope12: 60, gridEnergy: 152, renewablePct: 40 },
    { month: "Sep", scope12: 56, gridEnergy: 148, renewablePct: 42 },
    { month: "Oct", scope12: 55, gridEnergy: 145, renewablePct: 42 },
    { month: "Nov", scope12: 52, gridEnergy: 140, renewablePct: 44 },
    { month: "Dec", scope12: 54, gridEnergy: 142, renewablePct: 43 },
    { month: "Jan", scope12: 50, gridEnergy: 136, renewablePct: 46 },
    { month: "Feb", scope12: 48, gridEnergy: 132, renewablePct: 47 },
    { month: "Mar", scope12: 45, gridEnergy: 128, renewablePct: 48 },
  ],
  healthSummary: [
    { label: "Verified Renewable Energy Mix", value: "42.0% (0.76 GWh)", target: "> 40.0%", status: "Good" },
    { label: "Scope 1 Direct Fuel & Fleet", value: "286 tCO2e", target: "< 320 t", status: "Good" },
    { label: "Scope 2 Grid Electricity GHG", value: "412 tCO2e", target: "< 450 t", status: "Good" },
    { label: "Water Neutrality Index", value: "88.4%", target: "> 85.0%", status: "Good" },
    { label: "Zero Waste to Landfill Rate", value: "93.1%", target: "> 90.0%", status: "Good" },
    { label: "Circular Packaging Utilization", value: "88.5%", target: "> 80.0%", status: "Good" },
  ],
  facilityEmissions: [
    { facility: "Gigafactory 1 - Chennai", ghg: "640 tCO2e", energy: "0.94 GWh", renewable: "45%", water: "1.12 ML", compliance: "100%" },
    { facility: "Plant 2 - Pune Assembly", ghg: "385 tCO2e", energy: "0.56 GWh", renewable: "40%", water: "0.68 ML", compliance: "98.5%" },
    { facility: "Battery Lab - Bengaluru", ghg: "145 tCO2e", energy: "0.22 GWh", renewable: "38%", water: "0.24 ML", compliance: "100%" },
    { facility: "Solar Microgrid Campus", ghg: "78 tCO2e", energy: "0.10 GWh", renewable: "85%", water: "0.12 ML", compliance: "100%" },
  ],
  permitsStatus: [
    { id: "p1", permitName: "Consent to Operate (Air/Water CTO)", agency: "TNPCB", facility: "Chennai Gigafactory", expiryDate: "31 Mar 2027", status: "Valid" },
    { id: "p2", permitName: "Hazardous Waste Authorization (Form 2)", agency: "MPCB", facility: "Pune Plant 2", expiryDate: "15 Dec 2026", status: "Valid" },
    { id: "p3", permitName: "Groundwater Extraction NOC", agency: "CGWA", facility: "Chennai Gigafactory", expiryDate: "30 Jun 2027", status: "Valid" },
    { id: "p4", permitName: "Battery Waste Management EPR", agency: "CPCB", facility: "Consolidated Pan-India", expiryDate: "31 Oct 2026", status: "Renewal In Progress" },
  ],
  aiAdvisor: {
    status: "ACTIVE",
    subtitle: "Real-time GHG abatement & tariff optimization",
    insights: [
      {
        id: "ai-1",
        title: "Solar Wheeling Expansion Opportunity",
        detail: "Wheeling additional 1.2 MW from Southern grid during off-peak hours could decrease Scope 2 GHG by 115 t/year.",
        savingEstimate: "₹24.5 L/yr & -115 tCO2e",
        priority: "high",
      },
      {
        id: "ai-2",
        title: "RO Reject Recirculation in Cooling Towers",
        detail: "Connecting secondary permeate to chiller cooling circuits saves 140 kL freshwater per month.",
        savingEstimate: "+6.2% Water Reuse",
        priority: "medium",
      },
      {
        id: "ai-3",
        title: "BRSR Core Principal Indicator 6 Readiness",
        detail: "Energy intensity and GHG emissions third-party assurance evidence verified for 100% of production lines.",
        savingEstimate: "Audit Ready",
        priority: "low",
      },
    ],
  },
  initiativesLedger: [
    { id: "esg-1", code: "DEC-2026-01", title: "Rooftop Solar 800 kW Phase 2 Installation", pillar: "Environmental", owner: "Rajesh Kannan", targetCompletion: "Q3 FY26", progress: 85, status: "In Progress" },
    { id: "esg-2", code: "ZLD-2026-04", title: "Zero Liquid Discharge Evaporator Upgrade", pillar: "Environmental", owner: "Priya Sundaram", targetCompletion: "Q4 FY26", progress: 92, status: "Under Audit" },
    { id: "esg-3", code: "CIR-2026-08", title: "EV Battery Packaging Returnable Crates", pillar: "Environmental", owner: "Arun Verma", targetCompletion: "Q3 FY26", progress: 100, status: "Completed" },
    { id: "esg-4", code: "GOV-2026-11", title: "BRSR Core Third-Party DNV Verification", pillar: "Governance", owner: "Kavita Rao", targetCompletion: "Q2 FY26", progress: 78, status: "In Progress" },
    { id: "esg-5", code: "SUP-2026-03", title: "Tier-1 Critical Supplier ESG Audits (Top 50)", pillar: "Social", owner: "Devendra Patel", targetCompletion: "Q4 FY26", progress: 64, status: "In Progress" },
  ],
};

export const sustainabilityOverviewOptions = queryOptions({
  queryKey: ["widgets", "sustainability-overview"],
  queryFn: async (): Promise<SustainabilityOverviewData> => {
    return SUSTAINABILITY_OVERVIEW_DATA;
  },
  staleTime: 60_000,
});

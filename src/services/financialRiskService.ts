// Magnertia ERP - Financial Risk Service
// Financial Risk Form - MAICW Classification & Capital Protection Engine

export type FinancialRiskCategory =
  | "Liquidity Risk"
  | "Credit Risk"
  | "Market Risk"
  | "Profitability Risk"
  | "Capital Risk"
  | "Tax Risk"
  | "Treasury Risk"
  | "Investment Risk"
  | "Cost Risk"
  | "Funding Risk";

export type FinancialRiskType = "Existing" | "Emerging" | "Event" | "Residual";
export type FinancialRiskPriority = "Critical" | "High" | "Medium" | "Low";
export type FinancialRiskStatus =
  | "Draft"
  | "Under Assessment"
  | "Open"
  | "Monitoring"
  | "Treatment Required"
  | "Escalated"
  | "Accepted"
  | "Verified"
  | "Closed"
  | "Archived";

export interface FinancialExposureItem {
  id: string; // Auto Number (A) e.g. EXP-001
  type:
    | "Revenue Exposure"
    | "Cost Exposure"
    | "Cash Exposure"
    | "Receivable Exposure"
    | "Payable Exposure"
    | "Debt Exposure"
    | "FX Exposure"
    | "Interest Exposure"
    | "Inventory Exposure"
    | "Investment Exposure"
    | "Tax Exposure"
    | "Contract Exposure";
  account: string;
  counterparty: string;
  grossExposure: number; // in INR Cr
  currency: string;
  currentValue: number; // in INR Cr
  potentialLoss: number; // in INR Cr
  exposureDate: string;
  maturityDate: string;
  status: "Active" | "Hedged" | "Mitigated" | "Settled";
}

export interface FinancialRiskRecord {
  id: string; // Auto Number (A) e.g. FR-2026-001
  riskCode: string; // Controlled Ref (A) e.g. RK-FIN-LIQ-01
  title: string; // Mandatory (M)
  category: FinancialRiskCategory; // Dropdown (M)
  subCategory?: string;
  type: FinancialRiskType; // Dropdown (M)
  businessFunction: string; // Lookup (M)
  department: string; // Lookup (M)
  financialProcess: string; // Lookup (M)
  businessUnit: string; // Lookup (M)
  costCenter?: string; // Lookup (I)
  project?: string; // Lookup (I)
  owner: string; // Lookup (M)
  ownerRole?: string;
  ownerAvatar?: string;
  coordinator?: string; // Lookup (I)
  coordinatorAvatar?: string;
  identificationDate: string; // Date (M)
  reviewDate: string; // Date (M)
  status: FinancialRiskStatus; // Workflow (W)
  priority: FinancialRiskPriority; // Dropdown (M)
  currency: string; // Lookup (M)
  version: string; // Number (A)
  confidentiality: "Internal" | "Confidential" | "Restricted"; // (C)

  // Risk Statement
  statement: string; // Because of [FINANCIAL CAUSE], [FINANCIAL EVENT] may occur, resulting in [FINANCIAL / BUSINESS IMPACT].
  cause: string;
  event: string;
  financialExposure: number; // in INR Cr
  potentialLoss: number; // in INR Cr
  immediateEffect?: string;
  businessImpactSummary?: string;

  // Impact Breakdown
  impacts: {
    potentialLossValue: string; // e.g. "₹ 5.0 Cr"
    revenueImpact: "Critical" | "High" | "Medium" | "Low";
    cashFlowImpact: "Critical" | "High" | "Medium" | "Low";
    supplierImpact: "Critical" | "High" | "Medium" | "Low";
  };

  // Assessment & Scores
  likelihood: number; // 1-5
  impact: number; // 1-5
  inherentScore: number; // Likelihood x Impact (1-25)
  inherentLevel: "Low" | "Moderate" | "High" | "Critical";

  residualLikelihood: number; // 1-5
  residualImpact: number; // 1-5
  residualScore: number; // 1-25
  residualLevel: "Low" | "Moderate" | "High" | "Critical";

  controlEffectiveness: "Effective" | "Partially Effective" | "Ineffective" | "Not Tested";
  treatmentStrategy: "Avoid" | "Reduce" | "Transfer" | "Accept" | "Hedge" | "Diversify";
}

export interface FinancialKRI {
  id: string;
  name: string;
  category: "Liquidity" | "Credit" | "Profitability" | "Debt" | "Working Capital" | "Market";
  current: string;
  threshold: string;
  status: "Red" | "Amber" | "Green";
  trend: "up" | "down" | "neutral";
  metric: string;
  owner: string;
  dataSource: string;
}

export interface FinancialActionItem {
  id: string;
  action: string;
  category: string;
  owner: string;
  dueDate: string;
  budget: string;
  status: "In Progress" | "Open" | "Not Started" | "Completed" | "Verified";
  evidence?: string;
}

export interface FinancialStressScenario {
  id: string;
  name: string;
  assumptions: string;
  revenueImpact: string;
  costImpact: string;
  cashImpact: string;
  ebitdaImpact: string;
  workingCapitalImpact: string;
  fundingImpact: string;
  covenantStatus: "Safe" | "Approaching Limit" | "Breach Warning";
  recoveryPlan: string;
}

export interface FinancialControlItem {
  id: string;
  controlName: string;
  type: "Preventive" | "Detective" | "Corrective" | "Compensating";
  nature: "Automated" | "Manual" | "Hybrid";
  frequency: "Real-time" | "Daily" | "Weekly" | "Monthly" | "Quarterly";
  owner: string;
  designEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  operatingEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  result: "Pass" | "Exception" | "Under Remediation";
  relatedSOP: string;
}

// PRIMARY MASTER RECORD MATCHING SCREENSHOT EXACTLY
export const PRIMARY_FINANCIAL_RISK: FinancialRiskRecord = {
  id: "FR-2026-001",
  riskCode: "RK-FIN-LIQ-01",
  title: "Cash Flow Shortage due to Delayed Collections",
  category: "Liquidity Risk",
  subCategory: "Working Capital Shortage",
  type: "Existing",
  businessFunction: "Finance",
  department: "Finance & Accounts",
  financialProcess: "Cash Flow Management",
  businessUnit: "EV Charging Solutions",
  costCenter: "FIN-001",
  project: "Public Charging Stations",
  owner: "Arun Kumar",
  ownerRole: "Chief Financial Officer (CFO)",
  ownerAvatar: "AK",
  coordinator: "Priya Sharma",
  coordinatorAvatar: "PS",
  identificationDate: "15-Sep-2026",
  reviewDate: "15-Nov-2026",
  status: "Monitoring",
  priority: "High",
  currency: "INR (₹)",
  version: "1.0",
  confidentiality: "Internal",

  statement:
    "Because of delayed customer collections from fleet and enterprise clients, a cash flow shortage may occur, resulting in inability to meet supplier payments and project execution delays.",
  cause: "Delayed customer collections from enterprise fleet accounts exceeding 60-day credit windows",
  event: "Working capital cash shortfall during peak raw material procurement cycle",
  financialExposure: 48.5,
  potentialLoss: 5.0,
  immediateEffect: "Delayed disbursements to tier-1 power electronic suppliers",
  businessImpactSummary: "Compromised commissioning timelines for 120 fast-charging hubs",

  impacts: {
    potentialLossValue: "₹ 5.0 Cr",
    revenueImpact: "High",
    cashFlowImpact: "High",
    supplierImpact: "Medium",
  },

  likelihood: 4, // Likely
  impact: 5, // Severe
  inherentScore: 20, // 4 x 5
  inherentLevel: "Critical",

  residualLikelihood: 3, // Possible
  residualImpact: 4, // Major
  residualScore: 12, // 3 x 4
  residualLevel: "High",

  controlEffectiveness: "Partially Effective",
  treatmentStrategy: "Reduce",
};

// TOP 5 FINANCIAL RISKS TABLE (SCREENSHOT MATCH)
export const TOP_FINANCIAL_RISKS = [
  {
    id: "FR-001",
    title: "Cash Flow Shortage",
    category: "Liquidity",
    inherent: 20,
    residual: 12,
    trend: "up" as const,
    trendColor: "red",
    status: "Monitoring" as const,
  },
  {
    id: "FR-002",
    title: "Customer Default Risk",
    category: "Credit",
    inherent: 16,
    residual: 9,
    trend: "up" as const,
    trendColor: "red",
    status: "Open" as const,
  },
  {
    id: "FR-003",
    title: "FX Rate Volatility",
    category: "Market",
    inherent: 15,
    residual: 8,
    trend: "neutral" as const,
    trendColor: "slate",
    status: "Monitoring" as const,
  },
  {
    id: "FR-004",
    title: "Raw Material Cost Increase",
    category: "Cost",
    inherent: 12,
    residual: 6,
    trend: "up" as const,
    trendColor: "red",
    status: "Open" as const,
  },
  {
    id: "FR-005",
    title: "Fundraising Delay",
    category: "Funding",
    inherent: 16,
    residual: 8,
    trend: "down" as const,
    trendColor: "green",
    status: "Monitoring" as const,
  },
];

// KEY RISK INDICATORS TABLE (SCREENSHOT MATCH)
export const FINANCIAL_KRIS: FinancialKRI[] = [
  {
    id: "KRI-FIN-01",
    name: "DSO (Days)",
    category: "Credit",
    current: "68",
    threshold: "> 60",
    status: "Red",
    trend: "up",
    metric: "Days Sales Outstanding",
    owner: "Credit Control Desk",
    dataSource: "AR Sub-Ledger",
  },
  {
    id: "KRI-FIN-02",
    name: "Cash Balance (₹ Cr)",
    category: "Liquidity",
    current: "2.1",
    threshold: "< 3.0",
    status: "Red",
    trend: "up",
    metric: "Unencumbered Liquid Cash",
    owner: "Treasury Head",
    dataSource: "Bank API / Treasury",
  },
  {
    id: "KRI-FIN-03",
    name: "AR Overdue (%)",
    category: "Credit",
    current: "28%",
    threshold: "> 20%",
    status: "Red",
    trend: "up",
    metric: "Overdue Receivables Ratio",
    owner: "Finance Collections",
    dataSource: "ERP Billing & AR",
  },
  {
    id: "KRI-FIN-04",
    name: "Inventory Coverage (Days)",
    category: "Working Capital",
    current: "18",
    threshold: "< 20",
    status: "Amber",
    trend: "down",
    metric: "Days Inventory Outstanding",
    owner: "Inventory Controller",
    dataSource: "Warehouse ERP",
  },
  {
    id: "KRI-FIN-05",
    name: "Debt to Equity",
    category: "Debt",
    current: "1.8",
    threshold: "> 2.0",
    status: "Green",
    trend: "neutral",
    metric: "Leverage Gearing Ratio",
    owner: "FP&A Desk",
    dataSource: "General Ledger",
  },
  {
    id: "KRI-FIN-06",
    name: "Interest Coverage Ratio",
    category: "Debt",
    current: "3.2",
    threshold: "< 2.0",
    status: "Green",
    trend: "up",
    metric: "EBITDA / Interest Obligation",
    owner: "Treasury Desk",
    dataSource: "FP&A Quarterly Review",
  },
  {
    id: "KRI-FIN-07",
    name: "FX Exposure (₹ Cr)",
    category: "Market",
    current: "6.5",
    threshold: "> 5.0",
    status: "Amber",
    trend: "up",
    metric: "Unhedged Foreign Currency",
    owner: "Forex Specialist",
    dataSource: "Import PO Commitments",
  },
];

// RISK TREATMENT ACTIONS TABLE (SCREENSHOT MATCH)
export const FINANCIAL_TREATMENT_ACTIONS: FinancialActionItem[] = [
  {
    id: "ACT-FIN-01",
    action: "Intensify customer collection",
    category: "Credit Control",
    owner: "Arun Kumar",
    dueDate: "30-Sep-2026",
    budget: "₹ 5.0 L",
    status: "In Progress",
    evidence: "Weekly DSO war-room meetings with top 10 enterprise fleet clients",
  },
  {
    id: "ACT-FIN-02",
    action: "Negotiate supplier payment terms",
    category: "Working Capital",
    owner: "Priya Sharma",
    dueDate: "15-Oct-2026",
    budget: "₹ 2.5 L",
    status: "Open",
    evidence: "Draft amendments sent to key IGBT & transformer suppliers for 75-day terms",
  },
  {
    id: "ACT-FIN-03",
    action: "Increase working capital facility",
    category: "Liquidity",
    owner: "CFO",
    dueDate: "30-Oct-2026",
    budget: "₹ 15.0 L",
    status: "Open",
    evidence: "Submitted ₹25 Cr credit line enhancement dossier to Consortium Bank",
  },
  {
    id: "ACT-FIN-04",
    action: "Hedge USD exposure",
    category: "Treasury / Forex",
    owner: "Finance Team",
    dueDate: "15-Nov-2026",
    budget: "₹ 12.0 L",
    status: "Not Started",
    evidence: "Awaiting board approval for 60% forward contracts on Q3 component imports",
  },
  {
    id: "ACT-FIN-05",
    action: "Review pricing strategy",
    category: "Pricing & Margin",
    owner: "Sales & Finance",
    dueDate: "30-Nov-2026",
    budget: "₹ 4.0 L",
    status: "Not Started",
    evidence: "Indexed raw copper and semiconductor surcharge clauses in public tenders",
  },
];

// EXPOSURE TREND (₹ Cr) OVER 6 MONTHS (SCREENSHOT MATCH)
export const FINANCIAL_EXPOSURE_TREND = [
  { month: "Apr", totalExposure: 26, potentialLoss: 14, recoveredMitigated: 6 },
  { month: "May", totalExposure: 32, potentialLoss: 17, recoveredMitigated: 7 },
  { month: "Jun", totalExposure: 38, potentialLoss: 20, recoveredMitigated: 8 },
  { month: "Jul", totalExposure: 41, potentialLoss: 22, recoveredMitigated: 9 },
  { month: "Aug", totalExposure: 44, potentialLoss: 24, recoveredMitigated: 10 },
  { month: "Sep", totalExposure: 48.5, potentialLoss: 25.5, recoveredMitigated: 11.5 },
];

// RISK BY CATEGORY DONUT DISTRIBUTION (SCREENSHOT MATCH: 52 TOTAL RISKS)
export const FINANCIAL_CATEGORY_DISTRIBUTION = [
  { name: "Liquidity", percentage: 19, count: 10, color: "#3b82f6" },
  { name: "Credit", percentage: 17, count: 9, color: "#f59e0b" },
  { name: "Market", percentage: 12, count: 6, color: "#06b6d4" },
  { name: "Profitability", percentage: 12, count: 6, color: "#10b981" },
  { name: "Cost", percentage: 10, count: 5, color: "#ef4444" },
  { name: "Tax", percentage: 8, count: 4, color: "#8b5cf6" },
  { name: "Treasury", percentage: 8, count: 4, color: "#ec4899" },
  { name: "Funding", percentage: 8, count: 4, color: "#6366f1" },
  { name: "Investment", percentage: 6, count: 3, color: "#14b8a6" },
  { name: "Others", percentage: 6, count: 3, color: "#64748b" },
];

// AI FINANCIAL RISK INSIGHTS (SCREENSHOT MATCH: 6 POINTS)
export const FINANCIAL_AI_INSIGHTS = [
  {
    num: 1,
    color: "bg-emerald-500 text-white",
    text: "Cash flow risk is increasing due to higher DSO (68 days).",
  },
  {
    num: 2,
    color: "bg-blue-500 text-white",
    text: "Customer concentration risk detected (Top 3 = 62% of revenue).",
  },
  {
    num: 3,
    color: "bg-rose-500 text-white",
    text: "FX exposure may increase by 25% if INR depreciates by 5%.",
  },
  {
    num: 4,
    color: "bg-amber-500 text-white",
    text: "Raw material costs are 18% above budget.",
  },
  {
    num: 5,
    color: "bg-teal-500 text-white",
    text: "Recommend securing additional credit facility of ₹10 Cr.",
  },
  {
    num: 6,
    color: "bg-emerald-600 text-white",
    text: "Overall financial risk exposure is above acceptable tolerance.",
  },
];

// FULL REGISTER DATASET (52 FINANCIAL RISKS)
export const FULL_FINANCIAL_RISKS: FinancialRiskRecord[] = [
  PRIMARY_FINANCIAL_RISK,
  {
    id: "FR-2026-002",
    riskCode: "RK-FIN-CRD-02",
    title: "Customer Default Risk on Megawatt Fleet Deployments",
    category: "Credit Risk",
    subCategory: "Customer Default",
    type: "Existing",
    businessFunction: "Finance",
    department: "Finance & Accounts",
    financialProcess: "Credit Control",
    businessUnit: "Commercial Fleet EV",
    costCenter: "FIN-002",
    project: "Highway Supercharging Hubs",
    owner: "Arun Kumar",
    ownerRole: "CFO",
    ownerAvatar: "AK",
    coordinator: "Priya Sharma",
    coordinatorAvatar: "PS",
    identificationDate: "10-Aug-2026",
    reviewDate: "10-Oct-2026",
    status: "Open",
    priority: "Critical",
    currency: "INR (₹)",
    version: "1.2",
    confidentiality: "Restricted",
    statement:
      "Because of delayed state transit subsidies to fleet operators, customer default may occur, resulting in ₹6.2 Cr uncollectible receivables and ECL provisioning.",
    cause: "State government green mobility subsidy disbursement bottlenecks",
    event: "Failure to clear milestone payments past 90 days",
    financialExposure: 18.2,
    potentialLoss: 6.2,
    immediateEffect: "Accounts receivable provisioning write-down",
    businessImpactSummary: "Working capital impairment and bank debt covenant pressure",
    impacts: {
      potentialLossValue: "₹ 6.2 Cr",
      revenueImpact: "High",
      cashFlowImpact: "Critical",
      supplierImpact: "Medium",
    },
    likelihood: 4,
    impact: 4,
    inherentScore: 16,
    inherentLevel: "High",
    residualLikelihood: 3,
    residualImpact: 3,
    residualScore: 9,
    residualLevel: "Moderate",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Reduce",
  },
  {
    id: "FR-2026-003",
    riskCode: "RK-FIN-MKT-03",
    title: "FX Rate Volatility on Imported Power Electronics",
    category: "Market Risk",
    subCategory: "Foreign Exchange",
    type: "Existing",
    businessFunction: "Finance",
    department: "Treasury",
    financialProcess: "Forex Management",
    businessUnit: "Manufacturing & Assembly",
    costCenter: "FIN-003",
    project: "Ultra Fast DC Chargers",
    owner: "Vikram Malhotra",
    ownerRole: "Treasury Specialist",
    ownerAvatar: "VM",
    coordinator: "Kavita Rao",
    coordinatorAvatar: "KR",
    identificationDate: "01-Jul-2026",
    reviewDate: "01-Dec-2026",
    status: "Monitoring",
    priority: "High",
    currency: "USD ($)",
    version: "1.1",
    confidentiality: "Internal",
    statement:
      "Because of unhedged USD purchase contracts for high-voltage silicon carbide transistors, currency depreciation may occur, resulting in gross margin erosion of 4.2%.",
    cause: "INR/USD exchange rate volatility and delayed central bank interventions",
    event: "USD rate surge beyond ₹85/USD without forward hedging cover",
    financialExposure: 15.0,
    potentialLoss: 2.8,
    immediateEffect: "Direct hike in landed component acquisition costs",
    businessImpactSummary: "Target gross margin compressed from 32% down to 27.8%",
    impacts: {
      potentialLossValue: "₹ 2.8 Cr",
      revenueImpact: "Medium",
      cashFlowImpact: "High",
      supplierImpact: "Low",
    },
    likelihood: 5,
    impact: 3,
    inherentScore: 15,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Hedge",
  },
  {
    id: "FR-2026-004",
    riskCode: "RK-FIN-CST-04",
    title: "Raw Material Cost Escalation on Electrolytic Copper Busbars",
    category: "Cost Risk",
    subCategory: "Raw Material Cost",
    type: "Existing",
    businessFunction: "Finance",
    department: "Cost Accounting",
    financialProcess: "Standard Costing",
    businessUnit: "Charger Fabrication",
    costCenter: "FIN-004",
    project: "High-Power Disconnect Assemblies",
    owner: "Siddharth Verma",
    ownerRole: "Cost Controller",
    ownerAvatar: "SV",
    coordinator: "Priya Sharma",
    coordinatorAvatar: "PS",
    identificationDate: "20-Aug-2026",
    reviewDate: "20-Nov-2026",
    status: "Open",
    priority: "High",
    currency: "INR (₹)",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Because of global copper commodity price spikes, product cost escalation may occur, resulting in ₹1.8 Cr budget overrun on pending order fulfillment.",
    cause: "Supply squeeze on refined cathode copper and elevated logistics freight surcharges",
    event: "LME copper spot prices surpassing $10,500/MT",
    financialExposure: 12.0,
    potentialLoss: 1.8,
    immediateEffect: "Negative purchase price variance in monthly management reports",
    businessImpactSummary: "Project margin dilution across fixed-price EPC contracts",
    impacts: {
      potentialLossValue: "₹ 1.8 Cr",
      revenueImpact: "Medium",
      cashFlowImpact: "Medium",
      supplierImpact: "High",
    },
    likelihood: 4,
    impact: 3,
    inherentScore: 12,
    inherentLevel: "High",
    residualLikelihood: 3,
    residualImpact: 2,
    residualScore: 6,
    residualLevel: "Moderate",
    controlEffectiveness: "Partially Effective",
    treatmentStrategy: "Reduce",
  },
  {
    id: "FR-2026-005",
    riskCode: "RK-FIN-FND-05",
    title: "Fundraising Delay on Series-B Equity Tranche",
    category: "Funding Risk",
    subCategory: "Fundraising Delay",
    type: "Existing",
    businessFunction: "Finance",
    department: "Corporate Finance",
    financialProcess: "Capital Strategy",
    businessUnit: "Enterprise Strategy",
    costCenter: "FIN-005",
    project: "Gigafactory Phase 2 Expansion",
    owner: "Arun Kumar",
    ownerRole: "CFO",
    ownerAvatar: "AK",
    coordinator: "Vikram Malhotra",
    coordinatorAvatar: "VM",
    identificationDate: "12-Sep-2026",
    reviewDate: "12-Nov-2026",
    status: "Monitoring",
    priority: "Critical",
    currency: "INR (₹)",
    version: "2.0",
    confidentiality: "Restricted",
    statement:
      "Because of extended due diligence by institutional climate-tech funds, a funding delay may occur, resulting in deferred capital expenditure and delayed factory expansion.",
    cause: "Extended macroeconomic valuation adjustments and cross-border regulatory approvals",
    event: "Series-B term sheet closing deferred beyond Q3 FY26",
    financialExposure: 35.0,
    potentialLoss: 4.5,
    immediateEffect: "Temporary freeze on equipment advance disbursements for automated SMT line",
    businessImpactSummary: "Commercial commissioning date pushed by 4 months",
    impacts: {
      potentialLossValue: "₹ 4.5 Cr",
      revenueImpact: "Critical",
      cashFlowImpact: "Critical",
      supplierImpact: "High",
    },
    likelihood: 4,
    impact: 4,
    inherentScore: 16,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Diversify",
  },
  {
    id: "FR-2026-006",
    riskCode: "RK-FIN-PRF-06",
    title: "Margin Compression from Competitive EV Charger Bidding",
    category: "Profitability Risk",
    subCategory: "Margin Compression",
    type: "Existing",
    businessFunction: "Finance",
    department: "Commercial Finance",
    financialProcess: "Pricing Approval",
    businessUnit: "Commercial EV Infra",
    owner: "Suresh Pillai",
    status: "Monitoring",
    priority: "Medium",
    currency: "INR (₹)",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Because of aggressive pricing moves by tier-2 domestic assemblers, margin compression may occur, resulting in EBITDA margin falling below 14%.",
    cause: "Price war in public municipal tender bidding",
    event: "Contract awards at discounts exceeding approved pricing guidelines",
    financialExposure: 8.5,
    potentialLoss: 1.2,
    impacts: {
      potentialLossValue: "₹ 1.2 Cr",
      revenueImpact: "Medium",
      cashFlowImpact: "Medium",
      supplierImpact: "Low",
    },
    likelihood: 3,
    impact: 3,
    inherentScore: 9,
    inherentLevel: "Moderate",
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualLevel: "Moderate",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Reduce",
    identificationDate: "05-Sep-2026",
    reviewDate: "05-Dec-2026",
  },
  {
    id: "FR-2026-007",
    riskCode: "RK-FIN-TAX-07",
    title: "GST Input Tax Credit Disallowance on High-Value EPC Components",
    category: "Tax Risk",
    subCategory: "GST Exposure",
    type: "Existing",
    businessFunction: "Finance",
    department: "Taxation",
    financialProcess: "Statutory Compliance",
    businessUnit: "Infrastructure Services",
    owner: "Meenakshi Sundaram",
    status: "Open",
    priority: "High",
    currency: "INR (₹)",
    version: "1.1",
    confidentiality: "Internal",
    statement:
      "Because of non-filing of GSTR-1 by secondary subcontractor vendors, ITC reversal notices may occur, resulting in cash outflow of ₹1.6 Cr plus 18% statutory interest.",
    cause: "Vendor portal reconciliation gaps in vendor tax compliance",
    event: "GSTR-2B mismatches triggering department demand orders",
    financialExposure: 9.8,
    potentialLoss: 1.6,
    impacts: {
      potentialLossValue: "₹ 1.6 Cr",
      revenueImpact: "Low",
      cashFlowImpact: "High",
      supplierImpact: "High",
    },
    likelihood: 4,
    impact: 3,
    inherentScore: 12,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 2,
    residualScore: 4,
    residualLevel: "Low",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Avoid",
    identificationDate: "15-Aug-2026",
    reviewDate: "15-Nov-2026",
  },
  {
    id: "FR-2026-008",
    riskCode: "RK-FIN-INT-08",
    title: "Interest Rate Hike on Floating-Rate Working Capital Consortium Debt",
    category: "Market Risk",
    subCategory: "Interest Rate",
    type: "Existing",
    businessFunction: "Finance",
    department: "Treasury",
    financialProcess: "Debt Management",
    businessUnit: "Corporate Finance",
    owner: "Arun Kumar",
    status: "Monitoring",
    priority: "Medium",
    currency: "INR (₹)",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Because of RBI repo rate upward revisions, floating benchmark rates may increase by 75 bps, resulting in ₹95 Lakh annual increase in finance costs.",
    cause: "Inflationary pressures prompting central bank benchmark rate tightening",
    event: "MCLR escalation across consortium banks",
    financialExposure: 22.0,
    potentialLoss: 0.95,
    impacts: {
      potentialLossValue: "₹ 0.95 Cr",
      revenueImpact: "Low",
      cashFlowImpact: "Medium",
      supplierImpact: "Low",
    },
    likelihood: 3,
    impact: 3,
    inherentScore: 9,
    inherentLevel: "Moderate",
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualLevel: "Moderate",
    controlEffectiveness: "Partially Effective",
    treatmentStrategy: "Reduce",
    identificationDate: "01-Aug-2026",
    reviewDate: "01-Feb-2027",
  },
  {
    id: "FR-2026-009",
    riskCode: "RK-FIN-TRZ-09",
    title: "Cash Concentration in Single Private Sector Bank",
    category: "Treasury Risk",
    subCategory: "Cash Concentration",
    type: "Existing",
    businessFunction: "Finance",
    department: "Treasury",
    financialProcess: "Cash Management",
    businessUnit: "Treasury Desk",
    owner: "Vikram Malhotra",
    status: "Treatment Required",
    priority: "High",
    currency: "INR (₹)",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Because 72% of operational liquidity is concentrated in a single private commercial bank, credit rating downgrades or operational outages may occur, resulting in payment halts.",
    cause: "Legacy operating accounts lacking auto-sweeping mechanisms into PSU scheduled banks",
    event: "Bank system freeze or moratorium restriction during payroll processing",
    financialExposure: 14.5,
    potentialLoss: 3.0,
    impacts: {
      potentialLossValue: "₹ 3.0 Cr",
      revenueImpact: "Low",
      cashFlowImpact: "Critical",
      supplierImpact: "Critical",
    },
    likelihood: 2,
    impact: 5,
    inherentScore: 10,
    inherentLevel: "High",
    residualLikelihood: 1,
    residualImpact: 4,
    residualScore: 4,
    residualLevel: "Low",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Diversify",
    identificationDate: "18-Sep-2026",
    reviewDate: "18-Dec-2026",
  },
  {
    id: "FR-2026-010",
    riskCode: "RK-FIN-CAP-10",
    title: "Capital Structure Imbalance and Debt Service Coverage Compression",
    category: "Capital Risk",
    subCategory: "Debt Maturity",
    type: "Emerging",
    businessFunction: "Finance",
    department: "Corporate Finance",
    financialProcess: "Capital Structure",
    businessUnit: "Corporate",
    owner: "Arun Kumar",
    status: "Monitoring",
    priority: "Critical",
    currency: "INR (₹)",
    version: "1.0",
    confidentiality: "Restricted",
    statement:
      "Because of clustered term debt maturities in FY27 alongside heavy CAPEX commitments, DSCR may dip below 1.25x covenant threshold, triggering default penalties.",
    cause: "Simultaneous balloon repayment on equipment loans and delayed customer project milestones",
    event: "Bank covenant breach triggering accelerated repayment clause",
    financialExposure: 28.0,
    potentialLoss: 5.5,
    impacts: {
      potentialLossValue: "₹ 5.5 Cr",
      revenueImpact: "High",
      cashFlowImpact: "Critical",
      supplierImpact: "Medium",
    },
    likelihood: 3,
    impact: 5,
    inherentScore: 15,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Reduce",
    identificationDate: "02-Sep-2026",
    reviewDate: "02-Dec-2026",
  },
];

// FINANCIAL EXPOSURES REGISTER (SECTION 5)
export const FINANCIAL_EXPOSURE_REGISTER: FinancialExposureItem[] = [
  {
    id: "EXP-001",
    type: "Receivable Exposure",
    account: "GL-11000 Trade Debtors",
    counterparty: "MegaFleet Logistics Ltd",
    grossExposure: 18.5,
    currency: "INR",
    currentValue: 14.2,
    potentialLoss: 3.5,
    exposureDate: "01-Jul-2026",
    maturityDate: "30-Sep-2026",
    status: "Active",
  },
  {
    id: "EXP-002",
    type: "Payable Exposure",
    account: "GL-21000 Trade Creditors",
    counterparty: "Semikron Electronics SE",
    grossExposure: 11.2,
    currency: "EUR",
    currentValue: 9.8,
    potentialLoss: 1.2,
    exposureDate: "15-Aug-2026",
    maturityDate: "15-Nov-2026",
    status: "Active",
  },
  {
    id: "EXP-003",
    type: "FX Exposure",
    account: "GL-12500 Import Open LC",
    counterparty: "Shenzhen Power Modules Corp",
    grossExposure: 6.5,
    currency: "USD",
    currentValue: 6.5,
    potentialLoss: 0.8,
    exposureDate: "01-Sep-2026",
    maturityDate: "01-Dec-2026",
    status: "Active",
  },
  {
    id: "EXP-004",
    type: "Debt Exposure",
    account: "GL-22000 Term Loans",
    counterparty: "State Bank of India (Consortium Lead)",
    grossExposure: 22.0,
    currency: "INR",
    currentValue: 19.5,
    potentialLoss: 2.2,
    exposureDate: "01-Apr-2025",
    maturityDate: "31-Mar-2030",
    status: "Active",
  },
  {
    id: "EXP-005",
    type: "Tax Exposure",
    account: "GL-21500 GST Payable",
    counterparty: "GST State Tax Authority",
    grossExposure: 4.8,
    currency: "INR",
    currentValue: 3.2,
    potentialLoss: 1.6,
    exposureDate: "20-Aug-2026",
    maturityDate: "20-Oct-2026",
    status: "Active",
  },
];

// FINANCIAL CONTROLS MASTER (SECTION 27 & 28)
export const FINANCIAL_CONTROLS_MASTER: FinancialControlItem[] = [
  {
    id: "CTL-FIN-01",
    controlName: "Dual-Signatory Maker-Checker Payment Authorization",
    type: "Preventive",
    nature: "Automated",
    frequency: "Real-time",
    owner: "CFO & Treasury Desk",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Pass",
    relatedSOP: "SOP-FIN-04 Banking & Disbursements",
  },
  {
    id: "CTL-FIN-02",
    controlName: "Daily Automated Three-Way Bank Reconciliation",
    type: "Detective",
    nature: "Automated",
    frequency: "Daily",
    owner: "Accounts Supervisor",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Pass",
    relatedSOP: "SOP-FIN-09 Bank & Cash Accounting",
  },
  {
    id: "CTL-FIN-03",
    controlName: "Customer Credit Limit Enforcement on Sales Order Release",
    type: "Preventive",
    nature: "Automated",
    frequency: "Real-time",
    owner: "Credit Control Desk",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Exception",
    relatedSOP: "SOP-FIN-12 Customer Credit Governance",
  },
  {
    id: "CTL-FIN-04",
    controlName: "Three-Way Match Verification on Vendor Invoices (PO, GRN, Bill)",
    type: "Preventive",
    nature: "Automated",
    frequency: "Real-time",
    owner: "AP Verification Team",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Pass",
    relatedSOP: "SOP-FIN-02 Accounts Payable Verification",
  },
  {
    id: "CTL-FIN-05",
    controlName: "Quarterly FX Forward Hedging Mandate Compliance",
    type: "Compensating",
    nature: "Hybrid",
    frequency: "Quarterly",
    owner: "Treasury Head",
    designEffectiveness: "Partially Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Under Remediation",
    relatedSOP: "SOP-FIN-18 Foreign Exchange & Derivatives",
  },
];

// FINANCIAL STRESS TEST SCENARIOS (SECTIONS 36 & 37)
export const FINANCIAL_STRESS_SCENARIOS: FinancialStressScenario[] = [
  {
    id: "SCN-FIN-01",
    name: "Severe Economic Downturn & 30% Revenue Decline",
    assumptions: "Revenue drops 30%, customer DSO stretches to 90 days, fixed overheads stay flat",
    revenueImpact: "- ₹18.5 Cr (-30%)",
    costImpact: "+ ₹1.2 Cr in carrying costs",
    cashImpact: "- ₹14.8 Cr net cash burn",
    ebitdaImpact: "EBITDA drops from 16% to 2.4%",
    workingCapitalImpact: "Working capital cycle stretches from 42 to 78 days",
    fundingImpact: "Requires ₹12 Cr bridge debt facility",
    covenantStatus: "Breach Warning",
    recoveryPlan: "Implement immediate hiring freeze, defer non-critical CAPEX, draw ₹15 Cr backup bank line",
  },
  {
    id: "SCN-FIN-02",
    name: "FX Depreciation of INR by 15% vs USD & EUR",
    assumptions: "USD hits ₹92, unhedged imported power electronics landed cost rises 15%",
    revenueImpact: "No direct impact",
    costImpact: "+ ₹4.2 Cr landed material cost hike",
    cashImpact: "- ₹3.8 Cr foreign currency settlement shortfall",
    ebitdaImpact: "EBITDA compressed by 280 bps",
    workingCapitalImpact: "Import LC margins increase by ₹2.5 Cr",
    fundingImpact: "Within current operational liquidity buffer",
    covenantStatus: "Safe",
    recoveryPlan: "Execute mandatory 70% forward contracts, trigger price escalator clauses in long-term AMC contracts",
  },
  {
    id: "SCN-FIN-03",
    name: "Customer Default on Top 2 Fleet Clients",
    assumptions: "Write-off of ₹8.4 Cr receivables and immediate suspension of 40 hub deployments",
    revenueImpact: "- ₹12.0 Cr pipeline cancellation",
    costImpact: "+ ₹8.4 Cr ECL write-down",
    cashImpact: "- ₹7.5 Cr direct collection gap",
    ebitdaImpact: "Quarterly net loss of ₹3.8 Cr",
    workingCapitalImpact: "AR overdue % surges past 45%",
    fundingImpact: "Emergency equity drawdown required",
    covenantStatus: "Approaching Limit",
    recoveryPlan: "Invoke bank guarantees, repossess hardware assets, renegotiate vendor staggered payments",
  },
  {
    id: "SCN-FIN-04",
    name: "Benchmark Interest Rate Hike of +200 bps",
    assumptions: "Consortium floating rate loans rise from 9.25% to 11.25%",
    revenueImpact: "No direct impact",
    costImpact: "+ ₹1.65 Cr annual debt service hike",
    cashImpact: "- ₹14 Lakh additional monthly interest outflow",
    ebitdaImpact: "Net profit compressed by 95 bps",
    workingCapitalImpact: "Elevated borrowing cost on working capital OD limits",
    fundingImpact: "Refinance with fixed-coupon green bonds",
    covenantStatus: "Safe",
    recoveryPlan: "Accelerate debt prepayment from Q4 operational cash flow surplus, lock interest rate caps",
  },
];

// MAICW FIELD TAXONOMY (SECTION 1)
export const FINANCIAL_MAICW_FIELDS = [
  { field: "Financial Risk ID", type: "Auto Number", maicw: "A", description: "Unique ERP financial risk code (FR-YYYY-XXX)" },
  { field: "Risk Code", type: "Text", maicw: "A", description: "Controlled reference e.g. RK-FIN-LIQ-01" },
  { field: "Risk Title", type: "Text", maicw: "M", description: "Short descriptive risk title (Mandatory)" },
  { field: "Risk Category", type: "Dropdown", maicw: "M", description: "Liquidity, Credit, Market, Profitability, Capital, etc." },
  { field: "Risk Type", type: "Dropdown", maicw: "M", description: "Existing, Emerging, Event, Residual" },
  { field: "Business Function", type: "Lookup", maicw: "M", description: "Affected organizational function (Finance)" },
  { field: "Department", type: "Lookup", maicw: "M", description: "Responsible department (Finance & Accounts)" },
  { field: "Financial Process", type: "Lookup", maicw: "M", description: "Cash Flow, AR, AP, Treasury, FP&A, Pricing" },
  { field: "Business Unit", type: "Lookup", maicw: "M", description: "Operating business unit or subsidiary" },
  { field: "Cost Center", type: "Lookup", maicw: "I", description: "Assigned cost center (FIN-001)" },
  { field: "Project", type: "Lookup", maicw: "I", description: "Related project code (Public Charging Stations)" },
  { field: "Risk Owner", type: "Lookup", maicw: "M", description: "Accountable owner (CFO / Finance Controller)" },
  { field: "Finance Coordinator", type: "Lookup", maicw: "I", description: "Designated finance risk manager" },
  { field: "Identification Date", type: "Date", maicw: "M", description: "Date risk was initially cataloged" },
  { field: "Review Date", type: "Date", maicw: "M", description: "Scheduled periodic review date" },
  { field: "Status", type: "Workflow", maicw: "W", description: "Draft, Under Assessment, Open, Monitoring, Escalated, Closed" },
  { field: "Priority", type: "Dropdown", maicw: "M", description: "Critical, High, Medium, Low" },
  { field: "Currency", type: "Lookup", maicw: "M", description: "INR, USD, EUR, GBP, JPY" },
  { field: "Version", type: "Number", maicw: "A", description: "Automated version control tracking" },
  { field: "Confidentiality", type: "Dropdown", maicw: "C", description: "Internal, Confidential, Restricted" },
];

// REPORTS SUITE (SECTION 47)
export const FINANCIAL_REPORT_DEFINITIONS = [
  { id: "FR-REP-01", name: "Financial Risk Register", category: "Portfolio", desc: "Complete financial risk portfolio with inherent and residual scores" },
  { id: "FR-REP-02", name: "Financial Risk Executive Dashboard", category: "Executive", desc: "CFO-level exposure snapshot, risk velocity, and KRIs" },
  { id: "FR-REP-03", name: "Liquidity & Cash Runway Exposure", category: "Liquidity", desc: "Cash burn, liquidity buffers, and 90-day cash conversion forecast" },
  { id: "FR-REP-04", name: "Cash Flow Risk & Variance Dossier", category: "Cash Flow", desc: "Collections vs obligations, operating cash gaps, and burn indicators" },
  { id: "FR-REP-05", name: "Credit Risk & Customer Aging Matrix", category: "Credit", desc: "DSO, overdue receivables, ECL provisioning, and top customer exposure" },
  { id: "FR-REP-06", name: "Accounts Payable & Supplier Concentration", category: "Payables", desc: "Critical vendor aging, concentration risk, and supply chain continuity" },
  { id: "FR-REP-07", name: "Working Capital Optimization Report", category: "Working Capital", desc: "DIO, DSO, DPO, and cash conversion cycle efficiency" },
  { id: "FR-REP-08", name: "Foreign Exchange Exposure & Hedging", category: "Market", desc: "Open import/export contracts, forward cover %, and FX sensitivity" },
  { id: "FR-REP-09", name: "Interest Rate Risk & Debt Sensitivity", category: "Market", desc: "Floating debt exposure, +100/200/300 bps impact on finance costs" },
  { id: "FR-REP-10", name: "Corporate Debt & Covenant Compliance", category: "Debt", desc: "Total debt, DSCR, Interest Coverage Ratio, and maturity schedules" },
  { id: "FR-REP-11", name: "Capital Strategy & Funding Gap Report", category: "Funding", desc: "Equity fundraising tranches, debt facilities, and runway projections" },
  { id: "FR-REP-12", name: "Revenue Risk & Pipeline Sensitivity", category: "Revenue", desc: "Customer concentration, churn risks, and order backlog conversion" },
  { id: "FR-REP-13", name: "Gross Margin & Cost Escalation Analysis", category: "Profitability", desc: "Standard cost variances, bill of materials inflation, and margin leakage" },
  { id: "FR-REP-14", name: "Customer Concentration Risk Audit", category: "Credit", desc: "Top 1, Top 5, Top 10 customer revenue dependency and default risk" },
  { id: "FR-REP-15", name: "Tax Risk & Statutory Exposure Dossier", category: "Tax", desc: "GST input tax credit reconciliations, pending appeals, and TDS audits" },
  { id: "FR-REP-16", name: "Internal Financial Controls & Fraud Prevention", category: "Governance", desc: "Segregation of duties, maker-checker audits, and authorization trails" },
  { id: "FR-REP-17", name: "Financial Key Risk Indicators (KRI) Log", category: "Monitoring", desc: "Full tracking of 35 financial indicators against tolerance limits" },
  { id: "FR-REP-18", name: "Macroeconomic Financial Stress Test", category: "Stress Test", desc: "Comprehensive simulation of revenue, FX, and cost shocks on liquidity" },
  { id: "FR-REP-19", name: "Financial Risk Treatment Action Plan", category: "Mitigation", desc: "Status, budgets, owners, and evidence for active treatment initiatives" },
  { id: "FR-REP-20", name: "AI Financial Risk Intelligence Digest", category: "AI Analytics", desc: "Automated anomaly detection, predictive cash burn, and margin trends" },
];

export const financialRiskService = {
  getPrimaryRisk: () => PRIMARY_FINANCIAL_RISK,
  getTopRisks: () => TOP_FINANCIAL_RISKS,
  getKRIs: () => FINANCIAL_KRIS,
  getTreatmentActions: () => FINANCIAL_TREATMENT_ACTIONS,
  getExposureTrend: () => FINANCIAL_EXPOSURE_TREND,
  getCategoryDistribution: () => FINANCIAL_CATEGORY_DISTRIBUTION,
  getAIInsights: () => FINANCIAL_AI_INSIGHTS,
  getFullRisks: () => FULL_FINANCIAL_RISKS,
  getExposures: () => FINANCIAL_EXPOSURE_REGISTER,
  getControls: () => FINANCIAL_CONTROLS_MASTER,
  getStressScenarios: () => FINANCIAL_STRESS_SCENARIOS,
  getMAICWFields: () => FINANCIAL_MAICW_FIELDS,
  getReports: () => FINANCIAL_REPORT_DEFINITIONS,
};

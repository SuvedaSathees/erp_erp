// Magnertia ERP - Decision Support Domain Service
// Structured Decision Intelligence, Options Evaluation, Risk Matrix, and Action Outcomes

export interface DecisionKpi {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
}

export interface DecisionRecord {
  id: string;
  topic: string;
  businessArea: string;
  priority: "High" | "Medium" | "Low";
  status: "In Progress" | "Pending Approval" | "Analysis" | "Draft" | "Review" | "Completed";
  dueDate: string;
  owner: string;
  investment: string;
  expectedBenefit: string;
}

export interface DecisionOption {
  name: string;
  investment: string;
  expectedBenefit: string;
  roi: string;
  risk: "Low" | "Medium" | "High";
  score: number;
}

export interface DecisionRiskItem {
  id: number;
  risk: string;
  category: string;
  probability: "High" | "Medium" | "Low";
  impact: "High" | "Medium" | "Low";
  score: number;
  mitigation: string;
}

export interface DecisionActionItem {
  id: number;
  action: string;
  owner: string;
  dueDate: string;
  status: "In Progress" | "Not Started" | "Completed";
}

export const DSS_KPIS: DecisionKpi[] = [
  {
    id: "dss-open",
    label: "Open Decisions",
    value: "28",
    change: "↑ 12%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "FileText",
  },
  {
    id: "dss-appr",
    label: "Pending Approval",
    value: "8",
    change: "↓ 33%",
    isPositive: true,
    subtext: "executive gate",
    iconName: "Clock",
  },
  {
    id: "dss-overdue",
    label: "Overdue Decisions",
    value: "5",
    change: "↓ 25%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "AlertTriangle",
  },
  {
    id: "dss-act",
    label: "Actions in Progress",
    value: "42",
    change: "↑ 40%",
    isPositive: true,
    subtext: "active execution",
    iconName: "CheckSquare",
  },
  {
    id: "dss-comp",
    label: "Completed Decisions",
    value: "16",
    change: "↑ 23%",
    isPositive: true,
    subtext: "this quarter",
    iconName: "CheckCircle",
  },
  {
    id: "dss-benefit",
    label: "Estimated Benefit",
    value: "₹3.2 Cr",
    change: "↑ 18%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "TrendingUp",
  },
];

export const DSS_RECENT_DECISIONS: DecisionRecord[] = [
  {
    id: "DS-2026-001",
    topic: "Expand EV Charging Network - Phase 1",
    businessArea: "Operations",
    priority: "High",
    status: "In Progress",
    dueDate: "15 Oct 2026",
    owner: "COO",
    investment: "₹12.0 Cr",
    expectedBenefit: "₹28.5 Cr",
  },
  {
    id: "DS-2026-002",
    topic: "New DC Fast Charger Investment",
    businessArea: "Investment",
    priority: "High",
    status: "Pending Approval",
    dueDate: "05 Oct 2026",
    owner: "CFO",
    investment: "₹8.5 Cr",
    expectedBenefit: "₹18.0 Cr",
  },
  {
    id: "DS-2026-003",
    topic: "Reduce Manufacturing Cost Line 3",
    businessArea: "Manufacturing",
    priority: "Medium",
    status: "Analysis",
    dueDate: "20 Oct 2026",
    owner: "Plant Head",
    investment: "₹2.4 Cr",
    expectedBenefit: "₹6.2 Cr",
  },
  {
    id: "DS-2026-004",
    topic: "Launch Wall-Mount AC Charger v2",
    businessArea: "Product",
    priority: "High",
    status: "Draft",
    dueDate: "30 Oct 2026",
    owner: "Product Head",
    investment: "₹4.0 Cr",
    expectedBenefit: "₹14.0 Cr",
  },
  {
    id: "DS-2026-005",
    topic: "Enter New State Highway Corridor",
    businessArea: "Strategic",
    priority: "Medium",
    status: "Review",
    dueDate: "10 Oct 2026",
    owner: "CEO",
    investment: "₹15.0 Cr",
    expectedBenefit: "₹35.0 Cr",
  },
];

export const DSS_OPTIONS: DecisionOption[] = [
  {
    name: "A. Owned Model",
    investment: "₹18 Cr",
    expectedBenefit: "₹32 Cr",
    roi: "1.8x",
    risk: "High",
    score: 72,
  },
  {
    name: "B. Hybrid Model (Owned + Franchise)",
    investment: "₹12 Cr",
    expectedBenefit: "₹28.5 Cr",
    roi: "2.4x",
    risk: "Medium",
    score: 88,
  },
  {
    name: "C. Franchise Model",
    investment: "₹6 Cr",
    expectedBenefit: "₹20 Cr",
    roi: "2.1x",
    risk: "Medium",
    score: 81,
  },
];

export const DSS_RISKS: DecisionRiskItem[] = [
  {
    id: 1,
    risk: "Site acquisition delay on NH44",
    category: "Operational",
    probability: "High",
    impact: "High",
    score: 81,
    mitigation: "Early vendor tie-up & turnkey land lease pacts",
  },
  {
    id: 2,
    risk: "Regulatory discom approvals",
    category: "Compliance",
    probability: "Medium",
    impact: "High",
    score: 63,
    mitigation: "Govt liaison team & single-window green corridor fast track",
  },
  {
    id: 3,
    risk: "Demand lower than forecast",
    category: "Market",
    probability: "Medium",
    impact: "Medium",
    score: 56,
    mitigation: "Phase-wise rollout with initial 30 stations deployment",
  },
  {
    id: 4,
    risk: "Technology cost increase",
    category: "Financial",
    probability: "Low",
    impact: "High",
    score: 45,
    mitigation: "Long-term fixed BOM contract with Tier-1 component makers",
  },
  {
    id: 5,
    risk: "Franchise partner performance",
    category: "Operational",
    probability: "High",
    impact: "Medium",
    score: 54,
    mitigation: "Strict SLA contracts & remote IoT charger uptime monitoring",
  },
];

export const DSS_ACTIONS: DecisionActionItem[] = [
  {
    id: 1,
    action: "Finalize top 50 highway charging locations",
    owner: "Operations",
    dueDate: "10 Oct 2026",
    status: "In Progress",
  },
  {
    id: 2,
    action: "Prepare capital expenditure financial plan",
    owner: "Finance",
    dueDate: "12 Oct 2026",
    status: "Not Started",
  },
  {
    id: 3,
    action: "Initiate discom regulatory approvals",
    owner: "Legal",
    dueDate: "20 Oct 2026",
    status: "In Progress",
  },
  {
    id: 4,
    action: "Develop franchise partner revenue share model",
    owner: "Business Dev",
    dueDate: "25 Oct 2026",
    status: "Not Started",
  },
  {
    id: 5,
    action: "Finalize technology hardware partners",
    owner: "Engineering",
    dueDate: "28 Oct 2026",
    status: "In Progress",
  },
];

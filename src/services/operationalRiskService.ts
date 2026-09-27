// Magnertia ERP - Operational Risk Service
// Operational Risk Form - MAICW Classification & Lifecycle Management

export type OpRiskCategory =
  | "Process"
  | "People"
  | "Equipment"
  | "Technology"
  | "Material"
  | "Supply Chain"
  | "Facility"
  | "Quality"
  | "External";

export type OpRiskType = "Existing" | "Emerging" | "Incident" | "Residual";

export type OpRiskPriority = "Critical" | "High" | "Medium" | "Low";

export type OpRiskStatus =
  | "Draft"
  | "Under Assessment"
  | "Open"
  | "Monitoring"
  | "Treatment Required"
  | "Investigation"
  | "Escalated"
  | "Accepted"
  | "Verified"
  | "Closed"
  | "Archived";

export interface OpRiskRecord {
  id: string; // Auto Number (A) e.g. OR-2026-001 / OR-001
  riskCode: string; // Controlled Ref (A) e.g. RK-OP-SC-01
  title: string; // Mandatory (M)
  category: OpRiskCategory; // Dropdown (M)
  subCategory?: string;
  type: OpRiskType; // Dropdown (M)
  businessFunction: string; // Lookup (M)
  department: string; // Lookup (M)
  businessProcess: string; // Lookup (M)
  subProcess?: string; // Lookup (I)
  workCenter?: string; // Lookup (I)
  affectedAsset?: string; // (I)
  owner: string; // Lookup (M)
  ownerRole?: string;
  ownerAvatar?: string;
  coordinator?: string; // Lookup (I)
  identificationDate: string; // Date (M)
  reviewDate: string; // Date (M)
  status: OpRiskStatus; // Workflow (W)
  priority: OpRiskPriority; // Dropdown (M)
  version: string; // Number (A)
  confidentiality: "Internal" | "Confidential" | "Restricted"; // (C)

  // Risk Statement
  statement: string; // Because of [CAUSE], [EVENT] may occur, resulting in [IMPACT]
  cause: string;
  causeCategory?: string;
  event: string;
  immediateEffect?: string;
  businessImpact?: string;
  businessImpacts: Array<{ area: string; level: "High" | "Medium" | "Low"; tone: string }>;

  // Scoring
  inherentLikelihood: number; // 1-5
  inherentImpact: number; // 1-5
  inherentScore: number; // 1-25
  inherentLevel: "Low" | "Moderate" | "High" | "Critical";

  residualLikelihood: number; // 1-5
  residualImpact: number; // 1-5
  residualScore: number; // 1-25
  residualLevel: "Low" | "Moderate" | "High" | "Critical";

  trend: "Increasing" | "Stable" | "Decreasing";
  appetiteStatus: "Within Appetite" | "Near Tolerance" | "Outside Appetite";
}

export interface OpControlItem {
  id: string;
  name: string;
  type: "Preventive" | "Detective" | "Corrective" | "Compensating" | "Automated" | "Manual";
  description: string;
  objective: string;
  owner: string;
  frequency: "Continuous" | "Daily" | "Weekly" | "Monthly" | "Per Batch" | "Quarterly";
  procedure: string;
  evidence: string;
  relatedSOP: string;
  relatedWI: string;
  designEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  operatingEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  result: "Effective" | "Partially Effective" | "Ineffective";
  lastTested: string;
  nextTest: string;
}

export interface OpKRIItem {
  id: string;
  name: string;
  linkedRiskId: string;
  metric: string;
  currentValue: string;
  target: string;
  warningThreshold: string;
  criticalThreshold: string;
  frequency: string;
  owner: string;
  dataSource: string;
  status: "Green" | "Amber" | "Red";
}

export interface OpActionItem {
  id: string;
  riskId: string;
  action: string;
  owner: string;
  dueDate: string;
  budget: string;
  status: "Open" | "Assigned" | "In Progress" | "Evidence" | "Verified" | "Closed" | "Not Started";
  priority: "High" | "Medium" | "Low";
  evidence?: string;
}

export interface OpIncidentItem {
  id: string;
  date: string;
  type: "Incident" | "Near Miss";
  description: string;
  impact: "High" | "Medium" | "Low";
  status: "Closed" | "Investigation" | "Resolved" | "Open";
  process?: string;
  linkedRiskId?: string;
}

// 1. Master Active Operational Risk matching Screenshot
export const PRIMARY_OP_RISK: OpRiskRecord = {
  id: "OR-2026-001",
  riskCode: "RK-OP-SC-01",
  title: "Shutdown due to critical component shortage",
  category: "Supply Chain",
  subCategory: "Single Source Semiconductor",
  type: "Existing",
  businessFunction: "Operations",
  department: "Production",
  businessProcess: "Procurement",
  subProcess: "Supplier Management",
  workCenter: "Main Plant - Coimbatore",
  affectedAsset: "Power Electronics Components",
  owner: "Ramesh S.",
  ownerRole: "Operations Head",
  ownerAvatar: "RS",
  coordinator: "Priya Sharma",
  identificationDate: "15-Sep-2026",
  reviewDate: "15-Dec-2026",
  status: "Monitoring",
  priority: "High",
  version: "v1.0",
  confidentiality: "Internal",
  statement:
    "Because of dependency on a single supplier for critical power electronics components, supply interruption may occur, resulting in production delays and customer delivery impact.",
  cause: "Sole-source Tier-1 vendor contract for gate driver integrated circuits",
  causeCategory: "Material & Supplier",
  event: "Vendor fabrication stoppage or logistics container delay exceeding 14 days",
  immediateEffect: "Assembly Line 1 & Line 3 powertrain stoppage",
  businessImpact: "Output drop of 45 vehicles/day and delayed customer delivery commitments",
  businessImpacts: [
    { area: "Production", level: "High", tone: "red" },
    { area: "Delivery", level: "High", tone: "red" },
    { area: "Cost", level: "Medium", tone: "amber" },
    { area: "Customer", level: "High", tone: "blue" },
    { area: "Reputation", level: "Medium", tone: "purple" },
    { area: "Revenue", level: "High", tone: "emerald" },
  ],
  inherentLikelihood: 4,
  inherentImpact: 5,
  inherentScore: 20,
  inherentLevel: "Critical",
  residualLikelihood: 3,
  residualImpact: 4,
  residualScore: 12,
  residualLevel: "High",
  trend: "Increasing",
  appetiteStatus: "Near Tolerance",
};

// 2. Top 5 Operational Risks matching Screenshot
export const TOP_OP_RISKS: OpRiskRecord[] = [
  PRIMARY_OP_RISK,
  {
    id: "OR-002",
    riskCode: "RK-OP-EQ-02",
    title: "Machine failure - DC Charger",
    category: "Equipment",
    type: "Existing",
    businessFunction: "Manufacturing",
    department: "Assembly Line",
    businessProcess: "Final Assembly Testing",
    subProcess: "High Voltage EOL Test",
    workCenter: "Testing Bay - Pune",
    affectedAsset: "Chroma 8000 End-of-Line Tester",
    owner: "Karthik R.",
    identificationDate: "08-Sep-2026",
    reviewDate: "08-Dec-2026",
    status: "Open",
    priority: "Critical",
    version: "v1.0",
    confidentiality: "Internal",
    statement:
      "Because of cooling fan degradation in DC high-current load tester, thermal trip may occur during vehicle EOL validation.",
    cause: "Unscheduled preventive maintenance on high-power test rack",
    event: "Tester overload shutdown during peak shift",
    businessImpacts: [
      { area: "Production", level: "High", tone: "red" },
      { area: "Quality", level: "High", tone: "red" },
      { area: "Cost", level: "Medium", tone: "amber" },
    ],
    inherentLikelihood: 4,
    inherentImpact: 4,
    inherentScore: 16,
    inherentLevel: "High",
    residualLikelihood: 3,
    residualImpact: 3,
    residualScore: 9,
    residualLevel: "Moderate",
    trend: "Increasing",
    appetiteStatus: "Within Appetite",
  },
  {
    id: "OR-003",
    riskCode: "RK-OP-TE-01",
    title: "Cybersecurity breach - IoT platform",
    category: "Technology",
    type: "Existing",
    businessFunction: "IT & Digital",
    department: "Connected Vehicle Eng",
    businessProcess: "Telematics Operations",
    subProcess: "Cloud Ingestion Pipeline",
    workCenter: "Cloud AWS ap-south-1",
    affectedAsset: "MQTT Telematics Broker",
    owner: "Vikram Malhotra",
    identificationDate: "01-Sep-2026",
    reviewDate: "01-Dec-2026",
    status: "Monitoring",
    priority: "High",
    version: "v1.1",
    confidentiality: "Restricted",
    statement:
      "Because of outdated TLS certificates on legacy vehicle gateways, authentication spoofing may expose fleet telematics data.",
    cause: "Delay in over-the-air cryptographic key rotation",
    event: "Unauthorized packet injection into vehicle fleet stream",
    businessImpacts: [
      { area: "Security", level: "High", tone: "purple" },
      { area: "Reputation", level: "High", tone: "red" },
    ],
    inherentLikelihood: 5,
    inherentImpact: 3,
    inherentScore: 15,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    trend: "Decreasing",
    appetiteStatus: "Within Appetite",
  },
  {
    id: "OR-004",
    riskCode: "RK-OP-QU-03",
    title: "Production quality deviation",
    category: "Quality",
    type: "Incident",
    businessFunction: "Quality",
    department: "Battery Systems",
    businessProcess: "Cell Balancing & Welding",
    subProcess: "Laser Busbar Welding",
    workCenter: "Pack Assembly Cell 2",
    affectedAsset: "Trumpf TruLaser Welder",
    owner: "Rajesh Iyer",
    identificationDate: "20-Aug-2026",
    reviewDate: "20-Nov-2026",
    status: "Open",
    priority: "High",
    version: "v1.0",
    confidentiality: "Internal",
    statement:
      "Because of optics contamination in laser welding head, cold welds on aluminum busbars may cause high contact resistance.",
    cause: "Inadequate positive pressure shielding gas flow in robotic cell",
    event: "Welding bond resistance exceeding 12 micro-ohms on 5 consecutive packs",
    businessImpacts: [
      { area: "Quality", level: "High", tone: "red" },
      { area: "Cost", level: "Medium", tone: "amber" },
    ],
    inherentLikelihood: 4,
    inherentImpact: 3,
    inherentScore: 12,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualLevel: "Moderate",
    trend: "Increasing",
    appetiteStatus: "Within Appetite",
  },
  {
    id: "OR-005",
    riskCode: "RK-OP-FA-01",
    title: "Power failure - Main plant",
    category: "Facility",
    type: "Existing",
    businessFunction: "Plant Facilities",
    department: "Maintenance & Utilities",
    businessProcess: "HV Grid Substation",
    subProcess: "Primary 110kV Transformer",
    workCenter: "Substation Bay 1",
    affectedAsset: "10MVA Step-Down Transformer",
    owner: "Deepak S.",
    identificationDate: "10-Aug-2026",
    reviewDate: "10-Nov-2026",
    status: "Monitoring",
    priority: "Medium",
    version: "v1.0",
    confidentiality: "Internal",
    statement:
      "Because of lightning surge during monsoon storms, main substation SF6 breaker may trip, cutting utility power to gigafactory.",
    cause: "Surge arrestor ground resistance degradation past 2 ohms",
    event: "Full plant outage lasting >6 hours before diesel gen-set synchronizes",
    businessImpacts: [
      { area: "Production", level: "High", tone: "red" },
      { area: "Facility", level: "Medium", tone: "amber" },
    ],
    inherentLikelihood: 3,
    inherentImpact: 4,
    inherentScore: 12,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    trend: "Stable",
    appetiteStatus: "Within Appetite",
  },
];

// 3. Full Operational Risk Register (36 Risks matching Screenshot total)
export const FULL_OPERATIONAL_RISKS: OpRiskRecord[] = [
  ...TOP_OP_RISKS,
  {
    id: "OR-006",
    riskCode: "RK-OP-PR-02",
    title: "SOP Non-Compliance on Battery Torque Tightening",
    category: "Process",
    type: "Existing",
    businessFunction: "Manufacturing",
    department: "Battery Systems",
    businessProcess: "Module Bolting",
    workCenter: "Cell 4",
    owner: "Rajesh Iyer",
    identificationDate: "05-Aug-2026",
    reviewDate: "05-Nov-2026",
    status: "Monitoring",
    priority: "High",
    version: "v1.0",
    confidentiality: "Internal",
    statement: "Because of torque wrench wireless synchronization loss, bolts may be torqued without digital verification.",
    cause: "Bluetooth interference on industrial shop floor",
    event: "Unverified M8 torque fasteners passing gate",
    businessImpacts: [{ area: "Quality", level: "High", tone: "red" }],
    inherentLikelihood: 3,
    inherentImpact: 4,
    inherentScore: 12,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualLevel: "Moderate",
    trend: "Decreasing",
    appetiteStatus: "Within Appetite",
  },
  {
    id: "OR-007",
    riskCode: "RK-OP-PE-01",
    title: "High Voltage Certification Training Gap for Line Technicians",
    category: "People",
    type: "Existing",
    businessFunction: "HR & Training",
    department: "Production Ops",
    businessProcess: "Workforce Competency",
    workCenter: "Training Academy",
    owner: "Shalini Menon",
    identificationDate: "12-Aug-2026",
    reviewDate: "12-Nov-2026",
    status: "Open",
    priority: "Critical",
    version: "v1.0",
    confidentiality: "Internal",
    statement: "Because of rapid hiring surge, new technicians may operate on 800V bus systems prior to Level-3 safety certification.",
    cause: "Onboarding bottleneck in HV training rig availability",
    event: "Electrical safety near-miss during harness attachment",
    businessImpacts: [
      { area: "Safety", level: "High", tone: "red" },
      { area: "Compliance", level: "High", tone: "red" },
    ],
    inherentLikelihood: 4,
    inherentImpact: 5,
    inherentScore: 20,
    inherentLevel: "Critical",
    residualLikelihood: 2,
    residualImpact: 5,
    residualScore: 10,
    residualLevel: "High",
    trend: "Increasing",
    appetiteStatus: "Near Tolerance",
  },
  {
    id: "OR-008",
    riskCode: "RK-OP-MA-02",
    title: "Copper Busbar Raw Material Gauge Deviation",
    category: "Material",
    type: "Existing",
    businessFunction: "Supply Chain",
    department: "Incoming Inspection",
    businessProcess: "Raw Material IQC",
    workCenter: "Dock 3",
    owner: "Ramesh S.",
    identificationDate: "18-Aug-2026",
    reviewDate: "18-Nov-2026",
    status: "Monitoring",
    priority: "Medium",
    version: "v1.0",
    confidentiality: "Internal",
    statement: "Because of supplier rolling mill calibration drift, copper strip thickness may fall below 2.8mm spec limit.",
    cause: "Vendor thickness sensor fault",
    event: "Excess current density and thermal hotspot in pack interconnects",
    businessImpacts: [{ area: "Quality", level: "Medium", tone: "amber" }],
    inherentLikelihood: 3,
    inherentImpact: 3,
    inherentScore: 9,
    inherentLevel: "Moderate",
    residualLikelihood: 1,
    residualImpact: 3,
    residualScore: 3,
    residualLevel: "Low",
    trend: "Decreasing",
    appetiteStatus: "Within Appetite",
  },
  {
    id: "OR-009",
    riskCode: "RK-OP-EX-01",
    title: "Regional Highway Logistics Toll Strike",
    category: "External",
    type: "Emerging",
    businessFunction: "Logistics",
    department: "Outbound Logistics",
    businessProcess: "Finished Goods Dispatch",
    workCenter: "Dispatch Hub",
    owner: "Logistics Team",
    identificationDate: "05-Sep-2026",
    reviewDate: "05-Oct-2026",
    status: "Monitoring",
    priority: "Low",
    version: "v1.0",
    confidentiality: "Internal",
    statement: "Because of state highway transporters strike, finished commercial fleet transport may be delayed by 4-6 days.",
    cause: "Regional diesel surcharge protest",
    event: "Car carrier trucks held at state border check-posts",
    businessImpacts: [{ area: "Delivery", level: "Medium", tone: "amber" }],
    inherentLikelihood: 2,
    inherentImpact: 2,
    inherentScore: 4,
    inherentLevel: "Low",
    residualLikelihood: 1,
    residualImpact: 2,
    residualScore: 2,
    residualLevel: "Low",
    trend: "Stable",
    appetiteStatus: "Within Appetite",
  },
];

// 4. KRIs matching Screenshot
export const OP_KRIS: OpKRIItem[] = [
  {
    id: "KRI-OP-01",
    name: "Supplier Lead Time (days)",
    linkedRiskId: "OR-2026-001",
    metric: "Days from PO placement to physical receipt",
    currentValue: "45",
    target: "30",
    warningThreshold: "> 35",
    criticalThreshold: "> 30",
    frequency: "Weekly",
    owner: "Ramesh S.",
    dataSource: "ERP SCM Lead Time Module",
    status: "Red",
  },
  {
    id: "KRI-OP-02",
    name: "Inventory Coverage (weeks)",
    linkedRiskId: "OR-2026-001",
    metric: "Buffer stock weeks of critical ICs",
    currentValue: "2",
    target: "6",
    warningThreshold: "< 5",
    criticalThreshold: "< 4",
    frequency: "Daily",
    owner: "Logistics Team",
    dataSource: "WMS Inventory Balances",
    status: "Red",
  },
  {
    id: "KRI-OP-03",
    name: "Machine Downtime (%)",
    linkedRiskId: "OR-002",
    metric: "Unplanned downtime percentage on Line 1 & Line 2",
    currentValue: "12%",
    target: "5%",
    warningThreshold: "> 8%",
    criticalThreshold: "> 10%",
    frequency: "Daily",
    owner: "Karthik R.",
    dataSource: "Shop Floor MES Telemetry",
    status: "Amber",
  },
  {
    id: "KRI-OP-04",
    name: "Defect Rate (PPM)",
    linkedRiskId: "OR-004",
    metric: "End of line battery pack defective parts per million",
    currentValue: "850",
    target: "200",
    warningThreshold: "> 400",
    criticalThreshold: "> 500",
    frequency: "Daily",
    owner: "Rajesh Iyer",
    dataSource: "QMS EOL Testing Station",
    status: "Amber",
  },
  {
    id: "KRI-OP-05",
    name: "On-time Delivery (%)",
    linkedRiskId: "OR-2026-001",
    metric: "Customer order deliveries meeting SLA milestone",
    currentValue: "78%",
    target: "95%",
    warningThreshold: "< 90%",
    criticalThreshold: "< 90%",
    frequency: "Weekly",
    owner: "Arun Kumar",
    dataSource: "Dispatch ERP Manifest",
    status: "Red",
  },
];

// 5. Treatment Actions matching Screenshot
export const OP_TREATMENT_ACTIONS: OpActionItem[] = [
  {
    id: "ACT-OP-01",
    riskId: "OR-2026-001",
    action: "Qualify alternate supplier",
    owner: "Ramesh S.",
    dueDate: "30-Sep-2026",
    budget: "₹1,800,000",
    status: "In Progress",
    priority: "High",
    evidence: "Secondary fab audit completed in Taiwan",
  },
  {
    id: "ACT-OP-02",
    riskId: "OR-2026-001",
    action: "Increase safety stock",
    owner: "Logistics Team",
    dueDate: "15-Oct-2026",
    budget: "₹3,500,000",
    status: "Open",
    priority: "High",
    evidence: "Purchase requisition PR-2026-441 issued",
  },
  {
    id: "ACT-OP-03",
    riskId: "OR-2026-001",
    action: "Supplier development program",
    owner: "Priya Sharma",
    dueDate: "31-Oct-2026",
    budget: "₹950,000",
    status: "Open",
    priority: "Medium",
    evidence: "Joint quality audit scheduled for Week 42",
  },
  {
    id: "ACT-OP-04",
    riskId: "OR-2026-001",
    action: "Review dual sourcing strategy",
    owner: "Arun Kumar",
    dueDate: "15-Nov-2026",
    budget: "₹450,000",
    status: "Not Started",
    priority: "Medium",
    evidence: "Draft proposal in procurement committee",
  },
];

// 6. Recent Incidents / Near Misses matching Screenshot
export const OP_INCIDENTS: OpIncidentItem[] = [
  {
    id: "INC-01",
    date: "14-Sep-2026",
    type: "Near Miss",
    description: "Minor electrical fault",
    impact: "Low",
    status: "Closed",
    process: "Testing Bay 2",
    linkedRiskId: "OR-002",
  },
  {
    id: "INC-02",
    date: "10-Sep-2026",
    type: "Incident",
    description: "Machine breakdown",
    impact: "High",
    status: "Investigation",
    process: "Chassis Welding Line",
    linkedRiskId: "OR-002",
  },
  {
    id: "INC-03",
    date: "05-Sep-2026",
    type: "Near Miss",
    description: "Material mix-up",
    impact: "Medium",
    status: "Closed",
    process: "Warehouse Kitting",
    linkedRiskId: "OR-008",
  },
  {
    id: "INC-04",
    date: "28-Aug-2026",
    type: "Incident",
    description: "IT system downtime",
    impact: "High",
    status: "Resolved",
    process: "MES Cloud Gateway",
    linkedRiskId: "OR-003",
  },
  {
    id: "INC-05",
    date: "18-Aug-2026",
    type: "Near Miss",
    description: "Forklift close call",
    impact: "Medium",
    status: "Closed",
    process: "Loading Dock 4",
    linkedRiskId: "OR-009",
  },
];

// 7. Risk by Category matching Screenshot Donut
export const OP_CATEGORY_DISTRIBUTION = [
  { name: "Supply Chain", percentage: 22, count: 8, color: "#3B82F6" },
  { name: "Equipment", percentage: 17, count: 6, color: "#06B6D4" },
  { name: "Process", percentage: 14, count: 5, color: "#F97316" },
  { name: "Technology", percentage: 11, count: 4, color: "#EAB308" },
  { name: "Quality", percentage: 11, count: 4, color: "#6366F1" },
  { name: "People", percentage: 8, count: 3, color: "#EC4899" },
  { name: "Facility", percentage: 8, count: 3, color: "#8B5CF6" },
  { name: "Others", percentage: 6, count: 3, color: "#1E3A8A" },
];

// 8. Monthly Inherent vs Residual Trend matching Screenshot Line Chart
export const OP_RISK_TREND = [
  { month: "Apr 2026", inherentRisk: 16.2, residualRisk: 7.1 },
  { month: "May 2026", inherentRisk: 17.0, residualRisk: 7.8 },
  { month: "Jun 2026", inherentRisk: 17.8, residualRisk: 8.5 },
  { month: "Jul 2026", inherentRisk: 18.4, residualRisk: 9.2 },
  { month: "Aug 2026", inherentRisk: 19.5, residualRisk: 10.4 },
  { month: "Sep 2026", inherentRisk: 20.8, residualRisk: 10.1 },
];

// 9. AI Risk Insights matching Screenshot
export const OP_AI_INSIGHTS = [
  {
    id: 1,
    icon: "Shield",
    color: "text-emerald-500 bg-emerald-500/10",
    text: "Supply chain risks increased by 30% this quarter. Consider dual sourcing.",
  },
  {
    id: 2,
    icon: "Activity",
    color: "text-blue-500 bg-blue-500/10",
    text: "Machine downtime trend is rising. Predictive maintenance recommended.",
  },
  {
    id: 3,
    icon: "AlertTriangle",
    color: "text-amber-500 bg-amber-500/10",
    text: "Inventory coverage is below threshold for 2 key components.",
  },
];

// 10. Existing Operational Controls for Primary Risk
export const PRIMARY_OP_CONTROLS: OpControlItem[] = [
  {
    id: "CTRL-OP-01",
    name: "Dual-sourcing Supplier Qualification Gate",
    type: "Preventive",
    description: "Rigorous qualification of secondary source fabs with identical pinout semiconductor packaging.",
    objective: "Eliminate sole-source dependency on powertrain microcontrollers.",
    owner: "Ramesh S.",
    frequency: "Quarterly",
    procedure: "SOP-SCM-402 Dual Source Qualification Protocol",
    evidence: "Lab validation reports and reliability thermal cycle test passes",
    relatedSOP: "SOP-SCM-402",
    relatedWI: "WI-SCM-12",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Partially Effective",
    lastTested: "12-Aug-2026",
    nextTest: "12-Nov-2026",
  },
  {
    id: "CTRL-OP-02",
    name: "Buffer Stock Dynamic Auto-Replenish",
    type: "Automated",
    description: "Automated safety stock re-order triggers inside ERP linked to Tier-1 freight forwarder EDI.",
    objective: "Maintain minimum 6-week component runway on shop floor.",
    owner: "Logistics Team",
    frequency: "Continuous",
    procedure: "SOP-WMS-201 Safety Stock Thresholds",
    evidence: "Real-time ERP MRP purchase generation logs",
    relatedSOP: "SOP-WMS-201",
    relatedWI: "WI-WMS-05",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Effective",
    lastTested: "01-Sep-2026",
    nextTest: "01-Oct-2026",
  },
  {
    id: "CTRL-OP-03",
    name: "Daily Component Shortage Escalation Huddle",
    type: "Detective",
    description: "Cross-functional morning standup reviewing 14-day material availability projections.",
    objective: "Early identification of dock delays before line impact occurs.",
    owner: "Operations Lead",
    frequency: "Daily",
    procedure: "SOP-OPS-105 Daily Operational Cadence",
    evidence: "Daily sign-off meeting minutes and action log",
    relatedSOP: "SOP-OPS-105",
    relatedWI: "WI-OPS-02",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Effective",
    lastTested: "14-Sep-2026",
    nextTest: "15-Sep-2026",
  },
];

// MAICW Form Fields for Operational Risk
export const OP_MAICW_FIELDS = [
  { field: "Operational Risk ID", type: "Auto Number", maicw: "A", description: "Unique risk identifier generated sequentially (e.g. OR-2026-001)" },
  { field: "Risk Code", type: "Text", maicw: "A", description: "Controlled reference linked to operational taxonomy" },
  { field: "Risk Title", type: "Text", maicw: "M", description: "Concise operational risk statement title" },
  { field: "Risk Category", type: "Dropdown", maicw: "M", description: "Process, People, Equipment, Technology, Material, Supply Chain, Facility, Quality, External" },
  { field: "Risk Type", type: "Dropdown", maicw: "M", description: "Existing, Emerging, Incident, Residual" },
  { field: "Business Function", type: "Lookup", maicw: "M", description: "Affected organizational function" },
  { field: "Department", type: "Lookup", maicw: "M", description: "Responsible operational department" },
  { field: "Business Process", type: "Lookup", maicw: "M", description: "Primary affected operational process" },
  { field: "Sub-Process", type: "Lookup", maicw: "I", description: "Specific granular sub-process" },
  { field: "Work Center", type: "Lookup", maicw: "I", description: "Physical shop floor cell or facility location" },
  { field: "Affected Asset", type: "Lookup", maicw: "I", description: "Equipment, machinery, or component asset" },
  { field: "Risk Owner", type: "Lookup", maicw: "M", description: "Accountable operational owner" },
  { field: "Risk Coordinator", type: "Lookup", maicw: "I", description: "Assigned risk management coordinator" },
  { field: "Identification Date", type: "Date", maicw: "M", description: "Formal date of logging" },
  { field: "Review Date", type: "Date", maicw: "M", description: "Next scheduled review date" },
  { field: "Status", type: "Workflow", maicw: "W", description: "Open, Monitoring, Escalated, Closed" },
  { field: "Priority", type: "Dropdown", maicw: "M", description: "Critical, High, Medium, Low" },
  { field: "Version", type: "Number", maicw: "A", description: "Controlled revision version (v1.0)" },
  { field: "Confidentiality", type: "Dropdown", maicw: "C", description: "Internal, Confidential, Restricted" },
];

export const operationalRiskService = {
  getPrimaryRisk() {
    return PRIMARY_OP_RISK;
  },
  getAllRisks() {
    return FULL_OPERATIONAL_RISKS;
  },
  getTopRisks() {
    return TOP_OP_RISKS;
  },
  getKRIs() {
    return OP_KRIS;
  },
  getActions() {
    return OP_TREATMENT_ACTIONS;
  },
  getIncidents() {
    return OP_INCIDENTS;
  },
  getCategoryDistribution() {
    return OP_CATEGORY_DISTRIBUTION;
  },
  getTrendData() {
    return OP_RISK_TREND;
  },
  getAiInsights() {
    return OP_AI_INSIGHTS;
  },
  getControls() {
    return PRIMARY_OP_CONTROLS;
  },
  getMaicwFields() {
    return OP_MAICW_FIELDS;
  },
};

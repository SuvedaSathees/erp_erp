// Magnertia ERP - Enterprise Risk Service
// Enterprise Risk Form - MAICW Classification & Lifecycle Management

export type RiskCategory =
  | "Strategic"
  | "Financial"
  | "Operational"
  | "Technology"
  | "Cybersecurity"
  | "Product"
  | "Quality"
  | "Supply Chain"
  | "Compliance"
  | "People"
  | "Reputation"
  | "Business Continuity";

export type RiskType =
  | "Threat"
  | "Opportunity"
  | "Emerging Risk"
  | "Existing Risk"
  | "Residual Risk"
  | "Strategic Risk";

export type RiskPriority = "Critical" | "High" | "Medium" | "Low";

export type RiskStatus =
  | "Draft"
  | "Under Assessment"
  | "Open"
  | "Monitoring"
  | "Treatment Required"
  | "Escalated"
  | "Accepted"
  | "Closed"
  | "Archived";

export type MAICWType = "M" | "A" | "I" | "C" | "W";

export interface MAICWFieldDef {
  field: string;
  type: string;
  maicw: MAICWType;
  description: string;
}

export interface EnterpriseRiskRecord {
  id: string; // Auto Number (A) e.g. ER-2026-001
  riskCode: string; // Controlled Ref (A) e.g. RK-SC-01
  title: string; // Mandatory (M)
  category: RiskCategory; // Dropdown (M)
  subCategory?: string;
  type: RiskType; // Dropdown (M)
  businessFunction: string; // Lookup (M)
  businessProcess: string; // Lookup (M)
  department: string; // Lookup (M)
  owner: string; // Lookup (M)
  ownerRole?: string;
  ownerAvatar?: string;
  coordinator: string; // Lookup (M)
  coordinatorAvatar?: string;
  identificationDate: string; // Date (M)
  reviewDate: string; // Date (M)
  status: RiskStatus; // Workflow (W)
  priority: RiskPriority; // Dropdown (M)
  version: string; // Number (A) e.g. v1.0
  confidentiality: "Internal" | "Confidential" | "Restricted"; // (C)

  // Risk Statement
  statement: string; // Because of [CAUSE], [RISK EVENT] may occur, resulting in [CONSEQUENCE]
  cause: string;
  causeCategory?: "People" | "Process" | "Technology" | "Material" | "External";
  event: string;
  consequence: string;
  businessImpacts: string[];
  affectedObjective: string;

  // Inherent Assessment
  inherentLikelihood: number; // 1 to 5
  inherentImpact: number; // 1 to 5
  inherentScore: number; // Likelihood * Impact (1-25)
  inherentLevel: "Low" | "Moderate" | "High" | "Critical";

  // Controls
  controlsCount?: number;
  controlEffectiveness?: "Effective" | "Partially Effective" | "Ineffective" | "Not Tested";

  // Residual Assessment
  residualLikelihood: number; // 1 to 5
  residualImpact: number; // 1 to 5
  residualScore: number; // 1 to 25
  residualLevel: "Low" | "Moderate" | "High" | "Critical";

  // Trend & Appetite
  trend: "Increasing" | "Stable" | "Decreasing" | "Newly Identified" | "Emerging" | "Resolved";
  appetiteStatus: "Within Appetite" | "Near Tolerance" | "Outside Appetite" | "Requires Escalation";
  treatmentStrategy?: "Avoid" | "Reduce" | "Transfer" | "Accept" | "Exploit" | "Share";
}

export interface ControlItem {
  id: string;
  name: string;
  category: "Preventive" | "Detective" | "Corrective" | "Compensating" | "Automated" | "Manual";
  description: string;
  owner: string;
  frequency: "Continuous" | "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annual";
  method: "Automated Check" | "Manual Audit" | "SOP Review" | "Physical Inspection";
  designEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  operatingEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  result: "Effective" | "Partially Effective" | "Ineffective";
  lastTested: string;
  nextTest: string;
  relatedSOP: string;
  relatedPolicy: string;
}

export interface RiskActionItem {
  id: string;
  riskId: string;
  action: string;
  category: "Preventive Action" | "Control Improvement" | "Contingency Preparation" | "Monitoring Action";
  owner: string;
  dueDate: string;
  budget: string;
  status: "Open" | "Assigned" | "In Progress" | "Evidence Submitted" | "Verified" | "Closed";
  evidence?: string;
  priority: "High" | "Medium" | "Low";
}

export interface KRIItem {
  id: string;
  name: string;
  linkedRiskId: string;
  linkedRiskTitle: string;
  category: "Financial" | "Operational" | "Quality" | "Cybersecurity" | "Supply Chain" | "Customer" | "Project" | "HR" | "Compliance";
  metric: string;
  currentValue: string;
  target: string;
  warningThreshold: string;
  criticalThreshold: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  owner: string;
  dataSource: string;
  status: "Green" | "Amber" | "Red";
}

export interface ImpactAreaRating {
  area: "Financial" | "Customer" | "Operational" | "Product" | "Quality" | "Compliance" | "Reputation" | "Safety" | "Strategic";
  level: number; // 1 to 5
  description: string;
}

export interface ScenarioItem {
  id: string;
  type: "Best Case" | "Expected Case" | "Adverse Case" | "Severe Case" | "Extreme Case";
  riskId: string;
  trigger: string;
  assumptions: string;
  probability: string;
  financialImpact: string;
  operationalImpact: string;
  customerImpact: string;
  response: string;
  recoveryTime: string;
  decision: string;
}

export interface ContingencyPlanItem {
  riskId: string;
  trigger: string;
  responseObjective: string;
  immediateAction: string;
  responsibleTeam: string;
  alternativeSupplier?: string;
  alternativeFacility?: string;
  backupSystem?: string;
  recoveryTimeRTO: string;
  recoveryPointRPO: string;
  emergencyContact: string;
}

// 1. Form Information MAICW Table
export const MAICW_FORM_FIELDS: MAICWFieldDef[] = [
  { field: "Enterprise Risk ID", type: "Auto Number", maicw: "A", description: "Unique risk identifier generated sequentially (e.g., ER-2026-001)" },
  { field: "Risk Code", type: "Text", maicw: "A", description: "Controlled enterprise risk reference code linked to taxonomy" },
  { field: "Risk Title", type: "Text", maicw: "M", description: "Concise title describing the enterprise risk event" },
  { field: "Risk Category", type: "Dropdown", maicw: "M", description: "Controlled taxonomy: Strategic, Financial, Operational, Technology, etc." },
  { field: "Risk Type", type: "Dropdown", maicw: "M", description: "Threat, Opportunity, Emerging Risk, Existing Risk, Residual, Strategic" },
  { field: "Business Function", type: "Lookup", maicw: "M", description: "Affected organizational function (Operations, Engineering, Finance, etc.)" },
  { field: "Business Process", type: "Lookup", maicw: "M", description: "Primary affected operational process (Procurement, Assembly, etc.)" },
  { field: "Department", type: "Lookup", maicw: "M", description: "Risk-owning department with cost center accountability" },
  { field: "Risk Owner", type: "Lookup", maicw: "M", description: "Designated accountable executive/manager owning the risk posture" },
  { field: "Risk Coordinator", type: "Lookup", maicw: "M", description: "Assigned risk management coordinator facilitating assessments" },
  { field: "Identification Date", type: "Date", maicw: "M", description: "Calendar date on which the risk was formally identified" },
  { field: "Review Date", type: "Date", maicw: "M", description: "Scheduled next formal review and reassessment date" },
  { field: "Status", type: "Workflow", maicw: "W", description: "Open, Monitoring, Escalated, Closed with governance gating" },
  { field: "Priority", type: "Dropdown", maicw: "M", description: "Critical, High, Medium, Low escalation urgency indicator" },
  { field: "Version", type: "Number", maicw: "A", description: "Controlled auto-incrementing document revision version (v1.0)" },
  { field: "Confidentiality", type: "Dropdown", maicw: "C", description: "Internal, Confidential, Restricted information classification" },
];

// Master Active Risk matching Screenshot
export const PRIMARY_ACTIVE_RISK: EnterpriseRiskRecord = {
  id: "ER-2026-001",
  riskCode: "RK-SC-01",
  title: "Supply Chain Disruption - Critical Components",
  category: "Supply Chain",
  subCategory: "Single Source Dependency",
  type: "Threat",
  businessFunction: "Operations",
  businessProcess: "Procurement",
  department: "Supply Chain",
  owner: "Karthik R.",
  ownerRole: "VP of Supply Chain",
  coordinator: "Priya Sharma",
  identificationDate: "15-Aug-2026",
  reviewDate: "15-Nov-2026",
  status: "Monitoring",
  priority: "High",
  version: "v1.0",
  confidentiality: "Restricted",
  statement:
    "Because of dependency on a single supplier for critical power electronics components, supply interruption may occur, resulting in production delays and customer delivery impact.",
  cause: "Single-source procurement contract for EV powertrain microcontroller semiconductors",
  causeCategory: "Material",
  event: "Tier-1 component fabrication disruption or geopolitical export hold",
  consequence: "Line stoppage at Pune EV plant, backlog accumulation, revenue deferral",
  businessImpacts: [
    "Production Delay",
    "Increased Cost",
    "Customer Dissatisfaction",
    "Revenue Loss",
    "Reputation Risk",
  ],
  affectedObjective: "Achieve Q4 Delivery Target of 12,000 EV Commercial Fleet Units",
  inherentLikelihood: 4,
  inherentImpact: 5,
  inherentScore: 20,
  inherentLevel: "Critical",
  controlsCount: 3,
  controlEffectiveness: "Partially Effective",
  residualLikelihood: 3,
  residualImpact: 4,
  residualScore: 12,
  residualLevel: "High",
  trend: "Increasing",
  appetiteStatus: "Near Tolerance",
  treatmentStrategy: "Reduce",
};

// Executive Top 5 Risks matching Screenshot
export const TOP_RISKS_SUMMARY: EnterpriseRiskRecord[] = [
  PRIMARY_ACTIVE_RISK,
  {
    id: "ER-002",
    riskCode: "RK-CY-04",
    title: "Cybersecurity Breach",
    category: "Cybersecurity",
    type: "Threat",
    businessFunction: "IT & Cybersecurity",
    businessProcess: "Cloud Infrastructure",
    department: "IT Security",
    owner: "Vikram Malhotra",
    coordinator: "Ananya Sen",
    identificationDate: "02-Aug-2026",
    reviewDate: "01-Nov-2026",
    status: "Open",
    priority: "Critical",
    version: "v1.1",
    confidentiality: "Restricted",
    statement:
      "Because of exposed API endpoints on telematics gateways, unauthorized access may occur, resulting in fleet data compromise and regulatory penalties.",
    cause: "Legacy firmware API v1 authentication deprecation delay",
    event: "Credential stuffing or zero-day token spoofing",
    consequence: "Vehicle telematics telemetry exfiltration, fleet trust erosion",
    businessImpacts: ["Data Breach", "Compliance Penalty", "Customer Dissatisfaction", "Reputation Loss"],
    affectedObjective: "Zero High-Severity Cyber Incidents across Connected Fleet",
    inherentLikelihood: 4,
    inherentImpact: 4,
    inherentScore: 16,
    inherentLevel: "High",
    controlsCount: 4,
    controlEffectiveness: "Partially Effective",
    residualLikelihood: 3,
    residualImpact: 3,
    residualScore: 9,
    residualLevel: "Moderate",
    trend: "Increasing",
    appetiteStatus: "Within Appetite",
    treatmentStrategy: "Reduce",
  },
  {
    id: "ER-003",
    riskCode: "RK-CO-02",
    title: "Regulatory Change",
    category: "Compliance",
    type: "Threat",
    businessFunction: "Legal & Regulatory",
    businessProcess: "Homologation",
    department: "Regulatory Affairs",
    owner: "Sunita Deshmukh",
    coordinator: "Priya Sharma",
    identificationDate: "20-Jul-2026",
    reviewDate: "20-Oct-2026",
    status: "Monitoring",
    priority: "High",
    version: "v1.0",
    confidentiality: "Internal",
    statement:
      "Because of anticipated amendments in AIS-156 battery safety norms, sudden re-certification mandates may occur, delaying EV vehicle rollout.",
    cause: "Bureau of Indian Standards battery thermal testing revision guidelines",
    event: "Mandatory pack re-testing at ARAI with 6-week lead time",
    consequence: "Delayed launch of Mark-III Commercial Hauler EV",
    businessImpacts: ["Revenue Loss", "Production Delay", "Testing Surcharges"],
    affectedObjective: "Q1 Launch Adherence for Model-E Heavy Cargo",
    inherentLikelihood: 5,
    inherentImpact: 3,
    inherentScore: 15,
    inherentLevel: "High",
    controlsCount: 2,
    controlEffectiveness: "Effective",
    residualLikelihood: 3,
    residualImpact: 3,
    residualScore: 9,
    residualLevel: "Moderate",
    trend: "Increasing",
    appetiteStatus: "Within Appetite",
    treatmentStrategy: "Reduce",
  },
  {
    id: "ER-004",
    riskCode: "RK-TE-07",
    title: "Technology Obsolescence",
    category: "Technology",
    type: "Threat",
    businessFunction: "R&D",
    businessProcess: "Battery Cell R&D",
    department: "Power Electronics",
    owner: "Dr. R. Venkat",
    coordinator: "Nikhil Joshi",
    identificationDate: "10-Jun-2026",
    reviewDate: "10-Dec-2026",
    status: "Open",
    priority: "Medium",
    version: "v1.0",
    confidentiality: "Confidential",
    statement:
      "Because of rapid market transition from NMC to Sodium-ion chemistry, current cell manufacturing tooling may face early obsolescence.",
    cause: "Accelerated competitor adoption of solid-state and sodium cell tech",
    event: "Customer shift to cheaper non-lithium fleet battery chemistries",
    consequence: "Tooling asset write-down and margin pressure",
    businessImpacts: ["Asset Impairment", "Market Share Erosion", "Technology Lag"],
    affectedObjective: "Sustain 3-Year EV Powertrain Cost Leadership",
    inherentLikelihood: 4,
    inherentImpact: 3,
    inherentScore: 12,
    inherentLevel: "High",
    controlsCount: 2,
    controlEffectiveness: "Effective",
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualLevel: "Moderate",
    trend: "Increasing",
    appetiteStatus: "Within Appetite",
    treatmentStrategy: "Exploit",
  },
  {
    id: "ER-005",
    riskCode: "RK-FI-03",
    title: "Cash Flow Shortage",
    category: "Financial",
    type: "Threat",
    businessFunction: "Finance & Treasury",
    businessProcess: "Working Capital Management",
    department: "Treasury",
    owner: "Arun Kumar",
    coordinator: "Kavita Reddy",
    identificationDate: "18-May-2026",
    reviewDate: "18-Nov-2026",
    status: "Monitoring",
    priority: "High",
    version: "v2.0",
    confidentiality: "Confidential",
    statement:
      "Because of delayed subsidy disbursement under FAME-III scheme, operating cash buffers may contract below 60 days.",
    cause: "Government portal reconciliation lag for EV subsidy claims",
    event: "Working capital drawdown exceeding short-term credit line",
    consequence: "Supplier payment deferral and inventory financing friction",
    businessImpacts: ["Working Capital Stress", "Interest Surcharges", "Supplier Trust Impact"],
    affectedObjective: "Maintain Minimum 90-Day Cash Runway across Operating Subsidiaries",
    inherentLikelihood: 3,
    inherentImpact: 4,
    inherentScore: 12,
    inherentLevel: "High",
    controlsCount: 3,
    controlEffectiveness: "Partially Effective",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    trend: "Decreasing",
    appetiteStatus: "Within Appetite",
    treatmentStrategy: "Reduce",
  },
];

// Full Enterprise Risk Register (42 Risks)
export const FULL_ENTERPRISE_RISKS: EnterpriseRiskRecord[] = [
  ...TOP_RISKS_SUMMARY,
  {
    id: "ER-006",
    riskCode: "RK-PR-01",
    title: "Battery Cell Thermal Runaway",
    category: "Product",
    type: "Threat",
    businessFunction: "Engineering",
    businessProcess: "Battery Pack Engineering",
    department: "Battery Systems",
    owner: "Dr. R. Venkat",
    coordinator: "Nikhil Joshi",
    identificationDate: "12-Aug-2026",
    reviewDate: "12-Nov-2026",
    status: "Monitoring",
    priority: "Critical",
    version: "v1.2",
    confidentiality: "Restricted",
    statement: "Because of internal micro-short in high-density lithium cells, thermal runaway may propagate, causing pack rupture and vehicle fire.",
    cause: "Electrode manufacturing micro-burr from Tier-2 cell supplier",
    event: "Pack module thermal propagation during fast DC charging",
    consequence: "Vehicle recall, safety investigations, customer distrust",
    businessImpacts: ["Safety Risk", "Brand Damage", "Product Recall Costs", "Regulatory Ban"],
    affectedObjective: "Zero Thermal Safety Incidents across Fleet",
    inherentLikelihood: 5,
    inherentImpact: 5,
    inherentScore: 25,
    inherentLevel: "Critical",
    controlsCount: 5,
    controlEffectiveness: "Effective",
    residualLikelihood: 2,
    residualImpact: 5,
    residualScore: 10,
    residualLevel: "High",
    trend: "Stable",
    appetiteStatus: "Near Tolerance",
    treatmentStrategy: "Reduce",
  },
  {
    id: "ER-007",
    riskCode: "RK-OP-03",
    title: "Automated Assembly Line Downtime",
    category: "Operational",
    type: "Threat",
    businessFunction: "Manufacturing",
    businessProcess: "Chassis Robotic Welding",
    department: "Plant Operations",
    owner: "Deepak S.",
    coordinator: "Priya Sharma",
    identificationDate: "05-Aug-2026",
    reviewDate: "05-Nov-2026",
    status: "Monitoring",
    priority: "High",
    version: "v1.0",
    confidentiality: "Internal",
    statement: "Because of robotic servo drive gearbox wear on Line 2, sudden unpredicted mechanical breakdown may halt line operations for >48 hours.",
    cause: "Preventive grease lubrication interval skipped during surge shifts",
    event: "Joint-4 servo lock during production shift",
    consequence: "Daily output lost of 80 vehicle bodies, overtime costs",
    businessImpacts: ["Production Delay", "Overtime Costs", "Customer Delivery Lag"],
    affectedObjective: "Maintain Overall Equipment Effectiveness (OEE) > 85%",
    inherentLikelihood: 4,
    inherentImpact: 4,
    inherentScore: 16,
    inherentLevel: "High",
    controlsCount: 3,
    controlEffectiveness: "Partially Effective",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    trend: "Decreasing",
    appetiteStatus: "Within Appetite",
    treatmentStrategy: "Reduce",
  },
  {
    id: "ER-008",
    riskCode: "RK-ST-02",
    title: "Aggressive EV Price War by Incumbents",
    category: "Strategic",
    type: "Threat",
    businessFunction: "Commercial Strategy",
    businessProcess: "Market Pricing & Distribution",
    department: "Executive Strategy",
    owner: "Arun Kumar",
    coordinator: "Kavita Reddy",
    identificationDate: "01-Jul-2026",
    reviewDate: "01-Oct-2026",
    status: "Open",
    priority: "Critical",
    version: "v1.1",
    confidentiality: "Confidential",
    statement: "Because of subsidized price slashing by legacy OEM entrants, fleet conversion rates may drop below projections.",
    cause: "Incumbent legacy auto manufacturers launching loss-leader commercial EVs",
    event: "Price cuts of 15% across target commercial fleet segment",
    consequence: "Order cancellations and margin dilution",
    businessImpacts: ["Revenue Contraction", "Margin Erosion", "Market Share Loss"],
    affectedObjective: "Secure 25% Market Share in Tier-1 Logistics Fleet Transition",
    inherentLikelihood: 5,
    inherentImpact: 4,
    inherentScore: 20,
    inherentLevel: "Critical",
    controlsCount: 2,
    controlEffectiveness: "Partially Effective",
    residualLikelihood: 4,
    residualImpact: 3,
    residualScore: 12,
    residualLevel: "High",
    trend: "Increasing",
    appetiteStatus: "Outside Appetite",
    treatmentStrategy: "Reduce",
  },
  {
    id: "ER-009",
    riskCode: "RK-PE-04",
    title: "High Attrition of Senior EV Firmware Engineers",
    category: "People",
    type: "Threat",
    businessFunction: "Human Resources",
    businessProcess: "Talent Retention",
    department: "HR & Talent",
    owner: "Shalini Menon",
    coordinator: "Ananya Sen",
    identificationDate: "15-Jul-2026",
    reviewDate: "15-Oct-2026",
    status: "Monitoring",
    priority: "Medium",
    version: "v1.0",
    confidentiality: "Internal",
    statement: "Because of aggressive headhunting by multinational tech automotive centres, critical firmware architects may leave without adequate handover.",
    cause: "High global demand for AUTOSAR and ISO-26262 functional safety talent",
    event: "Resignation of 3 lead battery management software engineers in single quarter",
    consequence: "Sprint delays on OTA v2.4 vehicle operating system release",
    businessImpacts: ["Project Delay", "Knowledge Loss", "Recruiting Surcharges"],
    affectedObjective: "Retain 95% of Core Engineering Talent",
    inherentLikelihood: 4,
    inherentImpact: 3,
    inherentScore: 12,
    inherentLevel: "High",
    controlsCount: 3,
    controlEffectiveness: "Partially Effective",
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualLevel: "Moderate",
    trend: "Stable",
    appetiteStatus: "Within Appetite",
    treatmentStrategy: "Reduce",
  },
  {
    id: "ER-010",
    riskCode: "RK-BC-01",
    title: "Regional Grid Blackout at Assembly Gigafactory",
    category: "Business Continuity",
    type: "Threat",
    businessFunction: "Plant Facilities",
    businessProcess: "Power & Utilities Continuity",
    department: "Facilities & Infrastructure",
    owner: "Deepak S.",
    coordinator: "Priya Sharma",
    identificationDate: "10-Jul-2026",
    reviewDate: "10-Oct-2026",
    status: "Monitoring",
    priority: "Medium",
    version: "v1.0",
    confidentiality: "Internal",
    statement: "Because of transformer sub-station failure during monsoon grid surge, entire plant may lose main electrical feed.",
    cause: "State electricity board grid vulnerability during peak storm season",
    event: "Unscheduled 18-hour outage on 110kV feeder",
    consequence: "Paint shop immersion tank freeze, HVAC disruption",
    businessImpacts: ["Production Loss", "Material Waste", "Scrap Generation"],
    affectedObjective: "100% Plant Power Redundancy with On-site Solar & BESS",
    inherentLikelihood: 3,
    inherentImpact: 3,
    inherentScore: 9,
    inherentLevel: "Moderate",
    controlsCount: 3,
    controlEffectiveness: "Effective",
    residualLikelihood: 1,
    residualImpact: 3,
    residualScore: 3,
    residualLevel: "Low",
    trend: "Stable",
    appetiteStatus: "Within Appetite",
    treatmentStrategy: "Transfer",
  },
  {
    id: "ER-011",
    riskCode: "RK-QU-02",
    title: "Sub-assembly Harness Crimping Defects",
    category: "Quality",
    type: "Threat",
    businessFunction: "Quality Assurance",
    businessProcess: "Incoming & In-process QA",
    department: "QA & Reliability",
    owner: "Rajesh Iyer",
    coordinator: "Priya Sharma",
    identificationDate: "28-Jul-2026",
    reviewDate: "28-Oct-2026",
    status: "Monitoring",
    priority: "Medium",
    version: "v1.0",
    confidentiality: "Internal",
    statement: "Because of calibrated crimping tool wear at vendor facility, low-voltage harness connections may suffer intermittent signal drop.",
    cause: "Tier-2 wire harness supplier calibration cycle lag",
    event: "Can-bus communications timeout during final end-of-line dyno testing",
    consequence: "EOL inspection backlog and offline vehicle rework",
    businessImpacts: ["Rework Hours", "PPM Increase", "Inspection Bottlenecks"],
    affectedObjective: "Assembly Line PPM < 50",
    inherentLikelihood: 3,
    inherentImpact: 3,
    inherentScore: 9,
    inherentLevel: "Moderate",
    controlsCount: 3,
    controlEffectiveness: "Effective",
    residualLikelihood: 1,
    residualImpact: 3,
    residualScore: 3,
    residualLevel: "Low",
    trend: "Decreasing",
    appetiteStatus: "Within Appetite",
    treatmentStrategy: "Reduce",
  },
  {
    id: "ER-012",
    riskCode: "RK-RE-05",
    title: "Viral Social Media Incident on Charging Incompatibility",
    category: "Reputation",
    type: "Threat",
    businessFunction: "Corporate Communications",
    businessProcess: "Public Relations & Customer Care",
    department: "Marketing & Brand",
    owner: "Ananya Sen",
    coordinator: "Kavita Reddy",
    identificationDate: "14-Aug-2026",
    reviewDate: "14-Nov-2026",
    status: "Monitoring",
    priority: "Medium",
    version: "v1.0",
    confidentiality: "Internal",
    statement: "Because of third-party public DC fast charger handshake failure, stranded fleet customer videos may gain viral negative traction.",
    cause: "CCS2 protocol compatibility variance across regional charging providers",
    event: "Negative viral social video from prominent logistics influencer",
    consequence: "Customer hesitation on enterprise fleet lease contracts",
    businessImpacts: ["Brand Perception", "Fleet Deal Delay", "PR Crisis Management"],
    affectedObjective: "Net Promoter Score (NPS) > 65 across Fleet Operators",
    inherentLikelihood: 3,
    inherentImpact: 3,
    inherentScore: 9,
    inherentLevel: "Moderate",
    controlsCount: 2,
    controlEffectiveness: "Partially Effective",
    residualLikelihood: 2,
    residualImpact: 2,
    residualScore: 4,
    residualLevel: "Low",
    trend: "Stable",
    appetiteStatus: "Within Appetite",
    treatmentStrategy: "Reduce",
  },
];

// Key Risk Indicators (KRIs) matching Screenshot
export const KRI_ITEMS: KRIItem[] = [
  {
    id: "KRI-SC-01",
    name: "Supplier Lead Time (days)",
    linkedRiskId: "ER-2026-001",
    linkedRiskTitle: "Supply Chain Disruption - Critical Components",
    category: "Supply Chain",
    metric: "Average calendar days from purchase order to factory dock delivery",
    currentValue: "45",
    target: "30",
    warningThreshold: "> 35",
    criticalThreshold: "> 30",
    frequency: "Weekly",
    owner: "Karthik R.",
    dataSource: "Procurement MRP Module",
    status: "Red",
  },
  {
    id: "KRI-SC-02",
    name: "Component Price Increase (%)",
    linkedRiskId: "ER-2026-001",
    linkedRiskTitle: "Supply Chain Disruption - Critical Components",
    category: "Supply Chain",
    metric: "Quarterly weighted raw materials price delta",
    currentValue: "18%",
    target: "5%",
    warningThreshold: "> 10%",
    criticalThreshold: "> 15%",
    frequency: "Monthly",
    owner: "Karthik R.",
    dataSource: "Supplier Price Index",
    status: "Red",
  },
  {
    id: "KRI-OP-01",
    name: "Inventory Coverage (weeks)",
    linkedRiskId: "ER-2026-001",
    linkedRiskTitle: "Supply Chain Disruption - Critical Components",
    category: "Operational",
    metric: "Safety stock weeks on critical semiconductors",
    currentValue: "2",
    target: "6",
    warningThreshold: "< 5",
    criticalThreshold: "< 4",
    frequency: "Weekly",
    owner: "Logistics Team",
    dataSource: "WMS Inventory Telemetry",
    status: "Red",
  },
  {
    id: "KRI-CU-01",
    name: "Customer Delivery Delay (%)",
    linkedRiskId: "ER-2026-001",
    linkedRiskTitle: "Supply Chain Disruption - Critical Components",
    category: "Customer",
    metric: "Percentage of fleet vehicle deliveries past SLA contract date",
    currentValue: "8%",
    target: "2%",
    warningThreshold: "> 4%",
    criticalThreshold: "> 5%",
    frequency: "Weekly",
    owner: "Customer Fulfillment",
    dataSource: "CRM Orders Pipeline",
    status: "Amber",
  },
  {
    id: "KRI-CY-01",
    name: "Cybersecurity Incidents",
    linkedRiskId: "ER-002",
    linkedRiskTitle: "Cybersecurity Breach",
    category: "Cybersecurity",
    metric: "Number of high/critical alerts detected on SIEM SOC",
    currentValue: "1",
    target: "0",
    warningThreshold: "> 0",
    criticalThreshold: "> 0",
    frequency: "Daily",
    owner: "Vikram Malhotra",
    dataSource: "SIEM Cloud Sentinel",
    status: "Amber",
  },
  {
    id: "KRI-FI-01",
    name: "Cash Runway (Days)",
    linkedRiskId: "ER-005",
    linkedRiskTitle: "Cash Flow Shortage",
    category: "Financial",
    metric: "Operating cash runway at current burn rate",
    currentValue: "78",
    target: "90",
    warningThreshold: "< 85",
    criticalThreshold: "< 60",
    frequency: "Weekly",
    owner: "Arun Kumar",
    dataSource: "Treasury GL Cash Position",
    status: "Amber",
  },
  {
    id: "KRI-QU-01",
    name: "End of Line Defect Rate (PPM)",
    linkedRiskId: "ER-011",
    linkedRiskTitle: "Sub-assembly Harness Crimping Defects",
    category: "Quality",
    metric: "Defects per million parts on battery pack assembly",
    currentValue: "38",
    target: "50",
    warningThreshold: "> 45",
    criticalThreshold: "> 60",
    frequency: "Daily",
    owner: "Rajesh Iyer",
    dataSource: "QA Mes System",
    status: "Green",
  },
];

// Treatment Action Plans matching Screenshot
export const RISK_TREATMENT_ACTIONS: RiskActionItem[] = [
  {
    id: "ACT-01",
    riskId: "ER-2026-001",
    action: "Identify alternate supplier",
    category: "Preventive Action",
    owner: "Karthik R.",
    dueDate: "30-Sep-2026",
    budget: "₹1,500,000",
    status: "In Progress",
    priority: "High",
    evidence: "RFI sent to 3 Tier-1 Japanese semiconductor fabs",
  },
  {
    id: "ACT-02",
    riskId: "ER-2026-001",
    action: "Increase safety stock",
    category: "Contingency Preparation",
    owner: "Logistics Team",
    dueDate: "15-Oct-2026",
    budget: "₹4,200,000",
    status: "Open",
    priority: "High",
    evidence: "PO drafted for additional 4,000 buffer controller units",
  },
  {
    id: "ACT-03",
    riskId: "ER-2026-001",
    action: "Long-term supply contract",
    category: "Control Improvement",
    owner: "Procurement",
    dueDate: "30-Nov-2026",
    budget: "₹8,000,000",
    status: "Open",
    priority: "High",
    evidence: "Master Purchase Agreement terms in legal review",
  },
  {
    id: "ACT-04",
    riskId: "ER-2026-001",
    action: "Risk review with suppliers",
    category: "Monitoring Action",
    owner: "Karthik R.",
    dueDate: "15-Oct-2026",
    budget: "₹250,000",
    status: "Open",
    priority: "Medium",
    evidence: "Quarterly Supplier Executive Business Review scheduled",
  },
  {
    id: "ACT-05",
    riskId: "ER-2026-001",
    action: "Contingency plan",
    category: "Contingency Preparation",
    owner: "Operations",
    dueDate: "30-Oct-2026",
    budget: "₹750,000",
    status: "Open",
    priority: "Medium",
    evidence: "Secondary production routing SOP under simulation",
  },
];

// Controls for Primary Risk
export const PRIMARY_RISK_CONTROLS: ControlItem[] = [
  {
    id: "CTRL-SC-01",
    name: "Dual-sourcing Audit & Qualification Framework",
    category: "Preventive",
    description: "Mandatory qualification of at least one secondary supplier for all components classified as Class-A BOM.",
    owner: "Karthik R.",
    frequency: "Quarterly",
    method: "Manual Audit",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Partially Effective",
    lastTested: "10-Jul-2026",
    nextTest: "10-Oct-2026",
    relatedSOP: "SOP-SCM-402 Dual Source Qualification",
    relatedPolicy: "POL-CORP-08 Supply Chain Resilience",
  },
  {
    id: "CTRL-SC-02",
    name: "Automated Buffer Stock Trigger (ERP MRP)",
    category: "Automated",
    description: "Automatic re-order point calculations based on dynamic lead-time telemetry from Tier-1 freight forwarders.",
    owner: "Logistics Team",
    frequency: "Continuous",
    method: "Automated Check",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Effective",
    lastTested: "01-Aug-2026",
    nextTest: "01-Sep-2026",
    relatedSOP: "SOP-WMS-201 Safety Stock Thresholds",
    relatedPolicy: "POL-OPS-03 Working Capital & Inventory",
  },
  {
    id: "CTRL-SC-03",
    name: "Monthly Supplier Financial Health Monitoring",
    category: "Detective",
    description: "Credit agency scoring and Altman Z-score review of top 20 single-source key suppliers.",
    owner: "Finance & Treasury",
    frequency: "Monthly",
    method: "SOP Review",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Partially Effective",
    lastTested: "15-Jul-2026",
    nextTest: "15-Aug-2026",
    relatedSOP: "SOP-FIN-510 Counterparty Risk Assessment",
    relatedPolicy: "POL-FIN-12 Treasury Counterparty Governance",
  },
];

// Quick Insights matching Screenshot (1 to 6 AI-Powered)
export const AI_QUICK_INSIGHTS = [
  { id: 1, text: "Supply chain risks increased by 30% this quarter.", tone: "teal" },
  { id: 2, text: "Two critical risks are outside the risk appetite.", tone: "orange" },
  { id: 3, text: "Supplier lead time is 50% higher than target.", tone: "amber" },
  { id: 4, text: "Cybersecurity threats are emerging in the sector.", tone: "purple" },
  { id: 5, text: "Recommend diversifying suppliers for critical components.", tone: "red" },
  { id: 6, text: "Overall risk exposure is within acceptable tolerance.", tone: "emerald" },
];

// Category Distribution matching Screenshot Donut
export const CATEGORY_DISTRIBUTION = [
  { name: "Strategic", percentage: 14, count: 6, color: "#3B82F6" },
  { name: "Financial", percentage: 12, count: 5, color: "#10B981" },
  { name: "Operational", percentage: 24, count: 10, color: "#F59E0B" },
  { name: "Technology", percentage: 12, count: 5, color: "#6366F1" },
  { name: "Cybersecurity", percentage: 10, count: 4, color: "#EC4899" },
  { name: "Supply Chain", percentage: 14, count: 6, color: "#EF4444" },
  { name: "Compliance", percentage: 7, count: 3, color: "#8B5CF6" },
  { name: "People", percentage: 5, count: 2, color: "#14B8A6" },
  { name: "Others", percentage: 2, count: 1, color: "#94A3B8" },
];

// Monthly Trend matching Screenshot Line Chart
export const RISK_TREND_DATA = [
  { month: "Apr", totalRisks: 38, highCritical: 14, medium: 18, low: 6 },
  { month: "May", totalRisks: 39, highCritical: 15, medium: 19, low: 5 },
  { month: "Jun", totalRisks: 40, highCritical: 16, medium: 19, low: 5 },
  { month: "Jul", totalRisks: 40, highCritical: 17, medium: 18, low: 5 },
  { month: "Aug", totalRisks: 41, highCritical: 18, medium: 18, low: 5 },
  { month: "Sep", totalRisks: 42, highCritical: 18, medium: 18, low: 6 },
];

// Executive KPI summary numbers
export const ENTERPRISE_RISK_KPIS = {
  totalRisks: { value: 42, delta: "+ 12%", isPositive: true },
  criticalRisks: { value: 6, delta: "+ 20%", isPositive: false },
  highRisks: { value: 12, delta: "v 8%", isPositive: true },
  mediumRisks: { value: 18, delta: "-> 0%", isPositive: true },
  lowRisks: { value: 6, delta: "v 25%", isPositive: true },
  overdueActions: { value: 9, delta: "+ 50%", isPositive: false },
  residualExposure: { value: "₹48.6 Cr", delta: "- 14%", isPositive: true },
  krisInRed: { value: 3, delta: "Stable", isPositive: false },
};

// 25 Reports defined in Section 50
export const REPORT_DEFINITIONS = [
  { id: "REP-01", name: "Enterprise Risk Register", category: "Portfolio", description: "Complete enterprise risk portfolio with inherent/residual scores and owners" },
  { id: "REP-02", name: "Executive Risk Dashboard", category: "Executive", description: "High-level CXO & Board summary of top enterprise threats and exposure" },
  { id: "REP-03", name: "Risk Heat Map Analysis", category: "Distribution", description: "5x5 Likelihood x Impact matrix distribution with concentration clusters" },
  { id: "REP-04", name: "Risk Exposure Report", category: "Financial", description: "Quantified monetary exposure by business unit and operational division" },
  { id: "REP-05", name: "Critical Risk Report", category: "Threats", description: "Deep-dive on all 6 Critical score (17-25) enterprise risks" },
  { id: "REP-06", name: "High Risk Report", category: "Threats", description: "Analysis of 12 High score (10-16) risks requiring executive treatment" },
  { id: "REP-07", name: "Emerging Risk Report", category: "Horizon", description: "Scan of early-stage uncertainties, AI signals, and geopolitical developments" },
  { id: "REP-08", name: "Risk Appetite Compliance", category: "Governance", description: "Evaluation of risks operating near or exceeding approved risk tolerance" },
  { id: "REP-09", name: "Inherent Risk Assessment", category: "Assessment", description: "Raw pre-control risk exposure across all 12 operational categories" },
  { id: "REP-10", name: "Residual Risk Post-Controls", category: "Assessment", description: "Risk remaining after considering operational and automated controls" },
  { id: "REP-11", name: "Control Effectiveness Review", category: "Controls", description: "Operating vs design effectiveness audit of preventive and detective controls" },
  { id: "REP-12", name: "KRI Status & Thresholds", category: "Monitoring", description: "Telemetry report of Green, Amber, Red Key Risk Indicators" },
  { id: "REP-13", name: "Risk Trend & Velocity", category: "Trends", description: "Month-over-month trajectory of risk scores and emerging signals" },
  { id: "REP-14", name: "Risk Action Plan Progress", category: "Actions", description: "Status of preventive actions, budgets, and milestones" },
  { id: "REP-15", name: "Overdue Action Report", category: "Actions", description: "Escalation list of 9 delayed risk mitigation and control actions" },
  { id: "REP-16", name: "Risk Escalation Audit", category: "Governance", description: "Audit trail of risks elevated to Risk Committee, CXO, and Board" },
  { id: "REP-17", name: "Risk Acceptance Register", category: "Governance", description: "Log of accepted risks, signoff authorities, conditions, and expiry dates" },
  { id: "REP-18", name: "Scenario Analysis Outcomes", category: "Scenarios", description: "Best, Expected, Adverse, Severe, and Extreme scenario modeling" },
  { id: "REP-19", name: "Stress Testing Report", category: "Scenarios", description: "Financial and operational impact under revenue reduction & lead-time shocks" },
  { id: "REP-20", name: "Business Continuity Risk", category: "Continuity", description: "Process dependencies, RTO/RPO targets, and contingency readiness" },
  { id: "REP-21", name: "Cybersecurity Threat Audit", category: "Cyber", description: "MFA coverage, vulnerability patches, endpoint telemetry, and SOC alerts" },
  { id: "REP-22", name: "Supply Chain Vulnerability", category: "Supply Chain", description: "Single-source concentration, supplier OTIF, and buffer stock health" },
  { id: "REP-23", name: "Financial Risk & Runway", category: "Financial", description: "Cash runway, subsidy receivables, forex fluctuations, and debt covenants" },
  { id: "REP-24", name: "Product Safety & Quality Risk", category: "Product", description: "Battery pack DFMEA, homologation status, and field reliability metrics" },
  { id: "REP-25", name: "AI Risk Intelligence Summary", category: "AI & BI", description: "Evidence-linked AI detections, anomaly correlations, and executive brief" },
];

export type ReportDefinition = (typeof REPORT_DEFINITIONS)[number];

// Helper score calculation
export function calculateRiskScore(likelihood: number, impact: number): {
  score: number;
  level: "Low" | "Moderate" | "High" | "Critical";
  color: string;
} {
  const score = likelihood * impact;
  if (score >= 17) return { score, level: "Critical", color: "bg-red-500 text-white" };
  if (score >= 10) return { score, level: "High", color: "bg-orange-500 text-white" };
  if (score >= 5) return { score, level: "Moderate", color: "bg-amber-400 text-slate-900" };
  return { score, level: "Low", color: "bg-emerald-500 text-white" };
}

// Enterprise Risk Service Interface
export const enterpriseRiskService = {
  getOverviewKpis() {
    return ENTERPRISE_RISK_KPIS;
  },

  getPrimaryRisk() {
    return PRIMARY_ACTIVE_RISK;
  },

  getAllRisks() {
    return FULL_ENTERPRISE_RISKS;
  },

  getTopRisks() {
    return TOP_RISKS_SUMMARY;
  },

  getKRIs() {
    return KRI_ITEMS;
  },

  getActions() {
    return RISK_TREATMENT_ACTIONS;
  },

  getCategoryDistribution() {
    return CATEGORY_DISTRIBUTION;
  },

  getTrendData() {
    return RISK_TREND_DATA;
  },

  getAiInsights() {
    return AI_QUICK_INSIGHTS;
  },

  getReports() {
    return REPORT_DEFINITIONS;
  },

  getMaicwFields() {
    return MAICW_FORM_FIELDS;
  },

  getControls() {
    return PRIMARY_RISK_CONTROLS;
  },
};

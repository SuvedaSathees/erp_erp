// Magnertia ERP - Vendor Risk Service
// Vendor Risk Form - MAICW Classification & Supply Continuity Engine

export type VendorRiskCategory =
  | "Supply & Delivery"
  | "Quality"
  | "Financial"
  | "Operational"
  | "Compliance"
  | "Cybersecurity"
  | "Technology"
  | "Commercial"
  | "ESG & Reputation"
  | "Others";

export type VendorRiskType = "Existing" | "Emerging" | "Event" | "Residual";
export type VendorRiskPriority = "Critical" | "High" | "Medium" | "Low";
export type VendorRiskStatus =
  | "Draft"
  | "Under Assessment"
  | "Due Diligence"
  | "Open"
  | "Monitoring"
  | "Treatment Required"
  | "Escalated"
  | "Accepted"
  | "Verified"
  | "Closed"
  | "Suspended"
  | "Terminated"
  | "Archived";

export interface VendorRiskRecord {
  id: string; // Auto Number (A) e.g. VR-2026-001
  riskCode: string; // Controlled Ref (A) e.g. RK-VND-SC-01
  title: string; // Mandatory (M)
  vendorId: string; // Lookup (M) e.g. V-001
  vendorName: string; // Lookup (M) e.g. ABC Components Pvt Ltd
  vendorType:
    | "Raw Material Supplier"
    | "Component Supplier"
    | "Electronics Supplier"
    | "Software Vendor"
    | "Cloud Provider"
    | "IT Service Provider"
    | "Contract Manufacturer"
    | "Logistics Provider"
    | "Consultant";
  vendorCategory: "Strategic" | "Critical" | "Standard" | "Low";
  vendorTier: "Tier 1 - Critical" | "Tier 2 - Important" | "Tier 3 - Standard" | "Tier 4 - Transactional";
  businessFunction: string; // Lookup (M) e.g. Manufacturing
  department: string; // Lookup (M) e.g. Procurement
  procurementCategory: string; // Lookup (M) e.g. Power Electronics
  contractId?: string; // Lookup (I) e.g. CON-2025-014
  poNumber?: string; // Lookup (I) e.g. PO-450032
  project?: string; // Lookup (I) e.g. PRJ-001 - W-EVSE
  riskOwner: string; // Lookup (M) e.g. Priya Sharma
  riskOwnerAvatar?: string;
  vendorManager: string; // Lookup (M) e.g. Rajesh Kumar
  vendorManagerAvatar?: string;
  identificationDate: string; // Date (M)
  reviewDate: string; // Date (M)
  contractExpiry?: string; // Date (I) e.g. 31-Mar-2028
  status: VendorRiskStatus; // Workflow (W)
  priority: VendorRiskPriority; // Dropdown (M)
  version: string; // Number (A)
  confidentiality: "Internal" | "Confidential" | "Restricted"; // (C)

  // Risk Statement
  statement: string; // Because of [CAUSE], [EVENT] may occur, resulting in [IMPACT].
  cause: string;
  event: string;
  immediateEffect?: string;
  businessImpactSummary?: string;

  // Affected Elements
  affectedProduct?: string; // e.g. 30 kW Charging Station
  affectedProcess?: string; // e.g. Component Procurement
  affectedMilestone?: string; // e.g. Prototype Build (M-02)

  // Business Impact 2x2 Breakdown
  impacts: {
    productionImpact: "Critical" | "High" | "Medium" | "Low";
    scheduleImpact: "Critical" | "High" | "Medium" | "Low";
    costImpact: "Critical" | "High" | "Medium" | "Low";
    customerImpact: "Critical" | "High" | "Medium" | "Low";
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
  treatmentStrategy: "Avoid" | "Reduce" | "Transfer" | "Accept" | "Dual Source" | "Safety Stock";
}

export interface VendorKRI {
  id: string;
  name: string;
  current: string;
  threshold: string;
  status: "Red" | "Amber" | "Green";
  trend: "up" | "down" | "neutral";
  metric: string;
  owner: string;
}

export interface VendorActionItem {
  id: string;
  action: string;
  owner: string;
  dueDate: string;
  budget: string;
  status: "In Progress" | "Open" | "Completed" | "Verified";
  evidence?: string;
}

export interface VendorDueDiligenceRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  financialScore: number; // 0-100
  qualityScore: number; // 0-100
  cybersecurityScore: number; // 0-100
  esgScore: number; // 0-100
  singleSource: boolean;
  switchingTimeMonths: number;
  switchingCostLakhs: number;
  status: "Approved" | "Conditional" | "Under Audit" | "High Risk";
}

export interface VendorControlItem {
  id: string;
  controlName: string;
  objective: string;
  owner: string;
  frequency: "Per Batch" | "Monthly" | "Quarterly" | "Annual";
  designEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  operatingEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  result: "Pass" | "Exception" | "Remediation In Progress";
  relatedSOP: string;
}

// PRIMARY MASTER RECORD MATCHING SCREENSHOT EXACTLY
export const PRIMARY_VENDOR_RISK: VendorRiskRecord = {
  id: "VR-2026-001",
  riskCode: "RK-VND-SC-01",
  title: "Supply disruption due to single source supplier",
  vendorId: "V-001",
  vendorName: "ABC Components Pvt Ltd",
  vendorType: "Component Supplier",
  vendorCategory: "Strategic",
  vendorTier: "Tier 1 - Critical",
  businessFunction: "Manufacturing",
  department: "Procurement",
  procurementCategory: "Power Electronics",
  contractId: "CON-2025-014",
  poNumber: "PO-450032",
  project: "PRJ-001 - W-EVSE",
  riskOwner: "Priya Sharma",
  riskOwnerAvatar: "PS",
  vendorManager: "Rajesh Kumar",
  vendorManagerAvatar: "RK",
  identificationDate: "15-Sep-2026",
  reviewDate: "15-Dec-2026",
  contractExpiry: "31-Mar-2028",
  status: "Monitoring",
  priority: "High",
  version: "1.0",
  confidentiality: "Internal",

  statement:
    "Because of single-source dependency on ABC Components for high-power semiconductor modules, supply interruption may occur, resulting in production delays, project schedule slippage and increased development cost.",
  cause: "Sole manufacturer of custom-molded 1200V dual-MOSFET sub-assemblies without validated secondary fab",
  event: "Factory fire or silicon wafer shortage at ABC Components assembly line",
  immediateEffect: "Immediate 6-week stoppage of high-power charger assembly lines",
  businessImpactSummary: "Delayed delivery of 85 public DC charging stations and ₹18.5L late delivery liquidated damages",

  affectedProduct: "30 kW Charging Station",
  affectedProcess: "Component Procurement",
  affectedMilestone: "Prototype Build (M-02)",

  impacts: {
    productionImpact: "High",
    scheduleImpact: "High",
    costImpact: "High",
    customerImpact: "Medium",
  },

  likelihood: 5, // Almost Certain
  impact: 5, // Severe
  inherentScore: 25, // 5 x 5
  inherentLevel: "Critical",

  residualLikelihood: 3, // Possible
  residualImpact: 4, // Major
  residualScore: 12, // 3 x 4
  residualLevel: "High",

  controlEffectiveness: "Partially Effective",
  treatmentStrategy: "Dual Source",
};

// TOP 5 VENDOR RISKS (SCREENSHOT MATCH)
export const TOP_VENDOR_RISKS = [
  {
    id: "VR-001",
    title: "Supply disruption",
    vendor: "ABC Components",
    category: "Supply & Delivery",
    inherent: 20,
    residual: 12,
    status: "Monitoring" as const,
  },
  {
    id: "VR-002",
    title: "Quality failure",
    vendor: "XYZ Electronics",
    category: "Quality",
    inherent: 16,
    residual: 9,
    status: "Open" as const,
  },
  {
    id: "VR-003",
    title: "Price increase",
    vendor: "LMN Materials",
    category: "Financial",
    inherent: 15,
    residual: 8,
    status: "Monitoring" as const,
  },
  {
    id: "VR-004",
    title: "Vendor insolvency",
    vendor: "TechDrive Pvt Ltd",
    category: "Financial",
    inherent: 18,
    residual: 14,
    status: "Escalated" as const,
  },
  {
    id: "VR-005",
    title: "Cybersecurity breach",
    vendor: "CloudServe Inc",
    category: "Cybersecurity",
    inherent: 12,
    residual: 6,
    status: "Open" as const,
  },
];

// KEY RISK INDICATORS TABLE (SCREENSHOT MATCH)
export const VENDOR_KRIS: VendorKRI[] = [
  {
    id: "KRI-VND-01",
    name: "On-Time Delivery (%)",
    current: "72%",
    threshold: "< 85%",
    status: "Red",
    trend: "down",
    metric: "Supplier OTIF Rate",
    owner: "Procurement Desk",
  },
  {
    id: "KRI-VND-02",
    name: "Supplier PPM",
    current: "450",
    threshold: "> 300",
    status: "Red",
    trend: "up",
    metric: "Parts Per Million Defect Rate",
    owner: "Incoming Quality QA",
  },
  {
    id: "KRI-VND-03",
    name: "Lead Time (weeks)",
    current: "18",
    threshold: "> 12",
    status: "Amber",
    trend: "up",
    metric: "Average Component Lead Time",
    owner: "Supply Chain Manager",
  },
  {
    id: "KRI-VND-04",
    name: "Financial Health Score",
    current: "62",
    threshold: "< 70",
    status: "Amber",
    trend: "down",
    metric: "Altman Z-score composite",
    owner: "Finance Due Diligence",
  },
  {
    id: "KRI-VND-05",
    name: "Single Source Components",
    current: "8",
    threshold: "> 5",
    status: "Red",
    trend: "up",
    metric: "Critical Parts with 1 Source",
    owner: "Sourcing Strategy Lead",
  },
  {
    id: "KRI-VND-06",
    name: "Contract Compliance (%)",
    current: "85%",
    threshold: "< 90%",
    status: "Amber",
    trend: "neutral",
    metric: "SLA Adherence Metric",
    owner: "Legal & Contracts",
  },
];

// RISK TREATMENT ACTIONS TABLE (SCREENSHOT MATCH)
export const VENDOR_TREATMENT_ACTIONS: VendorActionItem[] = [
  {
    id: "ACT-VND-01",
    action: "Qualify alternate supplier",
    owner: "Rajesh Kumar",
    dueDate: "30-Sep-2026",
    budget: "₹ 3.5 L",
    status: "In Progress",
    evidence: "Sample evaluation ongoing at ARAI approved lab for Delta Electronics",
  },
  {
    id: "ACT-VND-02",
    action: "Increase safety stock",
    owner: "Supply Chain",
    dueDate: "15-Oct-2026",
    budget: "₹ 12.0 L",
    status: "Open",
    evidence: "Raised PO for 90-day buffer inventory on critical SiC switching modules",
  },
  {
    id: "ACT-VND-03",
    action: "Renegotiate contract terms",
    owner: "Priya Sharma",
    dueDate: "15-Nov-2026",
    budget: "₹ 1.2 L",
    status: "Open",
    evidence: "Drafted penalty clauses for delivery delays exceeding 14 calendar days",
  },
  {
    id: "ACT-VND-04",
    action: "Conduct supplier audit",
    owner: "Quality Team",
    dueDate: "30-Sep-2026",
    budget: "₹ 2.0 L",
    status: "Completed",
    evidence: "On-site audit completed at Pune manufacturing unit; 3 minor findings noted",
  },
  {
    id: "ACT-VND-05",
    action: "Implement dual sourcing",
    owner: "Procurement",
    dueDate: "30-Nov-2026",
    budget: "₹ 5.0 L",
    status: "Open",
    evidence: "RFP floated to secondary fab in Taiwan for 40% allocation",
  },
];

// RISK TREND (INHERENT VS RESIDUAL) OVER 6 MONTHS (SCREENSHOT MATCH)
export const VENDOR_RISK_TREND = [
  { month: "Apr 2026", inherent: 16, residual: 8 },
  { month: "May 2026", inherent: 18, residual: 9 },
  { month: "Jun 2026", inherent: 20, residual: 10 },
  { month: "Jul 2026", inherent: 22, residual: 11 },
  { month: "Aug 2026", inherent: 23, residual: 12 },
  { month: "Sep 2026", inherent: 25, residual: 12 },
];

// RISK BY CATEGORY DONUT DISTRIBUTION (SCREENSHOT MATCH: 48 TOTAL RISKS)
export const VENDOR_CATEGORY_DISTRIBUTION = [
  { name: "Supply & Delivery", percentage: 21, count: 10, color: "#3b82f6" },
  { name: "Quality", percentage: 15, count: 7, color: "#10b981" },
  { name: "Financial", percentage: 13, count: 6, color: "#f59e0b" },
  { name: "Operational", percentage: 11, count: 5, color: "#8b5cf6" },
  { name: "Compliance", percentage: 10, count: 5, color: "#06b6d4" },
  { name: "Cybersecurity", percentage: 8, count: 4, color: "#ec4899" },
  { name: "Technology", percentage: 8, count: 4, color: "#6366f1" },
  { name: "Commercial", percentage: 6, count: 3, color: "#ef4444" },
  { name: "ESG & Reputation", percentage: 4, count: 2, color: "#14b8a6" },
  { name: "Others", percentage: 4, count: 2, color: "#64748b" },
];

// AI VENDOR RISK INSIGHTS (SCREENSHOT MATCH: 6 BULLETS)
export const VENDOR_AI_INSIGHTS = [
  {
    num: 1,
    color: "bg-teal-500 text-white",
    text: "Supplier delivery risk is increasing (On-time delivery ↓ 12%).",
  },
  {
    num: 2,
    color: "bg-blue-600 text-white",
    text: "Vendor financial health score has declined by 15%.",
  },
  {
    num: 3,
    color: "bg-blue-500 text-white",
    text: "6 critical components are single-source.",
  },
  {
    num: 4,
    color: "bg-purple-600 text-white",
    text: "Recommend supplier audit within this quarter.",
  },
  {
    num: 5,
    color: "bg-rose-500 text-white",
    text: "Consider dual sourcing for high-risk components.",
  },
  {
    num: 6,
    color: "bg-emerald-600 text-white",
    text: "Overall vendor risk exposure is above acceptable tolerance.",
  },
];

// FULL REGISTER OF 48 VENDOR RISKS
export const FULL_VENDOR_RISKS: VendorRiskRecord[] = [
  PRIMARY_VENDOR_RISK,
  {
    id: "VR-2026-002",
    riskCode: "RK-VND-QLT-02",
    title: "Quality failure and elevated PPM on high-voltage contactor relays",
    vendorId: "V-002",
    vendorName: "XYZ Electronics Ltd",
    vendorType: "Component Supplier",
    vendorCategory: "Critical",
    vendorTier: "Tier 1 - Critical",
    businessFunction: "Manufacturing",
    department: "Quality Assurance",
    procurementCategory: "Switchgear",
    riskOwner: "Priya Sharma",
    vendorManager: "Rajesh Kumar",
    identificationDate: "10-Aug-2026",
    reviewDate: "10-Nov-2026",
    status: "Open",
    priority: "Critical",
    version: "1.2",
    confidentiality: "Internal",
    statement:
      "Because of inadequate copper stamping tooling calibration at XYZ Electronics, relay contact bounce exceeds 5ms, resulting in 450 PPM incoming defect rate.",
    cause: "Tooling wear and missed predictive maintenance on stamping presses",
    event: "Arcing and terminal overheating during 500V load endurance testing",
    affectedProduct: "Fast DC Charging Terminal",
    affectedProcess: "Incoming Inspection",
    affectedMilestone: "Sub-assembly Integration",
    impacts: {
      productionImpact: "High",
      scheduleImpact: "Medium",
      costImpact: "High",
      customerImpact: "High",
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
    id: "VR-2026-003",
    riskCode: "RK-VND-FIN-03",
    title: "Unannounced raw material price escalation on electrolytic copper busbars",
    vendorId: "V-003",
    vendorName: "LMN Materials Ltd",
    vendorType: "Raw Material Supplier",
    vendorCategory: "Strategic",
    vendorTier: "Tier 2 - Important",
    businessFunction: "Finance",
    department: "Procurement",
    procurementCategory: "Raw Metals",
    riskOwner: "Siddharth Verma",
    vendorManager: "Rajesh Kumar",
    identificationDate: "01-Jul-2026",
    reviewDate: "01-Oct-2026",
    status: "Monitoring",
    priority: "High",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Because of global commodity index surge, LMN Materials demanded 22% surcharge on copper stock, resulting in ₹14 Lakh budget variance.",
    cause: "Fixed-price contract expiry without indexed commodity hedge clause",
    event: "Withholding of dispatches pending price renegotiation",
    affectedProduct: "All Fast Charger Lines",
    affectedProcess: "Material Procurement",
    impacts: {
      productionImpact: "Medium",
      scheduleImpact: "Medium",
      costImpact: "High",
      customerImpact: "Low",
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
    treatmentStrategy: "Reduce",
  },
  {
    id: "VR-2026-004",
    riskCode: "RK-VND-FIN-04",
    title: "Vendor insolvency and working capital collapse of telemetry board maker",
    vendorId: "V-004",
    vendorName: "TechDrive Pvt Ltd",
    vendorType: "Contract Manufacturer",
    vendorCategory: "Critical",
    vendorTier: "Tier 1 - Critical",
    businessFunction: "Manufacturing",
    department: "Procurement",
    procurementCategory: "PCB Assembly",
    riskOwner: "Arun Kumar",
    vendorManager: "Rajesh Kumar",
    identificationDate: "12-Sep-2026",
    reviewDate: "12-Oct-2026",
    status: "Escalated",
    priority: "Critical",
    version: "2.0",
    confidentiality: "Restricted",
    statement:
      "Because of severe debt default and frozen credit lines, TechDrive may enter corporate insolvency, resulting in sudden termination of communication board supply.",
    cause: "Over-leveraged capital structure and customer concentration bankruptcy",
    event: "Insolvency resolution process notice filed in NCLT court",
    affectedProduct: "Smart IoT Telematics Gateway",
    affectedProcess: "PCBA SMT Assembly",
    impacts: {
      productionImpact: "Critical",
      scheduleImpact: "Critical",
      costImpact: "High",
      customerImpact: "High",
    },
    likelihood: 4,
    impact: 5,
    inherentScore: 20,
    inherentLevel: "Critical",
    residualLikelihood: 4,
    residualImpact: 4,
    residualScore: 16,
    residualLevel: "High",
    controlEffectiveness: "Ineffective",
    treatmentStrategy: "Vendor Replacement",
  },
  {
    id: "VR-2026-005",
    riskCode: "RK-VND-CYB-05",
    title: "Third-party cloud telematics API breach and unauthorized telemetry access",
    vendorId: "V-005",
    vendorName: "CloudServe Inc",
    vendorType: "Cloud Provider",
    vendorCategory: "Strategic",
    vendorTier: "Tier 1 - Critical",
    businessFunction: "IT",
    department: "Cybersecurity",
    procurementCategory: "SaaS & Cloud",
    riskOwner: "Vikram Malhotra",
    vendorManager: "Rajesh Kumar",
    identificationDate: "05-Sep-2026",
    reviewDate: "05-Nov-2026",
    status: "Open",
    priority: "High",
    version: "1.1",
    confidentiality: "Restricted",
    statement:
      "Because of unpatched zero-day vulnerability in CloudServe API gateway, telemetry credentials may be compromised, resulting in charger fleet disruption.",
    cause: "Third-party vendor delay in applying mandatory security vulnerability patches",
    event: "Credential scraping detected on customer billing endpoints",
    affectedProduct: "Cloud Central Management System",
    affectedProcess: "Remote Diagnostics",
    impacts: {
      productionImpact: "Low",
      scheduleImpact: "Low",
      costImpact: "Medium",
      customerImpact: "High",
    },
    likelihood: 3,
    impact: 4,
    inherentScore: 12,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualLevel: "Moderate",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Reduce",
  },
];

// VENDOR DUE DILIGENCE DATABASE (SECTION 6)
export const VENDOR_DUE_DILIGENCE_DATA: VendorDueDiligenceRecord[] = [
  {
    id: "DD-001",
    vendorId: "V-001",
    vendorName: "ABC Components Pvt Ltd",
    financialScore: 78,
    qualityScore: 92,
    cybersecurityScore: 84,
    esgScore: 80,
    singleSource: true,
    switchingTimeMonths: 6,
    switchingCostLakhs: 25.0,
    status: "Approved",
  },
  {
    id: "DD-002",
    vendorId: "V-002",
    vendorName: "XYZ Electronics Ltd",
    financialScore: 82,
    qualityScore: 68,
    cybersecurityScore: 75,
    esgScore: 70,
    singleSource: false,
    switchingTimeMonths: 2,
    switchingCostLakhs: 8.5,
    status: "Conditional",
  },
  {
    id: "DD-003",
    vendorId: "V-003",
    vendorName: "LMN Materials Ltd",
    financialScore: 74,
    qualityScore: 88,
    cybersecurityScore: 65,
    esgScore: 82,
    singleSource: false,
    switchingTimeMonths: 1,
    switchingCostLakhs: 3.0,
    status: "Approved",
  },
  {
    id: "DD-004",
    vendorId: "V-004",
    vendorName: "TechDrive Pvt Ltd",
    financialScore: 38,
    qualityScore: 75,
    cybersecurityScore: 70,
    esgScore: 60,
    singleSource: true,
    switchingTimeMonths: 5,
    switchingCostLakhs: 18.0,
    status: "High Risk",
  },
  {
    id: "DD-005",
    vendorId: "V-005",
    vendorName: "CloudServe Inc",
    financialScore: 95,
    qualityScore: 90,
    cybersecurityScore: 68,
    esgScore: 85,
    singleSource: true,
    switchingTimeMonths: 4,
    switchingCostLakhs: 15.0,
    status: "Under Audit",
  },
];

// VENDOR CONTROLS MASTER (SECTION 15 & 16)
export const VENDOR_CONTROLS_MASTER: VendorControlItem[] = [
  {
    id: "CTL-VND-01",
    controlName: "Annual Comprehensive Supplier Quality Audit (ISO 9001)",
    objective: "Verify supplier quality management systems and calibration rigor",
    owner: "Quality Assurance",
    frequency: "Annual",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Pass",
    relatedSOP: "SOP-SCM-08 Supplier Audit Procedure",
  },
  {
    id: "CTL-VND-02",
    controlName: "Dual-Sourcing Mandate for Tier-1 Components",
    objective: "Eliminate single-source dependencies for mission-critical parts",
    owner: "Procurement Head",
    frequency: "Quarterly",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Remediation In Progress",
    relatedSOP: "SOP-SCM-02 Strategic Sourcing Policy",
  },
  {
    id: "CTL-VND-03",
    controlName: "Automated Three-Way Match (PO, GRN, Inspection)",
    objective: "Enforce strict quality inspection release before invoice payment",
    owner: "Finance & Accounts",
    frequency: "Per Batch",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Pass",
    relatedSOP: "SOP-FIN-02 AP Verification",
  },
  {
    id: "CTL-VND-04",
    controlName: "Third-Party Cybersecurity Risk Assessment (SOC 2 / ISO 27001)",
    objective: "Validate vendor network security and API credential management",
    owner: "IT Security",
    frequency: "Quarterly",
    designEffectiveness: "Partially Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Exception",
    relatedSOP: "SOP-IT-14 Third-Party Cyber Risk",
  },
];

// MAICW FIELD TAXONOMY (SECTION 1)
export const VENDOR_MAICW_FIELDS = [
  { field: "Vendor Risk ID", type: "Auto Number", maicw: "A", description: "Unique vendor risk identifier (VR-YYYY-XXX)" },
  { field: "Risk Code", type: "Text", maicw: "A", description: "Controlled reference e.g. RK-VND-SC-01" },
  { field: "Risk Title", type: "Text", maicw: "M", description: "Short descriptive risk title (Mandatory)" },
  { field: "Vendor ID", type: "Lookup", maicw: "M", description: "Related vendor code (V-001)" },
  { field: "Vendor Name", type: "Lookup", maicw: "M", description: "Vendor business title (ABC Components Pvt Ltd)" },
  { field: "Vendor Type", type: "Dropdown", maicw: "M", description: "Component Supplier, Software, Cloud, Logistics" },
  { field: "Vendor Category", type: "Dropdown", maicw: "M", description: "Strategic, Critical, Standard, Low" },
  { field: "Vendor Tier", type: "Dropdown", maicw: "M", description: "Tier 1 - Critical, Tier 2, Tier 3, Tier 4" },
  { field: "Business Function", type: "Lookup", maicw: "M", description: "Affected business function (Manufacturing)" },
  { field: "Department", type: "Lookup", maicw: "M", description: "Responsible department (Procurement)" },
  { field: "Procurement Category", type: "Lookup", maicw: "M", description: "Category code (Power Electronics)" },
  { field: "Contract ID", type: "Lookup", maicw: "I", description: "Active commercial contract (CON-2025-014)" },
  { field: "PO / Agreement", type: "Lookup", maicw: "I", description: "Active purchase order (PO-450032)" },
  { field: "Vendor Manager", type: "Lookup", maicw: "M", description: "Accountable vendor manager (Rajesh Kumar)" },
  { field: "Risk Owner", type: "Lookup", maicw: "M", description: "Risk owner (Priya Sharma)" },
  { field: "Identification Date", type: "Date", maicw: "M", description: "Date initially identified" },
  { field: "Review Date", type: "Date", maicw: "M", description: "Next scheduled review date" },
  { field: "Contract Expiry", type: "Date", maicw: "I", description: "Vendor contract expiry date" },
  { field: "Status", type: "Workflow", maicw: "W", description: "Draft, Due Diligence, Monitoring, Escalated, Closed" },
  { field: "Priority", type: "Dropdown", maicw: "M", description: "Critical, High, Medium, Low" },
  { field: "Version", type: "Number", maicw: "A", description: "Automated version control tracking" },
  { field: "Confidentiality", type: "Dropdown", maicw: "C", description: "Internal, Confidential, Restricted" },
];

// REPORTS SUITE (SECTION 42)
export const VENDOR_REPORT_DEFINITIONS = [
  { id: "VND-REP-01", name: "Vendor Risk Register", category: "Portfolio", desc: "Complete vendor risk portfolio with inherent and residual scores" },
  { id: "VND-REP-02", name: "Executive Vendor Risk Dashboard", category: "Executive", desc: "CPO-level risk overview, single-source dependencies, and KRI breaches" },
  { id: "VND-REP-03", name: "Single-Source Dependency & Concentration", category: "Supply Chain", desc: "Critical parts with single supplier, switching costs, and lead times" },
  { id: "VND-REP-04", name: "Supplier Quality Performance & PPM", category: "Quality", desc: "Defect PPM, rejection rates, incoming inspection passes, and NCRs" },
  { id: "VND-REP-05", name: "Supplier On-Time Delivery (OTD) Log", category: "Delivery", desc: "On-time delivery trends, backlog aging, and logistics delay logs" },
  { id: "VND-REP-06", name: "Vendor Financial Stability & Solvency", category: "Financial", desc: "Altman Z-scores, credit ratings, cash runway, and solvency alerts" },
  { id: "VND-REP-07", name: "Third-Party Cybersecurity Risk Audit", category: "Cybersecurity", desc: "SOC 2 compliance, open vulnerabilities, and API access reviews" },
  { id: "VND-REP-08", name: "Vendor Due Diligence Scorecards", category: "Due Diligence", desc: "Multi-dimensional audit scores for Tier-1 and Tier-2 suppliers" },
  { id: "VND-REP-09", name: "Contract & SLA Compliance Matrix", category: "Commercial", desc: "Expiring contracts, warranty terms, liquidated damages, and SLAs" },
  { id: "VND-REP-10", name: "Vendor Risk Treatment Action Plan", category: "Mitigation", desc: "Dual sourcing, safety stock, and corrective action implementation" },
  { id: "VND-REP-11", name: "AI Vendor Risk Intelligence Digest", category: "AI Analytics", desc: "Predictive delivery failures, financial distress signals, and capacity models" },
];

export const vendorRiskService = {
  getPrimaryRisk: () => PRIMARY_VENDOR_RISK,
  getTopRisks: () => TOP_VENDOR_RISKS,
  getKRIs: () => VENDOR_KRIS,
  getTreatmentActions: () => VENDOR_TREATMENT_ACTIONS,
  getRiskTrend: () => VENDOR_RISK_TREND,
  getCategoryDistribution: () => VENDOR_CATEGORY_DISTRIBUTION,
  getAIInsights: () => VENDOR_AI_INSIGHTS,
  getFullRisks: () => FULL_VENDOR_RISKS,
  getDueDiligence: () => VENDOR_DUE_DILIGENCE_DATA,
  getControls: () => VENDOR_CONTROLS_MASTER,
  getMAICWFields: () => VENDOR_MAICW_FIELDS,
  getReports: () => VENDOR_REPORT_DEFINITIONS,
};

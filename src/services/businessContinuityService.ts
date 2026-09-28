// Magnertia ERP - Business Continuity Service
// Business Continuity Form - MAICW Classification & Resilience Assurance Engine

export type BCPPlanType =
  | "Enterprise"
  | "Department"
  | "Process"
  | "Site"
  | "Product"
  | "IT / DR";

export type BCPPriority = "Critical" | "High" | "Medium" | "Low";

export type BCPStatus =
  | "Draft"
  | "BIA In Progress"
  | "Risk Assessment"
  | "Strategy Development"
  | "Plan Development"
  | "Review"
  | "Approval Pending"
  | "Approved"
  | "Active"
  | "Testing"
  | "Improvement Required"
  | "Suspended"
  | "Archived";

export interface BusinessContinuityRecord {
  id: string; // Auto Number (A) e.g. BCP-2026-001
  bcpCode: string; // Controlled Ref (A) e.g. BC-PLN-001
  planName: string; // Mandatory (M) e.g. EV Charging Operations Continuity Plan
  planType: BCPPlanType; // Dropdown (M) e.g. Site
  businessFunction: string; // Lookup (M) e.g. Operations
  department: string; // Lookup (M) e.g. Operations
  businessProcess: string; // Lookup (M) e.g. Charging Station Operations
  businessUnit: string; // Lookup (M) e.g. EV Business
  location: string; // Lookup (M) e.g. Chennai Plant
  planOwner: string; // Lookup (M) e.g. Ramesh S
  planOwnerAvatar?: string;
  bcpCoordinator: string; // Lookup (M) e.g. Priya Sharma
  bcpCoordinatorAvatar?: string;
  riskOwner?: string; // Lookup (I) e.g. Vikram K
  riskOwnerAvatar?: string;
  effectiveDate: string; // Date (M) e.g. 01-Jan-2026
  reviewDate: string; // Date (M) e.g. 01-Jan-2027
  lastTestDate?: string; // Date (I) e.g. 15-Mar-2025
  nextTestDate?: string; // Date (I) e.g. 15-Mar-2026
  status: BCPStatus; // Workflow (W) e.g. Active
  priority: BCPPriority; // Dropdown (M) e.g. Critical
  version: string; // Number (A) e.g. 1.0
  confidentiality: "Internal" | "Confidential" | "Restricted"; // (C) e.g. Restricted

  // Overview & Continuity Statement
  continuityObjective: string;
  statement: string; // If [DISRUPTION] affects [PROCESS], Magnertia will restore [OUTPUT] within [RTO] using [STRATEGY].
  primaryDisruptionScenario: string;
  secondaryDisruptionScenario?: string;
  scenarioDescription: string;

  // Continuity Strategy
  strategyType: "Alternate Site" | "Alternate Line" | "DR Failover" | "Remote Work" | "Manual Process" | "Safety Stock";
  alternateLocation: string;
  recoveryMethod: string;
  strategyDetails: string;

  // Testing & Exercise
  lastTestResult: "Pass" | "Partial" | "Fail";
  nextTestType: "Tabletop Exercise" | "Walkthrough" | "Simulation" | "Full Simulation" | "DR Failover";
  testScope: string;

  // Impact Breakdown (1 to 5)
  impactScores: {
    people: number;
    revenue: number;
    customer: number;
    compliance: number;
    reputation: number;
  };

  // Linked Counts
  linkedRisksCount: number;
  linkedIncidentsCount: number;
  vendorRecordsCount: number;
  itDrRecordsCount: number;
  actionItemsCount: number;
}

export interface BCPCriticalResource {
  id: string;
  resource: string;
  type: "Equipment" | "IT System" | "People" | "Material" | "Utility" | "Facility";
  criticality: "Critical" | "High" | "Medium" | "Low";
  availability: "Yes" | "Partial" | "No";
  alternate: string;
  location?: string;
  recoveryTimeHours?: number;
}

export interface BCPRecoveryObjective {
  id: string;
  process: string;
  rto: string; // Recovery Time Objective
  rpo: string; // Recovery Point Objective
  mtd?: string; // Maximum Tolerable Downtime
  priority: "Critical" | "High" | "Medium" | "Low";
}

export interface BCPActionItem {
  id: string;
  action: string;
  owner: string;
  dueDate: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Completed" | "Verified";
  evidence?: string;
}

export interface BCPTestRecord {
  id: string;
  testName: string;
  scenario: string;
  testDate: string;
  testType: string;
  result: "Pass" | "Partial" | "Fail";
  participants: string;
  findings: string;
  nextTestDate: string;
}

export interface BCPContactItem {
  role: string;
  primaryContact: string;
  backupContact: string;
  contactMethod: string;
  availability: string;
}

// PRIMARY MASTER RECORD MATCHING SCREENSHOT EXACTLY
export const PRIMARY_BCP_RECORD: BusinessContinuityRecord = {
  id: "BCP-2026-001",
  bcpCode: "BC-PLN-001",
  planName: "EV Charging Operations Continuity Plan",
  planType: "Site",
  businessFunction: "Operations",
  department: "Operations",
  businessProcess: "Charging Station Operations",
  businessUnit: "EV Business",
  location: "Chennai Plant",
  planOwner: "Ramesh S",
  planOwnerAvatar: "RS",
  bcpCoordinator: "Priya Sharma",
  bcpCoordinatorAvatar: "PS",
  riskOwner: "Vikram K",
  riskOwnerAvatar: "VK",
  effectiveDate: "01-Jan-2026",
  reviewDate: "01-Jan-2027",
  lastTestDate: "15-Mar-2025",
  nextTestDate: "15-Mar-2026",
  status: "Active",
  priority: "Critical",
  version: "1.0",
  confidentiality: "Restricted",

  continuityObjective:
    "Ensure uninterrupted operation of EV charging infrastructure and customer services during and after disruptive events, with minimal impact to customers, revenue, and compliance obligations.",
  statement:
    "If extended power failure or cybersecurity incident affects Charging Station Operations at Chennai Plant, Magnertia will restore 80% minimum operational throughput within 4 hours using Bangalore DC alternate cloud gateway and on-site diesel generator banks.",
  primaryDisruptionScenario: "Power Failure",
  secondaryDisruptionScenario: "Cyber Attack",
  scenarioDescription:
    "Extended power outage affecting multiple charging stations and related IT systems.",

  strategyType: "Alternate Site",
  alternateLocation: "Bangalore DC",
  recoveryMethod: "Switch to backup charging stations",
  strategyDetails:
    "In the event of a site outage, redirect traffic to alternate locations and activate mobile charging units. Restore primary site within RTO.",

  lastTestResult: "Pass",
  nextTestType: "Full Simulation",
  testScope: "Site + IT + Customer Service",

  impactScores: {
    people: 4,
    revenue: 3,
    customer: 4,
    compliance: 3,
    reputation: 2,
  },

  linkedRisksCount: 2,
  linkedIncidentsCount: 1,
  vendorRecordsCount: 3,
  itDrRecordsCount: 4,
  actionItemsCount: 5,
};

// CRITICAL RESOURCES (SCREENSHOT MATCH)
export const BCP_CRITICAL_RESOURCES: BCPCriticalResource[] = [
  {
    id: "RES-01",
    resource: "Charging Stations",
    type: "Equipment",
    criticality: "Critical",
    availability: "Yes",
    alternate: "Other Site",
    location: "Chennai Hub Bay 1-4",
    recoveryTimeHours: 4,
  },
  {
    id: "RES-02",
    resource: "ERP System",
    type: "IT System",
    criticality: "Critical",
    availability: "Yes",
    alternate: "DR Site",
    location: "AWS Mumbai (Failover: Bangalore)",
    recoveryTimeHours: 2,
  },
  {
    id: "RES-03",
    resource: "Field Service Team",
    type: "People",
    criticality: "High",
    availability: "Partial",
    alternate: "Contractor",
    location: "South Regional Service Cell",
    recoveryTimeHours: 6,
  },
  {
    id: "RES-04",
    resource: "Spare Parts",
    type: "Material",
    criticality: "High",
    availability: "Yes",
    alternate: "Alternate Supplier",
    location: "Central Warehouse Hosur",
    recoveryTimeHours: 12,
  },
  {
    id: "RES-05",
    resource: "Backup Power",
    type: "Utility",
    criticality: "Critical",
    availability: "Yes",
    alternate: "Generator",
    location: "Plant 2 Utility Yard",
    recoveryTimeHours: 1,
  },
];

// RECOVERY OBJECTIVES (SCREENSHOT MATCH)
export const BCP_RECOVERY_OBJECTIVES: BCPRecoveryObjective[] = [
  {
    id: "OBJ-01",
    process: "Charging Operations",
    rto: "4 hours",
    rpo: "30 mins",
    mtd: "12 hours",
    priority: "Critical",
  },
  {
    id: "OBJ-02",
    process: "Customer Support",
    rto: "2 hours",
    rpo: "15 mins",
    mtd: "6 hours",
    priority: "High",
  },
  {
    id: "OBJ-03",
    process: "ERP System",
    rto: "4 hours",
    rpo: "15 mins",
    mtd: "8 hours",
    priority: "Critical",
  },
  {
    id: "OBJ-04",
    process: "Data & Backups",
    rto: "1 hour",
    rpo: "5 mins",
    mtd: "4 hours",
    priority: "Critical",
  },
];

// OPEN ACTIONS (SCREENSHOT MATCH)
export const BCP_ACTION_ITEMS: BCPActionItem[] = [
  {
    id: "ACT-BCP-01",
    action: "Close BCP Gap on South Regional Contractor SLA",
    owner: "Priya Sharma",
    dueDate: "15-Oct-2026",
    priority: "High",
    status: "Open",
    evidence: "Drafted 2-hour mobilization SLA with third-party technical agency",
  },
  {
    id: "ACT-BCP-02",
    action: "Update Recovery Procedure for Telematics Gateway",
    owner: "Vikram K",
    dueDate: "20-Oct-2026",
    priority: "High",
    status: "In Progress",
    evidence: "SOP-IT-08 updated with automated DNS route53 failover instructions",
  },
  {
    id: "ACT-BCP-03",
    action: "Conduct BCP Full Simulation Drill for Chennai Plant",
    owner: "Ramesh S",
    dueDate: "15-Mar-2026",
    priority: "High",
    status: "Open",
    evidence: "Drill scenario docket prepared with safety marshal involvement",
  },
  {
    id: "ACT-BCP-04",
    action: "Qualify Alternate Generator Fuel Supply Partner",
    owner: "Procurement Desk",
    dueDate: "30-Nov-2026",
    priority: "Critical",
    status: "Open",
    evidence: "Float RFQ for 4-hour emergency diesel delivery contract",
  },
  {
    id: "ACT-BCP-05",
    action: "Cross-Train Service Technicians on Backup Inverter Bypass",
    owner: "HR & Training Desk",
    dueDate: "10-Nov-2026",
    priority: "Medium",
    status: "In Progress",
    evidence: "8 technicians completed Level 2 hardware bypass training",
  },
];

// TEST EXERCISE HISTORY
export const BCP_TEST_HISTORY: BCPTestRecord[] = [
  {
    id: "TST-2025-01",
    testName: "Annual DR & Cloud Failover Test",
    scenario: "Complete AWS Primary Region Outage",
    testDate: "15-Mar-2025",
    testType: "Simulation",
    result: "Pass",
    participants: "IT Infrastructure, Cybersecurity, Operations",
    findings: "Failover completed in 42 minutes against 1-hour RTO objective.",
    nextTestDate: "15-Mar-2026",
  },
  {
    id: "TST-2024-02",
    testName: "Chennai Plant Emergency Power Blackout Test",
    scenario: "Main HT Substation Grid Loss",
    testDate: "10-Oct-2024",
    testType: "Full Simulation",
    result: "Pass",
    participants: "Plant Facilities, Safety, Electrical Team",
    findings: "Diesel generators synchronized within 45 seconds of grid drop.",
    nextTestDate: "12-Oct-2025",
  },
];

// EMERGENCY CONTACT REGISTER
export const BCP_EMERGENCY_CONTACTS: BCPContactItem[] = [
  { role: "Crisis Leader", primaryContact: "Arun Kumar (GM)", backupContact: "Ramesh S (Ops Head)", contactMethod: "Satellite Phone / Mobile 24x7", availability: "24x7 Continuous" },
  { role: "Operations Lead", primaryContact: "Ramesh S", backupContact: "Karthik R", contactMethod: "Emergency Radio / WhatsApp Crisis Cell", availability: "24x7 Continuous" },
  { role: "IT & DR Coordinator", primaryContact: "Vikram K (IT Head)", backupContact: "Lead DevOps Engineer", contactMethod: "PagerDuty / Direct Hotline", availability: "24x7 Continuous" },
  { role: "Cybersecurity Incident Lead", primaryContact: "Security Operations Center", backupContact: "CISO", contactMethod: "SOC Hotline / Signal Encrypted Call", availability: "24x7 Continuous" },
  { role: "Supply Chain & Logistics", primaryContact: "Sourcing Manager", backupContact: "Warehouse Lead", contactMethod: "Mobile / Fleet Radio", availability: "Business Hours + On Call" },
];

// FULL REGISTER OF 12 BCP PLANS
export const FULL_BCP_PLANS: BusinessContinuityRecord[] = [
  PRIMARY_BCP_RECORD,
  {
    id: "BCP-2026-002",
    bcpCode: "BC-PLN-002",
    planName: "Core ERP & Cloud Platform Disaster Recovery Plan",
    planType: "IT / DR",
    businessFunction: "IT",
    department: "Information Technology",
    businessProcess: "ERP Operations & Database Services",
    businessUnit: "Enterprise IT",
    location: "Data Center Mumbai",
    planOwner: "Vikram K",
    planOwnerAvatar: "VK",
    bcpCoordinator: "DevOps Lead",
    bcpCoordinatorAvatar: "DL",
    effectiveDate: "01-Jan-2026",
    reviewDate: "01-Jan-2027",
    lastTestDate: "15-Mar-2025",
    nextTestDate: "15-Mar-2026",
    status: "Active",
    priority: "Critical",
    version: "1.0",
    confidentiality: "Restricted",
    continuityObjective: "Ensure sub-15-minute RPO and 4-hour RTO for all corporate financial subledgers and customer transactions.",
    statement: "If AWS Mumbai suffers data center loss, automated DNS will reroute to Bangalore DR replica with zero uncommitted transactions.",
    primaryDisruptionScenario: "Data Center Outage",
    scenarioDescription: "Unavailability of primary cloud region due to undersea cable cut or power grid failure.",
    strategyType: "DR Failover",
    alternateLocation: "Bangalore AWS Secondary",
    recoveryMethod: "Warm standby replica auto-promotion",
    strategyDetails: "Activate secondary Aurora database replica and point CloudFront distributions to secondary origin.",
    lastTestResult: "Pass",
    nextTestType: "DR Failover",
    testScope: "ERP Database + Invoicing API",
    impactScores: { people: 2, revenue: 5, customer: 5, compliance: 5, reputation: 4 },
    linkedRisksCount: 3,
    linkedIncidentsCount: 0,
    vendorRecordsCount: 2,
    itDrRecordsCount: 6,
    actionItemsCount: 2,
  },
  {
    id: "BCP-2026-003",
    bcpCode: "BC-PLN-003",
    planName: "Battery Assembly Line 2 Critical Component Supply Plan",
    planType: "Process",
    businessFunction: "Supply Chain",
    department: "Procurement & SCM",
    businessProcess: "Cell Module Sourcing",
    businessUnit: "Manufacturing",
    location: "Hosur Plant",
    planOwner: "Karthik R",
    planOwnerAvatar: "KR",
    bcpCoordinator: "Priya Sharma",
    bcpCoordinatorAvatar: "PS",
    effectiveDate: "15-Jan-2026",
    reviewDate: "15-Jan-2027",
    lastTestDate: "20-May-2025",
    nextTestDate: "20-May-2026",
    status: "Active",
    priority: "Critical",
    version: "1.0",
    confidentiality: "Confidential",
    continuityObjective: "Maintain 14-day production buffer inventory and secondary supplier allocation for lithium cells.",
    statement: "If primary semiconductor supplier delays shipments, activate secondary approved fab in Taiwan for 40% capacity.",
    primaryDisruptionScenario: "Supplier Failure",
    scenarioDescription: "Single source supply chain disruption on battery management microcontroller units.",
    strategyType: "Alternate Line",
    alternateLocation: "Warehouse Hosur",
    recoveryMethod: "Dual sourcing safety buffer release",
    strategyDetails: "Release 30-day bonded warehouse safety stock while secondary supplier ramps batch production.",
    lastTestResult: "Pass",
    nextTestType: "Tabletop Exercise",
    testScope: "Supply Chain + Production Planning",
    impactScores: { people: 2, revenue: 4, customer: 4, compliance: 2, reputation: 3 },
    linkedRisksCount: 4,
    linkedIncidentsCount: 1,
    vendorRecordsCount: 5,
    itDrRecordsCount: 1,
    actionItemsCount: 3,
  },
];

// SECTION 1: MAICW CLASSIFICATION FIELDS
export const BCP_MAICW_FIELDS = [
  { field: "BCP ID", type: "Auto Number", maicw: "A", description: "Unique continuity plan identifier (BCP-YYYY-XXX)" },
  { field: "BCP Code", type: "Text", maicw: "A", description: "Controlled reference e.g. BC-PLN-001" },
  { field: "Plan Name", type: "Text", maicw: "M", description: "Descriptive plan title (Mandatory)" },
  { field: "Plan Type", type: "Dropdown", maicw: "M", description: "Enterprise, Department, Process, Site, Product, IT" },
  { field: "Business Function", type: "Lookup", maicw: "M", description: "Covered business function (Operations)" },
  { field: "Department", type: "Lookup", maicw: "M", description: "Responsible department" },
  { field: "Business Process", type: "Lookup", maicw: "M", description: "Critical process requiring continuity" },
  { field: "Business Unit", type: "Lookup", maicw: "M", description: "Affected business unit (EV Business)" },
  { field: "Location", type: "Lookup", maicw: "M", description: "Site / facility address (Chennai Plant)" },
  { field: "Plan Owner", type: "Lookup", maicw: "M", description: "Accountable plan owner (Ramesh S)" },
  { field: "BCP Coordinator", type: "Lookup", maicw: "M", description: "Operational coordinator (Priya Sharma)" },
  { field: "Risk Owner", type: "Lookup", maicw: "I", description: "Assigned risk owner (Vikram K)" },
  { field: "Effective Date", type: "Date", maicw: "M", description: "Plan effective date" },
  { field: "Review Date", type: "Date", maicw: "M", description: "Scheduled annual review date" },
  { field: "Last Test Date", type: "Date", maicw: "I", description: "Latest test execution timestamp" },
  { field: "Next Test Date", type: "Date", maicw: "I", description: "Planned next simulation date" },
  { field: "Status", type: "Workflow", maicw: "W", description: "Draft, Review, Approved, Active, Testing, Archived" },
  { field: "Priority", type: "Dropdown", maicw: "M", description: "Critical, High, Medium, Low" },
  { field: "Version", type: "Number", maicw: "A", description: "Controlled record version (1.0)" },
  { field: "Confidentiality", type: "Dropdown", maicw: "C", description: "Internal, Confidential, Restricted" },
];

// SECTION 45: REPORTS DEFINITIONS
export const BCP_REPORT_DEFINITIONS = [
  { id: "BCP-REP-01", name: "Business Continuity Master Register", category: "Master", desc: "Complete inventory of all active enterprise continuity plans and RTO/RPO metrics" },
  { id: "BCP-REP-02", name: "Executive Continuity & Readiness Dashboard", category: "Executive", desc: "Board-level view of critical process coverage, recovery objectives, and drill results" },
  { id: "BCP-REP-03", name: "Business Impact Analysis (BIA) Consolidated Dossier", category: "Impact", desc: "Quantitative financial, operational, and customer disruption impact assessments" },
  { id: "BCP-REP-04", name: "RTO & RPO Compliance Audit", category: "Objectives", desc: "Recovery time and point objective compliance, testing variance, and downtime analysis" },
  { id: "BCP-REP-05", name: "Critical Resource & Alternate Site Readiness", category: "Resources", desc: "Equipment redundancy, generator availability, and Bangalore alternate site status" },
  { id: "BCP-REP-06", name: "Supply Chain & Vendor Continuity Assessment", category: "Suppliers", desc: "Single-source dependency analysis, safety stock levels, and supplier BCP audit logs" },
  { id: "BCP-REP-07", name: "IT Disaster Recovery & Cloud Failover Log", category: "IT / DR", desc: "Automated failover logs, database replication status, and RPO compliance checks" },
  { id: "BCP-REP-08", name: "Crisis Management & Escalation Plan Register", category: "Crisis", desc: "24x7 emergency contacts, crisis command teams, and external communication matrices" },
  { id: "BCP-REP-09", name: "BCP Test, Simulation & Drill Results Log", category: "Testing", desc: "Historical drill findings, tabletop exercise reports, and CAPA action tracking" },
  { id: "BCP-REP-10", name: "AI Business Continuity Intelligence Digest", category: "AI Analytics", desc: "Predictive disruption modeling, dependency bottleneck detection, and recovery forecasts" },
];

export const businessContinuityService = {
  getPrimaryBCP: () => PRIMARY_BCP_RECORD,
  getCriticalResources: () => BCP_CRITICAL_RESOURCES,
  getRecoveryObjectives: () => BCP_RECOVERY_OBJECTIVES,
  getActionItems: () => BCP_ACTION_ITEMS,
  getTestHistory: () => BCP_TEST_HISTORY,
  getEmergencyContacts: () => BCP_EMERGENCY_CONTACTS,
  getFullPlans: () => FULL_BCP_PLANS,
  getMAICWFields: () => BCP_MAICW_FIELDS,
  getReports: () => BCP_REPORT_DEFINITIONS,
};

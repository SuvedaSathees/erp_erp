// Magnertia ERP - Project Risk Service
// Project Risk Form - MAICW Classification & Project Delivery Assurance Engine

export type ProjectRiskCategory =
  | "Technical Risk"
  | "Schedule Risk"
  | "Cost Risk"
  | "Resource Risk"
  | "Procurement Risk"
  | "Scope Risk"
  | "Quality Risk"
  | "Customer Risk"
  | "Compliance Risk"
  | "Project Governance Risk";

export type ProjectRiskType = "Existing" | "Emerging" | "Event" | "Residual";
export type ProjectRiskPriority = "Critical" | "High" | "Medium" | "Low";
export type ProjectRiskStatus =
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

export interface ProjectRiskRecord {
  id: string; // Auto Number (A) e.g. PR-2026-001
  riskCode: string; // Controlled Ref (A) e.g. RK-PRJ-TECH-01
  title: string; // Mandatory (M)
  projectId: string; // Lookup (M) e.g. PRJ-001
  projectName: string; // Lookup (M) e.g. Autonomous W-EVSE
  projectType: "R&D" | "Product" | "Customer" | "Internal" | "CAPEX"; // Dropdown (M)
  projectPhase: "Initiation" | "Planning" | "Execution" | "Closure"; // Dropdown (M)
  projectManager: string; // Lookup (M)
  riskOwner: string; // Lookup (M)
  riskOwnerAvatar?: string;
  riskCoordinator?: string; // Lookup (I)
  businessFunction: string; // Lookup (M) e.g. Product Development
  department: string; // Lookup (M) e.g. R&D - Engineering
  workPackage?: string; // Lookup (I) e.g. WP-03 - Prototype Build
  milestone?: string; // Lookup (I) e.g. M-02 - Prototype Testing
  identificationDate: string; // Date (M)
  reviewDate: string; // Date (M)
  status: ProjectRiskStatus; // Workflow (W)
  priority: ProjectRiskPriority; // Dropdown (M)
  version: string; // Number (A)
  confidentiality: "Internal" | "Confidential" | "Restricted"; // (C)

  // Risk Statement
  statement: string; // Because of [CAUSE], [RISK EVENT] may occur, resulting in [IMPACT ON PROJECT OBJECTIVES].
  cause: string;
  event: string;
  immediateEffect?: string;
  projectImpactSummary?: string;

  // Project Impact 2x2 Breakdown
  impacts: {
    scheduleImpact: "Critical" | "High" | "Medium" | "Low";
    costImpact: "Critical" | "High" | "Medium" | "Low";
    technicalImpact: "Critical" | "High" | "Medium" | "Low";
    qualityImpact: "Critical" | "High" | "Medium" | "Low";
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
  treatmentStrategy: "Avoid" | "Reduce" | "Transfer" | "Accept" | "Add Resources" | "Add Contingency";
}

export interface ProjectDependencyItem {
  id: string;
  type: "Internal Team" | "External Team" | "Supplier" | "Customer" | "Technology" | "Hardware" | "Material" | "Certification";
  description: string;
  owner: string;
  requiredDate: string;
  status: "On Track" | "At Risk" | "Delayed" | "Resolved";
  criticality: "Critical" | "High" | "Medium" | "Low";
  impactIfDelayed: string;
}

export interface ProjectKRI {
  id: string;
  name: string;
  category: "Schedule" | "Cost" | "Technical" | "Resource" | "Quality" | "Procurement";
  current: string;
  threshold: string;
  status: "Red" | "Amber" | "Green";
  trend: "up" | "down" | "neutral";
  metric: string;
  owner: string;
}

export interface ProjectActionItem {
  id: string;
  action: string;
  owner: string;
  dueDate: string;
  budget: string;
  status: "In Progress" | "Open" | "Completed" | "Verified";
  evidence?: string;
}

export interface ProjectScenarioItem {
  id: string;
  name: string;
  assumptions: string;
  scheduleImpact: string;
  costImpact: string;
  scopeImpact: string;
  qualityImpact: string;
  responsePlan: string;
}

export interface ProjectControlItem {
  id: string;
  controlName: string;
  objective: string;
  owner: string;
  frequency: "Daily" | "Weekly" | "Bi-Weekly" | "Monthly" | "Gate Review";
  designEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  operatingEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  result: "Pass" | "Exception" | "Remediation In Progress";
  relatedSOP: string;
}

// PRIMARY MASTER RECORD MATCHING SCREENSHOT EXACTLY
export const PRIMARY_PROJECT_RISK: ProjectRiskRecord = {
  id: "PR-2026-001",
  riskCode: "RK-PRJ-TECH-01",
  title: "Prototype testing delay due to component unavailability",
  projectId: "PRJ-001",
  projectName: "Autonomous W-EVSE",
  projectType: "Product",
  projectPhase: "Execution",
  projectManager: "Arun Kumar",
  riskOwner: "Priya Sharma",
  riskOwnerAvatar: "PS",
  riskCoordinator: "Arun Kumar",
  businessFunction: "Product Development",
  department: "R&D - Engineering",
  workPackage: "WP-03 - Prototype Build & Validation",
  milestone: "M-02 - Prototype Testing",
  identificationDate: "15-Sep-2026",
  reviewDate: "15-Oct-2026",
  status: "Monitoring",
  priority: "High",
  version: "1.0",
  confidentiality: "Internal",

  statement:
    "Because of single-source dependency on high-power semiconductor components, prototype testing may be delayed, resulting in project schedule slippage and increased development cost.",
  cause: "Single-source dependency on custom 1200V SiC power switching modules with 16-week lead time",
  event: "Critical component stockout at tier-1 testing laboratory",
  immediateEffect: "Halt of high-power thermal stress validation on Prototype Bench 2",
  projectImpactSummary: "3-week slippage in overall milestone completion and ₹4.2L expedited airfreight costs",

  impacts: {
    scheduleImpact: "High",
    costImpact: "Medium",
    technicalImpact: "High",
    qualityImpact: "Medium",
  },

  likelihood: 5, // Almost Certain
  impact: 4, // Major
  inherentScore: 20, // 5 x 4
  inherentLevel: "Critical",

  residualLikelihood: 3, // Possible
  residualImpact: 4, // Major
  residualScore: 12, // 3 x 4
  residualLevel: "High",

  controlEffectiveness: "Partially Effective",
  treatmentStrategy: "Add Resources",
};

// TOP 5 PROJECT RISKS (SCREENSHOT MATCH)
export const TOP_PROJECT_RISKS = [
  {
    id: "PR-001",
    title: "Prototype testing delay",
    category: "Technical",
    inherent: 20,
    residual: 12,
    status: "Monitoring" as const,
  },
  {
    id: "PR-002",
    title: "Supplier delivery delay",
    category: "Procurement",
    inherent: 16,
    residual: 9,
    status: "Open" as const,
  },
  {
    id: "PR-003",
    title: "Requirement change",
    category: "Scope",
    inherent: 15,
    residual: 9,
    status: "Open" as const,
  },
  {
    id: "PR-004",
    title: "Resource unavailability",
    category: "Resource",
    inherent: 12,
    residual: 6,
    status: "Open" as const,
  },
  {
    id: "PR-005",
    title: "Certification delay",
    category: "Compliance",
    inherent: 12,
    residual: 8,
    status: "Monitoring" as const,
  },
];

// KEY RISK INDICATORS TABLE (SCREENSHOT MATCH)
export const PROJECT_KRIS: ProjectKRI[] = [
  {
    id: "KRI-PRJ-01",
    name: "Milestone Delay (Days)",
    category: "Schedule",
    current: "12",
    threshold: "> 7",
    status: "Red",
    trend: "up",
    metric: "Days of Milestone Slippage",
    owner: "Project Manager",
  },
  {
    id: "KRI-PRJ-02",
    name: "Budget Variance (%)",
    category: "Cost",
    current: "18%",
    threshold: "> 15%",
    status: "Red",
    trend: "up",
    metric: "Cost Variance vs Baseline",
    owner: "Cost Controller",
  },
  {
    id: "KRI-PRJ-03",
    name: "Critical Component Lead Time",
    category: "Procurement",
    current: "14 weeks",
    threshold: "> 10 weeks",
    status: "Amber",
    trend: "up",
    metric: "Vendor Supply Lead Time",
    owner: "Procurement Lead",
  },
  {
    id: "KRI-PRJ-04",
    name: "Resource Utilization (%)",
    category: "Resource",
    current: "92%",
    threshold: "> 90%",
    status: "Amber",
    trend: "up",
    metric: "Core Team Allocation %",
    owner: "Engineering Manager",
  },
  {
    id: "KRI-PRJ-05",
    name: "Change Requests",
    category: "Schedule",
    current: "6",
    threshold: "> 5",
    status: "Red",
    trend: "up",
    metric: "Active Engineering Changes",
    owner: "Configuration Manager",
  },
  {
    id: "KRI-PRJ-06",
    name: "Test Failure Rate (%)",
    category: "Technical",
    current: "8%",
    threshold: "> 10%",
    status: "Green",
    trend: "down",
    metric: "Verification Test Failures",
    owner: "QA Lead",
  },
];

// RISK TREATMENT ACTIONS TABLE (SCREENSHOT MATCH)
export const PROJECT_TREATMENT_ACTIONS: ProjectActionItem[] = [
  {
    id: "ACT-PRJ-01",
    action: "Identify alternate supplier",
    owner: "Priya Sharma",
    dueDate: "25-Sep-2026",
    budget: "₹ 1.5 L",
    status: "In Progress",
    evidence: "Engaged dual-fab qualified vendor in Taiwan for sample SiC wafers",
  },
  {
    id: "ACT-PRJ-02",
    action: "Expedite component procurement",
    owner: "Arun Kumar",
    dueDate: "10-Oct-2026",
    budget: "₹ 3.0 L",
    status: "Open",
    evidence: "Authorized air cargo priority shipment with distributor",
  },
  {
    id: "ACT-PRJ-03",
    action: "Allocate additional test resources",
    owner: "Ravi Teja",
    dueDate: "15-Oct-2026",
    budget: "₹ 2.2 L",
    status: "Open",
    evidence: "Onboarding 2 test automation contractors for 2nd shift execution",
  },
  {
    id: "ACT-PRJ-04",
    action: "Review project schedule",
    owner: "Arun Kumar",
    dueDate: "20-Sep-2026",
    budget: "₹ 0.5 L",
    status: "Completed",
    evidence: "Re-baselined WBS activities to decouple firmware integration from hardware bench",
  },
  {
    id: "ACT-PRJ-05",
    action: "Update risk mitigation plan",
    owner: "PMO",
    dueDate: "30-Sep-2026",
    budget: "₹ 0.8 L",
    status: "Open",
    evidence: "Drafted revised buffer allocations for customer sign-off",
  },
];

// RISK TREND (INHERENT VS RESIDUAL) OVER 6 MONTHS (SCREENSHOT MATCH)
export const PROJECT_RISK_TREND = [
  { month: "Apr 2026", inherent: 16, residual: 7 },
  { month: "May 2026", inherent: 18, residual: 8 },
  { month: "Jun 2026", inherent: 19, residual: 9 },
  { month: "Jul 2026", inherent: 21, residual: 10 },
  { month: "Aug 2026", inherent: 22, residual: 11 },
  { month: "Sep 2026", inherent: 23, residual: 11 },
];

// RISK BY CATEGORY DONUT DISTRIBUTION (SCREENSHOT MATCH: 28 TOTAL RISKS)
export const PROJECT_CATEGORY_DISTRIBUTION = [
  { name: "Technical", percentage: 25, count: 7, color: "#3b82f6" },
  { name: "Schedule", percentage: 21, count: 6, color: "#f59e0b" },
  { name: "Cost", percentage: 18, count: 5, color: "#ef4444" },
  { name: "Resource", percentage: 11, count: 3, color: "#8b5cf6" },
  { name: "Procurement", percentage: 11, count: 3, color: "#06b6d4" },
  { name: "Scope", percentage: 7, count: 2, color: "#10b981" },
  { name: "Quality", percentage: 7, count: 2, color: "#ec4899" },
  { name: "Customer", percentage: 4, count: 1, color: "#6366f1" },
  { name: "Compliance", percentage: 4, count: 1, color: "#14b8a6" },
  { name: "Other/Gov", percentage: 4, count: 1, color: "#64748b" },
];

// AI PROJECT RISK INSIGHTS (SCREENSHOT MATCH: 5 BULLETS)
export const PROJECT_AI_INSIGHTS = [
  {
    num: 1,
    color: "bg-emerald-500 text-white",
    text: "Prototype testing delay probability increased to 68% based on supplier lead time and historical data.",
  },
  {
    num: 2,
    color: "bg-blue-500 text-white",
    text: "Project is 3 weeks behind planned schedule.",
  },
  {
    num: 3,
    color: "bg-rose-500 text-white",
    text: "Consider dual-sourcing for critical components.",
  },
  {
    num: 4,
    color: "bg-purple-600 text-white",
    text: "Resource utilization above 90% may lead to quality issues.",
  },
  {
    num: 5,
    color: "bg-emerald-600 text-white",
    text: "Budget variance trend indicates potential cost overrun.",
  },
];

// FULL REGISTER OF 28 PROJECT RISKS
export const FULL_PROJECT_RISKS: ProjectRiskRecord[] = [
  PRIMARY_PROJECT_RISK,
  {
    id: "PR-2026-002",
    riskCode: "RK-PRJ-PROC-02",
    title: "Supplier delivery delay on high-frequency isolation transformers",
    projectId: "PRJ-001",
    projectName: "Autonomous W-EVSE",
    projectType: "Product",
    projectPhase: "Execution",
    projectManager: "Arun Kumar",
    riskOwner: "Priya Sharma",
    riskOwnerAvatar: "PS",
    businessFunction: "Procurement",
    department: "Strategic Sourcing",
    workPackage: "WP-02 - Power Stage Sourcing",
    milestone: "M-02 - Prototype Testing",
    identificationDate: "05-Aug-2026",
    reviewDate: "05-Oct-2026",
    status: "Open",
    priority: "Critical",
    version: "1.1",
    confidentiality: "Internal",
    statement:
      "Because of supplier raw material import quotas, custom ferrite cores may arrive 4 weeks late, resulting in assembly line downtime.",
    cause: "Raw material import quotas and logistics customs delays at Nhava Sheva port",
    event: "Failure to meet delivery date on 50 prototype transformer sets",
    impacts: {
      scheduleImpact: "Critical",
      costImpact: "Medium",
      technicalImpact: "Medium",
      qualityImpact: "Low",
    },
    likelihood: 4,
    impact: 4,
    inherentScore: 16,
    inherentLevel: "High",
    residualLikelihood: 3,
    residualImpact: 3,
    residualScore: 9,
    residualLevel: "Moderate",
    controlEffectiveness: "Partially Effective",
    treatmentStrategy: "Add Contingency",
  },
  {
    id: "PR-2026-003",
    riskCode: "RK-PRJ-SCP-03",
    title: "Customer requirement change for CCS2 and CHAdeMO dual connector support",
    projectId: "PRJ-001",
    projectName: "Autonomous W-EVSE",
    projectType: "Customer",
    projectPhase: "Planning",
    projectManager: "Arun Kumar",
    riskOwner: "Karthik R.",
    riskOwnerAvatar: "KR",
    businessFunction: "Product Management",
    department: "Commercial Engineering",
    workPackage: "WP-01 - System Architecture",
    milestone: "M-01 - Architecture Sign-off",
    identificationDate: "20-Aug-2026",
    reviewDate: "20-Oct-2026",
    status: "Open",
    priority: "High",
    version: "1.2",
    confidentiality: "Internal",
    statement:
      "Because of customer fleet expansion plans, dual-connector support was requested mid-sprint, resulting in harness redesign and BOM escalation.",
    cause: "Uncontrolled scope expansion without formal commercial change order baseline",
    event: "Engineering change notice triggering mechanical enclosure rework",
    impacts: {
      scheduleImpact: "High",
      costImpact: "High",
      technicalImpact: "Medium",
      qualityImpact: "Low",
    },
    likelihood: 5,
    impact: 3,
    inherentScore: 15,
    inherentLevel: "High",
    residualLikelihood: 3,
    residualImpact: 3,
    residualScore: 9,
    residualLevel: "Moderate",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Reduce",
  },
  {
    id: "PR-2026-004",
    riskCode: "RK-PRJ-RES-04",
    title: "Senior embedded firmware engineer attrition during DSP control loop development",
    projectId: "PRJ-001",
    projectName: "Autonomous W-EVSE",
    projectType: "Product",
    projectPhase: "Execution",
    projectManager: "Arun Kumar",
    riskOwner: "Siddharth Verma",
    businessFunction: "Engineering",
    department: "Embedded Systems",
    workPackage: "WP-04 - Control Firmware",
    milestone: "M-03 - Grid Interconnect Testing",
    identificationDate: "10-Sep-2026",
    reviewDate: "10-Nov-2026",
    status: "Open",
    priority: "High",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Because of high market demand for power electronics firmware developers, key personnel resignation may occur, resulting in delay of resonant control algorithms.",
    cause: "High employee turnover and single-person dependency on PLL control code",
    event: "Resignation notice served by lead control algorithm developer",
    impacts: {
      scheduleImpact: "High",
      costImpact: "Medium",
      technicalImpact: "High",
      qualityImpact: "High",
    },
    likelihood: 4,
    impact: 3,
    inherentScore: 12,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 3,
    residualScore: 6,
    residualLevel: "Moderate",
    controlEffectiveness: "Partially Effective",
    treatmentStrategy: "Add Resources",
  },
  {
    id: "PR-2026-005",
    riskCode: "RK-PRJ-CMP-05",
    title: "ARAI / ARAI-61851 EV compliance certification schedule delay",
    projectId: "PRJ-001",
    projectName: "Autonomous W-EVSE",
    projectType: "Product",
    projectPhase: "Execution",
    projectManager: "Arun Kumar",
    riskOwner: "Ravi Teja",
    businessFunction: "Compliance",
    department: "Regulatory Affairs",
    workPackage: "WP-06 - Type Testing & Homologation",
    milestone: "M-04 - Regulatory Certification",
    identificationDate: "01-Sep-2026",
    reviewDate: "01-Nov-2026",
    status: "Monitoring",
    priority: "High",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Because of testing chamber backlog at the certified national test agency, homologation test slots may be delayed, resulting in postponed commercial dispatch.",
    cause: "Testing slot queue saturation at government accredited laboratory",
    event: "Slot booking pushed back by 6 weeks",
    impacts: {
      scheduleImpact: "High",
      costImpact: "Medium",
      technicalImpact: "Low",
      qualityImpact: "Low",
    },
    likelihood: 4,
    impact: 3,
    inherentScore: 12,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Add Contingency",
  },
];

// PROJECT DEPENDENCIES REGISTER (SECTION 6)
export const PROJECT_DEPENDENCIES_REGISTER: ProjectDependencyItem[] = [
  {
    id: "DEP-001",
    type: "Supplier",
    description: "Semiconductor switching module deliveries for Prototype Bench 2",
    owner: "Priya Sharma (Procurement)",
    requiredDate: "30-Sep-2026",
    status: "At Risk",
    criticality: "Critical",
    impactIfDelayed: "Thermal stress validation postponed by 3 weeks",
  },
  {
    id: "DEP-002",
    type: "Internal Team",
    description: "Firmware v2.4 CAN bus driver handover to Hardware Test team",
    owner: "Siddharth Verma (Firmware)",
    requiredDate: "05-Oct-2026",
    status: "On Track",
    criticality: "High",
    impactIfDelayed: "Inability to run automated telemetry validation loop",
  },
  {
    id: "DEP-003",
    type: "Certification",
    description: "ARAI test chamber allocation confirmation for EMC emissions",
    owner: "Ravi Teja (Compliance)",
    requiredDate: "15-Oct-2026",
    status: "At Risk",
    criticality: "Critical",
    impactIfDelayed: "Commercial product launch date slip of 30 days",
  },
  {
    id: "DEP-004",
    type: "Customer",
    description: "Enterprise fleet user acceptance test (UAT) protocol sign-off",
    owner: "Karthik R. (Product)",
    requiredDate: "20-Oct-2026",
    status: "On Track",
    criticality: "Medium",
    impactIfDelayed: "Pilot commercial rollout delayed at Bangalore transit hub",
  },
];

// PROJECT CONTROLS MASTER (SECTION 16 & 17)
export const PROJECT_CONTROLS_MASTER: ProjectControlItem[] = [
  {
    id: "CTL-PRJ-01",
    controlName: "Weekly Critical Path Milestone Review (WBS)",
    objective: "Early detection of task slippage on critical development path",
    owner: "Arun Kumar (PM)",
    frequency: "Weekly",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Pass",
    relatedSOP: "SOP-PM-01 Project Planning & Scheduling",
  },
  {
    id: "CTL-PRJ-02",
    controlName: "Engineering Change Control Board (CCB) Approval",
    objective: "Prevent unauthorized scope creep and unplanned BOM cost escalations",
    owner: "Engineering Review Board",
    frequency: "Weekly",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Exception",
    relatedSOP: "SOP-ENG-05 Engineering Change Management",
  },
  {
    id: "CTL-PRJ-03",
    controlName: "Design Gate Review Checklist (Gate 3: Prototype Ready)",
    objective: "Ensure technical performance and safety criteria before prototype build",
    owner: "Chief Engineer",
    frequency: "Gate Review",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Pass",
    relatedSOP: "SOP-RD-03 Stage-Gate Product Development",
  },
  {
    id: "CTL-PRJ-04",
    controlName: "Supplier Lead-Time Tracking & Buffer Management",
    objective: "Proactively monitor procurement lead times for long-lead critical parts",
    owner: "Procurement Desk",
    frequency: "Weekly",
    designEffectiveness: "Partially Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Remediation In Progress",
    relatedSOP: "SOP-SCM-04 Supplier Delivery Tracking",
  },
];

// PROJECT SCENARIOS & STRESS TESTS (SECTIONS 34 & 35)
export const PROJECT_SCENARIOS: ProjectScenarioItem[] = [
  {
    id: "SCN-PRJ-01",
    name: "Critical Component Delay (Lead Time +50%)",
    assumptions: "Key SiC modules delayed by 6 weeks from primary supplier in Germany",
    scheduleImpact: "+4 weeks overall milestone slip",
    costImpact: "+ ₹6.5 Lakh expedited logistics and testing fee",
    scopeImpact: "No change to baseline scope",
    qualityImpact: "Compressed validation window requiring 24/7 testing shifts",
    responsePlan: "Activate secondary pre-qualified supplier in Taiwan and initiate parallel bench verification",
  },
  {
    id: "SCN-PRJ-02",
    name: "Scope Creep & Dual Connector Mandate",
    assumptions: "Client insists on retrofitting combined charging system for heavy bus fleet",
    scheduleImpact: "+6 weeks development and redesign cycle",
    costImpact: "+ ₹14.8 Lakh hardware re-tooling cost",
    scopeImpact: "Addition of 2 sub-assemblies to Bill of Materials",
    qualityImpact: "Requires fresh thermal certification test cycle",
    responsePlan: "Issue commercial change order with client funding, baseline revised milestone M-03 date",
  },
  {
    id: "SCN-PRJ-03",
    name: "Engineering Attrition & Resource Reduction (-25%)",
    assumptions: "Loss of 2 senior embedded systems developers mid-sprint",
    scheduleImpact: "+3 weeks delay on control loop validation",
    costImpact: "+ ₹4.0 Lakh external contracting fees",
    scopeImpact: "Deprioritize minor diagnostic telemetry features",
    qualityImpact: "Potential code defect rate spike if reviews are rushed",
    responsePlan: "Engage pre-approved specialized embedded engineering partner, mandate peer code reviews",
  },
];

// MAICW FIELD TAXONOMY (SECTION 1)
export const PROJECT_MAICW_FIELDS = [
  { field: "Project Risk ID", type: "Auto Number", maicw: "A", description: "Unique project risk code (PR-YYYY-XXX)" },
  { field: "Risk Code", type: "Text", maicw: "A", description: "Controlled reference e.g. RK-PRJ-TECH-01" },
  { field: "Risk Title", type: "Text", maicw: "M", description: "Short descriptive risk title (Mandatory)" },
  { field: "Project ID", type: "Lookup", maicw: "M", description: "Related project code (PRJ-001)" },
  { field: "Project Name", type: "Lookup", maicw: "M", description: "Project title (Autonomous W-EVSE)" },
  { field: "Project Type", type: "Dropdown", maicw: "M", description: "R&D, Product, Customer, Internal, CAPEX" },
  { field: "Project Phase", type: "Dropdown", maicw: "M", description: "Initiation, Planning, Execution, Closure" },
  { field: "Project Manager", type: "Lookup", maicw: "M", description: "Assigned project manager (Arun Kumar)" },
  { field: "Risk Owner", type: "Lookup", maicw: "M", description: "Accountable owner (Priya Sharma)" },
  { field: "Risk Coordinator", type: "Lookup", maicw: "I", description: "Designated risk coordinator" },
  { field: "Business Function", type: "Lookup", maicw: "M", description: "Affected function (Product Development)" },
  { field: "Department", type: "Lookup", maicw: "M", description: "Responsible department (R&D - Engineering)" },
  { field: "Work Package", type: "Lookup", maicw: "I", description: "WBS package (WP-03 - Prototype Build)" },
  { field: "Milestone", type: "Lookup", maicw: "I", description: "Related milestone (M-02 - Prototype Testing)" },
  { field: "Identification Date", type: "Date", maicw: "M", description: "Date initially cataloged" },
  { field: "Review Date", type: "Date", maicw: "M", description: "Next scheduled review date" },
  { field: "Status", type: "Workflow", maicw: "W", description: "Draft, Under Assessment, Open, Monitoring, Escalated, Closed" },
  { field: "Priority", type: "Dropdown", maicw: "M", description: "Critical, High, Medium, Low" },
  { field: "Version", type: "Number", maicw: "A", description: "Automated version control tracking" },
  { field: "Confidentiality", type: "Dropdown", maicw: "C", description: "Internal, Confidential, Restricted" },
];

// REPORTS SUITE (SECTION 47)
export const PROJECT_REPORT_DEFINITIONS = [
  { id: "PRJ-REP-01", name: "Project Risk Register", category: "Portfolio", desc: "Complete project risk portfolio with inherent and residual scores" },
  { id: "PRJ-REP-02", name: "Executive Project Risk Dashboard", category: "Executive", desc: "PMO-level risk snapshot, milestone slippage, and critical path items" },
  { id: "PRJ-REP-03", name: "Schedule Risk & Critical Path Exposure", category: "Schedule", desc: "Milestone slippage, task variance, SPI, and schedule float depletion" },
  { id: "PRJ-REP-04", name: "Cost Variance & Budget Risk Dossier", category: "Cost", desc: "CPI, Estimate at Completion (EAC), and BOM cost escalation" },
  { id: "PRJ-REP-05", name: "Technical Performance & TRL Audit", category: "Technical", desc: "Prototype failure modes, simulation mismatches, and engineering gaps" },
  { id: "PRJ-REP-06", name: "Resource Allocation & Skill Shortage", category: "Resource", desc: "Utilization rates, key person dependencies, and contractor costs" },
  { id: "PRJ-REP-07", name: "Procurement & Long-Lead Component Log", category: "Procurement", desc: "Supplier delivery delays, single-source dependencies, and freight costs" },
  { id: "PRJ-REP-08", name: "Scope Change & Engineering Variance Log", category: "Scope", desc: "Customer change requests, scope creep, and unapproved variations" },
  { id: "PRJ-REP-09", name: "Regulatory Homologation & Type Testing", category: "Compliance", desc: "ARAI/CE certification progress, laboratory bookings, and audit logs" },
  { id: "PRJ-REP-10", name: "Project Dependencies & Blockers Matrix", category: "Dependencies", desc: "Inter-team handovers, external dependencies, and critical blockers" },
  { id: "PRJ-REP-11", name: "Project Risk Treatment Action Plan", category: "Mitigation", desc: "Status, budgets, owners, and evidence for active treatment initiatives" },
  { id: "PRJ-REP-12", name: "AI Project Risk Intelligence Digest", category: "AI Analytics", desc: "Predictive milestone delays, supplier risk correlation, and burn rates" },
];

export const projectRiskService = {
  getPrimaryRisk: () => PRIMARY_PROJECT_RISK,
  getTopRisks: () => TOP_PROJECT_RISKS,
  getKRIs: () => PROJECT_KRIS,
  getTreatmentActions: () => PROJECT_TREATMENT_ACTIONS,
  getRiskTrend: () => PROJECT_RISK_TREND,
  getCategoryDistribution: () => PROJECT_CATEGORY_DISTRIBUTION,
  getAIInsights: () => PROJECT_AI_INSIGHTS,
  getFullRisks: () => FULL_PROJECT_RISKS,
  getDependencies: () => PROJECT_DEPENDENCIES_REGISTER,
  getControls: () => PROJECT_CONTROLS_MASTER,
  getScenarios: () => PROJECT_SCENARIOS,
  getMAICWFields: () => PROJECT_MAICW_FIELDS,
  getReports: () => PROJECT_REPORT_DEFINITIONS,
};

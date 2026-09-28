// Magnertia ERP - Internal Compliance Service
// Management -> Risk Management -> Internal Compliance
// Internal Compliance Form — MAICW Classification & Internal Governance Master

export type MAICWType = "M" | "A" | "I" | "C" | "W";

export interface MAICWFieldDef {
  field: string;
  type: string;
  maicw: MAICWType;
  description: string;
}

export type InternalComplianceType =
  | "Policy"
  | "SOP"
  | "Process"
  | "Control"
  | "Governance";

export type InternalComplianceDomain =
  | "Corporate Governance"
  | "Finance"
  | "Operations"
  | "Quality"
  | "HR"
  | "IT & Cybersecurity"
  | "Procurement & Supply Chain"
  | "Procurement";

export type InternalCompliancePriority = "Critical" | "High" | "Medium" | "Low";

export type InternalComplianceWorkflowStatus =
  | "Draft"
  | "Active"
  | "Due"
  | "Non-Compliant"
  | "Closed"
  | "Under Review";

export interface ApplicablePolicySOP {
  id: string;
  name: string;
  type: "Policy" | "SOP" | "Process" | "Standard";
  version: string;
  effectiveDate: string;
  status: "Active" | "Draft" | "Under Revision";
  scope?: string;
  owner?: string;
}

export interface InternalControlItem {
  id: string;
  name: string;
  type: "Preventive" | "Detective" | "Automated" | "Management" | "Corrective" | "Manual";
  frequency: "Real-time" | "Daily" | "Continuous" | "Monthly" | "Quarterly" | "Annual";
  status: "Effective" | "Partially Effective" | "Ineffective" | "Pending Testing";
  owner?: string;
  evidenceRequired?: string;
}

export interface InternalAssessmentItem {
  id: string;
  date: string;
  type: "Self Assessment" | "Internal Audit" | "Control Test" | "Management Review";
  assessor: string;
  result: "Compliant" | "Partial" | "Non-Compliant";
  findings: number;
  notes?: string;
}

export interface InternalOpenActionItem {
  id: string;
  description: string;
  owner: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Closed" | "Verified";
  severity?: "High" | "Medium" | "Low";
}

export interface ComplianceTimelineMilestone {
  date: string;
  description: string;
  type: "effective" | "completed" | "action" | "due" | "audit" | "review";
  statusColor: string;
}

export interface SODMatrixRow {
  activity: string;
  request: boolean;
  approve: boolean;
  execute: boolean;
  verify: boolean;
  pay: boolean;
}

export interface InternalComplianceRecord {
  // 1. Form Information
  id: string; // Auto Number (A) e.g. IC-2026-001
  complianceCode: string; // Controlled Ref (A) e.g. COMP-001
  complianceName: string; // Text (M) e.g. Procurement Approval Compliance
  complianceType: InternalComplianceType; // Dropdown (M) e.g. Process
  complianceDomain: string; // Dropdown (M) e.g. Procurement
  policy: string; // Lookup (M) e.g. Procurement Policy v2.0
  businessFunction: string; // Lookup (M) e.g. Supply Chain
  department: string; // Lookup (M) e.g. Procurement
  process: string; // Lookup (M) e.g. Purchase Requisition to PO
  controlOwner: string; // Lookup (M) e.g. Ramesh S
  controlOwnerAvatar: string;
  complianceCoordinator: string; // Lookup (M) e.g. Priya Sharma
  complianceCoordinatorAvatar: string;
  effectiveDate: string; // Date (M) e.g. 01-Jan-2026
  reviewDate: string; // Date (M) e.g. 01-Jan-2027
  dueDate: string; // Date (M) e.g. 30-Apr-2026
  status: InternalComplianceWorkflowStatus; // Workflow (W) e.g. Active
  priority: InternalCompliancePriority; // Dropdown (M) e.g. Critical
  version: string; // Number (A) e.g. 1.0
  confidentiality: "Internal" | "Confidential" | "Restricted"; // Dropdown (C) e.g. Internal
  tags: string[];

  // 2. Compliance Overview
  internalRequirement: string;
  businessObjective: string;
  applicability: "Applicable" | "Conditional" | "Not Applicable";
  controlRequirement: string;
  evidenceRequired: string;
  monitoringFrequency: "Real-time" | "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annual";
  reviewFrequency: string;
  currentStatus: "Compliant" | "Partially Compliant" | "Non-Compliant" | "Requires Review";
  statement: string;

  // Workflow Stepper & Progress
  workflowStage: "Define" | "Implement" | "Monitor" | "Audit" | "Close";
  workflowProgressPercent: number;
  reviewDueCountdownDays: number;
  reviewDueDateFormatted: string;

  // Key Dates
  lastAssessmentDate: string;
  nextAuditDate: string;

  // 3. Applicable Policies & SOPs
  policiesAndSops: ApplicablePolicySOP[];

  // 4. Controls
  controls: InternalControlItem[];

  // 5. Compliance Risk
  riskRating: "Critical" | "High" | "Medium" | "Low";
  likelihood: number; // 1-5
  impact: number; // 1-5
  riskScore: number; // Likelihood * Impact
  keyRisk: string;
  mitigation: string;

  // 6. Recent Assessments
  recentAssessments: InternalAssessmentItem[];

  // 7. Open Actions
  openActions: InternalOpenActionItem[];

  // 8. Compliance Timeline
  timelineMilestones: ComplianceTimelineMilestone[];
}

// -------------------------------------------------------------------------
// 1. PRIMARY ACTIVE RECORD - EXACT 1:1 TO INTERNAL COMPLIANCE SCREENSHOT
// -------------------------------------------------------------------------
export const PRIMARY_INTERNAL_RECORD: InternalComplianceRecord = {
  id: "IC-2026-001",
  complianceCode: "COMP-001",
  complianceName: "Procurement Approval Compliance",
  complianceType: "Process",
  complianceDomain: "Procurement",
  policy: "Procurement Policy v2.0",
  businessFunction: "Supply Chain",
  department: "Procurement",
  process: "Purchase Requisition to PO",
  controlOwner: "Ramesh S",
  controlOwnerAvatar: "RS",
  complianceCoordinator: "Priya Sharma",
  complianceCoordinatorAvatar: "PS",
  effectiveDate: "01-Jan-2026",
  reviewDate: "01-Jan-2027",
  dueDate: "30-Apr-2026",
  status: "Active",
  priority: "Critical",
  version: "1.0",
  confidentiality: "Internal",
  tags: ["Procurement", "Approval", "Finance"],

  // 2. Overview
  internalRequirement:
    "All purchase requests above the defined threshold must be approved as per the Delegation of Authority matrix.",
  businessObjective: "Ensure proper approval and prevent unauthorized purchases.",
  applicability: "Applicable",
  controlRequirement: "System-based approval workflow with threshold check.",
  evidenceRequired: "Approval records, system logs",
  monitoringFrequency: "Monthly",
  reviewFrequency: "Annual",
  currentStatus: "Compliant",
  statement:
    "Magnertia shall establish clear internal requirements, assign accountable owners, implement appropriate controls, maintain evidence, periodically assess compliance, address deviations, and continuously improve internal governance and operational discipline.",

  // Workflow
  workflowStage: "Monitor",
  workflowProgressPercent: 60,
  reviewDueCountdownDays: 120,
  reviewDueDateFormatted: "01-Jan-2027",

  // Key Dates
  lastAssessmentDate: "15-Mar-2026",
  nextAuditDate: "10-Jun-2026",

  // 3. Applicable Policies & SOPs
  policiesAndSops: [
    {
      id: "POL-01",
      name: "Procurement Policy",
      type: "Policy",
      version: "v2.0",
      effectiveDate: "01-Jan-2026",
      status: "Active",
      scope: "All Commercial Purchases",
      owner: "VP Supply Chain",
    },
    {
      id: "POL-02",
      name: "Delegation of Authority",
      type: "Policy",
      version: "v1.5",
      effectiveDate: "01-Jan-2026",
      status: "Active",
      scope: "Company-wide Financial Limits",
      owner: "Chief Financial Officer",
    },
    {
      id: "SOP-01",
      name: "Purchase SOP",
      type: "SOP",
      version: "v3.0",
      effectiveDate: "15-Jan-2026",
      status: "Active",
      scope: "PR to PO Conversion Steps",
      owner: "Procurement Head",
    },
    {
      id: "SOP-02",
      name: "Vendor Management SOP",
      type: "SOP",
      version: "v2.2",
      effectiveDate: "01-Feb-2026",
      status: "Active",
      scope: "Onboarding & Performance Review",
      owner: "Vendor Operations Lead",
    },
  ],

  // 4. Controls
  controls: [
    {
      id: "C-001",
      name: "Threshold based approval",
      type: "Preventive",
      frequency: "Real-time",
      status: "Effective",
      owner: "System Gate Engine",
      evidenceRequired: "ERP Electronic Approval Timestamp",
    },
    {
      id: "C-002",
      name: "SOD validation",
      type: "Detective",
      frequency: "Monthly",
      status: "Effective",
      owner: "Risk & Governance Team",
      evidenceRequired: "Conflict Scan Audit Log",
    },
    {
      id: "C-003",
      name: "Approval workflow log",
      type: "Automated",
      frequency: "Continuous",
      status: "Effective",
      owner: "IT Application Lead",
      evidenceRequired: "Immutable Database Log",
    },
    {
      id: "C-004",
      name: "Management review",
      type: "Management",
      frequency: "Quarterly",
      status: "Effective",
      owner: "Supply Chain Committee",
      evidenceRequired: "Signed Minutes & Action Tracker",
    },
    {
      id: "C-005",
      name: "Exception monitoring",
      type: "Detective",
      frequency: "Monthly",
      status: "Effective",
      owner: "Internal Audit Lead",
      evidenceRequired: "Emergency PO Approval Dossier",
    },
  ],

  // 5. Compliance Risk
  riskRating: "High",
  likelihood: 4,
  impact: 4,
  riskScore: 16,
  keyRisk: "Unauthorized purchases and financial loss.",
  mitigation: "System controls, approval matrix, and periodic audits.",

  // 6. Recent Assessments
  recentAssessments: [
    {
      id: "ASM-01",
      date: "15-Mar-2026",
      type: "Self Assessment",
      assessor: "Priya Sharma",
      result: "Compliant",
      findings: 0,
      notes: "Sample of 45 Purchase Orders verified against Delegation matrix. 100% compliant.",
    },
    {
      id: "ASM-02",
      date: "10-Dec-2025",
      type: "Internal Audit",
      assessor: "Audit Team",
      result: "Partial",
      findings: 2,
      notes: "Two instances of retroactive PR approvals noted during urgent plant shutdown.",
    },
    {
      id: "ASM-03",
      date: "20-Sep-2025",
      type: "Control Test",
      assessor: "Ramesh S",
      result: "Compliant",
      findings: 0,
      notes: "System threshold controls tested with mock transactions exceeding ₹50 Lakhs.",
    },
    {
      id: "ASM-04",
      date: "15-Jun-2025",
      type: "Self Assessment",
      assessor: "Priya Sharma",
      result: "Compliant",
      findings: 0,
      notes: "Mid-year operational review. Clean audit trail.",
    },
  ],

  // 7. Open Actions
  openActions: [
    {
      id: "A-001",
      description: "Update approval matrix",
      owner: "Ramesh S",
      dueDate: "20-Apr-2026",
      status: "Open",
      severity: "High",
    },
    {
      id: "A-002",
      description: "Provide training",
      owner: "Priya Sharma",
      dueDate: "30-Apr-2026",
      status: "In Progress",
      severity: "Medium",
    },
    {
      id: "A-003",
      description: "Resolve audit finding",
      owner: "Vikram K",
      dueDate: "15-May-2026",
      status: "Open",
      severity: "High",
    },
  ],

  // 8. Compliance Timeline
  timelineMilestones: [
    {
      date: "01-Jan-2026",
      description: "Policy became effective",
      type: "effective",
      statusColor: "bg-emerald-500",
    },
    {
      date: "15-Mar-2026",
      description: "Self assessment completed",
      type: "completed",
      statusColor: "bg-emerald-500",
    },
    {
      date: "20-Apr-2026",
      description: "Action due: Update approval matrix",
      type: "action",
      statusColor: "bg-amber-500",
    },
    {
      date: "30-Apr-2026",
      description: "Compliance due date",
      type: "due",
      statusColor: "bg-amber-500",
    },
    {
      date: "10-Jun-2026",
      description: "Internal audit scheduled",
      type: "audit",
      statusColor: "bg-blue-500",
    },
    {
      date: "01-Jan-2027",
      description: "Next review date",
      type: "review",
      statusColor: "bg-slate-400",
    },
  ],
};

// -------------------------------------------------------------------------
// 2. ADDITIONAL INTERNAL COMPLIANCE RECORDS FOR SWITCHING
// -------------------------------------------------------------------------
export const FULL_INTERNAL_COMPLIANCE_RECORDS: InternalComplianceRecord[] = [
  PRIMARY_INTERNAL_RECORD,
  {
    id: "IC-2026-002",
    complianceCode: "COMP-002",
    complianceName: "Employee Information Security & Password Hygiene",
    complianceType: "Policy",
    complianceDomain: "IT & Cybersecurity",
    policy: "Information Security Policy v4.1",
    businessFunction: "IT & Cybersecurity",
    department: "Information Security",
    process: "Identity & Access Management",
    controlOwner: "Sunil Nambiar",
    controlOwnerAvatar: "SN",
    complianceCoordinator: "Meera Sen",
    complianceCoordinatorAvatar: "MS",
    effectiveDate: "15-Jan-2026",
    reviewDate: "15-Jan-2027",
    dueDate: "15-May-2026",
    status: "Active",
    priority: "High",
    version: "2.0",
    confidentiality: "Restricted",
    tags: ["Security", "Access Control", "Password Policy"],
    internalRequirement:
      "All employees must maintain 16-character MFA-backed passwords, complete bi-annual credential rotation, and acknowledge clean-desk policies.",
    businessObjective: "Protect Magnertia intellectual property and prevent unauthorized system intrusion.",
    applicability: "Applicable",
    controlRequirement: "Automated Active Directory MFA enforcement and inactive session lock.",
    evidenceRequired: "Directory logs, phishing drill scores",
    monitoringFrequency: "Continuous",
    reviewFrequency: "Annual",
    currentStatus: "Compliant",
    statement:
      "Information assets must be handled with utmost confidentiality and zero credential-sharing.",
    workflowStage: "Monitor",
    workflowProgressPercent: 85,
    reviewDueCountdownDays: 140,
    reviewDueDateFormatted: "15-Jan-2027",
    lastAssessmentDate: "01-Feb-2026",
    nextAuditDate: "15-Jul-2026",
    policiesAndSops: [
      { id: "POL-SEC-01", name: "Information Security Policy", type: "Policy", version: "v4.1", effectiveDate: "15-Jan-2026", status: "Active" },
      { id: "SOP-SEC-02", name: "Identity Access SOP", type: "SOP", version: "v2.0", effectiveDate: "15-Jan-2026", status: "Active" },
    ],
    controls: [
      { id: "C-101", name: "MFA Enforcement", type: "Automated", frequency: "Continuous", status: "Effective" },
      { id: "C-102", name: "Privileged Access Review", type: "Detective", frequency: "Monthly", status: "Effective" },
    ],
    riskRating: "Medium",
    likelihood: 2,
    impact: 4,
    riskScore: 8,
    keyRisk: "Credential leakage and unauthorized ERP modifications.",
    mitigation: "Hardware tokens and automated timeout rules.",
    recentAssessments: [
      { id: "ASM-11", date: "01-Feb-2026", type: "Control Test", assessor: "Sunil Nambiar", result: "Compliant", findings: 0 },
    ],
    openActions: [
      { id: "A-101", description: "Enforce FIDO2 keys for finance team", owner: "Sunil Nambiar", dueDate: "30-May-2026", status: "In Progress" },
    ],
    timelineMilestones: [
      { date: "15-Jan-2026", description: "Security policy enacted", type: "effective", statusColor: "bg-emerald-500" },
      { date: "01-Feb-2026", description: "MFA audit passed", type: "completed", statusColor: "bg-emerald-500" },
    ],
  },
  {
    id: "IC-2026-003",
    complianceCode: "COMP-003",
    complianceName: "Manufacturing Quality Inspection & NCR Escalation",
    complianceType: "SOP",
    complianceDomain: "Quality",
    policy: "Quality Management Manual ISO 9001",
    businessFunction: "Manufacturing",
    department: "Quality Assurance",
    process: "In-Process Quality Inspection (IPQC)",
    controlOwner: "Dr. Vikram Seth",
    controlOwnerAvatar: "VS",
    complianceCoordinator: "Ananya Nair",
    complianceCoordinatorAvatar: "AN",
    effectiveDate: "01-Nov-2025",
    reviewDate: "01-Nov-2026",
    dueDate: "30-Jun-2026",
    status: "Active",
    priority: "Critical",
    version: "3.1",
    confidentiality: "Internal",
    tags: ["Quality", "IPQC", "NCR", "ISO 9001"],
    internalRequirement:
      "All production batches must pass automated high-voltage continuity testing and all non-conformances exceeding 0.5% must trigger an immediate NCR.",
    businessObjective: "Prevent sub-standard EVSE products from reaching dispatch bays.",
    applicability: "Applicable",
    controlRequirement: "Interlocked testing jigs with barcode scanning before box packing.",
    evidenceRequired: "Inspection test logs, NCR forms",
    monitoringFrequency: "Real-time",
    reviewFrequency: "Annual",
    currentStatus: "Compliant",
    statement:
      "Quality is built into every Magnertia product through mandatory gate inspections.",
    workflowStage: "Monitor",
    workflowProgressPercent: 78,
    reviewDueCountdownDays: 95,
    reviewDueDateFormatted: "01-Nov-2026",
    lastAssessmentDate: "10-Feb-2026",
    nextAuditDate: "20-Aug-2026",
    policiesAndSops: [
      { id: "POL-QA-01", name: "QMS Manual", type: "Policy", version: "v5.0", effectiveDate: "01-Nov-2025", status: "Active" },
      { id: "SOP-QA-02", name: "IPQC Testing SOP", type: "SOP", version: "v3.1", effectiveDate: "01-Nov-2025", status: "Active" },
    ],
    controls: [
      { id: "C-201", name: "Automated EOL Electrical Test", type: "Preventive", frequency: "Continuous", status: "Effective" },
    ],
    riskRating: "Medium",
    likelihood: 2,
    impact: 4,
    riskScore: 8,
    keyRisk: "Batch defect recall and warranty claim costs.",
    mitigation: "Poka-yoke assembly fixtures and real-time SPC charts.",
    recentAssessments: [
      { id: "ASM-21", date: "10-Feb-2026", type: "Internal Audit", assessor: "QA Audit Squad", result: "Compliant", findings: 0 },
    ],
    openActions: [],
    timelineMilestones: [
      { date: "01-Nov-2025", description: "IPQC SOP implemented", type: "effective", statusColor: "bg-emerald-500" },
    ],
  },
];

// -------------------------------------------------------------------------
// 3. EXECUTIVE KPI WIDGETS DATA (MATCHING SCREENSHOT)
// -------------------------------------------------------------------------
export interface InternalExecutiveKPISummary {
  totalRequirements: number;
  totalRequirementsDelta: string;
  nonCompliant: number;
  nonCompliantDelta: string;
  dueIn30Days: number;
  dueIn30DaysDelta: string;
  compliant: number;
  compliantDelta: string;
  openActions: number;
  openActionsDelta: string;
  complianceReadiness: number;
  complianceReadinessDelta: string;
}

export const INTERNAL_EXECUTIVE_KPIS: InternalExecutiveKPISummary = {
  totalRequirements: 32,
  totalRequirementsDelta: "+12%",
  nonCompliant: 3,
  nonCompliantDelta: "+200%",
  dueIn30Days: 5,
  dueIn30DaysDelta: "+67%",
  compliant: 24,
  compliantDelta: "+33%",
  openActions: 6,
  openActionsDelta: "-25%",
  complianceReadiness: 92,
  complianceReadinessDelta: "+8%",
};

// -------------------------------------------------------------------------
// 4. ALL 19 INTERNAL COMPLIANCE REPORTS (SECTION 38 IN USER SPEC)
// -------------------------------------------------------------------------
export interface InternalReportDefinition {
  id: string;
  code: string;
  title: string;
  category:
    | "Registers & Policies"
    | "Controls & Testing"
    | "Audits & Non-Compliance"
    | "Governance & SOD"
    | "People & Training"
    | "Intelligence & Risk";
  purpose: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annual" | "On-Demand";
  recordsCount: number;
  lastGenerated: string;
  status: "Available" | "Scheduled" | "Archived";
  columns: string[];
  sampleData: Record<string, any>[];
}

export const INTERNAL_REPORT_DEFINITIONS: InternalReportDefinition[] = [
  {
    id: "IREP-01",
    code: "ICR-01",
    title: "Internal Compliance Register",
    category: "Registers & Policies",
    purpose: "Master inventory of all internal policies, SOPs, governance rules, and operational requirements.",
    frequency: "Monthly",
    recordsCount: 32,
    lastGenerated: "24-Mar-2026",
    status: "Available",
    columns: ["ID", "Requirement Name", "Domain", "Accountable Owner", "Due Date", "Current State"],
    sampleData: [
      { "ID": "IC-2026-001", "Requirement Name": "Procurement Approval Compliance", "Domain": "Procurement", "Accountable Owner": "Ramesh S", "Due Date": "30-Apr-2026", "Current State": "Compliant" },
      { "ID": "IC-2026-002", "Requirement Name": "Employee InfoSec & Password Hygiene", "Domain": "IT & Cyber", "Accountable Owner": "Sunil Nambiar", "Due Date": "15-May-2026", "Current State": "Compliant" },
      { "ID": "IC-2026-003", "Requirement Name": "Quality IPQC & NCR Escalation", "Domain": "Quality", "Accountable Owner": "Dr. Vikram Seth", "Due Date": "30-Jun-2026", "Current State": "Compliant" },
      { "ID": "IC-2026-004", "Requirement Name": "Petty Cash & Imprest Reconciliation", "Domain": "Finance", "Accountable Owner": "Pooja V", "Due Date": "31-Mar-2026", "Current State": "Due Soon" },
      { "ID": "IC-2026-005", "Requirement Name": "Contractor Biometric Verification", "Domain": "HR", "Accountable Owner": "Kavita Rao", "Due Date": "20-Apr-2026", "Current State": "Compliant" },
    ],
  },
  {
    id: "IREP-02",
    code: "ICR-02",
    title: "Policy Compliance Report",
    category: "Registers & Policies",
    purpose: "Adherence scorecard for Magnertia corporate, operational, and governance policies.",
    frequency: "Quarterly",
    recordsCount: 22,
    lastGenerated: "20-Mar-2026",
    status: "Available",
    columns: ["Policy Code", "Policy Name", "Version", "Adherence Rate", "Active Exceptions", "Status"],
    sampleData: [
      { "Policy Code": "POL-GOV-01", "Policy Name": "Delegation of Authority", "Version": "v1.5", "Adherence Rate": "99.2%", "Active Exceptions": 1, "Status": "Optimal" },
      { "Policy Code": "POL-FIN-02", "Policy Name": "Travel & Expense Policy", "Version": "v2.1", "Adherence Rate": "96.4%", "Active Exceptions": 3, "Status": "Compliant" },
      { "Policy Code": "POL-HR-03", "Policy Name": "Code of Conduct & Ethics", "Version": "v3.0", "Adherence Rate": "100%", "Active Exceptions": 0, "Status": "Optimal" },
      { "Policy Code": "POL-IT-04", "Policy Name": "Clean Desk & Remote Work", "Version": "v2.0", "Adherence Rate": "94.8%", "Active Exceptions": 2, "Status": "Compliant" },
    ],
  },
  {
    id: "IREP-03",
    code: "ICR-03",
    title: "SOP Compliance Report",
    category: "Registers & Policies",
    purpose: "Operational procedure adherence and deviation tracking across plants and departments.",
    frequency: "Monthly",
    recordsCount: 28,
    lastGenerated: "22-Mar-2026",
    status: "Available",
    columns: ["SOP ID", "Process Title", "Department", "Audit Sample", "Deviations Found", "Status"],
    sampleData: [
      { "SOP ID": "SOP-MFG-01", "Process Title": "Lithium Cell Assembly & Torque SOP", "Department": "Assembly Line 1", "Audit Sample": 120, "Deviations Found": 0, "Status": "Effective" },
      { "SOP ID": "SOP-SCM-02", "Process Title": "Material Inward & GRN Matching", "Department": "Warehouse Pune", "Audit Sample": 85, "Deviations Found": 1, "Status": "Minor Deviation" },
      { "SOP ID": "SOP-HR-03", "Process Title": "New Employee Onboarding Verification", "Department": "Human Resources", "Audit Sample": 35, "Deviations Found": 0, "Status": "Effective" },
    ],
  },
  {
    id: "IREP-04",
    code: "ICR-04",
    title: "Control Register",
    category: "Controls & Testing",
    purpose: "Consolidated catalog of preventive, detective, and automated management controls.",
    frequency: "Monthly",
    recordsCount: 78,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["Control ID", "Control Description", "Type", "Operating Frequency", "Owner", "Status"],
    sampleData: [
      { "Control ID": "C-001", "Control Description": "Threshold based PO approval gate", "Type": "Preventive", "Operating Frequency": "Real-time", "Owner": "System Engine", "Status": "Effective" },
      { "Control ID": "C-002", "Control Description": "Segregation of Duties automated scan", "Type": "Detective", "Operating Frequency": "Monthly", "Owner": "Risk Committee", "Status": "Effective" },
      { "Control ID": "C-003", "Control Description": "ERP privileged change logging", "Type": "Automated", "Operating Frequency": "Continuous", "Owner": "IT Security", "Status": "Effective" },
      { "Control ID": "C-004", "Control Description": "Quarterly executive management review", "Type": "Management", "Operating Frequency": "Quarterly", "Owner": "Board Secretariat", "Status": "Effective" },
    ],
  },
  {
    id: "IREP-05",
    code: "ICR-05",
    title: "Control Effectiveness Report",
    category: "Controls & Testing",
    purpose: "Testing results, sample sizes, pass rates, and failure exceptions across all internal controls.",
    frequency: "Quarterly",
    recordsCount: 45,
    lastGenerated: "21-Mar-2026",
    status: "Available",
    columns: ["Test ID", "Control Ref", "Sample Size", "Pass Rate %", "Failure Count", "Result"],
    sampleData: [
      { "Test ID": "TEST-2026-01", "Control Ref": "C-001 (PO Gate)", "Sample Size": 250, "Pass Rate %": "100%", "Failure Count": 0, "Result": "Effective" },
      { "Test ID": "TEST-2026-02", "Control Ref": "C-002 (SOD Scan)", "Sample Size": 480, "Pass Rate %": "99.4%", "Failure Count": 3, "Result": "Partially Effective" },
      { "Test ID": "TEST-2026-03", "Control Ref": "C-101 (MFA)", "Sample Size": 840, "Pass Rate %": "100%", "Failure Count": 0, "Result": "Effective" },
    ],
  },
  {
    id: "IREP-06",
    code: "ICR-06",
    title: "Compliance Assessment Report",
    category: "Audits & Non-Compliance",
    purpose: "Departmental self-assessments, compliance scorecards, and management declarations.",
    frequency: "Monthly",
    recordsCount: 18,
    lastGenerated: "23-Mar-2026",
    status: "Available",
    columns: ["Assessment ID", "Department", "Assessor", "Score %", "Open Gaps", "Status"],
    sampleData: [
      { "Assessment ID": "ASM-SCM-01", "Department": "Procurement & SCM", "Assessor": "Priya Sharma", "Score %": "98.0%", "Open Gaps": 1, "Status": "Compliant" },
      { "Assessment ID": "ASM-FIN-02", "Department": "Finance & Accounts", "Assessor": "Ramesh S", "Score %": "96.5%", "Open Gaps": 1, "Status": "Compliant" },
      { "Assessment ID": "ASM-PLANT-03", "Department": "Chakan Plant Manufacturing", "Assessor": "Suresh Patil", "Score %": "94.2%", "Open Gaps": 2, "Status": "Action Pending" },
    ],
  },
  {
    id: "IREP-07",
    code: "ICR-07",
    title: "Internal Audit Report",
    category: "Audits & Non-Compliance",
    purpose: "Independent audit findings, management responses, severity ratings, and target dates.",
    frequency: "Quarterly",
    recordsCount: 14,
    lastGenerated: "18-Mar-2026",
    status: "Available",
    columns: ["Audit ID", "Audit Scope", "Lead Auditor", "Total Findings", "Critical", "Status"],
    sampleData: [
      { "Audit ID": "IA-2026-Q1", "Audit Scope": "Procure-to-Pay Cycle & DOA", "Lead Auditor": "K. Deshpande", "Total Findings": 2, "Critical": 0, "Status": "CAPA Open" },
      { "Audit ID": "IA-2025-Q4", "Audit Scope": "Inventory Valuation & Physical Count", "Lead Auditor": "Internal Audit Team", "Total Findings": 1, "Critical": 0, "Status": "Closed" },
      { "Audit ID": "IA-2025-Q3", "Audit Scope": "IT General Controls (ITGC)", "Lead Auditor": "Deloitte & Touche", "Total Findings": 0, "Critical": 0, "Status": "Clean Audit" },
    ],
  },
  {
    id: "IREP-08",
    code: "ICR-08",
    title: "Non-Compliance Report",
    category: "Audits & Non-Compliance",
    purpose: "Documented policy and procedural deviations classified as Minor, Major, or Critical.",
    frequency: "Monthly",
    recordsCount: 5,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["NC ID", "Policy / SOP Ref", "Breach Summary", "Severity", "Responsible Owner", "Target Date"],
    sampleData: [
      { "NC ID": "INC-2026-01", "Policy / SOP Ref": "DOA Matrix Section 4", "Breach Summary": "Urgent plant spare PO released prior to VP sign-off", "Severity": "Major", "Responsible Owner": "Ramesh S", "Target Date": "20-Apr-2026" },
      { "NC ID": "INC-2026-02", "Policy / SOP Ref": "IT Access Policy", "Breach Summary": "Contractor account active 48 hours post project end", "Severity": "Minor", "Responsible Owner": "HR Operations", "Target Date": "Completed" },
    ],
  },
  {
    id: "IREP-09",
    code: "ICR-09",
    title: "Exception Report",
    category: "Governance & SOD",
    purpose: "Approved policy exceptions, temporary delegations, compensating controls, and expiry dates.",
    frequency: "Monthly",
    recordsCount: 6,
    lastGenerated: "22-Mar-2026",
    status: "Available",
    columns: ["Exception ID", "Policy Ref", "Reason for Exception", "Compensating Control", "Expiry Date", "Approver"],
    sampleData: [
      { "Exception ID": "EXC-2026-01", "Policy Ref": "Procurement DOA", "Reason for Exception": "Urgent import of prototype silicon wafers", "Compensating Control": "Dual VP sign-off & post-facto audit", "Expiry Date": "30-Apr-2026", "Approver": "CEO / CFO" },
      { "Exception ID": "EXC-2026-02", "Policy Ref": "Travel Policy", "Reason for Exception": "Overseas OEM customer summit attendance", "Compensating Control": "Actual expense receipts cap", "Expiry Date": "15-May-2026", "Approver": "Managing Director" },
    ],
  },
  {
    id: "IREP-10",
    code: "ICR-10",
    title: "SOD Violation Report",
    category: "Governance & SOD",
    purpose: "Segregation of Duties matrix conflicts (e.g. Request vs. Approve vs. Pay) and resolution status.",
    frequency: "Weekly",
    recordsCount: 3,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["Alert ID", "User ID", "User Name", "Conflicting Roles", "Risk Severity", "Mitigation Status"],
    sampleData: [
      { "Alert ID": "SOD-2026-01", "User ID": "EMP-4091", "User Name": "Ajay Sharma", "Conflicting Roles": "PO Creator + Payment Initiator", "Risk Severity": "Critical", "Mitigation Status": "Role Revoked in ERP" },
      { "Alert ID": "SOD-2026-02", "User ID": "EMP-1022", "User Name": "Pooja V", "Conflicting Roles": "Vendor Creator + Invoice Approver", "Risk Severity": "High", "Mitigation Status": "Under Review by Head Finance" },
    ],
  },
  {
    id: "IREP-11",
    code: "ICR-11",
    title: "Approval Compliance Report",
    category: "Governance & SOD",
    purpose: "Delegated authority adherence, approval sequence monitoring, and bypass detection.",
    frequency: "Weekly",
    recordsCount: 34,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["Transaction ID", "Amount", "Required Authority", "Actual Approver", "Variance", "Outcome"],
    sampleData: [
      { "Transaction ID": "PO-2026-8910", "Amount": "₹28,50,000", "Required Authority": "Director Operations", "Actual Approver": "Director Operations", "Variance": "None", "Outcome": "Compliant" },
      { "Transaction ID": "PO-2026-8914", "Amount": "₹75,00,000", "Required Authority": "CFO Approval Gate", "Actual Approver": "CFO", "Variance": "None", "Outcome": "Compliant" },
      { "Transaction ID": "PO-2026-8921", "Amount": "₹12,00,000", "Required Authority": "Department Head", "Actual Approver": "Alternate Manager", "Variance": "Delegated Acting Power", "Outcome": "Approved Exception" },
    ],
  },
  {
    id: "IREP-12",
    code: "ICR-12",
    title: "Training Compliance Report",
    category: "People & Training",
    purpose: "Completion rates for internal policies, SOP procedures, cybersecurity, and ethics modules.",
    frequency: "Monthly",
    recordsCount: 12,
    lastGenerated: "20-Mar-2026",
    status: "Available",
    columns: ["Training Code", "Course Module", "Assigned Staff", "Completed Count", "Completion %", "Status"],
    sampleData: [
      { "Training Code": "TRN-DOA-01", "Course Module": "Delegation of Authority & PO Approval", "Assigned Staff": 120, "Completed Count": 118, "Completion %": "98.3%", "Status": "Optimal" },
      { "Training Code": "TRN-QMS-02", "Course Module": "Plant Quality & Poka-Yoke SOPs", "Assigned Staff": 240, "Completed Count": 235, "Completion %": "97.9%", "Status": "Optimal" },
      { "Training Code": "TRN-SEC-03", "Course Module": "Information Security & Phishing Drill", "Assigned Staff": 840, "Completed Count": 798, "Completion %": "95.0%", "Status": "Compliant" },
    ],
  },
  {
    id: "IREP-13",
    code: "ICR-13",
    title: "Policy Acknowledgement Report",
    category: "People & Training",
    purpose: "Employee digital signature and acknowledgement status for updated internal policies.",
    frequency: "Monthly",
    recordsCount: 15,
    lastGenerated: "22-Mar-2026",
    status: "Available",
    columns: ["Policy Code", "Policy Version", "Headcount Targeted", "Acknowledged Count", "Ack Rate %", "Overdue"],
    sampleData: [
      { "Policy Code": "POL-ETH-01", "Policy Version": "Code of Conduct v3.0", "Headcount Targeted": 840, "Acknowledged Count": 832, "Ack Rate %": "99.0%", "Overdue": 8 },
      { "Policy Code": "POL-SEC-02", "Policy Version": "Information Security v4.1", "Headcount Targeted": 840, "Acknowledged Count": 815, "Ack Rate %": "97.0%", "Overdue": 25 },
      { "Policy Code": "POL-PRC-03", "Policy Version": "Procurement Policy v2.0", "Headcount Targeted": 140, "Acknowledged Count": 140, "Ack Rate %": "100%", "Overdue": 0 },
    ],
  },
  {
    id: "IREP-14",
    code: "ICR-14",
    title: "Corrective Action Report",
    category: "Audits & Non-Compliance",
    purpose: "CAPA status, root causes, implementation progress, and verification proofs.",
    frequency: "Weekly",
    recordsCount: 9,
    lastGenerated: "24-Mar-2026",
    status: "Available",
    columns: ["CAPA ID", "Associated NC", "Root Cause", "Corrective Action Plan", "Target Date", "Verification"],
    sampleData: [
      { "CAPA ID": "CAPA-INT-01", "Associated NC": "INC-2026-01", "Root Cause": "Emergency procurement SLA lack of alternate approver", "Corrective Action Plan": "Automated delegation forwarder during out-of-office", "Target Date": "20-Apr-2026", "Verification": "In Progress" },
      { "CAPA ID": "CAPA-INT-02", "Associated NC": "INC-2026-02", "Root Cause": "Contractor exit notification manual delay", "Corrective Action Plan": "HRMS-AD API automatic account disabling on contract end", "Target Date": "30-Mar-2026", "Verification": "Verified Effective" },
    ],
  },
  {
    id: "IREP-15",
    code: "ICR-15",
    title: "Overdue Action Report",
    category: "Audits & Non-Compliance",
    purpose: "Escalation register for delayed internal remediation tasks impacting governance.",
    frequency: "Daily",
    recordsCount: 0,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["Action ID", "Requirement", "Accountable Owner", "Due Date", "Days Delayed", "Severity"],
    sampleData: [],
  },
  {
    id: "IREP-16",
    code: "ICR-16",
    title: "Evidence Coverage Report",
    category: "Registers & Policies",
    purpose: "Verification completeness and audit trail readiness of all required internal compliance evidence.",
    frequency: "Monthly",
    recordsCount: 65,
    lastGenerated: "23-Mar-2026",
    status: "Available",
    columns: ["Requirement Ref", "Required Evidence Type", "Available Proofs", "Coverage %", "Storage Checksum"],
    sampleData: [
      { "Requirement Ref": "IC-2026-001 (Procurement)", "Required Evidence Type": "PO Approval Logs & DOA", "Available Proofs": 45, "Coverage %": "100%", "Storage Checksum": "SHA-256 Valid" },
      { "Requirement Ref": "IC-2026-002 (Security)", "Required Evidence Type": "MFA Audit & Phishing Drill", "Available Proofs": 12, "Coverage %": "100%", "Storage Checksum": "SHA-256 Valid" },
      { "Requirement Ref": "IC-2026-003 (Quality)", "Required Evidence Type": "IPQC Test Records", "Available Proofs": 380, "Coverage %": "98.5%", "Storage Checksum": "SHA-256 Valid" },
    ],
  },
  {
    id: "IREP-17",
    code: "ICR-17",
    title: "Compliance Risk Report",
    category: "Intelligence & Risk",
    purpose: "Internal policy and operational risk scores, 5x5 matrix distribution, and exposure estimates.",
    frequency: "Monthly",
    recordsCount: 16,
    lastGenerated: "21-Mar-2026",
    status: "Available",
    columns: ["Risk ID", "Risk Description", "Likelihood", "Impact", "Risk Score", "Mitigating Control"],
    sampleData: [
      { "Risk ID": "IRK-01", "Risk Description": "Unauthorized Procurement Bypass", "Likelihood": 4, "Impact": 4, "Risk Score": 16, "Mitigating Control": "Hard ERP approval gates & DOA checks" },
      { "Risk ID": "IRK-02", "Risk Description": "Segregation of Duties Conflicts in Accounts", "Likelihood": 3, "Impact": 4, "Risk Score": 12, "Mitigating Control": "Automated role conflict scan in ERP" },
      { "Risk ID": "IRK-03", "Risk Description": "Plant SOP Procedural Drift", "Likelihood": 2, "Impact": 4, "Risk Score": 8, "Mitigating Control": "Poka-yoke tooling & digital checklists" },
    ],
  },
  {
    id: "IREP-18",
    code: "ICR-18",
    title: "Management Review Report",
    category: "Governance & SOD",
    purpose: "Executive board review minutes, internal governance status, and quarterly decisions.",
    frequency: "Quarterly",
    recordsCount: 4,
    lastGenerated: "15-Mar-2026",
    status: "Available",
    columns: ["Meeting ID", "Review Date", "Chairperson", "Key Agenda Items", "Decisions Adopted", "Status"],
    sampleData: [
      { "Meeting ID": "MR-2026-Q1", "Review Date": "15-Mar-2026", "Chairperson": "Managing Director", "Key Agenda Items": "DOA Thresholds, QMS Audit, SOD Matrix", "Decisions Adopted": "Approved v2.0 Procurement threshold limits", "Status": "Signed Off" },
      { "Meeting ID": "MR-2025-Q4", "Review Date": "10-Dec-2025", "Chairperson": "CEO / Risk Committee", "Key Agenda Items": "Year-end Internal Controls Assessment", "Decisions Adopted": "Mandated MFA for 100% of employees", "Status": "Implemented" },
    ],
  },
  {
    id: "IREP-19",
    code: "ICR-19",
    title: "AI Compliance Intelligence Report",
    category: "Intelligence & Risk",
    purpose: "AI-driven anomaly detection in approval sequences, SOD conflicts, and policy deviation forecasting.",
    frequency: "Weekly",
    recordsCount: 8,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["AI Insight ID", "Detected Anomaly / Pattern", "Confidence", "Underlying Control", "Recommended Action"],
    sampleData: [
      { "AI Insight ID": "AI-IC-01", "Detected Anomaly / Pattern": "Spike in off-hours purchase orders split below ₹5,00,000 threshold", "Confidence": "96.4%", "Underlying Control": "DOA PO Splitting Rule", "Recommended Action": "Trigger automated forensic audit of supplier batch 401" },
      { "AI Insight ID": "AI-IC-02", "Detected Anomaly / Pattern": "Repeated password reset requests from single IP subnet in Bangalore office", "Confidence": "98.9%", "Underlying Control": "Access Control Policy", "Recommended Action": "Temporary IP block and enforce secondary biometric verification" },
      { "AI Insight ID": "AI-IC-03", "Detected Anomaly / Pattern": "Training completion drop in manufacturing shift B ahead of audit", "Confidence": "91.2%", "Underlying Control": "Safety SOP Training", "Recommended Action": "Schedule plant-floor micro-learning session before Friday" },
    ],
  },
];

// -------------------------------------------------------------------------
// 5. INTERNAL COMPLIANCE KPI MASTER (SECTION 39 IN USER SPEC)
// -------------------------------------------------------------------------
export interface InternalKPICategory {
  category: string;
  metrics: {
    label: string;
    value: string | number;
    sublabel?: string;
    status: "optimal" | "warning" | "critical" | "neutral";
  }[];
}

export const INTERNAL_KPI_MASTER: InternalKPICategory[] = [
  {
    category: "Compliance",
    metrics: [
      { label: "Overall Internal Compliance Rate", value: "93.5%", sublabel: "+2.1% this quarter", status: "optimal" },
      { label: "Applicable Requirements", value: 164, sublabel: "Policies, SOPs, Controls", status: "neutral" },
      { label: "Compliant Requirements", value: 151, sublabel: "Fully verified controls", status: "optimal" },
      { label: "Partially Compliant", value: 10, sublabel: "Remediation underway", status: "warning" },
      { label: "Non-Compliant", value: 3, sublabel: "Priority actions open", status: "critical" },
      { label: "Overdue Requirements", value: 2, sublabel: "Review overdue", status: "critical" },
    ],
  },
  {
    category: "Controls",
    metrics: [
      { label: "Total Controls", value: 78, sublabel: "Preventive, Detective, Auto", status: "neutral" },
      { label: "Effective Controls", value: 71, sublabel: "91% operating effectively", status: "optimal" },
      { label: "Partially Effective Controls", value: 5, sublabel: "Manual dependency", status: "warning" },
      { label: "Ineffective Controls", value: 2, sublabel: "Control redesign underway", status: "critical" },
      { label: "Control Testing Completion", value: "96.0%", sublabel: "Q1 testing complete", status: "optimal" },
    ],
  },
  {
    category: "Governance",
    metrics: [
      { label: "Policy Review Completion", value: "94.0%", sublabel: "All active policies", status: "optimal" },
      { label: "SOP Review Completion", value: "92.0%", sublabel: "Plant & office SOPs", status: "optimal" },
      { label: "Approval Compliance", value: "99.1%", sublabel: "DOA adherence rate", status: "optimal" },
      { label: "Delegation Compliance", value: "98.4%", sublabel: "Acting approvals valid", status: "optimal" },
      { label: "SOD Compliance", value: "99.5%", sublabel: "Zero unmitigated conflicts", status: "optimal" },
    ],
  },
  {
    category: "People",
    metrics: [
      { label: "Training Completion", value: "95.2%", sublabel: "Mandatory modules", status: "optimal" },
      { label: "Policy Acknowledgement", value: "97.8%", sublabel: "Signed digitally", status: "optimal" },
      { label: "Employee Compliance Rate", value: "98.0%", sublabel: "All operating units", status: "optimal" },
      { label: "Competency Compliance", value: "96.0%", sublabel: "Role qualification matrix", status: "optimal" },
    ],
  },
  {
    category: "Audit & CAPA",
    metrics: [
      { label: "Audits Completed", value: 12, sublabel: "Process & IT audits", status: "optimal" },
      { label: "Open Findings", value: 6, sublabel: "Minor & major", status: "warning" },
      { label: "Critical Findings", value: 0, sublabel: "Zero critical breach", status: "optimal" },
      { label: "Finding Closure Rate", value: "90.0%", sublabel: "Within 30 days SLA", status: "optimal" },
      { label: "Repeat Findings", value: 0, sublabel: "Zero recurrence", status: "optimal" },
    ],
  },
  {
    category: "Evidence Management",
    metrics: [
      { label: "Evidence Coverage", value: "97.0%", sublabel: "Digital audit vault", status: "optimal" },
      { label: "Missing Evidence", value: 2, sublabel: "Pending sign-off", status: "warning" },
      { label: "Expired Evidence", value: 1, sublabel: "Old training log", status: "warning" },
      { label: "Evidence Verification Rate", value: "98.5%", sublabel: "Auditor authenticated", status: "optimal" },
    ],
  },
];

// -------------------------------------------------------------------------
// 6. SOD MATRIX TABLE (SECTION 9 IN USER SPEC)
// -------------------------------------------------------------------------
export const SOD_MATRIX_DATA: SODMatrixRow[] = [
  { activity: "Procurement / Purchase Request", request: true, approve: false, execute: true, verify: false, pay: false },
  { activity: "PO Approval & Vendor Award", request: false, approve: true, execute: false, verify: true, pay: false },
  { activity: "Material Receipt (GRN)", request: false, approve: false, execute: true, verify: true, pay: false },
  { activity: "Invoice Verification (3-Way Match)", request: false, approve: false, execute: false, verify: true, pay: false },
  { activity: "Payment Authorization & Release", request: false, approve: true, execute: false, verify: false, pay: true },
  { activity: "General Ledger & Reconciliations", request: false, approve: false, execute: false, verify: true, pay: false },
];

// -------------------------------------------------------------------------
// SERVICE CLASS
// -------------------------------------------------------------------------
class InternalComplianceService {
  private records: InternalComplianceRecord[] = [...FULL_INTERNAL_COMPLIANCE_RECORDS];

  public getPrimaryRecord(): InternalComplianceRecord {
    return this.records[0] || PRIMARY_INTERNAL_RECORD;
  }

  public getAllRecords(): InternalComplianceRecord[] {
    return [...this.records];
  }

  public getRecordById(id: string): InternalComplianceRecord | undefined {
    return this.records.find((r) => r.id === id);
  }

  public saveRecord(record: InternalComplianceRecord): void {
    const idx = this.records.findIndex((r) => r.id === record.id);
    if (idx >= 0) {
      this.records[idx] = record;
    } else {
      this.records.unshift(record);
    }
  }

  public getExecutiveKPIs(): InternalExecutiveKPISummary {
    return { ...INTERNAL_EXECUTIVE_KPIS };
  }

  public getReports(): InternalReportDefinition[] {
    return [...INTERNAL_REPORT_DEFINITIONS];
  }

  public getKPIMaster(): InternalKPICategory[] {
    return [...INTERNAL_KPI_MASTER];
  }

  public getSODMatrix(): SODMatrixRow[] {
    return [...SOD_MATRIX_DATA];
  }
}

export const internalComplianceService = new InternalComplianceService();

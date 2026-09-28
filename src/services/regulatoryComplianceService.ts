// Magnertia ERP - Regulatory Compliance Service
// Management -> Risk Management -> Regulatory Compliance
// Regulatory Compliance Form — MAICW Classification & Regulatory Intelligence Master

export type MAICWType = "M" | "A" | "I" | "C" | "W";

export interface MAICWFieldDef {
  field: string;
  type: string;
  maicw: MAICWType;
  description: string;
}

export type ComplianceType =
  | "Regulatory"
  | "Statutory"
  | "License"
  | "Permit"
  | "Certification";

export type CompliancePriority = "Critical" | "High" | "Medium" | "Low";

export type ComplianceWorkflowStatus =
  | "Draft"
  | "Active"
  | "Due"
  | "Overdue"
  | "Closed"
  | "Under Review";

export type ApplicabilityResult =
  | "Applicable"
  | "Conditionally Applicable"
  | "Not Applicable"
  | "Under Assessment"
  | "Requires Legal Review";

export interface ComplianceControlItem {
  id: string;
  name: string;
  type: "Preventive" | "Detective" | "Corrective" | "Automated" | "Manual" | "Management" | "Technical";
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annual" | "Continuous";
  owner: string;
  status: "Effective" | "Partially Effective" | "Ineffective" | "Pending Review";
}

export interface ComplianceEvidenceItem {
  id: string;
  name: string;
  type: string;
  date: string;
  expiryDate: string;
  issuer?: string;
  version?: string;
  status: "Verified" | "Pending" | "Expired" | "Rejected";
  storageLocation?: string;
}

export interface RegulatoryChangeItem {
  id: string;
  date: string;
  regulation: string;
  change: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  status: "Under Review" | "Assessed" | "Closed" | "Action Pending";
  owner?: string;
  gap?: string;
}

export interface UpcomingCalendarItem {
  id: string;
  date: string;
  title: string;
  category: string;
  dueDays: number;
  dueBadge: string;
  severity: "critical" | "warning" | "normal";
}

export interface RelatedRecordsSummary {
  linkedRisksCount: number;
  auditInspectionCount: number;
  correctiveActionsCount: number;
  licensesPermitsCount: number;
  correspondenceCount: number;
  documentAttachmentsCount: number;
}

export interface RegulatoryComplianceRecord {
  // 1. Form Information (MAICW)
  id: string; // Auto Number (A)
  complianceCode: string; // Text (A)
  complianceName: string; // Text (M)
  complianceType: ComplianceType; // Dropdown (M)
  regulatoryDomain: string; // Dropdown (M)
  regulation: string; // Lookup (M)
  regulatoryAuthority: string; // Lookup (M)
  businessFunction: string; // Lookup (M)
  department: string; // Lookup (M)
  process: string; // Lookup (M)
  complianceOwner: string; // Lookup (M)
  complianceOwnerAvatar: string;
  complianceCoordinator: string; // Lookup (M)
  complianceCoordinatorAvatar: string;
  effectiveDate: string; // Date (M)
  reviewDate: string; // Date (M)
  dueDate: string; // Date (M)
  status: ComplianceWorkflowStatus; // Workflow (W)
  priority: CompliancePriority; // Dropdown (M)
  version: string; // Number (A)
  confidentiality: "Internal" | "Confidential" | "Restricted"; // Dropdown (C)

  // 2. Regulatory Compliance Overview
  regulatoryRequirement: string;
  businessActivity: string;
  applicability: ApplicabilityResult;
  currentStatus: "Compliant" | "Partially Compliant" | "Non-Compliant" | "Under Assessment";
  complianceStatement: string;

  // Timeline & Progress
  timelineStage: "Identify" | "Assess" | "Implement" | "Monitor" | "File" | "Close";
  timelineProgressPercent: number;
  timelineStatusText: string;
  nextFilingCountdownDays: number;

  // Key Dates
  lastFilingDate: string;
  nextFilingDate: string;

  // 3. Compliance Obligation
  obligationType: string;
  obligationFrequency: "Monthly" | "Quarterly" | "Annual" | "One-time" | "Bi-Annual";
  nextDueDate: string;
  lastCompletedDate: string;
  renewalDate: string;
  obligationStatus: "On Track" | "Due Soon" | "Overdue" | "Pending Verification";

  // 4. Compliance Controls
  controls: ComplianceControlItem[];

  // 5. Compliance Evidence
  evidence: ComplianceEvidenceItem[];

  // 6. Compliance Risk
  riskRating: "Critical" | "High" | "Medium" | "Low";
  likelihood: number; // 1-5
  impact: number; // 1-5
  riskScore: number; // Likelihood * Impact
  keyRisk: string;
  mitigation: string;

  // 7. Recent Regulatory Changes
  recentChanges: RegulatoryChangeItem[];

  // 8. Upcoming Compliance Calendar
  calendarItems: UpcomingCalendarItem[];

  // 9. Related Records
  relatedRecords: RelatedRecordsSummary;
}

// -------------------------------------------------------------------------
// 1. PRIMARY ACTIVE RECORD - EXACT 1:1 TO USER SCREENSHOT
// -------------------------------------------------------------------------
export const PRIMARY_REGULATORY_RECORD: RegulatoryComplianceRecord = {
  // Form Information
  id: "RC-2026-001",
  complianceCode: "COMP-001",
  complianceName: "GST Return Filing",
  complianceType: "Regulatory",
  regulatoryDomain: "Taxation",
  regulation: "Goods and Services Tax Act, 2017",
  regulatoryAuthority: "Central Board of Indirect Taxes and Customs (CBIC)",
  businessFunction: "Finance",
  department: "Finance & Accounts",
  process: "Tax Filing",
  complianceOwner: "Ramesh S",
  complianceOwnerAvatar: "RS",
  complianceCoordinator: "Priya Sharma",
  complianceCoordinatorAvatar: "PS",
  effectiveDate: "01-Jan-2026",
  reviewDate: "01-Jan-2027",
  dueDate: "20-Apr-2026",
  status: "Active",
  priority: "Critical",
  version: "1.0",
  confidentiality: "Internal",

  // Overview
  regulatoryRequirement:
    "File monthly GST returns (GSTR-1, GSTR-3B) within the prescribed due dates as per the Goods and Services Tax Act, 2017.",
  businessActivity: "Supply of goods and services",
  applicability: "Applicable",
  currentStatus: "Compliant",
  complianceStatement:
    "Magnertia shall identify applicable regulatory requirements, assign accountable owners, implement appropriate controls, maintain evidence, complete required submissions, monitor changes, and retain auditable records demonstrating compliance.",

  // Timeline
  timelineStage: "Monitor",
  timelineProgressPercent: 68,
  timelineStatusText: "Next filing due in 12 days (20-Apr-2026)",
  nextFilingCountdownDays: 12,

  // Key Dates
  lastFilingDate: "20-Mar-2026",
  nextFilingDate: "20-Apr-2026",

  // 3. Compliance Obligation
  obligationType: "Filing",
  obligationFrequency: "Monthly",
  nextDueDate: "20-Apr-2026",
  lastCompletedDate: "20-Mar-2026",
  renewalDate: "-",
  obligationStatus: "On Track",

  // 4. Compliance Controls
  controls: [
    {
      id: "C-001",
      name: "Data validation before filing",
      type: "Preventive",
      frequency: "Monthly",
      owner: "Ramesh S",
      status: "Effective",
    },
    {
      id: "C-002",
      name: "Management review",
      type: "Detective",
      frequency: "Monthly",
      owner: "Priya Sharma",
      status: "Effective",
    },
    {
      id: "C-003",
      name: "System reconciliation",
      type: "Automated",
      frequency: "Monthly",
      owner: "IT Team",
      status: "Effective",
    },
    {
      id: "C-004",
      name: "Document retention",
      type: "Manual",
      frequency: "Monthly",
      owner: "Finance Team",
      status: "Effective",
    },
  ],

  // 5. Compliance Evidence
  evidence: [
    {
      id: "GSTR-3B Mar 2026",
      name: "GSTR-3B Mar 2026",
      type: "Filing Acknowledgement",
      date: "20-Mar-2026",
      expiryDate: "-",
      issuer: "GSTN Portal",
      version: "v1.0",
      status: "Verified",
      storageLocation: "ERP Document Vault / Tax / 2026 / Q1",
    },
    {
      id: "Payment Receipt",
      name: "Payment Receipt",
      type: "Payment Proof",
      date: "20-Mar-2026",
      expiryDate: "-",
      issuer: "RBI / Authorized Bank",
      version: "v1.0",
      status: "Verified",
      storageLocation: "ERP Document Vault / Tax / Challans",
    },
    {
      id: "Reconciliation Report",
      name: "Reconciliation Report",
      type: "Internal Report",
      date: "20-Mar-2026",
      expiryDate: "-",
      issuer: "Finance Automation Engine",
      version: "v2.1",
      status: "Verified",
      storageLocation: "ERP Financial Analytics Archive",
    },
  ],

  // 6. Compliance Risk
  riskRating: "High",
  likelihood: 4,
  impact: 4,
  riskScore: 16,
  keyRisk: "Penalty for late filing and interest liability.",
  mitigation: "Automated reminders, management review, and timely filing.",

  // 7. Recent Regulatory Changes
  recentChanges: [
    {
      id: "CHG-2026-001",
      date: "10-Jan-2026",
      regulation: "GST Act",
      change: "Amendment in input tax credit rules",
      impact: "High",
      status: "Under Review",
      owner: "Tax Counsel",
    },
    {
      id: "CHG-2025-089",
      date: "15-Dec-2025",
      regulation: "Income Tax Act",
      change: "Updated reporting requirements",
      impact: "Medium",
      status: "Assessed",
      owner: "Finance Controller",
    },
    {
      id: "CHG-2025-072",
      date: "01-Nov-2025",
      regulation: "Companies Act",
      change: "New disclosure requirement",
      impact: "Medium",
      status: "Closed",
      owner: "Company Secretary",
    },
  ],

  // 8. Upcoming Compliance Calendar
  calendarItems: [
    {
      id: "CAL-01",
      date: "20-Apr-2026",
      title: "GSTR-3B Filing (Mar 2026)",
      category: "Tax Filing",
      dueDays: 12,
      dueBadge: "Due in 12 days",
      severity: "critical",
    },
    {
      id: "CAL-02",
      date: "25-Apr-2026",
      title: "TDS Return Filing (Q4)",
      category: "Tax Filing",
      dueDays: 17,
      dueBadge: "Due in 17 days",
      severity: "critical",
    },
    {
      id: "CAL-03",
      date: "30-Apr-2026",
      title: "Professional Tax Payment",
      category: "State Statutory",
      dueDays: 22,
      dueBadge: "Due in 22 days",
      severity: "warning",
    },
    {
      id: "CAL-04",
      date: "15-May-2026",
      title: "Labour Return Filing",
      category: "Labour & Employment",
      dueDays: 37,
      dueBadge: "Due in 37 days",
      severity: "warning",
    },
  ],

  // 9. Related Records
  relatedRecords: {
    linkedRisksCount: 2,
    auditInspectionCount: 1,
    correctiveActionsCount: 4,
    licensesPermitsCount: 1,
    correspondenceCount: 3,
    documentAttachmentsCount: 5,
  },
};

// -------------------------------------------------------------------------
// 2. ADDITIONAL CONTROLLED RECORDS FOR SWITCHING & DATA TESTING
// -------------------------------------------------------------------------
export const FULL_COMPLIANCE_RECORDS: RegulatoryComplianceRecord[] = [
  PRIMARY_REGULATORY_RECORD,
  {
    id: "RC-2026-002",
    complianceCode: "COMP-002",
    complianceName: "Factory License & Annual Safety Clearance",
    complianceType: "License",
    regulatoryDomain: "Labour & Employment",
    regulation: "Factories Act, 1948 & State Factory Rules",
    regulatoryAuthority: "Directorate of Industrial Safety & Health (DISH)",
    businessFunction: "Manufacturing",
    department: "Plant Operations & EHS",
    process: "Plant Safety Management",
    complianceOwner: "Suresh Patil",
    complianceOwnerAvatar: "SP",
    complianceCoordinator: "Kavita Rao",
    complianceCoordinatorAvatar: "KR",
    effectiveDate: "01-Apr-2025",
    reviewDate: "01-Mar-2026",
    dueDate: "31-Mar-2026",
    status: "Due",
    priority: "Critical",
    version: "2.0",
    confidentiality: "Internal",
    regulatoryRequirement:
      "Maintain active factory manufacturing license, annual inspection compliance, machinery stability certification, and submit annual returns.",
    businessActivity: "Electric vehicle and electronics equipment manufacturing",
    applicability: "Applicable",
    currentStatus: "Partially Compliant",
    complianceStatement:
      "Magnertia ensures all industrial manufacturing plants operate strictly within licensed occupant capacities, environmental safety limits, and worker welfare statutory requirements.",
    timelineStage: "Assess",
    timelineProgressPercent: 50,
    timelineStatusText: "Renewal application submitted, awaiting inspector verification",
    nextFilingCountdownDays: 6,
    lastFilingDate: "15-Feb-2025",
    nextFilingDate: "31-Mar-2026",
    obligationType: "License",
    obligationFrequency: "Annual",
    nextDueDate: "31-Mar-2026",
    lastCompletedDate: "15-Feb-2025",
    renewalDate: "31-Mar-2026",
    obligationStatus: "Due Soon",
    controls: [
      {
        id: "C-010",
        name: "Quarterly safety audits",
        type: "Detective",
        frequency: "Quarterly",
        owner: "Suresh Patil",
        status: "Effective",
      },
      {
        id: "C-011",
        name: "Pressure vessel stability checks",
        type: "Preventive",
        frequency: "Annual",
        owner: "Chief Engineer",
        status: "Effective",
      },
    ],
    evidence: [
      {
        id: "EVD-044",
        name: "DISH Form 2 Renewal Filing",
        type: "License Application",
        date: "12-Feb-2026",
        expiryDate: "31-Mar-2027",
        status: "Verified",
      },
    ],
    riskRating: "Critical",
    likelihood: 3,
    impact: 5,
    riskScore: 15,
    keyRisk: "Plant operational suspension or penalty for delayed factory license renewal.",
    mitigation: "Fast-track legal review, dedicated liaison officer, automated inspection follow-ups.",
    recentChanges: [
      {
        id: "CHG-2026-004",
        date: "05-Feb-2026",
        regulation: "State Factory Rules",
        change: "Mandatory digital registration of hazardous operations",
        impact: "High",
        status: "Under Review",
      },
    ],
    calendarItems: [
      {
        id: "CAL-05",
        date: "31-Mar-2026",
        title: "Factory License Renewal Final Submission",
        category: "Factory Compliance",
        dueDays: 6,
        dueBadge: "Due in 6 days",
        severity: "critical",
      },
    ],
    relatedRecords: {
      linkedRisksCount: 3,
      auditInspectionCount: 2,
      correctiveActionsCount: 2,
      licensesPermitsCount: 2,
      correspondenceCount: 4,
      documentAttachmentsCount: 8,
    },
  },
  {
    id: "RC-2026-003",
    complianceCode: "COMP-003",
    complianceName: "BIS & ARAI Certification for EVSE Type 2 Chargers",
    complianceType: "Certification",
    regulatoryDomain: "EV / Automotive Regulations",
    regulation: "AIS 138 Part 1 & IS 17017 (Part 1, 21, 22)",
    regulatoryAuthority: "Bureau of Indian Standards & ARAI",
    businessFunction: "Product Development",
    department: "R&D & Quality Assurance",
    process: "Product Certification & Market Release",
    complianceOwner: "Dr. Vikram Seth",
    complianceOwnerAvatar: "VS",
    complianceCoordinator: "Ananya Nair",
    complianceCoordinatorAvatar: "AN",
    effectiveDate: "15-Oct-2025",
    reviewDate: "15-Oct-2026",
    dueDate: "14-Oct-2027",
    status: "Active",
    priority: "High",
    version: "3.2",
    confidentiality: "Restricted",
    regulatoryRequirement:
      "All commercial EV charging stations must undergo full type testing, EMC/EMI validation, and obtain BIS / ARAI standard mark before public dispatch.",
    businessActivity: "Commercial EV Charging Station design, assembly, and deployment",
    applicability: "Applicable",
    currentStatus: "Compliant",
    complianceStatement:
      "Magnertia verifies 100% compliance with AIS/IS electrical safety, thermal stability, and wireless communication standards prior to commercial product rollout.",
    timelineStage: "Monitor",
    timelineProgressPercent: 85,
    timelineStatusText: "Product batch certified; quarterly surveillance test in progress",
    nextFilingCountdownDays: 145,
    lastFilingDate: "10-Oct-2025",
    nextFilingDate: "15-Oct-2026",
    obligationType: "Certification",
    obligationFrequency: "Annual",
    nextDueDate: "15-Oct-2026",
    lastCompletedDate: "10-Oct-2025",
    renewalDate: "14-Oct-2027",
    obligationStatus: "On Track",
    controls: [
      {
        id: "C-021",
        name: "End-of-line high-voltage insulation test",
        type: "Automated",
        frequency: "Continuous",
        owner: "QA Production Line",
        status: "Effective",
      },
      {
        id: "C-022",
        name: "Independent laboratory validation",
        type: "Preventive",
        frequency: "Annual",
        owner: "Dr. Vikram Seth",
        status: "Effective",
      },
    ],
    evidence: [
      {
        id: "EVD-089",
        name: "ARAI Type Approval Certificate No. ARAI/EVSE/2025/901",
        type: "Test Certificate",
        date: "14-Oct-2025",
        expiryDate: "14-Oct-2028",
        status: "Verified",
      },
    ],
    riskRating: "Medium",
    likelihood: 2,
    impact: 4,
    riskScore: 8,
    keyRisk: "Product stop-ship order or standard non-conformance recall.",
    mitigation: "Rigorous NABL laboratory pre-testing and multi-stage batch sign-offs.",
    recentChanges: [
      {
        id: "CHG-2026-009",
        date: "12-Jan-2026",
        regulation: "IS 17017 Revision 2",
        change: "Updated insulation resistance threshold for public outdoor chargers",
        impact: "Medium",
        status: "Assessed",
      },
    ],
    calendarItems: [
      {
        id: "CAL-08",
        date: "15-Jul-2026",
        title: "BIS Annual Surveillance Audit",
        category: "Product Certification",
        dueDays: 110,
        dueBadge: "Due in 110 days",
        severity: "normal",
      },
    ],
    relatedRecords: {
      linkedRisksCount: 1,
      auditInspectionCount: 2,
      correctiveActionsCount: 1,
      licensesPermitsCount: 3,
      correspondenceCount: 2,
      documentAttachmentsCount: 6,
    },
  },
  {
    id: "RC-2026-004",
    complianceCode: "COMP-004",
    complianceName: "Hazardous & E-Waste Authorisation Management",
    complianceType: "Permit",
    regulatoryDomain: "Environmental Compliance",
    regulation: "E-Waste (Management) Rules, 2022 & Hazardous Waste Rules",
    regulatoryAuthority: "State Pollution Control Board (SPCB) & CPCB",
    businessFunction: "Supply Chain",
    department: "Sustainability & Reverse Logistics",
    process: "Waste Disposal & EPR Target Fulfillment",
    complianceOwner: "Rajesh Kannan",
    complianceOwnerAvatar: "RK",
    complianceCoordinator: "Deepa Verma",
    complianceCoordinatorAvatar: "DV",
    effectiveDate: "01-Jan-2025",
    reviewDate: "01-Nov-2025",
    dueDate: "31-Dec-2027",
    status: "Active",
    priority: "High",
    version: "1.4",
    confidentiality: "Internal",
    regulatoryRequirement:
      "Maintain Extended Producer Responsibility (EPR) authorization, file annual e-waste disposal returns, maintain manifest Form 10, and partner with registered recyclers.",
    businessActivity: "Battery recycling, printed circuit board disposal, electronic scrap management",
    applicability: "Applicable",
    currentStatus: "Compliant",
    complianceStatement:
      "Magnertia enforces 100% cradle-to-grave traceability of all industrial hazardous and electronic waste through licensed environmental partners.",
    timelineStage: "Monitor",
    timelineProgressPercent: 72,
    timelineStatusText: "Q1 EPR targets achieved; monthly manifest reconciliation complete",
    nextFilingCountdownDays: 68,
    lastFilingDate: "30-Jun-2025",
    nextFilingDate: "30-Jun-2026",
    obligationType: "Permit",
    obligationFrequency: "Annual",
    nextDueDate: "30-Jun-2026",
    lastCompletedDate: "30-Jun-2025",
    renewalDate: "31-Dec-2027",
    obligationStatus: "On Track",
    controls: [
      {
        id: "C-031",
        name: "Authorized vendor manifest check",
        type: "Preventive",
        frequency: "Monthly",
        owner: "Rajesh Kannan",
        status: "Effective",
      },
    ],
    evidence: [
      {
        id: "EVD-102",
        name: "CPCB EPR Portal Registration Certificate",
        type: "Permit",
        date: "15-Dec-2024",
        expiryDate: "31-Dec-2027",
        status: "Verified",
      },
    ],
    riskRating: "Medium",
    likelihood: 2,
    impact: 4,
    riskScore: 8,
    keyRisk: "Environmental penalty, revocation of manufacturing permit.",
    mitigation: "Strict digital manifest tracking with geofenced recycling verification.",
    recentChanges: [],
    calendarItems: [
      {
        id: "CAL-09",
        date: "30-Jun-2026",
        title: "CPCB Annual EPR Return Filing",
        category: "Environmental Filing",
        dueDays: 68,
        dueBadge: "Due in 68 days",
        severity: "normal",
      },
    ],
    relatedRecords: {
      linkedRisksCount: 2,
      auditInspectionCount: 1,
      correctiveActionsCount: 1,
      licensesPermitsCount: 1,
      correspondenceCount: 1,
      documentAttachmentsCount: 4,
    },
  },
  {
    id: "RC-2026-005",
    complianceCode: "COMP-005",
    complianceName: "Digital Personal Data Protection Act (DPDP) Compliance",
    complianceType: "Statutory",
    regulatoryDomain: "Data Protection & Privacy",
    regulation: "Digital Personal Data Protection Act, 2023",
    regulatoryAuthority: "Data Protection Board of India (DPBI)",
    businessFunction: "IT & Cybersecurity",
    department: "Information Security & Legal",
    process: "Data Governance & Consent Management",
    complianceOwner: "Sunil Nambiar (DPO)",
    complianceOwnerAvatar: "SN",
    complianceCoordinator: "Meera Sen",
    complianceCoordinatorAvatar: "MS",
    effectiveDate: "01-Nov-2025",
    reviewDate: "01-May-2026",
    dueDate: "01-Nov-2026",
    status: "Active",
    priority: "Critical",
    version: "2.1",
    confidentiality: "Restricted",
    regulatoryRequirement:
      "Maintain lawful consent records, provide bilingual privacy notices, appoint Data Protection Officer, establish data breach notification mechanism within 72 hours, and enforce strict data retention schedules.",
    businessActivity: "Mobile app user telemetry, customer billing, employee biometric records",
    applicability: "Applicable",
    currentStatus: "Compliant",
    complianceStatement:
      "Magnertia respects user privacy as a fundamental right, implementing privacy-by-design and rigorous consent lifecycle management across all digital platforms.",
    timelineStage: "Monitor",
    timelineProgressPercent: 90,
    timelineStatusText: "Consent management engine active across all portals",
    nextFilingCountdownDays: 88,
    lastFilingDate: "15-Dec-2025",
    nextFilingDate: "01-Nov-2026",
    obligationType: "Reporting",
    obligationFrequency: "Annual",
    nextDueDate: "01-Nov-2026",
    lastCompletedDate: "15-Dec-2025",
    renewalDate: "-",
    obligationStatus: "On Track",
    controls: [
      {
        id: "C-051",
        name: "Consent tracking & revocation webhook",
        type: "Automated",
        frequency: "Continuous",
        owner: "Sunil Nambiar",
        status: "Effective",
      },
      {
        id: "C-052",
        name: "Annual Third-party Privacy Audit",
        type: "Detective",
        frequency: "Annual",
        owner: "IT Security",
        status: "Effective",
      },
    ],
    evidence: [
      {
        id: "EVD-201",
        name: "Independent ISMS & DPDP Audit Report 2025",
        type: "Audit Report",
        date: "10-Dec-2025",
        expiryDate: "10-Dec-2026",
        status: "Verified",
      },
    ],
    riskRating: "High",
    likelihood: 3,
    impact: 5,
    riskScore: 15,
    keyRisk: "Statutory fines up to ₹250 Crores for significant personal data breach.",
    mitigation: "Zero-trust architecture, automated pseudonymization, regular penetration testing.",
    recentChanges: [
      {
        id: "CHG-2026-015",
        date: "20-Jan-2026",
        regulation: "DPDP Rules Notification",
        change: "Draft rules on parental consent verification for minors under 18",
        impact: "High",
        status: "Under Review",
      },
    ],
    calendarItems: [
      {
        id: "CAL-11",
        date: "01-Jun-2026",
        title: "Bi-annual Data Protection Impact Assessment (DPIA)",
        category: "Privacy Audit",
        dueDays: 78,
        dueBadge: "Due in 78 days",
        severity: "warning",
      },
    ],
    relatedRecords: {
      linkedRisksCount: 4,
      auditInspectionCount: 1,
      correctiveActionsCount: 2,
      licensesPermitsCount: 1,
      correspondenceCount: 2,
      documentAttachmentsCount: 7,
    },
  },
];

// -------------------------------------------------------------------------
// 3. EXECUTIVE KPI WIDGETS DATA (FOR TOP BANNER & REPORTS)
// -------------------------------------------------------------------------
export interface ExecutiveKPISummary {
  complianceObligations: number;
  complianceObligationsDelta: string;
  overdueItems: number;
  overdueItemsDelta: string;
  dueIn30Days: number;
  dueIn30DaysDelta: string;
  compliant: number;
  compliantDelta: string;
  openActions: number;
  openActionsDelta: string;
  complianceReadiness: number;
  complianceReadinessDelta: string;
}

export const EXECUTIVE_KPIS: ExecutiveKPISummary = {
  complianceObligations: 24,
  complianceObligationsDelta: "+20%",
  overdueItems: 3,
  overdueItemsDelta: "+200%",
  dueIn30Days: 5,
  dueIn30DaysDelta: "+67%",
  compliant: 18,
  compliantDelta: "+12%",
  openActions: 4,
  openActionsDelta: "-33%",
  complianceReadiness: 92,
  complianceReadinessDelta: "+8%",
};

// -------------------------------------------------------------------------
// 4. ALL 24 REPORT DEFINITIONS (SECTION 43 IN USER SPEC)
// -------------------------------------------------------------------------
export interface ReportDefinition {
  id: string;
  code: string;
  title: string;
  category:
    | "Regulatory & Registers"
    | "Licenses & Permits"
    | "Filings & Submissions"
    | "Inspections & CAPA"
    | "Risk & Governance"
    | "Domain Specific";
  purpose: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annual" | "On-Demand";
  recordsCount: number;
  lastGenerated: string;
  status: "Available" | "Scheduled" | "Archived";
  columns: string[];
  sampleData: Record<string, any>[];
}

export const REGULATORY_REPORT_DEFINITIONS: ReportDefinition[] = [
  {
    id: "REP-01",
    code: "RR-01",
    title: "Regulatory Register",
    category: "Regulatory & Registers",
    purpose: "Consolidated master of applicable laws, regulations, and statutory amendments.",
    frequency: "Monthly",
    recordsCount: 42,
    lastGenerated: "20-Mar-2026",
    status: "Available",
    columns: ["Regulation ID", "Regulation Name", "Issuing Authority", "Jurisdiction", "Effective Date", "Status"],
    sampleData: [
      { "Regulation ID": "REG-TAX-01", "Regulation Name": "Goods and Services Tax Act, 2017", "Issuing Authority": "CBIC", "Jurisdiction": "Central", "Effective Date": "01-Jul-2017", "Status": "Active" },
      { "Regulation ID": "REG-LAB-02", "Regulation Name": "Factories Act, 1948", "Issuing Authority": "Ministry of Labour", "Jurisdiction": "Central / State", "Effective Date": "01-Apr-1949", "Status": "Active" },
      { "Regulation ID": "REG-EV-03", "Regulation Name": "IS 17017 EV Charging Standard", "Issuing Authority": "Bureau of Indian Standards", "Jurisdiction": "National", "Effective Date": "15-Aug-2021", "Status": "Active" },
      { "Regulation ID": "REG-ENV-04", "Regulation Name": "E-Waste Management Rules, 2022", "Issuing Authority": "MoEFCC / CPCB", "Jurisdiction": "Central", "Effective Date": "01-Apr-2023", "Status": "Active" },
      { "Regulation ID": "REG-CYB-05", "Regulation Name": "DPDP Act, 2023", "Issuing Authority": "DPBI / MeitY", "Jurisdiction": "Central", "Effective Date": "11-Aug-2023", "Status": "Active" },
    ],
  },
  {
    id: "REP-02",
    code: "RR-02",
    title: "Compliance Register",
    category: "Regulatory & Registers",
    purpose: "Complete operational inventory of compliance obligations, accountable owners, and deadlines.",
    frequency: "Monthly",
    recordsCount: 24,
    lastGenerated: "24-Mar-2026",
    status: "Available",
    columns: ["Compliance ID", "Obligation Name", "Domain", "Accountable Owner", "Due Date", "Current State"],
    sampleData: [
      { "Compliance ID": "RC-2026-001", "Obligation Name": "GST Return Filing (GSTR-3B)", "Domain": "Taxation", "Accountable Owner": "Ramesh S", "Due Date": "20-Apr-2026", "Current State": "Compliant" },
      { "Compliance ID": "RC-2026-002", "Obligation Name": "Factory License Annual Renewal", "Domain": "Labour", "Accountable Owner": "Suresh Patil", "Due Date": "31-Mar-2026", "Current State": "Due Soon" },
      { "Compliance ID": "RC-2026-003", "Obligation Name": "ARAI EVSE Type 2 Certification", "Domain": "Product Safety", "Accountable Owner": "Dr. Vikram Seth", "Due Date": "15-Oct-2026", "Current State": "Compliant" },
      { "Compliance ID": "RC-2026-004", "Obligation Name": "CPCB Hazardous E-Waste Manifest", "Domain": "Environment", "Accountable Owner": "Rajesh Kannan", "Due Date": "30-Jun-2026", "Current State": "Compliant" },
      { "Compliance ID": "RC-2026-005", "Obligation Name": "DPDP Consent Verification Audit", "Domain": "Data Privacy", "Accountable Owner": "Sunil Nambiar", "Due Date": "01-Nov-2026", "Current State": "Compliant" },
    ],
  },
  {
    id: "REP-03",
    code: "RR-03",
    title: "Compliance Dashboard Report",
    category: "Regulatory & Registers",
    purpose: "Executive leadership summary with overall compliance rate, risk exposure, and overdue counts.",
    frequency: "Weekly",
    recordsCount: 1,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["Metric Category", "Target Metric", "Current Achieved", "Status Indicator", "Variance"],
    sampleData: [
      { "Metric Category": "Statutory Obligations", "Target Metric": "100%", "Current Achieved": "92.0%", "Status Indicator": "Acceptable", "Variance": "-8.0%" },
      { "Metric Category": "On-Time Filing Rate", "Target Metric": "98.0%", "Current Achieved": "98.5%", "Status Indicator": "Exceeding", "Variance": "+0.5%" },
      { "Metric Category": "Active Licenses Valid", "Target Metric": "100%", "Current Achieved": "100%", "Status Indicator": "Optimal", "Variance": "0.0%" },
      { "Metric Category": "Audit Finding Closure", "Target Metric": "90.0%", "Current Achieved": "88.5%", "Status Indicator": "Under Target", "Variance": "-1.5%" },
    ],
  },
  {
    id: "REP-04",
    code: "RR-04",
    title: "Compliance Gap Report",
    category: "Regulatory & Registers",
    purpose: "Details of identified statutory, procedural, technical, or documentation gaps.",
    frequency: "Monthly",
    recordsCount: 7,
    lastGenerated: "21-Mar-2026",
    status: "Available",
    columns: ["Gap ID", "Obligation Ref", "Gap Description", "Risk Severity", "Action Plan", "Owner"],
    sampleData: [
      { "Gap ID": "GAP-2026-01", "Obligation Ref": "RC-2026-002", "Gap Description": "Updated digital fire safety NOC pending final signature", "Risk Severity": "High", "Action Plan": "Submit physical inspection sign-off", "Owner": "Suresh Patil" },
      { "Gap ID": "GAP-2026-02", "Obligation Ref": "RC-2026-005", "Gap Description": "Vendor sub-processor data transfer agreement renewal", "Risk Severity": "Medium", "Action Plan": "Execute updated DPA addendum", "Owner": "Meera Sen" },
      { "Gap ID": "GAP-2026-03", "Obligation Ref": "RC-2026-001", "Gap Description": "Vendor reconciliation mismatch in GSTR-2B input credit", "Risk Severity": "High", "Action Plan": "Issue reconciliation letters to tier-1 suppliers", "Owner": "Ramesh S" },
    ],
  },
  {
    id: "REP-05",
    code: "RR-05",
    title: "License Register",
    category: "Licenses & Permits",
    purpose: "Comprehensive register of operational licenses, manufacturing permits, and trade authorizations.",
    frequency: "Quarterly",
    recordsCount: 28,
    lastGenerated: "18-Mar-2026",
    status: "Available",
    columns: ["License ID", "License Type", "License No.", "Issuing Authority", "Expiry Date", "Status"],
    sampleData: [
      { "License ID": "LIC-MFG-001", "License Type": "Factory Manufacturing License", "License No.": "DISH/MH/PUN/89201", "Issuing Authority": "DISH Pune", "Expiry Date": "31-Mar-2026", "Status": "Under Renewal" },
      { "License ID": "LIC-PCB-002", "License Type": "Consent to Operate (CTO - Air/Water)", "License No.": "MPCB/ROT/CTO/2023", "Issuing Authority": "MPCB", "Expiry Date": "31-Dec-2027", "Status": "Active" },
      { "License ID": "LIC-FIR-003", "License Type": "Fire Department Occupancy NOC", "License No.": "PMRDA/FIRE/NOC/441", "Issuing Authority": "PMRDA Fire Service", "Expiry Date": "15-May-2026", "Status": "Active" },
      { "License ID": "LIC-PES-004", "License Type": "PESO High Pressure Compressor License", "License No.": "PESO/WC/2024/771", "Issuing Authority": "PESO Nagpur", "Expiry Date": "30-Sep-2026", "Status": "Active" },
    ],
  },
  {
    id: "REP-06",
    code: "RR-06",
    title: "License Expiry Report",
    category: "Licenses & Permits",
    purpose: "Proactive tracking of upcoming license expiries in 30, 60, and 90 days windows.",
    frequency: "Weekly",
    recordsCount: 4,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["License ID", "License Name", "Authority", "Expiry Date", "Days Remaining", "Alert Stage"],
    sampleData: [
      { "License ID": "LIC-MFG-001", "License Name": "Factory Manufacturing License", "Authority": "DISH Pune", "Expiry Date": "31-Mar-2026", "Days Remaining": 6, "Alert Stage": "7 Days (Critical)" },
      { "License ID": "LIC-FIR-003", "License Name": "Fire Department Occupancy NOC", "Authority": "PMRDA Fire", "Expiry Date": "15-May-2026", "Days Remaining": 51, "Alert Stage": "60 Days" },
      { "License ID": "LIC-BOI-005", "License Name": "Boiler Inspection Certificate", "Authority": "Boiler Directorate", "Expiry Date": "28-May-2026", "Days Remaining": 64, "Alert Stage": "90 Days" },
    ],
  },
  {
    id: "REP-07",
    code: "RR-07",
    title: "Certificate Register",
    category: "Licenses & Permits",
    purpose: "Register of active quality, safety, standard, and management system certifications (ISO, BIS, CE).",
    frequency: "Monthly",
    recordsCount: 16,
    lastGenerated: "19-Mar-2026",
    status: "Available",
    columns: ["Certificate ID", "Standard / Code", "Certifying Body", "Scope", "Expiry Date", "Verification"],
    sampleData: [
      { "Certificate ID": "CERT-ISO-9001", "Standard / Code": "ISO 9001:2015", "Certifying Body": "TÜV SÜD", "Scope": "Design & Assembly of EV Chargers", "Expiry Date": "14-Sep-2027", "Verification": "Verified" },
      { "Certificate ID": "CERT-ISO-14001", "Standard / Code": "ISO 14001:2015", "Certifying Body": "TÜV SÜD", "Scope": "Environmental Management System", "Expiry Date": "14-Sep-2027", "Verification": "Verified" },
      { "Certificate ID": "CERT-ISO-27001", "Standard / Code": "ISO 27001:2022", "Certifying Body": "BSI India", "Scope": "Cloud ERP & IoT Charging Telemetry", "Expiry Date": "10-Nov-2026", "Verification": "Verified" },
      { "Certificate ID": "CERT-ARAI-EVSE", "Standard / Code": "AIS 138 / IS 17017", "Certifying Body": "ARAI Pune", "Scope": "DC Fast Charger & AC Type 2", "Expiry Date": "14-Oct-2028", "Verification": "Verified" },
    ],
  },
  {
    id: "REP-08",
    code: "RR-08",
    title: "Certificate Expiry Report",
    category: "Licenses & Permits",
    purpose: "Certification expiration radar to trigger surveillance audits and laboratory re-testing.",
    frequency: "Monthly",
    recordsCount: 3,
    lastGenerated: "22-Mar-2026",
    status: "Available",
    columns: ["Certificate Ref", "Standard", "Body", "Valid Until", "Surveillance Due", "Status"],
    sampleData: [
      { "Certificate Ref": "CERT-ISO-27001", "Standard": "ISO/IEC 27001:2022", "Body": "BSI", "Valid Until": "10-Nov-2026", "Surveillance Due": "10-Jun-2026", "Status": "Upcoming Surveillance" },
      { "Certificate Ref": "CERT-CE-WPT", "Standard": "EN 61980 Wireless Power", "Body": "UL International", "Valid Until": "18-Aug-2026", "Surveillance Due": "01-Jul-2026", "Status": "Renewal Planned" },
    ],
  },
  {
    id: "REP-09",
    code: "RR-09",
    title: "Regulatory Filing Report",
    category: "Filings & Submissions",
    purpose: "Monthly, quarterly, and statutory filing submission statuses with acknowledgement references.",
    frequency: "Weekly",
    recordsCount: 52,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["Filing ID", "Regulation", "Filing Type", "Tax Period", "Submission Date", "Acknowledgement No.", "Filing Status"],
    sampleData: [
      { "Filing ID": "FIL-GST-2026-03", "Regulation": "GST Act", "Filing Type": "GSTR-3B", "Tax Period": "Feb 2026", "Submission Date": "20-Mar-2026", "Acknowledgement No.": "AA270326098124Z", "Filing Status": "Acknowledged" },
      { "Filing ID": "FIL-GST-2026-02", "Regulation": "GST Act", "Filing Type": "GSTR-1", "Tax Period": "Feb 2026", "Submission Date": "11-Mar-2026", "Acknowledgement No.": "AA270326081290Y", "Filing Status": "Acknowledged" },
      { "Filing ID": "FIL-EPF-2026-02", "Regulation": "EPF & MP Act", "Filing Type": "Monthly ECR", "Tax Period": "Feb 2026", "Submission Date": "14-Mar-2026", "Acknowledgement No.": "ECR109823901", "Filing Status": "Submitted" },
      { "Filing ID": "FIL-TDS-2025-Q3", "Regulation": "Income Tax Act", "Filing Type": "Form 26Q", "Tax Period": "Q3 FY25-26", "Submission Date": "28-Jan-2026", "Acknowledgement No.": "TDS889102930", "Filing Status": "Acknowledged" },
    ],
  },
  {
    id: "REP-10",
    code: "RR-10",
    title: "Overdue Filing Report",
    category: "Filings & Submissions",
    purpose: "Immediate escalation report for delayed or rejected regulatory submissions incurring penalties.",
    frequency: "Daily",
    recordsCount: 1,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["Filing ID", "Regulation", "Authority", "Prescribed Due", "Days Overdue", "Estimated Penalty", "Owner"],
    sampleData: [
      { "Filing ID": "FIL-LAB-ANN-25", "Regulation": "Interstate Migrant Workmen Act", "Authority": "Labour Commissioner", "Prescribed Due": "15-Feb-2026", "Days Overdue": "38 Days", "Estimated Penalty": "₹25,000", "Owner": "Contractor HR Lead" },
    ],
  },
  {
    id: "REP-11",
    code: "RR-11",
    title: "Regulatory Audit Report",
    category: "Inspections & CAPA",
    purpose: "Audit findings, observation logs, and compliance scorecards across all business units.",
    frequency: "Quarterly",
    recordsCount: 8,
    lastGenerated: "15-Mar-2026",
    status: "Available",
    columns: ["Audit ID", "Audit Type", "Auditor / Firm", "Audit Scope", "Score %", "Open Findings", "Status"],
    sampleData: [
      { "Audit ID": "AUD-2026-01", "Audit Type": "Statutory Internal Audit", "Auditor / Firm": "Deloitte & Touche", "Audit Scope": "Procurement & Tax Compliance", "Score %": "96.4%", "Open Findings": 2, "Status": "Closed" },
      { "Audit ID": "AUD-2026-02", "Audit Type": "ISMS Surveillance Audit", "Auditor / Firm": "BSI India", "Audit Scope": "Cloud ERP & Access Controls", "Score %": "98.0%", "Open Findings": 1, "Status": "Under CAPA" },
      { "Audit ID": "AUD-2026-03", "Audit Type": "Environmental Compliance Audit", "Auditor / Firm": "EnviroSafe Consultants", "Audit Scope": "Hazardous Waste & Effluent", "Score %": "94.2%", "Open Findings": 3, "Status": "Open" },
    ],
  },
  {
    id: "REP-12",
    code: "RR-12",
    title: "Inspection Report",
    category: "Inspections & CAPA",
    purpose: "Records of official factory, labour, fire, and government authority site visits.",
    frequency: "On-Demand",
    recordsCount: 5,
    lastGenerated: "20-Mar-2026",
    status: "Available",
    columns: ["Inspection ID", "Regulatory Authority", "Inspector Name", "Site Location", "Inspection Date", "Outcome"],
    sampleData: [
      { "Inspection ID": "INSP-2026-01", "Regulatory Authority": "DISH Maharashtra", "Inspector Name": "V. K. Shinde", "Site Location": "Chakan Plant 1", "Inspection Date": "10-Feb-2026", "Outcome": "Minor Observations Noted" },
      { "Inspection ID": "INSP-2026-02", "Regulatory Authority": "PMRDA Fire Department", "Inspector Name": "Fire Marshal Jadhav", "Site Location": "Pune Headquarters", "Inspection Date": "18-Jan-2026", "Outcome": "Satisfactory / NOC Cleared" },
      { "Inspection ID": "INSP-2025-09", "Regulatory Authority": "MPCB Environmental Squad", "Inspector Name": "K. Deshmukh", "Site Location": "Battery Test Facility", "Inspection Date": "14-Dec-2025", "Outcome": "Zero Non-Conformances" },
    ],
  },
  {
    id: "REP-13",
    code: "RR-13",
    title: "Non-Compliance Report",
    category: "Inspections & CAPA",
    purpose: "Documented non-conformances classified as Minor, Major, or Critical with root cause analysis.",
    frequency: "Monthly",
    recordsCount: 4,
    lastGenerated: "23-Mar-2026",
    status: "Available",
    columns: ["NC Ref", "Category", "Regulation Breached", "Containment Action", "Severity", "Resolution Target"],
    sampleData: [
      { "NC Ref": "NC-2026-001", "Category": "Major", "Regulation Breached": "IS 17017 Connector Latch Test", "Containment Action": "Quarantined batch B-8902", "Severity": "High", "Resolution Target": "10-Apr-2026" },
      { "NC Ref": "NC-2026-002", "Category": "Minor", "Regulation Breached": "Factory Act Display of Form 7", "Containment Action": "Erected vernacular notice boards", "Severity": "Low", "Resolution Target": "Completed" },
    ],
  },
  {
    id: "REP-14",
    code: "RR-14",
    title: "Corrective Action Report",
    category: "Inspections & CAPA",
    purpose: "CAPA implementation tracking, verification status, and effectiveness proof.",
    frequency: "Weekly",
    recordsCount: 6,
    lastGenerated: "24-Mar-2026",
    status: "Available",
    columns: ["Action ID", "Associated NC", "Root Cause", "Corrective Action", "Target Date", "Verification"],
    sampleData: [
      { "Action ID": "CAPA-2026-01", "Associated NC": "NC-2026-001", "Root Cause": "Molding tool thermal calibration drift", "Corrective Action": "Tooling recalibration and automated temperature interlock", "Target Date": "08-Apr-2026", "Verification": "In Progress" },
      { "Action ID": "CAPA-2026-02", "Associated NC": "GAP-2026-03", "Root Cause": "Supplier ERP portal sync timeout", "Corrective Action": "Migrated to real-time GSTN e-invoice webhook parser", "Target Date": "30-Mar-2026", "Verification": "Verified Effective" },
    ],
  },
  {
    id: "REP-15",
    code: "RR-15",
    title: "Regulatory Change Report",
    category: "Risk & Governance",
    purpose: "Monitored gazette notifications, ministry circulars, and standard revisions with impact ratings.",
    frequency: "Weekly",
    recordsCount: 14,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["Change ID", "Regulation", "Government Order Ref", "Effective Date", "Impact Area", "Status"],
    sampleData: [
      { "Change ID": "CHG-2026-001", "Regulation": "GST Act", "Government Order Ref": "CBIC Notification 02/2026", "Effective Date": "01-Apr-2026", "Impact Area": "Input Tax Credit Claims", "Status": "Under Review" },
      { "Change ID": "CHG-2026-003", "Regulation": "DPDP Rules", "Government Order Ref": "MeitY Gazette S.O. 412(E)", "Effective Date": "01-Jun-2026", "Impact Area": "Consent Lifecycle & DPIA", "Status": "Action Pending" },
      { "Change ID": "CHG-2026-007", "Regulation": "BIS EVSE Safety", "Government Order Ref": "BIS Gazette Revision 4", "Effective Date": "15-May-2026", "Impact Area": "Thermal Runaway Interlocks", "Status": "Assessed" },
    ],
  },
  {
    id: "REP-16",
    code: "RR-16",
    title: "Compliance Risk Report",
    category: "Risk & Governance",
    purpose: "Likelihood × Impact scores, 5x5 heatmap distribution, and financial exposure estimates.",
    frequency: "Monthly",
    recordsCount: 18,
    lastGenerated: "20-Mar-2026",
    status: "Available",
    columns: ["Risk ID", "Risk Area", "Likelihood", "Impact", "Risk Score", "Mitigation Strategy"],
    sampleData: [
      { "Risk ID": "CR-TAX-01", "Risk Area": "GST Delayed Input Credit Reconciliation", "Likelihood": 4, "Impact": 4, "Risk Score": 16, "Mitigation Strategy": "Automated supplier reconciliations" },
      { "Risk ID": "CR-LAB-02", "Risk Area": "Contractor Statutory Wage Non-Compliance", "Likelihood": 3, "Impact": 4, "Risk Score": 12, "Mitigation Strategy": "Mandatory biometric payroll escrow validation" },
      { "Risk ID": "CR-PRD-03", "Risk Area": "EVSE High-Voltage Certification Lag", "Likelihood": 2, "Impact": 5, "Risk Score": 10, "Mitigation Strategy": "Parallel testing with dual NABL certified labs" },
      { "Risk ID": "CR-CYB-04", "Risk Area": "Telemetry Cloud Data Breach Risk", "Likelihood": 2, "Impact": 5, "Risk Score": 10, "Mitigation Strategy": "End-to-end hardware security module encryption" },
    ],
  },
  {
    id: "REP-17",
    code: "RR-17",
    title: "Evidence Register",
    category: "Risk & Governance",
    purpose: "Audit trail of verified compliance evidence, challans, test reports, and document hashes.",
    frequency: "Monthly",
    recordsCount: 94,
    lastGenerated: "24-Mar-2026",
    status: "Available",
    columns: ["Evidence ID", "Document Title", "Obligation Ref", "Upload Date", "Hash / Signature", "Verification"],
    sampleData: [
      { "Evidence ID": "EVD-GST-0326", "Document Title": "GSTR-3B March 2026 Signed Summary", "Obligation Ref": "RC-2026-001", "Upload Date": "20-Mar-2026", "Hash / Signature": "SHA256:7f9a...3b21", "Verification": "Verified" },
      { "Evidence ID": "EVD-PAY-0326", "Document Title": "RBI Tax Payment Challan CPIN-8910", "Obligation Ref": "RC-2026-001", "Upload Date": "20-Mar-2026", "Hash / Signature": "SHA256:2a1c...991f", "Verification": "Verified" },
      { "Evidence ID": "EVD-ISO-SURV", "Document Title": "TÜV SÜD Stage 2 Surveillance Sign-off", "Obligation Ref": "RC-2026-003", "Upload Date": "14-Jan-2026", "Hash / Signature": "SHA256:bb12...ee88", "Verification": "Verified" },
    ],
  },
  {
    id: "REP-18",
    code: "RR-18",
    title: "Training Compliance Report",
    category: "Risk & Governance",
    purpose: "Completion rates for mandatory compliance courses (Safety, Prevention of Sexual Harassment, DPDP, Cyber).",
    frequency: "Monthly",
    recordsCount: 12,
    lastGenerated: "22-Mar-2026",
    status: "Available",
    columns: ["Course Code", "Course Title", "Mandatory Audience", "Eligible Headcount", "Completion %", "Status"],
    sampleData: [
      { "Course Code": "TRN-POSH-01", "Course Title": "Prevention of Sexual Harassment (PoSH)", "Mandatory Audience": "All Employees", "Eligible Headcount": 840, "Completion %": "98.2%", "Status": "Optimal" },
      { "Course Code": "TRN-DPDP-02", "Course Title": "Data Privacy & DPDP Awareness", "Mandatory Audience": "Engineering & IT", "Eligible Headcount": 320, "Completion %": "94.5%", "Status": "Compliant" },
      { "Course Code": "TRN-EHS-03", "Course Title": "High Voltage EVSE Laboratory Safety", "Mandatory Audience": "Plant & QA Technicians", "Eligible Headcount": 140, "Completion %": "100%", "Status": "Optimal" },
    ],
  },
  {
    id: "REP-19",
    code: "RR-19",
    title: "Product Compliance Report",
    category: "Domain Specific",
    purpose: "Product variant regulatory approval matrix (EVSE, WPT Wireless, Fast Chargers) across jurisdictions.",
    frequency: "Monthly",
    recordsCount: 15,
    lastGenerated: "21-Mar-2026",
    status: "Available",
    columns: ["Product Model", "SKU Ref", "Target Standard", "Type Test Lab", "Approval Status", "Release Readiness"],
    sampleData: [
      { "Product Model": "Magnertia HyperCharge 60kW", "SKU Ref": "EVSE-DC-60K", "Target Standard": "AIS 138 / IS 17017", "Type Test Lab": "ARAI Pune", "Approval Status": "Approved", "Release Readiness": "Market Ready" },
      { "Product Model": "Magnertia Terra AC 22kW", "SKU Ref": "EVSE-AC-22K", "Target Standard": "IS 17017 Part 1 & 21", "Type Test Lab": "ICAT Manesar", "Approval Status": "Approved", "Release Readiness": "Commercial Dispatch" },
      { "Product Model": "Magnertia Wireless Pad 11kW", "SKU Ref": "WPT-PAD-11K", "Target Standard": "SAE J2954 / CISPR 11", "Type Test Lab": "TÜV Rheinland", "Approval Status": "Under Certification", "Release Readiness": "Pilot Only" },
    ],
  },
  {
    id: "REP-20",
    code: "RR-20",
    title: "Environmental Compliance Report",
    category: "Domain Specific",
    purpose: "Pollution control, e-waste, battery waste management, effluent monitoring, and green certifications.",
    frequency: "Monthly",
    recordsCount: 8,
    lastGenerated: "23-Mar-2026",
    status: "Available",
    columns: ["Environmental Stream", "Permit Ref", "Consented Capacity", "Current Month Volume", "Fulfillment %", "Status"],
    sampleData: [
      { "Environmental Stream": "Electronic Scrap (E-Waste)", "Permit Ref": "CPCB/EPR/2025/391", "Consented Capacity": "120 Metric Tons", "Current Month Volume": "8.4 MT", "Fulfillment %": "100%", "Status": "Compliant" },
      { "Environmental Stream": "Lithium Battery End-of-Life", "Permit Ref": "MPCB/BAT/2025/11", "Consented Capacity": "40 Metric Tons", "Current Month Volume": "2.1 MT", "Fulfillment %": "98%", "Status": "Compliant" },
      { "Environmental Stream": "Packaging Recycled Plastic", "Permit Ref": "CPCB/PLASTIC/891", "Consented Capacity": "60 Metric Tons", "Current Month Volume": "5.5 MT", "Fulfillment %": "100%", "Status": "Compliant" },
    ],
  },
  {
    id: "REP-21",
    code: "RR-21",
    title: "Tax Compliance Report",
    category: "Domain Specific",
    purpose: "Direct and indirect tax reconciliation, TDS returns, Advance Tax, and transfer pricing filings.",
    frequency: "Monthly",
    recordsCount: 22,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["Tax Head", "Statute", "Filing Frequency", "Last Filed Period", "Amount Paid", "Status"],
    sampleData: [
      { "Tax Head": "GST Outward Supplies (GSTR-1)", "Statute": "GST Act 2017", "Filing Frequency": "Monthly", "Last Filed Period": "Feb 2026", "Amount Paid": "₹1,42,80,000", "Status": "Compliant" },
      { "Tax Head": "GST Monthly Summary (GSTR-3B)", "Statute": "GST Act 2017", "Filing Frequency": "Monthly", "Last Filed Period": "Feb 2026", "Amount Paid": "₹94,20,000", "Status": "Compliant" },
      { "Tax Head": "TDS Non-Salary Payments (26Q)", "Statute": "Income Tax Act", "Filing Frequency": "Quarterly", "Last Filed Period": "Q3 FY25-26", "Amount Paid": "₹18,50,000", "Status": "Compliant" },
      { "Tax Head": "Corporate Advance Tax Installment", "Statute": "Income Tax Act", "Filing Frequency": "Quarterly", "Last Filed Period": "15-Mar-2026", "Amount Paid": "₹2,10,00,000", "Status": "Compliant" },
    ],
  },
  {
    id: "REP-22",
    code: "RR-22",
    title: "Labour Compliance Report",
    category: "Domain Specific",
    purpose: "Workforce statutory health: PF, ESI, Minimum Wages, Gratuity, Bonus, and contract labour returns.",
    frequency: "Monthly",
    recordsCount: 14,
    lastGenerated: "24-Mar-2026",
    status: "Available",
    columns: ["Statutory Act", "Reporting Requirement", "Covered Employees", "Due Date", "Challan Reference", "Status"],
    sampleData: [
      { "Statutory Act": "Employees' Provident Funds Act", "Reporting Requirement": "Monthly ECR Filing", "Covered Employees": 840, "Due Date": "15-Mar-2026", "Challan Reference": "EPF-TRRN-89210", "Status": "Compliant" },
      { "Statutory Act": "Employees' State Insurance (ESI)", "Reporting Requirement": "Monthly Contribution", "Covered Employees": 310, "Due Date": "15-Mar-2026", "Challan Reference": "ESI-CHL-00912", "Status": "Compliant" },
      { "Statutory Act": "Maharashtra State Professional Tax", "Reporting Requirement": "Monthly Form III-B", "Covered Employees": 840, "Due Date": "31-Mar-2026", "Challan Reference": "PT-PUN-2026-03", "Status": "Due Soon" },
    ],
  },
  {
    id: "REP-23",
    code: "RR-23",
    title: "Cybersecurity Compliance Report",
    category: "Domain Specific",
    purpose: "Cert-In incident disclosures, ISO 27001 ISMS controls, penetration test results, and access reviews.",
    frequency: "Quarterly",
    recordsCount: 9,
    lastGenerated: "22-Mar-2026",
    status: "Available",
    columns: ["Security Domain", "Governing Standard", "Control Reference", "Last Test Date", "Finding Severity", "Status"],
    sampleData: [
      { "Security Domain": "Cloud ERP Access Review", "Governing Standard": "ISO 27001 A.9", "Control Reference": "IAM-MFA-01", "Last Test Date": "01-Mar-2026", "Finding Severity": "None", "Status": "Effective" },
      { "Security Domain": "EV Charger Firmware Signing", "Governing Standard": "OWASP IoT / IS 17017", "Control Reference": "PKI-FW-02", "Last Test Date": "15-Feb-2026", "Finding Severity": "None", "Status": "Effective" },
      { "Security Domain": "CERT-In 6-Hour Reporting Gate", "Governing Standard": "IT Directions 2022", "Control Reference": "SOC-IR-05", "Last Test Date": "20-Jan-2026", "Finding Severity": "Low (Drill)", "Status": "Drill Passed" },
    ],
  },
  {
    id: "REP-24",
    code: "RR-24",
    title: "AI Compliance Intelligence Report",
    category: "Domain Specific",
    purpose: "AI-driven predictive deadline forecasting, anomaly detection, regulatory gap analysis, and sentiment.",
    frequency: "Weekly",
    recordsCount: 6,
    lastGenerated: "25-Mar-2026",
    status: "Available",
    columns: ["AI Insight ID", "Predicted Event / Anomaly", "Confidence", "Regulatory Basis", "Recommended Action"],
    sampleData: [
      { "AI Insight ID": "AI-INS-01", "Predicted Event / Anomaly": "High probability of supplier tax mismatch in Q1 reconciliation", "Confidence": "94.8%", "Regulatory Basis": "GST Rule 36(4)", "Recommended Action": "Trigger automated supplier invoice verification alert" },
      { "AI Insight ID": "AI-INS-02", "Predicted Event / Anomaly": "Factory license renewal lead-time requires immediate physical inspection booking", "Confidence": "99.1%", "Regulatory Basis": "Factories Act Section 6", "Recommended Action": "Schedule DISH inspector visit within 48 hours" },
      { "AI Insight ID": "AI-INS-03", "Predicted Event / Anomaly": "Emerging standard revision detected in draft gazette for EV wireless chargers", "Confidence": "88.5%", "Regulatory Basis": "BIS Technical Committee 69", "Recommended Action": "Conduct engineering design impact study for 11kW coil spacing" },
    ],
  },
];

// -------------------------------------------------------------------------
// 5. REGULATORY COMPLIANCE KPI MASTER (SECTION 44 IN USER SPEC)
// -------------------------------------------------------------------------
export interface KPIMasterCategory {
  category: string;
  metrics: {
    label: string;
    value: string | number;
    sublabel?: string;
    status: "optimal" | "warning" | "critical" | "neutral";
  }[];
}

export const REGULATORY_KPI_MASTER: KPIMasterCategory[] = [
  {
    category: "Compliance",
    metrics: [
      { label: "Overall Compliance Rate", value: "94.2%", sublabel: "+1.8% vs last quarter", status: "optimal" },
      { label: "Applicable Requirements", value: 148, sublabel: "Across 18 domains", status: "neutral" },
      { label: "Compliant Requirements", value: 138, sublabel: "Controls verified", status: "optimal" },
      { label: "Partially Compliant", value: 7, sublabel: "Remediation underway", status: "warning" },
      { label: "Non-Compliant", value: 3, sublabel: "Targeted CAPA open", status: "critical" },
      { label: "Overdue Obligations", value: 3, sublabel: "Escalated to board", status: "critical" },
    ],
  },
  {
    category: "Regulatory",
    metrics: [
      { label: "Active Regulations", value: 42, sublabel: "Monitored continuous", status: "neutral" },
      { label: "New Regulatory Changes", value: 6, sublabel: "In last 60 days", status: "warning" },
      { label: "Changes Assessed", value: 5, sublabel: "83% assessment rate", status: "optimal" },
      { label: "Changes Pending", value: 1, sublabel: "Under legal review", status: "warning" },
      { label: "Impact Assessments Completed", value: 12, sublabel: "Multi-functional", status: "optimal" },
    ],
  },
  {
    category: "Licenses & Permits",
    metrics: [
      { label: "Active Licenses", value: 28, sublabel: "All plants & offices", status: "optimal" },
      { label: "Expiring Licenses (<60d)", value: 2, sublabel: "Renewal lodged", status: "warning" },
      { label: "Expired Licenses", value: 0, sublabel: "Zero non-operational", status: "optimal" },
      { label: "Renewal Completion Rate", value: "100%", sublabel: "On-time tracking", status: "optimal" },
    ],
  },
  {
    category: "Filing & Submissions",
    metrics: [
      { label: "Filings Due Next 30d", value: 14, sublabel: "GST, TDS, Labour", status: "warning" },
      { label: "Filings Completed YTD", value: 52, sublabel: "Full year to date", status: "optimal" },
      { label: "Overdue Filings", value: 1, sublabel: "Labour state form", status: "critical" },
      { label: "On-Time Filing Rate", value: "98.1%", sublabel: "Industry benchmark 95%", status: "optimal" },
    ],
  },
  {
    category: "Audit & Inspections",
    metrics: [
      { label: "Audits Completed", value: 8, sublabel: "Internal & external", status: "optimal" },
      { label: "Open Findings", value: 7, sublabel: "Across all plants", status: "warning" },
      { label: "Critical Findings", value: 1, sublabel: "High voltage testing", status: "critical" },
      { label: "Finding Closure Rate", value: "88.5%", sublabel: "+4.2% improvement", status: "optimal" },
    ],
  },
  {
    category: "Evidence Management",
    metrics: [
      { label: "Evidence Coverage", value: "96.4%", sublabel: "Digital vault integrity", status: "optimal" },
      { label: "Expired Evidence", value: 2, sublabel: "Old test certificates", status: "warning" },
      { label: "Missing Evidence", value: 1, sublabel: "Pending contractor KYC", status: "warning" },
      { label: "Evidence Verification Rate", value: "97.8%", sublabel: "Auditor approved", status: "optimal" },
    ],
  },
  {
    category: "Corrective Action (CAPA)",
    metrics: [
      { label: "Open Actions", value: 4, sublabel: "Active owners assigned", status: "neutral" },
      { label: "Overdue Actions", value: 0, sublabel: "Zero delay tolerance", status: "optimal" },
      { label: "Closure Rate", value: "91.2%", sublabel: "Within 30d SLA", status: "optimal" },
      { label: "Effectiveness Verification", value: "95.0%", sublabel: "Sustained post-audit", status: "optimal" },
    ],
  },
];

// -------------------------------------------------------------------------
// 6. MANAGEMENT REVIEW AGENDA (SECTION 45 IN USER SPEC)
// -------------------------------------------------------------------------
export interface ManagementReviewItem {
  id: number;
  agendaTopic: string;
  status: "Completed" | "In Review" | "Pending Sign-off";
  responsibleFunction: string;
  notes: string;
}

export const MANAGEMENT_REVIEW_AGENDA: ManagementReviewItem[] = [
  { id: 1, agendaTopic: "Regulatory Landscape & New Enactments", status: "Completed", responsibleFunction: "Legal & Compliance", notes: "Reviewed DPDP Act gazetted rules and draft EVSE thermal guidelines." },
  { id: 2, agendaTopic: "Applicable Regulations & Register Health", status: "Completed", responsibleFunction: "Enterprise Risk", notes: "42 active statutes verified; 100% ownership mapped." },
  { id: 3, agendaTopic: "Compliance Obligations & Filing Performance", status: "Completed", responsibleFunction: "Finance & Accounts", notes: "GSTR-3B and TDS submissions on-time; 98.1% on-time filing rate." },
  { id: 4, agendaTopic: "License Status & Upcoming Expiries", status: "In Review", responsibleFunction: "Manufacturing & EHS", notes: "Factory license renewal application in progress with DISH Pune." },
  { id: 5, agendaTopic: "Certification Status (ISO, BIS, ARAI)", status: "Completed", responsibleFunction: "Quality & Testing", notes: "All ISO certificates valid; ARAI EVSE Type 2 cert active." },
  { id: 6, agendaTopic: "Audit & Inspection Findings Review", status: "In Review", responsibleFunction: "Internal Audit", notes: "7 open findings reviewed; high-voltage test CAPA on schedule." },
  { id: 7, agendaTopic: "Non-Compliance & Root Cause Containment", status: "Completed", responsibleFunction: "Operations & QA", notes: "Batch B-8902 containment verified; tooling recalibration complete." },
  { id: 8, agendaTopic: "Compliance Risks & 5x5 Heat Map Review", status: "Completed", responsibleFunction: "Risk Committee", notes: "Overall compliance risk posture remains within corporate tolerance." },
  { id: 9, agendaTopic: "Product & EV Charging Infrastructure Compliance", status: "Completed", responsibleFunction: "Product Engineering", notes: "SAE J2954 wireless power transfer test readiness confirmed." },
  { id: 10, agendaTopic: "Environmental, E-Waste & EPR Targets", status: "Completed", responsibleFunction: "Sustainability", notes: "Q1 e-waste recycling quota fulfilled at 100%." },
  { id: 11, agendaTopic: "Labour & Contractor Statutory Health", status: "In Review", responsibleFunction: "Human Resources", notes: "Biometric attendance integration to contractor wage escrow complete." },
  { id: 12, agendaTopic: "Cybersecurity & DPDP Privacy Controls", status: "Completed", responsibleFunction: "CISO / IT Security", notes: "Bilingual consent banner deployed; zero critical breach incidents." },
  { id: 13, agendaTopic: "AI Compliance Intelligence & Predictive Alerts", status: "Completed", responsibleFunction: "Digital Innovation", notes: "AI detected draft standard amendment in TC 69; early action initiated." },
  { id: 14, agendaTopic: "Compliance Improvement Plan for Next Quarter", status: "Pending Sign-off", responsibleFunction: "Executive Board", notes: "Targeting 98% overall readiness score and zero open critical findings." },
];

// -------------------------------------------------------------------------
// SERVICE HELPER CLASS
// -------------------------------------------------------------------------
class RegulatoryComplianceService {
  private records: RegulatoryComplianceRecord[] = [...FULL_COMPLIANCE_RECORDS];

  public getPrimaryRecord(): RegulatoryComplianceRecord {
    return this.records[0] || PRIMARY_REGULATORY_RECORD;
  }

  public getAllRecords(): RegulatoryComplianceRecord[] {
    return [...this.records];
  }

  public getRecordById(id: string): RegulatoryComplianceRecord | undefined {
    return this.records.find((r) => r.id === id);
  }

  public saveRecord(record: RegulatoryComplianceRecord): void {
    const idx = this.records.findIndex((r) => r.id === record.id);
    if (idx >= 0) {
      this.records[idx] = record;
    } else {
      this.records.unshift(record);
    }
  }

  public getExecutiveKPIs(): ExecutiveKPISummary {
    return { ...EXECUTIVE_KPIS };
  }

  public getReports(): ReportDefinition[] {
    return [...REGULATORY_REPORT_DEFINITIONS];
  }

  public getReportById(id: string): ReportDefinition | undefined {
    return REGULATORY_REPORT_DEFINITIONS.find((r) => r.id === id);
  }

  public getKPIMaster(): KPIMasterCategory[] {
    return [...REGULATORY_KPI_MASTER];
  }

  public getManagementReviewAgenda(): ManagementReviewItem[] {
    return [...MANAGEMENT_REVIEW_AGENDA];
  }
}

export const regulatoryComplianceService = new RegulatoryComplianceService();

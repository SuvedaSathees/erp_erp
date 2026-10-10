// Magnertia ERP - ISO Compliance Service
// Management -> Risk Management -> ISO Compliance
// Standards, Clause Hierarchy, Objectives, Audit Findings, CAPA & Controlled Reports

export interface ISOComplianceRecord {
  complianceId: string;
  complianceCode: string;
  complianceName: string;
  isoStandard: string;
  standardEdition: string;
  isoCategory: "Quality Management" | "Environmental Management" | "Information Security" | "Occupational Health & Safety" | "Energy Management" | "Business Continuity";
  certificationStatus: "Not Certified" | "In Progress" | "Certified";
  complianceStatus: "Compliant" | "Partial Compliance" | "Gap" | "Non-Compliant";
  businessFunction: string;
  department: string;
  process: string;
  complianceOwner: {
    name: string;
    initials: string;
    email: string;
  };
  complianceCoordinator: {
    name: string;
    initials: string;
    email: string;
  };
  certificationBody: string;
  legalEntity: string;
  siteLocation: string;
  effectiveDate: string;
  reviewDate: string;
  auditDate: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  version: string;
  confidentiality: "Internal" | "Confidential" | "Restricted";
  complianceObjective: string;
  scope: string;
  applicableDepartments: string[];
  applicableProducts: string;
  currentComplianceStatus: string;
}

export interface ISOClauseItem {
  clause: string;
  title: string;
  totalReqs: number;
  compliant: number;
  partial: number;
  nonCompliant: number;
  complianceRate: number;
}

export interface ISOAuditFindingItem {
  id: string;
  clause: string;
  finding: string;
  severity: "Major" | "Minor" | "Observation";
  status: "Open" | "In Progress" | "Closed" | "Verified";
}

export interface ISOTimelineMilestone {
  date: string;
  title: string;
  status: "completed" | "current" | "upcoming";
  dotColor: "emerald" | "amber" | "blue";
}

export interface ISOObjectiveKPIItem {
  id: string;
  objective: string;
  kpi: string;
  target: string;
  current: string;
  status: "On Track" | "At Risk" | "Lagging";
}

export interface ISODocumentEvidenceItem {
  id: string;
  documentName: string;
  type: "Manual" | "Process Document" | "Audit Report" | "Record" | "SOP";
  version: string;
  uploadDate: string;
  status: "Approved" | "Uploaded" | "Under Review";
}

export interface ISORiskInfo {
  rating: "Critical" | "High" | "Medium" | "Low";
  likelihood: number;
  impact: number;
  score: number;
  keyRisk: string;
  mitigations: string[];
}

export interface ControlledISOReport {
  id: string;
  code: string;
  title: string;
  category: "Inventory & Standards" | "Clause & Requirements" | "Audit & Findings" | "CAPA & Performance" | "Risk & Certification" | "AI & Governance";
  purpose: string;
  periodicity: "Real-time" | "Monthly" | "Quarterly" | "Annual";
  recordsCount: number;
  lastGenerated: string;
  downloadFormat: "PDF / Excel / CSV";
  status: "Certified" | "Active";
}

export interface ISOKPIMetric {
  id: string;
  domain: "Compliance" | "Audit" | "CAPA" | "Evidence" | "People" | "Objectives" | "Certification";
  metric: string;
  target: string;
  actual: string;
  variance: string;
  trend: "up" | "down" | "neutral";
  status: "Optimal" | "Good" | "Attention" | "Critical";
}

// Primary Record from Screenshot
export const PRIMARY_ISO_RECORD: ISOComplianceRecord = {
  complianceId: "ISO-2026-001",
  complianceCode: "QC-ISO-001",
  complianceName: "ISO 9001:2015 Implementation",
  isoStandard: "ISO 9001:2015",
  standardEdition: "2015",
  isoCategory: "Quality Management",
  certificationStatus: "In Progress",
  complianceStatus: "Partial Compliance",
  businessFunction: "Operations",
  department: "Quality Management",
  process: "All Core Processes",
  complianceOwner: {
    name: "Ramesh S",
    initials: "RS",
    email: "ramesh.s@magnertia.com",
  },
  complianceCoordinator: {
    name: "Priya Sharma",
    initials: "PS",
    email: "priya.sharma@magnertia.com",
  },
  certificationBody: "TÜV SÜD",
  legalEntity: "Magnertia Private Limited",
  siteLocation: "Coimbatore - Development Centre",
  effectiveDate: "01-Jan-2026",
  reviewDate: "01-Jan-2027",
  auditDate: "15-Feb-2027",
  priority: "High",
  version: "1.0",
  confidentiality: "Internal",
  complianceObjective: "Establish and maintain a Quality Management System to enhance customer satisfaction and operational efficiency across all functions.",
  scope: "Design, development, manufacturing and supply of autonomous wireless EV charging stations.",
  applicableDepartments: ["R&D", "Manufacturing", "Quality", "Supply Chain"],
  applicableProducts: "Autonomous Wireless EV Charging Station",
  currentComplianceStatus: "Partial Compliance",
};

// Executive Top KPI Widgets (from Screenshot)
export const ISO_EXECUTIVE_KPIS = [
  {
    id: "total",
    label: "Total Requirements",
    value: 125,
    change: "↑ 12%",
    trend: "up" as const,
    color: "blue",
    subtext: "Mapped across ISO 9001 Clauses 4 to 10",
  },
  {
    id: "compliant",
    label: "Compliant",
    value: 102,
    change: "↑ 8%",
    trend: "up" as const,
    color: "emerald",
    subtext: "Verified with objective evidence (82%)",
  },
  {
    id: "partial",
    label: "Partial Compliance",
    value: 15,
    change: "↑ 50%",
    trend: "up" as const,
    color: "amber",
    subtext: "Under active implementation (12%)",
  },
  {
    id: "non-compliant",
    label: "Non-Compliant",
    value: 8,
    change: "↓ 20%",
    trend: "down" as const,
    color: "red",
    subtext: "Identified gap actions pending (6%)",
  },
  {
    id: "findings",
    label: "Open Findings",
    value: 6,
    change: "↑ 0%",
    trend: "neutral" as const,
    color: "purple",
    subtext: "Audit observations & non-conformities",
  },
  {
    id: "rate",
    label: "Compliance Rate",
    value: "92%",
    change: "↑ 6%",
    trend: "up" as const,
    color: "teal",
    subtext: "Weighted clause conformance index",
  },
];

// Key Dates (Section 4)
export const ISO_KEY_DATES = [
  { label: "Effective Date", date: "01-Jan-2026" },
  { label: "Review Date", date: "01-Jan-2027" },
  { label: "Next Audit", date: "15-Feb-2027" },
  { label: "Certificate Expiry", date: "—" },
  { label: "Surveillance Due", date: "15-Feb-2028" },
];

// Clause Compliance (Section 6)
export const ISO_CLAUSE_COMPLIANCE: ISOClauseItem[] = [
  {
    clause: "4",
    title: "Context of the Organization",
    totalReqs: 8,
    compliant: 7,
    partial: 1,
    nonCompliant: 0,
    complianceRate: 92,
  },
  {
    clause: "5",
    title: "Leadership",
    totalReqs: 10,
    compliant: 8,
    partial: 2,
    nonCompliant: 0,
    complianceRate: 80,
  },
  {
    clause: "6",
    title: "Planning",
    totalReqs: 12,
    compliant: 9,
    partial: 2,
    nonCompliant: 1,
    complianceRate: 75,
  },
  {
    clause: "7",
    title: "Support",
    totalReqs: 18,
    compliant: 14,
    partial: 3,
    nonCompliant: 1,
    complianceRate: 78,
  },
  {
    clause: "8",
    title: "Operation",
    totalReqs: 32,
    compliant: 24,
    partial: 6,
    nonCompliant: 2,
    complianceRate: 75,
  },
  {
    clause: "9",
    title: "Performance Evaluation",
    totalReqs: 20,
    compliant: 16,
    partial: 3,
    nonCompliant: 1,
    complianceRate: 80,
  },
  {
    clause: "10",
    title: "Improvement",
    totalReqs: 25,
    compliant: 24,
    partial: 0,
    nonCompliant: 1,
    complianceRate: 96,
  },
];

// Recent Audit Findings (Section 7)
export const ISO_AUDIT_FINDINGS: ISOAuditFindingItem[] = [
  {
    id: "F-001",
    clause: "8.5",
    finding: "Inadequate supplier evaluation record",
    severity: "Major",
    status: "Open",
  },
  {
    id: "F-002",
    clause: "7.2",
    finding: "Training records incomplete",
    severity: "Minor",
    status: "In Progress",
  },
  {
    id: "F-003",
    clause: "9.1",
    finding: "Management review evidence missing",
    severity: "Minor",
    status: "Open",
  },
  {
    id: "F-004",
    clause: "8.1",
    finding: "Operational control documentation gap",
    severity: "Major",
    status: "In Progress",
  },
  {
    id: "F-005",
    clause: "10.2",
    finding: "Improvement action not effective",
    severity: "Minor",
    status: "Open",
  },
];

// Certification Timeline Milestones (Section 8)
export const ISO_TIMELINE_MILESTONES: ISOTimelineMilestone[] = [
  { date: "01-Jan-2026", title: "Project Initiation", status: "completed", dotColor: "emerald" },
  { date: "15-Mar-2026", title: "Gap Assessment", status: "completed", dotColor: "emerald" },
  { date: "01-Jul-2026", title: "Documentation Complete", status: "current", dotColor: "amber" },
  { date: "15-Oct-2026", title: "Internal Audit", status: "upcoming", dotColor: "amber" },
  { date: "15-Feb-2027", title: "Certification Audit (Stage 1 & 2)", status: "upcoming", dotColor: "amber" },
  { date: "30-Mar-2027", title: "Certification Decision", status: "upcoming", dotColor: "blue" },
  { date: "01-Apr-2027", title: "Certificate Issuance", status: "upcoming", dotColor: "blue" },
  { date: "15-Feb-2028", title: "Surveillance Audit", status: "upcoming", dotColor: "blue" },
];

// ISO Objectives & KPIs (Section 9)
export const ISO_OBJECTIVES_KPIS: ISOObjectiveKPIItem[] = [
  {
    id: "OBJ-001",
    objective: "Improve customer satisfaction",
    kpi: "Customer satisfaction score",
    target: "≥ 4.5",
    current: "4.2",
    status: "On Track",
  },
  {
    id: "OBJ-002",
    objective: "Reduce product defects",
    kpi: "Defect rate",
    target: "≤ 1%",
    current: "1.8%",
    status: "At Risk",
  },
  {
    id: "OBJ-003",
    objective: "Improve on-time delivery",
    kpi: "On-time delivery",
    target: "≥ 95%",
    current: "92%",
    status: "On Track",
  },
  {
    id: "OBJ-004",
    objective: "Enhance supplier quality",
    kpi: "Supplier score",
    target: "≥ 90%",
    current: "85%",
    status: "At Risk",
  },
];

// Documents & Evidence (Section 10)
export const ISO_DOCUMENTS_EVIDENCE: ISODocumentEvidenceItem[] = [
  {
    id: "DOC-001",
    documentName: "Quality Manual",
    type: "Manual",
    version: "1.0",
    uploadDate: "01-Jan-2026",
    status: "Approved",
  },
  {
    id: "DOC-002",
    documentName: "Process Map",
    type: "Process Document",
    version: "1.0",
    uploadDate: "05-Jan-2026",
    status: "Approved",
  },
  {
    id: "DOC-003",
    documentName: "Internal Audit Report",
    type: "Audit Report",
    version: "1.0",
    uploadDate: "15-Oct-2026",
    status: "Uploaded",
  },
  {
    id: "DOC-004",
    documentName: "Management Review Minutes",
    type: "Record",
    version: "1.0",
    uploadDate: "20-Oct-2026",
    status: "Uploaded",
  },
  {
    id: "DOC-005",
    documentName: "Training Records",
    type: "Record",
    version: "1.0",
    uploadDate: "12-Feb-2026",
    status: "Approved",
  },
];

// Compliance Risk (Section 11)
export const ISO_RISK: ISORiskInfo = {
  rating: "Medium",
  likelihood: 3,
  impact: 4,
  score: 12,
  keyRisk: "Non-conformity in audit leading to delay in certification.",
  mitigations: [
    "Complete gap closure",
    "Strengthen internal audits",
    "Improve documentation",
    "Conduct mock audit",
  ],
};

// 19 Controlled Reports from Section 34
export const CONTROLLED_ISO_REPORTS: ControlledISOReport[] = [
  {
    id: "REP-ISO-001",
    code: "ICR-001",
    title: "ISO Compliance Register",
    category: "Inventory & Standards",
    purpose: "Overall management-system compliance inventory across all implemented ISO standards",
    periodicity: "Real-time",
    recordsCount: 125,
    lastGenerated: "25-Sep-2026 14:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-ISO-002",
    code: "SR-002",
    title: "Standard Register",
    category: "Inventory & Standards",
    purpose: "Applicable ISO standards, active editions, schemes, and clause applicability scope",
    periodicity: "Monthly",
    recordsCount: 6,
    lastGenerated: "20-Sep-2026 11:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-003",
    code: "CCR-003",
    title: "Clause Compliance Report",
    category: "Clause & Requirements",
    purpose: "Clause-by-clause conformity scores, status, and responsible process owners",
    periodicity: "Real-time",
    recordsCount: 7,
    lastGenerated: "25-Sep-2026 10:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-ISO-004",
    code: "RCR-004",
    title: "Requirement Compliance Report",
    category: "Clause & Requirements",
    purpose: "Implementation status of 125 sub-clause requirements and verification evidence",
    periodicity: "Monthly",
    recordsCount: 125,
    lastGenerated: "22-Sep-2026 16:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-005",
    code: "GAR-005",
    title: "Gap Assessment Report",
    category: "Clause & Requirements",
    purpose: "Analysis of 8 non-compliant gaps and 15 partial requirements with remediation plans",
    periodicity: "Real-time",
    recordsCount: 23,
    lastGenerated: "25-Sep-2026 09:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-ISO-006",
    code: "CER-006",
    title: "Control Effectiveness Report",
    category: "Clause & Requirements",
    purpose: "Testing results and operating effectiveness for operational and preventive ISO controls",
    periodicity: "Quarterly",
    recordsCount: 42,
    lastGenerated: "18-Sep-2026 10:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-007",
    code: "ROR-007",
    title: "Risk & Opportunity Report",
    category: "Risk & Certification",
    purpose: "ISO 9001 Clause 6.1 risk registers, treatment actions, and residual score tracking",
    periodicity: "Monthly",
    recordsCount: 16,
    lastGenerated: "19-Sep-2026 15:10",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-008",
    code: "IAR-008",
    title: "Internal Audit Report",
    category: "Audit & Findings",
    purpose: "Annual internal management system audit summaries, schedules, and checklists",
    periodicity: "Quarterly",
    recordsCount: 4,
    lastGenerated: "15-Sep-2026 14:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-ISO-009",
    code: "FR-009",
    title: "Finding Report",
    category: "Audit & Findings",
    purpose: "Non-conformities, opportunities for improvement, and lead auditor observations",
    periodicity: "Real-time",
    recordsCount: 6,
    lastGenerated: "24-Sep-2026 11:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-010",
    code: "CAPAR-010",
    title: "CAPA Report",
    category: "CAPA & Performance",
    purpose: "Clause 10.2 corrective action root-cause investigations, verifications, and closure metrics",
    periodicity: "Real-time",
    recordsCount: 6,
    lastGenerated: "25-Sep-2026 13:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-011",
    code: "ECR-011",
    title: "Evidence Coverage Report",
    category: "Clause & Requirements",
    purpose: "Documented information audit trail mapping evidence documents to each ISO requirement",
    periodicity: "Real-time",
    recordsCount: 125,
    lastGenerated: "25-Sep-2026 12:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-ISO-012",
    code: "TCR-012",
    title: "Training Compliance Report",
    category: "CAPA & Performance",
    purpose: "Clause 7.2 personnel competency, internal auditor training, and awareness certifications",
    periodicity: "Monthly",
    recordsCount: 48,
    lastGenerated: "20-Sep-2026 17:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-013",
    code: "OKR-013",
    title: "Objective & KPI Report",
    category: "CAPA & Performance",
    purpose: "Clause 6.2 quality objectives, baseline metrics, targets, actuals, and trends",
    periodicity: "Monthly",
    recordsCount: 8,
    lastGenerated: "22-Sep-2026 15:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-014",
    code: "MRR-014",
    title: "Management Review Report",
    category: "Audit & Findings",
    purpose: "Clause 9.3 executive review minutes, inputs, outputs, and resource allocation decisions",
    periodicity: "Quarterly",
    recordsCount: 3,
    lastGenerated: "14-Sep-2026 10:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-ISO-015",
    code: "CRR-015",
    title: "Certification Readiness Report",
    category: "Risk & Certification",
    purpose: "Pre-assessment scorecard evaluating readiness for TÜV SÜD Stage 1 & Stage 2 audits",
    periodicity: "Monthly",
    recordsCount: 1,
    lastGenerated: "08-Sep-2026 14:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-016",
    code: "CSR-016",
    title: "Certification Status Report",
    category: "Risk & Certification",
    purpose: "Portfolio status of active, transition, and in-progress ISO certifications",
    periodicity: "Quarterly",
    recordsCount: 6,
    lastGenerated: "05-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-017",
    code: "SR-017",
    title: "Surveillance Report",
    category: "Risk & Certification",
    purpose: "Surveillance audit schedules, checklists, and continuity confirmations",
    periodicity: "Annual",
    recordsCount: 4,
    lastGenerated: "01-Sep-2026 11:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-ISO-018",
    code: "SRIR-018",
    title: "Standard Revision Impact Report",
    category: "Inventory & Standards",
    purpose: "Impact analysis for upcoming ISO standard updates and transition requirements",
    periodicity: "Quarterly",
    recordsCount: 5,
    lastGenerated: "21-Sep-2026 14:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-ISO-019",
    code: "AIIR-019",
    title: "AI ISO Intelligence Report",
    category: "AI & Governance",
    purpose: "Automated clause-to-control mapping, gap prediction, and recurring non-conformity detection",
    periodicity: "Real-time",
    recordsCount: 125,
    lastGenerated: "25-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
];

// Section 35: ISO Compliance KPI Master
export const ISO_KPI_MASTER: ISOKPIMetric[] = [
  // Compliance
  {
    id: "KPI-001",
    domain: "Compliance",
    metric: "Overall ISO Compliance Rate",
    target: "≥ 90%",
    actual: "92.0%",
    variance: "+2.0%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-002",
    domain: "Compliance",
    metric: "Clause Conformance Ratio",
    target: "100%",
    actual: "82.0% (102/125)",
    variance: "-18.0%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-003",
    domain: "Compliance",
    metric: "Critical Non-Conformity Count",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  // Audit
  {
    id: "KPI-004",
    domain: "Audit",
    metric: "Internal Audit Plan Completion Rate",
    target: "100%",
    actual: "95.0%",
    variance: "-5.0%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-005",
    domain: "Audit",
    metric: "Major Audit Findings Incurred",
    target: "0",
    actual: "2",
    variance: "+2",
    trend: "down",
    status: "Attention",
  },
  {
    id: "KPI-006",
    domain: "Audit",
    metric: "Audit Finding On-Time Closure Rate",
    target: "≥ 90%",
    actual: "88.5%",
    variance: "-1.5%",
    trend: "up",
    status: "Good",
  },
  // CAPA
  {
    id: "KPI-007",
    domain: "CAPA",
    metric: "Open Corrective Actions (CAPA)",
    target: "≤ 5",
    actual: "6",
    variance: "+1",
    trend: "neutral",
    status: "Good",
  },
  {
    id: "KPI-008",
    domain: "CAPA",
    metric: "Overdue Corrective Actions",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-009",
    domain: "CAPA",
    metric: "CAPA Effectiveness Verification Rate",
    target: "100%",
    actual: "94.2%",
    variance: "-5.8%",
    trend: "up",
    status: "Optimal",
  },
  // Evidence
  {
    id: "KPI-010",
    domain: "Evidence",
    metric: "Documented Information Coverage",
    target: "100%",
    actual: "96.8%",
    variance: "-3.2%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-011",
    domain: "Evidence",
    metric: "Missing Evidence Documents",
    target: "0",
    actual: "4",
    variance: "+4",
    trend: "up",
    status: "Attention",
  },
  // People
  {
    id: "KPI-012",
    domain: "People",
    metric: "Mandatory QMS Training Completion",
    target: "100%",
    actual: "96.4%",
    variance: "-3.6%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-013",
    domain: "People",
    metric: "Certified Internal Auditor Pool",
    target: "≥ 8",
    actual: "10",
    variance: "+2",
    trend: "up",
    status: "Optimal",
  },
  // Objectives
  {
    id: "KPI-014",
    domain: "Objectives",
    metric: "Quality Objectives Achievement Rate",
    target: "≥ 85%",
    actual: "87.5%",
    variance: "+2.5%",
    trend: "up",
    status: "Optimal",
  },
  // Certification
  {
    id: "KPI-015",
    domain: "Certification",
    metric: "Stage 1 Audit Readiness Score",
    target: "≥ 90%",
    actual: "92.0%",
    variance: "+2.0%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-016",
    domain: "Certification",
    metric: "Recertification Lead Time Adherence",
    target: "100%",
    actual: "100%",
    variance: "0%",
    trend: "neutral",
    status: "Optimal",
  },
];

// Sample Inventory for Live Table View
export const SAMPLE_ISO_PROGRAMS = [
  {
    id: "ISO-2026-001",
    code: "QC-ISO-001",
    name: "ISO 9001:2015 Quality Management",
    standard: "ISO 9001:2015",
    body: "TÜV SÜD",
    location: "Coimbatore",
    reqs: 125,
    rate: "92%",
    status: "Partial Compliance",
  },
  {
    id: "ISO-2026-002",
    code: "ENV-ISO-002",
    name: "ISO 14001:2015 Environmental Management",
    standard: "ISO 14001:2015",
    body: "DNV GL",
    location: "Coimbatore",
    reqs: 94,
    rate: "88%",
    status: "Partial Compliance",
  },
  {
    id: "ISO-2026-003",
    code: "SEC-ISO-003",
    name: "ISO 27001:2022 Information Security",
    standard: "ISO 27001:2022",
    body: "BSI Group",
    location: "Enterprise",
    reqs: 114,
    rate: "74%",
    status: "Gap",
  },
  {
    id: "ISO-2026-004",
    code: "SAF-ISO-004",
    name: "ISO 45001:2018 Occupational Health & Safety",
    standard: "ISO 45001:2018",
    body: "TÜV Rheinland",
    location: "Coimbatore",
    reqs: 88,
    rate: "95%",
    status: "Compliant",
  },
  {
    id: "ISO-2026-005",
    code: "ENR-ISO-005",
    name: "ISO 50001:2018 Energy Management",
    standard: "ISO 50001:2018",
    body: "Bureau Veritas",
    location: "Coimbatore",
    reqs: 76,
    rate: "82%",
    status: "Partial Compliance",
  },
];

// Related records shown on the "Related Records" tab.
export const ISO_RELATED_RECORDS = [
  { id: "certs", label: "Certifications", count: 3, to: "/management/risk-management/certifications" },
  { id: "internal", label: "Internal Compliance Requirements", count: 5, to: "/management/risk-management/internal-compliance" },
  { id: "audit", label: "Quality Audits", count: 2, to: "/management/quality-management/audit-management" },
  { id: "capa", label: "Corrective Actions (CAPA)", count: 2, to: "/management/quality-management/capa" },
  { id: "risk", label: "Compliance Risk", count: 1, to: "/management/risk-management/compliance-risk" },
  { id: "incidents", label: "Incidents", count: 1, to: "/management/risk-management/incident-management" },
];

// Magnertia ERP - Audit Compliance Service
// Management -> Quality Management / Risk Management -> Audit Compliance
// Master Data, Checklist Items, Findings & NCR, CAPA, Evidence, Controlled Audit Reports & KPIs

export interface AuditComplianceRecord {
  auditComplianceId: string;
  auditNumber: string;
  auditDate: string;
  auditType: "Internal Compliance Audit" | "Supplier Audit" | "Process Audit" | "Product Audit" | "System Audit" | "Compliance Audit" | "Customer Audit";
  auditCategory: "Planned" | "Special" | "Follow-up" | "Surveillance";
  auditProgram: string;
  auditObjective: string;
  auditScope: string;
  organization: string;
  plantSite: string;
  department: string;
  process: string;
  leadAuditor: {
    name: string;
    initials: string;
    email: string;
  };
  auditTeam: Array<{
    name: string;
    initials: string;
  }>;
  auditStatus: "Draft" | "Planned" | "In Progress" | "Review" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  plannedStart: string;
  plannedEnd: string;
  actualStart: string;
  actualEnd: string;
  // Source & Requirement fields
  auditTrigger: "Annual Plan" | "NCR" | "CAPA" | "Complaint" | "Risk" | "Management";
  sourceReference: string;
  applicableIsoStandard: string;
  standardRevision: string;
  isoClauseRequirement: string;
  regulatoryRequirement: string;
  internalPolicy: string;
  customerRequirement: string;
  certificationRequirement: string;
  riskReference: string;
  complianceRate: number;
}

export interface AuditExecutiveKPI {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  color: "blue" | "emerald" | "amber" | "red" | "purple" | "teal";
  subtext: string;
}

export interface AuditChecklistSummaryItem {
  id: number;
  category: string;
  total: number;
  conforming: number;
  nonConforming: number;
  observation: number;
  na: number;
  completion: number;
}

export interface AuditFindingItem {
  id: string;
  category: string;
  finding: string;
  severity: "Critical" | "Major" | "Minor" | "Observation" | "OFI";
  status: "Open" | "In Progress" | "Verification" | "Closed";
  clause?: string;
  owner?: string;
  dueDate?: string;
}

export interface AuditCAPAItem {
  id: string;
  relatedFinding: string;
  action: string;
  owner: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Overdue" | "Completed" | "Verified";
}

export interface AuditDocumentItem {
  id: string;
  documentName: string;
  type: "Internal" | "Checklist" | "Evidence" | "Report" | "Certificate";
  version: string;
  uploadDate: string;
  status: "Valid" | "Draft" | "Pending" | "Expired";
}

export interface ComplianceTrendPoint {
  month: string;
  compliance: number;
}

export interface ControlledAuditReport {
  id: string;
  code: string;
  title: string;
  category: "Audit Program & Planning" | "Findings & Non-Conformance" | "Standards & Compliance" | "CAPA & Follow-up" | "Risk & AI Analytics";
  purpose: string;
  periodicity: "Real-time" | "Monthly" | "Quarterly" | "Annual";
  recordsCount: number;
  lastGenerated: string;
  downloadFormat: "PDF / Excel / CSV";
  status: "Certified" | "Active";
}

export interface AuditKPIMetric {
  id: string;
  domain: "Audit" | "Compliance" | "Findings" | "Corrective Actions" | "Evidence" | "Risk";
  metric: string;
  target: string;
  actual: string;
  variance: string;
  trend: "up" | "down" | "neutral";
  status: "Optimal" | "Good" | "Attention" | "Critical";
}

// Primary Record from UI Mockup
export const PRIMARY_AUDIT_RECORD: AuditComplianceRecord = {
  auditComplianceId: "AC-2026-0018",
  auditNumber: "AUD-2026-0045",
  auditDate: "15-Sep-2026",
  auditType: "Internal Compliance Audit",
  auditCategory: "Planned",
  auditProgram: "FY26 Internal Audit Program",
  auditObjective: "Assess compliance with ISO 9001:2015 requirements in manufacturing operations.",
  auditScope: "Production, testing, documentation and records at Namakkal plant.",
  organization: "Magnertia Private Limited",
  plantSite: "Namakkal - Manufacturing Plant",
  department: "Quality",
  process: "EVSE Assembly & Testing",
  leadAuditor: {
    name: "Ramesh S",
    initials: "RS",
    email: "ramesh.s@magnertia.com",
  },
  auditTeam: [
    { name: "Priya Sharma", initials: "PS" },
    { name: "Arun Kumar", initials: "AK" },
    { name: "Vikram M", initials: "VM" },
    { name: "Divya N", initials: "DN" },
  ],
  auditStatus: "In Progress",
  priority: "High",
  plannedStart: "15-Sep-2026 09:00",
  plannedEnd: "15-Sep-2026 17:00",
  actualStart: "15-Sep-2026 09:15",
  actualEnd: "—",
  auditTrigger: "Annual Plan",
  sourceReference: "ISO Compliance",
  applicableIsoStandard: "ISO 9001:2015",
  standardRevision: "2015",
  isoClauseRequirement: "7.5.3 Control of Documented Information",
  regulatoryRequirement: "Not Applicable",
  internalPolicy: "Document Policy",
  customerRequirement: "OEM Quality Requirement",
  certificationRequirement: "ISO 9001 Certification",
  riskReference: "RISK-2026-014",
  complianceRate: 92,
};

// Top 6 Executive KPIs from Screenshot
export const AUDIT_EXECUTIVE_KPIS: AuditExecutiveKPI[] = [
  {
    id: "total",
    label: "Total Audits",
    value: 24,
    change: "↑ 26%",
    trend: "up",
    color: "blue",
    subtext: "Across internal, supplier & system programs",
  },
  {
    id: "completed",
    label: "Completed",
    value: 16,
    change: "↑ 14%",
    trend: "up",
    color: "emerald",
    subtext: "Fully audited with signed closing meeting",
  },
  {
    id: "in-progress",
    label: "In Progress",
    value: 6,
    change: "↑ 50%",
    trend: "up",
    color: "amber",
    subtext: "Live on-site & remote audits underway",
  },
  {
    id: "overdue",
    label: "Overdue",
    value: 3,
    change: "↓ 25%",
    trend: "down",
    color: "red",
    subtext: "Audits pending schedule recovery",
  },
  {
    id: "findings",
    label: "Open Findings",
    value: 18,
    change: "↑ 20%",
    trend: "up",
    color: "purple",
    subtext: "Active NCRs & observations under CAPA",
  },
  {
    id: "compliance-rate",
    label: "Compliance Rate",
    value: "92%",
    change: "↑ 8%",
    trend: "up",
    color: "teal",
    subtext: "Weighted requirements conformance index",
  },
];

// Key Dates (Section 4)
export const AUDIT_KEY_DATES = [
  { label: "Audit Date", date: "15-Sep-2026" },
  { label: "Planned End", date: "15-Sep-2026 17:00" },
  { label: "Actual End", date: "—" },
  { label: "Report Due", date: "18-Sep-2026" },
  { label: "Follow-up Audit", date: "15-Oct-2026" },
];

// Checklist Summary (Section 6)
export const AUDIT_CHECKLIST_SUMMARY: AuditChecklistSummaryItem[] = [
  {
    id: 1,
    category: "Context & Leadership",
    total: 6,
    conforming: 6,
    nonConforming: 0,
    observation: 0,
    na: 0,
    completion: 100,
  },
  {
    id: 2,
    category: "Planning",
    total: 8,
    conforming: 5,
    nonConforming: 2,
    observation: 1,
    na: 0,
    completion: 75,
  },
  {
    id: 3,
    category: "Support",
    total: 10,
    conforming: 8,
    nonConforming: 1,
    observation: 1,
    na: 0,
    completion: 80,
  },
  {
    id: 4,
    category: "Operation",
    total: 12,
    conforming: 8,
    nonConforming: 3,
    observation: 1,
    na: 0,
    completion: 67,
  },
  {
    id: 5,
    category: "Performance Evaluation",
    total: 8,
    conforming: 6,
    nonConforming: 1,
    observation: 1,
    na: 0,
    completion: 75,
  },
];

// Recent Findings (Section 7)
export const AUDIT_RECENT_FINDINGS: AuditFindingItem[] = [
  {
    id: "F-001",
    category: "Document Control",
    finding: "Outdated procedure version in assembly line workstation 3",
    severity: "Major",
    status: "Open",
    clause: "7.5.3",
    owner: "Ramesh S",
    dueDate: "30-Sep-2026",
  },
  {
    id: "F-002",
    category: "Training",
    finding: "Training records incomplete for 4 contract technicians",
    severity: "Minor",
    status: "In Progress",
    clause: "7.2",
    owner: "Priya S",
    dueDate: "05-Oct-2026",
  },
  {
    id: "F-003",
    category: "Process",
    finding: "No calibration record for high-voltage dielectric insulation tester",
    severity: "Major",
    status: "Open",
    clause: "7.1.5",
    owner: "Arun K",
    dueDate: "10-Oct-2026",
  },
  {
    id: "F-004",
    category: "Safety",
    finding: "PPE compliance gap: anti-static wristbands not tested before shift",
    severity: "Minor",
    status: "Open",
    clause: "8.5.1",
    owner: "Ramesh S",
    dueDate: "20-Sep-2026",
  },
  {
    id: "F-005",
    category: "Records",
    finding: "Improper record retention: inspection logs archived without sign-off",
    severity: "Observation",
    status: "Open",
    clause: "7.5.3",
    owner: "Priya S",
    dueDate: "30-Sep-2026",
  },
];

// Compliance by Source Data (Section 8)
export const COMPLIANCE_BY_SOURCE_DATA = [
  { name: "ISO Requirements", count: 24, percentage: "55%", color: "#2563eb" },
  { name: "Legal Requirements", count: 8, percentage: "18%", color: "#0d9488" },
  { name: "Customer Requirements", count: 6, percentage: "14%", color: "#f59e0b" },
  { name: "Internal Policies", count: 4, percentage: "9%", color: "#ef4444" },
  { name: "Regulatory Requirements", count: 2, percentage: "4%", color: "#8b5cf6" },
];

// Open Corrective Actions CAPA (Section 9)
export const AUDIT_CAPA_ITEMS: AuditCAPAItem[] = [
  {
    id: "CAPA-001",
    relatedFinding: "F-001",
    action: "Update document control SOP and withdraw physical superseded sheets",
    owner: "RS",
    dueDate: "30-Sep-2026",
    status: "Open",
  },
  {
    id: "CAPA-002",
    relatedFinding: "F-002",
    action: "Conduct training & competency assessment for all shop-floor contractors",
    owner: "PS",
    dueDate: "05-Oct-2026",
    status: "In Progress",
  },
  {
    id: "CAPA-003",
    relatedFinding: "F-003",
    action: "Calibrate equipment & establish automated calibration recall in ERP",
    owner: "AK",
    dueDate: "10-Oct-2026",
    status: "Open",
  },
  {
    id: "CAPA-004",
    relatedFinding: "F-004",
    action: "Improve PPE monitoring with daily automated tester verification logs",
    owner: "RS",
    dueDate: "20-Sep-2026",
    status: "Overdue",
  },
  {
    id: "CAPA-005",
    relatedFinding: "F-005",
    action: "Update record retention policy and digitalize shift inspection handover",
    owner: "PS",
    dueDate: "30-Sep-2026",
    status: "Open",
  },
];

// Documents & Evidence (Section 10)
export const AUDIT_DOCUMENTS: AuditDocumentItem[] = [
  {
    id: "DOC-AUD-001",
    documentName: "Audit Plan - FY26 Manufacturing",
    type: "Internal",
    version: "1.0",
    uploadDate: "01-Sep-2026",
    status: "Valid",
  },
  {
    id: "DOC-AUD-002",
    documentName: "Audit Checklist - ISO 9001:2015",
    type: "Checklist",
    version: "1.0",
    uploadDate: "01-Sep-2026",
    status: "Valid",
  },
  {
    id: "DOC-AUD-003",
    documentName: "Process Records - EVSE Line A",
    type: "Evidence",
    version: "1.2",
    uploadDate: "15-Sep-2026",
    status: "Valid",
  },
  {
    id: "DOC-AUD-004",
    documentName: "Photos - Production Line Inspection",
    type: "Evidence",
    version: "1.0",
    uploadDate: "15-Sep-2026",
    status: "Valid",
  },
  {
    id: "DOC-AUD-005",
    documentName: "Audit Meeting Minutes & Opening Deck",
    type: "Report",
    version: "1.0",
    uploadDate: "15-Sep-2026",
    status: "Draft",
  },
];

// Compliance Trend (Section 11)
export const AUDIT_COMPLIANCE_TREND: ComplianceTrendPoint[] = [
  { month: "Apr-26", compliance: 62 },
  { month: "May-26", compliance: 71 },
  { month: "Jun-26", compliance: 78 },
  { month: "Jul-26", compliance: 84 },
  { month: "Aug-26", compliance: 89 },
  { month: "Sep-26", compliance: 92 },
];

// Section 22: Controlled Audit Reports
export const CONTROLLED_AUDIT_REPORTS: ControlledAuditReport[] = [
  {
    id: "REP-AUD-001",
    code: "ACR-001",
    title: "Audit Compliance Register",
    category: "Audit Program & Planning",
    purpose: "Master register of all planned, ongoing, completed, and closed compliance audits across business entities",
    periodicity: "Real-time",
    recordsCount: 24,
    lastGenerated: "25-Sep-2026 15:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-002",
    code: "APR-002",
    title: "Audit Program Report",
    category: "Audit Program & Planning",
    purpose: "Annual and multi-year compliance audit programs with resource allocations, scope coverage, and milestones",
    periodicity: "Quarterly",
    recordsCount: 4,
    lastGenerated: "20-Sep-2026 10:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-AUD-003",
    code: "AS-003",
    title: "Audit Schedule & Timeline",
    category: "Audit Program & Planning",
    purpose: "Calendar schedule of upcoming audits, opening/closing meeting schedules, and auditor allocations",
    periodicity: "Monthly",
    recordsCount: 18,
    lastGenerated: "22-Sep-2026 09:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-004",
    code: "OAR-004",
    title: "Open Audit Report",
    category: "Audit Program & Planning",
    purpose: "Detailed log of active audits under field execution, document verification, and report drafting",
    periodicity: "Real-time",
    recordsCount: 6,
    lastGenerated: "25-Sep-2026 14:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-AUD-005",
    code: "ODAR-005",
    title: "Overdue Audit Report",
    category: "Audit Program & Planning",
    purpose: "Escalation register of audits exceeding planned end dates with reason codes and mitigation plans",
    periodicity: "Real-time",
    recordsCount: 3,
    lastGenerated: "25-Sep-2026 11:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-006",
    code: "CFR-006",
    title: "Compliance Findings Report",
    category: "Findings & Non-Conformance",
    purpose: "Comprehensive breakdown of all non-conformances, observations, and opportunities for improvement",
    periodicity: "Real-time",
    recordsCount: 18,
    lastGenerated: "25-Sep-2026 16:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-007",
    code: "CFI-007",
    title: "Critical Findings Report",
    category: "Findings & Non-Conformance",
    purpose: "Escalated critical non-conformances impacting statutory legality, worker safety, or product certification",
    periodicity: "Real-time",
    recordsCount: 0,
    lastGenerated: "25-Sep-2026 12:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-008",
    code: "MNCR-008",
    title: "Major Non-Conformance (NCR) Report",
    category: "Findings & Non-Conformance",
    purpose: "Major non-compliances requiring formal 8D root cause analysis and immediate containment actions",
    periodicity: "Real-time",
    recordsCount: 7,
    lastGenerated: "25-Sep-2026 13:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-AUD-009",
    code: "FP-009",
    title: "Finding Pareto Analysis",
    category: "Findings & Non-Conformance",
    purpose: "Statistical 80/20 Pareto distribution of findings by standard clause, department, and root-cause category",
    periodicity: "Monthly",
    recordsCount: 44,
    lastGenerated: "21-Sep-2026 17:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-010",
    code: "RFR-010",
    title: "Recurring Finding Report",
    category: "Findings & Non-Conformance",
    purpose: "Identification of repeat non-compliances across successive audit cycles indicating systemic failure",
    periodicity: "Quarterly",
    recordsCount: 2,
    lastGenerated: "18-Sep-2026 16:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-011",
    code: "CAR-011",
    title: "Compliance Audit Summary Report",
    category: "Standards & Compliance",
    purpose: "Executive summary of audit findings, overall compliance scores, lead auditor recommendations, and sign-offs",
    periodicity: "Monthly",
    recordsCount: 16,
    lastGenerated: "24-Sep-2026 11:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-012",
    code: "IAR-012",
    title: "ISO Standards Audit Report",
    category: "Standards & Compliance",
    purpose: "Dedicated compliance reporting mapped against ISO 9001, ISO 14001, ISO 45001, and ISO 27001 clauses",
    periodicity: "Real-time",
    recordsCount: 125,
    lastGenerated: "25-Sep-2026 10:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-013",
    code: "LCAR-013",
    title: "Legal & Statutory Compliance Audit Report",
    category: "Standards & Compliance",
    purpose: "Audit findings evaluated strictly against statutory acts, factory rules, pollution norms, and safety codes",
    periodicity: "Quarterly",
    recordsCount: 28,
    lastGenerated: "19-Sep-2026 14:40",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-AUD-014",
    code: "SCAR-014",
    title: "Supplier Compliance Audit Report",
    category: "Standards & Compliance",
    purpose: "Vendor tier-1 qualification audits, process capability assessments, and supplier quality agreements",
    periodicity: "Monthly",
    recordsCount: 12,
    lastGenerated: "23-Sep-2026 15:10",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-AUD-015",
    code: "CAPAR-015",
    title: "CAPA from Audit Report",
    category: "CAPA & Follow-up",
    purpose: "Corrective and preventive action log initiated directly from audit findings with target dates and owners",
    periodicity: "Real-time",
    recordsCount: 14,
    lastGenerated: "25-Sep-2026 12:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-016",
    code: "FUAR-016",
    title: "Follow-Up Audit & Verification Report",
    category: "CAPA & Follow-up",
    purpose: "Verification evidence confirming that corrective actions have been fully implemented and proven effective",
    periodicity: "Monthly",
    recordsCount: 8,
    lastGenerated: "22-Sep-2026 14:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-AUD-017",
    code: "ECR-017",
    title: "Evidence Coverage & Verification Register",
    category: "Risk & AI Analytics",
    purpose: "Traceability matrix ensuring that 100% of audit checklist criteria are corroborated by valid objective evidence",
    periodicity: "Monthly",
    recordsCount: 44,
    lastGenerated: "24-Sep-2026 16:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-AUD-018",
    code: "AIAR-018",
    title: "AI Audit Compliance Intelligence Report",
    category: "Risk & AI Analytics",
    purpose: "Predictive compliance risk hotspots, automated checklist suggestions, and anomaly detection across audit trails",
    periodicity: "Real-time",
    recordsCount: 24,
    lastGenerated: "25-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
];

// Section 23: Audit Compliance Key KPI Master
export const AUDIT_KPI_MASTER: AuditKPIMetric[] = [
  // Audit
  {
    id: "KPI-AUD-01",
    domain: "Audit",
    metric: "Annual Audit Plan Execution Rate",
    target: "100%",
    actual: "94.2%",
    variance: "-5.8%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-AUD-02",
    domain: "Audit",
    metric: "Audit Closure Within SLA",
    target: "≥ 90%",
    actual: "91.4%",
    variance: "+1.4%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-AUD-03",
    domain: "Audit",
    metric: "Overdue Audit Rate",
    target: "≤ 5%",
    actual: "4.2%",
    variance: "-0.8%",
    trend: "down",
    status: "Optimal",
  },
  // Compliance
  {
    id: "KPI-AUD-04",
    domain: "Compliance",
    metric: "Weighted Compliance Conformance Index",
    target: "≥ 90%",
    actual: "92.0%",
    variance: "+2.0%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-AUD-05",
    domain: "Compliance",
    metric: "Checklist Item Conformance %",
    target: "≥ 85%",
    actual: "75.0% (33/44)",
    variance: "-10.0%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-AUD-06",
    domain: "Compliance",
    metric: "ISO Clause Conformance Ratio",
    target: "100%",
    actual: "91.7%",
    variance: "-8.3%",
    trend: "up",
    status: "Good",
  },
  // Findings
  {
    id: "KPI-AUD-07",
    domain: "Findings",
    metric: "Critical Non-Conformance Count",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-AUD-08",
    domain: "Findings",
    metric: "Major Non-Conformance Conversion to NCR",
    target: "100%",
    actual: "100%",
    variance: "0%",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-AUD-09",
    domain: "Findings",
    metric: "Repeat Finding Recurrence Rate",
    target: "≤ 3%",
    actual: "1.8%",
    variance: "-1.2%",
    trend: "down",
    status: "Optimal",
  },
  // Corrective Actions
  {
    id: "KPI-AUD-10",
    domain: "Corrective Actions",
    metric: "CAPA On-Time Closure Rate",
    target: "≥ 90%",
    actual: "88.9%",
    variance: "-1.1%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-AUD-11",
    domain: "Corrective Actions",
    metric: "CAPA Effectiveness Verification Rate",
    target: "100%",
    actual: "94.4%",
    variance: "-5.6%",
    trend: "up",
    status: "Optimal",
  },
  // Evidence
  {
    id: "KPI-AUD-12",
    domain: "Evidence",
    metric: "Checklist Evidence Verification Coverage",
    target: "100%",
    actual: "97.5%",
    variance: "-2.5%",
    trend: "up",
    status: "Optimal",
  },
  // Risk
  {
    id: "KPI-AUD-13",
    domain: "Risk",
    metric: "High-Risk Audit Exposure Items",
    target: "≤ 2",
    actual: "1",
    variance: "-1",
    trend: "down",
    status: "Optimal",
  },
  {
    id: "KPI-AUD-14",
    domain: "Risk",
    metric: "AI Predictive Compliance Score",
    target: "≥ 85/100",
    actual: "91/100",
    variance: "+6",
    trend: "up",
    status: "Optimal",
  },
];

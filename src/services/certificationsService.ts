// Magnertia ERP - Certifications Service
// Management -> Risk Management -> Certifications
// Master Data, Standards, Certification Bodies, Surveillance, Gap Assessment & Controlled Audit Reports

export interface CertificationRecord {
  certificationId: string;
  certificationCode: string;
  certificationName: string;
  certificationType: "Management System" | "Product" | "Process" | "Organization" | "Personnel";
  certificationCategory: "Quality" | "Safety" | "Environmental" | "Cybersecurity" | "Energy" | "Automotive";
  standardScheme: string;
  certificationBody: string;
  testingLaboratory: string;
  businessFunction: string;
  department: string;
  process: string;
  certificationOwner: {
    name: string;
    initials: string;
    email: string;
  };
  complianceCoordinator: {
    name: string;
    initials: string;
    email: string;
  };
  legalEntity: string;
  location: string;
  issueDate: string;
  effectiveDate: string;
  expiryDate: string;
  renewalDueDate: string;
  status: "Certified" | "Planning" | "Audit" | "Expiring" | "Suspended" | "Withdrawn";
  priority: "Critical" | "High" | "Medium" | "Low";
  version: string;
  confidentiality: "Internal" | "Confidential" | "Restricted";
  requirement: string;
  businessObjective: string;
  scope: string;
  validityPeriod: string;
  surveillanceRequirement: string;
  currentStatus: string;
  daysRemaining: number;
}

export interface RelatedStandardItem {
  id: string;
  standard: string;
  edition: string;
  scope: string;
  status: "Certified" | "In Progress" | "Planned" | "Gap Assessment";
}

export interface DocumentEvidenceItem {
  id: string;
  documentName: string;
  type: "Certificate" | "Audit Report" | "Scope" | "CAPA" | "Test Report";
  version: string;
  uploadDate: string;
  status: "Valid" | "Expiring" | "Closed" | "Under Review";
}

export interface AuditHistoryItem {
  id: string;
  date: string;
  auditType: "Surveillance" | "Initial Certification" | "Pre-Assessment" | "Recertification" | "Special Audit";
  auditorBody: string;
  findings: string;
  result: "Pass" | "Conditional Pass" | "N/A" | "Fail";
  status: "Closed" | "Action Pending" | "Scheduled";
}

export interface RenewalPlanItem {
  id: string;
  planDate: string;
  activity: string;
  owner: string;
  status: "Planned" | "In Progress" | "Completed";
}

export interface CertificationRiskInfo {
  rating: "Critical" | "High" | "Medium" | "Low";
  likelihood: number;
  impact: number;
  score: number;
  keyRisk: string;
  mitigation: string;
}

export interface ControlledCertReport {
  id: string;
  code: string;
  title: string;
  category: "Inventory" | "Audit & Testing" | "Readiness & Gap" | "Renewal & Surveillance" | "Risk & Financial" | "AI & Governance";
  purpose: string;
  periodicity: "Real-time" | "Monthly" | "Quarterly" | "Annual";
  recordsCount: number;
  lastGenerated: string;
  downloadFormat: "PDF / Excel / CSV";
  status: "Certified" | "Active";
}

export interface CertificationKPIMetric {
  id: string;
  domain: "Portfolio" | "Readiness" | "Audit" | "Testing" | "Renewal" | "Risk" | "Finance";
  metric: string;
  target: string;
  actual: string;
  variance: string;
  trend: "up" | "down" | "neutral";
  status: "Optimal" | "Good" | "Attention" | "Critical";
}

// Primary Active Record from Screenshot
export const PRIMARY_CERTIFICATION_RECORD: CertificationRecord = {
  certificationId: "CERT-2026-001",
  certificationCode: "ISO-9001-001",
  certificationName: "ISO 9001:2015 Quality Management",
  certificationType: "Management System",
  certificationCategory: "Quality",
  standardScheme: "ISO 9001:2015",
  certificationBody: "TÜV SÜD",
  testingLaboratory: "TÜV SÜD India (Optional)",
  businessFunction: "Manufacturing",
  department: "Quality Management",
  process: "All QMS Processes",
  certificationOwner: {
    name: "Ramesh S",
    initials: "RS",
    email: "ramesh.s@magnertia.com",
  },
  complianceCoordinator: {
    name: "Priya Sharma",
    initials: "PS",
    email: "priya.sharma@magnertia.com",
  },
  legalEntity: "Magnertia Private Limited",
  location: "Coimbatore - Main Facility",
  issueDate: "01-Jan-2024",
  effectiveDate: "01-Jan-2024",
  expiryDate: "31-Dec-2026",
  renewalDueDate: "30-Sep-2026",
  status: "Certified",
  priority: "Critical",
  version: "1.0",
  confidentiality: "Internal",
  requirement: "Required to demonstrate quality management system for manufacturing and supply to OEM customers.",
  businessObjective: "Ensure consistent product quality, process efficiency and customer satisfaction.",
  scope: "Design, development, manufacturing and supply of autonomous wireless EV charging stations.",
  validityPeriod: "3 Years",
  surveillanceRequirement: "Annual Surveillance Audit",
  currentStatus: "Valid and Certified",
  daysRemaining: 267,
};

// Executive Top KPI Widgets (from Screenshot)
export const CERTIFICATION_EXECUTIVE_KPIS = [
  {
    id: "total",
    label: "Total Certifications",
    value: 18,
    change: "↑ 20%",
    trend: "up" as const,
    color: "blue",
    subtext: "Across System, Product & Process scopes",
  },
  {
    id: "active",
    label: "Active Certifications",
    value: 12,
    change: "↑ 9%",
    trend: "up" as const,
    color: "emerald",
    subtext: "Certified & valid in global markets",
  },
  {
    id: "expiring",
    label: "Expiring in 90 Days",
    value: 3,
    change: "↑ 50%",
    trend: "up" as const,
    color: "amber",
    subtext: "Under surveillance & renewal audit",
  },
  {
    id: "expired",
    label: "Expired Certifications",
    value: 2,
    change: "↑ 100%",
    trend: "down" as const,
    color: "red",
    subtext: "Under recertification transition",
  },
  {
    id: "in-progress",
    label: "In Progress",
    value: 4,
    change: "↓ 33%",
    trend: "up" as const,
    color: "purple",
    subtext: "Stage 1 & Stage 2 audits ongoing",
  },
  {
    id: "compliance",
    label: "Certification Compliance",
    value: "94%",
    change: "↑ 8%",
    trend: "up" as const,
    color: "teal",
    subtext: "Audit readiness & clause conformance",
  },
];

// Key Dates
export const CERTIFICATION_KEY_DATES = [
  { label: "Issue Date", date: "01-Jan-2024" },
  { label: "Expiry Date", date: "31-Dec-2026" },
  { label: "Renewal Due", date: "30-Sep-2026" },
  { label: "Next Surveillance", date: "15-Jan-2026" },
  { label: "Last Audit", date: "15-Jan-2025" },
  { label: "Next Audit", date: "15-Jan-2026" },
];

// Related Standards & Scope (Section 6)
export const RELATED_STANDARDS: RelatedStandardItem[] = [
  {
    id: "STD-001",
    standard: "ISO 9001:2015",
    edition: "2015",
    scope: "QMS - Manufacturing",
    status: "Certified",
  },
  {
    id: "STD-002",
    standard: "ISO 14001:2015",
    edition: "2015",
    scope: "Environmental Management",
    status: "In Progress",
  },
  {
    id: "STD-003",
    standard: "ISO 45001:2018",
    edition: "2018",
    scope: "Occupational Health & Safety",
    status: "Planned",
  },
  {
    id: "STD-004",
    standard: "ISO 27001:2022",
    edition: "2022",
    scope: "Information Security",
    status: "Gap Assessment",
  },
];

// Documents & Evidence (Section 7)
export const DOCUMENTS_EVIDENCE: DocumentEvidenceItem[] = [
  {
    id: "EVD-001",
    documentName: "Certificate (ISO 9001)",
    type: "Certificate",
    version: "1.0",
    uploadDate: "01-Jan-2024",
    status: "Valid",
  },
  {
    id: "EVD-002",
    documentName: "Audit Report 2025",
    type: "Audit Report",
    version: "1.0",
    uploadDate: "15-Jan-2025",
    status: "Valid",
  },
  {
    id: "EVD-003",
    documentName: "Scope Document",
    type: "Scope",
    version: "1.0",
    uploadDate: "01-Jan-2024",
    status: "Valid",
  },
  {
    id: "EVD-004",
    documentName: "Corrective Action Plan",
    type: "CAPA",
    version: "1.0",
    uploadDate: "20-Jan-2025",
    status: "Closed",
  },
];

// Audit & Surveillance History (Section 9)
export const AUDIT_HISTORY: AuditHistoryItem[] = [
  {
    id: "AUD-001",
    date: "15-Jan-2025",
    auditType: "Surveillance",
    auditorBody: "TÜV SÜD",
    findings: "1 Minor",
    result: "Pass",
    status: "Closed",
  },
  {
    id: "AUD-002",
    date: "10-Jan-2024",
    auditType: "Initial Certification",
    auditorBody: "TÜV SÜD",
    findings: "2 Minor",
    result: "Pass",
    status: "Closed",
  },
  {
    id: "AUD-003",
    date: "12-Dec-2023",
    auditType: "Pre-Assessment",
    auditorBody: "TÜV SÜD",
    findings: "5 Observations",
    result: "N/A",
    status: "Closed",
  },
];

// Renewal Plan (Section 10)
export const RENEWAL_PLAN: RenewalPlanItem[] = [
  {
    id: "REN-001",
    planDate: "01-Jul-2026",
    activity: "Gap Review",
    owner: "Quality Team",
    status: "Planned",
  },
  {
    id: "REN-002",
    planDate: "01-Aug-2026",
    activity: "Documentation Update",
    owner: "Priya Sharma",
    status: "Planned",
  },
  {
    id: "REN-003",
    planDate: "30-Sep-2026",
    activity: "Submit Renewal Application",
    owner: "Ramesh S",
    status: "Planned",
  },
];

// Compliance & Risk (Section 8)
export const CERTIFICATION_RISK: CertificationRiskInfo = {
  rating: "Medium",
  likelihood: 3,
  impact: 4,
  score: 12,
  keyRisk: "Delay in renewal due to audit findings and corrective actions.",
  mitigation: "Early audit preparation, regular internal audits, and timely closure of CAPA.",
};

// Certifications by Category Donut Data (Section 11)
export const CATEGORY_BREAKDOWN = [
  { name: "Quality", value: 6, color: "#3b82f6" },
  { name: "Safety", value: 3, color: "#06b6d4" },
  { name: "Environmental", value: 2, color: "#10b981" },
  { name: "Product", value: 4, color: "#f59e0b" },
  { name: "Cybersecurity", value: 2, color: "#8b5cf6" },
  { name: "Others", value: 1, color: "#ec4899" },
];

// 22 Controlled Reports from Section 44
export const CONTROLLED_CERT_REPORTS: ControlledCertReport[] = [
  {
    id: "REP-CERT-001",
    code: "CR-001",
    title: "Certification Register",
    category: "Inventory",
    purpose: "Master inventory of all management system, product, process, facility, and personnel certifications",
    periodicity: "Real-time",
    recordsCount: 18,
    lastGenerated: "25-Sep-2026 14:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CERT-002",
    code: "ACR-002",
    title: "Active Certification Report",
    category: "Inventory",
    purpose: "Verification of all active, valid, and customer-disclosed certificates across facilities",
    periodicity: "Monthly",
    recordsCount: 12,
    lastGenerated: "20-Sep-2026 11:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-003",
    code: "CP-003",
    title: "Certification Pipeline Report",
    category: "Readiness & Gap",
    purpose: "Status of initial certifications, scope extensions, and new scheme implementations",
    periodicity: "Monthly",
    recordsCount: 4,
    lastGenerated: "22-Sep-2026 16:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-004",
    code: "CER-004",
    title: "Certification Expiry Report",
    category: "Renewal & Surveillance",
    purpose: "Early warning alerts categorized by 180, 120, 90, 60, and 30-day thresholds",
    periodicity: "Real-time",
    recordsCount: 3,
    lastGenerated: "25-Sep-2026 09:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CERT-005",
    code: "CRR-005",
    title: "Certification Renewal Report",
    category: "Renewal & Surveillance",
    purpose: "Recertification audit schedules, renewal applications, and certificate transitions",
    periodicity: "Monthly",
    recordsCount: 3,
    lastGenerated: "18-Sep-2026 10:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-006",
    code: "CRR-006",
    title: "Certification Readiness Report",
    category: "Readiness & Gap",
    purpose: "Stage-gate readiness assessment across governance, documentation, testing, and training",
    periodicity: "Monthly",
    recordsCount: 6,
    lastGenerated: "19-Sep-2026 15:10",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-007",
    code: "GAR-007",
    title: "Gap Assessment Report",
    category: "Readiness & Gap",
    purpose: "Clause-by-clause standard conformance gaps and closure progress",
    periodicity: "Monthly",
    recordsCount: 8,
    lastGenerated: "15-Sep-2026 14:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-008",
    code: "AR-008",
    title: "Audit Report",
    category: "Audit & Testing",
    purpose: "External certification body audit summaries, Stage 1/Stage 2 assessments, and closing letters",
    periodicity: "Quarterly",
    recordsCount: 7,
    lastGenerated: "12-Sep-2026 16:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CERT-009",
    code: "AFR-009",
    title: "Audit Finding Report",
    category: "Audit & Testing",
    purpose: "Categorized major non-conformities, minor non-conformities, and opportunities for improvement",
    periodicity: "Quarterly",
    recordsCount: 11,
    lastGenerated: "10-Sep-2026 17:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-010",
    code: "CAPAR-010",
    title: "CAPA Report",
    category: "Audit & Testing",
    purpose: "Root cause analysis, corrective actions, and effectiveness verifications for audit findings",
    periodicity: "Real-time",
    recordsCount: 4,
    lastGenerated: "24-Sep-2026 11:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-011",
    code: "TR-011",
    title: "Testing Report",
    category: "Audit & Testing",
    purpose: "Product electrical safety, EMC, wireless power, and environmental testing results from accredited labs",
    periodicity: "Monthly",
    recordsCount: 14,
    lastGenerated: "21-Sep-2026 13:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CERT-012",
    code: "TFR-012",
    title: "Test Failure Report",
    category: "Audit & Testing",
    purpose: "Analysis of failed laboratory test parameters, engineering modifications, and retest records",
    periodicity: "Real-time",
    recordsCount: 1,
    lastGenerated: "22-Sep-2026 12:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-013",
    code: "CFR-013",
    title: "Certificate Register",
    category: "Inventory",
    purpose: "Controlled repository of official certificates, numbers, validity windows, and accredited seals",
    periodicity: "Real-time",
    recordsCount: 18,
    lastGenerated: "25-Sep-2026 15:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CERT-014",
    code: "SR-014",
    title: "Scope Report",
    category: "Inventory",
    purpose: "Cross-mapping of certified scopes across products, processes, business units, and global sites",
    periodicity: "Quarterly",
    recordsCount: 18,
    lastGenerated: "14-Sep-2026 10:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-015",
    code: "CBR-015",
    title: "Certification Body Report",
    category: "Inventory",
    purpose: "Performance, fees, contracts, and schemes managed by TÜV SÜD, UL, DNV, BSI, and Bureau Veritas",
    periodicity: "Quarterly",
    recordsCount: 5,
    lastGenerated: "08-Sep-2026 14:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-016",
    code: "LR-016",
    title: "Laboratory Report",
    category: "Audit & Testing",
    purpose: "Accreditation scopes (ISO/IEC 17025), test capabilities, and lead times of third-party laboratories",
    periodicity: "Quarterly",
    recordsCount: 6,
    lastGenerated: "05-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-017",
    code: "SRR-017",
    title: "Standard Revision Report",
    category: "Readiness & Gap",
    purpose: "Tracking transitions to revised ISO, IEC, IEEE, and SAE standards and impact deadlines",
    periodicity: "Monthly",
    recordsCount: 9,
    lastGenerated: "20-Sep-2026 17:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CERT-018",
    code: "CRR-018",
    title: "Certification Risk Report",
    category: "Risk & Financial",
    purpose: "5x5 exposure scores from non-conformities, surveillance failures, or standard deprecations",
    periodicity: "Monthly",
    recordsCount: 12,
    lastGenerated: "23-Sep-2026 18:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CERT-019",
    code: "CCR-019",
    title: "Certification Cost Report",
    category: "Risk & Financial",
    purpose: "Audit of certification body fees, lab testing expenditures, surveillance dues, and consultant costs",
    periodicity: "Quarterly",
    recordsCount: 18,
    lastGenerated: "01-Sep-2026 11:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CERT-020",
    code: "SR-020",
    title: "Surveillance Report",
    category: "Renewal & Surveillance",
    purpose: "Annual surveillance cycle tracking, preparation checklists, and continuation confirmations",
    periodicity: "Monthly",
    recordsCount: 8,
    lastGenerated: "21-Sep-2026 14:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-021",
    code: "RCR-021",
    title: "Recertification Report",
    category: "Renewal & Surveillance",
    purpose: "Triennial recertification project tracking, major audit preparation, and scope re-evaluation",
    periodicity: "Quarterly",
    recordsCount: 4,
    lastGenerated: "17-Sep-2026 09:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CERT-022",
    code: "ACIR-022",
    title: "AI Certification Intelligence Report",
    category: "AI & Governance",
    purpose: "Predictive gap analysis, audit finding pattern detection, and automated clause-to-evidence mappings",
    periodicity: "Real-time",
    recordsCount: 18,
    lastGenerated: "25-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
];

// Section 45: Certification KPI Master
export const CERTIFICATION_KPI_MASTER: CertificationKPIMetric[] = [
  // Portfolio
  {
    id: "KPI-001",
    domain: "Portfolio",
    metric: "Total Certifications Governed",
    target: "100%",
    actual: "18 / 18",
    variance: "0%",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-002",
    domain: "Portfolio",
    metric: "Active Certified Holdings Ratio",
    target: "≥ 75%",
    actual: "66.7% (12/18)",
    variance: "-8.3%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-003",
    domain: "Portfolio",
    metric: "Expired Certifications",
    target: "0",
    actual: "2",
    variance: "+2",
    trend: "down",
    status: "Critical",
  },
  // Readiness
  {
    id: "KPI-004",
    domain: "Readiness",
    metric: "Overall Certification Readiness %",
    target: "≥ 90%",
    actual: "94.0%",
    variance: "+4.0%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-005",
    domain: "Readiness",
    metric: "Audit Gap Closure Rate",
    target: "100%",
    actual: "91.8%",
    variance: "-8.2%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-006",
    domain: "Readiness",
    metric: "Evidence Documentation Completeness",
    target: "100%",
    actual: "98.5%",
    variance: "-1.5%",
    trend: "up",
    status: "Optimal",
  },
  // Audit
  {
    id: "KPI-007",
    domain: "Audit",
    metric: "External Audit Pass Rate",
    target: "100%",
    actual: "100%",
    variance: "0%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-008",
    domain: "Audit",
    metric: "Major Non-Conformities Incurred",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-009",
    domain: "Audit",
    metric: "Audit Finding On-Time Closure Rate",
    target: "100%",
    actual: "95.0%",
    variance: "-5.0%",
    trend: "up",
    status: "Optimal",
  },
  // Testing
  {
    id: "KPI-010",
    domain: "Testing",
    metric: "Accredited Lab Test First-Time Pass Rate",
    target: "≥ 90%",
    actual: "92.8%",
    variance: "+2.8%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-011",
    domain: "Testing",
    metric: "Testing Laboratory Turnaround Time",
    target: "≤ 21 days",
    actual: "18.5 days",
    variance: "-2.5 days",
    trend: "up",
    status: "Optimal",
  },
  // Renewal
  {
    id: "KPI-012",
    domain: "Renewal",
    metric: "On-Time Renewal & Surveillance Submission",
    target: "100%",
    actual: "96.2%",
    variance: "-3.8%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-013",
    domain: "Renewal",
    metric: "Recertification Lead Time Planning",
    target: "≥ 90 days",
    actual: "120 days",
    variance: "+30 days",
    trend: "up",
    status: "Optimal",
  },
  // Risk
  {
    id: "KPI-014",
    domain: "Risk",
    metric: "High Risk Certification Holdings",
    target: "≤ 2",
    actual: "1",
    variance: "-1",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-015",
    domain: "Risk",
    metric: "Open Overdue CAPA Actions",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  // Finance
  {
    id: "KPI-016",
    domain: "Finance",
    metric: "Certification & Testing Budget Variance",
    target: "≤ ±5%",
    actual: "-3.2%",
    variance: "Within Budget",
    trend: "neutral",
    status: "Optimal",
  },
];

// Sample Inventory for Live Table View
export const SAMPLE_CERTIFICATIONS_INVENTORY = [
  {
    id: "CERT-2026-001",
    code: "ISO-9001-001",
    name: "ISO 9001:2015 Quality Management",
    type: "Management System",
    category: "Quality",
    standard: "ISO 9001:2015",
    body: "TÜV SÜD",
    expiry: "31-Dec-2026",
    status: "Certified",
  },
  {
    id: "CERT-2026-002",
    code: "ISO-14001-002",
    name: "ISO 14001:2015 Environmental Management",
    type: "Management System",
    category: "Environmental",
    standard: "ISO 14001:2015",
    body: "DNV GL",
    expiry: "30-Nov-2026",
    status: "In Progress",
  },
  {
    id: "CERT-2026-003",
    code: "ISO-45001-003",
    name: "ISO 45001:2018 Occupational Health & Safety",
    type: "Management System",
    category: "Safety",
    standard: "ISO 45001:2018",
    body: "TÜV Rheinland",
    expiry: "15-Oct-2026",
    status: "Planned",
  },
  {
    id: "CERT-2026-004",
    code: "ISO-27001-004",
    name: "ISO 27001:2022 Information Security",
    type: "Management System",
    category: "Cybersecurity",
    standard: "ISO 27001:2022",
    body: "BSI Group",
    expiry: "20-Aug-2026",
    status: "Gap Assessment",
  },
  {
    id: "CERT-2026-005",
    code: "IEC-61851-005",
    name: "IEC 61851-1 EV Conductive Charging System",
    type: "Product",
    category: "Product",
    standard: "IEC 61851-1",
    body: "UL Solutions",
    expiry: "15-May-2027",
    status: "Certified",
  },
  {
    id: "CERT-2026-006",
    code: "SAE-J2954-006",
    name: "SAE J2954 Wireless Power Transfer for EVs",
    type: "Product",
    category: "Product",
    standard: "SAE J2954",
    body: "TÜV SÜD",
    expiry: "10-Jun-2027",
    status: "Certified",
  },
  {
    id: "CERT-2026-007",
    code: "IATF-16949-007",
    name: "IATF 16949:2016 Automotive Quality",
    type: "Process",
    category: "Quality",
    standard: "IATF 16949",
    body: "Bureau Veritas",
    expiry: "30-Sep-2026",
    status: "Expiring",
  },
  {
    id: "CERT-2026-008",
    code: "CE-RED-008",
    name: "CE Marking - Radio Equipment Directive (RED)",
    type: "Product",
    category: "Product",
    standard: "EN 301 489",
    body: "Nemko",
    expiry: "01-Feb-2026",
    status: "Expired",
  },
];

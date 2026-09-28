// Magnertia ERP - Compliance Reporting Service
// Management -> Quality Management / Risk Management -> Compliance Reporting
// Master Data, Reporting Register, Linked Requirements, Evidence, Controlled Audit Reports & KPIs

export interface ComplianceReportingRecord {
  reportId: string;
  reportNumber: string;
  reportDate: string;
  reportType: "Regulatory" | "Statutory" | "ISO" | "Legal" | "Internal" | "Customer";
  reportCategory: "Statutory Filing" | "Government Return" | "Declaration" | "Disclosure" | "Audit Report" | "Incident Report" | "Environmental" | "Tax Return";
  reportTitle: string;
  complianceRequirement: string;
  requirementVersion: string;
  organization: string;
  plantSite: string;
  department: string;
  process: string;
  responsibleOwner: {
    name: string;
    initials: string;
    email: string;
  };
  reviewer: {
    name: string;
    initials: string;
    email: string;
  };
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Draft" | "Preparing" | "Review" | "Approved" | "Submitted" | "Accepted" | "Overdue" | "Closed";
  confidentiality: "Internal" | "Confidential" | "Restricted";
  version: string;

  // Section 2: Reporting Period & Schedule
  reportingPeriodType: "Monthly" | "Quarterly" | "Half-Yearly" | "Annual" | "Event-based";
  periodMonth: string;
  periodYear: string;
  periodStartDate: string;
  periodEndDate: string;
  submissionDueDate: string;
  frequency: string;

  // Section 3: Submission Information
  issuingAuthority: string;
  submissionMethod: "Government Portal" | "Authority Portal" | "Email" | "API" | "Physical Submission" | "Customer Portal";
  submissionDate: string;
  submissionReference: string;
  acknowledgementNo: string;
  acceptanceStatus: "Not Submitted" | "Submitted" | "Acknowledged" | "Accepted" | "Rejected";
  resubmissionRequired: "No" | "Yes";
}

export interface ComplianceReportingKPI {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  color: "blue" | "emerald" | "amber" | "red" | "purple";
  subtext: string;
}

export interface LinkedRequirementItem {
  reqId: string;
  requirementName: string;
  type: string;
  authority: string;
  frequency: string;
  status: "Applicable" | "Partially Applicable" | "Not Applicable";
}

export interface AttachedEvidenceItem {
  id: string;
  documentName: string;
  type: "Working File" | "Supporting Document" | "Reference" | "Filing Receipt" | "Certificate";
  version: string;
  uploadDate: string;
  status: "Draft" | "Valid" | "Expired";
}

export interface RecentReportItem {
  reportNo: string;
  title: string;
  type: "Statutory" | "Regulatory" | "ISO" | "Customer" | "Legal" | "Internal";
  period: string;
  dueDate: string;
  status: "Preparing" | "Submitted" | "In Review" | "Overdue" | "Approved";
}

export interface CategoryDistributionItem {
  category: string;
  count: number;
  color: string;
}

export interface ControlledReportingReport {
  id: string;
  code: string;
  title: string;
  category: "Statutory & Filings" | "Quality & ISO" | "Submissions & Timelines" | "Evidence & Exceptions" | "AI & Performance";
  purpose: string;
  periodicity: "Real-time" | "Monthly" | "Quarterly" | "Annual";
  recordsCount: number;
  lastGenerated: string;
  downloadFormat: "PDF / Excel / CSV";
  status: "Certified" | "Active";
}

export interface ComplianceReportingKPIMetric {
  id: string;
  domain: "Reporting Performance" | "Compliance Rate" | "Reporting Quality" | "Risk & Exceptions" | "Corrective Actions";
  metric: string;
  target: string;
  actual: string;
  variance: string;
  trend: "up" | "down" | "neutral";
  status: "Optimal" | "Good" | "Attention" | "Critical";
}

// Primary Record from Screenshot
export const PRIMARY_COMPLIANCE_REPORT: ComplianceReportingRecord = {
  reportId: "REP-2026-0042",
  reportNumber: "CR-2026-017",
  reportDate: "19-Sep-2026",
  reportType: "Regulatory",
  reportCategory: "Statutory Filing",
  reportTitle: "GST Return - August 2026",
  complianceRequirement: "Goods and Services Tax Act, 2017",
  requirementVersion: "2024 Amendment",
  organization: "Magnertia Private Limited",
  plantSite: "Coimbatore - Development Centre",
  department: "Finance",
  process: "Tax Compliance",
  responsibleOwner: {
    name: "Ramesh S",
    initials: "RS",
    email: "ramesh.s@magnertia.com",
  },
  reviewer: {
    name: "Priya Sharma",
    initials: "PS",
    email: "priya.sharma@magnertia.com",
  },
  priority: "Medium",
  status: "Preparing",
  confidentiality: "Internal",
  version: "1.0",
  reportingPeriodType: "Monthly",
  periodMonth: "August",
  periodYear: "2026",
  periodStartDate: "01-Aug-2026",
  periodEndDate: "31-Aug-2026",
  submissionDueDate: "20-Sep-2026",
  frequency: "Monthly",
  issuingAuthority: "GST Portal (CBIC)",
  submissionMethod: "Government Portal",
  submissionDate: "—",
  submissionReference: "—",
  acknowledgementNo: "—",
  acceptanceStatus: "Not Submitted",
  resubmissionRequired: "No",
};

// 5 Top Executive KPIs from Screenshot
export const COMPLIANCE_REPORTING_KPIS: ComplianceReportingKPI[] = [
  {
    id: "total",
    label: "Total Reports",
    value: 42,
    change: "↑ +20%",
    trend: "up",
    color: "blue",
    subtext: "Across regulatory, tax, ISO & customer mandates",
  },
  {
    id: "submitted",
    label: "Submitted",
    value: 27,
    change: "↑ 17%",
    trend: "up",
    color: "emerald",
    subtext: "Formally acknowledged by statutory authorities",
  },
  {
    id: "in-preparation",
    label: "In Preparation",
    value: 11,
    change: "↓ -8%",
    trend: "down",
    color: "amber",
    subtext: "Active data compilation & evidence review",
  },
  {
    id: "overdue",
    label: "Overdue",
    value: 4,
    change: "↓ -33%",
    trend: "down",
    color: "red",
    subtext: "Overdue reports under urgent management notice",
  },
  {
    id: "compliance",
    label: "Submission Compliance",
    value: "90.5%",
    change: "↑ 5%",
    trend: "up",
    color: "purple",
    subtext: "On-time statutory submission execution rate",
  },
];

// Section 4: Compliance Status Donut Data
export const COMPLIANCE_STATUS_DATA = [
  { name: "Submitted", value: 27, percentage: "64%", color: "#10b981" },
  { name: "In Preparation", value: 11, percentage: "26%", color: "#f59e0b" },
  { name: "Overdue", value: 4, percentage: "10%", color: "#ef4444" },
];

// Section 5: Key Dates
export const REPORTING_KEY_DATES = [
  { label: "Report Date", date: "19-Sep-2026", alert: false },
  { label: "Period End", date: "31-Aug-2026", alert: false },
  { label: "Submission Due", date: "20-Sep-2026", alert: true },
  { label: "Review Due", date: "18-Sep-2026", alert: false },
  { label: "Approval Due", date: "19-Sep-2026", alert: false },
];

// Section 7: Linked Requirements
export const LINKED_REQUIREMENTS: LinkedRequirementItem[] = [
  {
    reqId: "REQ-001",
    requirementName: "GST Return Filing",
    type: "Regulation",
    authority: "CBIC",
    frequency: "Monthly",
    status: "Applicable",
  },
  {
    reqId: "REQ-015",
    requirementName: "TDS Return",
    type: "Regulation",
    authority: "Income Tax Dept.",
    frequency: "Quarterly",
    status: "Applicable",
  },
  {
    reqId: "REQ-032",
    requirementName: "PF Contribution",
    type: "Regulation",
    authority: "EPFO",
    frequency: "Monthly",
    status: "Applicable",
  },
];

// Section 8: Attached Documents & Evidence
export const ATTACHED_DOCUMENTS: AttachedEvidenceItem[] = [
  {
    id: "DOC-REP-01",
    documentName: "GST_Working_Sheet.xlsx",
    type: "Working File",
    version: "1.0",
    uploadDate: "18-Sep-2026",
    status: "Draft",
  },
  {
    id: "DOC-REP-02",
    documentName: "Sales_Summary_Aug.pdf",
    type: "Supporting Document",
    version: "1.0",
    uploadDate: "18-Sep-2026",
    status: "Valid",
  },
  {
    id: "DOC-REP-03",
    documentName: "Input_Tax_Credit.pdf",
    type: "Supporting Document",
    version: "1.0",
    uploadDate: "18-Sep-2026",
    status: "Valid",
  },
  {
    id: "DOC-REP-04",
    documentName: "Previous_GSTR_1.pdf",
    type: "Reference",
    version: "1.0",
    uploadDate: "10-Aug-2026",
    status: "Valid",
  },
];

// Section 10: Recent Compliance Reports
export const RECENT_COMPLIANCE_REPORTS: RecentReportItem[] = [
  {
    reportNo: "CR-2026-017",
    title: "GST Return - August 2026",
    type: "Statutory",
    period: "Aug 2026",
    dueDate: "20-Sep-2026",
    status: "Preparing",
  },
  {
    reportNo: "CR-2026-016",
    title: "PF Contribution",
    type: "Statutory",
    period: "Aug 2026",
    dueDate: "15-Sep-2026",
    status: "Submitted",
  },
  {
    reportNo: "CR-2026-015",
    title: "Environmental Compliance",
    type: "Regulatory",
    period: "Q2 2026",
    dueDate: "30-Sep-2026",
    status: "In Review",
  },
  {
    reportNo: "CR-2026-014",
    title: "ISO Compliance Report",
    type: "ISO",
    period: "Q2 2026",
    dueDate: "15-Sep-2026",
    status: "Submitted",
  },
  {
    reportNo: "CR-2026-013",
    title: "Customer Compliance",
    type: "Customer",
    period: "Aug 2026",
    dueDate: "25-Sep-2026",
    status: "Overdue",
  },
];

// Section 11: Compliance Reports by Category
export const CATEGORY_BAR_DATA: CategoryDistributionItem[] = [
  { category: "Regulatory", count: 14, color: "#3b82f6" },
  { category: "Statutory", count: 8, color: "#10b981" },
  { category: "ISO", count: 6, color: "#f97316" },
  { category: "Legal", count: 5, color: "#ef4444" },
  { category: "Environmental", count: 4, color: "#14b8a6" },
  { category: "Customer", count: 3, color: "#f43f5e" },
  { category: "Internal", count: 2, color: "#8b5cf6" },
];

// Section 12: AI Compliance Insights
export const AI_COMPLIANCE_INSIGHTS = [
  { id: "1", text: "1 report is overdue. Immediate action required.", type: "critical", color: "red" },
  { id: "2", text: "GST filing due in 1 day.", type: "warning", color: "amber" },
  { id: "3", text: "Evidence completeness is 85% for August reports.", type: "success", color: "emerald" },
  { id: "4", text: "Consider auto-fetching data from Finance module for future filings.", type: "info", color: "blue" },
  { id: "5", text: "No major compliance risks detected.", type: "neutral", color: "purple" },
];

// Section 20: 25 Controlled Compliance Reports
export const CONTROLLED_REPORTING_REPORTS: ControlledReportingReport[] = [
  {
    id: "REP-CR-001",
    code: "CRR-001",
    title: "Compliance Reporting Register",
    category: "Statutory & Filings",
    purpose: "Comprehensive inventory of all planned, in-progress, approved, and submitted compliance reports",
    periodicity: "Real-time",
    recordsCount: 42,
    lastGenerated: "25-Sep-2026 15:40",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-002",
    code: "CSR-002",
    title: "Compliance Status Report",
    category: "Statutory & Filings",
    purpose: "Summary of current reporting status across statutory, regulatory, environmental, and tax mandates",
    periodicity: "Monthly",
    recordsCount: 42,
    lastGenerated: "22-Sep-2026 10:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CR-003",
    code: "RRR-003",
    title: "Regulatory Reporting Report",
    category: "Statutory & Filings",
    purpose: "Dedicated statutory filing records submitted to CBIC, EPFO, MCA, and Pollution Boards",
    periodicity: "Monthly",
    recordsCount: 14,
    lastGenerated: "24-Sep-2026 11:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-004",
    code: "SFR-004",
    title: "Statutory Filing Report",
    category: "Statutory & Filings",
    purpose: "Official tracking of mandated government returns, registers, and statutory payment filings",
    periodicity: "Monthly",
    recordsCount: 8,
    lastGenerated: "20-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CR-005",
    code: "RSR-005",
    title: "Return Submission Report",
    category: "Statutory & Filings",
    purpose: "Quarterly and annual tax and labour return filings with digital authority acknowledgement keys",
    periodicity: "Quarterly",
    recordsCount: 22,
    lastGenerated: "25-Sep-2026 12:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-006",
    code: "DR-006",
    title: "Declaration & Disclosure Report",
    category: "Statutory & Filings",
    purpose: "Mandated legal declarations, conflict of interest disclosures, and director compliance statements",
    periodicity: "Annual",
    recordsCount: 6,
    lastGenerated: "18-Sep-2026 14:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CR-007",
    code: "IRR-007",
    title: "Incident & Environmental Reporting Report",
    category: "Statutory & Filings",
    purpose: "Hazardous waste manifests, air emission logs, water test results, and safety incident notifications",
    periodicity: "Real-time",
    recordsCount: 4,
    lastGenerated: "25-Sep-2026 09:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-008",
    code: "TCR-008",
    title: "Tax Compliance Report",
    category: "Statutory & Filings",
    purpose: "Reconciliation of GST, TDS, advance corporate tax, and cross-border customs declarations",
    periodicity: "Monthly",
    recordsCount: 12,
    lastGenerated: "24-Sep-2026 17:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-009",
    code: "CCR-009",
    title: "Customer & OEM Compliance Report",
    category: "Quality & ISO",
    purpose: "Automotive and industrial OEM compliance declarations, PPAP certificates, and CoCs",
    periodicity: "Quarterly",
    recordsCount: 3,
    lastGenerated: "21-Sep-2026 15:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CR-010",
    code: "ISO-CR-010",
    title: "ISO Management System Compliance Report",
    category: "Quality & ISO",
    purpose: "Internal audit results, management review minutes, and clause conformity documentation",
    periodicity: "Quarterly",
    recordsCount: 6,
    lastGenerated: "25-Sep-2026 10:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-011",
    code: "PDR-011",
    title: "Pending & In-Preparation Report",
    category: "Submissions & Timelines",
    purpose: "Reports currently under data compilation, worksheet reconciliation, or department sign-off",
    periodicity: "Real-time",
    recordsCount: 11,
    lastGenerated: "25-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CR-012",
    code: "APR-012",
    title: "Approval Pending Report",
    category: "Submissions & Timelines",
    purpose: "Reports awaiting final digital sign-off from Department Head, Compliance Officer, or Director",
    periodicity: "Real-time",
    recordsCount: 5,
    lastGenerated: "25-Sep-2026 14:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CR-013",
    code: "SDR-013",
    title: "Submission Due & Calendar Report",
    category: "Submissions & Timelines",
    purpose: "Forward-looking 30/60/90-day statutory calendar detailing upcoming mandatory report deadlines",
    periodicity: "Monthly",
    recordsCount: 18,
    lastGenerated: "23-Sep-2026 11:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-014",
    code: "ODR-014",
    title: "Overdue Reporting Escalation Report",
    category: "Submissions & Timelines",
    purpose: "Immediate escalation log of reports exceeding statutory deadlines with legal risk assessments",
    periodicity: "Real-time",
    recordsCount: 4,
    lastGenerated: "25-Sep-2026 16:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-015",
    code: "RJR-015",
    title: "Rejected & Resubmission Report",
    category: "Evidence & Exceptions",
    purpose: "Submissions flagged for discrepancy by authorities, revision history, and remediation timelines",
    periodicity: "Real-time",
    recordsCount: 1,
    lastGenerated: "22-Sep-2026 13:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CR-016",
    code: "ECR-016",
    title: "Evidence Coverage & Verification Register",
    category: "Evidence & Exceptions",
    purpose: "Audit trail confirming 100% of reported figures are substantiated by unexpired digital proofs",
    periodicity: "Monthly",
    recordsCount: 42,
    lastGenerated: "25-Sep-2026 15:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-017",
    code: "RER-017",
    title: "Reporting Exception & Discrepancy Register",
    category: "Evidence & Exceptions",
    purpose: "Log of data exceptions, missing receipts, system mismatch calculations, and CAPA follow-ups",
    periodicity: "Monthly",
    recordsCount: 3,
    lastGenerated: "24-Sep-2026 12:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-CR-018",
    code: "SPR-018",
    title: "Submission Performance & SLA Report",
    category: "AI & Performance",
    purpose: "On-time submission percentages, average cycle time from data collection to authority filing",
    periodicity: "Monthly",
    recordsCount: 42,
    lastGenerated: "25-Sep-2026 16:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-019",
    code: "ARR-019",
    title: "Authority Response & Acknowledgement Report",
    category: "AI & Performance",
    purpose: "Archive of ARN numbers, official filing receipts, challans, and clearance letters from authorities",
    periodicity: "Real-time",
    recordsCount: 27,
    lastGenerated: "25-Sep-2026 11:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-CR-020",
    code: "AICR-020",
    title: "AI Compliance Reporting Intelligence Report",
    category: "AI & Performance",
    purpose: "Predictive deadline modeling, automated evidence completeness scoring, and discrepancy detection",
    periodicity: "Real-time",
    recordsCount: 42,
    lastGenerated: "25-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
];

// Section 21: Key KPIs Master
export const COMPLIANCE_REPORTING_KPI_MASTER: ComplianceReportingKPIMetric[] = [
  // Reporting Performance
  {
    id: "KPI-CR-01",
    domain: "Reporting Performance",
    metric: "On-Time Statutory Submission Rate",
    target: "≥ 95%",
    actual: "90.5%",
    variance: "-4.5%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-CR-02",
    domain: "Reporting Performance",
    metric: "Total Reports Completed & Submitted",
    target: "100%",
    actual: "64.3% (27/42)",
    variance: "On Track",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-CR-03",
    domain: "Reporting Performance",
    metric: "Average Report Preparation Cycle Time",
    target: "≤ 5 Days",
    actual: "3.8 Days",
    variance: "-1.2 Days",
    trend: "up",
    status: "Optimal",
  },
  // Compliance Rate
  {
    id: "KPI-CR-04",
    domain: "Compliance Rate",
    metric: "Regulatory Filings Conformance",
    target: "100%",
    actual: "100%",
    variance: "0%",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-CR-05",
    domain: "Compliance Rate",
    metric: "Statutory Labour & Tax Compliance",
    target: "100%",
    actual: "94.4%",
    variance: "-5.6%",
    trend: "up",
    status: "Good",
  },
  // Reporting Quality
  {
    id: "KPI-CR-06",
    domain: "Reporting Quality",
    metric: "Evidence Completeness Verification Rate",
    target: "100%",
    actual: "85.0%",
    variance: "-15.0%",
    trend: "up",
    status: "Attention",
  },
  {
    id: "KPI-CR-07",
    domain: "Reporting Quality",
    metric: "First-Time Authority Acceptance Rate",
    target: "≥ 98%",
    actual: "96.3%",
    variance: "-1.7%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-CR-08",
    domain: "Reporting Quality",
    metric: "Authority Rejection / Resubmission Rate",
    target: "≤ 2%",
    actual: "2.4%",
    variance: "+0.4%",
    trend: "down",
    status: "Good",
  },
  // Risk & Exceptions
  {
    id: "KPI-CR-09",
    domain: "Risk & Exceptions",
    metric: "Overdue Compliance Reports Count",
    target: "0",
    actual: "4",
    variance: "+4",
    trend: "down",
    status: "Attention",
  },
  {
    id: "KPI-CR-10",
    domain: "Risk & Exceptions",
    metric: "Late Filing Penalty or Notice Incurred",
    target: "₹0",
    actual: "₹0",
    variance: "₹0",
    trend: "neutral",
    status: "Optimal",
  },
  // Corrective Actions
  {
    id: "KPI-CR-11",
    domain: "Corrective Actions",
    metric: "Reporting Exception Closure Rate",
    target: "≥ 90%",
    actual: "92.0%",
    variance: "+2.0%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-CR-12",
    domain: "Corrective Actions",
    metric: "CAPA Initiated from Reporting Exceptions",
    target: "100%",
    actual: "100%",
    variance: "0%",
    trend: "neutral",
    status: "Optimal",
  },
];

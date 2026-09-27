// Magnertia ERP - Legal Register Service
// Management -> Risk Management -> Legal Register
// Master Data, Legal Obligations, Regulatory Authorities, Compliance Assessments & Controlled Audit Reports

export interface LegalRegisterRecord {
  legalRegisterId: string;
  legalCode: string;
  legalRequirementTitle: string;
  legalCategory: "Labour" | "Corporate" | "Tax" | "Environmental" | "Product" | "Safety" | "Cyber" | "Customs";
  jurisdiction: "Central" | "State" | "Local" | "International";
  country: string;
  stateRegion: string;
  regulatoryAuthority: string;
  lawRegulationNo: string;
  versionAmendment: string;
  businessFunction: string;
  department: string;
  process: string;
  legalOwner: {
    name: string;
    initials: string;
    email: string;
  };
  complianceCoordinator: {
    name: string;
    initials: string;
    email: string;
  };
  siteLocation: string;
  effectiveDate: string;
  reviewDate: string;
  status: "Active" | "Under Review" | "Repealed" | "Superseded";
  applicability: "Applicable" | "Partially Applicable" | "Not Applicable";
  complianceStatus: "Compliant" | "Partial" | "Gap" | "Non-Compliant";
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  requirementDescription: string;
  applicabilityDetail: string;
  complianceDeadline: string;
  scope: string;
  keyComplianceActions: string[];
  currentStatus: string;
}

export interface LegalObligationItem {
  id: string;
  obligation: string;
  frequency: "One Time" | "Daily" | "Weekly" | "Monthly" | "Annual" | "Continuous";
  dueDate: string;
  status: "Closed" | "Compliant" | "Due Soon" | "In Progress" | "Overdue";
}

export interface LegalAssessmentItem {
  id: string;
  date: string;
  assessor: string;
  result: "Compliant" | "Partial" | "Non-Compliant";
  findings: number;
}

export interface LegalRiskItem {
  id: string;
  risk: string;
  likelihood: number;
  impact: number;
  score: number;
  level: "Critical" | "High" | "Medium" | "Low";
}

export interface RegulatoryUpdateItem {
  id: string;
  date: string;
  title: string;
  authority: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  status: "Review" | "Action Required" | "Implemented";
}

export interface LegalDocumentItem {
  id: string;
  documentName: string;
  type: "Certificate" | "Document" | "Filing" | "Audit Report" | "License";
  version: string;
  uploadDate: string;
  status: "Valid" | "Expiring" | "Expired";
}

export interface ComplianceTrendPoint {
  date: string;
  compliance: number;
}

export interface ControlledLegalReport {
  id: string;
  code: string;
  title: string;
  category: "Inventory & Laws" | "Obligations & Deadlines" | "Audit & Inspection" | "CAPA & Gaps" | "Risk & Permits" | "AI & Governance";
  purpose: string;
  periodicity: "Real-time" | "Monthly" | "Quarterly" | "Annual";
  recordsCount: number;
  lastGenerated: string;
  downloadFormat: "PDF / Excel / CSV";
  status: "Certified" | "Active";
}

export interface LegalKPIMetric {
  id: string;
  domain: "Compliance" | "Obligations" | "Licenses" | "Audits" | "CAPA" | "Risk";
  metric: string;
  target: string;
  actual: string;
  variance: string;
  trend: "up" | "down" | "neutral";
  status: "Optimal" | "Good" | "Attention" | "Critical";
}

// Primary Record from Screenshot
export const PRIMARY_LEGAL_RECORD: LegalRegisterRecord = {
  legalRegisterId: "LR-2026-001",
  legalCode: "LAB-001",
  legalRequirementTitle: "Factories Act, 1948 - Registration",
  legalCategory: "Labour",
  jurisdiction: "Central",
  country: "India",
  stateRegion: "Tamil Nadu",
  regulatoryAuthority: "Chief Inspector of Factories",
  lawRegulationNo: "Factories Act, 1948",
  versionAmendment: "As amended 2022",
  businessFunction: "Manufacturing",
  department: "Operations",
  process: "Factory Operations",
  legalOwner: {
    name: "Ramesh S",
    initials: "RS",
    email: "ramesh.s@magnertia.com",
  },
  complianceCoordinator: {
    name: "Priya Sharma",
    initials: "PS",
    email: "priya.sharma@magnertia.com",
  },
  siteLocation: "Namakkal - Manufacturing Plant",
  effectiveDate: "01-Jan-2024",
  reviewDate: "01-Jan-2025",
  status: "Active",
  applicability: "Applicable",
  complianceStatus: "Compliant",
  riskLevel: "Medium",
  requirementDescription: "Registration of factory premises under the Factories Act, 1948 before commencement of manufacturing operations.",
  applicabilityDetail: "Applicable to all manufacturing facilities with 10 or more workers.",
  complianceDeadline: "Before commencement and on changes.",
  scope: "Manufacturing plant at Namakkal, including all production, maintenance and support functions.",
  keyComplianceActions: [
    "Register factory with Chief Inspector of Factories",
    "Display license at premises",
    "Maintain statutory records",
    "Submit periodic returns",
  ],
  currentStatus: "Compliant",
};

// Executive Top KPI Widgets (from Screenshot)
export const LEGAL_EXECUTIVE_KPIS = [
  {
    id: "total",
    label: "Total Requirements",
    value: 128,
    change: "↑ 12%",
    trend: "up" as const,
    color: "blue",
    subtext: "Across 8 central, state & municipal regimes",
  },
  {
    id: "compliant",
    label: "Compliant",
    value: 102,
    change: "↑ 8%",
    trend: "up" as const,
    color: "emerald",
    subtext: "Validated with statutory filings (80%)",
  },
  {
    id: "partial",
    label: "Partial Compliance",
    value: 14,
    change: "↑ 27%",
    trend: "up" as const,
    color: "amber",
    subtext: "Under active remediation (11%)",
  },
  {
    id: "non-compliant",
    label: "Non-Compliant",
    value: 12,
    change: "↓ 8%",
    trend: "down" as const,
    color: "red",
    subtext: "Identified gaps under legal review (9%)",
  },
  {
    id: "due",
    label: "Due in 30 Days",
    value: 18,
    change: "↑ 50%",
    trend: "up" as const,
    color: "purple",
    subtext: "Statutory returns & renewal deadlines",
  },
  {
    id: "risks",
    label: "Open Legal Risks",
    value: 6,
    change: "↓ 25%",
    trend: "down" as const,
    color: "teal",
    subtext: "Assessed regulatory penalty exposures",
  },
];

// Key Dates (Section 4)
export const LEGAL_KEY_DATES = [
  { label: "Effective Date", date: "01-Jan-2024" },
  { label: "Review Date", date: "01-Jan-2025" },
  { label: "Next Audit", date: "15-Mar-2025" },
  { label: "Compliance Due", date: "31-Mar-2025" },
  { label: "Last Reviewed", date: "10-Jan-2025" },
];

// Related Legal Obligations (Section 6)
export const RELATED_OBLIGATIONS: LegalObligationItem[] = [
  {
    id: "OB-001",
    obligation: "Factory Registration",
    frequency: "One Time",
    dueDate: "Completed",
    status: "Closed",
  },
  {
    id: "OB-002",
    obligation: "Maintain Register of Workers",
    frequency: "Daily",
    dueDate: "—",
    status: "Compliant",
  },
  {
    id: "OB-003",
    obligation: "Submit Annual Return",
    frequency: "Annual",
    dueDate: "31-Mar-2025",
    status: "Due Soon",
  },
  {
    id: "OB-004",
    obligation: "Safety Audit",
    frequency: "Annual",
    dueDate: "15-Mar-2025",
    status: "In Progress",
  },
  {
    id: "OB-005",
    obligation: "Display License",
    frequency: "Continuous",
    dueDate: "—",
    status: "Compliant",
  },
];

// Recent Compliance Assessments (Section 7)
export const RECENT_ASSESSMENTS: LegalAssessmentItem[] = [
  {
    id: "ASS-001",
    date: "10-Jan-2025",
    assessor: "Priya Sharma",
    result: "Compliant",
    findings: 0,
  },
  {
    id: "ASS-002",
    date: "15-Jun-2024",
    assessor: "Ramesh S",
    result: "Compliant",
    findings: 0,
  },
  {
    id: "ASS-003",
    date: "12-Jan-2024",
    assessor: "External Auditor",
    result: "Partial",
    findings: 2,
  },
  {
    id: "ASS-004",
    date: "05-Jul-2023",
    assessor: "Priya Sharma",
    result: "Compliant",
    findings: 0,
  },
];

// Legal Risk Matrix (Section 8)
export const LEGAL_RISK_ITEMS: LegalRiskItem[] = [
  {
    id: "RSK-001",
    risk: "Non-registration",
    likelihood: 2,
    impact: 5,
    score: 10,
    level: "High",
  },
  {
    id: "RSK-002",
    risk: "Penalty for non-compliance",
    likelihood: 3,
    impact: 4,
    score: 12,
    level: "High",
  },
  {
    id: "RSK-003",
    risk: "Operational shutdown",
    likelihood: 2,
    impact: 4,
    score: 8,
    level: "Medium",
  },
  {
    id: "RSK-004",
    risk: "Reputational impact",
    likelihood: 3,
    impact: 3,
    score: 9,
    level: "Medium",
  },
  {
    id: "RSK-005",
    risk: "Regulatory scrutiny",
    likelihood: 4,
    impact: 2,
    score: 8,
    level: "Medium",
  },
];

// Regulatory Updates (Section 9)
export const REGULATORY_UPDATES: RegulatoryUpdateItem[] = [
  {
    id: "UPD-001",
    date: "15-Dec-2024",
    title: "Amendment to Factories Rules",
    authority: "Govt. of India",
    impact: "Medium",
    status: "Review",
  },
  {
    id: "UPD-002",
    date: "10-Sep-2024",
    title: "Safety Compliance Circular",
    authority: "Chief Inspector",
    impact: "High",
    status: "Action Required",
  },
  {
    id: "UPD-003",
    date: "05-Apr-2024",
    title: "Digital Filing Mandate",
    authority: "Labour Dept.",
    impact: "Medium",
    status: "Implemented",
  },
];

// Documents & Evidence (Section 10)
export const LEGAL_DOCUMENTS: LegalDocumentItem[] = [
  {
    id: "DOC-001",
    documentName: "Factory Registration Certificate",
    type: "Certificate",
    version: "1.2",
    uploadDate: "01-Jan-2024",
    status: "Valid",
  },
  {
    id: "DOC-002",
    documentName: "Site Layout Plan",
    type: "Document",
    version: "1.0",
    uploadDate: "15-Jan-2024",
    status: "Valid",
  },
  {
    id: "DOC-003",
    documentName: "Annual Return",
    type: "Filing",
    version: "1.0",
    uploadDate: "31-Mar-2024",
    status: "Valid",
  },
  {
    id: "DOC-004",
    documentName: "Safety Audit Report",
    type: "Audit Report",
    version: "1.0",
    uploadDate: "15-Mar-2024",
    status: "Valid",
  },
];

// Compliance Trend (Section 11)
export const COMPLIANCE_TREND_DATA: ComplianceTrendPoint[] = [
  { date: "Jan-24", compliance: 75 },
  { date: "Apr-24", compliance: 77 },
  { date: "Jul-24", compliance: 79 },
  { date: "Oct-24", compliance: 79 },
  { date: "Jan-25", compliance: 80 },
];

// 18 Controlled Reports from Section 32
export const CONTROLLED_LEGAL_REPORTS: ControlledLegalReport[] = [
  {
    id: "REP-LEG-001",
    code: "LR-001",
    title: "Legal Register",
    category: "Inventory & Laws",
    purpose: "Master inventory of all central, state, and local statutes, acts, rules, and statutory notifications",
    periodicity: "Real-time",
    recordsCount: 128,
    lastGenerated: "25-Sep-2026 14:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LEG-002",
    code: "ALR-002",
    title: "Applicable Law Register",
    category: "Inventory & Laws",
    purpose: "Filter of directly enforceable acts mapped across manufacturing, labour, EHS, and tax domains",
    periodicity: "Monthly",
    recordsCount: 84,
    lastGenerated: "20-Sep-2026 11:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LEG-003",
    code: "LOR-003",
    title: "Legal Obligation Register",
    category: "Obligations & Deadlines",
    purpose: "Detailed record of 240+ recurring, periodic, and transactional compliance obligations",
    periodicity: "Real-time",
    recordsCount: 242,
    lastGenerated: "25-Sep-2026 10:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LEG-004",
    code: "RAR-004",
    title: "Regulatory Authority Register",
    category: "Inventory & Laws",
    purpose: "Directory of issuing authorities, submission portals, regional offices, and designated nodal officers",
    periodicity: "Quarterly",
    recordsCount: 28,
    lastGenerated: "18-Sep-2026 10:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LEG-005",
    code: "LCR-005",
    title: "Legal Compliance Report",
    category: "Inventory & Laws",
    purpose: "Executive summary of statutory compliance percentages, compliant obligations, and risk levels",
    periodicity: "Monthly",
    recordsCount: 128,
    lastGenerated: "22-Sep-2026 16:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LEG-006",
    code: "LGR-006",
    title: "Legal Gap Report",
    category: "CAPA & Gaps",
    purpose: "Identification and action tracking for 12 non-compliant conditions and 14 partial requirements",
    periodicity: "Real-time",
    recordsCount: 26,
    lastGenerated: "25-Sep-2026 09:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LEG-007",
    code: "LRR-007",
    title: "Legal Risk Report",
    category: "Risk & Permits",
    purpose: "5×5 risk assessments detailing legal exposure, potential penalty calculations, and mitigations",
    periodicity: "Monthly",
    recordsCount: 18,
    lastGenerated: "19-Sep-2026 15:10",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LEG-008",
    code: "LPR-008",
    title: "License & Permit Report",
    category: "Risk & Permits",
    purpose: "Current status, validity windows, conditions, and renewal pipelines for all factory & commercial permits",
    periodicity: "Real-time",
    recordsCount: 28,
    lastGenerated: "24-Sep-2026 11:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LEG-009",
    code: "FCR-009",
    title: "Filing Compliance Report",
    category: "Obligations & Deadlines",
    purpose: "Statutory returns, tax filings, environmental manifests, and labour returns filed with authorities",
    periodicity: "Monthly",
    recordsCount: 52,
    lastGenerated: "21-Sep-2026 13:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LEG-010",
    code: "RIR-010",
    title: "Regulatory Inspection Report",
    category: "Audit & Inspection",
    purpose: "Logs of government inspectorate visits, documents scrutinized, formal findings, and closure notices",
    periodicity: "Quarterly",
    recordsCount: 8,
    lastGenerated: "15-Sep-2026 14:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LEG-011",
    code: "LAR-011",
    title: "Legal Audit Report",
    category: "Audit & Inspection",
    purpose: "Internal and external statutory compliance audit results, sample testing, and legal opinions",
    periodicity: "Quarterly",
    recordsCount: 4,
    lastGenerated: "12-Sep-2026 16:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LEG-012",
    code: "NCR-012",
    title: "Non-Compliance Report",
    category: "CAPA & Gaps",
    purpose: "Escalated non-compliance notices, penalty notices, and root cause investigations",
    periodicity: "Real-time",
    recordsCount: 3,
    lastGenerated: "22-Sep-2026 12:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LEG-013",
    code: "CAPAR-013",
    title: "CAPA Report",
    category: "CAPA & Gaps",
    purpose: "Corrective and preventive action tracking for legal findings with target dates and evidence links",
    periodicity: "Real-time",
    recordsCount: 14,
    lastGenerated: "25-Sep-2026 12:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LEG-014",
    code: "RCR-014",
    title: "Regulatory Change Report",
    category: "Inventory & Laws",
    purpose: "Impact assessments for newly gazetted laws, rule amendments, and statutory circulars",
    periodicity: "Monthly",
    recordsCount: 11,
    lastGenerated: "20-Sep-2026 17:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LEG-015",
    code: "LC-015",
    title: "Legal Calendar",
    category: "Obligations & Deadlines",
    purpose: "Chronological schedule of statutory filings, inspections, renewals, and legal reviews",
    periodicity: "Real-time",
    recordsCount: 64,
    lastGenerated: "25-Sep-2026 09:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LEG-016",
    code: "ECR-016",
    title: "Evidence Coverage Report",
    category: "Audit & Inspection",
    purpose: "Audit trail verifying that every statutory obligation is backed by valid, unexpired documentary proof",
    periodicity: "Monthly",
    recordsCount: 128,
    lastGenerated: "22-Sep-2026 15:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LEG-017",
    code: "MLCR-017",
    title: "Management Legal Compliance Report",
    category: "AI & Governance",
    purpose: "Board of Directors compliance certificate and executive summary of legal risk posture",
    periodicity: "Quarterly",
    recordsCount: 1,
    lastGenerated: "14-Sep-2026 10:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LEG-018",
    code: "ALIR-018",
    title: "AI Legal Intelligence Report",
    category: "AI & Governance",
    purpose: "Automated legal change impact analysis, predictive non-compliance detection, and case law updates",
    periodicity: "Real-time",
    recordsCount: 128,
    lastGenerated: "25-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
];

// Section 33: Legal Compliance KPI Master
export const LEGAL_KPI_MASTER: LegalKPIMetric[] = [
  // Compliance
  {
    id: "KPI-001",
    domain: "Compliance",
    metric: "Overall Legal Compliance %",
    target: "100%",
    actual: "80.0%",
    variance: "-20.0%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-002",
    domain: "Compliance",
    metric: "Applicable Requirements Conformance",
    target: "100%",
    actual: "79.7% (102/128)",
    variance: "-20.3%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-003",
    domain: "Compliance",
    metric: "Critical Legal Non-Compliance Count",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  // Obligations
  {
    id: "KPI-004",
    domain: "Obligations",
    metric: "On-Time Statutory Filing Rate",
    target: "100%",
    actual: "96.5%",
    variance: "-3.5%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-005",
    domain: "Obligations",
    metric: "Overdue Statutory Obligations",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-006",
    domain: "Obligations",
    metric: "Obligations Due in Next 30 Days",
    target: "< 25",
    actual: "18",
    variance: "Within Target",
    trend: "neutral",
    status: "Optimal",
  },
  // Licenses
  {
    id: "KPI-007",
    domain: "Licenses",
    metric: "Active Statutory License Validity Ratio",
    target: "100%",
    actual: "96.4%",
    variance: "-3.6%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-008",
    domain: "Licenses",
    metric: "Expiring Licenses Under Renewal",
    target: "100%",
    actual: "100%",
    variance: "0%",
    trend: "neutral",
    status: "Optimal",
  },
  // Audits
  {
    id: "KPI-009",
    domain: "Audits",
    metric: "Statutory Audit Plan Execution %",
    target: "100%",
    actual: "100%",
    variance: "0%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-010",
    domain: "Audits",
    metric: "Repeat Legal Findings Ratio",
    target: "0%",
    actual: "0%",
    variance: "0%",
    trend: "neutral",
    status: "Optimal",
  },
  // CAPA
  {
    id: "KPI-011",
    domain: "CAPA",
    metric: "Legal CAPA On-Time Closure Rate",
    target: "≥ 90%",
    actual: "92.4%",
    variance: "+2.4%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-012",
    domain: "CAPA",
    metric: "Overdue Corrective Actions",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  // Risk
  {
    id: "KPI-013",
    domain: "Risk",
    metric: "High / Critical Legal Risk Exposures",
    target: "≤ 3",
    actual: "2",
    variance: "-1",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-014",
    domain: "Risk",
    metric: "Statutory Surcharge or Penalty Incurred",
    target: "₹0",
    actual: "₹0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
];

// Sample Inventory for Live Table View
export const SAMPLE_LEGAL_REGISTER = [
  {
    id: "LR-2026-001",
    code: "LAB-001",
    name: "Factories Act, 1948 - Registration",
    category: "Labour",
    authority: "Chief Inspector of Factories",
    location: "Namakkal Plant",
    risk: "Medium",
    status: "Compliant",
  },
  {
    id: "LR-2026-002",
    code: "TAX-GST-002",
    name: "Central Goods and Services Tax Act, 2017",
    category: "Tax",
    authority: "Central Board of Indirect Taxes and Customs",
    location: "Enterprise",
    risk: "High",
    status: "Compliant",
  },
  {
    id: "LR-2026-003",
    code: "ENV-PCB-003",
    name: "Air (Prevention & Control of Pollution) Act, 1981",
    category: "Environmental",
    authority: "Tamil Nadu Pollution Control Board",
    location: "Coimbatore & Namakkal",
    risk: "High",
    status: "Partial",
  },
  {
    id: "LR-2026-004",
    code: "LAB-PF-004",
    name: "Employees' Provident Funds and Miscellaneous Provisions Act",
    category: "Labour",
    authority: "Employees' Provident Fund Organisation",
    location: "Enterprise",
    risk: "Medium",
    status: "Compliant",
  },
  {
    id: "LR-2026-005",
    code: "CORP-MCA-005",
    name: "Companies Act, 2013 - Annual Filings & Governance",
    category: "Corporate",
    authority: "Ministry of Corporate Affairs",
    location: "Headquarters",
    risk: "High",
    status: "Compliant",
  },
  {
    id: "LR-2026-006",
    code: "PRD-BIS-006",
    name: "Bureau of Indian Standards Act, 2016",
    category: "Product",
    authority: "Bureau of Indian Standards",
    location: "Manufacturing & R&D",
    risk: "Medium",
    status: "Partial",
  },
  {
    id: "LR-2026-007",
    code: "CYB-DPDP-007",
    name: "Digital Personal Data Protection Act, 2023",
    category: "Cyber",
    authority: "Data Protection Board of India",
    location: "Enterprise",
    risk: "High",
    status: "Non-Compliant",
  },
];

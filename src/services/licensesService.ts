// Magnertia ERP - Licenses Service
// Management -> Risk Management -> Licenses
// Master Data, Classification, Inspection, Renewal & Controlled Audit Reports

export interface LicenseRecord {
  licenseId: string;
  licenseCode: string;
  licenseName: string;
  licenseType: "Business" | "Regulatory" | "Facility" | "Product" | "Software" | "Environmental" | "Manufacturing";
  licenseCategory: "Statutory" | "Operational" | "Professional" | "Environmental" | "Product" | "Trade";
  regulatoryDomain: "Local Authority" | "Central Government" | "State Government" | "Industry Regulator" | "International";
  regulatoryAuthority: string;
  businessFunction: string;
  department: string;
  process: string;
  licenseOwner: {
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
  status: "Active" | "Draft" | "Renewal" | "Expired" | "Suspended" | "Cancelled";
  priority: "Critical" | "High" | "Medium" | "Low";
  version: string;
  confidentiality: "Internal" | "Confidential" | "Restricted";
  requirement: string;
  businessActivity: string;
  jurisdiction: string;
  scope: string;
  keyConditions: string;
  currentStatus: string;
  daysRemaining: number;
}

export interface LinkedDocument {
  id: string;
  documentName: string;
  type: "License" | "Approval" | "Certificate" | "Agreement" | "Inspection Report";
  version: string;
  uploadDate: string;
  expiryDate: string;
  status: "Valid" | "Expiring Soon" | "Expired" | "Under Verification";
}

export interface ComplianceCondition {
  id: string;
  condition: string;
  monitoringFrequency: "Annual" | "Continuous" | "Quarterly" | "Monthly";
  status: "Compliant" | "On Track" | "Non-Compliant" | "Pending Review";
  lastChecked: string;
}

export interface RenewalHistory {
  id: string;
  type: "Original Issue" | "Renewal Application" | "Document Query" | "Inspection Clearance";
  date: string;
  referenceNo: string;
  status: "Approved" | "Submitted" | "Resolved" | "Under Review";
}

export interface InspectionRecord {
  id: string;
  date: string;
  type: "Inspection" | "Internal Audit" | "External Verification";
  inspector: string;
  findings: string;
  status: "Closed" | "Action Pending" | "Under Review";
}

export interface LicenseRiskInfo {
  rating: "Critical" | "High" | "Medium" | "Low";
  likelihood: number;
  impact: number;
  score: number;
  keyRisk: string;
  mitigation: string;
}

export interface ControlledLicenseReport {
  id: string;
  code: string;
  title: string;
  category: "Inventory" | "Renewal & Expiry" | "Compliance & Conditions" | "Audit & Inspection" | "Financial & Risk" | "AI & Governance";
  purpose: string;
  periodicity: "Real-time" | "Monthly" | "Quarterly" | "Annual";
  recordsCount: number;
  lastGenerated: string;
  downloadFormat: "PDF / Excel / CSV";
  status: "Active" | "Certified";
}

export interface LicenseKPIMetric {
  id: string;
  domain: "Portfolio" | "Renewal" | "Compliance" | "Applications" | "Risk" | "Finance";
  metric: string;
  target: string;
  actual: string;
  variance: string;
  trend: "up" | "down" | "neutral";
  status: "Optimal" | "Good" | "Attention" | "Critical";
}

// Active Primary Record from Screenshot
export const PRIMARY_LICENSE_RECORD: LicenseRecord = {
  licenseId: "LIC-2026-001",
  licenseCode: "TRD-CHN-001",
  licenseName: "Trade License - Coimbatore",
  licenseType: "Business",
  licenseCategory: "Statutory",
  regulatoryDomain: "Local Authority",
  regulatoryAuthority: "Coimbatore City Municipal Corporation",
  businessFunction: "Operations",
  department: "Administration",
  process: "Facility Management",
  licenseOwner: {
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
  location: "Coimbatore - Development Centre",
  issueDate: "01-Jan-2024",
  effectiveDate: "01-Jan-2024",
  expiryDate: "31-Dec-2026",
  renewalDueDate: "30-Sep-2026",
  status: "Active",
  priority: "High",
  version: "1.0",
  confidentiality: "Internal",
  requirement: "Required to operate business premises for office and R&D activities as per municipal regulations.",
  businessActivity: "Office and R&D Operations",
  jurisdiction: "Coimbatore (Local)",
  scope: "Use of commercial premises (Office, Lab, Warehouse)",
  keyConditions: "Maintain building safety, fire NOC, and renew before expiry.",
  currentStatus: "Valid and Compliant",
  daysRemaining: 267,
};

// Executive Top KPI Widgets
export const LICENSE_EXECUTIVE_KPIS = [
  {
    id: "total",
    label: "Total Licenses",
    value: 28,
    change: "↑ 12%",
    trend: "up" as const,
    color: "blue",
    subtext: "Across 6 global & domestic sites",
  },
  {
    id: "active",
    label: "Active Licenses",
    value: 22,
    change: "↑ 10%",
    trend: "up" as const,
    color: "emerald",
    subtext: "Valid & operating in compliance",
  },
  {
    id: "renewal-due",
    label: "Renewal Due",
    value: 4,
    change: "↑ 33%",
    trend: "up" as const,
    color: "amber",
    subtext: "Expiring within next 90 days",
  },
  {
    id: "expired",
    label: "Expired Licenses",
    value: 2,
    change: "↓ 50%",
    trend: "down" as const,
    color: "red",
    subtext: "Under expedited reinstatement",
  },
  {
    id: "applications",
    label: "Applications in Progress",
    value: 3,
    change: "↓ 0%",
    trend: "neutral" as const,
    color: "purple",
    subtext: "Under municipal & state review",
  },
  {
    id: "compliance",
    label: "License Compliance",
    value: "96%",
    change: "↑ 8%",
    trend: "up" as const,
    color: "teal",
    subtext: "Audit readiness & condition index",
  },
];

// Key Dates
export const LICENSE_KEY_DATES = [
  { label: "Issue Date", date: "01-Jan-2024" },
  { label: "Expiry Date", date: "31-Dec-2026" },
  { label: "Renewal Due", date: "30-Sep-2026" },
  { label: "Last Inspection", date: "15-Jun-2025" },
  { label: "Next Renewal", date: "30-Sep-2026" },
];

// Linked Documents (Section 6)
export const LINKED_DOCUMENTS: LinkedDocument[] = [
  {
    id: "DOC-001",
    documentName: "Trade License Certificate",
    type: "License",
    version: "1.0",
    uploadDate: "01-Jan-2024",
    expiryDate: "31-Dec-2026",
    status: "Valid",
  },
  {
    id: "DOC-002",
    documentName: "Building Plan Approval",
    type: "Approval",
    version: "1.0",
    uploadDate: "10-Dec-2023",
    expiryDate: "—",
    status: "Valid",
  },
  {
    id: "DOC-003",
    documentName: "Fire NOC",
    type: "Certificate",
    version: "1.0",
    uploadDate: "15-Nov-2023",
    expiryDate: "14-Nov-2026",
    status: "Valid",
  },
  {
    id: "DOC-004",
    documentName: "Property Lease Agreement",
    type: "Agreement",
    version: "1.0",
    uploadDate: "01-Jan-2024",
    expiryDate: "31-Dec-2030",
    status: "Valid",
  },
];

// Compliance Conditions (Section 7)
export const COMPLIANCE_CONDITIONS: ComplianceCondition[] = [
  {
    id: "COND-001",
    condition: "Maintain fire safety certificate",
    monitoringFrequency: "Annual",
    status: "Compliant",
    lastChecked: "15-Jun-2025",
  },
  {
    id: "COND-002",
    condition: "No change in land use",
    monitoringFrequency: "Continuous",
    status: "Compliant",
    lastChecked: "01-Aug-2025",
  },
  {
    id: "COND-003",
    condition: "Display license at premises",
    monitoringFrequency: "Continuous",
    status: "Compliant",
    lastChecked: "01-Aug-2025",
  },
  {
    id: "COND-004",
    condition: "Renew before expiry",
    monitoringFrequency: "Annual",
    status: "On Track",
    lastChecked: "01-Aug-2025",
  },
];

// Renewal & Application History (Section 8)
export const RENEWAL_HISTORY: RenewalHistory[] = [
  {
    id: "HIST-001",
    type: "Original Issue",
    date: "01-Jan-2024",
    referenceNo: "CMC/TRD/2024/0156",
    status: "Approved",
  },
  {
    id: "HIST-002",
    type: "Renewal Application",
    date: "01-Sep-2025",
    referenceNo: "CMC/TRD/2026/0421",
    status: "Submitted",
  },
  {
    id: "HIST-003",
    type: "Document Query",
    date: "10-Sep-2025",
    referenceNo: "CMC/QRY/2026/118",
    status: "Resolved",
  },
];

// Inspections & Audits (Section 9)
export const INSPECTION_RECORDS: InspectionRecord[] = [
  {
    id: "INSP-001",
    date: "15-Jun-2025",
    type: "Inspection",
    inspector: "Municipal Inspector",
    findings: "No major issues",
    status: "Closed",
  },
  {
    id: "INSP-002",
    date: "12-Jun-2024",
    type: "Inspection",
    inspector: "Municipal Inspector",
    findings: "Minor observation",
    status: "Closed",
  },
];

// Risk Assessment (Section 10)
export const LICENSE_RISK: LicenseRiskInfo = {
  rating: "Medium",
  likelihood: 3,
  impact: 3,
  score: 9,
  keyRisk: "Delay in renewal due to document preparation or authority processing time.",
  mitigation: "Start renewal 3 months in advance and maintain document readiness.",
};

// Related Records (Section 11)
export const RELATED_RECORDS = [
  { id: "reg", label: "Regulatory Compliance Records", count: 2, to: "/management/risk-management/regulatory-compliance" },
  { id: "internal", label: "Internal Compliance Requirements", count: 3, to: "/management/risk-management/internal-compliance" },
  { id: "risk", label: "Risk Records", count: 1, to: "/management/risk-management/enterprise-risk" },
  { id: "audit", label: "Audit Records", count: 2, to: "/management/administration-management/audit-management" },
  { id: "actions", label: "Corrective Actions", count: 0, to: "/management/quality-management/capa" },
  { id: "notes", label: "Notes & Correspondence", count: 4, to: "#correspondence" },
];

// 20 Controlled Audit Reports (Section 39)
export const CONTROLLED_LICENSE_REPORTS: ControlledLicenseReport[] = [
  {
    id: "REP-LIC-001",
    code: "LR-001",
    title: "License Register",
    category: "Inventory",
    purpose: "Comprehensive inventory of all business, factory, environmental, product, facility, and software licenses",
    periodicity: "Real-time",
    recordsCount: 28,
    lastGenerated: "24-Sep-2026 14:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LIC-002",
    code: "ALR-002",
    title: "Active License Report",
    category: "Inventory",
    purpose: "Status verification of all valid operating licenses across facilities and product lines",
    periodicity: "Monthly",
    recordsCount: 22,
    lastGenerated: "20-Sep-2026 11:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-003",
    code: "LER-003",
    title: "License Expiry Report",
    category: "Renewal & Expiry",
    purpose: "Upcoming expiries categorized by 180, 120, 90, 60, 30, and 15-day alert thresholds",
    periodicity: "Real-time",
    recordsCount: 7,
    lastGenerated: "25-Sep-2026 09:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LIC-004",
    code: "ELR-004",
    title: "Expired License Report",
    category: "Renewal & Expiry",
    purpose: "Immediate escalation report for expired licenses requiring emergency regularization or cessation of activity",
    periodicity: "Real-time",
    recordsCount: 2,
    lastGenerated: "25-Sep-2026 08:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-005",
    code: "RPL-005",
    title: "Renewal Pipeline Report",
    category: "Renewal & Expiry",
    purpose: "Tracking renewal workflows from document collection to government authority approval",
    periodicity: "Monthly",
    recordsCount: 4,
    lastGenerated: "22-Sep-2026 16:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-006",
    code: "LAR-006",
    title: "License Application Report",
    category: "Renewal & Expiry",
    purpose: "Status of initial, expansion, and capacity alteration applications across all authorities",
    periodicity: "Monthly",
    recordsCount: 3,
    lastGenerated: "18-Sep-2026 10:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-007",
    code: "ATR-007",
    title: "Authority Report",
    category: "Inventory",
    purpose: "Distribution of licenses, statutory liaison contacts, fees, and jurisdictions by issuing agency",
    periodicity: "Quarterly",
    recordsCount: 14,
    lastGenerated: "15-Sep-2026 15:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-008",
    code: "LLR-008",
    title: "Location License Report",
    category: "Inventory",
    purpose: "Site-specific compliance dossier for Coimbatore, Chennai, Bengaluru, and Pune premises",
    periodicity: "Quarterly",
    recordsCount: 28,
    lastGenerated: "12-Sep-2026 14:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LIC-009",
    code: "PLR-009",
    title: "Product License Report",
    category: "Compliance & Conditions",
    purpose: "Certification, safety marks, BIS registrations, and market authorizations by product model",
    periodicity: "Quarterly",
    recordsCount: 11,
    lastGenerated: "10-Sep-2026 17:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-010",
    code: "FLR-010",
    title: "Facility License Report",
    category: "Compliance & Conditions",
    purpose: "Factory Inspectorate, Building Stability, Fire NOC, and Electrical Lift authorizations",
    periodicity: "Quarterly",
    recordsCount: 8,
    lastGenerated: "08-Sep-2026 12:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-011",
    code: "LCR-011",
    title: "License Condition Report",
    category: "Compliance & Conditions",
    purpose: "Audit of statutory and environmental operating restrictions attached to valid licenses",
    periodicity: "Monthly",
    recordsCount: 42,
    lastGenerated: "21-Sep-2026 16:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-012",
    code: "IR-012",
    title: "Inspection Report",
    category: "Audit & Inspection",
    purpose: "Historical record of statutory officer visits, physical premises audits, and closing letters",
    periodicity: "Quarterly",
    recordsCount: 6,
    lastGenerated: "19-Sep-2026 11:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LIC-013",
    code: "LAR-013",
    title: "License Audit Report",
    category: "Audit & Inspection",
    purpose: "Annual internal governance review of all legal and operational licenses",
    periodicity: "Annual",
    recordsCount: 4,
    lastGenerated: "15-Aug-2026 09:30",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LIC-014",
    code: "LRR-014",
    title: "License Risk Report",
    category: "Financial & Risk",
    purpose: "Quantified 5x5 exposure scores from non-renewal, suspension, or scope deviations",
    periodicity: "Monthly",
    recordsCount: 16,
    lastGenerated: "23-Sep-2026 18:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LIC-015",
    code: "LGR-015",
    title: "License Gap Report",
    category: "Compliance & Conditions",
    purpose: "Analysis of operational gaps, missing endorsements, and condition deviations",
    periodicity: "Monthly",
    recordsCount: 5,
    lastGenerated: "22-Sep-2026 14:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-016",
    code: "CAR-016",
    title: "Corrective Action Report",
    category: "Audit & Inspection",
    purpose: "Remediation status for inspection observations and authority condition notices",
    periodicity: "Real-time",
    recordsCount: 2,
    lastGenerated: "24-Sep-2026 10:15",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-017",
    code: "LCR-017",
    title: "License Cost Report",
    category: "Financial & Risk",
    purpose: "Financial audit of government statutory fees, processing, consultancy, and renewal costs",
    periodicity: "Quarterly",
    recordsCount: 28,
    lastGenerated: "01-Sep-2026 11:45",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LIC-018",
    code: "RCR-018",
    title: "Regulatory Correspondence Report",
    category: "Audit & Inspection",
    purpose: "Formal tracking of notices, show-cause orders, clarifications, and responses with authorities",
    periodicity: "Real-time",
    recordsCount: 12,
    lastGenerated: "20-Sep-2026 13:20",
    downloadFormat: "PDF / Excel / CSV",
    status: "Active",
  },
  {
    id: "REP-LIC-019",
    code: "EVR-019",
    title: "Evidence Register",
    category: "Compliance & Conditions",
    purpose: "Central repository of digitized original certificates, challans, and endorsements",
    periodicity: "Real-time",
    recordsCount: 94,
    lastGenerated: "25-Sep-2026 15:40",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
  {
    id: "REP-LIC-020",
    code: "AIR-020",
    title: "AI License Intelligence Report",
    category: "AI & Governance",
    purpose: "Predictive expiry modeling, renewal lead time forecasting, and regulatory change impacts",
    periodicity: "Real-time",
    recordsCount: 28,
    lastGenerated: "25-Sep-2026 16:00",
    downloadFormat: "PDF / Excel / CSV",
    status: "Certified",
  },
];

// Section 40: License KPI Master
export const LICENSE_KPI_MASTER: LicenseKPIMetric[] = [
  // Portfolio
  {
    id: "KPI-001",
    domain: "Portfolio",
    metric: "Total Licenses Identified & Governed",
    target: "100%",
    actual: "28 / 28",
    variance: "0%",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-002",
    domain: "Portfolio",
    metric: "Active License Operational Ratio",
    target: "≥ 85%",
    actual: "78.6% (22/28)",
    variance: "-6.4%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-003",
    domain: "Portfolio",
    metric: "Expired Licenses Requiring Reinstatement",
    target: "0",
    actual: "2",
    variance: "+2",
    trend: "down",
    status: "Critical",
  },
  // Renewal
  {
    id: "KPI-004",
    domain: "Renewal",
    metric: "On-Time Renewal Submission Rate",
    target: "100%",
    actual: "94.2%",
    variance: "-5.8%",
    trend: "up",
    status: "Good",
  },
  {
    id: "KPI-005",
    domain: "Renewal",
    metric: "Average Renewal Lead Time",
    target: "≥ 60 days",
    actual: "74 days",
    variance: "+14 days",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-006",
    domain: "Renewal",
    metric: "Renewals Due in Next 90 Days",
    target: "< 5",
    actual: "4",
    variance: "Within Target",
    trend: "neutral",
    status: "Optimal",
  },
  // Compliance
  {
    id: "KPI-007",
    domain: "Compliance",
    metric: "License Condition Adherence Rate",
    target: "100%",
    actual: "96.4%",
    variance: "-3.6%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-008",
    domain: "Compliance",
    metric: "Missing Licenses Detected (Gap Audit)",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-009",
    domain: "Compliance",
    metric: "Evidence Document Completeness Coverage",
    target: "100%",
    actual: "98.1%",
    variance: "-1.9%",
    trend: "up",
    status: "Optimal",
  },
  // Applications
  {
    id: "KPI-010",
    domain: "Applications",
    metric: "Application First-Time Approval Rate",
    target: "≥ 90%",
    actual: "92.0%",
    variance: "+2.0%",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-011",
    domain: "Applications",
    metric: "Average Authority Processing Cycle Time",
    target: "≤ 45 days",
    actual: "38 days",
    variance: "-7 days",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-012",
    domain: "Applications",
    metric: "Open Authority Queries / Clarifications",
    target: "0",
    actual: "1",
    variance: "+1",
    trend: "neutral",
    status: "Good",
  },
  // Risk
  {
    id: "KPI-013",
    domain: "Risk",
    metric: "High / Critical Risk License Holdings",
    target: "≤ 2",
    actual: "1",
    variance: "-1",
    trend: "up",
    status: "Optimal",
  },
  {
    id: "KPI-014",
    domain: "Risk",
    metric: "Overdue Corrective Actions from Inspections",
    target: "0",
    actual: "0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  // Finance
  {
    id: "KPI-015",
    domain: "Finance",
    metric: "Statutory Penalty / Delay Surcharges Incurred",
    target: "₹0",
    actual: "₹0",
    variance: "0",
    trend: "neutral",
    status: "Optimal",
  },
  {
    id: "KPI-016",
    domain: "Finance",
    metric: "Total License & Renewal Budget Utilization",
    target: "100%",
    actual: "87.4%",
    variance: "-12.6%",
    trend: "neutral",
    status: "Optimal",
  },
];

// Sample Inventory for Register View
export const SAMPLE_LICENSES_INVENTORY = [
  {
    id: "LIC-2026-001",
    code: "TRD-CHN-001",
    name: "Trade License - Coimbatore",
    type: "Business",
    authority: "Coimbatore City Municipal Corporation",
    location: "Coimbatore",
    expiry: "31-Dec-2026",
    status: "Active",
    cost: "₹18,500",
  },
  {
    id: "LIC-2026-002",
    code: "FAC-CBE-002",
    name: "Factory License - Tamil Nadu Directorate",
    type: "Manufacturing",
    authority: "Directorate of Industrial Safety & Health",
    location: "Coimbatore Plant 1",
    expiry: "31-Mar-2027",
    status: "Active",
    cost: "₹45,000",
  },
  {
    id: "LIC-2026-003",
    code: "FIR-CBE-003",
    name: "Fire Safety Certificate (NOC)",
    type: "Facility",
    authority: "Tamil Nadu Fire and Rescue Services",
    location: "Coimbatore Plant 1",
    expiry: "14-Nov-2026",
    status: "Active",
    cost: "₹12,000",
  },
  {
    id: "LIC-2026-004",
    code: "PCB-CTO-004",
    name: "Consent to Operate (CTO - Green)",
    type: "Environmental",
    authority: "Tamil Nadu Pollution Control Board",
    location: "Coimbatore Plant 1",
    expiry: "30-Jun-2026",
    status: "Renewal",
    cost: "₹65,000",
  },
  {
    id: "LIC-2026-005",
    code: "BIS-EV-005",
    name: "BIS Product Safety Certification - EV Chargers",
    type: "Product",
    authority: "Bureau of Indian Standards",
    location: "Corporate / R&D",
    expiry: "15-Oct-2026",
    status: "Active",
    cost: "₹1,20,000",
  },
  {
    id: "LIC-2026-006",
    code: "IEC-EXP-006",
    name: "Importer-Exporter Code (IEC)",
    type: "Business",
    authority: "Directorate General of Foreign Trade",
    location: "Enterprise",
    expiry: "Lifetime",
    status: "Active",
    cost: "₹5,000",
  },
  {
    id: "LIC-2026-007",
    code: "ELC-HT-007",
    name: "HT Electrical Installation Approval",
    type: "Facility",
    authority: "Chief Electrical Inspector to Government",
    location: "Coimbatore Substation",
    expiry: "20-May-2026",
    status: "Renewal",
    cost: "₹25,000",
  },
  {
    id: "LIC-2026-008",
    code: "HAZ-WST-008",
    name: "Hazardous Waste Handling Authorization",
    type: "Environmental",
    authority: "State Pollution Control Board",
    location: "Coimbatore Plant 1",
    expiry: "15-Jan-2026",
    status: "Expired",
    cost: "₹30,000",
  },
];

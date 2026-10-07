// Magnertia ERP - Security Management Domain Service
// Management → Security Management
// Access Control, Identity Management, Cybersecurity, Information Security, Physical Security, Reports

export interface ControlledSecurityReport {
  id: string;
  code: string;
  title: string;
  submodule: "Access Control" | "Identity Management" | "Cybersecurity" | "Information Security" | "Physical Security";
  purpose: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annual" | "On-Demand";
  lastGenerated: string;
  generatedBy: string;
  format: "PDF" | "XLSX" | "CSV";
  recordCount: number;
  confidentiality: "Internal" | "Confidential" | "Restricted";
  status: "Active" | "Scheduled" | "Archived";
  category: string;
}

export const CONTROLLED_SECURITY_REPORTS: ControlledSecurityReport[] = [
  // 1. Access Control Reports
  {
    id: "rep-ac-01",
    code: "REP-AC-001",
    title: "User Access Master Inventory Report",
    submodule: "Access Control",
    purpose: "Comprehensive mapping of all active enterprise users, assigned roles, permissions, scopes and last login timestamps.",
    frequency: "Monthly",
    lastGenerated: "2026-09-28",
    generatedBy: "Arun Kumar (Security Lead)",
    format: "PDF",
    recordCount: 486,
    confidentiality: "Confidential",
    status: "Active",
    category: "Access Inventory",
  },
  {
    id: "rep-ac-02",
    code: "REP-AC-002",
    title: "Segregation of Duties (SoD) Conflict & Exception Ledger",
    submodule: "Access Control",
    purpose: "Audit record of conflicting permissions across business domains (P2P, O2C, Financial Ledger) and active mitigating controls.",
    frequency: "Weekly",
    lastGenerated: "2026-09-27",
    generatedBy: "Arun Kumar (Security Lead)",
    format: "XLSX",
    recordCount: 4,
    confidentiality: "Restricted",
    status: "Active",
    category: "SoD Governance",
  },
  {
    id: "rep-ac-03",
    code: "REP-AC-003",
    title: "Privileged Access Management (PAM) & JIT Session Log",
    submodule: "Access Control",
    purpose: "Time-bound elevation session audit, command telemetry, root actions, and auto-expiry verification.",
    frequency: "Daily",
    lastGenerated: "2026-09-28",
    generatedBy: "System Auditor",
    format: "CSV",
    recordCount: 18,
    confidentiality: "Restricted",
    status: "Active",
    category: "Privileged Access",
  },
  {
    id: "rep-ac-04",
    code: "REP-AC-004",
    title: "Access Certification & Periodic Review Status",
    submodule: "Access Control",
    purpose: "Quarterly manager review completion tracking, excessive permission removals, and revocation certification.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-26",
    generatedBy: "Priya Sharma (CISO)",
    format: "PDF",
    recordCount: 459,
    confidentiality: "Confidential",
    status: "Active",
    category: "Certification",
  },
  {
    id: "rep-ac-05",
    code: "REP-AC-005",
    title: "Access Requests & Approval Pipeline Audit",
    submodule: "Access Control",
    purpose: "Turnaround time, risk scoring, business justifications, and provisioning status for access requests.",
    frequency: "Weekly",
    lastGenerated: "2026-09-27",
    generatedBy: "Arun Kumar (Security Lead)",
    format: "PDF",
    recordCount: 65,
    confidentiality: "Internal",
    status: "Active",
    category: "Workflow",
  },

  // 2. Identity Management Reports
  {
    id: "rep-id-01",
    code: "REP-ID-001",
    title: "Digital Identity Master Register (Human & Non-Human)",
    submodule: "Identity Management",
    purpose: "Master catalog across employees, contractors, service accounts, bots, API identities, and connected machines.",
    frequency: "Monthly",
    lastGenerated: "2026-09-28",
    generatedBy: "John Mathew (Identity Admin)",
    format: "XLSX",
    recordCount: 542,
    confidentiality: "Confidential",
    status: "Active",
    category: "Identity Inventory",
  },
  {
    id: "rep-id-02",
    code: "REP-ID-002",
    title: "Joiner-Mover-Leaver (JML) Lifecycle Audit",
    submodule: "Identity Management",
    purpose: "Automated verification of HRMS events, de-provisioning timelines, transfer role reassessments, and exit revocations.",
    frequency: "Weekly",
    lastGenerated: "2026-09-26",
    generatedBy: "HRMS Integration",
    format: "PDF",
    recordCount: 38,
    confidentiality: "Confidential",
    status: "Active",
    category: "Lifecycle Audit",
  },
  {
    id: "rep-id-03",
    code: "REP-ID-003",
    title: "Dormant & Orphan Account Detection Ledger",
    submodule: "Identity Management",
    purpose: "Inactivity over 90 days, unowned service accounts, vendor credentials past expiry date, and remediation tracking.",
    frequency: "Monthly",
    lastGenerated: "2026-09-25",
    generatedBy: "AI Security Intelligence",
    format: "CSV",
    recordCount: 19,
    confidentiality: "Restricted",
    status: "Active",
    category: "Account Hygiene",
  },
  {
    id: "rep-id-04",
    code: "REP-ID-004",
    title: "MFA Enrollment & Authentication Posture",
    submodule: "Identity Management",
    purpose: "Multi-factor authentication adoption percentage, device trust status, biometric usage, and recovery tokens.",
    frequency: "Monthly",
    lastGenerated: "2026-09-28",
    generatedBy: "Security Automation",
    format: "PDF",
    recordCount: 486,
    confidentiality: "Internal",
    status: "Active",
    category: "Authentication",
  },

  // 3. Cybersecurity Reports
  {
    id: "rep-cy-01",
    code: "REP-CY-001",
    title: "Enterprise Cybersecurity Posture & Asset Inventory",
    submodule: "Cybersecurity",
    purpose: "Protected assets, servers, cloud infrastructure, EV charging stations (EVSE), OT controllers, and risk classifications.",
    frequency: "Monthly",
    lastGenerated: "2026-09-28",
    generatedBy: "Arun Kumar (CISO)",
    format: "PDF",
    recordCount: 1284,
    confidentiality: "Confidential",
    status: "Active",
    category: "Asset Posture",
  },
  {
    id: "rep-cy-02",
    code: "REP-CY-002",
    title: "Vulnerability Management & CVSS Remediation Ledger",
    submodule: "Cybersecurity",
    purpose: "Active CVEs, severity ratings, exploitability status, SLA target due dates, and patch deployment state.",
    frequency: "Weekly",
    lastGenerated: "2026-09-28",
    generatedBy: "SIEM Vulnerability Scanner",
    format: "XLSX",
    recordCount: 47,
    confidentiality: "Restricted",
    status: "Active",
    category: "Vulnerabilities",
  },
  {
    id: "rep-cy-03",
    code: "REP-CY-003",
    title: "Cyber Security Incident Response & Forensics Summary",
    submodule: "Cybersecurity",
    purpose: "Triaged incidents, containment timelines, root cause analyses (RCA), CAPA linkages, and recovery verification.",
    frequency: "Monthly",
    lastGenerated: "2026-09-27",
    generatedBy: "SOC Lead",
    format: "PDF",
    recordCount: 12,
    confidentiality: "Restricted",
    status: "Active",
    category: "Incident Management",
  },
  {
    id: "rep-cy-04",
    code: "REP-CY-004",
    title: "Autonomous EVSE & IoT Product Security Telemetry",
    submodule: "Cybersecurity",
    purpose: "Magnertia wireless charging stations firmware signing, OCPP TLS compliance, OTA update states, and hardware tamper logs.",
    frequency: "Weekly",
    lastGenerated: "2026-09-28",
    generatedBy: "Product Security Eng",
    format: "PDF",
    recordCount: 142,
    confidentiality: "Confidential",
    status: "Active",
    category: "IoT / EVSE Security",
  },
  {
    id: "rep-cy-05",
    code: "REP-CY-005",
    title: "Third-Party & Supplier Cybersecurity Risk Index",
    submodule: "Cybersecurity",
    purpose: "Software Bill of Materials (SBOM) dependencies, supplier risk ratings, external access audits, and compliance declarations.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-24",
    generatedBy: "Supply Chain Security",
    format: "XLSX",
    recordCount: 88,
    confidentiality: "Confidential",
    status: "Active",
    category: "Supply Chain",
  },

  // 4. Information Security Reports
  {
    id: "rep-is-01",
    code: "REP-IS-001",
    title: "Information Asset Master Register & Classification Index",
    submodule: "Information Security",
    purpose: "Complete registry of enterprise data assets, drawings, source code, EVSE firmware, CAD models, and storage locations.",
    frequency: "Monthly",
    lastGenerated: "2026-09-28",
    generatedBy: "Ramesh S (ISMS Manager)",
    format: "PDF",
    recordCount: 2486,
    confidentiality: "Confidential",
    status: "Active",
    category: "ISMS Inventory",
  },
  {
    id: "rep-is-02",
    code: "REP-IS-002",
    title: "Data Loss Prevention (DLP) & External Sharing Audit",
    submodule: "Information Security",
    purpose: "Sensitive document sharing, NDA validations, recipient verifications, tokenized transfers, and leak alerts.",
    frequency: "Weekly",
    lastGenerated: "2026-09-26",
    generatedBy: "DLP Engine",
    format: "XLSX",
    recordCount: 52,
    confidentiality: "Restricted",
    status: "Active",
    category: "Data Protection",
  },
  {
    id: "rep-is-03",
    code: "REP-IS-003",
    title: "Information Retention, Archival & Certified Disposal Log",
    submodule: "Information Security",
    purpose: "Statutory document retention compliance, legal hold checks, cryptographic erasure certificates, and shredding records.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-20",
    generatedBy: "Compliance Officer",
    format: "PDF",
    recordCount: 114,
    confidentiality: "Internal",
    status: "Active",
    category: "Lifecycle & Disposal",
  },
  {
    id: "rep-is-04",
    code: "REP-IS-004",
    title: "ISO 27001 & ISO/SAE 21434 ISMS Compliance Ledger",
    submodule: "Information Security",
    purpose: "Statement of Applicability (SoA) controls, effectiveness verification, internal audit non-conformances, and CAPA status.",
    frequency: "Quarterly",
    lastGenerated: "2026-09-25",
    generatedBy: "Lead Auditor",
    format: "PDF",
    recordCount: 114,
    confidentiality: "Confidential",
    status: "Active",
    category: "Compliance",
  },

  // 5. Physical Security Reports
  {
    id: "rep-ps-01",
    code: "REP-PS-001",
    title: "Facility Physical Security Status & Zone Classification",
    submodule: "Physical Security",
    purpose: "Protection posture across 8 facilities, corporate offices, R&D electronics labs, prototype areas, and charging test sites.",
    frequency: "Monthly",
    lastGenerated: "2026-09-28",
    generatedBy: "Ramesh S (Facility Security)",
    format: "PDF",
    recordCount: 8,
    confidentiality: "Internal",
    status: "Active",
    category: "Facility Security",
  },
  {
    id: "rep-ps-02",
    code: "REP-PS-002",
    title: "CCTV Uptime, Health & Storage Retention Audit",
    submodule: "Physical Security",
    purpose: "96 camera health states, video retention policies (90/180 days), coverage blind spots, and tamper sensors.",
    frequency: "Daily",
    lastGenerated: "2026-09-28",
    generatedBy: "Security Control Room",
    format: "XLSX",
    recordCount: 96,
    confidentiality: "Confidential",
    status: "Active",
    category: "Surveillance",
  },
  {
    id: "rep-ps-03",
    code: "REP-PS-003",
    title: "Security Guard Deployment & Patrol Compliance Report",
    submodule: "Physical Security",
    purpose: "Patrol route RFID/NFC checkpoint scans, shift handovers, guard attendance, and incident response times.",
    frequency: "Weekly",
    lastGenerated: "2026-09-28",
    generatedBy: "Head Security Officer",
    format: "PDF",
    recordCount: 24,
    confidentiality: "Internal",
    status: "Active",
    category: "Guard Operations",
  },
  {
    id: "rep-ps-04",
    code: "REP-PS-004",
    title: "Visitor & Contractor Access Ledger (Gate Pass Audit)",
    submodule: "Physical Security",
    purpose: "Badge issuances, host authorizations, escort logs, material movement passes, and restricted area clearances.",
    frequency: "Daily",
    lastGenerated: "2026-09-28",
    generatedBy: "Gate Security",
    format: "CSV",
    recordCount: 45,
    confidentiality: "Internal",
    status: "Active",
    category: "Access Logs",
  },
  {
    id: "rep-ps-05",
    code: "REP-PS-005",
    title: "Physical Security Incident & Alarm Escalation Register",
    submodule: "Physical Security",
    purpose: "Intrusions, forced doors, tailgating events, perimeter breaches, evidence preservation, and corrective action.",
    frequency: "Monthly",
    lastGenerated: "2026-09-26",
    generatedBy: "Security Manager",
    format: "PDF",
    recordCount: 5,
    confidentiality: "Restricted",
    status: "Active",
    category: "Physical Incidents",
  },
  {
    id: "rep-ai-01",
    code: "REP-AI-001",
    title: "AI Security Intelligence & Threat Correlation Report",
    submodule: "Cybersecurity",
    purpose: "Autonomous machine learning anomaly alerts, access risk scoring, anomalous login detections, and proactive mitigations.",
    frequency: "Daily",
    lastGenerated: "2026-09-28",
    generatedBy: "AI Security Engine",
    format: "PDF",
    recordCount: 28,
    confidentiality: "Restricted",
    status: "Active",
    category: "AI Insights",
  },
];

/* =========================================================================
   Access Control Datasets (Matching Screenshot 3)
   ========================================================================= */

export interface AccessControlRecord {
  id: string;
  code: string;
  user: string;
  empId: string;
  userType: string;
  department: string;
  accessType: string;
  role: string;
  permissionSet: string;
  accessLevel: string;
  source: string;
  effectiveFrom: string;
  effectiveTo: string;
  mfaEnabled: boolean;
  status: "Active" | "Draft" | "Suspended" | "Revoked";
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  confidentiality: "Internal" | "Confidential" | "Restricted";
  lastLogin: string;
  description: string;
}

export const mockAccessControlMaster: AccessControlRecord = {
  id: "AC-2026-001",
  code: "AC-2026-001",
  user: "John Mathew",
  empId: "EMP-1024",
  userType: "Employee",
  department: "Manufacturing",
  accessType: "Application",
  role: "Production Manager",
  permissionSet: "Production_Operations",
  accessLevel: "Create / Edit / Approve",
  source: "HRMS",
  effectiveFrom: "01 Jan 2026 09:00",
  effectiveTo: "31 Dec 2026 23:59",
  mfaEnabled: true,
  status: "Active",
  riskLevel: "Medium",
  confidentiality: "Internal",
  lastLogin: "28 Sep 2026 10:24",
  description: "Access for production operations, shop floor data, reports and approvals.",
};

export const mockAccessRequests = [
  {
    id: "req-1",
    reqNo: "REQ-2026-184",
    user: "Priya Sharma",
    role: "Finance Analyst",
    type: "New Access",
    date: "28 Sep 2026",
    status: "In Approval",
    risk: "Medium",
  },
  {
    id: "req-2",
    reqNo: "REQ-2026-183",
    user: "Ramesh S",
    role: "Maintenance User",
    type: "Additional",
    date: "27 Sep 2026",
    status: "Approved",
    risk: "Low",
  },
  {
    id: "req-3",
    reqNo: "REQ-2026-182",
    user: "Anil Verma",
    role: "ERP Administrator",
    type: "Privileged",
    date: "26 Sep 2026",
    status: "Risk Review",
    risk: "Critical",
  },
  {
    id: "req-4",
    reqNo: "REQ-2026-181",
    user: "Sara Khan",
    role: "QMS Auditor",
    type: "Temporary",
    date: "25 Sep 2026",
    status: "Provisioned",
    risk: "Low",
  },
  {
    id: "req-5",
    reqNo: "REQ-2026-180",
    user: "Karthik P",
    role: "Warehouse User",
    type: "New Access",
    date: "24 Sep 2026",
    status: "Rejected",
    risk: "High",
  },
];

export const mockSoDConflicts = [
  {
    rule: "SOD-001",
    user: "Anil Verma",
    conflictingRoles: "Create Supplier + Approve Payment",
    risk: "Critical",
    status: "Open",
  },
  {
    rule: "SOD-002",
    user: "Priya Sharma",
    conflictingRoles: "Create PO + Approve PO",
    risk: "High",
    status: "Open",
  },
  {
    rule: "SOD-003",
    user: "Karthik P",
    conflictingRoles: "Create GRN + Approve Invoice",
    risk: "Medium",
    status: "Mitigated",
  },
  {
    rule: "SOD-004",
    user: "Sara Khan",
    conflictingRoles: "Modify Master Data + Audit",
    risk: "High",
    status: "Open",
  },
  {
    rule: "SOD-005",
    user: "Ramesh S",
    conflictingRoles: "Vendor Setup + Payment Approval",
    risk: "Medium",
    status: "Under Review",
  },
];

export const mockPrivilegedUsers = [
  { user: "Admin01", role: "System Administrator", lastLogin: "28 Sep 2026 08:12", session: 2, status: "Active" },
  { user: "DBA_Service", role: "Database Administrator", lastLogin: "28 Sep 2026 07:45", session: 1, status: "Active" },
  { user: "Network_Admin", role: "Network Administrator", lastLogin: "27 Sep 2026 22:18", session: 1, status: "Expired" },
  { user: "ERP_Admin", role: "ERP Administrator", lastLogin: "27 Sep 2026 18:40", session: 3, status: "Active" },
  { user: "Cloud_Admin", role: "Cloud Administrator", lastLogin: "26 Sep 2026 20:25", session: 1, status: "Suspended" },
];

/* =========================================================================
   Identity Management Datasets (Matching Screenshot 2)
   ========================================================================= */

export interface IdentityProfile {
  id: string;
  referenceNo: string;
  identityType: string;
  legalName: string;
  displayName: string;
  identityStatus: "Active" | "Pending Verification" | "Pending Approval" | "Suspended" | "Deactivated";
  organization: string;
  businessUnit: string;
  department: string;
  function: string;
  location: string;
  manager: string;
  identityOwner: string;
  riskClassification: "Low" | "Medium" | "High" | "Critical";
  confidentiality: "Internal" | "Confidential" | "Restricted";
  joinDate: string;
  employmentType: string;
  email: string;
  mobile: string;
  description: string;
  riskScore: number;
}

export const mockIdentityProfile: IdentityProfile = {
  id: "ID-2026-001",
  referenceNo: "ID-EMP-1024",
  identityType: "Employee",
  legalName: "John Mathew",
  displayName: "John Mathew",
  identityStatus: "Active",
  organization: "Magnertia Private Limited",
  businessUnit: "Manufacturing",
  department: "Production",
  function: "Operations",
  location: "Plant 2 - Coimbatore",
  manager: "Ramesh S",
  identityOwner: "Arun Kumar",
  riskClassification: "Medium",
  confidentiality: "Internal",
  joinDate: "15 Jan 2022",
  employmentType: "Full Time",
  email: "john.mathew@magnertia.com",
  mobile: "+91 98450 12890",
  description: "Production engineer with access to manufacturing modules and reports.",
  riskScore: 62,
};

export const mockIdentityActivities = [
  { role: "28 Sep 2026 10:24", permissionSet: "Production_Operations", accessLevel: "Edit", app: "ERP - Manufacturing", status: "Active" },
  { role: "QMS Viewer", permissionSet: "Quality_ReadOnly", accessLevel: "View", app: "ERP - Quality", status: "Active" },
  { role: "EHS Reporter", permissionSet: "EHS_Report", accessLevel: "Create", app: "ERP - EHS", status: "Active" },
  { role: "Analytics User", permissionSet: "BI_Reports", accessLevel: "View", app: "Data Warehouse", status: "Active" },
];

/* =========================================================================
   Cybersecurity Datasets (Matching Screenshot 5)
   ========================================================================= */

export interface CybersecurityRecord {
  id: string;
  referenceNo: string;
  recordType: "Asset" | "Vulnerability" | "Incident" | "Risk";
  assetName: string;
  assetType: string;
  assetCategory: string;
  productSystem: string;
  location: string;
  assetOwner: string;
  businessOwner: string;
  environment: string;
  dataClassification: string;
  internetExposure: boolean;
  securityStatus: "Active" | "Under Review" | "Remediated";
  criticality: "Critical" | "High" | "Medium" | "Low";
  riskScore: number;
  lastAssessed: string;
  nextAssessment: string;
  description: string;
}

export const mockCybersecurityRecord: CybersecurityRecord = {
  id: "CYB-2026-001",
  referenceNo: "CYB-PLANT2-001",
  recordType: "Asset",
  assetName: "EV Charging Station - PCS-02",
  assetType: "EVSE",
  assetCategory: "IoT / IIoT Device",
  productSystem: "Autonomous Wireless EV Charging Station",
  location: "Plant 2 - Coimbatore",
  assetOwner: "Ramesh S",
  businessOwner: "Arun Kumar",
  environment: "Production",
  dataClassification: "Confidential",
  internetExposure: true,
  securityStatus: "Active",
  criticality: "High",
  riskScore: 78,
  lastAssessed: "28 Sep 2026",
  nextAssessment: "28 Dec 2026",
  description: "Public EV charging station controller with network connectivity, OCPP communication, remote monitoring and OTA updates.",
};

export const mockCyberVulnerabilities = [
  { date: "28 Sep 2026", asset: "EVSE-02", vulnerability: "OpenSSL Vulnerability", cve: "CVE-2026-1254", severity: "Critical", status: "Open" },
  { date: "26 Sep 2026", asset: "ERP Server", vulnerability: "Outdated Python Runtime", cve: "CVE-2026-1187", severity: "High", status: "In Progress" },
  { date: "25 Sep 2026", asset: "Cloud DB", vulnerability: "Misconfiguration", cve: "CVE-2026-1123", severity: "High", status: "Open" },
  { date: "24 Sep 2026", asset: "Web Portal", vulnerability: "XSS Vulnerability", cve: "CVE-2026-1109", severity: "Medium", status: "Resolved" },
  { date: "22 Sep 2026", asset: "IoT Gateway", vulnerability: "Weak Encryption Cipher", cve: "CVE-2026-1098", severity: "Medium", status: "Open" },
];

export const mockCyberIncidents = [
  { id: "INC-2026-012", date: "28 Sep 2026", type: "Suspicious Login", severity: "High", status: "Investigating" },
  { id: "INC-2026-011", date: "26 Sep 2026", type: "Malware Detected", severity: "Critical", status: "Open" },
  { id: "INC-2026-010", date: "24 Sep 2026", type: "Phishing Email Campaign", severity: "Medium", status: "Contained" },
  { id: "INC-2026-009", date: "21 Sep 2026", type: "API Abuse / Rate Exceeded", severity: "High", status: "Resolved" },
  { id: "INC-2026-008", date: "18 Sep 2026", type: "Unauthorized Access Attempt", severity: "Critical", status: "Open" },
];

/* =========================================================================
   Information Security Datasets (Matching Screenshot 4)
   ========================================================================= */

export interface InformationSecurityMaster {
  ismsId: string;
  referenceNo: string;
  recordType: string;
  assetName: string;
  informationType: string;
  productSystem: string;
  organization: string;
  businessUnit: string;
  department: string;
  location: string;
  informationOwner: string;
  dataCustodian: string;
  securityClassification: "Public" | "Internal" | "Confidential" | "Restricted" | "Critical";
  criticality: "Low" | "Medium" | "High" | "Critical";
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  confidentiality: string;
  retentionPeriod: string;
  status: "Draft" | "Under Review" | "Approved" | "Active" | "Suspended" | "Closed";
  businessOwner: string;
  systemOwner: string;
  processOwner: string;
  applicableFramework: string[];
  securityPolicy: string;
  controlCategory: string;
  controlRequirements: string[];
  policyCompliance: "Compliant" | "Non-Compliant" | "Exception";
  riskScore: number;
  lastAssessment: string;
  nextAssessment: string;
  requestedBy: string;
  approvedBy: string;
  approvalDate: string;
  approvalComments: string;
  description: string;
}

export const mockInformationSecurityRecord: InformationSecurityMaster = {
  ismsId: "ISM-2026-001",
  referenceNo: "ISM-PLANT2-001",
  recordType: "Information Asset",
  assetName: "EV Charging Station Controller Firmware",
  informationType: "Firmware",
  productSystem: "Autonomous Wireless EV Charging Station",
  organization: "Magnertia Private Limited",
  businessUnit: "Manufacturing",
  department: "R&D - Electronics",
  location: "Plant 2 - Coimbatore",
  informationOwner: "Ramesh S",
  dataCustodian: "Arun Kumar",
  securityClassification: "Restricted",
  criticality: "High",
  riskLevel: "High",
  confidentiality: "Confidential",
  retentionPeriod: "7 Years",
  status: "Active",
  businessOwner: "Karthik P",
  systemOwner: "Divya R",
  processOwner: "Ramesh S",
  applicableFramework: ["ISO 27001", "ISO/SAE 21434"],
  securityPolicy: "Information Security Policy v2.0",
  controlCategory: "Product Security",
  controlRequirements: ["Encryption", "Secure Boot", "Access Control"],
  policyCompliance: "Compliant",
  riskScore: 78,
  lastAssessment: "28 Sep 2026",
  nextAssessment: "28 Dec 2026",
  requestedBy: "Arun Kumar",
  approvedBy: "Priya Sharma",
  approvalDate: "27 Sep 2026",
  approvalComments: "Approved with encryption and secure access controls. Review after firmware update.",
  description: "Firmware for EVSE controller including charging control, power management and communication modules. Contains proprietary algorithms and source code.",
};

export const mockInformationAssetsList = [
  { id: "AS-2026-001", name: "EVSE Controller Firmware", type: "Firmware", owner: "Ramesh S", classification: "Restricted", risk: "High", status: "Active" },
  { id: "AS-2026-002", name: "Customer Telemetry Data", type: "Database", owner: "Priya Sharma", classification: "Confidential", risk: "High", status: "Active" },
  { id: "AS-2026-003", name: "CAD Design - Wireless Pad", type: "Drawing", owner: "Karthik P", classification: "Restricted", risk: "High", status: "Active" },
  { id: "AS-2026-004", name: "Financial Records FY26", type: "Document", owner: "Anil Verma", classification: "Confidential", risk: "Medium", status: "Active" },
  { id: "AS-2026-005", name: "HR Employee Identity Records", type: "Database", owner: "Divya R", classification: "Confidential", risk: "Medium", status: "Active" },
];

export const mockTopInformationRisks = [
  { risk: "Unauthorized Access", asset: "Customer Data", score: 92 },
  { risk: "Data Leakage", asset: "Engineering Data", score: 88 },
  { risk: "Ransomware Exposure", asset: "ERP Database", score: 76 },
  { risk: "IP Theft / Code Leak", asset: "Source Code", score: 68 },
  { risk: "Cloud Misconfiguration", asset: "Cloud Storage", score: 62 },
];

/* =========================================================================
   Physical Security Datasets (Matching Screenshot 1)
   ========================================================================= */

export interface PhysicalSecurityMaster {
  psId: string;
  referenceNo: string;
  organization: string;
  securityScope: string;
  facility: string;
  securityManager: string;
  ismsLead: string;
  securityClassification: "Internal" | "Confidential" | "Restricted";
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  securityStatus: "Draft" | "Under Review" | "Approved" | "Active" | "Suspended" | "Closed";
  effectiveFrom: string;
  reviewDate: string;
  description: string;
}

export const mockPhysicalSecurityRecord: PhysicalSecurityMaster = {
  psId: "PS-2026-001",
  referenceNo: "PS-PLANT2-001",
  organization: "Magnertia Private Limited",
  securityScope: "Site",
  facility: "Plant 2 - Coimbatore",
  securityManager: "Ramesh S",
  ismsLead: "Arun Kumar",
  securityClassification: "Confidential",
  riskLevel: "Medium",
  securityStatus: "Active",
  effectiveFrom: "01 Jan 2026",
  reviewDate: "31 Dec 2026",
  description: "Physical security management for Plant 2 including access control, CCTV, visitor management, guard deployment and asset protection.",
};

export const mockFacilitiesList = [
  { name: "Corporate Office", status: "Secure", cameras: 16, guards: 4 },
  { name: "Development Centre", status: "Secure", cameras: 20, guards: 4 },
  { name: "Manufacturing Facility", status: "Attention", cameras: 28, guards: 8 },
  { name: "R&D Laboratory", status: "Secure", cameras: 12, guards: 3 },
  { name: "Warehouse", status: "Secure", cameras: 10, guards: 2 },
  { name: "Charging Station Site", status: "Secure", cameras: 4, guards: 1 },
  { name: "Data Centre", status: "Secure", cameras: 4, guards: 2 },
  { name: "Remote Sites", status: "Monitor", cameras: 2, guards: 0 },
];

export const mockPhysicalIncidents = [
  { id: "INC-2026-012", date: "28 Sep 2026 09:15", type: "Unauthorized Access", location: "Plant 2", severity: "High", status: "Investigating" },
  { id: "INC-2026-011", date: "26 Sep 2026 18:40", type: "CCTV Failure", location: "Warehouse", severity: "Medium", status: "Open" },
  { id: "INC-2026-010", date: "25 Sep 2026 14:22", type: "Suspicious Person", location: "Main Gate", severity: "High", status: "Resolved" },
  { id: "INC-2026-009", date: "24 Sep 2026 11:05", type: "Asset Theft Attempt", location: "Parking", severity: "High", status: "Open" },
  { id: "INC-2026-008", date: "22 Sep 2026 20:10", type: "Door Forced Open", location: "R&D Lab", severity: "Critical", status: "Closed" },
];

/* =========================================================================
   AI Security Intelligence Alerts (Common feed across submodules)
   ========================================================================= */

export interface AISecurityAlert {
  id: string;
  type: "anomaly" | "warning" | "risk" | "breach" | "info";
  title: string;
  description: string;
  timeAgo: string;
  severity: "low" | "medium" | "high" | "critical";
  submodule: string;
}

export const mockAISecurityAlerts: AISecurityAlert[] = [
  {
    id: "ai-1",
    type: "risk",
    title: "Possible ransomware activity detected (EVSE-02)",
    description: "Anomalous encryption routine pattern discovered in endpoint telemetry on charging controller.",
    timeAgo: "2 hours ago",
    severity: "critical",
    submodule: "Cybersecurity",
  },
  {
    id: "ai-2",
    type: "anomaly",
    title: "Unusual login location detected for Admin01",
    description: "Successful administrative login attempt originating from non-whitelisted IP in external region.",
    timeAgo: "5 hours ago",
    severity: "high",
    submodule: "Access Control",
  },
  {
    id: "ai-3",
    type: "warning",
    title: "Dormant accounts > 90 days (16 accounts)",
    description: "Accounts have had zero activity for 90 days. Recommend automatic suspension review.",
    timeAgo: "5 hours ago",
    severity: "medium",
    submodule: "Identity Management",
  },
  {
    id: "ai-4",
    type: "risk",
    title: "High risk vulnerability found (CVE-2026-1254)",
    description: "Public exploit available for OpenSSL runtime on public internet-facing EVSE units.",
    timeAgo: "1 day ago",
    severity: "high",
    submodule: "Cybersecurity",
  },
  {
    id: "ai-5",
    type: "anomaly",
    title: "API rate limit exceeded (Charging API)",
    description: "Client ID API-EV-999 reached 10,000 requests/min throttle threshold.",
    timeAgo: "1 day ago",
    severity: "medium",
    submodule: "Cybersecurity",
  },
  {
    id: "ai-6",
    type: "warning",
    title: "Potential duplicate identity detected: 'john.mathew.j'",
    description: "Fuzzy match with existing John Mathew (EMP-1024) discovered in HRMS joiner queue.",
    timeAgo: "2 hours ago",
    severity: "medium",
    submodule: "Identity Management",
  },
  {
    id: "ai-7",
    type: "risk",
    title: "SoD conflict risk for new request (REQ-2026-184)",
    description: "Granting requested role combines PO generation and invoice clearance capability.",
    timeAgo: "1 day ago",
    severity: "high",
    submodule: "Access Control",
  },
  {
    id: "ai-8",
    type: "warning",
    title: "Inactive privileged account (45 days)",
    description: "Database Admin 'DBA_Service' elevated privileges unused during the last sprint.",
    timeAgo: "2 days ago",
    severity: "medium",
    submodule: "Access Control",
  },
];

// ==========================================
// 6. VISITOR MANAGEMENT
// ==========================================

export interface VisitorRecord {
  id: string;
  name: string;
  organization: string;
  purpose: string;
  host: string;
  visitDate: string;
  time: string;
  status: "Checked-In" | "On-Site" | "Expected" | "Checked-Out" | "Cancelled";
  badgeNo: string;
  badgeType: "Visitor" | "Contractor" | "Temporary" | "VIP";
  idType: "Aadhaar Card" | "PAN Card" | "Driving License" | "Passport" | "Company ID";
  idReference: string;
  mobile: string;
  email: string;
  accessZone: string;
  escortRequired: boolean;
  ndaSigned: boolean;
  riskLevel: "Low" | "Medium" | "High";
  facility: string;
}

export const mockTodayVisitors: VisitorRecord[] = [
  {
    id: "vis-1",
    name: "Rajesh Kumar",
    organization: "AlphaCorp Tech",
    purpose: "Customer Visit",
    host: "Priya Sharma",
    visitDate: "2026-09-28",
    time: "09:00",
    status: "Checked-In",
    badgeNo: "VIS-084",
    badgeType: "Visitor",
    idType: "Aadhaar Card",
    idReference: "XXXX 1234 5678",
    mobile: "+91 98765 43210",
    email: "rajesh.k@alphacorp.com",
    accessZone: "Access Room - Factory Tour",
    escortRequired: true,
    ndaSigned: true,
    riskLevel: "Low",
    facility: "Plant 2 - Coimbatore",
  },
  {
    id: "vis-2",
    name: "Ananya Iyer",
    organization: "TechCorp Labs",
    purpose: "Audit",
    host: "Ramesh S",
    visitDate: "2026-09-28",
    time: "09:30",
    status: "On-Site",
    badgeNo: "VIS-085",
    badgeType: "Visitor",
    idType: "PAN Card",
    idReference: "ABCDE1234F",
    mobile: "+91 98220 11223",
    email: "ananya.i@techcorp.in",
    accessZone: "R&D Electronics Wing",
    escortRequired: true,
    ndaSigned: true,
    riskLevel: "Medium",
    facility: "Plant 2 - Coimbatore",
  },
  {
    id: "vis-3",
    name: "Vikram",
    organization: "Green Energy Sol",
    purpose: "Meeting",
    host: "Karthik P",
    visitDate: "2026-09-28",
    time: "10:15",
    status: "Checked-In",
    badgeNo: "VIS-086",
    badgeType: "Visitor",
    idType: "Driving License",
    idReference: "TN-37-2020-00129",
    mobile: "+91 97890 88776",
    email: "vikram@greenenergy.com",
    accessZone: "Executive Board Room",
    escortRequired: false,
    ndaSigned: true,
    riskLevel: "Low",
    facility: "Corporate Office",
  },
  {
    id: "vis-4",
    name: "Sunita Rao",
    organization: "TÜV SÜD Asia",
    purpose: "Inspection",
    host: "Divya R",
    visitDate: "2026-09-28",
    time: "11:00",
    status: "Expected",
    badgeNo: "VIS-087",
    badgeType: "VIP",
    idType: "Company ID",
    idReference: "TUV-IND-9844",
    mobile: "+91 94432 55667",
    email: "s.rao@tuvsud.com",
    accessZone: "Testing & Certification Lab",
    escortRequired: true,
    ndaSigned: true,
    riskLevel: "Low",
    facility: "Plant 2 - Coimbatore",
  },
  {
    id: "vis-5",
    name: "Manoj Singh",
    organization: "VoltPower Supplies",
    purpose: "Supplier Meeting",
    host: "Arjun M",
    visitDate: "2026-09-28",
    time: "11:30",
    status: "Expected",
    badgeNo: "VIS-088",
    badgeType: "Temporary",
    idType: "Aadhaar Card",
    idReference: "XXXX 9876 4321",
    mobile: "+91 96001 22334",
    email: "manoj@voltpower.co.in",
    accessZone: "Procurement Meeting Room",
    escortRequired: false,
    ndaSigned: false,
    riskLevel: "Low",
    facility: "Plant 2 - Coimbatore",
  },
  {
    id: "vis-6",
    name: "Li Wei",
    organization: "ChargeTech Global",
    purpose: "Product Demo",
    host: "Priya Sharma",
    visitDate: "2026-09-28",
    time: "12:00",
    status: "Expected",
    badgeNo: "VIS-089",
    badgeType: "Visitor",
    idType: "Passport",
    idReference: "E88776655",
    mobile: "+86 138 0013 8000",
    email: "li.wei@chargetech.cn",
    accessZone: "Wireless EVSE Demo Yard",
    escortRequired: true,
    ndaSigned: true,
    riskLevel: "Medium",
    facility: "Plant 2 - Coimbatore",
  },
];

export interface VisitorRequest {
  id: string;
  requestNo: string;
  visitorName: string;
  organization: string;
  visitDate: string;
  purpose: string;
  approvalStatus: "Approved" | "Pending" | "Rejected";
  visitStatus: "Expected" | "Approval" | "Checked-In" | "Completed";
  host: string;
}

export const mockVisitorRequestsList: VisitorRequest[] = [
  {
    id: "vr-1",
    requestNo: "VR-2026-184",
    visitorName: "Sunita Rao",
    organization: "TÜV SÜD",
    visitDate: "28 Sep 2026",
    purpose: "Inspection",
    approvalStatus: "Approved",
    visitStatus: "Expected",
    host: "Divya R",
  },
  {
    id: "vr-2",
    requestNo: "VR-2026-183",
    visitorName: "Manoj Singh",
    organization: "VoltPower",
    visitDate: "28 Sep 2026",
    purpose: "Supplier Meeting",
    approvalStatus: "Pending",
    visitStatus: "Approval",
    host: "Arjun M",
  },
  {
    id: "vr-3",
    requestNo: "VR-2026-182",
    visitorName: "Li Wei",
    organization: "ChargeTech",
    visitDate: "28 Sep 2026",
    purpose: "Product Demo",
    approvalStatus: "Approved",
    visitStatus: "Expected",
    host: "Priya Sharma",
  },
  {
    id: "vr-4",
    requestNo: "VR-2026-181",
    visitorName: "Daniel Carter",
    organization: "EV Solutions",
    visitDate: "28 Sep 2026",
    purpose: "Meeting",
    approvalStatus: "Pending",
    visitStatus: "Approval",
    host: "Ramesh S",
  },
  {
    id: "vr-5",
    requestNo: "VR-2026-180",
    visitorName: "Priya Nair",
    organization: "Statcon Equipment",
    visitDate: "28 Sep 2026",
    purpose: "Factory Visit",
    approvalStatus: "Approved",
    visitStatus: "Expected",
    host: "Karthik P",
  },
];

// ==========================================
// 7. SURVEILLANCE MANAGEMENT
// ==========================================

export interface SurveillanceCamera {
  id: string;
  cameraCode: string;
  cameraName: string;
  zone: string;
  building: string;
  facility: string;
  cameraType: "Fixed IP Camera" | "PTZ Camera" | "Thermal Camera" | "Panoramic";
  manufacturer: string;
  model: string;
  serialNumber: string;
  ipAddress: string;
  macAddress: string;
  status: "Online" | "Offline" | "Maintenance";
  resolution: string;
  retentionDays: number;
  criticality: "Critical" | "High" | "Medium" | "Low";
  installationDate: string;
  securityClassification: "Internal" | "Confidential" | "Restricted";
  liveImage: string;
}

export const mockSurveillanceCameras: SurveillanceCamera[] = [
  {
    id: "cam-1",
    cameraCode: "CAM-01",
    cameraName: "Main Gate Entry",
    zone: "Main Gate",
    building: "Gatehouse",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Hikvision",
    model: "DS-2CD2043G2-I",
    serialNumber: "HK23456781",
    ipAddress: "192.168.1.101",
    macAddress: "00:1B:44:11:3A:81",
    status: "Online",
    resolution: "4K UHD (3840x2160)",
    retentionDays: 90,
    criticality: "High",
    installationDate: "15 Jan 2026",
    securityClassification: "Restricted",
    liveImage: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-2",
    cameraCode: "CAM-02",
    cameraName: "Reception Lobby",
    zone: "Office",
    building: "Main Building",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Hikvision",
    model: "DS-2CD2143G2-IS",
    serialNumber: "HK23456782",
    ipAddress: "192.168.1.102",
    macAddress: "00:1B:44:11:3A:82",
    status: "Online",
    resolution: "4MP (2560x1440)",
    retentionDays: 90,
    criticality: "Medium",
    installationDate: "15 Jan 2026",
    securityClassification: "Confidential",
    liveImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-3",
    cameraCode: "CAM-03",
    cameraName: "Visitor Parking",
    zone: "Parking",
    building: "Main Building",
    facility: "Plant 2 - Coimbatore",
    cameraType: "PTZ Camera",
    manufacturer: "Dahua",
    model: "SD49225XA-HNR",
    serialNumber: "DH88771122",
    ipAddress: "192.168.1.103",
    macAddress: "00:1B:44:11:3A:83",
    status: "Online",
    resolution: "4K UHD",
    retentionDays: 90,
    criticality: "Medium",
    installationDate: "18 Jan 2026",
    securityClassification: "Internal",
    liveImage: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-4",
    cameraCode: "CAM-PRK-04",
    cameraName: "Parking - East Gate",
    zone: "Parking",
    building: "Main Building",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Hikvision",
    model: "DS-2CD2043G2-I",
    serialNumber: "HK23456789",
    ipAddress: "192.168.1.104",
    macAddress: "00:1B:44:11:3A:87",
    status: "Online",
    resolution: "4MP (2560x1440)",
    retentionDays: 90,
    criticality: "High",
    installationDate: "15 Jan 2026",
    securityClassification: "Confidential",
    liveImage: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-5",
    cameraCode: "CAM-05",
    cameraName: "Office Lobby Corridor",
    zone: "Office",
    building: "Main Building",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Axis",
    model: "P3245-V",
    serialNumber: "AX99882211",
    ipAddress: "192.168.1.105",
    macAddress: "00:1B:44:11:3A:85",
    status: "Online",
    resolution: "1080p FHD",
    retentionDays: 90,
    criticality: "Medium",
    installationDate: "20 Jan 2026",
    securityClassification: "Confidential",
    liveImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-6",
    cameraCode: "CAM-06",
    cameraName: "Conference Room South",
    zone: "Office",
    building: "Main Building",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Axis",
    model: "M3065-V",
    serialNumber: "AX99882212",
    ipAddress: "192.168.1.106",
    macAddress: "00:1B:44:11:3A:86",
    status: "Online",
    resolution: "1080p FHD",
    retentionDays: 90,
    criticality: "Low",
    installationDate: "20 Jan 2026",
    securityClassification: "Internal",
    liveImage: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-7",
    cameraCode: "CAM-07",
    cameraName: "Manufacturing Floor Bay 1",
    zone: "Manufacturing",
    building: "Plant Floor",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Hikvision",
    model: "DS-2CD2T87G2P-LSU/SL",
    serialNumber: "HK77884411",
    ipAddress: "192.168.1.107",
    macAddress: "00:1B:44:11:3A:87",
    status: "Online",
    resolution: "4K UHD Panoramic",
    retentionDays: 180,
    criticality: "High",
    installationDate: "22 Jan 2026",
    securityClassification: "Restricted",
    liveImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-8",
    cameraCode: "CAM-08",
    cameraName: "Warehouse High Bay",
    zone: "Warehouse",
    building: "Warehouse A",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Hikvision",
    model: "DS-2CD2043G2-I",
    serialNumber: "HK77884412",
    ipAddress: "192.168.1.108",
    macAddress: "00:1B:44:11:3A:88",
    status: "Online",
    resolution: "4MP (2560x1440)",
    retentionDays: 180,
    criticality: "High",
    installationDate: "22 Jan 2026",
    securityClassification: "Confidential",
    liveImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-9",
    cameraCode: "CAM-09",
    cameraName: "R&D Electronics Cleanroom",
    zone: "R&D Lab",
    building: "Innovation Centre",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Bosch",
    model: "FLEXIDOME IP starlight 8000i",
    serialNumber: "BS44556677",
    ipAddress: "192.168.1.109",
    macAddress: "00:1B:44:11:3A:89",
    status: "Online",
    resolution: "4K UHD",
    retentionDays: 180,
    criticality: "Critical",
    installationDate: "25 Jan 2026",
    securityClassification: "Restricted",
    liveImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-10",
    cameraCode: "CAM-10",
    cameraName: "Wireless Charging Test Station",
    zone: "Charging Station",
    building: "Outdoor Testing Yard",
    facility: "Plant 2 - Coimbatore",
    cameraType: "PTZ Camera",
    manufacturer: "Hikvision",
    model: "DS-2DE4425IW-DE",
    serialNumber: "HK99112233",
    ipAddress: "192.168.1.110",
    macAddress: "00:1B:44:11:3A:90",
    status: "Online",
    resolution: "4MP 25X PTZ",
    retentionDays: 180,
    criticality: "Critical",
    installationDate: "26 Jan 2026",
    securityClassification: "Restricted",
    liveImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-11",
    cameraCode: "CAM-11",
    cameraName: "Perimeter Fence - North",
    zone: "Perimeter",
    building: "Perimeter",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Thermal Camera",
    manufacturer: "FLIR",
    model: "Elara FB-Series ID",
    serialNumber: "FL55443322",
    ipAddress: "192.168.1.111",
    macAddress: "00:1B:44:11:3A:91",
    status: "Online",
    resolution: "Thermal Bi-Spectrum",
    retentionDays: 180,
    criticality: "Critical",
    installationDate: "28 Jan 2026",
    securityClassification: "Restricted",
    liveImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-12",
    cameraCode: "CAM-12",
    cameraName: "Loading Bay Dock 3",
    zone: "Warehouse",
    building: "Warehouse A",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Hikvision",
    model: "DS-2CD2043G2-I",
    serialNumber: "HK66554433",
    ipAddress: "192.168.1.112",
    macAddress: "00:1B:44:11:3A:92",
    status: "Online",
    resolution: "4MP (2560x1440)",
    retentionDays: 90,
    criticality: "High",
    installationDate: "28 Jan 2026",
    securityClassification: "Confidential",
    liveImage: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-13",
    cameraCode: "CAM-13",
    cameraName: "Data Centre Server Room",
    zone: "Office",
    building: "IT Block",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Axis",
    model: "P3245-LV",
    serialNumber: "AX77665544",
    ipAddress: "192.168.1.113",
    macAddress: "00:1B:44:11:3A:93",
    status: "Online",
    resolution: "1080p IR",
    retentionDays: 365,
    criticality: "Critical",
    installationDate: "30 Jan 2026",
    securityClassification: "Restricted",
    liveImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-14",
    cameraCode: "CAM-14",
    cameraName: "High Voltage Electrical Room",
    zone: "Manufacturing",
    building: "Substation B",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Thermal Camera",
    manufacturer: "Hikvision",
    model: "DS-2TD2617-6/QA",
    serialNumber: "HK11224455",
    ipAddress: "192.168.1.114",
    macAddress: "00:1B:44:11:3A:94",
    status: "Online",
    resolution: "Thermal Temp Monitoring",
    retentionDays: 180,
    criticality: "Critical",
    installationDate: "30 Jan 2026",
    securityClassification: "Restricted",
    liveImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-15",
    cameraCode: "CAM-15",
    cameraName: "Battery Storage Vault",
    zone: "Warehouse",
    building: "Hazardous Storage",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Bosch",
    model: "FLEXIDOME IP 5000i",
    serialNumber: "BS99887766",
    ipAddress: "192.168.1.115",
    macAddress: "00:1B:44:11:3A:95",
    status: "Offline",
    resolution: "5MP UHD",
    retentionDays: 180,
    criticality: "Critical",
    installationDate: "02 Feb 2026",
    securityClassification: "Restricted",
    liveImage: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cam-16",
    cameraCode: "CAM-16",
    cameraName: "Parking South Exit Gate",
    zone: "Parking",
    building: "Perimeter",
    facility: "Plant 2 - Coimbatore",
    cameraType: "Fixed IP Camera",
    manufacturer: "Hikvision",
    model: "DS-2CD2043G2-I",
    serialNumber: "HK33221144",
    ipAddress: "192.168.1.116",
    macAddress: "00:1B:44:11:3A:96",
    status: "Maintenance",
    resolution: "4MP (2560x1440)",
    retentionDays: 90,
    criticality: "Medium",
    installationDate: "02 Feb 2026",
    securityClassification: "Internal",
    liveImage: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&q=80",
  },
];

export interface SurveillanceAlert {
  id: string;
  time: string;
  cameraCode: string;
  event: string;
  severity: "Critical" | "High" | "Medium" | "Low";
}

export const mockSurveillanceAlerts: SurveillanceAlert[] = [
  { id: "al-1", time: "10:21 AM", cameraCode: "CAM-PRK-04", event: "Motion Detected", severity: "High" },
  { id: "al-2", time: "10:15 AM", cameraCode: "CAM-GATE-01", event: "Unauthorized Entry", severity: "High" },
  { id: "al-3", time: "10:12 AM", cameraCode: "CAM-WH-08", event: "Camera Tampering", severity: "Medium" },
  { id: "al-4", time: "09:58 AM", cameraCode: "CAM-PRM-02", event: "Perimeter Breach", severity: "High" },
  { id: "al-5", time: "09:42 AM", cameraCode: "CAM-FAC-11", event: "Video Loss", severity: "Medium" },
];

export interface SurveillanceIncidentRecord {
  id: string;
  date: string;
  incidentNo: string;
  type: string;
  status: "Investigating" | "Open" | "Resolved" | "Closed";
}

export const mockSurveillanceIncidents: SurveillanceIncidentRecord[] = [
  { id: "si-1", date: "28 Sep 2026", incidentNo: "INC-2026-005", type: "Unauthorized Entry", status: "Investigating" },
  { id: "si-2", date: "26 Sep 2026", incidentNo: "INC-2026-004", type: "Theft Attempt", status: "Open" },
  { id: "si-3", date: "24 Sep 2026", incidentNo: "INC-2026-003", type: "Camera Tampering", status: "Resolved" },
  { id: "si-4", date: "21 Sep 2026", incidentNo: "INC-2026-002", type: "Restricted Area Access", status: "Open" },
  { id: "si-5", date: "18 Sep 2026", incidentNo: "INC-2026-001", type: "Vandalism", status: "Closed" },
];

// ==========================================
// 8. SECURITY AUDIT
// ==========================================

export interface SecurityAuditItem {
  id: string;
  auditId: string;
  auditArea: "Information Security" | "Physical Security" | "Surveillance" | "Access Control" | "Visitor Management";
  facility: string;
  auditor: string;
  status: "Planned" | "In Progress" | "Reported" | "Closed";
  date: string;
}

export const mockUpcomingAudits: SecurityAuditItem[] = [
  { id: "aud-1", date: "28 Sep 2026", auditId: "AUD-2026-021", auditArea: "Information Security", facility: "HQ - Namakkal", auditor: "Ramesh S", status: "Planned" },
  { id: "aud-2", date: "30 Sep 2026", auditId: "AUD-2026-022", auditArea: "Physical Security", facility: "Plant 2 - Coimbatore", auditor: "Priya Sharma", status: "Planned" },
  { id: "aud-3", date: "02 Oct 2026", auditId: "AUD-2026-023", auditArea: "Surveillance", facility: "R&D Centre", auditor: "Karthik P", status: "Planned" },
  { id: "aud-4", date: "05 Oct 2026", auditId: "AUD-2026-024", auditArea: "Access Control", facility: "Plant 1 - Coimbatore", auditor: "Divya R", status: "Planned" },
  { id: "aud-5", date: "07 Oct 2026", auditId: "AUD-2026-025", auditArea: "Visitor Management", facility: "HQ - Namakkal", auditor: "Anil Verma", status: "Planned" },
];

export interface AuditFindingItem {
  id: string;
  findingCode: string;
  area: string;
  severity: "Critical" | "Major" | "Minor" | "Observation";
  status: "Open" | "CAPA" | "Closed";
  targetDate: string;
}

export const mockOpenFindingsList: AuditFindingItem[] = [
  { id: "fnd-1", findingCode: "FND-001", area: "Access Control", severity: "Critical", status: "Open", targetDate: "10 Oct 2026" },
  { id: "fnd-2", findingCode: "FND-002", area: "Surveillance", severity: "Major", status: "Open", targetDate: "15 Oct 2026" },
  { id: "fnd-3", findingCode: "FND-003", area: "Visitor Management", severity: "Major", status: "Open", targetDate: "18 Oct 2026" },
  { id: "fnd-4", findingCode: "FND-004", area: "Cybersecurity", severity: "Minor", status: "CAPA", targetDate: "20 Oct 2026" },
  { id: "fnd-5", findingCode: "FND-005", area: "Physical Security", severity: "Minor", status: "Open", targetDate: "22 Oct 2026" },
];


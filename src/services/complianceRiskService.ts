// Magnertia ERP - Compliance Risk Service
// Compliance Risk Form - MAICW Classification & Regulatory Assurance Engine

export type ComplianceDomain =
  | "Legal & Regulatory"
  | "Product Compliance"
  | "Financial Compliance"
  | "Cybersecurity & Privacy"
  | "Quality Compliance"
  | "Employment & HR"
  | "ESG Compliance"
  | "Commercial";

export type ComplianceRequirementType =
  | "Law"
  | "Regulation"
  | "Standard"
  | "License"
  | "Permit"
  | "Contract"
  | "Policy";

export type ComplianceRiskPriority = "Critical" | "High" | "Medium" | "Low";

export type ComplianceRiskStatus =
  | "Draft"
  | "Under Assessment"
  | "Applicability Review"
  | "Gap Identified"
  | "Treatment Required"
  | "Remediation In Progress"
  | "Under Verification"
  | "Monitoring"
  | "Escalated"
  | "Accepted"
  | "Verified"
  | "Closed"
  | "Archived";

export interface ComplianceRiskRecord {
  id: string; // Auto Number (A) e.g. CR-2026-001
  riskCode: string; // Controlled Ref (A) e.g. RK-CMP-PRD-01
  title: string; // Mandatory (M)
  complianceDomain: ComplianceDomain; // Dropdown (M)
  requirementId: string; // Lookup (M)
  requirementName: string; // Lookup (M)
  requirementType: ComplianceRequirementType; // Dropdown (M)
  jurisdiction: "India" | "EU" | "North America" | "Global" | "Regional"; // Dropdown (M)
  businessFunction: string; // Lookup (M)
  department: string; // Lookup (M)
  process: string; // Lookup (M)
  productService?: string; // Lookup (I)
  project?: string; // Lookup (I)
  complianceOwner: string; // Lookup (M)
  complianceOwnerAvatar?: string;
  riskOwner: string; // Lookup (M)
  riskOwnerAvatar?: string;
  identificationDate: string; // Date (M)
  reviewDate: string; // Date (M)
  effectiveDate: string; // Date (M)
  complianceDueDate?: string; // Date (I)
  status: ComplianceRiskStatus; // Workflow (W)
  priority: ComplianceRiskPriority; // Dropdown (M)
  version: string; // Number (A)
  confidentiality: "Internal" | "Confidential" | "Restricted"; // (C)

  // Risk Statement
  statement: string; // Failure to meet [REQUIREMENT] may result in [EVENT], causing [IMPACT].
  complianceRequirement: string;
  cause: string;
  event: string;
  complianceGap: string;
  immediateEffect?: string;
  businessImpactSummary?: string;

  // 2x2 Impact Assessment Breakdown
  impacts: {
    regulatoryImpact: "Critical" | "High" | "Medium" | "Low";
    financialImpact: "Critical" | "High" | "Medium" | "Low";
    operationalImpact: "Critical" | "High" | "Medium" | "Low";
    reputationImpact: "Critical" | "High" | "Medium" | "Low";
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
  treatmentStrategy:
    | "Avoid"
    | "Reduce"
    | "Transfer"
    | "Accept"
    | "Remediate"
    | "Strengthen Control"
    | "Update Policy"
    | "Certification";
}

export interface ComplianceKRI {
  id: string;
  name: string;
  current: string;
  threshold: string;
  status: "Red" | "Amber" | "Green";
  trend: "up" | "down" | "neutral";
  metric: string;
  owner: string;
}

export interface ComplianceActionItem {
  id: string;
  action: string;
  owner: string;
  dueDate: string;
  budget?: string;
  status: "In Progress" | "Open" | "Not Started" | "Completed" | "Verified";
  evidence?: string;
}

export interface ComplianceRequirementItem {
  id: string;
  name: string;
  issuingAuthority: string;
  jurisdiction: string;
  referenceNumber: string;
  requirementType: ComplianceRequirementType;
  effectiveDate: string;
  expiryDate?: string;
  applicability: "Applicable" | "Partially Applicable" | "Not Applicable" | "Under Review";
  mandatoryStatus: "Mandatory" | "Voluntary";
  relatedFunction: string;
  evidenceRequirement: string;
}

export interface ComplianceObligationItem {
  id: string;
  obligation: string;
  requirement: string;
  owner: string;
  frequency: "Monthly" | "Quarterly" | "Bi-annual" | "Annual" | "Per Product" | "Per Batch";
  dueDate: string;
  evidence: string;
  status: "Active" | "Pending Review" | "In Progress" | "Completed" | "Overdue";
}

export interface ComplianceGapItem {
  id: string;
  requirement: string;
  control: string;
  currentState: string;
  requiredState: string;
  gapType: "Documentation Gap" | "Process Gap" | "Testing Gap" | "Control Gap" | "License Expiry";
  severity: "Critical" | "High" | "Medium" | "Low";
  owner: string;
  targetClosureDate: string;
  status: "Open" | "In Remediation" | "Pending Audit" | "Closed";
  evidence?: string;
}

export interface ComplianceControlItem {
  id: string;
  controlName: string;
  controlType: "Preventive" | "Detective" | "Corrective";
  objective: string;
  owner: string;
  frequency: "Continuous" | "Per Batch" | "Monthly" | "Quarterly" | "Annual";
  designEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  operatingEffectiveness: "Effective" | "Partially Effective" | "Ineffective";
  result: "Effective" | "Partially Effective" | "Ineffective";
  relatedSOP: string;
}

export interface ComplianceEvidenceItem {
  id: string;
  requirement: string;
  control: string;
  documentTitle: string;
  documentType: "Certificate" | "License" | "Permit" | "Audit Report" | "Test Report" | "Filing Receipt";
  version: string;
  owner: string;
  issuingBody: string;
  issuedDate: string;
  expiryDate: string;
  validityStatus: "Valid" | "Expiring Soon" | "Expired" | "Pending Renewal";
  daysRemaining: number;
}

// PRIMARY MASTER RECORD MATCHING SCREENSHOT EXACTLY
export const PRIMARY_COMPLIANCE_RISK: ComplianceRiskRecord = {
  id: "CR-2026-001",
  riskCode: "RK-CMP-PRD-01",
  title: "Non-compliance with BIS certification for WPT chargers",
  complianceDomain: "Product Compliance",
  requirementId: "REQ-BIS-17017",
  requirementName: "BIS IS 17017",
  requirementType: "Standard",
  jurisdiction: "India",
  businessFunction: "Product Development",
  department: "R&D - Engineering",
  process: "Product Development",
  productService: "W-EVSE Charging Station",
  project: "Product Development",
  complianceOwner: "Ramesh S",
  complianceOwnerAvatar: "RS",
  riskOwner: "Priya Sharma",
  riskOwnerAvatar: "PS",
  identificationDate: "15-Sep-2026",
  reviewDate: "15-Dec-2026",
  effectiveDate: "01-Jul-2026",
  complianceDueDate: "31-Dec-2026",
  status: "Monitoring",
  priority: "High",
  version: "1.0",
  confidentiality: "Internal",

  statement:
    "Failure to meet BIS IS 17017 certification requirements for wireless power transfer chargers may result in delay in product launch, regulatory penalties and loss of market access in India.",
  complianceRequirement: "BIS IS 17017: Electric Vehicle Conductive & Inductive Charging Safety and Interoperability",
  cause: "Delayed electromagnetic shielding test report from external NABL certified testing facility",
  event: "Inability to secure Bureau of Indian Standards (BIS) mark before scheduled market launch date",
  complianceGap: "Final test laboratory verification report pending submission to portal",
  immediateEffect: "Commercial shipment hold on 120 production-line EVSE charger units",
  businessImpactSummary: "Delayed Q4 commercial revenue and statutory prohibition on retail sales without valid BIS registration",

  impacts: {
    regulatoryImpact: "High",
    financialImpact: "Medium",
    operationalImpact: "High",
    reputationImpact: "Medium",
  },

  likelihood: 4, // Likely
  impact: 5, // Severe
  inherentScore: 20, // 4 x 5 = 20 (High/Critical)
  inherentLevel: "Critical",

  residualLikelihood: 3, // Possible
  residualImpact: 4, // Major
  residualScore: 12, // 3 x 4 = 12 (High)
  residualLevel: "High",

  controlEffectiveness: "Partially Effective",
  treatmentStrategy: "Remediate",
};

// TOP 5 COMPLIANCE RISKS (SCREENSHOT MATCH)
export const TOP_COMPLIANCE_RISKS = [
  {
    id: "CR-001",
    title: "BIS certification delay",
    domain: "Product",
    inherent: 20,
    residual: 12,
    status: "Monitoring" as const,
  },
  {
    id: "CR-002",
    title: "GST compliance error",
    domain: "Financial",
    inherent: 16,
    residual: 8,
    status: "Open" as const,
  },
  {
    id: "CR-003",
    title: "Data privacy non-compliance",
    domain: "Cybersecurity",
    inherent: 15,
    residual: 9,
    status: "Monitoring" as const,
  },
  {
    id: "CR-004",
    title: "License renewal delay",
    domain: "Legal",
    inherent: 12,
    residual: 6,
    status: "Escalated" as const,
  },
  {
    id: "CR-005",
    title: "Labour law non-compliance",
    domain: "HR",
    inherent: 12,
    residual: 8,
    status: "Monitoring" as const,
  },
];

// KEY RISK INDICATORS TABLE (SCREENSHOT MATCH)
export const COMPLIANCE_KRIS: ComplianceKRI[] = [
  {
    id: "KRI-CMP-01",
    name: "Regulatory Filing On-Time (%)",
    current: "85%",
    threshold: "> 95%",
    status: "Amber",
    trend: "down",
    metric: "Timely Submission of Statutory Filings",
    owner: "Corporate Legal & Compliance",
  },
  {
    id: "KRI-CMP-02",
    name: "Certificate Expiry (Days)",
    current: "45",
    threshold: "< 60",
    status: "Amber",
    trend: "down",
    metric: "Days to Earliest Key Certification Expiry",
    owner: "Quality & Regulatory Affairs",
  },
  {
    id: "KRI-CMP-03",
    name: "Open Audit Findings",
    current: "8",
    threshold: "< 5",
    status: "Red",
    trend: "up",
    metric: "Unresolved External & Internal Non-Conformances",
    owner: "Quality Assurance QA Desk",
  },
  {
    id: "KRI-CMP-04",
    name: "Policy Acknowledgement (%)",
    current: "92%",
    threshold: "> 98%",
    status: "Amber",
    trend: "neutral",
    metric: "Annual Code of Conduct & Policy Sign-off",
    owner: "HR Governance Desk",
  },
  {
    id: "KRI-CMP-05",
    name: "Training Completion (%)",
    current: "88%",
    threshold: "> 95%",
    status: "Red",
    trend: "up",
    metric: "Mandatory Compliance Training Completion",
    owner: "Human Resources L&D",
  },
  {
    id: "KRI-CMP-06",
    name: "Contract Compliance (%)",
    current: "96%",
    threshold: "> 98%",
    status: "Green",
    trend: "neutral",
    metric: "Vendor & Customer SLA Legal Adherence",
    owner: "Legal & Contracts Team",
  },
];

// COMPLIANCE ACTION PLAN TABLE (SCREENSHOT MATCH)
export const COMPLIANCE_ACTION_PLAN: ComplianceActionItem[] = [
  {
    id: "ACT-CMP-01",
    action: "Submit BIS certification documentation",
    owner: "Ramesh S",
    dueDate: "30-Sep-2026",
    budget: "₹ 4.5 L",
    status: "In Progress",
    evidence: "Draft technical dossier and ARAI test report submitted to BIS portal",
  },
  {
    id: "ACT-CMP-02",
    action: "Update GST filing process",
    owner: "Finance Team",
    dueDate: "20-Sep-2026",
    budget: "₹ 1.2 L",
    status: "Open",
    evidence: "Implemented automated reconciliation script for GSTR-2B vs ERP AP subledger",
  },
  {
    id: "ACT-CMP-03",
    action: "Complete data protection training",
    owner: "HR Team",
    dueDate: "30-Oct-2026",
    budget: "₹ 2.0 L",
    status: "Open",
    evidence: "Assigned interactive DPDP Act compliance module to all 340 corporate staff",
  },
  {
    id: "ACT-CMP-04",
    action: "Renew factory license",
    owner: "Admin Team",
    dueDate: "15-Nov-2026",
    budget: "₹ 3.0 L",
    status: "Not Started",
    evidence: "Architectural drawings and safety inspection certificate prepared for renewal portal",
  },
  {
    id: "ACT-CMP-05",
    action: "Close audit findings",
    owner: "Quality Team",
    dueDate: "30-Sep-2026",
    budget: "₹ 1.8 L",
    status: "Open",
    evidence: "Root cause analysis approved for 5 minor calibration non-conformances",
  },
];

// RISK TREND (INHERENT VS RESIDUAL) OVER 6 MONTHS (SCREENSHOT MATCH)
export const COMPLIANCE_RISK_TREND = [
  { month: "Apr 2026", inherent: 18, residual: 6 },
  { month: "May 2026", inherent: 20, residual: 7 },
  { month: "Jun 2026", inherent: 22, residual: 9 },
  { month: "Jul 2026", inherent: 24, residual: 10 },
  { month: "Aug 2026", inherent: 26, residual: 11 },
  { month: "Sep 2026", inherent: 28, residual: 12 },
];

// RISK BY COMPLIANCE DOMAIN (SCREENSHOT MATCH: 36 TOTAL RISKS)
export const COMPLIANCE_DOMAIN_DISTRIBUTION = [
  { name: "Legal & Regulatory", percentage: 25, count: 9, color: "#3b82f6" },
  { name: "Product Compliance", percentage: 17, count: 6, color: "#10b981" },
  { name: "Financial Compliance", percentage: 14, count: 5, color: "#f59e0b" },
  { name: "Cybersecurity & Privacy", percentage: 11, count: 4, color: "#ef4444" },
  { name: "Quality Compliance", percentage: 11, count: 4, color: "#8b5cf6" },
  { name: "Employment & HR", percentage: 8, count: 3, color: "#06b6d4" },
  { name: "ESG Compliance", percentage: 8, count: 3, color: "#14b8a6" },
  { name: "Commercial", percentage: 6, count: 2, color: "#6366f1" },
];

// AI COMPLIANCE INSIGHTS (SCREENSHOT MATCH: 6 BULLETS)
export const COMPLIANCE_AI_INSIGHTS = [
  {
    num: 1,
    color: "bg-teal-500 text-white",
    text: "2 certificates will expire in next 60 days.",
  },
  {
    num: 2,
    color: "bg-blue-600 text-white",
    text: "Open audit findings increased by 33% this quarter.",
  },
  {
    num: 3,
    color: "bg-cyan-500 text-white",
    text: "New regulatory draft on wireless charging expected in Q4.",
  },
  {
    num: 4,
    color: "bg-purple-600 text-white",
    text: "Training completion rate is below target (88%).",
  },
  {
    num: 5,
    color: "bg-rose-500 text-white",
    text: "Recommend review of vendor compliance documents.",
  },
  {
    num: 6,
    color: "bg-emerald-600 text-white",
    text: "Overall compliance risk exposure is within acceptable limits.",
  },
];

// FULL REGISTER OF 36 COMPLIANCE RISKS
export const FULL_COMPLIANCE_RISKS: ComplianceRiskRecord[] = [
  PRIMARY_COMPLIANCE_RISK,
  {
    id: "CR-2026-002",
    riskCode: "RK-CMP-FIN-02",
    title: "GST input tax credit mismatch and e-invoice reporting delays",
    complianceDomain: "Financial Compliance",
    requirementId: "REQ-GST-2017",
    requirementName: "Central GST Act 2017",
    requirementType: "Law",
    jurisdiction: "India",
    businessFunction: "Finance & Accounts",
    department: "Taxation Desk",
    process: "Accounts Payable",
    productService: "Commercial Supply Contracts",
    project: "ERP Tax Integration",
    complianceOwner: "Arun Kumar",
    complianceOwnerAvatar: "AK",
    riskOwner: "Finance Team",
    riskOwnerAvatar: "FT",
    identificationDate: "01-Sep-2026",
    reviewDate: "01-Dec-2026",
    effectiveDate: "01-Jul-2017",
    complianceDueDate: "20-Oct-2026",
    status: "Open",
    priority: "High",
    version: "1.0",
    confidentiality: "Confidential",
    statement:
      "Failure to reconcile supplier invoices in GSTR-2B before monthly filing may cause ₹18.4L in disallowed input tax credits and interest penalties.",
    complianceRequirement: "CGST Section 16(2)(aa) - Mandatory matching of ITC with supplier portal filings",
    cause: "Delayed vendor invoice uploads on GSTN portal",
    event: "Disallowance of input credit and demand notices with 18% p.a. interest",
    complianceGap: "Real-time portal webhook sync pending deployment",
    impacts: {
      regulatoryImpact: "Medium",
      financialImpact: "High",
      operationalImpact: "Medium",
      reputationImpact: "Low",
    },
    likelihood: 4,
    impact: 4,
    inherentScore: 16,
    inherentLevel: "High",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    controlEffectiveness: "Partially Effective",
    treatmentStrategy: "Strengthen Control",
  },
  {
    id: "CR-2026-003",
    riskCode: "RK-CMP-CYB-03",
    title: "Data privacy non-compliance with Digital Personal Data Protection Act",
    complianceDomain: "Cybersecurity & Privacy",
    requirementId: "REQ-DPDP-2023",
    requirementName: "DPDP Act 2023",
    requirementType: "Act",
    jurisdiction: "India",
    businessFunction: "IT & Information Security",
    department: "Cybersecurity Desk",
    process: "Customer Telematics & Portal Access",
    productService: "EV Charging Mobile App",
    project: "DPDP Governance Implementation",
    complianceOwner: "Vikram Malhotra",
    complianceOwnerAvatar: "VM",
    riskOwner: "Priya Sharma",
    riskOwnerAvatar: "PS",
    identificationDate: "20-Aug-2026",
    reviewDate: "20-Nov-2026",
    effectiveDate: "01-Aug-2023",
    complianceDueDate: "30-Nov-2026",
    status: "Monitoring",
    priority: "High",
    version: "1.0",
    confidentiality: "Restricted",
    statement:
      "Failure to implement verified consent architecture and data fiduciary audit trails may trigger regulatory notices and statutory penalties up to ₹250 Cr under DPDP Act.",
    complianceRequirement: "Section 6 & 8 DPDP Act 2023 - Notice, Consent, and Data Protection Board reporting",
    cause: "Legacy charging app storing vehicle telemetry without explicit granular consent prompts",
    event: "Data subject complaint filed with Data Protection Board of India",
    complianceGap: "Consent manager API module not yet enabled in production build",
    impacts: {
      regulatoryImpact: "Critical",
      financialImpact: "High",
      operationalImpact: "Medium",
      reputationImpact: "High",
    },
    likelihood: 3,
    impact: 5,
    inherentScore: 15,
    inherentLevel: "High",
    residualLikelihood: 3,
    residualImpact: 3,
    residualScore: 9,
    residualLevel: "Moderate",
    controlEffectiveness: "Partially Effective",
    treatmentStrategy: "Remediate",
  },
  {
    id: "CR-2026-004",
    riskCode: "RK-CMP-LGL-04",
    title: "Factory license renewal delay and safety compliance review",
    complianceDomain: "Legal & Regulatory",
    requirementId: "REQ-FAC-1948",
    requirementName: "Factories Act 1948",
    requirementType: "Law",
    jurisdiction: "India",
    businessFunction: "Administration & Facilities",
    department: "Admin Operations",
    process: "Plant Operations & Industrial Safety",
    productService: "Charging Station Assembly Unit 1",
    project: "Plant Safety Audit 2026",
    complianceOwner: "Karthik R",
    complianceOwnerAvatar: "KR",
    riskOwner: "Admin Team",
    riskOwnerAvatar: "AT",
    identificationDate: "12-Aug-2026",
    reviewDate: "12-Nov-2026",
    effectiveDate: "01-Jan-1949",
    complianceDueDate: "15-Nov-2026",
    status: "Escalated",
    priority: "High",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Failure to obtain timely renewal of Unit 1 Factory License before 15-Nov-2026 may result in stop-work orders by the Inspectorate of Factories and legal penalties.",
    complianceRequirement: "Section 6 Factories Act 1948 - Annual License Renewal and Safety Clearance",
    cause: "Pending hazardous waste disposal compliance certificate from regional pollution board",
    event: "Interim stop-work notice issued to assembly line",
    complianceGap: "Effluent treatment testing report overdue by 14 days",
    impacts: {
      regulatoryImpact: "High",
      financialImpact: "Medium",
      operationalImpact: "Critical",
      reputationImpact: "Medium",
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
    treatmentStrategy: "Remediate",
  },
  {
    id: "CR-2026-005",
    riskCode: "RK-CMP-HR-05",
    title: "Labour law non-compliance and contract worker statutory registers",
    complianceDomain: "Employment & HR",
    requirementId: "REQ-CLRA-1970",
    requirementName: "Contract Labour (R&A) Act 1970",
    requirementType: "Law",
    jurisdiction: "India",
    businessFunction: "Human Resources",
    department: "HR Operations Desk",
    process: "Contract Staff Onboarding & Wage Verification",
    productService: "Plant Assembly Workforce",
    project: "Statutory HR Audit",
    complianceOwner: "Priya Sharma",
    complianceOwnerAvatar: "PS",
    riskOwner: "HR Team",
    riskOwnerAvatar: "HT",
    identificationDate: "05-Sep-2026",
    reviewDate: "05-Dec-2026",
    effectiveDate: "10-Feb-1971",
    complianceDueDate: "10-Nov-2026",
    status: "Monitoring",
    priority: "Medium",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Failure of security and facility contractors to submit EPF/ESIC payment challans on schedule may expose Magnertia to principal employer vicarious liabilities.",
    complianceRequirement: "Section 21 Contract Labour Act - Principal employer responsibility for statutory dues",
    cause: "Contractor vendor delayed electronic submission of bank payment confirmations",
    event: "Show-cause notice from regional Provident Fund commissioner",
    complianceGap: "Missing biometric wage register integration for subcontractor staff",
    impacts: {
      regulatoryImpact: "Medium",
      financialImpact: "Medium",
      operationalImpact: "Low",
      reputationImpact: "Medium",
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
    treatmentStrategy: "Strengthen Control",
  },
  {
    id: "CR-2026-006",
    riskCode: "RK-CMP-PRD-06",
    title: "Automotive AIS-138 / AIS-156 EV safety standard compliance certification",
    complianceDomain: "Product Compliance",
    requirementId: "REQ-AIS-156",
    requirementName: "AIS-156 Amendment 3",
    requirementType: "Standard",
    jurisdiction: "India",
    businessFunction: "Product Development",
    department: "Quality Assurance",
    process: "Battery Pack Thermal Runaway Testing",
    productService: "Heavy Duty EV Charging Station Pack",
    project: "Homologation Phase 2",
    complianceOwner: "Ramesh S",
    complianceOwnerAvatar: "RS",
    riskOwner: "Quality Team",
    riskOwnerAvatar: "QT",
    identificationDate: "28-Aug-2026",
    reviewDate: "28-Nov-2026",
    effectiveDate: "01-Apr-2023",
    complianceDueDate: "15-Jan-2027",
    status: "Monitoring",
    priority: "Critical",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Failure to pass thermal runaway propagation and BMS active monitoring test protocols will invalidate ARAI homologation, blocking vehicle OEM supply agreements.",
    complianceRequirement: "MoRTH AIS-156 standard for EV traction battery safety",
    cause: "Thermal propagation test chamber scheduling backlog at ARAI Pune",
    event: "Delay in vehicle type approval certificate issuance",
    complianceGap: "Secondary test bench validation data pending sign-off",
    impacts: {
      regulatoryImpact: "Critical",
      financialImpact: "Critical",
      operationalImpact: "High",
      reputationImpact: "High",
    },
    likelihood: 4,
    impact: 5,
    inherentScore: 20,
    inherentLevel: "Critical",
    residualLikelihood: 2,
    residualImpact: 4,
    residualScore: 8,
    residualLevel: "Moderate",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Remediate",
  },
  {
    id: "CR-2026-007",
    riskCode: "RK-CMP-ESG-07",
    title: "Extended Producer Responsibility (EPR) e-waste compliance registration",
    complianceDomain: "ESG Compliance",
    requirementId: "REQ-EPR-2022",
    requirementName: "E-Waste (Management) Rules 2022",
    requirementType: "Regulation",
    jurisdiction: "India",
    businessFunction: "Supply Chain & EHS",
    department: "Sustainability Desk",
    process: "End-of-Life Recycling & Battery Buyback",
    productService: "All EVSE Models",
    project: "Green Supply Chain 2026",
    complianceOwner: "Karthik R",
    complianceOwnerAvatar: "KR",
    riskOwner: "Sustainability Lead",
    riskOwnerAvatar: "SL",
    identificationDate: "15-Jul-2026",
    reviewDate: "15-Oct-2026",
    effectiveDate: "01-Apr-2023",
    complianceDueDate: "31-Dec-2026",
    status: "Monitoring",
    priority: "Medium",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Non-fulfilment of statutory EPR recycling credit targets on Central Pollution Control Board portal may attract environmental compensation penalties.",
    complianceRequirement: "CPCB EPR Portal Registration and Recycling Target Fulfillment",
    cause: "Tie-up delays with certified electronic waste recyclers in South zone",
    event: "Imposition of financial penalties under polluter-pays principle",
    complianceGap: "Signed SLA with authorized recycler pending board sign-off",
    impacts: {
      regulatoryImpact: "High",
      financialImpact: "Medium",
      operationalImpact: "Low",
      reputationImpact: "High",
    },
    likelihood: 3,
    impact: 3,
    inherentScore: 9,
    inherentLevel: "Moderate",
    residualLikelihood: 2,
    residualImpact: 2,
    residualScore: 4,
    residualLevel: "Low",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Reduce",
  },
  {
    id: "CR-2026-008",
    riskCode: "RK-CMP-QLT-08",
    title: "ISO 9001:2015 surveillance audit findings and calibration non-conformance",
    complianceDomain: "Quality Compliance",
    requirementId: "REQ-ISO-9001",
    requirementName: "ISO 9001:2015",
    requirementType: "Standard",
    jurisdiction: "Global",
    businessFunction: "Quality Management",
    department: "QA Quality Control",
    process: "Gauge Calibration & Supplier Quality Audit",
    productService: "All Products",
    project: "Surveillance Audit 2026",
    complianceOwner: "Ramesh S",
    complianceOwnerAvatar: "RS",
    riskOwner: "Quality Team",
    riskOwnerAvatar: "QT",
    identificationDate: "02-Aug-2026",
    reviewDate: "02-Nov-2026",
    effectiveDate: "15-Sep-2015",
    complianceDueDate: "30-Sep-2026",
    status: "Treatment Required",
    priority: "Medium",
    version: "1.0",
    confidentiality: "Internal",
    statement:
      "Failure to close 3 minor calibration non-conformances identified in TUV surveillance audit will trigger certification hold, jeopardizing defense client qualification.",
    complianceRequirement: "Clause 7.1.5 ISO 9001:2015 - Monitoring and Measuring Resources",
    cause: "Expired calibration certificates on 4 digital torque wrenches in assembly line 2",
    event: "Issuance of Major NC and potential suspension of ISO 9001 certification",
    complianceGap: "Calibration tracking software alert sync failed",
    impacts: {
      regulatoryImpact: "High",
      financialImpact: "Medium",
      operationalImpact: "Medium",
      reputationImpact: "High",
    },
    likelihood: 3,
    impact: 3,
    inherentScore: 9,
    inherentLevel: "Moderate",
    residualLikelihood: 1,
    residualImpact: 3,
    residualScore: 3,
    residualLevel: "Low",
    controlEffectiveness: "Effective",
    treatmentStrategy: "Remediate",
  },
];

// REQUIREMENTS MASTER (SECTION 4)
export const COMPLIANCE_REQUIREMENTS_MASTER: ComplianceRequirementItem[] = [
  {
    id: "REQ-BIS-17017",
    name: "BIS IS 17017: Electric Vehicle Charging Station Safety",
    issuingAuthority: "Bureau of Indian Standards (BIS)",
    jurisdiction: "India",
    referenceNumber: "IS 17017 (Part 1 & 21)",
    requirementType: "Standard",
    effectiveDate: "01-Jul-2026",
    expiryDate: "30-Jun-2029",
    applicability: "Applicable",
    mandatoryStatus: "Mandatory",
    relatedFunction: "Product Development & QA",
    evidenceRequirement: "Type Test Lab Report & Certificate of Conformity",
  },
  {
    id: "REQ-GST-2017",
    name: "Central Goods & Services Tax (CGST) Act",
    issuingAuthority: "Central Board of Indirect Taxes & Customs (CBIC)",
    jurisdiction: "India",
    referenceNumber: "Act 12 of 2017",
    requirementType: "Law",
    effectiveDate: "01-Jul-2017",
    applicability: "Applicable",
    mandatoryStatus: "Mandatory",
    relatedFunction: "Finance & Accounts",
    evidenceRequirement: "Monthly GSTR-1, GSTR-3B filings and e-invoices",
  },
  {
    id: "REQ-DPDP-2023",
    name: "Digital Personal Data Protection Act 2023",
    issuingAuthority: "Ministry of Electronics & Information Technology (MeitY)",
    jurisdiction: "India",
    referenceNumber: "Act 22 of 2023",
    requirementType: "Act",
    effectiveDate: "11-Aug-2023",
    applicability: "Applicable",
    mandatoryStatus: "Mandatory",
    relatedFunction: "IT, Legal & Mobile App Team",
    evidenceRequirement: "Consent Artifacts, Privacy Notice, DPO Appointment",
  },
  {
    id: "REQ-FAC-1948",
    name: "The Factories Act 1948 & State Factory Rules",
    issuingAuthority: "Directorate of Industrial Safety & Health (DISH)",
    jurisdiction: "India",
    referenceNumber: "Act 63 of 1948",
    requirementType: "Law",
    effectiveDate: "01-Apr-1949",
    expiryDate: "31-Dec-2026",
    applicability: "Applicable",
    mandatoryStatus: "Mandatory",
    relatedFunction: "Admin & Operations",
    evidenceRequirement: "Annual Factory License and Safety Audit Certificate",
  },
  {
    id: "REQ-AIS-156",
    name: "AIS-156 (Amd 3): EV Battery Safety Homologation",
    issuingAuthority: "Ministry of Road Transport and Highways (MoRTH)",
    jurisdiction: "India",
    referenceNumber: "AIS-156/Amd 3",
    requirementType: "Regulation",
    effectiveDate: "01-Apr-2023",
    expiryDate: "31-Mar-2028",
    applicability: "Applicable",
    mandatoryStatus: "Mandatory",
    relatedFunction: "R&D Battery Systems",
    evidenceRequirement: "ARAI Homologation Certificate",
  },
  {
    id: "REQ-ISO-9001",
    name: "ISO 9001:2015 Quality Management Systems",
    issuingAuthority: "International Organization for Standardization (ISO / TUV)",
    jurisdiction: "Global",
    referenceNumber: "ISO 9001:2015",
    requirementType: "Standard",
    effectiveDate: "15-Sep-2015",
    expiryDate: "14-Sep-2027",
    applicability: "Applicable",
    mandatoryStatus: "Mandatory",
    relatedFunction: "Quality Management",
    evidenceRequirement: "Annual Surveillance Audit Report & Certificate",
  },
  {
    id: "REQ-ISO-27001",
    name: "ISO/IEC 27001:2022 Information Security Management",
    issuingAuthority: "British Standards Institution (BSI)",
    jurisdiction: "Global",
    referenceNumber: "ISO/IEC 27001:2022",
    requirementType: "Standard",
    effectiveDate: "25-Oct-2022",
    expiryDate: "24-Oct-2025",
    applicability: "Applicable",
    mandatoryStatus: "Mandatory",
    relatedFunction: "Information Security",
    evidenceRequirement: "Statement of Applicability (SoA) & ISO Certificate",
  },
  {
    id: "REQ-EPR-2022",
    name: "E-Waste (Management) Rules 2022",
    issuingAuthority: "Central Pollution Control Board (CPCB)",
    jurisdiction: "India",
    referenceNumber: "GSR 811(E)",
    requirementType: "Regulation",
    effectiveDate: "01-Apr-2023",
    expiryDate: "31-Mar-2027",
    applicability: "Applicable",
    mandatoryStatus: "Mandatory",
    relatedFunction: "Sustainability & Logistics",
    evidenceRequirement: "CPCB EPR Portal Certificate & Recycling Invoices",
  },
];

// OBLIGATIONS REGISTER (SECTION 6)
export const COMPLIANCE_OBLIGATIONS_REGISTER: ComplianceObligationItem[] = [
  {
    id: "OBL-001",
    obligation: "Monthly GSTR-1 Outward Supplies Filing",
    requirement: "Central GST Act 2017",
    owner: "Finance Team",
    frequency: "Monthly",
    dueDate: "11-Oct-2026",
    evidence: "GST Portal Filing Acknowledgment ARN",
    status: "Active",
  },
  {
    id: "OBL-002",
    obligation: "Monthly GSTR-3B Summary Return & Tax Payment",
    requirement: "Central GST Act 2017",
    owner: "Finance Team",
    frequency: "Monthly",
    dueDate: "20-Oct-2026",
    evidence: "Bank Challan & Return Form",
    status: "Active",
  },
  {
    id: "OBL-003",
    obligation: "Annual Factory License Renewal & Fees",
    requirement: "Factories Act 1948",
    owner: "Admin Operations",
    frequency: "Annual",
    dueDate: "15-Nov-2026",
    evidence: "DISH Form 2 & Fee Receipt",
    status: "Pending Review",
  },
  {
    id: "OBL-004",
    obligation: "BIS IS 17017 Certification Type Test Submission",
    requirement: "BIS IS 17017",
    owner: "Ramesh S (R&D)",
    frequency: "Per Product",
    dueDate: "30-Sep-2026",
    evidence: "ARAI Accredited Test Report",
    status: "In Progress",
  },
  {
    id: "OBL-005",
    obligation: "ISO 27001 Surveillance Audit & Penetration Testing",
    requirement: "ISO/IEC 27001:2022",
    owner: "IT Security",
    frequency: "Annual",
    dueDate: "15-Dec-2026",
    evidence: "CERT-In Auditor VAPT Report",
    status: "In Progress",
  },
  {
    id: "OBL-006",
    obligation: "Statutory Financial Audit Form AOC-4 ROC Filing",
    requirement: "Companies Act 2013",
    owner: "Company Secretary",
    frequency: "Annual",
    dueDate: "30-Oct-2026",
    evidence: "MCA Portal SRN Receipt",
    status: "Active",
  },
  {
    id: "OBL-007",
    obligation: "Quarterly TDS Return Form 26Q & 24Q",
    requirement: "Income Tax Act 1961",
    owner: "Finance Desk",
    frequency: "Quarterly",
    dueDate: "31-Oct-2026",
    evidence: "TRACES Token Number",
    status: "Active",
  },
];

// COMPLIANCE GAPS DATABASE (SECTION 17)
export const COMPLIANCE_GAPS_DATABASE: ComplianceGapItem[] = [
  {
    id: "GAP-001",
    requirement: "BIS IS 17017 WPT Standards",
    control: "Pre-compliance EMC Chamber Validation",
    currentState: "Radiation immunity test protocol completed at 85%",
    requiredState: "100% full-load certification from accredited NABL laboratory",
    gapType: "Testing Gap",
    severity: "Critical",
    owner: "Ramesh S",
    targetClosureDate: "30-Sep-2026",
    status: "In Remediation",
    evidence: "Lab bench slots booked at SAMEER Chennai",
  },
  {
    id: "GAP-002",
    requirement: "Central GST Act 2017",
    control: "Vendor ITC Automated Reconciliation",
    currentState: "Manual monthly batch comparison in spreadsheet",
    requiredState: "Automated API webhook validation preventing payment on unfiled ITC",
    gapType: "Control Gap",
    severity: "High",
    owner: "Finance Team",
    targetClosureDate: "20-Sep-2026",
    status: "Open",
    evidence: "ERP module build patch 2.4 under staging verification",
  },
  {
    id: "GAP-003",
    requirement: "DPDP Act 2023",
    control: "Consent Management Architecture",
    currentState: "Implicit consent on user account registration",
    requiredState: "Granular opt-in consent for telemetry, analytics, and service notifications",
    gapType: "Process Gap",
    severity: "High",
    owner: "Vikram Malhotra",
    targetClosureDate: "30-Oct-2026",
    status: "In Remediation",
    evidence: "Updated privacy notice and mobile SDK wireframes",
  },
  {
    id: "GAP-004",
    requirement: "Factories Act 1948",
    control: "Industrial Safety & Fire NOC",
    currentState: "Fire hydrants inspected; pollution board renewal pending test results",
    requiredState: "Formal renewal certificate issued by Fire & Emergency Services",
    gapType: "License Expiry",
    severity: "Critical",
    owner: "Admin Operations",
    targetClosureDate: "15-Nov-2026",
    status: "Open",
    evidence: "Renewal application docket 49201 uploaded to state single-window portal",
  },
];

// COMPLIANCE CONTROLS MASTER (SECTION 15 & 16)
export const COMPLIANCE_CONTROLS_MASTER: ComplianceControlItem[] = [
  {
    id: "CTL-CMP-01",
    controlName: "Automated Regulatory Watch & Gazette Feed Scanner",
    controlType: "Preventive",
    objective: "Identify new statutory notifications and amendments within 48 hours of gazette publishing",
    owner: "Corporate Legal Desk",
    frequency: "Continuous",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Effective",
    relatedSOP: "SOP-LGL-01 Regulatory Horizon Scanning",
  },
  {
    id: "CTL-CMP-02",
    controlName: "Product Design Gateway Compliance Sign-Off (Gate G4)",
    controlType: "Preventive",
    objective: "Ensure all statutory test protocols and safety standards are verified before pilot tooling release",
    owner: "Quality Assurance & Chief Engineer",
    frequency: "Per Batch",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Partially Effective",
    result: "Partially Effective",
    relatedSOP: "SOP-ENG-08 Gate Review Governance",
  },
  {
    id: "CTL-CMP-03",
    controlName: "Automated Three-Way Tax Reconciliation & GSTR-2B Validator",
    controlType: "Detective",
    objective: "Block AP disbursements to vendors with unfiled invoices or delinquent GST status",
    owner: "Finance & Accounts",
    frequency: "Monthly",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Effective",
    relatedSOP: "SOP-FIN-09 Statutory Tax Controls",
  },
  {
    id: "CTL-CMP-04",
    controlName: "Annual Statutory Audit & Third-Party Non-Conformance Review",
    controlType: "Detective",
    objective: "Verify legal and standard compliance across all operating entities and manufacturing sites",
    owner: "Internal Audit Lead",
    frequency: "Annual",
    designEffectiveness: "Effective",
    operatingEffectiveness: "Effective",
    result: "Effective",
    relatedSOP: "SOP-AUD-02 Internal Audit Charter",
  },
];

// COMPLIANCE EVIDENCE MASTER (SECTION 25)
export const COMPLIANCE_EVIDENCE_MASTER: ComplianceEvidenceItem[] = [
  {
    id: "EVD-001",
    requirement: "BIS IS 17017",
    control: "Pre-compliance Test",
    documentTitle: "ARAI Wireless Power Transfer EMI/EMC Test Certificate",
    documentType: "Test Report",
    version: "2.1",
    owner: "Ramesh S",
    issuingBody: "Automotive Research Association of India (ARAI)",
    issuedDate: "10-Aug-2026",
    expiryDate: "09-Aug-2029",
    validityStatus: "Valid",
    daysRemaining: 1048,
  },
  {
    id: "EVD-002",
    requirement: "Factories Act 1948",
    control: "Plant Safety Audit",
    documentTitle: "Unit 1 Factory License Renewal Certificate",
    documentType: "License",
    version: "2025",
    owner: "Admin Team",
    issuingBody: "Directorate of Industrial Safety & Health",
    issuedDate: "01-Jan-2026",
    expiryDate: "15-Nov-2026",
    validityStatus: "Expiring Soon",
    daysRemaining: 51,
  },
  {
    id: "EVD-003",
    requirement: "ISO 9001:2015",
    control: "Quality System Certification",
    documentTitle: "ISO 9001:2015 Certificate of Registration",
    documentType: "Certificate",
    version: "Rev 4",
    owner: "Quality Team",
    issuingBody: "TÜV Rheinland India Pvt Ltd",
    issuedDate: "15-Sep-2024",
    expiryDate: "14-Sep-2027",
    validityStatus: "Valid",
    daysRemaining: 354,
  },
  {
    id: "EVD-004",
    requirement: "ISO/IEC 27001:2022",
    control: "Information Security Management",
    documentTitle: "BSI Information Security Management Certificate",
    documentType: "Certificate",
    version: "2022",
    owner: "IT Security",
    issuingBody: "British Standards Institution (BSI)",
    issuedDate: "25-Oct-2023",
    expiryDate: "24-Oct-2026",
    validityStatus: "Expiring Soon",
    daysRemaining: 29,
  },
  {
    id: "EVD-005",
    requirement: "Central GST Act 2017",
    control: "Tax Filing Verification",
    documentTitle: "GSTR-3B Filing Acknowledgment Receipt - August 2026",
    documentType: "Filing Receipt",
    version: "Final",
    owner: "Finance Team",
    issuingBody: "Goods & Services Tax Network (GSTN)",
    issuedDate: "20-Sep-2026",
    expiryDate: "N/A",
    validityStatus: "Valid",
    daysRemaining: 999,
  },
];

// MAICW FIELD TAXONOMY (SECTION 1)
export const COMPLIANCE_MAICW_FIELDS = [
  { field: "Compliance Risk ID", type: "Auto Number", maicw: "A", description: "Unique risk identifier (CR-YYYY-XXX)" },
  { field: "Risk Code", type: "Text", maicw: "A", description: "Controlled reference e.g. RK-CMP-PRD-01" },
  { field: "Risk Title", type: "Text", maicw: "M", description: "Short descriptive risk title (Mandatory)" },
  { field: "Compliance Domain", type: "Dropdown", maicw: "M", description: "Legal, Product, Tax, Cyber, HR, ESG" },
  { field: "Requirement ID", type: "Lookup", maicw: "M", description: "Applicable requirement code (REQ-BIS-17017)" },
  { field: "Requirement Name", type: "Lookup", maicw: "M", description: "Regulation / standard / policy name" },
  { field: "Requirement Type", type: "Dropdown", maicw: "M", description: "Law, Regulation, Standard, License, Contract" },
  { field: "Jurisdiction", type: "Dropdown", maicw: "M", description: "India, EU, North America, Global" },
  { field: "Business Function", type: "Lookup", maicw: "M", description: "Affected business function (Product Dev)" },
  { field: "Department", type: "Lookup", maicw: "M", description: "Responsible department (R&D Engineering)" },
  { field: "Process", type: "Lookup", maicw: "M", description: "Affected business process" },
  { field: "Product / Service", type: "Lookup", maicw: "I", description: "Related product/service (W-EVSE)" },
  { field: "Project", type: "Lookup", maicw: "I", description: "Related project code" },
  { field: "Compliance Owner", type: "Lookup", maicw: "M", description: "Accountable compliance owner (Ramesh S)" },
  { field: "Risk Owner", type: "Lookup", maicw: "M", description: "Assigned risk owner (Priya Sharma)" },
  { field: "Identification Date", type: "Date", maicw: "M", description: "Date initially identified" },
  { field: "Review Date", type: "Date", maicw: "M", description: "Next scheduled review date" },
  { field: "Effective Date", type: "Date", maicw: "M", description: "Requirement statutory effective date" },
  { field: "Compliance Due Date", type: "Date", maicw: "I", description: "Statutory / licensing compliance deadline" },
  { field: "Status", type: "Workflow", maicw: "W", description: "Draft, Monitoring, Escalated, Verified, Closed" },
  { field: "Priority", type: "Dropdown", maicw: "M", description: "Critical, High, Medium, Low" },
  { field: "Version", type: "Number", maicw: "A", description: "Automated version control tracking" },
  { field: "Confidentiality", type: "Dropdown", maicw: "C", description: "Internal, Confidential, Restricted" },
];

// REPORTS SUITE (SECTION 43)
export const COMPLIANCE_REPORT_DEFINITIONS = [
  { id: "CMP-REP-01", name: "Compliance Risk Register", category: "Portfolio", desc: "Complete compliance risk portfolio with inherent and residual scores" },
  { id: "CMP-REP-02", name: "Executive Compliance Dashboard", category: "Executive", desc: "Board-level statutory view, open gaps, and license expirations" },
  { id: "CMP-REP-03", name: "Compliance Risk Heat Map", category: "Matrix", desc: "5x5 Likelihood vs Impact distribution across regulatory domains" },
  { id: "CMP-REP-04", name: "Critical Compliance Risk Report", category: "Critical", desc: "High and critical exposure risks requiring immediate legal remedy" },
  { id: "CMP-REP-05", name: "Regulatory Compliance & Filings", category: "Regulatory", desc: "Statutory returns, GST filings, MCA declarations, and submission timestamps" },
  { id: "CMP-REP-06", name: "Product Certification Status (BIS/AIS)", category: "Product", desc: "Type approvals, lab testing schedules, and certification renewals" },
  { id: "CMP-REP-07", name: "License & Permit Expiry Tracking", category: "Licensing", desc: "180d, 90d, 60d, 30d countdown alerts for industrial licenses" },
  { id: "CMP-REP-08", name: "Internal & External Audit Findings", category: "Audit", desc: "Audit non-conformances, root cause analysis, and CAPA verification logs" },
  { id: "CMP-REP-09", name: "Compliance Gap Analysis & Remediation", category: "Gaps", desc: "Open gaps against statutory requirements and targeted closure dates" },
  { id: "CMP-REP-10", name: "Regulatory Horizon & Gazette Changes", category: "Horizon", desc: "New draft legislations, notifications, and enterprise impact evaluations" },
  { id: "CMP-REP-11", name: "AI Compliance Risk Intelligence Digest", category: "AI Analytics", desc: "Predictive filing delinquency, pattern detection, and automated gap alerts" },
];

export const complianceRiskService = {
  getPrimaryRisk: () => PRIMARY_COMPLIANCE_RISK,
  getTopRisks: () => TOP_COMPLIANCE_RISKS,
  getKRIs: () => COMPLIANCE_KRIS,
  getActionPlan: () => COMPLIANCE_ACTION_PLAN,
  getRiskTrend: () => COMPLIANCE_RISK_TREND,
  getDomainDistribution: () => COMPLIANCE_DOMAIN_DISTRIBUTION,
  getAIInsights: () => COMPLIANCE_AI_INSIGHTS,
  getFullRisks: () => FULL_COMPLIANCE_RISKS,
  getRequirements: () => COMPLIANCE_REQUIREMENTS_MASTER,
  getObligations: () => COMPLIANCE_OBLIGATIONS_REGISTER,
  getGaps: () => COMPLIANCE_GAPS_DATABASE,
  getControls: () => COMPLIANCE_CONTROLS_MASTER,
  getEvidence: () => COMPLIANCE_EVIDENCE_MASTER,
  getMAICWFields: () => COMPLIANCE_MAICW_FIELDS,
  getReports: () => COMPLIANCE_REPORT_DEFINITIONS,
};

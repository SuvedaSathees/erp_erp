// Magnertia ERP - Incident Management Service
// Incident Management Form - MAICW Classification & Incident Response Engine

export type IncidentType =
  | "Operational"
  | "Quality"
  | "Safety"
  | "Cybersecurity"
  | "Compliance"
  | "Business";

export type IncidentCategory =
  | "Equipment Failure"
  | "Process Failure"
  | "Production Incident"
  | "Facility Incident"
  | "Product Defect"
  | "Supplier Quality Incident"
  | "Injury"
  | "Near Miss"
  | "Cyber Attack"
  | "Data Breach"
  | "Regulatory Breach"
  | "Contractual Breach";

export type IncidentSource =
  | "Employee"
  | "Customer"
  | "Supplier"
  | "Partner"
  | "System Alert"
  | "IoT Alert"
  | "Security Monitoring"
  | "Quality Inspection"
  | "Audit"
  | "AI Detection";

export type IncidentSeverity = "S1 - Critical" | "S2 - Major" | "S3 - Moderate" | "S4 - Minor";
export type IncidentPriority = "Critical" | "High" | "Medium" | "Low";

export type IncidentStatus =
  | "Draft"
  | "Reported"
  | "Acknowledged"
  | "Under Assessment"
  | "Containment"
  | "Investigating"
  | "RCA In Progress"
  | "Corrective Action"
  | "Recovery"
  | "Verification"
  | "Management Review"
  | "Resolved"
  | "Closed"
  | "Archived";

export interface IncidentRecord {
  id: string; // Auto Number (A) e.g. INC-2026-001
  incidentNumber: string; // Controlled Ref (A) e.g. INC-PL3-2026-001
  title: string; // Mandatory (M)
  type: IncidentType; // Dropdown (M)
  category: IncidentCategory; // Dropdown (M)
  source: IncidentSource; // Dropdown (M)
  businessFunction: string; // Lookup (M) e.g. Manufacturing
  department: string; // Lookup (M) e.g. Production
  process?: string; // Lookup (I) e.g. Final Inverter Assembly
  location: string; // Lookup (M) e.g. Plant 2 - Line 3
  incidentDate: string; // DateTime (M) e.g. 28 Sep 2026 10:35
  detectionDate: string; // DateTime (M) e.g. 28 Sep 2026 10:40
  reportedDate: string; // DateTime (M) e.g. 28 Sep 2026 10:45
  reportedBy: string; // Lookup (M) e.g. Ramesh S
  reportedByAvatar?: string;
  incidentOwner: string; // Lookup (M) e.g. Arun Kumar
  incidentOwnerAvatar?: string;
  incidentCoordinator?: string; // Lookup (I)
  priority: IncidentPriority; // Dropdown (M) e.g. High
  severity: IncidentSeverity; // Dropdown (M) e.g. S2 - Major
  status: IncidentStatus; // Workflow (W) e.g. Investigating
  confidentiality: "Internal" | "Confidential" | "Restricted"; // (C)
  version: string; // Number (A) e.g. 1.0

  // Overview & Statement
  statement: string; // On [DATE/TIME], [INCIDENT] occurred at [LOCATION], affecting [ASSET], resulting in [IMPACT].
  description: string;
  detectionMethod: string;
  affectedAsset?: string;
  affectedProduct?: string;
  affectedProject?: string;
  affectedCustomer?: string;
  affectedVendor?: string;
  affectedEmployee?: string;
  initialImpact: string;
  currentCondition: string;
  businessImpactSummary: string;

  // Impact Metrics
  impactMetrics: {
    productionDowntimeHours: number;
    estimatedCostLakhs: number;
    injuriesCount: number;
    environmentalImpact: "None" | "Low" | "Medium" | "High";
  };

  // Linkage Counts
  linkage: {
    complianceRecordsCount: number;
    riskRegisterCount: number;
    ncrCount: number;
    capaActionsCount: number;
  };

  // RCA & Cause
  immediateCause?: string;
  contributingCauses?: string[];
  rootCause?: string;
  rcaMethod?: "5 Why" | "Fishbone" | "8D" | "Fault Tree";
}

export interface IncidentActionItem {
  id: string; // e.g. CAPA-2026-101
  incidentId: string;
  description: string;
  owner: string;
  dueDate: string;
  status: "In Progress" | "Open" | "Pending" | "Completed" | "Verified";
  actionType: "Immediate Correction" | "Corrective Action" | "Preventive Action";
  evidence?: string;
}

export interface IncidentTimelineEvent {
  id: string;
  event: string;
  dateTime: string;
  owner: string;
  status: "Completed" | "In Progress" | "Pending";
  remarks?: string;
}

export interface IncidentEvidenceItem {
  id: string;
  title: string;
  type: "Photograph" | "System Log" | "Machine Log" | "IoT Data" | "Test Report" | "Witness Statement";
  source: string;
  capturedAt: string;
  collectedBy: string;
  fileSize: string;
  status: "Verified" | "Under Review";
}

export interface IncidentAlertItem {
  id: string;
  incidentId: string;
  title: string;
  timeAgo: string;
  severity: "Critical" | "Warning" | "Info";
  type: "Critical Incident" | "CAPA Overdue" | "Investigation Required" | "Regulatory Notice" | "SLA Alert";
}

// PRIMARY MASTER RECORD MATCHING SCREENSHOT EXACTLY
export const PRIMARY_INCIDENT_RECORD: IncidentRecord = {
  id: "INC-2026-001",
  incidentNumber: "INC-PL3-2026-001",
  title: "Equipment Failure - Production Line 3",
  type: "Operational",
  category: "Equipment Failure",
  source: "Employee",
  businessFunction: "Manufacturing",
  department: "Production",
  process: "Final Inverter Assembly & Packaging",
  location: "Plant 2 - Line 3",
  incidentDate: "28 Sep 2026 10:35",
  detectionDate: "28 Sep 2026 10:40",
  reportedDate: "28 Sep 2026 10:45",
  reportedBy: "Ramesh S",
  reportedByAvatar: "RK",
  incidentOwner: "Arun Kumar",
  incidentOwnerAvatar: "AK",
  incidentCoordinator: "Priya Sharma",
  priority: "High",
  severity: "S2 - Major",
  status: "Investigating",
  confidentiality: "Internal",
  version: "1.0",

  statement:
    "On 28 Sep 2026 10:35, Equipment Failure occurred at Plant 2 - Line 3, affecting Main Transfer Conveyor Motor M-04, resulting in unexpected shutdown and production stoppage for 2 hours.",
  description:
    "Unexpected shutdown of conveyor motor caused production stoppage for 2 hours.",
  detectionMethod: "PLC Scada vibration sensor anomaly followed by physical conveyor lock",
  affectedAsset: "Main Conveyor Motor Assembly (M-04)",
  affectedProduct: "30 kW W-EVSE Charging Units",
  affectedProject: "Fast-Charging Commercial Rollout (PRJ-001)",
  affectedCustomer: "National Highway Charging Consortium",
  affectedVendor: "Siemens Drive Systems",
  affectedEmployee: "Line Lead Operator Shift 1",
  initialImpact: "Complete halt of Line 3 assembly with 18 half-assembled chassis halted on carrier belt",
  currentCondition: "Auxiliary backup motor installed; running at 80% throttle while primary unit undergoes teardown",
  businessImpactSummary: "Production loss of 14 finished units, estimated direct downtime cost of ₹1.8 Lakhs",

  impactMetrics: {
    productionDowntimeHours: 2.0,
    estimatedCostLakhs: 1.8,
    injuriesCount: 0,
    environmentalImpact: "Medium",
  },

  linkage: {
    complianceRecordsCount: 3,
    riskRegisterCount: 1,
    ncrCount: 1,
    capaActionsCount: 2,
  },

  immediateCause: "Bearing seizure on primary 7.5kW geared drive shaft due to thermal lubricant degradation",
  contributingCauses: [
    "Preventive maintenance lubrication cycle delayed by 6 working days due to production rush",
    "Auxiliary heat dissipation fan air filter clogged with line packaging dust",
  ],
  rootCause: "Breakdown of preventive maintenance work order dispatch triggering in CMMS software",
  rcaMethod: "5 Why",
};

// RECENT INCIDENTS TABLE (SCREENSHOT MATCH)
export const RECENT_INCIDENTS = [
  {
    date: "28 Sep 2026",
    incidentNumber: "INC-PL3-2026-001",
    title: "Equipment Failure - Line 3",
    type: "Operational",
    severity: "S2",
    severityLabel: "S2 - Major",
    status: "Investigating" as const,
  },
  {
    date: "26 Sep 2026",
    incidentNumber: "INC-QA-2026-045",
    title: "Product Defect - Batch 778",
    type: "Quality",
    severity: "S3",
    severityLabel: "S3 - Moderate",
    status: "Open" as const,
  },
  {
    date: "24 Sep 2026",
    incidentNumber: "INC-SAF-2026-012",
    title: "Minor Injury - Warehouse",
    type: "Safety",
    severity: "S3",
    severityLabel: "S3 - Moderate",
    status: "Resolved" as const,
  },
  {
    date: "20 Sep 2026",
    incidentNumber: "INC-CYB-2026-009",
    title: "Phishing Email Detected",
    type: "Cyber",
    severity: "S4",
    severityLabel: "S4 - Minor",
    status: "Resolved" as const,
  },
  {
    date: "18 Sep 2026",
    incidentNumber: "INC-ENV-2026-004",
    title: "Effluent pH Out of Limit",
    type: "Environmental",
    severity: "S2",
    severityLabel: "S2 - Major",
    status: "Under Review" as const,
  },
];

// OPEN ACTIONS TABLE (SCREENSHOT MATCH)
export const INCIDENT_OPEN_ACTIONS: IncidentActionItem[] = [
  {
    id: "CAPA-2026-101",
    incidentId: "INC-2026-001",
    description: "Replace faulty conveyor motor",
    owner: "Maintenance Team",
    dueDate: "02 Oct 2026",
    status: "In Progress",
    actionType: "Immediate Correction",
    evidence: "Purchase requisition PR-8841 approved for SKF high-temp bearing pack",
  },
  {
    id: "CAPA-2026-102",
    incidentId: "INC-2026-001",
    description: "Review maintenance schedule",
    owner: "Plant Engineer",
    dueDate: "05 Oct 2026",
    status: "Open",
    actionType: "Corrective Action",
    evidence: "Drafted revised 14-day lubrication calendar for heavy-duty conveyors",
  },
  {
    id: "CAPA-2026-103",
    incidentId: "INC-2026-001",
    description: "Update SOP and training",
    owner: "Operations QA",
    dueDate: "07 Oct 2026",
    status: "Open",
    actionType: "Preventive Action",
    evidence: "SOP-MNT-04 updated with daily infrared thermal scan requirements",
  },
  {
    id: "CAPA-2026-104",
    incidentId: "INC-2026-001",
    description: "Verify effectiveness",
    owner: "Quality Head",
    dueDate: "10 Oct 2026",
    status: "Pending",
    actionType: "Corrective Action",
    evidence: "Scheduled 72-hour continuous temperature logging trial",
  },
  {
    id: "CAPA-2026-105",
    incidentId: "INC-2026-001",
    description: "Management review",
    owner: "Plant GM",
    dueDate: "15 Oct 2026",
    status: "Pending",
    actionType: "Preventive Action",
    evidence: "Inclusion in monthly COO operational safety and uptime review",
  },
];

// INCIDENTS BY TYPE DONUT DISTRIBUTION (SCREENSHOT MATCH: 24 TOTAL INCIDENTS)
export const INCIDENT_TYPE_DISTRIBUTION = [
  { name: "Operational", percentage: 33, count: 8, color: "#3b82f6" },
  { name: "Quality", percentage: 21, count: 5, color: "#10b981" },
  { name: "Safety", percentage: 17, count: 4, color: "#f59e0b" },
  { name: "Cyber Security", percentage: 8, count: 2, color: "#8b5cf6" },
  { name: "Compliance", percentage: 8, count: 2, color: "#ec4899" },
  { name: "Environmental", percentage: 4, count: 1, color: "#14b8a6" },
  { name: "Supplier", percentage: 4, count: 1, color: "#ef4444" },
  { name: "Others", percentage: 5, count: 1, color: "#64748b" },
];

// INCIDENT SEVERITY DISTRIBUTION (SCREENSHOT MATCH)
export const INCIDENT_SEVERITY_DATA = [
  { level: "S1 - Critical", count: 2, color: "#ef4444", totalMax: 12 },
  { level: "S2 - Major", count: 6, color: "#f97316", totalMax: 12 },
  { level: "S3 - Moderate", count: 10, color: "#3b82f6", totalMax: 12 },
  { level: "S4 - Minor", count: 6, color: "#10b981", totalMax: 12 },
];

// 12-MONTH STACKED BAR CHART TREND (SCREENSHOT MATCH)
export const INCIDENT_MONTHLY_TREND = [
  { month: "Jan", operational: 3, quality: 2, safety: 1, cyber: 1, compliance: 1, others: 0 },
  { month: "Feb", operational: 4, quality: 1, safety: 1, cyber: 0, compliance: 1, others: 1 },
  { month: "Mar", operational: 4, quality: 2, safety: 2, cyber: 1, compliance: 0, others: 1 },
  { month: "Apr", operational: 4, quality: 2, safety: 2, cyber: 1, compliance: 1, others: 1 },
  { month: "May", operational: 5, quality: 3, safety: 2, cyber: 1, compliance: 1, others: 1 },
  { month: "Jun", operational: 4, quality: 2, safety: 1, cyber: 1, compliance: 1, others: 1 },
  { month: "Jul", operational: 5, quality: 3, safety: 2, cyber: 1, compliance: 1, others: 1 },
  { month: "Aug", operational: 6, quality: 4, safety: 2, cyber: 1, compliance: 1, others: 1 },
  { month: "Sep", operational: 7, quality: 4, safety: 3, cyber: 1, compliance: 1, others: 1 },
  { month: "Oct", operational: 4, quality: 2, safety: 2, cyber: 1, compliance: 1, others: 1 },
  { month: "Nov", operational: 3, quality: 2, safety: 1, cyber: 0, compliance: 1, others: 1 },
  { month: "Dec", operational: 4, quality: 3, safety: 1, cyber: 1, compliance: 1, others: 1 },
];

// ALERTS & NOTIFICATIONS (SCREENSHOT MATCH)
export const INCIDENT_ALERTS: IncidentAlertItem[] = [
  {
    id: "ALT-01",
    incidentId: "INC-PL3-2026-001",
    title: "Critical incident reported (INC-PL3-2026-001)",
    timeAgo: "2 hours ago",
    severity: "Critical",
    type: "Critical Incident",
  },
  {
    id: "ALT-02",
    incidentId: "INC-QA-2026-098",
    title: "CAPA overdue (CAPA-2026-098)",
    timeAgo: "6 hours ago",
    severity: "Warning",
    type: "CAPA Overdue",
  },
  {
    id: "ALT-03",
    incidentId: "INC-SAF-2026-012",
    title: "Investigation update required",
    timeAgo: "1 day ago",
    severity: "Info",
    type: "Investigation Required",
  },
  {
    id: "ALT-04",
    incidentId: "INC-ENV-2026-004",
    title: "Regulatory notification due",
    timeAgo: "2 days ago",
    severity: "Warning",
    type: "Regulatory Notice",
  },
  {
    id: "ALT-05",
    incidentId: "INC-GEN-2026-018",
    title: "3 incidents open beyond 7 days",
    timeAgo: "2 days ago",
    severity: "Warning",
    type: "SLA Alert",
  },
];

// TIMELINE EVENTS
export const INCIDENT_TIMELINE_DATA: IncidentTimelineEvent[] = [
  { id: "TL-01", event: "Incident Occurred", dateTime: "28 Sep 2026 10:35", owner: "Line Operator", status: "Completed", remarks: "Conveyor stopped with audible alarm" },
  { id: "TL-02", event: "Incident Detected", dateTime: "28 Sep 2026 10:40", owner: "SCADA Monitoring", status: "Completed", remarks: "Vibration threshold tripped" },
  { id: "TL-03", event: "Incident Reported", dateTime: "28 Sep 2026 10:45", owner: "Ramesh S", status: "Completed", remarks: "Entered into Magnertia ERP" },
  { id: "TL-04", event: "Incident Acknowledged", dateTime: "28 Sep 2026 10:50", owner: "Arun Kumar", status: "Completed", remarks: "Assigned Maintenance Lead" },
  { id: "TL-05", event: "Containment Started", dateTime: "28 Sep 2026 11:00", owner: "Maintenance Team", status: "Completed", remarks: "Switched line to auxiliary drive" },
  { id: "TL-06", event: "Investigation Started", dateTime: "28 Sep 2026 11:30", owner: "Lead Investigator", status: "In Progress", remarks: "Disassembling bearing housing" },
  { id: "TL-07", event: "Root Cause Identified", dateTime: "29 Sep 2026 14:00", owner: "Quality & Reliability", status: "Pending", remarks: "Awaiting metallurgical lab report" },
  { id: "TL-08", event: "Corrective Action (CAPA)", dateTime: "02 Oct 2026 17:00", owner: "Plant Engineering", status: "Pending", remarks: "Install ceramic high-temp bearings" },
  { id: "TL-09", event: "Recovery Completed", dateTime: "03 Oct 2026 09:00", owner: "Production Head", status: "Pending", remarks: "Full 100% line speed sign-off" },
  { id: "TL-10", event: "Effectiveness Verification", dateTime: "10 Oct 2026 18:00", owner: "QA Governance", status: "Pending", remarks: "72-hour thermal scan audit" },
  { id: "TL-11", event: "Closure & Lessons Learned", dateTime: "15 Oct 2026 12:00", owner: "Risk Desk", status: "Pending", remarks: "Update FMEA & Risk Register" },
];

// EVIDENCE ITEMS
export const INCIDENT_EVIDENCE_ITEMS: IncidentEvidenceItem[] = [
  { id: "EVD-INC-01", title: "Bearing Assembly Seizure Photos", type: "Photograph", source: "Maintenance Inspection Camera", capturedAt: "28 Sep 2026 11:15", collectedBy: "Karthik R", fileSize: "4.2 MB", status: "Verified" },
  { id: "EVD-INC-02", title: "SCADA PLC Vibration & Current Waveforms", type: "System Log", source: "Siemens S7 PLC Historian", capturedAt: "28 Sep 2026 10:55", collectedBy: "Automation Lead", fileSize: "18.5 MB", status: "Verified" },
  { id: "EVD-INC-03", title: "Thermal Infrared Scan of Motor Casing", type: "Photograph", source: "Fluke Ti480 Pro Camera", capturedAt: "28 Sep 2026 11:20", collectedBy: "Electrical Engineer", fileSize: "8.1 MB", status: "Verified" },
  { id: "EVD-INC-04", title: "Operator Shift Witness Statements", type: "Witness Statement", source: "Shop Floor Interview Docket", capturedAt: "28 Sep 2026 14:30", collectedBy: "HR & Safety Officer", fileSize: "1.2 MB", status: "Under Review" },
  { id: "EVD-INC-05", title: "Lubricant Grease Chemical Degradation Analysis", type: "Test Report", source: "NABL External Tribology Lab", capturedAt: "29 Sep 2026 10:00", collectedBy: "QA Lab Specialist", fileSize: "3.4 MB", status: "Under Review" },
];

// 5-WHY ROOT CAUSE ANALYSIS MODEL
export const INCIDENT_5_WHY_ANALYSIS = [
  { step: "Why 1", question: "Why did the production conveyor shut down unexpectedly?", answer: "The 7.5 kW motor tripped on thermal overload after the drive shaft seized.", evidence: "SCADA overload trip code F-041" },
  { step: "Why 2", question: "Why did the drive shaft seize?", answer: "The main drive bearing experienced extreme friction and thermal binding.", evidence: "Infrared thermal scan reading 142°C" },
  { step: "Why 3", question: "Why did the bearing experience extreme friction?", answer: "Lubrication grease had dried out and carbonized inside the raceway.", evidence: "Blackened lubricant residue in teardown" },
  { step: "Why 4", question: "Why was the grease not replenished according to preventive maintenance?", answer: "The scheduled 30-day lubrication work order was deferred during the month-end production ramp.", evidence: "CMMS work order WO-4409 overdue by 6 days" },
  { step: "Why 5", question: "Why did the system allow critical preventive maintenance to be deferred without approval?", answer: "No hard-lock or automated escalation gate existed in the maintenance workflow when overtime production was scheduled.", evidence: "Policy gap in SOP-MNT-02 override rules" },
];

// FULL REGISTER OF 24 INCIDENTS
export const FULL_INCIDENTS_REGISTER: IncidentRecord[] = [
  PRIMARY_INCIDENT_RECORD,
  {
    id: "INC-2026-002",
    incidentNumber: "INC-QA-2026-045",
    title: "Product Defect - High Voltage Ripple on Batch 778",
    type: "Quality",
    category: "Product Defect",
    source: "Quality Inspection",
    businessFunction: "Quality Assurance",
    department: "Quality Control",
    process: "Final End-of-Line Testing",
    location: "Plant 1 - Test Bay 4",
    incidentDate: "26 Sep 2026 14:15",
    detectionDate: "26 Sep 2026 14:20",
    reportedDate: "26 Sep 2026 14:30",
    reportedBy: "Priya Sharma",
    reportedByAvatar: "PS",
    incidentOwner: "Ramesh S",
    incidentOwnerAvatar: "RS",
    priority: "Medium",
    severity: "S3 - Moderate",
    status: "Open",
    confidentiality: "Internal",
    version: "1.0",
    statement: "On 26 Sep 2026 14:15, Product Defect occurred at Plant 1 - Test Bay 4, affecting 30kW EVSE Inverter Batch 778, resulting in 12 units failing ripple voltage test.",
    description: "High harmonic distortion observed during 100% full-load burn-in test.",
    detectionMethod: "Automated oscilloscope test bench alarm",
    affectedProduct: "30kW Inverter Sub-assembly",
    initialImpact: "12 units quarantined at end of line",
    currentCondition: "Investigation underway with component supplier",
    businessImpactSummary: "Shipment hold on Batch 778 valued at ₹8.4 Lakhs",
    impactMetrics: {
      productionDowntimeHours: 0.5,
      estimatedCostLakhs: 0.8,
      injuriesCount: 0,
      environmentalImpact: "None",
    },
    linkage: {
      complianceRecordsCount: 2,
      riskRegisterCount: 1,
      ncrCount: 2,
      capaActionsCount: 1,
    },
  },
  {
    id: "INC-2026-003",
    incidentNumber: "INC-SAF-2026-012",
    title: "Minor Hand Contusion During Pallet Stacking - Warehouse",
    type: "Safety",
    category: "Injury",
    source: "Employee",
    businessFunction: "Supply Chain",
    department: "Warehouse & Logistics",
    process: "Finished Goods Stacking",
    location: "Central Warehouse Dock B",
    incidentDate: "24 Sep 2026 09:20",
    detectionDate: "24 Sep 2026 09:22",
    reportedDate: "24 Sep 2026 09:30",
    reportedBy: "Suresh M",
    reportedByAvatar: "SM",
    incidentOwner: "Karthik R",
    incidentOwnerAvatar: "KR",
    priority: "Medium",
    severity: "S3 - Moderate",
    status: "Resolved",
    confidentiality: "Internal",
    version: "1.0",
    statement: "On 24 Sep 2026 09:20, Minor Injury occurred at Central Warehouse Dock B, affecting loader personnel, resulting in first-aid treatment and 1 hour lost time.",
    description: "Pallet edge slipped during manual alignment causing hand pinch.",
    detectionMethod: "Immediate operator report to First Aid Officer",
    affectedEmployee: "Logistics Loader (Contract)",
    initialImpact: "First-aid administered; worker resumed duty following medical check",
    currentCondition: "Material handling gloves upgraded to Cut Level 4",
    businessImpactSummary: "Zero permanent disability, minor first aid cost",
    impactMetrics: {
      productionDowntimeHours: 0,
      estimatedCostLakhs: 0.1,
      injuriesCount: 1,
      environmentalImpact: "None",
    },
    linkage: {
      complianceRecordsCount: 1,
      riskRegisterCount: 1,
      ncrCount: 0,
      capaActionsCount: 1,
    },
  },
  {
    id: "INC-2026-004",
    incidentNumber: "INC-CYB-2026-009",
    title: "Spear Phishing Email Attempt Against Finance AP Desk",
    type: "Cybersecurity",
    category: "Cyber Attack",
    source: "Security Monitoring",
    businessFunction: "Information Technology",
    department: "Cybersecurity",
    process: "Vendor Invoice Payment Processing",
    location: "Corporate Network - ERP Portal",
    incidentDate: "20 Sep 2026 11:45",
    detectionDate: "20 Sep 2026 11:47",
    reportedDate: "20 Sep 2026 11:50",
    reportedBy: "Vikram Malhotra",
    reportedByAvatar: "VM",
    incidentOwner: "Vikram Malhotra",
    incidentOwnerAvatar: "VM",
    priority: "Low",
    severity: "S4 - Minor",
    status: "Resolved",
    confidentiality: "Confidential",
    version: "1.0",
    statement: "On 20 Sep 2026 11:45, Phishing Email detected on Corporate Network, targeting AP accountant, resulting in automated sandbox quarantine.",
    description: "Spoofed vendor email requesting bank account modification.",
    detectionMethod: "Email Gateway AI heuristic scanner flagged domain similarity mismatch",
    affectedAsset: "Corporate Email Server & AP Subledger",
    initialImpact: "Malicious link blocked; zero credential compromise",
    currentCondition: "Domain blocked firewall-wide; security alert issued to finance staff",
    businessImpactSummary: "Zero financial loss; ₹0 compromise",
    impactMetrics: {
      productionDowntimeHours: 0,
      estimatedCostLakhs: 0,
      injuriesCount: 0,
      environmentalImpact: "None",
    },
    linkage: {
      complianceRecordsCount: 1,
      riskRegisterCount: 1,
      ncrCount: 0,
      capaActionsCount: 1,
    },
  },
  {
    id: "INC-2026-005",
    incidentNumber: "INC-ENV-2026-004",
    title: "Effluent Treatment Plant Discharge pH Excursion",
    type: "Operational",
    category: "Process Failure",
    source: "IoT Alert",
    businessFunction: "EHS & Sustainability",
    department: "Facilities & Plant Engineering",
    process: "Wastewater Treatment & Neutralization",
    location: "Plant 2 - ETP Neutralization Tank",
    incidentDate: "18 Sep 2026 16:10",
    detectionDate: "18 Sep 2026 16:12",
    reportedDate: "18 Sep 2026 16:20",
    reportedBy: "Karthik R",
    reportedByAvatar: "KR",
    incidentOwner: "Karthik R",
    incidentOwnerAvatar: "KR",
    priority: "High",
    severity: "S2 - Major",
    status: "Under Review" as any,
    confidentiality: "Internal",
    version: "1.0",
    statement: "On 18 Sep 2026 16:10, Process Failure occurred at Plant 2 - ETP, affecting pH sensor monitoring, resulting in automatic valve shut-off and recirculation.",
    description: "Treated discharge pH reached 8.8 (permitted limit 6.5 to 8.5).",
    detectionMethod: "Automated telemetry pH probe alarm",
    affectedAsset: "ETP Dosing Pump & Solenoid Valve",
    initialImpact: "Zero off-site discharge; effluent held in equalization tank",
    currentCondition: "Caustic dosing pump recalibrated; pH stabilized at 7.4",
    businessImpactSummary: "Zero environmental penalty; internally contained",
    impactMetrics: {
      productionDowntimeHours: 0,
      estimatedCostLakhs: 0.3,
      injuriesCount: 0,
      environmentalImpact: "Low",
    },
    linkage: {
      complianceRecordsCount: 2,
      riskRegisterCount: 1,
      ncrCount: 1,
      capaActionsCount: 1,
    },
  },
];

// SECTION 1: MAICW CLASSIFICATION FIELDS
export const INCIDENT_MAICW_FIELDS = [
  { field: "Incident ID", type: "Auto Number", maicw: "A", description: "Unique incident identifier (INC-YYYY-XXX)" },
  { field: "Incident Number", type: "Text", maicw: "A", description: "Controlled reference e.g. INC-PL3-2026-001" },
  { field: "Incident Title", type: "Text", maicw: "M", description: "Short descriptive incident title (Mandatory)" },
  { field: "Incident Type", type: "Dropdown", maicw: "M", description: "Operational, Quality, Safety, Cyber, Compliance" },
  { field: "Incident Category", type: "Dropdown", maicw: "M", description: "Classification category" },
  { field: "Incident Source", type: "Dropdown", maicw: "M", description: "Employee, Customer, System, Audit, Supplier" },
  { field: "Business Function", type: "Lookup", maicw: "M", description: "Affected business function (Manufacturing)" },
  { field: "Department", type: "Lookup", maicw: "M", description: "Responsible department (Production)" },
  { field: "Business Process", type: "Lookup", maicw: "I", description: "Affected business process" },
  { field: "Location", type: "Lookup", maicw: "M", description: "Incident physical location" },
  { field: "Incident Date", type: "DateTime", maicw: "M", description: "Date/time of occurrence" },
  { field: "Detection Date", type: "DateTime", maicw: "M", description: "Date/time first detected" },
  { field: "Reported Date", type: "DateTime", maicw: "M", description: "Date/time formally entered" },
  { field: "Reported By", type: "Lookup", maicw: "M", description: "Reporter user ID (Ramesh S)" },
  { field: "Incident Owner", type: "Lookup", maicw: "M", description: "Accountable owner (Arun Kumar)" },
  { field: "Incident Coordinator", type: "Lookup", maicw: "I", description: "Assigned coordinator" },
  { field: "Priority", type: "Dropdown", maicw: "M", description: "Critical, High, Medium, Low" },
  { field: "Severity", type: "Dropdown", maicw: "M", description: "S1 - Critical, S2 - Major, S3 - Moderate, S4 - Minor" },
  { field: "Status", type: "Workflow", maicw: "W", description: "Open, Containment, Investigating, Resolved, Closed" },
  { field: "Confidentiality", type: "Dropdown", maicw: "C", description: "Internal, Confidential, Restricted" },
  { field: "Version", type: "Number", maicw: "A", description: "Record version control (1.0)" },
];

// SECTION 43: REPORTS DEFINITIONS
export const INCIDENT_REPORT_DEFINITIONS = [
  { id: "INC-REP-01", name: "Incident Register & Portfolio Master", category: "Master", desc: "Complete log of all enterprise incidents with root causes and closure status" },
  { id: "INC-REP-02", name: "Executive Incident & Downtime Summary", category: "Executive", desc: "COO/CXO-level incident trends, production downtime, and recurring failure modes" },
  { id: "INC-REP-03", name: "Critical & High Severity (S1/S2) Dossier", category: "Critical", desc: "Deep dive into high-impact operational disruptions and emergency responses" },
  { id: "INC-REP-04", name: "Root Cause Analysis (RCA & 5-Why) Audit", category: "Quality", desc: "Evidence-linked RCA reports, fishbone diagrams, and contributing causes" },
  { id: "INC-REP-05", name: "CAPA Execution & Overdue Actions Report", category: "Actions", desc: "Corrective and preventive action tracking, verification logs, and SLA adherence" },
  { id: "INC-REP-06", name: "Plant Downtime & Financial Loss Analysis", category: "Financial", desc: "Total incident costs, lost throughput hours, and equipment repair expenses" },
  { id: "INC-REP-07", name: "EHS, Occupational Safety & Near-Miss Log", category: "Safety", desc: "Statutory injury logs, near-miss hazard reports, and OSHA/Factories Act compliance" },
  { id: "INC-REP-08", name: "Cybersecurity Alerts & Breach Response Log", category: "Cyber", desc: "Threat intelligence, phishing attacks, unauthorized access attempts, and containment" },
  { id: "INC-REP-09", name: "Repeat Incident & Recurrence Analysis", category: "Analytics", desc: "Algorithmic correlation of repeated failures across equipment, shifts, and parts" },
  { id: "INC-REP-10", name: "AI Incident Intelligence & Early Warning Digest", category: "AI Analytics", desc: "Predictive pattern detection, anomaly correlation, and recurrence forecasts" },
];

export const incidentManagementService = {
  getPrimaryIncident: () => PRIMARY_INCIDENT_RECORD,
  getRecentIncidents: () => RECENT_INCIDENTS,
  getOpenActions: () => INCIDENT_OPEN_ACTIONS,
  getTypeDistribution: () => INCIDENT_TYPE_DISTRIBUTION,
  getSeverityData: () => INCIDENT_SEVERITY_DATA,
  getMonthlyTrend: () => INCIDENT_MONTHLY_TREND,
  getAlerts: () => INCIDENT_ALERTS,
  getTimeline: () => INCIDENT_TIMELINE_DATA,
  getEvidence: () => INCIDENT_EVIDENCE_ITEMS,
  get5Why: () => INCIDENT_5_WHY_ANALYSIS,
  getFullRegister: () => FULL_INCIDENTS_REGISTER,
  getMAICWFields: () => INCIDENT_MAICW_FIELDS,
  getReports: () => INCIDENT_REPORT_DEFINITIONS,
};

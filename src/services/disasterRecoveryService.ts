// Magnertia ERP - Disaster Recovery Service
// Disaster Recovery Form - MAICW Classification & IT Resilience Engine

export type DRPlanType =
  | "Application"
  | "Database"
  | "Infrastructure"
  | "Network"
  | "Cloud"
  | "Enterprise";

export type DRPriority = "Critical" | "High" | "Medium" | "Low";

export type DRStatus =
  | "Draft"
  | "BIA In Progress"
  | "Risk Assessment"
  | "Architecture Design"
  | "Recovery Plan Development"
  | "Review"
  | "Approval Pending"
  | "Approved"
  | "Active"
  | "Testing"
  | "Recovery"
  | "Improvement Required"
  | "Archived";

export interface DisasterRecoveryRecord {
  id: string; // Auto Number (A) e.g. DRP-2026-001
  drCode: string; // Controlled Ref (A) e.g. DR-ERP-001
  planName: string; // Mandatory (M) e.g. ERP Disaster Recovery Plan
  drType: DRPlanType; // Dropdown (M) e.g. Application
  businessFunction: string; // Lookup (M) e.g. Enterprise Operations
  department: string; // Lookup (M) e.g. IT
  itService: string; // Lookup (M) e.g. Magnertia ERP
  application: string; // Lookup (M) e.g. Magnertia ERP
  systemOwner: string; // Lookup (M) e.g. Ramesh S
  systemOwnerAvatar?: string;
  drOwner: string; // Lookup (M) e.g. Priya Kumar
  drOwnerAvatar?: string;
  recoveryCoordinator: string; // Lookup (M) e.g. Vikram K
  recoveryCoordinatorAvatar?: string;
  primarySite: string; // Lookup (M) e.g. Chennai Data Center
  drSite: string; // Lookup (M) e.g. Bangalore Cloud Region
  effectiveDate: string; // Date (M) e.g. 01-Jan-2026
  reviewDate: string; // Date (M) e.g. 01-Jan-2027
  lastTestDate?: string; // Date (I) e.g. 15-Mar-2025
  nextTestDate?: string; // Date (I) e.g. 15-Mar-2026
  status: DRStatus; // Workflow (W) e.g. Active
  priority: DRPriority; // Dropdown (M) e.g. Critical
  version: string; // Number (A) e.g. 1.0
  confidentiality: "Internal" | "Confidential" | "Restricted"; // (C) e.g. Restricted

  // Overview & Scenario
  recoveryObjective: string;
  primaryDisasterScenario: string;
  secondaryDisasterScenario?: string;
  disasterScenarioDescription: string;
  recoveryStatement: string;

  // Recovery Strategy
  strategyType: "Backup & Restore" | "Cold Site" | "Warm Site" | "Hot Site" | "Cloud Disaster Recovery" | "Active-Passive" | "Active-Active";
  recoveryMethod: "Active-Passive" | "Active-Active" | "Failover Replication" | "Cold Standby";
  strategyDetails: string;

  // Target Objectives
  rtoTarget: string; // e.g. 4 hours
  rpoTarget: string; // e.g. 30 mins
  mtdTarget?: string; // e.g. 8 hours

  // Linked Counts (mockup match)
  linkedIncidentsCount: number; // 2
  bcpPlansCount: number; // 1
  riskRecordsCount: number; // 4
  vendorRecordsCount: number; // 2
  changeRequestsCount: number; // 3
  actionItemsCount: number; // 5
}

export interface CriticalITService {
  id: string;
  itService: string;
  application: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  rto: string;
  rpo: string;
  status: "Active" | "Maintenance" | "Degraded" | "Failed";
  owner?: string;
}

export interface DRRecoveryObjectiveItem {
  id: string;
  system: string;
  rto: string;
  rpo: string;
  priority: "Critical" | "High" | "Medium" | "Low";
}

export interface BackupReplicationItem {
  id: string;
  system: string;
  backupStatus: "Success" | "Failed" | "Partial" | "Under Verification";
  lastBackup: string;
  replicationLag: string;
  status: "Healthy" | "Warning" | "Critical";
  backupType?: string;
  location?: string;
}

export interface DRTestExerciseItem {
  id: string;
  testType: string;
  date: string;
  result: "Pass" | "Partial" | "Fail";
  rtoAchieved: string;
  rpoAchieved: string;
  participants?: string;
  findings?: string;
}

export interface DRRunbookStep {
  stepNumber: number;
  title: string;
  description: string;
  responsibleTeam: string;
  estimatedMinutes: number;
  automatedTool?: string;
  validationCheck: string;
}

export interface DRActionItem {
  id: string;
  action: string;
  owner: string;
  dueDate: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Completed" | "Verified";
  evidence?: string;
}

export interface DREmergencyContact {
  role: string;
  primaryContact: string;
  backupContact: string;
  contactMethod: string;
  availability: string;
}

// PRIMARY RECORD MATCHING SCREENSHOT EXACTLY
export const PRIMARY_DRP_RECORD: DisasterRecoveryRecord = {
  id: "DRP-2026-001",
  drCode: "DR-ERP-001",
  planName: "ERP Disaster Recovery Plan",
  drType: "Application",
  businessFunction: "Enterprise Operations",
  department: "IT",
  itService: "Magnertia ERP",
  application: "Magnertia ERP",
  systemOwner: "Ramesh S",
  systemOwnerAvatar: "RS",
  drOwner: "Priya Kumar",
  drOwnerAvatar: "PK",
  recoveryCoordinator: "Vikram K",
  recoveryCoordinatorAvatar: "VK",
  primarySite: "Chennai Data Center",
  drSite: "Bangalore Cloud Region",
  effectiveDate: "01-Jan-2026",
  reviewDate: "01-Jan-2027",
  lastTestDate: "15-Mar-2025",
  nextTestDate: "15-Mar-2026",
  status: "Active",
  priority: "Critical",
  version: "1.0",
  confidentiality: "Restricted",

  recoveryObjective:
    "Ensure recovery of the Magnertia ERP system within defined RTO and RPO to minimize business impact and restore critical operations, data, and integrations.",
  primaryDisasterScenario: "Data Center Failure",
  secondaryDisasterScenario: "Cyber Attack",
  disasterScenarioDescription:
    "Complete loss of primary data center due to natural disaster, resulting in unavailability of ERP and related services.",
  recoveryStatement:
    "If Data Center Failure causes failure of Magnertia ERP, Magnertia will recover ERP Platform within 4 hours RTO and restore data to 30 mins RPO using Bangalore Cloud Region and automated failover runbook.",

  strategyType: "Cloud Disaster Recovery",
  recoveryMethod: "Active-Passive",
  strategyDetails:
    "Use cloud-based DR environment with real-time replication and automated failover to restore ERP services.",

  rtoTarget: "4 hours",
  rpoTarget: "30 mins",
  mtdTarget: "8 hours",

  linkedIncidentsCount: 2,
  bcpPlansCount: 1,
  riskRecordsCount: 4,
  vendorRecordsCount: 2,
  changeRequestsCount: 3,
  actionItemsCount: 5,
};

// 4. CRITICAL IT SERVICES (MATCHING SCREENSHOT TABLE 1:1)
export const DR_CRITICAL_SERVICES: CriticalITService[] = [
  {
    id: "SRV-01",
    itService: "Magnertia ERP",
    application: "Magnertia ERP",
    criticality: "Critical",
    rto: "4 hours",
    rpo: "30 mins",
    status: "Active",
    owner: "Ramesh S (Enterprise Ops)",
  },
  {
    id: "SRV-02",
    itService: "Database Platform",
    application: "Oracle DB",
    criticality: "Critical",
    rto: "2 hours",
    rpo: "15 mins",
    status: "Active",
    owner: "DevOps DBA Cell",
  },
  {
    id: "SRV-03",
    itService: "Integration Services",
    application: "API Platform",
    criticality: "High",
    rto: "4 hours",
    rpo: "1 hour",
    status: "Active",
    owner: "Middleware Architecture",
  },
  {
    id: "SRV-04",
    itService: "Charging Platform",
    application: "Charging Mgmt",
    criticality: "Critical",
    rto: "4 hours",
    rpo: "30 mins",
    status: "Active",
    owner: "EV Operations IT",
  },
  {
    id: "SRV-05",
    itService: "Customer Portal",
    application: "Web Portal",
    criticality: "High",
    rto: "8 hours",
    rpo: "1 hour",
    status: "Active",
    owner: "Digital Experience Desk",
  },
];

// 6. RTO / RPO (MATCHING SCREENSHOT TABLE 1:1)
export const DR_RECOVERY_OBJECTIVES: DRRecoveryObjectiveItem[] = [
  { id: "RTO-01", system: "ERP", rto: "4 hours", rpo: "30 mins", priority: "Critical" },
  { id: "RTO-02", system: "Database", rto: "2 hours", rpo: "15 mins", priority: "Critical" },
  { id: "RTO-03", system: "Integration", rto: "4 hours", rpo: "1 hour", priority: "High" },
  { id: "RTO-04", system: "Charging Platform", rto: "4 hours", rpo: "30 mins", priority: "Critical" },
  { id: "RTO-05", system: "CRM", rto: "8 hours", rpo: "1 hour", priority: "High" },
];

// 7. BACKUP & REPLICATION STATUS (MATCHING SCREENSHOT TABLE 1:1)
export const DR_BACKUP_REPLICATION_STATUS: BackupReplicationItem[] = [
  {
    id: "BKP-01",
    system: "ERP Database",
    backupStatus: "Success",
    lastBackup: "15-Mar-2025 01:00",
    replicationLag: "2 mins",
    status: "Healthy",
    backupType: "Continuous WAL + Hourly Snapshot",
    location: "AWS S3 Glaciers + Bangalore DC Replica",
  },
  {
    id: "BKP-02",
    system: "File Storage",
    backupStatus: "Success",
    lastBackup: "15-Mar-2025 02:00",
    replicationLag: "-",
    status: "Healthy",
    backupType: "Differential Daily",
    location: "Object Store Secondary Bucket",
  },
  {
    id: "BKP-03",
    system: "Application Servers",
    backupStatus: "Success",
    lastBackup: "15-Mar-2025 01:30",
    replicationLag: "5 mins",
    status: "Healthy",
    backupType: "AMI Image Golden Template",
    location: "Multi-AZ Cloud Repository",
  },
  {
    id: "BKP-04",
    system: "Cloud Infrastructure",
    backupStatus: "Success",
    lastBackup: "15-Mar-2025 01:15",
    replicationLag: "3 mins",
    status: "Healthy",
    backupType: "Terraform IaC State + Vault Secrets",
    location: "Encrypted Cross-Region Vault",
  },
];

// 8. TESTING & EXERCISES (MATCHING SCREENSHOT TABLE 1:1)
export const DR_TEST_EXERCISES: DRTestExerciseItem[] = [
  {
    id: "TST-01",
    testType: "Full DR Test",
    date: "15-Mar-2025",
    result: "Pass",
    rtoAchieved: "3h 45m",
    rpoAchieved: "28 mins",
    participants: "IT Infrastructure, DBA, Cybersecurity, ERP Functional Leads",
    findings: "Automated DNS Route53 switchover verified within target 4-hour RTO.",
  },
  {
    id: "TST-02",
    testType: "Database Test",
    date: "10-Dec-2024",
    result: "Pass",
    rtoAchieved: "1h 50m",
    rpoAchieved: "12 mins",
    participants: "Primary Database Engineering Team",
    findings: "Point-in-time recovery to standby instance executed in 110 mins.",
  },
  {
    id: "TST-03",
    testType: "Failover Test",
    date: "15-Sep-2024",
    result: "Pass",
    rtoAchieved: "4h 10m",
    rpoAchieved: "35 mins",
    participants: "Cloud Operations & Network Reliability Unit",
    findings: "Simulated complete Chennai link sever; secondary cluster assumed load.",
  },
];

// STANDARD 18-STEP RECOVERY RUNBOOK (SECTION 27 OF PROMPT)
export const STANDARD_DR_RUNBOOK_STEPS: DRRunbookStep[] = [
  { stepNumber: 1, title: "Detect Failure", description: "Automated synthetic monitor alerts SOC & NOC of primary cluster failure", responsibleTeam: "Monitoring / NOC", estimatedMinutes: 5, automatedTool: "Prometheus / Datadog / PagerDuty", validationCheck: "Healthcheck probe returns 503 x 3" },
  { stepNumber: 2, title: "Declare Disaster", description: "DR Manager & CIO formally declare DR Activation after threshold check", responsibleTeam: "DR Manager & CIO", estimatedMinutes: 10, automatedTool: "Emergency War Room Bridge", validationCheck: "Disaster declaration docket signed" },
  { stepNumber: 3, title: "Activate DR Team", description: "PagerDuty blast alerts all 10 emergency technical roster leads", responsibleTeam: "Incident Commander", estimatedMinutes: 5, automatedTool: "Automated SMS / Voice Broadcast", validationCheck: "100% team quorum acknowledged" },
  { stepNumber: 4, title: "Freeze Changes", description: "Halt all code deployments, configuration pushes, and batch pipelines", responsibleTeam: "DevOps & Release Eng", estimatedMinutes: 5, automatedTool: "CI/CD Pipeline Emergency Lock", validationCheck: "Deployment gates set to blocked" },
  { stepNumber: 5, title: "Assess Impact", description: "Evaluate primary data center reachability, storage integrity, and loss scope", responsibleTeam: "Infrastructure Lead", estimatedMinutes: 15, automatedTool: "AWS CLI Region Health Diagnostic", validationCheck: "Impact perimeter confirmed" },
  { stepNumber: 6, title: "Select Recovery Point", description: "Identify last consistent database transaction commit log (RPO audit)", responsibleTeam: "Database Lead", estimatedMinutes: 10, automatedTool: "WAL Log Inspection Tool", validationCheck: "Target LSN timestamp verified" },
  { stepNumber: 7, title: "Activate DR Infrastructure", description: "Scale warm standby compute clusters in Bangalore Cloud Region", responsibleTeam: "Cloud Infrastructure", estimatedMinutes: 20, automatedTool: "Terraform / AWS AutoScaling API", validationCheck: "Target worker nodes in Ready state" },
  { stepNumber: 8, title: "Recover Network", description: "Switch BGP routes, VPN gateways, and corporate interconnect tunnels", responsibleTeam: "Network Lead", estimatedMinutes: 15, automatedTool: "Direct Connect / IPsec failover script", validationCheck: "Subnet routing tables synced" },
  { stepNumber: 9, title: "Recover Database", description: "Promote secondary database replica to read-write master", responsibleTeam: "Database Lead", estimatedMinutes: 25, automatedTool: "Aurora Read Replica Promotion API", validationCheck: "DB engine accepts RW transactions" },
  { stepNumber: 10, title: "Recover Applications", description: "Deploy core ERP microservices and containerized application pods", responsibleTeam: "Application Lead", estimatedMinutes: 30, automatedTool: "Kubernetes ArgoCD Sync", validationCheck: "All core service pods 1/1 Running" },
  { stepNumber: 11, title: "Recover Identity", description: "Sync Active Directory / Okta SSO authentication endpoints", responsibleTeam: "Cybersecurity Lead", estimatedMinutes: 10, automatedTool: "IdP Gateway Health Check", validationCheck: "MFA tokens successfully authenticate" },
  { stepNumber: 12, title: "Validate Data", description: "Execute automated ledger balance and invoice transaction hash checks", responsibleTeam: "Financial Systems Analyst", estimatedMinutes: 20, automatedTool: "Financial Reconciliation Robot", validationCheck: "Trial balance hash matches source" },
  { stepNumber: 13, title: "Validate Applications", description: "Execute end-to-end smoke test suite against simulated ERP workflows", responsibleTeam: "QA & Application Lead", estimatedMinutes: 15, automatedTool: "Playwright Automated Smoke Suite", validationCheck: "100% critical test scripts pass" },
  { stepNumber: 14, title: "Validate Integrations", description: "Verify EV charging station OCPP gateway and payment API webhooks", responsibleTeam: "Integration Lead", estimatedMinutes: 15, automatedTool: "API Gateway Synthetic ping", validationCheck: "200 OK from charging stations" },
  { stepNumber: 15, title: "Business Validation", description: "Sign-off from Operations and Finance Heads on live readiness", responsibleTeam: "Business Owner (Ramesh S)", estimatedMinutes: 15, automatedTool: "Approval Portal Sign-off", validationCheck: "Formal business go-ahead registered" },
  { stepNumber: 16, title: "Release Service", description: "Update DNS Route 53 to redirect live corporate domain traffic to DR site", responsibleTeam: "DR Manager", estimatedMinutes: 5, automatedTool: "AWS Route53 Weighted Failover", validationCheck: "Public DNS resolves to DR VIP" },
  { stepNumber: 17, title: "Monitor", description: "Engage heightened SOC/NOC telemetry for error spikes and latency", responsibleTeam: "SRE & SOC Leads", estimatedMinutes: 30, automatedTool: "Grafana Live Telemetry Wall", validationCheck: "Error rate < 0.05%, Latency normal" },
  { stepNumber: 18, title: "Document Recovery", description: "Compile incident timestamps, RTO/RPO achieved, and post-mortem report", responsibleTeam: "Recovery Coordinator", estimatedMinutes: 20, automatedTool: "Controlled ERP Audit Logger", validationCheck: "DR Incident record closed" },
];

// OPEN ACTIONS (MATCHING SCREENSHOT KPI: 5 OPEN ACTIONS)
export const DR_ACTION_ITEMS: DRActionItem[] = [
  {
    id: "ACT-DR-01",
    action: "Automate secondary Aurora DB promotion script to trim 15 mins off RTO",
    owner: "DevOps DBA Cell",
    dueDate: "15-Oct-2026",
    priority: "High",
    status: "In Progress",
    evidence: "Lambda trigger authored; dry run scheduled in staging environment",
  },
  {
    id: "ACT-DR-02",
    action: "Upgrade cross-region interconnect bandwidth from 5Gbps to 10Gbps",
    owner: "Network Lead",
    dueDate: "20-Oct-2026",
    priority: "Critical",
    status: "Open",
    evidence: "Awaiting telecom ISP circuit commissioning at Chennai Plant",
  },
  {
    id: "ACT-DR-03",
    action: "Conduct scheduled Full Simulation DR drill for Q4",
    owner: "Priya Kumar",
    dueDate: "15-Mar-2026",
    priority: "High",
    status: "Open",
    evidence: "Drill docket submitted to Risk Review Board",
  },
  {
    id: "ACT-DR-04",
    action: "Deploy immutable air-gapped backup storage for ransomware containment",
    owner: "Cybersecurity Lead",
    dueDate: "30-Nov-2026",
    priority: "Critical",
    status: "In Progress",
    evidence: "AWS S3 Object Lock compliance retention configured",
  },
  {
    id: "ACT-DR-05",
    action: "Complete cross-training for 4 secondary recovery coordinators",
    owner: "Vikram K",
    dueDate: "10-Nov-2026",
    priority: "Medium",
    status: "Open",
    evidence: "Training curriculum drafted and published on LMS",
  },
];

// EMERGENCY CONTACT REGISTER (SECTION 31 OF PROMPT)
export const DR_EMERGENCY_CONTACTS: DREmergencyContact[] = [
  { role: "DR Manager", primaryContact: "Priya Kumar", backupContact: "Ramesh S", contactMethod: "Satellite Phone / Emergency Mobile", availability: "24x7 Continuous" },
  { role: "IT Infrastructure Lead", primaryContact: "Suresh Balan", backupContact: "Lead SRE", contactMethod: "Emergency Hotline / PagerDuty", availability: "24x7 Continuous" },
  { role: "Database Lead", primaryContact: "Anand Rajan", backupContact: "Sr. DBA", contactMethod: "Mobile / WhatsApp Crisis Cell", availability: "24x7 Continuous" },
  { role: "Application Lead", primaryContact: "Vikram K", backupContact: "Lead Software Architect", contactMethod: "Direct Extension / Signal Call", availability: "24x7 Continuous" },
  { role: "Cybersecurity Incident Lead", primaryContact: "Security Operations Center", backupContact: "CISO", contactMethod: "SOC Bridge 24x7", availability: "24x7 Continuous" },
  { role: "Cloud Provider Liaison", primaryContact: "AWS Enterprise Support Concierge", backupContact: "TAM Lead", contactMethod: "Direct Severity 1 Hotline", availability: "24x7 Continuous" },
];

// SECTION 1: MAICW CLASSIFICATION FIELDS
export const DR_MAICW_FIELDS = [
  { field: "DR Plan ID", type: "Auto Number", maicw: "A", description: "Unique disaster recovery plan identifier (DRP-YYYY-XXX)" },
  { field: "DR Code", type: "Text", maicw: "A", description: "Controlled reference e.g. DR-ERP-001" },
  { field: "DR Plan Name", type: "Text", maicw: "M", description: "Descriptive plan title (Mandatory)" },
  { field: "DR Type", type: "Dropdown", maicw: "M", description: "Application, Database, Infrastructure, Network, Cloud, Enterprise" },
  { field: "Business Function", type: "Lookup", maicw: "M", description: "Affected business function (Enterprise Operations)" },
  { field: "Department", type: "Lookup", maicw: "M", description: "Responsible department (IT)" },
  { field: "IT Service", type: "Lookup", maicw: "M", description: "Critical IT service covered (Magnertia ERP)" },
  { field: "Application", type: "Lookup", maicw: "M", description: "Application covered (Magnertia ERP)" },
  { field: "System Owner", type: "Lookup", maicw: "M", description: "Accountable system owner (Ramesh S)" },
  { field: "DR Owner", type: "Lookup", maicw: "M", description: "Accountable recovery owner (Priya Kumar)" },
  { field: "Recovery Coordinator", type: "Lookup", maicw: "M", description: "DR coordinator (Vikram K)" },
  { field: "Primary Site", type: "Lookup", maicw: "M", description: "Primary infrastructure site (Chennai Data Center)" },
  { field: "DR Site", type: "Lookup", maicw: "M", description: "Disaster recovery failover site (Bangalore Cloud Region)" },
  { field: "Effective Date", type: "Date", maicw: "M", description: "Plan effective date" },
  { field: "Review Date", type: "Date", maicw: "M", description: "Scheduled annual review date" },
  { field: "Last Test Date", type: "Date", maicw: "I", description: "Latest test execution timestamp" },
  { field: "Next Test Date", type: "Date", maicw: "I", description: "Planned next simulation date" },
  { field: "Status", type: "Workflow", maicw: "W", description: "Draft, Review, Approved, Active, Testing, Archived" },
  { field: "Priority", type: "Dropdown", maicw: "M", description: "Critical, High, Medium, Low" },
  { field: "Version", type: "Number", maicw: "A", description: "Controlled record version (1.0)" },
  { field: "Confidentiality", type: "Dropdown", maicw: "C", description: "Internal, Confidential, Restricted" },
];

// SECTION 50: REPORTS DEFINITIONS (24 DR REPORTS)
export const DR_REPORT_DEFINITIONS = [
  { id: "DR-REP-01", name: "Disaster Recovery Master Plan Register", category: "Master", desc: "Complete inventory of all active enterprise DR plans and RTO/RPO targets" },
  { id: "DR-REP-02", name: "Executive Disaster Recovery Dashboard", category: "Executive", desc: "High-level resilience readiness, test compliance, and failover status" },
  { id: "DR-REP-03", name: "Critical IT Systems & Services Report", category: "Systems", desc: "Categorization of mission-critical systems and application topologies" },
  { id: "DR-REP-04", name: "RTO & RPO Compliance Audit", category: "Objectives", desc: "Variance analysis between target recovery times and achieved drill times" },
  { id: "DR-REP-05", name: "Backup Status & Health Verification", category: "Backup", desc: "Daily backup completion rates, sizes, and integrity verification hashes" },
  { id: "DR-REP-06", name: "Backup Exception & Failure Log", category: "Backup", desc: "Root causes for backup failures and corrective resolution tracking" },
  { id: "DR-REP-07", name: "Data Replication Health & Lag Monitor", category: "Replication", desc: "Real-time replication lag, network latency, and synchronization logs" },
  { id: "DR-REP-08", name: "DR Site Infrastructure Readiness Audit", category: "Infrastructure", desc: "Hardware availability, cloud capacity quotas, and standby compute verification" },
  { id: "DR-REP-09", name: "Application Recovery Readiness Report", category: "Application", desc: "Microservice container configurations and deployment runbook readiness" },
  { id: "DR-REP-10", name: "Database Recovery & Point-in-Time Log", category: "Database", desc: "Transaction log replication, snapshot retention, and restore performance" },
  { id: "DR-REP-11", name: "Network & DNS Failover Readiness", category: "Network", desc: "Route53 failover test results, BGP latency, and VPN tunnel redundancy" },
  { id: "DR-REP-12", name: "Cyber Recovery & Air-Gapped Backup Report", category: "Cybersecurity", desc: "Immutable backup verification and ransomware isolation procedures" },
  { id: "DR-REP-13", name: "Cloud Disaster Recovery Architecture Log", category: "Cloud", desc: "Multi-region failover configurations and cloud quota reservations" },
  { id: "DR-REP-14", name: "DR Test & Simulation Results Dossier", category: "Testing", desc: "Historical drill performance, tabletop findings, and auditor sign-offs" },
  { id: "DR-REP-15", name: "Failover Execution & Timeline History", category: "Execution", desc: "Detailed step-by-step logs of actual and simulated failover operations" },
  { id: "DR-REP-16", name: "Failback & Data Resynchronization Report", category: "Execution", desc: "Procedures and logs for restoring primary site as active production" },
  { id: "DR-REP-17", name: "Open DR Corrective Actions (CAPA) Report", category: "Actions", desc: "Tracking open findings from drills, incidents, and security audits" },
  { id: "DR-REP-18", name: "Disaster Recovery Vulnerability & Gap Register", category: "Gaps", desc: "Identified single points of failure and resource bottlenecks" },
  { id: "DR-REP-19", name: "RTO Objective Breach History", category: "Performance", desc: "Analysis of drills or incidents where recovery exceeded target RTO" },
  { id: "DR-REP-20", name: "RPO Objective Breach History", category: "Performance", desc: "Analysis of drills or incidents where transaction loss exceeded target RPO" },
  { id: "DR-REP-21", name: "Vendor & SaaS Disaster Recovery Audit", category: "Vendor", desc: "Third-party SLA assessments and cloud provider resilience attestations" },
  { id: "DR-REP-22", name: "Incident-to-DR Correlation Report", category: "Incident", desc: "Major technical incidents that initiated DR activation and failovers" },
  { id: "DR-REP-23", name: "Business Continuity Dependency Alignment", category: "BCP", desc: "Mapping between business continuity processes and supporting DR plans" },
  { id: "DR-REP-24", name: "AI Disaster Recovery Predictive Digest", category: "AI Analytics", desc: "Machine learning forecasts on replication lag spikes and failure probabilities" },
];

// FULL REGISTER OF 8 DISASTER RECOVERY PLANS (MATCHING 8 CRITICAL SYSTEMS)
export const FULL_DR_PLANS: DisasterRecoveryRecord[] = [
  PRIMARY_DRP_RECORD,
  {
    id: "DRP-2026-002",
    drCode: "DR-DB-001",
    planName: "Core Oracle Database Cluster DR Plan",
    drType: "Database",
    businessFunction: "Enterprise Data",
    department: "IT",
    itService: "Database Platform",
    application: "Oracle DB",
    systemOwner: "DevOps DBA Cell",
    systemOwnerAvatar: "DB",
    drOwner: "Anand Rajan",
    drOwnerAvatar: "AR",
    recoveryCoordinator: "Vikram K",
    recoveryCoordinatorAvatar: "VK",
    primarySite: "Chennai Data Center",
    drSite: "Bangalore Cloud Region",
    effectiveDate: "01-Jan-2026",
    reviewDate: "01-Jan-2027",
    lastTestDate: "10-Dec-2024",
    nextTestDate: "10-Dec-2025",
    status: "Active",
    priority: "Critical",
    version: "1.0",
    confidentiality: "Restricted",
    recoveryObjective: "Sub-15 minute RPO and 2-hour RTO for all corporate financial subledgers and customer transactions.",
    primaryDisasterScenario: "Storage Failure",
    secondaryDisasterScenario: "Data Corruption",
    disasterScenarioDescription: "Primary SAN controller failure causing database crash and disk block corruption.",
    recoveryStatement: "If Storage Failure impacts Oracle DB, standby replica will be promoted within 2 hours.",
    strategyType: "Active-Passive",
    recoveryMethod: "Active-Passive",
    strategyDetails: "Continuous synchronous DataGuard replication to secondary cloud instance.",
    rtoTarget: "2 hours",
    rpoTarget: "15 mins",
    mtdTarget: "4 hours",
    linkedIncidentsCount: 1,
    bcpPlansCount: 1,
    riskRecordsCount: 3,
    vendorRecordsCount: 1,
    changeRequestsCount: 2,
    actionItemsCount: 3,
  },
  {
    id: "DRP-2026-003",
    drCode: "DR-EV-001",
    planName: "EV Charging Infrastructure Cloud Gateway DR Plan",
    drType: "Cloud",
    businessFunction: "EV Operations",
    department: "IT",
    itService: "Charging Platform",
    application: "Charging Mgmt",
    systemOwner: "EV Operations IT",
    systemOwnerAvatar: "EV",
    drOwner: "Priya Kumar",
    drOwnerAvatar: "PK",
    recoveryCoordinator: "Vikram K",
    recoveryCoordinatorAvatar: "VK",
    primarySite: "AWS Mumbai",
    drSite: "AWS Singapore Secondary",
    effectiveDate: "15-Jan-2026",
    reviewDate: "15-Jan-2027",
    lastTestDate: "15-Mar-2025",
    nextTestDate: "15-Mar-2026",
    status: "Active",
    priority: "Critical",
    version: "1.0",
    confidentiality: "Confidential",
    recoveryObjective: "Ensure continuous OCPP station connectivity and payment telematics with zero downtime over 4 hours.",
    primaryDisasterScenario: "Cloud Provider Outage",
    secondaryDisasterScenario: "Cyber Attack",
    disasterScenarioDescription: "Primary AWS Mumbai availability zone outage impacting charging telemetry.",
    recoveryStatement: "If AWS Mumbai fails, automated DNS Route53 will redirect station traffic to Singapore gateway.",
    strategyType: "Cloud Disaster Recovery",
    recoveryMethod: "Active-Passive",
    strategyDetails: "Multi-region IoT core deployment with automatic endpoint failover.",
    rtoTarget: "4 hours",
    rpoTarget: "30 mins",
    mtdTarget: "6 hours",
    linkedIncidentsCount: 0,
    bcpPlansCount: 1,
    riskRecordsCount: 2,
    vendorRecordsCount: 3,
    changeRequestsCount: 1,
    actionItemsCount: 2,
  },
];

export const disasterRecoveryService = {
  getPrimaryDRP: () => PRIMARY_DRP_RECORD,
  getCriticalServices: () => DR_CRITICAL_SERVICES,
  getRecoveryObjectives: () => DR_RECOVERY_OBJECTIVES,
  getBackupReplicationStatus: () => DR_BACKUP_REPLICATION_STATUS,
  getTestExercises: () => DR_TEST_EXERCISES,
  getRunbookSteps: () => STANDARD_DR_RUNBOOK_STEPS,
  getActionItems: () => DR_ACTION_ITEMS,
  getEmergencyContacts: () => DR_EMERGENCY_CONTACTS,
  getFullPlans: () => FULL_DR_PLANS,
  getMAICWFields: () => DR_MAICW_FIELDS,
  getReports: () => DR_REPORT_DEFINITIONS,
};

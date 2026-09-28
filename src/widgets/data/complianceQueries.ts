import { queryOptions } from "@tanstack/react-query";

export interface ComplianceObligationSummary {
  id: string;
  actTitle: string;
  section: string;
  category: "Regulatory" | "Statutory" | "ISO" | "EHS" | "Labor";
  frequency: "Annual" | "Quarterly" | "Monthly" | "Continuous";
  status: "Compliant" | "In Review" | "Action Required" | "Overdue";
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  owner: string;
  nextDueDate: string;
}

export interface UpcomingFilingItem {
  id: string;
  filingName: string;
  authority: string;
  dueDate: string;
  status: "Submitted" | "In Preparation" | "Pending Review" | "Upcoming";
  owner: string;
}

export interface ComplianceRemediationItem {
  id: string;
  title: string;
  source: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  owner: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Resolved";
}

export interface ComplianceOverviewData {
  complianceIndex: number;
  complianceIndexDelta: string;
  activeLicenses: number;
  activeLicensesDelta: string;
  isoStandardsReadiness: number;
  isoStandardsDelta: string;
  obligationsFulfilled: number;
  obligationsTotal: number;
  obligationsDelta: string;
  filingsOnTimeRate: number;
  filingsDelta: string;
  openGapsCount: number;
  openGapsDelta: string;
  auditCapasCount: number;
  auditCapasDelta: string;
  legalUpdatesCount: number;
  legalUpdatesDelta: string;
  trendData: Array<{ month: string; complianceScore: number; target: number; filingsCount: number }>;
  domainDistribution: Array<{ name: string; percentage: number; count: number; color: string }>;
  keyObligations: ComplianceObligationSummary[];
  upcomingFilings: UpcomingFilingItem[];
  remediationActions: ComplianceRemediationItem[];
  aiInsights: Array<{ id: number; title: string; text: string; category: string; impact: "High" | "Medium" | "Low"; date: string }>;
}

export const MOCK_COMPLIANCE_OVERVIEW: ComplianceOverviewData = {
  complianceIndex: 95.4,
  complianceIndexDelta: "+2.8% vs last audit",
  activeLicenses: 28,
  activeLicensesDelta: "2 renewals due in 60d",
  isoStandardsReadiness: 98.2,
  isoStandardsDelta: "+1.6% across 4 ISO standards",
  obligationsFulfilled: 52,
  obligationsTotal: 56,
  obligationsDelta: "4 under active verification",
  filingsOnTimeRate: 97.5,
  filingsDelta: "100% statutory timeliness YTD",
  openGapsCount: 5,
  openGapsDelta: "4 in progress, 1 under review",
  auditCapasCount: 14,
  auditCapasDelta: "12 closed, 2 under verification",
  legalUpdatesCount: 6,
  legalUpdatesDelta: "3 acts updated this quarter",
  trendData: [
    { month: "Apr", complianceScore: 89.2, target: 92.0, filingsCount: 8 },
    { month: "May", complianceScore: 91.0, target: 92.5, filingsCount: 12 },
    { month: "Jun", complianceScore: 92.8, target: 93.0, filingsCount: 15 },
    { month: "Jul", complianceScore: 93.5, target: 94.0, filingsCount: 10 },
    { month: "Aug", complianceScore: 94.6, target: 94.5, filingsCount: 18 },
    { month: "Sep", complianceScore: 95.4, target: 95.0, filingsCount: 14 },
  ],
  domainDistribution: [
    { name: "Statutory & Legal", percentage: 35, count: 28, color: "#3B82F6" },
    { name: "ISO Standards", percentage: 25, count: 20, color: "#10B981" },
    { name: "EHS & Safety", percentage: 20, count: 16, color: "#F59E0B" },
    { name: "Licensing & Permits", percentage: 12, count: 10, color: "#8B5CF6" },
    { name: "Cyber & Privacy", percentage: 8, count: 6, color: "#06B6D4" },
  ],
  keyObligations: [
    {
      id: "OBL-001",
      actTitle: "Factories Act, 1948 - Safety Provisions",
      section: "Sec 21 - Fencing of Machinery & Interlocks",
      category: "EHS",
      frequency: "Quarterly",
      status: "Compliant",
      riskLevel: "Critical",
      owner: "Safety Director (EHS)",
      nextDueDate: "15-Oct-2026",
    },
    {
      id: "OBL-002",
      actTitle: "Companies Act, 2013 - Board Governance",
      section: "Sec 134 - Annual Financial & Statutory Returns",
      category: "Statutory",
      frequency: "Annual",
      status: "Compliant",
      riskLevel: "High",
      owner: "Company Secretary",
      nextDueDate: "30-Oct-2026",
    },
    {
      id: "OBL-003",
      actTitle: "ISO 9001:2015 - Quality Management",
      section: "Clause 9.2 - Internal Quality Audit",
      category: "ISO",
      frequency: "Quarterly",
      status: "In Review",
      riskLevel: "Medium",
      owner: "Quality Assurance Lead",
      nextDueDate: "12-Nov-2026",
    },
    {
      id: "OBL-004",
      actTitle: "State Pollution Control Board - Consent to Operate",
      section: "Air & Water (Prevention of Pollution) Acts",
      category: "Regulatory",
      frequency: "Annual",
      status: "Compliant",
      riskLevel: "Critical",
      owner: "Environmental Engineer",
      nextDueDate: "31-Dec-2026",
    },
    {
      id: "OBL-005",
      actTitle: "Digital Personal Data Protection Act (DPDPA)",
      section: "Consent Governance & Data Fiduciary Rules",
      category: "Regulatory",
      frequency: "Continuous",
      status: "Action Required",
      riskLevel: "High",
      owner: "Chief Information Security Officer",
      nextDueDate: "25-Oct-2026",
    },
    {
      id: "OBL-006",
      actTitle: "Central Electricity Authority (Safety Regulations)",
      section: "Regulation 30 - Earth Leakage Testing & Records",
      category: "EHS",
      frequency: "Monthly",
      status: "Compliant",
      riskLevel: "High",
      owner: "Chief Electrical Inspector",
      nextDueDate: "05-Oct-2026",
    },
  ],
  upcomingFilings: [
    {
      id: "FIL-2026-089",
      filingName: "State PCB Environmental Emission Return (Form IV)",
      authority: "Pollution Control Board",
      dueDate: "15-Oct-2026",
      status: "In Preparation",
      owner: "EHS Manager",
    },
    {
      id: "FIL-2026-090",
      filingName: "Factories Act Annual Return (Form 22)",
      authority: "Directorate of Industrial Safety",
      dueDate: "30-Oct-2026",
      status: "Upcoming",
      owner: "HR & Plant Head",
    },
    {
      id: "FIL-2026-091",
      filingName: "ROC Annual Return MGT-7",
      authority: "Ministry of Corporate Affairs",
      dueDate: "29-Nov-2026",
      status: "In Preparation",
      owner: "Legal & Secretarial",
    },
    {
      id: "FIL-2026-092",
      filingName: "Fire Safety NOC Bi-annual Renewal",
      authority: "Fire & Rescue Department",
      dueDate: "10-Nov-2026",
      status: "Pending Review",
      owner: "Facility Manager",
    },
    {
      id: "FIL-2026-093",
      filingName: "Quarterly Hazardous Waste Manifest Return",
      authority: "Central Pollution Control Board",
      dueDate: "31-Oct-2026",
      status: "Submitted",
      owner: "Waste Management Lead",
    },
  ],
  remediationActions: [
    {
      id: "ACT-CMP-01",
      title: "Update Machine Guarding Interlock Verification on Assembly Line #3",
      source: "Safety Audit (Factories Act)",
      priority: "Critical",
      owner: "Plant Maintenance Lead",
      dueDate: "08-Oct-2026",
      status: "In Progress",
    },
    {
      id: "ACT-CMP-02",
      title: "Renew Calibration Certificate for Primary Coordinate Measuring Machine (CMM)",
      source: "ISO 9001 Calibration Audit",
      priority: "High",
      owner: "Metrology Dept",
      dueDate: "14-Oct-2026",
      status: "Open",
    },
    {
      id: "ACT-CMP-03",
      title: "Complete Data Subject Rights Workflow Testing for DPDPA Adherence",
      source: "Internal Compliance Review",
      priority: "Medium",
      owner: "IT Security Lead",
      dueDate: "20-Oct-2026",
      status: "In Progress",
    },
    {
      id: "ACT-CMP-04",
      title: "Submit Bi-Annual Ground Water Extraction Report to CGWA",
      source: "State PCB Environmental Consent",
      priority: "High",
      owner: "Environmental Engineer",
      dueDate: "28-Oct-2026",
      status: "Resolved",
    },
    {
      id: "ACT-CMP-05",
      title: "Conduct Evacuation Mock Drill & Fire Hydrant Pressure Verification",
      source: "Occupational Safety Standard",
      priority: "High",
      owner: "Safety Marshal",
      dueDate: "22-Oct-2026",
      status: "In Progress",
    },
  ],
  aiInsights: [
    {
      id: 1,
      title: "New Battery Waste Management Amendment 2026",
      text: "MoEFCC published revised extended producer responsibility (EPR) targets for lithium and lead-acid storage units. Ensure quarterly recycling returns reflect new 85% material recovery thresholds.",
      category: "Statutory Regulatory",
      impact: "High",
      date: "Yesterday",
    },
    {
      id: 2,
      title: "Upcoming ISO 45001 Surveillance Audit in 22 Days",
      text: "TUV certification body audit scheduled for Oct 18. All 14 open hazard observations have been contained; 2 CAPA verification sign-offs remain pending with Safety Marshall.",
      category: "ISO Standards",
      impact: "Medium",
      date: "2 days ago",
    },
    {
      id: 3,
      title: "Factory Electricity Duty Exemption Renewal",
      text: "State Industry Directorate notified green manufacturing concession window. Document bundle verified with 100% solar captive consumption certificates.",
      category: "Licensing & Incentives",
      impact: "Low",
      date: "3 days ago",
    },
  ],
};

export const complianceOverviewOptions = queryOptions({
  queryKey: ["compliance", "overview"],
  queryFn: async (): Promise<ComplianceOverviewData> => {
    return MOCK_COMPLIANCE_OVERVIEW;
  },
  staleTime: 60 * 1000,
});

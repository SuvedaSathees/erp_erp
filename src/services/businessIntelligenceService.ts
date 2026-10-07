// Magnertia ERP - Business Intelligence Service
// Enterprise Executive Analytics, KPI Monitoring Engine, and Controlled Reports Suite

export interface BiExecutiveKpi {
  id: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  category: "financial" | "commercial" | "operational" | "security" | "risk";
  sparkline?: number[];
}

export interface BiRevenueByProduct {
  name: string;
  percentage: number;
  revenue: string;
  color: string;
}

export interface BiSalesPipelineStage {
  stage: string;
  value: number;
  count: number;
  color: string;
}

export interface BiTopManagementAction {
  id: string;
  action: string;
  owner: string;
  dueDate: string;
  status: "In Progress" | "Overdue" | "On Track" | "Completed";
  priority: "High" | "Medium" | "Critical";
}

export interface BiUpcomingMeeting {
  id: string;
  date: string;
  time: string;
  title: string;
  location: string;
  type: "Executive" | "Project" | "Security" | "Management";
}

export interface BiKpiMonitoringRecord {
  id: string;
  name: string;
  category: "Financial" | "Commercial" | "Operational" | "Quality" | "People" | "Compliance" | "Sustainability" | "Innovation";
  actual: number;
  target: number;
  achievement: number;
  unit: string;
  trend: "up" | "down" | "flat";
  status: "On Target" | "Warning" | "Critical" | "Under Review";
  baseline: number;
  stretchTarget: number;
  warningThreshold: number;
  criticalThreshold: number;
  owner: string;
  frequency: "Monthly" | "Weekly" | "Quarterly" | "Daily";
  dataSource: string;
  calculationMethod: string;
  description: string;
}

export interface BiReportItem {
  id: string;
  code: string;
  name: string;
  category: string;
  frequency: "Monthly" | "Weekly" | "Daily" | "Quarterly";
  lastGenerated: string;
  status: "Active" | "Scheduled" | "Draft";
  owner: string;
  format: "PDF" | "XLSX" | "CSV";
  summary: string;
}

// ==========================================
// MOCK DATA STORE
// ==========================================

export const BI_EXECUTIVE_KPIS: BiExecutiveKpi[] = [
  {
    id: "kpi-rev",
    name: "Total Revenue",
    value: "₹12.8 Cr",
    change: "↑ 18.4%",
    isPositive: true,
    subtext: "vs. last month",
    category: "financial",
    sparkline: [8.5, 9.2, 10.1, 10.8, 11.5, 12.8],
  },
  {
    id: "kpi-cash",
    name: "Cash Balance",
    value: "₹4.2 Cr",
    change: "↑ 22.1%",
    isPositive: true,
    subtext: "vs. last month",
    category: "financial",
    sparkline: [3.1, 3.4, 3.6, 3.8, 4.0, 4.2],
  },
  {
    id: "kpi-margin",
    name: "Gross Margin",
    value: "32.6%",
    change: "↑ 3.2%",
    isPositive: true,
    subtext: "vs. last quarter",
    category: "financial",
    sparkline: [29, 30.2, 31, 31.8, 32.2, 32.6],
  },
  {
    id: "kpi-pipe",
    name: "Sales Pipeline",
    value: "₹18.6 Cr",
    change: "↑ 14.7%",
    isPositive: true,
    subtext: "vs. last month",
    category: "commercial",
    sparkline: [14.2, 15.0, 16.1, 17.0, 17.8, 18.6],
  },
  {
    id: "kpi-cust",
    name: "Active Customers",
    value: "146",
    change: "↑ 8.2%",
    isPositive: true,
    subtext: "vs. last quarter",
    category: "commercial",
    sparkline: [120, 126, 131, 137, 142, 146],
  },
  {
    id: "kpi-oee",
    name: "Production OEE",
    value: "82.7%",
    change: "↑ 5.6%",
    isPositive: true,
    subtext: "vs. last month",
    category: "operational",
    sparkline: [76, 78, 79.5, 80.2, 81.5, 82.7],
  },
  {
    id: "kpi-sec",
    name: "Open Security Incidents",
    value: "4",
    change: "↓ 33%",
    isPositive: true,
    subtext: "vs. last month",
    category: "security",
    sparkline: [9, 8, 7, 6, 5, 4],
  },
  {
    id: "kpi-risk",
    name: "Open Critical Risks",
    value: "7",
    change: "↓ 40%",
    isPositive: true,
    subtext: "vs. last month",
    category: "risk",
    sparkline: [14, 12, 11, 10, 8, 7],
  },
];

export const BI_REVENUE_BY_PRODUCT: BiRevenueByProduct[] = [
  { name: "Autonomous W-EVSE", percentage: 38, revenue: "₹4.86 Cr", color: "#3B82F6" },
  { name: "DC Fast Chargers", percentage: 22, revenue: "₹2.81 Cr", color: "#EC4899" },
  { name: "AC Wall Chargers", percentage: 15, revenue: "₹1.92 Cr", color: "#10B981" },
  { name: "CaaS Services", percentage: 12, revenue: "₹1.53 Cr", color: "#F59E0B" },
  { name: "AMC Maintenance", percentage: 8, revenue: "₹1.02 Cr", color: "#8B5CF6" },
  { name: "Royalty & Software", percentage: 4, revenue: "₹0.51 Cr", color: "#6366F1" },
  { name: "Advertising", percentage: 1, revenue: "₹0.15 Cr", color: "#14B8A6" },
];

export const BI_SALES_PIPELINE: BiSalesPipelineStage[] = [
  { stage: "Leads", value: 420, count: 420, color: "#3B82F6" },
  { stage: "Qualified", value: 310, count: 310, color: "#06B6D4" },
  { stage: "Proposal", value: 180, count: 180, color: "#10B981" },
  { stage: "Negotiation", value: 92, count: 92, color: "#F59E0B" },
  { stage: "Won", value: 64, count: 64, color: "#EF4444" },
];

export const BI_TOP_MANAGEMENT_ACTIONS: BiTopManagementAction[] = [
  {
    id: "ACT-01",
    action: "Close critical security audit findings",
    owner: "Security Head",
    dueDate: "30 Sep 2026",
    status: "In Progress",
    priority: "Critical",
  },
  {
    id: "ACT-02",
    action: "Resolve material shortage for power modules",
    owner: "SCM Head",
    dueDate: "28 Sep 2026",
    status: "Overdue",
    priority: "High",
  },
  {
    id: "ACT-03",
    action: "Complete product certification for CE mark",
    owner: "Product Head",
    dueDate: "15 Oct 2026",
    status: "On Track",
    priority: "High",
  },
  {
    id: "ACT-04",
    action: "Reduce production downtime on Assembly Line 2",
    owner: "Plant Head",
    dueDate: "10 Oct 2026",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "ACT-05",
    action: "Finalize investor deck for Series-B expansion",
    owner: "CEO / Founder",
    dueDate: "05 Oct 2026",
    status: "On Track",
    priority: "High",
  },
];

export const BI_UPCOMING_MEETINGS: BiUpcomingMeeting[] = [
  {
    id: "MTG-01",
    date: "28 SEP",
    time: "10:00 AM - 12:00 PM",
    title: "Management Review",
    location: "Board Room",
    type: "Executive",
  },
  {
    id: "MTG-02",
    date: "30 SEP",
    time: "02:00 PM - 03:30 PM",
    title: "Project Portfolio Review",
    location: "Online (Teams)",
    type: "Project",
  },
  {
    id: "MTG-03",
    date: "03 OCT",
    time: "11:00 AM - 12:30 PM",
    title: "Security & Risk Review",
    location: "HQ - Namakkal",
    type: "Security",
  },
  {
    id: "MTG-04",
    date: "05 OCT",
    time: "10:00 AM - 01:00 PM",
    title: "Monthly Business Review",
    location: "Board Room",
    type: "Management",
  },
];

// ==========================================
// KPI MONITORING RECORDS
// ==========================================

export const BI_KPI_MONITORING_RECORDS: BiKpiMonitoringRecord[] = [
  {
    id: "KPI-FIN-001",
    name: "Revenue (₹ Cr)",
    category: "Financial",
    actual: 12.8,
    target: 12.0,
    achievement: 107,
    unit: "₹ Crore",
    trend: "up",
    status: "On Target",
    baseline: 10.0,
    stretchTarget: 15.0,
    warningThreshold: 8.0,
    criticalThreshold: 6.0,
    owner: "Finance Head (Suresh K)",
    frequency: "Monthly",
    dataSource: "Odoo - Accounting / ERP General Ledger",
    calculationMethod: "Sum of all revenue streams (Hardware, CaaS, AMC, Royalty, Advertising)",
    description: "Total monthly recognized revenue across all business units.",
  },
  {
    id: "KPI-FIN-002",
    name: "Gross Margin (%)",
    category: "Financial",
    actual: 32.6,
    target: 30.0,
    achievement: 109,
    unit: "%",
    trend: "up",
    status: "On Target",
    baseline: 28.0,
    stretchTarget: 35.0,
    warningThreshold: 25.0,
    criticalThreshold: 20.0,
    owner: "CFO (Meenakshi S)",
    frequency: "Monthly",
    dataSource: "Finance Cost Accounting",
    calculationMethod: "(Revenue - COGS) / Revenue * 100",
    description: "Overall gross profit percentage across hardware and software products.",
  },
  {
    id: "KPI-COM-001",
    name: "Customer Acquisition",
    category: "Commercial",
    actual: 146,
    target: 120,
    achievement: 122,
    unit: "Accounts",
    trend: "up",
    status: "On Target",
    baseline: 100,
    stretchTarget: 160,
    warningThreshold: 90,
    criticalThreshold: 80,
    owner: "VP Sales (Ramanathan V)",
    frequency: "Monthly",
    dataSource: "CRM Lead Pipeline",
    calculationMethod: "Count of new signed enterprise contracts in current month",
    description: "Net active enterprise accounts onboarded in the period.",
  },
  {
    id: "KPI-OPS-001",
    name: "Production OEE (%)",
    category: "Operational",
    actual: 82.7,
    target: 80.0,
    achievement: 103,
    unit: "%",
    trend: "up",
    status: "On Target",
    baseline: 72.0,
    stretchTarget: 88.0,
    warningThreshold: 75.0,
    criticalThreshold: 70.0,
    owner: "Plant Head (Arunagiri M)",
    frequency: "Daily",
    dataSource: "MES Smart Factory Telemetry",
    calculationMethod: "Availability * Performance * Quality Rate",
    description: "Overall Equipment Effectiveness across robotic assembly cells.",
  },
  {
    id: "KPI-OPS-002",
    name: "On-Time Delivery (%)",
    category: "Operational",
    actual: 94.2,
    target: 90.0,
    achievement: 105,
    unit: "%",
    trend: "up",
    status: "On Target",
    baseline: 85.0,
    stretchTarget: 98.0,
    warningThreshold: 85.0,
    criticalThreshold: 80.0,
    owner: "Logistics Manager (Karthik P)",
    frequency: "Weekly",
    dataSource: "WMS / Dispatch Orders",
    calculationMethod: "On-time Dispatched Orders / Total Scheduled Orders * 100",
    description: "Percentage of EVSE orders delivered within customer SLA timeline.",
  },
  {
    id: "KPI-FIN-003",
    name: "Cash Balance (₹ Cr)",
    category: "Financial",
    actual: 4.2,
    target: 6.0,
    achievement: 70,
    unit: "₹ Crore",
    trend: "down",
    status: "Critical",
    baseline: 5.0,
    stretchTarget: 8.0,
    warningThreshold: 5.0,
    criticalThreshold: 4.5,
    owner: "Treasurer / Finance Head",
    frequency: "Daily",
    dataSource: "Treasury Bank Ledger",
    calculationMethod: "Liquid Cash + Bank Demand Deposits",
    description: "Unencumbered cash runway available for operations.",
  },
  {
    id: "KPI-SCM-001",
    name: "Material Shortage (Days)",
    category: "Operational",
    actual: 7,
    target: 3,
    achievement: 43,
    unit: "Days",
    trend: "up",
    status: "Critical",
    baseline: 2,
    stretchTarget: 1,
    warningThreshold: 4,
    criticalThreshold: 5,
    owner: "Procurement Head (Divya N)",
    frequency: "Daily",
    dataSource: "ERP Inventory Buffer",
    calculationMethod: "Buffer Stock Depletion Forecast",
    description: "Semiconductor and power electronics delivery backlog.",
  },
  {
    id: "KPI-SEC-001",
    name: "Security Incidents",
    category: "Quality",
    actual: 4,
    target: 1,
    achievement: 25,
    unit: "Incidents",
    trend: "down",
    status: "Critical",
    baseline: 0,
    stretchTarget: 0,
    warningThreshold: 2,
    criticalThreshold: 3,
    owner: "CISO (Kavitha R)",
    frequency: "Monthly",
    dataSource: "SOC SIEM Feed",
    calculationMethod: "Count of confirmed security incident events",
    description: "Verified cyber and physical intrusion attempts.",
  },
  {
    id: "KPI-PRJ-001",
    name: "Projects Delayed",
    category: "Operational",
    actual: 6,
    target: 2,
    achievement: 33,
    unit: "Projects",
    trend: "up",
    status: "Warning",
    baseline: 0,
    stretchTarget: 0,
    warningThreshold: 3,
    criticalThreshold: 5,
    owner: "PMO Director (Rajeshwari B)",
    frequency: "Weekly",
    dataSource: "Jira / ERP PM Portfolio",
    calculationMethod: "Projects with Schedule Variance > 10%",
    description: "Active development projects exceeding approved milestone deadlines.",
  },
  {
    id: "KPI-QMS-001",
    name: "Quality NCR (Nos)",
    category: "Quality",
    actual: 12,
    target: 8,
    achievement: 67,
    unit: "NCRs",
    trend: "down",
    status: "Warning",
    baseline: 15,
    stretchTarget: 4,
    warningThreshold: 10,
    criticalThreshold: 15,
    owner: "Quality Head (Senthil V)",
    frequency: "Weekly",
    dataSource: "QMS Audit Database",
    calculationMethod: "Count of Open Non-Conformance Reports",
    description: "Open internal and supplier non-conformance records requiring CAPA.",
  },
];

export const BI_KPI_RECORDS = BI_KPI_MONITORING_RECORDS;

// ==========================================
// CONTROLLED REPORTS MOCK
// ==========================================

export const BI_CONTROLLED_REPORTS: BiReportItem[] = [
  {
    id: "REP-EXEC-01",
    code: "MBR-2026-09",
    name: "Monthly Business Review",
    category: "Executive",
    frequency: "Monthly",
    lastGenerated: "30 Sep 2026 08:00 AM",
    status: "Active",
    owner: "CEO Office",
    format: "PDF",
    summary: "Consolidated enterprise-wide performance, revenue by product, sales funnel, and risk matrix.",
  },
  {
    id: "REP-EXEC-02",
    code: "EDB-2026-09",
    name: "Executive Daily Brief",
    category: "Executive",
    frequency: "Daily",
    lastGenerated: "30 Sep 2026 06:00 AM",
    status: "Active",
    owner: "Operations Head",
    format: "PDF",
    summary: "Morning operational briefing with production units, yesterday's sales, and open exceptions.",
  },
  {
    id: "REP-FIN-01",
    code: "P&L-2026-Q3",
    name: "Quarterly Financial Dossier",
    category: "Financial",
    frequency: "Quarterly",
    lastGenerated: "25 Sep 2026",
    status: "Active",
    owner: "CFO",
    format: "XLSX",
    summary: "Balance sheet, EBITDA reconciliation, gross margin trends, and runway analysis.",
  },
  {
    id: "REP-SALES-01",
    code: "SALES-PIPE-09",
    name: "Commercial Pipeline & Win/Loss Report",
    category: "Sales",
    frequency: "Weekly",
    lastGenerated: "29 Sep 2026",
    status: "Active",
    owner: "VP Sales",
    format: "XLSX",
    summary: "Lead conversion ratios, territory performance, deal sizes, and weighted pipeline forecast.",
  },
  {
    id: "REP-OPS-01",
    code: "OEE-PLANT-09",
    name: "Manufacturing OEE & Quality Audit",
    category: "Manufacturing",
    frequency: "Weekly",
    lastGenerated: "28 Sep 2026",
    status: "Active",
    owner: "Plant Head",
    format: "PDF",
    summary: "Stage-gate inspection yield, scrap rates, machine downtime, and first-pass yield metrics.",
  },
  {
    id: "REP-SCM-01",
    code: "SCM-OTIF-09",
    name: "Supply Chain OTIF & Vendor Evaluation",
    category: "Supply Chain",
    frequency: "Monthly",
    lastGenerated: "27 Sep 2026",
    status: "Active",
    owner: "SCM Head",
    format: "CSV",
    summary: "Supplier delivery punctuality, buffer stock safety levels, and critical parts shortages.",
  },
];

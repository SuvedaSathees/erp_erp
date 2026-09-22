export interface ModuleReportKpi {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
}

export interface SubmoduleStatusRow {
  name: string;
  path: string;
  recordsCount: number;
  completionRate: number; // 0 - 100
  status: "Completed" | "On Track" | "In Progress" | "Needs Attention" | "Planned";
  keyMetric: string;
  owner: string;
  lastUpdated: string;
}

export interface TrendDataPoint {
  period: string;
  actual: number;
  target?: number;
  throughput?: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export interface ActionItem {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  owner: string;
  status: "Open" | "In Progress" | "Resolved";
}

export interface ModuleSummaryConfig {
  id: string;
  moduleName: string;
  areaGroup: "Development" | "Management";
  overviewRoute: string;
  executiveBrief: string;
  kpis: ModuleReportKpi[];
  trendTitle: string;
  trendMetricLabel: string;
  trendData: TrendDataPoint[];
  statusDistribution: StatusDistribution[];
  submodules: SubmoduleStatusRow[];
  actionItems: ActionItem[];
}

export const MODULE_REPORT_CONFIGS: Record<string, ModuleSummaryConfig> = {
  "business-development": {
    id: "business-development",
    moduleName: "Business Development",
    areaGroup: "Development",
    overviewRoute: "/development/business-development/overview",
    executiveBrief: "Commercial momentum remains high across target industrial sectors. Value proposition and pricing validation initiatives achieved 92% milestone delivery this quarter. Priority focus centers on distributor network scaling and European market expansion.",
    kpis: [
      { label: "Active Deals Pipeline", value: "$18.4M", change: "+14.2%", isPositive: true, subtext: "vs. previous quarter" },
      { label: "Deals Closed YTD", value: "42", change: "+8", isPositive: true, subtext: "Ahead of annual quota" },
      { label: "Win Rate", value: "68.4%", change: "+3.1%", isPositive: true, subtext: "Benchmark: 60%" },
      { label: "Channel Partners", value: "36", change: "+5 active", isPositive: true, subtext: "Tier-1 distributors" },
    ],
    trendTitle: "Commercial Deal Volume & Pipeline Conversion",
    trendMetricLabel: "Revenue Pipeline ($M)",
    trendData: [
      { period: "Jan", actual: 12.2, target: 11.0, throughput: 18 },
      { period: "Feb", actual: 13.5, target: 12.0, throughput: 22 },
      { period: "Mar", actual: 15.1, target: 13.5, throughput: 29 },
      { period: "Apr", actual: 16.4, target: 14.5, throughput: 34 },
      { period: "May", actual: 17.8, target: 15.5, throughput: 39 },
      { period: "Jun", actual: 18.4, target: 16.0, throughput: 42 },
    ],
    statusDistribution: [
      { name: "Completed", value: 38, color: "#10b981" },
      { name: "On Track", value: 44, color: "#3b82f6" },
      { name: "In Progress", value: 12, color: "#f59e0b" },
      { name: "Needs Attention", value: 6, color: "#ef4444" },
    ],
    submodules: [
      { name: "Business Model Development", path: "/development/business-development/business-model-development", recordsCount: 14, completionRate: 95, status: "Completed", keyMetric: "4 Frameworks", owner: "Strategy Team", lastUpdated: "Today" },
      { name: "Value Proposition Development", path: "/development/business-development/value-proposition-development", recordsCount: 18, completionRate: 90, status: "On Track", keyMetric: "8 Validations", owner: "Product Marketing", lastUpdated: "Yesterday" },
      { name: "Customer Discovery", path: "/development/business-development/customer-discovery", recordsCount: 54, completionRate: 88, status: "On Track", keyMetric: "54 Interviews", owner: "BD Leads", lastUpdated: "2 days ago" },
      { name: "Market Research", path: "/development/business-development/market-research", recordsCount: 22, completionRate: 92, status: "Completed", keyMetric: "6 Reports", owner: "Analyst Desk", lastUpdated: "3 days ago" },
      { name: "Competitive Analysis", path: "/development/business-development/competitive-analysis", recordsCount: 16, completionRate: 85, status: "On Track", keyMetric: "12 Competitors", owner: "Intelligence Desk", lastUpdated: "1 week ago" },
      { name: "GTM Development", path: "/development/business-development/go-to-market-development", recordsCount: 9, completionRate: 75, status: "In Progress", keyMetric: "Phase 2 Launch", owner: "GTM Council", lastUpdated: "Yesterday" },
      { name: "Pricing Strategy", path: "/development/business-development/pricing-strategy-development", recordsCount: 8, completionRate: 94, status: "Completed", keyMetric: "Tiered Matrix", owner: "Finance & BD", lastUpdated: "4 days ago" },
      { name: "Sales Channel Development", path: "/development/business-development/sales-channel-development", recordsCount: 26, completionRate: 70, status: "Needs Attention", keyMetric: "APAC Delayed", owner: "Channel Ops", lastUpdated: "5 days ago" },
      { name: "Distributor Development", path: "/development/business-development/distributor-development", recordsCount: 31, completionRate: 82, status: "On Track", keyMetric: "31 MOUs", owner: "Global Partners", lastUpdated: "Yesterday" },
      { name: "Corporate Strategy", path: "/development/business-development/corporate-strategy-development", recordsCount: 7, completionRate: 96, status: "Completed", keyMetric: "2026 Roadmap", owner: "Executive Board", lastUpdated: "3 days ago" },
    ],
    actionItems: [
      { id: "ACT-BD-01", title: "Finalize APAC Tier-1 Distributor agreements", priority: "High", dueDate: "End of Month", owner: "Global Partners", status: "In Progress" },
      { id: "ACT-BD-02", title: "Complete Q3 Pricing benchmark vs European entrants", priority: "Medium", dueDate: "Next Week", owner: "Strategy Team", status: "Open" },
      { id: "ACT-BD-03", title: "Publish GTM collateral for Smart Industrial Line", priority: "High", dueDate: "In 3 days", owner: "Product Marketing", status: "In Progress" },
    ],
  },

  "product-development": {
    id: "product-development",
    moduleName: "Product Development",
    areaGroup: "Development",
    overviewRoute: "/development/product-development/overview",
    executiveBrief: "Product development execution demonstrates sustained velocity across electronics, firmware, and cloud software tracks. Hardware validation pass rate reached 96.2%. The primary critical path item is final EMI/EMC compliance testing for Gen-4 modules.",
    kpis: [
      { label: "Active Projects", value: "24", change: "+3 new", isPositive: true, subtext: "16 hardware, 8 software" },
      { label: "Engineering Health", value: "94.8%", change: "+2.4%", isPositive: true, subtext: "Sprint velocity index" },
      { label: "Test Pass Rate", value: "96.2%", change: "+1.8%", isPositive: true, subtext: "Automated regression" },
      { label: "Release Readiness", value: "88.0%", change: "On Target", isPositive: true, subtext: "Target release: Q4" },
    ],
    trendTitle: "Engineering Velocity & Release Readiness Index",
    trendMetricLabel: "Feature Velocity Points",
    trendData: [
      { period: "Jan", actual: 180, target: 160, throughput: 91 },
      { period: "Feb", actual: 210, target: 190, throughput: 93 },
      { period: "Mar", actual: 235, target: 210, throughput: 94 },
      { period: "Apr", actual: 260, target: 240, throughput: 95 },
      { period: "May", actual: 285, target: 265, throughput: 96 },
      { period: "Jun", actual: 310, target: 290, throughput: 96 },
    ],
    statusDistribution: [
      { name: "Completed", value: 42, color: "#10b981" },
      { name: "On Track", value: 40, color: "#3b82f6" },
      { name: "In Progress", value: 14, color: "#f59e0b" },
      { name: "Needs Attention", value: 4, color: "#ef4444" },
    ],
    submodules: [
      { name: "Product Strategy", path: "/development/product-development/product-strategy", recordsCount: 12, completionRate: 98, status: "Completed", keyMetric: "V3 Baseline", owner: "CPO Desk", lastUpdated: "Yesterday" },
      { name: "Roadmap", path: "/development/product-development/product-roadmap", recordsCount: 32, completionRate: 90, status: "On Track", keyMetric: "24 Milestones", owner: "Lead PM", lastUpdated: "Today" },
      { name: "PRD & Specs", path: "/development/product-development/prd", recordsCount: 45, completionRate: 94, status: "Completed", keyMetric: "140 Features", owner: "Systems Eng", lastUpdated: "Yesterday" },
      { name: "Industrial Design", path: "/development/product-development/industrial-design", recordsCount: 16, completionRate: 88, status: "On Track", keyMetric: "CAD Rev 4", owner: "Design Studio", lastUpdated: "2 days ago" },
      { name: "Electronics Design", path: "/development/product-development/electronics-design", recordsCount: 28, completionRate: 84, status: "On Track", keyMetric: "PCB Fab v3", owner: "EE Group", lastUpdated: "Today" },
      { name: "Firmware Development", path: "/development/product-development/firmware-development", recordsCount: 62, completionRate: 89, status: "On Track", keyMetric: "v2.4.1 Release", owner: "Embedded Team", lastUpdated: "Today" },
      { name: "Cloud & APIs", path: "/development/product-development/cloud-platform-development", recordsCount: 51, completionRate: 92, status: "Completed", keyMetric: "99.99% SLA", owner: "Cloud Team", lastUpdated: "Yesterday" },
      { name: "Testing & Validation", path: "/development/product-development/testing-validation", recordsCount: 184, completionRate: 96, status: "Completed", keyMetric: "184 Tests", owner: "QA Team", lastUpdated: "Today" },
      { name: "Certification Readiness", path: "/development/product-development/certification-readiness", recordsCount: 15, completionRate: 72, status: "Needs Attention", keyMetric: "CE/FCC Pending", owner: "Compliance", lastUpdated: "3 days ago" },
      { name: "Release Management", path: "/development/product-development/product-release-management", recordsCount: 19, completionRate: 85, status: "On Track", keyMetric: "Gate 4 Signoff", owner: "Release Eng", lastUpdated: "Yesterday" },
    ],
    actionItems: [
      { id: "ACT-PD-01", title: "Resolve EMC radiation spike on power inverter board", priority: "High", dueDate: "This Friday", owner: "EE Group", status: "In Progress" },
      { id: "ACT-PD-02", title: "Complete penetration test audit for Cloud MQTT Broker", priority: "High", dueDate: "Next Week", owner: "Security Eng", status: "Open" },
      { id: "ACT-PD-03", title: "Finalize mechanical shock absorption test report", priority: "Medium", dueDate: "In 4 days", owner: "Mechanical Lead", status: "Resolved" },
    ],
  },

  "manufacturing-development": {
    id: "manufacturing-development",
    moduleName: "Manufacturing Development",
    areaGroup: "Development",
    overviewRoute: "/development/manufacturing-development/overview",
    executiveBrief: "Manufacturing readiness is operating at an overall composite score of 86%. Production lines are synchronized with APQP gate requirements, PPAP approvals reached 91.4%, and automated assembly tooling validation is tracking ahead of the pilot schedule.",
    kpis: [
      { label: "Overall Readiness Score", value: "86%", change: "+4.1%", isPositive: true, subtext: "Automotive benchmark: 80%" },
      { label: "APQP Gates Closed", value: "18 / 20", change: "90% Closed", isPositive: true, subtext: "Phase 3 to 4 transition" },
      { label: "PPAP Approval Rate", value: "91.4%", change: "+2.8%", isPositive: true, subtext: "Tier-1 supplier signoffs" },
      { label: "Smart Factory OEE", value: "84.2%", change: "+3.5%", isPositive: true, subtext: "Target: 85%" },
    ],
    trendTitle: "Plant Readiness Score & Assembly Line OEE",
    trendMetricLabel: "Composite Index (%)",
    trendData: [
      { period: "Jan", actual: 72, target: 70, throughput: 78 },
      { period: "Feb", actual: 75, target: 73, throughput: 80 },
      { period: "Mar", actual: 78, target: 76, throughput: 81 },
      { period: "Apr", actual: 81, target: 80, throughput: 82 },
      { period: "May", actual: 84, target: 82, throughput: 83 },
      { period: "Jun", actual: 86, target: 85, throughput: 84 },
    ],
    statusDistribution: [
      { name: "Approved", value: 52, color: "#10b981" },
      { name: "In Validation", value: 32, color: "#3b82f6" },
      { name: "Tooling Rework", value: 11, color: "#f59e0b" },
      { name: "Pending Gate", value: 5, color: "#ef4444" },
    ],
    submodules: [
      { name: "APQP Quality Planning", path: "/development/manufacturing-development/quality-planning-apqp", recordsCount: 24, completionRate: 90, status: "On Track", keyMetric: "Gate 4 Clear", owner: "Plant Quality", lastUpdated: "Today" },
      { name: "Production Engineering", path: "/development/manufacturing-development/production-engineering", recordsCount: 42, completionRate: 88, status: "On Track", keyMetric: "Cycle: 42s", owner: "Process Lead", lastUpdated: "Yesterday" },
      { name: "Control Plan", path: "/development/manufacturing-development/control-plan", recordsCount: 36, completionRate: 94, status: "Completed", keyMetric: "36 Control Points", owner: "QA Desk", lastUpdated: "Today" },
      { name: "PFMEA Development", path: "/development/manufacturing-development/pfmea-development", recordsCount: 58, completionRate: 92, status: "Completed", keyMetric: "Max RPN < 80", owner: "Risk Eng", lastUpdated: "Yesterday" },
      { name: "PPAP Process Validation", path: "/development/manufacturing-development/process-validation", recordsCount: 18, completionRate: 91, status: "On Track", keyMetric: "Level 3 Submissions", owner: "Supplier Quality", lastUpdated: "2 days ago" },
      { name: "Assembly Line Dev", path: "/development/manufacturing-development/assembly-line-development", recordsCount: 15, completionRate: 86, status: "On Track", keyMetric: "Line 2 Ready", owner: "Assembly Ops", lastUpdated: "Today" },
      { name: "Tooling Development", path: "/development/manufacturing-development/tooling-development", recordsCount: 29, completionRate: 82, status: "Needs Attention", keyMetric: "Die 4 Wear Check", owner: "Tooling Desk", lastUpdated: "3 days ago" },
      { name: "Fixture Development", path: "/development/manufacturing-development/fixture-development", recordsCount: 22, completionRate: 95, status: "Completed", keyMetric: "22 Fixtures Active", owner: "Plant Eng", lastUpdated: "1 week ago" },
      { name: "Smart Factory Integration", path: "/development/manufacturing-development/smart-factory-development", recordsCount: 40, completionRate: 85, status: "On Track", keyMetric: "IoT Telemetry Live", owner: "Automation", lastUpdated: "Today" },
      { name: "BOM Engineering", path: "/development/manufacturing-development/bom-engineering", recordsCount: 120, completionRate: 98, status: "Completed", keyMetric: "EBOM to MBOM Sync", owner: "Configuration", lastUpdated: "Yesterday" },
    ],
    actionItems: [
      { id: "ACT-MD-01", title: "Complete Cpk capability study on stamping Die #04", priority: "High", dueDate: "Tomorrow", owner: "Tooling Desk", status: "In Progress" },
      { id: "ACT-MD-02", title: "Deploy digital work instructions on robotic cell #3", priority: "Medium", dueDate: "Next Tuesday", owner: "Assembly Ops", status: "Open" },
      { id: "ACT-MD-03", title: "Conduct supplier PPAP sign-off audit for aluminum castings", priority: "High", dueDate: "In 2 days", owner: "Supplier Quality", status: "In Progress" },
    ],
  },

  "research-innovation": {
    id: "research-innovation",
    moduleName: "Research & Innovation",
    areaGroup: "Development",
    overviewRoute: "/development/research-innovation/overview",
    executiveBrief: "R&D programs have generated 14 patent disclosures this fiscal year, with 5 advanced CAE simulation workstreams deployed. Next-gen AI surrogate models have lowered structural analysis turnaround by 65%.",
    kpis: [
      { label: "IP & Patent Disclosures", value: "14", change: "+4 new", isPositive: true, subtext: "3 granted this quarter" },
      { label: "TRL Velocity Score", value: "7.8 / 9", change: "+0.6", isPositive: true, subtext: "Advanced prototype stage" },
      { label: "CAE Simulations Run", value: "142", change: "+28", isPositive: true, subtext: "FEA, CFD, Multiphysics" },
      { label: "Digital Twin Sync", value: "99.2%", change: "+0.8%", isPositive: true, subtext: "Real-time telemetry" },
    ],
    trendTitle: "Research Pipeline Velocity & Patent Filings",
    trendMetricLabel: "R&D Milestone Count",
    trendData: [
      { period: "Jan", actual: 12, target: 10, throughput: 85 },
      { period: "Feb", actual: 16, target: 14, throughput: 88 },
      { period: "Mar", actual: 21, target: 18, throughput: 90 },
      { period: "Apr", actual: 25, target: 22, throughput: 92 },
      { period: "May", actual: 29, target: 26, throughput: 94 },
      { period: "Jun", actual: 34, target: 30, throughput: 95 },
    ],
    statusDistribution: [
      { name: "Patented / Completed", value: 34, color: "#10b981" },
      { name: "In Simulation", value: 42, color: "#3b82f6" },
      { name: "Prototype Lab", value: 16, color: "#f59e0b" },
      { name: "Feasibility", value: 8, color: "#8b5cf6" },
    ],
    submodules: [
      { name: "Simulation & Analysis", path: "/development/research-innovation/simulation-analysis/new", recordsCount: 48, completionRate: 94, status: "Completed", keyMetric: "48 Finite Elements", owner: "CAE Team", lastUpdated: "Today" },
      { name: "Cybersecurity Eng", path: "/development/research-innovation/cybersecurity-engineering/new", recordsCount: 26, completionRate: 90, status: "On Track", keyMetric: "ISO 21434 Compliant", owner: "SecOps", lastUpdated: "Yesterday" },
      { name: "AI Model Development", path: "/development/research-innovation/ai-model-development/new", recordsCount: 35, completionRate: 96, status: "Completed", keyMetric: "Surrogate v4.2", owner: "AI Lab", lastUpdated: "Today" },
      { name: "Product Architecture", path: "/development/research-innovation/product-architecture/new", recordsCount: 19, completionRate: 88, status: "On Track", keyMetric: "Modular Platform", owner: "Chief Architect", lastUpdated: "3 days ago" },
      { name: "Cloud Platform Dev", path: "/development/research-innovation/cloud-platform-development/new", recordsCount: 31, completionRate: 91, status: "On Track", keyMetric: "Edge Gateway Live", owner: "Cloud Arch", lastUpdated: "Yesterday" },
      { name: "Industrial Design", path: "/development/research-innovation/industrial-design/new", recordsCount: 14, completionRate: 86, status: "On Track", keyMetric: "Ergonomic Rev 3", owner: "ID Studio", lastUpdated: "4 days ago" },
      { name: "UI/UX Development", path: "/development/research-innovation/ui-ux-development/new", recordsCount: 42, completionRate: 95, status: "Completed", keyMetric: "Design Token v2", owner: "UI Squad", lastUpdated: "Today" },
      { name: "API Development", path: "/development/research-innovation/api-development/new", recordsCount: 52, completionRate: 93, status: "Completed", keyMetric: "gRPC & REST", owner: "Backend Eng", lastUpdated: "Yesterday" },
    ],
    actionItems: [
      { id: "ACT-RI-01", title: "Submit provisional patent on adaptive battery balancing", priority: "High", dueDate: "In 5 days", owner: "IP Counsel", status: "In Progress" },
      { id: "ACT-RI-02", title: "Calibrate wind tunnel correlation data with CFD mesh #8", priority: "Medium", dueDate: "Next Week", owner: "Aerodynamics", status: "Open" },
    ],
  },

  "administration-management": {
    id: "administration-management",
    moduleName: "Organization Management",
    areaGroup: "Management",
    overviewRoute: "/management/administration-management/overview",
    executiveBrief: "Enterprise organizational governance audit completed with a 98.6% compliance score. Approval matrix governance is active across 8 global entities, with master data deduplication and RBAC policy synchronization fully operational.",
    kpis: [
      { label: "Active Branches", value: "12", change: "2 New Hubs", isPositive: true, subtext: "Across 4 territories" },
      { label: "Departments Synchronized", value: "38", change: "100%", isPositive: true, subtext: "Zero orphaned depts" },
      { label: "Active System Users", value: "1,420", change: "+64", isPositive: true, subtext: "SSO enforced" },
      { label: "Governance Audit Score", value: "98.6%", change: "+1.2%", isPositive: true, subtext: "Tier-1 Compliance" },
    ],
    trendTitle: "System Governance & Audit Compliance Trend",
    trendMetricLabel: "Compliance Index (%)",
    trendData: [
      { period: "Jan", actual: 95.2, target: 94.0, throughput: 1100 },
      { period: "Feb", actual: 96.0, target: 95.0, throughput: 1180 },
      { period: "Mar", actual: 96.8, target: 95.5, throughput: 1240 },
      { period: "Apr", actual: 97.4, target: 96.0, throughput: 1310 },
      { period: "May", actual: 98.1, target: 97.0, throughput: 1380 },
      { period: "Jun", actual: 98.6, target: 97.5, throughput: 1420 },
    ],
    statusDistribution: [
      { name: "Compliant", value: 68, color: "#10b981" },
      { name: "Under Review", value: 22, color: "#3b82f6" },
      { name: "Pending Approval", value: 8, color: "#f59e0b" },
      { name: "Exception Flag", value: 2, color: "#ef4444" },
    ],
    submodules: [
      { name: "Organization Structure", path: "/management/administration-management/organization-structure", recordsCount: 12, completionRate: 98, status: "Completed", keyMetric: "12 Legal Entities", owner: "Legal & Admin", lastUpdated: "Today" },
      { name: "Branch Management", path: "/management/administration-management/branch-management", recordsCount: 18, completionRate: 95, status: "Completed", keyMetric: "12 Active, 6 Satellite", owner: "Facilities", lastUpdated: "Yesterday" },
      { name: "Department Management", path: "/management/administration-management/department-management", recordsCount: 38, completionRate: 94, status: "Completed", keyMetric: "38 Operating Units", owner: "Org HR", lastUpdated: "2 days ago" },
      { name: "User & Role Management", path: "/management/administration-management/user-role-management", recordsCount: 1420, completionRate: 99, status: "Completed", keyMetric: "64 Custom Roles", owner: "Security Desk", lastUpdated: "Today" },
      { name: "Approval Matrix", path: "/management/administration-management/approval-matrix-management", recordsCount: 86, completionRate: 92, status: "On Track", keyMetric: "Tiered Delegation", owner: "Finance Admin", lastUpdated: "Yesterday" },
      { name: "Document Control", path: "/management/administration-management/document-control-management", recordsCount: 430, completionRate: 96, status: "Completed", keyMetric: "ISO Controlled", owner: "Quality Admin", lastUpdated: "Today" },
      { name: "Policy Management", path: "/management/administration-management/policy-management", recordsCount: 24, completionRate: 90, status: "On Track", keyMetric: "Annual Refresh", owner: "Legal Counsel", lastUpdated: "1 week ago" },
      { name: "Master Data Management", path: "/management/administration-management/master-data-management", recordsCount: 12500, completionRate: 97, status: "Completed", keyMetric: "99.8% Data Quality", owner: "Data Team", lastUpdated: "Today" },
      { name: "Audit Management", path: "/management/administration-management/audit-management", recordsCount: 32, completionRate: 98, status: "Completed", keyMetric: "Zero Critical Gaps", owner: "Internal Audit", lastUpdated: "3 days ago" },
    ],
    actionItems: [
      { id: "ACT-ADM-01", title: "Complete annual review of high-value PO approval limits", priority: "High", dueDate: "This Month", owner: "Finance Admin", status: "In Progress" },
      { id: "ACT-ADM-02", title: "Archive obsolete policy revisions for German branch", priority: "Low", dueDate: "Next Week", owner: "Document Control", status: "Open" },
    ],
  },

  "sales-management": {
    id: "sales-management",
    moduleName: "Sales Management",
    areaGroup: "Management",
    overviewRoute: "/management/sales-management/overview",
    executiveBrief: "Sales execution remains strong with $4.85M in closed orders this month, surpassing targets by 8.4%. Commission distribution has been balanced, and commercial contract negotiations in the mobility vertical are progressing favorably.",
    kpis: [
      { label: "Closed Orders YTD", value: "$28.4M", change: "+12.4%", isPositive: true, subtext: "vs. target of $25.2M" },
      { label: "Active Pipeline Value", value: "$41.2M", change: "+8.6%", isPositive: true, subtext: "Weighted: $28.9M" },
      { label: "Average Deal Size", value: "$185K", change: "+14.0%", isPositive: true, subtext: "Tier-1 enterprise" },
      { label: "Sales Cycle Length", value: "48 Days", change: "-6 Days", isPositive: true, subtext: "Velocity improving" },
    ],
    trendTitle: "Monthly Order Intake & Sales Target Trajectory",
    trendMetricLabel: "Booked Revenue ($M)",
    trendData: [
      { period: "Jan", actual: 3.8, target: 3.5, throughput: 28 },
      { period: "Feb", actual: 4.1, target: 3.8, throughput: 31 },
      { period: "Mar", actual: 4.6, target: 4.2, throughput: 36 },
      { period: "Apr", actual: 4.4, target: 4.0, throughput: 34 },
      { period: "May", actual: 5.1, target: 4.5, throughput: 42 },
      { period: "Jun", actual: 6.4, target: 5.2, throughput: 48 },
    ],
    statusDistribution: [
      { name: "Invoiced", value: 45, color: "#10b981" },
      { name: "Contracted", value: 30, color: "#3b82f6" },
      { name: "Quotation Stage", value: 18, color: "#f59e0b" },
      { name: "Under Review", value: 7, color: "#ef4444" },
    ],
    submodules: [
      { name: "Sales Planning", path: "/management/sales-management/sales-planning", recordsCount: 14, completionRate: 96, status: "Completed", keyMetric: "FY26 Targets Set", owner: "VP Sales", lastUpdated: "Today" },
      { name: "Sales Forecasting", path: "/management/sales-management/sales-forecasting", recordsCount: 28, completionRate: 92, status: "On Track", keyMetric: "94% Accuracy", owner: "Sales Ops", lastUpdated: "Yesterday" },
      { name: "Sales Analytics", path: "/management/sales-management/sales-analytics", recordsCount: 45, completionRate: 95, status: "Completed", keyMetric: "Weekly Cadence", owner: "BI Desk", lastUpdated: "Today" },
      { name: "Sales Orders", path: "/management/sales-management/sales-orders", recordsCount: 380, completionRate: 91, status: "On Track", keyMetric: "380 Active Orders", owner: "Order Desk", lastUpdated: "Today" },
      { name: "Pricing & Quotation", path: "/management/sales-management/pricing", recordsCount: 65, completionRate: 90, status: "On Track", keyMetric: "Dynamic Margins", owner: "Commercial", lastUpdated: "2 days ago" },
      { name: "Contracts Management", path: "/management/sales-management/contracts", recordsCount: 92, completionRate: 88, status: "On Track", keyMetric: "92 Active SLAs", owner: "Legal & Sales", lastUpdated: "Yesterday" },
      { name: "Channel Partners", path: "/management/sales-management/channel-partners", recordsCount: 34, completionRate: 85, status: "On Track", keyMetric: "34 Certified", owner: "Partner Mgr", lastUpdated: "3 days ago" },
      { name: "Sales Commission", path: "/management/sales-management/sales-commission", recordsCount: 88, completionRate: 98, status: "Completed", keyMetric: "Q2 Processed", owner: "Payroll & Sales", lastUpdated: "1 week ago" },
    ],
    actionItems: [
      { id: "ACT-SLS-01", title: "Execute Master Supply Contract with AutoTech Global", priority: "High", dueDate: "In 2 days", owner: "VP Sales", status: "In Progress" },
      { id: "ACT-SLS-02", title: "Update volume rebate matrix for Tier-2 distributors", priority: "Medium", dueDate: "Next Week", owner: "Commercial", status: "Open" },
    ],
  },

  "marketing-management": {
    id: "marketing-management",
    moduleName: "Marketing Management",
    areaGroup: "Management",
    overviewRoute: "/management/marketing-management/overview",
    executiveBrief: "Marketing initiatives deliver high commercial ROI with 500 qualified leads generated, achieving a 4.5x marketing return multiplier. Digital multi-channel campaigns in Tamil Nadu and Karnataka led customer acquisition, while autonomous wireless charging content drove an 18% higher conversion surge.",
    kpis: [
      { label: "Campaign Reach", value: "500,000", change: "+12.0%", isPositive: true, subtext: "Target: 500K reached" },
      { label: "Leads Generated", value: "500", change: "+25.0%", isPositive: true, subtext: "185 MQLs / 82 SQLs" },
      { label: "Attributed Revenue", value: "₹85.0 L", change: "+35.0%", isPositive: true, subtext: "44 Opportunities" },
      { label: "Marketing ROI", value: "4.5x", change: "+1.2x", isPositive: true, subtext: "ROAS: 13.7x" },
    ],
    trendTitle: "Campaign Lead Generation & Revenue Attribution Velocity",
    trendMetricLabel: "Attributed Revenue (₹ Lakhs)",
    trendData: [
      { period: "May", actual: 35.0, target: 30.0, throughput: 210 },
      { period: "Jun", actual: 48.0, target: 40.0, throughput: 280 },
      { period: "Jul", actual: 62.0, target: 55.0, throughput: 360 },
      { period: "Aug", actual: 74.0, target: 68.0, throughput: 420 },
      { period: "Sep", actual: 85.0, target: 75.0, throughput: 500 },
      { period: "Oct (F)", actual: 105.0, target: 90.0, throughput: 610 },
    ],
    statusDistribution: [
      { name: "Active / Live", value: 52, color: "#10b981" },
      { name: "In Review", value: 24, color: "#3b82f6" },
      { name: "Approved", value: 16, color: "#f59e0b" },
      { name: "Completed", value: 8, color: "#8b5cf6" },
    ],
    submodules: [
      { name: "Campaigns", path: "/management/marketing-management/campaigns", recordsCount: 12, completionRate: 94, status: "Completed", keyMetric: "12 Active Campaigns", owner: "Arun Kumar", lastUpdated: "Today" },
      { name: "Digital Marketing", path: "/management/marketing-management/digital-marketing", recordsCount: 24, completionRate: 92, status: "Completed", keyMetric: "4.8% Avg CTR", owner: "Digital Lead", lastUpdated: "Today" },
      { name: "Email Marketing", path: "/management/marketing-management/email-marketing", recordsCount: 38, completionRate: 91, status: "Completed", keyMetric: "48.2% Open Rate", owner: "Email Lead", lastUpdated: "Today" },
      { name: "Social Media", path: "/management/marketing-management/social-media", recordsCount: 45, completionRate: 90, status: "Completed", keyMetric: "12.4% Engagement", owner: "Social Desk", lastUpdated: "Today" },
      { name: "Events & Expos", path: "/management/marketing-management/events", recordsCount: 8, completionRate: 85, status: "On Track", keyMetric: "3 Upcoming Summits", owner: "Events Desk", lastUpdated: "3 days ago" },
      { name: "Brand Management", path: "/management/marketing-management/brand-management", recordsCount: 18, completionRate: 92, status: "Completed", keyMetric: "92% Brand Compliance", owner: "Arun Kumar", lastUpdated: "Today" },
      { name: "Market Research", path: "/management/marketing-management/market-research", recordsCount: 14, completionRate: 86, status: "On Track", keyMetric: "EV Fleet TAM Study", owner: "Research Desk", lastUpdated: "4 days ago" },
      { name: "Lead Generation", path: "/management/marketing-management/leads-management", recordsCount: 1280, completionRate: 92, status: "On Track", keyMetric: "1,280 Leads", owner: "Inside Sales", lastUpdated: "Today" },
      { name: "Competitor Analysis", path: "/management/marketing-management/competitor-analysis", recordsCount: 12, completionRate: 92, status: "Completed", keyMetric: "12 Competitors Tracked", owner: "Strategy Desk", lastUpdated: "Today" },
      { name: "Marketing Analytics", path: "/management/marketing-management/marketing-analytics", recordsCount: 28, completionRate: 95, status: "Completed", keyMetric: "₹4.8 Cr Attributed", owner: "Arun Kumar", lastUpdated: "Today" },
    ],
    actionItems: [
      { id: "ACT-MKT-01", title: "Scale Google Ads budget by 20% for Fleet Charging keywords", priority: "High", dueDate: "In 2 days", owner: "Digital Lead", status: "In Progress" },
      { id: "ACT-MKT-02", title: "Finalize booth design and speaker slot for National EV Expo", priority: "Medium", dueDate: "Next Week", owner: "Events Desk", status: "Open" },
      { id: "ACT-MKT-03", title: "Publish 'Autonomous Wireless EV Charging for Fleets' whitepaper", priority: "High", dueDate: "Friday", owner: "Creative Team", status: "In Progress" },
    ],
  },

  "crm-management": {
    id: "crm-management",
    moduleName: "CRM Management",
    areaGroup: "Management",
    overviewRoute: "/management/crm-management/overview",
    executiveBrief: "Customer retention reached an all-time high of 94.6%. The sales funnel currently tracks 240 active opportunities. Support SLA adherence is operating at 96.8% with an average customer satisfaction score of 4.8 / 5.0.",
    kpis: [
      { label: "Active Leads", value: "1,240", change: "+18%", isPositive: true, subtext: "340 Hot Leads" },
      { label: "Weighted Funnel", value: "$32.4M", change: "+9.2%", isPositive: true, subtext: "Win probability adjusted" },
      { label: "Customer CSAT", value: "4.8 / 5.0", change: "+0.2", isPositive: true, subtext: "840 respondents" },
      { label: "SLA Resolution Rate", value: "96.8%", change: "+1.4%", isPositive: true, subtext: "< 4hr avg resolution" },
    ],
    trendTitle: "Customer Pipeline Inflow & Conversion Rates",
    trendMetricLabel: "Converted Accounts",
    trendData: [
      { period: "Jan", actual: 45, target: 40, throughput: 92 },
      { period: "Feb", actual: 52, target: 45, throughput: 94 },
      { period: "Mar", actual: 64, target: 55, throughput: 95 },
      { period: "Apr", actual: 70, target: 60, throughput: 96 },
      { period: "May", actual: 78, target: 70, throughput: 96 },
      { period: "Jun", actual: 86, target: 75, throughput: 97 },
    ],
    statusDistribution: [
      { name: "Won / Retained", value: 50, color: "#10b981" },
      { name: "Negotiation", value: 28, color: "#3b82f6" },
      { name: "Discovery", value: 15, color: "#f59e0b" },
      { name: "At Risk / Escalated", value: 7, color: "#ef4444" },
    ],
    submodules: [
      { name: "Lead Management", path: "/management/crm-management/lead-management", recordsCount: 1240, completionRate: 94, status: "Completed", keyMetric: "340 Qualified", owner: "Demand Gen", lastUpdated: "Today" },
      { name: "Account Management", path: "/management/crm-management/account-management", recordsCount: 420, completionRate: 96, status: "Completed", keyMetric: "420 Key Accounts", owner: "Account Execs", lastUpdated: "Today" },
      { name: "Contact Management", path: "/management/crm-management/contact-management", recordsCount: 3800, completionRate: 98, status: "Completed", keyMetric: "Clean CRM sync", owner: "CRM Admin", lastUpdated: "Yesterday" },
      { name: "Opportunity Management", path: "/management/crm-management/opportunity-management", recordsCount: 240, completionRate: 90, status: "On Track", keyMetric: "240 In Flight", owner: "Sales Team", lastUpdated: "Today" },
      { name: "Customer Orders", path: "/management/crm-management/customer-orders-management", recordsCount: 512, completionRate: 92, status: "On Track", keyMetric: "512 Fulfillments", owner: "Fulfillment Desk", lastUpdated: "Today" },
      { name: "Customer Support", path: "/management/crm-management/customer-support", recordsCount: 184, completionRate: 97, status: "Completed", keyMetric: "12 Open Tickets", owner: "Support Desk", lastUpdated: "Today" },
      { name: "Complaint Management", path: "/management/crm-management/complaint-management", recordsCount: 14, completionRate: 85, status: "Needs Attention", keyMetric: "2 Critical Alerts", owner: "Quality Care", lastUpdated: "Yesterday" },
      { name: "Loyalty Management", path: "/management/crm-management/loyalty-management", recordsCount: 160, completionRate: 91, status: "Completed", keyMetric: "VIP Tier Active", owner: "Retention Team", lastUpdated: "3 days ago" },
    ],
    actionItems: [
      { id: "ACT-CRM-01", title: "Resolve Tier-1 client delivery dispute for ElectroMobility", priority: "High", dueDate: "Today", owner: "Quality Care", status: "In Progress" },
      { id: "ACT-CRM-02", title: "Automate onboarding feedback survey trigger in CRM", priority: "Low", dueDate: "Next Week", owner: "CRM Admin", status: "Open" },
    ],
  },

  "hrm-management": {
    id: "hrm-management",
    moduleName: "HRM Management",
    areaGroup: "Management",
    overviewRoute: "/management/hrm-management/overview",
    executiveBrief: "Workforce headcount stands at 1,420 full-time equivalents with a 94.2% retention rate. Payroll disbursement achieved 100% on-time processing. Talent recruitment for engineering and production automation tracks remains on schedule.",
    kpis: [
      { label: "Total Headcount", value: "1,420", change: "+38 QTD", isPositive: true, subtext: "Across all divisions" },
      { label: "Monthly Payroll", value: "$4.25M", change: "On Budget", isPositive: true, subtext: "Zero payroll defects" },
      { label: "Retention Rate", value: "94.2%", change: "+1.6%", isPositive: true, subtext: "Industry benchmark: 88%" },
      { label: "Training Hours YTD", value: "18,400", change: "+14%", isPositive: true, subtext: "Lean & safety skills" },
    ],
    trendTitle: "Monthly Headcount Growth & Retention Stability",
    trendMetricLabel: "Active Workforce",
    trendData: [
      { period: "Jan", actual: 1340, target: 1330, throughput: 94 },
      { period: "Feb", actual: 1360, target: 1350, throughput: 94 },
      { period: "Mar", actual: 1375, target: 1365, throughput: 94 },
      { period: "Apr", actual: 1390, target: 1380, throughput: 95 },
      { period: "May", actual: 1405, target: 1395, throughput: 94 },
      { period: "Jun", actual: 1420, target: 1410, throughput: 94 },
    ],
    statusDistribution: [
      { name: "Active", value: 85, color: "#10b981" },
      { name: "Onboarding", value: 8, color: "#3b82f6" },
      { name: "On Leave", value: 5, color: "#f59e0b" },
      { name: "Offboarding", value: 2, color: "#ef4444" },
    ],
    submodules: [
      { name: "Workforce Planning", path: "/management/hrm-management/workforce-planning", recordsCount: 22, completionRate: 95, status: "Completed", keyMetric: "FY26 Staffing Plan", owner: "HR Director", lastUpdated: "Today" },
      { name: "Recruitment Management", path: "/management/hrm-management/recruitment-management", recordsCount: 46, completionRate: 88, status: "On Track", keyMetric: "18 Open Roles", owner: "Talent Acq", lastUpdated: "Today" },
      { name: "Employee Management", path: "/management/hrm-management/employee-management", recordsCount: 1420, completionRate: 99, status: "Completed", keyMetric: "1420 Profiles Active", owner: "HR Ops", lastUpdated: "Today" },
      { name: "Attendance & Leaves", path: "/management/hrm-management/attendance-management", recordsCount: 1420, completionRate: 96, status: "Completed", keyMetric: "97.4% Attendance", owner: "HR Ops", lastUpdated: "Today" },
      { name: "Payroll Management", path: "/management/hrm-management/payroll-management", recordsCount: 12, completionRate: 100, status: "Completed", keyMetric: "100% Disbursed", owner: "Payroll Desk", lastUpdated: "Yesterday" },
      { name: "Performance Management", path: "/management/hrm-management/performance-management", recordsCount: 1280, completionRate: 92, status: "On Track", keyMetric: "Q2 Reviews 92%", owner: "People Ops", lastUpdated: "2 days ago" },
      { name: "Training & Development", path: "/management/hrm-management/learning-development", recordsCount: 64, completionRate: 89, status: "On Track", keyMetric: "18,400 Hours", owner: "L&D Desk", lastUpdated: "3 days ago" },
      { name: "Expense Claims", path: "/management/hrm-management/expense-claims", recordsCount: 340, completionRate: 94, status: "Completed", keyMetric: "SLA < 48 Hours", owner: "Finance & HR", lastUpdated: "Today" },
    ],
    actionItems: [
      { id: "ACT-HR-01", title: "Close candidate offers for Senior Automation Engineers", priority: "High", dueDate: "This Friday", owner: "Talent Acq", status: "In Progress" },
      { id: "ACT-HR-02", title: "Finalize annual health insurance policy renewal", priority: "Medium", dueDate: "End of Month", owner: "HR Director", status: "Open" },
    ],
  },

  "procurement-management": {
    id: "procurement-management",
    moduleName: "Procurement Management",
    areaGroup: "Management",
    overviewRoute: "/management/procurement-management/overview",
    executiveBrief: "Strategic supplier contracts yielded $1.82M in cost savings year-to-date. Supplier on-time delivery rate is tracking at 94.8%. 100% of purchase orders above threshold adhered to automated 3-way matching and approval matrices.",
    kpis: [
      { label: "Purchase Orders YTD", value: "$36.8M", change: "+8.2%", isPositive: true, subtext: "1,240 Total POs" },
      { label: "Procurement Savings", value: "$1.82M", change: "+14.5%", isPositive: true, subtext: "Against budget baseline" },
      { label: "Supplier OTD Rate", value: "94.8%", change: "+2.1%", isPositive: true, subtext: "On-time delivery" },
      { label: "Active Suppliers", value: "248", change: "+12 vetted", isPositive: true, subtext: "Tier-1 & Tier-2" },
    ],
    trendTitle: "Monthly PO Spend & Verified Material Receipts",
    trendMetricLabel: "Procurement Spend ($M)",
    trendData: [
      { period: "Jan", actual: 4.8, target: 4.5, throughput: 93 },
      { period: "Feb", actual: 5.2, target: 4.8, throughput: 94 },
      { period: "Mar", actual: 5.9, target: 5.5, throughput: 94 },
      { period: "Apr", actual: 6.2, target: 5.8, throughput: 95 },
      { period: "May", actual: 6.8, target: 6.2, throughput: 95 },
      { period: "Jun", actual: 7.9, target: 7.0, throughput: 95 },
    ],
    statusDistribution: [
      { name: "Received & Cleared", value: 65, color: "#10b981" },
      { name: "In Transit", value: 20, color: "#3b82f6" },
      { name: "RFQ / Bidding", value: 10, color: "#f59e0b" },
      { name: "Pending Approval", value: 5, color: "#ef4444" },
    ],
    submodules: [
      { name: "Purchase Requisition", path: "/management/procurement-management/purchase-requisition", recordsCount: 840, completionRate: 96, status: "Completed", keyMetric: "840 Requisitions", owner: "Procurement Desk", lastUpdated: "Today" },
      { name: "RFQ & Quotation", path: "/management/procurement-management/rfq-quotation", recordsCount: 160, completionRate: 90, status: "On Track", keyMetric: "4.2 Bids / RFQ", owner: "Sourcing Team", lastUpdated: "Yesterday" },
      { name: "Vendor Quotations", path: "/management/procurement-management/vendor-quotation", recordsCount: 420, completionRate: 92, status: "Completed", keyMetric: "Competitive Matrix", owner: "Buyers", lastUpdated: "Today" },
      { name: "Purchase Orders", path: "/management/procurement-management/purchase-order", recordsCount: 1240, completionRate: 95, status: "Completed", keyMetric: "1240 POs Issued", owner: "PO Team", lastUpdated: "Today" },
      { name: "Goods Receipt", path: "/management/procurement-management/goods-receipt", recordsCount: 980, completionRate: 94, status: "Completed", keyMetric: "98% Dock-to-Stock", owner: "Warehouse", lastUpdated: "Today" },
      { name: "Invoice Verification", path: "/management/procurement-management/invoice-verification", recordsCount: 920, completionRate: 93, status: "On Track", keyMetric: "3-Way Match 99%", owner: "AP Desk", lastUpdated: "Yesterday" },
      { name: "Supplier Portal", path: "/management/procurement-management/supplier-portal", recordsCount: 248, completionRate: 98, status: "Completed", keyMetric: "248 Integrated", owner: "Vendor Relations", lastUpdated: "2 days ago" },
    ],
    actionItems: [
      { id: "ACT-PRC-01", title: "Renegotiate copper wiring annual volume rebate", priority: "High", dueDate: "Next Tuesday", owner: "Sourcing Team", status: "In Progress" },
      { id: "ACT-PRC-02", title: "Review alternate supplier for electronic relays", priority: "Medium", dueDate: "In 10 days", owner: "Procurement Desk", status: "Open" },
    ],
  },

  "project-management": {
    id: "project-management",
    moduleName: "Project Management",
    areaGroup: "Management",
    overviewRoute: "/management/project-management/overview",
    executiveBrief: "Portfolio tracking reflects 48 active projects with 91.2% milestone on-time delivery. Budget variance across key capital projects is controlled within +1.8%. Resource allocation is balanced with an 88% billable efficiency.",
    kpis: [
      { label: "Active Projects", value: "48", change: "+6 this quarter", isPositive: true, subtext: "34 on schedule" },
      { label: "Milestone Adherence", value: "91.2%", change: "+3.4%", isPositive: true, subtext: "Across 280 milestones" },
      { label: "Budget Variance", value: "+1.8%", change: "Within Limit", isPositive: true, subtext: "Tolerance: +/- 5%" },
      { label: "Resource Utilization", value: "88.4%", change: "+2.1%", isPositive: true, subtext: "Target: 85%" },
    ],
    trendTitle: "Project Milestone Completion Velocity",
    trendMetricLabel: "Completed Milestones",
    trendData: [
      { period: "Jan", actual: 32, target: 30, throughput: 90 },
      { period: "Feb", actual: 38, target: 35, throughput: 91 },
      { period: "Mar", actual: 44, target: 40, throughput: 91 },
      { period: "Apr", actual: 48, target: 45, throughput: 92 },
      { period: "May", actual: 54, target: 50, throughput: 92 },
      { period: "Jun", actual: 64, target: 58, throughput: 93 },
    ],
    statusDistribution: [
      { name: "Completed", value: 48, color: "#10b981" },
      { name: "On Track", value: 36, color: "#3b82f6" },
      { name: "At Risk", value: 12, color: "#f59e0b" },
      { name: "Delayed", value: 4, color: "#ef4444" },
    ],
    submodules: [
      { name: "Project Planning", path: "/management/project-management/project-planning", recordsCount: 48, completionRate: 94, status: "Completed", keyMetric: "48 Baselines Approved", owner: "PMO Lead", lastUpdated: "Today" },
      { name: "WBS & Hierarchy", path: "/management/project-management/wbs", recordsCount: 320, completionRate: 92, status: "Completed", keyMetric: "5-Level WBS", owner: "Project Planners", lastUpdated: "Yesterday" },
      { name: "Milestones", path: "/management/project-management/milestones", recordsCount: 280, completionRate: 91, status: "On Track", keyMetric: "91% On Schedule", owner: "PMs", lastUpdated: "Today" },
      { name: "Task Management", path: "/management/project-management/task-management", recordsCount: 1420, completionRate: 89, status: "On Track", keyMetric: "112 Open Tasks", owner: "Workstream Leads", lastUpdated: "Today" },
      { name: "Time Tracking", path: "/management/project-management/time-tracking", recordsCount: 4800, completionRate: 96, status: "Completed", keyMetric: "Timesheets 98%", owner: "Resource Mgr", lastUpdated: "Today" },
      { name: "Budget Control", path: "/management/project-management/budget-control", recordsCount: 48, completionRate: 93, status: "Completed", keyMetric: "+1.8% Variance", owner: "Finance PMO", lastUpdated: "Yesterday" },
      { name: "Risk Management", path: "/management/project-management/risk-management", recordsCount: 84, completionRate: 86, status: "Needs Attention", keyMetric: "6 High Risks", owner: "Risk Desk", lastUpdated: "2 days ago" },
      { name: "Project Analytics", path: "/management/project-management/project-analytics", recordsCount: 48, completionRate: 95, status: "Completed", keyMetric: "Live Dashboards", owner: "PMO BI", lastUpdated: "Today" },
    ],
    actionItems: [
      { id: "ACT-PM-01", title: "Mitigate critical path delay on Automation Cell #4 deployment", priority: "High", dueDate: "In 3 days", owner: "PMO Lead", status: "In Progress" },
      { id: "ACT-PM-02", title: "Review Q3 resource reallocation for electronics prototype team", priority: "Medium", dueDate: "Next Week", owner: "Resource Mgr", status: "Open" },
    ],
  },

  "asset-management": {
    id: "asset-management",
    moduleName: "Asset Management",
    areaGroup: "Management",
    overviewRoute: "/management/asset-management/overview",
    executiveBrief: "Asset lifecycle operations oversee $64.2M in capital assets across manufacturing plants. Preventive maintenance schedule compliance achieved 96.4%, reducing unplanned downtime events by 24% over the prior period.",
    kpis: [
      { label: "Total Capital Assets", value: "$64.2M", change: "+4.8%", isPositive: true, subtext: "1,840 Active Assets" },
      { label: "Maintenance Compliance", value: "96.4%", change: "+2.2%", isPositive: true, subtext: "Preventive Schedule" },
      { label: "Asset Availability", value: "98.1%", change: "+0.9%", isPositive: true, subtext: "Uptime guarantee" },
      { label: "Calibration Up-to-date", value: "99.2%", change: "Zero Expired", isPositive: true, subtext: "Certified tooling" },
    ],
    trendTitle: "Asset Maintenance Completion & Uptime Trends",
    trendMetricLabel: "Work Orders Completed",
    trendData: [
      { period: "Jan", actual: 120, target: 110, throughput: 97 },
      { period: "Feb", actual: 135, target: 125, throughput: 97 },
      { period: "Mar", actual: 148, target: 140, throughput: 98 },
      { period: "Apr", actual: 160, target: 150, throughput: 98 },
      { period: "May", actual: 172, target: 165, throughput: 98 },
      { period: "Jun", actual: 185, target: 175, throughput: 98 },
    ],
    statusDistribution: [
      { name: "Operational", value: 82, color: "#10b981" },
      { name: "Under Maintenance", value: 11, color: "#3b82f6" },
      { name: "Calibration Due", value: 5, color: "#f59e0b" },
      { name: "Decommissioned", value: 2, color: "#94a3b8" },
    ],
    submodules: [
      { name: "Fixed Assets", path: "/management/asset-management/fixed-assets", recordsCount: 1840, completionRate: 98, status: "Completed", keyMetric: "1840 Tagged", owner: "Asset Accounting", lastUpdated: "Today" },
      { name: "Equipment Master", path: "/management/asset-management/equipment", recordsCount: 420, completionRate: 96, status: "Completed", keyMetric: "420 Heavy Machines", owner: "Plant Maintenance", lastUpdated: "Today" },
      { name: "Tool Management", path: "/management/asset-management/tool-management", recordsCount: 860, completionRate: 94, status: "Completed", keyMetric: "RFID Tracked", owner: "Tooling Crib", lastUpdated: "Yesterday" },
      { name: "Calibration", path: "/management/asset-management/calibration", recordsCount: 310, completionRate: 99, status: "Completed", keyMetric: "NABL Certified", owner: "Metrology Desk", lastUpdated: "Today" },
      { name: "Preventive Maintenance", path: "/management/asset-management/preventive-maintenance", recordsCount: 240, completionRate: 96, status: "Completed", keyMetric: "96.4% Compliance", owner: "Maintenance Ops", lastUpdated: "Today" },
      { name: "Predictive Maintenance", path: "/management/asset-management/predictive-maintenance", recordsCount: 85, completionRate: 90, status: "On Track", keyMetric: "IoT Vibration Sync", owner: "Reliability Eng", lastUpdated: "Yesterday" },
      { name: "Asset Depreciation", path: "/management/asset-management/asset-depreciation", recordsCount: 1840, completionRate: 100, status: "Completed", keyMetric: "Depreciation Booked", owner: "Finance Asset", lastUpdated: "3 days ago" },
      { name: "Asset Tracking", path: "/management/asset-management/asset-tracking", recordsCount: 1840, completionRate: 97, status: "Completed", keyMetric: "Barcodes & RFID", owner: "Asset Ops", lastUpdated: "Today" },
    ],
    actionItems: [
      { id: "ACT-AST-01", title: "Complete semi-annual calibration on CMM measuring arm", priority: "High", dueDate: "This Friday", owner: "Metrology Desk", status: "In Progress" },
      { id: "ACT-AST-02", title: "Replace high-wear hydraulic seals on Injection Molding Unit 2", priority: "Medium", dueDate: "Next Week", owner: "Plant Maintenance", status: "Open" },
    ],
  },

  "quality-management": {
    id: "quality-management",
    moduleName: "Quality Management",
    areaGroup: "Management",
    overviewRoute: "/management/quality-management/overview",
    executiveBrief: "Quality performance maintains zero severe non-conformances across production facilities. Outgoing defect rate achieved 12 PPM (parts per million). First Pass Yield across all lines sits at 98.4% with 100% resolution of high-priority CAPAs within SLA.",
    kpis: [
      { label: "First Pass Yield", value: "98.4%", change: "+0.8%", isPositive: true, subtext: "Target: 98.0%" },
      { label: "Outgoing Defect PPM", value: "12 PPM", change: "-4 PPM", isPositive: true, subtext: "Automotive benchmark: 20" },
      { label: "Open NCRs", value: "8", change: "-5", isPositive: true, subtext: "Zero critical open" },
      { label: "CAPA Closure Rate", value: "95.6%", change: "+2.1%", isPositive: true, subtext: "30-day resolution" },
    ],
    trendTitle: "Plant Yield & Non-Conformance Reduction Trajectory",
    trendMetricLabel: "Inspection Pass Rate (%)",
    trendData: [
      { period: "Jan", actual: 96.8, target: 96.0, throughput: 18 },
      { period: "Feb", actual: 97.2, target: 96.5, throughput: 16 },
      { period: "Mar", actual: 97.6, target: 97.0, throughput: 14 },
      { period: "Apr", actual: 98.0, target: 97.5, throughput: 11 },
      { period: "May", actual: 98.2, target: 98.0, throughput: 9 },
      { period: "Jun", actual: 98.4, target: 98.0, throughput: 8 },
    ],
    statusDistribution: [
      { name: "Approved / Passed", value: 78, color: "#10b981" },
      { name: "Under Inspection", value: 14, color: "#3b82f6" },
      { name: "NCR / Quarantine", value: 5, color: "#f59e0b" },
      { name: "Rejected", value: 3, color: "#ef4444" },
    ],
    submodules: [
      { name: "Quality Planning", path: "/management/quality-management/quality-planning", recordsCount: 34, completionRate: 96, status: "Completed", keyMetric: "ISO 9001 / IATF", owner: "Quality Director", lastUpdated: "Today" },
      { name: "Incoming Inspection", path: "/management/quality-management/incoming-inspection", recordsCount: 680, completionRate: 98, status: "Completed", keyMetric: "0.2% Supplier Rejection", owner: "IQC Team", lastUpdated: "Today" },
      { name: "In-Process Inspection", path: "/management/quality-management/in-process-inspection", recordsCount: 1420, completionRate: 97, status: "Completed", keyMetric: "SPC Cpk > 1.67", owner: "IPQC Leads", lastUpdated: "Today" },
      { name: "Final Inspection", path: "/management/quality-management/final-inspection", recordsCount: 920, completionRate: 99, status: "Completed", keyMetric: "99.8% FQC Pass", owner: "FQC Team", lastUpdated: "Today" },
      { name: "NCR Management", path: "/management/quality-management/ncr-management", recordsCount: 8, completionRate: 88, status: "Needs Attention", keyMetric: "8 Open NCRs", owner: "Quality Eng", lastUpdated: "Yesterday" },
      { name: "CAPA Management", path: "/management/quality-management/capa", recordsCount: 22, completionRate: 95, status: "Completed", keyMetric: "95.6% Closed", owner: "CAPA Board", lastUpdated: "Today" },
      { name: "Root Cause Analysis", path: "/management/quality-management/root-cause-analysis", recordsCount: 18, completionRate: 94, status: "Completed", keyMetric: "8D & 5-Why", owner: "RCA Desk", lastUpdated: "2 days ago" },
      { name: "Audit Management", path: "/management/quality-management/audit-management", recordsCount: 16, completionRate: 97, status: "Completed", keyMetric: "IATF 16949 Ready", owner: "Audit Team", lastUpdated: "3 days ago" },
      { name: "Compliance", path: "/management/quality-management/compliance", recordsCount: 12, completionRate: 98, status: "Completed", keyMetric: "RoHS / REACH Compliant", owner: "Regulatory", lastUpdated: "1 week ago" },
    ],
    actionItems: [
      { id: "ACT-QLT-01", title: "Verify 8D corrective action implementation for supplier casting porosity", priority: "High", dueDate: "Tomorrow", owner: "Quality Eng", status: "In Progress" },
      { id: "ACT-QLT-02", title: "Conduct quarterly internal audit for Assembly Line #2", priority: "Medium", dueDate: "Next Week", owner: "Audit Team", status: "Open" },
    ],
  },
};

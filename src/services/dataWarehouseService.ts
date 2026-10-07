// Magnertia ERP - Data Warehouse Development Domain Service
// Enterprise Data Platform Architecture, Pipeline Telemetry, and Modeling Master

export interface DataWarehouseKpi {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
}

export interface DataWarehouseMilestone {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "Completed" | "In Progress" | "Pending";
}

export interface DataWarehousePipeline {
  id: string;
  name: string;
  source: string;
  target: string;
  schedule: string;
  lastRun: string;
  status: "Success" | "Running" | "Failed";
  recordsProcessed: string;
  duration: string;
}

export interface DataWarehouseSource {
  id: number;
  sourceSystem: string;
  volume: string;
  growth: string;
  status: "Active" | "Maintenance";
  criticality: "High" | "Medium" | "Critical";
}

export const DW_KPIS: DataWarehouseKpi[] = [
  {
    id: "dw-src",
    label: "Source Systems",
    value: "14",
    change: "↑ 17%",
    isPositive: true,
    subtext: "vs. last quarter",
    iconName: "Database",
  },
  {
    id: "dw-pipe",
    label: "Data Pipelines",
    value: "28",
    change: "↑ 21%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "GitMerge",
  },
  {
    id: "dw-vol",
    label: "Total Data Volume",
    value: "12.6 TB",
    change: "↑ 32%",
    isPositive: true,
    subtext: "vs. last quarter",
    iconName: "HardDrive",
  },
  {
    id: "dw-qual",
    label: "Data Quality Score",
    value: "96.2%",
    change: "↑ 4.8%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "ShieldCheck",
  },
  {
    id: "dw-perf",
    label: "Avg Query Performance",
    value: "1.8 sec",
    change: "↓ 18%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "Zap",
  },
  {
    id: "dw-users",
    label: "BI Users",
    value: "156",
    change: "↑ 12%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "Users",
  },
  {
    id: "dw-dash",
    label: "Reports/Dashboards",
    value: "24",
    change: "↑ 26%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "BarChart",
  },
];

export const DW_MILESTONES: DataWarehouseMilestone[] = [
  {
    id: 1,
    name: "Requirements & Assessment",
    startDate: "01 Aug 2026",
    endDate: "15 Aug 2026",
    status: "Completed",
  },
  {
    id: 2,
    name: "Data Architecture Design",
    startDate: "16 Aug 2026",
    endDate: "31 Aug 2026",
    status: "Completed",
  },
  {
    id: 3,
    name: "Data Model Development",
    startDate: "01 Sep 2026",
    endDate: "30 Sep 2026",
    status: "In Progress",
  },
  {
    id: 4,
    name: "ETL/ELT Development",
    startDate: "01 Oct 2026",
    endDate: "31 Oct 2026",
    status: "Pending",
  },
  {
    id: 5,
    name: "Testing & UAT",
    startDate: "01 Nov 2026",
    endDate: "30 Nov 2026",
    status: "Pending",
  },
  {
    id: 6,
    name: "Deployment & Go-Live",
    startDate: "01 Dec 2026",
    endDate: "15 Dec 2026",
    status: "Pending",
  },
];

export const DW_RECENT_PIPELINES: DataWarehousePipeline[] = [
  {
    id: "PIPE-01",
    name: "ERP_Sales_Incremental",
    source: "ERP -> DW (Sales)",
    schedule: "Daily",
    lastRun: "30 Sep 2026 02:15",
    status: "Success",
    recordsProcessed: "142,500",
    duration: "4m 12s",
  },
  {
    id: "PIPE-02",
    name: "CRM_Customer_Full",
    source: "CRM -> DW (Customer)",
    schedule: "Daily",
    lastRun: "30 Sep 2026 01:30",
    status: "Success",
    recordsProcessed: "48,200",
    duration: "2m 45s",
  },
  {
    id: "PIPE-03",
    name: "SCM_Inventory_CDC",
    source: "SCM -> DW (Inventory)",
    schedule: "Hourly",
    lastRun: "30 Sep 2026 02:50",
    status: "Running",
    recordsProcessed: "12,900",
    duration: "1m 15s",
  },
  {
    id: "PIPE-04",
    name: "MES_Production",
    source: "MES -> DW (Production)",
    schedule: "Hourly",
    lastRun: "30 Sep 2026 01:45",
    status: "Success",
    recordsProcessed: "88,400",
    duration: "3m 20s",
  },
  {
    id: "PIPE-05",
    name: "IoT_Charging_Data",
    source: "IoT -> DW (Charging)",
    schedule: "Real-time",
    lastRun: "30 Sep 2026 02:58",
    status: "Running",
    recordsProcessed: "1,240,000",
    duration: "Ongoing",
  },
];

export const DW_TOP_SOURCES: DataWarehouseSource[] = [
  { id: 1, sourceSystem: "ERP", volume: "4.6 TB", growth: "↑ 28%", status: "Active", criticality: "Critical" },
  { id: 2, sourceSystem: "IoT / EVSE", volume: "2.8 TB", growth: "↑ 45%", status: "Active", criticality: "Critical" },
  { id: 3, sourceSystem: "CRM", volume: "1.6 TB", growth: "↑ 22%", status: "Active", criticality: "High" },
  { id: 4, sourceSystem: "SCM", volume: "1.2 TB", growth: "↑ 18%", status: "Active", criticality: "High" },
  { id: 5, sourceSystem: "Finance", volume: "0.9 TB", growth: "↑ 12%", status: "Active", criticality: "Critical" },
];

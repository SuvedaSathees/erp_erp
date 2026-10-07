// Magnertia ERP - Data Visualization Domain Service
// Interactive Chart Configuration, Dataset Dimensions, and Dashboard Catalog

export interface VisualizationKpi {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
}

export interface VisualizationCatalogItem {
  id: number;
  name: string;
  type: string;
  dataset: string;
  lastModified: string;
  status: "Published" | "Draft" | "Review";
  views: number;
}

export const DV_KPIS: VisualizationKpi[] = [
  {
    id: "dv-vis",
    label: "Visualizations",
    value: "86",
    change: "↑ 18%",
    isPositive: true,
    subtext: "vs. last month",
    iconName: "BarChart2",
  },
  {
    id: "dv-dash",
    label: "Dashboards",
    value: "24",
    change: "↑ 20%",
    isPositive: true,
    subtext: "active templates",
    iconName: "Layout",
  },
  {
    id: "dv-data",
    label: "Datasets",
    value: "16",
    change: "↑ 7%",
    isPositive: true,
    subtext: "certified schemas",
    iconName: "Database",
  },
  {
    id: "dv-shared",
    label: "Shared Items",
    value: "12",
    change: "↑ 50%",
    isPositive: true,
    subtext: "external portals",
    iconName: "Share2",
  },
  {
    id: "dv-rev",
    label: "Pending Reviews",
    value: "8",
    change: "↓ 20%",
    isPositive: true,
    subtext: "governance gate",
    iconName: "Clock",
  },
  {
    id: "dv-views",
    label: "Total Views",
    value: "1.2K",
    change: "↑ 35%",
    isPositive: true,
    subtext: "this month",
    iconName: "Eye",
  },
];

export const DV_CATALOG_ITEMS: VisualizationCatalogItem[] = [
  {
    id: 1,
    name: "EV Charging Overview",
    type: "Dashboard",
    dataset: "EV Charging",
    lastModified: "28 Sep 2026",
    status: "Published",
    views: 450,
  },
  {
    id: 2,
    name: "Revenue Analysis",
    type: "Bar Chart",
    dataset: "Financial",
    lastModified: "27 Sep 2026",
    status: "Published",
    views: 310,
  },
  {
    id: 3,
    name: "Energy Consumption",
    type: "Line Chart",
    dataset: "EV Charging",
    lastModified: "26 Sep 2026",
    status: "Published",
    views: 280,
  },
  {
    id: 4,
    name: "Station Utilization",
    type: "Heatmap",
    dataset: "EV Charging",
    lastModified: "25 Sep 2026",
    status: "Draft",
    views: 95,
  },
  {
    id: 5,
    name: "Customer Segmentation",
    type: "Pie Chart",
    dataset: "CRM",
    lastModified: "24 Sep 2026",
    status: "Published",
    views: 190,
  },
  {
    id: 6,
    name: "Regional Performance",
    type: "Map",
    dataset: "EV Charging",
    lastModified: "23 Sep 2026",
    status: "Published",
    views: 220,
  },
];

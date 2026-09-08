export interface QualityAnalyticsFilters {
  dateFrom: string;
  dateTo: string;
  plant: string;
  department: string;
  process: string;
  product: string;
  productFamily: string;
  supplier: string;
  customer: string;
  machine: string;
  shift: string;
  qualityCategory: string;
  defectCategory: string;
}

export interface ExecutiveKpiItem {
  id: string;
  label: string;
  value: string;
  target: string;
  trend: string;
  trendDirection: "up" | "down";
  trendColor: "green" | "red" | "blue";
  status: "warning" | "success" | "critical";
  iconName: string;
  color: string;
}

export interface DefectTrendMonth {
  month: string;
  defectRate: number;
  target: number;
}

export interface DefectParetoItem {
  rank: number;
  defect: string;
  count: number;
  percentage: number;
  cumulativePercentage: number;
}

export interface ProcessPerformanceItem {
  process: string;
  fpy: number;
  defectRate: number;
  rework: number;
  scrap?: number;
  qualityScore: number;
}

export interface SupplierQualityItem {
  supplier: string;
  lots: number;
  defects: number;
  ppm: number;
  rejectionPercent: number;
  qualityScore: number;
  status: "High" | "Medium" | "Low";
}

export interface AiQualityInsightItem {
  id: string;
  category: "alert" | "warning" | "success" | "root-cause" | "recommendation";
  text: string;
  severity: "critical" | "high" | "medium" | "low" | "positive";
}

export interface SpcParameterItem {
  parameter: string;
  mean: number;
  ucl: number;
  lcl: number;
  cp: number;
  cpk: number;
  status: "Stable" | "Warning" | "Out of Control";
  history: number[];
}

export interface CopqComponentItem {
  category: string;
  element?: string;
  amount: number;
  percentage: number;
  classification: "Internal Failure" | "External Failure" | "Appraisal" | "Prevention";
}

export interface QualityActionItem {
  id: string;
  action: string;
  source: string;
  owner: string;
  department: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low" | "Critical";
  status: "In Progress" | "Open" | "Planned" | "Completed";
}

export interface QualityAnalyticsDataset {
  filters: QualityAnalyticsFilters;
  executiveKpis: ExecutiveKpiItem[];
  defectTrend6Months: DefectTrendMonth[];
  defectPareto: DefectParetoItem[];
  processPerformance: ProcessPerformanceItem[];
  supplierQuality: SupplierQualityItem[];
  aiInsights: AiQualityInsightItem[];
  spcParameters: SpcParameterItem[];
  copqComponents: CopqComponentItem[];
  actionTracker: QualityActionItem[];
}

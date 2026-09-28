import { queryOptions } from "@tanstack/react-query";
import {
  enterpriseRiskService,
  type EnterpriseRiskRecord,
  type KRIItem,
  type RiskActionItem,
  type ReportDefinition,
} from "@/services/enterpriseRiskService";

export type RiskOverviewData = {
  totalRisks: number;
  totalRisksDelta: string;
  criticalRisks: number;
  criticalRisksDelta: string;
  highRisks: number;
  highRisksDelta: string;
  mediumRisks: number;
  mediumRisksDelta: string;
  lowRisks: number;
  lowRisksDelta: string;
  overdueActions: number;
  overdueActionsDelta: string;
  residualExposure: string;
  krisInRed: number;
  primaryRisk: EnterpriseRiskRecord;
  topRisks: EnterpriseRiskRecord[];
  allRisks: EnterpriseRiskRecord[];
  kris: KRIItem[];
  actions: RiskActionItem[];
  categoryDistribution: Array<{ name: string; percentage: number; count: number; color: string }>;
  trendData: Array<{ month: string; totalRisks: number; highCritical: number; medium: number; low: number }>;
  aiInsights: Array<{ id: number; text: string; tone: string }>;
};

export const MOCK_RISK_OVERVIEW: RiskOverviewData = {
  totalRisks: enterpriseRiskService.getOverviewKpis().totalRisks.value,
  totalRisksDelta: enterpriseRiskService.getOverviewKpis().totalRisks.delta,
  criticalRisks: enterpriseRiskService.getOverviewKpis().criticalRisks.value,
  criticalRisksDelta: enterpriseRiskService.getOverviewKpis().criticalRisks.delta,
  highRisks: enterpriseRiskService.getOverviewKpis().highRisks.value,
  highRisksDelta: enterpriseRiskService.getOverviewKpis().highRisks.delta,
  mediumRisks: enterpriseRiskService.getOverviewKpis().mediumRisks.value,
  mediumRisksDelta: enterpriseRiskService.getOverviewKpis().mediumRisks.delta,
  lowRisks: enterpriseRiskService.getOverviewKpis().lowRisks.value,
  lowRisksDelta: enterpriseRiskService.getOverviewKpis().lowRisks.delta,
  overdueActions: enterpriseRiskService.getOverviewKpis().overdueActions.value,
  overdueActionsDelta: enterpriseRiskService.getOverviewKpis().overdueActions.delta,
  residualExposure: enterpriseRiskService.getOverviewKpis().residualExposure.value,
  krisInRed: enterpriseRiskService.getOverviewKpis().krisInRed.value,
  primaryRisk: enterpriseRiskService.getPrimaryRisk(),
  topRisks: enterpriseRiskService.getTopRisks(),
  allRisks: enterpriseRiskService.getAllRisks(),
  kris: enterpriseRiskService.getKRIs(),
  actions: enterpriseRiskService.getActions(),
  categoryDistribution: enterpriseRiskService.getCategoryDistribution(),
  trendData: enterpriseRiskService.getTrendData(),
  aiInsights: enterpriseRiskService.getAiInsights(),
};

export const riskOverviewOptions = queryOptions({
  queryKey: ["risk-management", "overview"],
  queryFn: async (): Promise<RiskOverviewData> => {
    return MOCK_RISK_OVERVIEW;
  },
  staleTime: 1000 * 60 * 5,
});

export type RiskReportData = {
  reports: Array<{ id: string; name: string; category: string; description: string }>;
  summary: {
    totalReports: number;
    lastGenerated: string;
    criticalFindings: number;
    auditCompliancePct: number;
  };
};

export const riskReportOptions = queryOptions({
  queryKey: ["risk-management", "reports"],
  queryFn: async (): Promise<RiskReportData> => {
    return {
      reports: enterpriseRiskService.getReports(),
      summary: {
        totalReports: 25,
        lastGenerated: "Today at 09:30 AM",
        criticalFindings: 6,
        auditCompliancePct: 94.2,
      },
    };
  },
  staleTime: 1000 * 60 * 5,
});

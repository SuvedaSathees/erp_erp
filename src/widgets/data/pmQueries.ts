import { queryOptions } from "@tanstack/react-query";

export type PmOverviewData = {
  totalProjects: number;
  onSchedule: number;
  onSchedulePct: number;
  atRisk: number;
  atRiskPct: number;
  delayed: number;
  delayedPct: number;
  budgetUtilizationPct: number;
  budgetSpentFormatted: string;
  totalBudgetFormatted: string;
  resourcesAllocated: number;
  activeProjects: number;
  plannedProjects: number;
  completedProjects: number;
  criticalPathDays: number;
  scheduleFloatDays: number;
  overallReadinessPct: number;
  executionStatus: Array<{ phase: string; percent: number }>;
  departmentUtilization: Array<{ department: string; utilization: number }>;
  wbsTopBudgets: Array<{ name: string; code: string; budget: string; value: number }>;
  risks: Array<{ id: string; risk: string; probability: string; impact: string; score: number; status: string }>;
  milestones: Array<{ name: string; plannedDate: string; status: "Completed" | "In Progress" | "Planned" }>;
  aiInsights: string[];
};

export const MOCK_PM_OVERVIEW: PmOverviewData = {
  totalProjects: 48,
  onSchedule: 36,
  onSchedulePct: 75.0,
  atRisk: 8,
  atRiskPct: 16.7,
  delayed: 4,
  delayedPct: 8.3,
  budgetUtilizationPct: 42.6,
  budgetSpentFormatted: "₹ 71.11 L",
  totalBudgetFormatted: "₹ 1.67 Cr",
  resourcesAllocated: 24,
  activeProjects: 32,
  plannedProjects: 48,
  completedProjects: 12,
  criticalPathDays: 42,
  scheduleFloatDays: 6,
  overallReadinessPct: 80.0,
  executionStatus: [
    { phase: "Requirements", percent: 100 },
    { phase: "Design", percent: 82 },
    { phase: "Procurement", percent: 68 },
    { phase: "Production", percent: 54 },
    { phase: "Installation", percent: 32 },
    { phase: "Commissioning", percent: 18 },
  ],
  departmentUtilization: [
    { department: "Engineering", utilization: 85 },
    { department: "Production", utilization: 82 },
    { department: "Procurement", utilization: 61 },
    { department: "Quality", utilization: 72 },
    { department: "Installation", utilization: 94 },
    { department: "Project Mgmt", utilization: 65 },
  ],
  wbsTopBudgets: [
    { code: "3.0", name: "Procurement", budget: "₹ 0.85 Cr", value: 85 },
    { code: "4.0", name: "Production", budget: "₹ 0.32 Cr", value: 32 },
    { code: "2.0", name: "Engineering", budget: "₹ 0.18 Cr", value: 18 },
    { code: "5.0", name: "Installation", budget: "₹ 0.18 Cr", value: 18 },
    { code: "1.0", name: "Project Management", budget: "₹ 0.12 Cr", value: 12 },
  ],
  risks: [
    { id: "R-001", risk: "Material Delay", probability: "High", impact: "High", score: 9, status: "Mitigate" },
    { id: "R-002", risk: "Design Change", probability: "Medium", impact: "High", score: 6, status: "Control" },
    { id: "R-003", risk: "Machine Breakdown", probability: "Medium", impact: "High", score: 6, status: "Mitigate" },
    { id: "R-004", risk: "Resource Shortage", probability: "Medium", impact: "Medium", score: 4, status: "Transfer" },
    { id: "R-005", risk: "Quality Rejection", probability: "Low", impact: "High", score: 3, status: "Prevent" },
  ],
  milestones: [
    { name: "Project Kickoff", plannedDate: "01 Sep 2026", status: "Completed" },
    { name: "Requirements Freeze", plannedDate: "07 Sep 2026", status: "Completed" },
    { name: "Design Freeze", plannedDate: "20 Sep 2026", status: "In Progress" },
    { name: "Procurement Complete", plannedDate: "25 Sep 2026", status: "Planned" },
    { name: "Production Complete", plannedDate: "15 Oct 2026", status: "Planned" },
    { name: "FAT Complete", plannedDate: "20 Oct 2026", status: "Planned" },
    { name: "Installation Complete", plannedDate: "30 Oct 2026", status: "Planned" },
    { name: "Commissioning", plannedDate: "05 Nov 2026", status: "Planned" },
    { name: "Customer Acceptance", plannedDate: "10 Nov 2026", status: "Planned" },
  ],
  aiInsights: [
    "Controller procurement is on critical path. Expedite vendor confirmation.",
    "Electrical engineer resource is overloaded in next 3 weeks. Add 1 more resource to avoid delay.",
    "Manufacturing capacity will be at 92% in Oct. Plan overtime or additional shift if needed.",
    "Current plan has 6 days total float. Maintain activity discipline.",
  ],
};

export const pmOverviewOptions = queryOptions({
  queryKey: ["pmOverview"],
  queryFn: async (): Promise<PmOverviewData> => {
    return MOCK_PM_OVERVIEW;
  },
  staleTime: 1000 * 60 * 5,
});

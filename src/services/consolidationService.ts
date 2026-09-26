import { apiRequest } from "./apiClient";
import type {
  ConsolidationRecord,
  IntercompanyTransaction,
  ConsolidationTimelineMilestone,
  AccountMappingRecord,
  EntityValidationResult,
  DashboardQuery,
} from "./types";

const consolidationOverview: ConsolidationRecord[] = [
  { code: "GP-001", name: "Magnertia Group (Parent)", revenue: 48753920, expenses: 39652510, operatingProfit: 9101410, netProfit: 7856410, netMargin: 16.11, status: "Consolidated" as const },
  { code: "SUB-001", name: "Magnertia Technologies Inc.", revenue: 18245630, expenses: 14852300, operatingProfit: 3393330, netProfit: 2945210, netMargin: 16.12, status: "Included" as const },
  { code: "SUB-002", name: "Magnertia Solutions LLC", revenue: 12876450, expenses: 10289760, operatingProfit: 2586690, netProfit: 2118340, netMargin: 16.48, status: "Included" as const },
  { code: "SUB-003", name: "Magnertia Europe GmbH", revenue: 8765210, expenses: 7112340, operatingProfit: 1652870, netProfit: 1248300, netMargin: 14.25, status: "Included" as const },
  { code: "SUB-004", name: "Magnertia India Pvt. Ltd.", revenue: 5432670, expenses: 4168950, operatingProfit: 1263720, netProfit: 1034210, netMargin: 19.04, status: "Included" as const },
  { code: "SUB-005", name: "Magnertia Canada Inc.", revenue: 2156780, expenses: 1789560, operatingProfit: 367220, netProfit: 289750, netMargin: 13.44, status: "Included" as const },
  { code: "ELIM-001", name: "- Elimination Adjustments", revenue: -1245780, expenses: -1245780, operatingProfit: 0, netProfit: -1245780, netMargin: null as any, status: "Eliminated" as const, isEliminationAdjustment: true },
];

const intercompanyTxns: IntercompanyTransaction[] = [
  { fromEntity: "Magnertia Technologies Inc.", toEntity: "Magnertia Solutions LLC", amount: 425630, matched: true, ref: "IC-TRX-101", date: "2025-05-18" },
  { fromEntity: "Magnertia Europe GmbH", toEntity: "Magnertia India Pvt. Ltd.", amount: 318750, matched: true, ref: "IC-TRX-102", date: "2025-05-17" },
  { fromEntity: "Magnertia Solutions LLC", toEntity: "Magnertia Canada Inc.", amount: 287940, matched: true, ref: "IC-TRX-103", date: "2025-05-15" },
  { fromEntity: "Magnertia India Pvt. Ltd.", toEntity: "Magnertia Technologies Inc.", amount: 213450, matched: true, ref: "IC-TRX-104", date: "2025-05-12" },
  { fromEntity: "Magnertia Canada Inc.", toEntity: "Magnertia Europe GmbH", amount: 147000, matched: true, ref: "IC-TRX-105", date: "2025-05-10" },
];

const timeline: ConsolidationTimelineMilestone[] = [
  { name: "Data Collection", date: "Apr 1, 2025", status: "Completed" as const },
  { name: "Intercompany Matching", date: "Apr 8, 2025", status: "Completed" as const },
  { name: "Elimination Entries", date: "Apr 10, 2025", status: "Completed" as const },
  { name: "Consolidation", date: "Apr 12, 2025", status: "Completed" as const },
];

const validations: EntityValidationResult[] = [
  { id: "VAL-001", checkName: "Entity Ledger Balance Matching", status: "Passed" as const, message: "All 12 entity trial balances successfully matched." },
  { id: "VAL-002", checkName: "Intercompany Matching Difference Check", status: "Passed" as const, message: "Out-of-balance difference is exactly ₹0 (fully matched)." },
  { id: "VAL-003", checkName: "Fiscal Period Configuration Check", status: "Passed" as const, message: "All entities mapped to standard fiscal year (Apr 1 - Mar 31)." },
  { id: "VAL-004", checkName: "Foreign Exchange Rates Mapping Check", status: "Passed" as const, message: "Exchange rates for 5 currencies applied correctly." },
];

let accountMappings: AccountMappingRecord[] = [
  { id: "MAP-001", sourceAccount: "1100 - Accounts Receivable (Sub)", targetAccount: "1105 - Consolidated Accounts Receivable", entity: "Technologies Inc." },
  { id: "MAP-002", sourceAccount: "2100 - Accounts Payable (Sub)", targetAccount: "2105 - Consolidated Accounts Payable", entity: "Solutions LLC" },
  { id: "MAP-003", sourceAccount: "4100 - Direct Sales Revenue", targetAccount: "4000 - Consolidated Revenue", entity: "Europe GmbH" },
];

export function fetchConsolidationSummary(query: DashboardQuery): Promise<ConsolidationRecord[]> {
  return apiRequest(`/api/financial/consolidation/summary?fy=${query.fiscalYear}`, () => consolidationOverview);
}

export function fetchIntercompanyTransactions(query: DashboardQuery): Promise<IntercompanyTransaction[]> {
  return apiRequest(`/api/financial/consolidation/intercompany?fy=${query.fiscalYear}`, () => intercompanyTxns);
}

export function fetchTimelineMilestones(query: DashboardQuery): Promise<ConsolidationTimelineMilestone[]> {
  return apiRequest(`/api/financial/consolidation/timeline?fy=${query.fiscalYear}`, () => timeline);
}

export function runConsolidation(query: DashboardQuery): Promise<{ success: boolean; log: string[] }> {
  return apiRequest(`/api/financial/consolidation/run?fy=${query.fiscalYear}`, () => ({
    success: true,
    log: [
      "Data collection completed for 12 entities.",
      "Currency translation calculations executed cleanly.",
      "Intercompany transactions matched (Variance: ₹0).",
      "Elimination journal entries posted (Total: 156 entries).",
      "Consolidation process completed successfully.",
    ],
  }));
}

export function validateEntityData(query: DashboardQuery): Promise<EntityValidationResult[]> {
  return apiRequest(`/api/financial/consolidation/validate?fy=${query.fiscalYear}`, () => validations);
}

export function updateAccountMapping(
  mappings: AccountMappingRecord[],
): Promise<{ success: boolean; updatedCount: number }> {
  return apiRequest(`/api/financial/consolidation/mappings`, () => {
    accountMappings = [...mappings];
    return { success: true, updatedCount: mappings.length };
  });
}

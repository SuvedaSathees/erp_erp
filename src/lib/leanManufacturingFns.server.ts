import { createServerFn } from "@tanstack/react-start";
import type { LeanManufacturing } from "@/lib/lean-manufacturing/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "lean-manufacturing";

export const MOCK_LEAN_RECORD_123: LeanManufacturing = {
  id: "LEAN-2024-00123",
  formCode: "LMRF-2024-25",
  leanProjectTitle: "Reduce Changeover Time in Assembly Line",
  leanProjectNumber: "LM-ENCL-LN02-001",
  version: "1.0",
  workflowStatus: "In Progress" as any,
  plant: "Plant-01",
  productionLine: "Assembly Line-02",
  department: "Production",
  processOwner: "Vikram Singh",
  projectPriority: "High",
  projectStatus: "Implementation",
  timelineStart: "2024-05-01",
  timelineEnd: "2024-06-30",
  createdBy: "Rahul Sharma",
  createdDate: "10 Jun 2024",
  lastModifiedBy: "Rahul Sharma",
  lastUpdated: "17 Jun 2024",
  improvementCategory: "Productivity Improvement",
  leanMethodologies: ["Kaizen", "5S", "SMED", "Kanban", "Standard Work", "Poka-Yoke"],
  improvementObjective: "Reduce changeover time from 120 min to 45 min and improve OEE.",
  currentStateSummary: "High setup time, excess motion, waiting and inventory.",
  targetState: "Streamlined setup, standard work, pull system with Kanban.",
  wastes: {
    overproduction: { checked: true, severity: "High" },
    waiting: { checked: true, severity: "High" },
    transportation: { checked: true, severity: "Medium" },
    overprocessing: { checked: false, severity: "Low" },
    inventory: { checked: true, severity: "Medium" },
    motion: { checked: true, severity: "High" },
    defects: { checked: true, severity: "Medium" },
    underutilizedTalent: { checked: false, severity: "Low" },
  },
  wasteSeverityScore: 72,
  currentCycleTimeSec: 320.0,
  taktTimeSec: 240.0,
  leadTimeHr: 8.2,
  changeoverTimeMin: 120.0,
  bottleneckProcess: "Setup Station-02",
  valueAddedRatio: 38.5,
  processEfficiencyScore: 78,
  actionPlan: [
    { id: "act-01", activity: "Reduce Cycle Time", leanTool: "SMED", owner: "Vikram Singh", status: "In Progress", dueDate: "20 May 2024" },
    { id: "act-02", activity: "5S Workplace", leanTool: "5S", owner: "Neha Reddy", status: "Completed", dueDate: "10 May 2024" },
  ],
  expectedCostSaving: 1245000,
  realizedCostSaving: 980000,
  totalActivities: 5,
  performanceMetrics: [
    { id: "m-01", metric: "OEE (%)", before: 68.2, after: 82.4, polarity: "higher_is_better", improvementPct: 20.82 },
    { id: "m-02", metric: "FPY (%)", before: 89.1, after: 95.3, polarity: "higher_is_better", improvementPct: 6.2 },
  ],
  operationalScore: 82,
  kaizenActivities: [
    { id: "k-01", name: "Kaizen Event", status: "Completed" },
    { id: "k-02", name: "5S Audit Completed", status: "Completed" },
  ],
  continuousImprovementScore: 85,
  aiWasteDetection: "High waste due to waiting and setup.",
  aiBottleneckAnalysis: "Setup Station-02 is the bottleneck.",
  aiProductivityForecast: "Expected productivity up by 18%.",
  aiProcessOptimization: "Recommend SMED + Kanban sync.",
  aiCostReductionSuggestions: "Potential saving of ₹12.45 Lakhs.",
  aiLeanHealthScore: 88,
  overallLeanReadiness: 81,
  recommendation: "Scale Across Lines",
  recommendationSuggestion: "Scale Across Lines",
  currentStateSnapshot: {
    mes: { oee: 68.2, cycleTime: 320, downtime: 15.4, productionLosses: "Setup delays at Station-02" },
    qms: { fpy: 89.1, defectRate: 2.1, scrapRate: 3.2 },
    inventory: { wipInventory: "1,200 units", materialFlow: "Batch push system" },
    supplyChain: { leadTime: 8.2, supplierPerformance: 92.5 },
    snapshotAt: "10 Jun 2024 09:20 AM",
  },
  standardWorkReleaseActions: {
    releaseStandardWork: null,
    deployNewStandards: null,
    initiateContinuousImprovement: null,
  },
  continuousImprovementActive: false,
  approvalDecision: "Approved",
  reviewers: [
    { role: "Lean Champion", reviewer: "Vikram Singh", status: "Approved", comments: "Kaizen event & SMED completed." },
    { role: "Plant Head", reviewer: "Sankaran R.", status: "Pending" },
  ],
  reviewComments: "Project targets achieved. Ready for standard work release.",
  approvalDate: "17 Jun 2024",
  attachments: [
    { id: "att-lm-01", filename: "Value Stream Map.pdf", source: "auto:vsm", uploadedAt: "17 Jun 2024", fileSize: "4.1 MB", moduleName: "VSM" },
  ],
  auditTrail: [
    { id: "at-lm-01", timestamp: "10 Jun 2024 09:20 AM", user: "Rahul Sharma", action: "Record Created", description: "Created Lean Manufacturing record LEAN-2024-00123." },
  ],
} as any;

export const getLeanManufacturingFn = createServerFn({ method: "GET" })
  .validator((data?: { id?: string }) => data)
  .handler(async () => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result };
    return { success: true, data: MOCK_LEAN_RECORD_123 };
  });

export const listLeanManufacturingFn = createServerFn({ method: "GET" }).handler(async () => {
  const results = await listDevelopmentRecordsFn({ data: { moduleType: MODULE_TYPE } });
  if (results && results.length > 0) return { success: true, data: results };
  return { success: true, data: [MOCK_LEAN_RECORD_123] };
});

export const saveLeanManufacturingFn = createServerFn({ method: "POST" })
  .validator((data: { record: LeanManufacturing }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.record,
      projectName: data.record.leanProjectTitle ?? (data.record as any).projectName ?? "",
      ownerName: data.record.processOwner ?? (data.record as any).ownerName ?? "",
      recordCode: data.record.id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

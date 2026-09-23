import { createServerFn } from "@tanstack/react-start";
import type { AssemblyLineRecord } from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "assembly-line-development";

export function calculateAssemblyLineScores(record: Partial<AssemblyLineRecord>) {
  const layoutScore = record.layoutDesignScore ?? 88;
  const workstationScore = record.workstationReadinessScore ?? 86;
  const validationScore = record.validationScore ?? 85;
  const automationScore = record.automationScore ?? 87;
  const performanceScore = record.performanceScore ?? 86;
  const aiScore = record.aiReadinessScore ?? 88;

  const overallScore = Math.round(
    layoutScore * 0.25 +
      workstationScore * 0.15 +
      validationScore * 0.20 +
      automationScore * 0.20 +
      performanceScore * 0.20
  );

  return {
    layoutDesignScore: layoutScore,
    workstationReadinessScore: workstationScore,
    validationScore,
    automationScore,
    performanceScore,
    aiReadinessScore: aiScore,
    overallAssemblyReadiness: overallScore,
  };
}

export const DEFAULT_ASSEMBLY_LINE_RECORD: AssemblyLineRecord = {
  id: "proc-asm-rec-0045",
  assemblyLineId: "ALD-2024-0045",
  formCode: "ALDF-2024-25",
  projectName: "Smart EV Charger Assembly Line",
  assemblyLineVersion: "v1.2.0",
  workflowStatus: "In Progress",
  stage: 3,
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  linkedProduct: { id: "PRD-EV-7KW", name: "Smart EV Charger AC 7kW" },
  linkedProductionEngineering: { id: "proc-eng-rec-0056", code: "PE-2024-0038" },
  assemblyLineEngineer: { name: "Rahul Sharma", avatar: "", email: "rahul.sharma@magnertia.com" },
  manufacturingPlant: "Magnertia Plant - 01",
  productionLine: "EV Charger Assembly Line - A",
  nextReviewDate: "25 Jun 2024",
  productFamily: "EV Chargers",
  assemblyLineType: "Semi-Automated",
  productionObjective: "To assemble EV chargers with high quality and zero-defect delivery.",
  developmentStage: "Line Balancing",
  priority: "High",
  layoutDesignScore: 88,
  workstationReadinessScore: 86,
  validationScore: 85,
  automationScore: 87,
  performanceScore: 86,
  aiReadinessScore: 88,
  overallAssemblyReadiness: 87,
  recommendation: "Approve Line for Production",
  factoryLayout: "factory_layout.pdf",
  assemblyLineLayout: "line_layout.pdf",
  workstationLayoutFile: "workstation_layout.pdf",
  materialFlowDiagram: "material_flow.pdf",
  lineConfiguration: "U-Shaped Line",
  numberOfWorkstations: 12,
  workstationList: "workstation_list.pdf",
  workInstructions: "swi_ev_charger.pdf",
  cycleTimePerStation: 82,
  operatorRequirement: 18,
  machineAllocation: ["Screwdriver Station", "Test Station", "Soldering Station"],
  ergonomicAssessment: "ergonomics_report.pdf",
  taktTime: 90,
  lineBalancingCompleted: true,
  bottleneckAnalysis: "bottleneck_analysis.pdf",
  pilotLineRun: true,
  throughputValidation: true,
  validationRemarks: "Pilot run successful. Throughput achieved 261 units/day.",
  validationChecklist: [
    { id: "v-1", label: "Takt Time Compliance Check", completed: true, sourceStream: "Industrial Engineering" },
    { id: "v-2", label: "Station Idle Time Audit", completed: true, sourceStream: "Line Control" },
  ],
  automationLevel: "Semi-Automated",
  robotStations: 2,
  visionInspection: true,
  pokaYoke: true,
  inlineTesting: true,
  qualityGates: "Incoming, In-process, Final Test, Packaging Inspection",
  plannedOutput: 250,
  lineCapacity: 260,
  oeeTarget: 85,
  yieldTarget: 98.5,
  scrapTarget: 1.0,
  overallEfficiency: 82.6,
  kpiTrend: [
    { period: "Run 1", oee: 78.5, yieldRate: 96.0, defectRate: 1.5, throughput: 230 },
    { period: "Run 3", oee: 82.6, yieldRate: 98.7, defectRate: 0.8, throughput: 261 },
  ],
  aiLineOptimization: "Workstations can be optimized to reduce idle time by 6%.",
  aiBottleneckPrediction: "Station 7 likely bottleneck at peak demand.",
  aiResourceUtilization: "Operator utilization 92% (Optimal).",
  aiMaintenanceSuggestions: "Check soldering station for vibration anomaly.",
  aiProductivityRecommendations: "Add Pick-to-Light at Station 5 & 8.",
  attachments: [
    { id: "a-1", name: "factory_layout.pdf", size: "2.4 MB", type: "PDF Document", uploadDate: "18 Jun 2024" },
  ],
  reviewers: [
    { id: "rev-1", role: "Assembly Line Engineer", person: "Rahul Sharma", avatar: "", decision: "Approved", date: "18 Jun 2024", comments: "Pilot run successful.", status: "Completed" },
    { id: "rev-2", role: "Manufacturing Manager", person: "Vikram Singh", avatar: "", decision: "Approved", date: "18 Jun 2024", comments: "All criteria met.", status: "Completed" },
  ],
  approvalDecision: "Approved",
  reviewComments: "All criteria met. Assembly line is ready for mass production.",
  approvalDate: "18 Jun 2024",
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 10:15 AM",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "20 Jun 2024 04:25 PM",
  workflowStageLabel: "Review & Approval",
  timeline: [
    { id: "m1", title: "Line Layout Design", date: "05 Jun 2024", completed: true, stageNumber: 1 },
    { id: "m6", title: "Review & Approval", date: "18 Jun 2024", completed: false, stageNumber: 6 },
  ],
  auditTrail: [
    { id: "a-1", timestamp: "18 Jun 2024 10:15 AM", user: "Rahul Sharma", action: "Form Initialized", details: "Assembly Line Development record created.", ipAddress: "192.168.1.102" },
  ],
} as any;

export const getAssemblyLineFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_ASSEMBLY_LINE_RECORD };
});

export const saveAssemblyLineDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      projectName: data.input.projectName ?? "",
      ownerName: data.input.assemblyLineEngineer?.name ?? data.input.ownerName ?? "",
      recordCode: data.input.assemblyLineId ?? data.input.id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitAssemblyLineFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async () => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result };
    }
    return { success: true, data: DEFAULT_ASSEMBLY_LINE_RECORD };
  });

export const reviewAssemblyLineFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Assembly Line Engineer",
        reviewerName: "Current User",
      },
    });
    return { success: true, data: result };
  });

import { createServerFn } from "@tanstack/react-start";
import type {
  ElectricalDesignApprovalDecision,
  ElectricalDesignFormInput,
  ElectricalDesignRecord,
  ElectricalDesignStage,
  ElectricalDesignStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";
import { withDefaults } from "./developmentTransform";

const MODULE_TYPE = "electrical-design";

export function calculateElectricalDesignScores(input: Partial<ElectricalDesignFormInput>) {
  const powerSystemReadiness = 88;
  const circuitReadiness = input.pcbLayerCount && input.pcbLayerCount >= 6 ? 85 : 80;
  const electricalSafetyScore = input.electricalSafetyScore ?? 88;
  const complianceScore = input.complianceScore ?? 85;

  const overallElectricalDesignScore = Math.round(
    powerSystemReadiness * 0.25 + circuitReadiness * 0.25 + electricalSafetyScore * 0.25 + complianceScore * 0.25
  );

  const aiDesignQualityScore = Math.min(99, Math.max(75, Math.round(overallElectricalDesignScore * 1.02)));
  const aiPowerOptimization = 85;
  const aiCircuitReview = 87;
  const aiThermalAssessment = 84;
  const aiEmcRecommendations = 86;
  const aiReliabilityPrediction = 85;
  const aiOverallElectricalScore = overallElectricalDesignScore;

  const highlights: string[] = [];
  highlights.push("High efficiency power architecture designed");
  highlights.push("EMC design complies with IEC 61000 series");
  highlights.push(`Electrical safety design meets target score (${electricalSafetyScore}/100)`);
  highlights.push("AI optimization reduced power loss by 8.7%");

  return {
    summary: {
      overallElectricalDesignScore, powerSystemReadiness, circuitReadiness,
      electricalSafetyScore, complianceScore, recommendation: "Proceed to PCB Layout Design",
    },
    aiAssessment: {
      aiOverallElectricalScore, aiDesignQualityScore, aiPowerOptimization,
      aiCircuitReview, aiThermalAssessment, aiEmcRecommendations, aiReliabilityPrediction,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_ELECTRICAL_DESIGN_INPUT: ElectricalDesignFormInput = {
  // Panel 1: Electrical Design Overview
  productName: "Smart EV Charger",
  electricalDesignObjective:
    "Design a safe, efficient and reliable electrical system for Smart EV Charger with high performance and compliance.",
  designScope:
    "Power electronics, control system, protection system, wiring & harness, PCB interfaces and power distribution.",
  applicableStandards: ["IEC 61851", "IEC 61000", "ISO 26262", "RoHS"],
  designMethodology: "Top-Down Design",
  productCategory: "EV Charging Station",
  designStatus: "In Progress",
  productRenderUrl:
    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",

  // Panel 2: Electrical Architecture
  electricalArchitectureName: "EV Charger Electrical Architecture",
  systemVoltage: "400 VAC, 3-Phase, 50 Hz",
  powerRating: "22 kW",
  acDcConfiguration: "AC to DC",
  powerDistributionTopology: "Radial",
  electricalInterfaces: "Grid, EV Connector, Communication, Display, Sensors, Control",
  architectureStatus: "Defined",
  architectureDiagramUrl:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",

  // Panel 3: Power System Design
  powerSource: "Grid Supply",
  powerSupplyDesign: "PFC + LLC Topology",
  converterType: "AC/DC Rectifier",
  inverterSpecification: "22 kW, 400 VDC Output",
  transformerCoilSpecification: "High Frequency Transformer",
  powerEfficiencyTarget: "> 95%",
  thermalLoad: "450 W",

  // Panel 4: Circuit & PCB Design
  pcbName: "Main Control PCB",
  pcbRevision: "Rev B",
  pcbLayerCount: 6,
  circuitCategory: "Control Circuit",
  majorComponents: "MCU, Gate Drivers, Isolators, Op-Amps, Relays",
  connectorTypes: ["M12", "RJ45", "USB-C", "Header"],
  pcbStatus: "In Progress",
  pcbBoardImageUrl:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",

  // Panel 5: Wiring & Harness Design
  harnessName: "Main Power Harness",
  cableType: "Power Cable",
  wireGauge: "16 AWG",
  connectorStandard: "XT60",
  routingDescription: "High power path-optimized for minimal loss and EMI control",
  harnessLength: "2.85 m",
  harnessStatus: "In Progress",
  harnessImageUrl:
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",

  // Panel 6: Protection & Safety
  fuseSpecification: "100 A, 1000 VDC",
  circuitBreaker: "125 A, 3 Pole MCCB",
  isolationMethod: "Galvanic Isolation",
  earthingMethod: "Protective Earthing",
  surgeProtection: "Type 2 SPD",
  functionalSafetyStandard: ["ISO 26262", "IEC 61508"],
  electricalSafetyScore: 88,

  // Panel 7: EMC / EMI & Compliance
  emcStandard: ["IEC 61000-6-2", "IEC 61000-6-3"],
  emiMitigationStrategy: "Filtered input, Shielded cables, Proper grounding",
  shieldingMethod: "Metal Enclosure & Shielded Cable",
  groundingStrategy: "Single Point Grounding",
  complianceStatus: "Compliant",
  testPlan: "Pre-compliance testing as per plan",
  complianceScore: 85,

  // Panel 8: Simulation & Validation
  simulations: [
    { id: "sim-1", name: "Circuit Simulation", status: "Completed" },
    { id: "sim-2", name: "Power Simulation", status: "Completed" },
    { id: "sim-3", name: "Thermal Simulation", status: "In Progress" },
    { id: "sim-4", name: "Failure Mode Analysis", status: "In Progress" },
  ],
  validationMethod: "Hardware-in-the-Loop (HIL)",
  validationStatus: "In Progress",
  validationScore: 84,
  thermalHeatmapUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",

  // Panel 9 & 10 Initialized dynamically below
  aiAssessment: {
    aiOverallElectricalScore: 86,
    aiDesignQualityScore: 88,
    aiPowerOptimization: 85,
    aiCircuitReview: 87,
    aiThermalAssessment: 84,
    aiEmcRecommendations: 86,
    aiReliabilityPrediction: 85,
  },
  summary: {
    overallElectricalDesignScore: 86,
    powerSystemReadiness: 88,
    circuitReadiness: 85,
    electricalSafetyScore: 87,
    complianceScore: 84,
    recommendation: "Proceed to PCB Layout Design",
  },

  // Panel 11: Attachments
  attachments: [
    {
      id: "att-1",
      name: "Electrical_Schematic.pdf",
      typeIcon: "pdf",
      size: "2.4 MB",
      category: "Schematic",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "18 Jun 2024",
    },
    {
      id: "att-2",
      name: "Single_Line_Diagram.pdf",
      typeIcon: "pdf",
      size: "1.8 MB",
      category: "Diagram",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "18 Jun 2024",
    },
    {
      id: "att-3",
      name: "Wiring_Diagram.pdf",
      typeIcon: "pdf",
      size: "2.1 MB",
      category: "Wiring",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "19 Jun 2024",
    },
    {
      id: "att-4",
      name: "PCB_Design_Files.zip",
      typeIcon: "zip",
      size: "25.6 MB",
      category: "PCB Design",
      fileType: "application/zip",
      url: "#",
      uploadedAt: "19 Jun 2024",
    },
    {
      id: "att-5",
      name: "Harness_Drawing.pdf",
      typeIcon: "pdf",
      size: "1.6 MB",
      category: "Harness",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-6",
      name: "Electrical_BOM.xlsx",
      typeIcon: "xlsx",
      size: "13.2 MB",
      category: "BOM",
      fileType: "application/vnd.ms-excel",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-7",
      name: "Simulation_Reports.pdf",
      typeIcon: "pdf",
      size: "4.8 MB",
      category: "Simulation",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-8",
      name: "Design_Review_Report.pdf",
      typeIcon: "pdf",
      size: "2.7 MB",
      category: "Report",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
  ],

  // Panel 12: Review & Approval Table
  reviewers: [
    {
      id: "rev-1",
      role: "Electrical Engineer",
      person: "Ananya Iyer",
      decision: "Approved",
      status: "Approved",
      date: "18 Jun 2024",
    },
    {
      id: "rev-2",
      role: "Electronics Engineer",
      person: "Rohit Nair",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-3",
      role: "Mechanical Engineer",
      person: "Vikram Singh",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-4",
      role: "Safety Engineer",
      person: "Priya Mehta",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-5",
      role: "Quality Engineer",
      person: "Neha Sharma",
      decision: "Pending",
      status: "Pending",
      date: null,
    },
    {
      id: "rev-6",
      role: "Engineering Manager",
      person: "Arun Kumar",
      decision: "Pending",
      status: "Pending",
      date: null,
    },
    {
      id: "rev-7",
      role: "CTO",
      person: "Dr. Anil Patel",
      decision: "Pending",
      status: "Pending",
      date: null,
    },
  ],
  approvalDecision: null,
  reviewComments: "",
  approvalDate: "2024-06-20",
};

const DEFAULT_MOCK_RECORD: ElectricalDesignRecord = {
  id: "ed-rec-2024-0017",
  designId: "ED-2024-0017",
  formCode: "EDF-2024-25",
  designProjectName: "Smart EV Charger – Electrical Design",
  designVersion: "v1.0",
  status: "Under Review",
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",

  linkedMechanicalDesignId: "MD-2024-0017",
  linkedMechanicalDesignTitle: "Smart EV Charger – Mechanical Design",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Charger Pro",

  businessUnit: "Smart Mobility Division",
  electricalEngineerId: "usr-ananya-iyer",
  electricalEngineerName: "Ananya Iyer",
  electricalEngineerAvatar:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
  lastUpdated: "20 Jun 2024 04:25 PM",

  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.0",

  stages: [
    {
      id: "electrical_architecture",
      label: "Stage 1: Electrical Architecture",
      stageNumber: 1,
      status: "completed",
      description: "Define architecture, power distribution topology & protection strategy",
    },
    {
      id: "circuit_pcb_design",
      label: "Stage 2: Circuit & PCB Design",
      stageNumber: 2,
      status: "completed",
      description: "Schematics, PCB stack-up, component placement & MCU interfaces",
    },
    {
      id: "simulation_validation",
      label: "Stage 3: Simulation & Validation",
      stageNumber: 3,
      status: "completed",
      description: "Electrical, power, thermal simulation & safety compliance validation",
    },
    {
      id: "engineering_review",
      label: "Stage 4: Engineering Review",
      stageNumber: 4,
      status: "in_progress",
      description: "Review Board sign-off & downstream Prototype Manufacturing hand-off",
    },
  ],

  input: DEFAULT_ELECTRICAL_DESIGN_INPUT,
  ...calculateElectricalDesignScores(DEFAULT_ELECTRICAL_DESIGN_INPUT),

  linkedPrototypeManufacturingId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",

  auditTrail: [
    {
      at: "18 Jun 2024 10:15 AM",
      actor: "Ananya Iyer",
      event: "Electrical Design record created from approved Mechanical Design MD-2024-0017, PA-2024-0017, PRD-2024-0017",
      stage: "electrical_architecture",
      status: "Draft",
    },
    {
      at: "19 Jun 2024 02:30 PM",
      actor: "Ananya Iyer",
      event: "Completed Stage 1 & Stage 2 PCB layout and harness routing specifications",
      stage: "circuit_pcb_design",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 11:00 AM",
      actor: "Ananya Iyer",
      event: "Completed HIL simulation testing and electrical safety compliance score (88/100)",
      stage: "simulation_validation",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 04:25 PM",
      actor: "Ananya Iyer",
      event: "Submitted Electrical Design for Stage 4 Engineering Review Board",
      stage: "engineering_review",
      status: "Under Review",
    },
  ],
} as any;

export const getElectricalDesignFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
    const result = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveElectricalDesignDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ElectricalDesignFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateElectricalDesignScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).designProjectName ?? "",
      ownerName: (base as any).electricalEngineerName ?? "Ananya Iyer",
      recordCode: (base as any).id ?? (base as any).designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceElectricalDesignStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: ElectricalDesignStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      electrical_architecture: { label: "Stage 1: Electrical Architecture", stageNumber: 1 },
      circuit_pcb_design: { label: "Stage 2: Circuit & PCB Design", stageNumber: 2 },
      simulation_validation: { label: "Stage 3: Simulation & Validation", stageNumber: 3 },
      engineering_review: { label: "Stage 4: Engineering Review", stageNumber: 4 },
    };
    const target = stageMap[data.targetStage];
    const record = {
      ...base,
      currentStage: data.targetStage,
      currentStageLabel: target.label,
      stages: (base.stages ?? []).map((stg: any) => {
        if (stg.stageNumber < target.stageNumber) return { ...stg, status: "completed" };
        if (stg.stageNumber === target.stageNumber) return { ...stg, status: "in_progress" };
        return { ...stg, status: "pending" };
      }),
      projectName: base.designProjectName ?? "",
      ownerName: base.electricalEngineerName ?? "Ananya Iyer",
      recordCode: base.id ?? base.designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitElectricalDesignFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewElectricalDesignFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ElectricalDesignApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Engineering Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });

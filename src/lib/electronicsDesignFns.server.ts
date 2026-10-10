import { createServerFn } from "@tanstack/react-start";
import type {
  ElectronicsDesignApprovalDecision,
  ElectronicsDesignFormInput,
  ElectronicsDesignRecord,
  ElectronicsDesignStage,
  ElectronicsDesignStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";
import { withDefaults } from "./developmentTransform";

const MODULE_TYPE = "electronics-design";

export function calculateElectronicsDesignScores(input: Partial<ElectronicsDesignFormInput>) {
  const architectureReadiness = 88;
  const circuitReadiness = input.estimatedLayerCount && input.estimatedLayerCount >= 6 ? 85 : 82;
  const hardwareInterfaceScore = input.hardwareInterfaceScore ?? 87;
  const reliabilityScore = input.reliabilityScore ?? 86;

  const overallElectronicsDesignScore = Math.round(
    architectureReadiness * 0.25 +
      circuitReadiness * 0.25 +
      hardwareInterfaceScore * 0.25 +
      reliabilityScore * 0.25
  );

  const aiDesignQualityScore = Math.min(99, Math.max(75, Math.round(overallElectronicsDesignScore * 1.02)));
  const aiComponentOptimization = 85;
  const aiCircuitReview = 87;
  const aiSignalIntegrityAnalysis = 86;
  const aiThermalRecommendations = 84;
  const aiReliabilityPrediction = 88;
  const aiOverallElectronicsScore = overallElectronicsDesignScore;

  const highlights: string[] = [];
  highlights.push("Optimized component selection reduced cost by 8%");
  highlights.push("High-speed signal design up to 500 MHz");
  highlights.push("Power integrity within target limits");
  highlights.push("Excellent reliability with MTBF > 100,000 hrs");
  highlights.push("AI analysis improved efficiency by 7.5%");

  return {
    summary: {
      overallElectronicsDesignScore,
      architectureReadiness,
      circuitReadiness,
      hardwareInterfaceScore,
      reliabilityScore,
      recommendation: "Proceed to PCB Layout Design",
    },
    aiAssessment: {
      aiOverallElectronicsScore,
      aiDesignQualityScore,
      aiComponentOptimization,
      aiCircuitReview,
      aiSignalIntegrityAnalysis,
      aiThermalRecommendations,
      aiReliabilityPrediction,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_ELECTRONICS_DESIGN_INPUT: ElectronicsDesignFormInput = {
  // Panel 1: Electronics Design Overview
  productName: "Smart EV Charger",
  electronicsDesignObjective:
    "Design high-performance electronic control unit, sensing and communication system for Smart EV Charger.",
  designScope:
    "Main controller, power management board, sensor interface, communication modules and embedded hardware.",
  applicableStandards: ["IEC 62304", "ISO 26262", "IPC-A-610", "RoHS"],
  designMethodology: "Top-Down Design",
  productCategory: "EV Charging Station",
  designStatus: "In Progress",
  productRenderUrl:
    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",

  // Panel 2: Electronic System Architecture
  electronicSystemName: "EV Charger Main Electronic Controller",
  functionalBlocks: "Power Domain, Controller, Sensing, Comm, HMI",
  boardArchitecture: "Dual Board Architecture",
  signalInterfaces: "Analog, Digital, PWM, Differential",
  communicationInterfaces: ["CAN", "Ethernet", "USB", "Wi-Fi", "BLE"],
  powerDomains: "3.3V, 5V, 12V, 24V",
  architectureStatus: "Defined",
  systemDiagramUrl:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",

  // Panel 3: Component Selection
  microcontrollerProcessor: "STM32H7 / ARM Cortex-M7",
  memoryDevices: "16MB Flash, 2MB SRAM",
  powerDevices: "Integrated PMIC & LDOs",
  passiveComponents: "Automotive Grade 0603/0805",
  sensors: "Current, Voltage, Temp Sensors",
  communicationModules: "Isolated CAN Transceiver, Ethernet PHY",
  componentLifecycleStatus: "Active & Preferred",

  // Panel 4: Circuit Design
  circuitName: "Main Controller Circuit",
  circuitCategory: "Mixed Signal",
  inputVoltage: "12V - 24V DC",
  outputVoltage: "3.3V, 5V, 12V DC",
  operatingFrequency: "480 MHz MCU / 100 kHz PWM",
  currentRating: "5A Max",
  circuitStatus: "Verified",
  circuitSchematicUrl:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",

  // Panel 5: PCB Design Preparation
  pcbType: "Rigid Multilayer",
  estimatedLayerCount: 6,
  boardDimensions: "160 mm x 120 mm",
  componentPlacementStrategy: "Grouped by Power & High-Speed Domains",
  thermalManagementMethod: "Thermal Vias & Copper Pour",
  highSpeedSignalDesign: "Controlled Impedance (50Ω / 100Ω Diff)",
  pcbStackupDiagramUrl:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  pcbReadinessScore: 88,

  // Panel 6: Embedded Hardware Interfaces
  gpioInterfaces: "32 Configurable I/O",
  adcDacInterfaces: "16-bit ADC, 12-bit DAC",
  pwmOutputs: "8 High-Resolution PWM Channels",
  canInterfaceStatus: "Active (Passed)",
  ethernetInterfaceStatus: "Active (Passed)",
  busInterfaces: ["USB 2.0", "UART (x4)", "SPI (x2)", "I²C (x2)"],
  hardwareInterfaceStatus: "Verified",
  hardwareInterfaceScore: 87,

  // Panel 7: Signal Integrity & Reliability
  signalIntegrityAnalysis: "Passed (0 Crosstalk Warnings)",
  powerIntegrityAnalysis: "Passed (PDN Impedance < 0.1Ω)",
  noiseReductionStrategy: "Ferrite Beads, Decoupling Caps, Ground Plane",
  clockDistribution: "Low-Jitter Differential Crystal",
  reliabilityTarget: "99.5%",
  mtbfTarget: "> 100,000 hrs",
  reliabilityScore: 86,

  // Panel 8: Design Verification & Testing
  verifications: [
    { id: "ver-1", name: "Schematic Review", status: "Completed" },
    { id: "ver-2", name: "ERC Status", status: "Passed" },
    { id: "ver-3", name: "Functional Simulation", status: "Completed" },
    { id: "ver-4", name: "Prototype Bring-up Plan", status: "In Progress" },
    { id: "ver-5", name: "Test Procedure", status: "Completed" },
    { id: "ver-6", name: "Test Status", status: "In Progress" },
  ],
  verificationScore: 86,
  waveformPlotUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",

  // Panel 9 & 10 Initialized dynamically
  aiAssessment: {
    aiOverallElectronicsScore: 86,
    aiDesignQualityScore: 88,
    aiComponentOptimization: 85,
    aiCircuitReview: 87,
    aiSignalIntegrityAnalysis: 86,
    aiThermalRecommendations: 84,
    aiReliabilityPrediction: 88,
  },
  summary: {
    overallElectronicsDesignScore: 86,
    architectureReadiness: 88,
    circuitReadiness: 85,
    hardwareInterfaceScore: 87,
    reliabilityScore: 86,
    recommendation: "Proceed to PCB Layout Design",
  },

  // Panel 11: Attachments
  attachments: [
    {
      id: "att-1",
      name: "Electronic_Schematic.pdf",
      typeIcon: "pdf",
      size: "2.8 MB",
      category: "Schematic",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "18 Jun 2024",
    },
    {
      id: "att-2",
      name: "Block_Diagram.pdf",
      typeIcon: "pdf",
      size: "1.5 MB",
      category: "Diagram",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "18 Jun 2024",
    },
    {
      id: "att-3",
      name: "Component_Datasheets.zip",
      typeIcon: "zip",
      size: "34.2 MB",
      category: "Datasheets",
      fileType: "application/zip",
      url: "#",
      uploadedAt: "19 Jun 2024",
    },
    {
      id: "att-4",
      name: "Simulation_Report.pdf",
      typeIcon: "pdf",
      size: "5.1 MB",
      category: "Simulation",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "19 Jun 2024",
    },
    {
      id: "att-5",
      name: "BOM.xlsx",
      typeIcon: "xlsx",
      size: "14.8 MB",
      category: "BOM",
      fileType: "application/vnd.ms-excel",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-6",
      name: "Interface_Diagram.pdf",
      typeIcon: "pdf",
      size: "2.3 MB",
      category: "Diagram",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-7",
      name: "Design_Review_Report.pdf",
      typeIcon: "pdf",
      size: "3.2 MB",
      category: "Report",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-8",
      name: "Compliance_Documents.zip",
      typeIcon: "zip",
      size: "18.6 MB",
      category: "Compliance",
      fileType: "application/zip",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
  ],

  // Panel 12: Review & Approval Table
  reviewers: [
    {
      id: "rev-1",
      role: "Electronics Engineer",
      person: "Rohit Nair",
      decision: "Approved",
      status: "Approved",
      date: "18 Jun 2024",
    },
    {
      id: "rev-2",
      role: "Electrical Engineer",
      person: "Ananya Iyer",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-3",
      role: "Embedded Engineer",
      person: "Kavita Sharma",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-4",
      role: "Hardware Architect",
      person: "Suresh Menon",
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

const DEFAULT_MOCK_RECORD: ElectronicsDesignRecord = {
  id: "en-rec-2024-0017",
  designId: "EN-2024-0017",
  formCode: "EDF-2024-25",
  designProjectName: "Smart EV Charger – Electronics Design",
  designVersion: "v1.0",
  status: "Under Review",
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",

  linkedElectricalDesignId: "ED-2024-0017",
  linkedElectricalDesignTitle: "Smart EV Charger – Electrical Design",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Charger Pro",

  businessUnit: "Smart Mobility Division",
  electronicsEngineerId: "usr-rohit-nair",
  electronicsEngineerName: "Rohit Nair",
  electronicsEngineerAvatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  lastUpdated: "20 Jun 2024 04:25 PM",

  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.0",

  stages: [
    {
      id: "electronic_system_architecture",
      label: "Stage 1: Electronic System Architecture",
      stageNumber: 1,
      status: "completed",
      description: "Define functional blocks, circuit architecture & embedded interfaces",
    },
    {
      id: "component_selection_circuit_design",
      label: "Stage 2: Component Selection & Circuit Design",
      stageNumber: 2,
      status: "completed",
      description: "Select components, schematic design & hardware interface validation",
    },
    {
      id: "verification_simulation",
      label: "Stage 3: Verification & Simulation",
      stageNumber: 3,
      status: "completed",
      description: "Circuit/signal/power integrity simulation & ERC/compliance verification",
    },
    {
      id: "engineering_review",
      label: "Stage 4: Engineering Review",
      stageNumber: 4,
      status: "in_progress",
      description: "Review Board approval & downstream PCB Layout Design project creation",
    },
  ],

  input: DEFAULT_ELECTRONICS_DESIGN_INPUT,
  ...calculateElectronicsDesignScores(DEFAULT_ELECTRONICS_DESIGN_INPUT),

  linkedPcbLayoutId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",

  auditTrail: [
    {
      at: "18 Jun 2024 10:15 AM",
      actor: "Rohit Nair",
      event: "Electronics Design record created from approved Electrical Design ED-2024-0017, PA-2024-0017, PRD-2024-0017",
      stage: "electronic_system_architecture",
      status: "Draft",
    },
    {
      at: "19 Jun 2024 02:30 PM",
      actor: "Rohit Nair",
      event: "Completed Stage 1 & Stage 2 component selections and MCU interface validation",
      stage: "component_selection_circuit_design",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 11:00 AM",
      actor: "Rohit Nair",
      event: "Completed signal integrity analysis and functional verification score (86/100)",
      stage: "verification_simulation",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 04:25 PM",
      actor: "Rohit Nair",
      event: "Submitted Electronics Design for Stage 4 Engineering Review Board",
      stage: "engineering_review",
      status: "Under Review",
    },
  ],
} as any;

export const getElectronicsDesignFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
    const result = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveElectronicsDesignDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ElectronicsDesignFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateElectronicsDesignScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).designProjectName ?? "",
      ownerName: (base as any).electronicsEngineerName ?? "Rohit Nair",
      recordCode: (base as any).id ?? (base as any).designId ?? "",
    };
    const result = (withDefaults(DEFAULT_MOCK_RECORD, await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } })) as any);
    return { success: true, data: result as any };
  });

export const advanceElectronicsDesignStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: ElectronicsDesignStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      electronic_system_architecture: { label: "Stage 1: Electronic System Architecture", stageNumber: 1 },
      component_selection_circuit_design: { label: "Stage 2: Component Selection & Circuit Design", stageNumber: 2 },
      verification_simulation: { label: "Stage 3: Verification & Simulation", stageNumber: 3 },
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
      ownerName: base.electronicsEngineerName ?? "Rohit Nair",
      recordCode: base.id ?? base.designId ?? "",
    };
    const result = (withDefaults(DEFAULT_MOCK_RECORD, await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } })) as any);
    return { success: true, data: result as any };
  });

export const submitElectronicsDesignFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (current?.id) {
      const result = (withDefaults(DEFAULT_MOCK_RECORD, await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } })) as any);
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewElectronicsDesignFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ElectronicsDesignApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
    const result = (withDefaults(DEFAULT_MOCK_RECORD, await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Engineering Review Board",
        reviewerName: "Review Board",
      },
    })) as any);
    return { success: true, data: result as any };
  });

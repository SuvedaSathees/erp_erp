import { createServerFn } from "@tanstack/react-start";
import type {
  EmbeddedDevelopmentApprovalDecision,
  EmbeddedDevelopmentFormInput,
  EmbeddedDevelopmentRecord,
  EmbeddedDevelopmentStage,
  EmbeddedDevelopmentStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";
import { withDefaults } from "./developmentTransform";

const MODULE_TYPE = "embedded-development";

export function calculateEmbeddedDevelopmentScores(input: Partial<EmbeddedDevelopmentFormInput>) {
  const firmwareReadiness = 88;
  const hardwareCompatibility = 90;
  const performanceScore = 87;
  const securityScore = input.securityReadinessScore ?? 90;

  const overallEmbeddedScore = Math.round(
    firmwareReadiness * 0.25 +
      hardwareCompatibility * 0.25 +
      performanceScore * 0.25 +
      securityScore * 0.25
  );

  const aiFirmwareQualityScore = Math.min(99, Math.max(75, Math.round(overallEmbeddedScore * 1.02)));
  const aiCodeOptimization = 88;
  const aiMemoryOptimization = 89;
  const aiTimingAnalysis = 87;
  const aiOverallEmbeddedScore = overallEmbeddedScore;

  const highlights: string[] = [];
  highlights.push("Optimized task scheduling improves CPU utilization by 12%");
  highlights.push("Memory usage optimized, 18% more free SRAM");
  highlights.push("MISRA-C compliance score: 96%");
  highlights.push("Security enhanced with Secure Boot and Encryption");
  highlights.push("All critical modules passed HIL testing");

  return {
    summary: {
      overallEmbeddedScore,
      firmwareReadiness,
      hardwareCompatibility,
      performanceScore,
      securityScore,
      recommendation: "Proceed to Firmware Development",
    },
    aiAssessment: {
      aiOverallEmbeddedScore,
      aiFirmwareQualityScore,
      aiCodeOptimization,
      aiMemoryOptimization,
      aiTimingAnalysis,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_EMBEDDED_DEVELOPMENT_INPUT: EmbeddedDevelopmentFormInput = {
  // Panel 1: Embedded System Overview
  productName: "Smart EV Charger",
  embeddedSystemName: "Smart EV Charger Main Embedded Controller",
  developmentObjective:
    "Develop real-time, deterministic, secure embedded firmware & RTOS framework for Smart EV Charger controller.",
  firmwareScope:
    "Board Support Package (BSP), FreeRTOS kernel, CAN/Ethernet drivers, energy metering, safety state machine, and OTA engine.",
  applicableStandards: ["IEC 61851", "ISO 26262", "MISRA C", "AUTOSAR"],
  developmentMethodology: "RTOS-Based Development",
  developmentStatus: "In Progress",
  hardwareBoardImageUrl:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",

  // Panel 2: Hardware Platform
  microcontrollerSoc: "STM32H753BIT6 / ARM Cortex-M7",
  cpuArchitecture: "32-bit RISC ARMv7E-M",
  clockFrequency: "480 MHz",
  flashMemory: "2 MB On-Chip Flash",
  sram: "1 MB AXISRAM + 128 KB ITCM",
  externalMemory: "16 MB QSPI Flash",
  hardwareStatus: "Verified",
  hardwarePlatformDiagramUrl:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",

  // Panel 3: Firmware Architecture
  firmwareArchitecture: "Layered Architecture",
  bootloader: "Secure Bootloader (AES-256 Verified)",
  bsp: "STM32H7 HAL / LL Drivers",
  deviceDrivers: "CAN FD, Ethernet MAC, SPI Flash, ADC, PWM, UART",
  middlewareComponents: "FreeRTOS, LwIP TCP/IP, MbedTLS, LittleFS",
  applicationModules: "Charger State Machine, Power Manager, Energy Metering, OTA Client",
  firmwareStatus: "Active",
  layeredArchitectureDiagramUrl:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",

  // Panel 4: RTOS & Task Management
  rtosPlatform: "FreeRTOS v10.4.3",
  numberOfTasks: 12,
  schedulingMethod: "Preemptive Priority-Based",
  taskPriorities: "High (3), Medium (6), Low (3)",
  interruptManagement: "Nested Vectored Interrupt Controller (NVIC)",
  memoryManagement: "Heap_4 (FreeRTOS Dynamic Allocation)",
  rtosStatus: "Running",
  taskDistribution: {
    high: 3,
    medium: 6,
    low: 3,
  },

  // Panel 5: Communication Interfaces
  interfacesList: [
    { name: "UART", checked: true },
    { name: "SPI", checked: true },
    { name: "I²C", checked: true },
    { name: "CAN / CAN FD", checked: true },
    { name: "USB", checked: true },
    { name: "Ethernet", checked: true },
  ],
  wirelessInterfaces: ["BLE", "Wi-Fi", "NFC"],

  // Panel 6: Functional Modules
  functionalModulesList: [
    { name: "Sensor Management", checked: true },
    { name: "Actuator Control", checked: true },
    { name: "Motor Control", checked: true },
    { name: "Power Management", checked: true },
    { name: "Safety Functions", checked: true },
    { name: "Diagnostic Functions", checked: true },
    { name: "OTA Update Support", checked: true },
  ],

  // Panel 7: Cybersecurity & Functional Safety
  secureBoot: "Active (Hardware Root of Trust)",
  firmwareEncryption: "AES-256 / SHA-256",
  secureKeyStorage: "Hardware Cryptographic Element (ATECC608A)",
  watchdogConfiguration: "Independent Watchdog (IWDG) & Window Watchdog (WWDG)",
  functionalSafetyStandards: ["ISO 26262 ASIL-B", "IEC 61508"],
  cybersecurityStandards: ["ISO/SAE 21434", "UNECE WP.29"],
  securityReadinessScore: 90,

  // Panel 8: Firmware Testing & Validation
  testItems: [
    { id: "test-1", name: "Unit Testing", status: "Completed", details: "MISRA-C Rule Checker Passed" },
    { id: "test-2", name: "Integration Testing", status: "Passed", details: "LwIP & CAN Bus Stack Verified" },
    { id: "test-3", name: "Hardware-in-the-Loop (HIL)", status: "Passed", details: "Fault Injection Testing Passed" },
    { id: "test-4", name: "Static Code Analysis", status: "Completed", details: "0 High Severity Defect Warnings" },
  ],
  codeCoverage: 92.4,
  testReportSummary: "480/480 Automated Tests Passed • HIL Verification Completed",
  validationScore: 88,

  // Panel 9 & 10 Initialized dynamically
  aiAssessment: {
    aiOverallEmbeddedScore: 88,
    aiFirmwareQualityScore: 90,
    aiCodeOptimization: 88,
    aiMemoryOptimization: 89,
    aiTimingAnalysis: 87,
  },
  summary: {
    overallEmbeddedScore: 88,
    firmwareReadiness: 88,
    hardwareCompatibility: 90,
    performanceScore: 87,
    securityScore: 90,
    recommendation: "Proceed to Firmware Development",
  },

  // Panel 11: Attachments
  attachments: [
    {
      id: "att-1",
      name: "Firmware_Source_Code.zip",
      typeIcon: "zip",
      size: "42.5 MB",
      category: "Source Code",
      fileType: "application/zip",
      url: "#",
      uploadedAt: "18 Jun 2024",
    },
    {
      id: "att-2",
      name: "System_Architecture_Diagram.pdf",
      typeIcon: "pdf",
      size: "2.1 MB",
      category: "Architecture",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "18 Jun 2024",
    },
    {
      id: "att-3",
      name: "RTOS_Configuration.pdf",
      typeIcon: "pdf",
      size: "1.6 MB",
      category: "RTOS Config",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "19 Jun 2024",
    },
    {
      id: "att-4",
      name: "Driver_Documentation.pdf",
      typeIcon: "pdf",
      size: "3.4 MB",
      category: "Drivers",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "19 Jun 2024",
    },
    {
      id: "att-5",
      name: "HIL_Test_Report.pdf",
      typeIcon: "pdf",
      size: "5.8 MB",
      category: "Test Report",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-6",
      name: "MISRA_Analysis.pdf",
      typeIcon: "pdf",
      size: "2.7 MB",
      category: "Static Analysis",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-7",
      name: "Security_Audit.pdf",
      typeIcon: "pdf",
      size: "4.2 MB",
      category: "Security",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-8",
      name: "OTA_Specification.pdf",
      typeIcon: "pdf",
      size: "1.9 MB",
      category: "Specification",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
  ],

  // Panel 12: Review & Approval Table
  reviewers: [
    {
      id: "rev-1",
      role: "Embedded Engineer",
      person: "Kavita Sharma",
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
      role: "Firmware Lead",
      person: "Rajesh Varma",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-4",
      role: "System Architect",
      person: "Suresh Menon",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-5",
      role: "QA Engineer",
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

const DEFAULT_MOCK_RECORD: EmbeddedDevelopmentRecord = {
  id: "emd-rec-2024-0017",
  developmentId: "EMD-2024-0017",
  formCode: "EMF-2024-25",
  developmentProjectName: "Smart EV Charger – Embedded Systems Development",
  firmwareVersion: "v1.0.0",
  status: "Under Review",
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",

  linkedElectronicsDesignId: "EN-2024-0017",
  linkedElectronicsDesignTitle: "Smart EV Charger – Electronics Design",
  linkedElectricalDesignId: "ED-2024-0017",
  linkedElectricalDesignTitle: "Smart EV Charger – Electrical Design",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Charger Pro",

  businessUnit: "Smart Mobility Division",
  embeddedEngineerId: "usr-kavita-sharma",
  embeddedEngineerName: "Kavita Sharma",
  embeddedEngineerAvatar:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
  lastUpdated: "20 Jun 2024 04:25 PM",

  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.0.0",

  stages: [
    {
      id: "platform_configuration",
      label: "Stage 1: Platform Configuration",
      stageNumber: 1,
      status: "completed",
      description: "Configure MCU/SoC, BSP, bootloader, RTOS & task scheduling",
    },
    {
      id: "firmware_development",
      label: "Stage 2: Firmware Development",
      stageNumber: 2,
      status: "completed",
      description: "Develop device drivers, middleware, application modules & version control",
    },
    {
      id: "testing_validation",
      label: "Stage 3: Testing & Validation",
      stageNumber: 3,
      status: "completed",
      description: "Automated build, static analysis, unit/integration & HIL testing",
    },
    {
      id: "engineering_review",
      label: "Stage 4: Engineering Review",
      stageNumber: 4,
      status: "in_progress",
      description: "Review Board approval & downstream System Integration project creation",
    },
  ],

  input: DEFAULT_EMBEDDED_DEVELOPMENT_INPUT,
  ...calculateEmbeddedDevelopmentScores(DEFAULT_EMBEDDED_DEVELOPMENT_INPUT),

  linkedSystemIntegrationId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",

  auditTrail: [
    {
      at: "18 Jun 2024 10:15 AM",
      actor: "Kavita Sharma",
      event: "Embedded Systems Development record created from approved Electronics Design EN-2024-0017, ED-2024-0017, PA-2024-0017, PRD-2024-0017",
      stage: "platform_configuration",
      status: "Draft",
    },
    {
      at: "19 Jun 2024 02:30 PM",
      actor: "Kavita Sharma",
      event: "Completed FreeRTOS task configuration and device driver integration",
      stage: "firmware_development",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 11:00 AM",
      actor: "Kavita Sharma",
      event: "Completed HIL automated testing (480/480 passed) and code coverage (92.4%)",
      stage: "testing_validation",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 04:25 PM",
      actor: "Kavita Sharma",
      event: "Submitted Embedded Systems Development for Stage 4 Engineering Review Board",
      stage: "engineering_review",
      status: "Under Review",
    },
  ],
} as any;

export const getEmbeddedDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
    const result = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveEmbeddedDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<EmbeddedDevelopmentFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateEmbeddedDevelopmentScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).developmentProjectName ?? "",
      ownerName: (base as any).embeddedEngineerName ?? "Kavita Sharma",
      recordCode: (base as any).id ?? (base as any).developmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceEmbeddedDevelopmentStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: EmbeddedDevelopmentStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      platform_configuration: { label: "Stage 1: Platform Configuration", stageNumber: 1 },
      firmware_development: { label: "Stage 2: Firmware Development", stageNumber: 2 },
      testing_validation: { label: "Stage 3: Testing & Validation", stageNumber: 3 },
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
      projectName: base.developmentProjectName ?? "",
      ownerName: base.embeddedEngineerName ?? "Kavita Sharma",
      recordCode: base.id ?? base.developmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitEmbeddedDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewEmbeddedDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: EmbeddedDevelopmentApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
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

import { createServerFn } from "@tanstack/react-start";
import type {
  FirmwareDevelopmentApprovalDecision,
  FirmwareDevelopmentFormInput,
  FirmwareDevelopmentRecord,
  FirmwareDevelopmentStage,
  FirmwareDevelopmentStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";
import { withDefaults } from "./developmentTransform";

const MODULE_TYPE = "firmware-development";

export function calculateFirmwareDevelopmentScores(input: Partial<FirmwareDevelopmentFormInput>) {
  const firmwareReadiness = 90;
  const codeQuality = input.codeCoverage && input.codeCoverage >= 90 ? 92 : 86;
  const securityReadiness = input.securityScore ?? 92;
  const testCoverage = Math.round(input.codeCoverage ?? 94.6);

  const overallFirmwareScore = Math.round(
    firmwareReadiness * 0.25 + codeQuality * 0.25 + securityReadiness * 0.25 + testCoverage * 0.25
  );

  const aiCodeQualityScore = codeQuality;
  const aiPerformanceOptimization = 90;
  const aiMemoryOptimization = 89;
  const aiSecurityAnalysis = securityReadiness;
  const aiBugPrediction = 88;
  const aiMaintainabilityScore = 91;
  const aiOverallFirmwareScore = overallFirmwareScore;

  const highlights: string[] = [];
  highlights.push("All critical modules implemented");
  highlights.push(`Code coverage achieved ${testCoverage}%`);
  highlights.push("Secure boot and OTA enabled");
  highlights.push("MISRA-C compliance 98%");
  highlights.push("No high severity vulnerabilities");

  return {
    summary: {
      overallFirmwareScore, firmwareReadiness, codeQuality, securityReadiness, testCoverage,
      recommendation: "Proceed to Hardware Bring-up",
    },
    aiAssessment: {
      aiOverallFirmwareScore, aiCodeQualityScore, aiPerformanceOptimization,
      aiMemoryOptimization, aiSecurityAnalysis, aiBugPrediction, aiMaintainabilityScore,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_FIRMWARE_DEVELOPMENT_INPUT: FirmwareDevelopmentFormInput = {
  // Panel 1: Firmware Project Overview
  productName: "Smart EV Charger",
  firmwareName: "Smart EV Charger Application & Real-Time Control Firmware",
  firmwareObjective:
    "Deliver robust, deterministic, ISO 26262 compliant firmware for EV Charging control, CAN FD telemetry, and secure OTA updating.",
  developmentScope:
    "HAL drivers, FreeRTOS kernel tasks, LwIP TCP/IP stack, MbedTLS security, CAN bus protocol engine, diagnostic manager, and OTA package manager.",
  supportedHardware: ["STM32H743ZI", "ESP32-S3", "AT24C256"],
  programmingLanguage: ["C", "C++"],
  developmentStatus: "In Progress",
  mcuChipImageUrl:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",

  // Panel 2: Firmware Architecture
  firmwareArchitecture: "Layered Architecture",
  bootloaderVersion: "v1.4.0 (Secure AES-256)",
  halVersion: "v2.1.0 (STM32 Cube HAL)",
  bspVersion: "v1.8.2",
  middlewareStack: "FreeRTOS v10.4.3, LwIP 2.1.2, MbedTLS 3.1.0",
  applicationFramework: "Event-Driven State Machine Engine",
  architectureStatus: "Verified",
  layeredArchitectureDiagramUrl:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",

  // Panel 3: Software Modules Table
  modules: [
    { id: "mod-1", name: "Charger_State_Machine", category: "Application", owner: "Rajesh Varma", status: "Completed", complexity: 85 },
    { id: "mod-2", name: "CAN_FD_Telemetry", category: "Drivers/Comm", owner: "Kavita Sharma", status: "Passed", complexity: 78 },
    { id: "mod-3", name: "Power_Management", category: "Middleware", owner: "Ananya Iyer", status: "Completed", complexity: 82 },
    { id: "mod-4", name: "OTA_Package_Manager", category: "Security/Update", owner: "Rohit Nair", status: "In Progress", complexity: 88 },
    { id: "mod-5", name: "Fault_Diagnostics_DTC", category: "Diagnostics", owner: "Suresh Menon", status: "Completed", complexity: 80 },
  ],

  // Panel 4: Communication Stack
  communicationInterfacesList: [
    { name: "CAN / CAN FD", checked: true },
    { name: "UART", checked: true },
    { name: "SPI", checked: true },
    { name: "I²C", checked: true },
    { name: "Ethernet", checked: true },
    { name: "BLE / Wi-Fi", checked: true },
  ],
  wirelessTags: ["BLE 5.2", "Wi-Fi 2.4GHz"],
  protocolStackStatus: "Running",

  // Panel 5: Diagnostics & Safety
  selfTestFunctions: "Active (Power-On & Periodic)",
  dtcSupportCount: 34,
  faultHandling: "Automatic Degradation & Safe Shut-off",
  watchdogStrategy: "Dual IWDG & WWDG Window Watchdog",
  errorRecovery: "Non-Volatile Error Log & Soft Reset",
  functionalSafetyText: "ISO 26262 ASIL-B Safety Goals Verified",
  diagnosticReadinessScore: 90,

  // Panel 6: Cybersecurity
  secureBoot: "Active (Public Key RSA-2048)",
  firmwareSigning: "ECDSA P-256 Signed",
  secureOtaUpdate: "Active (MbedTLS TLS 1.3 / AES-256-GCM)",
  encryptionMethod: "AES-256-CBC",
  authenticationMethod: "HMAC-SHA256",
  vulnerabilityAssessment: "Passed (0 High/Critical Vulnerabilities)",
  securityScore: 92,

  // Panel 7: Testing & QA
  testItems: [
    { id: "test-1", name: "Unit Testing", status: "Completed", details: "MISRA-C Rule Checker Passed" },
    { id: "test-2", name: "Integration Testing", status: "Passed", details: "LwIP & CAN Bus Stack Verified" },
    { id: "test-3", name: "Static Code Analysis", status: "Completed", details: "0 High Severity Defect Warnings" },
    { id: "test-4", name: "Dynamic Code Analysis", status: "Passed", details: "Heap Memory Leak Free" },
  ],
  codeCoverage: 94.6,
  memoryLeakAnalysis: "0 Dynamic Leaks (Clean Heap)",
  testStatus: "Passed",

  // Panel 8: Release Management
  releaseType: "Release Candidate (v2.1.0-RC2)",
  buildNumber: "Build #1428",
  gitCommitReference: "commit 8f3a91b (main)",
  releaseNotesUrl: "#",
  otaPackageName: "SmartEV_v2.1.0_signed.bin",
  otaPackageSize: "2.4 MB",
  releaseDate: "2024-06-20",
  releaseStatus: "Ready for Approval",

  // Panel 9 & 10 Initialized dynamically
  aiAssessment: {
    aiOverallFirmwareScore: 90,
    aiCodeQualityScore: 92,
    aiPerformanceOptimization: 90,
    aiMemoryOptimization: 89,
    aiSecurityAnalysis: 92,
    aiBugPrediction: 88,
    aiMaintainabilityScore: 91,
  },
  summary: {
    overallFirmwareScore: 90,
    firmwareReadiness: 90,
    codeQuality: 92,
    securityReadiness: 92,
    testCoverage: 95,
    recommendation: "Proceed to Hardware Bring-up",
  },

  // Panel 11: Attachments
  attachments: [
    {
      id: "att-1",
      name: "Source_Code_Archive.zip",
      typeIcon: "zip",
      size: "48.2 MB",
      category: "Source Code",
      fileType: "application/zip",
      url: "#",
      uploadedAt: "18 Jun 2024",
    },
    {
      id: "att-2",
      name: "Firmware_Binary.bin",
      typeIcon: "bin",
      size: "2.4 MB",
      category: "Binary",
      fileType: "application/octet-stream",
      url: "#",
      uploadedAt: "18 Jun 2024",
    },
    {
      id: "att-3",
      name: "HEX_File.hex",
      typeIcon: "hex",
      size: "6.1 MB",
      category: "Hex File",
      fileType: "text/plain",
      url: "#",
      uploadedAt: "19 Jun 2024",
    },
    {
      id: "att-4",
      name: "Build_Logs.txt",
      typeIcon: "txt",
      size: "850 KB",
      category: "Logs",
      fileType: "text/plain",
      url: "#",
      uploadedAt: "19 Jun 2024",
    },
    {
      id: "att-5",
      name: "Static_Analysis_Report.pdf",
      typeIcon: "pdf",
      size: "3.1 MB",
      category: "Report",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-6",
      name: "Release_Notes.pdf",
      typeIcon: "pdf",
      size: "1.2 MB",
      category: "Notes",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-7",
      name: "Security_Audit.pdf",
      typeIcon: "pdf",
      size: "4.5 MB",
      category: "Security",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-8",
      name: "HIL_Test_Report.pdf",
      typeIcon: "pdf",
      size: "5.6 MB",
      category: "Testing",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
  ],

  // Panel 12: Review & Approval Table
  reviewers: [
    {
      id: "rev-1",
      role: "Firmware Lead",
      person: "Rajesh Varma",
      decision: "Approved",
      status: "Approved",
      date: "18 Jun 2024",
    },
    {
      id: "rev-2",
      role: "Embedded Engineer",
      person: "Kavita Sharma",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-3",
      role: "Electronics Engineer",
      person: "Rohit Nair",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-4",
      role: "QA Engineer",
      person: "Neha Sharma",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-5",
      role: "Cybersecurity Engineer",
      person: "Dr. Alok Verma",
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

const DEFAULT_MOCK_RECORD: FirmwareDevelopmentRecord = {
  id: "fwd-rec-2024-0017",
  firmwareId: "FWD-2024-0017",
  formCode: "FWF-2024-25",
  firmwareProjectName: "Smart EV Charger – Firmware Development",
  firmwareVersion: "v2.1.0",
  status: "Under Review",
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",

  linkedEmbeddedDevelopmentId: "EMD-2024-0017",
  linkedEmbeddedDevelopmentTitle: "Smart EV Charger – Embedded Systems Development",
  linkedElectronicsDesignId: "EN-2024-0017",
  linkedElectronicsDesignTitle: "Smart EV Charger – Electronics Design",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Charger Pro",

  businessUnit: "Smart Mobility Division",
  firmwareLeadId: "usr-rajesh-varma",
  firmwareLeadName: "Rajesh Varma",
  firmwareLeadAvatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  lastUpdated: "20 Jun 2024 04:25 PM",

  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "2.1.0",

  stages: [
    {
      id: "firmware_architecture_implementation",
      label: "Stage 1: Firmware Architecture & Implementation",
      stageNumber: 1,
      status: "completed",
      description: "Configure HAL/BSP, middleware, application logic & git commits",
    },
    {
      id: "communication_security",
      label: "Stage 2: Communication & Security",
      stageNumber: 2,
      status: "completed",
      description: "Configure communication stack, diagnostics, secure boot & OTA update",
    },
    {
      id: "testing_release",
      label: "Stage 3: Testing & Release",
      stageNumber: 3,
      status: "completed",
      description: "Automated build pipeline, static analysis, unit/integration testing & release candidate",
    },
    {
      id: "engineering_review",
      label: "Stage 4: Engineering Review",
      stageNumber: 4,
      status: "in_progress",
      description: "Review Board approval & downstream Hardware Bring-up project creation",
    },
  ],

  input: DEFAULT_FIRMWARE_DEVELOPMENT_INPUT,
  ...calculateFirmwareDevelopmentScores(DEFAULT_FIRMWARE_DEVELOPMENT_INPUT),

  linkedHardwareBringupId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",

  auditTrail: [
    {
      at: "18 Jun 2024 10:15 AM",
      actor: "Rajesh Varma",
      event: "Firmware Development record created from approved Embedded Systems Development EMD-2024-0017, EN-2024-0017, PA-2024-0017, PRD-2024-0017",
      stage: "firmware_architecture_implementation",
      status: "Draft",
    },
    {
      at: "19 Jun 2024 02:30 PM",
      actor: "Rajesh Varma",
      event: "Completed Stage 1 & Stage 2 communication stack and secure boot validation",
      stage: "communication_security",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 11:00 AM",
      actor: "Rajesh Varma",
      event: "Completed CI/CD build #1428 and static analysis MISRA-C score (98%)",
      stage: "testing_release",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 04:25 PM",
      actor: "Rajesh Varma",
      event: "Submitted Firmware Release for Stage 4 Engineering Review Board",
      stage: "engineering_review",
      status: "Under Review",
    },
  ],
} as any;

export const getFirmwareDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
    const result = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveFirmwareDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<FirmwareDevelopmentFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateFirmwareDevelopmentScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).firmwareProjectName ?? "",
      ownerName: (base as any).firmwareLeadName ?? "Rajesh Varma",
      recordCode: (base as any).id ?? (base as any).firmwareId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceFirmwareDevelopmentStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: FirmwareDevelopmentStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      firmware_architecture_implementation: { label: "Stage 1: Firmware Architecture & Implementation", stageNumber: 1 },
      communication_security: { label: "Stage 2: Communication & Security", stageNumber: 2 },
      testing_release: { label: "Stage 3: Testing & Release", stageNumber: 3 },
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
      projectName: base.firmwareProjectName ?? "",
      ownerName: base.firmwareLeadName ?? "Rajesh Varma",
      recordCode: base.id ?? base.firmwareId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitFirmwareDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewFirmwareDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: FirmwareDevelopmentApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
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

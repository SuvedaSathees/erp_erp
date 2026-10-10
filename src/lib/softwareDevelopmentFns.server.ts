import { createServerFn } from "@tanstack/react-start";
import type {
  SoftwareDevelopmentApprovalDecision,
  SoftwareDevelopmentFormInput,
  SoftwareDevelopmentRecord,
  SoftwareDevelopmentStage,
  SoftwareDevelopmentStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";
import { withDefaults } from "./developmentTransform";

const MODULE_TYPE = "software-development";

export function calculateSoftwareDevelopmentScores(input: Partial<SoftwareDevelopmentFormInput>) {
  const developmentProgress = 88;
  const architectureReadiness = input.technologyReadinessScore ?? 87;
  const testingReadiness = Math.round(input.codeCoverage ?? 87.5);
  const deploymentReadiness = input.securityScore ?? 90;

  const overallSoftwareScore = Math.round(
    developmentProgress * 0.25 +
      architectureReadiness * 0.25 +
      testingReadiness * 0.25 +
      deploymentReadiness * 0.25
  );

  const aiCodeQualityScore = 88;
  const aiArchitectureAssessment = architectureReadiness;
  const aiPerformanceOptimization = 86;
  const aiSecurityAssessment = deploymentReadiness;
  const aiMaintainabilityAnalysis = 88;
  const aiTechnicalDebtAnalysis = 85;
  const aiOverallSoftwareScore = overallSoftwareScore;

  const highlights: string[] = [];
  highlights.push("Microservices architecture implemented");
  highlights.push("CI/CD pipeline with 95% automation");
  highlights.push(`Code coverage achieved ${testingReadiness}%`);
  highlights.push("Security score improved by 12%");
  highlights.push("All critical and major tests passed");

  return {
    summary: {
      overallSoftwareScore,
      developmentProgress,
      architectureReadiness,
      testingReadiness,
      deploymentReadiness,
      recommendation: "Proceed to System Integration",
    },
    aiAssessment: {
      aiOverallSoftwareScore,
      aiCodeQualityScore,
      aiArchitectureAssessment,
      aiPerformanceOptimization,
      aiSecurityAssessment,
      aiMaintainabilityAnalysis,
      aiTechnicalDebtAnalysis,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_SOFTWARE_DEVELOPMENT_INPUT: SoftwareDevelopmentFormInput = {
  // Panel 1: Software Project Overview
  productName: "Smart EV Platform",
  softwareName: "Smart EV Management System",
  developmentObjective:
    "Develop a scalable, secure and high performance platform for EV fleet management and analytics.",
  businessRequirements:
    "Real-time monitoring, analytics, alerts, reporting, user management and integration with EV devices.",
  functionalRequirements: "28 Modules",
  nonFunctionalRequirements: "High Availability, Scalability, Security, Performance, Usability",
  developmentStatus: "In Progress",
  techStackImageUrl:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",

  // Panel 2: Software Architecture
  architectureStyle: "Microservices",
  applicationArchitecture: "3-Tier Architecture",
  backendArchitecture: "Microservices with REST APIs",
  frontendArchitecture: "SPA with React",
  microservicesCount: 12,
  middleware: "Spring Cloud, Kafka, Redis",
  architectureStatus: "Verified",
  softwareArchitectureDiagramUrl:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",

  // Panel 3: Technology Stack
  frontendFramework: "React 18",
  backendFramework: "Spring Boot 3.2",
  programmingLanguages: ["Java", "TypeScript", "Python"],
  database: "PostgreSQL 15",
  cloudPlatform: "AWS",
  containerPlatform: "Docker / Kubernetes",
  technologyReadinessScore: 92,

  // Panel 4: API & Integration
  apiTypesList: [
    { name: "REST API", checked: true },
    { name: "GraphQL API", checked: true },
    { name: "WebSocket", checked: true },
  ],
  apiGateway: "Kong Gateway",
  thirdPartyApis: ["Stripe", "SendGrid", "Twilio", "Google Maps"],
  erpIntegration: "Magnertia ERP, SAP, Salesforce",
  apiStatus: "Active",

  // Panel 5: Database Design
  databaseType: "PostgreSQL",
  databaseSchemaLink: "Link to ER Diagram",
  masterTablesCount: 32,
  transactionTablesCount: 68,
  dataRetentionPolicy: "7 Years",
  backupStrategy: "Daily Incremental, Weekly Full",
  databaseReadinessScore: 90,

  // Panel 6: DevOps & CI/CD
  sourceCodeRepository: "GitHub",
  branchStrategy: "GitFlow",
  cicdPlatform: "GitHub Actions",
  buildPipeline: "Build, Test, Scan, Package",
  deploymentStrategy: "Blue-Green Deployment",
  monitoringPlatform: "Prometheus + Grafana",
  devOpsStatus: "Running",
  pipelineStages: [
    { id: "stage-1", name: "Code Commit", status: "completed" },
    { id: "stage-2", name: "Build", status: "completed" },
    { id: "stage-3", name: "Test", status: "completed" },
    { id: "stage-4", name: "Scan", status: "completed" },
    { id: "stage-5", name: "Deploy", status: "completed" },
  ],
  environments: [
    { name: "Dev", active: true },
    { name: "QA", active: true },
    { name: "Staging", active: true },
    { name: "Production", active: true, badgeColor: "bg-emerald-600 text-white" },
  ],

  // Panel 7: Security & Compliance
  authenticationMethod: "OAuth 2.0 + JWT",
  authorizationModel: "Role Based Access Control (RBAC)",
  encryptionStandard: "AES-256",
  apiSecurity: "Rate Limiting, IP Whitelisting, WAF",
  secureCodingStandard: "OWASP, SonarQube, SAST",
  regulatoryComplianceTags: ["GDPR", "ISO 27001", "SOC 2"],
  securityScore: 90,

  // Panel 8: Testing & Quality Assurance
  testItems: [
    { id: "test-1", name: "Unit Testing", status: "Completed", details: "JUnit & Jest test suites passed" },
    { id: "test-2", name: "Integration Testing", status: "Completed", details: "REST & Microservices contracts verified" },
    { id: "test-3", name: "System Testing", status: "Completed", details: "End-to-End user journeys passed" },
    { id: "test-4", name: "Performance Testing", status: "Completed", details: "JMeter load test: 10k req/sec" },
    { id: "test-5", name: "Security Testing", status: "Completed", details: "OWASP ZAP vulnerability scan clean" },
    { id: "test-6", name: "User Acceptance Testing", status: "In Progress", details: "Beta fleet management validation" },
  ],
  codeCoverage: 87.5,

  // Panel 9 & 10 Initialized dynamically
  aiAssessment: {
    aiOverallSoftwareScore: 88,
    aiCodeQualityScore: 88,
    aiArchitectureAssessment: 87,
    aiPerformanceOptimization: 86,
    aiSecurityAssessment: 90,
    aiMaintainabilityAnalysis: 88,
    aiTechnicalDebtAnalysis: 85,
  },
  summary: {
    overallSoftwareScore: 88,
    developmentProgress: 88,
    architectureReadiness: 87,
    testingReadiness: 88,
    deploymentReadiness: 90,
    recommendation: "Proceed to System Integration",
  },

  // Panel 11: Attachments
  attachments: [
    {
      id: "att-1",
      name: "Software_Architecture_Diagram.pdf",
      typeIcon: "pdf",
      size: "2.4 MB",
      category: "Architecture",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-2",
      name: "API_Documentation.pdf",
      typeIcon: "pdf",
      size: "1.8 MB",
      category: "API Docs",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-3",
      name: "Database_Design.pdf",
      typeIcon: "pdf",
      size: "2.1 MB",
      category: "Database",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-4",
      name: "Test_Reports.zip",
      typeIcon: "zip",
      size: "4.6 MB",
      category: "Test Suite",
      fileType: "application/zip",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-5",
      name: "Source_Code_Repository.zip",
      typeIcon: "zip",
      size: "512 MB",
      category: "Repository",
      fileType: "application/zip",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-6",
      name: "Deployment_Guide.pdf",
      typeIcon: "pdf",
      size: "1.3 MB",
      category: "DevOps",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-7",
      name: "Release_Notes_v1.2.0.pdf",
      typeIcon: "pdf",
      size: "0.9 MB",
      category: "Release",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
    {
      id: "att-8",
      name: "User_Documentation.pdf",
      typeIcon: "pdf",
      size: "3.2 MB",
      category: "User Guide",
      fileType: "application/pdf",
      url: "#",
      uploadedAt: "20 Jun 2024",
    },
  ],

  // Panel 12: Review & Approval Table
  reviewers: [
    {
      id: "rev-1",
      role: "Software Architect",
      person: "Rahul Sharma",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-2",
      role: "Development Lead",
      person: "Ananya Iyer",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-3",
      role: "DevOps Engineer",
      person: "Vikram Singh",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-4",
      role: "QA Manager",
      person: "Neha Verma",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-5",
      role: "Cybersecurity Lead",
      person: "Arjun Patel",
      decision: "Approved",
      status: "Approved",
      date: "20 Jun 2024",
    },
    {
      id: "rev-6",
      role: "Product Manager",
      person: "Rohit Nair",
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

const DEFAULT_MOCK_RECORD: SoftwareDevelopmentRecord = {
  id: "swd-rec-2024-0017",
  softwareId: "SWD-2024-0017",
  formCode: "SWF-2024-25",
  softwareProjectName: "Smart EV Management Platform",
  softwareVersion: "v1.2.0",
  status: "Under Review",
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",

  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductRoadmapId: "RM-2024-0012",
  linkedProductRoadmapTitle: "Smart Mobility Platform Roadmap 2024",
  linkedFirmwareDevelopmentId: "FWD-2024-0017",
  linkedFirmwareDevelopmentTitle: "Smart EV Charger – Firmware Development",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Platform",

  businessUnit: "Smart Mobility Division",
  softwareArchitectId: "usr-rahul-sharma",
  softwareArchitectName: "Rahul Sharma",
  softwareArchitectAvatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  lastUpdated: "20 Jun 2024 04:25 PM",

  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.2.0",

  stages: [
    {
      id: "software_architecture_planning",
      label: "Stage 1: Software Architecture & Planning",
      stageNumber: 1,
      status: "completed",
      description: "Define microservices, tech stack & application module specifications",
    },
    {
      id: "development_integration",
      label: "Stage 2: Development & Integration",
      stageNumber: 2,
      status: "completed",
      description: "Develop backend microservices, React SPA, REST/GraphQL APIs & database schema",
    },
    {
      id: "testing_deployment",
      label: "Stage 3: Testing & Deployment",
      stageNumber: 3,
      status: "completed",
      description: "Execute CI/CD build, automated SAST/DAST testing & deployment packages",
    },
    {
      id: "engineering_review",
      label: "Stage 4: Engineering Review",
      stageNumber: 4,
      status: "in_progress",
      description: "Review Board approval & downstream System Integration project creation/linking",
    },
  ],

  input: DEFAULT_SOFTWARE_DEVELOPMENT_INPUT,
  ...calculateSoftwareDevelopmentScores(DEFAULT_SOFTWARE_DEVELOPMENT_INPUT),

  linkedSystemIntegrationId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",

  auditTrail: [
    {
      at: "18 Jun 2024 10:15 AM",
      actor: "Rahul Sharma",
      event: "Software Development record created from approved Product Architecture PA-2024-0017, PRD-2024-0017, RM-2024-0012, FWD-2024-0017",
      stage: "software_architecture_planning",
      status: "Draft",
    },
    {
      at: "19 Jun 2024 02:30 PM",
      actor: "Rahul Sharma",
      event: "Completed 12 microservices development and API Gateway integration",
      stage: "development_integration",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 11:00 AM",
      actor: "Rahul Sharma",
      event: "Completed CI/CD automated deployment to staging and 87.5% code coverage validation",
      stage: "testing_deployment",
      status: "Draft",
    },
    {
      at: "20 Jun 2024 04:25 PM",
      actor: "Rahul Sharma",
      event: "Submitted Software Release for Stage 4 Engineering Review Board",
      stage: "engineering_review",
      status: "Under Review",
    },
  ],
} as any;

export const getSoftwareDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
    const result = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveSoftwareDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<SoftwareDevelopmentFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateSoftwareDevelopmentScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).softwareProjectName ?? "",
      ownerName: (base as any).softwareArchitectName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).softwareId ?? "",
    };
    const result = (withDefaults(DEFAULT_MOCK_RECORD, await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } })) as any);
    return { success: true, data: result as any };
  });

export const advanceSoftwareDevelopmentStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: SoftwareDevelopmentStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      software_architecture_planning: { label: "Stage 1: Software Architecture & Planning", stageNumber: 1 },
      development_integration: { label: "Stage 2: Development & Integration", stageNumber: 2 },
      testing_deployment: { label: "Stage 3: Testing & Deployment", stageNumber: 3 },
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
      projectName: base.softwareProjectName ?? "",
      ownerName: base.softwareArchitectName ?? "Rahul Sharma",
      recordCode: base.id ?? base.softwareId ?? "",
    };
    const result = (withDefaults(DEFAULT_MOCK_RECORD, await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } })) as any);
    return { success: true, data: result as any };
  });

export const submitSoftwareDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
    const current = withDefaults(DEFAULT_MOCK_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
    if (current?.id) {
      const result = (withDefaults(DEFAULT_MOCK_RECORD, await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } })) as any);
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewSoftwareDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: SoftwareDevelopmentApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
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

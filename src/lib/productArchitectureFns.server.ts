import { createServerFn } from "@tanstack/react-start";
import type {
  ProductArchitectureApprovalDecision,
  ProductArchitectureFormInput,
  ProductArchitectureRecord,
  ProductArchitectureStage,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";
import { withDefaults } from "./developmentTransform";

const MODULE_TYPE = "product-architecture";

export function calculateProductArchitectureScores(input: Partial<ProductArchitectureFormInput>) {
  const componentsCount = input.systemComponents ? input.systemComponents.split(",").length : 4;
  const functionalCoverage = Math.min(100, Math.max(70, Math.round(72 + componentsCount * 4)));
  const hwSwPresent = (input.hardwarePlatform ? 15 : 0) + (input.softwarePlatform ? 15 : 0) + (input.processingUnit ? 10 : 0);
  const technicalReadiness = Math.min(100, Math.max(70, Math.round(55 + hwSwPresent * 0.7)));
  const securityRiskScore = input.securityRiskScore ?? 92;
  const securityReadiness = Math.min(100, Math.max(65, Math.round(securityRiskScore * 0.95 + 4)));
  const protocolsCount = input.communicationProtocols?.length || 4;
  const standardsCount = input.standardsCompliance?.length || 4;
  const integrationReadiness = Math.min(100, Math.max(68, Math.round(60 + protocolsCount * 3.5 + standardsCount * 3)));
  const performanceScore = input.performanceScore ?? 88;
  const overallArchitectureScore = Math.round(
    functionalCoverage * 0.25 + technicalReadiness * 0.25 + securityReadiness * 0.2 + integrationReadiness * 0.15 + performanceScore * 0.15
  );
  const aiArchitectureQuality = Math.min(99, Math.max(75, Math.round(overallArchitectureScore * 0.98 + 3)));
  const aiScalabilityScore = Math.min(98, Math.max(72, Math.round(overallArchitectureScore * 0.96 + 3)));
  const aiSecurityAssessment = Math.min(99, Math.max(78, Math.round(securityReadiness * 0.98 + 2)));
  const aiOverallArchitectureScore = Math.round(aiArchitectureQuality * 0.4 + aiScalabilityScore * 0.3 + aiSecurityAssessment * 0.3);

  return {
    summary: { overallArchitectureScore, functionalCoverage, technicalReadiness, securityReadiness, integrationReadiness, performanceScore },
    aiAssessment: {
      aiOverallArchitectureScore, aiArchitectureQuality, aiScalabilityScore, aiSecurityAssessment,
      aiTechnologyRecommendation: input.aiAssessment?.aiTechnologyRecommendation || "Use Edge AI for Anomaly Detection",
      aiIntegrationAssessment: input.aiAssessment?.aiIntegrationAssessment || "Seamless with Cloud & ERP",
      aiRiskAnalysis: input.aiAssessment?.aiRiskAnalysis || "Low Risk",
    },
    keyHighlights: ["Microservices based scalable architecture", "Edge + Cloud hybrid deployment", "Compliant with IEC 61851, OCPP 1.6J", "Security by Design with end-to-end encryption"],
  };
}

const INITIAL_INPUT: ProductArchitectureFormInput = {
  architectureName: "Smart EV Charger Architecture",
  architectureVersion: "v1.0",
  businessUnit: "Smart Mobility Division",
  systemArchitectId: "usr-101",
  systemArchitectName: "Rohit Verma",
  systemArchitectAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",

  // Panel 1: Product Architecture Overview
  productName: "Smart EV Charger Pro",
  architectureVision: "Build a safe, intelligent, connected and scalable EV charging platform with high reliability and efficiency.",
  architectureObjective: "Create a modular architecture that enables smart charging, remote management, and future scalability.",
  architectureScope: "AC & DC charging, Payment, User Management, Monitoring, Analytics, OTA Updates.",
  designPrinciples: ["Modularity", "Scalability", "Security by Design", "Reliability", "High Performance", "Future Ready"],
  architectureStyle: "Microservices Architecture",
  overallDiagramName: "Overall_Architecture_v1.0.png",
  overallDiagramSize: "2.4 MB",

  // Panel 2: System Architecture
  systemName: "Smart EV Charging System",
  systemComponents: "Charging Unit, Control Unit, Communication Unit, User Interface, Cloud Platform",
  subsystems: "Power Subsystem, Control Subsystem, Communication Subsystem, User Subsystem, Safety Subsystem",
  functionalBlocks: "EV Interface, Power Conversion, Control & Monitoring, Communications, Payment, Analytics",
  externalInterfaces: "OCPP 1.6J, Payment Gateway, Grid Gateway",
  internalInterfaces: "CAN, UART, SPI, I2C, Ethernet, Wi-Fi",
  architectureStatusBadge: "Defined",
  systemDiagramUrl: "/diagrams/system_architecture.png",

  // Panel 3: Hardware Architecture
  hardwarePlatform: "ARM Cortex Based Controller",
  processingUnit: "STM32H7 Series MCU",
  sensors: ["Current Sensor", "Voltage Sensor", "Temp Sensor"],
  actuators: ["Relay", "Contactor", "Cooling Fan"],
  powerElectronics: "AC-DC PFC, DC-DC, Isolated Power Module",
  communicationInterfaces: ["Ethernet", "Wi-Fi", "4G LTE", "CAN", "RS485"],
  hardwareConstraints: "Operating Temp: -20°C to 70°C, IP65, EMI/EMC Compliant",

  // Panel 4: Software Architecture
  softwarePlatform: "Embedded Linux",
  operatingSystem: "Yocto Linux",
  firmwareComponents: "Bootloader, Device Drivers, BSP, RTOS",
  middleware: "Mosquitto MQTT, Nginx, Node-RED",
  applicationModules: "Charging Control, User Management, Payment, Monitoring, Analytics, OTA Topics",
  apisAndServices: "RESTful APIs, WebSocket, MQTT Topics",
  softwareConstraints: "Memory: 512MB, Storage: 8GB, Real-time Control",

  // Panel 5: Data & Communication Architecture
  dataFlow: "Device -> Edge -> Cloud -> Analytics -> App",
  dataSources: "Charger, EV, User App, Payment Gateway, Sensors",
  databaseTechnology: "PostgreSQL (Cloud)",
  communicationProtocols: ["OCPP 1.6J", "MQTT", "HTTPS", "WebSocket"],
  cloudIntegration: "AWS IoT Core, AWS Lambda, S3, RDS, CloudWatch",
  edgeComputing: true,
  dataSecurity: "TLS 1.3, AES-256, Secure Boot, Data Encryption",

  // Panel 6: Integration & Interoperability
  externalSystems: "EV, Payment Gateway, Utility, Fleet System",
  erpIntegration: "Magnertia ERP, CRM, Billing, Inventory",
  apiGateway: "Kong API Gateway",
  thirdPartyServices: "Stripe, Twilio, Google Maps, Email Service",
  standardsCompliance: ["IEC 61851", "ISO 15118", "OCPP 1.6J", "RoHS"],
  integrationRisks: "Network dependency, 3rd party API downtime",
  integrationStrategy: "Loose coupling, API-first, Event-driven",

  // Panel 7: Security & Compliance Architecture
  securityArchitecture: "Defense in Depth",
  authenticationMethod: "OAuth 2.0 + JWT",
  authorizationModel: "Role-Based Access Control (RBAC)",
  encryptionStandard: "AES-256 + TLS 1.3",
  regulatoryCompliance: ["IEC 61851", "ISO 27001", "GDPR"],
  cybersecurityControls: "Secure Boot, Firewall, IDS/IPS, OTA Signed Updates, Penetration Testing",
  securityRiskScore: 92,

  // Panel 8: Scalability & Performance
  expectedUsersDevices: "100,000+ Users / 50,000+ Chargers",
  throughput: "10,000 Messages / Sec",
  latencyTarget: "< 200 ms",
  availabilityTarget: "99.95 %",
  scalabilityStrategy: "Microservices, Auto Scaling, Load Balancer",
  disasterRecoveryPlan: "Multi-AZ Deployment, Daily Backup, Failover",
  performanceScore: 88,

  // Panel 9: AI Architecture Assessment
  aiAssessment: {
    aiOverallArchitectureScore: 89,
    aiArchitectureQuality: 89,
    aiScalabilityScore: 87,
    aiSecurityAssessment: 90,
    aiTechnologyRecommendation: "Use Edge AI for Anomaly Detection",
    aiIntegrationAssessment: "Seamless with Cloud & ERP",
    aiRiskAnalysis: "Low Risk",
  },

  // Panel 10: Attachments
  attachments: [
    { id: "att-1", name: "Architecture_Diagram.png", size: "2.4 MB", type: "png", uploadedAt: "18 Jun 2024" },
    { id: "att-2", name: "Hardware_Architecture.pdf", size: "2.1 MB", type: "pdf", uploadedAt: "18 Jun 2024" },
    { id: "att-3", name: "Block_Diagram.pdf", size: "1.8 MB", type: "pdf", uploadedAt: "18 Jun 2024" },
    { id: "att-4", name: "Software_Architecture.pdf", size: "3.3 MB", type: "pdf", uploadedAt: "18 Jun 2024" },
    { id: "att-5", name: "ICD_Document.pdf", size: "1.2 MB", type: "pdf", uploadedAt: "18 Jun 2024" },
    { id: "att-6", name: "Network_Diagram.png", size: "1.5 MB", type: "png", uploadedAt: "18 Jun 2024" },
    { id: "att-7", name: "Data_Flow_Diagram.pdf", size: "1.6 MB", type: "pdf", uploadedAt: "18 Jun 2024" },
    { id: "att-8", name: "Compliance_Documents.zip", size: "3.4 MB", type: "zip", uploadedAt: "18 Jun 2024" },
  ],

  // Panel 11: Review & Approval
  reviewers: [
    { id: "rev-1", role: "System Architect", person: "Rohit Verma", decision: "Approved", status: "Approved", date: "18 Jun 2024" },
    { id: "rev-2", role: "Product Owner", person: "Neha Sharma", decision: "Approved", status: "Approved", date: "18 Jun 2024" },
    { id: "rev-3", role: "Engineering Manager", person: "Vikram Singh", decision: "Approved", status: "Approved", date: "19 Jun 2024" },
    { id: "rev-4", role: "Security Lead", person: "Priya Nair", decision: "Pending", status: "Pending", date: "-" },
    { id: "rev-5", role: "QA Manager", person: "Arun Nair", decision: "Pending", status: "Pending", date: "-" },
    { id: "rev-6", role: "CTO", person: "Dr. Anil Patel", decision: "Pending", status: "Pending", date: "-" },
  ],
  approvalDecision: null,
  reviewComments: "",
  approvalDate: new Date().toISOString().split("T")[0],
};

const currentRecordDefault: ProductArchitectureRecord = {
  id: "pa-rec-0017",
  architectureId: "PA-2024-0017",
  formCode: "PA-2024-25",
  architectureName: "Smart EV Charger Architecture",
  architectureVersion: "v1.0",
  status: "Under Review",
  currentStage: "executive_review",
  currentStageLabel: "Architecture Review",
  createdOn: "20 Apr 2024 10:15 AM",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger Pro PRD",
  linkedProductId: "prd-1001",
  linkedProductName: "Smart EV Charger Pro",
  linkedRoadmapId: "PRM-2024-0017",
  linkedRoadmapName: "EV Charger Roadmap 2024-27",
  businessUnit: "Smart Mobility Division",
  systemArchitectId: "usr-101",
  systemArchitectName: "Rohit Verma",
  systemArchitectAvatar: "",
  lastUpdated: "18 Jun 2024 04:25 PM",
  dateCreated: "20 Apr 2024 10:15 AM",
  lastModified: "18 Jun 2024 04:25 PM",
  version: "v1.0",
  stages: [],
  input: INITIAL_INPUT,
  ...calculateProductArchitectureScores({}),
  linkedSystemDesignId: null,
  auditTrail: [],
} as any;

export const getProductArchitectureFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = withDefaults(currentRecordDefault, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
  if (result) return { success: true, data: result };
  return { success: true, data: currentRecordDefault };
});

export const saveProductArchitectureDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: ProductArchitectureFormInput }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: data.input.architectureName ?? "",
      ownerName: data.input.systemArchitectName ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const advanceProductArchitectureStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: ProductArchitectureStage }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: currentRecordDefault };
  });

export const submitProductArchitectureFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async ({ data }) => {
    const id = data || currentRecordDefault.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result };
  });

export const reviewProductArchitectureFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ProductArchitectureApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Executive Review Board",
        reviewerName: "Executive Review Board",
      },
    });
    return { success: true, data: result };
  });

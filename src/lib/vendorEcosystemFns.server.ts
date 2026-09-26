import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "vendor-ecosystem";

const DEFAULT_RECORD: any = {
  vendorEcosystemId: "VE-2024-00058",
  formCode: "VEF-2024-25",
  vendorDevelopmentProject: "Strategic Vendor Ecosystem",
  vendorDevelopmentNumber: "VEDN-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "EV Solutions",
  vendorCategory: "Raw Material Supplier",
  vendorDevelopmentManager: "Rahul Sharma",
  createdDate: "05 May 2024 10:15 AM",
  lastModifiedDate: "17 May 2024 04:20 PM",
  workflowStage: "Vendor Evaluation",
  businessObjective: "Build a resilient and efficient vendor ecosystem that ensures quality, cost competitiveness, and supply continuity.",
  procurementObjective: "Develop strategic supplier base to achieve cost optimization and operational excellence.",
  commodityCategory: ["Metals", "Plastics", "Electronics", "Packaging"],
  geographicCoverage: ["India", "East Asia", "Europe", "North America"],
  strategicImportance: "High",
  lifecycleStage: "Vendor Evaluation",
  priority: "High",
  vendorName: "GreenMetal Industries Pvt. Ltd.",
  organizationType: "Private Limited",
  companyRegistration: "U29299MH2010PTC210987",
  employeeStrength: 1250,
  manufacturingLocations: ["Pune, India", "Chennai, India", "Vietnam"],
  certifications: ["ISO 9001", "ISO 14001", "IATF 16949"],
  annualTurnover: 2500000000,
  vendorCapabilityScore: 86,
  financialStability: "Strong",
  qualityCapability: "Very Good",
  productionCapacity: "Advanced",
  technologyCapability: "Advanced",
  deliveryCapability: "Very Good",
  esgCompliance: "Good",
  supplierAuditStatus: true,
  dueDiligenceCompleted: true,
  qualificationScore: 84,
  contractType: "Annual Rate Contract (ARC)",
  paymentTerms: "Net 30",
  pricingAgreement: "ARC-2024-GM-001",
  annualProcurementValue: 500000000,
  creditPeriod: 30,
  contractValidity: "01 Jun 2024 - 31 May 2026",
  ndaSigned: true,
  commercialScore: 82,
  erpIntegration: true,
  ediEnabled: true,
  inventoryVisibility: true,
  logisticsIntegration: true,
  vendorManagedInventory: true,
  forecastSharing: true,
  integrationReadinessScore: 88,
  isoCertifications: ["ISO 9001", "ISO 14001", "ISO 45001"],
  ppapApproved: true,
  apqpCompliance: true,
  pfmeaAvailable: true,
  controlPlanAvailable: true,
  capaProcess: true,
  supplierQualityScore: 87,
  onTimeDelivery: 96,
  supplierPpm: 120,
  leadTime: 15,
  overallPerformanceScore: 86,
  supplyRisk: "Medium",
  financialRisk: "Low",
  geopoliticalRisk: "Low",
  singleSourceRisk: true,
  businessContinuityPlan: true,
  riskMitigationPlan: "Dual sourcing strategy, safety stock maintenance, and regular audit.",
  riskScore: 72,
  aiVendorRanking: "Top 15% in the category",
  aiCostOptimization: "Potential savings of ₹ 4.2 Cr annually",
  aiDemandForecast: "Strong demand stability for next 24 months",
  aiSupplierRiskPrediction: "Low risk with 92% confidence",
  aiAlternativeSupplierRecommendation: "2 alternative vendors identified",
  aiProcurementOptimization: "Recommend long-term ARC contract",
  aiVendorScore: 89,
  recommendation: "Approve Vendor",
  approvals: [
    { role: "Vendor Dev Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "1,250 employees, 3 manufacturing plants & 86% capability score validated." },
    { role: "Procurement Manager", user: "Vikram Mehta", status: "Approved", date: "09 May 2024", comments: "₹50 Cr annual spend and ARC agreement terms approved." },
    { role: "Supply Chain Manager", user: "Anita Verma", status: "Approved", date: "10 May 2024", comments: "ERP, EDI, and VMI supply chain integrations verified." },
    { role: "Quality Manager", user: "Neha Singh", status: "Approved", date: "11 May 2024", comments: "ISO 9001/14001 and PPAP approval complete (120 PPM)." },
    { role: "Finance Manager", user: "Neha Jain", status: "Approved", date: "12 May 2024", comments: "Net 30 payment terms and financial solvency verified." },
    { role: "Legal Manager", user: "Rajat Kapoor", status: "Pending", date: "In Review", comments: "Master Supply Agreement IPR and indemnification review." },
    { role: "COO", user: "Anant Agarwal", status: "Pending", date: "Awaiting", comments: "" },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Strong supplier capability & 85/100 Overall Score (88 Integration, 87 Quality, ₹4.2 Cr AI Savings). Approved for Onboarding.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Vendor_Registration.pdf", type: "PDF Document", size: "512 KB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Company_Profile.pdf", type: "PDF Document", size: "740 KB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Financial_Statements.pdf", type: "PDF Document", size: "2.3 MB", date: "16 May 2024", uploader: "Neha Jain" },
    { id: "4", name: "Quality_Certificates.pdf", type: "PDF Document", size: "956 KB", date: "15 May 2024", uploader: "Neha Singh" },
    { id: "5", name: "Audit_Report.pdf", type: "PDF Document", size: "1.1 MB", date: "14 May 2024", uploader: "Neha Singh" },
    { id: "6", name: "NDA_Contracts.pdf", type: "PDF Document", size: "1.8 MB", date: "13 May 2024", uploader: "Rajat Kapoor" },
    { id: "7", name: "ESG_Report.pdf", type: "PDF Document", size: "860 KB", date: "12 May 2024", uploader: "Anita Verma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "04:20 PM", user: "Rahul Sharma", action: "Updated Procurement Spend (₹50 Cr) and AI Cost Optimization (₹4.2 Cr)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Rajat Kapoor", action: "Uploaded NDA_Contracts.pdf and Audit_Report.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Vendor Score (89/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Neha Jain", action: "Finance Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:15 AM", user: "Rahul Sharma", action: "Vendor Ecosystem Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.vendorDevelopmentProject ?? "",
    ownerName: record.vendorDevelopmentManager ?? "",
    recordCode: record.id ?? record.vendorEcosystemId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getVendorEcosystemFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveVendorEcosystemDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitVendorEcosystemFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewVendorEcosystemFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const c = await getOrDefault();
    c.approvalDecision = data.decision;
    c.reviewComments = data.comments ?? "";
    c.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : c.workflowStatus;
    return await saveRecord(c);
  });

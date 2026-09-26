import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "export-development";

const DEFAULT_RECORD: any = {
  exportId: "EXP-2024-00078",
  formCode: "EXPF-2024-25",
  exportProject: "Industrial Valves Export - Europe",
  exportNumber: "EXP-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Global Business",
  productCategory: "Industrial Valves",
  exportManager: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Customer Acquisition",
  businessObjective: "Expand industrial valve business in European markets and achieve sustainable export growth.",
  exportObjective: "Establish long-term export business with distributors in target country.",
  targetCountry: "Germany",
  countryFlag: "🇩🇪",
  targetCustomerSegments: ["OEMs", "Distributors", "Industrial End Users"],
  exportBusinessModel: "Direct Export",
  exportStrategy: "Market Penetration",
  strategicPriority: "High",
  lifecycleStage: "Customer Acquisition",
  marketResearchRef: "MR-2024-00045",
  marketSize: 12500000000,
  exportDemand: 82,
  competitionLevel: "Medium",
  importRegulations: "CE Certification, REACH compliance and local technical standards mandatory.",
  tradeAgreement: "India - EU FTA",
  marketReadinessScore: 78,
  customerType: "Distributor",
  buyerDatabase: "EuroValves GmbH",
  distributorDealer: "EuroValves GmbH",
  channelPartner: "Industrial Solutions EU",
  rfqReceived: true,
  exportOrderProbability: 68,
  customerReadinessScore: 75,
  productCertifications: ["CE Marking", "ISO 9001", "PED Certified"],
  hsCode: "8481.80.90",
  countryCompliance: true,
  exportInspectionRequired: true,
  certificateOfOrigin: true,
  productLocalization: true,
  complianceReadinessScore: 75,
  pricingStrategy: "Value Based Pricing",
  incoterms: "FOB",
  exportCurrency: "EUR - Euro",
  paymentTerms: "Letter of Credit (LC)",
  exportPrice: 125000,
  grossMargin: 28.5,
  commercialReadinessScore: 82,
  shippingMode: "Sea Freight (FCL)",
  freightForwarder: "Oceanic Logistics Ltd.",
  cha: "Global Customs Services",
  portOfLoading: "Nhava Sheva (INNSA)",
  portOfDestination: "Hamburg (DEHAM)",
  packingListReady: true,
  commercialInvoiceReady: true,
  shippingBillReady: true,
  logisticsReadinessScore: 78,
  adBank: "HDFC Bank (IN)",
  iecNumber: "0512345678",
  letterOfCredit: true,
  advancePayment: true,
  ecgcInsurance: true,
  marineInsurance: true,
  paymentTracking: "LC Opened",
  financialReadinessScore: 85,
  shipmentDate: "2024-05-25",
  containerNumber: "MSCU1234567",
  billOfLadingAWB: "HBLU1234567890",
  customsClearance: true,
  shipmentTracking: "SHPT-2024-000789",
  deliveryStatus: "In Transit",
  deliveryPerformanceScore: 83,
  aiExportOpportunity: "High demand for industrial valves in EU.",
  aiCountryRecommendation: "Germany is the best fit for expansion.",
  aiPricingOptimization: "Recommended price between €120K - €130K.",
  aiLogisticsOptimization: "Sea Freight (FCL) gives best cost efficiency.",
  aiRiskPrediction: "Low regulatory risk, Medium FX risk.",
  aiExportRecommendation: "Proceed with LC payment and FOB terms.",
  aiExportScore: 88,
  marketScore: 82,
  customerScore: 75,
  complianceScore: 80,
  commercialScore: 82,
  logisticsScore: 78,
  financialScore: 85,
  deliveryScore: 83,
  recommendation: "Proceed to Export",
  approvals: [
    { role: "Export Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "Direct export structure & EuroValves GmbH contract ready." },
    { role: "Intl Sales Head", user: "Michael Chang", status: "Approved", date: "09 May 2024", comments: "€125K FOB price and 28.5% gross margin approved." },
    { role: "Finance Manager", user: "Anita Verma", status: "Approved", date: "10 May 2024", comments: "HDFC LC opened & ECGC insurance cover verified." },
    { role: "Logistics Manager", user: "Vikram Singh", status: "Approved", date: "11 May 2024", comments: "Sea Freight FCL via Nhava Sheva booked." },
    { role: "Compliance Manager", user: "Neha Kapoor", status: "Approved", date: "12 May 2024", comments: "PED and CE compliance certificates attached." },
    { role: "Legal Manager", user: "Arjun Desai", status: "Pending", date: "In Review", comments: "Trade agreement terms review." },
    { role: "COO", user: "Amit Mehta", status: "Pending", date: "In Review", comments: "Manufacturing schedule check." },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Excellent export feasibility & 83/100 Overall Score (88 AI Score, 85 Financial, €125K FOB Contract). Approved.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Export_Business_Plan.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Commercial_Invoice.pdf", type: "PDF Document", size: "1.5 MB", date: "16 May 2024", uploader: "Anita Verma" },
    { id: "3", name: "Packing_List.pdf", type: "PDF Document", size: "850 KB", date: "16 May 2024", uploader: "Vikram Singh" },
    { id: "4", name: "Purchase_Order.pdf", type: "PDF Document", size: "1.2 MB", date: "15 May 2024", uploader: "Michael Chang" },
    { id: "5", name: "Shipping_Bill.pdf", type: "PDF Document", size: "1.8 MB", date: "14 May 2024", uploader: "Vikram Singh" },
    { id: "6", name: "Bill_of_Lading_AWB.pdf", type: "PDF Document", size: "1.4 MB", date: "13 May 2024", uploader: "Vikram Singh" },
    { id: "7", name: "Certificate_of_Origin.pdf", type: "PDF Document", size: "900 KB", date: "12 May 2024", uploader: "Neha Kapoor" },
    { id: "8", name: "Insurance_Certificate.pdf", type: "PDF Document", size: "1.1 MB", date: "11 May 2024", uploader: "Anita Verma" },
    { id: "9", name: "Export_Licenses.pdf", type: "PDF Document", size: "2.8 MB", date: "10 May 2024", uploader: "Neha Kapoor" },
    { id: "10", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "3.5 MB", date: "09 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "04:30 PM", user: "Rahul Sharma", action: "Updated Container Number (MSCU1234567) and Delivery Status (In Transit)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Vikram Singh", action: "Uploaded Bill_of_Lading_AWB.pdf and Shipping_Bill.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Export Score (88/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Neha Kapoor", action: "Compliance Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:15 AM", user: "Rahul Sharma", action: "Export Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.exportProject ?? "",
    ownerName: record.exportManager ?? "",
    recordCode: record.id ?? record.exportId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getExportDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveExportDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitExportDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewExportDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const c = await getOrDefault();
    c.approvalDecision = data.decision;
    c.reviewComments = data.comments ?? "";
    c.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : c.workflowStatus;
    return await saveRecord(c);
  });

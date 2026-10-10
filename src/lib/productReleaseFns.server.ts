import { createServerFn } from "@tanstack/react-start";
import type {
  ProductReleaseApprovalDecision,
  ProductReleaseFormInput,
  ProductReleaseRecord,
  ProductReleaseStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";
import { withDefaults } from "./developmentTransform";

const MODULE_TYPE = "product-release";

export function calculateReleaseScores(record: Partial<ProductReleaseRecord>) {
  const engScore = record.engineeringScore ?? 92;
  const mfgScore = record.manufacturingScore ?? 90;
  const comScore = record.commercialScore ?? 88;
  const riskScore = record.riskScore ?? 80;
  const depScore = record.deploymentScore ?? 89;
  const aiScore = record.aiReleaseScore ?? 91;
  const overallScore = Math.round(engScore * 0.25 + mfgScore * 0.25 + comScore * 0.20 + riskScore * 0.15 + depScore * 0.15);
  return { engineeringScore: engScore, manufacturingScore: mfgScore, commercialScore: comScore, riskScore, deploymentScore: depScore, aiReleaseScore: aiScore, overallReleaseScore: overallScore };
}

export const DEFAULT_PRODUCT_RELEASE_RECORD: ProductReleaseRecord = {
  id: "rel-rec-0053",
  releaseId: "REL-2024-0053",
  formCode: "RLF-2024-25",
  releaseProjectName: "Smart EV Charger Launch",
  releaseVersion: "v1.2.0",
  workflowStatus: "In Progress",
  stage: 2,
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-19T11:20:00Z",
  lastUpdated: "19 Jun 2024 11:20 AM",

  linkedProduct: { id: "PRD-EV-7KW", name: "Smart EV Charger AC 7kW" },
  linkedDocumentation: { id: "DOC-2024-0087", code: "DOC-2024-0087" },
  releaseManager: {
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    email: "rahul.sharma@magnertia.com",
  },
  plannedReleaseDate: "30 Jun 2024",
  releaseType: "Production Release",
  releasePriority: "High",

  // Overview
  productName: "Smart EV Charger AC 7kW",
  productCategory: "AC EV Charger",
  releaseName: "Smart EV Charger v1.2 Launch",
  releaseObjective: "Official launch of Smart EV Charger AC 7kW v1.2 in India and select global markets.",
  targetMarkets: ["India", "EU", "USA", "MEA"],

  // Section 2: Engineering Release Readiness Checklist
  engineeringChecklist: [
    { id: "eng-1", label: "Engineering Approved", completed: true, sourceStream: "Engineering" },
    { id: "eng-2", label: "Design Freeze Completed", completed: true, sourceStream: "Product Architecture" },
    { id: "eng-3", label: "Prototype Approved", completed: true, sourceStream: "Prototype Development" },
    { id: "eng-4", label: "Testing Completed", completed: true, sourceStream: "Testing & Validation" },
    { id: "eng-5", label: "Certification Completed", completed: true, sourceStream: "Certification Readiness" },
    { id: "eng-6", label: "Documentation Completed", completed: true, sourceStream: "Product Documentation" },
  ],
  engineeringScore: 92,

  // Section 3: Manufacturing Readiness Checklist
  manufacturingChecklist: [
    { id: "mfg-1", label: "Manufacturing SOP Approved", completed: true, sourceStream: "Manufacturing" },
    { id: "mfg-2", label: "Production Line Ready", completed: true, sourceStream: "Industrialization" },
    { id: "mfg-3", label: "BOM Released", completed: true, sourceStream: "PLM & Engineering" },
    { id: "mfg-4", label: "Tooling Approved", completed: true, sourceStream: "Tooling & Fixtures" },
    { id: "mfg-5", label: "Supplier Readiness", completed: true, sourceStream: "Supply Chain" },
    { id: "mfg-6", label: "Packaging Approved", completed: true, sourceStream: "Packaging & Logistics" },
  ],
  manufacturingScore: 90,

  // Section 4: Commercial Readiness Checklist
  commercialChecklist: [
    { id: "com-1", label: "Product Pricing (₹ 23,999.00)", completed: true, sourceStream: "Finance & Sales" },
    { id: "com-2", label: "Sales Kit Available", completed: true, sourceStream: "Sales & Marketing" },
    { id: "com-3", label: "Marketing Material Ready", completed: true, sourceStream: "Marketing" },
    { id: "com-4", label: "Website Updated", completed: true, sourceStream: "Digital Marketing" },
    { id: "com-5", label: "Dealer Training Completed", completed: true, sourceStream: "Channel Operations" },
    { id: "com-6", label: "Customer Support Ready", completed: true, sourceStream: "Customer Success" },
  ],
  productPricing: "₹ 23,999.00",
  commercialScore: 88,

  // Section 5: Deployment & Distribution
  releaseChannels: ["Direct Sales", "Dealer Network", "E-Commerce"],
  deploymentRegions: ["India", "EU", "USA"],
  distributionPartner: "EV Distributors Pvt. Ltd.",
  inventoryAvailable: 2450,
  inventoryUnits: "Units",
  rolloutStrategy: "Phased Rollout",
  deploymentScore: 89,

  // Section 6: Risk & Compliance Review
  openRisksCount: 3,
  criticalRisksCount: 1,
  capaClosed: true,
  regulatoryApproval: true,
  warrantyPolicyApproved: true,
  riskScore: 80,

  // Section 7: AI Release Assessment
  aiReleaseReadinessReview: "Good",
  aiDeploymentRiskAnalysis: "Low",
  aiCommercialReadiness: "High",
  aiLaunchRecommendation: "Proceed with Launch",
  aiImprovementSuggestions: "2 Suggestions available for supply buffer.",
  aiReleaseScore: 91,

  // Section 8: Release Summary & Gauges
  overallReleaseScore: 88,
  recommendation: "Ready for Product Launch",

  // Section 9: Attachments Grid
  attachments: [
    { id: "att-1", name: "release_checklist_v1.2.pdf", size: "1.2 MB", type: "pdf", uploadDate: "18 Jun 2024", category: "Checklist" },
    { id: "att-2", name: "documentation_package.zip", size: "24.5 MB", type: "zip", uploadDate: "18 Jun 2024", category: "Documentation" },
    { id: "att-3", name: "marketing_kit_v1.2.pptx", size: "18.6 MB", type: "pptx", uploadDate: "18 Jun 2024", category: "Marketing" },
    { id: "att-4", name: "release_notes_v1.2.pdf", size: "1.1 MB", type: "pdf", uploadDate: "18 Jun 2024", category: "Release Notes" },
    { id: "att-5", name: "manufacturing_package.zip", size: "32.2 MB", type: "zip", uploadDate: "18 Jun 2024", category: "Manufacturing" },
    { id: "att-6", name: "training_material_v1.2.pdf", size: "9.7 MB", type: "pdf", uploadDate: "18 Jun 2024", category: "Training" },
    { id: "att-7", name: "ai_release_report.pdf", size: "2.4 MB", type: "pdf", uploadDate: "18 Jun 2024", category: "AI Report" },
    { id: "att-8", name: "supporting_documents.zip", size: "5.6 MB", type: "zip", uploadDate: "18 Jun 2024", category: "General" },
  ],

  // Section 10: Review & Approval Table
  reviewers: [
    { id: "rev-1", role: "Release Manager", person: "Rahul Sharma", decision: "Approved", date: "18 Jun 2024", comments: "All good", status: "Completed", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-2", role: "Engineering Manager", person: "Nisha Verma", decision: "Approved", date: "18 Jun 2024", comments: "Engineering complete", status: "Completed", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-3", role: "Manufacturing Manager", person: "Vikram Singh", decision: "Approved", date: "18 Jun 2024", comments: "Production ready", status: "Completed", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-4", role: "Quality Manager", person: "Amit Patel", decision: "Approved", date: "18 Jun 2024", comments: "Compliant", status: "Completed", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-5", role: "Sales & Marketing Head", person: "Neha Reddy", decision: "Approved", date: "18 Jun 2024", comments: "Go to market ready", status: "Completed", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-6", role: "COO", person: "Arun Kumar", decision: "Approved", date: "19 Jun 2024", comments: "Approved", status: "Completed", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-7", role: "CEO", person: "Sankaran R.", decision: "Pending", date: "-", comments: "Final approval", status: "Pending", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
  ],
  approvalDecision: "Approved",
  reviewComments: "All departments are aligned. Proceed with product launch.",
  approvalDate: "19 Jun 2024",

  // Section 11: System Information
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 10:15 AM",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "19 Jun 2024 11:20 AM",
  commercialDate: "19 Jun 2024 11:20 AM",
  workflowStageLabel: "Executive Review",

  // Release Timeline Milestones
  releaseTimeline: [
    { id: "ms-1", title: "Release Project Created", date: "18 Jun 2024 10:15 AM", completed: true, stageNumber: 1 },
    { id: "ms-2", title: "Engineering Review", date: "18 Jun 2024 02:30 PM", completed: true, stageNumber: 1 },
    { id: "ms-3", title: "Manufacturing Review", date: "18 Jun 2024 05:45 PM", completed: true, stageNumber: 1 },
    { id: "ms-4", title: "Commercial Review", date: "19 Jun 2024 09:10 AM", completed: true, stageNumber: 2 },
    { id: "ms-5", title: "Executive Review", date: "19 Jun 2024 11:00 AM", completed: true, stageNumber: 3 },
    { id: "ms-6", title: "Product Launch", date: "30 Jun 2024 (Planned)", completed: false, stageNumber: 3 },
  ],

  auditTrail: [
    { id: "aud-1", timestamp: "18 Jun 2024 10:15 AM", user: "Rahul Sharma", action: "Record Created", details: "Product Release Management project REL-2024-0053 created.", ipAddress: "192.168.1.42" },
    { id: "aud-2", timestamp: "18 Jun 2024 02:30 PM", user: "Nisha Verma", action: "Engineering Verification", details: "Engineering, Design Freeze, Prototype, Testing, Certification & Documentation verified.", ipAddress: "192.168.1.55" },
    { id: "aud-3", timestamp: "18 Jun 2024 05:45 PM", user: "Vikram Singh", action: "Manufacturing Line Verification", details: "SOP, Production Line, BOM, Tooling & Packaging verified.", ipAddress: "192.168.1.18" },
    { id: "aud-4", timestamp: "19 Jun 2024 09:10 AM", user: "Neha Reddy", action: "Commercial Readiness", details: "Pricing ₹23,999, Sales Kit, Marketing Materials, Website & Support verified.", ipAddress: "192.168.1.88" },
    { id: "aud-5", timestamp: "19 Jun 2024 11:00 AM", user: "Arun Kumar", action: "Stage 3 Executive Submission", details: "Submitted for Executive Board Review and Product Launch Authorization.", ipAddress: "192.168.1.99" },
  ],
} as any;

export const getProductReleaseFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = withDefaults(DEFAULT_PRODUCT_RELEASE_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_PRODUCT_RELEASE_RECORD };
});

export const saveProductReleaseDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ProductReleaseFormInput> }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: (data.input as any).releaseProjectName ?? "",
      ownerName: (data.input as any).releaseManager?.name ?? "",
    };
    const result = (withDefaults(DEFAULT_PRODUCT_RELEASE_RECORD, await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } })) as any);
    return { success: true, data: result };
  });

export const submitProductReleaseFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async ({ data }) => {
    const id = data || DEFAULT_PRODUCT_RELEASE_RECORD.id;
    const result = (withDefaults(DEFAULT_PRODUCT_RELEASE_RECORD, await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } })) as any);
    return { success: true, data: result };
  });

export const reviewProductReleaseFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ProductReleaseApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = (withDefaults(DEFAULT_PRODUCT_RELEASE_RECORD, await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Executive Board",
        reviewerName: "Sankaran R.",
      },
    })) as any);
    return { success: true, data: result };
  });

export const advanceReleaseStageFn = createServerFn({ method: "POST" })
  .validator((data: { targetStage: 1 | 2 | 3 }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRODUCT_RELEASE_RECORD };
  });

export const toggleChecklistItemFn = createServerFn({ method: "POST" })
  .validator((data: { section: "engineering" | "manufacturing" | "commercial"; itemId: string }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRODUCT_RELEASE_RECORD };
  });

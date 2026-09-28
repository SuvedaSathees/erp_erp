import { queryOptions } from "@tanstack/react-query";

export type KnowledgeOverviewData = {
  kpis: {
    totalKnowledgeAssets: { value: string; delta: string; isPositive: boolean };
    activeSops: { value: string; delta: string; isPositive: boolean };
    documentVault: { value: string; delta: string; isPositive: boolean };
    bestPractices: { value: string; delta: string; isPositive: boolean };
    controlledTemplates: { value: string; caption: string };
    publishedWikis: { value: string; caption: string };
    techSpecs: { value: string; caption: string };
    pendingSopReviews: { value: string; caption: string };
    trainingCompliance: { value: string; caption: string };
    lessonsLearned: { value: string; delta: string; isPositive: boolean };
  };
  trendData: Array<{
    month: string;
    published: number;
    views: number;
    rate: number;
  }>;
  healthSummary: {
    verifiedSops: string;
    pendingAudits: string;
    archivedDocs: string;
    activeAuthors: string;
    trainingCompletion: string;
    iso9001Score: string;
    avgAccessLatency: string;
  };
  operationsLedger: Array<{
    id: string;
    documentNumber: string;
    title: string;
    type: string;
    version: string;
    department: string;
    author: string;
    status: "Published" | "Under Review" | "Approved" | "Revision";
    effectiveDate: string;
  }>;
  alerts: Array<{
    id: string;
    severity: "Critical" | "Warning" | "Info";
    title: string;
    description: string;
    timestamp: string;
    actionLabel: string;
  }>;
  aiInsights: Array<{
    id: string;
    tag: string;
    title: string;
    detail: string;
    impact: string;
  }>;
};

export const MOCK_KNOWLEDGE_OVERVIEW: KnowledgeOverviewData = {
  kpis: {
    totalKnowledgeAssets: { value: "3,420", delta: "12.6% vs. PY", isPositive: true },
    activeSops: { value: "241", delta: "9.3% vs. PY", isPositive: true },
    documentVault: { value: "1,248", delta: "15.2% vs. PY", isPositive: true },
    bestPractices: { value: "86", delta: "8.9% vs. PY", isPositive: true },
    controlledTemplates: { value: "156", caption: "Controlled Forms & Schemas" },
    publishedWikis: { value: "256", caption: "Collaborative Base" },
    techSpecs: { value: "842", caption: "Engineering Vault" },
    pendingSopReviews: { value: "14", caption: "14 SOPs awaiting signoff" },
    trainingCompliance: { value: "94.8%", caption: "512 certified staff" },
    lessonsLearned: { value: "124", delta: "6.4% vs. PY", isPositive: true },
  },
  trendData: [
    { month: "Apr", published: 24, views: 320, rate: 88 },
    { month: "May", published: 32, views: 410, rate: 90 },
    { month: "Jun", published: 40, views: 490, rate: 92 },
    { month: "Jul", published: 36, views: 540, rate: 91 },
    { month: "Aug", published: 48, views: 630, rate: 94 },
    { month: "Sep", published: 54, views: 720, rate: 95 },
    { month: "Oct", published: 50, views: 780, rate: 95 },
    { month: "Nov", published: 62, views: 880, rate: 97 },
    { month: "Dec", published: 58, views: 860, rate: 97 },
    { month: "Jan", published: 66, views: 950, rate: 98 },
    { month: "Feb", published: 72, views: 1020, rate: 98 },
    { month: "Mar", published: 78, views: 1110, rate: 99 },
  ],
  healthSummary: {
    verifiedSops: "238 / 241 (98.7%)",
    pendingAudits: "(14 SOPs)",
    archivedDocs: "(42 Docs)",
    activeAuthors: "84 Authors",
    trainingCompletion: "94.8%",
    iso9001Score: "99.2%",
    avgAccessLatency: "1.2s",
  },
  operationsLedger: [
    {
      id: "doc-1",
      documentNumber: "SOP-MFG-089",
      title: "Cleanroom Class 10k Assembly & Gowning Protocol",
      type: "Standard Operating Procedure",
      version: "v4.2",
      department: "Manufacturing & QA",
      author: "Rajesh Kumar",
      status: "Published",
      effectiveDate: "2026-03-24",
    },
    {
      id: "doc-2",
      documentNumber: "TS-ENG-304",
      title: "High-Voltage Fast Charger Busbar Thermal Analysis",
      type: "Technical Specification",
      version: "v2.1",
      department: "R&D Engineering",
      author: "Dr. Elena Rostova",
      status: "Published",
      effectiveDate: "2026-03-22",
    },
    {
      id: "doc-3",
      documentNumber: "SOP-EHS-014",
      title: "Lithium-Ion Battery Cell Storage & Thermal Runaway Mitigation",
      type: "Safety SOP",
      version: "v3.0",
      department: "EHS & Safety",
      author: "Priya Sundaram",
      status: "Under Review",
      effectiveDate: "2026-03-28",
    },
    {
      id: "doc-4",
      documentNumber: "BP-QA-052",
      title: "AOI Solder Joint Inspection Thresholds for EV Power Electronics",
      type: "Best Practice",
      version: "v1.4",
      department: "Quality Assurance",
      author: "Arun Nair",
      status: "Published",
      effectiveDate: "2026-03-18",
    },
    {
      id: "doc-5",
      documentNumber: "TPL-ENG-009",
      title: "PPAP Level 3 Submission Checklist & Control Plan Form",
      type: "Controlled Template",
      version: "v5.0",
      department: "Industrial Engineering",
      author: "Vikram Malhotra",
      status: "Approved",
      effectiveDate: "2026-03-15",
    },
    {
      id: "doc-6",
      documentNumber: "LL-PRJ-088",
      title: "Conformal Coating Masking Delays on High-Frequency Inverters",
      type: "Lessons Learned",
      version: "v1.0",
      department: "Project Management",
      author: "Sneha Patel",
      status: "Published",
      effectiveDate: "2026-03-10",
    },
  ],
  alerts: [
    {
      id: "alt-1",
      severity: "Critical",
      title: "3 EHS Safety Protocols Due for Annual Mandatory Recertification",
      description: "ISO 45001 / OSHA audit window requires review of SOP-EHS-009, 012, 014 within 5 days.",
      timestamp: "Today, 08:30 AM",
      actionLabel: "Review SOPs",
    },
    {
      id: "alt-2",
      severity: "Warning",
      title: "14 SOPs Awaiting Plant Quality Director Signoff",
      description: "Pending queue includes 6 production line changeovers and 4 testing calibration sheets.",
      timestamp: "Yesterday, 04:15 PM",
      actionLabel: "Open Queue",
    },
    {
      id: "alt-3",
      severity: "Warning",
      title: "Training Certification Gap Detected on Shift-B Operators",
      description: "28 shopfloor technicians have not completed the revised ESD Precaution Module (TRN-041).",
      timestamp: "2 days ago",
      actionLabel: "Assign Training",
    },
    {
      id: "alt-4",
      severity: "Info",
      title: "Automated Knowledge Graph Re-indexing Completed",
      description: "3,420 assets synchronized with 99.4% cross-reference linkage across BOM & Quality modules.",
      timestamp: "3 days ago",
      actionLabel: "View Index",
    },
  ],
  aiInsights: [
    {
      id: "ai-1",
      tag: "Duplicate Detection",
      title: "Redundant SOP Detected in Line 2 vs Line 4 Torque Calibrations",
      detail: "SOP-MFG-044 and SOP-MFG-078 have 89% text similarity. Consolidating into a unified modular SOP will reduce maintenance overhead.",
      impact: "Saves ~14 review hours/year",
    },
    {
      id: "ai-2",
      tag: "Audit Readiness",
      title: "ISO 9001:2015 Clause 7.5 Documentation Conformance at 99.2%",
      detail: "All active engineering blueprints and manufacturing procedures have traceable author, approver, and effective date metadata.",
      impact: "Zero non-conformance risk",
    },
    {
      id: "ai-3",
      tag: "Semantic Search Gap",
      title: "High Search Query Volume for 'Fast-Charge Connector Pinout'",
      detail: "Users searched 142 times for CCS2 pinout schematics this week. Suggest pinning TS-ENG-112 to the Technical Library front page.",
      impact: "Improves technician retrieval time by 60%",
    },
  ],
};

export const knowledgeOverviewOptions = queryOptions({
  queryKey: ["knowledge-overview"],
  queryFn: async () => MOCK_KNOWLEDGE_OVERVIEW,
});

// Magnertia ERP - Knowledge Management Reports Service
// Management -> Knowledge Management -> Reports
// Controlled Knowledge Master Reports & Audit Analytics

export interface ControlledKnowledgeReport {
  id: string;
  code: string;
  title: string;
  category: "SOP Library" | "Document Repository" | "Templates" | "Lessons Learned" | "Best Practices" | "Audit & Governance";
  purpose: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annual" | "On-Demand";
  lastGenerated: string;
  recordCount: number;
  format: "PDF" | "XLSX" | "CSV";
  status: "Active" | "Scheduled";
}

export const CONTROLLED_KNOWLEDGE_REPORTS: ControlledKnowledgeReport[] = [
  // SOP Reports
  {
    id: "KMR-01",
    code: "SOP-REG-01",
    title: "SOP Library Register",
    category: "SOP Library",
    purpose: "Complete organizational inventory of controlled Standard Operating Procedures with revision states and ownership.",
    frequency: "Monthly",
    lastGenerated: "26-Sep-2026",
    recordCount: 286,
    format: "PDF",
    status: "Active",
  },
  {
    id: "KMR-02",
    code: "SOP-ACK-04",
    title: "SOP Employee Acknowledgement Compliance Report",
    category: "SOP Library",
    purpose: "Tracks employee mandatory reading and acknowledgement completion rates by department and site.",
    frequency: "Weekly",
    lastGenerated: "27-Sep-2026",
    recordCount: 184,
    format: "XLSX",
    status: "Active",
  },
  {
    id: "KMR-03",
    code: "SOP-REV-02",
    title: "SOP Periodic Review & Expiry Schedule",
    category: "SOP Library",
    purpose: "Identifies SOPs approaching annual review date and flags overdue documents for functional owner escalation.",
    frequency: "Monthly",
    lastGenerated: "25-Sep-2026",
    recordCount: 21,
    format: "PDF",
    status: "Active",
  },

  // Document Repository Reports
  {
    id: "KMR-04",
    code: "DOC-MAS-01",
    title: "Document Repository Master Register",
    category: "Document Repository",
    purpose: "Comprehensive inventory of all policies, procedures, work instructions, manuals, specifications, and drawings.",
    frequency: "Monthly",
    lastGenerated: "27-Sep-2026",
    recordCount: 1248,
    format: "XLSX",
    status: "Active",
  },
  {
    id: "KMR-05",
    code: "DOC-ACC-03",
    title: "Document Security & Access Control Audit",
    category: "Document Repository",
    purpose: "Detailed audit trail of document access, downloads, prints, shares, and permission modifications.",
    frequency: "Quarterly",
    lastGenerated: "15-Sep-2026",
    recordCount: 480,
    format: "PDF",
    status: "Active",
  },
  {
    id: "KMR-06",
    code: "DOC-RET-05",
    title: "Document Retention & Archive Status Report",
    category: "Document Repository",
    purpose: "Monitors documents approaching statutory retention end-dates and manages controlled disposal workflows.",
    frequency: "Annual",
    lastGenerated: "01-Sep-2026",
    recordCount: 16,
    format: "PDF",
    status: "Active",
  },

  // Templates Reports
  {
    id: "KMR-07",
    code: "TPL-MAS-01",
    title: "Controlled Templates Master Register",
    category: "Templates",
    purpose: "Catalog of approved form, workflow, checklist, report, and engineering templates with version control.",
    frequency: "Monthly",
    lastGenerated: "24-Sep-2026",
    recordCount: 156,
    format: "XLSX",
    status: "Active",
  },
  {
    id: "KMR-08",
    code: "TPL-USE-02",
    title: "Template Adoption & Utilization Report",
    category: "Templates",
    purpose: "Measures template deployment across operational departments and counts instances of document generation.",
    frequency: "Monthly",
    lastGenerated: "20-Sep-2026",
    recordCount: 642,
    format: "PDF",
    status: "Active",
  },

  // Lessons Learned Reports
  {
    id: "KMR-09",
    code: "LL-RCA-01",
    title: "Lessons Learned & Root Cause Intelligence Register",
    category: "Lessons Learned",
    purpose: "Repository of post-mortem investigations, 5-Why root cause analyses, and preventive recommendations.",
    frequency: "Monthly",
    lastGenerated: "25-Sep-2026",
    recordCount: 124,
    format: "PDF",
    status: "Active",
  },
  {
    id: "KMR-10",
    code: "LL-REU-02",
    title: "Knowledge Reuse & Recurrence Prevention Report",
    category: "Lessons Learned",
    purpose: "Tracks adoption of past lessons in active engineering and manufacturing projects to prevent repeat defects.",
    frequency: "Quarterly",
    lastGenerated: "18-Sep-2026",
    recordCount: 342,
    format: "XLSX",
    status: "Active",
  },

  // Best Practices Reports
  {
    id: "KMR-11",
    code: "BP-BEN-01",
    title: "Best Practices Performance & Quantified Benefit Register",
    category: "Best Practices",
    purpose: "Detailed ledger of standardized practices with before-and-after cycle time, defect rate, and cost improvements.",
    frequency: "Quarterly",
    lastGenerated: "22-Sep-2026",
    recordCount: 86,
    format: "PDF",
    status: "Active",
  },

  // Audit & Governance Reports
  {
    id: "KMR-12",
    code: "KM-AUD-01",
    title: "Knowledge ISO & Regulatory Audit Trail",
    category: "Audit & Governance",
    purpose: "Immutable audit log of all document creation, revisions, approvals, digital signatures, and distribution events.",
    frequency: "Quarterly",
    lastGenerated: "27-Sep-2026",
    recordCount: 1540,
    format: "PDF",
    status: "Active",
  },
];

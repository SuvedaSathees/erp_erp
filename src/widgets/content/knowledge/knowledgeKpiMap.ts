import type { WidgetPageId } from "../../types";

export const KNOWLEDGE_PAGE_KPIS: Partial<Record<WidgetPageId, Record<string, string>>> = {
  "knowledge-overview": {
    "Total Knowledge Assets": "kpi.knowledge.total-assets",
    "Active SOPs": "kpi.knowledge.active-sops",
    "Document Vault": "kpi.knowledge.document-vault",
    "Best Practices": "kpi.knowledge.best-practices",
    "Controlled Templates": "kpi.knowledge.controlled-templates",
    "Published Wikis": "kpi.knowledge.published-wikis",
    "Technical Specs Vault": "kpi.knowledge.tech-specs",
    "Pending SOP Reviews": "kpi.knowledge.pending-sop-reviews",
    "Training Compliance": "kpi.knowledge.training-compliance",
    "Lessons Learned": "kpi.knowledge.lessons-learned",
  },
};

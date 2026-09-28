import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileCheck,
  FileText,
  Award,
  Layers,
  BookMarked,
  Cpu,
  Clock,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import {
  knowledgeOverviewOptions,
  type KnowledgeOverviewData,
} from "../../data/knowledgeQueries";
import { makeStatCardWidget, type StatCardShape } from "../shared/StatCardWidget";

type Cfg = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  category?: WidgetCategory;
  tags?: WidgetCategory[];
  roles?: WidgetRole[] | "all";
  sourceRoute?: string;
  inLibrary?: boolean;
};

function widget(c: Cfg, map: (d: KnowledgeOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "compliance"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/knowledge-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: knowledgeOverviewOptions,
    map,
  });
}

export const KNOWLEDGE_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.knowledge.total-assets",
      title: "Total Knowledge Assets",
      description: "Aggregated count of controlled enterprise knowledge objects including SOPs, blueprints, training modules, and wiki pages.",
      icon: BookOpen,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      sourceRoute: "/management/knowledge-management/document-repository",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.totalKnowledgeAssets?.value ?? "3,420",
      delta: {
        label: d?.kpis?.totalKnowledgeAssets?.delta ?? "12.6% vs. PY",
        direction: "up",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.knowledge.active-sops",
      title: "Active SOPs",
      description: "Standard Operating Procedures actively enforced across production lines, safety protocols, and laboratory workflows.",
      icon: FileCheck,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      sourceRoute: "/management/knowledge-management/sop-library",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.activeSops?.value ?? "241",
      delta: {
        label: d?.kpis?.activeSops?.delta ?? "9.3% vs. PY",
        direction: "up",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.knowledge.document-vault",
      title: "Document Vault",
      description: "Enterprise controlled documents archive with digital signatures, role-based encryption, and audit checksums.",
      icon: FileText,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      sourceRoute: "/management/knowledge-management/document-repository",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.documentVault?.value ?? "1,248",
      delta: {
        label: d?.kpis?.documentVault?.delta ?? "15.2% vs. PY",
        direction: "up",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.knowledge.best-practices",
      title: "Best Practices",
      description: "Verified institutional standard methodologies and continuous improvement benchmarks.",
      icon: Award,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      sourceRoute: "/management/knowledge-management/best-practices",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.bestPractices?.value ?? "86",
      delta: {
        label: d?.kpis?.bestPractices?.delta ?? "8.9% vs. PY",
        direction: "up",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.knowledge.controlled-templates",
      title: "Controlled Templates",
      description: "Standardized templates, forms, inspection sheets, and engineering drawing borders.",
      icon: Layers,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      sourceRoute: "/management/knowledge-management/templates",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.controlledTemplates?.value ?? "156",
      neutralText: d?.kpis?.controlledTemplates?.caption ?? "Controlled Forms & Schemas",
    }),
  ),
  widget(
    {
      id: "kpi.knowledge.published-wikis",
      title: "Published Wikis",
      description: "Peer-reviewed collaborative technical wikis and engineering troubleshooting knowledge base.",
      icon: BookMarked,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      sourceRoute: "/management/knowledge-management/wiki",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.publishedWikis?.value ?? "256",
      neutralText: d?.kpis?.publishedWikis?.caption ?? "Collaborative Base",
    }),
  ),
  widget(
    {
      id: "kpi.knowledge.tech-specs",
      title: "Technical Specs Vault",
      description: "Hardware schematics, firmware registers, harness wiring pinouts, and CAD models.",
      icon: Cpu,
      iconBg: "bg-slate-500/10",
      iconColor: "text-slate-600",
      sourceRoute: "/management/knowledge-management/technical-library",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.techSpecs?.value ?? "842",
      neutralText: d?.kpis?.techSpecs?.caption ?? "Engineering Vault",
    }),
  ),
  widget(
    {
      id: "kpi.knowledge.pending-sop-reviews",
      title: "Pending SOP Reviews",
      description: "Documents and SOPs currently due for mandatory annual review or awaiting QA signoff signatures.",
      icon: Clock,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      sourceRoute: "/management/knowledge-management/sop-library",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.pendingSopReviews?.value ?? "14",
      neutralText: d?.kpis?.pendingSopReviews?.caption ?? "14 SOPs awaiting signoff",
      captionTone: "negative",
    }),
  ),
  widget(
    {
      id: "kpi.knowledge.training-compliance",
      title: "Training Compliance",
      description: "Organizational completion rate for mandatory SOP refresher and equipment certification training modules.",
      icon: GraduationCap,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-600",
      sourceRoute: "/management/knowledge-management/training-materials",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.trainingCompliance?.value ?? "94.8%",
      neutralText: d?.kpis?.trainingCompliance?.caption ?? "512 certified staff",
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.knowledge.lessons-learned",
      title: "Lessons Learned",
      description: "Continuous improvement post-mortem insights captured from past project milestones and customer feedback.",
      icon: Lightbulb,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600",
      sourceRoute: "/management/knowledge-management/lessons-learned",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.lessonsLearned?.value ?? "124",
      delta: {
        label: d?.kpis?.lessonsLearned?.delta ?? "6.4% vs. PY",
        direction: "up",
        tone: "positive",
      },
    }),
  ),
];

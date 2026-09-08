import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Activity,
  FileCheck,
  AlertTriangle,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { qualityOverviewOptions, type QualityOverviewData } from "../../data/qualityQueries";
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

function widget(c: Cfg, map: (d: QualityOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "quality"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/quality-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: qualityOverviewOptions,
    map,
  });
}

export const QUALITY_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.quality.fpy",
      title: "First Pass Yield (FPY)",
      description: "Overall factory-wide first pass yield across all SMT, assembly, and testing lines.",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/quality-management/quality-analytics",
      inLibrary: true,
    },
    (d) => ({
      value: `${d?.firstPassYield ?? 94.6}%`,
      delta: {
        label: `+${((d?.firstPassYield ?? 94.6) - (d?.targetFpy ?? 92.0)).toFixed(1)}% vs Target (${d?.targetFpy ?? 92.0}%)`,
        direction: "up",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.quality.defect-ppm",
      title: "Overall Defect PPM",
      description: "Parts per million defect frequency index across active high-voltage charger lines.",
      icon: Activity,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      sourceRoute: "/management/quality-management/quality-analytics",
      inLibrary: true,
    },
    (d) => ({
      value: `${d?.defectPpm ?? 24} PPM`,
      delta: {
        label: `-${d?.ppmImprovement ?? 14} PPM vs FY25 (Best in Class)`,
        direction: "down",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.quality.iqc-clearance",
      title: "Supplier IQC Clearance",
      description: "Incoming goods inspection pass rate adhering to ANSI/ASQ Z1.4 sampling standard.",
      icon: FileCheck,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      sourceRoute: "/management/quality-management/incoming-inspection",
      inLibrary: true,
    },
    (d) => ({
      value: `${d?.iqcClearance ?? 97.4}%`,
      delta: {
        label: `+1.2% MoM (${d?.lotsTested ?? 184} Lots Tested)`,
        direction: "up",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.quality.open-ncrs",
      title: "Active Open NCRs",
      description: "Non-conformance reports awaiting Material Review Board disposition.",
      icon: AlertTriangle,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      sourceRoute: "/management/quality-management/ncr-management",
      inLibrary: true,
    },
    (d) => ({
      value: `${d?.openNcrs ?? 7} Open`,
      delta: {
        label: `-${d?.ncrsClosedThisWeek ?? 3} Closed This Week (MRB Actionable)`,
        direction: "down",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.quality.capa-rate",
      title: "CAPA Resolution Rate",
      description: "Closed-loop 8D corrective actions resolved within SLA timeline without recurrence.",
      icon: ClipboardCheck,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      sourceRoute: "/management/quality-management/capa",
      inLibrary: true,
    },
    (d) => ({
      value: `${d?.capaResolutionRate ?? 92.8}%`,
      delta: {
        label: `+4.1% vs Q3 (${d?.capasClosedOnTime ?? 14} Closed on Time)`,
        direction: "up",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.quality.audit-index",
      title: "Audit Compliance Index",
      description: "IATF 16949 & ISO 9001 quality management system internal & customer audit rating.",
      icon: ShieldCheck,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-500",
      sourceRoute: "/management/quality-management/audit-management",
      inLibrary: true,
    },
    (d) => ({
      value: `${d?.auditComplianceIndex ?? 98.2}%`,
      delta: {
        label: `+0.4% IATF Score (${d?.majorNcCount ?? 0} Major NCs)`,
        direction: "up",
        tone: "positive",
      },
    }),
  ),
];

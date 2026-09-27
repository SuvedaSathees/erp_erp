/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Award,
  FileCheck2,
  ScrollText,
  FileSpreadsheet,
  AlertTriangle,
  ClipboardCheck,
  Scale,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { complianceOverviewOptions, type ComplianceOverviewData } from "../../data/complianceQueries";
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

function widget(c: Cfg, map: (d: ComplianceOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "compliance"],
    icon: c.icon,
    keywords: c.title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/risk-management/compliance-overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: complianceOverviewOptions,
    map,
  });
}

export const COMPLIANCE_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.compliance.overall-score",
      title: "Overall Compliance Score",
      description: "Aggregated statutory, ISO standard, and internal compliance health index.",
      icon: ShieldCheck,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/risk-management/regulatory-compliance",
      inLibrary: true,
    },
    (d) => ({
      value: `${d.complianceIndex}%`,
      delta: {
        value: d.complianceIndexDelta,
        trend: "up",
        label: "benchmark 90%",
      },
    }),
  ),

  widget(
    {
      id: "kpi.compliance.active-licenses",
      title: "Active Licenses & Permits",
      description: "Operating licenses, environmental consents, and factory permits currently active.",
      icon: Award,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      sourceRoute: "/management/risk-management/licenses",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.activeLicenses),
      neutralText: d.activeLicensesDelta,
    }),
  ),

  widget(
    {
      id: "kpi.compliance.iso-readiness",
      title: "ISO Standards Readiness",
      description: "Audited readiness percentage across ISO 9001, 14001, 45001, and 27001.",
      icon: FileCheck2,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      sourceRoute: "/management/risk-management/iso-compliance",
      inLibrary: true,
    },
    (d) => ({
      value: `${d.isoStandardsReadiness}%`,
      delta: {
        value: d.isoStandardsDelta,
        trend: "up",
        label: "audit-ready",
      },
    }),
  ),

  widget(
    {
      id: "kpi.compliance.obligations-fulfilled",
      title: "Fulfilled Obligations",
      description: "Statutory and regulatory obligations validated and compliant.",
      icon: ScrollText,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-500",
      sourceRoute: "/management/risk-management/regulatory-compliance",
      inLibrary: true,
    },
    (d) => ({
      value: `${d.obligationsFulfilled} / ${d.obligationsTotal}`,
      neutralText: d.obligationsDelta,
    }),
  ),

  widget(
    {
      id: "kpi.compliance.filings-on-time",
      title: "Statutory Filings Timeliness",
      description: "On-time submission percentage for PCB, ROC, GST, EHS, and factory returns.",
      icon: FileSpreadsheet,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      sourceRoute: "/management/risk-management/compliance-reporting",
      inLibrary: true,
    },
    (d) => ({
      value: `${d.filingsOnTimeRate}%`,
      delta: {
        value: d.filingsDelta,
        trend: "up",
        label: "zero penalties",
      },
    }),
  ),

  widget(
    {
      id: "kpi.compliance.open-gaps",
      title: "Open Compliance Gaps",
      description: "Identified audit gaps and non-conformances undergoing active remediation.",
      icon: AlertTriangle,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/risk-management/internal-compliance",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.openGapsCount),
      neutralText: d.openGapsDelta,
      captionTone: "critical",
    }),
  ),

  widget(
    {
      id: "kpi.compliance.audit-capas",
      title: "Audit Findings & CAPAs",
      description: "Internal and external audit findings currently tracked through corrective actions.",
      icon: ClipboardCheck,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      sourceRoute: "/management/risk-management/audit-compliance",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.auditCapasCount),
      neutralText: d.auditCapasDelta,
    }),
  ),

  widget(
    {
      id: "kpi.compliance.legal-updates",
      title: "Legal Updates Tracked",
      description: "New statutory gazette notifications and legal register amendments under review.",
      icon: Scale,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      sourceRoute: "/management/risk-management/legal-register",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.legalUpdatesCount),
      neutralText: d.legalUpdatesDelta,
    }),
  ),
];

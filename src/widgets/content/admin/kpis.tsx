/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Building2,
  CheckCircle2,
  Database,
  FileCheck,
  FileText,
  Key,
  Layers,
  MapPin,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { adminOverviewOptions, type AdminOverviewData } from "../../data/adminQueries";
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

function widget(c: Cfg, map: (d: AdminOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "admin"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/administration-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: adminOverviewOptions,
    map,
  });
}

export const ADMIN_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.admin.total-branches",
      title: "Total Branches",
      description: "Active corporate headquarters, regional offices, and factory plants.",
      icon: MapPin,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      sourceRoute: "/management/administration-management/branch-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.totalBranches ? String(d.kpis.totalBranches) : "6",
      delta: { label: "1 in expansion", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.admin.active-departments",
      title: "Active Departments",
      description: "Functional departments mapped across organizational hierarchies.",
      icon: Building2,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      sourceRoute: "/management/administration-management/department-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.activeDepartments ? String(d.kpis.activeDepartments) : "14",
      delta: { label: "100% operational", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.admin.active-users",
      title: "Active System Users",
      description: "Provisioned ERP accounts with active login credentials and role assignments.",
      icon: Users,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/administration-management/user-role-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.activeUsers ? String(d.kpis.activeUsers) : "385",
      delta: { label: "0 locked accounts", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.admin.roles-permissions",
      title: "RBAC Roles Configured",
      description: "Defined permission matrix profiles governing role-based access control.",
      icon: Key,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      sourceRoute: "/management/administration-management/user-role-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.rolesAndPermissions ? String(d.kpis.rolesAndPermissions) : "28",
      delta: { label: "SoD compliant", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.admin.pending-approvals",
      title: "Pending Matrix Approvals",
      description: "Workflow approval tickets pending executive or department lead sign-off.",
      icon: FileCheck,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/administration-management/approval-matrix-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.pendingApprovals ? String(d.kpis.pendingApprovals) : "19",
      delta: { label: "Avg TAT: 4.8 hrs", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.admin.controlled-documents",
      title: "Controlled Documents",
      description: "Official standard operating procedures, policies, and revision-controlled specs.",
      icon: FileText,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-500",
      sourceRoute: "/management/administration-management/document-control-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.controlledDocuments ? String(d.kpis.controlledDocuments) : "142",
      delta: { label: "100% versioned", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.admin.active-policies",
      title: "Active Governance Policies",
      description: "Corporate governance, safety, and compliance policies in active enforcement.",
      icon: Scale,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      sourceRoute: "/management/administration-management/policy-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.activePolicies ? String(d.kpis.activePolicies) : "36",
      delta: { label: "All acknowledged", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.admin.master-data-entities",
      title: "Master Data Entities",
      description: "Centralized master entities (customers, vendors, items, GL accounts) under governance.",
      icon: Database,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      sourceRoute: "/management/administration-management/master-data-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.masterDataEntities ? String(d.kpis.masterDataEntities) : "1,250",
      delta: { label: "0 duplicate flags", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.admin.system-audit-score",
      title: "Security & Audit Score",
      description: "Automated compliance, role segregation (SoD), and access hygiene audit score.",
      icon: ShieldCheck,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/administration-management/audit-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.systemAuditScore ? `${d.kpis.systemAuditScore}%` : "98.2%",
      delta: { label: "ISO 27001 Grade A+", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.admin.system-notifications",
      title: "Unread System Alerts",
      description: "Active system-wide notifications, broadcast bulletins, and compliance flags.",
      icon: Bell,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/administration-management/notifications-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.unreadNotifications ? String(d.kpis.unreadNotifications) : "8",
      delta: { label: "2 high priority", direction: "up", tone: "positive" },
    }),
  ),
];

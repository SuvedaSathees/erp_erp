// KPI Widgets for Security Management Overview & Submodules
import { memo } from "react";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Server,
  Camera,
  AlertTriangle,
  Lock,
  FileCheck2,
  GitPullRequest,
  Database,
} from "lucide-react";
import { StatCard } from "@/components/erp/StatCard";
import type { WidgetContentProps, WidgetDefinition } from "@/widgets/types";
import { SECURITY_OVERVIEW_DATA } from "@/widgets/data/securityQueries";

const data = SECURITY_OVERVIEW_DATA.kpis;

// 1. Total Digital Identities
export const TotalIdentitiesWidget = memo(function TotalIdentitiesWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Total Identities"
      value={String(data.totalIdentities.value)}
      neutralText={data.totalIdentities.delta}
      captionTone="positive"
      icon={<Users className="h-5 w-5" />}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
});

// 2. Active Authenticated Users
export const ActiveUsersWidget = memo(function ActiveUsersWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Active Users"
      value={String(data.activeUsers.value)}
      neutralText={data.activeUsers.delta}
      captionTone="positive"
      icon={<Users className="h-5 w-5" />}
      iconBg="bg-emerald-50 dark:bg-emerald-950/40"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
});

// 3. Protected Cyber Assets
export const ProtectedAssetsWidget = memo(function ProtectedAssetsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Protected Assets"
      value={data.protectedAssets.value.toLocaleString()}
      neutralText={data.protectedAssets.delta}
      captionTone="positive"
      icon={<Server className="h-5 w-5" />}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
});

// 4. CCTV Cameras Online
export const CctvOnlineWidget = memo(function CctvOnlineWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="CCTV Online"
      value={data.cctvOnline.value}
      neutralText={`${data.cctvOnline.count}/${data.cctvOnline.total} Online`}
      captionTone="positive"
      icon={<Camera className="h-5 w-5" />}
      iconBg="bg-emerald-50 dark:bg-emerald-950/40"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
});

// 5. Open Security Incidents
export const OpenIncidentsWidget = memo(function OpenIncidentsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Open Incidents"
      value={String(data.openIncidents.value)}
      neutralText={data.openIncidents.delta}
      captionTone="negative"
      icon={<AlertTriangle className="h-5 w-5" />}
      iconBg="bg-rose-50 dark:bg-rose-950/40"
      iconColor="text-rose-600 dark:text-rose-400"
    />
  );
});

// 6. Critical Vulnerabilities
export const CriticalVulnerabilitiesWidget = memo(function CriticalVulnerabilitiesWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Critical CVEs"
      value={String(data.criticalVulnerabilities.value)}
      neutralText={data.criticalVulnerabilities.delta}
      captionTone="positive"
      icon={<ShieldAlert className="h-5 w-5" />}
      iconBg="bg-amber-50 dark:bg-amber-950/40"
      iconColor="text-amber-600 dark:text-amber-400"
    />
  );
});

// 7. MFA Enforcement Coverage
export const MfaAdoptionWidget = memo(function MfaAdoptionWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="MFA Adoption"
      value={data.mfaAdoption.value}
      neutralText={data.mfaAdoption.delta}
      captionTone="positive"
      icon={<Lock className="h-5 w-5" />}
      iconBg="bg-emerald-50 dark:bg-emerald-950/40"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
});

// 8. Patch Management Compliance
export const PatchComplianceWidget = memo(function PatchComplianceWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Patch Compliance"
      value={data.patchCompliance.value}
      neutralText={data.patchCompliance.delta}
      captionTone="positive"
      icon={<FileCheck2 className="h-5 w-5" />}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
});

// 9. Segregation of Duties Conflicts
export const SodConflictsWidget = memo(function SodConflictsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="SoD Conflicts"
      value={String(data.sodConflicts.value)}
      neutralText={data.sodConflicts.delta}
      captionTone="positive"
      icon={<GitPullRequest className="h-5 w-5" />}
      iconBg="bg-amber-50 dark:bg-amber-950/40"
      iconColor="text-amber-600 dark:text-amber-400"
    />
  );
});

// 10. Information Assets
export const InformationAssetsWidget = memo(function InformationAssetsWidget(_props: WidgetContentProps) {
  return (
    <StatCard
      label="Information Assets"
      value={data.informationAssets.value.toLocaleString()}
      neutralText={data.informationAssets.delta}
      captionTone="positive"
      icon={<Database className="h-5 w-5" />}
      iconBg="bg-blue-50 dark:bg-blue-950/40"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
});

export const SECURITY_KPI_WIDGETS: WidgetDefinition[] = [
  {
    id: "kpi.security.total-identities",
    title: "Total Digital Identities",
    description: "Enterprise identities across employees, contractors, service accounts and APIs.",
    category: "kpi",
    icon: Users,
    keywords: ["identities", "users", "accounts", "employees"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/identity-management",
    component: TotalIdentitiesWidget,
  },
  {
    id: "kpi.security.active-users",
    title: "Active Authenticated Users",
    description: "Active enterprise users authenticated in the past 30 days.",
    category: "kpi",
    icon: Users,
    keywords: ["users", "active", "logins", "sessions"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/access-control",
    component: ActiveUsersWidget,
  },
  {
    id: "kpi.security.protected-assets",
    title: "Protected Cyber Assets",
    description: "Enterprise systems, cloud nodes, OT controllers and EVSE units.",
    category: "kpi",
    icon: Server,
    keywords: ["assets", "servers", "evse", "infrastructure"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/cybersecurity",
    component: ProtectedAssetsWidget,
  },
  {
    id: "kpi.security.cctv-online",
    title: "CCTV Cameras Online",
    description: "Surveillance camera health and streaming status across sites.",
    category: "kpi",
    icon: Camera,
    keywords: ["cctv", "cameras", "surveillance", "streaming"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/surveillance",
    component: CctvOnlineWidget,
  },
  {
    id: "kpi.security.open-incidents",
    title: "Open Security Incidents",
    description: "Active cyber and physical security incidents under triage.",
    category: "kpi",
    icon: AlertTriangle,
    keywords: ["incidents", "alerts", "threats", "triage"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/cybersecurity",
    component: OpenIncidentsWidget,
  },
  {
    id: "kpi.security.critical-vulnerabilities",
    title: "Critical Vulnerabilities (CVE)",
    description: "Open critical security vulnerabilities within resolution SLA.",
    category: "kpi",
    icon: ShieldAlert,
    keywords: ["vulnerabilities", "cve", "critical", "patch"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/cybersecurity",
    component: CriticalVulnerabilitiesWidget,
  },
  {
    id: "kpi.security.mfa-adoption",
    title: "MFA Enforcement Coverage",
    description: "Ratio of identities enforced with phishing-resistant MFA.",
    category: "kpi",
    icon: Lock,
    keywords: ["mfa", "2fa", "authentication", "coverage"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/access-control",
    component: MfaAdoptionWidget,
  },
  {
    id: "kpi.security.patch-compliance",
    title: "Patch Management Compliance",
    description: "Operating system, firmware and software patch coverage.",
    category: "kpi",
    icon: FileCheck2,
    keywords: ["patch", "firmware", "updates", "compliance"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/cybersecurity",
    component: PatchComplianceWidget,
  },
  {
    id: "kpi.security.sod-conflicts",
    title: "Segregation of Duties Conflicts",
    description: "Active toxic role combinations detected with mitigating controls.",
    category: "kpi",
    icon: GitPullRequest,
    keywords: ["sod", "duties", "conflicts", "roles"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/access-control",
    component: SodConflictsWidget,
  },
  {
    id: "kpi.security.information-assets",
    title: "Cataloged Information Assets",
    description: "Proprietary code, database tables, CAD drawings and specifications.",
    category: "kpi",
    icon: Database,
    keywords: ["information", "data", "assets", "drawings"],
    defaultSize: "sm",
    allowedSizes: ["sm", "md"],
    roles: "all",
    sourceRoute: "/management/security-management/information-security",
    component: InformationAssetsWidget,
  },
];

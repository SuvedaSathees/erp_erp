// Panel Widgets for Security Management Overview
import { memo } from "react";
import {
  ShieldAlert,
  Building2,
  FileCheck2,
  Sparkles,
  AlertTriangle,
  Lock,
  Camera,
  Server,
  ArrowUpRight,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { WidgetContentProps, WidgetDefinition } from "@/widgets/types";
import { SECURITY_OVERVIEW_DATA } from "@/widgets/data/securityQueries";
import { cn } from "@/lib/utils";

// 1. Threat & Vulnerability Trend
export const SecurityThreatTrendWidget = memo(function SecurityThreatTrendWidget(
  _props: WidgetContentProps
) {
  const data = SECURITY_OVERVIEW_DATA.threatTrends;
  return (
    <div className="flex h-full flex-col justify-between p-5 bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            Threat & Vulnerability Trend (Last 12 Months)
          </h3>
          <p className="text-xs text-muted-foreground">
            Continuous asset inventory discovery vs. open CVE remediation rate
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-blue-600">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Assets
          </span>
          <span className="flex items-center gap-1.5 text-amber-500">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Vulnerabilities
          </span>
          <span className="flex items-center gap-1.5 text-rose-500">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Incidents
          </span>
        </div>
      </div>
      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="assets" name="Monitored Assets" fill="#3b82f6" barSize={14} radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="vulns" name="Open CVEs" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="incidents" name="Incidents" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// 2. Incident Status & Distribution
export const SecurityIncidentStatusWidget = memo(function SecurityIncidentStatusWidget(
  _props: WidgetContentProps
) {
  const data = SECURITY_OVERVIEW_DATA.incidentDistribution;
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="flex h-full flex-col justify-between p-5 bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            Incident Status & Distribution
          </h3>
          <p className="text-xs text-muted-foreground">
            Active investigations by security domain
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
          5 Open
        </span>
      </div>

      <div className="flex items-center justify-center py-4">
        <div className="relative h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-display text-foreground">{total}</span>
            <span className="text-[11px] text-muted-foreground">Total Events</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
        {data.map((item) => (
          <div key={item.category} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/40">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.category}</span>
            </span>
            <span className="font-bold text-foreground">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// 3. Facility Security Matrix
export const SecurityFacilityMatrixWidget = memo(function SecurityFacilityMatrixWidget(
  _props: WidgetContentProps
) {
  const facilities = SECURITY_OVERVIEW_DATA.facilities;

  return (
    <div className="flex h-full flex-col justify-between p-5 bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            Facility Physical Security Posture
          </h3>
          <p className="text-xs text-muted-foreground">
            Entry controls, CCTV health, and security officer deployment
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-medium">8 Sites Protected</span>
      </div>

      <div className="divide-y divide-border/60 py-2">
        {facilities.map((fac) => (
          <div key={fac.name} className="py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">{fac.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {fac.cameras} Cams • {fac.guards} Guards on shift
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                  fac.status === "Secure"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                )}
              >
                ● {fac.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Patrol SLA Adherence: <strong>97.2%</strong></span>
        <span className="text-primary font-medium">View Control Room Matrix →</span>
      </div>
    </div>
  );
});

// 4. Security Risk Heatmap (5x5)
export const SecurityRiskHeatmapWidget = memo(function SecurityRiskHeatmapWidget(
  _props: WidgetContentProps
) {
  const matrix = SECURITY_OVERVIEW_DATA.riskMatrix;

  return (
    <div className="flex h-full flex-col justify-between p-5 bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            Active Security Risk Heatmap
          </h3>
          <p className="text-xs text-muted-foreground">
            Impact vs. Likelihood distribution across 18 high-risk assets
          </p>
        </div>
        <span className="text-xs font-bold text-rose-600">Critical: 2 Risks</span>
      </div>

      <div className="py-4 space-y-2">
        {matrix.map((row) => (
          <div key={row.level} className="flex items-center gap-2 text-xs">
            <span className="w-16 font-medium text-muted-foreground truncate">{row.level}</span>
            <div className="grid grid-cols-5 gap-1.5 flex-1">
              {row.values.map((val, idx) => {
                const isHigh = row.level === "Critical" || (row.level === "High" && idx >= 2);
                const isMed = (row.level === "High" && idx < 2) || (row.level === "Medium" && idx >= 2);
                return (
                  <div
                    key={idx}
                    className={cn(
                      "h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-transform hover:scale-105 cursor-pointer",
                      val > 0
                        ? isHigh
                          ? "bg-rose-500 text-white shadow-sm"
                          : isMed
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-500 text-white"
                        : "bg-muted/40 text-muted-foreground/40"
                    )}
                  >
                    {val || "0"}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 text-[10px] text-muted-foreground pl-18">
          <span>Very Low Impact</span>
          <span>Medium</span>
          <span>Catastrophic</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Framework: ISO/SAE 21434</span>
        <span className="text-primary font-medium">Risk Register →</span>
      </div>
    </div>
  );
});

// 5. Compliance Framework Status
export const SecurityComplianceStatusWidget = memo(function SecurityComplianceStatusWidget(
  _props: WidgetContentProps
) {
  const frameworks = SECURITY_OVERVIEW_DATA.complianceFrameworks;

  return (
    <div className="flex h-full flex-col justify-between p-5 bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            Cyber & Physical Compliance
          </h3>
          <p className="text-xs text-muted-foreground">
            Audit readiness across global automotive & cybersecurity frameworks
          </p>
        </div>
        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" /> 100% Certified
        </span>
      </div>

      <div className="space-y-3.5 py-3">
        {frameworks.map((fw) => (
          <div key={fw.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{fw.name}</span>
              <span className="font-bold text-foreground">{fw.score}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  fw.score >= 95 ? "bg-emerald-500" : fw.score >= 90 ? "bg-blue-600" : "bg-amber-500"
                )}
                style={{ width: `${fw.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Auditor: TÜV SÜD Asia</span>
        <span className="text-primary font-medium">Certification Dossier →</span>
      </div>
    </div>
  );
});

// 6. AI Security Intelligence Stream
export const SecurityAiIntelligenceWidget = memo(function SecurityAiIntelligenceWidget(
  _props: WidgetContentProps
) {
  const feed = SECURITY_OVERVIEW_DATA.aiIntelligence;

  return (
    <div className="flex h-full flex-col justify-between p-5 bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              AI Security Intelligence Command Feed
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time behavioral telemetry, orphan detection & JML mover anomaly predictions
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
          Live Model Active
        </span>
      </div>

      <div className="space-y-2.5 py-3">
        {feed.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                    item.severity === "high"
                      ? "bg-rose-500/10 text-rose-600"
                      : "bg-amber-500/10 text-amber-600"
                  )}
                >
                  {item.type}
                </span>
                <span className="text-xs font-bold text-foreground">{item.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
              {item.timeAgo}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Zero hallucinations: All recommendations link to audit trail evidence</span>
        <span className="text-purple-600 font-semibold cursor-pointer">Configure AI Guardrails →</span>
      </div>
    </div>
  );
});

export const SECURITY_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "panel.security.threat-trend",
    title: "Security Threat & Posture Trend",
    description: "Assets under monitoring, vulnerabilities discovered, and risk scores.",
    category: "chart",
    icon: ShieldAlert,
    keywords: ["threat", "trend", "vulnerabilities", "posture"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/management/security-management/cybersecurity",
    component: SecurityThreatTrendWidget,
  },
  {
    id: "panel.security.incident-status",
    title: "Incident Status & Distribution",
    description: "Active incident triage and distribution across security categories.",
    category: "chart",
    icon: AlertTriangle,
    keywords: ["incidents", "distribution", "status", "events"],
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    roles: "all",
    sourceRoute: "/management/security-management/cybersecurity",
    component: SecurityIncidentStatusWidget,
  },
  {
    id: "panel.security.facility-matrix",
    title: "Facility Physical Security Posture",
    description: "Physical facilities, badge systems, CCTV cameras and guard deployment.",
    category: "table",
    icon: Building2,
    keywords: ["facilities", "physical", "guards", "cameras"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/management/security-management/physical-security",
    component: SecurityFacilityMatrixWidget,
  },
  {
    id: "panel.security.risk-heatmap",
    title: "Active Security Risk Heatmap",
    description: "5x5 Likelihood vs. Impact security risk assessment matrix.",
    category: "chart",
    icon: Lock,
    keywords: ["risk", "heatmap", "matrix", "impact"],
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    roles: "all",
    sourceRoute: "/management/security-management/information-security",
    component: SecurityRiskHeatmapWidget,
  },
  {
    id: "panel.security.compliance-status",
    title: "Cyber & Physical Compliance Status",
    description: "Readiness scores across ISO 27001, ISO/SAE 21434 and IEC 62443.",
    category: "chart",
    icon: FileCheck2,
    keywords: ["compliance", "iso", "iec", "audit"],
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    roles: "all",
    sourceRoute: "/management/security-management/security-audit",
    component: SecurityComplianceStatusWidget,
  },
  {
    id: "panel.security.ai-intelligence",
    title: "AI Security Intelligence Command Feed",
    description: "Automated anomaly alerts, duplicate identity triggers, and JML mover warnings.",
    category: "ai",
    icon: Sparkles,
    keywords: ["ai", "intelligence", "anomalies", "predictions"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/management/security-management/overview",
    component: SecurityAiIntelligenceWidget,
  },
];

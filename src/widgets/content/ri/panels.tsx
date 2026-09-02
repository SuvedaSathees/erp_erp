/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Layers,
  Rocket,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { chartColor } from "@/lib/chartColors";
import type { WidgetDefinition } from "../../types";

const mockRiFunnel = [
  { label: "1. Architecture, Cyber & Digital", submodules: "Cloud, AI, API, Cyber", count: 52, icon: Cpu, color: "#2563eb", route: "/development/research-innovation/cloud-platform-development/new" },
  { label: "2. Engineering Design & CAE Simulation", submodules: "Simulation, UI/UX, Production Eng", count: 37, icon: Activity, color: "#9333ea", route: "/development/research-innovation/simulation-analysis/new" },
  { label: "3. Industrialization & Tooling", submodules: "Assembly, Fixture, Tooling, Jig, Layout", count: 43, icon: Sliders, color: "#0d9488", route: "/development/research-innovation/tooling-development/new" },
  { label: "4. Operations, Standards & BOM", submodules: "Capacity, Work Instruction, SOP, BOM, Routing", count: 79, icon: Layers, color: "#d97706", route: "/development/research-innovation/bom-engineering/new" },
  { label: "5. Verification & Process Quality", submodules: "APQP, PFMEA, Control Plan, Testing, Validation", count: 69, icon: ShieldCheck, color: "#16a34a", route: "/development/research-innovation/testing-validation/new" },
  { label: "6. Governance, Compliance & Release", submodules: "Certification, Documentation, Release Gate", count: 19, icon: Award, color: "#0284c7", route: "/development/research-innovation/certification-readiness/new" },
];

const mockRiVelocity = [
  { label: "Mar", count: 42, key: "mar" },
  { label: "Apr", count: 58, key: "apr" },
  { label: "May", count: 67, key: "may" },
  { label: "Jun", count: 81, key: "jun" },
  { label: "Jul", count: 95, key: "jul" },
  { label: "Aug", count: 114, key: "aug" },
];

const mockRiPrograms = [
  {
    id: "PROD-EV-7KW",
    name: "Smart EV Charger AC 7kW (Dual Type-2)",
    stage: "Certification Gate",
    lead: "Rahul Sharma",
    submodules: "Certification, UI/UX, Testing",
    readiness: 94,
    status: "On Track",
    route: "/development/research-innovation/certification-readiness/new",
  },
  {
    id: "SIM-2024-0027",
    name: "W-EVSE Thermal & Structural Analysis",
    stage: "CAE Verification",
    lead: "Rahul Sharma",
    submodules: "Simulation, Tooling, Fixtures",
    readiness: 88,
    status: "In Progress",
    route: "/development/research-innovation/simulation-analysis/new",
  },
  {
    id: "CSE-2024-0018",
    name: "Smart EV Charging Security & Threat Model",
    stage: "STRIDE Pentest",
    lead: "Rahul Sharma",
    submodules: "Cybersecurity, Cloud, API",
    readiness: 92,
    status: "Under Review",
    route: "/development/research-innovation/cybersecurity-engineering/new",
  },
  {
    id: "AIMD-2024-0018",
    name: "EV Fleet Charging Demand Forecasting Model",
    stage: "Model Validation",
    lead: "Rahul Sharma",
    submodules: "AI Model, Cloud, Telemetry",
    readiness: 89,
    status: "In Review",
    route: "/development/research-innovation/ai-model-development/new",
  },
  {
    id: "UIUX-2024-0017",
    name: "Smart EV Charger UI/UX & Design Tokens v3.2",
    stage: "Design Handoff",
    lead: "Rahul Sharma",
    submodules: "UI/UX, Mobile App, Software",
    readiness: 88,
    status: "In Review",
    route: "/development/research-innovation/ui-ux-development/new",
  },
];

/* ===========================================================================
   1. Innovation Stage-Gate Pipeline Funnel
   =========================================================================== */
export const RiFunnelWidget = memo(function RiFunnelWidget() {
  const total = mockRiFunnel.reduce((s, f) => s + f.count, 0);
  const maxFunnel = Math.max(1, ...mockRiFunnel.map((f) => f.count));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Innovation Lifecycle Stage-Gate Pipeline</h3>
              <p className="text-xs text-muted-foreground">{total} active engineering deliverables across 27 streams</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-primary">{total} total records</span>
        </div>

        <div className="space-y-3">
          {mockRiFunnel.map((f, i) => (
            <div key={f.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <Link to={f.route as any} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors truncate">
                  <f.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{f.label}</span>
                  <span className="text-[10px] text-muted-foreground font-normal hidden sm:inline">
                    ({f.submodules})
                  </span>
                </Link>
                <span className="font-mono font-bold text-foreground text-xs shrink-0 ml-2">{f.count} records</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-md bg-muted/50 border border-border/40">
                <div
                  className="flex h-full items-center justify-end rounded-md px-2 text-[10px] font-bold text-white transition-all"
                  style={{
                    width: `${Math.max(14, (f.count / maxFunnel) * 100)}%`,
                    backgroundColor: f.color || chartColor(i),
                  }}
                >
                  {f.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground border-t border-border/40 pt-2">
        Coordinated gate progression across all 27 active research, engineering, and industrialization streams.
      </p>
    </div>
  );
});

/* ===========================================================================
   2. Engineering Velocity Trend (6-Month Throughput)
   =========================================================================== */
export const RiVelocityWidget = memo(function RiVelocityWidget() {
  const maxTrend = Math.max(1, ...mockRiVelocity.map((t) => t.count));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Engineering Velocity & Throughput</h3>
              <p className="text-xs text-muted-foreground">Monthly closed gates & deliverables</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
            +171% H1 Growth
          </Badge>
        </div>

        <div className="flex h-[200px] items-end justify-between gap-2 pt-4">
          {mockRiVelocity.map((t, i) => (
            <div key={t.key} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold tabular text-foreground">{t.count}</span>
              <div
                className="w-full rounded-t-md transition-all hover:opacity-80"
                style={{
                  height: `${Math.max(8, (t.count / maxTrend) * 160)}px`,
                  backgroundColor: chartColor(i),
                }}
              />
              <span className="text-[10px] text-muted-foreground font-medium">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground border-t border-border/40 pt-2">
        Engineering changes, qualification artifacts, and release gates completed monthly across all 27 submodules.
      </p>
    </div>
  );
});

/* ===========================================================================
   3. Key Strategic Innovation Programs
   =========================================================================== */
export const RiTopProgramsWidget = memo(function RiTopProgramsWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <Rocket className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Key Strategic Innovation Programs</h3>
              <p className="text-xs text-muted-foreground">Active multi-stream programs driving company EV roadmap</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-medium">5 Core Programs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-[11px] font-semibold uppercase">
                <th className="pb-2">Program & ID</th>
                <th className="pb-2">Stage</th>
                <th className="pb-2">Streams</th>
                <th className="pb-2">Lead</th>
                <th className="pb-2 text-right">Readiness</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockRiPrograms.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 pr-2">
                    <Link to={p.route as any} className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>{p.name}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </Link>
                    <span className="text-[10px] text-muted-foreground font-mono">{p.id}</span>
                  </td>
                  <td className="py-2.5 pr-2 font-medium">{p.stage}</td>
                  <td className="py-2.5 pr-2 text-muted-foreground">{p.submodules}</td>
                  <td className="py-2.5 pr-2">{p.lead}</td>
                  <td className="py-2.5 pr-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {p.readiness}%
                  </td>
                  <td className="py-2.5 text-right">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold px-2 py-0.5 ${
                        p.status === "On Track"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : p.status === "Under Review"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Innovation & Design AI Intelligence
   =========================================================================== */
export const RiAiIntelligenceWidget = memo(function RiAiIntelligenceWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5 border border-primary/20 bg-primary/5">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-primary/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">R&I Engineering AI Intelligence</h3>
              <p className="text-xs text-muted-foreground">Automated multi-stream consistency & compliance forecasting</p>
            </div>
          </div>
          <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
            Score: 92/100
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-lg border border-border/80 bg-card p-3 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Certification Readiness</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              TÜV Rheinland lab schedule synchronized with Testing & Validation TV-2024-0075. Zero blocking non-conformances.
            </p>
          </div>

          <div className="rounded-lg border border-border/80 bg-card p-3 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold">
              <Zap className="h-3.5 w-3.5" />
              <span>Design System Alignment</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              Magnertia Design Tokens v3.2 fully compiled and synced across Web, Android, and iOS UI/UX modules.
            </p>
          </div>

          <div className="rounded-lg border border-border/80 bg-card p-3 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-purple-600 font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>STRIDE Security Audit</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              Zero high-severity CVEs identified across Cloud Platform CLD-2024-0001 and API-2024-0011 endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export const RI_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.ri.funnel",
    title: "Innovation Stage-Gate Pipeline Funnel",
    description: "Active engineering deliverables progressing through the 6 major lifecycle delivery phases.",
    category: "chart",
    tags: ["chart", "ri"],
    icon: Layers,
    keywords: ["innovation", "funnel", "pipeline", "stage-gate", "research"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/development/research-innovation/overview",
    component: RiFunnelWidget,
  },
  {
    id: "chart.ri.velocity",
    title: "Engineering Velocity & Throughput",
    description: "6-month trend of qualification artifacts, design reviews, and release gates completed.",
    category: "chart",
    tags: ["chart", "ri"],
    icon: TrendingUp,
    keywords: ["velocity", "throughput", "trend", "engineering"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/development/research-innovation/overview",
    component: RiVelocityWidget,
  },
  {
    id: "table.ri.top-programs",
    title: "Key Strategic Innovation Programs",
    description: "Live status, team leads, and readiness scores for core company EV research and innovation programs.",
    category: "table",
    tags: ["table", "ri"],
    icon: Rocket,
    keywords: ["programs", "projects", "innovation", "readiness"],
    defaultSize: "full",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/research-innovation/overview",
    component: RiTopProgramsWidget,
  },
  {
    id: "ai.ri.innovation-intelligence",
    title: "R&I Engineering AI Intelligence",
    description: "Automated multi-stream consistency checks, cross-discipline synchronization, and risk advisories.",
    category: "ai",
    tags: ["ai", "ri"],
    icon: Sparkles,
    keywords: ["ai", "intelligence", "compliance", "readiness"],
    defaultSize: "full",
    allowedSizes: ["full"],
    roles: "all",
    sourceRoute: "/development/research-innovation/overview",
    component: RiAiIntelligenceWidget,
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Code,
  Compass,
  Cpu,
  ExternalLink,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Layers,
  Package,
  Palette,
  Repeat,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  ComposedChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { CardHeader } from "@/components/erp/CardHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { chartColor } from "@/lib/chartColors";
import type { WidgetContentProps, WidgetDefinition } from "../../types";
import { PRODUCT_DEVELOPMENT_TABS, PRODUCT_DEV_MODULE_META } from "@/components/erp/ProductDevelopmentTabBar";

/* ===========================================================================
   1. Sprint Velocity & Engineering Story Points Delivered (2 of 3 cols - size "xl")
   =========================================================================== */
const mockPdSprintData = [
  { month: "Mar", points: 142, defectsClosed: 38, testYield: 94 },
  { month: "Apr", points: 168, defectsClosed: 44, testYield: 95 },
  { month: "May", points: 195, defectsClosed: 52, testYield: 96 },
  { month: "Jun", points: 230, defectsClosed: 61, testYield: 97 },
  { month: "Jul", points: 268, defectsClosed: 58, testYield: 98 },
  { month: "Aug", points: 310, defectsClosed: 74, testYield: 99 },
];

export const PdComposedTrendWidget = memo(function PdComposedTrendWidget({
  instance,
}: WidgetContentProps) {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader
          title={instance?.customTitle ?? "Engineering Velocity & Quality Yield Horizon"}
          right={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-primary" /> Story Points Delivered
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" /> Resolved Defects
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-indigo-500">
                <span className="h-1 w-3 rounded-full bg-indigo-500" /> Verification Yield %
              </span>
            </div>
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Monthly cumulative sprint engineering throughput vs resolved verification defects and automated HIL yield.
        </p>
      </div>

      <div className="mt-4 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mockPdSprintData} margin={{ top: 8, right: 12, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              tickFormatter={(v) => `${v} pts`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[85, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              tickFormatter={(v) => `${v}%`}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(val: number, name: string) => {
                if (name === "testYield") return [`${val}%`, "Test Yield"];
                if (name === "defectsClosed") return [`${val} resolved`, "Defects Closed"];
                return [`${val} pts`, "Points Delivered"];
              }}
            />
            <Bar yAxisId="left" dataKey="points" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={14} opacity={0.85} />
            <Bar yAxisId="left" dataKey="defectsClosed" fill="#10B981" radius={[4, 4, 0, 0]} barSize={14} />
            <Line yAxisId="right" type="monotone" dataKey="testYield" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366F1" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Design -> Build -> Release Pipeline Funnel (1 of 3 cols - size "md")
   =========================================================================== */
const mockPdFunnel = [
  { label: "1. Strategy & PRD", count: 24, icon: Target, route: "/development/product-development/prd" },
  { label: "2. Architecture & CAD", count: 18, icon: Cpu, route: "/development/product-development/product-architecture" },
  { label: "3. Hardware & Embedded", count: 15, icon: Cpu, route: "/development/product-development/embedded-systems-development" },
  { label: "4. Software & Cloud", count: 12, icon: Code, route: "/development/product-development/software-development" },
  { label: "5. Validation & Testing", count: 8, icon: Activity, route: "/development/product-development/testing-validation" },
  { label: "6. Release & Lifecycle", count: 5, icon: Rocket, route: "/development/product-development/product-release-management" },
];

export const PdFunnelWidget = memo(function PdFunnelWidget() {
  const maxFunnel = Math.max(1, ...mockPdFunnel.map((f) => f.count));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Product Engineering Gates
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">82 active programs progressing across lifecycle stages.</p>
          </div>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">6 Gates</span>
        </div>

        <div className="mt-4 space-y-3">
          {mockPdFunnel.map((item, idx) => (
            <div key={item.label} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <Link
                  to={item.route as any}
                  className="font-medium text-foreground hover:text-primary transition flex items-center gap-1.5"
                >
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                  <span>{item.label}</span>
                </Link>
                <span className="font-bold font-mono text-muted-foreground">{item.count} items</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.count / maxFunnel) * 100}%`,
                    backgroundColor: chartColor(idx),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>Average stage velocity: <strong>14.2 days</strong></span>
        <Link to="/development/product-development/product-roadmap" className="text-primary font-semibold hover:underline flex items-center gap-1">
          <span>Roadmap</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Engineering Discipline & Tech Stack Mix (1 of 3 cols - size "md")
   =========================================================================== */
const mockTechMix = [
  { discipline: "Embedded & Firmware", share: "28%", items: "32 MCU Baselines", color: "bg-blue-500" },
  { discipline: "Cloud & APIs", share: "24%", items: "28 Microservices", color: "bg-indigo-500" },
  { discipline: "Mechanical & Thermal", share: "20%", items: "24 CAD Assemblies", color: "bg-emerald-500" },
  { discipline: "Mobile Apps (iOS/Android)", share: "16%", items: "18 UI Modules", color: "bg-amber-500" },
  { discipline: "AI Edge Inference", share: "12%", items: "12 Trained Models", color: "bg-rose-500" },
];

export const PdTechStackMixWidget = memo(function PdTechStackMixWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-500" /> Engineering Discipline Breakdown
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Resource distribution across hardware, software & firmware.</p>
          </div>
          <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
            114 Modules
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {mockTechMix.map((t) => (
            <div key={t.discipline} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:bg-muted/20 transition">
              <div className="flex items-center gap-2.5">
                <span className={cn("h-3 w-3 rounded-full shrink-0", t.color)} />
                <div>
                  <div className="text-xs font-bold text-foreground">{t.discipline}</div>
                  <div className="text-[11px] text-muted-foreground">{t.items}</div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-foreground">{t.share}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>Cross-Discipline Sync: <strong>99.4%</strong></span>
        <Link to="/development/product-development/product-architecture" className="text-primary font-semibold hover:underline">
          View Architecture →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Cumulative Codebase & Engineering Velocity Area Curve (2 of 3 cols - size "xl")
   =========================================================================== */
const mockVelocityCurve = [
  { month: "Mar", prdRequirements: 45, verificationTests: 180, deployedBuilds: 24 },
  { month: "Apr", prdRequirements: 62, verificationTests: 240, deployedBuilds: 36 },
  { month: "May", prdRequirements: 85, verificationTests: 310, deployedBuilds: 52 },
  { month: "Jun", prdRequirements: 110, verificationTests: 420, deployedBuilds: 78 },
  { month: "Jul", prdRequirements: 138, verificationTests: 560, deployedBuilds: 104 },
  { month: "Aug", prdRequirements: 165, verificationTests: 720, deployedBuilds: 142 },
];

export const PdVelocityAreaWidget = memo(function PdVelocityAreaWidget({
  instance,
}: WidgetContentProps) {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader
          title={instance?.customTitle ?? "Cumulative Engineering Scale & Verification Growth"}
          right={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Verification Tests
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> PRD Requirements
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Staging Builds
              </span>
            </div>
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Autonomous trace growth of automated unit, integration, and environmental validation runs across firmware & cloud.
        </p>
      </div>

      <div className="mt-4 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockVelocityCurve} margin={{ top: 10, right: 12, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="pdTestsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pdPrdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="verificationTests" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#pdTestsGrad)" />
            <Area type="monotone" dataKey="prdRequirements" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#pdPrdGrad)" />
            <Area type="monotone" dataKey="deployedBuilds" stroke="#6366F1" strokeWidth={1.5} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Product Operations Ledger (5 tabs - size "xl")
   =========================================================================== */
type PdLedgerTab = "requirements" | "architecture" | "releases" | "changes" | "verification";

const PD_LEDGER_TABS: { id: PdLedgerTab; label: string }[] = [
  { id: "requirements", label: "PRD Requirements" },
  { id: "architecture", label: "System Architecture" },
  { id: "releases", label: "Active Releases" },
  { id: "changes", label: "ECR / ECO Orders" },
  { id: "verification", label: "Verification Runs" },
];

const mockRequirements = [
  { id: "PRD-2026-081", title: "MagFlow NextGen 240kW Inverter Baseline", stream: "High Voltage Inverter", owner: "Dr. Aris Vance", coverage: "100%", gate: "Phase 3 Design", status: "Approved" },
  { id: "PRD-2026-074", title: "Smart Grid Gateway MCU-v4 Firmware Suite", stream: "Edge Telemetry", owner: "Elena Rostova", coverage: "98%", gate: "Phase 4 Release", status: "In Review" },
  { id: "PRD-2026-069", title: "Modular Thermal Liquid Cooling Stack E3", stream: "Thermal Engineering", owner: "Marcus Sterling", coverage: "95%", gate: "Phase 2 Concept", status: "Active" },
  { id: "PRD-2026-058", title: "OCPP 2.0.1 Cloud Protocol Microservice", stream: "Cloud Infrastructure", owner: "Sarah Jenkins", coverage: "100%", gate: "Phase 4 Release", status: "Approved" },
  { id: "PRD-2026-042", title: "Technician Diagnostic Mobile App v2.1", stream: "Mobile Software", owner: "Devon Chen", coverage: "94%", gate: "Phase 3 Design", status: "Active" },
];

const mockArchitecture = [
  { id: "ARCH-014", name: "High-Voltage DC Power Subsystem", tier: "Hardware", modules: "Rectifier, Inverter, EMC Filter", lead: "Dr. Aris Vance", integrity: "100%", status: "Frozen" },
  { id: "ARCH-018", name: "Multi-Core Cortex-M7 Embedded Controller", tier: "Embedded", modules: "CAN-FD, Ethernet, FreeRTOS", lead: "Elena Rostova", integrity: "98%", status: "Active" },
  { id: "ARCH-022", name: "Cloud Telemetry Ingestion Pipeline", tier: "Cloud", modules: "MQTT Broker, Kafka, TimescaleDB", lead: "Sarah Jenkins", integrity: "100%", status: "Frozen" },
  { id: "ARCH-025", name: "Dual-Dispenser Mechanical Enclosure CMF", tier: "Mechanical", modules: "Chassis, Cable Retractor, IP65 Gasket", lead: "Marcus Sterling", integrity: "96%", status: "Active" },
];

const mockReleases = [
  { id: "REL-2026-04", name: "Firmware v3.4.0-rc2", product: "Smart EV Charger Pro", targetDate: "2026-09-15", lead: "Elena Rostova", testsPassed: "1,248 / 1,248", status: "Release Gate" },
  { id: "REL-2026-05", name: "Cloud Core Suite v2.8", product: "Magnertia Cloud Hub", targetDate: "2026-09-22", lead: "Sarah Jenkins", testsPassed: "580 / 580", status: "Staging" },
  { id: "REL-2026-06", name: "Diagnostic Mobile v2.1", product: "Fleet Companion", targetDate: "2026-10-01", lead: "Devon Chen", testsPassed: "312 / 312", status: "Beta Test" },
];

const mockChanges = [
  { id: "ECO-2026-029", title: "Inductor Core Thermal Dissipation Upgrade", priority: "High", requestedBy: "Marcus Sterling", costImpact: "₹ -140/unit", status: "Approved" },
  { id: "ECO-2026-031", title: "Switch to Automotive-Grade CAN Transceiver", priority: "Critical", requestedBy: "Elena Rostova", costImpact: "₹ +85/unit", status: "In Review" },
  { id: "ECR-2026-044", title: "Enclosure Top-Cover Quick-Release Latch", priority: "Medium", requestedBy: "Karthik Subramanian", costImpact: "₹ -320/unit", status: "Analysis" },
];

const mockVerification = [
  { id: "TEST-2026-904", title: "Full Power 240kW Thermal Soak 48H", suite: "Environmental / Thermal", executedBy: "Automated HIL Rack 2", yield: "99.8%", status: "Passed" },
  { id: "TEST-2026-912", title: "OCPP 2.0.1 Protocol Conformance Suite", suite: "Software & Cloud", executedBy: "CI/CD Test Runner", yield: "100%", status: "Passed" },
  { id: "TEST-2026-918", title: "Surge & High-Voltage Transient Immunity", suite: "EMC / Electrical", executedBy: "Lab Chamber B", yield: "100%", status: "Passed" },
];

export const PdOperationsLedgerWidget = memo(function PdOperationsLedgerWidget() {
  const [activeTab, setActiveTab] = useState<PdLedgerTab>("requirements");
  const [search, setSearch] = useState("");

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" /> Product Operations Ledger
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time engineering registries across PRD requirements, system architecture, active releases, and change orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter ledger entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary w-44"
            />
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5">
            {PD_LEDGER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-card text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[220px] overflow-x-auto">
        {/* TAB 1: PRD REQUIREMENTS */}
        {activeTab === "requirements" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">PRD ID</th>
                <th className="py-2.5 px-3">Requirement Title</th>
                <th className="py-2.5 px-3">Product Stream</th>
                <th className="py-2.5 px-3">Lead Engineer</th>
                <th className="py-2.5 px-3 text-right">Coverage</th>
                <th className="py-2.5 px-3 text-right">Gate</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockRequirements
                .filter((r) => !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase()))
                .map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">{r.id}</td>
                    <td className="py-2.5 px-3 font-bold text-foreground">{r.title}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{r.stream}</td>
                    <td className="py-2.5 px-3 text-foreground/80">{r.owner}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{r.coverage}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-muted-foreground">{r.gate}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* TAB 2: SYSTEM ARCHITECTURE */}
        {activeTab === "architecture" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Arch ID</th>
                <th className="py-2.5 px-3">Subsystem Architecture</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">Modules Bound</th>
                <th className="py-2.5 px-3">Subsystem Lead</th>
                <th className="py-2.5 px-3 text-right">Integrity</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockArchitecture
                .filter((a) => !search || a.id.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase()))
                .map((a) => (
                  <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">{a.id}</td>
                    <td className="py-2.5 px-3 font-bold text-foreground">{a.name}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{a.tier}</td>
                    <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate">{a.modules}</td>
                    <td className="py-2.5 px-3 text-foreground/80">{a.lead}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{a.integrity}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* TAB 3: ACTIVE RELEASES */}
        {activeTab === "releases" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Release Tag</th>
                <th className="py-2.5 px-3">Artifact Name</th>
                <th className="py-2.5 px-3">Target Product</th>
                <th className="py-2.5 px-3">Target Date</th>
                <th className="py-2.5 px-3">Release Lead</th>
                <th className="py-2.5 px-3 text-right">Tests Passed</th>
                <th className="py-2.5 px-3 text-right">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockReleases.map((rel) => (
                <tr key={rel.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{rel.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{rel.name}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{rel.product}</td>
                  <td className="py-2.5 px-3 font-mono text-muted-foreground">{rel.targetDate}</td>
                  <td className="py-2.5 px-3 text-foreground/80">{rel.lead}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{rel.testsPassed}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                      {rel.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 4: ECR / ECO ORDERS */}
        {activeTab === "changes" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">ECO/ECR ID</th>
                <th className="py-2.5 px-3">Change Title</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Requested By</th>
                <th className="py-2.5 px-3 text-right">Unit BOM Delta</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockChanges.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{c.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{c.title}</td>
                  <td className="py-2.5 px-3">
                    <span className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold",
                      c.priority === "Critical" ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600"
                    )}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-foreground/80">{c.requestedBy}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">{c.costImpact}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 5: VERIFICATION RUNS */}
        {activeTab === "verification" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Run ID</th>
                <th className="py-2.5 px-3">Validation Test Suite</th>
                <th className="py-2.5 px-3">Discipline</th>
                <th className="py-2.5 px-3">Execution Rig / Runner</th>
                <th className="py-2.5 px-3 text-right">Yield</th>
                <th className="py-2.5 px-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockVerification.map((v) => (
                <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{v.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{v.title}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{v.suite}</td>
                  <td className="py-2.5 px-3 text-foreground/80">{v.executedBy}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{v.yield}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

/* ===========================================================================
   6. Product Engineering Alerts & Release Horizon (1 of 3 cols - size "md")
   =========================================================================== */
const mockPdAlerts = [
  { title: "Release Gate Cleared", desc: "Firmware v3.4.0-rc2 passed UL 2594 EMC compliance test chamber with zero regressions.", type: "success" },
  { title: "HIL Thermal Anomaly", desc: "Rack 2 noticed 2.4°C higher thermal delta during dual-240kW peak charge load test.", type: "warning" },
  { title: "OTA Rollout Scheduled", desc: "Automated over-the-air firmware deployment scheduled for 120 pilot charging stations.", type: "info" },
];

const mockReleaseForecast = [
  { period: "Sep 2026", release: "Smart EV Charger Pro v3.4", readiness: 98 },
  { period: "Oct 2026", release: "Fleet Cloud Suite v2.8", readiness: 92 },
  { period: "Nov 2026", release: "Modular 480kW Power Stack", readiness: 84 },
];

export const PdAlertsForecastWidget = memo(function PdAlertsForecastWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader title="Engineering Alerts & Release Horizon" />
        <p className="mt-1 text-xs text-muted-foreground">Autonomous alerts across automated verification, HIL racks, and firmware OTA.</p>

        <div className="mt-4 space-y-3">
          {mockPdAlerts.map((al) => {
            const bg =
              al.type === "warning"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                : al.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400";
            return (
              <div key={al.title} className={cn("rounded-lg border p-3 text-xs leading-relaxed", bg)}>
                <div className="font-bold">{al.title}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{al.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
          3-Month Release Readiness Forecast
        </h4>
        <div className="space-y-2 text-xs">
          {mockReleaseForecast.map((fc) => (
            <div key={fc.period} className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <div>
                <span className="font-medium text-foreground block">{fc.release}</span>
                <span className="text-[10px] text-muted-foreground">{fc.period}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold tabular font-mono text-emerald-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>{fc.readiness}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   7. AI Product Engineering Intelligence Center (full width - size "full")
   =========================================================================== */
function PdScoreBall({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: number;
  inverse?: boolean;
}) {
  const isHealthy = inverse ? value < 20 : value > 80;
  const colorClass = isHealthy ? "text-[#22C55E]" : "text-destructive";
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-muted/20 p-4 shadow-2xs">
      <span className={`font-display text-2xl font-bold font-mono ${colorClass}`}>{value}%</span>
      <span className="mt-1 text-center text-[10px] font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export const PdAiIntelligenceWidget = memo(function PdAiIntelligenceWidget() {
  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between border-b border-border/40 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="h-5 w-5 animate-pulse text-primary" />
          <div>
            <h3 className="font-display text-[15px] font-semibold text-foreground">
              AI Product Engineering & Digital Thread Intelligence Center
            </h3>
            <p className="text-xs text-muted-foreground">
              Autonomous requirement traceability, gate compliance, thermal/electrical simulation telemetry, and release risk scoring.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AI Engine Active
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        <PdScoreBall label="PRD Traceability" value={99} />
        <PdScoreBall label="HIL Simulation Yield" value={98} />
        <PdScoreBall label="Gate Compliance" value={94} />
        <PdScoreBall label="Defect Escape Risk" value={11} inverse />
        <PdScoreBall label="Release Velocity" value={92} />
      </div>

      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-foreground space-y-2">
        <div className="flex items-center justify-between">
          <strong className="font-bold text-primary flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> AI Engineering Multipliers & Automated Recommendations:
          </strong>
          <button
            type="button"
            onClick={() => toast.success("Autonomous Verification Actions synchronized across digital thread!")}
            className="rounded bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
          >
            Synchronize Digital Thread Actions
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground pt-1">
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>All 18 active PRD requirement baselines have 100% downstream verification test coverage mapped in TanStack.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>MagFlow NextGen inverter platform passed 10,000 automated HIL test cycles with zero critical thermal excursions.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>Smart Grid Gateway MCU-v4 is ready for Phase 4 Release Gate approval with CE and UL compliance pre-verified.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>OTA firmware package v3.4.0 verified with SHA-256 digital signature and dual-bank rollback safety interlock.</span>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   8. Product Development 24 Submodules Directory Hub (full width - size "full")
   =========================================================================== */
interface PdSubmoduleItem {
  id: string;
  title: string;
  desc: string;
  path: string;
  icon: any;
  color: string;
  bg: string;
  tag: string;
  category: "strategy-architecture" | "electronics-embedded" | "software-digital" | "validation-lifecycle";
  score: number;
  stage: string;
  metric: string;
}

const PD_SUBMODULES: PdSubmoduleItem[] = [
  // 1. Strategy & Architecture
  {
    id: "STRAT",
    title: "Product Strategy",
    desc: "Strategic vision, portfolio role & multi-year market targets",
    path: "/development/product-development/product-strategy",
    icon: Target,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Vision",
    category: "strategy-architecture",
    score: 96,
    stage: "Active",
    metric: "4 Horizons",
  },
  {
    id: "ROADMAP",
    title: "Product Roadmap",
    desc: "Milestones, release horizons & strategic delivery timelines",
    path: "/development/product-development/product-roadmap",
    icon: TrendingUp,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "Horizons",
    category: "strategy-architecture",
    score: 92,
    stage: "Active",
    metric: "12 Milestones",
  },
  {
    id: "PRD",
    title: "Requirements (PRD)",
    desc: "Detailed engineering specifications & acceptance criteria",
    path: "/development/product-development/prd",
    icon: Package,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Specs",
    category: "strategy-architecture",
    score: 98,
    stage: "Approved",
    metric: "18 Baselines",
  },
  {
    id: "ARCH",
    title: "Product Architecture",
    desc: "Systemic boundaries, subsystem interfaces & modularity",
    path: "/development/product-development/product-architecture",
    icon: Layers,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Systemic",
    category: "strategy-architecture",
    score: 94,
    stage: "Frozen",
    metric: "4 Tiers",
  },
  {
    id: "ID",
    title: "Industrial Design",
    desc: "Ergonomics, CMF styling & physical user interaction",
    path: "/development/product-development/industrial-design",
    icon: Palette,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500/10",
    tag: "Styling",
    category: "strategy-architecture",
    score: 90,
    stage: "Active",
    metric: "IP65 Rating",
  },
  {
    id: "MECH",
    title: "Mechanical Design",
    desc: "3D CAD assemblies, thermal enclosures & structural analysis",
    path: "/development/product-development/mechanical-design",
    icon: Layers,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "3D CAD",
    category: "strategy-architecture",
    score: 93,
    stage: "Active",
    metric: "24 Assemblies",
  },

  // 2. Electronics & Embedded
  {
    id: "ELEC",
    title: "Electrical Design",
    desc: "High-voltage distribution, wiring harnesses & schematics",
    path: "/development/product-development/electrical-design",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Power HV",
    category: "electronics-embedded",
    score: 95,
    stage: "Active",
    metric: "1,000V DC",
  },
  {
    id: "PCB",
    title: "Electronics Design",
    desc: "Circuit board design, signal integrity & microcontroller layout",
    path: "/development/product-development/electronics-design",
    icon: Cpu,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "PCB/SMT",
    category: "electronics-embedded",
    score: 91,
    stage: "Fabricated",
    metric: "6 Layers",
  },
  {
    id: "EMBED",
    title: "Embedded Systems",
    desc: "MCU abstraction, RTOS scheduling & hardware interfaces",
    path: "/development/product-development/embedded-systems-development",
    icon: Cpu,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    tag: "RTOS",
    category: "electronics-embedded",
    score: 96,
    stage: "Active",
    metric: "Cortex-M7",
  },
  {
    id: "FW",
    title: "Firmware Development",
    desc: "Bootloaders, device drivers & secure OTA updates",
    path: "/development/product-development/firmware-development",
    icon: Code,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "OTA",
    category: "electronics-embedded",
    score: 97,
    stage: "Release Gate",
    metric: "v3.4.0-rc2",
  },
  {
    id: "IOT",
    title: "IoT Development",
    desc: "Edge telemetry, MQTT message queues & digital twins",
    path: "/development/product-development/iot-development",
    icon: Activity,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Telemetry",
    category: "electronics-embedded",
    score: 94,
    stage: "Active",
    metric: "100ms Ping",
  },

  // 3. Software & Digital
  {
    id: "SW",
    title: "Software Development",
    desc: "Enterprise core application software, algorithms & microservices",
    path: "/development/product-development/software-development",
    icon: Code,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Services",
    category: "software-digital",
    score: 95,
    stage: "Active",
    metric: "28 Services",
  },
  {
    id: "MOBILE",
    title: "Mobile App Development",
    desc: "Fleet companion apps across iOS & Android for real-time telemetry",
    path: "/development/product-development/mobile-app-development",
    icon: Smartphone,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "iOS/Android",
    category: "software-digital",
    score: 92,
    stage: "Beta Test",
    metric: "Flutter v3",
  },
  {
    id: "CLOUD",
    title: "Cloud Platform Development",
    desc: "Scalable serverless microservices, telemetry ingestion & storage",
    path: "/development/product-development/cloud-platform-development",
    icon: Cloud,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    tag: "Cloud",
    category: "software-digital",
    score: 98,
    stage: "Active",
    metric: "99.99% SLA",
  },
  {
    id: "API",
    title: "API Development",
    desc: "REST/gRPC interfaces, API security & developer documentation",
    path: "/development/product-development/api-development",
    icon: ExternalLink,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "OCPP 2.0.1",
    category: "software-digital",
    score: 99,
    stage: "Active",
    metric: "42 Endpoints",
  },
  {
    id: "AI",
    title: "AI Model Development",
    desc: "Edge inference, load balancing & demand forecasting models",
    path: "/development/product-development/ai-model-development",
    icon: Sparkles,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    tag: "ML Models",
    category: "software-digital",
    score: 91,
    stage: "Active",
    metric: "ONNX Edge",
  },
  {
    id: "UIUX",
    title: "UI/UX Development",
    desc: "Design system tokens, touch display interfaces & interaction flow",
    path: "/development/product-development/ui-ux-development",
    icon: Palette,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Design Tokens",
    category: "software-digital",
    score: 96,
    stage: "Approved",
    metric: "7-Inch Display",
  },

  // 4. Validation & Lifecycle
  {
    id: "SEC",
    title: "Cybersecurity Engineering",
    desc: "Threat modeling, Zero Trust architecture & penetration testing",
    path: "/development/product-development/cybersecurity-engineering",
    icon: ShieldCheck,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    tag: "Zero Trust",
    category: "validation-lifecycle",
    score: 97,
    stage: "Passed",
    metric: "ISO 27001",
  },
  {
    id: "SIM",
    title: "Simulation & Analysis",
    desc: "FEA/CFD CAE multi-physics simulation & structural stress modeling",
    path: "/development/product-development/simulation-analysis",
    icon: Activity,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "CAE/FEA",
    category: "validation-lifecycle",
    score: 95,
    stage: "Completed",
    metric: "340 Runs",
  },
  {
    id: "TEST",
    title: "Testing & Validation",
    desc: "Laboratory verification, automated HIL & environmental soak runs",
    path: "/development/product-development/testing-validation",
    icon: FileCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "HIL Tests",
    category: "validation-lifecycle",
    score: 99,
    stage: "Verified",
    metric: "10k Cycles",
  },
  {
    id: "CERT",
    title: "Certification Readiness",
    desc: "Standards conformance (CE, UL, ARAI, BIS) & compliance audit",
    path: "/development/product-development/certification-readiness",
    icon: ShieldCheck,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "UL/CE",
    category: "validation-lifecycle",
    score: 96,
    stage: "Ready",
    metric: "100% Passed",
  },
  {
    id: "DOCS",
    title: "Product Documentation",
    desc: "Datasheets, installation manuals, service guides & schematics",
    path: "/development/product-development/product-documentation",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Manuals",
    category: "validation-lifecycle",
    score: 94,
    stage: "Published",
    metric: "14 Docs",
  },
  {
    id: "REL",
    title: "Release Management",
    desc: "Release gate approval, version stamping & change management",
    path: "/development/product-development/product-release-management",
    icon: Rocket,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Gates",
    category: "validation-lifecycle",
    score: 98,
    stage: "Gate 4",
    metric: "Ready Release",
  },
  {
    id: "PLM",
    title: "Product Lifecycle (PLM)",
    desc: "Digital thread continuity, ECR/ECO orders & configuration baselines",
    path: "/development/product-development/product-lifecycle-management",
    icon: Repeat,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Digital Thread",
    category: "validation-lifecycle",
    score: 96,
    stage: "Live Thread",
    metric: "100% Trace",
  },
];

export const PdSubmodulesHubWidget = memo(function PdSubmodulesHubWidget() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = PD_SUBMODULES.filter((sub) => {
    const matchesCat = activeCategory === "all" || sub.category === activeCategory;
    const matchesSearch =
      !search ||
      sub.title.toLowerCase().includes(search.toLowerCase()) ||
      sub.desc.toLowerCase().includes(search.toLowerCase()) ||
      sub.tag.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-foreground flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" /> Product Development 24 Submodules Command Hub
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consolidated directory of all 24 engineering, electronics, firmware, software, cloud, and validation submodules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search submodules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary w-48"
            />
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5">
            {[
              { id: "all", label: "All (24)" },
              { id: "strategy-architecture", label: "Strategy & CAD (6)" },
              { id: "electronics-embedded", label: "Electronics & Embedded (5)" },
              { id: "software-digital", label: "Software & Cloud (6)" },
              { id: "validation-lifecycle", label: "Validation & PLM (7)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? "bg-white dark:bg-card text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((sub) => {
          const Icon = sub.icon;
          return (
            <Link
              key={sub.id}
              to={sub.path as any}
              className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-3.5 hover:border-primary/50 hover:bg-card hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", sub.bg, sub.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {sub.tag}
                  </span>
                </div>

                <h4 className="mt-2.5 text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  <span>{sub.title}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug line-clamp-2">
                  {sub.desc}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {sub.metric}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {sub.stage}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

/* ===========================================================================
   EXPORT ALL PANEL WIDGETS
   =========================================================================== */
export const PD_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.pd.composed-trend",
    title: "Engineering Velocity & Quality Yield",
    description: "Monthly cumulative sprint story points delivered vs resolved verification defects and test yield.",
    category: "chart",
    tags: ["chart", "pd"],
    icon: TrendingUp,
    keywords: ["points", "trend", "velocity", "defects", "yield"],
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/product-development/product-roadmap",
    component: PdComposedTrendWidget,
  },
  {
    id: "chart.pd.funnel",
    title: "Product Engineering Gates Funnel",
    description: "Multi-stage product engineering lifecycle gates from PRD to production release.",
    category: "chart",
    tags: ["chart", "pd"],
    icon: Layers,
    keywords: ["design", "build", "release", "funnel", "pipeline", "prd"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/development/product-development/prd",
    component: PdFunnelWidget,
  },
  {
    id: "list.pd.tech-stack-mix",
    title: "Engineering Discipline Breakdown",
    description: "Resource and module distribution across hardware, software, embedded, and cloud.",
    category: "list",
    tags: ["list", "pd"],
    icon: Cpu,
    keywords: ["discipline", "tech stack", "hardware", "software", "embedded"],
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    roles: "all",
    sourceRoute: "/development/product-development/product-architecture",
    component: PdTechStackMixWidget,
  },
  {
    id: "chart.pd.velocity-curve",
    title: "Cumulative Engineering Scale & Verification Growth",
    description: "Progression curve of automated verification tests, PRD specs, and deployed builds.",
    category: "chart",
    tags: ["chart", "pd"],
    icon: Activity,
    keywords: ["velocity", "area", "scale", "tests", "curve"],
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/product-development/testing-validation",
    component: PdVelocityAreaWidget,
  },
  {
    id: "table.pd.operations-ledger",
    title: "Product Operations Ledger",
    description: "Multi-tab registers across PRD requirements, architecture, releases, and ECR/ECO change orders.",
    category: "table",
    tags: ["table", "pd"],
    icon: Zap,
    keywords: ["operations", "ledger", "requirements", "architecture", "releases", "eco"],
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/product-development/product-lifecycle-management",
    component: PdOperationsLedgerWidget,
  },
  {
    id: "insight.pd-alerts",
    title: "Engineering Alerts & Release Horizon",
    description: "Autonomous alerts across automated verification, HIL racks, and firmware OTA.",
    category: "insight",
    tags: ["insight", "pd"],
    icon: AlertCircle,
    keywords: ["alerts", "forecast", "release", "milestones"],
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    roles: "all",
    sourceRoute: "/development/product-development/product-release-management",
    component: PdAlertsForecastWidget,
  },
  {
    id: "ai.pd.engineering-intelligence",
    title: "Product Engineering AI Intelligence",
    description: "Traceability analytics, automated release readiness forecasting, and digital thread telemetry.",
    category: "ai",
    tags: ["ai", "pd"],
    icon: Sparkles,
    keywords: ["ai", "engineering", "traceability", "intelligence", "plm"],
    defaultSize: "full",
    allowedSizes: ["full"],
    roles: "all",
    sourceRoute: "/development/product-development/overview",
    component: PdAiIntelligenceWidget,
  },
];

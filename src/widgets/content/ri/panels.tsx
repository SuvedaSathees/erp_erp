/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  CheckSquare,
  Cloud,
  Code,
  Compass,
  Cpu,
  ExternalLink,
  Factory,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Layers,
  Palette,
  Repeat,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
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

/* ===========================================================================
   1. Innovation Velocity & Gate Approvals Horizon (2 of 3 cols - size "xl")
   =========================================================================== */
const mockRiVelocityData = [
  { month: "Mar", gatesApproved: 42, patentFilings: 3, trlScore: 82 },
  { month: "Apr", gatesApproved: 58, patentFilings: 5, trlScore: 85 },
  { month: "May", gatesApproved: 67, patentFilings: 8, trlScore: 87 },
  { month: "Jun", gatesApproved: 81, patentFilings: 11, trlScore: 90 },
  { month: "Jul", gatesApproved: 95, patentFilings: 14, trlScore: 92 },
  { month: "Aug", gatesApproved: 114, patentFilings: 18, trlScore: 94 },
];

export const RiComposedTrendWidget = memo(function RiComposedTrendWidget({
  instance,
}: WidgetContentProps) {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader
          title={instance?.customTitle ?? "Innovation Velocity & Intellectual Property Horizon"}
          right={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-primary" /> Stage Gates Cleared
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" /> Patents Filed
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-indigo-500">
                <span className="h-1 w-3 rounded-full bg-indigo-500" /> TRL Maturity Index %
              </span>
            </div>
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Monthly cumulative qualification gate completions vs proprietary IP disclosures and composite TRL readiness.
        </p>
      </div>

      <div className="mt-4 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mockRiVelocityData} margin={{ top: 8, right: 12, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[75, 100]}
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
                if (name === "trlScore") return [`${val}%`, "TRL Index"];
                if (name === "patentFilings") return [`${val} patents`, "Patents Filed"];
                return [`${val} gates`, "Gates Cleared"];
              }}
            />
            <Bar yAxisId="left" dataKey="gatesApproved" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={14} opacity={0.85} />
            <Bar yAxisId="left" dataKey="patentFilings" fill="#10B981" radius={[4, 4, 0, 0]} barSize={14} />
            <Line yAxisId="right" type="monotone" dataKey="trlScore" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366F1" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Innovation Stage-Gate Pipeline Funnel (1 of 3 cols - size "md")
   =========================================================================== */
const mockRiFunnel = [
  { label: "1. Cloud, AI & Architecture", count: 52, icon: Cpu, route: "/development/research-innovation/cloud-platform-development/new" },
  { label: "2. CAE Simulation & Analysis", count: 37, icon: Activity, route: "/development/research-innovation/simulation-analysis/new" },
  { label: "3. Industrialization & Tooling", count: 43, icon: Sliders, route: "/development/research-innovation/tooling-development/new" },
  { label: "4. Operations, Standards & BOM", count: 79, icon: Layers, route: "/development/research-innovation/bom-engineering/new" },
  { label: "5. Quality & APQP Validation", count: 69, icon: ShieldCheck, route: "/development/research-innovation/testing-validation/new" },
  { label: "6. Certification & Release", count: 19, icon: Award, route: "/development/research-innovation/certification-readiness/new" },
];

export const RiFunnelWidget = memo(function RiFunnelWidget() {
  const maxFunnel = Math.max(1, ...mockRiFunnel.map((f) => f.count));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" /> Innovation Stage Gates
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">299 active engineering baselines across R&I gates.</p>
          </div>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">6 Gates</span>
        </div>

        <div className="mt-4 space-y-3">
          {mockRiFunnel.map((item, idx) => (
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
        <span>Average gate cycle: <strong>16.4 days</strong></span>
        <Link to="/development/research-innovation/testing-validation/new" className="text-primary font-semibold hover:underline flex items-center gap-1">
          <span>Verification</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Technology Stream Distribution (1 of 3 cols - size "md")
   =========================================================================== */
const mockRiTechMix = [
  { stream: "Power Electronics (SiC Inverters)", share: "28%", items: "36 Active Modules", color: "bg-blue-500" },
  { stream: "CAE Structural & Thermal Sim", share: "24%", items: "31 Validated Models", color: "bg-indigo-500" },
  { stream: "Smart Cloud & IIoT Gateways", share: "20%", items: "26 Microservices", color: "bg-emerald-500" },
  { stream: "Industrial Tooling & Cobots", share: "16%", items: "21 Line Workstations", color: "bg-amber-500" },
  { stream: "Cybersecurity Zero Trust Core", share: "12%", items: "15 Threat Baselines", color: "bg-rose-500" },
];

export const RiTechMixWidget = memo(function RiTechMixWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-500" /> Technology Stream Allocation
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Research focus across hardware, CAE, cloud, and cybersecurity.</p>
          </div>
          <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
            129 Modules
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {mockRiTechMix.map((t) => (
            <div key={t.stream} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:bg-muted/20 transition">
              <div className="flex items-center gap-2.5">
                <span className={cn("h-3 w-3 rounded-full shrink-0", t.color)} />
                <div>
                  <div className="text-xs font-bold text-foreground">{t.stream}</div>
                  <div className="text-[11px] text-muted-foreground">{t.items}</div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-foreground">{t.share}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>R&D Cross-Pollination: <strong>99.6%</strong></span>
        <Link to="/development/research-innovation/simulation-analysis/new" className="text-primary font-semibold hover:underline">
          View Simulations →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Cumulative Engineering Scale & TRL Growth Area Curve (2 of 3 cols - size "xl")
   =========================================================================== */
const mockRiAreaCurve = [
  { month: "Mar", caeRuns: 120, ipClaims: 18, prototypesBuilt: 6 },
  { month: "Apr", caeRuns: 165, ipClaims: 26, prototypesBuilt: 10 },
  { month: "May", caeRuns: 210, ipClaims: 34, prototypesBuilt: 15 },
  { month: "Jun", caeRuns: 260, ipClaims: 48, prototypesBuilt: 22 },
  { month: "Jul", caeRuns: 305, ipClaims: 64, prototypesBuilt: 30 },
  { month: "Aug", caeRuns: 342, ipClaims: 78, prototypesBuilt: 38 },
];

export const RiVelocityAreaWidget = memo(function RiVelocityAreaWidget({
  instance,
}: WidgetContentProps) {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader
          title={instance?.customTitle ?? "R&D Prototype Scale & CAE Simulation Growth"}
          right={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> CAE Simulation Runs
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> IP Claims Filed
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Working Prototypes
              </span>
            </div>
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Autonomous multi-physics FEA/CFD mesh evaluations, patent disclosures, and physical prototype qualification builds.
        </p>
      </div>

      <div className="mt-4 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockRiAreaCurve} margin={{ top: 10, right: 12, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="riCaeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="riIpGrad" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="caeRuns" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#riCaeGrad)" />
            <Area type="monotone" dataKey="ipClaims" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#riIpGrad)" />
            <Area type="monotone" dataKey="prototypesBuilt" stroke="#6366F1" strokeWidth={1.5} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Research & Innovation Operations Ledger (5 tabs - size "xl")
   =========================================================================== */
type RiLedgerTab = "flagships" | "cae" | "cyber" | "uiux" | "cert";

const RI_LEDGER_TABS: { id: RiLedgerTab; label: string }[] = [
  { id: "flagships", label: "Flagship Programs" },
  { id: "cae", label: "CAE Simulations" },
  { id: "cyber", label: "Cyber Threat Models" },
  { id: "uiux", label: "UI/UX Design Tokens" },
  { id: "cert", label: "Certification Gates" },
];

const mockFlagships = [
  { id: "PROD-EV-7KW", name: "Smart EV Charger AC 7kW (Dual Type-2)", stage: "Certification Gate", lead: "Rahul Sharma", submodules: "Certification, UI/UX, Testing", readiness: "94%", status: "On Track" },
  { id: "PROD-EV-240KW", name: "Ultra-Fast DC 240kW Power Hub", stage: "HIL Integration", lead: "Dr. Aris Vance", submodules: "Simulation, Tooling, Inverter", readiness: "91%", status: "Active" },
  { id: "GRID-GW-04", name: "Smart Grid Gateway Telemetry Node", stage: "Process Validation", lead: "Elena Rostova", submodules: "Cloud, Cyber, Embedded", readiness: "96%", status: "Approved" },
];

const mockCae = [
  { id: "SIM-2024-0027", title: "W-EVSE Thermal Liquid Cold Plate CFD", solver: "OpenFOAM Multi-Region", elements: "4.8M Cells", deltaT: "4.2°C Max", convergence: "1e-6", status: "Converged" },
  { id: "SIM-2024-0031", title: "Enclosure Structural Seismic & Wind Load FEA", solver: "ANSYS Mechanical", elements: "2.1M Solid", deltaT: "12mm Deflection", convergence: "100%", status: "Passed" },
  { id: "SIM-2024-0035", title: "EMC High-Frequency Radiation Simulation", solver: "HFSS Electromagnetic", elements: "1.4M Mesh", deltaT: "-18dB Margin", convergence: "Passed", status: "Passed" },
];

const mockCyber = [
  { id: "CSE-2024-0018", title: "OCPP 2.0.1 Mutual TLS STRIDE Threat Model", tier: "Cloud & Telemetry", tester: "Rahul Sharma", findings: "0 Critical / 1 Low", mitigation: "Key Rotation Enforced", status: "Hardened" },
  { id: "CSE-2024-0022", title: "Embedded MCU CAN-FD Bus Injection Pentest", tier: "Firmware", tester: "Security Audit Team", findings: "0 Critical / 0 High", mitigation: "Hardware Secure Boot", status: "Verified" },
  { id: "CSE-2024-0026", title: "Mobile App Companion API Rate Limiting", tier: "API & Mobile", tester: "DevSecOps Rig", findings: "0 Critical", mitigation: "Token Bucket Enforced", status: "Hardened" },
];

const mockUiUx = [
  { id: "UIUX-2024-0017", title: "Smart EV Charger 7-Inch Touch Handoff v3.2", screen: "Charging Status Screen", tokens: "420 Tokens", compliance: "WCAG 2.1 AA", status: "Approved" },
  { id: "UIUX-2024-0021", title: "Fleet Management Operator Web Console", screen: "Live Telemetry Map", tokens: "580 Tokens", compliance: "Design System v4", status: "In Review" },
  { id: "UIUX-2024-0025", title: "Technician Field Maintenance Android Flow", screen: "Diagnostic Terminal", tokens: "210 Tokens", compliance: "Material 3 EV", status: "Active" },
];

const mockCert = [
  { id: "CERT-2024-008", standard: "UL 2594 / UL 2231 Electric Vehicle Supply", lab: "UL Laboratories", targetDate: "2026-09-30", testsPassed: "44 / 44", status: "Ready Gate" },
  { id: "CERT-2024-012", standard: "CE IEC 61851-1 Conductive Charging", lab: "TUV Rheinland", targetDate: "2026-10-15", testsPassed: "38 / 38", status: "Approved" },
  { id: "CERT-2024-015", standard: "ARAI AIS-138 Part 1 Fast DC Compliance", lab: "ARAI Automotive Center", targetDate: "2026-10-30", testsPassed: "26 / 28", status: "Under Review" },
];

export const RiOperationsLedgerWidget = memo(function RiOperationsLedgerWidget() {
  const [activeTab, setActiveTab] = useState<RiLedgerTab>("flagships");
  const [search, setSearch] = useState("");

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-foreground flex items-center gap-2">
            <Rocket className="h-4 w-4 text-amber-500" /> Research & Innovation Operations Ledger
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time R&D registers across strategic programs, CAE simulations, cybersecurity pentests, UI design, and compliance.
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
            {RI_LEDGER_TABS.map((tab) => (
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
        {/* TAB 1: FLAGSHIPS */}
        {activeTab === "flagships" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Program ID</th>
                <th className="py-2.5 px-3">Innovation Program Name</th>
                <th className="py-2.5 px-3">Stage Gate</th>
                <th className="py-2.5 px-3">Lead Architect</th>
                <th className="py-2.5 px-3 text-right">Readiness</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockFlagships
                .filter((f) => !search || f.id.toLowerCase().includes(search.toLowerCase()) || f.name.toLowerCase().includes(search.toLowerCase()))
                .map((f) => (
                  <tr key={f.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">{f.id}</td>
                    <td className="py-2.5 px-3 font-bold text-foreground">{f.name}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{f.stage}</td>
                    <td className="py-2.5 px-3 text-foreground/80">{f.lead}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{f.readiness}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* TAB 2: CAE SIMULATIONS */}
        {activeTab === "cae" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Sim ID</th>
                <th className="py-2.5 px-3">Analysis Case Name</th>
                <th className="py-2.5 px-3">FEA/CFD Solver</th>
                <th className="py-2.5 px-3">Mesh Density</th>
                <th className="py-2.5 px-3 text-right">Key Result</th>
                <th className="py-2.5 px-3 text-right">Convergence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockCae.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{c.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{c.title}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{c.solver}</td>
                  <td className="py-2.5 px-3 text-foreground/80 font-mono">{c.elements}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">{c.deltaT}</td>
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

        {/* TAB 3: CYBER THREAT MODELS */}
        {activeTab === "cyber" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Threat Model</th>
                <th className="py-2.5 px-3">Architecture Assessment Scope</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">Findings</th>
                <th className="py-2.5 px-3 text-right">Mitigation Control</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockCyber.map((cb) => (
                <tr key={cb.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{cb.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{cb.title}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{cb.tier}</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-semibold">{cb.findings}</td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">{cb.mitigation}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {cb.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 4: UI/UX DESIGN TOKENS */}
        {activeTab === "uiux" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Design Token ID</th>
                <th className="py-2.5 px-3">UI/UX Flow / Touch Layout</th>
                <th className="py-2.5 px-3">Screen Class</th>
                <th className="py-2.5 px-3 text-right">Tokens Exported</th>
                <th className="py-2.5 px-3 text-right">Accessibility</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockUiUx.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{u.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{u.title}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{u.screen}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">{u.tokens}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 font-semibold">{u.compliance}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 5: CERTIFICATION GATES */}
        {activeTab === "cert" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Gate ID</th>
                <th className="py-2.5 px-3">Certification Standard</th>
                <th className="py-2.5 px-3">Accredited Testing Body</th>
                <th className="py-2.5 px-3 text-right">Target Date</th>
                <th className="py-2.5 px-3 text-right">Tests Cleared</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockCert.map((ct) => (
                <tr key={ct.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{ct.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{ct.standard}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{ct.lab}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">{ct.targetDate}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{ct.testsPassed}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {ct.status}
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
   6. Innovation Alerts & Commercialization Horizon (1 of 3 cols - size "md")
   =========================================================================== */
const mockRiAlerts = [
  { title: "Patent Award Granted", desc: "Indian Patent Office granted patent for 'Adaptive Microgrid EV Inverter Control'.", type: "success" },
  { title: "CAE Cold Plate Converged", desc: "Thermal CFD simulation achieved 1e-6 convergence with 4.2°C maximum differential.", type: "info" },
  { title: "Zero Trust Audit Cleared", desc: "STRIDE threat model completed for OCPP 2.0.1 with zero critical vulnerabilities.", type: "success" },
];

const mockCommercialForecast = [
  { period: "Q4 2026", product: "Smart EV Charger AC 7kW", readiness: 96, targetTam: "₹ 45 Cr" },
  { period: "Q1 2027", product: "Ultra-Fast DC 240kW Hub", readiness: 91, targetTam: "₹ 125 Cr" },
  { period: "Q2 2027", product: "Smart Grid Gateway Microgrid", readiness: 86, targetTam: "₹ 68 Cr" },
];

export const RiAlertsForecastWidget = memo(function RiAlertsForecastWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader title="Innovation Radar & Horizon Forecast" />
        <p className="mt-1 text-xs text-muted-foreground">Autonomous alerts across IP filings, CAE simulation convergence, and regulatory certifications.</p>

        <div className="mt-4 space-y-3">
          {mockRiAlerts.map((al) => {
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
          3-Quarter Commercialization Horizon
        </h4>
        <div className="space-y-2 text-xs">
          {mockCommercialForecast.map((fc) => (
            <div key={fc.period} className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <div>
                <span className="font-medium text-foreground block">{fc.product}</span>
                <span className="text-[10px] text-muted-foreground">{fc.period} · TAM {fc.targetTam}</span>
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
   7. AI Research & Innovation Intelligence Center (full width - size "full")
   =========================================================================== */
function RiScoreBall({
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

export const RiAiIntelligenceWidget = memo(function RiAiIntelligenceWidget() {
  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between border-b border-border/40 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="h-5 w-5 animate-pulse text-primary" />
          <div>
            <h3 className="font-display text-[15px] font-semibold text-foreground">
              AI Research, Innovation & Digital Engineering Intelligence Center
            </h3>
            <p className="text-xs text-muted-foreground">
              Predictive simulation fidelity, automated threat surface hardening, IP patent novelty analysis, and TRL readiness.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AI Innovation Engine Active
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        <RiScoreBall label="Composite Readiness" value={91} />
        <RiScoreBall label="Gate Adherence" value={94} />
        <RiScoreBall label="Simulation Accuracy" value={98} />
        <RiScoreBall label="Threat Hardening" value={96} />
        <RiScoreBall label="TRL Advancement" value={88} />
      </div>

      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-foreground space-y-2">
        <div className="flex items-center justify-between">
          <strong className="font-bold text-primary flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Autonomous R&D Multipliers & Actions:
          </strong>
          <button
            type="button"
            onClick={() => toast.success("Autonomous Innovation Multipliers executed across R&D streams!")}
            className="rounded bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
          >
            Execute Autonomous R&D Actions
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground pt-1">
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>All 27 active R&I submodules synchronized with live digital thread tracking across TanStack Router.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>Thermal cold plate CFD mesh resolved with 1e-6 convergence and ready for tooling CAD freeze.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>18 patent claims validated for novelty against South Asian & European EV charging patent databases.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>Zero open critical vulnerabilities across all cloud telemetry endpoints and embedded FreeRTOS drivers.</span>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   8. Research & Innovation 27 Submodules Directory Hub (full width - size "full")
   =========================================================================== */
interface RiSubmoduleItem {
  id: string;
  title: string;
  desc: string;
  path: string;
  icon: any;
  color: string;
  bg: string;
  tag: string;
  category: "cyber-cloud" | "cae-testing" | "tooling-mfg" | "quality-release";
  score: number;
  stage: string;
  metric: string;
}

const RI_SUBMODULES: RiSubmoduleItem[] = [
  // 1. Architecture, Cyber & Cloud (5)
  {
    id: "CLOUD",
    title: "Cloud Platform Development",
    desc: "Enterprise cloud telemetry, microservices & scalable ingestion",
    path: "/development/research-innovation/cloud-platform-development/new",
    icon: Cloud,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Cloud",
    category: "cyber-cloud",
    score: 98,
    stage: "Active",
    metric: "99.99% SLA",
  },
  {
    id: "AI",
    title: "AI Model Development",
    desc: "Machine learning edge models, load forecasting & telemetry",
    path: "/development/research-innovation/ai-model-development/new",
    icon: Sparkles,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "AI Models",
    category: "cyber-cloud",
    score: 92,
    stage: "Active",
    metric: "ONNX Edge",
  },
  {
    id: "API",
    title: "API Development",
    desc: "REST/gRPC interfaces, OCPP 2.0.1 compliance & developer APIs",
    path: "/development/research-innovation/api-development/new",
    icon: ExternalLink,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "APIs",
    category: "cyber-cloud",
    score: 99,
    stage: "Active",
    metric: "42 Endpoints",
  },
  {
    id: "CYBER",
    title: "Cybersecurity Engineering",
    desc: "Zero Trust threat modeling, STRIDE analysis & penetration tests",
    path: "/development/research-innovation/cybersecurity-engineering/new",
    icon: ShieldCheck,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    tag: "Security",
    category: "cyber-cloud",
    score: 97,
    stage: "Passed",
    metric: "ISO 27001",
  },
  {
    id: "UIUX",
    title: "UI/UX Development",
    desc: "Design tokens, touchscreen display layouts & interaction flow",
    path: "/development/research-innovation/ui-ux-development/new",
    icon: Palette,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Design Tokens",
    category: "cyber-cloud",
    score: 95,
    stage: "Approved",
    metric: "7-Inch Display",
  },

  // 2. CAE Simulation & Testing (4)
  {
    id: "SIM",
    title: "Simulation & Analysis",
    desc: "Multi-physics FEA/CFD simulations & thermal enclosure modeling",
    path: "/development/research-innovation/simulation-analysis/new",
    icon: Activity,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "CAE/FEA",
    category: "cae-testing",
    score: 96,
    stage: "Converged",
    metric: "342 Runs",
  },
  {
    id: "TEST",
    title: "Testing & Validation",
    desc: "Hardware-in-the-loop (HIL) testing & environmental validation",
    path: "/development/research-innovation/testing-validation/new",
    icon: FileCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Validation",
    category: "cae-testing",
    score: 98,
    stage: "Verified",
    metric: "10k Cycles",
  },
  {
    id: "PRODENG",
    title: "Production Engineering",
    desc: "Manufacturing feasibility, process flows & line cycle times",
    path: "/development/research-innovation/production-engineering/new",
    icon: Settings,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Process",
    category: "cae-testing",
    score: 93,
    stage: "Active",
    metric: "18 Flows",
  },
  {
    id: "CERT",
    title: "Certification Readiness",
    desc: "CE, UL, ARAI compliance gap analysis & testing certifications",
    path: "/development/research-innovation/certification-readiness/new",
    icon: Award,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Standards",
    category: "cae-testing",
    score: 96,
    stage: "Ready Gate",
    metric: "100% Passed",
  },

  // 3. Industrialization & Tooling (8)
  {
    id: "LINE",
    title: "Assembly Line Development",
    desc: "Takt balancing, ergonomics & workstation cell design",
    path: "/development/research-innovation/assembly-line-development/new",
    icon: Factory,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Assembly",
    category: "tooling-mfg",
    score: 95,
    stage: "Balanced",
    metric: "42s Takt",
  },
  {
    id: "FIXT",
    title: "Fixture Development",
    desc: "Clamping fixtures, locating pins & precision jigs",
    path: "/development/research-innovation/fixture-development/new",
    icon: Wrench,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Fixtures",
    category: "tooling-mfg",
    score: 92,
    stage: "Active",
    metric: "48 Stations",
  },
  {
    id: "TOOL",
    title: "Tooling Development",
    desc: "Stamping dies, injection molds & tooling life tracking",
    path: "/development/research-innovation/tooling-development/new",
    icon: Wrench,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Dies/Molds",
    category: "tooling-mfg",
    score: 97,
    stage: "Optimal",
    metric: "32 Tool Sets",
  },
  {
    id: "JIG",
    title: "Jig Development",
    desc: "Drilling, alignment & end-of-line verification jigs",
    path: "/development/research-innovation/jig-development/new",
    icon: Settings,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Jigs",
    category: "tooling-mfg",
    score: 94,
    stage: "Active",
    metric: "22 Jigs",
  },
  {
    id: "LAYOUT",
    title: "Factory Layout Design",
    desc: "Material flow pathways, utility drops & plant layouts",
    path: "/development/research-innovation/factory-layout-design/new",
    icon: Layers,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    tag: "Plant Layout",
    category: "tooling-mfg",
    score: 96,
    stage: "Approved",
    metric: "Plant 1 & 2",
  },
  {
    id: "SMART",
    title: "Smart Factory Development",
    desc: "IIoT edge telemetry, SCADA & MES digital integration",
    path: "/development/research-innovation/smart-factory-development/new",
    icon: Zap,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    tag: "Industry 4.0",
    category: "tooling-mfg",
    score: 98,
    stage: "Active",
    metric: "89.4% OEE",
  },
  {
    id: "EXCELL",
    title: "Manufacturing Excellence",
    desc: "World-class manufacturing, 5S kaizen & TPM",
    path: "/development/research-innovation/manufacturing-excellence/new",
    icon: Award,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "TPM",
    category: "tooling-mfg",
    score: 93,
    stage: "Audited",
    metric: "5S Passed",
  },
  {
    id: "CAP",
    title: "Capacity Planning",
    desc: "Line utilization, shift patterns & bottleneck modeling",
    path: "/development/research-innovation/capacity-planning/new",
    icon: BarChart3,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Throughput",
    category: "tooling-mfg",
    score: 91,
    stage: "Active",
    metric: "3,450 u/mo",
  },

  // 4. Quality, Standards & BOM (10)
  {
    id: "APQP",
    title: "Quality Planning (APQP)",
    desc: "Product quality timing, gate reviews & timing commitments",
    path: "/development/research-innovation/quality-planning-apqp/new",
    icon: ShieldCheck,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "APQP",
    category: "quality-release",
    score: 96,
    stage: "Phase 3",
    metric: "22 Gates",
  },
  {
    id: "PFMEA",
    title: "PFMEA Development",
    desc: "Process failure mode & effects analysis risk matrix",
    path: "/development/research-innovation/pfmea-development/new",
    icon: CheckSquare,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    tag: "PFMEA",
    category: "quality-release",
    score: 94,
    stage: "RPN < 40",
    metric: "14 Modes",
  },
  {
    id: "CP",
    title: "Control Plan Development",
    desc: "Inspection criteria, sampling frequencies & reaction plans",
    path: "/development/research-innovation/control-plan/new",
    icon: FileCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Control",
    category: "quality-release",
    score: 95,
    stage: "Active",
    metric: "16 Plans",
  },
  {
    id: "VAL",
    title: "Process Validation",
    desc: "PPAP submission packages, dimensional runs & warrants",
    path: "/development/research-innovation/process-validation/new",
    icon: ShieldCheck,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "PPAP",
    category: "quality-release",
    score: 98,
    stage: "Level 3",
    metric: "3 Warrants",
  },
  {
    id: "WI",
    title: "Work Instructions",
    desc: "Digital standard operator sheets (SOS) & visual aids",
    path: "/development/research-innovation/work-instruction-development/new",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Digital SOS",
    category: "quality-release",
    score: 97,
    stage: "Active",
    metric: "42 Workstations",
  },
  {
    id: "SOP",
    title: "SOP Development",
    desc: "Standard Operating Procedures for shop floor safety & setup",
    path: "/development/research-innovation/sop-development/new",
    icon: FileCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "SOPs",
    category: "quality-release",
    score: 95,
    stage: "Published",
    metric: "38 SOPs",
  },
  {
    id: "BOM",
    title: "BOM Engineering",
    desc: "Manufacturing BOM (MBOM) & engineering bill of materials",
    path: "/development/research-innovation/bom-engineering/new",
    icon: FileSpreadsheet,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "MBOM",
    category: "quality-release",
    score: 99,
    stage: "100% Sync",
    metric: "MBOM Tree",
  },
  {
    id: "ROUTE",
    title: "Routing Development",
    desc: "Work center sequences, machine run times & operations",
    path: "/development/research-innovation/routing-development/new",
    icon: ArrowRight,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Routing",
    category: "quality-release",
    score: 94,
    stage: "Active",
    metric: "28 Work Centers",
  },
  {
    id: "DOCS",
    title: "Product Documentation",
    desc: "Technical datasheets, user guides & release manuals",
    path: "/development/research-innovation/product-documentation/new",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Manuals",
    category: "quality-release",
    score: 94,
    stage: "Published",
    metric: "14 Docs",
  },
  {
    id: "REL",
    title: "Product Release Management",
    desc: "Multi-disciplinary release gates & commercial signoffs",
    path: "/development/research-innovation/product-release-management/new",
    icon: Rocket,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Release Gate",
    category: "quality-release",
    score: 98,
    stage: "Gate 4",
    metric: "Authorized",
  },
];

export const RiSubmodulesHubWidget = memo(function RiSubmodulesHubWidget() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = RI_SUBMODULES.filter((sub) => {
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
            <Layers className="h-4 w-4 text-primary" /> Research & Innovation 27 Submodules Command Hub
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consolidated directory of all 27 engineering, CAE simulation, cyber, tooling, quality, and digital innovation modules.
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
              { id: "all", label: "All (27)" },
              { id: "cyber-cloud", label: "Architecture & Cloud (5)" },
              { id: "cae-testing", label: "CAE & Testing (4)" },
              { id: "tooling-mfg", label: "Tooling & Line (8)" },
              { id: "quality-release", label: "Quality & Release (10)" },
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
   EXPORT ALL RI PANEL WIDGETS
   =========================================================================== */
export const RI_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.ri.composed-trend",
    title: "Innovation Velocity & Intellectual Property",
    description: "Monthly qualification gate completions vs patent disclosures and TRL maturity.",
    category: "chart",
    tags: ["chart", "ri"],
    icon: TrendingUp,
    keywords: ["velocity", "patents", "trl", "gates", "ri"],
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/research-innovation/testing-validation/new",
    component: RiComposedTrendWidget,
  },
  {
    id: "chart.ri.funnel",
    title: "Innovation Stage Gates Funnel",
    description: "Pipeline of active engineering baselines across R&I lifecycle gates.",
    category: "chart",
    tags: ["chart", "ri"],
    icon: Compass,
    keywords: ["funnel", "gates", "pipeline", "stage gate", "ri"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/development/research-innovation/cloud-platform-development/new",
    component: RiFunnelWidget,
  },
  {
    id: "list.ri.tech-mix",
    title: "Technology Stream Allocation",
    description: "Module allocation across power electronics, CAE, cloud, and cybersecurity.",
    category: "list",
    tags: ["list", "ri"],
    icon: Cpu,
    keywords: ["technology", "stream", "cae", "cyber", "cloud", "ri"],
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    roles: "all",
    sourceRoute: "/development/research-innovation/simulation-analysis/new",
    component: RiTechMixWidget,
  },
  {
    id: "chart.ri.velocity-curve",
    title: "R&D Prototype Scale & CAE Simulation Growth",
    description: "Progression curve of CAE simulation runs, IP disclosures, and physical prototypes.",
    category: "chart",
    tags: ["chart", "ri"],
    icon: Activity,
    keywords: ["cae", "curve", "scale", "prototypes", "simulation"],
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/research-innovation/simulation-analysis/new",
    component: RiVelocityAreaWidget,
  },
  {
    id: "table.ri.operations-ledger",
    title: "Research & Innovation Operations Ledger",
    description: "Multi-tab registers across strategic programs, CAE runs, cyber threat models, and UI tokens.",
    category: "table",
    tags: ["table", "ri"],
    icon: Rocket,
    keywords: ["operations", "ledger", "programs", "cae", "cyber", "tokens"],
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/research-innovation/certification-readiness/new",
    component: RiOperationsLedgerWidget,
  },
  {
    id: "insight.ri-alerts",
    title: "Innovation Radar & Horizon Forecast",
    description: "Autonomous alerts across IP filings, CAE simulation convergence, and regulatory certifications.",
    category: "insight",
    tags: ["insight", "ri"],
    icon: AlertCircle,
    keywords: ["alerts", "forecast", "radar", "patents", "commercialization"],
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    roles: "all",
    sourceRoute: "/development/research-innovation/overview",
    component: RiAlertsForecastWidget,
  },
  {
    id: "ai.ri.intelligence",
    title: "AI Research & Innovation Intelligence Center",
    description: "Predictive simulation fidelity, automated threat surface hardening, IP patent novelty analysis, and TRL readiness.",
    category: "ai",
    tags: ["ai", "ri"],
    icon: Sparkles,
    keywords: ["ai", "ri", "research", "simulation", "cyber", "intelligence"],
    defaultSize: "full",
    allowedSizes: ["full"],
    roles: "all",
    sourceRoute: "/development/research-innovation/overview",
    component: RiAiIntelligenceWidget,
  },
];

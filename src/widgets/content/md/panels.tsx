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
  CheckSquare,
  Cpu,
  ExternalLink,
  Factory,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Gauge,
  Layers,
  Repeat,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
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
   1. Plant Production Volume vs First-Pass Yield (2 of 3 cols - size "xl")
   =========================================================================== */
const mockMfgProductionData = [
  { month: "Mar", unitsBuilt: 1200, yield: 95.2, oee: 84 },
  { month: "Apr", unitsBuilt: 1540, yield: 96.0, oee: 85 },
  { month: "May", unitsBuilt: 1890, yield: 96.8, oee: 87 },
  { month: "Jun", unitsBuilt: 2350, yield: 97.4, oee: 88 },
  { month: "Jul", unitsBuilt: 2800, yield: 98.1, oee: 89 },
  { month: "Aug", unitsBuilt: 3450, yield: 98.6, oee: 91 },
];

export const MdComposedTrendWidget = memo(function MdComposedTrendWidget({
  instance,
}: WidgetContentProps) {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader
          title={instance?.customTitle ?? "Production Volume & First-Pass Yield Horizon"}
          right={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-primary" /> Units Built
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" /> Plant OEE %
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-indigo-500">
                <span className="h-1 w-3 rounded-full bg-indigo-500" /> First-Pass Yield %
              </span>
            </div>
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Monthly cumulative assembly line throughput vs Overall Equipment Effectiveness (OEE) and end-of-line first pass yield.
        </p>
      </div>

      <div className="mt-4 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mockMfgProductionData} margin={{ top: 8, right: 12, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              tickFormatter={(v) => `${v}u`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[80, 100]}
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
                if (name === "yield") return [`${val}%`, "First-Pass Yield"];
                if (name === "oee") return [`${val}%`, "Plant OEE"];
                return [`${val} units`, "Units Built"];
              }}
            />
            <Bar yAxisId="left" dataKey="unitsBuilt" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={14} opacity={0.85} />
            <Bar yAxisId="left" dataKey="oee" fill="#10B981" radius={[4, 4, 0, 0]} barSize={14} />
            <Line yAxisId="right" type="monotone" dataKey="yield" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366F1" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. APQP -> Pilot -> PPAP -> Mass Production Pipeline Funnel (1 of 3 cols - size "md")
   =========================================================================== */
const mockMfgFunnel = [
  { label: "1. APQP Quality Gates", count: 24, icon: ShieldCheck, route: "/development/manufacturing-development/quality-planning-apqp" },
  { label: "2. Process Design & Flow", count: 18, icon: Settings, route: "/development/manufacturing-development/production-engineering" },
  { label: "3. Control Plan & PFMEA", count: 16, icon: FileCheck, route: "/development/manufacturing-development/control-plan" },
  { label: "4. Pilot Production Runs", count: 12, icon: Repeat, route: "/development/manufacturing-development/process-validation" },
  { label: "5. PPAP Approval", count: 8, icon: CheckSquare, route: "/development/manufacturing-development/process-validation" },
  { label: "6. Mass Production Ramp", count: 6, icon: Rocket, route: "/development/manufacturing-development/smart-factory-development" },
];

export const MdFunnelWidget = memo(function MdFunnelWidget() {
  const maxFunnel = Math.max(1, ...mockMfgFunnel.map((f) => f.count));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Industrialization Gates
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">84 active production gates progressing across ramp stages.</p>
          </div>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">6 Gates</span>
        </div>

        <div className="mt-4 space-y-3">
          {mockMfgFunnel.map((item, idx) => (
            <div key={item.label} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <Link
                  to={item.route as any}
                  className="font-medium text-foreground hover:text-primary transition flex items-center gap-1.5"
                >
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                  <span>{item.label}</span>
                </Link>
                <span className="font-bold font-mono text-muted-foreground">{item.count} lines</span>
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
        <span>PPAP Validation Lead Time: <strong>18 days</strong></span>
        <Link to="/development/manufacturing-development/quality-planning-apqp" className="text-primary font-semibold hover:underline flex items-center gap-1">
          <span>APQP Center</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Tooling, Fixture & Robotics Health Distribution (1 of 3 cols - size "md")
   =========================================================================== */
const mockToolingMix = [
  { category: "Automated Cobot Welding", health: "99.2%", items: "14 Robotic Cells", color: "bg-blue-500" },
  { category: "High-Speed SMT Pick & Place", health: "98.8%", items: "8 SMT Lines", color: "bg-indigo-500" },
  { category: "Stamping Dies & Tooling", health: "94.5%", items: "32 Tool Sets", color: "bg-emerald-500" },
  { category: "Precision Clamping Fixtures", health: "97.1%", items: "48 Workstations", color: "bg-amber-500" },
  { category: "Testing Jigs & End-of-Line", health: "99.5%", items: "22 Test Jigs", color: "bg-rose-500" },
];

export const MdToolingDistributionWidget = memo(function MdToolingDistributionWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Wrench className="h-4 w-4 text-purple-500" /> Tooling & Robotics Status
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Asset health & maintenance cycles across factory lines.</p>
          </div>
          <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
            124 Assets
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {mockToolingMix.map((t) => (
            <div key={t.category} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:bg-muted/20 transition">
              <div className="flex items-center gap-2.5">
                <span className={cn("h-3 w-3 rounded-full shrink-0", t.color)} />
                <div>
                  <div className="text-xs font-bold text-foreground">{t.category}</div>
                  <div className="text-[11px] text-muted-foreground">{t.items}</div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{t.health}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>Preventive PM Compliance: <strong>99.1%</strong></span>
        <Link to="/development/manufacturing-development/tooling-development" className="text-primary font-semibold hover:underline">
          View Tooling Hub →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Plant OEE & Ramp-Up Velocity Area Curve (2 of 3 cols - size "xl")
   =========================================================================== */
const mockMfgAreaCurve = [
  { month: "Mar", apqpGates: 12, pilotRuns: 4, massProdUnits: 1200 },
  { month: "Apr", apqpGates: 15, pilotRuns: 6, massProdUnits: 1540 },
  { month: "May", apqpGates: 18, pilotRuns: 9, massProdUnits: 1890 },
  { month: "Jun", apqpGates: 22, pilotRuns: 11, massProdUnits: 2350 },
  { month: "Jul", apqpGates: 26, pilotRuns: 14, massProdUnits: 2800 },
  { month: "Aug", apqpGates: 30, pilotRuns: 18, massProdUnits: 3450 },
];

export const MdYieldAreaWidget = memo(function MdYieldAreaWidget({
  instance,
}: WidgetContentProps) {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader
          title={instance?.customTitle ?? "Industrialization Scale & Ramp Progression"}
          right={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Monthly Units Ramp
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> APQP Gates
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Pilot Builds
              </span>
            </div>
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Autonomous trace growth of assembly line capacity, pilot batch completions, and mass production delivery rates.
        </p>
      </div>

      <div className="mt-4 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockMfgAreaCurve} margin={{ top: 10, right: 12, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="mfgUnitsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mfgApqpGrad" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="massProdUnits" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#mfgUnitsGrad)" />
            <Area type="monotone" dataKey="apqpGates" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#mfgApqpGrad)" />
            <Area type="monotone" dataKey="pilotRuns" stroke="#6366F1" strokeWidth={1.5} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Manufacturing Operations Ledger (5 tabs - size "xl")
   =========================================================================== */
type MdLedgerTab = "apqp" | "pilots" | "ppap" | "tooling" | "control";

const MD_LEDGER_TABS: { id: MdLedgerTab; label: string }[] = [
  { id: "apqp", label: "APQP Gates" },
  { id: "pilots", label: "Pilot Builds" },
  { id: "ppap", label: "PPAP Submissions" },
  { id: "tooling", label: "Tooling Work Orders" },
  { id: "control", label: "Control Plans & PFMEA" },
];

const mockApqpGates = [
  { id: "APQP-2026-041", title: "Dual 240kW Charger Enclosure Assembly Line", phase: "Phase 3 Process Validation", lead: "Karthik Subramanian", targetLaunch: "2026-10-15", cpk: "1.74", status: "On Track" },
  { id: "APQP-2026-038", title: "SMT Inverter Control Board High-Speed Line", phase: "Phase 4 Product & Process Validation", lead: "Anita Sharma", targetLaunch: "2026-09-30", cpk: "1.82", status: "Approved" },
  { id: "APQP-2026-035", title: "Liquid Cooled Cable Retractor Assembly", phase: "Phase 2 Product Design & Dev", lead: "David Miller", targetLaunch: "2026-11-20", cpk: "1.65", status: "In Review" },
  { id: "APQP-2026-029", title: "Power Distribution Unit Modular Sub-Rack", phase: "Phase 3 Process Validation", lead: "Hiroshi Tanaka", targetLaunch: "2026-10-01", cpk: "1.78", status: "On Track" },
];

const mockPilotRuns = [
  { id: "PILOT-2026-012", title: "Batch A: 50 Units Pre-Series Build", line: "Line 2 - High Voltage", targetQty: 50, completedQty: 50, fpy: "98.0%", lead: "Karthik Subramanian", status: "Completed" },
  { id: "PILOT-2026-015", title: "Batch B: 200 Units Full Speed Trial", line: "Line 1 - SMT Robotics", targetQty: 200, completedQty: 185, fpy: "99.1%", lead: "Anita Sharma", status: "Active Run" },
  { id: "PILOT-2026-018", title: "Batch C: 20 Units Thermal Test Run", line: "Line 3 - Enclosure Fab", targetQty: 20, completedQty: 10, fpy: "97.5%", lead: "David Miller", status: "In Progress" },
];

const mockPpap = [
  { id: "PPAP-2026-004", part: "240kW SiC Power Inverter Subassembly", customer: "Tata Power / EV Hub", level: "Level 3", warrantStatus: "Signed", pswDate: "2026-08-28", status: "Approved" },
  { id: "PPAP-2026-007", part: "Smart Touch Display & Gateway Module", customer: "Indian Oil Fleet", level: "Level 3", warrantStatus: "Submitted", pswDate: "2026-09-02", status: "Under Review" },
  { id: "PPAP-2026-009", part: "High-Current DC Busbar Assembly", customer: "Highway Corridors Corp", level: "Level 2", warrantStatus: "Preparing", pswDate: "2026-09-18", status: "In Progress" },
];

const mockToolingOrders = [
  { id: "TOOL-2026-140", name: "Stamping Die - Side Cover Louver IP55", type: "Stamping Die", plant: "Plant 1 - Pune", shots: "124,000 / 250,000", condition: "Good", status: "Active" },
  { id: "TOOL-2026-148", name: "Injection Mold - Front Bezel Display CMF", type: "Injection Mold", plant: "Plant 2 - Bengaluru", shots: "48,000 / 100,000", condition: "Optimal", status: "Active" },
  { id: "TOOL-2026-155", name: "Welding Fixture - Sub-Frame Alignment Jig", type: "Pneumatic Clamping", plant: "Plant 1 - Pune", shots: "62,000 / 80,000", condition: "Maintenance Due", status: "PM Scheduled" },
];

const mockControlPlans = [
  { id: "CP-2026-08", process: "High Voltage Inverter Final End-of-Line Test", characteristics: "Insulation Resistance, Hi-Pot, 1000V Surge", frequency: "100% Inspection", rpn: 36, status: "Active" },
  { id: "CP-2026-14", process: "Cobot Chassis Laser Welding & Seam Check", characteristics: "Seam Width, Depth of Penetration, Weld Bead", frequency: "Visual 100%, Cut 1/shift", rpn: 48, status: "Active" },
  { id: "CP-2026-19", process: "SMT Component Placement & Automated Optical Insp", characteristics: "Solder Fillet, Component Skew, Tombstoning", frequency: "100% 3D AOI", rpn: 24, status: "Active" },
];

export const MdOperationsLedgerWidget = memo(function MdOperationsLedgerWidget() {
  const [activeTab, setActiveTab] = useState<MdLedgerTab>("apqp");
  const [search, setSearch] = useState("");

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-foreground flex items-center gap-2">
            <Factory className="h-4 w-4 text-amber-500" /> Manufacturing Operations Ledger
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time shop floor registers across APQP quality deliverables, pilot runs, PPAP submissions, and tooling orders.
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
            {MD_LEDGER_TABS.map((tab) => (
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
        {/* TAB 1: APQP GATES */}
        {activeTab === "apqp" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Gate ID</th>
                <th className="py-2.5 px-3">Deliverable Project</th>
                <th className="py-2.5 px-3">Current APQP Phase</th>
                <th className="py-2.5 px-3">Industrialization Lead</th>
                <th className="py-2.5 px-3 text-right">Process Cpk</th>
                <th className="py-2.5 px-3 text-right">Target Launch</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockApqpGates
                .filter((g) => !search || g.id.toLowerCase().includes(search.toLowerCase()) || g.title.toLowerCase().includes(search.toLowerCase()))
                .map((g) => (
                  <tr key={g.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">{g.id}</td>
                    <td className="py-2.5 px-3 font-bold text-foreground">{g.title}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{g.phase}</td>
                    <td className="py-2.5 px-3 text-foreground/80">{g.lead}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{g.cpk}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-muted-foreground">{g.targetLaunch}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* TAB 2: PILOT RUNS */}
        {activeTab === "pilots" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Trial ID</th>
                <th className="py-2.5 px-3">Pilot Build Scope</th>
                <th className="py-2.5 px-3">Assembly Line</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3 text-right">Yield</th>
                <th className="py-2.5 px-3 text-right">Lead</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockPilotRuns.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{p.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{p.title}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{p.line}</td>
                  <td className="py-2.5 px-3 text-foreground font-mono">{p.completedQty} / {p.targetQty} units</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{p.fpy}</td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">{p.lead}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 3: PPAP SUBMISSIONS */}
        {activeTab === "ppap" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">PPAP Record</th>
                <th className="py-2.5 px-3">Component / Subassembly</th>
                <th className="py-2.5 px-3">Customer Client</th>
                <th className="py-2.5 px-3">PPAP Level</th>
                <th className="py-2.5 px-3 text-right">Warrant</th>
                <th className="py-2.5 px-3 text-right">Target Date</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockPpap.map((pp) => (
                <tr key={pp.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{pp.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{pp.part}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{pp.customer}</td>
                  <td className="py-2.5 px-3 text-muted-foreground font-semibold">{pp.level}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-emerald-600">{pp.warrantStatus}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">{pp.pswDate}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {pp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 4: TOOLING ORDERS */}
        {activeTab === "tooling" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Tool ID</th>
                <th className="py-2.5 px-3">Tool / Mold Specification</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Plant Assignment</th>
                <th className="py-2.5 px-3 text-right">Shot Counter</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockToolingOrders.map((t) => (
                <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{t.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{t.name}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{t.type}</td>
                  <td className="py-2.5 px-3 text-foreground/80">{t.plant}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">{t.shots}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 5: CONTROL PLANS & PFMEA */}
        {activeTab === "control" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Control Plan</th>
                <th className="py-2.5 px-3">Critical Manufacturing Operation</th>
                <th className="py-2.5 px-3">Special Characteristics Monitored</th>
                <th className="py-2.5 px-3">Inspection Frequency</th>
                <th className="py-2.5 px-3 text-right">RPN Risk</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockControlPlans.map((cp) => (
                <tr key={cp.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{cp.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{cp.process}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{cp.characteristics}</td>
                  <td className="py-2.5 px-3 text-foreground/80">{cp.frequency}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{cp.rpn}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {cp.status}
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
   6. Manufacturing Alerts & Ramp Forecast (1 of 3 cols - size "md")
   =========================================================================== */
const mockMdAlerts = [
  { title: "PPAP Level 3 Approved", desc: "SiC Power Inverter Subassembly PPAP warrant approved with 100% dimensional adherence.", type: "success" },
  { title: "Tooling Maintenance Alert", desc: "W-2026 welding fixture reached 62,000 cycles; automated PM inspection queued for shift change.", type: "warning" },
  { title: "SMT Line Speed Balanced", desc: "Line 1 takt time reduced to 42s with zero component pickup failure in optical inspection.", type: "info" },
];

const mockRampForecast = [
  { period: "Q3 2026", line: "Inverter Assembly Line 1", volume: "10,500 Units", oee: 89 },
  { period: "Q4 2026", line: "240kW Charger Final Line", volume: "14,200 Units", oee: 92 },
  { period: "Q1 2027", line: "Dual Dispenser Pods Line", volume: "18,000 Units", oee: 94 },
];

export const MdAlertsForecastWidget = memo(function MdAlertsForecastWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader title="Shop Floor Alerts & Ramp Forecast" />
        <p className="mt-1 text-xs text-muted-foreground">Autonomous alerts across plant lines, tool wear counters, and PPAP approvals.</p>

        <div className="mt-4 space-y-3">
          {mockMdAlerts.map((al) => {
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
          3-Quarter Manufacturing Ramp Forecast
        </h4>
        <div className="space-y-2 text-xs">
          {mockRampForecast.map((fc) => (
            <div key={fc.period} className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <div>
                <span className="font-medium text-foreground block">{fc.line}</span>
                <span className="text-[10px] text-muted-foreground">{fc.period} · {fc.volume}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold tabular font-mono text-emerald-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>OEE {fc.oee}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   7. AI Manufacturing Intelligence Center (full width - size "full")
   =========================================================================== */
function MdScoreBall({
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

export const MdAiIntelligenceWidget = memo(function MdAiIntelligenceWidget() {
  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between border-b border-border/40 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="h-5 w-5 animate-pulse text-primary" />
          <div>
            <h3 className="font-display text-[15px] font-semibold text-foreground">
              AI Smart Factory & Industrialization Intelligence Center
            </h3>
            <p className="text-xs text-muted-foreground">
              Predictive tool wear forecasting, automated PFMEA risk scoring, OEE optimization, and PPAP approval readiness.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AI Factory Engine Active
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        <MdScoreBall label="Plant OEE" value={89} />
        <MdScoreBall label="APQP Gate Conformance" value={96} />
        <MdScoreBall label="PPAP Velocity" value={92} />
        <MdScoreBall label="Tooling Wear Risk" value={14} inverse />
        <MdScoreBall label="First-Pass Yield" value={98} />
      </div>

      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-foreground space-y-2">
        <div className="flex items-center justify-between">
          <strong className="font-bold text-primary flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> AI Autonomous Shop-Floor Multipliers & Actions:
          </strong>
          <button
            type="button"
            onClick={() => toast.success("Autonomous Line Balancing & Tool Work Orders triggered!")}
            className="rounded bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
          >
            Execute Autonomous Factory Optimization
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground pt-1">
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>Zero Level 1 severity risks open across all 14 active PFMEAs with 99.98% AOI vision inspection yield.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>Stator winding tooling cycle counter is at 84% life; automated PM work order scheduled for next changeover.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>Pick & place robotics line completed 300-piece capability run with Cpk 1.82, ready for customer warranty submission.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-primary font-bold">•</span>
            <span>Plant-wide IIoT sensor telemetry streaming 124 asset tags with 99.9% uptime to manufacturing execution system.</span>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   8. Manufacturing Development 18 Submodules Directory Hub (full width - size "full")
   =========================================================================== */
interface MdSubmoduleItem {
  id: string;
  title: string;
  desc: string;
  path: string;
  icon: any;
  color: string;
  bg: string;
  tag: string;
  category: "quality-apqp" | "tooling-line" | "smart-excellence" | "standards-bom";
  score: number;
  stage: string;
  metric: string;
}

const MD_SUBMODULES: MdSubmoduleItem[] = [
  // 1. Quality & APQP (6)
  {
    id: "APQP",
    title: "Quality Planning (APQP)",
    desc: "Advanced Product Quality Planning gates & timing plans",
    path: "/development/manufacturing-development/quality-planning-apqp",
    icon: ShieldCheck,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "APQP",
    category: "quality-apqp",
    score: 96,
    stage: "Phase 3",
    metric: "22 Gates",
  },
  {
    id: "PROC",
    title: "Process Engineering",
    desc: "Process flows, line layouts & operating parameters",
    path: "/development/manufacturing-development/production-engineering",
    icon: Settings,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "Process",
    category: "quality-apqp",
    score: 92,
    stage: "Active",
    metric: "18 Flows",
  },
  {
    id: "CP",
    title: "Control Plan",
    desc: "Process control points, sampling & reaction plans",
    path: "/development/manufacturing-development/control-plan",
    icon: FileCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Control",
    category: "quality-apqp",
    score: 95,
    stage: "Approved",
    metric: "16 Plans",
  },
  {
    id: "PFMEA",
    title: "PFMEA Development",
    desc: "Failure modes, severity/detection & RPN scoring",
    path: "/development/manufacturing-development/pfmea-development",
    icon: CheckSquare,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    tag: "PFMEA",
    category: "quality-apqp",
    score: 94,
    stage: "Low Risk",
    metric: "RPN < 40",
  },
  {
    id: "PPAP",
    title: "Process Validation (PPAP)",
    desc: "Production Part Approval Process Level 1-5 warrants",
    path: "/development/manufacturing-development/process-validation",
    icon: ShieldCheck,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "PPAP",
    category: "quality-apqp",
    score: 98,
    stage: "Level 3",
    metric: "3 Warrants",
  },
  {
    id: "SIXSIG",
    title: "Six Sigma Projects",
    desc: "DMAIC projects, capability Cpk & defect reduction",
    path: "/development/manufacturing-development/six-sigma-projects",
    icon: TrendingUp,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Cpk",
    category: "quality-apqp",
    score: 93,
    stage: "Active",
    metric: "Cpk 1.82",
  },

  // 2. Tooling & Line Design (5)
  {
    id: "LINE",
    title: "Assembly Line Development",
    desc: "Takt time balancing, ergonomics & workstation cells",
    path: "/development/manufacturing-development/assembly-line-development",
    icon: Factory,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Takt Time",
    category: "tooling-line",
    score: 95,
    stage: "Balanced",
    metric: "42s Takt",
  },
  {
    id: "FIXT",
    title: "Fixture Development",
    desc: "Clamping fixtures, locating pins & holding apparatus",
    path: "/development/manufacturing-development/fixture-development",
    icon: Wrench,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Fixtures",
    category: "tooling-line",
    score: 92,
    stage: "Active",
    metric: "48 Stations",
  },
  {
    id: "TOOL",
    title: "Tooling Development",
    desc: "Molds, dies, cutting tools & shot life tracking",
    path: "/development/manufacturing-development/tooling-development",
    icon: Wrench,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Dies/Molds",
    category: "tooling-line",
    score: 97,
    stage: "Optimal",
    metric: "32 Tool Sets",
  },
  {
    id: "JIG",
    title: "Jig Development",
    desc: "Precision alignment, drilling & testing jigs",
    path: "/development/manufacturing-development/jig-development",
    icon: Settings,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Jigs",
    category: "tooling-line",
    score: 94,
    stage: "Active",
    metric: "22 Jigs",
  },
  {
    id: "LAYOUT",
    title: "Factory Layout Design",
    desc: "Plant floor layouts, material flow paths & cell arrangement",
    path: "/development/manufacturing-development/factory-layout-design",
    icon: Layers,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    tag: "Layout",
    category: "tooling-line",
    score: 96,
    stage: "Approved",
    metric: "Plant 1 & 2",
  },

  // 3. Smart Factory & Excellence (3)
  {
    id: "SMART",
    title: "Smart Factory Development",
    desc: "IIoT sensors, edge telemetry, SCADA & MES integration",
    path: "/development/manufacturing-development/smart-factory-development",
    icon: Zap,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    tag: "Industry 4.0",
    category: "smart-excellence",
    score: 98,
    stage: "Active",
    metric: "89.4% OEE",
  },
  {
    id: "EXCELL",
    title: "Manufacturing Excellence",
    desc: "World-class manufacturing benchmarks, TPM & kaizen",
    path: "/development/manufacturing-development/manufacturing-excellence",
    icon: Gauge,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "TPM",
    category: "smart-excellence",
    score: 93,
    stage: "Standardized",
    metric: "5S Audited",
  },
  {
    id: "CAP",
    title: "Capacity Planning",
    desc: "Machine utilization, shift patterns & bottleneck modeling",
    path: "/development/manufacturing-development/capacity-planning",
    icon: BarChart3,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Throughput",
    category: "smart-excellence",
    score: 91,
    stage: "Optimized",
    metric: "3,450 u/mo",
  },

  // 4. Shop Floor Standards & BOM (4)
  {
    id: "WI",
    title: "Work Instructions",
    desc: "Digital standard operator sheets (SOS) & visual guides",
    path: "/development/manufacturing-development/work-instruction-development",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Digital SOS",
    category: "standards-bom",
    score: 97,
    stage: "Active",
    metric: "42 Workstations",
  },
  {
    id: "SOP",
    title: "SOP Development",
    desc: "Standard Operating Procedures for setup, safety & maintenance",
    path: "/development/manufacturing-development/sop-development",
    icon: FileCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "SOPs",
    category: "standards-bom",
    score: 95,
    stage: "Published",
    metric: "38 SOPs",
  },
  {
    id: "BOM",
    title: "BOM Engineering",
    desc: "Manufacturing BOM (MBOM), Phantom BOMs & alternate parts",
    path: "/development/manufacturing-development/bom-engineering",
    icon: FileSpreadsheet,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "MBOM",
    category: "standards-bom",
    score: 99,
    stage: "Synchronized",
    metric: "100% Trace",
  },
  {
    id: "ROUTE",
    title: "Routing Development",
    desc: "Work center assignments, setup times & machine routing",
    path: "/development/manufacturing-development/routing-development",
    icon: ArrowRight,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Routings",
    category: "standards-bom",
    score: 94,
    stage: "Active",
    metric: "28 Work Centers",
  },
];

export const MdSubmodulesHubWidget = memo(function MdSubmodulesHubWidget() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = MD_SUBMODULES.filter((sub) => {
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
            <Factory className="h-4 w-4 text-primary" /> Manufacturing Development 18 Submodules Command Hub
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consolidated directory of all 18 industrialization, APQP quality, tooling, line design, and shop floor standards modules.
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
              { id: "all", label: "All (18)" },
              { id: "quality-apqp", label: "Quality & APQP (6)" },
              { id: "tooling-line", label: "Tooling & Line (5)" },
              { id: "smart-excellence", label: "Smart Factory (3)" },
              { id: "standards-bom", label: "Standards & BOM (4)" },
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
   EXPORT ALL MD PANEL WIDGETS
   =========================================================================== */
export const MD_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.md.composed-trend",
    title: "Production Volume & First-Pass Yield",
    description: "Monthly cumulative throughput vs OEE and first-pass yield.",
    category: "chart",
    tags: ["chart", "md"],
    icon: TrendingUp,
    keywords: ["production", "volume", "yield", "oee", "mfg"],
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/smart-factory-development",
    component: MdComposedTrendWidget,
  },
  {
    id: "chart.md.funnel",
    title: "Industrialization Gates Funnel",
    description: "Multi-stage pipeline from APQP quality planning to full rate mass production.",
    category: "chart",
    tags: ["chart", "md"],
    icon: ShieldCheck,
    keywords: ["apqp", "pilot", "ppap", "mass production", "mfg", "funnel"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/quality-planning-apqp",
    component: MdFunnelWidget,
  },
  {
    id: "list.md.tooling-distribution",
    title: "Tooling & Robotics Status",
    description: "Asset health, maintenance cycles, and cobot cell availability.",
    category: "list",
    tags: ["list", "md"],
    icon: Wrench,
    keywords: ["tooling", "robotics", "fixtures", "dies", "mfg"],
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/tooling-development",
    component: MdToolingDistributionWidget,
  },
  {
    id: "chart.md.yield-curve",
    title: "Industrialization Scale & Ramp Progression",
    description: "Progression curve of units ramped, APQP quality gates, and pilot trial builds.",
    category: "chart",
    tags: ["chart", "md"],
    icon: Activity,
    keywords: ["ramp", "curve", "scale", "units", "pilot"],
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/process-validation",
    component: MdYieldAreaWidget,
  },
  {
    id: "table.md.operations-ledger",
    title: "Manufacturing Operations Ledger",
    description: "Multi-tab registers across APQP gates, pilot builds, PPAP submissions, and tooling orders.",
    category: "table",
    tags: ["table", "md"],
    icon: Factory,
    keywords: ["operations", "ledger", "apqp", "pilot", "ppap", "tooling"],
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/quality-planning-apqp",
    component: MdOperationsLedgerWidget,
  },
  {
    id: "insight.md-alerts",
    title: "Shop Floor Alerts & Ramp Forecast",
    description: "Autonomous alerts across plant lines, tool wear counters, and PPAP approvals.",
    category: "insight",
    tags: ["insight", "md"],
    icon: AlertCircle,
    keywords: ["alerts", "forecast", "ramp", "shop floor"],
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/process-validation",
    component: MdAlertsForecastWidget,
  },
  {
    id: "ai.md.manufacturing-intelligence",
    title: "Manufacturing AI Intelligence",
    description: "Predictive tooling maintenance, OEE optimization, PFMEA risk scoring, and smart factory telemetry.",
    category: "ai",
    tags: ["ai", "md"],
    icon: Sparkles,
    keywords: ["ai", "mfg", "oee", "tooling", "smart factory", "intelligence"],
    defaultSize: "full",
    allowedSizes: ["full"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/overview",
    component: MdAiIntelligenceWidget,
  },
];

// Strategy Management Analytical & Command Panels
import { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  Layers,
  Target,
  CheckCircle2,
  Zap,
  Award,
  BrainCircuit,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { CardHeader } from "@/components/erp/CardHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import type { WidgetContentProps, WidgetDefinition } from "@/widgets/types";

// 1. Strategy Alignment Flow Panel
export const StrategyAlignmentFlowWidget = memo(function StrategyAlignmentFlowWidget(_props: WidgetContentProps) {
  const steps = [
    {
      step: "01",
      title: "Purpose & Vision",
      subtitle: "Global Autonomous EV Leader",
      color: "from-blue-500/10 to-blue-500/5 border-blue-500/30 text-blue-600 dark:text-blue-400",
      icon: Compass,
      route: "/management/strategy-management/vision-mission",
    },
    {
      step: "02",
      title: "Strategic Themes",
      subtitle: "8 Themes (Growth, Innovation, ESG)",
      color: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
      icon: Layers,
      route: "/management/strategy-management/vision-mission",
    },
    {
      step: "03",
      title: "Strategic Objectives",
      subtitle: "12 Enterprise Objectives",
      color: "from-amber-500/10 to-amber-500/5 border-amber-500/30 text-amber-600 dark:text-amber-400",
      icon: Target,
      route: "/management/strategy-management/balanced-scorecard",
    },
    {
      step: "04",
      title: "OKRs & Key Results",
      subtitle: "28 Active OKRs · 86 Key Results",
      color: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      icon: CheckCircle2,
      route: "/management/strategy-management/okr-management",
    },
    {
      step: "05",
      title: "Strategic Initiatives",
      subtitle: "26 Initiatives · 48 Projects",
      color: "from-rose-500/10 to-rose-500/5 border-rose-500/30 text-rose-600 dark:text-rose-400",
      icon: Zap,
      route: "/management/strategy-management/strategic-initiatives",
    },
    {
      step: "06",
      title: "Enterprise Outcomes",
      subtitle: "₹72.3 Cr Benefits Realization",
      color: "from-purple-500/10 to-purple-500/5 border-purple-500/30 text-purple-600 dark:text-purple-400",
      icon: Award,
      route: "/management/strategy-management/reports",
    },
  ];

  return (
    <div className="card-soft p-5">
      <CardHeader
        title="Strategic Execution Alignment Chain"
        right={
          <Link
            to="/management/strategy-management/reports"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View Full Chain <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />
      <p className="text-xs text-muted-foreground -mt-3 mb-4">
        End-to-end lineage from Corporate Purpose & Vision through OKRs to Execution & Outcomes
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Link
              key={idx}
              to={step.route}
              className={`p-3.5 rounded-xl border bg-gradient-to-b ${step.color} hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  Step {step.step}
                </span>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-foreground leading-tight">{step.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{step.subtitle}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

// 2. OKR & KPI Progress Trajectory (Trend Chart)
export const OKRProgressTrajectoryWidget = memo(function OKRProgressTrajectoryWidget(_props: WidgetContentProps) {
  const data = [
    { month: "Jan", planned: 20, actual: 18, target: 22 },
    { month: "Feb", planned: 35, actual: 32, target: 36 },
    { month: "Mar", planned: 48, actual: 45, target: 50 },
    { month: "Apr", planned: 60, actual: 58, target: 62 },
    { month: "May", planned: 72, actual: 69, target: 74 },
    { month: "Jun", planned: 80, actual: 78, target: 82 },
    { month: "Jul", planned: 88, actual: 82, target: 89 },
    { month: "Aug", planned: 94, actual: 86, target: 95 },
    { month: "Sep", planned: 100, actual: 91, target: 100 },
  ];

  return (
    <div className="card-soft p-5">
      <CardHeader
        title="Strategic Progress & OKR Trajectory"
        right={
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Actual (91%)
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Planned (100%)
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-purple-600 dark:text-purple-400">
              <span className="h-2 w-2 rounded-full bg-purple-500" /> Target
            </span>
          </div>
        }
      />
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="stratActualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="stratPlannedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} unit="%" domain={[0, 105]} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} fill="url(#stratPlannedGrad)" name="Planned" />
            <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} fill="url(#stratActualGrad)" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// 3. Balanced Scorecard Perspectives Performance
export const PerspectivesPerformanceWidget = memo(function PerspectivesPerformanceWidget(_props: WidgetContentProps) {
  const perspectives = [
    { name: "Financial", score: 82, weight: 25, color: "bg-emerald-500" },
    { name: "Customer", score: 76, weight: 20, color: "bg-blue-500" },
    { name: "Internal Process", score: 68, weight: 20, color: "bg-amber-500" },
    { name: "Learning & Growth", score: 62, weight: 15, color: "bg-purple-500" },
    { name: "Innovation & Tech", score: 58, weight: 10, color: "bg-rose-500" },
    { name: "Risk & Governance", score: 72, weight: 5, color: "bg-cyan-500" },
    { name: "Sustainability & ESG", score: 65, weight: 5, color: "bg-teal-500" },
  ];

  return (
    <div className="card-soft p-5">
      <CardHeader
        title="Scorecard Perspectives"
        right={
          <Link
            to="/management/strategy-management/balanced-scorecard"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Scorecard →
          </Link>
        }
      />
      <div className="space-y-3">
        {perspectives.map((p, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{p.name}</span>
              <span className="text-muted-foreground font-semibold">
                {p.score}% <span className="font-normal text-[11px]">(Weight: {p.weight}%)</span>
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${p.color} rounded-full transition-all duration-500`}
                style={{ width: `${p.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// 4. Initiatives Portfolio Distribution Donut
export const InitiativesPortfolioWidget = memo(function InitiativesPortfolioWidget(_props: WidgetContentProps) {
  const data = [
    { name: "In Progress", value: 16, color: "#3b82f6" },
    { name: "Completed", value: 4, color: "#10b981" },
    { name: "At Risk", value: 4, color: "#f59e0b" },
    { name: "On Hold", value: 2, color: "#ef4444" },
  ];

  return (
    <div className="card-soft p-5">
      <CardHeader
        title="Initiative Portfolio Health"
        right={
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            72% Healthy
          </span>
        }
      />
      <div className="h-[220px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded-lg bg-muted/30 p-2">
          <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Active Programs</span>
          <span className="font-bold text-foreground">26 Total</span>
        </div>
        <div className="rounded-lg bg-muted/30 p-2">
          <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Realization Rate</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">84.2%</span>
        </div>
      </div>
    </div>
  );
});

// 5. Strategic Operations & Initiatives Ledger (4 tabs)
type StrategyTab = "initiatives" | "okrs" | "gates" | "approvals";

const STRATEGY_OPS_TABS: { id: StrategyTab; label: string }[] = [
  { id: "initiatives", label: "Strategic Initiatives" },
  { id: "okrs", label: "Enterprise OKRs" },
  { id: "gates", label: "Milestone Gates" },
  { id: "approvals", label: "Strategic Approvals" },
];

export const ExecutiveInitiativesTableWidget = memo(function ExecutiveInitiativesTableWidget(_props: WidgetContentProps) {
  const [activeTab, setActiveTab] = useState<StrategyTab>("initiatives");

  const initiatives = [
    { code: "SI-2026-001", name: "Expand EV Charging Network", theme: "Growth", owner: "S. Ravi", capex: "₹35.0 Cr", progress: 75, status: "In Progress" },
    { code: "SI-2026-002", name: "Autonomous W-EVSE R&D", theme: "Innovation", owner: "R. Kumar", capex: "₹22.5 Cr", progress: 60, status: "In Progress" },
    { code: "SI-2026-003", name: "Manufacturing Scale-up", theme: "Operations", owner: "M. Prakash", capex: "₹42.0 Cr", progress: 45, status: "At Risk" },
    { code: "SI-2026-004", name: "Strategic OEM Partnership", theme: "Partnership", owner: "K. Meena", capex: "₹10.5 Cr", progress: 30, status: "On Hold" },
    { code: "SI-2026-005", name: "Digital IoT Cloud Platform", theme: "Technology", owner: "A. Khan", capex: "₹15.0 Cr", progress: 80, status: "In Progress" },
  ];

  const okrs = [
    { code: "OKR-Q3-01", title: "Accelerate Solid-State Cell Validation", perspective: "Innovation", owner: "Dr. Roy", kr: "95% Cell Efficiency", progress: 88, status: "Active" },
    { code: "OKR-Q3-02", title: "Expand Tier-2 Charging Hub Footprint", perspective: "Growth", owner: "S. Ravi", kr: "150 New Sites", progress: 92, status: "Active" },
    { code: "OKR-Q3-03", title: "Reduce Cycle Time by 18%", perspective: "Operations", owner: "M. Prakash", kr: "18% Lean Improvement", progress: 64, status: "At Risk" },
    { code: "OKR-Q3-04", title: "Net Zero Scope 1/2 at Plant 1", perspective: "Sustainability", owner: "V. Sharma", kr: "100% RE100 Power", progress: 96, status: "Active" },
    { code: "OKR-Q3-05", title: "Automotive ISO 26262 ASIL-D Audit", perspective: "Governance", owner: "N. Iyer", kr: "100% Audit Cleared", progress: 100, status: "Completed" },
  ];

  const gates = [
    { id: "GATE-G3-12", deliverable: "Pilot Line Tooling Buyoff", initiative: "SI-2026-003", targetDate: "18 Oct 2026", reviewer: "VP Manufacturing", status: "Pending" },
    { id: "GATE-G2-08", deliverable: "Autonomous Sensor Fusion Signoff", initiative: "SI-2026-002", targetDate: "24 Oct 2026", reviewer: "Chief Technology Officer", status: "Approved" },
    { id: "GATE-G4-01", deliverable: "Regional Network Commercial Launch", initiative: "SI-2026-001", targetDate: "05 Nov 2026", reviewer: "VP Growth & BD", status: "Approved" },
    { id: "GATE-G1-15", deliverable: "OEM Joint Venture Term Sheet", initiative: "SI-2026-004", targetDate: "12 Nov 2026", reviewer: "Board Strategic Committee", status: "Under Review" },
  ];

  const approvals = [
    { id: "STR-APP-042", title: "Budget Reallocation for EVSE Fast Track", capex: "₹4.2 Cr", initiator: "R. Kumar (R&D)", stage: "Executive Committee", status: "Pending Review" },
    { id: "STR-APP-043", title: "Strategic Patent Filing (Solid State)", capex: "₹45 Lakh", initiator: "IP Cell", stage: "General Counsel", status: "Under Review" },
    { id: "STR-APP-044", title: "Supplier Tooling Capex Revision", capex: "₹1.8 Cr", initiator: "M. Prakash (Mfg)", stage: "CFO Office", status: "Pending Review" },
  ];

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-2">
        <h3 className="font-display text-[15px] font-semibold text-foreground">
          Strategic Operations & Initiatives Ledger
        </h3>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5">
          {STRATEGY_OPS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-foreground shadow-sm dark:bg-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[220px] overflow-x-auto">
        {activeTab === "initiatives" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2">Code</th>
                <th className="py-2">Initiative Name</th>
                <th className="py-2">Theme</th>
                <th className="py-2">Owner</th>
                <th className="py-2 text-right">Capex</th>
                <th className="py-2 text-right">Progress</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {initiatives.map((item) => (
                <tr key={item.code} className="hover:bg-muted/10 transition-colors">
                  <td className="py-2.5 font-mono font-semibold text-primary">{item.code}</td>
                  <td className="py-2.5 font-medium text-foreground">{item.name}</td>
                  <td className="py-2.5 text-muted-foreground">{item.theme}</td>
                  <td className="py-2.5 text-foreground">{item.owner}</td>
                  <td className="py-2.5 text-right font-medium text-foreground">{item.capex}</td>
                  <td className="py-2.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-1.5 w-14 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.progress >= 70 ? "bg-emerald-500" : item.progress >= 40 ? "bg-blue-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="font-semibold text-muted-foreground">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "okrs" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2">OKR Ref</th>
                <th className="py-2">Objective Title</th>
                <th className="py-2">Perspective</th>
                <th className="py-2">Target KR</th>
                <th className="py-2 text-right">Velocity</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {okrs.map((item) => (
                <tr key={item.code} className="hover:bg-muted/10 transition-colors">
                  <td className="py-2.5 font-mono font-semibold text-primary">{item.code}</td>
                  <td className="py-2.5 font-medium text-foreground">{item.title}</td>
                  <td className="py-2.5 text-muted-foreground">{item.perspective}</td>
                  <td className="py-2.5 text-muted-foreground">{item.kr}</td>
                  <td className="py-2.5 text-right font-bold text-foreground">{item.progress}%</td>
                  <td className="py-2.5 text-right">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "gates" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2">Gate ID</th>
                <th className="py-2">Milestone Deliverable</th>
                <th className="py-2">Linked Initiative</th>
                <th className="py-2">Due Date</th>
                <th className="py-2">Reviewer</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {gates.map((item) => (
                <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                  <td className="py-2.5 font-mono font-semibold text-primary">{item.id}</td>
                  <td className="py-2.5 font-medium text-foreground">{item.deliverable}</td>
                  <td className="py-2.5 text-muted-foreground">{item.initiative}</td>
                  <td className="py-2.5 text-muted-foreground">{item.targetDate}</td>
                  <td className="py-2.5 text-foreground">{item.reviewer}</td>
                  <td className="py-2.5 text-right">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "approvals" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2">Request ID</th>
                <th className="py-2">Review Subject</th>
                <th className="py-2">Capex Impact</th>
                <th className="py-2">Originator</th>
                <th className="py-2">Review Stage</th>
                <th className="py-2 text-right">Action Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {approvals.map((item) => (
                <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                  <td className="py-2.5 font-mono font-semibold text-primary">{item.id}</td>
                  <td className="py-2.5 font-medium text-foreground">{item.title}</td>
                  <td className="py-2.5 font-bold text-foreground">{item.capex}</td>
                  <td className="py-2.5 text-muted-foreground">{item.initiator}</td>
                  <td className="py-2.5 text-foreground">{item.stage}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex rounded bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-600">
                      {item.status}
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

// 6. Strategic Alerts & Execution Watch Panel
function AlertRow({
  type,
  title,
  desc,
}: {
  type: "warning" | "info" | "success";
  title: string;
  desc: string;
}) {
  const bg =
    type === "warning"
      ? "bg-amber-500/10 border-amber-500/30"
      : type === "success"
        ? "bg-success/10 border-success/30"
        : "bg-blue-500/10 border-blue-500/30";
  const text =
    type === "warning" ? "text-amber-700 dark:text-amber-400" : type === "success" ? "text-success" : "text-blue-700 dark:text-blue-400";
  return (
    <div className={`rounded-lg border p-3 text-xs leading-relaxed ${bg}`}>
      <div className={`font-bold ${text}`}>{title}</div>
      <div className="mt-0.5 text-muted-foreground">{desc}</div>
    </div>
  );
}

function PredictionRow({
  quarter,
  flow,
  amount,
}: {
  quarter: string;
  flow: "positive" | "negative";
  amount: string;
}) {
  const color = flow === "positive" ? "text-success" : "text-destructive";
  const Arrow = flow === "positive" ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2 text-xs">
      <span className="font-medium text-muted-foreground">{quarter}</span>
      <div className="flex items-center gap-1.5 font-bold tabular">
        <Arrow className={`h-3 w-3 ${color}`} />
        <span className={color}>{amount}</span>
      </div>
    </div>
  );
}

export const StrategicAlertsWidget = memo(function StrategicAlertsWidget(_props: WidgetContentProps) {
  return (
    <div className="card-soft p-5">
      <CardHeader title="Strategic Alerts & Execution Watch" />
      <div className="mt-3 space-y-3">
        <AlertRow
          type="warning"
          title="Execution Gate Lead-Time Watch"
          desc="Tooling delivery lead-time on SI-2026-003 extends pilot validation schedule by 12 days."
        />
        <AlertRow
          type="info"
          title="Enterprise BSC Review Cycle"
          desc="Q3 balanced scorecard sign-off scheduled across all 7 strategic perspectives with BU heads."
        />
        <AlertRow
          type="success"
          title="Strategic Capex Realization"
          desc="Clean Energy & Solar Program surpassed quarterly ROI targets by +18.4%."
        />
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
          3-Quarter Benefits Realization Forecast
        </h4>
        <div className="space-y-2">
          <PredictionRow quarter="Q4 2026 (Projected)" flow="positive" amount="+₹24.8 Cr" />
          <PredictionRow quarter="Q1 2027 (Projected)" flow="positive" amount="+₹31.2 Cr" />
          <PredictionRow quarter="Q2 2027 (Projected)" flow="positive" amount="+₹38.5 Cr" />
        </div>
      </div>
    </div>
  );
});

// 7. Full-Width AI Strategic Intelligence & Decision Center
function AiScoreBall({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: number;
  inverse?: boolean;
}) {
  const isHealthy = inverse ? value < 30 : value > 75;
  const colorClass = isHealthy ? "text-[#22C55E]" : "text-destructive";
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-muted/20 p-4">
      <span className={`font-display text-2xl font-bold ${colorClass}`}>{value}%</span>
      <span className="mt-1 text-center text-[10px] font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export const AIStrategyAssistantWidget = memo(function AIStrategyAssistantWidget(_props: WidgetContentProps) {
  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-2">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 animate-pulse text-primary" />
          <div>
            <h3 className="font-display text-[15px] font-semibold text-foreground">
              AI Strategic Intelligence & Decision Center
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time OKR execution velocity, cross-pillar alignment synthesis, and strategic risk predictions.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" /> Core Engine Active
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        <AiScoreBall label="Strategy Alignment" value={94} />
        <AiScoreBall label="OKR Velocity" value={88} />
        <AiScoreBall label="Execution Risk" value={14} inverse />
        <AiScoreBall label="Bottleneck Rate" value={8} inverse />
        <AiScoreBall label="Value Realization" value={92} />
      </div>

      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-[13px] leading-relaxed text-foreground">
        <strong className="font-bold text-primary">AI Strategy Recommendations: </strong>
        <div className="mt-1 flex flex-wrap gap-2 text-muted-foreground">
          <span className="block w-full">
            • Reallocate ₹4.2 Cr surplus from Cost Optimization into Autonomous W-EVSE R&D to preserve Q4 milestones.
          </span>
          <span className="block w-full">
            • Accelerate Tier-2 highway EV charging hub deployment to capture 28% projected demand surge.
          </span>
          <span className="block w-full">
            • Review ESG supply chain compliance metrics ahead of upcoming EU carbon border tax deadline.
          </span>
          <span className="block w-full">
            • Sync cross-functional OKRs between Product Engineering and Supply Chain for Next-Gen BMS launch.
          </span>
        </div>
      </div>
    </div>
  );
});

// 8. Strategic Theme Distribution (Available in catalog)
export const StrategicThemesProgressWidget = memo(function StrategicThemesProgressWidget(_props: WidgetContentProps) {
  const themes = [
    { name: "Growth & Market Expansion", count: 7, progress: 82, color: "#3b82f6" },
    { name: "Innovation & Technology Leadership", count: 5, progress: 76, color: "#8b5cf6" },
    { name: "Operational Excellence", count: 4, progress: 62, color: "#10b981" },
    { name: "Customer Excellence", count: 3, progress: 68, color: "#06b6d4" },
    { name: "Sustainability & ESG Impact", count: 3, progress: 58, color: "#14b8a6" },
    { name: "Risk & Compliance Governance", count: 2, progress: 72, color: "#f59e0b" },
    { name: "People & Organizational Capability", count: 2, progress: 70, color: "#ec4899" },
  ];

  return (
    <div className="card-soft p-5">
      <CardHeader
        title="Strategic Theme Distribution"
        right={<span className="text-xs text-muted-foreground font-semibold">26 Initiatives Total</span>}
      />
      <div className="space-y-3">
        {themes.map((t, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                {t.name}
              </span>
              <span className="text-muted-foreground font-semibold">
                {t.count} Initiatives · {t.progress}%
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${t.progress}%`, backgroundColor: t.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export const STRATEGY_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "strategy.panel.progress-trajectory",
    title: "OKR & Strategic Progress Trajectory",
    description: "Multi-month planned vs actual progress tracking curve.",
    category: "chart",
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: OKRProgressTrajectoryWidget,
  },
  {
    id: "strategy.panel.perspectives-performance",
    title: "Balanced Scorecard Perspectives",
    description: "Target achievement across 7 strategic pillars.",
    category: "chart",
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    component: PerspectivesPerformanceWidget,
  },
  {
    id: "strategy.panel.portfolio-health",
    title: "Initiative Portfolio Distribution",
    description: "Health breakdown of active strategic initiatives.",
    category: "chart",
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    component: InitiativesPortfolioWidget,
  },
  {
    id: "strategy.panel.alignment-flow",
    title: "Strategic Alignment Flow",
    description: "Visual lifecycle chain from purpose to enterprise outcomes.",
    category: "chart",
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: StrategyAlignmentFlowWidget,
  },
  {
    id: "strategy.panel.initiatives-table",
    title: "Priority Strategic Initiatives Register",
    description: "Executive ledger of high-impact strategic programs.",
    category: "table",
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    component: ExecutiveInitiativesTableWidget,
  },
  {
    id: "strategy.panel.alerts",
    title: "Strategic Alerts & Forecast",
    description: "Execution gate warnings, balanced scorecard watch, and 3-quarter forecast.",
    category: "insight",
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    component: StrategicAlertsWidget,
  },
  {
    id: "strategy.panel.themes-progress",
    title: "Strategic Themes Breakdown",
    description: "Distribution of initiatives across corporate themes.",
    category: "chart",
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    component: StrategicThemesProgressWidget,
  },
  {
    id: "strategy.panel.ai-assistant",
    title: "AI Strategy Intelligence Assistant",
    description: "Neural insights and proactive strategic recommendations.",
    category: "ai",
    defaultSize: "full",
    allowedSizes: ["lg", "xl", "full"],
    component: AIStrategyAssistantWidget,
  },
];

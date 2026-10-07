import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Target,
  Plus,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  Bot,
  ArrowRight,
  Send,
  ShieldAlert,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { StrategyScoreBanner } from "@/components/erp/StrategyScoreBanner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/strategy-management/okr-management")({
  head: () => ({
    meta: [
      { title: "OKR Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise OKR Management: translate strategy into measurable Objectives and Key Results, quarterly cycles, cascades, check-ins, and outcome realization.",
      },
    ],
  }),
  component: OkrManagementPage,
});

function OkrManagementPage() {
  const [cycle, setCycle] = useState("Q3 2026 (Jul - Sep)");
  const [businessUnit, setBusinessUnit] = useState("All Business Units");
  const [aiQuery, setAiQuery] = useState("");

  // OKR Progress Line Chart Data
  const progressTrend = [
    { month: "Jan", planned: 20, actual: 18, target: 22 },
    { month: "Feb", planned: 32, actual: 28, target: 35 },
    { month: "Mar", planned: 45, actual: 40, target: 48 },
    { month: "Apr", planned: 55, actual: 52, target: 60 },
    { month: "May", planned: 68, actual: 64, target: 72 },
    { month: "Jun", planned: 78, actual: 72, target: 80 },
    { month: "Jul", planned: 85, actual: 80, target: 88 },
    { month: "Aug", planned: 92, actual: 84, target: 94 },
    { month: "Sep", planned: 100, actual: 86, target: 100 },
  ];

  // OKR Status Distribution Donut Data
  const statusData = [
    { name: "On Track", value: 18, percentage: 56, color: "#10b981" },
    { name: "At Risk", value: 7, percentage: 22, color: "#f59e0b" },
    { name: "Off Track", value: 5, percentage: 16, color: "#ef4444" },
    { name: "Completed", value: 2, percentage: 6, color: "#3b82f6" },
  ];

  // Department Performance Stacked Bar Data
  const deptPerformanceData = [
    { dept: "Mgmt", onTrack: 4, atRisk: 1, offTrack: 0, completed: 2 },
    { dept: "Product", onTrack: 5, atRisk: 2, offTrack: 1, completed: 3 },
    { dept: "Engg", onTrack: 6, atRisk: 1, offTrack: 1, completed: 4 },
    { dept: "Mfg", onTrack: 3, atRisk: 3, offTrack: 2, completed: 1 },
    { dept: "Sales", onTrack: 4, atRisk: 2, offTrack: 1, completed: 2 },
    { dept: "Finance", onTrack: 3, atRisk: 1, offTrack: 0, completed: 3 },
    { dept: "HR", onTrack: 4, atRisk: 0, offTrack: 0, completed: 2 },
    { dept: "Operations", onTrack: 5, atRisk: 2, offTrack: 1, completed: 2 },
  ];

  const handleAskAI = (promptText?: string) => {
    const text = promptText || aiQuery;
    if (!text.trim()) return;
    toast.success(`AI OKR Assistant analyzing: "${text}"`);
    setAiQuery("");
  };

  return (
    <AppShell
      title="OKR Management"
      breadcrumb="Management"
      description="Align Strategy. Set Objectives. Track Progress. Achieve Outcomes."
      tabs={<StrategyManagementTabBar />}
    >
      <div className="space-y-6 pb-12">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">OKR Management</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Execution Cycle Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Align Strategy. Set Objectives. Track Progress. Achieve Outcomes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-card border rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground shadow-sm">
              <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                className="bg-transparent text-foreground font-medium text-xs focus:outline-none cursor-pointer"
              >
                <option value="Q3 2026 (Jul - Sep)">Q3 2026 (Jul - Sep)</option>
                <option value="Q4 2026 (Oct - Dec)">Q4 2026 (Oct - Dec)</option>
                <option value="Annual FY26">Annual FY26</option>
              </select>
            </div>

            <div className="flex items-center bg-card border rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground shadow-sm">
              <Building className="h-3.5 w-3.5 mr-2 text-primary" />
              <select
                value={businessUnit}
                onChange={(e) => setBusinessUnit(e.target.value)}
                className="bg-transparent text-foreground font-medium text-xs focus:outline-none cursor-pointer"
              >
                <option value="All Business Units">All Business Units</option>
                <option value="Operations">Operations</option>
                <option value="Product & R&D">Product & R&D</option>
                <option value="Finance & Growth">Finance & Growth</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
            </div>

            <button
              onClick={() => toast.success("Opening Objective Creation Dialog")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New OKR
            </button>
          </div>
        </div>

        {/* 7 Metric Score Banner (Executive Standard) */}
        <StrategyScoreBanner moduleName="OKR" />

        {/* Middle Section: Progress Overview + Status Donut + Strategic Themes + AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* 1. OKR Progress Overview Line Chart */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">OKR Progress Overview</h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Planned
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Actual
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> Target
                </span>
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" fontSize={9} />
                  <YAxis fontSize={9} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="target" stroke="#06b6d4" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. OKR Status Distribution Donut */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">OKR Status Distribution</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">32 Total</span>
            </div>

            <div className="relative h-[160px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-foreground">32</span>
                <span className="text-[10px] text-muted-foreground font-semibold">OKRs</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 pt-2 border-t text-[11px]">
              {statusData.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-semibold text-foreground">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Strategic Theme Progress */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">Strategic Theme Progress</h3>
              <span className="text-[10px] font-semibold text-primary">6 Themes</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                { name: "Growth & Market Expansion", val: 82, color: "#3b82f6" },
                { name: "Innovation & Technology", val: 76, color: "#10b981" },
                { name: "Customer Excellence", val: 68, color: "#f59e0b" },
                { name: "Operational Excellence", val: 62, color: "#ef4444" },
                { name: "Sustainability & Impact", val: 58, color: "#14b8a6" },
                { name: "People & Capability", val: 70, color: "#8b5cf6" },
              ].map((theme, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground truncate">{theme.name}</span>
                    <span className="font-bold text-foreground">{theme.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${theme.val}%`, backgroundColor: theme.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. AI OKR Assistant */}
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-card p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">AI OKR Assistant</h3>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Neural</span>
            </div>

            <div className="p-2.5 rounded-lg bg-card/90 border text-xs text-foreground/90 space-y-2">
              <p className="font-medium text-[11px] text-muted-foreground">
                Ask about OKRs, progress, risks, or corrective actions:
              </p>
              <div className="space-y-1.5 text-[10px]">
                {[
                  "Which OKRs are at risk?",
                  "Show progress by department",
                  "Why is the manufacturing OKR behind target?",
                  "Suggest actions to improve on-track rate",
                  "Show OKRs linked to Growth theme",
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAI(q)}
                    className="w-full text-left p-1.5 rounded hover:bg-muted font-medium text-primary flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="truncate">{q}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Ask a question about OKRs..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => handleAskAI()}
                className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle-Bottom Section: Top OKRs Table + Recent Key Results + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Top OKRs by Progress */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Top OKRs by Progress</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                  <tr>
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Objective Title</th>
                    <th className="py-2 px-2">Business Unit</th>
                    <th className="py-2 px-2">Progress</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { id: 1, title: "Expand EV Charging Network", bu: "Operations", prog: 92, st: "On Track" },
                    { id: 2, title: "Launch Autonomous W-EVSE", bu: "Product", prog: 78, st: "On Track" },
                    { id: 3, title: "Achieve ₹50 Cr Revenue", bu: "Finance", prog: 65, st: "At Risk" },
                    { id: 4, title: "Scale Manufacturing Capacity", bu: "Manufacturing", prog: 52, st: "At Risk" },
                    { id: 5, title: "Build Strategic Partnerships", bu: "Business Dev", prog: 38, st: "Off Track" },
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="py-2 px-2 text-muted-foreground">{row.id}</td>
                      <td className="py-2 px-2 font-semibold text-foreground">{row.title}</td>
                      <td className="py-2 px-2 text-muted-foreground">{row.bu}</td>
                      <td className="py-2 px-2 font-bold text-foreground">{row.prog}%</td>
                      <td className="py-2 px-2">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                            row.st === "On Track"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : row.st === "At Risk"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                          )}
                        >
                          {row.st}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Key Results */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Recent Key Results</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                  <tr>
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Key Result</th>
                    <th className="py-2 px-2">Current</th>
                    <th className="py-2 px-2">Target</th>
                    <th className="py-2 px-2">Progress</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { id: 1, title: "Install 100 charging stations", cur: "78", tgt: "100", prog: 78, st: "On Track" },
                    { id: 2, title: "Complete 30 kW prototype", cur: "90%", tgt: "100%", prog: 90, st: "On Track" },
                    { id: 3, title: "Achieve 1,000 charging sessions/day", cur: "650", tgt: "1,000", prog: 65, st: "At Risk" },
                    { id: 4, title: "Reduce unit cost by 15%", cur: "8%", tgt: "15%", prog: 53, st: "At Risk" },
                    { id: 5, title: "Sign 10 franchise partners", cur: "4", tgt: "10", prog: 40, st: "Off Track" },
                  ].map((kr) => (
                    <tr key={kr.id}>
                      <td className="py-2 px-2 text-muted-foreground">{kr.id}</td>
                      <td className="py-2 px-2 font-semibold text-foreground">{kr.title}</td>
                      <td className="py-2 px-2 text-muted-foreground">{kr.cur}</td>
                      <td className="py-2 px-2 text-muted-foreground">{kr.tgt}</td>
                      <td className="py-2 px-2 font-bold text-foreground">{kr.prog}%</td>
                      <td className="py-2 px-2">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                            kr.st === "On Track"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : kr.st === "At Risk"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                          )}
                        >
                          {kr.st}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* OKR Cycle Timeline */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">OKR Cycle Timeline</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                Quarterly Cycle
              </span>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              {[
                { name: "Planning", period: "01 Jun - 15 Jun", status: "Completed", icon: CheckCircle2, color: "text-emerald-500" },
                { name: "Execution", period: "01 Jul - 30 Sep", status: "In Progress", icon: Clock, color: "text-blue-500" },
                { name: "Review", period: "01 Oct - 15 Oct", status: "Pending", icon: AlertTriangle, color: "text-amber-500" },
                { name: "Next Cycle Planning", period: "16 Oct - 31 Oct", status: "Pending", icon: Clock, color: "text-muted-foreground" },
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${step.color}`} />
                      <div>
                        <div className="font-semibold text-foreground">{step.name}</div>
                        <div className="text-[10px] text-muted-foreground">{step.period}</div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded",
                        step.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : step.status === "In Progress"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {step.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Strategic Alignment Pyramid + Dept OKR Bar Chart + Reviews & Risks Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Strategic Alignment Pyramid Graphic */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Strategic Alignment</h3>
              <span className="text-[10px] text-muted-foreground font-semibold">Hierarchy Chain</span>
            </div>

            <div className="space-y-1.5 py-2">
              {[
                { level: "Vision", text: "Global leader in autonomous wireless EV charging infrastructure", color: "bg-blue-600 text-white" },
                { level: "Mission", text: "Design, manufacture and deploy next-generation solutions", color: "bg-indigo-600 text-white" },
                { level: "Strategic Themes", text: "Growth, Innovation, Customer, Operations, Sustainability", color: "bg-emerald-600 text-white" },
                { level: "OKRs", text: "32 OKRs aligned across business units", color: "bg-amber-600 text-white" },
                { level: "Key Results", text: "86 Key Results tracked weekly", color: "bg-rose-600 text-white" },
                { level: "Initiatives", text: "42 active projects and initiatives", color: "bg-purple-600 text-white" },
              ].map((layer, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-xs flex items-center justify-between shadow-sm ${layer.color}`}
                  style={{ margin: `0 ${idx * 6}px` }}
                >
                  <span className="font-bold text-[11px] uppercase tracking-wider">{layer.level}</span>
                  <span className="text-[10px] truncate ml-2 opacity-90">{layer.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Overall Alignment Coherence</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">92% High</span>
            </div>
          </div>

          {/* Department OKR Performance Stacked Bar Chart */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">Department OKR Performance</h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> On Track
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> At Risk
                </span>
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptPerformanceData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="dept" fontSize={9} />
                  <YAxis fontSize={9} />
                  <Tooltip />
                  <Bar dataKey="onTrack" stackId="a" fill="#10b981" name="On Track" />
                  <Bar dataKey="atRisk" stackId="a" fill="#f59e0b" name="At Risk" />
                  <Bar dataKey="offTrack" stackId="a" fill="#ef4444" name="Off Track" />
                  <Bar dataKey="completed" stackId="a" fill="#3b82f6" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Highest Performing Unit</span>
              <span className="font-semibold text-foreground">Product & Engg (88%)</span>
            </div>
          </div>

          {/* Upcoming Reviews & Expected vs Actual Table */}
          <div className="space-y-4">
            {/* Upcoming Reviews */}
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">Upcoming Reviews</h3>
                <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {[
                  { name: "Q3 Business Review", date: "10 Oct 2026", owner: "COO", st: "Scheduled" },
                  { name: "Manufacturing OKR", date: "12 Oct 2026", owner: "Head - Mfg", st: "Scheduled" },
                  { name: "Revenue OKR", date: "15 Oct 2026", owner: "CFO", st: "Pending" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded border bg-muted/20">
                    <div>
                      <div className="font-semibold text-foreground">{r.name}</div>
                      <div className="text-[10px] text-muted-foreground">{r.date} · {r.owner}</div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                      {r.st}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected vs Actual Outcome */}
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">Expected vs Actual Outcome</h3>
                <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                    <tr>
                      <th className="py-1.5 px-2">Metric</th>
                      <th className="py-1.5 px-2">Exp</th>
                      <th className="py-1.5 px-2">Act</th>
                      <th className="py-1.5 px-2">Ach %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Revenue (₹ Cr)</td>
                      <td className="py-1.5 px-2 text-muted-foreground">50</td>
                      <td className="py-1.5 px-2 font-bold text-foreground">32.4</td>
                      <td className="py-1.5 px-2 text-blue-600 font-bold">65%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Charging Stations</td>
                      <td className="py-1.5 px-2 text-muted-foreground">100</td>
                      <td className="py-1.5 px-2 font-bold text-foreground">78</td>
                      <td className="py-1.5 px-2 text-emerald-600 font-bold">78%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Sessions/Day</td>
                      <td className="py-1.5 px-2 text-muted-foreground">1,000</td>
                      <td className="py-1.5 px-2 font-bold text-foreground">650</td>
                      <td className="py-1.5 px-2 text-amber-600 font-bold">65%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

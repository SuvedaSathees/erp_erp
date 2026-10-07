import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Zap,
  Plus,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wallet,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Send,
  ShieldAlert,
  Layers,
  Target,
  Compass,
  Play,
  Pause,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { StrategyScoreBanner } from "@/components/erp/StrategyScoreBanner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/strategy-management/strategic-initiatives")({
  head: () => ({
    meta: [
      { title: "Strategic Initiatives · Magnertia ERP" },
      {
        name: "description",
        content:
          "Strategic Initiatives Management: turn strategy into action, allocate capital budgets, monitor milestone roadmaps, manage initiative risks, and track benefits realization.",
      },
    ],
  }),
  component: StrategicInitiativesPage,
});

export function StrategicInitiativesPage() {
  const [cycle, setCycle] = useState("Q3 2026 (Jul - Sep)");
  const [businessUnit, setBusinessUnit] = useState("All Business Units");
  const [aiQuery, setAiQuery] = useState("");
  const [ganttRange, setGanttRange] = useState("1 Year");

  // Portfolio Overview Donut Data
  const portfolioDonutData = [
    { name: "In Progress", value: 16, percentage: 62, color: "#3b82f6" },
    { name: "At Risk", value: 4, percentage: 15, color: "#f59e0b" },
    { name: "On Hold", value: 2, percentage: 8, color: "#ef4444" },
    { name: "Completed", value: 4, percentage: 15, color: "#10b981" },
  ];

  // Strategic Theme-wise Initiatives Bar Data
  const themeWiseData = [
    { name: "Growth & Expansion", count: 7 },
    { name: "Innovation & Tech", count: 5 },
    { name: "Operational Excellence", count: 4 },
    { name: "Customer Experience", count: 3 },
    { name: "Sustainability & ESG", count: 3 },
    { name: "Risk & Compliance", count: 2 },
    { name: "People & Capability", count: 2 },
  ];

  // Budget vs Actual Bar Data (₹ Cr)
  const budgetVsActualData = [
    { quarter: "Q1", budget: 8.5, actual: 6.2 },
    { quarter: "Q2", budget: 12.0, actual: 10.8 },
    { quarter: "Q3", budget: 15.0, actual: 13.5 },
    { quarter: "Q4", budget: 13.0, actual: 6.5 },
  ];

  // Expected Benefits Donut Data (₹72.3 Cr)
  const benefitsDonutData = [
    { name: "Revenue Growth", value: 40, color: "#3b82f6" },
    { name: "Cost Savings", value: 25, color: "#10b981" },
    { name: "Operational Efficiency", value: 15, color: "#f59e0b" },
    { name: "Customer Value", value: 10, color: "#06b6d4" },
    { name: "Sustainability / ESG", value: 10, color: "#14b8a6" },
  ];

  const handleAskAI = (promptText?: string) => {
    const text = promptText || aiQuery;
    if (!text.trim()) return;
    toast.success(`AI Strategic Initiative Assistant analyzing: "${text}"`);
    setAiQuery("");
  };

  return (
    <AppShell
      title="Strategic Initiatives"
      breadcrumb="Management"
      description="Turn Strategy into Action. Create Value. Achieve Outcomes."
      tabs={<StrategyManagementTabBar />}
    >
      <div className="space-y-6 pb-12">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Strategic Initiatives</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
                  26 Active Programs
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Turn Strategy into Action. Create Value. Achieve Outcomes.
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
                <option value="EV Charging Infra">EV Charging Infra</option>
                <option value="Operations">Operations</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
            </div>

            <button
              onClick={() => toast.success("Opening Initiative Charter Creation Form")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Initiative
            </button>
          </div>
        </div>

        {/* 7 Metric Score Banner (Executive Standard) */}
        <StrategyScoreBanner moduleName="Initiative" />

        {/* Middle Section: Strategy Alignment Flow + Portfolio Donut + Theme-wise Bar + AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Strategy Alignment Flow (6 cols) */}
          <div className="lg:col-span-5 rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Strategy Alignment Flow</h3>
              <span className="text-[10px] text-muted-foreground font-semibold">End-to-End Chain</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border bg-blue-500/5 border-blue-500/20">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px]">
                  <Compass className="h-3.5 w-3.5" /> Vision
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                  Global leader in autonomous W-EVSE charging
                </p>
              </div>

              <div className="p-2.5 rounded-lg border bg-indigo-500/5 border-indigo-500/20">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[11px]">
                  <Layers className="h-3.5 w-3.5" /> Strategic Themes
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                  Growth | Innovation | Sustainability | Ops
                </p>
              </div>

              <div className="p-2.5 rounded-lg border bg-amber-500/5 border-amber-500/20">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[11px]">
                  <Target className="h-3.5 w-3.5" /> Objectives
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                  12 Enterprise Objectives
                </p>
              </div>

              <div className="p-2.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                  <Zap className="h-3.5 w-3.5" /> Initiatives
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                  26 Active Initiatives
                </p>
              </div>

              <div className="p-2.5 rounded-lg border bg-purple-500/5 border-purple-500/20">
                <div className="flex items-center gap-1.5 text-purple-600 font-bold text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Projects / Actions
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                  48 Projects | 320 Actions
                </p>
              </div>

              <div className="p-2.5 rounded-lg border bg-teal-500/5 border-teal-500/20">
                <div className="flex items-center gap-1.5 text-teal-600 font-bold text-[11px]">
                  <Award className="h-3.5 w-3.5" /> Outcomes
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                  Revenue | Share | Capability | ESG
                </p>
              </div>
            </div>

            <div className="pt-2 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Traceability Integrity</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Fully Traceable</span>
            </div>
          </div>

          {/* Portfolio Overview Donut (2 cols) */}
          <div className="lg:col-span-2 rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Portfolio Overview</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">This Year</span>
            </div>

            <div className="relative h-[150px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioDonutData}
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {portfolioDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-foreground">26</span>
                <span className="text-[10px] text-muted-foreground font-semibold">Initiatives</span>
              </div>
            </div>

            <div className="space-y-1 text-[10px] pt-1 border-t">
              {portfolioDonutData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-foreground">
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Theme-wise Initiatives (2 cols) */}
          <div className="lg:col-span-2 rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Strategic Theme-wise</h3>
              <span className="text-[10px] font-semibold text-primary">Count</span>
            </div>

            <div className="space-y-2 text-[10px] pt-1">
              {themeWiseData.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground truncate">{item.name}</span>
                    <span className="font-bold text-foreground">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(item.count / 7) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Strategic Initiative Assistant (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-card p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">AI Strategic Assistant</h3>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Active</span>
            </div>

            <div className="p-2.5 rounded-lg bg-card/90 border text-xs text-foreground/90 space-y-2">
              <p className="font-medium text-[11px] text-muted-foreground">
                Hi! I can help you with strategic initiatives. Try asking:
              </p>
              <div className="space-y-1 text-[10px]">
                {[
                  "Which Initiatives are at risk?",
                  "Show budget vs actual for all initiatives",
                  "What is the expected ROI of ongoing initiatives?",
                  "List initiatives linked to Growth theme",
                  "Suggest actions to improve delayed initiatives",
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAI(q)}
                    className="w-full text-left p-1 rounded hover:bg-muted font-medium text-primary flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="truncate">{q}</span>
                    <ArrowRight className="h-2.5 w-2.5 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Ask a question about initiatives..."
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

        {/* Middle-Bottom: Strategic Initiatives Register Table */}
        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">Strategic Initiatives Register</h3>
            <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Initiative Code</th>
                  <th className="py-2.5 px-3">Initiative Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Objective</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3">Start Date</th>
                  <th className="py-2.5 px-3">End Date</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  { id: 1, code: "SI-2026-001", name: "Expand EV Charging Network", cat: "Growth", obj: "SO-01", owner: "S. Ravi", start: "01 Jul 2026", end: "31 Dec 2027", prog: 75, st: "In Progress" },
                  { id: 2, code: "SI-2026-002", name: "Autonomous W-EVSE R&D", cat: "Innovation", obj: "SO-03", owner: "R. Kumar", start: "15 Jun 2026", end: "30 Jun 2027", prog: 60, st: "In Progress" },
                  { id: 3, code: "SI-2026-003", name: "Manufacturing Scale-up", cat: "Operations", obj: "SO-02", owner: "M. Prakash", start: "01 Aug 2026", end: "31 Dec 2027", prog: 45, st: "At Risk" },
                  { id: 4, code: "SI-2026-004", name: "Strategic Partnership (OEM)", cat: "Partnership", obj: "SO-05", owner: "K. Meena", start: "01 Jul 2026", end: "30 Jun 2027", prog: 30, st: "On Hold" },
                  { id: 5, code: "SI-2026-005", name: "Digital Platform & IoT", cat: "Technology", obj: "SO-04", owner: "A. Khan", start: "01 May 2026", end: "31 Mar 2027", prog: 80, st: "In Progress" },
                  { id: 6, code: "SI-2026-006", name: "Sustainability & ESG Program", cat: "Sustainability", obj: "SO-06", owner: "P. Nithya", start: "01 Jul 2026", end: "31 Dec 2028", prog: 25, st: "Planned" },
                  { id: 7, code: "SI-2026-007", name: "Cost Optimization Program", cat: "Cost Optimization", obj: "SO-05", owner: "V. Suresh", start: "01 Jun 2026", end: "31 Mar 2027", prog: 90, st: "In Progress" },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-3 text-muted-foreground">{row.id}</td>
                    <td className="py-2 px-3 font-mono font-medium text-foreground">{row.code}</td>
                    <td className="py-2 px-3 font-semibold text-foreground">{row.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.cat}</td>
                    <td className="py-2 px-3 font-mono text-muted-foreground">{row.obj}</td>
                    <td className="py-2 px-3 text-foreground">{row.owner}</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.start}</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.end}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.prog >= 70 ? "bg-emerald-500" : row.prog >= 40 ? "bg-blue-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${row.prog}%` }}
                          />
                        </div>
                        <span className="font-bold text-foreground">{row.prog}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-semibold",
                          row.st === "In Progress"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : row.st === "At Risk"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : row.st === "On Hold"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                : "bg-muted text-muted-foreground",
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

        {/* Perspectives Coverage + Budget vs Actual + Expected Benefits Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Perspectives Coverage (6 cols) */}
          <div className="lg:col-span-5 rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Perspectives Coverage</h3>
              <span className="text-[10px] text-muted-foreground font-semibold">7 Pillars</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: "Financial", count: "5 Initiatives", rate: "78%", st: "On Track", color: "text-emerald-600" },
                { name: "Customer", count: "4 Initiatives", rate: "65%", st: "On Track", color: "text-blue-600" },
                { name: "Internal Process", count: "5 Initiatives", rate: "60%", st: "At Risk", color: "text-amber-600" },
                { name: "Learning & Growth", count: "3 Initiatives", rate: "72%", st: "On Track", color: "text-emerald-600" },
                { name: "Innovation & Tech", count: "4 Initiatives", rate: "58%", st: "At Risk", color: "text-amber-600" },
                { name: "Risk & Compliance", count: "2 Initiatives", rate: "70%", st: "On Track", color: "text-emerald-600" },
                { name: "Sustainability & ESG", count: "3 Initiatives", rate: "62%", st: "On Track", color: "text-emerald-600" },
              ].map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border bg-muted/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-[11px]">{p.name}</span>
                    <span className={`text-[10px] font-bold ${p.color}`}>{p.rate}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                    <span>{p.count}</span>
                    <span className="font-semibold">{p.st}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget vs Actual (₹ Cr) (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">Budget vs Actual (₹ Cr)</h3>
                <p className="text-[10px] text-muted-foreground">Capital expenditure progression</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-blue-500" /> Budget
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500" /> Actual
                </span>
              </div>
            </div>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsActualData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="quarter" fontSize={9} />
                  <YAxis fontSize={9} unit=" Cr" />
                  <Tooltip />
                  <Bar dataKey="budget" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Budget" />
                  <Bar dataKey="actual" fill="#10b981" radius={[3, 3, 0, 0]} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expected Benefits (₹ Cr) (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Expected Benefits (₹ Cr)</h3>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">₹72.3 Cr</span>
            </div>

            <div className="relative h-[130px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={benefitsDonutData}
                    innerRadius={36}
                    outerRadius={54}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {benefitsDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-extrabold text-foreground">72.3</span>
                <span className="text-[9px] text-muted-foreground font-semibold">Cr</span>
              </div>
            </div>

            <div className="space-y-0.5 text-[10px] pt-1 border-t">
              {benefitsDonutData.map((b, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: b.color }} />
                    {b.name}
                  </span>
                  <span className="font-bold text-foreground">{b.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Timeline (Gantt) + Milestones + Top Risks + Key KPIs + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Initiative Timeline (Gantt View) (6 cols) */}
          <div className="lg:col-span-6 rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">Initiative Timeline (Gantt View)</h3>
                <p className="text-[10px] text-muted-foreground">Program schedule over 12 months</p>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                {["6 Months", "1 Year", "2 Years"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setGanttRange(r)}
                    className={cn(
                      "px-2 py-0.5 rounded font-medium transition-colors cursor-pointer",
                      ganttRange === r ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs pt-1">
              {[
                { id: 1, name: "Expand EV Charging Network", startPct: 0, widthPct: 75, color: "bg-blue-500" },
                { id: 2, name: "W-EVSE R&D", startPct: 30, widthPct: 55, color: "bg-purple-500" },
                { id: 3, name: "Manufacturing Scale-up", startPct: 15, widthPct: 60, color: "bg-amber-500" },
                { id: 4, name: "OEM Partnership", startPct: 35, widthPct: 40, color: "bg-rose-500" },
                { id: 5, name: "Digital Platform & IoT", startPct: 20, widthPct: 50, color: "bg-emerald-500" },
                { id: 6, name: "Cost Optimization", startPct: 40, widthPct: 35, color: "bg-teal-500" },
              ].map((g) => (
                <div key={g.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-foreground">
                      {g.id}. {g.name}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted/40 rounded-full relative overflow-hidden">
                    <div
                      className={`absolute top-0 bottom-0 rounded-full ${g.color}`}
                      style={{ left: `${g.startPct}%`, width: `${g.widthPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones (Next 90 Days) (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Milestones (Next 90 Days)</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { name: "Prototype v2.0", code: "SI-2026-002", date: "15 Oct 2026", st: "On Track" },
                { name: "Plant Setup Completion", code: "SI-2026-003", date: "20 Oct 2026", st: "At Risk" },
                { name: "100 Charging Stations", code: "SI-2026-001", date: "25 Oct 2026", st: "On Track" },
                { name: "OEM MoU Signing", code: "SI-2026-004", date: "30 Oct 2026", st: "On Hold" },
                { name: "Platform Beta Release", code: "SI-2026-005", date: "10 Nov 2026", st: "On Track" },
              ].map((m, idx) => (
                <div key={idx} className="p-2 rounded border bg-muted/20 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground text-[11px]">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.code} · {m.date}</div>
                  </div>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                      m.st === "On Track"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : m.st === "At Risk"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-rose-500/10 text-rose-600",
                    )}
                  >
                    {m.st}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key KPIs from Initiatives (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Key KPIs from Initiatives</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                  <tr>
                    <th className="py-1.5 px-2">KPI</th>
                    <th className="py-1.5 px-2">Target</th>
                    <th className="py-1.5 px-2">Actual</th>
                    <th className="py-1.5 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-[11px]">
                  {[
                    { name: "Revenue (₹ Cr)", tgt: "50", act: "32.4", st: "On Track" },
                    { name: "OEE (%)", tgt: "85", act: "68", st: "At Risk" },
                    { name: "Charging Stations", tgt: "100", act: "78", st: "On Track" },
                    { name: "Customer NPS", tgt: "80", act: "72", st: "On Track" },
                    { name: "Cost Reduction", tgt: "15%", act: "8%", st: "At Risk" },
                  ].map((kpi, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 px-2 font-semibold text-foreground truncate">{kpi.name}</td>
                      <td className="py-1.5 px-2 text-muted-foreground">{kpi.tgt}</td>
                      <td className="py-1.5 px-2 font-bold text-foreground">{kpi.act}</td>
                      <td className="py-1.5 px-2">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                            kpi.st === "On Track"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600",
                          )}
                        >
                          {kpi.st}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

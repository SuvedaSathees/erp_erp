import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Plus,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Database,
  Target,
  Sparkles,
  Send,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Search,
  Sliders,
  DollarSign,
  Percent,
  Cpu,
  Clock,
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
} from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { StrategyScoreBanner } from "@/components/erp/StrategyScoreBanner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/strategy-management/kpi-management")({
  head: () => ({
    meta: [
      { title: "KPI Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise KPI Management: define, baseline, target, calculate, measure, monitor, alert, and continuously improve performance across 186 strategic indicators.",
      },
    ],
  }),
  component: KpiManagementPage,
});

function KpiManagementPage() {
  const [cycle, setCycle] = useState("Q3 2026 (Jul - Sep)");
  const [businessUnit, setBusinessUnit] = useState("All Business Units");
  const [execTab, setExecTab] = useState("Strategic");
  const [aiQuery, setAiQuery] = useState("");

  // 1. Line Chart Data: KPI Performance Overview
  const performanceTrend = [
    { month: "Jan", actual: 52, target: 60, prevYear: 45 },
    { month: "Feb", actual: 58, target: 64, prevYear: 49 },
    { month: "Mar", actual: 65, target: 70, prevYear: 55 },
    { month: "Apr", actual: 72, target: 75, prevYear: 60 },
    { month: "May", actual: 78, target: 80, prevYear: 65 },
    { month: "Jun", actual: 82, target: 85, prevYear: 70 },
    { month: "Jul", actual: 85, target: 88, prevYear: 72 },
    { month: "Aug", actual: 89, target: 92, prevYear: 76 },
    { month: "Sep", actual: 94, target: 96, prevYear: 80 },
  ];

  // 2. Donut Data: KPI Status Distribution (186 KPIs)
  const kpiStatusData = [
    { name: "On Target", value: 142, percentage: 76, color: "#10b981" },
    { name: "Warning", value: 24, percentage: 13, color: "#f59e0b" },
    { name: "Critical", value: 8, percentage: 4, color: "#ef4444" },
    { name: "Not Started", value: 6, percentage: 3, color: "#3b82f6" },
    { name: "Data Pending", value: 6, percentage: 4, color: "#8b5cf6" },
  ];

  // 3. Bar Chart Data: KPI Trend Analysis (Revenue ₹ Cr)
  const trendBarData = [
    { month: "Jan", actual: 18, target: 25, forecast: 20 },
    { month: "Feb", actual: 22, target: 28, forecast: 24 },
    { month: "Mar", actual: 26, target: 32, forecast: 28 },
    { month: "Apr", actual: 28, target: 36, forecast: 32 },
    { month: "May", actual: 30, target: 40, forecast: 36 },
    { month: "Jun", actual: 31, target: 44, forecast: 40 },
    { month: "Jul", actual: 32, target: 46, forecast: 42 },
    { month: "Aug", actual: 33, target: 48, forecast: 45 },
    { month: "Sep", actual: 32.4, target: 50, forecast: 48 },
  ];

  const handleAskAI = (promptText?: string) => {
    const text = promptText || aiQuery;
    if (!text.trim()) return;
    toast.success(`AI KPI Assistant analyzing: "${text}"`);
    setAiQuery("");
  };

  return (
    <AppShell
      title="KPI Management"
      breadcrumb="Management"
      description="Define. Measure. Monitor. Improve Performance."
      tabs={<StrategyManagementTabBar />}
    >
      <div className="space-y-6 pb-12">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">KPI Management</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
                  186 Monitored
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define. Measure. Monitor. Improve Performance.
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
                <option value="Finance & Growth">Finance & Growth</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Commercial & Sales">Commercial & Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <button
              onClick={() => toast.success("Opening New KPI Definition Form")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New KPI
            </button>
          </div>
        </div>

        {/* 7 Metric Score Banner (Executive Standard) */}
        <StrategyScoreBanner moduleName="KPI" />

        {/* Middle Section: Performance Overview + Status Donut + Category Bars + AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* 1. KPI Performance Overview Line Chart */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">KPI Performance Overview</h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Actual
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Target
                </span>
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" fontSize={9} />
                  <YAxis fontSize={9} domain={[30, 105]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="target" stroke="#10b981" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="prevYear" stroke="#94a3b8" strokeDasharray="2 2" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. KPI Status Distribution Donut */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">KPI Status Distribution</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">186 Total</span>
            </div>

            <div className="relative h-[160px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kpiStatusData}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {kpiStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-foreground">186</span>
                <span className="text-[10px] text-muted-foreground font-semibold">KPIs</span>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t text-[11px]">
              {kpiStatusData.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-semibold text-foreground">
                    {s.percentage}% ({s.value})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. KPI by Category Bars */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-foreground">KPI by Category</h3>
              <span className="text-[10px] font-semibold text-primary">This Quarter</span>
            </div>

            <div className="space-y-2 pt-1 text-[11px]">
              {[
                { name: "Financial", rate: 92 },
                { name: "Commercial", rate: 78 },
                { name: "Operational", rate: 73 },
                { name: "Customer", rate: 68 },
                { name: "Manufacturing", rate: 62 },
                { name: "Quality", rate: 58 },
                { name: "People (HR)", rate: 55 },
                { name: "Projects", rate: 48 },
                { name: "Risk & Compliance", rate: 45 },
                { name: "Sustainability", rate: 40 },
              ].map((c, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="font-bold text-foreground">{c.rate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. AI KPI Assistant */}
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-card p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">AI KPI Assistant</h3>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Active</span>
            </div>

            <div className="p-3 rounded-lg bg-card/90 border text-xs text-foreground/90 space-y-2.5">
              <div className="text-[11px] font-semibold text-muted-foreground">
                Found 8 KPIs at risk (Q3 2026). Top recommendations:
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="p-2 rounded bg-rose-500/5 border border-rose-500/20">
                  <div className="font-bold text-rose-600 dark:text-rose-400">Revenue Growth (12% vs 20%)</div>
                  <div className="text-muted-foreground mt-0.5">
                    <strong>Action:</strong> Increase pipeline conversion, focus on Tier-1 OEM accounts.
                  </div>
                </div>
                <div className="p-2 rounded bg-amber-500/5 border border-amber-500/20">
                  <div className="font-bold text-amber-600 dark:text-amber-400">Manufacturing OEE (68% vs 85%)</div>
                  <div className="text-muted-foreground mt-0.5">
                    <strong>Action:</strong> Reduce downtime, improve preventive line calibration.
                  </div>
                </div>
                <div className="p-2 rounded bg-blue-500/5 border border-blue-500/20">
                  <div className="font-bold text-blue-600 dark:text-blue-400">Customer Acquisition (450 vs 600)</div>
                  <div className="text-muted-foreground mt-0.5">
                    <strong>Action:</strong> Allocate budget to regional distributor partnerships.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Ask a question about KPIs..."
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

        {/* Middle-Bottom Section: Top 5 Critical KPIs + KPI Trend Analysis Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top 5 Critical / At-Risk KPIs Table */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Top 5 Critical / At-Risk KPIs</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                  <tr>
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">KPI Name</th>
                    <th className="py-2 px-2.5">Category</th>
                    <th className="py-2 px-2.5">Actual</th>
                    <th className="py-2 px-2.5">Target</th>
                    <th className="py-2 px-2.5">Variance</th>
                    <th className="py-2 px-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { id: 1, name: "Revenue Growth", cat: "Financial", act: "12%", tgt: "20%", var: "-8%", st: "Critical" },
                    { id: 2, name: "Manufacturing OEE", cat: "Operations", act: "68%", tgt: "85%", var: "-17%", st: "At Risk" },
                    { id: 3, name: "Customer Acquisition", cat: "Commercial", act: "450", tgt: "600", var: "-25%", st: "At Risk" },
                    { id: 4, name: "Project Delivery (OTD)", cat: "Projects", act: "72%", tgt: "95%", var: "-23%", st: "Critical" },
                    { id: 5, name: "Energy Consumption", cat: "Sustainability", act: "18%", tgt: "15%", var: "+3%", st: "At Risk" },
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="py-2 px-2.5 text-muted-foreground">{row.id}</td>
                      <td className="py-2 px-2.5 font-semibold text-foreground">{row.name}</td>
                      <td className="py-2 px-2.5 text-muted-foreground">{row.cat}</td>
                      <td className="py-2 px-2.5 font-bold text-foreground">{row.act}</td>
                      <td className="py-2 px-2.5 text-muted-foreground">{row.tgt}</td>
                      <td className="py-2 px-2.5 font-mono text-rose-600 font-semibold">{row.var}</td>
                      <td className="py-2 px-2.5">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                            row.st === "Critical"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
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

          {/* KPI Trend Analysis Bar Chart */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">KPI Trend Analysis</h3>
                <p className="text-[11px] text-muted-foreground">Revenue (₹ Cr) Trajectory vs Forecast</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-blue-500" /> Actual
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500" /> Target
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-cyan-500" /> Forecast
                </span>
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" fontSize={9} />
                  <YAxis fontSize={9} unit=" Cr" />
                  <Tooltip />
                  <Bar dataKey="actual" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Actual" />
                  <Bar dataKey="target" fill="#10b981" radius={[3, 3, 0, 0]} name="Target" />
                  <Bar dataKey="forecast" fill="#06b6d4" radius={[3, 3, 0, 0]} name="Forecast" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section: Executive KPI Dashboard + Recent Measurements Table + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Executive KPI Dashboard mini cards */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Executive KPI Dashboard</h3>
              <div className="flex items-center gap-1 text-[10px]">
                {["Strategic", "Financial", "Operational"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setExecTab(cat)}
                    className={cn(
                      "px-2 py-0.5 rounded font-medium transition-colors cursor-pointer",
                      execTab === cat ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Revenue (₹ Cr)</span>
                <div className="text-base font-bold text-foreground">32.4</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Target: 50</span>
                  <span className="font-bold text-blue-600">65%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Gross Margin (%)</span>
                <div className="text-base font-bold text-foreground">28%</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Target: 32%</span>
                  <span className="font-bold text-emerald-600">88%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground block">EBITDA (₹ Cr)</span>
                <div className="text-base font-bold text-foreground">6.8</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Target: 10</span>
                  <span className="font-bold text-blue-600">68%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Cash Runway</span>
                <div className="text-base font-bold text-foreground">14 Mo</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Target: 18 Mo</span>
                  <span className="font-bold text-emerald-600">78%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Market Share (%)</span>
                <div className="text-base font-bold text-foreground">8%</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Target: 12%</span>
                  <span className="font-bold text-blue-600">67%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground block">Customer NPS</span>
                <div className="text-base font-bold text-foreground">72</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Target: 80</span>
                  <span className="font-bold text-emerald-600">90%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent KPI Measurements Table */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Recent KPI Measurements</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                  <tr>
                    <th className="py-1.5 px-2">#</th>
                    <th className="py-1.5 px-2">KPI Name</th>
                    <th className="py-1.5 px-2">Period</th>
                    <th className="py-1.5 px-2">Actual</th>
                    <th className="py-1.5 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { id: 1, name: "Charging Stations", period: "Sep 2026", act: "78", st: "On Target" },
                    { id: 2, name: "Charging Sessions", period: "Sep 2026", act: "45,000", st: "On Target" },
                    { id: 3, name: "Revenue (₹ Cr)", period: "Sep 2026", act: "32.4", st: "At Risk" },
                    { id: 4, name: "OEE (%)", period: "Sep 2026", act: "68%", st: "At Risk" },
                    { id: 5, name: "Cost Reduction (%)", period: "Sep 2026", act: "8%", st: "On Target" },
                    { id: 6, name: "Customer NPS", period: "Sep 2026", act: "72", st: "On Target" },
                    { id: 7, name: "Project Delivery", period: "Sep 2026", act: "72%", st: "Critical" },
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="py-1.5 px-2 text-muted-foreground">{row.id}</td>
                      <td className="py-1.5 px-2 font-semibold text-foreground">{row.name}</td>
                      <td className="py-1.5 px-2 text-muted-foreground">{row.period}</td>
                      <td className="py-1.5 px-2 font-bold text-foreground">{row.act}</td>
                      <td className="py-1.5 px-2">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                            row.st === "On Target"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : row.st === "At Risk"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-rose-500/10 text-rose-600",
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

          {/* KPI Data Quality & Alerts */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">KPI Data Quality & Alerts</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-base">95%</span>
                <span className="text-[10px] text-muted-foreground">Data Quality</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="font-bold text-amber-600 dark:text-amber-400 block text-base">5</span>
                <span className="text-[10px] text-muted-foreground">Missing Data</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="font-bold text-rose-600 dark:text-rose-400 block text-base">2</span>
                <span className="text-[10px] text-muted-foreground">Calc Errors</span>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Recent Alerts
              </span>
              {[
                { title: "Revenue Growth below target", time: "30 Sep 10:30", type: "critical" },
                { title: "Manufacturing OEE declining", time: "30 Sep 09:15", type: "warning" },
                { title: "Project Delivery delay risk", time: "29 Sep 16:45", type: "critical" },
                { title: "High energy consumption", time: "29 Sep 14:20", type: "warning" },
                { title: "CAPA closure overdue", time: "28 Sep 11:10", type: "warning" },
              ].map((alert, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${alert.type === "critical" ? "bg-rose-500" : "bg-amber-500"}`}
                    />
                    <span className="font-medium text-foreground">{alert.title}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Plus,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Layers,
  Target,
  ArrowRight,
  ShieldCheck,
  Send,
  Leaf,
  Cpu,
  Users,
  Compass,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

import { useModuleDataset } from "@/services/moduleDatasetService";
export const Route = createFileRoute("/management/strategy-management/balanced-scorecard")({
  head: () => ({
    meta: [
      { title: "Balanced Scorecard · Magnertia ERP" },
      {
        name: "description",
        content:
          "Translate strategy into measurable enterprise performance across Financial, Customer, Internal Process, Learning & Growth, Innovation, Risk, and Sustainability perspectives.",
      },
    ],
  }),
  component: BalancedScorecardPage,
});

const perspectives = [
  { name: "Financial", ach: 82, weight: 25, color: "bg-emerald-500" },
  { name: "Customer", ach: 76, weight: 20, color: "bg-blue-500" },
  { name: "Internal Process", ach: 68, weight: 20, color: "bg-amber-500" },
  { name: "Learning & Growth", ach: 62, weight: 15, color: "bg-purple-500" },
  { name: "Innovation & Technology", ach: 58, weight: 10, color: "bg-rose-500" },
  { name: "Risk, Security & Compliance", ach: 72, weight: 5, color: "bg-cyan-500" },
  { name: "Sustainability & ESG", ach: 65, weight: 5, color: "bg-teal-500" },
];

const trendData = [
  { period: "Q4 2025", score: 58 },
  { period: "Q1 2026", score: 64 },
  { period: "Q2 2026", score: 67 },
  { period: "Q3 2026", score: 72 },
];

const PAGE_DATASET = { perspectives, trendData };

function BalancedScorecardPage() {
  const { perspectives, trendData } = useModuleDataset("strategy-management.balanced-scorecard", "Balanced Scorecard", PAGE_DATASET);
  const [cycle, setCycle] = useState("Q3 2026 (Jul - Sep)");
  const [businessUnit, setBusinessUnit] = useState("All Business Units");
  const [aiTab, setAiTab] = useState("Chat");
  const [aiQuery, setAiQuery] = useState("");

  // Perspective Performance Data

  // Scorecard Trend Data

  const handleAskAI = () => {
    if (!aiQuery.trim()) return;
    toast.success(`AI Strategy Assistant analyzing: "${aiQuery}"`);
    setAiQuery("");
  };

  return (
    <AppShell
      title="Balanced Scorecard"
      breadcrumb="Management"
      description="Translate Strategy into Measurable Performance."
      tabs={<StrategyManagementTabBar />}
    >
      <div className="space-y-6 pb-12">
        {/* Top Header Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Balanced Scorecard</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  72% Overall Score
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Translate Strategy into Measurable Performance.
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
                <option value="Manufacturing">Manufacturing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <button
              onClick={() => toast.success("Opening New Scorecard Dialog")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Scorecard
            </button>
          </div>
        </div>

        {/* 7 Metric Score Banner (Executive Standard) */}
        <StrategyScoreBanner moduleName="Scorecard" />

        {/* Middle Section: Strategy Map Cause-and-Effect + Perspective Performance + AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Strategy Map (7 cols) */}
          <div className="lg:col-span-6 rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">Strategy Map - Cause and Effect</h3>
                <p className="text-[10px] text-muted-foreground">Horizontal perspective linkage flow</p>
              </div>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">
                View Full Screen
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Financial */}
              <div className="p-2.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                    Financial (25%)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Increase Revenue (+15% YoY)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Improve Profitability (EBITDA 18%)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Optimize Cash (Runway &gt;18 mo)
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="p-2.5 rounded-lg border bg-blue-500/5 border-blue-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-700 dark:text-blue-400 text-[11px]">Customer (20%)</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Expand Market Share (10%)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Improve CSAT (NPS &gt; 60)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Customer Retention (&gt;90%)
                  </div>
                </div>
              </div>

              {/* Internal Process */}
              <div className="p-2.5 rounded-lg border bg-amber-500/5 border-amber-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-700 dark:text-amber-400 text-[11px]">
                    Internal Process (20%)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Manufacturing OEE (&gt; 85%)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Reduce Cycle Time (-20%)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Enhance Quality (Defects &lt; 1%)
                  </div>
                </div>
              </div>

              {/* Learning & Growth */}
              <div className="p-2.5 rounded-lg border bg-purple-500/5 border-purple-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-700 dark:text-purple-400 text-[11px]">
                    Learning & Growth (15%)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Build Engineering Capability
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Employee Engagement (&gt;80%)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Drive Digital Transformation
                  </div>
                </div>
              </div>

              {/* Innovation & Technology */}
              <div className="p-2.5 rounded-lg border bg-rose-500/5 border-rose-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700 dark:text-rose-400 text-[11px]">
                    Innovation & Tech (10%)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Accelerate R&D (3 Products)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Strengthen IP (5 patents/yr)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    AI & Automation Adoption
                  </div>
                </div>
              </div>

              {/* Sustainability & ESG */}
              <div className="p-2.5 rounded-lg border bg-teal-500/5 border-teal-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-700 dark:text-teal-400 text-[11px]">
                    Sustainability & ESG (5%)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Carbon Reduction (-30%)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Renewable Energy (50%)
                  </div>
                  <div className="p-1.5 rounded bg-card border text-center font-medium">
                    Zero Non-Compliance
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Perspective Performance (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Perspective Performance</h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-blue-500" /> Target Ach.
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-muted-foreground" /> Weight
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {perspectives.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{p.name}</span>
                    <span className="font-bold text-foreground">
                      {p.ach}% <span className="font-normal text-muted-foreground">({p.weight}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                    <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.ach}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Overall Weighted Score</span>
              <span className="font-bold text-foreground text-sm">72.0%</span>
            </div>
          </div>

          {/* AI Strategy Assistant (3 cols) */}
          <div className="lg:col-span-3 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-card p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">AI Strategy Assistant</h3>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Live</span>
            </div>

            <div className="p-3 rounded-lg bg-card/90 border text-xs text-foreground/90 space-y-2">
              <div className="font-bold text-xs text-foreground">Q3 2026 Summary</div>
              <ul className="space-y-1 text-[11px] text-muted-foreground list-disc list-inside">
                <li>Overall scorecard: <strong>72%</strong> (↑8% vs Q2)</li>
                <li>3 perspectives on track (Financial, Customer, Risk)</li>
                <li>2 perspectives at risk (Process, Sustainability)</li>
                <li>Key driver: Revenue growth &amp; improved OEE</li>
                <li>Concern: Project delivery delays &amp; energy usage</li>
              </ul>
              <div className="p-2 rounded bg-primary/5 border border-primary/20 text-[10px] text-foreground font-medium">
                <strong>Recommendation:</strong> Reallocate resources to manufacturing efficiency and line automation.
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Ask a question about the scorecard..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleAskAI}
                className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle-Bottom Section: Overall Balanced Scorecard Semi-Circle Gauge & Scorecard Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Overall Balanced Scorecard Semi-Circle Gauge Card */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Overall Balanced Scorecard</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">This Quarter</span>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
                <div className="absolute top-0 w-48 h-48 rounded-full border-[18px] border-emerald-500 border-b-transparent border-l-transparent rotate-[45deg]" />
                <div className="text-center pb-1">
                  <span className="text-3xl font-extrabold text-foreground">72%</span>
                  <span className="text-[11px] block font-semibold text-muted-foreground">Scorecard Score</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                ↑ 8% vs. last quarter
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1 pt-2 border-t text-[10px] text-center font-medium text-muted-foreground">
              <div>
                <span className="text-emerald-600 font-bold block">1</span> Excellent (&ge;90%)
              </div>
              <div>
                <span className="text-blue-600 font-bold block">4</span> On Track (70-90%)
              </div>
              <div>
                <span className="text-amber-600 font-bold block">2</span> Watch (50-70%)
              </div>
              <div>
                <span className="text-rose-600 font-bold block">1</span> At Risk (30-50%)
              </div>
              <div>
                <span className="text-red-600 font-bold block">0</span> Critical (&lt;30%)
              </div>
            </div>
          </div>

          {/* Scorecard Trend Across 4 Quarters */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Scorecard Trend</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Last 4 Quarters</span>
            </div>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="period" fontSize={9} />
                  <YAxis fontSize={9} unit="%" domain={[40, 90]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Scorecard Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Quarter-over-Quarter Growth</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">+5.0% Average</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Top Objectives Table + Key KPIs Table + Initiatives Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Top Strategic Objectives */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Top Strategic Objectives</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                  <tr>
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Objective</th>
                    <th className="py-2 px-2">Perspective</th>
                    <th className="py-2 px-2">Progress</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { id: 1, name: "Increase Revenue by 15%", p: "Financial", prog: 82, st: "On Track" },
                    { id: 2, name: "Achieve OEE > 85%", p: "Internal Process", prog: 68, st: "At Risk" },
                    { id: 3, name: "Improve NPS to > 60", p: "Customer", prog: 76, st: "On Track" },
                    { id: 4, name: "Launch 3 New Products", p: "Innovation", prog: 58, st: "At Risk" },
                    { id: 5, name: "Reduce Carbon by 30%", p: "Sustainability", prog: 65, st: "On Track" },
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="py-2 px-2 text-muted-foreground">{row.id}</td>
                      <td className="py-2 px-2 font-semibold text-foreground">{row.name}</td>
                      <td className="py-2 px-2 text-muted-foreground">{row.p}</td>
                      <td className="py-2 px-2 font-bold text-foreground">{row.prog}%</td>
                      <td className="py-2 px-2">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                            row.st === "On Track"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600",
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

          {/* Key KPIs Table */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Key KPIs</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                  <tr>
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">KPI</th>
                    <th className="py-2 px-2">Actual</th>
                    <th className="py-2 px-2">Target</th>
                    <th className="py-2 px-2">Ach %</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { id: 1, name: "Revenue (₹ Cr)", act: "32.4", tgt: "50.0", ach: "65%", st: "On Track" },
                    { id: 2, name: "Gross Margin (%)", act: "28", tgt: "32", ach: "88%", st: "On Track" },
                    { id: 3, name: "OEE (%)", act: "68", tgt: "85", ach: "80%", st: "At Risk" },
                    { id: 4, name: "Customer NPS", act: "72", tgt: "80", ach: "90%", st: "On Track" },
                    { id: 5, name: "Project On-Time (%)", act: "72", tgt: "95", ach: "76%", st: "At Risk" },
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="py-2 px-2 text-muted-foreground">{row.id}</td>
                      <td className="py-2 px-2 font-semibold text-foreground">{row.name}</td>
                      <td className="py-2 px-2 font-bold text-foreground">{row.act}</td>
                      <td className="py-2 px-2 text-muted-foreground">{row.tgt}</td>
                      <td className="py-2 px-2 font-bold text-blue-600">{row.ach}</td>
                      <td className="py-2 px-2">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                            row.st === "On Track"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600",
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

          {/* Initiatives & Actions Table */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Initiatives & Actions</h3>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-semibold border-b">
                  <tr>
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Initiative / Action</th>
                    <th className="py-2 px-2">Owner</th>
                    <th className="py-2 px-2">Progress</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { id: 1, name: "Expand Charging Network", owner: "COO", prog: 75, st: "In Progress" },
                    { id: 2, name: "Improve Manufacturing Line", owner: "Head - Mfg", prog: 60, st: "In Progress" },
                    { id: 3, name: "Customer Experience Program", owner: "Head - Sales", prog: 45, st: "At Risk" },
                    { id: 4, name: "AI & Automation Implementation", owner: "CTO", prog: 30, st: "Not Started" },
                    { id: 5, name: "Sustainability Energy Program", owner: "Head - Ops", prog: 55, st: "In Progress" },
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="py-2 px-2 text-muted-foreground">{row.id}</td>
                      <td className="py-2 px-2 font-semibold text-foreground">{row.name}</td>
                      <td className="py-2 px-2 text-muted-foreground">{row.owner}</td>
                      <td className="py-2 px-2 font-bold text-foreground">{row.prog}%</td>
                      <td className="py-2 px-2">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                            row.st === "In Progress"
                              ? "bg-blue-500/10 text-blue-600"
                              : row.st === "At Risk"
                                ? "bg-amber-500/10 text-amber-600"
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
        </div>
      </div>
    </AppShell>
  );
}

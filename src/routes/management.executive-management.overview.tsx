import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ExecutiveManagementTabBar } from "@/components/erp/ExecutiveManagementTabBar";
import {
  Activity,
  TrendingUp,
  DollarSign,
  Award,
  Target,
  Layers,
  ShieldCheck,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  FileText,
  BarChart3,
  Building2,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/executive-management/overview")({
  head: () => ({
    meta: [
      { title: "Executive Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive Decision Intelligence command center providing leadership visibility across strategic planning, financial health, operational capacity, risk escalations, and executive actions.",
      },
    ],
  }),
  component: ExecutiveOverviewPage,
});

const QUARTERLY_TRENDS = [
  { quarter: "Q3 FY25", revenue: 8.5, ebitda: 1.8, netProfit: 0.9 },
  { quarter: "Q4 FY25", revenue: 9.2, ebitda: 1.9, netProfit: 1.0 },
  { quarter: "Q1 FY26", revenue: 10.8, ebitda: 2.3, netProfit: 1.4 },
  { quarter: "Q2 FY26", revenue: 10.9, ebitda: 2.4, netProfit: 1.4 },
  { quarter: "Q3 FY26", revenue: 12.8, ebitda: 2.9, netProfit: 1.8 },
];

const REVENUE_BY_STREAM = [
  { name: "Public Charging", value: 42, color: "#3b82f6" },
  { name: "Fleet Solutions", value: 22, color: "#10b981" },
  { name: "Residential", value: 15, color: "#f59e0b" },
  { name: "Commercial", value: 12, color: "#8b5cf6" },
  { name: "AMC & Services", value: 6, color: "#06b6d4" },
  { name: "Others", value: 3, color: "#64748b" },
];

function ExecutiveOverviewPage() {
  const [fiscalYear, setFiscalYear] = useState("FY 2026-27");
  const [businessUnit, setBusinessUnit] = useState("All Business Units");

  return (
    <AppShell
      title="Executive Overview"
      breadcrumb="Management > Executive > Overview"
      description="Executive Decision Intelligence Command Center: Strategy, Financials, Operations, Decisions & Accountable Action Tracking."
      tabs={<ExecutiveManagementTabBar />}
    >
      <div className="space-y-5 pb-16">
        {/* Header Action Card */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-xl bg-card p-4 border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Executive Overview</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Leadership Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Consolidated Enterprise Decision Intelligence & Performance Monitoring</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs cursor-pointer"
            >
              <option value="FY 2026-27">FY 2026-27</option>
              <option value="FY 2025-26">FY 2025-26</option>
            </select>

            <select
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border bg-background text-foreground shadow-2xs cursor-pointer"
            >
              <option value="All Business Units">All Business Units</option>
              <option value="EV Charging Infrastructure">EV Charging Infrastructure</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>

            <Link
              to="/management/executive-management/executive-review"
              className="h-9 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Activity className="h-4 w-4" />
              <span>Go to Executive Review</span>
            </Link>
          </div>
        </div>

        {/* 10 Executive Top Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Q3 Revenue</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">₹ 12.8 Cr</div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="h-3 w-3" /> 18% vs Q2
            </span>
          </div>

          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">EBITDA</span>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">₹ 2.9 Cr</div>
            <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="h-3 w-3" /> 25% vs Q2
            </span>
          </div>

          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Net Profit</span>
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">₹ 1.8 Cr</div>
            <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="h-3 w-3" /> 32% vs Q2
            </span>
          </div>

          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Active Customers</span>
              <Target className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">146</div>
            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="h-3 w-3" /> 12%
            </span>
          </div>

          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Active Projects</span>
              <Layers className="h-4 w-4 text-cyan-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">28</div>
            <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">2 Delayed</span>
          </div>

          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Compliance Score</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">96.1%</div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="h-3 w-3" /> 4%
            </span>
          </div>

          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">People Strength</span>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">78</div>
            <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="h-3 w-3" /> 6%
            </span>
          </div>

          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Cash Runway</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">18 Mos</div>
            <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Healthy Buffer</span>
          </div>

          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">OEE / Efficiency</span>
              <Zap className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">82.7%</div>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Above Target</span>
          </div>

          <div className="bg-card border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">High Risks</span>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">3</div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowDownRight className="h-3 w-3" /> 25%
            </span>
          </div>
        </div>

        {/* Charts: Financial Quarterly Trend + Revenue Segment + Strategic Objectives */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Financial Composed Chart (5 cols) */}
          <div className="lg:col-span-5 bg-card border rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <div>
                <h4 className="font-bold text-sm text-foreground">Financial Performance Trend</h4>
                <p className="text-[11px] text-muted-foreground">Revenue, EBITDA & Net Profit</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                ₹ Crore
              </span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={QUARTERLY_TRENDS}>
                  <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke="#f59e0b" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Segment Donut (3 cols) */}
          <div className="lg:col-span-3 bg-card border rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              <h4 className="font-bold text-sm text-foreground">Revenue by Stream</h4>
              <span className="text-xs text-muted-foreground font-semibold">₹ 12.8 Cr</span>
            </div>
            <div className="h-44 w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={REVENUE_BY_STREAM}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                  >
                    {REVENUE_BY_STREAM.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              {REVENUE_BY_STREAM.slice(0, 4).map((s) => (
                <div key={s.name} className="truncate text-muted-foreground">
                  ● {s.name} ({s.value}%)
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Objectives Progress (4 cols) */}
          <div className="lg:col-span-4 bg-card border rounded-xl p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Target className="h-4 w-4 text-emerald-600" />
                <span>Strategic Objectives</span>
              </h4>
              <span className="text-xs text-blue-600 font-semibold cursor-pointer">5 Objectives</span>
            </div>
            <div className="space-y-2 text-xs pt-1">
              {[
                { name: "Increase Market Share to 15%", pct: 92, color: "bg-emerald-500" },
                { name: "Launch 3 New Products", pct: 76, color: "bg-blue-500" },
                { name: "Achieve ₹120 Cr Revenue", pct: 84, color: "bg-indigo-500" },
                { name: "Establish 3 Manufacturing Hubs", pct: 60, color: "bg-amber-500" },
                { name: "ESG & Sustainability Targets", pct: 70, color: "bg-cyan-500" },
              ].map((obj) => (
                <div key={obj.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-foreground">{obj.name}</span>
                    <span className="font-bold text-foreground">{obj.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", obj.color)} style={{ width: `${obj.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Row: Executive Decisions Queue + Action Tracker + Quick Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Executive Decisions (6 cols) */}
          <div className="lg:col-span-6 bg-card border rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h4 className="font-bold text-sm text-foreground">Recent Executive Decisions</h4>
              <Link
                to="/management/executive-management/executive-review"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                Review Board <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { text: "Approve 3 new product launches", owner: "CTO", status: "Approved" },
                { text: "Increase manufacturing capacity", owner: "COO", status: "In Review" },
                { text: "Explore external funding (Series A)", owner: "CEO", status: "Open" },
                { text: "Strengthen supply chain partners", owner: "COO", status: "Open" },
              ].map((d, i) => (
                <div key={i} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{d.text}</div>
                    <div className="text-[10px] text-muted-foreground">Owner: {d.owner}</div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded",
                      d.status === "Approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Tracker (6 cols) */}
          <div className="lg:col-span-6 bg-card border rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h4 className="font-bold text-sm text-foreground">Key Executive Actions</h4>
              <span className="text-xs text-muted-foreground font-semibold">Active Items</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { text: "Finalize product launch plan", owner: "A. Khan", status: "On Track", pct: 80 },
                { text: "Resolve supply chain delays", owner: "S. Ravi", status: "At Risk", pct: 40 },
                { text: "Improve fleet customer onboarding", owner: "P. Nithya", status: "On Track", pct: 60 },
                { text: "Close audit findings", owner: "R. Mani", status: "Delayed", pct: 30 },
              ].map((a, i) => (
                <div key={i} className="p-2 rounded-lg border bg-muted/20 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{a.text}</div>
                    <div className="text-[10px] text-muted-foreground">Owner: {a.owner}</div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded",
                      a.status === "On Track"
                        ? "bg-emerald-100 text-emerald-700"
                        : a.status === "At Risk"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                    )}
                  >
                    {a.status} ({a.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

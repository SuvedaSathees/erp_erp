import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Filter,
  Download,
  RefreshCw,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Users,
  Award,
  DollarSign,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Building2,
  MapPin,
  Compass,
  Zap,
  Plus,
  Trash2,
  Search,
  X,
  Check,
  Share2,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/sales-management/sales-analytics"
)({
  head: () => ({
    meta: [
      { title: "Sales Analytics · Sales Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Turning Sales Data into Smarter Decisions — Comprehensive Revenue, Pipeline & Margin Intelligence",
      },
    ],
  }),
  component: SalesAnalyticsComponent,
});

const initialStepperStages = [
  { id: 1, title: "Data Ingestion", status: "completed" },
  { id: 2, title: "Normalization", status: "completed" },
  { id: 3, title: "KPI Engine", status: "current" },
  { id: 4, title: "AI Anomaly Detection", status: "pending" },
  { id: 5, title: "Executive Review", status: "pending" },
  { id: 6, title: "Insights Published", status: "pending" },
];

const analyticsPeriodDatasets: Record<string, {
  revenue: string;
  target: string;
  revDelta: string;
  isDeltaPos: boolean;
  pipeline: string;
  coverage: string;
  newCustomers: number;
  custTarget: number;
  custDelta: string;
  margin: string;
  marginDelta: string;
  forecastAcc: string;
  winRate: string;
  avgDeal: string;
  score: number;
  grade: string;
}> = {
  "FY 2026-27": {
    revenue: "₹3.80 Cr",
    target: "₹4.50 Cr",
    revDelta: "-15.6%",
    isDeltaPos: false,
    pipeline: "₹13.20 Cr",
    coverage: "2.93x Coverage",
    newCustomers: 72,
    custTarget: 60,
    custDelta: "+20.0%",
    margin: "28.5%",
    marginDelta: "-1.5%",
    forecastAcc: "92.0%",
    winRate: "31.0%",
    avgDeal: "₹5.28 L",
    score: 81,
    grade: "Grade A (Strong)",
  },
  "H1 FY 2026-27": {
    revenue: "₹2.12 Cr",
    target: "₹2.25 Cr",
    revDelta: "-5.8%",
    isDeltaPos: false,
    pipeline: "₹9.80 Cr",
    coverage: "3.10x Coverage",
    newCustomers: 44,
    custTarget: 35,
    custDelta: "+25.7%",
    margin: "29.2%",
    marginDelta: "+0.8%",
    forecastAcc: "94.5%",
    winRate: "33.5%",
    avgDeal: "₹5.60 L",
    score: 86,
    grade: "Grade A+ (Excellent)",
  },
  "Q2 FY 2026-27": {
    revenue: "₹1.16 Cr",
    target: "₹1.10 Cr",
    revDelta: "+5.4%",
    isDeltaPos: true,
    pipeline: "₹6.40 Cr",
    coverage: "3.45x Coverage",
    newCustomers: 26,
    custTarget: 20,
    custDelta: "+30.0%",
    margin: "30.1%",
    marginDelta: "+1.2%",
    forecastAcc: "96.0%",
    winRate: "35.2%",
    avgDeal: "₹5.90 L",
    score: 91,
    grade: "Grade S (Outstanding)",
  },
  "Sep 2026": {
    revenue: "₹0.42 Cr",
    target: "₹0.42 Cr",
    revDelta: "100.0%",
    isDeltaPos: true,
    pipeline: "₹2.80 Cr",
    coverage: "3.80x Coverage",
    newCustomers: 9,
    custTarget: 8,
    custDelta: "+12.5%",
    margin: "30.8%",
    marginDelta: "+2.1%",
    forecastAcc: "97.5%",
    winRate: "36.0%",
    avgDeal: "₹6.15 L",
    score: 94,
    grade: "Grade S (Record Month)",
  },
};

const monthlyPerformance = [
  { month: "Apr", actual: 28, target: 35, forecast: 30 },
  { month: "May", actual: 32, target: 35, forecast: 33 },
  { month: "Jun", actual: 36, target: 38, forecast: 35 },
  { month: "Jul", actual: 34, target: 38, forecast: 36 },
  { month: "Aug", actual: 40, target: 40, forecast: 39 },
  { month: "Sep", actual: 42, target: 42, forecast: 41 },
  { month: "Oct", actual: 0, target: 42, forecast: 44 },
  { month: "Nov", actual: 0, target: 45, forecast: 46 },
  { month: "Dec", actual: 0, target: 45, forecast: 48 },
  { month: "Jan", actual: 0, target: 45, forecast: 47 },
  { month: "Feb", actual: 0, target: 42, forecast: 45 },
  { month: "Mar", actual: 0, target: 43, forecast: 48 },
];

const productDistribution = [
  { name: "W-EVSE 7kW AC", value: 171, color: "#0A3C75", share: "45%" },
  { name: "W-EVSE 11kW AC", value: 114, color: "#22C55E", share: "30%" },
  { name: "DC Fast Charger 30kW", value: 57, color: "#0284C7", share: "15%" },
  { name: "Installation & AMC", value: 38, color: "#F59E0B", share: "10%" },
];

const pipelineStages = [
  { stage: "Leads Generated", count: 250, value: "₹28.4 Cr", drop: "44% conv." },
  { stage: "Qualified Opportunities", count: 140, value: "₹19.2 Cr", drop: "64% conv." },
  { stage: "Proposal & Technical Demo", count: 90, value: "₹13.2 Cr", drop: "61% conv." },
  { stage: "Commercial Negotiation", count: 55, value: "₹7.8 Cr", drop: "51% conv." },
  { stage: "Closed Won", count: 28, value: "₹3.8 Cr", drop: "Final" },
];

const territoryData = [
  { territory: "Tamil Nadu", region: "South", revenue: "₹1.82 Cr", target: "₹2.00 Cr", ach: "91.0%", growth: "+14.2%" },
  { territory: "Karnataka", region: "South", revenue: "₹0.95 Cr", target: "₹1.10 Cr", ach: "86.4%", growth: "+8.5%" },
  { territory: "Maharashtra", region: "West", revenue: "₹0.65 Cr", target: "₹0.85 Cr", ach: "76.5%", growth: "+12.1%" },
  { territory: "Telangana & AP", region: "South", revenue: "₹0.38 Cr", target: "₹0.55 Cr", ach: "69.1%", growth: "+5.4%" },
];

const channelData = [
  { channel: "Dealer Network", orders: 112, revenue: "₹1.52 Cr", contribution: "40.0%", margin: "26.5%" },
  { channel: "Direct Corporate", orders: 48, revenue: "₹1.14 Cr", contribution: "30.0%", margin: "31.2%" },
  { channel: "Distributors", orders: 64, revenue: "₹0.76 Cr", contribution: "20.0%", margin: "24.8%" },
  { channel: "Govt / GeM Portal", orders: 16, revenue: "₹0.38 Cr", contribution: "10.0%", margin: "34.0%" },
];

const topCustomers = [
  { name: "Apex Logistics Corridors", segment: "Inter-City Fleet CPO", revenue: "₹54.2 L", units: 38, status: "Active" },
  { name: "BlueDart EV Express Hubs", segment: "Express Logistics", revenue: "₹42.8 L", units: 30, status: "Active" },
  { name: "Zomato Hyperlocal Parks", segment: "Last-Mile Delivery Hubs", revenue: "₹31.5 L", units: 24, status: "Active" },
  { name: "KSRTC Electric Depot Phase-1", segment: "State Transit Undertaking", revenue: "₹28.0 L", units: 18, status: "Pending PO" },
];

export default function SalesAnalyticsComponent() {
  const [filterPeriod, setFilterPeriod] = useState("FY 2026-27");
  const [stepperStages, setStepperStages] = useState(initialStepperStages);
  const [version, setVersion] = useState("v2.1");
  const [analyticsStatus, setAnalyticsStatus] = useState("Live Intelligence");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  // Report Form
  const [reportConfig, setReportConfig] = useState({
    title: "Executive Board Sales & Margins Pack",
    format: "Executive PDF Dossier",
    includeForecast: true,
  });

  const periodData = analyticsPeriodDatasets[filterPeriod] || analyticsPeriodDatasets["FY 2026-27"];

  const handlePeriodChange = (val: string) => {
    setFilterPeriod(val);
    toast.info(`Analytics view updated for ${val}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Synchronized live telemetry from billing, pipeline stages, and distributor invoices.");
    }, 700);
  };

  const handleExport = () => {
    toast.success(`Exported complete Sales Analytics data (${filterPeriod}) to Excel workbook.`);
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportModalOpen(false);
    setStepperStages((prev) =>
      prev.map((s) => ({ ...s, status: "completed" as const }))
    );
    setAnalyticsStatus("Report Published (Executive Ready)");
    toast.success(`Generated "${reportConfig.title}" in ${reportConfig.format}! Insights published & download ready.`);
  };

  const handlePublishInsights = () => {
    setStepperStages((prev) =>
      prev.map((s) => ({ ...s, status: "completed" as const }))
    );
    setAnalyticsStatus("Insights Published (Audited)");
    setIsPublishOpen(false);
    toast.success("Sales Analytics Insights ratified & published to Executive Leadership Portal!");
  };

  return (
    <AppShell
      title="Sales Analytics"
      breadcrumb="Management > Sales Management > Sales Analytics"
      description="Turning Sales Data into Smarter Decisions — Comprehensive Revenue, Pipeline & Margin Intelligence"
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Action Header */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#0A3C75]/10 flex items-center justify-center text-[#0A3C75] shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Sales Analytics</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shrink-0">
                    {analyticsStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                    ANL-2026-09-01
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    {version}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  Turning Sales Data into Smarter Decisions — Comprehensive Revenue, Pipeline & Margin Intelligence
                </p>
              </div>
            </div>

            {/* Action Toolbar - Exactly 4 items in a single line */}
            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <div className="flex items-center gap-1.5 bg-slate-100 border border-border rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={filterPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="bg-transparent border-none focus:outline-none font-medium text-slate-800 cursor-pointer"
                >
                  <option value="FY 2026-27">FY 2026-27 (Apr 26 - Mar 27)</option>
                  <option value="H1 FY 2026-27">H1 FY 2026-27</option>
                  <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
                  <option value="Sep 2026">Sep 2026</option>
                </select>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition disabled:opacity-50 shrink-0 shadow-xs"
              >
                <RefreshCw className={cn("w-3.5 h-3.5 text-slate-500", isRefreshing && "animate-spin text-[#0A3C75]")} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer transition shrink-0 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" /> Export
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3C75] text-white hover:bg-[#082e5b] cursor-pointer shadow-xs transition shrink-0"
              >
                <FileText className="w-3.5 h-3.5" /> Generate Report
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-5 pt-4 border-t border-border/50 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[760px] px-2">
              {stepperStages.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors",
                        step.status === "completed"
                          ? "bg-emerald-600 text-white"
                          : step.status === "current"
                          ? "bg-[#0A3C75] text-white shadow-xs"
                          : "bg-slate-100 text-slate-500 border border-border"
                      )}
                    >
                      {step.status === "completed" ? "✓" : step.id}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-800 leading-tight">{step.title}</p>
                      <p
                        className={cn(
                          "text-[10px] font-medium leading-tight",
                          step.status === "completed"
                            ? "text-emerald-700"
                            : step.status === "current"
                            ? "text-[#0A3C75] font-semibold"
                            : "text-slate-400"
                        )}
                      >
                        {step.status === "completed" ? "Complete" : step.status === "current" ? "In Progress" : "Pending"}
                      </p>
                    </div>
                  </div>
                  {idx < stepperStages.length - 1 && (
                    <div className="h-[2px] w-8 sm:w-12 bg-slate-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7 KPI Executive Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* KPI 1 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-[#0A3C75]/40 transition">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-[#0A3C75]" />
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">{periodData.revenue}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Target: {periodData.target}</span>
              <span className={cn("font-semibold flex items-center", periodData.isDeltaPos ? "text-emerald-600" : "text-rose-600")}>
                {periodData.isDeltaPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {periodData.revDelta}
              </span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-[#0A3C75]/40 transition">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Sales Pipeline</span>
              <Layers className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">{periodData.pipeline}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>{periodData.coverage}</span>
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> High Quality
              </span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-[#0A3C75]/40 transition">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>New Customers</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">{periodData.newCustomers}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Target: {periodData.custTarget}</span>
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> {periodData.custDelta}
              </span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-[#0A3C75]/40 transition">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Gross Margin</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">{periodData.margin}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Target: 30.0%</span>
              <span className={cn("font-semibold flex items-center", periodData.marginDelta.startsWith("+") ? "text-emerald-600" : "text-amber-600")}>
                {periodData.marginDelta.startsWith("+") ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {periodData.marginDelta}
              </span>
            </div>
          </div>

          {/* KPI 5 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-[#0A3C75]/40 transition">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Forecast Accuracy</span>
              <Target className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">{periodData.forecastAcc}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Target: 90%</span>
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> Exceeding
              </span>
            </div>
          </div>

          {/* KPI 6 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-[#0A3C75]/40 transition">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Win Rate</span>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">{periodData.winRate}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Target: 35%</span>
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> Healthy
              </span>
            </div>
          </div>

          {/* KPI 7 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-[#0A3C75]/40 transition">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Avg Deal Size</span>
              <Briefcase className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">{periodData.avgDeal}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>QoQ Gain</span>
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +8.4%
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Charts, Funnels, Tables */}
            <div className="lg:col-span-8 space-y-6">
              {/* Composed Chart: Revenue vs Target vs Forecast */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#0A3C75]" />
                      Revenue Performance & Target Realization (₹ Lakhs)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Actual closed revenue against agreed sales target & forecast trajectory
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-3 bg-[#0A3C75] rounded-sm"></span> Actual
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-0.5 bg-amber-500 border border-amber-500"></span> Target
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-3 h-0.5 bg-emerald-500 border border-emerald-500"></span> Forecast
                    </span>
                  </div>
                </div>

                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748B" }} domain={[0, 60]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "12px",
                          border: "none",
                        }}
                      />
                      <Bar dataKey="actual" fill="#0A3C75" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="forecast" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sales Pipeline Funnel */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-600" />
                      Sales Pipeline Conversion Funnel
                    </h3>
                    <p className="text-xs text-slate-500">Opportunity velocity and stage gate attrition</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-sky-50 text-sky-700 rounded border border-sky-200">
                    Active Deals: 563
                  </span>
                </div>

                <div className="space-y-2.5">
                  {pipelineStages.map((st, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#0A3C75] text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{st.stage}</div>
                          <div className="text-[11px] text-slate-400">{st.drop}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xs font-semibold text-slate-700">{st.count} Deals</div>
                          <div className="text-[10px] text-slate-400">In Stage</div>
                        </div>
                        <div className="text-right min-w-[70px]">
                          <div className="text-xs font-bold text-[#0A3C75] tabular-nums">{st.value}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">Weighted Value</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column Grid: Territory & Channel Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Territory Performance */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0A3C75]" />
                      Territory Performance
                    </h4>
                    <span className="text-[11px] text-slate-400">South vs West</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-medium">
                        <th className="pb-2">Territory</th>
                        <th className="pb-2 text-right">Revenue</th>
                        <th className="pb-2 text-right">Ach.%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {territoryData.map((td, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 font-medium text-slate-800">
                            {td.territory}
                            <span className="block text-[10px] text-slate-400">{td.region}</span>
                          </td>
                          <td className="py-2 text-right font-bold text-slate-900 tabular-nums">{td.revenue}</td>
                          <td className="py-2 text-right">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {td.ach}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Channel Contribution */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      Channel Performance
                    </h4>
                    <span className="text-[11px] text-slate-400">FY 26-27</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-medium">
                        <th className="pb-2">Channel</th>
                        <th className="pb-2 text-right">Revenue</th>
                        <th className="pb-2 text-right">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {channelData.map((cd, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 font-medium text-slate-800">
                            {cd.channel}
                            <span className="block text-[10px] text-slate-400">{cd.orders} Orders</span>
                          </td>
                          <td className="py-2 text-right font-bold text-slate-900 tabular-nums">{cd.revenue}</td>
                          <td className="py-2 text-right font-semibold text-slate-600">{cd.contribution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Key Account Customers Table */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Top Enterprise Customers (YTD)
                  </h4>
                  <span className="text-[11px] text-[#0A3C75] font-semibold cursor-pointer hover:underline">
                    View All Customers
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                        <th className="p-2.5">Customer Name</th>
                        <th className="p-2.5">Segment</th>
                        <th className="p-2.5 text-center">Units Installed</th>
                        <th className="p-2.5 text-right">Billed Revenue</th>
                        <th className="p-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topCustomers.map((cust, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="p-2.5 font-bold text-slate-900">{cust.name}</td>
                          <td className="p-2.5 text-slate-600">{cust.segment}</td>
                          <td className="p-2.5 text-center tabular-nums font-semibold">{cust.units}</td>
                          <td className="p-2.5 text-right font-bold text-[#0A3C75] tabular-nums">{cust.revenue}</td>
                          <td className="p-2.5 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {cust.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Dimensions, Scorecard, Donut & AI Insights */}
            <div className="lg:col-span-4 space-y-6">

              {/* Product Revenue Donut */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <PieIcon className="w-3.5 h-3.5 text-[#0A3C75]" />
                    Revenue by Product Family
                  </h3>
                  <span className="text-[11px] font-bold text-slate-700">{periodData.revenue}</span>
                </div>
                <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {productDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-black text-slate-900">{periodData.revenue}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue</span>
                  </div>
                </div>
                <div className="space-y-1.5 mt-2">
                  {productDistribution.map((prod, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: prod.color }}></span>
                        <span className="text-slate-700">{prod.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{prod.share}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Sales Intelligence Insights */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    AI Commercial Insights
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full">
                    3 Actionable
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100 shadow-2xs">
                    <div className="font-bold text-slate-900">Upsell High-Power DC Fleet Dispensers to Apex Logistics</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Inter-city corridor throughput increased 42% across NH-44. Recommending proposal for 8x 60kW Dual-Gun DC Units.
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-700 font-semibold">+₹38.4L Potential</span>
                      <button
                        onClick={() => toast.success("Drafted proposal QUO-2026-092 for Apex Logistics Corridors (8x 60kW DC Fleet Dispensers @ ₹38.4L). Redirecting...")}
                        className="text-[#0A3C75] font-bold hover:underline cursor-pointer"
                      >
                        Draft Proposal &gt;
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100 shadow-2xs">
                    <div className="font-bold text-slate-900">Dealer Attrition Alert in Western Region</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Maharashtra dealer orders down 22% due to extended lead time. Prioritize buffer inventory in Pune warehouse.
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px]">
                      <span className="text-amber-700 font-semibold">High Priority</span>
                      <button
                        onClick={() => toast.success("Opened Pune Warehouse depot buffer inventory dashboard. 40 units assigned.")}
                        className="text-[#0A3C75] font-bold hover:underline cursor-pointer"
                      >
                        Review Inventory &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Report Download Links */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Related BI Reports</h4>
                <div className="space-y-1.5 text-xs">
                  <div
                    onClick={() => toast.success("Downloading Monthly Executive Pack (PDF)...")}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#0A3C75]" />
                      <span className="text-slate-700 font-medium">Monthly Executive Pack (PDF)</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div
                    onClick={() => toast.success("Downloading Territory Quota Scorecard (XLSX)...")}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#0A3C75]" />
                      <span className="text-slate-700 font-medium">Territory Quota Scorecard (XLSX)</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div
                    onClick={() => toast.success("Downloading Gross Margin Leakage Audit Report...")}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#0A3C75]" />
                      <span className="text-slate-700 font-medium">Gross Margin Leakage Audit</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Generate Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-[#0A3C75] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Generate Analytics BI Report</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={reportConfig.title}
                  onChange={(e) => setReportConfig({ ...reportConfig, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Export Format</label>
                <select
                  value={reportConfig.format}
                  onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C75]/20 focus:border-[#0A3C75]"
                >
                  <option>Executive PDF Dossier</option>
                  <option>Financial Model (Excel XLSX)</option>
                  <option>Board Deck Slides (PowerPoint PPTX)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Selected Period</label>
                <input
                  type="text"
                  readOnly
                  value={filterPeriod}
                  className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  id="includeForecast"
                  checked={reportConfig.includeForecast}
                  onChange={(e) => setReportConfig({ ...reportConfig, includeForecast: e.target.checked })}
                  className="rounded border-slate-300 text-[#0A3C75] focus:ring-[#0A3C75]"
                />
                <label htmlFor="includeForecast" className="cursor-pointer">
                  Include 12-Month Predictive Run-Rate & Anomaly Flags
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition shadow-sm cursor-pointer"
                >
                  Download Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Insights Modal */}
      {isPublishOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-[#0A3C75] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Publish Commercial Insights</h3>
              </div>
              <button
                onClick={() => setIsPublishOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed">
                You are about to ratify and publish the Sales Analytics intelligence pack for <strong>{filterPeriod}</strong> to the Executive Leadership Portal and Board Members.
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span>Revenue Analyzed:</span>
                  <span className="font-bold text-[#0A3C75]">{periodData.revenue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Forecast Accuracy:</span>
                  <span className="font-bold text-emerald-700">{periodData.forecastAcc}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pipeline Quality:</span>
                  <span className="font-bold text-slate-900">{periodData.pipeline} ({periodData.coverage})</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] leading-relaxed">
                Publishing advances the workflow to Stage 6 (Insights Published) and generates an immutable snapshot of all metrics.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPublishOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublishInsights}
                  className="px-4 py-2 text-xs font-bold bg-[#0A3C75] text-white rounded-lg hover:bg-[#0A3C75]/90 transition shadow-sm cursor-pointer"
                >
                  Publish & Broadcast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { toast } from "sonner";
import {
  TrendingUp,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Share2,
  ChevronRight,
  Calculator,
  RotateCcw,
  Zap,
  Target,
  Users,
  Check,
  Building2,
  AlertCircle,
  Clock,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/management/sales-management/sales-forecasting")({
  head: () => ({
    meta: [
      { title: "Sales Forecasting Form · Sales Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Sales Forecasting Form - MAICW Classification. Demand signals, consensus planning, AI-driven machine learning predictions, territory, product and channel level sales forecasting.",
      },
    ],
  }),
  component: SalesForecastingPage,
});

const REVENUE_TREND_DATA = [
  { month: "Apr", historical: 0.6, forecast: 0.8, actual: 0.82 },
  { month: "May", historical: 0.65, forecast: 0.9, actual: 0.95 },
  { month: "Jun", historical: 0.7, forecast: 1.0, actual: 1.05 },
  { month: "Jul", historical: 0.75, forecast: 1.1, actual: 1.15 },
  { month: "Aug", historical: 0.85, forecast: 1.2, actual: 1.25 },
  { month: "Sep", historical: 0.9, forecast: 1.3, actual: 1.35 },
  { month: "Oct", historical: 0.95, forecast: 1.35, actual: 1.4 },
  { month: "Nov", historical: 1.0, forecast: 1.4, actual: 1.45 },
  { month: "Dec", historical: 1.1, forecast: 1.5, actual: 1.5 },
  { month: "Jan", historical: 1.2, forecast: 1.55, actual: 1.6 },
  { month: "Feb", historical: 1.35, forecast: 1.65, actual: 1.7 },
  { month: "Mar", historical: 1.5, forecast: 1.8, actual: null },
];

const SALES_BY_PRODUCT_DATA = [
  { product: "W-EVSE 7kW", lastYear: 1.2, forecast: 1.9 },
  { product: "W-EVSE 11kW", lastYear: 0.8, forecast: 1.7 },
  { product: "Installation", lastYear: 0.3, forecast: 0.5 },
  { product: "AMC", lastYear: 0.2, forecast: 0.4 },
];

const TERRITORY_FORECAST_DATA = [
  { name: "Tamil Nadu", value: 45, color: "#2563EB" },
  { name: "Karnataka", value: 22, color: "#0EA5E9" },
  { name: "Kerala", value: 12, color: "#10B981" },
  { name: "Telangana", value: 10, color: "#8B5CF6" },
  { name: "Others", value: 11, color: "#F59E0B" },
];

const FORECAST_ACCURACY_DATA = [
  { quarter: "Q1", variance: 4, accuracy: 88 },
  { quarter: "Q2", variance: 5, accuracy: 91 },
  { quarter: "Q3", variance: -8, accuracy: 89 },
  { quarter: "Q4", variance: -3, accuracy: 92 },
];

const STEPPER_STAGES = [
  { id: 1, name: "Data Collection", status: "Complete" },
  { id: 2, name: "Forecast Generation", status: "Complete" },
  { id: 3, name: "Planner Adjustment", status: "In Progress" },
  { id: 4, name: "Consensus Review", status: "Pending" },
  { id: 5, name: "Approval", status: "Pending" },
  { id: 6, name: "Released", status: "Pending" },
  { id: 7, name: "Monitor & Reforecast", status: "Pending" },
];

const INITIAL_FORECAST_LINES = [
  { id: 1, product: "W-EVSE 7kW", territory: "Tamil Nadu", channel: "Direct", histSales: "₹1.20 Cr", pipeline: "₹80.0 L", aiForecast: "₹1.80 Cr", finalForecast: "₹1.88 Cr", confidence: "92%" },
  { id: 2, product: "W-EVSE 11kW", territory: "Tamil Nadu", channel: "Dealer", histSales: "₹80.0 L", pipeline: "₹70.0 L", aiForecast: "₹1.60 Cr", finalForecast: "₹1.70 Cr", confidence: "88%" },
  { id: 3, product: "Installation", territory: "Tamil Nadu", channel: "Direct", histSales: "₹30.0 L", pipeline: "₹20.0 L", aiForecast: "₹45.0 L", finalForecast: "₹50.0 L", confidence: "85%" },
  { id: 4, product: "AMC (3 Years)", territory: "Tamil Nadu", channel: "Dealer", histSales: "₹12.0 L", pipeline: "₹15.0 L", aiForecast: "₹35.0 L", finalForecast: "₹42.0 L", confidence: "80%" },
];

function SalesForecastingPage() {
  const [status, setStatus] = useState<"In Review" | "Approved" | "Released">("In Review");
  const [stages, setStages] = useState(STEPPER_STAGES);
  const [lines, setLines] = useState(INITIAL_FORECAST_LINES);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");
  const [isAddLineOpen, setIsAddLineOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [newLine, setNewLine] = useState({
    product: "W-EVSE 22kW Fast Charger",
    territory: "Karnataka",
    channel: "Direct",
    histSales: "₹40.0 L",
    pipeline: "₹65.0 L",
    aiForecast: "₹95.0 L",
    finalForecast: "₹1.05 Cr",
    confidence: "89%",
  });

  const handleCalculateForecast = () => {
    setLines((prev) =>
      prev.map((l) => ({
        ...l,
        finalForecast: l.finalForecast.includes("Cr")
          ? `₹${(parseFloat(l.finalForecast.replace(/[^0-9.]/g, "")) * 1.05).toFixed(2)} Cr`
          : `₹${(parseFloat(l.finalForecast.replace(/[^0-9.]/g, "")) * 1.05).toFixed(1)} L`,
      }))
    );
    toast.success("Consensus forecast recalculated with dynamic 5% upside adjustment!");
  };

  const handleRunAIForecast = () => {
    setLines((prev) =>
      prev.map((l) => ({
        ...l,
        aiForecast: l.aiForecast.includes("Cr")
          ? `₹${(parseFloat(l.aiForecast.replace(/[^0-9.]/g, "")) * 1.08).toFixed(2)} Cr`
          : `₹${(parseFloat(l.aiForecast.replace(/[^0-9.]/g, "")) * 1.08).toFixed(1)} L`,
        confidence: "94%",
      }))
    );
    toast.success("AI Neural Forecasting model executed across all active lines!");
  };

  const handleAddLine = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      ...newLine,
    };
    setLines((prev) => [item, ...prev]);
    setIsAddLineOpen(false);
    toast.success(`Added ${newLine.product} to forecast schedule!`);
  };

  const handleDeleteLine = (id: number) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
    toast.info("Forecast line removed.");
  };

  const confirmApproval = () => {
    setStatus("Approved");
    setStages((prev) =>
      prev.map((s) =>
        s.id === 4 ? { ...s, status: "Complete" } : s.id === 5 ? { ...s, status: "Complete" } : s
      )
    );
    setIsApprovalOpen(false);
    toast.success("Forecast SF-2026-09-001 approved by Commercial Review Board!");
  };

  const filteredLines = lines.filter((l) => {
    const matchesSearch =
      l.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.territory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = channelFilter === "All" || l.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <AppShell
      title="Sales Forecasting"
      breadcrumb="Management > Sales Management > Sales Forecasting"
      description="The Sales Forecasting Form converts historical sales, demand signals, pipeline, and AI machine-learning algorithms into high-accuracy revenue and unit predictions."
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Action Header */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Sales Forecasting</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                  {status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  SF-2026-09-001
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  v1.2
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Predict Today. Power Tomorrow.</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <button
                onClick={() => toast.success("Forecast draft saved to ERP database.")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" /> Save Draft
              </button>
              <button
                onClick={handleCalculateForecast}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                <Calculator className="h-3.5 w-3.5" /> Calculate Forecast
              </button>
              <button
                onClick={() => setIsApprovalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Submit for Approval
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-5 pt-4 border-t border-border/50 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[760px] px-2">
              {stages.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        step.status === "Complete"
                          ? "bg-emerald-600 text-white"
                          : step.status === "In Progress"
                            ? "bg-primary text-white shadow-xs"
                            : "bg-slate-100 text-slate-500 border border-border"
                      }`}
                    >
                      {step.status === "Complete" ? "✓" : step.id}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-800 leading-tight">{step.name}</p>
                      <p
                        className={`text-[10px] font-medium leading-tight ${
                          step.status === "Complete"
                            ? "text-emerald-700"
                            : step.status === "In Progress"
                              ? "text-primary font-semibold"
                              : "text-slate-400"
                        }`}
                      >
                        {step.status}
                      </p>
                    </div>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className="h-[2px] w-8 sm:w-12 bg-slate-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
            {/* Row 1: Header + Dimensions + Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Forecast Header (6 cols) */}
              <div className="lg:col-span-6 bg-white border border-border/80 rounded-xl p-4 shadow-xs">
                <h3 className="text-sm font-bold font-display text-slate-900 pb-2.5 border-b border-border/60">
                  Forecast Header
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Forecast No. *</label>
                    <input
                      type="text"
                      disabled
                      value="SF-2026-09-001"
                      className="w-full text-xs font-mono font-medium p-1.5 bg-slate-50 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Forecast Period</label>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue="Apr-2026 to Mar-2027"
                        className="w-full text-xs font-medium p-1.5 border rounded-lg pr-6"
                      />
                      <Calendar className="h-3 w-3 text-muted-foreground absolute right-2 top-2.5" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Financial Year</label>
                    <select defaultValue="FY 2026-27" className="w-full text-xs font-medium p-1.5 border rounded-lg">
                      <option>FY 2026-27</option>
                      <option>FY 2025-26</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Forecast Type</label>
                    <select defaultValue="Revenue Forecast" className="w-full text-xs font-medium p-1.5 border rounded-lg">
                      <option>Revenue Forecast</option>
                      <option>Unit Forecast</option>
                      <option>Product Forecast</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Version</label>
                    <input type="text" disabled value="1.2" className="w-full text-xs font-mono p-1.5 bg-slate-50 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Confidence</label>
                    <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-full justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      88%
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Forecast Method</label>
                    <select defaultValue="AI / ML Forecast" className="w-full text-xs font-medium p-1.5 border rounded-lg">
                      <option>AI / ML Forecast</option>
                      <option>Historical Trend</option>
                      <option>Moving Average</option>
                      <option>Opportunity-Based</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Planner</label>
                    <input type="text" defaultValue="Arun Kumar" className="w-full text-xs font-medium p-1.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Status</label>
                    <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 w-full justify-center">
                      In Review
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter & Dimension Selection (3 cols) */}
              <div className="lg:col-span-3 bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h3 className="text-sm font-bold font-display text-slate-900">Filter & Dimension Selection</h3>
                    <button onClick={() => toast.info("Filters reset.")} className="text-[11px] text-muted-foreground hover:text-slate-800">
                      Reset
                    </button>
                  </div>
                  <div className="space-y-2 mt-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">Product Family</span>
                      <p className="font-semibold text-slate-800">EV Charging Systems</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">Region / Territory</span>
                      <p className="font-semibold text-slate-800">South / Tamil Nadu</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">Channel</span>
                      <p className="font-semibold text-slate-800">Direct Sales</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">Customer Segment</span>
                      <p className="font-semibold text-slate-800">Enterprise</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toast.info("Opening advanced dimension filter...")}
                  className="text-primary text-xs font-semibold text-center hover:underline pt-2 border-t border-border"
                >
                  Advanced Filters ▽
                </button>
              </div>

              {/* Forecast Summary (3 cols) */}
              <div className="lg:col-span-3 bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <h3 className="text-sm font-bold font-display text-slate-900 pb-2 border-b border-border/60">
                  Forecast Summary (FY 2026-27)
                </h3>
                <div className="space-y-3 mt-2">
                  <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Forecast Revenue</p>
                      <p className="text-base font-bold text-slate-900 tabular">₹4.50 Cr</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">↑ 18% YoY</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Forecast Units</p>
                      <p className="text-base font-bold text-slate-900 tabular">295 Units</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">↑ 22%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted-foreground">New Customers</p>
                      <p className="text-base font-bold text-slate-900 tabular">90 Accounts</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">↑ 25%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Confidence Score:</span>
                  <span className="font-bold text-emerald-600">88% (High)</span>
                </div>
              </div>
            </div>

            {/* Row 2: Charts (Trend + Product vs Last Year + Territory Donut) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Revenue Forecast Trend (5 cols) */}
              <div className="md:col-span-5 bg-white border border-border/80 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900">Revenue Forecast Trend</h3>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="h-2 w-2 rounded-xs bg-blue-500" /> Historical
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Forecast
                    </span>
                  </div>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={REVENUE_TREND_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}Cr`} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                      <Bar dataKey="historical" fill="#93C5FD" radius={[2, 2, 0, 0]} />
                      <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="actual" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sales by Product (Forecast vs Last Year) (3 cols) */}
              <div className="md:col-span-3 bg-white border border-border/80 rounded-xl p-4 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 mb-2">Sales by Product (Forecast vs Last Year)</h3>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SALES_BY_PRODUCT_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="product" tick={{ fontSize: 8 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                      <Bar dataKey="lastYear" fill="#93C5FD" name="FY 2025-26" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="forecast" fill="#1D4ED8" name="FY 2026-27 (Forecast)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sales by Territory (Forecast) (4 cols) */}
              <div className="md:col-span-4 bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Sales by Territory (Forecast)</h3>
                  <div className="relative h-32 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={TERRITORY_FORECAST_DATA}
                          innerRadius={32}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {TERRITORY_FORECAST_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value}%`, "Share"]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold font-display text-slate-900">₹4.50 Cr</span>
                      <span className="text-[9px] text-muted-foreground font-medium">Total</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-[10px]">
                  {TERRITORY_FORECAST_DATA.map((t) => (
                    <div key={t.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-600 truncate">
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                        {t.name}
                      </span>
                      <span className="font-bold text-slate-800 tabular">{t.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Forecast Details Table + Demand Signals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Forecast Details Table (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-border/80 rounded-xl p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 mb-3 border-b border-border/60 gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">Forecast Details (MAICW Section 11)</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                      {filteredLines.length} Lines
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs pl-7 pr-2 py-1 rounded-lg border border-slate-300 w-36 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2 top-2" />
                    </div>

                    {/* Channel filter */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px]">
                      {["All", "Direct", "Dealer"].map((ch) => (
                        <button
                          key={ch}
                          onClick={() => setChannelFilter(ch)}
                          className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                            channelFilter === ch ? "bg-white text-primary shadow-xs" : "text-slate-600"
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setIsAddLineOpen(true)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="h-3 w-3" /> Add Line
                    </button>
                    <button
                      onClick={handleRunAIForecast}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3" /> AI Suggest
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b bg-slate-50 text-[10px] uppercase font-semibold text-muted-foreground">
                        <th className="py-2 px-2.5">Product</th>
                        <th className="py-2 px-2">Territory</th>
                        <th className="py-2 px-2">Channel</th>
                        <th className="py-2 px-2 text-right">Hist. Sales</th>
                        <th className="py-2 px-2 text-right">Pipeline</th>
                        <th className="py-2 px-2 text-right">AI Forecast</th>
                        <th className="py-2 px-2 text-right font-bold text-slate-900">Final Forecast</th>
                        <th className="py-2 px-2 text-center">Confidence</th>
                        <th className="py-2 px-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredLines.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2 px-2.5 font-semibold text-slate-900">{row.product}</td>
                          <td className="py-2 px-2 text-slate-600">{row.territory}</td>
                          <td className="py-2 px-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                              {row.channel}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right tabular text-slate-600">{row.histSales}</td>
                          <td className="py-2 px-2 text-right tabular text-slate-600">{row.pipeline}</td>
                          <td className="py-2 px-2 text-right font-medium text-blue-600 tabular">{row.aiForecast}</td>
                          <td className="py-2 px-2 text-right font-bold text-slate-900 tabular">{row.finalForecast}</td>
                          <td className="py-2 px-2 text-center">
                            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px]">
                              {row.confidence}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              onClick={() => handleDeleteLine(row.id)}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
                              title="Delete line"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Demand Signals & Actions (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <div className="bg-white border border-border/80 rounded-xl p-3.5 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 pb-1.5 border-b border-border/60 mb-2">Demand Signals</h4>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Historical Sales</span>
                      <span className="font-semibold text-emerald-600">↑ Strong growth (+18%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Open Orders</span>
                      <span className="font-semibold text-slate-800">₹0.80 Cr (18% of forecast)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CRM Pipeline</span>
                      <span className="font-semibold text-slate-800">₹1.39 Cr (Weighted)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Customer Forecasts</span>
                      <span className="font-semibold text-slate-800">₹0.90 Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Seasonality</span>
                      <span className="font-semibold text-blue-600">↑ Q3 higher demand (+12%)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-border/80 rounded-xl p-3.5 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 pb-1.5 border-b border-border/60 mb-2">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setIsAddLineOpen(true)}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-left font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      + Add New SKU Line
                    </button>
                    <button
                      onClick={handleRunAIForecast}
                      className="p-2 rounded-lg border border-primary/20 bg-primary/10 text-primary text-left font-semibold hover:bg-primary/20 cursor-pointer"
                    >
                      ⚡ Run AI Forecast
                    </button>
                    <button
                      onClick={() => toast.success("Imported 12 customer commitments from CRM!")}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-left font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      📥 Import CRM FC
                    </button>
                    <button
                      onClick={() => toast.success("Exporting Forecast SF-2026-09-001 to XLSX...")}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-left font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      📊 Export to Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Forecast vs Target + Accuracy + AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Forecast vs Target Table (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-border/80 rounded-xl p-4 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 pb-1.5 border-b border-border/60 mb-2">
                  Forecast vs Target (MAICW Section 20)
                </h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b text-[10px] uppercase font-semibold text-muted-foreground">
                      <th className="py-1">Period</th>
                      <th className="py-1 text-right">Forecast (₹)</th>
                      <th className="py-1 text-right">Target (₹)</th>
                      <th className="py-1 text-right">Achievement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-1 font-medium">Q1</td>
                      <td className="py-1 text-right tabular font-semibold">85,00,000</td>
                      <td className="py-1 text-right tabular text-muted-foreground">85,00,000</td>
                      <td className="py-1 text-right text-emerald-600 font-bold">100%</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Q2</td>
                      <td className="py-1 text-right tabular font-semibold">1,05,00,000</td>
                      <td className="py-1 text-right tabular text-muted-foreground">1,00,00,000</td>
                      <td className="py-1 text-right text-emerald-600 font-bold">105%</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Q3</td>
                      <td className="py-1 text-right tabular font-semibold">1,15,00,000</td>
                      <td className="py-1 text-right tabular text-muted-foreground">1,25,00,000</td>
                      <td className="py-1 text-right text-rose-600 font-bold">92%</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Q4</td>
                      <td className="py-1 text-right tabular font-semibold">1,45,00,000</td>
                      <td className="py-1 text-right tabular text-muted-foreground">1,50,00,000</td>
                      <td className="py-1 text-right text-amber-600 font-bold">97%</td>
                    </tr>
                    <tr className="font-bold text-primary bg-primary/5">
                      <td className="py-1">Annual</td>
                      <td className="py-1 text-right tabular">4,50,00,000</td>
                      <td className="py-1 text-right tabular">4,50,00,000</td>
                      <td className="py-1 text-right font-bold">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Forecast Accuracy (3 cols) */}
              <div className="lg:col-span-3 bg-white border border-border/80 rounded-xl p-4 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 pb-1.5 border-b border-border/60 mb-2">
                  Forecast Accuracy (Last 4 Quarters)
                </h3>
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={FORECAST_ACCURACY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="quarter" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                      <Bar dataKey="variance" fill="#60A5FA" radius={[2, 2, 0, 0]} name="Variance %" />
                      <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} name="Accuracy %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insights (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/60 mb-2">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Insights
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">AI Powered</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-700">
                    <p>🟢 Forecast is 8% higher than last year.</p>
                    <p>🔵 Strong demand in Tamil Nadu (45% of total).</p>
                    <p>🟠 W-EVSE 11kW showing accelerated growth.</p>
                    <p>🟣 Q3 seasonality expected (+12%).</p>
                    <p>🟣 Recommended to increase inventory by 20%.</p>
                    <p>🟢 Pipeline conversion expected at 82%.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* Modal: Add Forecast Line */}
        {isAddLineOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  Add Forecast Line Item
                </h3>
                <button onClick={() => setIsAddLineOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAddLine} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Product / SKU Name *</label>
                  <input
                    type="text"
                    required
                    value={newLine.product}
                    onChange={(e) => setNewLine({ ...newLine, product: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Territory *</label>
                    <select
                      value={newLine.territory}
                      onChange={(e) => setNewLine({ ...newLine, territory: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    >
                      <option>Tamil Nadu</option>
                      <option>Karnataka</option>
                      <option>Kerala</option>
                      <option>Telangana</option>
                      <option>Maharashtra</option>
                      <option>Delhi NCR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Sales Channel *</label>
                    <select
                      value={newLine.channel}
                      onChange={(e) => setNewLine({ ...newLine, channel: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    >
                      <option>Direct</option>
                      <option>Dealer</option>
                      <option>Distributor</option>
                      <option>Government</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Historical Sales</label>
                    <input
                      type="text"
                      value={newLine.histSales}
                      onChange={(e) => setNewLine({ ...newLine, histSales: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">CRM Pipeline Value</label>
                    <input
                      type="text"
                      value={newLine.pipeline}
                      onChange={(e) => setNewLine({ ...newLine, pipeline: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">AI Machine Forecast</label>
                    <input
                      type="text"
                      value={newLine.aiForecast}
                      onChange={(e) => setNewLine({ ...newLine, aiForecast: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Final Consensus Target</label>
                    <input
                      type="text"
                      value={newLine.finalForecast}
                      onChange={(e) => setNewLine({ ...newLine, finalForecast: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsAddLineOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
                  >
                    Add to Forecast
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Submit Approval */}
        {isApprovalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-bold text-sm text-slate-900">Approve Sales Forecast</h3>
                <button onClick={() => setIsApprovalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Are you sure you want to approve and lock Sales Forecast <span className="font-bold font-mono text-primary">SF-2026-09-001</span>? This will advance consensus targets to active execution status.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <p className="font-semibold text-slate-800">Forecast Metrics:</p>
                <p className="text-muted-foreground">• Consolidated Revenue: ₹4.50 Cr</p>
                <p className="text-muted-foreground">• Total Units: 295 Chargers</p>
                <p className="text-muted-foreground">• Confidence Score: 88%</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsApprovalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproval}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
                >
                  Confirm & Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { toast } from "sonner";
import {
  TrendingUp,
  Save,
  CheckCircle2,
  MoreHorizontal,
  Calendar,
  Edit,
  TrendingDown,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Building2,
  Users,
  Target,
  Zap,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Send,
  FileText,
  FileSpreadsheet,
  Download,
  Share2,
  Copy,
  RotateCcw,
  Check,
  X,
  Plus,
  Layers,
  RefreshCw,
  ExternalLink,
  Compass,
  DollarSign,
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
  Legend,
} from "recharts";

export const Route = createFileRoute("/management/sales-management/sales-planning")({
  head: () => ({
    meta: [
      { title: "Sales Planning Form · Sales Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Sales Planning Form — MAICW Classification. Executive sales planning, demand forecasting, multi-dimension target setting, territory & channel allocation, budget management, and AI intelligence.",
      },
    ],
  }),
  component: SalesPlanningPage,
});

// Chart Data
const FORECAST_VS_TARGET_DATA = [
  { month: "Apr", forecast: 2.8, target: 3.5 },
  { month: "May", forecast: 3.2, target: 3.8 },
  { month: "Jun", forecast: 3.6, target: 4.0 },
  { month: "Jul", forecast: 4.0, target: 4.2 },
  { month: "Aug", forecast: 4.3, target: 4.5 },
  { month: "Sep", forecast: 4.5, target: 4.8 },
  { month: "Oct", forecast: 4.7, target: 4.8 },
  { month: "Nov", forecast: 4.3, target: 4.2 },
  { month: "Dec", forecast: 4.4, target: 4.0 },
  { month: "Jan", forecast: 4.8, target: 4.2 },
  { month: "Feb", forecast: 5.2, target: 4.5 },
  { month: "Mar", forecast: 6.8, target: 5.5 },
];

const CHANNEL_REVENUE_DATA = [
  { name: "Direct Sales", value: 35, color: "#0A3C75" },
  { name: "Dealer", value: 25, color: "#2563EB" },
  { name: "Distributor", value: 20, color: "#0EA5E9" },
  { name: "GeM / Govt.", value: 15, color: "#F59E0B" },
  { name: "Export", value: 5, color: "#8B5CF6" },
];

const PRODUCT_WISE_TARGETS = [
  { product: "Autonomous W-EVSE 7kW", target: 22.0, color: "#2563EB" },
  { product: "Autonomous W-EVSE 11kW", target: 18.0, color: "#10B981" },
  { product: "Accessories", target: 6.0, color: "#F97316" },
  { product: "Spare Parts", target: 4.0, color: "#EF4444" },
];

const MONTHLY_SALES_PLAN = [
  { month: "Apr", revenue: 3.5, units: 260, newCust: 15, margin: 28 },
  { month: "May", revenue: 3.8, units: 280, newCust: 16, margin: 28 },
  { month: "Jun", revenue: 4.0, units: 300, newCust: 17, margin: 29 },
  { month: "Jul", revenue: 4.2, units: 320, newCust: 18, margin: 30 },
  { month: "Aug", revenue: 4.5, units: 340, newCust: 18, margin: 30 },
  { month: "Sep", revenue: 4.8, units: 360, newCust: 19, margin: 30 },
  { month: "Oct", revenue: 4.8, units: 360, newCust: 20, margin: 31 },
  { month: "Nov", revenue: 4.2, units: 320, newCust: 18, margin: 30 },
  { month: "Dec", revenue: 4.0, units: 300, newCust: 17, margin: 29 },
  { month: "Jan", revenue: 4.2, units: 320, newCust: 17, margin: 29 },
  { month: "Feb", revenue: 4.5, units: 340, newCust: 17, margin: 29 },
  { month: "Mar", revenue: 5.5, units: 420, newCust: 26, margin: 30 },
];

const TOP_CUSTOMERS = [
  { id: 1, name: "NTPC", segment: "Enterprise", target: 8.0, growth: 50 },
  { id: 2, name: "TANGEDCO", segment: "Government", target: 6.5, growth: 45 },
  { id: 3, name: "Ather Energy", segment: "Enterprise", target: 4.0, growth: 40 },
  { id: 4, name: "Tata Power", segment: "Enterprise", target: 3.5, growth: 35 },
  { id: 5, name: "Adani Energy", segment: "Enterprise", target: 3.0, growth: 30 },
  { id: 6, name: "Reliance", segment: "Enterprise", target: 2.5, growth: 30 },
  { id: 7, name: "State Transport", segment: "Government", target: 2.0, growth: 25 },
  { id: 8, name: "CLA Electric", segment: "Enterprise", target: 1.8, growth: 35 },
  { id: 9, name: "ChargeZone", segment: "Dealer", target: 1.5, growth: 30 },
  { id: 10, name: "Others", segment: "Various", target: 15.2, growth: 30 },
];

const SALES_BUDGET = [
  { head: "Sales Personnel", amount: 800 },
  { head: "Travel & Field", amount: 300 },
  { head: "Dealer Incentives", amount: 400 },
  { head: "Sales Commission", amount: 500 },
  { head: "Marketing & Events", amount: 300 },
  { head: "Digital Lead Generation", amount: 200 },
  { head: "Demonstration Units", amount: 200 },
  { head: "Miscellaneous", amount: 200 },
];

const STEPPER_STAGES = [
  { id: 1, name: "Data & Analysis", status: "Complete" },
  { id: 2, name: "Plan & Targets", status: "In Progress" },
  { id: 3, name: "Review", status: "Pending" },
  { id: 4, name: "Approval", status: "Pending" },
  { id: 5, name: "Release", status: "Pending" },
  { id: 6, name: "Monitor", status: "Pending" },
];

export default function SalesPlanningPage() {
  const [planStatus, setPlanStatus] = useState<"Draft" | "Review" | "Approved" | "Released">("Draft");
  const [isEditObjectivesOpen, setIsEditObjectivesOpen] = useState(false);
  const [isEditScopeOpen, setIsEditScopeOpen] = useState(false);
  const [isSubmitApprovalOpen, setIsSubmitApprovalOpen] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);

  // Objectives State
  const [objectives, setObjectives] = useState({
    businessObjective: "Expand market presence in EV charging infrastructure.",
    salesObjective: "Achieve ₹50 Cr revenue with 40% growth.",
    revenueObjective: "₹50,00,00,000",
    growthObjective: "40%",
    marketShareObjective: "10%",
    customerAcquisition: "200",
    newProductRevenue: "₹15,00,00,000",
    strategicPriorities: "Govt. tenders, enterprise sales, dealer network, exports.",
  });

  const handleSaveDraft = () => {
    toast.success("Sales Plan SP-2026-2027-001 draft saved successfully!");
  };

  const handleSubmitForApproval = () => {
    setIsSubmitApprovalOpen(true);
  };

  const confirmApprovalSubmission = () => {
    setPlanStatus("Review");
    setIsSubmitApprovalOpen(false);
    toast.success("Sales Plan SP-2026-2027-001 submitted to Sales Review Board!");
  };

  return (
    <AppShell
      title="Sales Planning"
      breadcrumb="Management > Sales Management > Sales Planning"
      description="The Sales Planning Form is the central ERP transaction for converting business strategy, market opportunity, historical sales, demand forecasts, and quotas into an executable sales plan."
      tabs={<SalesManagementTabBar />}
    >
      <div className="flex flex-col min-h-screen space-y-4 pb-12">
        {/* Top Header Card */}
        <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">Sales Planning</h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {planStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                    SP-2026-2027-001
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Plan. Forecast. Allocate. Achieve.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
              <span className="text-xs font-semibold text-muted-foreground mr-2">Version V1.0</span>
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save Draft
              </button>
              <button
                onClick={handleSubmitForApproval}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Submit for Approval
              </button>
              <div className="relative">
                <button
                  onClick={() => setMoreActionsOpen(!moreActionsOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-slate-700 hover:bg-muted transition-colors cursor-pointer"
                >
                  More Actions
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${moreActionsOpen ? "rotate-90" : ""}`} />
                </button>
                {moreActionsOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-border rounded-xl shadow-lg py-1.5 z-20 text-xs text-slate-700">
                    <button
                      onClick={() => {
                        toast.info("Exporting Sales Plan to PDF...");
                        setMoreActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-red-500" /> Export PDF
                    </button>
                    <button
                      onClick={() => {
                        toast.info("Exporting Sales Plan to Excel...");
                        setMoreActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2 cursor-pointer"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Export Excel
                    </button>
                    <button
                      onClick={() => {
                        toast.info("Re-forecasting plan with AI Engine...");
                        setMoreActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Re-forecast
                    </button>
                    <button
                      onClick={() => {
                        toast.info("Audit trail opened.");
                        setMoreActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2 cursor-pointer"
                    >
                      <Clock className="h-3.5 w-3.5 text-slate-500" /> View Audit Trail
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-5 pt-4 border-t border-border/50 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[720px] px-2">
              {STEPPER_STAGES.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
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
                  {idx < STEPPER_STAGES.length - 1 && (
                    <div className="h-[2px] w-12 sm:w-16 bg-slate-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 1: Plan Details */}
        <div className="space-y-4">
            {/* Row 1a: Sales Plan Header (Full Width, Zero Blank Space) */}
            <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                      Sales Plan Header
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        MAICW Core
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    MAICW Classified
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mt-3.5">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Sales Plan Number <span className="text-primary font-mono text-[10px]">[A]</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value="SP-2026-2027-001"
                    className="w-full text-xs font-mono font-medium px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Planning Period <span className="text-rose-500">*</span> <span className="text-primary font-mono text-[10px]">[M]</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="01-Apr-2026 - 31-Mar-2027"
                      className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 pr-8 focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground absolute right-2.5 top-2" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Planning Horizon <span className="text-rose-500">*</span> <span className="text-primary font-mono text-[10px]">[M]</span>
                  </label>
                  <select defaultValue="Annual" className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 focus:ring-1 focus:ring-primary focus:border-primary">
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annual</option>
                    <option>Strategic (3-Yr)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Plan Type <span className="text-rose-500">*</span> <span className="text-primary font-mono text-[10px]">[M]</span>
                  </label>
                  <select defaultValue="Annual" className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 focus:ring-1 focus:ring-primary focus:border-primary">
                    <option>Annual</option>
                    <option>Quarterly</option>
                    <option>Regional</option>
                    <option>Product Specific</option>
                    <option>Channel Focused</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Organization <span className="text-rose-500">*</span> <span className="text-primary font-mono text-[10px]">[M]</span>
                  </label>
                  <select defaultValue="Magnertia Pvt. Ltd." className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 focus:ring-1 focus:ring-primary focus:border-primary">
                    <option>Magnertia Pvt. Ltd.</option>
                    <option>Magnertia Energy Corp</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Business Unit <span className="text-rose-500">*</span> <span className="text-primary font-mono text-[10px]">[M]</span>
                  </label>
                  <select defaultValue="EV Charging Solutions" className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 focus:ring-1 focus:ring-primary focus:border-primary">
                    <option>EV Charging Solutions</option>
                    <option>Industrial Power</option>
                    <option>Grid Systems</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Plant / Site <span className="text-primary font-mono text-[10px]">[C]</span>
                  </label>
                  <select defaultValue="Chennai Plant" className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 focus:ring-1 focus:ring-primary focus:border-primary">
                    <option>Chennai Plant</option>
                    <option>Coimbatore Hub</option>
                    <option>Bengaluru Site</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Sales Manager <span className="text-rose-500">*</span> <span className="text-primary font-mono text-[10px]">[M]</span>
                  </label>
                  <select defaultValue="Arun Kumar" className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 focus:ring-1 focus:ring-primary focus:border-primary">
                    <option>Arun Kumar</option>
                    <option>Ramesh Iyer</option>
                    <option>Kavita Shah</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Sales Director <span className="text-primary font-mono text-[10px]">[C]</span>
                  </label>
                  <select defaultValue="Priya S" className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-800 focus:ring-1 focus:ring-primary focus:border-primary">
                    <option>Priya S</option>
                    <option>Vikram Verma</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Version <span className="text-primary font-mono text-[10px]">[A]</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value="V1.0"
                    className="w-full text-xs font-mono font-medium px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Priority <span className="text-rose-500">*</span> <span className="text-primary font-mono text-[10px]">[M]</span>
                  </label>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 w-full justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                    High Priority
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Status <span className="text-primary font-mono text-[10px]">[W]</span>
                  </label>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 w-full justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    {planStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 1b: Balanced 2-Col Grid for Objectives & Scope */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Sales Planning Objective */}
              <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                    <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Sales Planning Objective
                    </h3>
                    <button
                      onClick={() => setIsEditObjectivesOpen(true)}
                      className="text-xs text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center gap-2 py-1 px-1.5 rounded-md hover:bg-slate-50 transition-colors">
                      <span className="text-muted-foreground shrink-0 font-medium">Business Objective</span>
                      <span className="text-slate-800 text-right font-medium truncate">{objectives.businessObjective}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 py-1 px-1.5 rounded-md hover:bg-slate-50 transition-colors">
                      <span className="text-muted-foreground shrink-0 font-medium">Sales Objective</span>
                      <span className="text-slate-800 text-right font-medium truncate">{objectives.salesObjective}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 py-1 px-1.5 rounded-md hover:bg-slate-50 transition-colors">
                      <span className="text-muted-foreground shrink-0 font-medium">Revenue Objective</span>
                      <span className="text-primary font-bold tabular">{objectives.revenueObjective}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 py-1 px-1.5 rounded-md hover:bg-slate-50 transition-colors">
                      <span className="text-muted-foreground shrink-0 font-medium">Growth Objective</span>
                      <span className="text-emerald-600 font-bold tabular">+{objectives.growthObjective} YoY</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 py-1 px-1.5 rounded-md hover:bg-slate-50 transition-colors">
                      <span className="text-muted-foreground shrink-0 font-medium">Market Share Objective</span>
                      <span className="text-slate-800 font-bold tabular">{objectives.marketShareObjective} Share</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 py-1 px-1.5 rounded-md hover:bg-slate-50 transition-colors">
                      <span className="text-muted-foreground shrink-0 font-medium">Customer Acquisition</span>
                      <span className="text-slate-800 font-bold tabular">{objectives.customerAcquisition} New Accounts</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 py-1 px-1.5 rounded-md hover:bg-slate-50 transition-colors">
                      <span className="text-muted-foreground shrink-0 font-medium">New Product Revenue</span>
                      <span className="text-slate-800 font-bold tabular">{objectives.newProductRevenue}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 pt-2 border-t border-dashed border-border/80 px-1.5">
                      <span className="text-muted-foreground shrink-0 font-medium">Strategic Priorities</span>
                      <span className="text-slate-700 text-right text-[11px] font-medium">{objectives.strategicPriorities}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Planning Scope */}
              <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                    <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Planning Scope
                    </h3>
                    <button
                      onClick={() => setIsEditScopeOpen(true)}
                      className="text-xs text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Products Scope</p>
                      <p className="font-semibold text-slate-800 text-[11px] mt-0.5">All EVSE Products</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Customer Segment</p>
                      <p className="font-semibold text-slate-800 text-[11px] mt-0.5">Enterprise, Government, CPO</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Region Coverage</p>
                      <p className="font-semibold text-slate-800 text-[11px] mt-0.5">Pan-India (5 Regions)</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Sales Teams</p>
                      <p className="font-semibold text-slate-800 text-[11px] mt-0.5">All Field & Key Accounts</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Territory Matrix</p>
                      <p className="font-semibold text-slate-800 text-[11px] mt-0.5">North, South, West, East, Central</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Product Family</p>
                      <p className="font-semibold text-slate-800 text-[11px] mt-0.5">EV Charging Systems (AC/DC)</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Channel Strategy</p>
                      <p className="font-semibold text-slate-800 text-[11px] mt-0.5">Direct (50%), Dealer, GeM</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">SKU Level</p>
                      <p className="font-semibold text-slate-800 text-[11px] mt-0.5">Active & New Rollouts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Key Targets (FY 2026-27) */}
            <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h3 className="text-sm font-bold font-display text-slate-900">Key Targets (FY 2026-27)</h3>
                  <p className="text-xs text-muted-foreground">Core performance benchmarks mapped across revenue, volume, margin, and market penetration.</p>
                </div>
                <button
                  onClick={() => toast.info("Edit Targets modal opened.")}
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Edit className="h-3 w-3" /> Edit Targets
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* Metric 1 */}
                <div className="p-3.5 rounded-xl border border-border/70 bg-slate-50/50 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold font-display text-slate-900 tabular">₹50.0 Cr</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Revenue Target</p>
                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 40% vs Last Year</p>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 rounded-xl border border-border/70 bg-slate-50/50 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold font-display text-slate-900 tabular">3,800</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Units Target</p>
                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 35%</p>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 rounded-xl border border-border/70 bg-slate-50/50 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold font-display text-slate-900 tabular">200</p>
                    <p className="text-[11px] text-muted-foreground font-medium">New Customers</p>
                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 33%</p>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="p-3.5 rounded-xl border border-border/70 bg-slate-50/50 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold font-display text-slate-900 tabular">30%</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Gross Margin</p>
                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 5%</p>
                  </div>
                </div>

                {/* Metric 5 */}
                <div className="p-3.5 rounded-xl border border-border/70 bg-slate-50/50 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold font-display text-slate-900 tabular">10%</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Market Share</p>
                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 2%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Visual Analytics Grid (4 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Sales Forecast vs Target */}
              <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-900">Sales Forecast vs Target</h3>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-xs bg-blue-500 inline-block" /> Forecast
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" /> Target
                      </span>
                    </div>
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={FORECAST_VS_TARGET_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}Cr`} />
                        <Tooltip
                          contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                          formatter={(value: any) => [`₹${value} Cr`, ""]}
                        />
                        <Bar dataKey="forecast" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                        <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-1">Apr - Mar (FY 2026-27 Revenue in ₹ Cr)</p>
              </div>

              {/* Card 2: Strategic Growth Pillars */}
              <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-900">Strategic Growth Pillars</h3>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">FY27 AOP</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#0A3C75]" />
                        <span className="font-semibold text-slate-800">Highway Corridors</span>
                      </div>
                      <span className="font-bold text-slate-900 tabular">₹18.5 Cr (37%)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800">Enterprise Fleet & CPO</span>
                      </div>
                      <span className="font-bold text-slate-900 tabular">₹15.0 Cr (30%)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="font-semibold text-slate-800">Govt GeM Mandates</span>
                      </div>
                      <span className="font-bold text-slate-900 tabular">₹11.5 Cr (23%)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        <span className="font-semibold text-slate-800">Global Pilot Exports</span>
                      </div>
                      <span className="font-bold text-slate-900 tabular">₹5.0 Cr (10%)</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">Annual Revenue Pool: ₹50.0 Cr Target</p>
              </div>

              {/* Card 3: Annual Execution Roadmap */}
              <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-900">Execution Milestones</h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">On Track</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-[11px]">Q1: Dealer Network & Pricing</span>
                        <span className="block text-[10px] text-emerald-600 font-semibold">✓ Completed & Published</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">100%</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-[11px]">Q2: DC HyperCharge Fleet Rollout</span>
                        <span className="block text-[10px] text-primary font-semibold">▶ In Progress (Phase 1)</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">65%</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-[11px]">Q3: Transit Bus Depot Charging</span>
                        <span className="block text-[10px] text-slate-500 font-medium">○ Scheduled for Nov</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Pending</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-[11px]">Q4: Target Consolidation & Review</span>
                        <span className="block text-[10px] text-slate-500 font-medium">○ Annual Audit Close</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Pending</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">Overall Strategic Progress: 41.2%</p>
              </div>

              {/* Card 4: Product-wise Target */}
              <div className="bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-2">Product-wise Target</h3>
                  <div className="space-y-2.5 mt-2">
                    {PRODUCT_WISE_TARGETS.map((item) => (
                      <div key={item.product}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-medium text-slate-700 truncate pr-2">{item.product}</span>
                          <span className="font-bold text-slate-900 tabular">₹{item.target} Cr</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(item.target / 25) * 100}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Total Product Plan:</span>
                  <span className="font-bold text-primary tabular">₹50.0 Cr</span>
                </div>
              </div>
            </div>

            {/* AI Sales Intelligence & Workflow Banner */}
            <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-emerald-50/30 border border-primary/20 rounded-xl p-4 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                      AI Sales Intelligence & Diagnostic Signals
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Neural Engine V4.2 • 94% Confidence
                      </span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Automated ERP signal diagnostics based on multi-source sales velocity & historical orders.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toast.success("AI Diagnostics refreshed with latest ERP orders.")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3 text-primary" /> Refresh AI Signals
                  </button>
                  <button
                    onClick={handleSubmitForApproval}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="h-3 w-3" /> Send for Approval
                  </button>
                </div>
              </div>

              {/* 5 AI Intelligence Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-3">
                <div className="p-2.5 rounded-lg bg-white border border-border/70 shadow-2xs hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold">Accuracy +12%</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">Forecast accuracy improved by 12% YoY using ML ensemble models.</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-border/70 shadow-2xs hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                    <Zap className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold">South Surge +45%</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">Projected high demand spike in Chennai and Bangalore commercial hubs.</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-border/70 shadow-2xs hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold">Channel Risk</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">Dealer channel targets aggressive; discount slippage risk identified.</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-border/70 shadow-2xs hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-indigo-600 mb-1">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold">GeM Portal 2×</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">Govt PSUs and GeM portal bids indicate 2× expansion potential in FY27.</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-border/70 shadow-2xs hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-purple-600 mb-1">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold">11kW Product Mix</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">Accelerate 11kW EVSE stock allocation for highest contribution margin (38%).</p>
                </div>
              </div>

              {/* Approval Workflow Stage Tracker */}
              <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-600 mt-3 pt-2.5 border-t border-border/60 bg-white/60 -mx-4 -mb-4 px-4 py-2 rounded-b-xl">
                <span className="font-semibold text-slate-700">Approval Workflow Tracker:</span>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Planner: {planStatus}
                  </span>
                  <span className="text-slate-500">Sales Head: Pending</span>
                  <span className="text-slate-500">Finance Controller: Pending</span>
                  <span className="text-slate-500">Managing Director: Pending</span>
                </div>
              </div>
            </div>

            {/* Row 4: Monthly Sales Plan + Top Customers by Target (Balanced Side-by-Side, Zero Empty Space) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Monthly Sales Plan Table (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-border/60">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Monthly Sales Plan
                      </h3>
                      <p className="text-[11px] text-muted-foreground">FY 2026-27 Revenue, Volume, Customer Acquisition & Gross Margins</p>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                      12 Periods
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border text-[10px] uppercase font-semibold text-muted-foreground bg-slate-50/80">
                          <th className="py-2 px-2.5">Month</th>
                          <th className="py-2 px-2.5 text-right">Revenue (₹Cr)</th>
                          <th className="py-2 px-2.5 text-right">Units</th>
                          <th className="py-2 px-2.5 text-right">New Cust.</th>
                          <th className="py-2 px-2.5 text-right">Margin %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {MONTHLY_SALES_PLAN.map((row) => (
                          <tr key={row.month} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-1.5 px-2.5 font-medium text-slate-800">{row.month}</td>
                            <td className="py-1.5 px-2.5 text-right font-bold text-slate-900 tabular">₹{row.revenue} Cr</td>
                            <td className="py-1.5 px-2.5 text-right text-slate-700 tabular">{row.units}</td>
                            <td className="py-1.5 px-2.5 text-right text-slate-700 tabular">+{row.newCust}</td>
                            <td className="py-1.5 px-2.5 text-right text-emerald-600 font-semibold tabular">{row.margin}%</td>
                          </tr>
                        ))}
                        <tr className="bg-primary/5 font-bold border-t-2 border-primary/20">
                          <td className="py-2 px-2.5 text-primary">Total FY27</td>
                          <td className="py-2 px-2.5 text-right text-primary tabular">₹50.0 Cr</td>
                          <td className="py-2 px-2.5 text-right text-primary tabular">3,800</td>
                          <td className="py-2 px-2.5 text-right text-primary tabular">+200</td>
                          <td className="py-2 px-2.5 text-right text-emerald-700 tabular">29%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Top Customers by Target (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-border/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-border/60">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Top Customers by Target
                      </h3>
                      <p className="text-[11px] text-muted-foreground">Key Strategic Accounts & Target Allocations</p>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                      10 Accounts
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border text-[10px] uppercase font-semibold text-muted-foreground bg-slate-50/80">
                          <th className="py-2 px-2">#</th>
                          <th className="py-2 px-2">Customer Account</th>
                          <th className="py-2 px-2">Segment</th>
                          <th className="py-2 px-2 text-right">Target (₹Cr)</th>
                          <th className="py-2 px-2 text-right">Growth</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {TOP_CUSTOMERS.map((cust) => (
                          <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-1.5 px-2 text-muted-foreground font-mono text-[11px]">{cust.id}</td>
                            <td className="py-1.5 px-2 font-semibold text-slate-800">{cust.name}</td>
                            <td className="py-1.5 px-2">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                                {cust.segment}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 text-right font-bold text-slate-900 tabular">₹{cust.target} Cr</td>
                            <td className="py-1.5 px-2 text-right text-emerald-600 font-bold tabular">+{cust.growth}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Section 2: Historical Analysis */}
        <div className="bg-white border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-slate-900">Historical Sales Analysis (MAICW Section 4)</h3>
                <p className="text-xs text-muted-foreground">Traceable to ERP Sales Orders, Invoices, Delivery Challans, and Returns history.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary font-mono">
                Historical Period: FY 2024-25 vs FY 2025-26
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-xs text-muted-foreground">Historical Sales Revenue [A]</p>
                <p className="text-lg font-bold text-slate-900 tabular">₹35.70 Cr</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 28% YoY growth</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-xs text-muted-foreground">Sales Quantity [A]</p>
                <p className="text-lg font-bold text-slate-900 tabular">2,810 Units</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">ASP: ₹1.27 Lakh</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-xs text-muted-foreground">Returns & Cancellations [A]</p>
                <p className="text-lg font-bold text-rose-600 tabular">14 / 8 Orders</p>
                <p className="text-[11px] text-muted-foreground mt-1">Lost Sales: ₹42 Lakh</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-xs text-muted-foreground">Gross Margin Realized [C]</p>
                <p className="text-lg font-bold text-emerald-700 tabular">29.1%</p>
                <p className="text-[11px] text-muted-foreground mt-1">Avg Discount: 4.8%</p>
              </div>
            </div>
        </div>

        {/* Section 3: Forecast Engine */}
        <div className="bg-white border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-slate-900">Sales Forecast Engine (MAICW Section 5 & 19)</h3>
                <p className="text-xs text-muted-foreground">Machine learning & statistical models combined with CRM Pipeline and Customer Forecasts.</p>
              </div>
              <button
                onClick={() => toast.success("AI Forecast recalculation triggered successfully.")}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" /> Re-run AI Forecast
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 border rounded-lg bg-slate-50">
                <p className="font-bold text-slate-800">Historical Trend Forecast</p>
                <p className="text-base font-bold text-primary mt-1">₹46.50 Cr</p>
                <p className="text-muted-foreground mt-1">Based on 24-month linear regression</p>
              </div>
              <div className="p-3 border rounded-lg bg-slate-50">
                <p className="font-bold text-slate-800">Opportunity-Based Pipeline</p>
                <p className="text-base font-bold text-indigo-600 mt-1">₹52.30 Cr</p>
                <p className="text-muted-foreground mt-1">Weighted probability: 68%</p>
              </div>
              <div className="p-3 border rounded-lg bg-emerald-50/50 border-emerald-200">
                <p className="font-bold text-emerald-900 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> AI Recommended Forecast
                </p>
                <p className="text-base font-bold text-emerald-700 mt-1">₹50.00 Cr</p>
                <p className="text-emerald-600 mt-1">Confidence Rating: 88% (High)</p>
              </div>
            </div>
        </div>

        {/* Section 4: Targets Hierarchy */}
        <div className="bg-white border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Target Hierarchy & Quota Allocation (MAICW Section 6 & 13)</h3>
            <p className="text-xs text-muted-foreground">Company Target (₹50 Cr) → BU → Region → Territory → Channel → Salesperson Quota.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 border rounded-lg">
                <p className="font-bold text-slate-900">Salesperson A (North)</p>
                <p className="text-base font-bold text-primary">₹30L Target</p>
                <p className="text-muted-foreground mt-1">Pipeline: ₹90L | Achievement: 92%</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-bold text-slate-900">Salesperson B (West)</p>
                <p className="text-base font-bold text-primary">₹25L Target</p>
                <p className="text-muted-foreground mt-1">Pipeline: ₹75L | Achievement: 88%</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-bold text-slate-900">Salesperson C (South)</p>
                <p className="text-base font-bold text-primary">₹20L Target</p>
                <p className="text-muted-foreground mt-1">Pipeline: ₹60L | Achievement: 105%</p>
              </div>
            </div>
        </div>

        {/* Section 5: Strategic Growth Initiatives & AOP Programs */}
        <div className="bg-white border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Strategic Sales Initiatives & Capex Programs (MAICW Section 8 & 9)</h3>
              <p className="text-xs text-muted-foreground">Four high-impact growth pillars powering the ₹50.0 Cr Annual Operating Plan (AOP).</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
              4 Active Programs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[13px]">Highway Express Hubs</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Priority 1</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Deploy 120 turnkey 60kW DC HyperCharge dispensers across prime arterial highway corridors connecting Tier 1 logistics hubs.
              </p>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold">
                <span className="text-slate-500">Target Allocation:</span>
                <span className="text-primary font-bold">₹18.5 Cr</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[13px]">Commercial EV Fleets</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Dedicated charging infrastructure agreements for e-commerce, transit buses, and last-mile delivery fleets with bundled 3-year AMC.
              </p>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold">
                <span className="text-slate-500">Target Allocation:</span>
                <span className="text-emerald-700 font-bold">₹15.0 Cr</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[13px]">Govt GeM Mandates</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Pipeline</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                State utility tender bids (TANGEDCO, NTPC, State Transport) for public urban charging infrastructure and smart depot installations.
              </p>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold">
                <span className="text-slate-500">Target Allocation:</span>
                <span className="text-amber-700 font-bold">₹11.5 Cr</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[13px]">Global Pilot Exports</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Expansion</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Pilot distributor partnerships in Middle East & ASEAN regions for 11kW AC Dual Port chargers meeting CE/IEC compliance.
              </p>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold">
                <span className="text-slate-500">Target Allocation:</span>
                <span className="text-purple-700 font-bold">₹5.0 Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Integrated Submodules Execution Hub */}
        <div className="bg-white border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Commercial Execution & Submodule Governance (MAICW Section 11 & 12)</h3>
              <p className="text-xs text-muted-foreground">Direct execution channels connected to dedicated Sales Management operational submodules.</p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Unified Sales Architecture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <Link
              to="/management/sales-management/territory-management"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0A3C75] hover:shadow-xs transition-all group bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Compass className="h-4 w-4 text-[#0A3C75]" />
                    <span>Territory Governance</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0A3C75] transition-colors" />
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Geographic boundary management, district cluster quotas, and sales rep allocation across 4 national regions.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#0A3C75]">
                <span>Manage 18 Clusters</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <Link
              to="/management/sales-management/channel-partners"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0A3C75] hover:shadow-xs transition-all group bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Users className="h-4 w-4 text-[#0A3C75]" />
                    <span>Channel Partners</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0A3C75] transition-colors" />
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Dealer recruitment, tier authorization (Gold, Platinum), stock quotas, and commercial incentive settlements.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#0A3C75]">
                <span>Manage 40 Partners</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <Link
              to="/management/sales-management/pricing"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0A3C75] hover:shadow-xs transition-all group bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <DollarSign className="h-4 w-4 text-[#0A3C75]" />
                    <span>Pricing & Margins</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0A3C75] transition-colors" />
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Unit base cost build-up, BOM markup, MSRP determination, and floor margin safeguard thresholds.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#0A3C75]">
                <span>Simulate Price Rules</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <Link
              to="/management/sales-management/contracts"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0A3C75] hover:shadow-xs transition-all group bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <FileText className="h-4 w-4 text-[#0A3C75]" />
                    <span>Contracts & SLAs</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0A3C75] transition-colors" />
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Enterprise Master Service Agreements (MSA), 99.5% SLA uptime commitments, and multi-year AMC tranches.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#0A3C75]">
                <span>Review Active MSAs</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Section 8: Budget */}
        <div className="bg-white border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div>
                <h3 className="text-base font-bold text-slate-900">Sales Budget & Resource Planning (MAICW Section 15 & 16)</h3>
                <p className="text-xs text-muted-foreground">Comprehensive budget expenditure heads, headcount readiness, CAC, and ROI metrics.</p>
              </div>
              <button
                onClick={() => toast.info("Sales Budget editing drawer opened.")}
                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit className="h-3 w-3" /> Edit Budget
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 border rounded-lg bg-slate-50">
                <p className="text-muted-foreground">Total Sales Budget</p>
                <p className="text-lg font-bold text-primary tabular">₹29.0 Lakh</p>
                <p className="text-[11px] text-muted-foreground mt-1">Budget to Target: 0.58%</p>
              </div>
              <div className="p-3 border rounded-lg bg-slate-50">
                <p className="text-muted-foreground">Customer Acquisition Cost (CAC)</p>
                <p className="text-lg font-bold text-slate-900 tabular">₹14,500</p>
                <p className="text-[11px] text-emerald-600 mt-1">Optimized by 15%</p>
              </div>
              <div className="p-3 border rounded-lg bg-slate-50">
                <p className="text-muted-foreground">Headcount Readiness</p>
                <p className="text-lg font-bold text-slate-900 tabular">24 / 29 Headcount</p>
                <p className="text-[11px] text-amber-600 font-semibold mt-1">Gap: 5 (3 Recruit, 2 Train)</p>
              </div>
              <div className="p-3 border rounded-lg bg-slate-50">
                <p className="text-muted-foreground">Expected Sales ROI</p>
                <p className="text-lg font-bold text-emerald-700 tabular">17.2× Revenue</p>
                <p className="text-[11px] text-muted-foreground mt-1">Target ROI achieved</p>
              </div>
            </div>

            {/* Detailed Budget Breakdown Table & Resource Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
              <div className="lg:col-span-7 border border-border/80 rounded-lg overflow-hidden">
                <div className="bg-slate-50/80 px-3.5 py-2.5 border-b border-border/60 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800">Sales Budget Expenditure Line Items</span>
                  <span className="text-[10px] text-muted-foreground font-mono">6 Heads • Controlled</span>
                </div>
                <div className="divide-y divide-border/50 text-xs">
                  {SALES_BUDGET.map((b) => (
                    <div key={b.head} className="flex justify-between items-center px-3.5 py-2 hover:bg-slate-50/50 transition-colors">
                      <span className="text-slate-700 font-medium">{b.head}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {((Number(b.amount) / 2900) * 100).toFixed(1)}%
                        </span>
                        <span className="font-bold text-slate-900 tabular min-w-[75px] text-right">₹{b.amount}L</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-3.5 py-2.5 bg-primary/5 font-bold text-xs text-primary">
                    <span>Total Sales Budget</span>
                    <span className="tabular">₹2,900 Lakh</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 border border-border/80 rounded-lg p-3.5 bg-slate-50/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2.5">
                    <span className="font-semibold text-xs text-slate-800">
                      Team Hiring & Enablement Readiness
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      83% Staffed
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-1.5 rounded-md bg-white border border-border/60">
                      <span className="text-slate-600">Direct Sales Team (Pan-India)</span>
                      <span className="font-semibold text-emerald-700">14 / 16 Ready</span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 rounded-md bg-white border border-border/60">
                      <span className="text-slate-600">Channel Partner Managers</span>
                      <span className="font-semibold text-emerald-700">5 / 6 Ready</span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 rounded-md bg-white border border-border/60">
                      <span className="text-slate-600">Key Enterprise Account Execs</span>
                      <span className="font-semibold text-emerald-700">3 / 4 Ready</span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 rounded-md bg-white border border-border/60">
                      <span className="text-slate-600">Technical Presales & Solutions</span>
                      <span className="font-semibold text-amber-600">2 / 3 (1 in Training)</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2.5 mt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Q1 Enablement Milestone:</span>
                  <span className="font-bold text-primary">88% on track</span>
                </div>
              </div>
            </div>
        </div>

        {/* Section 9: Risks */}
        <div className="bg-white border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Sales Risk Assessment & Mitigation (MAICW Section 18)</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 border-l-4 border-rose-500 bg-slate-50 rounded-r-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">Production Constraint (11kW EVSE capacity)</p>
                  <p className="text-muted-foreground">Mitigation: Coordinate with manufacturing for line 2 expansion by Q2.</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">High Impact</span>
              </div>
              <div className="p-3 border-l-4 border-amber-500 bg-slate-50 rounded-r-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">Price Competition in Dealer Channel</p>
                  <p className="text-muted-foreground">Mitigation: Value-based selling with bundled AMC and cloud monitoring app.</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Medium Impact</span>
              </div>
            </div>
        </div>

        {/* Section 10: Attachments */}
        <div className="bg-white border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Document Attachments & ERP Traceability (MAICW Section 23 & 24)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 border border-border rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">FY26_Sales_Strategy.pdf</p>
                  <p className="text-[10px] text-muted-foreground">3.2 MB • Approved</p>
                </div>
                <button onClick={() => toast.info("Downloading file...")} className="p-1.5 hover:bg-slate-100 rounded text-primary">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3 border border-border rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Territory_Allocation_Matrix.xlsx</p>
                  <p className="text-[10px] text-muted-foreground">1.8 MB • V1.0</p>
                </div>
                <button onClick={() => toast.info("Downloading file...")} className="p-1.5 hover:bg-slate-100 rounded text-primary">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
        </div>

        {/* Section 11: History */}
        <div className="bg-white border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Plan Revision & Approval Board (MAICW Section 21 & 22)</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                <span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Plan Prepared by Arun Kumar (Sales Planner)</p>
                  <p className="text-[10px] text-muted-foreground">01-Apr-2026 09:30 AM • Status: Draft Ready</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50/60">
                <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Sales Review Board</p>
                  <p className="text-[10px] text-muted-foreground">Awaiting sign-off from Priya S (Sales Director)</p>
                </div>
              </div>
            </div>
          </div>

        {/* Modal: Edit Objectives */}
        {isEditObjectivesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-bold text-sm text-slate-900">Edit Sales Planning Objective</h3>
                <button onClick={() => setIsEditObjectivesOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Business Objective</label>
                  <input
                    type="text"
                    value={objectives.businessObjective}
                    onChange={(e) => setObjectives({ ...objectives, businessObjective: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Sales Objective</label>
                  <input
                    type="text"
                    value={objectives.salesObjective}
                    onChange={(e) => setObjectives({ ...objectives, salesObjective: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Revenue Objective</label>
                    <input
                      type="text"
                      value={objectives.revenueObjective}
                      onChange={(e) => setObjectives({ ...objectives, revenueObjective: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Growth Objective</label>
                    <input
                      type="text"
                      value={objectives.growthObjective}
                      onChange={(e) => setObjectives({ ...objectives, growthObjective: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setIsEditObjectivesOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsEditObjectivesOpen(false);
                    toast.success("Objectives updated successfully.");
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Scope */}
        {isEditScopeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Edit Planning Scope
                </h3>
                <button onClick={() => setIsEditScopeOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Products Scope</label>
                  <input type="text" defaultValue="All EVSE Products" className="w-full border border-slate-300 rounded-lg p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Customer Segment</label>
                  <input type="text" defaultValue="Enterprise, Government, CPO" className="w-full border border-slate-300 rounded-lg p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Region Coverage</label>
                  <input type="text" defaultValue="Pan-India (5 Regions)" className="w-full border border-slate-300 rounded-lg p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Sales Teams</label>
                  <input type="text" defaultValue="All Field & Key Accounts" className="w-full border border-slate-300 rounded-lg p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Territory Matrix</label>
                  <input type="text" defaultValue="North, South, West, East, Central" className="w-full border border-slate-300 rounded-lg p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Channel Strategy</label>
                  <input type="text" defaultValue="Direct (50%), Dealer, GeM" className="w-full border border-slate-300 rounded-lg p-2 text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setIsEditScopeOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsEditScopeOpen(false);
                    toast.success("Planning scope updated successfully.");
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Submit Approval */}
        {isSubmitApprovalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-bold text-sm text-slate-900">Submit Plan for Approval</h3>
                <button onClick={() => setIsSubmitApprovalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Are you sure you want to submit Sales Plan <span className="font-bold font-mono text-primary">SP-2026-2027-001</span> to the Sales Review Board? This will advance the status from <b>Draft</b> to <b>Under Review</b>.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <p className="font-semibold text-slate-800">Review Matrix:</p>
                <p className="text-muted-foreground">• Sales Director: Priya S (Commercial validation)</p>
                <p className="text-muted-foreground">• Operations Head: Vikram Verma (Capacity feasibility)</p>
                <p className="text-muted-foreground">• Finance Controller: Ramesh Iyer (Margin & Budget clearance)</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsSubmitApprovalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApprovalSubmission}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

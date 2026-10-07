import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Boxes,
  TrendingUp,
  Percent,
  Radio,
  Repeat,
  ShoppingCart,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  FileCheck,
  UserCheck,
  Plus,
  Download,
  Upload,
  ArrowRight,
  Info,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  Building2,
  MapPin,
  Users,
  Target,
  FileText,
  ShieldCheck,
  Play,
  RotateCcw,
  Zap,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Printer,
  Copy,
  Eye,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { AppShell } from "@/components/erp/AppShell";
import { SupplyChainManagementTabBar } from "@/components/erp/SupplyChainManagementTabBar";
import { CardHeader } from "@/components/erp/CardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/supply-chain-management/demand-planning")({
  head: () => ({
    meta: [
      { title: "Demand Planning Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise demand planning, statistical & AI forecasting, consensus review, and supply replenishment.",
      },
    ],
  }),
  component: DemandPlanningPage,
});

/* ===========================================================================
   Data Constants & Mock State
   =========================================================================== */

const WORKFLOW_STEPS = [
  { id: "draft", label: "Draft", status: "completed" },
  { id: "data-collection", label: "Data Collection", status: "completed" },
  { id: "forecast-gen", label: "Forecast Generated", status: "completed" },
  { id: "planner-review", label: "Planner Review", status: "current" },
  { id: "adjustment", label: "Adjustment", status: "upcoming" },
  { id: "consensus", label: "Consensus Review", status: "upcoming" },
  { id: "pending-approval", label: "Pending Approval", status: "upcoming" },
  { id: "approved", label: "Approved", status: "upcoming" },
  { id: "released", label: "Released", status: "upcoming" },
  { id: "closed", label: "Closed", status: "upcoming" },
];

const INITIAL_MONTHLY_DATA = [
  { month: "Apr '26", actualDemand: 9850, finalForecast: 10200, baseForecast: 9500, variance: -350, accuracy: 96.5 },
  { month: "May '26", actualDemand: 11100, finalForecast: 11400, baseForecast: 10800, variance: -300, accuracy: 97.3 },
  { month: "Jun '26", actualDemand: 12100, finalForecast: 12600, baseForecast: 11900, variance: -500, accuracy: 96.0 },
  { month: "Jul '26", actualDemand: 10400, finalForecast: 10800, baseForecast: 10200, variance: -400, accuracy: 96.2 },
  { month: "Aug '26", actualDemand: 12800, finalForecast: 13200, baseForecast: 12400, variance: -400, accuracy: 96.9 },
  { month: "Sep '26", actualDemand: 14500, finalForecast: 14900, baseForecast: 14000, variance: -400, accuracy: 97.3 },
  { month: "Oct '26", actualDemand: 13900, finalForecast: 14400, baseForecast: 13500, variance: -500, accuracy: 96.5 },
  { month: "Nov '26", actualDemand: 17200, finalForecast: 17800, baseForecast: 16800, variance: -600, accuracy: 96.6 },
  { month: "Dec '26", actualDemand: 15400, finalForecast: 15900, baseForecast: 15000, variance: -500, accuracy: 96.8 },
  { month: "Jan '27", actualDemand: 13800, finalForecast: 14200, baseForecast: 13400, variance: -400, accuracy: 97.1 },
  { month: "Feb '27", actualDemand: 14200, finalForecast: 14700, baseForecast: 13900, variance: -500, accuracy: 96.6 },
  { month: "Mar '27", actualDemand: 16100, finalForecast: 16800, baseForecast: 15800, variance: -700, accuracy: 95.8 },
];

const ACCURACY_DISTRIBUTION = [
  { name: "90% - 100%", value: 60, count: 15, color: "#10b981", rating: "Excellent" },
  { name: "80% - 89%", value: 28, count: 7, color: "#3b82f6", rating: "Good" },
  { name: "70% - 79%", value: 8, count: 2, color: "#f59e0b", rating: "Acceptable" },
  { name: "< 70%", value: 4, count: 1, color: "#ef4444", rating: "Needs Improvement" },
];

const INITIAL_ADJUSTMENTS = [
  {
    id: "ADJ-2026-0012",
    product: "DC Fast 60kW",
    period: "May 2026",
    originalForecast: 10200,
    adjustment: 800,
    revisedForecast: 11000,
    reason: "New Project",
    status: "Pending",
    requestedBy: "Karan Singhal (Sales)",
  },
  {
    id: "ADJ-2026-0011",
    product: "DC Fast 120kW",
    period: "Jun 2026",
    originalForecast: 8500,
    adjustment: -500,
    revisedForecast: 8000,
    reason: "Market Decline",
    status: "Approved",
    requestedBy: "Rajesh Rao (Marketing)",
  },
  {
    id: "ADJ-2026-0010",
    product: "AC Charger 22kW",
    period: "Apr 2026",
    originalForecast: 6400,
    adjustment: 300,
    revisedForecast: 6700,
    reason: "Promotion",
    status: "Approved",
    requestedBy: "Vikram Mehta (Commercial)",
  },
  {
    id: "ADJ-2026-0009",
    product: "DC Fast 60kW",
    period: "Jul 2026",
    originalForecast: 11800,
    adjustment: 1000,
    revisedForecast: 12800,
    reason: "Customer Order",
    status: "Pending",
    requestedBy: "Ananya Iyer (Enterprise Key Accounts)",
  },
];

const TOP_DEMAND_DRIVERS = [
  { name: "Customer Orders", impact: "High", source: "CRM / ERP", weight: 95 },
  { name: "Project Pipeline", impact: "High", source: "Project Management", weight: 88 },
  { name: "Seasonal Demand", impact: "Medium", source: "AI Analytics", weight: 74 },
  { name: "Market Growth", impact: "Medium", source: "Market Intelligence", weight: 68 },
  { name: "Promotions", impact: "Medium", source: "Sales Team", weight: 62 },
  { name: "Economic Indicators", impact: "Low", source: "External Data", weight: 45 },
];

const UPCOMING_ACTIONS = [
  {
    id: "ACT-01",
    title: "Review 3 demand adjustments",
    subtitle: "Adjustments pending your review",
    badgeCount: 3,
    dueDate: "Due Today",
    priority: "high",
  },
  {
    id: "ACT-02",
    title: "Consensus Planning Meeting",
    subtitle: "EV Charging Stations Forecast Review",
    dueDate: "Due in 2 days",
    priority: "medium",
  },
  {
    id: "ACT-03",
    title: "Approval Pending",
    subtitle: "Demand Plan DP-2026-000182 awaiting approval",
    dueDate: "Due in 5 days",
    priority: "medium",
  },
  {
    id: "ACT-04",
    title: "Reforecast Recommended",
    subtitle: "Projected accuracy below threshold for 5 SKUs",
    dueDate: "Due in 7 days",
    priority: "low",
  },
];

const FORECAST_DETAILS_DATA = [
  {
    period: "Apr 2026",
    product: "DC Fast 60kW",
    histDemand: 8900,
    baseForecast: 9500,
    aiForecast: 9750,
    customerForecast: 9600,
    salesForecast: 9800,
    plannerAdj: 700,
    finalForecast: 10200,
    confidence: "93%",
    method: "AI / ML Hybrid",
    accuracy: "96.5%",
  },
  {
    period: "May 2026",
    product: "DC Fast 60kW",
    histDemand: 9800,
    baseForecast: 10800,
    aiForecast: 11050,
    customerForecast: 10900,
    salesForecast: 11200,
    plannerAdj: 600,
    finalForecast: 11400,
    confidence: "92%",
    method: "AI / ML Hybrid",
    accuracy: "97.3%",
  },
  {
    period: "Jun 2026",
    product: "DC Fast 120kW",
    histDemand: 10400,
    baseForecast: 11900,
    aiForecast: 12200,
    customerForecast: 12100,
    salesForecast: 12350,
    plannerAdj: 700,
    finalForecast: 12600,
    confidence: "91%",
    method: "Seasonal Exponential",
    accuracy: "96.0%",
  },
  {
    period: "Jul 2026",
    product: "DC Fast 120kW",
    histDemand: 9200,
    baseForecast: 10200,
    aiForecast: 10500,
    customerForecast: 10300,
    salesForecast: 10600,
    plannerAdj: 600,
    finalForecast: 10800,
    confidence: "90%",
    method: "Regression Model",
    accuracy: "96.2%",
  },
  {
    period: "Aug 2026",
    product: "AC Charger 22kW",
    histDemand: 11300,
    baseForecast: 12400,
    aiForecast: 12850,
    customerForecast: 12600,
    salesForecast: 12900,
    plannerAdj: 800,
    finalForecast: 13200,
    confidence: "94%",
    method: "Collaborative",
    accuracy: "96.9%",
  },
  {
    period: "Sep 2026",
    product: "AC Charger 22kW",
    histDemand: 12800,
    baseForecast: 14000,
    aiForecast: 14450,
    customerForecast: 14200,
    salesForecast: 14600,
    plannerAdj: 900,
    finalForecast: 14900,
    confidence: "93%",
    method: "AI / ML Hybrid",
    accuracy: "97.3%",
  },
];

const HISTORICAL_DATA_ROWS = [
  {
    period: "Jan 2026",
    product: "DC Fast 60kW",
    actualDemand: 9850,
    salesQty: 9400,
    consumptionQty: 8900,
    customerOrders: 9900,
    backorders: 50,
    returns: 12,
    lostSales: 40,
    stockoutDays: 0,
    inventoryAvailability: "98.5%",
    source: "Sales Orders / ERP",
  },
  {
    period: "Feb 2026",
    product: "DC Fast 60kW",
    actualDemand: 11100,
    salesQty: 10800,
    consumptionQty: 10200,
    customerOrders: 11250,
    backorders: 150,
    returns: 8,
    lostSales: 25,
    stockoutDays: 1,
    inventoryAvailability: "97.2%",
    source: "POS & Invoices",
  },
  {
    period: "Mar 2026",
    product: "DC Fast 120kW",
    actualDemand: 12100,
    salesQty: 11950,
    consumptionQty: 11400,
    customerOrders: 12300,
    backorders: 200,
    returns: 15,
    lostSales: 60,
    stockoutDays: 2,
    inventoryAvailability: "96.4%",
    source: "Production Issue",
  },
  {
    period: "Dec 2025",
    product: "AC Charger 22kW",
    actualDemand: 8900,
    salesQty: 8750,
    consumptionQty: 8400,
    customerOrders: 9050,
    backorders: 150,
    returns: 5,
    lostSales: 15,
    stockoutDays: 0,
    inventoryAvailability: "99.1%",
    source: "Customer Forecasts",
  },
];

const DEMAND_SIGNALS_DATA = [
  { signal: "Historical Sales", source: "ERP Core", impact: "High", weight: "35%", trend: "+8.4%", status: "Active" },
  { signal: "Open Sales Orders", source: "CRM / ERP", impact: "High", weight: "25%", trend: "+12.6%", status: "Active" },
  { signal: "Customer Forecast", source: "Customer Portal", impact: "High", weight: "15%", trend: "+6.1%", status: "Active" },
  { signal: "Seasonal Pattern", source: "AI Analytics", impact: "Medium", weight: "8%", trend: "Peak Nov-Dec", status: "Active" },
  { signal: "Market Trend", source: "Market Intelligence", impact: "Medium", weight: "6%", trend: "+5.2%", status: "Active" },
  { signal: "Promotions", source: "Sales Team", impact: "Medium", weight: "4%", trend: "Active Q2 Campaign", status: "Active" },
  { signal: "New Product Launch", source: "Product Team", impact: "High", weight: "3%", trend: "Ultra-Fast 240kW", status: "Monitoring" },
  { signal: "Project Pipeline", source: "Project Management", impact: "High", weight: "2%", trend: "Highway Corridor 4", status: "Active" },
  { signal: "Economic Indicators", source: "External Data", impact: "Medium", weight: "1%", trend: "GDP / EV Subsidies", status: "Active" },
  { signal: "Competitor Activity", source: "Market Intel", impact: "Low", weight: "1%", trend: "Price match noted", status: "Monitoring" },
];

const SCENARIO_PLANNING_DATA = [
  {
    scenario: "Best Case",
    change: "+30%",
    changeNum: 30,
    demandUnits: 167310,
    description: "Maximum opportunity: aggressive government fleet electrification tenders won.",
    supplyPlan: "Requires running Line 2 on 3-shift 24/7 overtime schedule.",
    inventoryImpact: "Buffer stock threshold increased to 45 days.",
    procurementReq: "₹ 112.4 Cr components advance purchase.",
    color: "#059669",
  },
  {
    scenario: "Optimistic",
    change: "+20%",
    changeNum: 20,
    demandUnits: 154440,
    description: "High-growth scenario: faster CPO charging station rollouts across Tier-1 metros.",
    supplyPlan: "2-shift production running at 94% overall plant capacity.",
    inventoryImpact: "Safety stock indexed at 30 days inventory.",
    procurementReq: "₹ 98.6 Cr components procurement.",
    color: "#10b981",
  },
  {
    scenario: "Base Case (Active)",
    change: "0%",
    changeNum: 0,
    demandUnits: 128700,
    description: "Expected consensus demand baseline: aligned with current orderbook and historical run rates.",
    supplyPlan: "Optimal standard shifts with zero planned overtime.",
    inventoryImpact: "Balanced working capital with 21 days inventory.",
    procurementReq: "₹ 78.4 Cr components procurement.",
    color: "#2563eb",
  },
  {
    scenario: "Conservative",
    change: "-15%",
    changeNum: -15,
    demandUnits: 109395,
    description: "Reduced demand: utility grid connection delays defer station commissioning schedules.",
    supplyPlan: "Consolidate manufacturing onto Line 1 to preserve margins.",
    inventoryImpact: "Buffer stock drawn down to 14 days to minimize holding cost.",
    procurementReq: "₹ 58.2 Cr components procurement.",
    color: "#f59e0b",
  },
  {
    scenario: "Worst Case",
    change: "-30%",
    changeNum: -30,
    demandUnits: 90090,
    description: "Major decline: subsidy hiatus and macroeconomic commercial EV fleet capital cutbacks.",
    supplyPlan: "Throttle assembly lines to 60% capacity; perform scheduled tooling maintenance.",
    inventoryImpact: "Strict just-in-time holding; quarantine slow-moving raw items.",
    procurementReq: "₹ 42.1 Cr components procurement.",
    color: "#ef4444",
  },
];

const CONSENSUS_REVIEWS_DATA = [
  {
    id: "REV-2026-0041",
    department: "Enterprise Sales",
    reviewer: "Karan Singhal",
    proposed: 124500,
    recommended: 128000,
    decision: "Recommended Increase",
    comments: "Highway corridor fleet order of 3,500 units confirmed for Q3 delivery.",
    date: "22 Sep 2026",
    status: "Approved",
  },
  {
    id: "REV-2026-0042",
    department: "Marketing",
    reviewer: "Rajesh Rao",
    proposed: 124500,
    recommended: 126000,
    decision: "Supported",
    comments: "Commercial fleet expo lead conversions tracking 15% above target.",
    date: "22 Sep 2026",
    status: "Approved",
  },
  {
    id: "REV-2026-0043",
    department: "Supply Chain & Procurement",
    reviewer: "Anil Kulkarni",
    proposed: 124500,
    recommended: 127500,
    decision: "Feasible with Lead Time",
    comments: "Power electronics semiconductors secured with tier-1 supplier for 130K units max.",
    date: "23 Sep 2026",
    status: "Approved",
  },
  {
    id: "REV-2026-0044",
    department: "Production Planning",
    reviewer: "Manoj Deshmukh",
    proposed: 124500,
    recommended: 128700,
    decision: "Capacity Validated",
    comments: "Assembly line #2 tooling ramp-up complete; throughput can sustain 11K units/mo.",
    date: "23 Sep 2026",
    status: "Approved",
  },
  {
    id: "REV-2026-0045",
    department: "Corporate Finance",
    reviewer: "Sunita Verma",
    proposed: 128700,
    recommended: 128700,
    decision: "Pending Final Review",
    comments: "Working capital drawdown of ₹ 57.9 Cr within acceptable quarterly revolver ceiling.",
    date: "24 Sep 2026",
    status: "In Review",
  },
];

const APPROVAL_WORKFLOW_DATA = [
  {
    level: 1,
    role: "Demand Planner",
    approver: "Dr. Aris Thorne",
    department: "Demand Sensing & AI Analytics",
    decision: "Submitted Draft Plan",
    comments: "V2 Demand forecast model refreshed with latest CRM pipeline and AI anomalies resolved.",
    date: "21 Sep 2026, 14:30",
    status: "Approved",
  },
  {
    level: 2,
    role: "Sales Review",
    approver: "Karan Singhal (VP Sales)",
    department: "Commercial",
    decision: "Approved with Adjustment",
    comments: "+4,200 units added to reflect signed CPO commercial contracts.",
    date: "22 Sep 2026, 11:15",
    status: "Approved",
  },
  {
    level: 3,
    role: "Supply Chain Review",
    approver: "Rajesh Rao (Supply Head)",
    department: "Supply Chain Ops",
    decision: "Material Feasibility Confirmed",
    comments: "Supplier BOM capacity explosion checked; 8 critical items flagged for safety buffers.",
    date: "23 Sep 2026, 16:45",
    status: "Approved",
  },
  {
    level: 4,
    role: "Finance Review",
    approver: "Sunita Verma (CFO Office)",
    department: "Corporate Finance",
    decision: "Under Active Evaluation",
    comments: "Reviewing Q3 operating margins and inventory carrying liability.",
    date: "Current Stage",
    status: "Pending",
  },
  {
    level: 5,
    role: "Management Board",
    approver: "Executive Committee",
    department: "Executive",
    decision: "Final Release Authorization",
    comments: "Awaiting Finance sign-off before releasing demand plan to MRP production schedule.",
    date: "Scheduled 26 Sep",
    status: "Queued",
  },
];

/* ===========================================================================
   Main Component: Demand Planning Form
   =========================================================================== */
function DemandPlanningPage() {
  // Plan Information state
  const [planNumber, setPlanNumber] = useState("DP-2026-000184");
  const [planType, setPlanType] = useState("Sales Forecast");
  const [planningHorizon, setPlanningHorizon] = useState("Monthly");
  const [planningPeriod, setPlanningPeriod] = useState("Apr 2026 – Mar 2027");
  const [productGroup, setProductGroup] = useState("EV Charging Station - DC Fast");
  const [warehouseRegion, setWarehouseRegion] = useState("All India");
  const [businessUnit, setBusinessUnit] = useState("Electro Mobility");
  const [customerSegment, setCustomerSegment] = useState("Enterprise");
  const [planner, setPlanner] = useState("Ananya Sengupta");
  const [forecastStatus, setForecastStatus] = useState("Under Review");
  const [version, setVersion] = useState("V2");

  // Metrics state
  const [baseForecast, setBaseForecast] = useState(124500);
  const [plannerAdjustment, setPlannerAdjustment] = useState(4200);
  const [aiForecast, setAiForecast] = useState(126300);
  const [aiConfidence, setAiConfidence] = useState(91);
  const [forecastAccuracy, setForecastAccuracy] = useState(92.4);
  const [mape, setMape] = useState(7.6);

  const finalForecast = useMemo(() => {
    return baseForecast + plannerAdjustment;
  }, [baseForecast, plannerAdjustment]);

  // Adjustments list state
  const [adjustments, setAdjustments] = useState(INITIAL_ADJUSTMENTS);

  // Modals state
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New adjustment form state
  const [newAdjProduct, setNewAdjProduct] = useState("DC Fast 60kW");
  const [newAdjPeriod, setNewAdjPeriod] = useState("May 2026");
  const [newAdjQty, setNewAdjQty] = useState("500");
  const [newAdjReason, setNewAdjReason] = useState("New Customer Order");
  const [newAdjNotes, setNewAdjNotes] = useState("");

  // Filter state for charts
  const [chartProductFilter, setChartProductFilter] = useState("All Products");

  // Handle workflow step click
  const handleWorkflowAdvance = () => {
    if (forecastStatus === "Draft") {
      setForecastStatus("Data Collection");
      toast.info("Status advanced to Data Collection");
    } else if (forecastStatus === "Data Collection") {
      setForecastStatus("Forecast Generated");
      toast.info("Status advanced to Forecast Generated");
    } else if (forecastStatus === "Forecast Generated") {
      setForecastStatus("Under Review");
      toast.info("Status advanced to Planner Review");
    } else if (forecastStatus === "Under Review") {
      setForecastStatus("Consensus Review");
      toast.success("Submitted for Consensus Review");
    } else if (forecastStatus === "Consensus Review") {
      setForecastStatus("Pending Approval");
      toast.success("Submitted to Executive Board for Approval");
    } else if (forecastStatus === "Pending Approval") {
      setForecastStatus("Approved");
      toast.success("Demand Plan Approved!");
    } else if (forecastStatus === "Approved") {
      setForecastStatus("Released");
      toast.success("Demand Plan released to MRP & Procurement!");
    }
  };

  // Run AI Forecast Simulation
  const handleRunAiForecast = () => {
    setIsAiRunning(true);
    setShowAiModal(true);
    setTimeout(() => {
      setIsAiRunning(false);
      setAiForecast(127400);
      setAiConfidence(94);
      setForecastAccuracy(93.8);
      setMape(6.9);
      toast.success("AI Neural Forecasting Engine completed analysis across 10 demand signal streams!", {
        description: "Forecast confidence raised to 94% with optimized seasonal factors.",
      });
    }, 2400);
  };

  // Handle Add Adjustment
  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseFloat(newAdjQty) || 0;
    const newId = `ADJ-2026-00${adjustments.length + 13}`;
    const newEntry = {
      id: newId,
      product: newAdjProduct,
      period: newAdjPeriod,
      originalForecast: 10200,
      adjustment: qtyNum,
      revisedForecast: 10200 + qtyNum,
      reason: newAdjReason,
      status: "Pending" as const,
      requestedBy: "Ananya Sengupta (Planner)",
    };
    setAdjustments([newEntry, ...adjustments]);
    setPlannerAdjustment((prev) => prev + qtyNum);
    setShowAdjustmentModal(false);
    toast.success(`Adjustment ${newId} created successfully!`, {
      description: `Revised forecast updated by ${qtyNum > 0 ? "+" : ""}${qtyNum} units.`,
    });
  };

  // Export CSV handler
  const handleExportCsv = () => {
    const headers = ["Period", "Product", "Actual Demand", "Base Forecast", "Final Forecast", "Variance", "Accuracy %"];
    const rows = INITIAL_MONTHLY_DATA.map((d) => [
      `"${d.month}"`,
      `"${productGroup}"`,
      d.actualDemand,
      d.baseForecast,
      d.finalForecast,
      d.variance,
      d.accuracy,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `demand-plan-${planNumber}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Demand Plan exported to CSV successfully");
  };

  return (
    <AppShell
      title="Demand Planning"
      breadcrumb="Management"
      description="Forecast future demand for products, materials, and services using historical consumption, sales orders, market trends, seasonality, customer forecasts, and AI/ML predictions."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="demand-planning"
    >
      <div className="space-y-6">
        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active Plan:</span>
            <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5 border-primary/20">
              {planNumber}
            </Badge>
            <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200 text-xs">
              {forecastStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowNewPlanModal(true)}
              className="h-8 gap-1.5 bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Plan</span>
            </Button>

            <Button
              size="sm"
              onClick={handleRunAiForecast}
              className="h-8 gap-1.5 bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Run AI Forecast</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  <span>More</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs">Plan Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleExportCsv} className="gap-2 text-xs cursor-pointer">
                  <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowUploadModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Upload className="h-3.5 w-3.5 text-muted-foreground" /> Upload Historical Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()} className="gap-2 text-xs cursor-pointer">
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print Plan Summary
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setVersion("V3");
                    toast.success("New version V3 branched from current baseline");
                  }}
                  className="gap-2 text-xs cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Branch New Version (V3)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWorkflowAdvance} className="gap-2 text-xs cursor-pointer font-medium text-primary">
                  <ArrowRight className="h-3.5 w-3.5" /> Advance Workflow Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ===================================================================
            SECTION 1: Dual Top Cards (Plan Information + Forecast Summary/Workflow)
            =================================================================== */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* LEFT CARD: Plan Information */}
          <div className="card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground tracking-tight">Plan Information</h3>
                  <Badge variant="outline" className="text-xs font-mono font-bold text-primary bg-primary/5 border-primary/20">
                    {planNumber}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200">
                    {forecastStatus}
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {version}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Plan Type</span>
                  <select
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="Sales Forecast">Sales Forecast</option>
                    <option value="Material Demand Forecast">Material Demand Forecast</option>
                    <option value="Production Demand Plan">Production Demand Plan</option>
                    <option value="Customer Demand Forecast">Customer Demand Forecast</option>
                    <option value="Seasonal Forecast">Seasonal Forecast</option>
                    <option value="Project Demand Plan">Project Demand Plan</option>
                    <option value="Spare Parts Forecast">Spare Parts Forecast</option>
                    <option value="Inventory Replenishment Forecast">Inventory Replenishment Forecast</option>
                    <option value="Strategic Demand Plan">Strategic Demand Plan</option>
                    <option value="AI Generated Forecast">AI Generated Forecast</option>
                    <option value="Manual Forecast">Manual Forecast</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Planning Horizon</span>
                  <select
                    value={planningHorizon}
                    onChange={(e) => setPlanningHorizon(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Planning Period</span>
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-foreground py-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{planningPeriod}</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground block font-medium">Product / Product Group</span>
                  <select
                    value={productGroup}
                    onChange={(e) => setProductGroup(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="EV Charging Station - DC Fast">EV Charging Station - DC Fast</option>
                    <option value="EV Charging Station - AC Fleet">EV Charging Station - AC Fleet</option>
                    <option value="Ultra-Fast 240kW Dispenser">Ultra-Fast 240kW Dispenser</option>
                    <option value="Power Module Sub-Assemblies">Power Module Sub-Assemblies</option>
                    <option value="Spare Parts & Cable Harnesses">Spare Parts & Cable Harnesses</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Warehouse / Region</span>
                  <select
                    value={warehouseRegion}
                    onChange={(e) => setWarehouseRegion(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="All India">All India</option>
                    <option value="North Zone (Delhi Hub)">North Zone (Delhi Hub)</option>
                    <option value="South Zone (Bengaluru Hub)">South Zone (Bengaluru Hub)</option>
                    <option value="West Zone (Pune Plant)">West Zone (Pune Plant)</option>
                    <option value="East Zone (Kolkata Hub)">East Zone (Kolkata Hub)</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Business Unit</span>
                  <div className="mt-1 font-semibold text-foreground py-1">{businessUnit}</div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Customer Segment</span>
                  <div className="mt-1 font-semibold text-foreground py-1">{customerSegment}</div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Lead Planner</span>
                  <div className="mt-1 font-semibold text-foreground py-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{planner}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Core flow: Data → Signals → Forecast → Review → Approval → MRP</span>
              <button
                type="button"
                onClick={handleWorkflowAdvance}
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                Advance Phase <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* RIGHT CARD: Forecast Summary & Status Workflow */}
          <div className="card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-base text-foreground tracking-tight">Forecast Summary</h3>
                <span className="text-xs text-muted-foreground font-medium">AI / ML Hybrid Engine</span>
              </div>

              {/* 4 Summary Metric Columns */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Final Forecast</span>
                  <div className="text-xl font-bold tracking-tight text-foreground font-mono mt-1">
                    {finalForecast.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                    ↑ 8.6% vs Last Version
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/30 border">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Base Forecast</span>
                  <div className="text-xl font-bold tracking-tight text-foreground font-mono mt-1">
                    {baseForecast.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">Statistical Baseline</span>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/30 border">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">AI Forecast</span>
                  <div className="text-xl font-bold tracking-tight text-blue-600 font-mono mt-1">
                    {aiForecast.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                    Confidence {aiConfidence}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/30 border">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Forecast Accuracy</span>
                  <div className="text-xl font-bold tracking-tight text-emerald-600 font-mono mt-1">
                    {forecastAccuracy}%
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">MAPE {mape}%</span>
                </div>
              </div>

              {/* Stepper Status Workflow */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Status Workflow</span>
                  <span className="text-[11px] text-muted-foreground font-medium">Phase 4 of 10</span>
                </div>

                <div className="flex items-center overflow-x-auto no-scrollbar py-2">
                  {WORKFLOW_STEPS.map((step, idx) => {
                    const isDone = idx < 3;
                    const isCurrent = idx === 3;
                    return (
                      <div key={step.id} className="flex items-center shrink-0">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold transition-all",
                              isDone
                                ? "bg-emerald-600 text-white"
                                : isCurrent
                                ? "bg-primary text-white ring-4 ring-primary/20 scale-110"
                                : "bg-muted text-muted-foreground border"
                            )}
                          >
                            {isDone ? <Check className="h-3 w-3" /> : idx + 1}
                          </div>
                          <span
                            className={cn(
                              "text-[10px] mt-1 whitespace-nowrap font-medium",
                              isCurrent ? "text-primary font-bold" : "text-muted-foreground"
                            )}
                          >
                            {step.label}
                          </span>
                        </div>
                        {idx < WORKFLOW_STEPS.length - 1 && (
                          <div
                            className={cn(
                              "h-0.5 w-6 sm:w-8 mx-1 mb-3 transition-colors",
                              idx < 3 ? "bg-emerald-500" : "bg-border"
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-[11px] text-muted-foreground flex justify-between items-center">
              <span>Next Milestone: S&OP Consensus Review with Commercial & Ops</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Consensus review notes: Commercial & Operations sign-off scheduled for 28 Mar 2026.")}
                className="h-6 text-xs text-primary"
              >
                Review Meeting Notes
              </Button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 2: 6 KPI Metric Cards Row (matching screenshot)
            =================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Products Planned */}
          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-blue-600 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-muted-foreground">Products Planned</span>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-600">
                <Boxes className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">56</div>
              <button
                type="button"
                onClick={() => toast.info("56 Products Planned across EV Fast Chargers, Battery Packs, and Inverters.")}
                className="text-[11px] text-blue-600 hover:underline font-semibold mt-1 inline-flex items-center gap-0.5"
              >
                View Details <ChevronRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* 2. Total Forecast Value */}
          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-emerald-600 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Forecast Value</span>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">₹ 246.85 Cr</div>
              <button
                type="button"
                onClick={() => toast.info("Total Forecast Value: ₹ 246.85 Cr across FY 2026-27.")}
                className="text-[11px] text-emerald-600 hover:underline font-semibold mt-1 inline-flex items-center gap-0.5"
              >
                View Details <ChevronRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* 3. Demand Signals */}
          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-sky-500 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-muted-foreground">Demand Signals</span>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-sky-500/10 text-sky-600">
                <Radio className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">10</div>
              <button
                type="button"
                onClick={() => toast.info("10 Active Demand Signals monitored via ERP telematics and CRM pipelines.")}
                className="text-[11px] text-sky-600 hover:underline font-semibold mt-1 inline-flex items-center gap-0.5"
              >
                Active Signals <ChevronRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* 4. Adjustments */}
          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-muted-foreground">Adjustments</span>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
                <Repeat className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">12</div>
              <button
                type="button"
                onClick={() => toast.info("12 Pending Adjustments submitted by regional sales heads.")}
                className="text-[11px] text-amber-600 hover:underline font-semibold mt-1 inline-flex items-center gap-0.5"
              >
                Pending Review <ChevronRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* 5. Open Sales Orders */}
          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-rose-500 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-muted-foreground">Open Sales Orders</span>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-rose-500/10 text-rose-600">
                <ShoppingCart className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">342</div>
              <div className="text-[11px] text-muted-foreground font-mono mt-1">₹ 98.32 Cr confirmed</div>
            </div>
          </div>

          {/* 6. Projected Stockouts */}
          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-muted-foreground">Projected Stockouts</span>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-red-500/10 text-red-600">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-red-600">8</div>
              <div className="text-[11px] text-red-600 font-semibold mt-1">SKUs At Risk</div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 3: DEMAND PLANNING WORKSPACE
            =================================================================== */}
        <div className="space-y-6">
          {/* Charts Row: Forecast vs Actual, Accuracy Donut, Top Demand Drivers */}
            <div className="grid gap-5 lg:grid-cols-12">
              {/* 1. Forecast vs Actual (Monthly) - 6 cols */}
              <div className="card-soft p-5 lg:col-span-6 flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Forecast vs Actual (Monthly)</h4>
                    <span className="text-[11px] text-muted-foreground">Units in thousands across 12-month period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={chartProductFilter}
                      onChange={(e) => setChartProductFilter(e.target.value)}
                      className="h-7 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="All Products">All Products</option>
                      <option value="DC Fast 60kW">DC Fast 60kW</option>
                      <option value="DC Fast 120kW">DC Fast 120kW</option>
                      <option value="AC Charger 22kW">AC Charger 22kW</option>
                    </select>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-end gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-blue-600" /> Actual Demand
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Final Forecast
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-sky-400" /> Base Forecast
                  </span>
                </div>

                <div className="mt-3 h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={INITIAL_MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="planActualGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(v) => `${v / 1000}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(val: any, name: any) => [
                          Number(val).toLocaleString() + " Units",
                          name === "actualDemand" ? "Actual Demand" : name === "finalForecast" ? "Final Forecast" : "Base Forecast",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="actualDemand"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#planActualGrad)"
                        name="actualDemand"
                      />
                      <Line
                        type="monotone"
                        dataKey="finalForecast"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3, fill: "#10b981" }}
                        name="finalForecast"
                      />
                      <Line
                        type="monotone"
                        dataKey="baseForecast"
                        stroke="#38bdf8"
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                        dot={false}
                        name="baseForecast"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span>Actual volume: 1,18,200 · Forecast: 1,28,700</span>
                  <span className="font-semibold text-emerald-600">Variance: -5.1%</span>
                </div>
              </div>

              {/* 2. Forecast Accuracy Trend (Donut) - 3 cols */}
              <div className="card-soft p-5 lg:col-span-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Forecast Accuracy Trend</h4>
                  <span className="text-[11px] text-muted-foreground">Accuracy performance across SKU groups</span>

                  <div className="relative mt-3 h-[160px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ACCURACY_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {ACCURACY_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold tracking-tight text-foreground font-mono">92.4%</span>
                      <span className="text-[10px] font-medium text-muted-foreground">Accuracy</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    {ACCURACY_DISTRIBUTION.map((band, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: band.color }} />
                          <span className="text-muted-foreground font-medium">{band.name}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <span>{band.count}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">({band.value}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-[11px] text-muted-foreground flex justify-between">
                  <span>Rating: Very Good</span>
                  <span className="font-semibold text-primary">MAPE: 7.6%</span>
                </div>
              </div>

              {/* 3. Top Demand Drivers - 3 cols */}
              <div className="card-soft p-5 lg:col-span-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-semibold text-sm text-foreground">Top Demand Drivers</h4>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Impact</span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {TOP_DEMAND_DRIVERS.map((driver, idx) => {
                      const isHigh = driver.impact === "High";
                      const isMed = driver.impact === "Medium";
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg border bg-muted/15"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                isHigh ? "bg-emerald-500" : isMed ? "bg-amber-500" : "bg-slate-400"
                              )}
                            />
                            <span className="text-xs font-semibold text-foreground">{driver.name}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-semibold border-none",
                              isHigh
                                ? "bg-emerald-500/10 text-emerald-700"
                                : isMed
                                ? "bg-amber-500/10 text-amber-700"
                                : "bg-slate-500/10 text-slate-700"
                            )}
                          >
                            {driver.impact} Impact
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>10 active signals</span>
                  <button
                    type="button"
                    onClick={() => toast.info("10 active signals monitored across market, competitor, and channel indicators.")}
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5"
                  >
                    View All Signals <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Demand Adjustments & Upcoming Actions */}
            <div className="grid gap-5 lg:grid-cols-12">
              {/* Recent Demand Adjustments (Table) - 8 cols */}
              <div className="card-soft p-5 lg:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">Recent Demand Adjustments</h4>
                      <span className="text-[11px] text-muted-foreground">Adjustments made to statistical base forecast</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAdjustmentModal(true)}
                      className="h-7 text-xs gap-1"
                    >
                      <Plus className="h-3 w-3" /> Create Adjustment
                    </Button>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-muted-foreground font-semibold">
                          <th className="pb-2">Adjustment ID</th>
                          <th className="pb-2">Product</th>
                          <th className="pb-2">Period</th>
                          <th className="pb-2 text-right">Original</th>
                          <th className="pb-2 text-right">Adjustment</th>
                          <th className="pb-2 text-right">Revised</th>
                          <th className="pb-2">Reason</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {adjustments.map((adj) => {
                          const isApproved = adj.status === "Approved";
                          const isPositive = adj.adjustment > 0;
                          return (
                            <tr key={adj.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-2.5 font-mono font-medium text-primary">{adj.id}</td>
                              <td className="py-2.5 font-medium text-foreground">{adj.product}</td>
                              <td className="py-2.5 text-muted-foreground">{adj.period}</td>
                              <td className="py-2.5 text-right font-mono text-muted-foreground">
                                {adj.originalForecast.toLocaleString()}
                              </td>
                              <td
                                className={cn(
                                  "py-2.5 text-right font-mono font-semibold",
                                  isPositive ? "text-emerald-600" : "text-rose-600"
                                )}
                              >
                                {isPositive ? `+${adj.adjustment}` : adj.adjustment}
                              </td>
                              <td className="py-2.5 text-right font-mono font-bold text-foreground">
                                {adj.revisedForecast.toLocaleString()}
                              </td>
                              <td className="py-2.5 text-muted-foreground">{adj.reason}</td>
                              <td className="py-2.5 text-right">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] font-semibold",
                                    isApproved
                                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                                      : "bg-amber-500/10 text-amber-700 border-amber-200"
                                  )}
                                >
                                  {adj.status}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>Showing {adjustments.length} demand overrides</span>
                  <button
                    type="button"
                    onClick={() => toast.info("Showing recent demand adjustments log with statistical baseline.")}
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View All Adjustments <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Upcoming Actions - 4 cols */}
              <div className="card-soft p-5 lg:col-span-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-semibold text-sm text-foreground">Upcoming Actions</h4>
                    <span className="text-[11px] text-muted-foreground font-medium">4 Pending Tasks</span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {UPCOMING_ACTIONS.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-start justify-between gap-3 p-2.5 rounded-lg border bg-muted/15 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className={cn(
                              "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border",
                              act.priority === "high"
                                ? "bg-rose-50 border-rose-200 text-rose-600"
                                : act.priority === "medium"
                                ? "bg-amber-50 border-amber-200 text-amber-600"
                                : "bg-blue-50 border-blue-200 text-blue-600"
                            )}
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-foreground">{act.title}</span>
                              {act.badgeCount && (
                                <span className="grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                                  {act.badgeCount}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{act.subtitle}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground shrink-0">
                          {act.dueDate}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                  <span>Action priority: High</span>
                  <button
                    type="button"
                    onClick={() => toast.info("Task management console opened")}
                    className="font-semibold text-primary hover:underline"
                  >
                    View All Tasks →
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>

      {/* ===================================================================
          MODALS & DIALOGS
          =================================================================== */}

      {/* 1. Create New Adjustment Dialog */}
      <Dialog open={showAdjustmentModal} onOpenChange={setShowAdjustmentModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create Demand Adjustment</DialogTitle>
            <DialogDescription>
              Submit an override or adjustment quantity against demand plan {planNumber}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAdjustment} className="space-y-3.5 text-xs">
            <div>
              <Label className="text-xs">Product SKU</Label>
              <select
                value={newAdjProduct}
                onChange={(e) => setNewAdjProduct(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs"
              >
                <option value="DC Fast 60kW">DC Fast 60kW</option>
                <option value="DC Fast 120kW">DC Fast 120kW</option>
                <option value="AC Charger 22kW">AC Charger 22kW</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Forecast Period</Label>
                <select
                  value={newAdjPeriod}
                  onChange={(e) => setNewAdjPeriod(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs"
                >
                  <option value="Apr 2026">Apr 2026</option>
                  <option value="May 2026">May 2026</option>
                  <option value="Jun 2026">Jun 2026</option>
                  <option value="Jul 2026">Jul 2026</option>
                  <option value="Aug 2026">Aug 2026</option>
                  <option value="Sep 2026">Sep 2026</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Adjustment Quantity</Label>
                <Input
                  type="number"
                  value={newAdjQty}
                  onChange={(e) => setNewAdjQty(e.target.value)}
                  placeholder="+500 or -300"
                  className="mt-1 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Adjustment Reason</Label>
              <select
                value={newAdjReason}
                onChange={(e) => setNewAdjReason(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs"
              >
                <option value="New Customer Order">New Customer Order</option>
                <option value="Market Growth">Market Growth</option>
                <option value="Market Decline">Market Decline</option>
                <option value="Seasonal Change">Seasonal Change</option>
                <option value="Promotion">Promotion</option>
                <option value="New Product Launch">New Product Launch</option>
                <option value="Project Award">Project Award</option>
                <option value="Customer Cancellation">Customer Cancellation</option>
                <option value="Supply Constraint">Supply Constraint</option>
                <option value="Manual Correction">Manual Correction</option>
              </select>
            </div>

            <div>
              <Label className="text-xs">Supporting Evidence / Commercial Notes</Label>
              <Input
                value={newAdjNotes}
                onChange={(e) => setNewAdjNotes(e.target.value)}
                placeholder="Reference tender #, client PO, or market survey"
                className="mt-1 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAdjustmentModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Submit Adjustment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Run AI Forecast Modal */}
      <Dialog open={showAiModal} onOpenChange={setShowAiModal}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>AI Neural Forecast Engine</span>
            </DialogTitle>
            <DialogDescription>
              {isAiRunning
                ? "Processing multi-echelon demand telemetry and market drivers..."
                : "Simulation completed successfully."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-center">
            {isAiRunning ? (
              <div className="space-y-3">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Ingesting 10 real-time signals, detecting seasonal anomalies, optimizing safety stock...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-foreground">
                  New AI Recommendation: 1,27,400 Units (Confidence 94%)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Model MAPE reduced from 7.6% to 6.9%. 3 supply buffer recommendations generated.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              disabled={isAiRunning}
              size="sm"
              onClick={() => setShowAiModal(false)}
              className="w-full sm:w-auto"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. New Plan Modal */}
      <Dialog open={showNewPlanModal} onOpenChange={setShowNewPlanModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Create New Demand Plan</DialogTitle>
            <DialogDescription>Initialize a new forecast cycle for product groups and planning horizons.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Product Group</Label>
              <Input defaultValue="EV Charging Station - Ultra Fast" className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Planning Period</Label>
              <Input defaultValue="May 2026 – Apr 2027" className="mt-1 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Horizon</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Plan Type</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>Sales Forecast</option>
                  <option>Production Demand Plan</option>
                  <option>Strategic Demand Plan</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowNewPlanModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowNewPlanModal(false);
                setPlanNumber("DP-2026-000185");
                toast.success("New Demand Plan DP-2026-000185 initialized in Draft state.");
              }}
            >
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Upload Historical Data Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Upload Historical Data</DialogTitle>
            <DialogDescription>Import CSV or Excel files containing actual consumption, invoices, or POS data.</DialogDescription>
          </DialogHeader>
          <div className="py-6 border-2 border-dashed rounded-xl text-center p-4 bg-muted/10">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground">Click to browse or drag file here</p>
            <p className="text-[11px] text-muted-foreground mt-1">Supports CSV, XLSX up to 25MB</p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowUploadModal(false);
                toast.success("Historical records uploaded and parsed into Data Collection pipeline.");
              }}
            >
              Upload & Ingest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}


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
  Printer,
  Copy,
  Truck,
  Warehouse,
  Factory,
  ArrowLeftRight,
  Package,
  ShieldAlert,
  Sliders,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Tag,
  Barcode,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Coins,
  History,
  ClipboardList,
  Scale,
  Gauge,
  Phone,
  Mail,
  Edit,
  Eye,
  Forklift,
  CheckSquare,
  Navigation,
  Compass,
  Star,
  Send,
  Camera,
  Signature,
  FileUp,
  Split,
  Map,
  Fuel,
  Share2,
  User,
  CreditCard,
  Receipt,
  FileSignature,
  Network,
  Store,
  Undo2,
  CheckSquare2,
  Maximize2,
  Wrench,
  BatteryCharging,
  Car,
  AlertOctagon,
  FileSpreadsheet,
  Box,
  Layers2,
  Recycle,
  Shield,
  CheckCheck,
  FileBadge,
  LogOut,
  ScanLine,
  Trash2,
  Hammer,
  BadgePercent,
  TrendingDown,
  FileDown,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Leaf,
  Globe2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { AppShell } from "@/components/erp/AppShell";
import { SupplyChainManagementTabBar } from "@/components/erp/SupplyChainManagementTabBar";
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

export const Route = createFileRoute("/management/supply-chain-management/supply-analytics")({
  head: () => ({
    meta: [
      { title: "Supply Analytics Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "Centralized supply intelligence layer for forecasting, supplier performance, inventory health, risk prediction, and AI supply optimization.",
      },
    ],
  }),
  component: SupplyAnalyticsPage,
});

// --- CHART & DASHBOARD DATA (EXACT MOCKUP VALUES) ---
const DEMAND_SUPPLY_TREND = [
  { month: "Nov 2025", demand: 22.1, supply: 21.0, gap: 1.1 },
  { month: "Dec 2025", demand: 24.3, supply: 23.1, gap: 1.2 },
  { month: "Jan 2026", demand: 26.7, supply: 25.9, gap: 0.8 },
  { month: "Feb 2026", demand: 24.8, supply: 24.1, gap: 0.7 },
  { month: "Mar 2026", demand: 23.9, supply: 22.6, gap: 1.3 },
  { month: "Apr 2026", demand: 22.4, supply: 21.1, gap: 1.3 },
];

const SUPPLY_HEALTH_DATA = [
  { name: "Healthy", value: 72, count: 64, color: "#10b981" },
  { name: "At Risk", value: 19, count: 17, color: "#f59e0b" },
  { name: "Critical", value: 9, count: 8, color: "#ef4444" },
];

const INVENTORY_HEALTH_DATA = [
  { name: "Healthy", value: 63.2, pct: "48%", color: "#10b981" },
  { name: "At Risk", value: 42.1, pct: "32%", color: "#f59e0b" },
  { name: "Excess / Obsolete", value: 27.1, pct: "20%", color: "#ef4444" },
];

const LEAD_TIME_TREND = [
  { month: "Nov 2025", days: 9.6 },
  { month: "Dec 2025", days: 9.2 },
  { month: "Jan 2026", days: 8.9 },
  { month: "Feb 2026", days: 8.6 },
  { month: "Mar 2026", days: 8.3 },
  { month: "Apr 2026", days: 8.4 },
];

const SUPPLY_BY_CATEGORY = [
  { category: "Electrical", value: 6.25, pct: "33%", color: "#3b82f6" },
  { category: "Mechanical", value: 5.15, pct: "27%", color: "#06b6d4" },
  { category: "Electronics", value: 3.60, pct: "19%", color: "#8b5cf6" },
  { category: "Civil", value: 2.75, pct: "15%", color: "#10b981" },
  { category: "Others", value: 0.90, pct: "6%", color: "#94a3b8" },
];

const TOP_SUPPLY_RISKS = [
  {
    risk: "Material Shortage",
    probability: "High",
    impact: "High",
    score: 9,
    level: "Critical",
  },
  {
    risk: "Supplier Delivery Delay",
    probability: "High",
    impact: "High",
    score: 9,
    level: "Critical",
  },
  {
    risk: "Price Volatility",
    probability: "Medium",
    impact: "High",
    score: 6,
    level: "High",
  },
  {
    risk: "Transport Disruption",
    probability: "Medium",
    impact: "Medium",
    score: 5,
    level: "Moderate",
  },
  {
    risk: "Quality Failure",
    probability: "Low",
    impact: "High",
    score: 4,
    level: "Moderate",
  },
];

const SUPPLY_GAP_MATERIALS = [
  {
    material: "Electrolytic Copper Rods & Wire",
    demand: "25,000 M",
    supply: "14,300 M",
    gap: "-10,700 M",
    level: "Critical",
  },
  {
    material: "CRGO Electrical Lamination Steel",
    demand: "50,000 KG",
    supply: "42,500 KG",
    gap: "-7,500 KG",
    level: "High",
  },
  {
    material: "Automotive Microcontrollers (MCU)",
    demand: "1,250 Nos",
    supply: "1,180 Nos",
    gap: "-70 Nos",
    level: "Moderate",
  },
  {
    material: "Prismatic LFP Battery Cells",
    demand: "850 Nos",
    supply: "920 Nos",
    gap: "+70 Nos",
    level: "Healthy",
  },
  {
    material: "High-Power IGBT Modules 1200V",
    demand: "2,800 Nos",
    supply: "3,050 Nos",
    gap: "+250 Nos",
    level: "Healthy",
  },
];

const SUPPLIER_PERFORMANCE_TOP5 = [
  {
    supplier: "Supplier A",
    quality: "96%",
    delivery: "94%",
    cost: "91%",
    leadTime: "89%",
    overall: 93,
    status: "Healthy",
  },
  {
    supplier: "Supplier B",
    quality: "92%",
    delivery: "86%",
    cost: "95%",
    leadTime: "82%",
    overall: 88,
    status: "Healthy",
  },
  {
    supplier: "Supplier C",
    quality: "88%",
    delivery: "78%",
    cost: "90%",
    leadTime: "76%",
    overall: 82,
    status: "Moderate",
  },
  {
    supplier: "Supplier D",
    quality: "86%",
    delivery: "72%",
    cost: "87%",
    leadTime: "70%",
    overall: 78,
    status: "Moderate",
  },
  {
    supplier: "Supplier E",
    quality: "82%",
    delivery: "68%",
    cost: "85%",
    leadTime: "64%",
    overall: 72,
    status: "High Risk",
  },
];

const AI_RECOMMENDATIONS_LIST = [
  {
    id: 1,
    severity: "critical",
    icon: AlertTriangle,
    title: "Copper Cable shortage predicted in 12 days",
    action: "Recommended: Increase PO quantity by 8,500 meters",
    color: "#ef4444",
  },
  {
    id: 2,
    severity: "high",
    icon: AlertTriangle,
    title: "Supplier B delivery risk increased by 24%",
    action: "Recommended: Shift 30% allocation to Supplier A",
    color: "#f59e0b",
  },
  {
    id: 3,
    severity: "opportunity",
    icon: CheckCircle2,
    title: "Excess inventory detected",
    action: "Opportunity: Reduce excess stock worth ₹18.5 Lakh",
    color: "#10b981",
  },
  {
    id: 4,
    severity: "savings",
    icon: Tag,
    title: "Procurement saving opportunity",
    action: "Recommended: Consolidate 3 purchase orders",
    color: "#10b981",
  },
];

function SupplyAnalyticsPage() {
  // Filters State
  const [analyticsId] = useState("SA-2026-004821");
  const [analysisName, setAnalysisName] = useState("Monthly Supply Overview");
  const [period, setPeriod] = useState("01 Apr 2026 - 30 Apr 2026");
  const [businessUnit, setBusinessUnit] = useState("Magnertia Manufacturing");
  const [analysisType, setAnalysisType] = useState("Supply Overview");
  const [plant, setPlant] = useState("Chennai Plant, Bengaluru Plant");
  const [warehouse, setWarehouse] = useState("Main WH, Regional WH");
  const [productCat, setProductCat] = useState("All Categories");
  const [supplier, setSupplier] = useState("All Suppliers");
  const [generatedBy] = useState("Vikramaditya Singhania (VP Global SCM)");
  const [refreshTime, setRefreshTime] = useState("26 Apr 2026 05:30 PM");

  // Modals
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);

  const handleRefresh = () => {
    const now = new Date();
    const formatted = `${now.getDate()} ${now.toLocaleString("en-US", { month: "short" })} ${now.getFullYear()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    setRefreshTime(formatted);
    toast.success("Supply chain intelligence synchronized with live ERP streams!");
  };

  return (
    <AppShell
      title="Supply Analytics"
      breadcrumb="Management"
      description="Centralized intelligence layer for monitoring, analyzing, forecasting, and optimizing the complete supply chain."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="supply-analytics"
    >
      <div className="space-y-6">
        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active Analysis:</span>
            <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5 border-primary/20">
              {analyticsId}
            </Badge>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Live Stream Active
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => setShowAnalysisModal(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Create Analysis
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              onClick={() => setShowForecastModal(true)}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Run Forecast
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
                  More Actions
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 text-xs">
                <DropdownMenuLabel>Intelligence Operations</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowRiskModal(true)}>
                  <ShieldAlert className="h-3.5 w-3.5 mr-2 text-rose-600" />
                  Deep Risk Assessment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAiModal(true)}>
                  <Zap className="h-3.5 w-3.5 mr-2 text-amber-500" />
                  Generate AI Supply Insights
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                  <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                  Export Executive Package
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5 mr-2" />
                  Print Scorecard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
          {/* CONFIGURATION & FILTER HEADER CARD */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Analytics ID</Label>
                <Input value={analyticsId} readOnly className="h-8 text-xs font-mono font-medium bg-muted/30 mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Analysis Name</Label>
                <Input
                  value={analysisName}
                  onChange={(e) => setAnalysisName(e.target.value)}
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Analysis Period</Label>
                <Input
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="h-8 text-xs font-mono mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Business Unit</Label>
                <select
                  value={businessUnit}
                  onChange={(e) => setBusinessUnit(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background mt-1 focus:outline-none"
                >
                  <option value="Magnertia Manufacturing">Magnertia Manufacturing</option>
                  <option value="Magnertia Energy Systems">Magnertia Energy Systems</option>
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Analysis Type</Label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background mt-1 font-semibold text-blue-600 focus:outline-none"
                >
                  <option value="Supply Overview">Supply Overview</option>
                  <option value="Procurement Analytics">Procurement Analytics</option>
                  <option value="Supplier Analytics">Supplier Analytics</option>
                  <option value="Demand vs Supply Analysis">Demand vs Supply Analysis</option>
                  <option value="Inventory Analytics">Inventory Analytics</option>
                  <option value="Supply Risk Analytics">Supply Risk Analytics</option>
                  <option value="AI Supply Optimization">AI Supply Optimization</option>
                </select>
              </div>

              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Plant / Location</Label>
                <select
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background mt-1 focus:outline-none"
                >
                  <option value="Chennai Plant, Bengaluru Plant">Chennai Plant, Bengaluru Plant</option>
                  <option value="Chennai Plant">Chennai Plant</option>
                  <option value="Bengaluru Plant">Bengaluru Plant</option>
                  <option value="Hosur Manufacturing Site">Hosur Manufacturing Site</option>
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Warehouse</Label>
                <select
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background mt-1 focus:outline-none"
                >
                  <option value="Main WH, Regional WH">Main WH, Regional WH</option>
                  <option value="Chennai Main Warehouse">Chennai Main Warehouse</option>
                  <option value="Bengaluru Distribution Hub">Bengaluru Distribution Hub</option>
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Product Category</Label>
                <select
                  value={productCat}
                  onChange={(e) => setProductCat(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background mt-1 focus:outline-none"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Electrical & Power">Electrical & Power</option>
                  <option value="Electronics & Controls">Electronics & Controls</option>
                  <option value="Raw Materials & Metals">Raw Materials & Metals</option>
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Supplier</Label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background mt-1 focus:outline-none"
                >
                  <option value="All Suppliers">All Suppliers</option>
                  <option value="Strategic Tier 1 Only">Strategic Tier 1 Only</option>
                  <option value="High Risk Suppliers">High Risk Suppliers</option>
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground font-medium text-[11px]">Refresh Status</Label>
                <div className="h-8 px-2 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] flex items-center justify-between mt-1">
                  <span>Live - {refreshTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6 BIG KPI CARDS RIBBON */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* KPI 1 */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">Supply Score</span>
                <strong className="text-lg font-extrabold text-foreground font-mono block">87.6%</strong>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center">
                  ▲ 4.8% vs Mar 2026
                </span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">Fill Rate</span>
                <strong className="text-lg font-extrabold text-foreground font-mono block">94.2%</strong>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center">
                  ▲ 3.1% vs Mar 2026
                </span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">Avg Lead Time</span>
                <strong className="text-lg font-extrabold text-foreground font-mono block">8.4 Days</strong>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center">
                  ▼ 1.2 Days vs Mar 2026
                </span>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">Total Supply Value</span>
                <strong className="text-lg font-extrabold text-foreground font-mono block">₹18.65 Cr</strong>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center">
                  ▲ 12.6% vs Mar 2026
                </span>
              </div>
            </div>

            {/* KPI 5 */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">On-Time Supply Rate</span>
                <strong className="text-lg font-extrabold text-foreground font-mono block">89.1%</strong>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center">
                  ▲ 2.7% vs Mar 2026
                </span>
              </div>
            </div>

            {/* KPI 6 */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block font-medium">Supply Risk (High)</span>
                <strong className="text-lg font-extrabold text-rose-600 font-mono block">9</strong>
                <span className="text-[10px] text-rose-500 font-medium flex items-center">
                  ▲ 2 vs Mar 2026
                </span>
              </div>
            </div>
          </div>

          {/* WORKSPACE OVERVIEW */}
          <div className="space-y-5">
              {/* ROW 1: (Demand vs Supply Trend - 5 Cols) + (Supply Health Distribution - 3 Cols) + (Top Supply Risks - 4 Cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Demand vs Supply Trend (5 Cols) */}
                <div className="lg:col-span-5 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Demand vs Supply Trend
                        </h3>
                      </div>
                      <select className="h-6 text-[10px] px-2 rounded border border-border bg-background">
                        <option>Monthly</option>
                        <option>Quarterly</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        Demand (₹ Cr)
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Supply (₹ Cr)
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Supply Gap (₹ Cr)
                      </span>
                    </div>

                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={DEMAND_SUPPLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} domain={[0, 35]} />
                          <Tooltip
                            contentStyle={{
                              fontSize: "11px",
                              borderRadius: "8px",
                              backgroundColor: "hsl(var(--card))",
                              borderColor: "hsl(var(--border))",
                            }}
                          />
                          <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="gap" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Supply Health Distribution (3 Cols) */}
                <div className="lg:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Supply Health Distribution
                      </h3>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 my-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={SUPPLY_HEALTH_DATA}
                              innerRadius={40}
                              outerRadius={56}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {SUPPLY_HEALTH_DATA.map((entry, idx) => (
                                <Cell key={`hlth-${idx}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-sm font-extrabold text-foreground">87.6%</span>
                          <span className="text-[9px] text-muted-foreground">Supply Score</span>
                        </div>
                      </div>

                      <div className="w-full space-y-1.5 mt-2 text-[10px]">
                        {SUPPLY_HEALTH_DATA.map((item) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                              {item.name}
                            </span>
                            <span className="font-semibold text-foreground">
                              {item.value}% ({item.count})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Supply Risks (4 Cols) */}
                <div className="lg:col-span-4 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Top Supply Risks
                      </h3>
                      <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-200">
                        5 Active Alerts
                      </Badge>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-[11px] text-left">
                        <thead>
                          <tr className="border-b border-border/60 text-muted-foreground font-medium">
                            <th className="pb-1.5 font-medium">Risk</th>
                            <th className="pb-1.5 font-medium">Probability</th>
                            <th className="pb-1.5 font-medium">Impact</th>
                            <th className="pb-1.5 font-medium text-center">Score</th>
                            <th className="pb-1.5 font-medium text-right">Level</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {TOP_SUPPLY_RISKS.map((r, i) => (
                            <tr key={i} className="hover:bg-muted/20">
                              <td className="py-1.5 font-medium text-foreground truncate max-w-[110px]">{r.risk}</td>
                              <td className="py-1.5 text-muted-foreground">{r.probability}</td>
                              <td className="py-1.5 text-muted-foreground">{r.impact}</td>
                              <td className="py-1.5 text-center font-mono font-bold">{r.score}</td>
                              <td className="py-1.5 text-right">
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded text-[9px] font-bold",
                                  r.level === "Critical" && "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
                                  r.level === "High" && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                                  r.level === "Moderate" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                                )}>
                                  {r.level}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <Button variant="link" className="text-xs text-blue-600 h-auto p-0 font-medium" onClick={() => toast.info("Viewing all supply risks")}>
                      View All Risks →
                    </Button>
                  </div>
                </div>
              </div>

              {/* ROW 2: (Supply Gap Analysis - 3 Cols) + (Supplier Performance - 3 Cols) + (Inventory Health - 3 Cols) + (AI Insights - 3 Cols) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                {/* Supply Gap Analysis (Top 5 Materials) (3.5 Cols -> 3 cols) */}
                <div className="lg:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Supply Gap Analysis
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-mono">Top 5</span>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-[10px] text-left">
                        <thead>
                          <tr className="border-b border-border/60 text-muted-foreground font-medium">
                            <th className="pb-1 font-medium">Material</th>
                            <th className="pb-1 font-medium text-right">Demand</th>
                            <th className="pb-1 font-medium text-right">Supply</th>
                            <th className="pb-1 font-medium text-right">Gap</th>
                            <th className="pb-1 font-medium text-right">Risk</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {SUPPLY_GAP_MATERIALS.map((m, i) => (
                            <tr key={i} className="hover:bg-muted/20">
                              <td className="py-1 font-medium truncate max-w-[85px]">{m.material}</td>
                              <td className="py-1 text-right font-mono">{m.demand}</td>
                              <td className="py-1 text-right font-mono">{m.supply}</td>
                              <td className={cn(
                                "py-1 text-right font-mono font-bold",
                                m.gap.startsWith("-") ? "text-rose-600" : "text-emerald-600"
                              )}>
                                {m.gap}
                              </td>
                              <td className="py-1 text-right">
                                <span className={cn(
                                  "px-1 py-0.5 rounded text-[8px] font-bold",
                                  m.level === "Critical" && "bg-rose-100 text-rose-800",
                                  m.level === "High" && "bg-amber-100 text-amber-800",
                                  m.level === "Moderate" && "bg-yellow-100 text-yellow-800",
                                  m.level === "Healthy" && "bg-emerald-100 text-emerald-800"
                                )}>
                                  {m.level}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <Button variant="link" className="text-xs text-blue-600 h-auto p-0 font-medium" onClick={() => toast.info("Full supply gap analysis report displayed")}>
                      View Full Supply Gap Report →
                    </Button>
                  </div>
                </div>

                {/* Supplier Performance (Top 5) (3 Cols) */}
                <div className="lg:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Supplier Performance
                      </h3>
                      <span className="text-[10px] text-muted-foreground font-mono">Top 5</span>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-[10px] text-left">
                        <thead>
                          <tr className="border-b border-border/60 text-muted-foreground font-medium">
                            <th className="pb-1 font-medium">Supplier</th>
                            <th className="pb-1 font-medium text-center">Quality</th>
                            <th className="pb-1 font-medium text-center">Delivery</th>
                            <th className="pb-1 font-medium text-center">Cost</th>
                            <th className="pb-1 font-medium text-center">Lead Time</th>
                            <th className="pb-1 font-medium text-right">Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {SUPPLIER_PERFORMANCE_TOP5.map((s, i) => (
                            <tr key={i} className="hover:bg-muted/20">
                              <td className="py-1 font-medium truncate max-w-[70px]">{s.supplier}</td>
                              <td className="py-1 text-center font-mono">{s.quality}</td>
                              <td className="py-1 text-center font-mono">{s.delivery}</td>
                              <td className="py-1 text-center font-mono">{s.cost}</td>
                              <td className="py-1 text-center font-mono">{s.leadTime}</td>
                              <td className="py-1 text-right font-mono font-bold">
                                <span className={cn(
                                  "px-1 py-0.5 rounded text-[9px]",
                                  s.overall >= 88 && "bg-emerald-100 text-emerald-800",
                                  s.overall >= 75 && s.overall < 88 && "bg-amber-100 text-amber-800",
                                  s.overall < 75 && "bg-rose-100 text-rose-800"
                                )}>
                                  {s.overall}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <Button variant="link" className="text-xs text-blue-600 h-auto p-0 font-medium" onClick={() => toast.info("Displaying supplier scorecard metrics")}>
                      View Supplier Scorecard →
                    </Button>
                  </div>
                </div>

                {/* Inventory Health (3 Cols) */}
                <div className="lg:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Inventory Health
                      </h3>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative w-28 h-28 my-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={INVENTORY_HEALTH_DATA}
                              innerRadius={32}
                              outerRadius={46}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {INVENTORY_HEALTH_DATA.map((entry, idx) => (
                                <Cell key={`inv-${idx}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[11px] font-extrabold text-foreground">₹132.4 Cr</span>
                          <span className="text-[8px] text-muted-foreground">Total Inventory</span>
                        </div>
                      </div>

                      <div className="w-full space-y-1 mt-1 text-[10px]">
                        {INVENTORY_HEALTH_DATA.map((item) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                              <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              {item.name}
                            </span>
                            <span className="font-semibold text-foreground shrink-0 font-mono">
                              ₹{item.value} Cr ({item.pct})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <Button variant="link" className="text-xs text-blue-600 h-auto p-0 font-medium" onClick={() => toast.info("Displaying inventory health analytics")}>
                      View Inventory Analytics →
                    </Button>
                  </div>
                </div>

                {/* AI Insights & Recommendations (3 Cols) */}
                <div className="lg:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        AI Insights & Recommendations
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {AI_RECOMMENDATIONS_LIST.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer text-left"
                          onClick={() => {
                            setSelectedInsight(item);
                            setShowAiModal(true);
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <item.icon className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: item.color }} />
                            <div className="flex-1">
                              <strong className="text-[11px] font-semibold text-foreground block leading-tight">
                                {item.title}
                              </strong>
                              <span className="text-[10px] text-muted-foreground block mt-0.5 leading-tight">
                                {item.action}
                              </span>
                            </div>
                            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <Button variant="link" className="text-xs text-blue-600 h-auto p-0 font-medium" onClick={() => toast.info("Displaying all AI supply chain recommendations")}>
                      View All AI Insights →
                    </Button>
                  </div>
                </div>
              </div>

              {/* ROW 3: (Lead Time Trend - 3 Cols) + (Supply by Category - 3 Cols) + (Supply Cost Analysis - 3 Cols) + (Report Shortcuts - 3 Cols) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                {/* Lead Time Trend (3 Cols) */}
                <div className="lg:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Lead Time Trend
                      </h3>
                      <select className="h-5 text-[9px] px-1.5 rounded border border-border bg-background">
                        <option>6 Months</option>
                        <option>12 Months</option>
                      </select>
                    </div>

                    <div className="h-36 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={LEAD_TIME_TREND} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                          <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                          <YAxis tick={{ fontSize: 9 }} domain={[6, 12]} />
                          <Tooltip
                            contentStyle={{
                              fontSize: "10px",
                              borderRadius: "6px",
                              backgroundColor: "hsl(var(--card))",
                              borderColor: "hsl(var(--border))",
                            }}
                          />
                          <Line type="monotone" dataKey="days" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Supply by Category (3 Cols) */}
                <div className="lg:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Supply by Category
                      </h3>
                    </div>

                    <div className="space-y-2 text-[10px] py-1">
                      {SUPPLY_BY_CATEGORY.map((cat) => (
                        <div key={cat.category}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-muted-foreground">{cat.category}</span>
                            <span className="font-mono font-semibold text-foreground">
                              ₹{cat.value} Cr ({cat.pct})
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{ width: cat.pct, backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Supply Cost Analysis (3 Cols) */}
                <div className="lg:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Supply Cost Analysis
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-0.5 border-b border-border/40 font-semibold">
                        <span className="text-[11px]">Total Supply Cost</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-foreground">₹18.65 Cr</span>
                          <span className="text-[9px] text-emerald-600 block">▼ 5.8%</span>
                        </div>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40 text-[11px]">
                        <span className="text-muted-foreground">Material Cost</span>
                        <div className="text-right">
                          <span className="font-mono font-medium text-foreground">₹13.45 Cr</span>
                          <span className="text-[9px] text-emerald-600 block">▼ 6.2%</span>
                        </div>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40 text-[11px]">
                        <span className="text-muted-foreground">Transportation Cost</span>
                        <div className="text-right">
                          <span className="font-mono font-medium text-foreground">₹2.45 Cr</span>
                          <span className="text-[9px] text-emerald-600 block">▼ 3.1%</span>
                        </div>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40 text-[11px]">
                        <span className="text-muted-foreground">Handling Cost</span>
                        <div className="text-right">
                          <span className="font-mono font-medium text-foreground">₹1.25 Cr</span>
                          <span className="text-[9px] text-rose-500 block">▲ 1.6%</span>
                        </div>
                      </div>
                      <div className="flex justify-between py-0.5 text-[11px]">
                        <span className="text-muted-foreground">Inventory Carrying Cost</span>
                        <div className="text-right">
                          <span className="font-mono font-medium text-foreground">₹1.50 Cr</span>
                          <span className="text-[9px] text-emerald-600 block">▼ 7.4%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Shortcuts (3 Cols) */}
                <div className="lg:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Report Shortcuts
                      </h3>
                    </div>

                    <div className="grid grid-cols-4 gap-2 py-1">
                      <button
                        onClick={() => toast.info("Viewing Supply Overview")}
                        className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                      >
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span className="text-[9px] leading-tight text-foreground font-medium">Supply Overview</span>
                      </button>

                      <button
                        onClick={() => toast.info("Demand vs Supply trend: 94.2% fulfillment rate")}
                        className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                      >
                        <Repeat className="h-4 w-4 text-emerald-600" />
                        <span className="text-[9px] leading-tight text-foreground font-medium">Demand vs Supply</span>
                      </button>

                      <button
                        onClick={() => toast.info("Supplier Scorecard: 48 active qualified vendors")}
                        className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                      >
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="text-[9px] leading-tight text-foreground font-medium">Supplier Perf</span>
                      </button>

                      <button
                        onClick={() => toast.info("Inventory turnover ratio: 4.8x with ₹18.4 Cr holding")}
                        className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                      >
                        <Boxes className="h-4 w-4 text-amber-600" />
                        <span className="text-[9px] leading-tight text-foreground font-medium">Inventory Analytics</span>
                      </button>

                      <button
                        onClick={() => toast.info("Active supply risks: 3 critical items monitored")}
                        className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                      >
                        <ShieldAlert className="h-4 w-4 text-rose-600" />
                        <span className="text-[9px] leading-tight text-foreground font-medium">Risk Analysis</span>
                      </button>

                      <button
                        onClick={() => toast.info("Supply Cost Analysis: ₹42.8 Cr total monthly procurement")}
                        className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                      >
                        <DollarSign className="h-4 w-4 text-cyan-600" />
                        <span className="text-[9px] leading-tight text-foreground font-medium">Cost Analysis</span>
                      </button>

                      <button
                        onClick={() => toast.info("Lead Time Variance: Average 14.2 days vs 12.0 target")}
                        className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                      >
                        <Clock className="h-4 w-4 text-indigo-600" />
                        <span className="text-[9px] leading-tight text-foreground font-medium">Lead Time</span>
                      </button>

                      <button
                        onClick={() => toast.info("Sustainability metrics: 82% green packaging compliance")}
                        className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                      >
                        <Leaf className="h-4 w-4 text-emerald-600" />
                        <span className="text-[9px] leading-tight text-foreground font-medium">Sustainability</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>

      {/* MODALS */}
      {/* 1. Create Analysis Modal */}
      <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create Custom Supply Analysis</DialogTitle>
            <DialogDescription>Define dimensions and time horizons for a new reporting run.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label>Analysis Title</Label>
              <Input placeholder="e.g. Q2 Raw Materials Bottleneck Analysis" defaultValue="Q2 Raw Materials Bottleneck Analysis" className="h-8" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Analysis Type</Label>
                <select className="w-full h-8 px-2 border rounded text-xs bg-background">
                  <option>Demand vs Supply Analysis</option>
                  <option>Supplier Performance Review</option>
                  <option>Lead Time Optimization</option>
                  <option>Supply Risk Heatmap</option>
                </select>
              </div>
              <div>
                <Label>Granularity</Label>
                <select className="w-full h-8 px-2 border rounded text-xs bg-background">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowAnalysisModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("New Supply Analysis pipeline compiled!"); setShowAnalysisModal(false); }}>
              Generate Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Run Forecast Modal */}
      <Dialog open={showForecastModal} onOpenChange={setShowForecastModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Run AI Supply Forecast Engine</DialogTitle>
            <DialogDescription>Simulate demand curves and projected supplier capacity.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded bg-blue-50/50 border border-blue-200 text-blue-900 space-y-1">
              <strong>Forecasting Horizon: 6 Months Ahead (May - Oct 2026)</strong>
              <p className="text-[11px] text-muted-foreground">Incorporates historical orders, open tender pipelines, and macroeconomic commodity index data.</p>
            </div>
            <div>
              <Label>Simulation Scenario</Label>
              <select className="w-full h-8 px-2 border rounded text-xs bg-background font-semibold">
                <option>Baseline Consensus Plan (Recommended)</option>
                <option>High Growth (+20% Demand Surge)</option>
                <option>Supply Chain Constrained (-15% Global Logistics)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowForecastModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("AI Forecast simulated successfully! Results updated in dashboard."); setShowForecastModal(false); }}>
              Execute Forecast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Deep Risk Assessment Modal */}
      <Dialog open={showRiskModal} onOpenChange={setShowRiskModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Supply Risk Mitigation Action</DialogTitle>
            <DialogDescription>Apply automated safeguard protocols to critical components.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800">
              <strong>Critical Item: Copper Cable 6mm (Shortage: -10,700 M)</strong>
              <p className="text-[11px] mt-0.5">Current lead time increased by 3 days with Supplier C.</p>
            </div>
            <div className="space-y-1 pt-1">
              <Label>Select Safeguard Action</Label>
              <select className="w-full h-8 px-2 border rounded text-xs bg-background font-medium">
                <option>Issue Emergency Expedited PO to Supplier A</option>
                <option>Draw from Regional Strategic Buffer Warehouse</option>
                <option>Re-prioritize Project Work-Order Allocation</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowRiskModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("Risk mitigation order dispatched to procurement team!"); setShowRiskModal(false); }}>
              Confirm Safeguard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. AI Insight Deep Dive Modal */}
      <Dialog open={showAiModal} onOpenChange={setShowAiModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>AI Supply Chain Recommendation</DialogTitle>
            <DialogDescription>Detailed analytical justification and execution steps.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg border bg-blue-50/30 border-blue-200 space-y-1">
              <strong className="text-foreground text-xs block">
                {selectedInsight ? selectedInsight.title : "Copper Cable shortage predicted in 12 days"}
              </strong>
              <p className="text-muted-foreground text-xs">
                {selectedInsight ? selectedInsight.action : "Recommended: Increase PO quantity by 8,500 meters"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-foreground">Operational Impact:</span>
              <ul className="list-disc pl-4 text-muted-foreground space-y-0.5 text-[11px]">
                <li>Prevents estimated 4-day assembly line halt on Power Module line 2</li>
                <li>Estimated cost saving through early bulk PO commitment: ₹85,000</li>
                <li>Delivery feasibility verified with Supplier A (Current lead time: 8 days)</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowAiModal(false)}>Close</Button>
            <Button size="sm" onClick={() => { toast.success("Automated procurement requisition created from AI insight!"); setShowAiModal(false); }}>
              Apply Recommendation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Export Supply Intelligence Report</DialogTitle>
            <DialogDescription>Download comprehensive boardroom analytics dossier.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <div>
              <Label>File Format</Label>
              <select className="w-full h-8 px-2 border rounded text-xs bg-background">
                <option>PDF Executive Report (Color Charts)</option>
                <option>Excel Raw Data Package (.xlsx)</option>
                <option>CSV Raw Time-Series Dump</option>
              </select>
            </div>
            <div>
              <Label>Included Modules</Label>
              <div className="space-y-1 text-muted-foreground pt-1">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Demand vs Supply Matrix</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Supplier Scorecard & Rankings</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Supply Risk Heatmap</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> AI Prescriptive Insights</label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowExportModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("Supply Analytics Dossier exported!"); setShowExportModal(false); }}>
              Download Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}


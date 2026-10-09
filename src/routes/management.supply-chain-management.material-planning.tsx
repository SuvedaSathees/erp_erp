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
  QrCode,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Coins,
  History,
  ClipboardList,
  Scale,
  Gauge,
  Cpu,
  Layers3,
  GitBranch,
  Split,
  Workflow,
  CheckSquare,
  Send,
  MoreVertical,
  Columns3,
  ArrowUpDown,
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
import { exportPageReport } from "@/lib/recordExport";
import { savePageForm, refreshPageData, openQuickActions, openPageViewer } from "@/lib/pageActions";

export const Route = createFileRoute("/management/supply-chain-management/material-planning")({
  head: () => ({
    meta: [
      { title: "Material Planning Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Material Requirements Planning (MRP), BOM explosion, net material requirements, multi-source allocation, and shortage management.",
      },
    ],
  }),
  component: MaterialPlanningPage,
});

/* ===========================================================================
   Data Constants & Mock State for Material Planning
   =========================================================================== */

interface TopRequirementItem {
  code: string;
  name: string;
  grossReq: number;
  netReq: number;
  uom: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Shortage" | "Low Stock" | "Risk" | "Available";
}

const TOP_REQUIREMENTS: TopRequirementItem[] = [
  { code: "MAT-1001", name: "Steel Sheet 2mm", grossReq: 10000, netReq: 3800, uom: "Kg", priority: "High", status: "Shortage" },
  { code: "MAT-1002", name: "Copper Cable 6mm", grossReq: 5000, netReq: 500, uom: "M", priority: "High", status: "Low Stock" },
  { code: "MAT-1003", name: "Power Module 60KW", grossReq: 1200, netReq: 100, uom: "Nos", priority: "Critical", status: "Risk" },
  { code: "MAT-1004", name: "Enclosure Box", grossReq: 1000, netReq: 0, uom: "Nos", priority: "Medium", status: "Available" },
  { code: "MAT-1005", name: "Cooling Fan", grossReq: 1500, netReq: 0, uom: "Nos", priority: "Medium", status: "Available" },
];

interface NetMaterialRow {
  code: string;
  name: string;
  grossRequirement: string;
  grossQty: number;
  onHand: number;
  openPo: number;
  inTransit: number;
  totalAvailable: number;
  netRequirement: number;
  requiredDate: string;
  leadTimeDays: number;
  suggestedSource: "Purchase" | "Inventory" | "Transfer" | "Production" | "Subcontract";
  uom: string;
}

const NET_MATERIAL_ROWS: NetMaterialRow[] = [
  {
    code: "MAT-1001",
    name: "Steel Sheet 2mm",
    grossRequirement: "10,000 Kg",
    grossQty: 10000,
    onHand: 4200,
    openPo: 2000,
    inTransit: 1000,
    totalAvailable: 7200,
    netRequirement: 3800,
    requiredDate: "15 Apr 2026",
    leadTimeDays: 12,
    suggestedSource: "Purchase",
    uom: "Kg",
  },
  {
    code: "MAT-1002",
    name: "Copper Cable 6mm",
    grossRequirement: "5,000 M",
    grossQty: 5000,
    onHand: 3500,
    openPo: 1000,
    inTransit: 0,
    totalAvailable: 4500,
    netRequirement: 500,
    requiredDate: "12 Apr 2026",
    leadTimeDays: 7,
    suggestedSource: "Purchase",
    uom: "M",
  },
  {
    code: "MAT-1003",
    name: "Power Module 60KW",
    grossRequirement: "1,200 Nos",
    grossQty: 1200,
    onHand: 800,
    openPo: 300,
    inTransit: 0,
    totalAvailable: 1100,
    netRequirement: 100,
    requiredDate: "20 Apr 2026",
    leadTimeDays: 30,
    suggestedSource: "Purchase",
    uom: "Nos",
  },
  {
    code: "MAT-1004",
    name: "Enclosure Box",
    grossRequirement: "1,000 Nos",
    grossQty: 1000,
    onHand: 1100,
    openPo: 0,
    inTransit: 0,
    totalAvailable: 1100,
    netRequirement: 0,
    requiredDate: "10 Apr 2026",
    leadTimeDays: 5,
    suggestedSource: "Inventory",
    uom: "Nos",
  },
  {
    code: "MAT-1005",
    name: "Cooling Fan",
    grossRequirement: "1,500 Nos",
    grossQty: 1500,
    onHand: 950,
    openPo: 200,
    inTransit: 100,
    totalAvailable: 1250,
    netRequirement: 250,
    requiredDate: "18 Apr 2026",
    leadTimeDays: 6,
    suggestedSource: "Transfer",
    uom: "Nos",
  },
];

const READINESS_DONUT_DATA = [
  { name: "Available", value: 72, count: 171, color: "#10b981" },
  { name: "Low Stock", value: 18, count: 43, color: "#f59e0b" },
  { name: "Critical Shortage", value: 10, count: 24, color: "#ef4444" },
];

const SOURCE_BAR_DATA = [
  { source: "Purchase", quantity: 18250, color: "#2563eb" },
  { source: "Transfer", quantity: 6500, color: "#10b981" },
  { source: "Production", quantity: 4800, color: "#9333ea" },
  { source: "Subcontract", quantity: 700, color: "#ea580c" },
];

/* ===========================================================================
   Component Definition
   =========================================================================== */

function MaterialPlanningPage() {
  // Header State
  const [planNumber, setPlanNumber] = useState("MP-2026-000184");
  const [planName, setPlanName] = useState("Monthly Material Plan - Apr 2026");
  const [planningType, setPlanningType] = useState("Material Requirements Planning (MRP)");
  const [planningPeriod, setPlanningPeriod] = useState("01 Apr 2026 - 30 Apr 2026");
  const [demandRef, setDemandRef] = useState("DP-2026-000156");
  const [productionPlanRef, setProductionPlanRef] = useState("PP-2026-000112");
  const [supplyPlanRef, setSupplyPlanRef] = useState("SP-2026-000089");
  const [version, setVersion] = useState("1");
  const [businessUnit, setBusinessUnit] = useState("Electro Mobility");
  const [plant, setPlant] = useState("Main Manufacturing Plant");
  const [planner, setPlanner] = useState("Priya Sharma");
  const [planStatus, setPlanStatus] = useState("Under Review");

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showRunMrpModal, setShowRunMrpModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showGeneratePrModal, setShowGeneratePrModal] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);

  const filteredMaterials = useMemo(() => {
    if (!searchTerm.trim()) return NET_MATERIAL_ROWS;
    return NET_MATERIAL_ROWS.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <AppShell
      title="Material Planning"
      breadcrumb="Management"
      description="Ensure the right materials are available in the right quantity, at the right location, and at the right time to support production."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="material-planning"
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
              {planStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRunMrpModal(true)}
              className="h-8 gap-1.5 font-medium border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 text-xs"
            >
              <Play className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
              <span>Run MRP</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAvailabilityModal(true)}
              className="h-8 gap-1.5 font-medium text-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Check Availability</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={(e) => savePageForm("Draft saved", e.currentTarget)}
              className="h-8 gap-1.5 font-medium text-xs"
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Save Draft</span>
            </Button>

            <Button
              size="sm"
              onClick={(e) => savePageForm("Material plan submitted to SCM Director for approval", e.currentTarget)}
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm text-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit for Approval</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                  <span>More</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs">Material Plan Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowGeneratePrModal(true)} className="gap-2 text-xs cursor-pointer">
                  <ShoppingCart className="h-3.5 w-3.5 text-emerald-600" /> Generate Purchase Requisitions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowScenarioModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Split className="h-3.5 w-3.5 text-purple-600" /> What-If Scenario Analysis
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSubstitutionModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Repeat className="h-3.5 w-3.5 text-amber-600" /> Material Substitution
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void refreshPageData("BOM explosion")} className="gap-2 text-xs cursor-pointer">
                  <Cpu className="h-3.5 w-3.5 text-blue-600" /> Refresh Multi-Level BOM
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()} className="gap-2 text-xs cursor-pointer">
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print Material Schedule
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void exportPageReport("Net Material Requirements", "xlsx")} className="gap-2 text-xs cursor-pointer">
                  <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export Requirements (CSV)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* ===================================================================
            SECTION 1: TOP DUAL CARDS
            Left (2/3): Material Planning Header | Right (1/3): Plan Summary
            =================================================================== */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* LEFT CARD (8 COLS): 1. Material Planning Header */}
          <div className="lg:col-span-8 card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground tracking-tight">1. Material Planning Header</h3>
                  <button
                    type="button"
                    title="Material requirements planning parameters"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Badge variant="outline" className="text-xs font-mono font-bold text-primary bg-primary/5 border-primary/20">
                  {planNumber}
                </Badge>
              </div>

              {/* Form Fields Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Material Plan Number *</span>
                  <div className="mt-1 font-mono font-bold text-foreground py-1 border rounded-md px-2 bg-muted/20">
                    {planNumber}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Plan Name *</span>
                  <Input
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="mt-1 text-xs font-medium h-7"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Planning Type *</span>
                  <select
                    value={planningType}
                    onChange={(e) => setPlanningType(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground h-7"
                  >
                    <option>Material Requirements Planning (MRP)</option>
                    <option>Production Material Planning</option>
                    <option>Project Material Planning</option>
                    <option>Procurement Material Planning</option>
                    <option>Replenishment Planning</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Planning Period *</span>
                  <div className="mt-1 flex items-center gap-1.5 border rounded-md px-2 py-1 bg-background text-foreground h-7 font-mono text-[11px]">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{planningPeriod}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Demand Reference *</span>
                  <select
                    value={demandRef}
                    onChange={(e) => setDemandRef(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-mono font-semibold text-primary h-7"
                  >
                    <option>DP-2026-000156</option>
                    <option>DP-2026-000155</option>
                    <option>SO-2026-0842 (Direct)</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Production Plan Reference</span>
                  <select
                    value={productionPlanRef}
                    onChange={(e) => setProductionPlanRef(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-mono text-muted-foreground h-7"
                  >
                    <option>PP-2026-000112</option>
                    <option>PP-2026-000111</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Supply Plan Reference</span>
                  <select
                    value={supplyPlanRef}
                    onChange={(e) => setSupplyPlanRef(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-mono text-muted-foreground h-7"
                  >
                    <option>SP-2026-000089</option>
                    <option>SP-2026-000088</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Version</span>
                  <div className="mt-1 font-mono font-bold text-foreground py-1 px-2 border rounded-md bg-muted/20 h-7 flex items-center">
                    {version}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Business Unit</span>
                  <select
                    value={businessUnit}
                    onChange={(e) => setBusinessUnit(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground h-7"
                  >
                    <option>Electro Mobility</option>
                    <option>Power Electronics</option>
                    <option>Industrial Systems</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Plant / Facility *</span>
                  <select
                    value={plant}
                    onChange={(e) => setPlant(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground h-7"
                  >
                    <option>Main Manufacturing Plant</option>
                    <option>Pune Component Facility</option>
                    <option>Bengaluru Battery Center</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Planner *</span>
                  <select
                    value={planner}
                    onChange={(e) => setPlanner(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground h-7"
                  >
                    <option>Priya Sharma</option>
                    <option>Vikram Malhotra</option>
                    <option>Anil Kapoor</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Plan Status</span>
                  <select
                    value={planStatus}
                    onChange={(e) => setPlanStatus(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border-amber-200 h-7"
                  >
                    <option>Under Review</option>
                    <option>Approved</option>
                    <option>Draft</option>
                    <option>Shortage Identified</option>
                    <option>Released</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD (4 COLS): Plan Summary (6 Tiles in 2x3 Grid) */}
          <div className="lg:col-span-4 card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-base text-foreground tracking-tight">Plan Summary</h3>
                <span className="text-xs text-muted-foreground font-mono">FY 2026-27</span>
              </div>

              {/* 2x3 Grid matching mockup */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {/* 1. Total Requirement */}
                <div className="p-3 rounded-lg border bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Total Requirement</span>
                    <div className="text-base font-bold font-mono text-foreground mt-0.5">1,28,700</div>
                    <span className="text-[10px] text-muted-foreground">Units</span>
                  </div>
                </div>

                {/* 2. Net Requirement */}
                <div className="p-3 rounded-lg border bg-amber-50/40 dark:bg-amber-950/20 border-amber-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Net Requirement</span>
                    <div className="text-base font-bold font-mono text-foreground mt-0.5">30,250</div>
                    <span className="text-[10px] text-muted-foreground">Units</span>
                  </div>
                </div>

                {/* 3. Material Readiness */}
                <div className="p-3 rounded-lg border bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                    <Gauge className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Material Readiness</span>
                    <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">91.4%</div>
                    <span className="text-[10px] text-emerald-700 font-medium">Target: 90%+</span>
                  </div>
                </div>

                {/* 4. Materials */}
                <div className="p-3 rounded-lg border bg-purple-50/40 dark:bg-purple-950/20 border-purple-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Materials</span>
                    <div className="text-base font-bold font-mono text-foreground mt-0.5">238</div>
                    <span className="text-[10px] text-muted-foreground">Items</span>
                  </div>
                </div>

                {/* 5. Critical Shortages */}
                <div className="p-3 rounded-lg border bg-rose-50/40 dark:bg-rose-950/20 border-rose-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Critical Shortages</span>
                    <div className="text-base font-bold font-mono text-rose-600 mt-0.5">7</div>
                    <span className="text-[10px] text-rose-700 font-medium">Items</span>
                  </div>
                </div>

                {/* 6. Est. Plan Cost */}
                <div className="p-3 rounded-lg border bg-sky-50/40 dark:bg-sky-950/20 border-sky-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Est. Plan Cost</span>
                    <div className="text-base font-bold font-mono text-sky-600 mt-0.5">₹ 4.58 Cr</div>
                    <span className="text-[10px] text-muted-foreground">Budget Allocated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 2: MATERIAL PLANNING WORKSPACE
            =================================================================== */}
        <div className="space-y-6">
          {/* Row 1: 6 Metric Summary Cards */}
            <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {/* Card 1: Total Materials */}
              <div className="card-soft p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
                  <Boxes className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Total Materials</span>
                  <div className="text-lg font-bold font-mono text-foreground mt-0.5">238</div>
                  <span className="text-[10px] text-muted-foreground">Items</span>
                </div>
              </div>

              {/* Card 2: Gross Requirement */}
              <div className="card-soft p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Gross Requirement</span>
                  <div className="text-lg font-bold font-mono text-foreground mt-0.5">1,28,700</div>
                  <span className="text-[10px] text-muted-foreground">Units</span>
                </div>
              </div>

              {/* Card 3: Available Inventory */}
              <div className="card-soft p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Available Inventory</span>
                  <div className="text-lg font-bold font-mono text-foreground mt-0.5">98,450</div>
                  <span className="text-[10px] text-muted-foreground">Units</span>
                </div>
              </div>

              {/* Card 4: Open POs / Receipts */}
              <div className="card-soft p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Open POs / Receipts</span>
                  <div className="text-lg font-bold font-mono text-foreground mt-0.5">42,600</div>
                  <span className="text-[10px] text-muted-foreground">Units</span>
                </div>
              </div>

              {/* Card 5: Net Requirement */}
              <div className="card-soft p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600">
                  <ArrowDownToLine className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Net Requirement</span>
                  <div className="text-lg font-bold font-mono text-rose-600 mt-0.5">30,250</div>
                  <span className="text-[10px] text-rose-700">Units</span>
                </div>
              </div>

              {/* Card 6: On-Time Delivery Risk */}
              <div className="card-soft p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">On-Time Delivery Risk</span>
                  <div className="text-lg font-bold font-mono text-orange-600 mt-0.5">5</div>
                  <span className="text-[10px] text-orange-700">Materials</span>
                </div>
              </div>
            </div>

            {/* Row 2: Top Material Requirements (FULL SIZE - No Side Scrollbar) */}
            <div className="card-soft p-5 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Top Material Requirements</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Critical material deficits, net requirements, and real-time inventory statuses</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => openPageViewer("Critical Materials", e.currentTarget)}
                  className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  View All Materials <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div
                className="w-full overflow-x-auto no-scrollbar scrollbar-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] text-muted-foreground uppercase border-b bg-muted/20">
                    <tr>
                      <th className="py-2.5 px-3">Material Code</th>
                      <th className="py-2.5 px-3">Material Name</th>
                      <th className="py-2.5 px-3 text-right">Gross Req.</th>
                      <th className="py-2.5 px-3 text-right">Net Req.</th>
                      <th className="py-2.5 px-3 text-center">UOM</th>
                      <th className="py-2.5 px-3 text-center">Priority</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {TOP_REQUIREMENTS.map((row) => (
                      <tr key={row.code} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-medium text-primary whitespace-nowrap">{row.code}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{row.name}</td>
                        <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap">{row.grossReq.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold whitespace-nowrap">{row.netReq.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-muted-foreground whitespace-nowrap">{row.uom}</td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              "text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block",
                              row.priority === "Critical" && "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
                              row.priority === "High" && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                              row.priority === "Medium" && "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            )}
                          >
                            {row.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-semibold px-2 py-0.5",
                              row.status === "Shortage" && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
                              row.status === "Low Stock" && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
                              row.status === "Risk" && "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400",
                              row.status === "Available" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            )}
                          >
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Row 3: Visual Intelligence (Material Readiness Donut & Net Requirement by Source Bar) */}
            <div className="grid gap-5 grid-cols-1 lg:grid-cols-12">
              {/* Panel 1 (5 cols): Material Readiness Donut */}
              <div className="lg:col-span-5 card-soft p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">Material Readiness & Availability</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Readiness ratio across active manufacturing schedules</p>
                    </div>
                  </div>
                  <div className="py-2 flex flex-col sm:flex-row items-center justify-around gap-4">
                    <div className="relative h-32 w-32 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={READINESS_DONUT_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={36}
                            outerRadius={54}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {READINESS_DONUT_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-lg font-bold font-mono text-emerald-600 leading-none">91.4%</span>
                        <span className="text-[9px] font-medium text-muted-foreground mt-0.5">Ready</span>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto space-y-2 text-xs flex-1 max-w-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span className="text-foreground font-medium text-[11px]">Available</span>
                        </div>
                        <span className="font-mono font-bold text-foreground text-[11px]">72% (171)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                          <span className="text-foreground font-medium text-[11px]">Low Stock</span>
                        </div>
                        <span className="font-mono font-bold text-foreground text-[11px]">18% (43)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          <span className="text-foreground font-medium text-[11px]">Critical Shortage</span>
                        </div>
                        <span className="font-mono font-bold text-rose-600 text-[11px]">10% (24)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end">
                  <button
                    type="button"
                    onClick={() => toast.info("Inventory readiness: 68% fully covered on-hand, 20% in transit, 12% deficit.")}
                    className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    View Readiness Details <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Panel 2 (7 cols): Net Requirement by Source Bar Chart */}
              <div className="lg:col-span-7 card-soft p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">Net Requirement by Source</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Fulfillment allocation across internal and external procurement</p>
                    </div>
                  </div>
                  <div className="h-48 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={SOURCE_BAR_DATA} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="source" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `${val / 1000}K`} />
                        <Tooltip
                          contentStyle={{ fontSize: "11px", borderRadius: "6px" }}
                          formatter={(value: any) => [`${Number(value).toLocaleString()} Units`, "Requirement"]}
                        />
                        <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
                          {SOURCE_BAR_DATA.map((entry, index) => (
                            <Cell key={`bar-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end">
                  <button
                    type="button"
                    onClick={() => toast.info("Procurement plan: 68,000 units PO, 32,500 units Subcontract, 18,200 units Inter-plant.")}
                    className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    View Procurement Plan <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Bottom Full Table: Net Material Requirements */}
            <div className="card-soft p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h4 className="font-semibold text-sm text-foreground">Net Material Requirements</h4>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search material..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8 pl-8 text-xs w-56"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <Filter className="h-3.5 w-3.5" /> Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <Columns3 className="h-3.5 w-3.5" /> Columns
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div
                className="overflow-x-auto no-scrollbar scrollbar-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] text-muted-foreground uppercase border-b bg-muted/20">
                    <tr>
                      <th className="py-2.5 px-3">Material Code</th>
                      <th className="py-2.5 px-3">Material Name</th>
                      <th className="py-2.5 px-3 text-right">Gross Requirement</th>
                      <th className="py-2.5 px-3 text-center border-x" colSpan={4}>
                        Availability
                      </th>
                      <th className="py-2.5 px-3 text-right">Net Requirement</th>
                      <th className="py-2.5 px-3">Required Date</th>
                      <th className="py-2.5 px-3 text-center">Lead Time (Days)</th>
                      <th className="py-2.5 px-3">Suggested Source</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                    <tr className="border-b text-[9px] bg-muted/10 text-muted-foreground">
                      <th />
                      <th />
                      <th />
                      <th className="py-1 px-2 text-right">On-Hand</th>
                      <th className="py-1 px-2 text-right">Open PO</th>
                      <th className="py-1 px-2 text-right">In Transit</th>
                      <th className="py-1 px-2 text-right font-semibold text-foreground">Total Available</th>
                      <th />
                      <th />
                      <th />
                      <th />
                      <th />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredMaterials.map((row) => (
                      <tr key={row.code} className="hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-mono font-medium text-primary">{row.code}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{row.name}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">{row.grossRequirement}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-muted-foreground">{row.onHand.toLocaleString()}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-muted-foreground">{row.openPo.toLocaleString()}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-muted-foreground">{row.inTransit.toLocaleString()}</td>
                        <td className="py-2.5 px-2 text-right font-mono font-semibold text-emerald-600 bg-emerald-500/5">
                          {row.totalAvailable.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                          {row.netRequirement > 0 ? row.netRequirement.toLocaleString() : "0"}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{row.requiredDate}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{row.leadTimeDays}</td>
                        <td className="py-2.5 px-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-semibold",
                              row.suggestedSource === "Purchase" && "bg-blue-50 text-blue-700 border-blue-200",
                              row.suggestedSource === "Inventory" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                              row.suggestedSource === "Transfer" && "bg-purple-50 text-purple-700 border-purple-200",
                              row.suggestedSource === "Production" && "bg-indigo-50 text-indigo-700 border-indigo-200"
                            )}
                          >
                            {row.suggestedSource}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Create Purchase Requisition"
                              onClick={() => {
                                setShowGeneratePrModal(true);
                              }}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Options"
                              onClick={(e) => openQuickActions(e)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              <div className="mt-4 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>Showing 1 to 5 of 238 entries</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span>Rows per page:</span>
                    <select className="border rounded bg-background px-1.5 py-0.5 text-xs font-mono">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled>
                      &lt;
                    </Button>
                    <Button variant="default" size="sm" className="h-7 w-7 p-0 bg-blue-600 text-white font-mono">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 font-mono">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 font-mono">
                      3
                    </Button>
                    <span className="px-1 text-muted-foreground">...</span>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 font-mono">
                      24
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                      &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* ===================================================================
          MODALS
          =================================================================== */}

      {/* 1. Run MRP Modal */}
      <Dialog open={showRunMrpModal} onOpenChange={setShowRunMrpModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Execute MRP Engine (BOM Explosion)</DialogTitle>
            <DialogDescription>Run automated material netting against active inventory and open orders.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Demand Source Plan</Label>
              <Input defaultValue="DP-2026-000156 (Approved Demand Plan)" disabled className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-xs">BOM Explosion Depth</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>Multi-Level (Full Tree Explosion)</option>
                <option>Single Level (Direct Components Only)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="includeSafetyStock" defaultChecked className="rounded" />
              <Label htmlFor="includeSafetyStock" className="text-xs font-normal">Include Safety Stock in Net Requirement Calculation</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowRunMrpModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowRunMrpModal(false);
                toast.success("MRP calculation executed. 238 materials netted successfully.");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start MRP Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Check Availability Modal */}
      <Dialog open={showAvailabilityModal} onOpenChange={setShowAvailabilityModal}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Real-Time Stock Availability Netting</DialogTitle>
            <DialogDescription>Verify live physical on-hand stock and inbound transit across all warehouses.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <div className="flex justify-between"><span>Physical On-Hand:</span><strong className="font-mono">98,450 Units</strong></div>
              <div className="flex justify-between"><span>Open Purchase Orders:</span><strong className="font-mono">42,600 Units</strong></div>
              <div className="flex justify-between"><span>Committed / Reserved:</span><strong className="font-mono text-rose-600">- 16,750 Units</strong></div>
              <div className="flex justify-between border-t pt-1 font-bold"><span>Net Available:</span><strong className="font-mono text-emerald-600">1,24,300 Units</strong></div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowAvailabilityModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Generate PR Modal */}
      <Dialog open={showGeneratePrModal} onOpenChange={setShowGeneratePrModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Generate Automated Purchase Requisitions</DialogTitle>
            <DialogDescription>Convert net material deficits into approved Purchase Requisitions for Procurement.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div className="p-2.5 rounded border bg-blue-50/40 text-blue-800 dark:text-blue-300">
              7 Shortage materials selected for procurement requisition totaling <strong>₹ 34,80,000</strong>.
            </div>
            <div>
              <Label className="text-xs">Required By Date</Label>
              <Input type="date" defaultValue="2026-04-15" className="mt-1 text-xs font-mono" />
            </div>
            <div>
              <Label className="text-xs">Requisition Type</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>Standard MRP Requisition</option>
                <option>Urgent / Expedited Requisition</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowGeneratePrModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowGeneratePrModal(false);
                toast.success("Purchase Requisitions PR-2026-0310 through 0316 created.");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Generate PRs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. What-If Scenario Analysis Modal */}
      <Dialog open={showScenarioModal} onOpenChange={setShowScenarioModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Material Planning Scenario Simulation</DialogTitle>
            <DialogDescription>Simulate demand surges, supplier delays, and evaluate impact on production continuity.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Select Scenario</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>High Demand Surge (+20% Gross Requirement)</option>
                <option>Supplier Port Delay (+14 Days Lead Time)</option>
                <option>Component Shortage (-30% Availability)</option>
                <option>Low Demand Reduction (-15% Gross Requirement)</option>
              </select>
            </div>
            <div className="p-3 rounded-lg border bg-muted/20">
              <span className="font-semibold text-xs text-foreground block">Projected Impact:</span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Net Requirement expands to 48,200 Units (+17,950 Units). Additional working capital needed: ₹ 72 Lakhs.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowScenarioModal(false)}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowScenarioModal(false);
                toast.success("Scenario simulation complete. Mitigation actions generated.");
              }}
            >
              Apply Simulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Material Substitution Modal */}
      <Dialog open={showSubstitutionModal} onOpenChange={setShowSubstitutionModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Material Substitution Approval</DialogTitle>
            <DialogDescription>Approve engineering-validated alternative material for critical shortage.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Original Material</Label>
              <Input defaultValue="MAT-1003: Power Module 60KW" disabled className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Approved Substitute</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>MAT-1003-ALT: High-Efficiency SiC Power Module 60KW</option>
                <option>MAT-1003-GEN2: Gen-2 Dual Inverter Unit</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Substitution Ratio</Label>
                <Input defaultValue="1.0 : 1.0" disabled className="mt-1 font-mono text-xs" />
              </div>
              <div>
                <Label className="text-xs">Cost Variance</Label>
                <Input defaultValue="+ ₹ 450 / unit" disabled className="mt-1 font-mono text-xs text-amber-600" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowSubstitutionModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowSubstitutionModal(false);
                toast.success("Material substitution approved. BOM allocation updated.");
              }}
            >
              Approve Substitute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}


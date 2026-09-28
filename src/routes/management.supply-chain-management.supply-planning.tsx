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

export const Route = createFileRoute("/management/supply-chain-management/supply-planning")({
  head: () => ({
    meta: [
      { title: "Supply Planning Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise supply planning, net requirement calculations, inventory netting, capacity constraints, and procurement schedules.",
      },
    ],
  }),
  component: SupplyPlanningPage,
});

/* ===========================================================================
   Data Constants & Mock State for Supply Planning
   =========================================================================== */

const SUPPLY_WORKFLOW_STEPS = [
  { id: "draft", label: "Draft", status: "completed" },
  { id: "demand-imported", label: "Demand Imported", status: "completed" },
  { id: "inventory-analysis", label: "Inventory Analysis", status: "completed" },
  { id: "supply-calc", label: "Supply Calculation", status: "completed" },
  { id: "constraint-analysis", label: "Constraint Analysis", status: "completed" },
  { id: "supply-plan-gen", label: "Supply Plan Generated", status: "completed" },
  { id: "planner-review", label: "Planner Review", status: "current" },
  { id: "pending-approval", label: "Pending Approval", status: "upcoming" },
  { id: "approved", label: "Approved", status: "upcoming" },
  { id: "released", label: "Released", status: "upcoming" },
  { id: "execution-monitoring", label: "Execution Monitoring", status: "upcoming" },
];

const DEMAND_VS_SUPPLY_SUMMARY = [
  { period: "Apr 2026", totalDemand: 10200, netAvailableSupply: 7800, netRequirement: 2400, readiness: 76.5, status: "low" },
  { period: "May 2026", totalDemand: 11300, netAvailableSupply: 8700, netRequirement: 2600, readiness: 77.0, status: "low" },
  { period: "Jun 2026", totalDemand: 12800, netAvailableSupply: 9500, netRequirement: 3300, readiness: 74.2, status: "low" },
  { period: "Jul 2026", totalDemand: 11900, netAvailableSupply: 10600, netRequirement: 1300, readiness: 89.1, status: "good" },
  { period: "Aug 2026", totalDemand: 10900, netAvailableSupply: 9900, netRequirement: 1000, readiness: 90.8, status: "good" },
];

const SUPPLY_SOURCE_BREAKDOWN = [
  { name: "Inventory", units: 18500, percentage: 41.9, color: "#2563eb" },
  { name: "Procurement", units: 16700, percentage: 37.8, color: "#10b981" },
  { name: "Production", units: 7800, percentage: 17.6, color: "#f59e0b" },
  { name: "Transfer", units: 1000, percentage: 2.3, color: "#8b5cf6" },
  { name: "Subcontracting", units: 200, percentage: 0.5, color: "#ef4444" },
];

const TOP_SHORTAGE_ITEMS = [
  { item: "EV Charging Station 60kW DC", netRequirement: 450, requiredDate: "15 May 2026", priority: "Critical", color: "bg-rose-500/10 text-rose-700 border-rose-200" },
  { item: "100kWh Industrial BESS Unit", netRequirement: 120, requiredDate: "20 May 2026", priority: "Critical", color: "bg-rose-500/10 text-rose-700 border-rose-200" },
  { item: "EV Dual Gun 22kW AC Charger", netRequirement: 320, requiredDate: "18 May 2026", priority: "High", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  { item: "500kVA Solar Grid Inverter", netRequirement: 85, requiredDate: "25 May 2026", priority: "High", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  { item: "48V LFP Modular Battery Pack", netRequirement: 180, requiredDate: "22 May 2026", priority: "Medium", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
];

const INITIAL_SUPPLY_PLAN_ITEMS = [
  {
    product: "EV Charging Station 60kW DC",
    uom: "Nos",
    totalDemand: 4800,
    availableSupply: 2100,
    netRequirement: 2700,
    plannedReceipt: 3000,
    source: "Production (Main Plant)",
    requiredDate: "15 May 2026",
    status: "On Track",
  },
  {
    product: "100kWh Industrial BESS Unit",
    uom: "Units",
    totalDemand: 620,
    availableSupply: 110,
    netRequirement: 510,
    plannedReceipt: 520,
    source: "Production (Pune Facility)",
    requiredDate: "20 May 2026",
    status: "At Risk",
  },
  {
    product: "EV Dual Gun 22kW AC Charger",
    uom: "Nos",
    totalDemand: 5500,
    availableSupply: 2000,
    netRequirement: 3500,
    plannedReceipt: 3600,
    source: "Production (Main Plant)",
    requiredDate: "18 May 2026",
    status: "At Risk",
  },
  {
    product: "500kVA Solar Grid Inverter",
    uom: "Units",
    totalDemand: 360,
    availableSupply: 80,
    netRequirement: 280,
    plannedReceipt: 290,
    source: "Assembly (Bengaluru Center)",
    requiredDate: "22 May 2026",
    status: "At Risk",
  },
  {
    product: "48V LFP Modular Battery Pack",
    uom: "Units",
    totalDemand: 2900,
    availableSupply: 1200,
    netRequirement: 1700,
    plannedReceipt: 1800,
    source: "Production (Bengaluru Center)",
    requiredDate: "25 May 2026",
    status: "On Track",
  },
];

const RECENT_SUPPLY_ALERTS = [
  {
    id: "ALT-01",
    title: "8 items are below safety stock level",
    subtitle: "Review and take immediate action",
    time: "10 min ago",
    type: "critical",
    icon: AlertTriangle,
    iconColor: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    id: "ALT-02",
    title: "4 supplier deliveries are delayed",
    subtitle: "Earliest delay: 2 days",
    time: "1 hour ago",
    type: "warning",
    icon: Clock,
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    id: "ALT-03",
    title: "3 production capacity constraints detected",
    subtitle: "Check capacity availability",
    time: "2 hours ago",
    type: "warning",
    icon: Factory,
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    id: "ALT-04",
    title: "Supply readiness below target",
    subtitle: "Current: 87.6% | Target: 90%",
    time: "3 hours ago",
    type: "info",
    icon: Info,
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
  },
];

const SUPPLY_SCHEDULE_WEEKLY = [
  { period: "Week 1", demand: 1000, openingStock: 450, plannedReceipt: 300, production: 400, procurement: 200, closingStock: 350 },
  { period: "Week 2", demand: 1200, openingStock: 350, plannedReceipt: 500, production: 500, procurement: 250, closingStock: 400 },
  { period: "Week 3", demand: 1500, openingStock: 400, plannedReceipt: 600, production: 600, procurement: 300, closingStock: 400 },
  { period: "Week 4", demand: 1400, openingStock: 400, plannedReceipt: 500, production: 500, procurement: 350, closingStock: 350 },
];

const PROCUREMENT_PLAN_DATA = [
  { id: "PR-REQ-001", material: "Power Module 60kW", reqQty: 5100, reqDate: "20 May 2026", supplier: "Delta Power Systems", leadTime: "14 Days", unitCost: "₹ 48,000", totalCost: "₹ 24.48 Cr", prNo: "PR-2026-0812", status: "PO Pending" },
  { id: "PR-REQ-002", material: "Charging Cable 7m CCS2", reqQty: 3500, reqDate: "18 May 2026", supplier: "Phoenix Contact", leadTime: "10 Days", unitCost: "₹ 12,500", totalCost: "₹ 4.37 Cr", prNo: "PR-2026-0813", status: "RFQ Open" },
  { id: "PR-REQ-003", material: "AC Inverter 30kW", reqQty: 2800, reqDate: "22 May 2026", supplier: "Schneider Electric", leadTime: "21 Days", unitCost: "₹ 34,000", totalCost: "₹ 9.52 Cr", prNo: "PR-2026-0814", status: "PO Issued" },
  { id: "PR-REQ-004", material: "Smart Controller Board", reqQty: 1800, reqDate: "25 May 2026", supplier: "V-Guard Controls", leadTime: "8 Days", unitCost: "₹ 8,900", totalCost: "₹ 1.60 Cr", prNo: "PR-2026-0815", status: "Confirmed" },
];

const PRODUCTION_PLAN_DATA = [
  { id: "PLN-PRD-01", product: "EV Charging Station 60kW", reqQty: 2700, prdQty: 3000, plant: "Pune Plant (Line 1)", workCenter: "Final Assembly 1", startDate: "02 May 2026", endDate: "15 May 2026", capacityAvailable: "3,200 Hrs", capacityRequired: "3,000 Hrs", status: "Scheduled" },
  { id: "PLN-PRD-02", product: "Control Unit Sub-Assembly", reqQty: 1700, prdQty: 1800, plant: "Bengaluru Facility", workCenter: "SMT Line 2", startDate: "10 May 2026", endDate: "25 May 2026", capacityAvailable: "2,000 Hrs", capacityRequired: "1,800 Hrs", status: "In Progress" },
  { id: "PLN-PRD-03", product: "DC Ultra-Fast 120kW Dispenser", reqQty: 1200, prdQty: 1200, plant: "Pune Plant (Line 2)", workCenter: "High-Voltage Testing", startDate: "15 May 2026", endDate: "30 May 2026", capacityAvailable: "1,400 Hrs", capacityRequired: "1,350 Hrs", status: "Scheduled" },
];

const CONSTRAINT_DATA = [
  { constraint: "Supplier Capacity", status: "Limited", impact: "High Risk", detail: "Semiconductor tier-2 allocation capped at 5,500 monthly units" },
  { constraint: "Production Capacity", status: "Full", impact: "Production Delay", detail: "Line 1 operating at 94% utilization; overtime shifts scheduled" },
  { constraint: "Material Availability", status: "Shortage", impact: "Supply Shortage", detail: "Power modules require 14 days lead time; 8 SKUs below safety stock" },
  { constraint: "Warehouse Capacity", status: "Available", impact: "Normal", detail: "Pune central depot at 68% occupancy" },
  { constraint: "Transport Capacity", status: "Limited", impact: "Delivery Risk", detail: "Inter-state freight logistics facing regional transit delays" },
  { constraint: "Budget Availability", status: "Approved", impact: "Zero Risk", detail: "Quarterly working capital facility authorized at ₹ 58 Cr" },
];

const SUPPLY_RISK_DATA = [
  { id: "RSK-01", category: "Supplier Risk", description: "Primary vendor Delta Power Systems facing backlog on 60kW modules", probability: "High", impact: "High", score: 9, mitigation: "Activate secondary qualified vendor ABB Power", owner: "Procurement Desk", status: "Open" },
  { id: "RSK-02", category: "Lead Time Risk", description: "Imported CCS2 cable assemblies customs clearance lag", probability: "Medium", impact: "High", score: 6, mitigation: "Pre-clear port documentation and utilize air-freight buffer", owner: "Logistics Mgr", status: "In Progress" },
  { id: "RSK-03", category: "Capacity Risk", description: "Final assembly testing station bottleneck at Pune Line 1", probability: "Medium", impact: "Medium", score: 4, mitigation: "Deploy auxiliary test bench from pilot plant", owner: "Plant Engineering", status: "Resolved" },
];

/* ===========================================================================
   Component Definition: Supply Planning Form
   =========================================================================== */
function SupplyPlanningPage() {


  // Plan Details State
  const [planNumber, setPlanNumber] = useState("SP-2026-000184");
  const [planName, setPlanName] = useState("EV Charging Stations Supply Plan FY26");
  const [planningPeriod, setPlanningPeriod] = useState("01 Apr 2026 – 31 Mar 2027");
  const [planningHorizon, setPlanningHorizon] = useState("Monthly");
  const [planType, setPlanType] = useState("Material Supply Plan");
  const [warehouseLocation, setWarehouseLocation] = useState("All India");
  const [demandPlanRef, setDemandPlanRef] = useState("DP-2026-000184");
  const [businessUnit, setBusinessUnit] = useState("Electro Mobility");
  const [version, setVersion] = useState("V2");
  const [planner, setPlanner] = useState("Amitav Ghosh");
  const [planStatus, setPlanStatus] = useState("Under Review");

  // Metrics State
  const [totalDemand, setTotalDemand] = useState(128700);
  const [availableSupply, setAvailableSupply] = useState(84500);
  const [netRequirement, setNetRequirement] = useState(44200);
  const [supplyReadiness, setSupplyReadiness] = useState(87.6);
  const [plannedReceipt, setPlannedReceipt] = useState(72200);
  const [criticalShortages, setCriticalShortages] = useState(8);

  // Modals State
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showRunPlanModal, setShowRunPlanModal] = useState(false);
  const [isPlanRunning, setIsPlanRunning] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Workflow Advancement Handler
  const handleWorkflowAdvance = () => {
    if (planStatus === "Draft") {
      setPlanStatus("Demand Imported");
      toast.info("Status updated: Demand Imported");
    } else if (planStatus === "Demand Imported") {
      setPlanStatus("Inventory Analysis");
      toast.info("Status updated: Inventory Analysis");
    } else if (planStatus === "Inventory Analysis") {
      setPlanStatus("Supply Calculation");
      toast.info("Status updated: Supply Calculation");
    } else if (planStatus === "Supply Calculation") {
      setPlanStatus("Constraint Analysis");
      toast.info("Status updated: Constraint Analysis");
    } else if (planStatus === "Constraint Analysis") {
      setPlanStatus("Supply Plan Generated");
      toast.info("Status updated: Supply Plan Generated");
    } else if (planStatus === "Supply Plan Generated" || planStatus === "Under Review") {
      setPlanStatus("Pending Approval");
      toast.success("Submitted for Executive Board Approval");
    } else if (planStatus === "Pending Approval") {
      setPlanStatus("Approved");
      toast.success("Supply Plan Approved!");
    } else if (planStatus === "Approved") {
      setPlanStatus("Released");
      toast.success("Supply Plan Released to Procurement & Production!");
    }
  };

  // Run Supply Plan Simulation
  const handleRunSupplyPlan = () => {
    setIsPlanRunning(true);
    setShowRunPlanModal(true);
    setTimeout(() => {
      setIsPlanRunning(false);
      setPlannedReceipt(74500);
      setSupplyReadiness(89.2);
      setCriticalShortages(5);
      toast.success("Supply Planning Engine completed net requirement netting!", {
        description: "Procurement orders balanced and capacity feasibility verified.",
      });
    }, 2200);
  };

  // Optimize Supply Simulation
  const handleOptimizeSupply = () => {
    setIsOptimizing(true);
    setShowOptimizeModal(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setSupplyReadiness(91.4);
      setCriticalShortages(2);
      toast.success("AI Supply Optimization Engine resolved 6 critical bottleneck constraints!", {
        description: "Optimal mix calculated across inventory, procurement, and production.",
      });
    }, 2400);
  };

  // Export CSV Handler
  const handleExportCsv = () => {
    const headers = ["Product / Material", "UOM", "Total Demand", "Available Supply", "Net Requirement", "Planned Receipt", "Source", "Required Date", "Status"];
    const rows = INITIAL_SUPPLY_PLAN_ITEMS.map((item) => [
      `"${item.product}"`,
      `"${item.uom}"`,
      item.totalDemand,
      item.availableSupply,
      item.netRequirement,
      item.plannedReceipt,
      `"${item.source}"`,
      `"${item.requiredDate}"`,
      `"${item.status}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `supply-plan-${planNumber}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Supply Plan exported to CSV successfully");
  };

  return (
    <AppShell
      title="Supply Planning"
      breadcrumb="Management"
      description="Convert approved demand plan into an executable supply plan and determine the best supply sources."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="supply-planning"
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
              onClick={() => setShowNewPlanModal(true)}
              className="h-8 gap-1.5 bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Plan</span>
            </Button>

            <Button
              size="sm"
              onClick={handleRunSupplyPlan}
              className="h-8 gap-1.5 bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 text-xs"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Run Supply Plan</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleOptimizeSupply}
              className="h-8 gap-1.5 font-semibold text-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" />
              <span>Optimize</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  <span>More</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs">Supply Plan Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleExportCsv} className="gap-2 text-xs cursor-pointer">
                  <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowUploadModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Upload className="h-3.5 w-3.5 text-muted-foreground" /> Upload Inventory File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()} className="gap-2 text-xs cursor-pointer">
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print Plan Summary
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setVersion("V3");
                    toast.success("Plan revision V3 created");
                  }}
                  className="gap-2 text-xs cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Create Revision (V3)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWorkflowAdvance} className="gap-2 text-xs cursor-pointer font-medium text-primary">
                  <ArrowRight className="h-3.5 w-3.5" /> Advance Workflow Phase
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* ===================================================================
            SECTION 1: Dual Top Cards (Plan Details + Supply Planning Status)
            =================================================================== */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* LEFT CARD: Plan Details */}
          <div className="card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground tracking-tight">Plan Details</h3>
                  <Badge variant="outline" className="text-xs font-mono font-bold text-primary bg-primary/5 border-primary/20">
                    {planNumber}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200">
                    {planStatus}
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {version}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground block font-medium">Plan Name *</span>
                  <Input
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="mt-1 h-8 text-xs font-semibold"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Planning Period *</span>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-foreground py-1.5 px-2 rounded-md border bg-background">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{planningPeriod}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Planning Horizon *</span>
                  <select
                    value={planningHorizon}
                    onChange={(e) => setPlanningHorizon(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Plan Type *</span>
                  <select
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="Material Supply Plan">Material Supply Plan</option>
                    <option value="Product Supply Plan">Product Supply Plan</option>
                    <option value="Inventory Replenishment Plan">Inventory Replenishment Plan</option>
                    <option value="Production Supply Plan">Production Supply Plan</option>
                    <option value="Procurement Supply Plan">Procurement Supply Plan</option>
                    <option value="Distribution Supply Plan">Distribution Supply Plan</option>
                    <option value="Project Supply Plan">Project Supply Plan</option>
                    <option value="Seasonal Supply Plan">Seasonal Supply Plan</option>
                    <option value="Emergency Supply Plan">Emergency Supply Plan</option>
                    <option value="AI-Optimized Supply Plan">AI-Optimized Supply Plan</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Warehouse / Location *</span>
                  <select
                    value={warehouseLocation}
                    onChange={(e) => setWarehouseLocation(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="All India">All India</option>
                    <option value="Pune Plant (Main Depot)">Pune Plant (Main Depot)</option>
                    <option value="Bengaluru Regional Warehouse">Bengaluru Regional Warehouse</option>
                    <option value="Delhi Central Logistics Hub">Delhi Central Logistics Hub</option>
                    <option value="Kolkata Port Logistics Center">Kolkata Port Logistics Center</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Demand Plan Reference *</span>
                  <div className="mt-1 flex items-center justify-between py-1 px-2 rounded-md border bg-background">
                    <span className="font-mono font-semibold text-primary">{demandPlanRef}</span>
                    <Link
                      to="/management/supply-chain-management/demand-planning"
                      className="text-primary hover:text-primary/80"
                      title="Open Demand Plan"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Business Unit</span>
                  <select
                    value={businessUnit}
                    onChange={(e) => setBusinessUnit(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="Electro Mobility">Electro Mobility</option>
                    <option value="Energy Storage Systems">Energy Storage Systems</option>
                    <option value="Industrial Infrastructure">Industrial Infrastructure</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Planner *</span>
                  <select
                    value={planner}
                    onChange={(e) => setPlanner(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="Amitav Ghosh">Amitav Ghosh (Lead S&OP Planner)</option>
                    <option value="Kavita Sen">Kavita Sen (Plant SCM Manager)</option>
                    <option value="Rajesh Rao">Rajesh Rao (Capacity Planner)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Core flow: Demand → Inventory → Net Req → Procurement / Production → MRP</span>
              <button
                type="button"
                onClick={handleWorkflowAdvance}
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                Advance Phase <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* RIGHT CARD: Supply Planning Status & Stepper Workflow */}
          <div className="card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-base text-foreground tracking-tight">Supply Planning Status</h3>
                <span className="text-xs text-muted-foreground font-medium">Phase 7 of 11</span>
              </div>

              {/* Stepper Status Workflow */}
              <div className="mt-4">
                <div className="flex items-center overflow-x-auto no-scrollbar py-2">
                  {SUPPLY_WORKFLOW_STEPS.map((step, idx) => {
                    const isDone = idx < 6;
                    const isCurrent = idx === 6;
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
                              "text-[9px] mt-1 whitespace-nowrap font-medium max-w-[55px] text-center truncate",
                              isCurrent ? "text-primary font-bold" : "text-muted-foreground"
                            )}
                            title={step.label}
                          >
                            {step.label}
                          </span>
                        </div>
                        {idx < SUPPLY_WORKFLOW_STEPS.length - 1 && (
                          <div
                            className={cn(
                              "h-0.5 w-4 sm:w-5 mx-0.5 mb-4 transition-colors",
                              idx < 6 ? "bg-emerald-500" : "bg-border"
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Alternate Status Badges */}
              <div className="mt-5 border-t pt-3">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-2">
                  Alternate Status
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[11px] font-medium bg-amber-50 text-amber-700 border-amber-200 cursor-pointer hover:bg-amber-100">
                    On Hold
                  </Badge>
                  <Badge variant="outline" className="text-[11px] font-medium bg-orange-50 text-orange-700 border-orange-200 cursor-pointer hover:bg-orange-100">
                    Replanning Required
                  </Badge>
                  <Badge variant="outline" className="text-[11px] font-medium bg-rose-50 text-rose-700 border-rose-200 cursor-pointer hover:bg-rose-100">
                    Rejected
                  </Badge>
                  <Badge variant="outline" className="text-[11px] font-medium bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100">
                    Partially Approved
                  </Badge>
                  <Badge variant="outline" className="text-[11px] font-medium bg-purple-50 text-purple-700 border-purple-200 cursor-pointer hover:bg-purple-100">
                    Superseded
                  </Badge>
                  <Badge variant="outline" className="text-[11px] font-medium bg-slate-50 text-slate-700 border-slate-200 cursor-pointer hover:bg-slate-100">
                    Cancelled
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-[11px] text-muted-foreground flex justify-between items-center">
              <span>Next Milestone: S&OP Supply Chain Review Signoff</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleWorkflowAdvance}
                className="h-6 text-xs text-primary"
              >
                Advance Workflow
              </Button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 2: 7 Metric KPI Cards Row (matching screenshot)
            =================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Total Demand */}
          <div className="card-soft p-3 flex flex-col justify-between border-l-4 border-l-blue-600 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Total Demand</span>
              <div className="grid h-6 w-6 place-items-center rounded-md bg-blue-500/10 text-blue-600">
                <TrendingUp className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                {totalDemand.toLocaleString()}
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">Units</span>
            </div>
          </div>

          {/* 2. Net Available Supply */}
          <div className="card-soft p-3 flex flex-col justify-between border-l-4 border-l-emerald-600 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Net Available Supply</span>
              <div className="grid h-6 w-6 place-items-center rounded-md bg-emerald-500/10 text-emerald-600">
                <Warehouse className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                {availableSupply.toLocaleString()}
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">Units</span>
            </div>
          </div>

          {/* 3. Net Supply Requirement */}
          <div className="card-soft p-3 flex flex-col justify-between border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Net Supply Requirement</span>
              <div className="grid h-6 w-6 place-items-center rounded-md bg-amber-500/10 text-amber-600">
                <Calendar className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                {netRequirement.toLocaleString()}
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">Units</span>
            </div>
          </div>

          {/* 4. Supply Readiness */}
          <div className="card-soft p-3 flex flex-col justify-between border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Supply Readiness</span>
              <div className="grid h-6 w-6 place-items-center rounded-md bg-purple-500/10 text-purple-600">
                <CheckCircle2 className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono tracking-tight text-purple-600">
                {supplyReadiness}%
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">Target 85%</span>
            </div>
          </div>

          {/* 5. Planned Receipt */}
          <div className="card-soft p-3 flex flex-col justify-between border-l-4 border-l-cyan-500 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Planned Receipt</span>
              <div className="grid h-6 w-6 place-items-center rounded-md bg-cyan-500/10 text-cyan-600">
                <Truck className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                {plannedReceipt.toLocaleString()}
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">Units</span>
            </div>
          </div>

          {/* 6. Critical Shortages */}
          <div className="card-soft p-3 flex flex-col justify-between border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Critical Shortages</span>
              <div className="grid h-6 w-6 place-items-center rounded-md bg-red-500/10 text-red-600">
                <AlertTriangle className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono tracking-tight text-red-600">
                {criticalShortages}
              </div>
              <span className="text-[10px] text-red-600 font-semibold block mt-0.5">Items</span>
            </div>
          </div>

          {/* 7. Plan Coverage */}
          <div className="card-soft p-3 flex flex-col justify-between border-l-4 border-l-blue-400 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Plan Coverage</span>
              <div className="grid h-6 w-6 place-items-center rounded-md bg-blue-500/10 text-blue-600">
                <Calendar className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">12</div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">Months</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 3: Demand & Supply Master Workspace
            =================================================================== */}
        <div className="space-y-6">
          {/* Top Row: Demand vs Supply Summary (4.5 cols), Supply Source Breakdown (3.5 cols), Top Shortage Items (4 cols) */}
          <div className="grid gap-5 lg:grid-cols-12">
              {/* 1. Demand vs Supply Summary Table - 5 cols */}
              <div className="card-soft p-5 lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-semibold text-sm text-foreground">Demand vs Supply Summary</h4>
                    <span className="text-[11px] text-muted-foreground font-medium">Monthly Horizon</span>
                  </div>

                  <div
                    className="mt-3 overflow-x-auto no-scrollbar scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-muted-foreground font-semibold">
                          <th className="pb-2">Period</th>
                          <th className="pb-2 text-right">Total Demand</th>
                          <th className="pb-2 text-right">Available Supply</th>
                          <th className="pb-2 text-right">Net Req</th>
                          <th className="pb-2 text-right">Readiness</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {DEMAND_VS_SUPPLY_SUMMARY.map((row, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2 font-medium text-foreground">{row.period}</td>
                            <td className="py-2 text-right font-mono text-muted-foreground">{row.totalDemand.toLocaleString()}</td>
                            <td className="py-2 text-right font-mono text-muted-foreground">{row.netAvailableSupply.toLocaleString()}</td>
                            <td className="py-2 text-right font-mono font-bold text-foreground">{row.netRequirement.toLocaleString()}</td>
                            <td className="py-2 text-right font-mono">
                              <span
                                className={cn(
                                  "font-semibold",
                                  row.status === "good" ? "text-emerald-600" : "text-rose-600"
                                )}
                              >
                                {row.readiness}%
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 font-bold bg-muted/20">
                          <td className="py-2 font-bold text-foreground">Total</td>
                          <td className="py-2 text-right font-mono">1,28,700</td>
                          <td className="py-2 text-right font-mono">84,500</td>
                          <td className="py-2 text-right font-mono text-primary">44,200</td>
                          <td className="py-2 text-right font-mono text-emerald-600">87.6%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">12-Month Demand Forecast Horizon</span>
                  <span className="text-[11px] text-muted-foreground">Target Readiness: 90%</span>
                </div>
              </div>

              {/* 2. Supply Source Breakdown Donut Chart - 3.5 cols */}
              <div className="card-soft p-5 lg:col-span-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Supply Source Breakdown</h4>
                  <span className="text-[11px] text-muted-foreground">Distribution across fulfillment channels</span>

                  <div className="relative mt-2 h-[155px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={SUPPLY_SOURCE_BREAKDOWN}
                          cx="50%"
                          cy="50%"
                          innerRadius={46}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="units"
                        >
                          {SUPPLY_SOURCE_BREAKDOWN.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">Total</span>
                      <span className="text-base font-bold tracking-tight text-foreground font-mono">44,200</span>
                      <span className="text-[9px] text-muted-foreground">Units</span>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1.5 text-xs">
                    {SUPPLY_SOURCE_BREAKDOWN.map((src, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: src.color }} />
                          <span className="text-muted-foreground font-medium">{src.name}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <span className="font-mono">{src.units.toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">({src.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-xs flex justify-between items-center">
                  <span className="text-muted-foreground">Multi-Source Distribution</span>
                  <span className="text-primary font-medium text-[11px]">Direct + In-House + 3PL</span>
                </div>
              </div>

              {/* 3. Top Shortage Items Table - 4 cols */}
              <div className="card-soft p-5 lg:col-span-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-semibold text-sm text-foreground">Top Shortage Items</h4>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Priority</span>
                  </div>

                  <div
                    className="mt-3 overflow-x-auto no-scrollbar scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-muted-foreground font-semibold">
                          <th className="pb-2">Item</th>
                          <th className="pb-2 text-right">Net Req</th>
                          <th className="pb-2">Required Date</th>
                          <th className="pb-2 text-right">Priority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {TOP_SHORTAGE_ITEMS.map((item, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 font-medium text-foreground">{item.item}</td>
                            <td className="py-2.5 text-right font-mono font-bold text-foreground">{item.netRequirement}</td>
                            <td className="py-2.5 text-muted-foreground">{item.requiredDate}</td>
                            <td className="py-2.5 text-right">
                              <Badge variant="outline" className={cn("text-[9px] font-semibold", item.color)}>
                                {item.priority}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-xs flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Active Shortage Netting</span>
                  <span className="text-[11px] text-rose-600 font-semibold">2 Critical Bottlenecks</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Supply Plan Summary (8 cols) & Recent Alerts (4 cols) */}
            <div className="grid gap-5 lg:grid-cols-12">
              {/* Supply Plan Summary Table - 8 cols */}
              <div className="card-soft p-5 lg:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">Supply Plan Summary</h4>
                      <span className="text-[11px] text-muted-foreground">Aggregated BOM demand, net requirement, and planned receipts</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportCsv}
                      className="h-7 text-xs gap-1"
                    >
                      <Download className="h-3 w-3" /> Export Summary
                    </Button>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-muted-foreground font-semibold">
                          <th className="pb-2">Product / Material</th>
                          <th className="pb-2">UOM</th>
                          <th className="pb-2 text-right">Total Demand</th>
                          <th className="pb-2 text-right">Available</th>
                          <th className="pb-2 text-right">Net Req</th>
                          <th className="pb-2 text-right">Planned Receipt</th>
                          <th className="pb-2">Source</th>
                          <th className="pb-2">Required Date</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {INITIAL_SUPPLY_PLAN_ITEMS.map((item, idx) => {
                          const isOnTrack = item.status === "On Track";
                          return (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                              <td className="py-2.5 font-medium text-foreground">{item.product}</td>
                              <td className="py-2.5 text-muted-foreground font-mono">{item.uom}</td>
                              <td className="py-2.5 text-right font-mono text-muted-foreground">{item.totalDemand.toLocaleString()}</td>
                              <td className="py-2.5 text-right font-mono text-muted-foreground">{item.availableSupply.toLocaleString()}</td>
                              <td className="py-2.5 text-right font-mono font-bold text-foreground">{item.netRequirement.toLocaleString()}</td>
                              <td className="py-2.5 text-right font-mono text-emerald-600 font-semibold">{item.plannedReceipt.toLocaleString()}</td>
                              <td className="py-2.5 text-muted-foreground">
                                <Badge variant="secondary" className="text-[10px] font-medium">
                                  {item.source}
                                </Badge>
                              </td>
                              <td className="py-2.5 text-muted-foreground">{item.requiredDate}</td>
                              <td className="py-2.5 text-right">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] font-semibold",
                                    isOnTrack
                                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                                      : "bg-amber-500/10 text-amber-700 border-amber-200"
                                  )}
                                >
                                  {item.status}
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
                  <span>Showing top 5 of 56 planned supply lines</span>
                  <span className="font-semibold text-primary">All Active Lines Balanced</span>
                </div>
              </div>

              {/* Recent Alerts Card - 4 cols */}
              <div className="card-soft p-5 lg:col-span-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-semibold text-sm text-foreground">Recent Alerts</h4>
                    <span className="text-[11px] text-muted-foreground font-medium">4 Active Alerts</span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {RECENT_SUPPLY_ALERTS.map((alert) => {
                      const IconComp = alert.icon;
                      return (
                        <div
                          key={alert.id}
                          className="flex items-start justify-between gap-3 p-2.5 rounded-lg border bg-muted/15 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border", alert.iconColor)}>
                              <IconComp className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-foreground">{alert.title}</div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{alert.subtitle}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground shrink-0">{alert.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                  <span>Supply Alert Level: Moderate</span>
                  <span className="font-semibold text-primary">All Active Alerts Monitored</span>
                </div>
              </div>
            </div>

        </div>
      </div>

      {/* ===================================================================
          MODALS & DIALOGS
          =================================================================== */}

      {/* 1. Run Supply Plan Simulation Dialog */}
      <Dialog open={showRunPlanModal} onOpenChange={setShowRunPlanModal}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-4 w-4 text-blue-600 fill-current" />
              <span>Supply Planning Engine</span>
            </DialogTitle>
            <DialogDescription>
              {isPlanRunning
                ? "Calculating inventory netting, BOM requirements, and production schedules..."
                : "Supply plan recalculation complete."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-center">
            {isPlanRunning ? (
              <div className="space-y-3">
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Running MRP explosion across 56 product lines and 18,500 inventory items...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-foreground">
                  Supply Readiness increased to 89.2% (Planned Receipts: 74,500 Units)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Critical shortages reduced from 8 to 5 items with supplier allocations secured.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              disabled={isPlanRunning}
              size="sm"
              onClick={() => setShowRunPlanModal(false)}
              className="w-full sm:w-auto"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Optimize Supply Modal */}
      <Dialog open={showOptimizeModal} onOpenChange={setShowOptimizeModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              <span>AI Supply Optimizer</span>
            </DialogTitle>
            <DialogDescription>
              {isOptimizing
                ? "Optimizing trade-offs between inventory holding costs, supplier lead times, and capacity..."
                : "Optimization complete."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-center">
            {isOptimizing ? (
              <div className="space-y-3">
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Evaluating cost curves and supplier capacity matrices...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-foreground">
                  Optimal Supply Readiness: 91.4% (Critical Shortages: 2)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Re-routed 300 power modules via transfer from Delhi depot to eliminate line stoppage risk.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              disabled={isOptimizing}
              size="sm"
              onClick={() => setShowOptimizeModal(false)}
              className="w-full sm:w-auto"
            >
              Apply Recommendations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. New Plan Modal */}
      <Dialog open={showNewPlanModal} onOpenChange={setShowNewPlanModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Create New Supply Plan</DialogTitle>
            <DialogDescription>Initialize a new supply schedule linked to an approved demand plan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Supply Plan Title</Label>
              <Input defaultValue="Q3-Q4 EV Infrastructure Replenishment Plan" className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Demand Plan Reference</Label>
              <Input defaultValue="DP-2026-000184" className="mt-1 text-xs font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Planning Horizon</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Plan Type</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>Material Supply Plan</option>
                  <option>Production Supply Plan</option>
                  <option>Inventory Replenishment Plan</option>
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
                setPlanNumber("SP-2026-000185");
                toast.success("New Supply Plan SP-2026-000185 created in Draft status.");
              }}
            >
              Create Supply Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Upload Inventory Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Upload Inventory & WIP Data</DialogTitle>
            <DialogDescription>Upload warehouse on-hand stock and work-in-progress CSV files.</DialogDescription>
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
                toast.success("Inventory stock levels updated into Netting Engine.");
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

export default SupplyPlanningPage;

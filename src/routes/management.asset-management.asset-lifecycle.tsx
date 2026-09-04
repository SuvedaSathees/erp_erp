import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AssetManagementTabBar } from "@/components/erp/AssetManagementTabBar";
import { DataTablePagination } from "@/components/erp/DataTablePagination";
import { AssetVisual } from "@/components/erp/AssetVisual";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Layers,
  ShoppingCart,
  PieChart,
  Wrench,
  Hourglass,
  TrendingUp,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Plus,
  ChevronDown,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  QrCode,
  Maximize2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  ArrowRight,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/asset-management/asset-lifecycle")({
  head: () => ({
    meta: [
      { title: "Asset Lifecycle Form · Magnertia ERP" },
      {
        name: "description",
        content: "End-to-end asset lifecycle management from identification to disposal and accounting closure.",
      },
    ],
  }),
  component: AssetLifecycleFormPage,
});

interface AssetLifecycleItem {
  id: string;
  code?: string;
  name: string;
  category: string;
  stage: "Acquisition" | "Capitalized" | "Assigned" | "Operational" | "Maintenance" | "Transfer" | "End of Life" | "Disposed" | "Commissioning";
  acquisitionDate: string;
  acquisitionCost?: string;
  grossValue?: string;
  nbv: string;
  nbvNum: number;
  currentNbv?: string;
  utilization: string;
  health: string;
  status: "Active" | "Under Maintenance" | "Transfer Pending" | "End of Life";
  nextActivity: string;
  serialNumber: string;
  location: string;
  department: string;
  custodian?: string;
}

const BASE_LIFECYCLE_TEMPLATES = [
  { name: "CNC VMC-850", category: "Production Machinery", stage: "Operational" as const, cost: 2260000, util: 82, health: 85, dept: "Production", loc: "Plant 01 - Machine Shop" },
  { name: "Air Compressor 75kW", category: "Utility Equipment", stage: "Operational" as const, cost: 480000, util: 78, health: 75, dept: "Maintenance", loc: "Plant 01 - Utility Room" },
  { name: "Forklift 3 Ton", category: "Material Handling", stage: "Operational" as const, cost: 320000, util: 71, health: 80, dept: "Warehouse", loc: "Logistics Bay" },
  { name: "Generator 125kVA", category: "Power Equipment", stage: "Maintenance" as const, cost: 610000, util: 65, health: 60, dept: "Electrical", loc: "Power Substation" },
  { name: "EV Charger 60kW", category: "EV Infrastructure", stage: "Operational" as const, cost: 290000, util: 88, health: 90, dept: "Facilities", loc: "Parking Lot B" },
  { name: "Chiller Unit 50TR", category: "HVAC Equipment", stage: "Operational" as const, cost: 570000, util: 83, health: 82, dept: "Facilities", loc: "HVAC Plant Roof" },
  { name: "Hydraulic Press 200T", category: "Press Machinery", stage: "Transfer" as const, cost: 420000, util: 60, health: 70, dept: "Production", loc: "Press Shop A" },
  { name: "Old Lathe Machine", category: "Machinery", stage: "End of Life" as const, cost: 25000, util: 10, health: 25, dept: "Tool Room", loc: "Storage Yard" },
  { name: "Laser Cutting 6kW", category: "Production Machinery", stage: "Commissioning" as const, cost: 3400000, util: 92, health: 98, dept: "Production", loc: "Plant 02 - Sheet Metal" },
  { name: "Overhead EOT Crane 10T", category: "Material Handling", stage: "Operational" as const, cost: 1250000, util: 74, health: 88, dept: "Logistics", loc: "Heavy Bay 02" },
];

const INITIAL_ASSETS: AssetLifecycleItem[] = Array.from({ length: 428 }, (_, i) => {
  const tpl = BASE_LIFECYCLE_TEMPLATES[i % BASE_LIFECYCLE_TEMPLATES.length];
  const numStr = String(i + 1).padStart(5, "0");
  const costScale = 1 + ((i * 13) % 35) / 100;
  const cost = Math.round(tpl.cost * costScale);
  const status: "Active" | "Under Maintenance" | "Transfer Pending" | "End of Life" =
    tpl.stage === "End of Life" ? "End of Life" :
    tpl.stage === "Maintenance" ? "Under Maintenance" :
    tpl.stage === "Transfer" ? "Transfer Pending" : "Active";

  return {
    id: `FA-PLT-${numStr}`,
    code: `FA-PLT-${numStr}`,
    name: i < BASE_LIFECYCLE_TEMPLATES.length ? tpl.name : `${tpl.name} #${Math.floor(i / BASE_LIFECYCLE_TEMPLATES.length) + 1}`,
    category: tpl.category,
    stage: tpl.stage,
    acquisitionDate: `${((i * 5) % 28) + 1}-Sep-2026`,
    acquisitionCost: cost.toLocaleString(),
    grossValue: cost.toLocaleString(),
    nbv: cost.toLocaleString(),
    nbvNum: cost,
    currentNbv: cost.toLocaleString(),
    utilization: `${tpl.util}%`,
    health: `${tpl.health}%`,
    status,
    nextActivity: status === "End of Life" ? "Disposal Pending" : "PM Scheduled",
    serialNumber: `SN-${tpl.dept.substring(0, 3).toUpperCase()}-2026-${numStr}`,
    location: tpl.loc,
    department: tpl.dept,
    custodian: "Plant Manager",
  };
});

export function AssetLifecycleFormPage() {
  const [assets, setAssets] = useState<AssetLifecycleItem[]>(INITIAL_ASSETS);
  const [activeAsset, setActiveAsset] = useState<AssetLifecycleItem>(INITIAL_ASSETS[0]);
  const [selectedFilter, setSelectedFilter] = useState("All 428");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["Lifecycle ID", "Asset Code", "Asset Name", "Category", "Current Stage", "Acquisition Cost", "Current NBV", "Location", "Custodian"];
    const rows = assets.map(a => [
      a.id,
      a.code || a.id,
      `"${a.name}"`,
      `"${a.category}"`,
      a.stage,
      `"${a.acquisitionCost || a.nbv}"`,
      `"${a.currentNbv || a.nbv}"`,
      `"${a.location}"`,
      `"${a.custodian || "Plant Manager"}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Asset_Lifecycle_Register_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Asset Lifecycle Register exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Asset lifecycle milestones and stage journals synchronized!");
    }, 600);
  };

  // Modals
  const [isNewAssetOpen, setIsNewAssetOpen] = useState(false);
  const [isStageAdvanceOpen, setIsStageAdvanceOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  // Filter items
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchSearch =
        asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.stage.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All 428") return matchSearch;
      if (selectedFilter === "Acquisition 18") return matchSearch && asset.stage === "Acquisition";
      if (selectedFilter === "Capitalized 24") return matchSearch && asset.stage === "Capitalized";
      if (selectedFilter === "Assigned 38") return matchSearch && asset.stage === "Assigned";
      if (selectedFilter === "Operational 401") return matchSearch && asset.stage === "Operational";
      if (selectedFilter === "Maintenance 12") return matchSearch && asset.stage === "Maintenance";
      if (selectedFilter === "Transfer 8") return matchSearch && asset.stage === "Transfer";
      if (selectedFilter === "Disposed 7") return matchSearch && asset.stage === "Disposed";
      return matchSearch;
    });
  }, [assets, searchQuery, selectedFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Paginated Assets
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, currentPage, pageSize]);

  return (
    <AppShell
      title="Asset Lifecycle Form"
      breadcrumb="Management > Asset Management > Asset Lifecycle"
      description="End-to-end asset lifecycle management from identification to disposal and accounting closure."
      tabs={<AssetManagementTabBar />}
    >
      <div className="w-full space-y-4">
        {/* ====================================================================
           1. ACTION HEADER CARD
           ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap">
            {/* Title in Single Line */}
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Asset Lifecycle Form
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; End-to-end asset lifecycle from identification to disposal and accounting closure
              </span>
            </div>

            {/* Header Right Actions in Single Line */}
            <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
              {/* Date Range Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold rounded-lg border border-border/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer whitespace-nowrap"
                  >
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{dateRange}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs">
                  <DropdownMenuItem onClick={() => { setDateRange("01 Sep 2026 - 30 Sep 2026"); toast.success("Selected Current Month: Sep 2026"); }}>
                    September 2026 (Current Month)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDateRange("01 Aug 2026 - 31 Aug 2026"); toast.success("Selected Previous Month: Aug 2026"); }}>
                    August 2026 (Previous Month)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDateRange("01 Jul 2026 - 30 Sep 2026"); toast.success("Selected Q3 2026"); }}>
                    Q3 2026 (Quarter-to-Date)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDateRange("01 Apr 2026 - 31 Mar 2027"); toast.success("Selected Fiscal Year 2026-27"); }}>
                    FY 2026-27 (Full Fiscal Year)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Export</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-xs">
                  <DropdownMenuItem onClick={handleExportCsv}>
                    Export to CSV (.csv)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported Asset Lifecycle (.xlsx)"); }}>
                    Export to Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print / Export PDF (.pdf)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reports Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <span>Reports</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 text-xs">
                  <DropdownMenuItem onClick={() => toast.info("Opening Asset Lifecycle Stage Audit...")}>
                    Lifecycle Stage Audit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Depreciation & NBV Report...")}>
                    Depreciation & NBV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Physical Verification Log...")}>
                    Verification Status Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + New Asset Primary Button */}
              <Button
                onClick={() => setIsNewAssetOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Asset</span>
              </Button>

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer">
                    <span>More Actions</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 text-xs">
                  <DropdownMenuItem onClick={() => setIsStageAdvanceOpen(true)}>
                    Advance Lifecycle Stage
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsVerifyOpen(true)}>
                    Physical Verification
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Impairment Assessment Review initiated")}>
                    Impairment Assessment
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print Lifecycle History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* ====================================================================
           2. TOP 6 METRIC KPI CARDS
           ==================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Assets */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Total Assets</span>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">428</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All Assets</span>
            </div>
          </div>

          {/* Card 2: Acquisition (This Month) */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Acquisition (This Month)</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">18</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                4.21% of Total
              </span>
            </div>
          </div>

          {/* Card 3: Active Operating Fleet */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Optimal Operating Phase</span>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <PieChart className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-blue-600">384</span>
              <span className="block text-[10px] text-blue-700 dark:text-blue-400 font-medium">
                89.7% of Lifecycle Fleet
              </span>
            </div>
          </div>

          {/* Card 4: Mid-Life Overhaul / Refurbishment */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Mid-Life Overhaul Due</span>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-purple-600">20</span>
              <span className="block text-[10px] text-purple-700 dark:text-purple-400 font-medium">
                Extending Life +5 Yrs
              </span>
            </div>
          </div>

          {/* Card 5: End of Life / Replacement Pipeline */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">EOL Replacement Queue</span>
              <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Hourglass className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-rose-600">6</span>
              <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                Salvage Value ₹ 18.40 L
              </span>
            </div>
          </div>

          {/* Card 6: Average Asset Age */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Average Asset Age</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">4.8 Yrs</span>
              <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                Design Life: 12.0 Yrs
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           3. MIDDLE SECTION (4 CARDS: Stage Donut, Value Donut, Health Speedo, Upcoming)
           ==================================================================== *        {/* ====================================================================
           3. MIDDLE SECTION (4 CARDS: Compact, Small & Balanced)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Assets by Lifecycle Stage (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Assets by Lifecycle Stage
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#38bdf8" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="180" />
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="205" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="220" />
                    <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="230" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">428</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Assets</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Operating</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">401</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-teal-400" /> Assigned</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Capitalized</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Acquisition</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Maintenance</span>
                    <span className="font-mono font-semibold text-amber-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Disposal</span>
                    <span className="font-mono font-semibold text-rose-600">7</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Active Ratio: <strong className="text-emerald-600 font-mono">93.7%</strong></span>
                <span>Disposal Queue: <strong className="text-rose-600 font-mono">7 Units</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Asset Value Overview (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Asset Value Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#38bdf8" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="169.4" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold font-mono text-emerald-600">71%</span>
                    <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">Net Value</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300">Gross Book Value</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹18.60 Cr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300">Accum. Deprec.</span>
                    <span className="font-mono font-semibold text-muted-foreground">₹5.40 Cr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">Net Book Value</span>
                    <span className="font-mono font-bold text-emerald-600">₹13.20 Cr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300">Maint. Spend</span>
                    <span className="font-mono font-semibold text-amber-600">₹2.10 Cr</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Deprec. Rate: <strong className="font-mono">29.0%</strong></span>
                <span>Net Retention: <strong className="font-mono text-emerald-600">71.0%</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Asset Health (Compact Semi-Circle) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Asset Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="relative w-44 h-24 mt-1 flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 180 98">
                  <defs>
                    <linearGradient id="lifeHealthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="70%" stopColor="#0d9488" />
                      <stop offset="100%" stopColor="#0f766e" />
                    </linearGradient>
                    <filter id="lifeHealthGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Outer subtle decorative tick ring */}
                  <path
                    d="M 18 85 A 72 72 0 0 1 162 85"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.08"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                  />

                  {/* Background Track with rounded ends */}
                  <path
                    d="M 26 85 A 64 64 0 0 1 154 85"
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Active Health Arc (85% = dashoffset 30.16 on total length 201.06) */}
                  <path
                    d="M 26 85 A 64 64 0 0 1 154 85"
                    fill="none"
                    stroke="url(#lifeHealthGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="201.06"
                    strokeDashoffset="30.16"
                    filter="url(#lifeHealthGlow)"
                    className="transition-all duration-1000 ease-out"
                  />

                  {/* Benchmark line at 80% */}
                  <line x1="135" y1="41" x2="143" y2="35" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

                  {/* Leading Edge Accent Indicator Pip at 85% */}
                  <circle cx="147" cy="56" r="3.5" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
                </svg>

                {/* Centered Value Readout */}
                <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      85
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground font-mono">/ 100</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 -mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Healthy Fleet
                  </span>
                </div>
              </div>

              {/* Scale Labels */}
              <div className="flex justify-between w-full text-[8.5px] font-mono text-muted-foreground px-3 -mt-1.5">
                <span>0</span>
                <span className="text-blue-600 font-semibold text-[8px]">Target: &ge;80</span>
                <span>100</span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9.5px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Healthy</span>
                  <span className="font-mono font-bold text-emerald-600">372</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><div className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Watch</span>
                  <span className="font-mono font-bold text-teal-600">38</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Service</span>
                  <span className="font-mono font-bold text-amber-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> EOL Due</span>
                  <span className="font-mono font-bold text-rose-600">6</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Upcoming Activities (Compact) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upcoming Activities
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening master asset lifecycle calendar")}
                className="text-[9.5px] text-primary font-bold hover:underline cursor-pointer"
              >
                Calendar &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3 space-y-1 text-[10.5px]">
              <div className="flex justify-between items-center px-2 py-0.5 rounded bg-blue-50/60 dark:bg-blue-950/20">
                <span className="text-slate-800 dark:text-slate-200 truncate">Verification Audit</span>
                <span className="font-mono font-bold text-blue-600">18</span>
              </div>
              <div className="flex justify-between items-center px-2 py-0.5 rounded bg-amber-50/60 dark:bg-amber-950/20">
                <span className="text-slate-800 dark:text-slate-200 truncate">PM Due This Week</span>
                <span className="font-mono font-bold text-amber-600">24</span>
              </div>
              <div className="flex justify-between items-center px-2 py-0.5 rounded bg-emerald-50/60 dark:bg-emerald-950/20">
                <span className="text-slate-800 dark:text-slate-200 truncate">Warranties Expiring</span>
                <span className="font-mono font-bold text-emerald-600">7</span>
              </div>
              <div className="flex justify-between items-center px-2 py-0.5 rounded bg-rose-50/60 dark:bg-rose-950/20">
                <span className="text-slate-800 dark:text-slate-200 truncate">Disposal Pipeline</span>
                <span className="font-mono font-bold text-rose-600">6</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. ASSET LIFECYCLE REGISTER TABLE (Full Width Master Box - Zero Side Scrolling)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Asset Lifecycle Register
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredAssets.length} assets
                  </Badge>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search asset, category, ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs w-48 sm:w-64 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFilter("All 428");
                      setSearchQuery("");
                      toast.info("Reset filters");
                    }}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Displaying all 11 lifecycle register columns")}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                    Columns
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
                {["All 428", "Acquisition 18", "Capitalized 24", "Assigned 38", "Operational 401", "Maintenance 12", "Transfer 8", "Disposed 7"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer shrink-0",
                      selectedFilter === filter
                        ? "bg-primary text-white shadow-2xs"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30 text-[10.5px] text-muted-foreground font-semibold">
                    <th className="p-3 pl-4">Asset ID</th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 font-mono">Serial Number</th>
                    <th className="p-3 text-center">Lifecycle Stage</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Department</th>
                    <th className="p-3 font-mono text-right">Gross (₹)</th>
                    <th className="p-3 font-mono text-right">Net Book Value (₹)</th>
                    <th className="p-3 font-mono text-center">Health</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-muted-foreground">
                        No assets match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        onClick={() => setActiveAsset(asset)}
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          activeAsset.id === asset.id ? "bg-primary/5 dark:bg-primary/10" : ""
                        )}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px]">
                          {asset.id}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{asset.name}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              Acquired: {asset.acquisitionDate}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {asset.category}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {asset.serialNumber}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              asset.stage === "Operational"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : asset.stage === "Maintenance"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : asset.stage === "Acquisition"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            )}
                          >
                            {asset.stage}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {asset.location}
                        </td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">
                          {asset.department}
                        </td>
                        <td className="p-3 font-mono font-semibold text-right text-slate-900 dark:text-white">
                          ₹ {asset.grossValue}
                        </td>
                        <td className="p-3 font-mono font-bold text-right text-primary">
                          ₹ {asset.nbv}
                        </td>
                        <td className="p-3 font-mono font-bold text-center text-teal-600">
                          {asset.health}
                        </td>
                        <td className="p-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAsset(asset);
                                setIsStageAdvanceOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="Advance Stage / View History"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAsset(asset);
                                toast.success(`Exporting Lifecycle Card for ${asset.id}`);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Export Record"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalEntries={filteredAssets.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              entityName="assets"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. SELECTED ASSET SUMMARY & LIFECYCLE COST (Full Width 2-Column Grid)
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* Card 1: Asset Summary */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Asset Details: <span className="font-mono text-primary">{activeAsset.id}</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                  {activeAsset.stage}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setIsNewAssetOpen(true)}
                  className="p-1 rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  title="Edit Asset"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toast.info(`Asset Tag QR: ${activeAsset.id}`)}
                  className="p-1 rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  title="QR Tag"
                >
                  <QrCode className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsStageAdvanceOpen(true)}
                  className="p-1 rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  title="Expand View"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Dynamic Category Vector Illustration */}
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl border flex items-center justify-center p-2 relative overflow-hidden">
                  <AssetVisual category={activeAsset.category} assetId={activeAsset.id} className="h-24 w-auto drop-shadow-md" />
                  <div className="absolute bottom-1.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    {activeAsset.id}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {activeAsset.id}
                  </h3>
                  <span className="text-muted-foreground text-xs font-semibold block">
                    {activeAsset.name}
                  </span>
                  <div className="pt-2 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-semibold">{activeAsset.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serial No:</span>
                      <span className="font-mono">{activeAsset.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{activeAsset.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attributes List */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border/40">
                <div className="p-2.5 bg-muted/20 rounded-lg border border-border/40 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{activeAsset.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Acquisition Date:</span>
                    <span className="font-mono">{activeAsset.acquisitionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilization:</span>
                    <span className="font-mono font-bold text-emerald-600">{activeAsset.utilization}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-muted/20 rounded-lg border border-border/40 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross Value:</span>
                    <span className="font-mono font-semibold">₹ {activeAsset.grossValue || activeAsset.nbv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Book Value:</span>
                    <span className="font-mono font-bold text-primary">₹ {activeAsset.nbv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Health Score:</span>
                    <span className="font-mono font-bold text-teal-600">{activeAsset.health}</span>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => setIsStageAdvanceOpen(true)}
                className="w-full text-xs bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer"
              >
                Advance Lifecycle Stage / View Full Audit History &rarr;
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Lifecycle Cost Summary */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Lifecycle Financial & Cost Analysis
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono font-bold">
                TCO Summary
              </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="space-y-2 text-[11.5px]">
                <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Initial Capital Acquisition Cost</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 18.60 Cr</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Cumulative Depreciation (Straight-Line)</span>
                  <span className="font-mono font-bold text-rose-600">₹ 5.40 Cr</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Cumulative Maintenance & Overhauls</span>
                  <span className="font-mono font-bold text-amber-600">₹ 2.10 Cr</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 font-bold text-slate-900 dark:text-white">
                  <span className="text-primary">Total Cost of Ownership (Lifecycle TCO)</span>
                  <span className="font-mono text-primary text-sm">₹ 20.70 Cr</span>
                </div>
              </div>

              <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Scheduled Action:</span>
                  <span className="font-mono font-semibold text-amber-600">{activeAsset.nextActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Depreciation Method:</span>
                  <span className="font-medium">Straight-Line Method (SLM)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Salvage Recovery:</span>
                  <span className="font-mono">₹ 1.20 Cr (6.45%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           6. BOTTOM 4 CARDS (Value Trend, Assets by Category, Depreciation, AI Insights)
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Lifecycle Value Trend (Last 6 Months) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Lifecycle Value Trend (Last 6 Months)
              </CardTitle>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Gross Value</span>
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> NBV</span>
              </div>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="h-32 w-full pt-2">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 100">
                  <line x1="15" y1="20" x2="225" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="50" x2="225" y2="50" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="80" x2="225" y2="80" stroke="currentColor" strokeOpacity="0.08" />

                  {/* Gross Value Line (Blue) */}
                  <polyline
                    points="25,36 65,34 105,32 145,28 185,26 220,24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                  {[
                    { x: 25, y: 36, val: "17.2" },
                    { x: 65, y: 34, val: "17.5" },
                    { x: 105, y: 32, val: "17.8" },
                    { x: 145, y: 28, val: "18.2" },
                    { x: 185, y: 26, val: "18.4" },
                    { x: 220, y: 24, val: "18.6" },
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#2563eb" />
                  ))}

                  {/* NBV Line (Green) */}
                  <polyline
                    points="25,74 65,72 105,70 145,67 185,65 220,63"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  {[
                    { x: 25, y: 74, val: "12.1" },
                    { x: 65, y: 72, val: "12.3" },
                    { x: 105, y: 70, val: "12.5" },
                    { x: 145, y: 67, val: "12.8" },
                    { x: 185, y: 65, val: "13.0" },
                    { x: 220, y: 63, val: "13.2" },
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#10b981" />
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-[8.5px] font-mono text-muted-foreground px-1 border-t border-border/40 pt-1">
                <span>Apr 26</span>
                <span>May 26</span>
                <span>Jun 26</span>
                <span>Jul 26</span>
                <span>Aug 26</span>
                <span>Sep 26</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Assets by Category */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Assets by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" stroke="#38bdf8" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="138" />
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="180" />
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="205" />
                  <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="225" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">428</span>
                  <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">Total</span>
                </div>
              </div>

              <div className="space-y-0.5 text-[9.5px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Production Machinery</span>
                  <span className="font-mono font-bold">42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Utility Equipment</span>
                  <span className="font-mono font-bold">16%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Material Handling</span>
                  <span className="font-mono font-bold">12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Electrical Equipment</span>
                  <span className="font-mono font-bold">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> IT Equipment</span>
                  <span className="font-mono font-bold">8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Depreciation Overview (This Month) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Depreciation Overview (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[10.5px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Depreciation</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 23.45 L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">YTD Depreciation</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 1.98 Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accum. Depreciation</span>
                <span className="font-mono font-bold text-rose-600">₹ 5.40 Cr</span>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                <span>Depreciation Rate</span>
                <span className="font-bold">29.03% of Gross Value</span>
              </div>

              {/* Bar Columns Graphic */}
              <div className="h-14 flex items-end justify-between gap-1.5 pt-2">
                {[45, 55, 60, 75, 70, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-500/80 rounded-t-xs" style={{ height: `${h}%` }} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 4: AI Lifecycle Insights */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                AI Lifecycle Insights
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening all AI lifecycle insights")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[9.5px]">
              <div className="flex items-start gap-1">
                <span className="text-rose-600">🔴</span>
                <span>7 assets are approaching end of life.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">🟠</span>
                <span>6 assets require replacement analysis.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-blue-500">ℹ️</span>
                <span>12 assets have low utilization (&lt;40%).</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">ℹ️</span>
                <span>18 assets are pending physical verification.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-emerald-500">🟢</span>
                <span>Overall asset health is good (85%).</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           6. FOOTER
           ==================================================================== */}
        <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <span>&copy; 2026 Magnertia ERP. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>System Online</span>
          </div>
        </div>

        {/* ====================================================================
           MODAL 1: NEW ASSET REGISTRATION
           ==================================================================== */}
        <Dialog open={isNewAssetOpen} onOpenChange={setIsNewAssetOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>New Asset Registration</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  ACQUISITION
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Register a newly acquired fixed asset for capitalization and tagging.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewAssetOpen(false);
                toast.success("New asset successfully registered into Asset Lifecycle!");
              }}
              className="space-y-3 text-xs pt-1"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset Name *</Label>
                  <Input defaultValue="CNC Vertical Machining Center" required className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset Category</Label>
                  <Select defaultValue="Production Machinery">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Production Machinery">Production Machinery</SelectItem>
                      <SelectItem value="Utility Equipment">Utility Equipment</SelectItem>
                      <SelectItem value="Material Handling">Material Handling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Serial Number</Label>
                  <Input defaultValue="CNC-850-2026-0249" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Acquisition Cost (₹)</Label>
                  <Input defaultValue="2800000" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Useful Life (Years)</Label>
                  <Input defaultValue="10" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Department</Label>
                  <Input defaultValue="Production" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Location</Label>
                  <Input defaultValue="Plant 01 → Machine Shop" className="h-8 text-xs" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsNewAssetOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Register Asset
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: STAGE ADVANCE / LIFECYCLE TRACKER
           ==================================================================== */}
        <Dialog open={isStageAdvanceOpen} onOpenChange={setIsStageAdvanceOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Asset Lifecycle Stages &mdash; {activeAsset.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {activeAsset.name} &bull; Current Stage: {activeAsset.stage}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs pt-1">
              <div className="p-3 bg-muted/20 rounded-lg border space-y-2">
                <div className="grid grid-cols-6 gap-1 text-center font-semibold text-[10px]">
                  <div className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Acquire</div>
                  <div className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Register</div>
                  <div className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Capitalize</div>
                  <div className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Tag</div>
                  <div className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Assign</div>
                  <div className="p-1.5 rounded bg-blue-600 text-white font-bold">● Use (Active)</div>
                </div>

                <div className="grid grid-cols-6 gap-1 text-center font-semibold text-[10px] text-muted-foreground pt-1">
                  <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border">Maintain</div>
                  <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border">Depreciate</div>
                  <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border">Verify</div>
                  <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border">Transfer</div>
                  <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border">Revalue</div>
                  <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border">Dispose</div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Current Net Book Value:</span>
                <span className="font-mono font-bold text-primary text-sm">₹ {activeAsset.nbv}</span>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsStageAdvanceOpen(false)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsStageAdvanceOpen(false);
                    toast.success(`Asset ${activeAsset.id} stage updated!`);
                  }}
                  className="bg-[#0B3B7B] text-white"
                >
                  Advance Stage
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: PHYSICAL VERIFICATION
           ==================================================================== */}
        <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Asset Physical Verification &mdash; {activeAsset.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Scan QR or match serial number at location.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-muted/20 border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Serial Number:</span>
                  <span className="font-mono text-emerald-600 font-bold">✓ MATCH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset Tag:</span>
                  <span className="font-mono text-emerald-600 font-bold">✓ MATCH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Physical Location:</span>
                  <span className="font-mono text-emerald-600 font-bold">✓ MATCH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custodian:</span>
                  <span className="font-mono text-emerald-600 font-bold">✓ MATCH</span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsVerifyOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsVerifyOpen(false);
                    toast.success(`Asset ${activeAsset.id} physically verified!`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirm Verification
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default AssetLifecycleFormPage;

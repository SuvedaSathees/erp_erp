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
  Building2,
  CheckCircle,
  Coins,
  Clock,
  Landmark,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Play,
  ChevronDown,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  QrCode,
  Printer,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/asset-management/asset-depreciation")({
  head: () => ({
    meta: [
      { title: "Asset Depreciation Form · Magnertia ERP" },
      {
        name: "description",
        content: "Manage depreciation lifecycle from capitalization to accounting closure.",
      },
    ],
  }),
  component: AssetDepreciationFormPage,
});

interface DepreciationItem {
  id: string;
  name: string;
  category: string;
  method: "Straight Line" | "Diminishing" | "Written Down Value";
  capCost: string;
  cost?: string;
  grossValue?: string;
  accumDep: string;
  nbv: string;
  rate?: string;
  usefulLife: string;
  status: "Active" | "Suspended" | "Fully Dep." | "Draft";
  nextRun: string;
  capDate: string;
  depStartDate: string;
  residualVal: string;
}

const BASE_DEP_TEMPLATES = [
  { name: "CNC VMC-850", category: "Production Machinery", method: "Straight Line" as const, cap: 3000000, acc: 540000, life: "10 Years", res: 0 },
  { name: "Air Compressor 75kW", category: "Utility Equipment", method: "Straight Line" as const, cap: 600000, acc: 120000, life: "7 Years", res: 50000 },
  { name: "Forklift 3 Ton", category: "Material Handling", method: "Diminishing" as const, cap: 450000, acc: 90000, life: "5 Years", res: 25000 },
  { name: "Generator 125kVA", category: "Power Equipment", method: "Straight Line" as const, cap: 1200000, acc: 360000, life: "10 Years", res: 100000 },
  { name: "EV Charger 60kW", category: "EV Infrastructure", method: "Straight Line" as const, cap: 290000, acc: 72500, life: "7 Years", res: 20000 },
  { name: "Chiller Unit 50TR", category: "HVAC Equipment", method: "Straight Line" as const, cap: 570000, acc: 171000, life: "10 Years", res: 40000 },
  { name: "Hydraulic Press 200T", category: "Press Machinery", method: "Straight Line" as const, cap: 420000, acc: 84000, life: "10 Years", res: 30000 },
  { name: "Old Lathe Machine", category: "Machinery", method: "Straight Line" as const, cap: 25000, acc: 25000, life: "5 Years", res: 0 },
  { name: "Laser Cutting Machine 6kW", category: "Production Machinery", method: "Straight Line" as const, cap: 3600000, acc: 360000, life: "10 Years", res: 200000 },
  { name: "Substation Transformer 11kV", category: "Power Equipment", method: "Straight Line" as const, cap: 1800000, acc: 270000, life: "15 Years", res: 100000 },
];

const INITIAL_DEPRECIATION_ITEMS: DepreciationItem[] = Array.from({ length: 428 }, (_, i) => {
  const tpl = BASE_DEP_TEMPLATES[i % BASE_DEP_TEMPLATES.length];
  const numStr = String(i + 1).padStart(5, "0");
  const costScale = 1 + ((i * 11) % 30) / 100;
  const capVal = Math.round(tpl.cap * costScale);
  const accVal = tpl.acc === tpl.cap ? capVal : Math.min(capVal, Math.round(tpl.acc * costScale));
  const nbvVal = capVal - accVal;
  const status: "Active" | "Suspended" | "Fully Dep." | "Draft" =
    nbvVal <= 0 ? "Fully Dep." :
    i % 17 === 0 ? "Suspended" :
    i % 23 === 0 ? "Draft" : "Active";

  return {
    id: `FA-PLT-${numStr}`,
    name: i < BASE_DEP_TEMPLATES.length ? tpl.name : `${tpl.name} #${Math.floor(i / BASE_DEP_TEMPLATES.length) + 1}`,
    category: tpl.category,
    method: tpl.method,
    capCost: capVal.toLocaleString(),
    cost: capVal.toLocaleString(),
    grossValue: capVal.toLocaleString(),
    accumDep: accVal.toLocaleString(),
    nbv: nbvVal.toLocaleString(),
    rate: "10% p.a.",
    usefulLife: tpl.life,
    status,
    nextRun: status === "Active" ? "31-Oct-2026" : "-",
    capDate: `${((i * 3) % 28) + 1} Sep 2026`,
    depStartDate: "01 Sep 2026",
    residualVal: `₹ ${tpl.res.toLocaleString()}`,
  };
});

export function AssetDepreciationFormPage() {
  const [items, setItems] = useState<DepreciationItem[]>(INITIAL_DEPRECIATION_ITEMS);
  const [activeItem, setActiveItem] = useState<DepreciationItem>(INITIAL_DEPRECIATION_ITEMS[0]);
  const [selectedFilter, setSelectedFilter] = useState("All 428");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["Depreciation ID", "Asset Name", "Category", "Method", "Cost", "Dep. Rate", "Accum. Dep.", "Current NBV", "Status"];
    const rows = items.map(i => [
      i.id,
      `"${i.name}"`,
      `"${i.category}"`,
      `"${i.method}"`,
      `"${i.cost || i.capCost}"`,
      i.rate || "10% p.a.",
      `"${i.accumDep}"`,
      `"${i.nbv}"`,
      i.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Asset_Depreciation_Register_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Asset Depreciation Register exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Net Book Values and depreciation schedules synchronized!");
    }, 600);
  };

  // Modals
  const [isRunDepOpen, setIsRunDepOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.method.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All 428") return matchSearch;
      if (selectedFilter === "Depreciating 396") return matchSearch && item.status === "Active";
      if (selectedFilter === "Fully Depreciated 32") return matchSearch && item.status === "Fully Dep.";
      if (selectedFilter === "Suspended 4") return matchSearch && item.status === "Suspended";
      if (selectedFilter === "Pending Setup 18") return matchSearch && item.status === "Draft";
      return matchSearch;
    });
  }, [items, searchQuery, selectedFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Paginated Items
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  return (
    <AppShell
      title="Asset Depreciation Form"
      breadcrumb="Management > Asset Management > Asset Depreciation"
      description="Manage depreciation lifecycle from capitalization to accounting closure."
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
                Asset Depreciation Form
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; Financial depreciation schedules, accumulated depreciation, NBV and general ledger postings
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
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported Depreciation Register (.xlsx)"); }}>
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
                  <DropdownMenuItem onClick={() => toast.info("Opening Asset Depreciation Register...")}>
                    Depreciation Schedule
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Depreciation by Asset Class...")}>
                    Asset Class Breakdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Impairment & Revaluation Audit...")}>
                    Impairment & Revaluation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + Run Depreciation Primary Button */}
              <Button
                onClick={() => setIsRunDepOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Run Depreciation</span>
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
                  <DropdownMenuItem onClick={() => setIsSetupOpen(true)}>
                    New Depreciation Setup
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsJournalOpen(true)}>
                    View Depreciation Journal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Useful Life Review initiated")}>
                    Useful Life Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print JV Journal Slips
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
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">428</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All Assets</span>
            </div>
          </div>

          {/* Card 2: Depreciating Assets */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Depreciating Assets</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">396</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                92.5% of Total
              </span>
            </div>
          </div>

          {/* Card 3: Fully Depreciated */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Fully Depreciated</span>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-purple-600">32</span>
              <span className="block text-[10px] text-purple-700 dark:text-purple-400 font-medium">
                7.5% of Total
              </span>
            </div>
          </div>

          {/* Card 4: Monthly Depreciation */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Monthly Depreciation</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">₹ 23.45 L</span>
              <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                This Month
              </span>
            </div>
          </div>

          {/* Card 5: Accumulated Depreciation */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Accumulated Depreciation</span>
              <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-rose-600">₹ 5.40 Cr</span>
              <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                Total till Date
              </span>
            </div>
          </div>

          {/* Card 6: Current NBV */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Current NBV</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Landmark className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">₹ 13.20 Cr</span>
              <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                Net Book Value
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           3. MIDDLE SECTION (4 CARDS: Status Donut, Value Bars, Trend Line, Upcoming)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Depreciation Status */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Depreciation Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* Active (Depreciating): 92.5% */}
                  <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  {/* Fully Depreciated: 7.5% */}
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="220" />
                  {/* Suspended: 0.9% */}
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="234" />
                  {/* Pending Setup: 4.2% */}
                  <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="236" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">428</span>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Total Assets</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[10.5px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-blue-600" /> Active (Depreciating)
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">396 (92.5%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" /> Fully Depreciated
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">32 (7.5%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-amber-500" /> Suspended
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">4 (0.9%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-purple-500" /> Pending Setup
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">18 (4.2%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Asset Value Overview */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Asset Value Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
              <div className="h-44 flex items-end justify-between gap-3 px-2 pt-4 pb-2 border-b border-border/40">
                {/* Gross Value: 18.60 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold font-mono text-blue-600">18.60</span>
                  <div className="w-full bg-blue-600 rounded-t-sm" style={{ height: "130px" }} />
                  <span className="text-[9px] text-muted-foreground font-medium mt-1 truncate">Gross Value</span>
                </div>
                {/* Accum. Depreciation: 5.40 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold font-mono text-emerald-600">5.40</span>
                  <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: "45px" }} />
                  <span className="text-[9px] text-muted-foreground font-medium mt-1 truncate">Accum. Dep.</span>
                </div>
                {/* Net Book: 13.20 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold font-mono text-amber-600">13.20</span>
                  <div className="w-full bg-amber-500 rounded-t-sm" style={{ height: "92px" }} />
                  <span className="text-[9px] text-muted-foreground font-medium mt-1 truncate">Net Book</span>
                </div>
                {/* Maintenance Cost: 2.10 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold font-mono text-purple-600">2.10</span>
                  <div className="w-full bg-purple-500 rounded-t-sm" style={{ height: "20px" }} />
                  <span className="text-[9px] text-muted-foreground font-medium mt-1 truncate">Maint. Cost</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1.5">
                <span>Amount (₹ Cr)</span>
                <span className="font-mono">Total Capitalized: ₹ 18.60 Cr</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Depreciation Trend (Last 6 Months) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Depreciation Trend (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="h-44 w-full pt-2">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 100">
                  <line x1="15" y1="20" x2="225" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="45" x2="225" y2="45" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="70" x2="225" y2="70" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="95" x2="225" y2="95" stroke="currentColor" strokeOpacity="0.08" />

                  <polyline
                    points="25,55 65,52 105,48 145,44 185,40 220,38"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {[
                    { x: 25, y: 55, val: "22.10" },
                    { x: 65, y: 52, val: "22.40" },
                    { x: 105, y: 48, val: "22.80" },
                    { x: 145, y: 44, val: "23.00" },
                    { x: 185, y: 40, val: "23.20" },
                    { x: 220, y: 38, val: "23.45" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="3" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                      <text x={pt.x} y={pt.y - 6} fontSize="8" fontWeight="bold" textAnchor="middle" fill="#2563eb">
                        {pt.val}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-muted-foreground px-2 border-t border-border/40 pt-1">
                <span>Apr 26</span>
                <span>May 26</span>
                <span>Jun 26</span>
                <span>Jul 26</span>
                <span>Aug 26</span>
                <span>Sep 26</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Upcoming Activities */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upcoming Activities
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening master asset depreciation calendar")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View Calendar &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5">
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" /> Assets for Depreciation Run
                  </span>
                  <Badge variant="outline" className="font-mono bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                    396
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Settings className="h-3.5 w-3.5 text-amber-600" /> Depreciation Setup Pending
                  </span>
                  <Badge variant="outline" className="font-mono bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                    18
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <RefreshCw className="h-3.5 w-3.5 text-emerald-600" /> Useful Life Review
                  </span>
                  <Badge variant="outline" className="font-mono bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    6
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-600" /> Revaluation Due
                  </span>
                  <Badge variant="outline" className="font-mono bg-teal-50 text-teal-700 border-teal-200 text-[10px]">
                    4
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Impairment Review
                  </span>
                  <Badge variant="outline" className="font-mono bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                    3
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Trash2 className="h-3.5 w-3.5 text-rose-600" /> Assets for Disposal
                  </span>
                  <Badge variant="outline" className="font-mono bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                    7
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. DEPRECIATION REGISTER TABLE (Full Width Master Box - Zero Side Scrolling)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Depreciation Register
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredItems.length} assets
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
                    onClick={() => toast.info("Displaying all 11 depreciation columns")}
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
                {["All 428", "Depreciating 396", "Fully Depreciated 32", "Suspended 4", "Pending Setup 18"].map((filter) => (
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
                    <th className="p-3">Method</th>
                    <th className="p-3 text-center">Useful Life</th>
                    <th className="p-3 font-mono">Capitalization Date</th>
                    <th className="p-3 font-mono text-right">Gross Value (₹)</th>
                    <th className="p-3 font-mono text-right">Accum. Dep (₹)</th>
                    <th className="p-3 font-mono text-right">Net Book Value (₹)</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-muted-foreground">
                        No depreciation records match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setActiveItem(item)}
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          activeItem.id === item.id ? "bg-primary/5 dark:bg-primary/10" : ""
                        )}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px]">
                          {item.id}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{item.name}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              Next: {item.nextRun}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {item.category}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {item.method}
                        </td>
                        <td className="p-3 text-center font-mono">
                          {item.usefulLife}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {item.capDate}
                        </td>
                        <td className="p-3 font-mono font-semibold text-right text-slate-900 dark:text-white">
                          ₹ {item.grossValue}
                        </td>
                        <td className="p-3 font-mono text-right text-rose-600 font-medium">
                          ₹ {item.accumDep}
                        </td>
                        <td className="p-3 font-mono font-bold text-right text-primary">
                          ₹ {item.nbv}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              item.status === "Depreciating"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.status === "Fully Depreciated"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : item.status === "Pending Setup"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveItem(item);
                                setIsJournalOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="Journal Entries"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveItem(item);
                                setIsSetupOpen(true);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Depreciation Setup"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
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
              totalEntries={filteredItems.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              entityName="depreciation records"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. ASSET DEPRECIATION DETAILS & FINANCIAL SUMMARY (Full Width 2-Column Grid)
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* Card 1: Asset Depreciation Details */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Asset Details: <span className="font-mono text-primary">{activeItem.id}</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                  {activeItem.status}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setIsSetupOpen(true)}
                  className="p-1 rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  title="Edit Setup"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toast.info(`Asset Tag QR: ${activeItem.id}`)}
                  className="p-1 rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  title="QR Tag"
                >
                  <QrCode className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1 rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  title="Print Schedule"
                >
                  <Printer className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Dynamic Category Vector Illustration */}
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl border flex items-center justify-center p-2 relative overflow-hidden">
                  <AssetVisual category={activeItem.category} assetId={activeItem.id} className="h-24 w-auto drop-shadow-md" />
                  <div className="absolute bottom-1.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    {activeItem.id}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {activeItem.id}
                  </h3>
                  <span className="text-muted-foreground text-xs font-semibold block">
                    {activeItem.name}
                  </span>
                  <div className="pt-2 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-semibold">{activeItem.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="font-medium">{activeItem.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Useful Life:</span>
                      <span className="font-mono">{activeItem.usefulLife}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attributes List */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border/40">
                <div className="p-2.5 bg-muted/20 rounded-lg border border-border/40 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cap. Date:</span>
                    <span className="font-mono">{activeItem.capDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Residual Val:</span>
                    <span className="font-mono">{activeItem.residualVal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dep Start:</span>
                    <span className="font-mono">{activeItem.depStartDate}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-muted/20 rounded-lg border border-border/40 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accum. Dep:</span>
                    <span className="font-mono font-bold text-rose-600">₹ {activeItem.accumDep}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current NBV:</span>
                    <span className="font-mono font-bold text-primary">₹ {activeItem.nbv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Run:</span>
                    <span className="font-mono text-amber-600">{activeItem.nextRun}</span>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => setIsJournalOpen(true)}
                className="w-full text-xs bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer"
              >
                View General Ledger Entries & Schedule Details &rarr;
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Quick Cost View */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Depreciation & Cost Analysis
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono font-bold">
                FY 2026-27
              </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="space-y-2 text-[11.5px]">
                <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Gross Capital Asset Base</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 18.60 Cr</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Accumulated Depreciation Reserve</span>
                  <span className="font-mono font-bold text-rose-600">₹ 5.40 Cr</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Net Carrying Book Value</span>
                  <span className="font-mono font-bold text-emerald-600">₹ 13.20 Cr</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 font-bold text-slate-900 dark:text-white">
                  <span className="text-primary">Annual Depreciation Expense (P&amp;L)</span>
                  <span className="font-mono text-primary text-sm">₹ 1.86 Cr</span>
                </div>
              </div>

              <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Act Compliance:</span>
                  <span className="font-medium text-emerald-600">Income Tax Rule 5 (Compliant)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Companies Act 2013:</span>
                  <span className="font-medium">Schedule II Useful Lives</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Closing Run:</span>
                  <span className="font-mono font-bold text-amber-600">30 Sep 2026 (Monthly)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           5. BOTTOM 4 CARDS (By Asset Class, Calendar, Summary YTD, AI Insights)
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Depreciation by Asset Class */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Depreciation by Asset Class
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" stroke="#38bdf8" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="185.3" />
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="206.8" />
                  <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="227.1" />
                  <circle cx="50" cy="50" r="38" stroke="#f43f5e" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="234.9" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">₹ 23.45 L</span>
                  <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">This Month</span>
                </div>
              </div>

              <div className="space-y-0.5 text-[9.5px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Production Machinery</span>
                  <span className="font-mono font-bold">₹ 18.20 L (77.6%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Utility Equipment</span>
                  <span className="font-mono font-bold">₹ 2.10 L (9.0%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Vehicles</span>
                  <span className="font-mono font-bold">₹ 2.00 L (8.5%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> IT Equipment</span>
                  <span className="font-mono font-bold">₹ 1.80 L (7.7%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Facilities</span>
                  <span className="font-mono font-bold">₹ 1.35 L (5.8%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Depreciation Calendar */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Depreciation Calendar
              </CardTitle>
              <span className="text-[10px] font-mono font-bold text-primary">September 2026</span>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1 text-center">
              <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-muted-foreground pb-1">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-[9.5px] font-mono">
                <span className="text-muted-foreground/40">31</span>
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                <span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span>
                <span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span>
                <span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span>
                <span>28</span><span>29</span>
                <span className="bg-[#0B3B7B] text-white rounded-full font-bold">30</span>
              </div>
              <div className="flex justify-between text-[8px] text-muted-foreground pt-1 border-t border-border/40">
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Dep. Run</span>
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Revaluation</span>
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Impairment</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Depreciation Summary (YTD) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Depreciation Summary (YTD)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[10.5px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">YTD Depreciation</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 1.98 Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Average</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 23.21 L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Depreciation Rate</span>
                <span className="font-bold">29.03% of Gross Value</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assets Completed</span>
                <span className="font-mono font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assets In Progress</span>
                <span className="font-mono font-bold text-emerald-600">396</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assets Suspended</span>
                <span className="font-mono font-bold text-amber-600">4</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: AI Depreciation Insights */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                AI Depreciation Insights
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening AI depreciation insights")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[9.5px]">
              <div className="flex items-start gap-1">
                <span className="text-amber-500">⚠️</span>
                <span>6 assets require useful-life review.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-rose-600">🔴</span>
                <span>7 assets are approaching end of life.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">🟠</span>
                <span>4 assets show potential impairment indicators.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-blue-500">ℹ️</span>
                <span>18 assets have incomplete depreciation setup.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-emerald-500">🟢</span>
                <span>Overall depreciation accuracy is 98.6%.</span>
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
           MODAL 1: NEW DEPRECIATION SETUP
           ==================================================================== */}
        <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>New Asset Depreciation Setup</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  DRAFT
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure capitalization base, depreciation method, useful life, and accounting GL accounts.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSetupOpen(false);
                toast.success("Depreciation setup activated for asset!");
              }}
              className="space-y-3 text-xs pt-1"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset ID *</Label>
                  <Input defaultValue="FA-PLT-00241" required className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset Name</Label>
                  <Input defaultValue="CNC VMC-850" className="h-8 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Capitalization Date</Label>
                  <Input defaultValue="01-Sep-2026" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Capitalized Cost (₹)</Label>
                  <Input defaultValue="30,00,000" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Depreciation Method</Label>
                  <Select defaultValue="Straight Line">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Straight Line">Straight Line</SelectItem>
                      <SelectItem value="Diminishing">Diminishing Balance</SelectItem>
                      <SelectItem value="WDV">Written Down Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Useful Life (Years)</Label>
                  <Input defaultValue="10" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Residual Value (₹)</Label>
                  <Input defaultValue="0" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Depreciation Expense Account</Label>
                  <Input defaultValue="7010 - Depreciation Expense – Machinery" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Accumulated Depreciation Account</Label>
                  <Input defaultValue="1810 - Accumulated Depreciation – Machinery" className="h-8 text-xs" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsSetupOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Activate Depreciation
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: RUN DEPRECIATION
           ==================================================================== */}
        <Dialog open={isRunDepOpen} onOpenChange={setIsRunDepOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Run Monthly Depreciation &mdash; September 2026
              </DialogTitle>
              <DialogDescription className="text-xs">
                Process monthly depreciation run across active asset register.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-3 bg-muted/20 rounded-lg border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period:</span>
                  <span className="font-bold">September 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assets to Process:</span>
                  <span className="font-mono font-bold">396 Assets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Depreciation:</span>
                  <span className="font-mono font-bold text-primary">₹ 23,45,000</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 text-[11px] space-y-1">
                <p>✓ Capitalization dates validated</p>
                <p>✓ Useful life and residual values verified</p>
                <p>✓ GL Journal accounts linked</p>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsRunDepOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsRunDepOpen(false);
                    toast.success("Depreciation run completed! Journal JV-DEP-2026-09-001 posted.");
                  }}
                  className="bg-[#0B3B7B] text-white"
                >
                  Post Depreciation Journal
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: DEPRECIATION JOURNAL
           ==================================================================== */}
        <Dialog open={isJournalOpen} onOpenChange={setIsJournalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Depreciation Journal &mdash; JV-DEP-2026-09-001
              </DialogTitle>
              <DialogDescription className="text-xs">
                Posting Date: 30-Sep-2026 &bull; Total Amount: ₹ 23,45,000
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 font-semibold text-[10.5px]">
                    <tr className="border-b">
                      <th className="p-2">GL Account</th>
                      <th className="p-2 text-right">Debit (₹)</th>
                      <th className="p-2 text-right">Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                    <tr>
                      <td className="p-2 font-sans font-medium">Depreciation Expense – Machinery</td>
                      <td className="p-2 text-right">18,20,000</td>
                      <td className="p-2 text-right">-</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium">Depreciation Expense – Vehicles</td>
                      <td className="p-2 text-right">2,10,000</td>
                      <td className="p-2 text-right">-</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium">Accumulated Dep. – Machinery</td>
                      <td className="p-2 text-right">-</td>
                      <td className="p-2 text-right">18,20,000</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium">Accumulated Dep. – Vehicles</td>
                      <td className="p-2 text-right">-</td>
                      <td className="p-2 text-right">2,10,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setIsJournalOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default AssetDepreciationFormPage;
